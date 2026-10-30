---
name: featured-offer
description: "Amazon's Featured Offer (the Buy Box): how Amazon picks it in the US store today, how to read whether the seller's offer holds it and why not from Amazon's replies and Keepa's history, which causes a Listings Items write reaches and which sit in Seller Central, the Brand Registry portal or Amazon's own choice, and what the Support API reads. For anything about who holds an ASIN's Featured Offer, or why the seller's offer is not featured."
---

Facts cite P-<file>-<n> in research/<angles|elements|method>/<file>.md; pointers cite none.

## How Amazon picks it

- Amazon ranks offers on total price (item plus shipping), the delivery promise, free shipping, free returns and seller performance (P-price-position-4; P-account-health-9).
- Seller performance is order volume, chargeback rate and Voice of the Customer complaints; the seller's reviews and star rating, Prime eligibility and fulfilment method are not ranked when all else is equal (P-account-health-9).
- In the US store, since September 2026, offers from all sellers are evaluated, and Amazon may feature no offer when none meets its customer-experience requirements; another store's own Becoming the Featured Offer page says whether its eligibility gate is gone (P-price-position-3; P-offer-competition-and-hijackers-15).
- An offer out of stock or not shippable to the customer is never featured (P-offer-competition-and-hijackers-6; P-inventory-and-fulfillment-3).
- The Featured Offer is decided per variation and can differ by the shopper's location and Prime membership, so one view of the page is one shopper's (P-inventory-and-fulfillment-18).
- Amazon states no price band for rotation between offers (P-offer-competition-and-hijackers-16).

## Holding it or not

- `getFeaturedOfferExpectedPriceBatch` by SKU returns the price at or below which the offer may be featured, a `resultStatus`, and the current and competing featured offers; the current one equals the competing one when the seller's offer is not featured (P-featured-offer-5; P-price-position-1).
- The expected price is before promotions and is no promise of the Featured Offer (P-price-position-11).
- `getItemOffers` marks each offer's `IsBuyBoxWinner` and the seller's own with `MyOffer`, with up to two winners, Prime and non-Prime (P-featured-offer-11).
- `getCompetitiveSummary` names the holders by segment with each segment's share of glance views, at the moment of the call (P-offer-competition-and-hijackers-4).
- Over a window the share is Amazon's Featured Offer percentage, over page views in Business Reports and the Sales and Traffic report and over glance views in Data Kiosk, two series that are not compared with each other (P-offer-competition-and-hijackers-3; P-price-position-30).
- Keepa's `buyBoxSellerIdHistory`, `buyBoxStats` and `buyBoxIsAmazon` give the holder's history, Keepa's approximation of each seller's share, and whether Amazon retail holds it (P-offer-competition-and-hijackers-4; P-vendor-and-hybrid-3).
- The batch sizes and default rates are in references/reads.md.

## Why not

- An offer deactivated for a potential pricing error is a different state from one live but not featurable at its price (P-price-position-2).
- A preview's `100708` warning is an accepted update whose offer may not be featured on price (P-price-position-9).
- A new seller on the ASIN shows as a new seller id or a changed count in the offers (P-offer-competition-and-hijackers-1).
- An FBA stock-out with an MFN record is a switch to the MFN promise, not an outage (P-inventory-and-fulfillment-16).
- Since 2026-08-31 an FBM offer that puts account health at risk is deactivated alone, while the account stays in good standing (P-featured-offer-10).
- An empty `issues` array is not proof that nothing is wrong (P-account-health-2).
- The causes, sorted by what reaches them, are in references/causes.md.

## Cases

- The Support API reads cases and their contacts and opens none; its role, statuses and the case routes in Seller Central are in references/support.md.

## References

- references/reads.md: each read, its batch size and what it answers.
- references/causes.md: the causes a Listings Items write reaches, and those it does not.
- references/support.md: the Support API and Seller Central's case routes.
