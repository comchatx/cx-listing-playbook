# Effect review design

*Citations: P-<file>-<n> names a position in the package's research/<angles|elements|method>/<file>.md.*

## Manage Your Experiments

- Manage Your Experiments (MYE) is Amazon's randomized A/B test for an eligible ASIN when the seller is a Brand Representative, and a randomized result is stronger evidence than any before/after reading (P-effect-measurement-1).
- It tests images, title, bullets, description and A+ content (P-effect-measurement-1). It also supports Brand Story (P-brand-story-and-store-17).
- MYE's durations, thresholds and result wording are stated on Amazon's MYE pages and the seller's MYE dashboard (P-effect-measurement-2; P-bullet-points-14).
- To-significance runs and auto-publish of the winner exist only for title, image and bullet experiments (P-description-27).
- MYE has no API (P-images-and-video-13). Its result reaches the box only through a file or words from the seller (P-effect-measurement-3).
- A result carries the probability that one version is better and each version's sample size; a large imbalance between the sample sizes is a reason to doubt it (P-effect-measurement-3).
- Amazon's MYE page names conversion-side metrics, not click-through (P-title-20). Amazon says experiments do not affect search ranking, so a result is the content's effect on shoppers who reached it, not a forecast of exposure or rank (P-effect-measurement-27). Amazon's projected impact for an MYE result ignores seasonality and price (P-seller-central-only-tools-7). A result from an experiment that spanned an event covers that event period (P-seasonality-and-events-20).
- Amazon locks the experimental content while an experiment runs, and a running experiment excludes any other on that ASIN (P-seller-central-only-tools-6).
- A running experiment splits what shoppers see, so it confounds a before/after reading of any other change on that ASIN while it runs or auto-publishes (P-a-plus-content-13; P-effect-measurement-4).
- An A+ winner is not auto-published, so its publication is a new change (P-a-plus-content-13).

## When the observation window opens

- The window opens when Amazon shows the change, not when the write was accepted (P-effect-measurement-7).
- The change shows first in `getListingsItem`, which holds the new value with no `ERROR` issue, and then in `getCatalogItem` (P-effect-measurement-7).
- An image change is live when the Catalog read-back shows the new image; the processing and display delay on Amazon's image pages is not a go-live signal (P-images-and-video-19).
- An A+ window opens at publication, and a Brand Story window at the confirmed publish record, not at submission (P-a-plus-content-6; P-brand-story-and-store-5).
- Amazon's pages state different go-live windows for different kinds of change; each is an allowance before exposure is read, not proof that the change is live (P-funnel-and-search-15).
- Amazon's search glossary says its stated latency can be slower or faster (P-search-terms-11).
- For a bullet change, the search latency is the general one in Amazon's search glossary, not the figure on the title page (P-bullet-points-17).
- For an exposure or click-through reading, the window starts with the first whole Sunday-to-Saturday week that begins after the search latency has run (P-effect-measurement-7).
- When the Catalog value differs from what was submitted, or Amazon changes the listing during the window, the window does not measure the submitted change (P-effect-measurement-8).

## Whole aligned weeks

- Baseline and observation windows are whole weeks with matching weekdays, and when a window touches a seasonal swing the seller's same weeks last year are read alongside it, an interval `getOrderMetrics` covers (P-seasonality-and-events-5).
- Exposure and click-through readings use Search Query Performance's own weekly periods; door.md (the amazon-sp-api skill's references/door.md) holds the period rules (P-effect-measurement-9).
- All series for one change share one calendar: weeks run Sunday to Saturday and days are cut in the marketplace's time zone (P-effect-measurement-25).
- `getOrderMetrics` takes `firstDayOfWeek` and `granularityTimeZone`, so its weeks and days can follow that calendar over an interval of whole days (P-effect-measurement-25).
- Data Kiosk and Sales and Traffic stay on the same dates only when their requested dates already fall on that calendar; door.md holds the Sales and Traffic period rules (P-effect-measurement-25).

## Unfinalized days and nulls

- A day Amazon has not finalized is not yet data, and a null is missing, not zero (P-effect-measurement-10).
- A Sales and Traffic period ending in the future is partial, a delayed Data Kiosk day is `null`, and returns arrive late (P-triggers-9).
- A baseline read while its last days were still unfinalized can differ from the same baseline read when the verdict is written (P-own-traffic-funnel-9).

## Baseline

- Where history allows, the baseline runs long enough to show the series' trend (P-effect-measurement-33).
- A trend in the baseline carries into the expected "no change" path and widens the uncertainty, and a short baseline that looks flat is no proof of parallel movement (P-effect-measurement-33).

## Which metric each change moves

- The seller-analytics `conversionRatePct` counts search-originated clicks only, so it cannot isolate a change on the detail page, while `unitSessionPercentage` is units ordered over all sessions (P-bullet-points-18; P-a-plus-content-12).
- A title change targets exposure and click-through, so it shows in query-level impressions and clicks plus sessions and orders, not in conversion rate alone (P-title-11).
- A main-image change shows in the ASIN's search click rate and per-query click share against impression share; those counts include Sponsored Products results, so an ad change in the window confounds them (P-images-and-video-11).
- A gallery or video change shows in conversion and orders, with each conversion figure defined by the schema of the source read (P-images-and-video-11).
- A bullet change shows in unit session percentage with orders (P-bullet-points-18).
- A description change shows in sessions and `unitSessionPercentage` from Sales and Traffic, and the dataset splits sessions by device (`browserSessions`, `mobileAppSessions`) but not `unitSessionPercentage` (P-description-29).
- An A+ change shows in unit session percentage over all sessions, together with orders, from the same source in both windows (P-a-plus-content-12).
- For a seller with the Brand Representative role, a search-terms change shows in Search Query Performance's `asinImpressionCount` and `asinImpressionShare` for the targeted queries, plus orders (P-search-terms-14).
- Without the Brand Representative role no per-query exposure report exists for the ASIN, so a search-terms review rests on the seller's own orders and sessions and usually ends "cannot tell" (P-search-terms-27).

## Controls and their limits

- The control's same-period movement is taken out before the listing's own movement is read, and query search volume for the core queries is the cleaner control for demand (P-effect-measurement-12).
- Competitors compete for the same shoppers as the changed listing, so their movement may be partly caused by the change, which breaks the control assumption the method rests on (P-competitor-set-17).
- A control ASIN that shows a sign of reaction to the change contaminates the comparison (P-competitor-set-26).
- Click-through depends on position and the other results on the page, so the competitor set's same-period movement comes out before a click-through change is credited (P-funnel-and-search-12).
- Competitor deals and coupons in the window show in Keepa `deals` and `couponHistory` and in `getCompetitiveSummary` `promotions` (P-seasonality-and-events-7).
- A competitor with its own listing change, deal or stock-out in the window is no control for that window (P-effect-measurement-37).
- The competitor set is written down before the change and does not change inside its window; a re-pick is a new, dated version, and an entrant on the core terms during the window is a confounder, not a control (P-competitor-set-6; P-competitor-discovery-13).
- A competitor's change that began before the change went live is a confounder, one that began after it is a possible reaction, and its date tells which (P-competitor-set-27).
- Across an Amazon change rolled out on different dates for different sellers, categories or stores, the pre-period relation between the listing and its controls no longer holds (P-amazon-change-calendar-3).
- ASINs in the changed ASIN's variation family share its parent content, so they are not controls for it (P-effect-measurement-34).
- When the treated ASIN, the seller's untouched ASINs and the competitor set break in the same week, the break is a market or Amazon-side shock and the verdict is "cannot tell" (P-effect-measurement-37).
