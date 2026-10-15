# Listing signals: triggers, the offer and stock, account type

## Trigger families

- A trigger is a signal in one of the families competitor, demand, own-listing or constraint, and it marks a threat to a funnel stage; it says that a stage is threatened, not that the listing's content caused the move (P-triggers-1).

## Demand and competition

- In Search Query Performance, a fall in `searchQueryVolume` or the query totals is demand; a fall in the ASIN's `asin*Share` while totals hold is competition or the listing (P-triggers-3; P-competitor-discovery-3). The query totals (`searchQueryVolume`, `totalQueryImpressionCount`, `totalClickCount`, `totalPurchaseCount`) carry the market's own movement; the ASIN's share removes it and its raw counts do not (P-search-query-performance-6).
- Impression, click, cart-add and purchase share are each the ASIN's count over the query total, and a share that falls between two adjacent stages names the stage that dropped (P-search-query-performance-1).
- Search Query Performance holds only top queries and only search-results-page actions, so its rows do not add up to Search Catalog Performance or the Business Report (P-search-query-performance-8).
- Published research on Amazon search (Yang et al.) finds its ranking shifts with season, so impressions and sessions can drop with no listing change; query volume for the core queries over the same weeks (Search Query Performance `searchQueryVolume`, Search Terms `searchFrequencyRank`) shows whether demand moved (P-seasonality-and-events-10).
- Repriced offers can change many times a day, so competitor price and Featured Offer moves show in Keepa's history arrays and `stats`, not in two snapshots (P-triggers-5; P-competitor-set-11).
- The seller's own promotions in a window (Promotions API) confound any market or listing reading (P-triggers-22).

## Own listing and traffic

- Rising returns, or return reasons concentrated on one ASIN, point at whether the page describes the product honestly (P-returns-1).
- The buyer picks the return reason from a standard list, which Amazon says may not always accurately reflect the true return circumstances, so a `NOT_AS_DESCRIBED` or size code alone does not prove a listing cause; comments, Listing Insight or review topics that agree with it do (P-returns-15).
- A Voice of the Customer complaint such as "Inaccurate website description" is a listing trigger (P-seller-central-only-tools-10). Amazon says a fix can take several weeks to show in the Voice of the Customer metrics, depending on order volume (P-seller-central-only-tools-10; P-account-health-10).
- The effect of a return-driven fix (a size chart, compatibility, images) shows in the Voice of the Customer NCX rate and the frequently-returned badge over weeks, not in the first week's conversion (P-funnel-and-search-28).
- A converting paid search term whose words the listing lacks is a keyword-gap trigger; the search-term report has no advertised-ASIN column, so a term reaches a listing through the ad group's advertised products (P-paid-keywords-1).
- The API search-term report lists only terms that drew a click, so absence is not evidence of no impressions (P-paid-keywords-2).
- `*` rows and ASIN-shaped terms are placements and product targets, not shopper queries (P-paid-keywords-3).
- Sessions carry no source, so they cannot rule out Brand Store changes, Sponsored Brands or display, Amazon Live, tailored or claim-code promotions, or external pushes (P-off-listing-traffic-1).
- A session change without a matching change in the ASIN's Search Query Performance impressions and clicks for the same weeks is traffic from outside search (P-off-listing-traffic-2).

## Constraint triggers

- No Featured Offer on the product is a different constraint from a Featured Offer held by another seller; it shows in the offers' price against Pricing Health's references, their stock and their shippability (P-triggers-17).
- A `PRICING_HEALTH` notification or Pricing Health entry is a price problem on the seller's own offer (P-triggers-19).
- For a brand owner, a new seller on the ASIN is a constraint trigger; it shows as a new `SellerId`, an offer-count jump, or `-2` (an unknown, brand-new seller) in Keepa's Buy Box seller history, and the urgent case is a new seller holding the Featured Offer (P-triggers-25).
- Amazon sends no notice of an ASIN merge; it shows when the ASIN or parent returned differs from the one asked for (`isRedirectASIN`, `parentAsinHistory`, Catalog `relationships`) (P-triggers-24).
- A change of rank category or browse node makes the earlier rank series incomparable (P-triggers-28).
- Stranded units carry a `stranded-reason` and an auto-removal date in the stranded inventory report (P-inventory-and-fulfillment-6).
- Stock risk shows in the restock and inventory planning reports and on the capacity page as a restock alert or recommended ship date, low historical days of supply or the low-inventory-level fee flag, a below-minimum inventory level, or a capacity-limit block (P-inventory-and-fulfillment-7).
- Without a buyable offer the ASIN is unsearchable, cannot be featured and its ads stop, so a stock-out makes its window unreadable (P-funnel-and-search-9).
- A capacity block, low days of supply or a stock-out forecast marks the window a stock-out will hit (P-triggers-27).

## The offer

- `getItemOffers` returns offer counts by condition and channel and, per offer, the seller id, `MyOffer` and `IsBuyBoxWinner` (P-offer-competition-and-hijackers-1).
- A `getCompetitiveSummary` or Keepa Buy Box reading is a snapshot; share over time is Amazon's Featured Offer percentage, or Keepa's `buyBoxStats` as an approximation (P-offer-competition-and-hijackers-4).
- Amazon says an out-of-stock offer cannot be featured and names an uncompetitive price as a cause of Featured Offer ineligibility, so a falling Featured Offer share can come from the seller's own stock or price as well as from other offers (P-offer-competition-and-hijackers-6).
- Amazon states no fixed price band for Featured Offer rotation (P-offer-competition-and-hijackers-16).
- Under its commitments to the European Commission, Amazon's EU stores display a second competing offer beside the Featured Offer when an offer from a different seller is sufficiently differentiated on price or delivery, so a competitor with no Featured Offer share can still be shown (P-offer-competition-and-hijackers-17).
- Reviews are shared by every seller on the ASIN, so a "not as described" wave can come from another seller's units (P-offer-competition-and-hijackers-7).
- Amazon now says customers receive the selling seller's own inventory, so commingling is not a current cause of mixed units (P-offer-competition-and-hijackers-8).

## Stock and the delivery promise

- Live quantity is `fulfillmentAvailability` from `getListingsItem`; the `fulfillment_availability` attribute echoes the last submission (P-inventory-and-fulfillment-1; P-inventory-and-fulfillment-2).
- For FBA only fulfillable units from `getInventorySummaries` are sellable, not stranded, reserved, researching, unfulfillable or inbound ones (P-inventory-and-fulfillment-4).
- A drop that coincides with the seller's own offer being out of stock, Inactive or not shippable is an offer problem, not a content one: an ASIN without a buyable offer is unsearchable, and such an offer cannot be featured (P-inventory-and-fulfillment-3).
- On a SKU with FBA and MFN records, FBA inventory is used first and MFN inventory after it is depleted, so an FBA stock-out moves the offer to its MFN quantity and to a promise set by MFN handling time (P-inventory-and-fulfillment-16).
- The delivery promise and the Featured Offer vary with the shopper's location and Prime status, so one page view shows neither (P-inventory-and-fulfillment-18).
- Amazon's pages state a stock-out's immediate effects and say nothing of a lasting rank penalty; the practitioner claims of one carry no evidence (P-inventory-and-fulfillment-13).
- Thin stock brings slower promises, narrower availability and the low-inventory-level fee, weighed against capacity limits, excess and aged-inventory costs and placement fees: the seller's trade-off (P-inventory-and-fulfillment-19).
- A fee change after re-measurement or a tier-table change is a fee event, not a listing effect, and Amazon's measurement governs (P-inventory-and-fulfillment-20).
- A changed size tier, read from the FBA Fee Preview report, is a margin constraint, not a listing effect (P-triggers-26).

## New sellers and brand routes

- Counterfeit or trademark misuse goes to Report a Violation with a test buy, naming the specific sellers so the ASIN itself is not taken down; a changed or inaccurate page goes to Report Abuse; genuine goods sold against a distribution or MAP agreement stay outside Amazon, which does not enforce such agreements (P-offer-competition-and-hijackers-9; P-brand-protection-and-catalog-contribution-7).
- Where the seller's own write cannot fix the page, Amazon's routes are Selling Partner Support with proof (for images only the manufacturer's website URL counts), "Request product detail page change" for error `8541`, Report Abuse in Account Health for an authorised brand user's wrong contribution or a page changed into a different product, and, for a brand owner, a ticket to override Amazon's own data (P-brand-protection-and-catalog-contribution-6).
- Project Zero is for counterfeits only, and access to it depends on the report acceptance and accuracy rates stated on the Project Zero page (P-offer-competition-and-hijackers-10).
- IP reports need Rights Owner or Registered Agent, store-policy reports any Brand Registry user of the brand, Project Zero and Transparency the rights owner (P-offer-competition-and-hijackers-11).
- Transparency blocks uncoded or mismatched units and listing attempts on enrolled products in the stores it supports; it does not stop resale of genuine coded goods (P-offer-competition-and-hijackers-12).

## Account type

- A connection is either a seller (Seller Central) or a vendor (Vendor Central) account (P-vendor-and-hybrid-1).
- On a vendor connection the Listings Items path id is the vendor code owning the SKU (P-vendor-and-hybrid-2).
- On a hybrid ASIN Amazon retail and the seller both offer, so the Buy Box seller in Keepa's history may be Amazon rather than the seller (P-vendor-and-hybrid-2).
- Whether Amazon retail offers the ASIN shows in Keepa's `availabilityAmazon`, `csv[0]` and offers' `isAmazon`; who holds the Featured Offer shows in Keepa's `stats.buyBoxIsAmazon` and `buyBoxStats` (read with offers) and, on a seller connection, in `currentFeaturedOffer` from `getFeaturedOfferExpectedPriceBatch` (P-vendor-and-hybrid-3).
- The Product Pricing API is seller-only, so on a vendor connection only Keepa shows the Featured Offer holder (P-vendor-and-hybrid-3).
- `BUYABLE` does not apply to vendor listings (P-vendor-and-hybrid-5).
- A vendor's funnel is glance views and manufacturing-view ordered units; glance views count only views where Amazon retail is the featured offer, and no sessions or search-query data exist for a vendor (P-vendor-and-hybrid-17).
- Amazon sets the price of its first-party sales; a vendor's lever is cost price, which the API cannot raise for an existing item (P-vendor-and-hybrid-9).
- On a hybrid ASIN, Pricing Health's references for a seller's price include the highest recent price shipped and sold by Amazon (P-vendor-and-hybrid-10).
