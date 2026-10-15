# Verdicts on a listing change

Each sentence ends with the research item it rests on: P-<file>-<n> is in the package's research/<angles|elements|method>/<file>.md.

## The three verdicts

- Held: after the control's same-period movement is taken out, the targeted metric moved in the expected direction by at least the smallest move the change file logged, orders did not fall, and no confounder or event explains it. (P-effect-measurement-18)
- Not held: the window had enough data to have seen the logged smallest move and did not see it, or the metric moved the wrong way. (P-effect-measurement-18)
- Cannot tell: everything else, including too few counts, a confounder, an event, an Amazon-side change, or a change that never showed. (P-effect-measurement-18)

## After the verdict

- What a cannot-tell verdict leads to (keep, revert, extend once, or Manage Your Experiments) is in the change file, written before the change, and is a decision under uncertainty, not a finding about the change. (P-effect-measurement-39)
- The observation window's end is set in the change file; a reading before that date is progress, not a verdict. (P-effect-measurement-11)

## Same field, same file

Amazon's "conversion" figures are different ratios in different files: units over sessions, search purchases over search clicks, search purchases over impressions, and Manage Your Experiments' purchases per unique visitor. (P-effect-measurement-24)
Amazon's Search Query Performance dashboard advises against comparing metric names across dashboards. (P-effect-measurement-24)
In the seller analytics dataset, `conversationRatePct` is deprecated in favor of `conversionRatePct`. (P-effect-measurement-24)
A difference read across two different fields, or across the same name in two files, can come from the change of definition alone and is not a move of the listing. (P-effect-measurement-24)
Featured-offer share has two fields, each defined in its own schema: `featureOfferPct` over glance views and `buyBoxPercentage` over page views where the buy box appeared. (P-effect-measurement-44)
Amazon has removed the seller eligibility requirement for the Featured Offer, so a pair of windows on either side of that removal spans a change in Amazon's rule behind that share. (P-effect-measurement-44)
A percentage alone does not show its noise; the counts behind it (orders, sessions, impressions) in each window do. (P-effect-measurement-17)

## Noise

Impressions, searches and sessions are not independent shoppers, so noise computed as if they were is too small. (P-effect-measurement-29)
A binomial interval on a share from Search Query Performance or Search Catalog Performance counts, and a Poisson interval on an order count, are floors on the noise, and plain binomial limits over large numbers of sessions are too narrow when the rate itself drifts. (P-effect-measurement-29; P-triggers-30)
Where the ASIN has enough history, an overdispersed count model (negative binomial or quasi-Poisson) fitted to that history gives the noise. (P-effect-measurement-29)

## One primary metric

A verdict is about the one primary metric the change file named before the change. (P-effect-measurement-31)
When many queries or segments are scanned, some show a "significant" move by chance alone. (P-effect-measurement-31)
A single such query or segment is a chance finding unless it survives false-discovery-rate control across the scan (Benjamini and Hochberg) or a pooled estimate across the queries. (P-effect-measurement-31)
A segment is valid only if it was declared in advance and is defined by something the change could not move. (P-effect-measurement-31)

## Search Query Performance alone

- Search Query Performance shows the search-results stage only, mixes organic and Sponsored Products results, and covers top queries only, so it alone does not show a bullet change held; its reading is in whole Sunday-to-Saturday weeks after the change shows. (P-bullet-points-19)

## Guardrails

Every change has two guardrails on what it did not target: the ASIN's whole-catalog search funnel (impressions, clicks and purchases across all queries, from Search Catalog Performance or the seller analytics `search.catalog` group) and its previous top queries the change did not bet on. (P-effect-measurement-30)
A material fall in either guardrail rules out held, whatever the targeted metric did. (P-effect-measurement-30)

## Placebo check

The verdict rule, run with the same window lengths and controls on past windows of the ASIN in which nothing changed (an in-time placebo), gives a placebo rate: how often the rule returns held or not held where there was no change. (P-effect-measurement-32)
Where it often returns held or not held on those windows, verdicts on that ASIN are cannot tell. (P-effect-measurement-32)
Manage Your Experiments, Amazon's randomized test, is the alternative where the seller is a brand representative and the ASIN is eligible. (P-effect-measurement-1)

## Surprising results and regression to the mean

By Twyman's law, a figure that looks interesting or different is usually wrong, so a large win from a small wording change has a data error or a confounder to rule out before it is held. (P-effect-measurement-19)
A listing picked for review because it dropped tends to recover with no change at all, so a baseline of the drop weeks alone builds in a false held. (P-effect-measurement-16)

## Lifts do not add

Each change has its own expected range, window and verdict, and the expected lifts of several changes do not sum into one forecast. (P-effect-measurement-22)

## Durability and reverts

Held and not held are provisional: a short-term effect does not always predict the long-term one, and a reading of the same metric at a later durability window can differ from the first. (P-effect-measurement-35)
A revert is a new change with its own baseline, window and verdict. (P-effect-measurement-36)
Effects can carry over after a change ends, so a revert need not bring back the old figures. (P-effect-measurement-36)

## Pooled estimates

Where the change log holds enough verdicts of one change type, a new reading of that type is better estimated pulled toward their pooled estimate than taken alone (partial pooling). (P-effect-measurement-40)

## Week-by-week alternation

A manual alternation of two versions by week counts as a randomized test only if the order of the periods was randomized in advance, and a fixed alternation is no stronger evidence than one before/after. (P-effect-measurement-41)
Each switch is a change with Amazon's latency, and carryover from one period into the next is a threat to the comparison. (P-effect-measurement-41)

## Returns

In the seller analytics dataset, `returnedUnits` is mapped to the day each unit shipped and is computed with a delay the schema's `returns` description states; days inside that delay may be empty or incomplete. (P-effect-measurement-43)
A verdict given before its window's ship days are older than that delay has incomplete returns for those days. (P-effect-measurement-43)
Return figures compare only on the same dating basis: a return or processing date against a return date, a ship date against a ship date. (P-returns-21)
A rise in a return-dated file just after the holiday season can be that season's sales coming back under Amazon's extended holiday return window. (P-returns-21)
A window holding shipments covered by that extended window can still gain returns until the year's extended return deadline and the dataset's stated delay have both passed; the season and the deadline are in that year's announcement. (P-returns-21)
Published research ties zoom use to fewer returns and heavier use of alternative photos to more returns, so a gallery change bears on returns as well as conversion and orders (De, Hu and Rahman). (P-images-and-video-28)

## The seller's other ASINs

A change's effect on the seller's other ASINs shows in their sessions and orders over the same windows. (P-effect-measurement-45)
Market Basket data reports items bought together, so it does not measure cannibalization. (P-effect-measurement-45)
A Brand Story or comparison-chart change sends cross-sell to the brand's other ASINs, so its effect lands there as well as on the changed ASIN. (P-a-plus-content-18)
