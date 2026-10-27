# The request, from the seller's data

## Identity

- A new item's identifier is a GTIN, UPC or EAN the seller bought from GS1 or is licensed by the prefix owner to use, in `externally_assigned_product_identifier` at the length its type takes (P-listing-create-9).
- The brand is the one the identifier is registered to; another brand's product gets its own ASIN, never an edit of an existing one (P-listing-create-9; P-listing-create-11).
- The product ID cannot be edited after creation unless the item was created under a GTIN exemption (P-listing-create-9).
- A product without a GTIN is created only after the seller's exemption is approved in Seller Central, with `supplier_declared_has_product_identifier_exemption` `true` and the brand and category spelled exactly as the approval names them (P-listing-create-10).
- A brand enrolled in Brand Registry is created by the brand's own account or one the brand authorised, and a refusal on brand grounds goes through the brand's approval route, not a change of brand (P-listing-create-11; P-brand-protection-and-catalog-contribution-2).
- The `sellerId` read of the schema fills the brand names associated with the seller (P-listing-create-5).

## Language

- A text value is an array of objects with `value`, `language_tag` and `marketplace_id` (P-listing-writes-4).
- The tag is the one the store's schema allows under `$defs.language_tag`, written with an underscore, as in `en_US` (P-marketplaces-and-languages-7; P-title-30).
- The schema's `locale` sets display labels only, not the language of the values written (P-listing-create-12).
- Text is written for each store in that store's language, not copied across stores (P-marketplaces-and-languages-8; P-listing-writes-22).

## Price

- The price is `purchasable_offer` with `currency`, `audience` and `marketplace_id`, and `our_price` as `[{"schedule": [{"value_with_tax": <amount>}]}]`, in the store's `defaultCurrencyCode` (P-listing-create-12; P-listing-create-1).
- A preview with the price attributes also returns pricing issues (P-listing-create-17).

## Fulfilment

- A merchant-fulfilled offer is a `fulfillment_availability` record with `fulfillment_channel_code` `DEFAULT` and a `quantity` (P-listing-create-13).
- An FBA offer names the seller's Amazon channel code without a quantity, and needs the dangerous-goods and battery information Amazon requires for FBA (P-listing-create-13).
- The channel codes and shipping templates are the seller-specific schema's, and a template is written by its `enum` key (P-listing-create-13; P-inventory-and-fulfillment-15).

## Images

- Images are given as locations Amazon fetches: public HTTPS on S3, CloudFront or a third-party server, or a private S3 bucket Amazon's role may read (P-listing-create-14).
- A file in the seller's tree has no such location, so the seller gives one (P-images-and-video-5).
- They go in the locator attributes the store's schema offers, with `media_location` (P-images-and-video-4; P-listing-create-14).
- New content takes a new location (P-listing-create-14; P-images-and-video-20).
- An image applies to the ASIN in every store where it exists (P-listing-writes-10).
- An image of a photorealistic AI-generated person carries the `contains-synthetic-performer` tag (P-images-and-video-25).
- Main-block video is a Seller Central task (P-images-and-video-9).

## Compliance

- The compliance attributes a store's schema names, GPSR in an EU store among them, are filled from the seller's own declarations, store by store (P-listing-create-15; P-marketplaces-and-languages-11).
- Dangerous goods, battery, safety data sheet, Prop 65 and CPSIA values come from the seller, since Amazon cannot determine them (P-attributes-and-browse-nodes-16).
- A Prop 65 warning goes on child SKUs, not the parent (P-attributes-and-browse-nodes-18).
