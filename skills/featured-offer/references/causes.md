# Causes, by what reaches them

Facts cite P-<file>-<n> in research/<angles|elements|method>/<file>.md; pointers cite none.

## What a Listings Items write reaches

- A Listings Items patch reaches the price and the seller's minimum and maximum (`purchasable_offer`), the seller-fulfilled quantity and handling time (the MFN record of `fulfillment_availability`), and the attributes an issue names; it carries no FBA quantity (P-featured-offer-7).
- A price is written through `purchasable_offer` in a body built from the product-type schema, previewed with `mode=VALIDATION_PREVIEW`, and its `INVALID_PRICE` issues read (P-price-position-9).
- A price outside the seller's own minimum and maximum is an error or a deactivation, and a scheduled promotional price must sit inside them too (P-price-position-10).
- An offer can be live but not featurable when priced above the competitive price threshold or far above its recent prices; Pricing Health lists the two states apart (P-price-position-2).
- A consumer price cut below the business price is an error, and business customers then see the standard price (P-price-position-21).
- A price change crosses fee lines that the Product Fees API's estimate at the proposed price shows (P-price-position-16).
- Channel codes, accepted fields and shipping-template keys come from the seller-specific product-type schema, and a template is written by its `enum` key (P-inventory-and-fulfillment-15).
- Coupons, deals and price discounts are created in Seller Central; the Promotions API only reads them (P-price-position-8).

## What no SP-API operation reaches

- No SP-API operation restocks FBA, files an account-health or policy appeal, uploads a compliance document, reports another seller's offer through Brand Registry, or chooses the Featured Offer (P-featured-offer-8).
- A policy item on the product, its packaging, authenticity, safety or documents is resolved by what Amazon asks for (invoices, an order ID, a licence or retraction, compliance documents, a Letter of Compliance), not by a listing edit (P-account-health-6).
- A policy item that names the detail page itself has a content change and a separate appeal on Account Health (P-account-health-5).
- Re-adding content Amazon removed, cycling claims, or re-describing or re-categorising a product to pass a restriction is a violation with no path back (P-account-health-4).
- Closing, deleting or setting a listing out of stock does not fix an account-health violation (P-account-health-7).
- Product Policy Compliance details, Performance Notifications, Manage Your Compliance, Voice of the Customer and AHA status have no read through the connection (P-account-health-12).
- A new seller is sorted before a route: counterfeit or trademark misuse goes to Report a Violation with a test buy, naming the sellers so the ASIN stays live; a changed or inaccurate page to Report Abuse; genuine goods against a distribution or MAP agreement outside Amazon, which does not enforce it (P-offer-competition-and-hijackers-9).
- IP reports need the Rights Owner or Registered Agent role, store-policy reports any Brand Registry user of the brand, and Project Zero and Transparency the rights owner (P-offer-competition-and-hijackers-11).
- Project Zero is for confirmed counterfeits only (P-offer-competition-and-hijackers-10).
- Transparency blocks uncoded or mismatched units on enrolled products and is no remedy for resale of genuine coded goods (P-offer-competition-and-hijackers-12).
- The competitive price threshold is a price found at a retailer outside Amazon that Amazon does not name, and an outdated one is disputed through a self-service case (P-featured-offer-9).
- When the seller is thin on stock, Amazon's stated consequences are slower promises, narrower availability and the low-inventory-level fee, against capacity limits, excess and aged-inventory costs and placement fees (P-inventory-and-fulfillment-19).
- Stranded units carry a `stranded-reason` and an auto-removal date in the stranded inventory report (P-inventory-and-fulfillment-6).
