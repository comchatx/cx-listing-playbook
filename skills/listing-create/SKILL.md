---
name: listing-create
description: "Creating an Amazon listing from the seller's product data in the marketplaces the seller names: the seller's stores, telling a new item from an existing ASIN, the product type and each store's schema, the request built from the seller's data, the preview, the write on the seller's word, the read-back until the listing is buyable and discoverable, and variation families. For putting a new product, or a new offer, on Amazon."
---

Facts cite P-<file>-<n> in research/<angles|elements|method>/<file>.md; pointers cite none.

## Stores

- The stores are the ones the seller names, each found in `GET /sellers/v1/marketplaceParticipations` with `participation.isParticipating` true, and each row gives the store's `marketplace.id`, `defaultLanguageCode` and `defaultCurrencyCode` (P-listing-create-1; P-sp-api-access-1).
- A row with `hasSuspendedListings` true is an account-level Inactive status in that store, which would leave every listing there unbuyable (P-sp-api-access-14; P-listing-create-1).
- Each store is a regional origin of its own (P-marketplaces-and-languages-2), and the seller id in each path comes from the reply the door names, never from the seller (P-sp-api-access-3).
- Build International Listings is Seller Central's, not the API's: a creation in each store goes through that store's schema, preview and put (P-listing-create-21).

## New item or existing ASIN

- `GET /catalog/2022-04-01/items` with `identifiers`, `identifiersType` and the store's `marketplaceIds` decides it: an exact match is an existing ASIN, no match is a new item, and several matches are told apart by product type, brand, title and parentage through `getCatalogItem` (P-listing-create-2).
- An existing ASIN gets an offer-only listing: `GET /listings/2021-08-01/restrictions` with the `asin` first, then a put with `productType` `PRODUCT` and `requirements` `LISTING_OFFER_ONLY` naming that ASIN (P-listing-create-3; P-listing-create-22).
- A product already in Amazon's catalog is never given a second detail page (P-listing-create-9).
- `GET /listings/2021-08-01/items/{sellerId}/{sku}` is read before a creation, because a put on a SKU that exists replaces it and a SKU cannot be changed afterwards (P-listing-create-8).

## Product type and schema

- A new item's product type comes from `GET /definitions/2020-09-01/productTypes` with `itemName` (the title, which may be combined with the description) or `keywords`, never both, and the store's `marketplaceIds` (P-listing-create-4).
- A product type the API has not launched admits no new item with product facts (P-listing-create-4).
- The schema is `GET /definitions/2020-09-01/productTypes/{productType}` once per store, with that one `marketplaceIds`, `requirements=LISTING`, the `sellerId` and the `parentageLevel` of the listing being made, and its document is fetched from `schema.link.resource` before the link expires (P-listing-create-5).
- What a value must look like is the schema's: `required` and its conditionals, the `enum` value, `enumDeprecated`, the length keywords, `selectors`, `maxUniqueItems` and the seller-specific enums the `sellerId` fills (P-listing-create-6).
- The schema's own vocabulary is part of validation; reading it as plain JSON Schema misses rules Amazon checks (P-listing-create-6).

## Request

- A creation is `PUT /listings/2021-08-01/items/{sellerId}/{sku}?marketplaceIds=<one>&includedData=identifiers,issues&issueLocale=<locale>` with a body of `productType`, `requirements` and `attributes` in the schema's names and shapes, one store per request (P-listing-create-7).
- The values come from the seller's data; a value the data does not hold is asked of the seller, never made up (P-listing-create-15; P-attributes-and-browse-nodes-16).
- references/request.md holds identity, language, price, fulfilment, images and compliance.

## Preview and write

- A preview is the same put with `mode=VALIDATION_PREVIEW`; it persists nothing, so it is sent as any read is, and the put without the mode waits for the seller's word (P-listing-writes-5; P-listing-create-17).
- A preview answers `VALID` or `INVALID` with `issues` (P-listing-create-17).
- A required attribute the data does not fill answers `INVALID`, with an issue such as `90220`, category `MISSING_ATTRIBUTE`, naming it in `attributeNames` (P-listing-create-17).
- The write's `ACCEPTED` means the synchronous checks passed and processing began, `INVALID` means nothing was taken, and `submissionId` names the submission (P-listing-create-18).
- Issues from downstream processing, such as a conflict with another catalog item, appear only on a later `getListingsItem` (P-listing-create-18).

## Read-back

- `GET /listings/2021-08-01/items/{sellerId}/{sku}` with `includedData=summaries,attributes,issues,offers,fulfillmentAvailability,relationships` is read again until it settles (P-listing-create-19).
- The creation is done when the store's summary carries an ASIN, `status` holds `BUYABLE` and `DISCOVERABLE`, and no issue is `ERROR` (P-listing-create-19).
- An empty summary means no ASIN was matched or made yet; Amazon states no time for it, so cx reads back rather than waits a figure (P-listing-create-19).
- Then `getCatalogItem` on that ASIN shows what shoppers see, which can differ from what was sent (P-listing-writes-7).

## Families

- A variation family is written parent first, then each child with the parent's SKU and theme (P-listing-create-16).
- references/family.md holds each listing's attributes and how a family is read back.

## Log

- A creation is a change logged by listing-change-log whose Before is empty, because Amazon keeps no history of a listing (P-listing-create-23).
- Its Request and receipt hold the put as sent and each store's `submissionId`, `status` and `issues` (P-listing-writes-8).

## Sandbox

- A static sandbox answer proves a request's path, signing and shape, never the product type, the schema, the identity or Amazon's verdict on the seller's product (P-listing-create-20).
- references/answers.md holds the issues that name identity, brand and catalog conflicts, and the sandbox's fixed answers.

## References

[request.md](references/request.md): identity, language, price, fulfilment, images, compliance. [family.md](references/family.md): parent and children. [answers.md](references/answers.md): issues and the sandbox.
