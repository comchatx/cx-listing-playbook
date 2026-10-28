# Reading the Featured Offer

Facts cite P-<file>-<n> in research/<angles|elements|method>/<file>.md; pointers cite none.

## Amazon's reads

- `getFeaturedOfferExpectedPriceBatch` takes up to 40 requests by SKU, and `getItemOffersBatch` and `getCompetitiveSummary` up to 20 by ASIN (P-featured-offer-6).
- Each operation's default rate is in its Usage Plan table, and the applied rate is in `x-amzn-RateLimit-Limit` when the reply carries it (P-featured-offer-6; P-sp-api-access-11).
- A FOEP `resultStatus` may take values beyond `VALID_FOEP`, `NO_COMPETING_OFFER`, `OFFER_NOT_ELIGIBLE`, `OFFER_NOT_FOUND` and `ASIN_NOT_ELIGIBLE` (P-featured-offer-5).
- Only the seller's own offer carries a `sku` in a FOEP reply's `offerIdentifier` (P-featured-offer-5).
- A FOEP reply's `offerIdentifier.sellerId` on the seller's own offer is one of the routes to the seller id; Keepa's Buy Box seller is not (P-sp-api-access-3).
- `getItemOffers` returns counts by condition and channel for every offer and a capped list of individual offers, so a seller priced above the list's cheapest shows in the counts alone (P-offer-competition-and-hijackers-1).
- `getCompetitiveSummary` with `featuredBuyingOptions` segments the holders by Prime, non-Prime and default, and may carry a competing offer's live promotions (P-offer-competition-and-hijackers-4; P-price-position-11).
- The business featured offer is read through Product Pricing v0 with the business customer type; `getCompetitiveSummary` returns consumer offers only (P-price-position-23).
- `getListingsItem` with `summaries`, `issues` and `fulfillmentAvailability` gives `BUYABLE` and `DISCOVERABLE`, the issues, and the live quantity (P-inventory-and-fulfillment-1; P-inventory-and-fulfillment-2).
- For FBA, fulfillable units are those `getInventorySummaries` with `details=true` counts as fulfillable; stranded, reserved, researching, unfulfillable and inbound units are not sellable (P-inventory-and-fulfillment-4).
- `getMarketplaceParticipations` gives `hasSuspendedListings` per store, an account-level Inactive status that explains every listing there at once (P-sp-api-access-14).
- The Seller Performance Report carries the account's status and policy metrics, each with Amazon's own target (P-account-health-3; P-account-health-11).

## Shares over a window

- Business Reports and `GET_SALES_AND_TRAFFIC_REPORT` measure the Featured Offer percentage over page views (`buyBoxPercentage`) (P-offer-competition-and-hijackers-3).
- Data Kiosk's `featureOfferPct` measures it over glance views (P-offer-competition-and-hijackers-3).
- Keepa's `buyBoxStats.percentageWon` is Keepa's approximation of each seller's share over the stats interval (P-offer-competition-and-hijackers-4).

## Push signals

- `ANY_OFFER_CHANGED` and `PRICING_HEALTH` reach only an AWS destination, so a watch from the box reads state on its cadence (P-triggers-12; P-offer-competition-and-hijackers-13).
- `ANY_OFFER_CHANGED` with `OfferChangeType` `External` is a change of the competitive price threshold, not a new seller on Amazon (P-offer-competition-and-hijackers-13).

## EU stores

- In an EU store a second offer may show beside the Featured Offer, so a competitor's share is not read as zero without checking it (P-offer-competition-and-hijackers-17).
