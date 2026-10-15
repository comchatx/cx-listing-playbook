---
name: listing-review
description: "How an Amazon listing performs and why: the search-to-purchase funnel and which element serves each stage, what Amazon's own answers show about a listing, the signals that something changed, which data carries each figure, and how a listing write is validated. For reviewing, watching or changing a listing on Amazon."
---

## Funnel

A sale's stages are findable, exposure, click-through, conversion and offer (P-funnel-and-search-1).
Exposure is served by the title, search terms, classification and structured attributes with valid values (P-funnel-and-search-4).
Click-through is served by the search result's main image, title, item highlights, price, badges, rating and delivery message (P-funnel-and-search-6).
Conversion is served by the detail page and offer (P-funnel-and-search-7).

## Gates

An ASIN is unsearchable as a parent, without browse node or buyable offer, before launch, or search-suppressed (P-funnel-and-search-3).
Copy fixes no suppression (`getListingsItem`), price-ineligible offer (`getCompetitiveSummary`) or stock-out (P-triggers-2).

## Health

A healthy listing has `BUYABLE` and `DISCOVERABLE` in every store's `status`, no `ERROR` issue or `NOT_EXEMPT` enforcement, and a Catalog showing its submission (P-listing-content-and-health-3).
A different `getCatalogItem` value is another contributor's or Amazon's win, not a failed write; an attribute the Catalog never returns, such as `generic_keyword`, is no difference (P-brand-protection-and-catalog-contribution-1).
Not every listing problem has a defined issue; policy removals show under Account Health's Product Policy Compliance (P-account-health-2).

## Signals

A trigger (competitor, demand, own-listing or constraint) marks a threatened stage, not a content cause (P-triggers-1).
In Search Query Performance, falling totals are demand; falling `asin*Share` at steady totals is competition or the listing (P-triggers-3).
No SP-API operation returns keyword position; Search Query Performance impressions and impression share measure a query's exposure (P-search-rank-and-volume-1).
The standing instruction, `/tenant/listings/<ASIN>/watch.md`, holds the seller's watch list, cadence and thresholds, as Jungle Scout's and Helium 10's alerts do (P-triggers-13).

## Reports

`scripts/report.sh <reportType> --origin <origin> --marketplace <id>[,<id>…] [--start <ISO 8601>] [--end <ISO 8601>] [--option <name>=<value>]… --wait <seconds> [--every <seconds>]`

Each run asks Amazon anew but carries on its own unfinished report, and earlier reports stay under the ask's directory, each receipt with Amazon's `createdTime` (P-report-lifecycle-26, P-report-lifecycle-17).
It lands the document and `receipt.json` under `/tenant/reports/<reportType>/<ask>/`, outliving the report id Amazon keeps for a limited period (P-report-lifecycle-17).
`DONE`, `CANCELLED` and `FATAL` are final; `IN_QUEUE` or `IN_PROGRESS` at the `--wait` ceiling is unfinished, not failed (P-report-lifecycle-1).
`CANCELLED` is no report (explicit cancel, no data, or a repeat inside the type's period), never zero sales (P-report-lifecycle-2).
The amazon-sp-api skill's references/door.md holds report names, options and periods (P-report-lifecycle-7).

## References

[writing.md](references/writing.md): schema limits, titles. [write-path.md](references/write-path.md): validating writes. [funnel.md](references/funnel.md): stages, gates, rank. [good-listing.md](references/good-listing.md): element health. [signals.md](references/signals.md): triggers, offer, stock. [figures.md](references/figures.md): figure sources. [policy.md](references/policy.md): policy screens. [reports.md](references/reports.md): reports, feeds. [watch.md](references/watch.md): watching.
