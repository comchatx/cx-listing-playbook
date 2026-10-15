# evals

The test cases and trigger queries the three skills were measured with, in the shapes Anthropic's `skill-creator` reads. Nothing here ships: `package.json`'s `files` names `skills`, `prompts` and `research` only.

| File | What it holds |
|---|---|
| `listing-review.json`, `listing-change-log.json`, `effect-review.json` | `skill-creator`'s `evals.json` for each skill: the seller's message, the expected result and the assertions a grader checks. |
| `triggers/<skill>.json` | 20 queries per skill, 10 that should load it and 10 near misses that should not, for `skill-creator`'s description loop. |
| `fixture.py` | Writes a synthetic seller's tree: `python3 -I evals/fixture.py <dir>` replaces `<dir>/tenant` and leaves the rest of `<dir>` as it was. Today in it is 2026-10-14; marketplace `ATVPDKIKX0DER`; the seller's ASINs are `B0FIXTURE1`–`7`, competitors `B0COMPET01`–`02`. No real seller's data and no Amazon reply is in it. |
| `cx` | A stand-in for the box's `cx` for these runs: `cx raw amazon-sp-api --method GET --path <path>` answers from the landed replies under `$TENANT_TREE/raw/amazon-sp-api/`, any other method is refused, and each call is appended to `$TENANT_TREE/../cx-calls.log`. |

## A run

Each run gets its own copy of the tree and is told, the same way in every configuration: the seller's message; that the tree at `<run>/tenant` is the box's `/tenant`; `export PATH=<dir of this cx>:$PATH TENANT_TREE=<run>/tenant` before any `cx` call, with `cx`'s flags; seller id `A1FIXTURESELLER`, origin `https://sellingpartnerapi-na.amazon.com`; today 2026-10-14, no internet; to save the reply as `outputs/answer.md` and the shell commands it ran as `outputs/commands.txt`. A with-skill run is also given the skill's directory; a baseline run is given none.

A grader reads `skill-creator`'s `agents/grader.md` and checks each assertion against `answer.md`, `commands.txt`, `cx-calls.log` and `diff -r` of the run's tree against a fresh one.

## Rerunning

With `skill-creator` installed in Claude Code, its `scripts/aggregate_benchmark.py` builds the benchmark, `eval-viewer/generate_review.py --static <file>` writes the viewer, and `scripts/run_loop.py --report none` runs the description loop. `run_eval.py` writes a temporary command file under the nearest `.claude/` above its working directory, so it is run from a scratch directory that has its own `.claude/`.
