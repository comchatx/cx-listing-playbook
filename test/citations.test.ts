import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { body } from "./pi.js";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const CITATION = /P-[a-z0-9-]+?-\d+/g;

const markdown = (directory: string): string[] =>
  readdirSync(directory, { recursive: true, encoding: "utf8" }).filter((file) => file.endsWith(".md")).map((file) => join(directory, file));

/** Every research item, as each research file opens it: `**P-<file>-<n>` in bold at the head of a list entry. */
const items = new Set(
  markdown(join(ROOT, "research")).flatMap((file) => {
    const stem = file.slice(file.lastIndexOf("/") + 1, -".md".length);
    return [...readFileSync(file, "utf8").matchAll(new RegExp(`^\\s*(?:[-*]|\\d+\\.)\\s*\\*\\*(P-${stem}-\\d+)[.:*]`, "gm"))].map((match) => match[1]!);
  }),
);

/** A line that only points: to a reference, to the research, or the script's usage. */
const pointer = (line: string) => /references\/|research\/|^`scripts\//.test(line);

it("every line of the skills and their references cites a research item that exists, except a line that only points", () => {
  expect(items.size).toBeGreaterThan(0);
  const texts = markdown(join(ROOT, "skills"));
  expect(texts.length).toBeGreaterThanOrEqual(16);
  for (const file of texts) {
    const lines = body(readFileSync(file, "utf8")).split("\n").map((line) => line.trim()).filter((line) => line !== "" && !line.startsWith("#"));
    for (const line of lines) {
      const cited = line.match(CITATION) ?? [];
      if (cited.length === 0) expect(pointer(line), `${file}: ${line}`).toBe(true);
      for (const id of cited) expect(items.has(id), `${file}: ${id}`).toBe(true);
    }
  }
});
