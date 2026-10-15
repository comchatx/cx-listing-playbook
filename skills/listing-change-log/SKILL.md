---
name: listing-change-log
description: "The log of changes to an Amazon listing, one file per change in the seller's tree, holding what changed, what was expected and why, what was decided before the change, what was sent and what Amazon answered. It covers the time before and after a change to a listing, and the judging of one."
---

Facts cite P-<file>-<n> in research/<angles|elements|method>/<file>.md; pointers cite none.

## The place

- A change's file is in /tenant/listings/<ASIN>/changes/; changes made together are one change, and its verdict is about the combination (P-effect-measurement-5).

## What a file holds

- **Before.** The values read before the write, with offers, fulfillment availability and relationships (P-listing-writes-16).
- **After.** The submitted values, which `getListingsItem` returns, and the later Catalog view, which reconciliation, title splitting or another contributor's precedence can change (P-listing-writes-7). A differing Catalog value, or an Amazon change during the window, makes the verdict cannot tell (P-effect-measurement-8).
- **Expected.** Fixed before the write: the targeted stage, metric and orders with their sources, the expected direction and range, the smallest move that counts, both windows by date, the dated control set, and the expected lag and shape (P-effect-measurement-6). A later edit to these carries its reason (P-effect-measurement-6).
- **Words bet on.** Search Query Performance queries as Amazon spells them, with the ASIN's share at each stage over the baseline weeks (P-search-query-performance-9). Each notes whether it had paid search-term rows at baseline, compared in the observation window (P-paid-keywords-7).
- **Decisions.** The seller's decision on the change, in the seller's words, and on holding bids fixed (P-paid-keywords-18). The cannot-tell outcome (keep, revert, extend once, or Manage Your Experiments) is written before the change (P-effect-measurement-39).
- **Request and receipt.** The operation as the request it would be sent: origin, method, path and body; then Amazon's `submissionId`, `status` and `issues` (P-listing-writes-8). `ACCEPTED` means accepted for processing, not done (P-listing-writes-6). Amazon raises issues asynchronously after acceptance (P-listing-policies-13).
- **Window dates.** The observation window opens when `getListingsItem` holds the new value with no `ERROR` issue and `getCatalogItem` then shows it (P-effect-measurement-7). An exposure or click-through reading starts at the first whole report week after Amazon's stated search latency, quoted from its page into the file (P-effect-measurement-7). Each kind of change has its own go-live window on its help page, an allowance before exposure is read and not proof the change is live (P-funnel-and-search-15). A+ and Brand Story windows open at confirmed publication (P-a-plus-content-6; P-brand-story-and-store-5). The window's end is set here (P-effect-measurement-11).

## More fields

references/record.md holds the rest: actor, account, offer, fees, claims, A+, stores, ads, families, deletes, Amazon-side events.
