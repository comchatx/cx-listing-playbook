# Listing figures: which file carries each, and what Keepa's content fields mean

Each sentence ends with the research item it rests on: P-<file>-<n> is in the package's research/<angles|elements|method>/<file>.md.

## Conversion

- Unit session percentage is units ordered over sessions: the Sales and Traffic report, or `unitSessionPercentage` in the Data Kiosk sales-and-traffic dataset (P-own-traffic-funnel-1; P-bullet-points-18).
- Amazon defines unit session percentage over a period as units ordered over sessions for that period, so a figure for several days is total units over total sessions, not an average of daily percentages (P-own-traffic-funnel-10).
- "Conversion rate" names different ratios, each tied to a file and field (P-own-traffic-funnel-3):
  - unit session percentage: units over sessions (P-own-traffic-funnel-3).
  - Search Catalog Performance `conversionRate`: purchases over clicks (P-own-traffic-funnel-3).
  - Data Kiosk seller analytics `traffic.conversionRatePct`: purchases over clicks, counting only clicks and purchases that started in search (P-own-traffic-funnel-3; P-bullet-points-18).
  - Data Kiosk seller analytics `search.catalog.conversionRate`: purchases over impressions (P-own-traffic-funnel-3).
  - Manage Your Experiments: purchases per unique visitor (P-effect-measurement-24).
- `conversationRatePct` is the deprecated spelling of `conversionRatePct` (P-own-traffic-funnel-3).
- A difference between one of these fields in one window and another in the next mixes two definitions, so it does not measure a change in conversion (P-effect-measurement-24).

## Denominators and CTR

- Amazon's files use similar names for ratios over different denominators: page views, glance views, sessions, impressions or clicks (P-funnel-and-search-20).
- In Business Reports, the Detail Page Sales and Traffic view sums page views only over days with sales, while the by Child Item view sums them over the whole range (P-own-traffic-funnel-16).
- CTR is clicks over impressions (P-own-traffic-funnel-6).
- Search Query Performance's `totalClickRate`, `totalCartAddRate` and `totalPurchaseRate` divide by search query volume, so they are not CTR or conversion (P-search-query-performance-3).
- Brand Analytics search impressions, clicks and purchases count organic and Sponsored Products results on the search results page and leave out widgets (P-own-traffic-funnel-22).

## Daily series per ASIN

- The Sales and Traffic report has no ASIN-by-day table; Data Kiosk has one in `salesAndTrafficTrends` at `CHILD` and `DAY` granularity and in seller analytics grouped by ASIN and day (P-own-traffic-funnel-4).

## Featured Offer share and offer count

- Business Reports and Sales and Traffic `buyBoxPercentage` give Featured Offer share over page views (P-offer-competition-and-hijackers-3; P-seller-central-only-tools-9).
- Data Kiosk seller analytics `traffic.featureOfferPct` gives it over glance views (P-price-position-30; P-seller-central-only-tools-9).
- A series that mixes the two changes its denominator partway (P-funnel-and-search-21).
- Amazon is removing the seller eligibility requirement for the Featured Offer store by store; a store's own Becoming the Featured Offer page and Amazon's announcement date the change, and a Featured Offer share series that spans it spans two eligibility regimes (P-funnel-and-search-21).
- Sales and Traffic `averageOfferCount` is the seller's own listing count by date, not the number of sellers on an ASIN (P-offer-competition-and-hijackers-14).
- The number of offers on an ASIN by condition and fulfillment channel is `getItemOffers` `Summary.NumberOfOffers` (P-offer-competition-and-hijackers-2).

## Return rates

- Return rates come in kinds that do not compare with one another (P-returns-18):
  - overall: Returns and Recovery Insights, Data Kiosk `returnedRate` (P-returns-18).
  - fee rate: physical returns over shipped units, with returns counted over the window the returns processing fee page states (P-returns-18).
  - badge rate: the measure behind the frequently returned badge (P-returns-18).
  - NCX return rate in Voice of the Customer: orders returned for a product or listing issue over total orders (P-returns-18).
- FBA returns are in the FBA customer returns report door.md lists, and seller-fulfilled returns in the returns reports door.md lists (P-returns-3).
- Neither contains the other, and returnless refunds appear in neither seller-fulfilled report (P-returns-3).

## Reviews and ratings

- No SP-API operation returns full review text; the Customer Feedback API returns review topics and snippets (P-reviews-and-qa-1).
- `getItemReviewTopics` is called on a child ASIN with `sortBy` set to `MENTIONS` or `STAR_RATING_IMPACT`, and each topic carries metrics for the ASIN, its parent and its browse node (P-reviews-and-qa-3).
- Its data is a periodically refreshed view over several months, with the span in the reply's `dateRange` and the refresh cadence on the Customer Feedback API page, so it is not a daily signal (P-reviews-and-qa-4).
- Review topics are not Amazon's "Customers say" highlights, which Amazon generates from verified-purchase text reviews where multiple customers agree and which the seller cannot edit (P-ai-shopping-surfaces-14).
- Data Kiosk seller analytics keeps rating state as of a date (`displayRating`, `rawRating`, `totalRatingCount`) apart from reviews received in a period (`totalReviewCount`, `lowRatingReviewCount`, `criticalReviewRate`) (P-reviews-and-qa-2).

## Search terms, traffic origin, console-only data

- Search terms (`generic_keyword`) come back only in the seller's own `getListingsItem` `attributes`, as what this account submitted, not what Search indexes; Catalog Items no longer returns them (P-search-terms-9; P-search-terms-23; P-listing-content-and-health-7).
- Keepa and Catalog Items expose only public keyword attributes (item type, target audience, uses), not `generic_keyword`, so neither shows a competitor's search terms (P-search-terms-16).
- Business Reports, Search Query Performance, Search Catalog Performance and the Data Kiosk sales-and-traffic and seller-analytics datasets have no field for traffic from a shopping assistant, and Brand Analytics impressions are defined on the search results page (P-ai-shopping-surfaces-5).
- Suppression, Detail Page Sales and Traffic by parent or child, Product Opportunity Explorer's review and return topics, and the seller's own content each have an API source: Listings Items `issues`, the Sales and Traffic report or Data Kiosk, the Customer Feedback API, `getListingsItem` (P-seller-central-only-tools-2).
- Repeat purchase and market basket data are in the Brand Analytics reports door.md lists, which answer only for a Brand Registry seller with the Brand Analytics role (P-own-traffic-funnel-20).
- Demographics, Customer Loyalty Analytics, Category insights and ASIN Benchmarking exist only as the console screen or its export (P-own-traffic-funnel-20).
- Amazon's `BRANDED_ITEM_CONTENT_CHANGE` notification tells a brand owner that content on a branded ASIN changed, and says only that some content changed, not what (P-description-13; P-images-and-video-10).
- Amazon's content-change and other event signals reach only an AWS destination, so a watch from the box sees a change as a difference between dated reads (P-triggers-12).

## Keepa: listing content

- Neither Keepa nor Amazon's APIs keep a history of a competitor's title, bullets, description, images or A+, so a change to them shows only as a difference between two dated copies (P-competitor-set-8).
- Keepa carries a listing's title in `title` and `itemHighlights`, and its parent's in `parentTitle` and `parentHighlights` (P-title-17).
- Amazon may split an over-long submitted title into the title and Item Highlights, so the title is the two read together, and where the split falls may be Amazon's rather than the competitor's wording (P-competitor-set-10; P-competitor-set-9).
- Bullets are in Keepa `features` or Catalog Items `attributes` (P-bullet-points-15).
- `description` and `aPlus` are current snapshots with no history field (P-description-14; P-a-plus-content-14).
- `aPlus[].fromManufacturer` marks vendor A+, which sits under "From the Manufacturer"; Amazon says vendor A+ in most cases appears in place of seller A+, and the seller cannot add or edit A+ on such an ASIN (P-description-4; P-a-plus-content-16).
- Keepa carries a listing's images as `images` filenames, and its video in `videos` when the request included videos (P-images-and-video-10).

## Keepa: other listing fields

- `monthlySold` is Amazon's bracketed "bought in past month" count of customers who bought, across all sellers and excluding returns and cancellations, per variation except on a parent shown with a price range, where it covers the family (P-badges-and-placements-4; P-competitor-set-15).
- An absent `monthlySold` is not zero sales (P-competitor-set-15).
- `listedSince` is first listed as far as Keepa can tell; absent means unknown, and Catalog `releaseDate` is not a listing date (P-competitor-discovery-6).
- `parentAsinHistory` and the parent's `variations` show a family's split or merge (P-variations-9).
- `brandStoreUrl` shows whether the byline leads to a Brand Store, as present state with no history (P-brand-story-and-store-10).
- Amazon's retail offer shows in `availabilityAmazon`, `csv[0]` and offers' `isAmazon` (P-vendor-and-hybrid-3).
- Keepa shows the Featured Offer holder in `stats.buyBoxIsAmazon` and `buyBoxStats`, and on a seller account the Product Pricing API's `getFeaturedOfferExpectedPriceBatch` reply also returns `currentFeaturedOffer` (P-vendor-and-hybrid-3).
- On a vendor account only Keepa shows the Featured Offer holder, because the Product Pricing API is seller-only (P-vendor-and-hybrid-3).
- `csv[17]` (`COUNT_REVIEWS`) is the count history that Keepa's API documentation calls "rating count history" and its Java client calls "review count history", so Keepa's documents leave open whether it counts ratings or written reviews (P-reviews-and-qa-16; P-reviews-and-qa-20).
- Its last data point and `lastRatingUpdate` show how fresh it is (P-reviews-and-qa-20).
- Keepa documents its variation-specific `reviews.ratingCount` as no longer updated (P-reviews-and-qa-19).
- Keepa's integer `productType` is not Amazon's product type; classification shows in `itemTypeKeyword` and `categoryTree` (P-attributes-and-browse-nodes-12).
- Keepa's out-of-stock percentages say whether any offer of a price type existed, not a competitor's own stock (P-inventory-and-fulfillment-11).
- Keepa redefined its NEW, USED, COLLECTIBLE and REFURBISHED price slots from listing price to landing price on a date its Product Object documentation gives, so a series straddling that date mixes two definitions (P-competitor-set-18).
- Keepa's `/deal` endpoint lists price and rank changes, not Amazon promotions; deal badges are in the product's `deals` field (P-seasonality-and-events-8).
