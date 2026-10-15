import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { fauxAssistantMessage, fauxProvider, type TranscriptContext } from "@earendil-works/pi-ai";
import { createAgentSession, DefaultResourceLoader, ModelRuntime, SessionManager, SettingsManager } from "@earendil-works/pi-coding-agent";
import { afterEach } from "vitest";

const scratches: string[] = [];
afterEach(() => { for (const scratch of scratches.splice(0)) rmSync(scratch, { recursive: true, force: true }); });

export const scratch = (): string => {
  const directory = mkdtempSync(join(tmpdir(), "pi-package-"));
  scratches.push(directory);
  return directory;
};

/** The pinned pi, its settings listing this package by its root as a local install does, loading what the package declares. */
export async function loadPackage(root: string) {
  const home = scratch();
  const agentDir = join(home, "agent");
  const cwd = join(home, "project");
  for (const directory of [agentDir, cwd]) mkdirSync(directory);
  writeFileSync(join(agentDir, "settings.json"), JSON.stringify({ defaultProjectTrust: "always", packages: [root] }));
  const settingsManager = SettingsManager.create(cwd, agentDir);
  const loader = new DefaultResourceLoader({ cwd, agentDir, settingsManager });
  await loader.reload();
  return { loader, cwd, agentDir, settingsManager };
}

/** What the model receives when the seller types `input` into a pi session with this package installed: the last user message's text. */
export async function typed(root: string, input: string): Promise<string> {
  const { loader, cwd, agentDir, settingsManager } = await loadPackage(root);
  const faux = fauxProvider();
  const modelRuntime = await ModelRuntime.create({ authPath: join(agentDir, "auth.json"), modelsPath: null, allowModelNetwork: false, refreshOnCreate: false });
  modelRuntime.registerNativeProvider(faux.provider);
  let seen: TranscriptContext | undefined;
  faux.setResponses([(context) => { seen = context; return fauxAssistantMessage("ok"); }]);
  const { session } = await createAgentSession({ cwd, agentDir, modelRuntime, model: faux.getModel(), resourceLoader: loader, settingsManager, sessionManager: SessionManager.inMemory(cwd), noTools: "all" });
  await session.prompt(input);
  const user = [...(seen?.messages ?? [])].reverse().find((message) => message.role === "user");
  if (user === undefined) throw new Error(`the model received no user message for ${input}`);
  return typeof user.content === "string" ? user.content : user.content.map((part) => ("text" in part ? part.text : "")).join("");
}

/** pi's own default system prompt at the pin, with its default tools: the charter's ruler for a skill body. */
export async function defaultPromptWords(): Promise<number> {
  const dist = join(process.cwd(), "node_modules", "@earendil-works", "pi-coding-agent", "dist", "core");
  const tools = ["read", "bash", "edit", "write"] as const;
  const { buildSystemPrompt } = (await import(pathToFileURL(join(dist, "system-prompt.js")).href)) as { buildSystemPrompt: (input: object) => string };
  const toolSnippets: Record<string, string> = {};
  const promptGuidelines: string[] = [];
  for (const tool of tools) {
    const module = (await import(pathToFileURL(join(dist, "tools", `${tool}.js`)).href)) as Record<string, { snippet: string; guidelines: string[] }>;
    const contribution = module[`${tool}ToolSystemPromptContribution`]!;
    toolSnippets[tool] = contribution.snippet;
    promptGuidelines.push(...contribution.guidelines);
  }
  return words(buildSystemPrompt({ cwd: "/tenant", selectedTools: [...tools], toolSnippets, promptGuidelines, contextFiles: [], skills: [] }));
}

export const words = (text: string): number => text.trim().split(/\s+/).length;
export const body = (text: string): string => text.replace(/^---\n[\s\S]*?\n---\n/, "");
