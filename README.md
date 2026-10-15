# cx-listing-playbook

A [pi](https://pi.dev) package for the work on an Amazon listing: how it performs and why, a log of each change, and how to judge whether a change worked. It is written for the assistant in a [ComChatX](https://comchatx.com) seller's box, and reads the seller's Amazon account through the box's `cx` command.

It is text and one script. Every sentence of the skills ends with the research item it rests on, and the research is in [`research/`](research/README.md).

## What it holds

| | What the model reads |
|---|---|
| `skills/listing-review` | The funnel and which element serves each stage, what Amazon's own answers show about a listing, the signals that something changed, which file carries each figure, how a write is validated (`references/writing.md`), and `scripts/report.sh` |
| `skills/listing-change-log` | One file per listing change: before, after, what was expected and from which file, the words bet on, the seller's decision, the request as it would be sent, Amazon's receipt id and the observation window |
| `skills/effect-review` | Experiments, baseline and observation windows, controls, confounders, and the three verdicts: held, not held, cannot tell |
| `prompts/listing-review.md` | `/listing-review <ASIN>`: the listing and its issues, the market since last time, a proposal with its reasons |
| `prompts/listing-watch.md` | `/listing-watch <ASIN> <your words>`: writes the standing instruction for that listing from the seller's words, e.g. `/listing-watch <ASIN> 以后每天帮我盯着这个 listing，有要改的告诉我，没事别吵` |

Each skill's detail is under its `references/`.

## Files in the seller's tree

| Place | Holds |
|---|---|
| `/tenant/listings/<ASIN>/watch.md` | The standing instruction `/listing-watch` writes |
| `/tenant/listings/<ASIN>/changes/` | One file per listing change; changes made together are one change |
| `/tenant/reports/<reportType>/<ask>/<n>/` | One report of that ask: `receipt.json` with the report id, Amazon's status and `createdTime`, each reply as Amazon gave it, and the document |

## The report script

```bash
scripts/report.sh <reportType> --origin <origin> --marketplace <id>[,<id>...] [--start <ISO 8601>] [--end <ISO 8601>] \
                  [--option <name>=<value>]... --wait <seconds> [--every <seconds>]
```

It asks Amazon's Reports API through `cx raw amazon-sp-api`: `createReport`, `getReport` until a terminal status or the `--wait` ceiling, `getReportDocument` and the document, decompressed, landed beside the receipt. Each run asks for a report of its own, except that it carries on the ask's report not yet landed: one still queued at the ceiling ends the run with its id and status (exit 3) for the next run to carry on. Earlier reports stay as they landed. It has no rate limiter and no retry of its own. Report types, their options and their periods are the `amazon-sp-api` skill's (`references/door.md`). It needs `bash`, `jq`, `curl` and `gzip`, which the box has.

## What it needs

pi, and in the box the `cx` command with the Amazon SP-API source; Keepa where a skill names a Keepa field. It reaches no network itself except the one document link Amazon hands the script.

## Install

```bash
pi install npm:cx-listing-playbook        # for you, in ~/.pi/agent/settings.json
pi install -l npm:cx-listing-playbook     # for one project, in .pi/settings.json
pi remove npm:cx-listing-playbook
```

On ComChatX, a seller installs it from the Plugins page.

## Develop

```bash
npm ci
npm run typecheck
npm test               # pi at the pin loads the package and expands both templates; every text line cites a research item;
                       # the script runs against a stub cx
```

`TENANT_TREE` moves the script's tree from `/tenant` for a run outside the box, as the tests do.

## Licence

MIT. See [LICENSE](LICENSE).
