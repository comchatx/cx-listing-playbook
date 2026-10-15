# What a change file records

## Schema

- A write is validated against one product-type schema, named by product type, schema version and schema checksum (P-attributes-and-browse-nodes-3).
- Amazon changes product-type metadata on a published recurring schedule, and a fetched schema holds only until the definitions change (P-triggers-11; P-listing-writes-15).
- A new issue or newly required attribute that arrives with a new schema version (`productTypeVersion.version`) is Amazon's change, not the seller's (P-amazon-change-calendar-9).

## Actor

- No Amazon API page in the package's research describes an operation that returns attribute history or the actor of a change (P-listing-writes-8).
- Amazon changes titles, Item Highlights and other content itself, so a value written through the API may not stay (P-listing-writes-9).
- Review Listings Changes, which holds Amazon's pending proposals for a brand owner, and View Change History, which shows AI-applied changes, are Seller Central screens (P-listing-writes-9).
- A brand owner's pending Review Listings Changes proposals are in Seller Central, which hands them out as an Excel template (P-seller-central-only-tools-8).
- A change Amazon has already applied shows as a difference between the Catalog attributes (`getCatalogItem`) and the seller's own `getListingsItem` attributes (P-seller-central-only-tools-8).
- A content change's actor is the seller by hand, cx, another contributor, Amazon (an AI recommendation, Review Listings Changes, Amazon-applied), or the seller's Seller Assistant or workflow (P-ai-shopping-surfaces-8).
- A content change inside a baseline or observation window that cx did not make is a confounder (P-ai-shopping-surfaces-8).
- An image that appears or changes in the Catalog set with no logged seller action is Amazon's or another contributor's change (P-images-and-video-27).

## Account, brand role and offer

- The submitting account is a seller or a vendor, and on a vendor connection the Listings Items path id is the vendor code that owns the SKU (P-vendor-and-hybrid-11; P-vendor-and-hybrid-2).
- Whether Amazon retail offered the ASIN at submission and who held the Featured Offer belong to each change (P-vendor-and-hybrid-11).
- The Product Pricing API is seller-only, so on a vendor connection Keepa alone shows these (P-vendor-and-hybrid-3).
- On a hybrid ASIN, Keepa's Buy Box seller may be Amazon (P-vendor-and-hybrid-2).
- The seller's brand role is brand owner, Brand Representative, Reseller or none, and whether a content change can win the page depends on it (P-brand-protection-and-catalog-contribution-2).
- The offer state is offer counts by condition and channel, the Featured Offer holders, and the seller's baseline Featured Offer percentage with its source (P-offer-competition-and-hijackers-2).
- The delivery promise is offer configuration that a listing-text change does not touch: the handling-time source, `lead_time_to_ship_max_days`, `merchant_shipping_group`, Shipping Settings Automation and the fulfillment channel (P-inventory-and-fulfillment-14).
- The offer state at write time is that configuration, fulfillable and inbound units, days of supply, size tier and the per-unit fee estimate, each with the report or operation it was read from and its read time (P-inventory-and-fulfillment-14).
- The vendor dataset keeps no historical catalog attributes, so a vendor ASIN's content "before" exists only as recorded at change time (P-vendor-and-hybrid-12).

## Expected range and the words bet on

- Published research on online experiments (Qubit's meta-analysis of e-commerce experiments; Kohavi and colleagues' Seven Rules of Thumb) finds that most content changes move revenue or conversion by a small amount (P-effect-measurement-38).
- Where the seller's change file holds enough verdicts of one change type, their pooled estimate is the seller's own measure of what that type moves (P-effect-measurement-38; P-effect-measurement-40).
- Amazon's published "up to" uplift claims for optimized content are marketing maxima from undisclosed internal data, and Amazon's own pages disagree on them (P-effect-measurement-2; P-description-17).
- Amazon's Store, A+ and Manage Your Experiments uplift percentages are its internal comparisons with no method shown (P-brand-story-and-store-16).
- Practitioners' published conversion and click lift figures, such as Feedvisor's, cite no source (P-images-and-video-12).
- The words a change bets on are Search Query Performance queries, spelled exactly as Amazon spells them, with the ASIN's share at each funnel stage over the baseline window (P-search-query-performance-9).
- A query picked because it was unusually strong in one week tends to come back toward its usual level, which looks like a loss (P-search-query-performance-17).
- Whether each word had paid search-term rows in the baseline window is what lets a verdict reconcile the bet against the same term's paid rows in the observation window (P-paid-keywords-7).

## Fees and claims

- A price, sale-price or coupon change's fee record is `TotalFeesEstimate`, the `FeeDetailList` lines, `TimeOfFeesEstimation`, SKU or ASIN basis, and the coupon's own fees as Amazon's dashboard shows them (P-price-position-17).
- The ASIN estimate uses catalog size (P-price-position-18).
- A fee estimate is by SKU once the item is at Amazon and by ASIN before (P-inventory-and-fulfillment-22).
- A fee estimate at a proposed price is not guaranteed (P-inventory-and-fulfillment-22).
- A price that crosses a fulfillment-fee price band is a fee change, with the band edges on Amazon's current rate card (P-inventory-and-fulfillment-23).
- A change that adds or removes a claim records the claim, the proof the seller named and the governing policy page (P-listing-policies-16).

## A+, Brand Story and description

- The live A+ document's `contentReferenceKey`, read through `searchContentPublishRecords` and `getContentDocument`, is the "before" (P-a-plus-content-4).
- A new document for an ASIN replaces the live one, a posted ASIN set replaces the whole set, an edit to an approved document returns it to review, and the old version stays live until the new one is approved (P-a-plus-content-7).
- An A+ record holds the content reference key, the full ASIN set posted, the submission time, each observed status with its time, and the time it was first seen published; the observation window opens at publication, not at submission (P-a-plus-content-6).
- A Brand Story's window likewise starts at the confirmed publish record, not at submission (P-brand-story-and-store-5).
- Amazon tells sellers to apply A+ to every ASIN in a family and does not say that A+ follows a child into or out of a variation family (P-a-plus-content-21).
- A description change records whether `EBC` A+ was published on the ASIN at write time and at window end (P-description-8).

## Stores

- An image change applies to the ASIN in every store where it exists, and is a confounder in those stores (P-marketplaces-and-languages-3).
- A global image write through the API does not override a Seller Central country-specific image set (P-images-and-video-21).
- Every change, read and effect series belongs to exactly one `marketplace_id`, so an effect series holds one store's figures (P-marketplaces-and-languages-1).
- In a Build International Listings connection, a price, sale or offer change in a source store reaches its target stores, and a manual change in a target store breaks that offer's connection (P-marketplaces-and-languages-4).
- Amazon does not say whether a hand-edited title or bullet in a target store survives later syncs or Amazon translation (P-marketplaces-and-languages-6).

## Ads

- The baseline holds the bidding strategy, placement adjustments and bid or budget rules of every campaign advertising the changed SKU (P-paid-keywords-16).
- Under dynamic or rule-based bidding the measured effect includes the ads' automatic response; under `MANUAL` bids with no ad edits in either window it is closer to the listing's own effect (P-paid-keywords-18).
- Whether bids are held fixed during a window is the seller's decision, and the record holds it (P-paid-keywords-18).
- Sponsored Products creative shows the title and automatic targeting draws on product information, so ad impressions and click-through are part of a title change's effect on an advertised ASIN (P-title-27).

## Families and deletes

- A family's "before" has two sides: the seller's (`getListingsItem` `relationships`, `searchListingsItems` `variationParentSku`) and Amazon's (Catalog `relationships`) (P-variations-1).
- A family's "before" also holds any active deal on the family (P-variations-20).
- Adding or assigning a child to a family after a deal is submitted makes the deal revalidate with the new child, which can suppress or cancel it (P-variations-20).
- Deleting a parent or a child, moving a child and changing a theme are high-risk, because the documented removal path deletes listings and a parent's deletion unlinks every child; each has a reversal path the record names (P-variations-3).
- Amazon sends no notification when a family changes; a family change shows as a difference between dated snapshots of Catalog `relationships` (`parentAsins`, `childAsins`, `variationTheme`) and `itemClassification` for the parent and children, and any difference is a family event whoever caused it (P-variations-11).
- Amazon's documented causes of a family change the seller did not write, in order: Amazon manages families and splits wrong themes; another seller contributed; a child broke from missing or inconsistent attributes, duplicate dimensions or a parent error (P-variations-13).
- A delete is irreversible: it takes the offer in that store, the item's relationships (all children's, for a parent), and the FBA link if a re-created listing lacks the same SKU and ASIN, while the ASIN, its reviews and its rank stay; Stop selling a product states the wait before the listing can be offered again (P-listing-writes-16).
- Closing keeps sales history and is described as a Seller Central action; no API page in the package's research names a close operation (P-listing-writes-17).
- A wrong product type is fixed by resubmitting the SKU with the product type Amazon suggests, and removing a parent-child relationship has no documented path but a delete (P-listing-writes-17).
- An FBA SKU without an active offer strands its units, a deleted listing disappears from every report, and Amazon creates SKUs for mislabelled or unmatched units whose units are removed if left unlisted (P-inventory-and-fulfillment-5).

## Combined changes, promotions and Amazon-side events

- Changes made together are one combined change, and the verdict is about the combination (P-effect-measurement-5).
- The seller's own promotions in either window belong to the record, because deals and coupons show in search results and on detail pages and so move click-through and conversion (P-seasonality-and-events-6).
- The Promotions API dates the seller's promotions of every type (`schedule.eventId`), and `promotionsApiMappingId` joins them to the promotion and coupon performance reports; Data Kiosk `promotion` rows match only by ASIN and dates (P-seasonality-and-events-21).
- The Promotions API only reads, so creating, editing or cancelling a deal or coupon is a Seller Central action (P-seasonality-and-events-22; P-price-position-8).
- A pending AI title recommendation in Review Listings Changes is a scheduled Amazon-side change: an unanswered proposal can apply itself when the brand owner's review period, as Amazon's announcement states it, runs out, including inside an event window (P-seasonality-and-events-19; P-seller-central-only-tools-8).
- Amazon says a price edit, listing closure, new child ASIN or other major change on an ASIN or parent with an `UPCOMING` deal can suppress, revalidate or cancel the deal (P-seasonality-and-events-17).
- The listing's coupon, deal, Prime-exclusive, strike-through, Prime and shipping-speed state on the change date shows in `getCompetitiveSummary` and Keepa (P-badges-and-placements-8).
