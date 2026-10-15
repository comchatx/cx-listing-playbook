# Watching a listing

Each sentence ends with the research item it rests on: P-<file>-<n> is in the package's research/<angles|elements|method>/<file>.md.

## The standing instruction

- The standing instruction states what is watched (ASINs, the competitor set, and which trigger families: competitor, demand, own-listing, constraint), how often, the seller's own thresholds, when to speak, when to stay quiet (quiet hours, sale windows, changes already reported) and where to report (P-triggers-13; P-triggers-1).
- Jungle Scout's and Helium 10's alert tools let the user choose what to watch, how often to be told, and a time frame with no alerts (P-triggers-13).
- The package supplies no default threshold (P-triggers-13).
- Google's SRE book holds that every page should be actionable and about a novel problem (P-triggers-14).
- On a listing, such signals include a suppression, a lost Featured Offer, a stock-out and a content change nobody on the seller's side made (P-triggers-14).

## What copy does not fix

- No content change fixes a suppression, an offer ineligible for the Featured Offer on price, or a stock-out (P-triggers-2).
- An ASIN that is a parent ASIN, has no browse node, has no buyable offer, has a future launch date or is search-suppressed does not appear in search, and no copy change fixes that (P-funnel-and-search-3).

## False alarms

- A watch's false-alarm rate is a design choice, and across many watched series (ASINs times metrics) false alarms add up, so a per-metric threshold does not bound the whole watch (P-triggers-29).
- Benjamini and Hochberg's false discovery rate controls the expected share of false rejections among all rejections across many simultaneous tests (P-triggers-29).
- A control chart's limits are computed from the watched series' own data, so a metric's limits for one ASIN are not another ASIN's (P-triggers-29).
- Plain binomial control limits on a rate over many sessions (conversion, Featured Offer percentage) are too narrow when the rate itself drifts (P-triggers-30).
- The NIST/SEMATECH e-Handbook's p-chart model assumes that successive units are independent (P-triggers-30).
- Minitab states that a Laney attributes chart sets wider limits than a traditional one when the rate is overdispersed (P-triggers-30).

## Cadence and source refresh

- Brand Analytics reports cover whole periods whose bounds the report schema defines; door.md (the amazon-sp-api skill's references/door.md) holds those period rules (P-triggers-8).
- Data Kiosk's daily seller analytics is ready when the Seller Analytics Dataset Use Case Guide states, and a look more often than its source refreshes reads the same data again (P-triggers-8).
- A Seller Central tool refreshes on the cadence Amazon's page for that tool states: Experiment results for Manage Your Experiments, the Business Reports FAQ for Business Reports, Get product ideas with Product Opportunity Explorer for its niches, and Voice of the Customer: A Seller's Guide for VOC (P-seller-central-only-tools-3).

## Pull, not push

- Amazon's hourly and event signals (offers, pricing health, content, listing issues, hourly traffic and sales) arrive only as push notifications to an AWS destination, so a watch from the box pulls state on its cadence (P-triggers-12).
- In Amazon's words, `ANY_OFFER_CHANGED` with `OfferChangeType` `External` means "The CompetitivePriceThreshold in the Summary object has changed, triggered by a new offer from a non-Amazon seller"; it does not signal a new seller on Amazon (P-offer-competition-and-hijackers-13).
- For a verified brand owner, `BRANDED_ITEM_CONTENT_CHANGE` is the push notification sent when the title, description, bullet points or images of a branded ASIN change, and it names which attributes changed, not to what or by whom (P-brand-protection-and-catalog-contribution-9).
- Without it, a change nobody logged shows as a difference between the re-read Catalog item and the "after" in the change file (P-brand-protection-and-catalog-contribution-9).

## Account and stock

- The Seller Performance Report carries the metrics of the Account Health dashboard (P-account-health-11).
- `getMarketplaceParticipations` returns `isParticipating` and `hasSuspendedListings` per store, and Amazon defines `hasSuspendedListings` as true when the seller's Listing Status is set to Inactive (P-account-health-11).
- Stock-out precursors are a restock alert or recommended ship-by date, low historical days of supply or the low-inventory-level fee flag, a below-minimum inventory level, and a capacity-limit block, in the restock and inventory planning reports and on the capacity page (P-inventory-and-fulfillment-7).
- They are stock risk, not a fault in the listing (P-inventory-and-fulfillment-7).
- Stranded units carry a `stranded-reason` and an auto-removal date in the stranded inventory report (P-inventory-and-fulfillment-6).
- A capacity block, low days of supply or a stock-out forecast points to a stock-out ahead, and a stock-out that lands in a content test's window confounds the test (P-triggers-27).

## The competitor set

- `getCompetitiveSummary` with `includedData` `similarItems` returns Amazon's list of ASINs comparable to an item (P-competitor-set-3).
- The competitor set is the seller's named rivals plus the `similarItems` candidates the seller has confirmed (P-triggers-15; P-competitor-set-3).
- A comparison group is chosen on data from before the change and is valid only for units the change did not affect (Brodersen et al.), so a set altered inside an observation window is not that window's comparison, and a re-pick is a new, dated version of the set (P-competitor-set-6).
- An entrant that arrives on the core terms during a window is a confounder of that window, not a new member of its control (P-competitor-discovery-13).
- Amazon's Acceptable Use Policy forbids aggregating data across Authorized Users' businesses to provide or sell to any party (4.4) and disclosing it to other application users (4.6), so competitor data from one seller's connection serves only that seller (P-competitor-set-20).

## Seller Central-only tools

- MYE results, the Review Listing Changes proposal queue, View Change History, the Enhance tab's suggestions, Seller Assistant answers, Voice of the Customer, Product Opportunity Explorer niche metrics and A+ performance views have no SP-API read; they arrive as files the seller puts in the tree (P-seller-central-only-tools-1).
- Store insights, followers and the Store quality rating come from the Amazon Ads API or the seller's console, not SP-API (P-brand-story-and-store-12).
- A pasted A+ "Content quality analysis" is seller-supplied evidence (P-a-plus-content-17).
- A Seller Central screen's figures hold for the marketplace and the date range or as-of time the screen shows, and a copy of it is as old as its capture (P-seller-central-only-tools-3).
- Amazon hands some of these tools out as files: the Review Listing Changes Excel template, the Business Reports CSV, the Category Listings Report and the suppressed listings report (P-seller-central-only-tools-4).
- An Amazon-generated file carries Amazon's own figures; a screenshot or typed figures are a copy of them (P-seller-central-only-tools-4).
- A Seller Assistant answer is an AI answer Amazon says to verify, not a Seller Central figure (P-seller-central-only-tools-5).
- Amazon locks the experimental content while an MYE experiment runs, and any change on that ASIN during it confounds the result (P-seller-central-only-tools-6).
- An MYE result is in Amazon's terms (probability one version is better, credible interval, units, sample size), and its projection ignores seasonality and price (P-seller-central-only-tools-7).

## Events and peak deadlines

- A window that contains a major Amazon sale, its early-deal days included, is not comparable with one that does not, and the dates are in Amazon's announcement (P-triggers-10).
- An observation window that runs into an event's early-deals run-up contains the event (P-triggers-10; P-seasonality-and-events-15).
- A change's observation window opens on the date a read-back shows the change live, not the date it was submitted (P-seasonality-and-events-15).
- Amazon's search glossary states how long a change takes to go live, and says that latency depends on website traffic volumes (P-seasonality-and-events-15).
- Amazon's FBA holiday guide places listing-content work (A+ content, listing A/B tests) in an earlier phase before a peak than coupon and promotion creation; the phases are read from the guide (P-seasonality-and-events-4).
- eComEngine and Seller Labs lock listing plans ahead of a major sale (P-seasonality-and-events-4).
- A+ content passes the review time Amazon's A+ guide states, which the guide says is longer during periods of high volume and runs again when a rejected document is resubmitted, and then the publishing time the guide states (P-seasonality-and-events-16).
- Running a deal does not secure the Featured Offer, and Amazon ties event stock and the Prime badge to arrival dates (P-seasonality-and-events-29).
- In announced peak inbound periods, the inbound cut-off dates in the current season's peak readiness playbook are the last dates for FBA stock to be Prime-badge-ready for the event (P-inventory-and-fulfillment-26).
- Event deal submission timelines are in Seller Central (the Prime Day readiness playbook that Amazon's Prime Day | Sell on Amazon page links to), and a missed deadline or a rating drop can keep a planned event deal from running (P-seasonality-and-events-11).
- Coupons and price discounts are floored on the seller's feedback rating, deals on the seller's overall rating, and each also on the product's star rating (P-badges-and-placements-14).
- The floors are on Coupon eligibility criteria, Amazon deals and Price discounts; Amazon changes them, and its coupon pages disagree on the coupon floor (P-badges-and-placements-14; P-seasonality-and-events-26).
- The floor that applies to an ASIN is the one the Seller Central creation flow reports when the promotion is created, as the seller relays it (P-badges-and-placements-14).
- Deal and Prime-exclusive eligibility is by Amazon's invitation (P-badges-and-placements-14).
