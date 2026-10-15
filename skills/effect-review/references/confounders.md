# Confounders of a listing change's effect

Each sentence ends with the research item it rests on: P-<file>-<n> is in the package's research/<angles|elements|method>/<file>.md.

## Price and the Featured Offer

- Own price, Featured Offer share, promotions and deals, stock, review count and rating, ads, the competitor set's price, deal and stock-out events, and major sales can each move the metrics a listing change targets (P-effect-measurement-14).
- On price that means own and sale price, any coupon, deal or discount, the displayed reference price, and the competitors' prices and promotions (P-price-position-13).
- A new seller on the ASIN, a change of Featured Offer holder or a fall in the seller's Featured Offer percentage inside a window can move any stage that depends on the offer (P-offer-competition-and-hijackers-5).
- Across a store's Featured Offer eligibility switch a formerly ineligible seller's share can rise with no listing change (P-triggers-20).
- Featured Offer % in Business Reports and Sales and Traffic counts page views; Seller Analytics `featureOfferPct` counts glance views (P-amazon-change-calendar-5).
- The yearly fee change, dated in that year's fee announcement, can move competitor prices around it (P-amazon-change-calendar-12).

## Major sales

- A window overlapping an announced major sale, its early-deals run-up or its ramp-down carries event demand, and a change written inside it cannot be told from the event (P-seasonality-and-events-1; P-seasonality-and-events-14).
- Amazon moves each event's month, length and per-country dates; they are on Amazon's announcement pages for each marketplace, and where an Ads source exists the Sponsored Products events list (`/sp/v1/events`) gives events with a suggested date range (P-seasonality-and-events-2; P-seasonality-and-events-28).
- A major sale shows as a sitewide event Amazon announced for the marketplace, or as Keepa `deals` with an event `dealType` such as `PRIME_DAY` across the seller's or competitors' ASINs (P-seasonality-and-events-3). Keepa adds new `dealType` values at any time, and a deal's `badge` holds the badge text as shown on the product page (P-seasonality-and-events-3).
- Best Sellers Rank weighs recent sales, so an event's rank or `monthlySold` jump is event demand (P-seasonality-and-events-9).
- Practitioners disagree on the after-event shape: Seller Labs and eComEngine describe a halo, and Perpetua describes a conversion dip; the seller's own daily orders around past events show the shape for an ASIN (P-seasonality-and-events-12).
- Subscribe & Save orders started in an event are its tail, and promotion discounts stack on S&S, so for an enrolled ASIN the weeks after an event still carry event orders (P-seasonality-and-events-30).
- Data Kiosk `yearOverYear` matches ISO week or calendar month, so when an event moved between years the calendar-aligned difference sets event days against ordinary days (P-seasonality-and-events-23).
- Published research on benefit recipients finds spending rises after the monthly payment and falls through the month (Stephens; Hastings and Washington), and neither study is about Amazon (P-seasonality-and-events-24). Two short windows of which only one holds a month start can differ by that cycle (P-seasonality-and-events-24).
- Holiday returns are incomplete until Amazon's extended return date passes and its return data catches up (P-seasonality-and-events-13).
- Amazon's programmatic review request for an order runs inside a window after delivery that the Solicitations API page states, so an event's orders can draw review requests after the event ends (P-seasonality-and-events-25). Coupon purchases may not carry the Verified Purchase badge (P-seasonality-and-events-25).

## Ads

- Data Kiosk Economics `ads` holds ad spend per product per day, without impressions, clicks, terms, bids or attributed sales (P-effect-measurement-23; P-paid-keywords-9).
- Amazon's pages disagree on the role that dataset needs; the first `createQuery` under the seller's credential settles it, and where it is refused ad spend is unread (P-effect-measurement-23; P-seasonality-and-events-27).
- Dynamic and rule-based bids follow Amazon's estimate of conversion likelihood, so part of the ad response can be a consequence of the listing change, and subtracting it biases the estimate of the change's total effect (P-paid-keywords-17). A person's bid, budget, target, negative, campaign-state or strategy edit is not a consequence of the change (P-paid-keywords-17).
- Under `MANUAL` bids with no manual edits the measured effect is closer to the listing's own; under dynamic bidding it includes the ads' response (P-paid-keywords-18).
- Search Query Performance and Search Catalog Performance count organic and Sponsored Products results from the search results page, exclude widgets, and do not say whether Sponsored Brands or Display count (P-funnel-and-search-19; P-own-traffic-funnel-22).
- Amazon does not split those counts, so an ads change on the same queries moves the "search" figures (P-paid-keywords-11; P-search-terms-26; P-effect-measurement-28).
- Amazon advises against comparing Brand Analytics metrics with same-named figures in advertising dashboards or other reports (P-paid-keywords-19; P-search-query-performance-4).
- Sponsored Products and Sponsored Brands campaigns are auto-enrolled in Sponsored prompts, charged as CPC from the store's general-availability date in Amazon Ads' announcement, and Economics `ads` does not separate prompt spend (P-ai-shopping-surfaces-7; P-amazon-change-calendar-11).
- Sponsored Brands and display attributed conversions are counted under different view-attribution rules before and after the date on Amazon's View Attribution Updates for Amazon Store ads page (P-off-listing-traffic-8).

## Stock and delivery

- Without a buyable offer the ASIN is unsearchable, cannot be featured, and its ads stop (P-funnel-and-search-9).
- A stock-out's costs are nonlinear and reach past the stock-out days, so a matching stock-out in the baseline does not cancel one in the observation window (P-inventory-and-fulfillment-9).
- The effect of a stock-out or a delivery-promise change can outlast it, and an offer change shows in search only after the offer-change latency stated on Amazon's Search optimization page (P-funnel-and-search-33).
- Handling time, shipping template, Shipping Settings Automation and fulfillment channel set the delivery promise, so a change in any of them inside a window changes the promise (P-inventory-and-fulfillment-9).
- Amazon withholds the Seller Fulfilled Prime badge on slow promises and disables Prime offers after repeated misses (P-inventory-and-fulfillment-17).
- Past daily stock is in the Inventory Ledger, not in today's snapshot (P-inventory-and-fulfillment-8).
- The changed-since query of `getInventorySummaries` misses inbound changes (P-inventory-and-fulfillment-12).
- Search Catalog Performance splits impressions and purchases by delivery-speed message, and Search Query Performance has the same split by query, so a shift between windows in the share carrying a fast message is a delivery-promise effect, not a content effect (P-inventory-and-fulfillment-10).

## Content others changed

- A title can change through an AI recommendation, another contributor, Amazon's data or an experiment's auto-published winner (P-title-10).
- A Catalog title can differ from the submitted one under modular-title reconciliation or Amazon's rewrites of non-compliant titles (P-amazon-change-calendar-7).
- Images can appear or change with no seller action (P-images-and-video-27).
- Catalog Items and Keepa hold current content, not history, so from the box an outside content change shows only as a difference between dated copies (P-effect-measurement-26; P-brand-protection-and-catalog-contribution-9).
- For a brand owner Amazon announces content changes on its branded ASINs through the `BRANDED_ITEM_CONTENT_CHANGE` notification, a push that reaches only an AWS destination (P-description-13; P-brand-protection-and-catalog-contribution-9).
- A title submitted with "Create A/B experiment on product name" ticked is a Manage Your Experiments test, whose auto-publish or end is a second change (P-effect-measurement-26).
- An A+ publish, edit or suspension changes the description slot (P-description-9).
- A Brand Story publication or replacement reaches every ASIN it is applied to, siblings used for comparison included (P-brand-story-and-store-7). Its cross-sell lands on the brand's other ASINs (P-a-plus-content-18).
- A Store republished or relaunched in either window can move sessions and conversion (P-brand-story-and-store-14).

## Amazon-side changes

- Amazon-side changes are dated in the SP-API Release Notes, the Deprecation Schedule and Amazon's announcements (P-amazon-change-calendar-1).
- An Amazon-side change can reach the listing's targeted metric, and Amazon's reads can show it did not apply to the listing, as with a title that was already compliant or a family whose theme still shares reviews (P-amazon-change-calendar-2).
- Click-through across the start of Item Highlights under titles compares two layouts (P-amazon-change-calendar-8).
- A retired dataset version or a deprecated field such as `conversationRatePct` ends a series (P-amazon-change-calendar-13).

## Reviews and families

- A child's rating or count can change with no new reviews through review sharing, cross-store display, removal or separation of merged products (P-reviews-and-qa-17).
- The seller's notice email or Seller Assistant shows whether the family shares reviews (P-amazon-change-calendar-6; P-reviews-and-qa-9).
- Keepa states that its `reviews.ratingCount` history stopped updating, so a flat stretch in it is not an absence of new ratings (P-reviews-and-qa-19; P-amazon-change-calendar-10). Keepa's own documents give the `csv[17]` series two different names (P-amazon-change-calendar-10).
- A child added, removed or re-parented, a theme change, a split or merge, or a review-pool change can move parent-level figures (P-variations-12; P-variations-8). Sales and Traffic also gives figures at child level, through the option door.md lists (P-variations-8).
- MerchantSpring's help says child sessions do not add up to a parent figure (P-own-traffic-funnel-8).

## Account, catalog and badges

- A deactivated offer, a removed or suppressed listing, or an account status change inside a window moves the listing's figures for a reason in the account layer, not in its content (P-account-health-8).
- A product type switch, browse node change or browse-tree change can move exposure (P-attributes-and-browse-nodes-11).
- A deal, coupon, Prime, delivery, return or sales-trend badge gained or lost on the listing or a competitor can move clicks and conversion (P-badges-and-placements-9).

## Amazon retail

- Amazon retail's presence, stock or Featured Offer share can move every offer-dependent metric (P-vendor-and-hybrid-13).
- On a hybrid ASIN sessions count the page whoever is featured, while the seller's Featured Offer share counts its own featured views (P-vendor-and-hybrid-14).
- Vendor glance views count only views where retail is the featured offer, so they neither compare with nor add to seller sessions or page views (P-vendor-and-hybrid-15).

## Off-listing campaigns

- A Brand Tailored Promotion changes price and badge for an audience with no listing write and no ASIN-level report (P-off-listing-traffic-5; P-brand-story-and-store-13).
- A livestream or a Sponsored Brands or display campaign can raise branded search queries in Search Query Performance, and the Ads reporting columns carry `brandedSearches` for Sponsored Brands and display report types (P-off-listing-traffic-9).
- A burst of externally discounted orders moves rank and units with no listing change, and Amazon's seller code of conduct forbids manipulating sales rank with such orders (P-off-listing-traffic-11).
- Sales reported by Amazon Attribution, Store insights, Live or ads are attributed sales; attribution does not show that they were incremental or caused (P-off-listing-traffic-7).
- Brand Referral Bonus and Attribution cover only Attribution-tagged outside clicks (P-off-listing-traffic-14).
- Amazon's Store and Live visitor-versus-non-visitor figures are observational, and published research on advertising experiments at Facebook (Gordon et al.) finds observational methods often fail to recover the experiments' effects (P-off-listing-traffic-13).

## Stores and EU rules

- An image change applies in every store holding the ASIN (P-marketplaces-and-languages-3).
- Build International Listings prices move with exchange rates or a source-store sale (P-marketplaces-and-languages-5).
- An EU store states a discount against its own lowest recent price over the reference period its Price discounts page names, not a Was Price (P-marketplaces-and-languages-14).
- In an EU store, returns can arrive over at least the statutory withdrawal period after delivery, or over the store's longer return window where its returns page states one, and Amazon's return data lags behind that (P-marketplaces-and-languages-15).

## Segment mix

- A pooled ratio moves when the B2B share or the browser-versus-app share of sessions moves, even when no part moved, and Sales and Traffic gives the B2B split (P-effect-measurement-42).
- `unitSessionPercentage` is units over sessions, while Seller Analytics `conversionRatePct` and its deprecated spelling `conversationRatePct` are search purchases over search clicks (P-own-traffic-funnel-3).

## Amazon's assistant

- Amazon's assistant usage figures describe shoppers who chose the assistant, not listings (P-ai-shopping-surfaces-15).
- No read separates assistant traffic, so its effect shows only in blended detail-page metrics and orders (P-ai-shopping-surfaces-6).
- The assistant shows the lowest Featured Offer price history, so a baseline price move stays visible (P-ai-shopping-surfaces-16).
