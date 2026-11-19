import { execFileSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { loadPackage, scratch, typed } from "./pi.js";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const SKILLS = ["effect-review", "featured-offer", "listing-change-log", "listing-create", "listing-review"] as const;
const skillFile = (name: string) => join(ROOT, "skills", name, "SKILL.md");

it("the pinned pi loads five skills and two templates from the package, and nothing else", async () => {
  const { loader } = await loadPackage(ROOT);
  const skills = loader.getSkills();
  const prompts = loader.getPrompts();
  expect(skills.diagnostics).toEqual([]);
  expect(prompts.diagnostics).toEqual([]);
  expect(skills.skills.map((skill) => skill.name).sort()).toEqual([...SKILLS]);
  expect(skills.skills.map((skill) => skill.filePath).sort()).toEqual(SKILLS.map(skillFile));
  expect(prompts.prompts.map((prompt) => prompt.name).sort()).toEqual(["listing-create", "listing-review"]);
  expect(loader.getExtensions().extensions).toEqual([]);
});

it("every directory under skills/ holds a SKILL.md, and each is one of the package's skills", () => {
  const directories = readdirSync(join(ROOT, "skills"), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  for (const name of directories) expect(existsSync(skillFile(name)), `skills/${name}/SKILL.md`).toBe(true);
  expect(directories).toEqual([...SKILLS]);
});

it("each template expands in a pi session: the ASIN or the marketplaces, and the seller's own words reach the model, no placeholder does", async () => {
  const review = await typed(ROOT, "/listing-review B000123456");
  expect(review).toBe("Review my listing B000123456: the listing and its issues, the market since you last looked, and your proposal with its reasons.");
  const create = await typed(ROOT, "/listing-create US,DE 新品上架，数据在 /tenant/products/new-router/，FBA 发货");
  expect(create).toBe("Create my listing in US,DE from my words: 新品上架，数据在 /tenant/products/new-router/，FBA 发货");
  for (const text of [review, create]) expect(text).not.toMatch(/\$\{?[@0-9A]/);
});

it("the package carries no dependency, no install script and no extension", () => {
  const manifest = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as Record<string, unknown>;
  for (const field of ["dependencies", "peerDependencies", "optionalDependencies", "bundleDependencies", "bundledDependencies"]) expect(manifest[field], field).toBeUndefined();
  expect(manifest["scripts"]).toEqual({ typecheck: "tsc --noEmit", test: "vitest run" });
  expect(manifest["keywords"]).toEqual(["pi-package"]);
  expect(manifest["pi"]).toEqual({ skills: ["./skills"], prompts: ["./prompts"] });
  expect(readdirSync(ROOT)).not.toContain("extensions");
});

it("/listing-watch has left for @comchatx/cx-listing-watch, and the Plugins page's field names every skill the package ships", () => {
  expect(existsSync(join(ROOT, "prompts", "listing-watch.md"))).toBe(false);
  const manifest = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as { comchatx: { skills: Record<string, { about: { en: string; zh: string } }> } };
  expect(Object.keys(manifest.comchatx.skills).sort()).toEqual([...SKILLS]);
  for (const [name, words] of Object.entries(manifest.comchatx.skills)) {
    expect(words.about.zh, name).toMatch(/[一-鿿]/);
    expect(words.about.en, name).not.toMatch(/[一-鿿]/);
  }
});

it("the Plugins page's field declares what the skills read: the seller's account on SP-API, required; Keepa, Listing Watch and the Amazon base, optional, each with its reason", () => {
  const manifest = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as { comchatx: { builds: unknown } };
  expect(manifest.comchatx.builds).toEqual([
    { on: "cx-amazon-sp-api", need: "required" },
    { on: "cx-keepa", need: "optional", why: { en: "Adds price and rank history, and rivals' listings.", zh: "用于对比价格和排名的历史，以及竞品的 listing。" } },
    { on: "@comchatx/cx-listing-watch", need: "optional", why: { en: "Has cx keep watching a listing for you.", zh: "用于让 cx 定期替你盯着一条 listing。" } },
    { on: "cx-amazon-seller", need: "optional", why: { en: "Tells cx from the start that you sell on Amazon.", zh: "用于让 cx 从第一条消息起就知道你在亚马逊开店。" } },
  ]);
  expect(readFileSync(join(ROOT, "skills", "listing-create", "SKILL.md"), "utf8")).toContain("GET /sellers/v1/marketplaceParticipations");
  expect(readFileSync(join(ROOT, "skills", "featured-offer", "SKILL.md"), "utf8")).toContain("Keepa's `buyBoxSellerIdHistory`");
  expect(readFileSync(join(ROOT, "skills", "effect-review", "references", "design.md"), "utf8")).toContain("Keepa `deals` and `couponHistory`");
});

/** What the pinned pi loads from a package root: its skills, its templates and any diagnostic. */
const shelf = async (root: string) => {
  const { loader } = await loadPackage(root);
  const skills = loader.getSkills();
  const prompts = loader.getPrompts();
  return {
    skills: skills.skills.map((skill) => skill.name).sort(),
    prompts: prompts.prompts.map((prompt) => prompt.name).sort(),
    diagnostics: [...skills.diagnostics, ...prompts.diagnostics],
  };
};

/** The tarball npm would publish, unpacked: the package as a seller's pi installs it. */
const packed = (from: string): string => {
  const out = scratch();
  const [result] = JSON.parse(execFileSync("npm", ["pack", "--json", "--ignore-scripts", "--pack-destination", out], { cwd: from, encoding: "utf8" })) as { filename: string }[];
  execFileSync("tar", ["xzf", join(out, result!.filename), "-C", out]);
  return join(out, "package");
};

it("the published tarball loads five skills and two templates under the pinned pi, with no diagnostic", async () => {
  const loaded = await shelf(packed(ROOT));
  expect(loaded).toEqual({ skills: [...SKILLS], prompts: ["listing-create", "listing-review"], diagnostics: [] });
}, 120_000);

it("the same check fails a copy whose featured-offer description is emptied", async () => {
  const copy = join(scratch(), "copy");
  cpSync(packed(ROOT), copy, { recursive: true });
  const file = join(copy, "skills", "featured-offer", "SKILL.md");
  writeFileSync(file, readFileSync(file, "utf8").replace(/^description: .*$/m, 'description: ""'));
  const loaded = await shelf(copy);
  expect(loaded.skills).not.toContain("featured-offer");
  expect(loaded.diagnostics.map((one) => [one.message, one.path])).toEqual([["description is required", file]]);
  expect(loaded).not.toEqual({ skills: [...SKILLS], prompts: ["listing-create", "listing-review"], diagnostics: [] });
}, 120_000);

it("carries its signed name and the signed Chinese of its templates, with no slash command and no /tenant/ path", () => {
  const manifest = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as { comchatx: { name: string; nameZh: string; prompts: Record<string, { zh: string }> } };
  expect(manifest.comchatx.name).toBe("Amazon Listing Playbook");
  expect(manifest.comchatx.nameZh).toBe("亚马逊 listing 分析手册");
  expect(manifest.comchatx.prompts["listing-create"]!.zh).toBe("在【站点】创建 listing，按这些描述和产品资料：【描述，以及产品资料在哪】");
  expect(manifest.comchatx.prompts["listing-review"]!.zh).toBe("检查【ASIN】这条 listing：表现如何、有什么变化、该改什么。");
});
