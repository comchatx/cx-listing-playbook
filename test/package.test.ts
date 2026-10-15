import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { body, defaultPromptWords, loadPackage, typed, words } from "./pi.js";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const SKILLS = ["effect-review", "listing-change-log", "listing-review"] as const;
const skillFile = (name: string) => join(ROOT, "skills", name, "SKILL.md");

it("the pinned pi loads three skills and two templates from the package, and nothing else", async () => {
  const { loader } = await loadPackage(ROOT);
  const skills = loader.getSkills();
  const prompts = loader.getPrompts();
  expect(skills.diagnostics).toEqual([]);
  expect(prompts.diagnostics).toEqual([]);
  expect(skills.skills.map((skill) => skill.name).sort()).toEqual([...SKILLS]);
  expect(skills.skills.map((skill) => skill.filePath).sort()).toEqual(SKILLS.map(skillFile));
  expect(prompts.prompts.map((prompt) => prompt.name).sort()).toEqual(["listing-review", "listing-watch"]);
  expect(loader.getExtensions().extensions).toEqual([]);
});

it("each SKILL.md body is at most pi's own default prompt, measured at the pin: 371 words", async () => {
  const ruler = await defaultPromptWords();
  expect(ruler).toBe(371);
  for (const name of SKILLS) expect(words(body(readFileSync(skillFile(name), "utf8"))), name).toBeLessThanOrEqual(ruler);
});

it("each template expands in a pi session: the ASIN and the seller's own words reach the model, no placeholder does", async () => {
  const review = await typed(ROOT, "/listing-review B000123456");
  expect(review).toBe("Review my listing B000123456: the listing and its issues, the market since you last looked, and your proposal with its reasons.");
  const watch = await typed(ROOT, "/listing-watch B000123456 以后每天帮我盯着这个 listing，有要改的告诉我，没事别吵");
  expect(watch.split("\n")[0]).toBe("Write the standing instruction for my listing B000123456 from my words: 以后每天帮我盯着这个 listing，有要改的告诉我，没事别吵");
  expect(watch).toContain("whether you may change anything without asking me");
  for (const text of [review, watch]) expect(text).not.toMatch(/\$\{?[@0-9A]/);
});

it("the package carries no dependency and no extension", () => {
  const manifest = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as Record<string, unknown>;
  expect(manifest["dependencies"]).toBeUndefined();
  expect(manifest["peerDependencies"]).toBeUndefined();
  expect(manifest["keywords"]).toEqual(["pi-package"]);
  expect(manifest["pi"]).toEqual({ skills: ["./skills"], prompts: ["./prompts"] });
  expect(readdirSync(ROOT)).not.toContain("extensions");
});
