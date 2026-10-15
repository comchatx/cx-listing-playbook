import { spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { afterEach, expect, it } from "vitest";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const SCRIPT = join(ROOT, "skills", "listing-review", "scripts", "report.sh");
const STUB = join(ROOT, "test", "stub");
const TYPE = "STUB_REPORT";
const ASK = ["--origin", "https://sellingpartnerapi-na.amazon.com", "--marketplace", "ATVPDKIKX0DER", "--start", "2026-10-04T00:00:00Z", "--end", "2026-10-10T23:59:59Z"];
const DOCUMENT = "sku\tasin\tstatus\n<SKU>\t<ASIN>\tActive\n";

const scratches: string[] = [];
afterEach(() => { for (const scratch of scratches.splice(0)) rmSync(scratch, { recursive: true, force: true }); });

/** A scenario for the stub `cx`: Amazon's replies in order, and a tree for the script to land in. */
function world(options: { readonly statuses: readonly string[]; readonly reports?: readonly object[]; readonly gzip?: boolean; readonly failOn?: readonly number[] }) {
  const root = mkdtempSync(join(tmpdir(), "report-sh-"));
  scratches.push(root);
  const stub = join(root, "stub");
  const tree = join(root, "tenant");
  mkdirSync(stub);
  mkdirSync(tree);
  chmodSync(join(STUB, "cx"), 0o755);
  const download = join(root, options.gzip === false ? "document.tsv" : "document.tsv.gz");
  writeFileSync(download, options.gzip === false ? DOCUMENT : gzipSync(DOCUMENT));
  writeFileSync(join(stub, "statuses"), `${options.statuses.join("\n")}\n`);
  writeFileSync(join(stub, "create.json"), JSON.stringify({ reportId: "50001" }));
  writeFileSync(join(stub, "reports.json"), JSON.stringify({ reports: options.reports ?? [] }));
  writeFileSync(join(stub, "document.json"), JSON.stringify({ reportDocumentId: "amzn1.spdoc.1.4.na.STUB", url: `file://${download}`, ...(options.gzip === false ? {} : { compressionAlgorithm: "GZIP" }) }));
  writeFileSync(join(stub, "calls.log"), "");
  for (const n of options.failOn ?? []) writeFileSync(join(stub, `fail-${n}`), "");
  const run = (...args: string[]) => {
    const done = spawnSync("bash", [SCRIPT, TYPE, ...ASK, ...args], { encoding: "utf8", env: { ...process.env, PATH: `${STUB}:${process.env["PATH"]}`, STUB: stub, TENANT_TREE: tree } });
    return { exit: done.status, out: done.stdout.trim(), err: done.stderr.trim() };
  };
  const calls = () => readFileSync(join(stub, "calls.log"), "utf8").trim().split("\n").filter(Boolean);
  const askDir = () => { const parent = join(tree, "reports", TYPE); return join(parent, readdirSync(parent)[0]!); };
  const receipt = () => JSON.parse(readFileSync(join(askDir(), "receipt.json"), "utf8")) as Record<string, unknown>;
  return { run, calls, askDir, receipt, tree };
}

it("creates, polls to DONE, lands the decompressed document beside a receipt with the report id and Amazon's status, and never prints the link", () => {
  const w = world({ statuses: ["IN_QUEUE", "IN_PROGRESS", "DONE"] });
  const got = w.run("--wait", "10", "--every", "1");
  expect(got.exit).toBe(0);
  expect(w.calls()).toEqual([
    "GET /reports/2021-06-30/reports reportTypes=STUB_REPORT marketplaceIds=ATVPDKIKX0DER processingStatuses=IN_QUEUE,IN_PROGRESS,DONE",
    "POST /reports/2021-06-30/reports",
    "GET /reports/2021-06-30/reports/50001",
    "GET /reports/2021-06-30/reports/50001",
    "GET /reports/2021-06-30/reports/50001",
    "GET /reports/2021-06-30/documents/amzn1.spdoc.1.4.na.STUB",
  ]);
  expect(readFileSync(join(w.askDir(), "document.txt"), "utf8")).toBe(DOCUMENT);
  expect(w.receipt()).toMatchObject({ reportId: "50001", processingStatus: "DONE", source: "createReport", document: "document.txt", compressionAlgorithm: "GZIP", ask: { reportType: TYPE, marketplaceIds: ["ATVPDKIKX0DER"] } });
  expect(got.out).toBe(`DONE 50001 ${join(w.askDir(), "document.txt")}`);
  expect(JSON.parse(readFileSync(join(w.askDir(), "create-body.json"), "utf8"))).toEqual({ reportType: TYPE, marketplaceIds: ["ATVPDKIKX0DER"], dataStartTime: "2026-10-04T00:00:00Z", dataEndTime: "2026-10-10T23:59:59Z" });
  expect(`${got.out}${got.err}${readFileSync(join(w.askDir(), "document.json"), "utf8")}`).not.toContain("file://");
});

it("a landed report of the same ask is read again with no call to Amazon", () => {
  const w = world({ statuses: ["DONE"] });
  expect(w.run("--wait", "0").exit).toBe(0);
  const before = w.calls().length;
  const again = w.run("--wait", "0");
  expect(again.exit).toBe(0);
  expect(again.out).toBe(`DONE 50001 ${join(w.askDir(), "document.txt")}`);
  expect(w.calls()).toHaveLength(before);
});

it("one wait: at the ceiling a queued report ends the run with its id and status, and the next run resumes that id instead of creating", () => {
  const w = world({ statuses: ["IN_QUEUE", "IN_QUEUE", "DONE"] });
  const first = w.run("--wait", "0");
  expect(first.exit).toBe(3);
  expect(first.out).toBe(`IN_QUEUE 50001 since 2026-10-14T00:00:00+00:00 ${join(w.askDir(), "receipt.json")}`);
  expect(w.receipt()).toMatchObject({ reportId: "50001", processingStatus: "IN_QUEUE" });
  const second = w.run("--wait", "5", "--every", "1");
  expect(second.exit).toBe(0);
  expect(w.calls().filter((call) => call.startsWith("POST"))).toHaveLength(1);
  expect(w.calls().filter((call) => call.startsWith("GET /reports/2021-06-30/reports reportTypes"))).toHaveLength(1);
});

it("a matching report from getReports is used instead of creating one; another range or store is not", () => {
  const match = { reportId: "40001", reportType: TYPE, processingStatus: "DONE", marketplaceIds: ["ATVPDKIKX0DER"], dataStartTime: "2026-10-04T00:00:00+00:00", dataEndTime: "2026-10-10T23:59:59+00:00" };
  const w = world({ statuses: ["DONE"], reports: [{ ...match, reportId: "40002", dataStartTime: "2026-09-27T00:00:00+00:00" }, { ...match, reportId: "40003", marketplaceIds: ["A2EUQ1WTGCTBG2"] }, match], gzip: false });
  expect(w.run("--wait", "0").exit).toBe(0);
  expect(w.calls().filter((call) => call.startsWith("POST"))).toEqual([]);
  expect(w.calls()).toContain("GET /reports/2021-06-30/reports/40001");
  expect(w.receipt()).toMatchObject({ reportId: "40001", source: "getReports", compressionAlgorithm: null });
});

it("an ask with report options creates without getReports, and the options go in the body", () => {
  const w = world({ statuses: ["DONE"] });
  expect(w.run("--option", "reportPeriod=WEEK", "--option", "asin=<ASIN>", "--wait", "0").exit).toBe(0);
  expect(w.calls()[0]).toBe("POST /reports/2021-06-30/reports");
  expect(JSON.parse(readFileSync(join(w.askDir(), "create-body.json"), "utf8"))).toMatchObject({ reportOptions: { reportPeriod: "WEEK", asin: "<ASIN>" } });
});

it("CANCELLED ends with no document; FATAL's document lands as Amazon's explanation, not as the report", () => {
  const cancelled = world({ statuses: ["CANCELLED"] });
  expect(cancelled.run("--wait", "0")).toMatchObject({ exit: 0, out: "CANCELLED 50001" });
  expect(existsSync(join(cancelled.askDir(), "document.txt"))).toBe(false);
  const fatal = world({ statuses: ["FATAL"], gzip: false });
  expect(fatal.run("--wait", "0").exit).toBe(0);
  expect(fatal.receipt()).toMatchObject({ processingStatus: "FATAL", document: "fatal-explanation.txt" });
  expect(existsSync(join(fatal.askDir(), "document.txt"))).toBe(false);
});

it("a call cx reports as failed (a 429) ends the run at once: no retry, no limiter, Amazon's words kept", () => {
  const w = world({ statuses: ["IN_QUEUE", "DONE"], failOn: [3] });
  const got = w.run("--wait", "5", "--every", "1");
  expect(got.exit).toBe(1);
  expect(w.calls()).toHaveLength(3);
  expect(got.out).toContain("http_status\":429");
  expect(readFileSync(join(w.askDir(), "report-1.json"), "utf8")).toContain("QuotaExceeded");
  const resumed = w.run("--wait", "5", "--every", "1");
  expect(resumed.exit).toBe(0);
  expect(w.calls().filter((call) => call.startsWith("POST"))).toHaveLength(1);
});

it("refuses an ask without the origin, the store or the wait, before any call", () => {
  const root = mkdtempSync(join(tmpdir(), "report-sh-"));
  scratches.push(root);
  const done = spawnSync("bash", [SCRIPT, TYPE, "--marketplace", "ATVPDKIKX0DER"], { encoding: "utf8", env: { ...process.env, PATH: `${dirname(SCRIPT)}:${process.env["PATH"]}`, TENANT_TREE: root } });
  expect(done.status).toBe(2);
  expect(done.stderr).toContain("report.sh <reportType>");
  expect(readdirSync(root)).toEqual([]);
});
