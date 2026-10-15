---
name: effect-review
description: "Judging whether a listing change worked, for a change whose observation window has ended or a question whether a change worked - Manage Your Experiments, baseline and observation windows, controls, confounders and the three verdicts (held, not held, cannot tell)."
---

## Design

- Before/after cannot separate changes to one ASIN in one window; the verdict covers their combination (P-effect-measurement-5).
- Before the write, the change file fixes the metric and orders, expected direction, smallest move that counts, both windows and dated control set (P-effect-measurement-6).
- Windows are whole weeks with matching weekdays; exposure and click-through use Search Query Performance weeks (P-effect-measurement-9).
- The observation window opens when `getListingsItem` holds the new value with no `ERROR` issue and `getCatalogItem` shows it (P-effect-measurement-7). Its end is the change file's; before it, a reading is progress, not a verdict (P-effect-measurement-11).
- Manage Your Experiments randomizes images, title, bullets, description or A+ on a Brand Representative's eligible ASIN: stronger evidence than before/after (P-effect-measurement-1).

## Confounders

- A running experiment splits what shoppers see, blocking a before/after verdict on another change to that ASIN (P-a-plus-content-13).
- The control's same-period movement comes out first; competitors share the listing's shoppers, so core-query search volume is the cleaner demand control (P-effect-measurement-12).
- A material move between windows in price, Featured Offer share, promotions, stock, reviews, ads, competitors' prices, deals or stock-outs, or major sales gives cannot tell unless the metric's move clearly exceeds it (P-effect-measurement-14).
- A window overlapping a major sale, its run-up or ramp-down gives cannot tell, naming the event (P-effect-measurement-15).

## Verdicts

- Held: net of the control, the metric moved as expected by at least the smallest move, orders did not fall, and nothing else explains it (P-effect-measurement-18).
- Not held: the window could show the smallest move and did not, or it moved the wrong way (P-effect-measurement-18).
- Cannot tell: anything else, such as too few counts, a confounder or a change never shown (P-effect-measurement-18).
- A material fall in the whole-catalog search funnel or previous top queries not bet on rules out held (P-effect-measurement-30).
- Cannot tell leads where the change file said: keep, revert, extend once, or Manage Your Experiments (P-effect-measurement-39).
- Held and not held are provisional, re-read at a later durability window (P-effect-measurement-35); a revert is a new change with its own verdict (P-effect-measurement-36).

## References

- references/design.md: experiments, windows, metrics, controls.
- references/confounders.md: confounder families, where each shows.
- references/verdicts.md: verdicts, fields, noise, guardrails, placebo, durability.
