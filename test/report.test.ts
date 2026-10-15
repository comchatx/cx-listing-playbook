import { spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { afterEach, expect, it } from "vitest";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const SCRIPT = join(ROOT, "skills", "listing-review", "scripts", "report.sh");
const STUB = join(ROOT, "test", "stub");
const TYPE = "STUB_REPORT";
const ASK = ["--origin", "https://sellingpartnerapi-na.amazon.com", "--marketplace", "ATVPDKIKX0DER", "--start", "2026-10-04T00:00:00Z", "--end", "2026-10-10T23:59:59Z"];
const DOCUMENT = "sku\tasin\tstatus\n<SKU>\t<ASIN>\tActive\n";
const JSON_DOCUMENT = '{"reportSpecification":{"reportType":"GET_SALES_AND_TRAFFIC_REPORT"},"salesAndTrafficByAsin":[]}\n';

const scratches: string[] = [];
afterEach(() => { for (const scratch of scratches.splice(0)) rmSync(scratch, { recursive: true, force: true }); });

/** A scenario for the stub `cx`: Amazon's replies in order, and a tree for the script to land in. */
function world(options: { readonly statuses: readonly string[]; readonly reports?: readonly object[]; readonly gzip?: boolean; readonly document?: string; readonly failOn?: readonly number[]; readonly refuseOn?: readonly number[]; readonly cutDocument?: boolean }) {
  const root = mkdtempSync(join(tmpdir(), "report-sh-"));
  scratches.push(root);
  const stub = join(root, "stub");
  const tree = join(root, "tenant");
  mkdirSync(stub);
  mkdirSync(tree);
  for (const tool of ["cx", "curl"]) chmodSync(join(STUB, tool), 0o755);
  const download = join(root, options.gzip === false ? "document.tsv" : "document.tsv.gz");
  const document = options.document ?? DOCUMENT;
  writeFileSync(download, options.gzip === false ? document : gzipSync(document));
  writeFileSync(join(stub, "statuses"), `${options.statuses.join("\n")}\n`);
  writeFileSync(join(stub, "create.json"), JSON.stringify({ reportId: "50001" }));
  writeFileSync(join(stub, "reports.json"), JSON.stringify({ reports: options.reports ?? [] }));
  writeFileSync(join(stub, "document.json"), JSON.stringify({ reportDocumentId: "amzn1.spdoc.1.4.na.STUB", url: `file://${download}`, ...(options.gzip === false ? {} : { compressionAlgorithm: "GZIP" }) }));
  writeFileSync(join(stub, "calls.log"), "");
  for (const n of options.failOn ?? []) writeFileSync(join(stub, `fail-${n}`), "");
  for (const n of options.refuseOn ?? []) writeFileSync(join(stub, `refuse-${n}`), "");
  if (options.cutDocument === true) writeFileSync(join(stub, "cut-document"), "");
  const runAs = (type: string, ...args: string[]) => {
    const done = spawnSync("bash", [SCRIPT, type, ...ASK, ...args], { encoding: "utf8", timeout: 20_000, env: { ...process.env, PATH: `${STUB}:${process.env["PATH"]}`, STUB: stub, TENANT_TREE: tree } });
    return { exit: done.status, out: done.stdout.trim(), err: done.stderr.trim() };
  };
  const run = (...args: string[]) => runAs(TYPE, ...args);
  const calls = () => readFileSync(join(stub, "calls.log"), "utf8").trim().split("\n").filter(Boolean);
  const askDir = () => { const parent = join(tree, "reports", TYPE); return join(parent, readdirSync(parent)[0]!); };
  const receipt = () => JSON.parse(readFileSync(join(askDir(), "receipt.json"), "utf8")) as Record<string, unknown>;
  const link = `file://${download}`;
  /** Every file under the tree that holds the document's link. */
  const holdingLink = () => (readdirSync(tree, { recursive: true }) as string[]).map((file) => join(tree, file)).filter((file) => statSync(file).isFile() && readFileSync(file, "utf8").includes(link));
  /** Everything under the scenario's root, the stub's own files and the tree alike. */
  const listing = () => (readdirSync(root, { recursive: true }) as string[]).map((file) => file.split(sep).join("/")).sort();
  return { run, runAs, calls, askDir, receipt, tree, stub, download, link, holdingLink, listing };
}

it("creates, polls to DONE, lands the decompressed document beside a receipt with the report id and Amazon's status, and never prints the link", () => {
  const w = world({ statuses: ["IN_QUEUE", "IN_PROGRESS", "DONE"] });
  const got = w.run("--wait", "10", "--every", "1");
  expect(got.exit).toBe(0);
  expect(w.calls()).toEqual([
    "POST /reports/2021-06-30/reports",
    "GET /reports/2021-06-30/reports/50001",
    "GET /reports/2021-06-30/reports/50001",
    "GET /reports/2021-06-30/reports/50001",
    "GET /reports/2021-06-30/documents/amzn1.spdoc.1.4.na.STUB",
    "DOWNLOAD",
  ]);
  expect(readFileSync(join(w.askDir(), "report.txt"), "utf8")).toBe(DOCUMENT);
  expect(w.receipt()).toMatchObject({ reportId: "50001", processingStatus: "DONE", source: "createReport", document: "report.txt", compressionAlgorithm: "GZIP", ask: { reportType: TYPE, marketplaceIds: ["ATVPDKIKX0DER"] } });
  expect(got.out).toBe(`DONE 50001 ${join(w.askDir(), "report.txt")}`);
  expect(JSON.parse(readFileSync(join(w.askDir(), "create-body.json"), "utf8"))).toEqual({ reportType: TYPE, marketplaceIds: ["ATVPDKIKX0DER"], dataStartTime: "2026-10-04T00:00:00Z", dataEndTime: "2026-10-10T23:59:59Z" });
  expect(`${got.out}${got.err}`).not.toContain("file://");
  expect(w.holdingLink()).toEqual([]);
  const ask = relative(w.tree, w.askDir()).split(sep).join("/");
  expect(w.listing()).toEqual([
    "document.tsv.gz", "stub", "stub/calls.log", "stub/create.json", "stub/document.json", "stub/reports.json", "stub/statuses", "stub/statuses.bak", "tenant", "tenant/reports", "tenant/reports/STUB_REPORT", `tenant/${ask}`,
    ...["create-1.cx.json", "create-1.json", "create-body.json", "document-1.cx.json", "document-1.json", "receipt.json", "report-1.cx.json", "report-1.json", "report-2.cx.json", "report-2.json", "report-3.cx.json", "report-3.json", "report.txt"].map((file) => `tenant/${ask}/${file}`),
  ].sort());
});

it("a report type outside capitals, digits and _ is refused before any call and any directory", () => {
  const w = world({ statuses: ["DONE"] });
  const before = w.listing();
  for (const type of ["../../../escaped", "A/../../../x", "STUB/REPORT", "stub_report", "..", "-h"]) {
    const got = w.runAs(type, "--wait", "0");
    expect(got.exit, type).toBe(2);
    expect(got.err, type).toContain("report.sh <reportType>");
  }
  expect(w.calls()).toEqual([]);
  expect(w.listing()).toEqual(before);
});

it("a JSON document lands as report.json beside the getReportDocument reply, which keeps all but the link", () => {
  const w = world({ statuses: ["DONE"], document: JSON_DOCUMENT });
  const got = w.run("--wait", "0");
  expect(got).toMatchObject({ exit: 0, out: `DONE 50001 ${join(w.askDir(), "report.json")}` });
  expect(readFileSync(join(w.askDir(), "report.json"), "utf8")).toBe(JSON_DOCUMENT);
  expect(JSON.parse(readFileSync(join(w.askDir(), "document-1.json"), "utf8"))).toEqual({ reportDocumentId: "amzn1.spdoc.1.4.na.STUB", compressionAlgorithm: "GZIP" });
  expect(w.receipt()).toMatchObject({ document: "report.json" });
});

it("a getReportDocument reply cut short after its link ends the run failed, and no file under the tree holds the link", () => {
  const w = world({ statuses: ["DONE"], cutDocument: true });
  const got = w.run("--wait", "0");
  expect(got.exit).toBe(1);
  expect(w.calls().at(-1)).toBe("GET /reports/2021-06-30/documents/amzn1.spdoc.1.4.na.STUB");
  expect(readFileSync(join(w.askDir(), "document-1.json"), "utf8")).toContain("amzn1.spdoc.1.4.na.STUB");
  expect(`${got.out}${got.err}`).not.toContain("file://");
  expect(w.holdingLink()).toEqual([]);
  rmSync(join(w.stub, "cut-document"));
  const before = w.calls().length;
  expect(w.run("--wait", "0").exit).toBe(0);
  expect(w.calls().slice(before)).toEqual(["GET /reports/2021-06-30/documents/amzn1.spdoc.1.4.na.STUB", "DOWNLOAD"]);
  expect(w.holdingLink()).toEqual([]);
});

it("a failed createReport is asked again by the next run, and cx's receipt of the failure is kept", () => {
  const w = world({ statuses: ["DONE"], failOn: [1] });
  const first = w.run("--wait", "0");
  expect(first.exit).toBe(1);
  expect(w.calls().filter((call) => call.startsWith("POST"))).toHaveLength(1);
  const second = w.run("--wait", "0");
  expect(second).toMatchObject({ exit: 0, out: `DONE 50001 ${join(w.askDir(), "report.txt")}` });
  expect(w.calls().filter((call) => call.startsWith("POST"))).toHaveLength(2);
  expect(w.calls().filter((call) => call === "DOWNLOAD")).toHaveLength(1);
  expect(readFileSync(join(w.askDir(), "create-1.json"), "utf8")).toContain("QuotaExceeded");
  expect(JSON.parse(readFileSync(join(w.askDir(), "create-1.cx.json"), "utf8"))).toMatchObject({ paths: [{ http_status: 429 }] });
  expect(JSON.parse(readFileSync(join(w.askDir(), "create-2.json"), "utf8"))).toEqual({ reportId: "50001" });
});

it("a call cx refuses lands no reply; cx's refusal is kept and the next run asks under a name of its own", () => {
  const w = world({ statuses: ["DONE"], refuseOn: [1] });
  expect(w.run("--wait", "0").exit).toBe(1);
  expect(existsSync(join(w.askDir(), "create-1.json"))).toBe(false);
  expect(w.run("--wait", "0").exit).toBe(0);
  expect(JSON.parse(readFileSync(join(w.askDir(), "create-1.cx.json"), "utf8"))).toMatchObject({ refusal: { reason: "out_of_scope" } });
  expect(JSON.parse(readFileSync(join(w.askDir(), "create-2.json"), "utf8"))).toEqual({ reportId: "50001" });
});

it("a failed download is asked again by the next run, from getReportDocument, without polling a finished report again", () => {
  const w = world({ statuses: ["DONE"] });
  const bytes = readFileSync(w.download);
  rmSync(w.download);
  const first = w.run("--wait", "0");
  expect(first.exit).toBe(1);
  expect(first.out).toContain("download failed");
  expect(`${first.out}${first.err}`).not.toContain("file://");
  expect(w.calls().slice(-2)).toEqual(["GET /reports/2021-06-30/documents/amzn1.spdoc.1.4.na.STUB", "DOWNLOAD"]);
  writeFileSync(w.download, bytes);
  const before = w.calls().length;
  const second = w.run("--wait", "0");
  expect(second).toMatchObject({ exit: 0, out: `DONE 50001 ${join(w.askDir(), "report.txt")}` });
  expect(w.calls().slice(before)).toEqual(["GET /reports/2021-06-30/documents/amzn1.spdoc.1.4.na.STUB", "DOWNLOAD"]);
  expect(readFileSync(join(w.askDir(), "report.txt"), "utf8")).toBe(DOCUMENT);
  expect(w.holdingLink()).toEqual([]);
});

it("a flag that takes a value, given last without one, ends in the usage text before any call", () => {
  const w = world({ statuses: ["DONE"] });
  for (const flag of ["--origin", "--marketplace", "--start", "--end", "--option", "--wait", "--every"]) {
    const got = w.runAs(TYPE, "--wait", "0", flag);
    expect(got.exit, flag).toBe(2);
    expect(got.err, flag).toContain("report.sh <reportType>");
  }
  expect(w.calls()).toEqual([]);
});

it("a landed report of the same ask is read again with no call to Amazon", () => {
  const w = world({ statuses: ["DONE"] });
  expect(w.run("--wait", "0").exit).toBe(0);
  const before = w.calls().length;
  const again = w.run("--wait", "0");
  expect(again.exit).toBe(0);
  expect(again.out).toBe(`DONE 50001 ${join(w.askDir(), "report.txt")}`);
  expect(w.calls()).toHaveLength(before);
});

it("one wait: at the ceiling a queued report ends the run with its id and status, and the next run resumes that id instead of creating", () => {
  const w = world({ statuses: ["IN_QUEUE", "IN_QUEUE", "DONE"] });
  const first = w.run("--wait", "0");
  expect(first.exit).toBe(3);
  expect(first.out).toBe(`IN_QUEUE 50001 since 2026-10-14T00:00:00+00:00 ${join(w.askDir(), "receipt.json")}`);
  expect(w.calls()).toEqual(["POST /reports/2021-06-30/reports", "GET /reports/2021-06-30/reports/50001"]);
  expect(w.receipt()).toMatchObject({ reportId: "50001", processingStatus: "IN_QUEUE" });
  const second = w.run("--wait", "5", "--every", "1");
  expect(second.exit).toBe(0);
  expect(w.calls().slice(2)).toEqual(["GET /reports/2021-06-30/reports/50001", "GET /reports/2021-06-30/reports/50001", "GET /reports/2021-06-30/documents/amzn1.spdoc.1.4.na.STUB", "DOWNLOAD"]);
});

it("an ask is answered by its own report: a listed report of the same type, store and range is not taken, since a listing cannot show which ask made it", () => {
  const listed = { reportId: "40001", reportType: TYPE, processingStatus: "DONE", marketplaceIds: ["ATVPDKIKX0DER"], dataStartTime: "2026-10-04T00:00:00+00:00", dataEndTime: "2026-10-10T23:59:59+00:00", reportDocumentId: "amzn1.spdoc.1.4.na.STUB" };
  const w = world({ statuses: ["DONE"], reports: [listed], gzip: false });
  expect(w.run("--wait", "0").exit).toBe(0);
  expect(w.calls().filter((call) => call.startsWith("GET /reports/2021-06-30/reports "))).toEqual([]);
  expect(w.calls()[0]).toBe("POST /reports/2021-06-30/reports");
  expect(w.receipt()).toMatchObject({ reportId: "50001", source: "createReport", compressionAlgorithm: null });
});

it("an ask with report options puts them in the create body", () => {
  const w = world({ statuses: ["DONE"] });
  expect(w.run("--option", "reportPeriod=WEEK", "--option", "asin=<ASIN>", "--wait", "0").exit).toBe(0);
  expect(w.calls()[0]).toBe("POST /reports/2021-06-30/reports");
  expect(JSON.parse(readFileSync(join(w.askDir(), "create-body.json"), "utf8"))).toMatchObject({ reportOptions: { reportPeriod: "WEEK", asin: "<ASIN>" } });
});

it("CANCELLED ends with no document; FATAL's document lands as Amazon's explanation, not as the report", () => {
  const cancelled = world({ statuses: ["CANCELLED"] });
  expect(cancelled.run("--wait", "0")).toMatchObject({ exit: 0, out: "CANCELLED 50001" });
  expect(existsSync(join(cancelled.askDir(), "report.txt"))).toBe(false);
  const fatal = world({ statuses: ["FATAL"], gzip: false });
  expect(fatal.run("--wait", "0").exit).toBe(0);
  expect(fatal.receipt()).toMatchObject({ processingStatus: "FATAL", document: "fatal-explanation.txt" });
  expect(existsSync(join(fatal.askDir(), "report.txt"))).toBe(false);
});

it("a call cx reports as failed (a 429) ends the run at once: no retry, no limiter, Amazon's words kept", () => {
  const w = world({ statuses: ["IN_QUEUE", "DONE"], failOn: [2] });
  const got = w.run("--wait", "5", "--every", "1");
  expect(got.exit).toBe(1);
  expect(w.calls()).toHaveLength(2);
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
