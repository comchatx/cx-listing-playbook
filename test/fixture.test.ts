import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, expect, it } from "vitest";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const scratches: string[] = [];
afterEach(() => { for (const scratch of scratches.splice(0)) rmSync(scratch, { recursive: true, force: true }); });

it("the evals' fixture replaces <dir>/tenant and leaves the rest of <dir> as it was", () => {
  const dir = mkdtempSync(join(tmpdir(), "fixture-"));
  scratches.push(dir);
  mkdirSync(join(dir, ".git"));
  writeFileSync(join(dir, ".git", "HEAD"), "ref: refs/heads/main\n");
  writeFileSync(join(dir, "notes.md"), "kept\n");
  mkdirSync(join(dir, "tenant"));
  writeFileSync(join(dir, "tenant", "stale.json"), "{}");
  const done = spawnSync("python3", ["-I", join(ROOT, "evals", "fixture.py"), dir], { encoding: "utf8" });
  expect(done.status, done.stderr).toBe(0);
  expect(readFileSync(join(dir, "notes.md"), "utf8")).toBe("kept\n");
  expect(readFileSync(join(dir, ".git", "HEAD"), "utf8")).toBe("ref: refs/heads/main\n");
  expect(existsSync(join(dir, "tenant", "stale.json"))).toBe(false);
  expect(existsSync(join(dir, "tenant", "listings"))).toBe(true);
});
