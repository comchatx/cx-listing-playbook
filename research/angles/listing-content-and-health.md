# The listing's content and health: Listings Items, issues, suppression, Catalog Items

Read 2026-10-14 by the research seat. Tags: [official] Amazon's own page or document; [opinion] a named practitioner; [research] published research; [seat] the seat's own reasoning, never a skill position.

## What this covers

This file is about the seller's own listing as Amazon holds it. It covers what was submitted, what Amazon shows, whether shoppers can find and buy it, and what Amazon says is wrong with it. Health matters at every funnel stage. A listing that is not DISCOVERABLE gets no impressions. One that is not BUYABLE converts nothing. A suppressed attribute or a reconciled title changes what the shopper reads between the click and the purchase.

Sources, in order of weight:

- **Listings Items API v2021-08-01.** The model file and Amazon's guides: retrieve, search, manage issues, issues troubleshooting, FAQ, listing status, modular titles, rate limits.
- **Catalog Items API 2022-04-01.**
- **Product Type Definitions API 2020-09-01.**
- **Listings Restrictions API.**
- **Notification Type Values.**
- **The Inventory Reports page.**
- **The SP-API release notes.**
- **Seller Central help pages.** A plain fetch of a live help page returns a JavaScript shell; the text was read on 2026-10-14 through the help hub's content call (method/help-page-access.md), and where a capture exists it is saved under the office's capture folder (outside this repository)<page id>-v<version>.txt. Archived copies are cited as history only. The Fix Your Products screen and the Listing Quality Dashboard are Seller Central screens behind sign-in, not help pages.
- **Seller Forums posts by Amazon staff accounts.**
- **Amazon's sell.amazon.com blog.**
- **Two Amazon Science publications.**
- **Practitioner pages.**

All examples below use placeholders (<sellerId>, <SKU>, <ASIN>, <marketplaceId>). No figure, name or identifier from any internal run report is copied here.

## Amazon's own rules and guidance

RULE means enforced by the API or by Amazon policy. GUIDANCE means Amazon's advice. "Where it lives at run time" names the place a figure must be read from, not where it was read today.

### A. The listing record: getListingsItem

1. RULE. A listing is addressed by seller and SKU: `GET /listings/2021-08-01/items/{sellerId}/{sku}` with `marketplaceIds` required, plus `issueLocale` and `includedData`. The path has no ASIN slot. [official] (listingsItems_2021-08-01.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-items-api-model/listingsItems_2021-08-01.json, read 2026-10-14)
   - [seat] A run on this line called `/listings/2021-08-01/items/<ASIN>` (an ASIN where the single-segment search path expects `{sellerId}`) and got Amazon's 400 `InvalidInput` (internal run report, 2026-10-13 day 1; not an Amazon page).
2. RULE. `includedData` takes `summaries`, `attributes`, `issues`, `offers`, `fulfillmentAvailability`, `procurement`, `relationships` and `productTypes`. The default is `summaries` only, so a call that names nothing returns no issues and no attributes. [official] (same model file, read 2026-10-14)
3. RULE. Since the July 29, 2026 release, `getListingsItem` and `searchListingsItems` accept several `marketplaceIds` in one region per call: "The `marketplaceIds` parameter accepts a maximum of 12 Amazon stores per request." "This feature is available for sellers only"; vendor accounts are not supported. The model file sets no `maxItems` on this parameter, so the 12 lives on the guide page only. [official] (Retrieve details about a listing for single or multiple Amazon stores, https://developer-docs.amazon.com/sp-api/docs/retrieve-details-about-a-listing; SP-API Release Notes, July 29, 2026 entry; read 2026-10-14)
4. GUIDANCE. The datasets cover "summary information, contributed attributes, issues, offer information (sellers), fulfillment availability (sellers), and procurement details (vendors)." Amazon's worked advice:
   - If a listing "ceases to be `DISCOVERABLE`", get `issues` "to determine the reason for the search suppression".
   - If it is not `BUYABLE`, "a common reason could be a lack of inventory", so read `fulfillmentAvailability`.

   [official] (Retrieve details about a listing…, same URL, read 2026-10-14)
5. RULE. The `summaries` entry per store carries:
   - `marketplaceId`, `asin`, `productType`, `conditionType` and `status[]`
   - `fnSku`, `itemName`, `createdDate`, `lastUpdatedDate`
   - `mainImage {link, height, width}`

   `status` holds only `BUYABLE` ("can be purchased by shoppers. This status does not apply to vendor listings") and `DISCOVERABLE` ("visible to shoppers"). An empty array is a valid value. Amazon's own example shows a second store with `"status": []`. [official] (model file; Retrieve details about a listing…, read 2026-10-14)
6. RULE. "If the summary view is not populated it is because the submission failed and did not match an ASIN." [official] (Listings APIs FAQ, https://developer-docs.amazon.com/sp-api/docs/listings-apis-faq, read 2026-10-14)
7. RULE. `attributes` is "JSON object containing structured listing item attribute data keyed by attribute name" (model file); the datasets are "contributed attributes" (Retrieve details…). The names are the product type's schema names, for example `item_name` and `title_differentiation` (Submit modular titles) or `generic_keyword` and `included_components` (Issues Troubleshooting); Amazon's examples show each value carrying `marketplace_id` and, for text, `language_tag` (Submit modular titles). `fulfillment_availability` in attributes is what was submitted; the `fulfillmentAvailability` dataset is the live state (Amazon's example: the attribute "shows 1" while the dataset "shows 0 as the live quantity"). [official] (listingsItems_2021-08-01.json; Retrieve details about a listing…; Submit modular titles; Listings Items API Issues Troubleshooting; Understanding Amazon listing status and seller-fulfilled inventory management, https://developer-docs.amazon.com/sp-api/docs/understanding-amazon-listing-status-and-seller-fulfilled-inventory-management, read 2026-10-14)
8. RULE. Rate limits are not stable numbers, and Amazon's two sources disagree. Today's rate-limit page gives `getListingsItem`, `searchListingsItems` and `putListingsItem` 5 requests per second per account-application pair, 100 per application, and a burst of 5 (`patchListingsItem`: 5, 500, burst 5). The model file's usage-plan tables give `getListingsItem` and `putListingsItem` rate 5 with burst 10, and `searchListingsItems`, `patchListingsItem` and `deleteListingsItem` rate 5 with burst 5 (model re-read 2026-10-14). Neither figure is picked here. Where it lives at run time: the `x-amzn-RateLimit-Limit` response header (per account-application pair only), which is the binding value for the caller; the page and the model are for human readers. [official] (Listings Items API Rate Limits, https://developer-docs.amazon.com/sp-api/docs/listings-items-api-rate-limits; listingsItems_2021-08-01.json; read 2026-10-14)

### B. The `issues` object

9. RULE. Each issue has four required fields: `code`, `message`, `severity` and `categories`. Three are optional: `attributeNames`, `enforcements` and `marketplaceIds`. [official] (model file, read 2026-10-14)
10. RULE. Severity values:
    - `ERROR`: "an issue has occurred preventing the submission from processing, such as a validation error".
    - `WARNING`: "should be reviewed, but has not prevented the submission from processing".
    - `INFO`: "additional information has been provided that should be reviewed".

    [official] (model file, read 2026-10-14)
11. RULE. Categories:
    - `INVALID_ATTRIBUTE`, `MISSING_ATTRIBUTE`
    - `INVALID_IMAGE`, `MISSING_IMAGE`
    - `INVALID_PRICE`, `MISSING_PRICE`
    - `DUPLICATE`, `QUALIFICATION_REQUIRED`
    - `PRODUCT` ("Issue applies to the product (ASIN)") and `LISTING` ("Issue applies to the listing (SKU)"). These two were added in the 2026-09-30 release.

    The enum grows, so a reader must tolerate unknown values. [official] (model file; SP-API Release Notes, https://developer-docs.amazon.com/sp-api/docs/sp-api-release-notes, read 2026-10-14)
12. RULE. `enforcements` is `{actions[], exemption}`. The four actions:
    - `LISTING_SUPPRESSED`: "takes down the current listing item's buyability".
    - `ATTRIBUTE_SUPPRESSED`: "An attribute's value on the listing item is invalid, which causes it to be rejected by Amazon".
    - `CATALOG_ITEM_REMOVED`: "This catalog item is inactive on Amazon, and all offers against it in the applicable Amazon store are non-buyable".
    - `SEARCH_SUPPRESSED`: "the catalog item is hidden from search results".

    [official] (model file, read 2026-10-14)
13. RULE. `exemption.status` takes three values:
    - `EXEMPT`: Amazon "acknowledges the existence of enforcement actions but ensures the user that these actions are not applied".
    - `EXEMPT_UNTIL_EXPIRY_DATE`: comes with `expiryDate`.
    - `NOT_EXEMPT`: "Amazon has already taken the specified enforcement actions".

    [official] (model file, read 2026-10-14)
14. RULE. Not every problem is an issue: "All problems that can occur with a listing do not have corresponding defined issues. As a result, this notification does not necessarily represent all problems with a listing (neither does the Selling Partner API for Listings Items)". The notification's `NONE` severity says "there may be other problems with the listing." [official] (Notification Type Values, https://developer-docs.amazon.com/sp-api/docs/notification-type-values, read 2026-10-14)
15. RULE. "Validation Preview mode surfaces pricing validation issues in addition to catalog and attribute validation", when a price change is submitted with `mode=VALIDATION_PREVIEW`; they carry category `INVALID_PRICE`:
    - `100708` WARNING: not eligible to be the Featured Offer because the price is uncompetitive. "Issue 100708 is new to Validation Preview."
    - `19037` / `19038` ERROR: selling price below the minimum / above the maximum price setting.
    - `18701` ERROR: potential high pricing error.

    `19038`, `19037` and `18701` "are also returned in the asynchronous Listings API workflow". "WARNING severity issues (such as `100708`) do not prevent the listing update." ERROR does prevent it. [official] (Manage Listings Issues, https://developer-docs.amazon.com/sp-api/docs/manage-listings-issues, read 2026-10-14)
16. GUIDANCE. Amazon's troubleshooting order:
    1. Call `getListingsItem` with `issues`.
    2. Read `categories` and `enforcements`.
    3. "Prioritize fixing issues that could impact the status".
    4. Subscribe to `LISTINGS_ITEM_ISSUES_CHANGE` and `LISTINGS_ITEM_STATUS_CHANGE` for ongoing monitoring.

    Error codes are explained on Seller Central's "Error code explanations" page (G17781). [official] (Manage Listings Issues, read 2026-10-14)
17. RULE. A code table exists and changes over time. Examples:
    - `90220`: required attribute not supplied.
    - `4000001`: invalid value.
    - `4005011`: conflicts with another catalog item.
    - `90225`: too long. The page lists `item_name` 200 characters, `generic_keyword` 500 bytes and `included_components` 80 characters.
    - `90244`: invalid enumerated value.
    - `4005033`: attribute not editable.
    - `90199`: HTML not allowed.
    - `90196`: URL not allowed.
    - `4000002`: required value missing. Amazon notes that requirements change often.
    - `4000003`: invalid product type.
    - `101158`: invalid browse node.
    - `100980`: barcode conflict.
    - `4005015`: ASIN mismatch.
    - `4000000`: internal error. Retry twice, then open a case.

    Validation-preview codes are being remapped, for example `90004145` → `90225` and `8333` → `90244`. Where it lives at run time: the `code` and `message` fields of the live response. A skill must not hard-code the table. [official] (Listings Items API Issues Troubleshooting, https://developer-docs.amazon.com/sp-api/docs/listings-items-api-issues-troubleshooting; Manage Listings Issues, read 2026-10-14)

### C. Status: discoverable versus buyable

18. RULE. Buyable answers "Can customers buy it?" and Discoverable answers "Can customers find it?". The page states: "when a listing is search suppressed, it is no longer discoverable. However, this suppressed listing can still maintain its buyability." [official] (Understanding Amazon listing status…, read 2026-10-14)
19. RULE. "if `DISCOVERABLE` is not present, Amazon retail cannot search for the listings item." [official] (Listings APIs FAQ, read 2026-10-14)
20. GUIDANCE. To lift a suppression, "You must first inspect issues associated with the listing to retrieve the exact reason". Amazon's example is a listing search-suppressed because "newly required compliance attributes" are missing, so it "must be patched with new required attributes". [official] (Understanding Amazon listing status…, read 2026-10-14)
21. RULE. A variation parent "is a non-buyable entity used to relate child products." A parent without `BUYABLE` is therefore normal. [official] (Building Listings Management Workflows Guide, https://developer-docs.amazon.com/sp-api/docs/building-listings-management-workflows-guide, read 2026-10-14)

### D. Accepted is not done: timing

22. RULE. Synchronous issues are input validation that stops acceptance. "**Accepted** does not mean the process is complete. Multiple downstream processes create the item in the Amazon catalog, and any of these processes can generate issues that return asynchronously." Issues reach the seller four ways:
    - the direct API response;
    - `getListingsItem` or `searchListingsItems` with `issues`;
    - `JSON_LISTINGS_FEED` processing reports;
    - `LISTINGS_ITEM_ISSUES_CHANGE`.

    [official] (Manage Listings Issues, read 2026-10-14)
23. GUIDANCE. `getListingsItem` "directly queries the current state, which is why the results are available faster (within 1-5 minutes)". "a 15-20 minute delay for the LISTINGS_ITEM_ISSUES_CHANGE and LISTINGS_ITEM_STATUS_CHANGE notifications is normal." Amazon adds: "you must use push notifications to receive real-time updates for status changes and issues with listings." [official] (Listings APIs FAQ, read 2026-10-14)
24. RULE. During processing, a listing can be moved to a recommended product type: "If the listing deviates from the selected product type, the listing's product type switches to a recommended product type. This results in attributes from the new product type to show up as missing". [official] (Listings APIs FAQ, read 2026-10-14)

Latency figures, side by side (reconciled 2026-10-14). Amazon states a different wait for each kind of change and each channel, and staff posts and a forum announcement add others. They describe different things more than they contradict one another, and none is a rule for when an effect can be judged:
- the API read of the listing: "within 1-5 minutes"; the listing notifications: "a 15-20 minute delay" (Listings APIs FAQ, item 23);
- accepting Amazon's values for error 8541: "processed in the next 15 minutes" (Error 8541, G200692330, item 73);
- variation families: "about 15 minutes", support after 24 hours (Variation relationship FAQ, G201951410 v16) against "24-28 hours" (Troubleshoot product variations, GLQBFJDZ7ZDLXQW8) (item 68);
- images: "up to 24 hours" (Product image guide, G1881 v28, item 93);
- a merge: "immediately in most situations", up to 24 hours (Merge Duplicate Product Pages, item 72);
- title and item highlights: "24 to 48 hours" (Product title requirements and guidelines, GYTR6SYGFA5E3EQC v21, item 99). The capture capture `GYTR6SYGFA5E3EQC-v21` carries the sentence, so the figure is on Amazon's own help page, not only in forum posts or blogs;
- a verified contribution: "within 48 hours" (Enhance Listings, item 95); a fixed stranded cause: "allow 48 hours" (Fix stranded inventory, item 63);
- Category Listings report title edits: "typically" within eight hours (forum announcement, item 42);
- detail page updates "up to 24 hours" (staff post, item 51) and search "up to 72 hours" (staff post, item 52). Two live help pages also give 72 hours: "It can take up to 72 hours for changes to new or existing ASINs to go live" (Amazon search glossary, GF6B8ZPNY2AP72VV v2), and offer, browse node and launch-date changes "can take up to 72 hours to reflect in shopping results" (My ASIN is unsearchable, GHGHDMU4X5K9QGCV v6). Neither is a page about content edits.

These figures are for human readers. cx confirms a change by reading the state (`getListingsItem`, then `getCatalogItem`), uses the stated window for that change type only as the earliest re-read, and does not treat any one figure as the start of an effect window. [official] (the pages named; Amazon search glossary and My ASIN is unsearchable read from their captures under the office's capture folder (outside this repository), read 2026-10-14)

### E. Finding a SKU from an ASIN: searchListingsItems

25. RULE. The endpoint is `GET /listings/2021-08-01/items/{sellerId}`. Its filters:
    - `identifiers` (max 20) with `identifiersType`: ASIN, EAN, FNSKU, GTIN, ISBN, JAN, MINSAN, SKU or UPC.
    - `variationParentSku` and `packageHierarchySku`.
    - Created and last-updated date windows.
    - `withIssueSeverity` (WARNING, ERROR).
    - `withStatus` and `withoutStatus` (BUYABLE, DISCOVERABLE).
    - `sortBy` (`sku`, `createdDate`, `lastUpdatedDate`; default `lastUpdatedDate`) and `sortOrder` (default `DESC`), plus `pageSize` (default 10, maximum 20 in the model) and `pageToken`.

    "The maximum number of items (SKUs) that can be returned and paged through is 1000." The operation was added in the December 18, 2024 release. [official] (model file; Search for listings items by product identifier or other listings parameters, https://developer-docs.amazon.com/sp-api/docs/search-for-listings-items-by-id; SP-API Release Notes, read 2026-10-14). That one ASIN can map to several of a seller's SKUs is not stated on either Amazon page; it rests on a practitioner (GitHub issue #4523, under "What practitioners add") and on this line's day-1 run, which found a second, inactive SKU on the same ASIN [seat].
26. RULE. Paging and access rules:
    - A page token expires after 24 hours.
    - The other parameters must match across pages.
    - SKUs that contain commas cannot be searched in a comma list.
    - The Product Listing role is required.

    [official] (Search for listings items…, read 2026-10-14)
27. GUIDANCE. "to retrieve all listings that customers can find but cannot buy, use the `withoutStatus` filter set to `BUYABLE` and the `withStatus` filter set to `DISCOVERABLE`." [official] (Understanding Amazon listing status…, read 2026-10-14)
28. RULE. Both Listings Items paths need `{sellerId}`. The SP-API door on this line holds none. door.md names two replies that carry it: Finances `listTransactions` (`sellingPartnerMetadata.sellingPartnerId`) and Pricing `getPricing` with `ItemType=Sku`. [seat] (the cx SP-API door's door.md, read 2026-10-14; an internal file, not Amazon's page)
   - Reconciled: method/sp-api-access.md lists a third route that other files use, Product Pricing `getFeaturedOfferExpectedPriceBatch` by SKU. Its `offerIdentifier` "Identifies an offer from a particular seller for a specified ASIN", `sellerId` is "The seller identifier for the offer", and `sku` "will only be present for the target offer, which belongs to the requesting seller". So the response body's `offerIdentifier.sellerId` is the requesting seller's own; `currentFeaturedOffer` and `competingFeaturedOffer` can name other sellers. Like `getPricing`, it needs a SKU already in hand. [official] (productPricing_2022-05-01.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/product-pricing-api-model/productPricing_2022-05-01.json, definitions `FeaturedOfferExpectedPriceResponseBody` and `OfferIdentifier`, read 2026-10-14)
   - Gap fill: the Sellers API is not a route to it. Its two operations (`/sellers/v1/marketplaceParticipations`, `/sellers/v1/account`) carry no seller-id field in the model; the only `id` property is the marketplace's (`Marketplace.id`). [official] (sellers.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/sellers-api-model/sellers.json, read 2026-10-14)

### F. Catalog Items: Amazon's reconciled view

29. RULE. Catalog Items "provides information at the ASIN level, which is reconciled from various listings against that item". Listings Items returns "the specific listing submitted by a selling partner". [official] (Listings APIs FAQ, read 2026-10-14)
30. RULE. `getCatalogItem` is `GET /catalog/2022-04-01/items/{asin}`. Its `includedData`:
    - `attributes`, `classifications`, `dimensions`, `identifiers`, `images`
    - `productTypes`, `relationships`, `salesRanks`, `summaries`, `vendorDetails`

    The default is `summaries`. The summary carries `itemName`, `brand`, `browseClassification`, `itemClassification` (BASE_PRODUCT, VARIATION_PARENT, PRODUCT_BUNDLE, OTHER), `websiteDisplayGroup`, `color`, `size`, `style`, `modelNumber`, `packageQuantity` and more. Images carry variants (MAIN, PT01–PT08, SWCH), that is a main image plus eight other slots. [official] (catalogItems_2022-04-01.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/catalog-items-api-model/catalogItems_2022-04-01.json; Catalog Items API, https://developer-docs.amazon.com/sp-api/docs/catalog-items-api, read 2026-10-14)
31. RULE. "The `generic_keyword` attribute is proprietary seller-specific data and will no longer be returned by the Catalog Items API. Selling Partners can use the Listings Items API to view submitted values." Search terms can therefore only be read from the seller's own listing. [official] (SP-API Release Notes, 2023-08-16 entry, read 2026-10-14)
32. RULE. On why edits do not appear: "In some cases, especially where we already have a listing for a product, the information submitted by a vendor might not have priority." The wording names vendors. "Brand owners have the highest precedence to update data on the product details page … If Amazon uses its own data on the product details page, brand owners can override it via a ticket to Seller Central support". [official] (Listings APIs FAQ, read 2026-10-14)
33. GUIDANCE. For issue `4005011` (the value conflicts with an existing catalog item), Amazon advises: "Build a workflow to surface any pre-existing catalog data for the SKU using the getListingsItem and getCatalogItem APIs." [official] (Listings Items API Issues Troubleshooting, read 2026-10-14)
34. GUIDANCE. Before making an offer, confirm the ASIN through Catalog Items and check eligibility through Listings Restrictions. `getListingsRestrictions` gives three reason codes:
    - `APPROVAL_REQUIRED`: with a path-forward link.
    - `ASIN_NOT_FOUND`.
    - `NOT_ELIGIBLE`: with no path forward.

    [official] (Listings APIs FAQ; listingsRestrictions_2021-08-01.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-restrictions-api-model/listingsRestrictions_2021-08-01.json, read 2026-10-14)

### G. Writing content: schema first, preview, patch whole attributes

35. RULE. Requirements live in the Product Type Definitions schema. `getDefinitionsProductType` takes these parameters:
    - `productType` and `marketplaceIds` (one store).
    - An optional `sellerId`, which fills in seller-specific values such as brand names.
    - `productTypeVersion`: `LATEST` by default, or `RELEASE_CANDIDATE`.
    - `requirements`: `LISTING`, `LISTING_PRODUCT_ONLY` or `LISTING_OFFER_ONLY`.
    - `requirementsEnforced`: `ENFORCED` or `NOT_ENFORCED`, the latter for partial updates.
    - `locale`.
    - `parentageLevel`: CHILD, PARENT or NONE.

    The schema link expires after 7 days. [official] (definitionsProductTypes_2020-09-01.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/product-type-definitions-api-model/definitionsProductTypes_2020-09-01.json; Retrieve a Product Type Definition, https://developer-docs.amazon.com/sp-api/docs/retrieve-a-product-type-definition, read 2026-10-14)
36. RULE. "Amazon reviews product attributes regularly and plans necessary updates for the last week of every month. Sometimes, Amazon makes some updates before the planned release". Get the latest schema before every update. Check `checksum`, watch `PRODUCT_TYPE_DEFINITIONS_CHANGE` and respect `$lifecycle` and `enumDeprecated`. [official] (Listings APIs FAQ; SP-API Product Metadata Updates, https://developer-docs.amazon.com/sp-api/docs/sp-api-metadata-updates, read 2026-10-14)
37. RULE. Patches are coarse:
    - "Only top-level listings item attributes can be patched."
    - JSON Patch "can add, replace, or delete entire attributes. Patching content within attributes is not supported."
    - Deletes need the selector values, because attributes "cannot be deleted by name alone."
    - The model's `PatchOperation.op` enum today lists `add`, `replace`, `merge` and `delete` ("The `merge` operation merges the target property"); the guide page names only add, replace and delete.
    - Gap fill, settled at the source: Amazon's "Merge a listing" page documents `merge` for two attributes only. On `fulfillment_availability` it updates `quantity` "without specifying other optional fields such as `restock_date` and `lead_time_to_ship_max_days`". On `purchasable_offer` it deletes `quantity_discount_plan` "by setting explicit null values". In both, "You must provide non-empty values for the selector field". The page shows no content attribute (title, bullets, description, keywords) patched with `merge`, and it states no rule limiting `merge` to those two attributes; it only gives the two examples. So for listing copy the whole-attribute rule above stands. (Re-read 2026-10-14: the model's enum is `add`, `replace`, `merge`, `delete`. This agrees with method/listing-writes.md and angles/price-position.md on `merge` for `purchasable_offer`; files that say patch is add/replace/delete only are describing the guide page.)

    [official] (model file; Preview errors before partially updating a listing, https://developer-docs.amazon.com/sp-api/docs/preview-errors-before-partially-updating-a-listing; Merge a listing, https://developer-docs.amazon/sp-api/docs/merge-a-listing; read 2026-10-14)
38. RULE. `mode=VALIDATION_PREVIEW` "synchronously performs the same checks that are done on production submissions, but without persisting" and returns `VALID` or `INVALID`. It "has lower rate limits and is intended for testing a small number of listings. It is not designed for production workflows." Including price attributes returns pricing issues. [official] (Listings APIs FAQ; Manage Listings Issues; Preview errors…, read 2026-10-14)
39. GUIDANCE. To update an existing listing, "call the `getListingsItem` operation using the identified SKU. Be sure to include `attributes` and `issues`". [official] (Building Listings Management Workflows Guide, read 2026-10-14)
40. RULE. Product-data updates (any attribute that is not inventory, pricing or a relationship) have their own per-application throttle. The 429 message reads "The frequency of requests was greater than what is allowed for product data." [official] (Listings Items API Rate Limits, read 2026-10-14)

### H. Titles in 2026: modular titles

41. RULE. "Starting July 27, 2026, this structure applies to all non-media product types submitted through the Listings Items API or the `JSON_LISTINGS_FEED`":
    - `item_name` may be up to 75 characters. (The API page does not say whether spaces count; the Seller Forums announcement in item 42 says "75 characters or less including spaces".)
    - `title_differentiation` (Item Highlights) may be up to 125, in the `product_identity` property group. "You can only submit title_differentiation when item_name is 75 characters or fewer."
    - "The total character limit is 200 across both fields."

    "If you submit an item_name longer than 75 characters (up to 200), Amazon may reconcile the value in the catalog, splitting it across item_name and title_differentiation." `getListingsItem` and `searchListingsItems` "return your original submitted value, while the catalog shows Amazon's reconciled version." Issue `100476` (ERROR, `INVALID_ATTRIBUTE`, on `title_differentiation`, with `ATTRIBUTE_SUPPRESSED` / `NOT_EXEMPT`) is returned when `title_differentiation` is submitted while `item_name` exceeds 75. The page also says the change "does not affect your current listings unless you submit an update". Where it lives at run time: `maxLength` in the product type schema (Amazon's excerpt shows `"maxLength": 125` on `title_differentiation`). Amazon's own pages disagree on the title figure, all read 2026-10-14:
    - Submit modular titles: `item_name` up to 75, `title_differentiation` up to 125, 200 in total.
    - Product title requirements and guidelines (GYTR6SYGFA5E3EQC v21) and Product detail page rules (G200390640 v21): 75 "including spaces"; item highlights 125.
    - Listings Items API Issues Troubleshooting, code `90225`: `item_name` 200 (item 17).
    - Suppressed listings (G200898440 v13): "less than 80 characters for apparel, shoes, and luggage categories and 130 characters for all other categories" (item 98).
    - The sell.amazon.com SEO blog (September 3, 2025): "limit is 200, and we recommend no more than 60" (item 43).

    The binding value for a write is `maxLength` on `item_name` and `title_differentiation` in the product type schema, read at run time from `getDefinitionsProductType` for the listing's product type and store; the figures above are for human readers. [official] (Submit modular titles, https://developer-docs.amazon.com/sp-api/docs/submit-modular-titles; Listings Items API Issues Troubleshooting; Product title requirements and guidelines, GYTR6SYGFA5E3EQC v21; Product detail page rules, G200390640 v21; Suppressed listings, G200898440 v13 (the three from their captures under the office's capture folder (outside this repository)); Amazon SEO blog; read 2026-10-14)
42. RULE. "titles in all categories except for media will need to be 75 characters or less including spaces"; after July 27, 2026 "any titles still over 75 characters will be updated to the AI recommendation gradually" (first post marked "Jun 10, 2026 - Updated to improve clarity"; the answers post shows only "2 months ago"). Brand owners get 14 days in Review Listings Changes, and "View enhancements" shows the AI suggestions. Further points from Amazon:
    - Listings stay "active, editable, and searchable".
    - Item Highlights display beneath the name from August 10, 2026.
    - Both fields are search inputs, and neither is prioritised.
    - Bulk edits go through the Category Listings report and typically update within eight hours.

    This forum post is the source for Amazon rewriting titles that nobody updated: titles "still over 75 characters will be updated to the AI recommendation gradually". It sits against Submit modular titles' "does not affect your current listings unless you submit an update" (item 41), which speaks of the API structure, not of Amazon's own rewrites. A file that says Amazon does not change titles nobody updated reads only the API page.

    [official] (Seller Forums, News_Amazon, "Updates to improve your product titles begin on July 27", https://sellercentral.amazon.com/seller-forums/discussions/t/145b6d0f-999c-4555-896c-c694bda2e470; "Answers to your product title update questions", https://sellercentral.amazon.com/seller-forums/discussions/t/302aaac6-6f2b-4d86-bcd2-36fe24f0e6cd, read 2026-10-14)
43. GUIDANCE (older, partly superseded). The SEO blog says "Listing quality and your account health can contribute to search rankings". It warns that "Keyword stuffing can create a poor customer experience and hurt your rankings". For back-end search terms it advises "use all lowercase letters and separate words with spaces only". Its title advice ("limit is 200, and we recommend no more than 60") predates the 75-character rule. [official] (Amazon SEO: 7 ways to improve your product's search rankings, Daisy Quaker, Sep 3, 2025, https://sell.amazon.com/blog/amazon-seo, read 2026-10-14)
44. GUIDANCE. A listing is "a product detail page and the offers paired with it". Content limits: "up to five bullets" and "up to nine photos". The image count differs between Amazon's pages: nine here matches the Catalog model's MAIN plus PT01–PT08 (item 30), while the Building Listings Management Workflows Guide says "A main product image and up to nine secondary images can be uploaded" (as quoted in elements/images-and-video.md and method/listing-writes.md). The binding count for a write is the image attributes the product type schema offers, read at run time from `getDefinitionsProductType`. Under Brand Registry, "only you and other sellers associated with your brand can create or suggest updates to your product detail pages." [official] (How to create Amazon product listings, Mickey Toogood, Apr 29, 2026, https://sell.amazon.com/blog/amazon-product-listings, read 2026-10-14)

### I. Reports

45. RULE. `GET_MERCHANT_LISTINGS_ALL_DATA` "includes both active, inactive and suppressed listings":
    - Request only, tab-delimited, one store per request.
    - Options are `custom` and `preferredReportDocumentLocale`.
    - The cache period is "between one and six hours depending on the number of entries".
    - Columns include `seller-sku`, `asin1`, `item-name`, `item-description`, `price`, `quantity`, `open-date`, `image-url`, `fulfillment-channel` and `status`.

    [official] (Inventory Reports, https://developer-docs.amazon.com/sp-api/docs/report-type-values-inventory; Understanding Amazon listing status…, read 2026-10-14)
46. RULE. `GET_MERCHANTS_LISTINGS_FYP_REPORT` "only includes suppressed listings which can't be retrieved in search results". It can be requested or scheduled. Columns: Status, Reason, SKU, ASIN, Product name, Condition, Status Change Date, Issue Description. The description reads: "Contains suppressed listings, the reason each listing is suppressed, and instructions for removing each suppression." [official] (Inventory Reports; Understanding Amazon listing status…, read 2026-10-14)
47. RULE. "Inventory reports are not near real-time. The SLA for stock data freshness is 3 hours. For subsequent report calls from the same merchant account, data is 1 to 6 hours old". `GET_MERCHANT_LISTINGS_INACTIVE_DATA` and `GET_MERCHANT_LISTINGS_DATA` also exist. [official] (Understanding Amazon listing status…, read 2026-10-14)

### J. Notifications that exist

48. RULE. Every notification is delivered to a destination, and the page names one workflow per type: the listing types below marked (EB) use the Amazon EventBridge workflow, those marked (SQS) the Amazon Simple Queue Service workflow. The relevant ones:
    - `LISTINGS_ITEM_STATUS_CHANGE` (EB): "published when a listings item is created, deleted, or its buyability changes"; Status is BUYABLE, DISCOVERABLE or DELETED; sellers only.
    - `LISTINGS_ITEM_ISSUES_CHANGE` (EB): payload `2023-12-13`; "You must subscribe or migrate to the newer version "2023-12-13". The "1.0" version will be deprecated soon." Severities are ERROR, WARNING or NONE, plus `EnforcementActions`. Sellers and vendors. It "does not include the same level of detailed information about issues as does the API" (that sentence is on Retrieve details…, not on Notification Type Values).
    - `BRANDED_ITEM_CONTENT_CHANGE` (EB): "a change to the title, description, bullet points, or images, for any ASIN that the selling partner has a brand relationship with".
    - `ITEM_PRODUCT_TYPE_CHANGE` (EB): a product type change on items with a brand relationship.
    - `PRODUCT_TYPE_DEFINITIONS_CHANGE` (EB): a new product type or product type version.
    - `LISTINGS_ITEM_MFN_QUANTITY_CHANGE` (EB).
    - `PRICING_HEALTH` (SQS): Featured Offer ineligibility "because of an uncompetitive price".
    - `ANY_OFFER_CHANGED` (SQS): top 20 offers by condition and the Buy Box; "You will only receive ANY_OFFER_CHANGED notifications for items for which you have active offers."
    - `DETAIL_PAGE_TRAFFIC_EVENT` (SQS): sellers and vendors; ASIN-level traffic, "sent five minutes after the beginning of each hour", for "the hour before the previous hour", plus "any delayed data from up to 24 hours earlier"; "ASINs that have glance views are included."
    - Also present on the page and missing from the first draft: `ACCOUNT_STATUS_CHANGED` (SQS; account status moves between `NORMAL`, `AT_RISK` and `DEACTIVATED`), `ITEM_SALES_EVENT_CHANGE` and `ITEM_INVENTORY_EVENT_CHANGE` (SQS; hourly ASIN-level sales and inventory).

    [official] (Notification Type Values, https://developer-docs.amazon.com/sp-api/docs/notification-type-values, read 2026-10-14; Retrieve details about a listing…, read 2026-10-14)

### K. Seller Central pages: what could be read

All four help pages this section first sought were read live on 2026-10-14: Suppressed listings (G200898440 v13), Listing quality (G200786710 v5 r1), Product title requirements and guidelines (GYTR6SYGFA5E3EQC v21 r2) and Error code explanations (G17781 v13 r1). A plain fetch returns only a JavaScript shell; the help hub's own content call (`POST https://sellercentral.amazon.com/help/hub/mons-api/GetHelpTopic`, the route fixed in method/help-page-access.md) served each without sign-in, and its text is saved under the office's capture folder (outside this repository) (G200898440-v13.txt, G200786710-v5.txt, GYTR6SYGFA5E3EQC-v21.txt, G17781-v13.txt). Their current text is used in section N below. The first draft called them unreachable; that was wrong. Items 49–50 come from archived copies and stay as history; items 51–52 are Amazon staff posts. Only the Fix Your Products screen and the Listing Quality Dashboard, which are Seller Central screens and not help pages, sit behind sign-in. Every Seller Central page cited in sections M and N was read by that call, layer `Published/US`, locale `en-US`, and is cited as "<title>, <id> v<version> r<revision>".

49. RULE, historical, dated 2017-12-08. "we will hide (or suppress) from search and browse non-media listings that do not meet certain standards". The causes listed then were a missing main image, missing brand/description/bullets, a title over 200 characters, a missing item type and category-specific gaps. "You can still locate a suppressed listing on Amazon by typing its ASIN into the search box." The fix routes were Manage Inventory > Suppressed and the Listing Quality and Suppressed Listing Report. [official] (Suppressed listings, archived, https://web.archive.org/web/20171208054235/https://sellercentral.amazon.com/gp/help/external/200898440, read 2026-10-14)
50. GUIDANCE, historical, 2017. Listing quality covers images, brand and description. Detailed attributes help customers filter. [official] (Listing quality, archived, https://web.archive.org/web/20171208054200/https://sellercentral.amazon.com/gp/help/external/200786710, read 2026-10-14)
51. GUIDANCE (Amazon staff, forum, about 2 years old). The path to suppressed listings is Inventory > Manage All Inventory > Suppressed, then "Fix your products" filtered by attribute. Detail page updates take up to 24 hours. The post treats suppression as hiding from search and browse. [official] (Seller Forums, Cooper_Amazon, "Listing Lounge: Surviving Search Suppression", https://sellercentral.amazon.com/seller-forums/discussions/t/765f5738-4dee-4c42-9c8e-4991cf58ab9b, read 2026-10-14)
52. GUIDANCE (Amazon staff, forum, about 11 months old). The checks:
    - Filter Manage Inventory by "Search Suppressed".
    - Check the Fix Your Products page.
    - Confirm the browse node, an active offer and a launch date that is not in the future.

    Changes take up to 72 hours to show in search. [official] (Seller Forums, Manny_Amazon, "Why Isn't My Listing Showing in Search Results? A Complete Guide", https://sellercentral.amazon.com/seller-forums/discussions/t/fb1124b0-adf9-4933-b470-f75160082cdf, read 2026-10-14)

### L. Detail page rules and Account Health

53. RULE, archived 2020-10-24. The rules:
    - "each product detail page covers a single unique item".
    - No HTML, contact details, prices, availability, reviews or promotional content.
    - Titles up to 200 characters, and fewer in some categories. This is now superseded for non-media by item 41.
    - "You may only update detail pages to better or more accurately describe the product as originally listed". A new version or a rebrand needs a new ASIN.
    - Violations "may result in your selling privileges being temporarily or permanently removed".

    [official] (Product Detail Page Rules, archived, https://web.archive.org/web/20201024072125/https://sellercentral.amazon.com/gp/help/external/200390640, read 2026-10-14)
    - Gap fill: the live page (Product detail page rules, G200390640 v21 r1) carries the same edit rule today: "You may only update detail pages to better or more accurately describe the product as originally listed." The title figure there is now "Product titles must not have more than 75 characters, including spaces, for all product types, excluding media product types". [official] (Product detail page rules, https://sellercentral.amazon.com/help/hub/reference/external/G200390640, read 2026-10-14)
54. RULE (Amazon staff, forum, about 6 years old). The Account Health Rating counts unresolved policy violations by severity. "At Risk" or "Critical" may mean deactivation. Closing or deleting a listing does not resolve a violation. "Some selling policies are not reflected in it." [official] (Seller Forums, News_Amazon, "New tool to help professional sellers monitor account health", https://sellercentral.amazon.com/seller-forums/discussions/t/6601066b17ef3f7d150f32471db646af, read 2026-10-14)
55. RULE. Data Kiosk's Seller Analytics schema has an `AccountHealth` type. Its fields include `accountHealthRatingScore` ("0-1,000 point scale indicating account suspension risk"), order-defect counts and rates, and regional product-defect rates over 120 days, among them `regionInaccurateProductDefectRateT120Days` (products with inaccurate product information). Each field carries `@resultRetention(duration: "P30D")`, which is the retention of the query's result documents, not a 30-day data window. The dataset was announced in the SP-API Release Notes on September 30, 2026. In that schema I found no field for listing-policy violations. (Gap fill: the Seller Performance report does carry one; see items 87–89.) [official] (analytics_sellerAnalytics_2025_03_31.graphql, https://github.com/amzn/selling-partner-api-models/blob/main/schemas/data-kiosk/analytics_sellerAnalytics_2025_03_31.graphql, read 2026-10-14)

### M. The catalogue-wide sweep: searchListingsItems against the notification (gap fill)

A daily health check cannot afford one `getListingsItem` per SKU. Amazon's operation for a store-wide read is `searchListingsItems` (`GET /listings/2021-08-01/items/{sellerId}`, item 25). This section specifies it from the model and the tutorial.

56. RULE. The parameters, as the model states them:
    - `sellerId` and `marketplaceIds`: required.
    - `issueLocale`: "A locale that is used to localize issues. When not provided, the default language code of the first Amazon store is used. Examples: "en_US", "fr_CA", "fr_FR". When a localization is not available in the specified locale, localized messages default to "en_US"."
    - `includedData`: the eight datasets of item 2; "Default: `summaries`". A sweep that does not name `issues` returns no issues.
    - `identifiers` (`maxItems` 20) with `identifiersType`; `variationParentSku` ("listing items that are variation children of the specified SKU") and `packageHierarchySku`. These three are mutually exclusive.
    - `createdAfter` / `createdBefore` and `lastUpdatedAfter` / `lastUpdatedBefore`: ISO 8601; "at or after" / "at or before".
    - `withIssueSeverity`, enum `WARNING`, `ERROR`: "Filter results to include only listing items that have issues that match one or more of the specified severity levels." The enum has no `INFO`.
    - `withStatus`, enum `BUYABLE`, `DISCOVERABLE`: "include only listing items that have the specified status". `withoutStatus`, same enum: "include only listing items that don't contain the specified statuses."
    - `sortBy` (`sku`, `createdDate`, `lastUpdatedDate`; default `lastUpdatedDate`); `sortOrder` (`ASC`, `DESC`; default `DESC`).
    - `pageSize`: integer, default 10, `maximum` 20. `pageToken`.
    - The model's default usage plan for the operation is rate 5, burst 5; "Selling partners whose business demands require higher throughput might have higher rate and burst values". The live figure is the `x-amzn-RateLimit-Limit` header (item 8).

    [official] (listingsItems_2021-08-01.json, read 2026-10-14)
57. RULE. The reply: `numberOfResults` is "The total number of selling partner listings items found for the search criteria (only results up to the page count limit is returned per request regardless of the number found). Note: The maximum number of items (SKUs) that can be returned and paged through is 1000." `pagination` holds `nextToken` and `previousToken`; "When you receive the last page, there is no `nextToken` key in the pagination object." So `numberOfResults` can exceed what the sweep can page through, and says so. [official] (listingsItems_2021-08-01.json, definitions `ItemSearchResults` and `Pagination`, read 2026-10-14)
58. RULE. Paging, from the tutorial:
    - "Even though there can be more than 1,000 SKUs that match the search criteria, the maximum number of results that can be returned and paged through is limited to 1,000. For example, if you set the `pageSize` to 10, the maximum number of possible pages is 100."
    - "The token returned in the `nextToken` field expires 24 hours after generation. After 24 hours, a request with the token returns an HTTP 400 error: `Expired 'pageToken' provided.`"
    - "If you change `marketplaceIds`, `sellerId`, `includedData`, or any filter parameter between pages, the request returns: `Search parameters do not match the provided 'pageToken'.`" "Complete pagination within 24 hours and keep the same parameters across all pages."
    - "URL-encode the `=` character as `%3D` when you pass the token in the `pageToken` query parameter."

    [official] (Search for listings items by product identifier or other listings parameters, https://developer-docs.amazon/sp-api/docs/search-for-listings-items-by-id, read 2026-10-14)
59. RULE. Several stores in one call filter on the first store only: "When you provide multiple `marketplaceIds` values, the operation treats the first value in the array as the **primary Amazon store**." With a filter or sort (`withStatus`, `sortBy`, any non-SKU identifier type), "The operation evaluates filtering and sorting against the primary Amazon store only. The response includes results for additional Amazon stores without applying those filters." Amazon's example: with `withStatus=BUYABLE` across US, CA and MX, the response holds "only SKUs that are `BUYABLE` in the Amazon US store" and, for each, CA and MX data "regardless of their status in those Amazon stores." [official] (Search for listings items…, read 2026-10-14)
    - [seat] Consequence: a health sweep that filters by status or severity must be run once per store. A multi-store filtered call will miss a listing suppressed only in a second store.
60. RULE. The operation's history in the release notes:
    - December 18, 2024: "Added the `searchListingsItems` operation. You can use this operation to return information for multiple listings items based on filters, which include listing IDs, issues, status, and creation date."
    - July 29, 2026: `marketplaceIds` accepts several stores in one region (item 3).
    - September 30, 2026: "Added PRODUCT-level and LISTING-level issue classification to the categories attribute in issue descriptions returned by the `getListingsItem` and `searchListingsItems`" (item 11).

    [official] (SP-API Release Notes, https://developer-docs.amazon/sp-api/docs/sp-api-release-notes, read 2026-10-14)
61. RULE. The notification is an event, not the state. `LISTINGS_ITEM_ISSUES_CHANGE` "notifications are triggered when an issue on a listing is either created, fixed, or updated. The notification payload includes basic listing information, related issue severity, and enforcement actions caused by issues. To retrieve more details about issues associated with a listing, call the Selling Partner API for Listings Items." Payload version 2023-12-13 (EventBridge workflow) carries `SellerId` and `Sku` (required), `MarketplaceId` and `Asin` (optional), `Severities` ("When no issues are affecting the listings item, `NONE` is provided instead") and `EnforcementActions`. It carries no issue `code`, `message`, `attributeNames` or exemption. The release notes record that the removal date of payload version 1.0 moved "from December 11, 2024 to March 26, 2025". [official] (Notification Type Values, https://developer-docs.amazon/sp-api/docs/notification-type-values; SP-API Release Notes; read 2026-10-14)
    - So the two differ in kind. A fresh payload says which SKU changed, when, and the severities and enforcement actions now on it, 15–20 minutes late (item 23), and only to a subscribed destination (item 48). A polled sweep returns the full issue objects for every listing that matches the filter, at the time of the call, capped at 1,000 per query, and needs no destination. A payload can also be overtaken by later processing (GitHub #4516, under practitioners).
62. RULE. `GET_MERCHANT_LISTINGS_DEFECT_DATA` is not offered today. It appears on none of the report-type pages read on 2026-10-14: the index and 15 category pages (Amazon Business, Analytics, B2B Product Opportunities, Browse Tree, Easy Ship, FBA, Inventory, Invoice Data, Order, Payment, Performance, Regulatory Compliance, Returns, Settlement, Tax), nor in the SP-API Release Notes or the SP-API Deprecations Schedule. The URLs `report-type-values-listings` and `report-type-values-seller-performance` answer with the docs site's 404 page. The listing reports the Inventory Reports page offers are `GET_FLAT_FILE_OPEN_LISTINGS_DATA`, `GET_MERCHANT_LISTINGS_DATA`, `GET_MERCHANT_LISTINGS_DATA_BACK_COMPAT`, `GET_MERCHANT_LISTINGS_DATA_LITE`, `GET_MERCHANT_LISTINGS_DATA_LITER`, `GET_MERCHANT_LISTINGS_INACTIVE_DATA`, `GET_MERCHANT_LISTINGS_ALL_DATA`, `GET_MERCHANT_CANCELLED_LISTINGS_DATA`, `GET_MERCHANTS_LISTINGS_FYP_REPORT` and three others (`GET_MFN_PANEU_OFFER_STATUS`, `GET_PAN_EU_OFFER_STATUS`, `GET_REFERRAL_FEE_PREVIEW_REPORT`). The suppression-with-reason report is `GET_MERCHANTS_LISTINGS_FYP_REPORT` (item 46). [official] (Report Type Values, https://developer-docs.amazon/sp-api/docs/report-type-values, and its category pages; Inventory Reports; SP-API Deprecations Schedule, https://developer-docs.amazon/sp-api/docs/sp-api-deprecations; read 2026-10-14)

### N. Why a listing does not show or sell before copy is the reason (gap fill)

Each subsection gives Amazon's words and where cx can read the state. Help pages were read through the content call (section K correction); their figures are for human readers and may change by revision.

#### N1. Stranded inventory and FBA-side buyability

63. RULE. "Stranded inventory is FBA inventory in fulfillment centers that does not have an associated active offer and is not available for sale on Amazon." "Inventory can become stranded due to a variety of reasons. For example, the listing is suppressed or was never created." Amazon's rules on it:
    - "If you have units of an ASIN stranded in the fulfillment center, do not send additional inventory of that ASIN to Amazon. If you add an ASIN with stranded inventory to your shipment, you will receive an alert and your shipment will not be processed."
    - "If you address the cause for the stranded inventory yourself, allow 48 hours for the updates to reflect in your stranded inventory."
    - Amazon creates SKUs the seller did not make: `Amazon.Found.Bxxxxxxxxx` for unlabelled or unexpected units, and `FBAXXXXXXX.Missing#` when units arrive "without a valid, scannable FNSKU barcode". These show as stranded ("The stranded reason will typically display as Missing SKU").
    - The page is marked: "The content in this help page will no longer be updated" (the Inventory Dashboard is replaced by the FBA Dashboard).

    [official] (Fix stranded inventory, G201436600 v19 r2, https://sellercentral.amazon.com/help/hub/reference/external/G201436600, read 2026-10-14)
64. RULE. "If units are stranded, reserved, being researched, or unfulfillable, customers won't be able to buy them." Stranded inventory "is usually due to a listing or account health issue"; "unresolved stranded inventory is subject to removal." Researching "may take up to 60 days". Beyond those states, a product may be unavailable "for shipping to certain parts of the country" when quantities are limited and sales "very low". [official] (Inventory Buyability, GFC63UNUF6LMLK2R v1 r0, https://sellercentral.amazon.com/help/hub/reference/external/GFC63UNUF6LMLK2R, read 2026-10-14)
65. RULE. Where it is read:
    - `GET_STRANDED_INVENTORY_UI_DATA`, "FBA Stranded Inventory Report": "Contains a breakdown of inventory in stranded status, including recommended actions. Content updated in near real-time." Request only; FBA sellers; roles Pricing, Amazon Fulfillment. Columns include `primary-action`, `date-stranded`, `Date-to-take-auto-removal`, `status-primary`, `status-secondary`, `error-message`, `stranded-reason`, `asin`, `sku`, `fulfillable-qty`, `unfulfillable-qty`, `reserved-quantity`.
    - `GET_STRANDED_INVENTORY_LOADER_DATA` is the bulk-fix file, resubmitted through `POST_FLAT_FILE_INVLOADER_DATA`.
    - `GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA`, "FBA Manage Inventory": active inventory with `afn-listing-exists`, `afn-fulfillable-quantity`, `afn-unsellable-quantity`, `afn-reserved-quantity`, `afn-researching-quantity` and more; near real-time.
    - The FBA Inventory API (`getInventorySummaries`) breaks quantity into fulfillable, inbound, reserved, researching and unfulfillable. The word "stranded" does not occur in its model, nor in the Listings Items model.

    [official] (Fulfillment by Amazon (FBA) Reports, https://developer-docs.amazon/sp-api/docs/report-type-values-fba; fbaInventory.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/fba-inventory-api-model/fbaInventory.json; read 2026-10-14)

#### N2. Variation-family health

66. RULE. "Child ASINs with different non-varying attribute values cannot be grouped into a single variation family" (named: "item type keyword," "model name," "style," and "brand"). "Parent and child products within a variation family must be of the same product type and brand, and include similar titles and images." "We regularly review and update our valid variation themes for each product type". [official] (Product variations overview, GH3RMVV3ZDYRRQ5S v2 r1, https://sellercentral.amazon.com/help/hub/reference/external/GH3RMVV3ZDYRRQ5S, read 2026-10-14)
67. RULE. The parent "must be created with "parent" parentage level and cannot have price, quantity, or offer details"; families "with more than 4,000 child ASINs will not be displayed on the detail page." [official] (Create and manage product variations, GEKYC26YEZX2VSHM v4 r1, https://sellercentral.amazon.com/help/hub/reference/external/GEKYC26YEZX2VSHM, read 2026-10-14)
68. RULE and GUIDANCE. Amazon's troubleshooting table:
    - A variation that exists "in the backend" but not on the page: "Processing time not complete, missing inventory, missing images, or suppression errors"; "Wait 24-28 hours after submission for variations to appear."
    - "Unable to create variation family for all child listings": "One or more child ASINs are in "Inactive" status".
    - Reviews after a variation update: "Wait 96 hours … During large-scale events (such as Prime Day or the holiday season), allow up to 1 week."
    - "You cannot change a variation theme after creation." "There is no capability for sellers to delete ASINs from variations".
    - Split variations: "Amazon supports only one product detail page for a given unique product"; split families are "a violation of Amazon's listing policies", and "Amazon will split variation families if identified that the variation theme is incorrect for the category."
    - "Variation families are contributed by various selling partners, and Amazon determines whether a child ASIN should remain within a family." "Amazon reserves the right to manage variation families". Under "Variation hijacking": "other sellers can change families."

    [official] (Troubleshoot product variations, GLQBFJDZ7ZDLXQW8 v4 r2, https://sellercentral.amazon.com/help/hub/reference/external/GLQBFJDZ7ZDLXQW8, read 2026-10-14)
    - Two live Amazon pages give different waits for a variation to show: "Wait about 15 minutes for changes to take effect", then support "If the issue persists after 24 hours" (Variation relationship FAQ, G201951410 v16 r1) against "24-28 hours" above. The FAQ also says: "Once you have created a product with a selected variation theme, you cannot change it." [official] (Variation relationship FAQ, https://sellercentral.amazon.com/help/hub/reference/external/G201951410, read 2026-10-14)
69. RULE. Variation misuse that "can result in your ASIN creation or selling privileges being temporarily or permanently removed": changing a parent or child page "to become fundamentally different from the original product listed"; adding children "that are not true variations of the parent product", including "newer versions or models of the parent ASIN"; adding non-manufacturer multi-packs to an existing parent. The same page sets a "weekly creation limit of 2,000 ASINs" and a listing-creation limit when "your existing catalog contains a significant number of listings that are not generating sales"; sellers without a Brand Registry selling role are limited in creating new ASINs under an enrolled brand. [official] (ASIN creation policy, G201844590 v27 r0, https://sellercentral.amazon.com/help/hub/reference/external/G201844590, read 2026-10-14)
70. RULE. The API side: `searchListingsItems` with `variationParentSku` lists a parent's children (item 56); the `relationships` dataset of `getListingsItem` and Catalog `relationships` show the family (items 2, 30); a parent without BUYABLE is normal (item 21). [official] (listingsItems_2021-08-01.json, read 2026-10-14, for `variationParentSku`; the rest as sourced in items 2, 21 and 30)

#### N3. Duplicate ASINs and merges

71. RULE. "Refrain from creating duplicate pages for a product that already has a detail page." "You must not create a product detail page for a product already in Amazon's catalog." "Never modify the trademark information on an existing ASIN." The product ID "is a non-editable value and cannot be modified once a listing is created, unless it was created with a GTIN exemption." "Listing submissions with unauthorized GTINs will be blocked." [official] (Product detail page rules, G200390640 v21 r1, read 2026-10-14)
72. RULE. Merging, from Amazon's merge page:
    - The tool is "Merge duplicate product detail pages". "The product attributes of both the products must be the same." "ASINs belonging to two different Brands cannot be merged". "ASINs which have been removed from Amazon's product catalog cannot be merged into another active ASIN." "ASINs that have no active offer … cannot be merged into an ASIN which has active offers." "No, parent ASINs cannot be merged".
    - On Brand Registry the page contradicts itself: "Any ASIN under the Amazon Brand Registry program cannot be merged to another ASIN and no other ASIN can be merged into a Brand Registered ASIN", and in a note: "ASINs for brands registered in Amazon Brand Registry can only be merged if the requester is the rights owner."
    - After a merge, "the target ASIN becomes the main listing", the source page redirects, inventory combines under the target, "Product reviews may be shared based on eligibility", and "Sales history of the source ASIN combines under target ASIN, Performance metrics of the source ASIN will transfer to the target ASIN." Timing: "the merge action takes effect immediately in most situations, there are times when it could take up to 24 hours."

    [official] (Merge Duplicate Product Pages, G201950590 v6 r0, https://sellercentral.amazon.com/help/hub/reference/external/G201950590, read 2026-10-14)
    - An Amazon staff post adds: "If the items are not identical, the tool will not be able to merge the ASIN's." [official, staff forum] (Seller Forums, Michelle_Amazon, "Listing Lounge: Duplicate ASIN's, when and how to merge them", marked "updated by moderator 3 years ago", https://sellercentral.amazon.com/seller-forums/discussions/t/6abc87e8-d5a7-48fd-9ecf-c03bac600be6, read 2026-10-14)
    - The older page "Potential duplicates and split variations" (G202105450 v7 r2) now holds one line pointing to Troubleshoot product variations. [official] (read 2026-10-14)
73. RULE. Duplicates in the API:
    - Issue `4005013`: "The information provided matches an item that is already in your catalog (SKU: matched_sku; ASIN: matched_asin). Items cannot be duplicated in your catalog." "A SKU is an un-editable attribute; after the item is created, it cannot be changed." The `DUPLICATE` issue category exists (item 11). [official] (Listings Items API Issues Troubleshooting, read 2026-10-14)
    - Error 8541 (Seller Central's catalog conflict): a submitted attribute "corresponds to the product ID of an existing ASIN" with a different value. "Some attributes cannot change after ASIN creation. Examples include attributes like GTIN and item package quantity." Accepting Amazon's values in Fix Your Products means "your submission will be processed in the next 15 minutes". If the product found is different, "click Request product detail page change". [official] (Error 8541, G200692330 v23 r0, https://sellercentral.amazon.com/help/hub/reference/external/G200692330, read 2026-10-14)
    - "When more than one seller contributes data to a product, Amazon determines which seller's product information will be displayed on the product detail page." "Do not create multiple listings for the same product." [official] (About products and listings, G200182950 v7 r0, https://sellercentral.amazon.com/help/hub/reference/external/G200182950, read 2026-10-14)

#### N4. Brand Registry levers

74. RULE. On a Brand Registry ASIN, contributions from users with the same selling role "will be weighted equally"; if two or more authorized users contribute to one attribute, "our automatic system may choose which information should be displayed based on the contributing parties sales volume, refund rate, buyer feedback, and A-to-z claims." "We won't mediate between authorized users". "Contributions made by an authorized user to a Brand Registry branded ASIN can't be edited by the Selling Partner Support team." Incorrect information goes to "Account Health - Report Abuse". [official] (Product detail page rules, G200390640 v21 r1, read 2026-10-14)
75. RULE (Amazon announcement, forum). "Brands can now review all Amazon-initiated changes made to their listings in the last 60 days with Review Listing Changes." It "replaces the excel-based Review Listing Updates tool on Explore Brand Selection" and "also includes AI-powered content suggestions" made "when we detect potentially incorrect or policy-violating content." "You can approve the suggestion or disagree and submit feedback." "If you don't address the suggestion within 14 days, it will be published automatically." Access: "all brand representatives that are primary users", delegable "through User Permissions". The post shows "8 months ago", no absolute date. [official] (Seller Forums, News_Amazon, "Use new dashboard to view changes to your brand's product detail pages", https://sellercentral.amazon.com/seller-forums/discussions/t/69cc20fd-825d-447f-a58d-bce282519770, read 2026-10-14)
    - The title page confirms the tool by name: policy-violating titles "Brand owners can also see … in Review listing changes." [official] (Product title requirements and guidelines, GYTR6SYGFA5E3EQC v21 r2, read 2026-10-14)
76. GUIDANCE (Amazon marketing page). Brand Registry lists, among others, A+ Content, Brand Stores, Brand Analytics, Manage Your Experiments, Transparency, "Report a Violation" ("Report suspected IP infringement, store policy violations, and regulatory compliance concerns—all in one place") and Project Zero. Eligibility: "Have a pending or registered trademark for your brand name or logo that's issued by the designated government trademark office of a country with a corresponding Amazon store." It also claims, under Manage Your Experiments, that acting on optimized content "can increase sales by up to 25%" (footnote "Amazon internal data"; a marketing figure, not a rule). Amazon's own tools page for the same feature gives a different figure: "Optimized content can help increase sales by up to 20%", also footnoted "Amazon internal data" (Test listing content with Manage Your Experiments | Sell on Amazon, https://sell.amazon.com/tools/manage-your-experiments, read 2026-10-14). The two Amazon pages disagree; the Manage Your Experiments help page (GVP453K5XRBJS7Y9 v7, capture under the office's capture folder (outside this repository)) states no percentage. Neither figure is a prior for a change. [official] (Amazon Brand Registry | Sell on Amazon, https://sell.amazon.com/brand-registry, read 2026-10-14)
77. RULE. Manage Your Experiments: "To run experiments, you must own a brand"; an ASIN is eligible only with "enough traffic in recent weeks"; "(Note: Experiments do not impact search rankings)"; "Only one experiment can be run on any particular ASIN at a time". [official] (Manage Your Experiments, GVP453K5XRBJS7Y9 v7 r0, https://sellercentral.amazon.com/help/hub/reference/external/GVP453K5XRBJS7Y9, read 2026-10-14)

#### N5. Restricted products, approvals, product safety and hazmat

78. RULE. Restricted products: violations bring "immediately suspending or terminating selling privileges, destroying inventory in our fulfillment centers without reimbursement, returning inventory, terminating the business relationship, and permanent withholding of payments." Listings "purposefully inaccurate, miscategorized, or deceptively described to circumvent" restrictions risk "the immediate termination of selling privileges." [official] (Restricted products, G200164330 v6 r0, https://sellercentral.amazon.com/help/hub/reference/external/G200164330, read 2026-10-14)
79. RULE. Approvals: Add Products shows "Not Available", "Sell this product" or "Apply to sell"; restrictions apply to individual ASINs, brands, brands within a category, categories and sub-categories, and "Some products require multiple approvals." Review takes "2-7 business days". "Your account does not qualify" means "This decision cannot be appealed". Selling privileges can change when "New restrictions are added to existing products" or "Product safety or compliance requirements change". [official] (Categories and products that require approval, G200333160 v44 r0, https://sellercentral.amazon.com/help/hub/reference/external/G200333160, read 2026-10-14)
80. RULE. Enhanced safety categories: "Amazon notifies you in Account Health if your products must meet these requirements." "This list changes as Amazon adds new categories". Requirements can include product liability insurance ("at least USD 1 million in coverage per event and in total"), third-party testing through an authorized TIC provider and random "surveillance testing"; Amazon "may remove your products from sale" when, among other things, insurance lapses or "No legitimate supply chain can be confirmed". [official] (Product categories with enhanced safety listing compliance requirements, GUQ848NB5HZ6M6A4 v1 r5, https://sellercentral.amazon.com/help/hub/reference/external/GUQ848NB5HZ6M6A4, read 2026-10-14)
81. RULE. "If your product does not meet Amazon's safety or compliance requirements, your listing may be deactivated". Documentation from suspended labs is not accepted: "To avoid potential product suppression, we recommend that you review the list of suspended labs". [official] (Safety, compliance, and product restrictions, GXMGGPL6LC4CVXHT v10 r1, https://sellercentral.amazon.com/help/hub/reference/external/GXMGGPL6LC4CVXHT, read 2026-10-14)
82. RULE. Dangerous goods (hazmat): "The physical and chemical properties of a unique, finished product define whether or not it's a dangerous good. That's why there is no predefined classification based on product type." Amazon requires "specific dangerous goods information and documentation even if your product is not regulated as a dangerous good." "You have 14 business days to comply with product safety compliance requirements." The FBA classification is checked with the "Look up an ASIN tool". [official] (Dangerous goods identification guide (hazmat), G201003400 v25 r0, https://sellercentral.amazon.com/help/hub/reference/external/G201003400, read 2026-10-14)
83. RULE. Not all compliance shows on Account Health: "Some policy violations related to product safety and Extended Producer Responsibility are reported separately on the Manage Your Compliance and Extended Producer Responsibility dashboards." Removed content is listed under "View all" in the Product Policy Compliance section. [official] (Account health FAQ, G200285250 v9 r1, https://sellercentral.amazon.com/help/hub/reference/external/G200285250, read 2026-10-14)
    - API side: approval needs show in `getListingsRestrictions` (`APPROVAL_REQUIRED`, item 34) and in the issue category `QUALIFICATION_REQUIRED` (item 11). No SP-API operation found in this pass returns hazmat classification or the Manage Your Compliance dashboard.

#### N6. Account Health categories

84. RULE. The Account Health Rating "ranges from 0 to 1,000" and gives "near real-time status". "All new sellers start with a score of 200", over "the last 180 days". Bands: green "Healthy" 200–1,000, yellow "At Risk" 100–199, red "Unhealthy" "99 or lower". Four severities ("critical, high, medium, and low"); repeat violations can reach the per-policy maximum "as low as two violations for higher severity violations". "Regardless of your AHR score, Amazon may deactivate your account immediately if we suspect fraudulent, deceptive, illegal, or otherwise harmful activity". [official] (Account Health Rating program policy, G200205250 v24 r2, https://sellercentral.amazon.com/help/hub/reference/external/G200205250, read 2026-10-14)
85. RULE. Policies in the AHR: Anti-Counterfeiting, Brand Name, Intellectual Property, Marketplace Fair Pricing, ASIN Creation, Communication guidelines, Customer Product Reviews, INFORM Consumers Act, Product condition guidelines, Product detail page rules, adult products, software, Product safety and compliance, Restricted Products, Selling policies and seller code of conduct. "not all of Amazon's policies are currently included in AHR." Detection uses "machine learning techniques and automation and expert human review". [official] (Policies included in Account Health Rating, GQ5DSES264XVXNX7 v7 r0, https://sellercentral.amazon.com/help/hub/reference/external/GQ5DSES264XVXNX7, read 2026-10-14)
86. RULE. "Listings aren't removed from the Account Health page if you change the listing status (such as closing or deleting the listing from your inventory)." This is the current Amazon page behind item 54. A critical violation gives "a three-day period to address the critical violation before account deactivation". [official] (Account health rating, GR786P4BPEVKTBAG v17 r5, https://sellercentral.amazon.com/help/hub/reference/external/GR786P4BPEVKTBAG, read 2026-10-14)
    - The labels differ between live pages: "Healthy" / "At Risk" / "Unhealthy" (items 84, 86) against "Good" and "At Risk" or "Critical" (Account health FAQ, G200285250).
87. RULE. Where it is read: `GET_V2_SELLER_PERFORMANCE_REPORT` "Contains the individual performance metrics data from the Seller Central Account Health dashboard." Role Selling Partner Insights; sellers; "This report can only be requested"; schema `accountHealthReport-2020-11-18`. The Performance Reports page lists per-policy blocks: `listingPolicyViolations`, `productAuthenticityCustomerComplaints`, `productConditionCustomerComplaints`, `productSafetyCustomerComplaints`, `receivedIntellectualPropertyComplaints`, `restrictedProductPolicyViolations`, `suspectedIntellectualPropertyViolations`, `foodAndProductSafetyIssues`, `customerProductReviewsPolicyViolations`, `otherPolicyViolations`, `documentRequests`, each with a reporting range, `status`, `targetValue`, `targetCondition` and `defectsCount`; plus `policyViolationWarnings` and `accountHealthRating` (`ahrStatus`, `ahrScore`). `warningStates` "is deprecated and always returns an empty array." [official] (Performance Reports, https://developer-docs.amazon/sp-api/docs/report-type-values-performance, read 2026-10-14)
88. RULE. The schema file in Amazon's repository: per-policy `Status` "could be GOOD or BAD or NONE"; `accountStatuses[].status` is `NORMAL`, `AT_RISK` or `DEACTIVATED`; `accountHealthRatingStatus` "could be GREAT or WARNED". The file lists the policy blocks above except `customerProductReviewsPolicyViolations` and `policyViolationWarnings`, and carries no score field, so the docs page and the schema file differ. [official] (accountHealthReport-2020-11-18.json, https://github.com/amzn/selling-partner-api-models/blob/main/schemas/reports/accountHealthReport-2020-11-18.json, read 2026-10-14)
89. Correction to item 55: the Data Kiosk schema has no listing-policy field, but this report does (`listingPolicyViolations` and the blocks above). [official] (items 87–88)

#### N7. Pricing-driven inactivity

90. RULE. Pricing Health covers "All offers that are currently deactivated because of potential pricing errors" ("When we detect potential pricing errors in your listings, we notify you and deactivate the affected listings") and, separately, offers "currently ineligible to become the Featured Offer" because they are above the competitive external price or "priced significantly higher than recent prices observed on Amazon or elsewhere". The reference prices named include the Featured Offer price, "The 60-day average selling price", "The highest 14-day price (shipped and sold by Amazon)", the list price and others. A dispute of the competitive reference price can be resolved "in as little as 30 minutes". [official] (Pricing Health, GSTH6YN3BR8XNWBW v22 r0, https://sellercentral.amazon.com/help/hub/reference/external/GSTH6YN3BR8XNWBW, read 2026-10-14)
91. RULE. For pricing that "harms customer trust", "Amazon can remove the Featured Offer, remove the offer, suspend the ship option, or in serious or repeated cases suspend or terminate selling privileges." [official] (Amazon Marketplace Fair Pricing Policy, G5TUVJKZHUVMN77V v11 r0, https://sellercentral.amazon.com/help/hub/reference/external/G5TUVJKZHUVMN77V, read 2026-10-14)
92. RULE. Automate Pricing's validation (maximum "less than 6 times the ASIN's recent sales price or $200.00, whichever is higher") applies only to repricing: "If you set your minimum and maximum prices manually … the Automate Pricing rules will not apply." [official] (Minimum and Maximum Price Validation, G202024630 v2 r10, https://sellercentral.amazon.com/help/hub/reference/external/G202024630, read 2026-10-14)
    - API side: the price-error issue codes `19037`, `19038`, `18701` and the Featured Offer warning `100708` (item 15), and the `PRICING_HEALTH` notification (item 48).

#### N8. Image standards and image suppression

93. RULE. "Every product requires at least one compliant main image." Main image: "pure white background (RGB color values: 255, 255, 255)", "Show the product as 85% of the image". "Images below 500 pixels on the longest side cannot be uploaded"; "Images with 1,000+ pixels on the longest side enable the zoom function." "If there is no main image that meets the requirements, we may temporarily remove the product listing from search until a compliant main image is provided." "Uploading an image doesn't guarantee it will be displayed"; "We may also modify images that you submit"; a selected image "can take up to 24 hours" to appear. [official] (Product image guide, G1881 v28 r9, https://sellercentral.amazon.com/help/hub/reference/external/G1881, read 2026-10-14)
94. RULE. Image suppression: Amazon may "Suppress (hide) your product listing from search until you provide a compliant image" or "Remove or modify non-compliant images (for example, removing a watermark)". Suppressed products are under "the Fix tab in Manage Products"; failed files under "Submission status" with the "Content compliance issues report type". The suppression table names, for main images: text, logo, graphics or watermark; non-white background; image missing; additional items; cropped product; packaging or tags; propping; and, for any image, blur or pixelation, "Product too small" and prurience, plus apparel and softlines rules. [official] (Image suppression, GT8RSE9S9NK4LP6Z v9 r0, https://sellercentral.amazon.com/help/hub/reference/external/GT8RSE9S9NK4LP6Z, read 2026-10-14)

#### N9. Amazon's own changes to content: AI suggestions, reconciliation, Manage Products

95. RULE. The Enhance tab gives "AI-generated suggestions"; "AI-generated content can include features and claims that were not in the listing's original content." "If your contribution is verified by Amazon, it will show on the product detail page within 48 hours. If, after the allotted period, your contributions don't show …, it means that Amazon's system ahs [sic] selected another contrubutor's [sic] information". The Listing Quality Indicator grades a listing Poor, Fair, Good, Great or Optimized; it "does not account for dynamic factors such as offer price, fulfillment, or seasonality" and "should be used as a directional indicator rather than a predictor of visibility or sales." [official] (Enhance Listings, G88AQCL62ED7WDGA v1 r5, https://sellercentral.amazon.com/help/hub/reference/external/G88AQCL62ED7WDGA, read 2026-10-14)
96. RULE. Manage Products has three tabs. "Fix - Products with issues blocking sales or visibility, such as suppressed listings, stranded inventory, or restriction flags." Common reasons a listing becomes inactive: "Inventory depletion", "Pricing errors", "Policy concerns", "Quality issues". "Draft listings cannot be discovered or bought by customers." [official] (Manage Products dashboard guide, GMZU6QTPKCVGLXKS v1 r0, https://sellercentral.amazon.com/help/hub/reference/external/GMZU6QTPKCVGLXKS, read 2026-10-14)
97. RULE. Listing quality "is determined by seven key components: title, bullet points, attributes, images, video, A+ Content, and search optimization." [official] (Listing quality, G200786710 v5 r1, read 2026-10-14)
98. RULE. The live Suppressed listings page still says Amazon will "hide (or suppress) from search and browse non-media listings that do not meet certain standards", lists child-listing requirements (shoes, jewelry, watches, luggage, consumables: department, size, color, unit count), and gives the older title figures "less than 80 characters for apparel, shoes, and luggage categories and 130 characters for all other categories". The fix path is now Manage All Inventory, "Activate listings". [official] (Suppressed listings, G200898440 v13 r0, https://sellercentral.amazon.com/help/hub/reference/external/G200898440, read 2026-10-14)
99. RULE. A non-compliant existing title "might be automatically corrected or it might not appear in our search results." Policy-violating titles "can be viewed directly in Manage All Inventory". On timing, a title or item-highlights change "is accepted immediately but can take 24 to 48 hours to be processed and displayed on Amazon stores, including search results and the product detail page." [official] (Product title requirements and guidelines, GYTR6SYGFA5E3EQC v21 r2, read 2026-10-14). Together with the forum announcement in item 42 (gradual AI rewrite after July 27, 2026) and the 14-day auto-publish in item 75, Amazon states three routes by which listing content changes without a seller's edit.
    - Amazon's pages disagree on what happens to a non-compliant existing title. The title page says it "might be automatically corrected or it might not appear in our search results"; the forum answers post (item 42) says listings stay "active, editable, and searchable" while titles are rewritten gradually; Submit modular titles says the structure "does not affect your current listings unless you submit an update" (item 41). Which one applies to a given listing is read at run time, not chosen: `summaries[].status` (DISCOVERABLE present or not) and `issues[]` from `getListingsItem`, and the Catalog `itemName` from `getCatalogItem` against the submitted `item_name`. [official] (the three pages named, read 2026-10-14)
100. GUIDANCE (Amazon announcement, 2023). The generative-AI listing tool will "enrich existing listings"; sellers can "directly submit the automatically generated content to the Amazon catalog". Amazon's catalog VP Robert Tekiela: "we can infer, improve, and enrich product knowledge at an unprecedented scale". [official] (Amazon launches generative AI to help sellers write product descriptions, Mary Beth Westmoreland, September 28, 2023, https://www.aboutamazon.sg/amazon-launches-generative-ai-to-help-sellers-write-product-descriptions, read 2026-10-14)

#### N10. Search-term bytes and style guides

101. RULE. The indexing limit is on two live US help pages and the API's input check is a different figure:
    - "Search Terms (generic_keywords) should be less than 250 bytes long … If it exceeds the limit, the attribute is completely ignored by Amazon Search. For other length limits in the table above, if limit exceeds, Amazon Search indexes up until the length limit and ignores any excess." The table gives `generic_keywords` "249". [official] (Keyword attributes explained, GF2C2L6RCFZGWBXC v4 r1, https://sellercentral.amazon.com/help/hub/reference/external/GF2C2L6RCFZGWBXC, read 2026-10-14)
    - "We limit the length of the Generic Keyword attribute to less than 250 bytes." "Search terms can be eliminated if prohibited search terms such as brand names, ASINs, or offensive language are supplied". [official] (Optimize your product discoverability, G10471 v13 r1, https://sellercentral.amazon.com/help/hub/reference/external/G10471, read 2026-10-14)
    - "Use search terms effectively" states no figure today. It says "the Generic keyword field in Seller Central stops accepting inputs when the byte limit is reached", that "Amazon search does not count spaces or punctuation", that prohibited terms "may result in your ASIN being suppressed", and that since December 6, 2023 the field "is required for the following 23 product types". [official] (Use search terms effectively, G23501 v14 r0, https://sellercentral.amazon.com/help/hub/reference/external/G23501, read 2026-10-14)
    - The 500 bytes for `generic_keyword` under code `90225` (item 17) is the Listings Items API's maximum length for a submitted value, not the indexed length. The page still lists it today. The schema's `generic_keyword` limits were not read here (no API call); they live in `getDefinitionsProductType`.
    - Reconciled 2026-10-14. Amazon's figures disagree with one another, and this file does not pick one: "less than 250 bytes" (G10471 v13; Keyword attributes explained's prose), "249" (the same page's table), no figure (the live US G23501 v14), 500 bytes (Issues Troubleshooting, code `90225`), and, in third-party copies of Amazon product type schemas recorded in elements/search-terms.md, `maxUtf8ByteLength` 250 (a DE copy) or 2000 (AU and ES copies) with `maxLength` 500. The help-page figures describe what search indexes; the schema and code `90225` describe what a write accepts. The binding write limit is `maxLength` and `maxUtf8ByteLength` on `generic_keyword` in `getDefinitionsProductType` for the listing's product type and store, read at run time. On spaces: the live US page says "Amazon search does not count spaces or punctuation", and so does the live UK page (Use search terms effectively, G23501 v9 en-GB, capture under the office's capture folder (outside this repository)), which also says "If Search Terms are over the limit, none of the Search Terms for that ASIN will be indexed". The "spaces are counted in the UK" wording is from a 2022 archive (method/help-page-access.md, C3), not the current UK page. Amazon's example validator, as recorded in elements/search-terms.md, counts the whole string's bytes, spaces included, for the write check. [official] (the pages named; captures G10471-v13, GF2C2L6RCFZGWBXC-v4, G23501-v14, G23501-v9-en-GB under the office's capture folder (outside this repository), read 2026-10-14)
102. RULE and GUIDANCE. "Comply with any relevant style guides" (Product detail page rules, G200390640). The style-guide page says category guides are PDFs, allows a lifestyle main image only for "BED, BED_FRAME, MATTRESS, RUG, RUG_PAD, SOFA", and links the "Amazon Services Quick Start Style Guide" (a 2018 PDF). [official] (Product page style guides, G200270100 v18 r1, https://sellercentral.amazon.com/help/hub/reference/external/G200270100, read 2026-10-14)
    - The linked 2018 PDF is stale against the live pages: title "Keep it under 200 characters" (live: 75), image "at least 1,000 dpi" and product "at least 80 percent of the image area" (live: 1,000 pixels for zoom, 85%). [official, dated 2018] (Amazon Services Quick Start Style Guide, https://m.media-amazon.com/images/G/01/rainier/help/Selling_on_Amazon_Quick_Start_Style_Guide_2018.pdf, read 2026-10-14)
    - The category style-guide table is not reachable by this route: the "Bulk listing templates" page (G1641 v36 r1), which the style-guide page points to, was served with no PDF links. [official] (Bulk listing templates, https://sellercentral.amazon.com/help/hub/reference/external/G1641, read 2026-10-14)

## What practitioners add

- **eComEngine on inactive, suppressed and deleted.** It separates three states:
  - Inactive: "buyers cannot purchase".
  - Search suppressed, quoting Amazon: "products which Amazon has removed from the Amazon site product search".
  - Deleted: all details removed, sometimes by an Amazon merge. The fix for a wrong merge is a case with both ASINs and evidence.

  Reasons show on Fix Your Products. No author or date is shown. [opinion] (eComEngine, "How do I fix inactive, suppressed, and deleted listings?", https://www.ecomengine.com/help/inactive-suppressed-deleted-listings, read 2026-10-14)
- **Ellen Sipp-Paris (eComEngine) on the Listing Quality Dashboard.** She describes an "Improve listing quality" tab (missing attributes, with recommendations) and a "Review at-risk listings" tab (information to add "before a certain date to prevent possible suppression"). Since early 2023 it has shown a potential sales lift, estimated from "sellers similar to you". Amazon "doesn't notify you when your listing has been suppressed". [opinion] (eComEngine, "How to Use the Amazon Listing Quality Dashboard", updated February 21, 2025, https://www.ecomengine.com/blog/amazon-listing-quality-dashboard, read 2026-10-14)
- **Perpetua on ads.** Listing health gates ads: "Not in Buybox", "Ad Does not Have Decoration or Buyability Data" ("Your product is not currently buyable"), and a listing "missing images, which are required for your ad to run". [opinion] (Perpetua Help, "Red Dot Errors and Ads Not Serving", March 2024, https://help.perpetua.io/en/articles/3151158-red-dot-errors-and-ads-not-serving, read 2026-10-14)
- **Amazon developer-support staff on GitHub** (not a documentation page). Two threads:
  - #4516, "Not getting issues for a SKU despite receiving a LISTINGS_ITEM_ISSUES_CHANGE notification about it" (opened 2025-01-12). Jawher of Selling Partner Developer Services (2025-01-13) found the SKU buyable and discoverable with no issues and suggested "more validations/processing were run later on and eventually issues got removed and the listing became healthy again"; for a one-off, "I would suggest to ignore the notification." The current read wins.
  - #5388, "[Listings Items 2021-08-01] Issue 100720 became blocking on 2026-09-22 and now rejects PATCHes that were accepted before" (opened 2026-09-24 by a developer). A PATCH carrying only `item_name` came back `INVALID` with `100720` ("language data not admitted in this marketplace") on other, untouched attributes. The assigned Amazon staff member, signing "Ritika", wrote on 2026-10-02 that an `ATTRIBUTE_SUPPRESSED` value "is silently suppressed, it will not be published to the catalog for that marketplace", and on 2026-10-05 that "if the status of API response says INVALID, all attribute updates on that SKU submission are blocked." On 2026-10-09 Amazon called the 100720 blocking "a bug on our side", and the thread was closed as completed after the reporter saw no further rejections. So the rejection over untouched attributes was a defect, not designed behaviour; the "INVALID blocks the whole submission" statement stands.

  [opinion] (amzn/selling-partner-api-models issue #4516, https://github.com/amzn/selling-partner-api-models/issues/4516; issue #5388, https://github.com/amzn/selling-partner-api-models/issues/5388, read 2026-10-14)
- **A practitioner on GitHub, on one ASIN and many SKUs.** One ASIN can be represented by many listings or MSKUs on one seller account, and FBA inventory is tied to the listing, not the ASIN. [opinion] (kevnhowe, issue #4523, https://github.com/amzn/selling-partner-api-models/issues/4523, read 2026-10-14)
- **Keepa's data documentation (third-party vendor) on competitor content.** These fields exist:
  - `title`: "Amazon limits titles to 75 characters, including spaces, in all categories except media"; the rest is in a separate `itemHighlights` field (up to 125 characters).
  - `features`: bullets, cut at 1,000 characters each ("This limitation may change in the future without prior notice").
  - `description`: cut at a length Keepa's two documents state differently (2,000 characters in the Java comment, 4,000 on the web page; see the reconciliation below); most contain HTML.
  - `images`, `brand`, `model`, `color`, `size`, `itemTypeKeyword`, `categoryTree`, `variations` (parent ASINs only; "up to 50" in the Java comment, "up to 4000" on the web page; see below), `videos`, `aPlus` (needs the `aplus` parameter).
  - `productType` is Keepa's own product-type code (a byte, "Must always be evaluated first"), not Amazon's product type.
  - `returnRate`: `1` low, `2` high, `null` when unavailable or average.
  - `lastUpdate` and `listedSince`, in Keepa minutes.
  - `parentAsinHistory`: when the item's parent ASIN changed.

  I found no title or bullet history field. [opinion] (keepacom/api_backend, Product.java, https://github.com/keepacom/api_backend/blob/master/src/main/java/com/keepa/api/backend/structs/Product.java, read 2026-10-14)

  Gap fill: the description and variations figures above come from the Java client's comments only. Keepa's web documentation now gives different figures: "We limit the product description to a maximum of 4000 characters", and `variations` "Contains up to 4000 variations of this product". `features` stays at "a maximum of 1000 characters", and "We started tracking parentAsin changes on March 18th 2024." (The gap fill's further claim that the web page is Keepa's current statement and the Java comments are stale is withdrawn: neither document is dated, so which is newer is unproven.) [opinion, vendor] (Product Object — Keepa API Documentation, https://keepa.com/api-docs/product-object.html, read 2026-10-14)

  Reconciled 2026-10-14: both documents were re-opened. Product.java on the `master` branch still reads "We limit the product description to a maximum of 2000 characters" and "Contains the dimension attributes for up to 50 variations of this product. Only available on parent ASINs."; the web page reads "We limit the product description to a maximum of 4000 characters (if the description is longer it will be cut off)" and "Contains up to 4000 variations of this product." Keepa's two documents disagree; this file does not pick one, and the figures are the vendor's, not Amazon's. At run time cx takes what Keepa returned: a description of exactly either length, or a `variations` list of exactly 50, is treated as possibly cut, and for the seller's own listing cx reads `product_description` from Listings Items. Amazon's "more than 4,000 child ASINs" display limit (item 67) is Amazon's, not Keepa's array size. This matches angles/competitor-set.md and angles/competitor-discovery.md, which record the same disagreement.
- **Modern Retail on AI rewrites of bullets** (Allison Smith, "Amazon Briefing: Gen AI is taking over product listings on Amazon & sellers aren't happy about it", August 8, 2024, updated August 12). The article reports that a July 31, 2024 forum post announced new bullet rules, with Amazon's AI rewriting non-compliant bullets from August 15. Amazon's statement to the outlet: "sellers can choose to accept, modify, or decline the suggestions altogether, unless there is a listing policy violation." Practitioners quoted:
  - Jon Elder (Black Label Advisor): "Right now, their AI model is making updates and making a lot of mistakes."
  - Leah McHugh (eCommerceChris): "they're not giving paths for an actual person to override it". She also describes AI miscategorizing over 2 million listings, with one seller's sales down about 60%. That figure is her account, not a measurement.

  [opinion, press] (https://www.modernretail.co/technology/amazon-briefing-gen-ai-is-taking-over-product-listings-on-amazon-sellers-arent-happy-about-it/, read 2026-10-14)
- **eComEngine on content changed by others.** Content is changed by hijackers, by other resellers on the same ASIN ("Amazon's algorithm then attempts to choose the best-performing title, image, and other details in order to maximize sales") and by Amazon's automated systems. Its fix order: Manage All Inventory, then a flat file, then "Fix a product page", then a Seller Support case, "allowing at least 24 hours in between". It credits Liz Adamson (EMA Consulting) with advising brand owners to contact Brand Registry "asking to get Page Detail control back". No date is shown. [opinion] (eComEngine, "What are listing content alerts? What should I do if content changes?", https://ecomengine.com/help/listing-content-alerts, read 2026-10-14)
- **SellerApp on stranded causes** (Nived Uthaiah P, "Amazon Stranded Inventory Is Costing You More Than You Think ( Here's How to Fix It)", July 28, 2026). Causes it lists include "Your listing was suppressed due to missing compliance documentation", "Your ASIN was merged or removed from the catalog after a category-level cleanup", "A SKU mismatch occurred between your listing and FBA inventory record" and "Amazon flagged a missing attribute, rendering the listing inactive and stranding the inventory". It recommends a weekly check. The fee figures in the article are not used here. [opinion] (https://www.sellerapp.com/blog/amazon-stranded-inventory/, read 2026-10-14)

## Published research

- **Using LLMs to improve Amazon product listings** (Abhishek Agrawal, Amazon Science, November 28, 2025). Amazon's "catalogue AI solutions are correcting and updating product attributes at the scale of the Amazon Stores". Seller values are brought in "within days". It reports no shopper-facing metric. [research] (https://www.amazon.science/blog/using-llms-to-improve-amazon-product-listings, read 2026-10-14)
- **CatalogRAG: Retrieval-guided LLM prediction for multilingual e-commerce product attributes** (Bryan Zhang, Suleiman Khan, Stephan Walter, KDD 2025 Workshop on LLM4ECommerce). Amazon predicts missing attribute values from similar catalog entries. Retrieval narrows by product type, then uses text similarity, glance views and brand. It reports up to +43.32% entry-level completeness in US, DE and FR. The number is the paper's, not a rule. It shows that Amazon fills attributes the seller left empty. [research] (https://www.amazon.science/publications/catalograg-retrieval-guided-llm-prediction-for-multilingual-e-commerce-product-attributes, read 2026-10-14)
- **Deep metric learning to hierarchically rank—An application in product retrieval** (Kee Kiat Koo, Ashutosh Joshi, Nishaanth Reddy, Ismail Tutar, Vaclav Petricek, Changhe Yuan, Karim Bouyarmane; EMNLP 2023). "In this paper, we develop a model to identify duplicate and near-duplicate products across stores." Such a model "can be used to unify product catalogs worldwide". Its A/B tests report searches with at least one click up 0.8% in low-traffic stores and new-product clicks up 1.72% in established stores. These are the paper's numbers. It shows Amazon research on duplicate detection across stores; it does not show how Seller Central merges a seller's duplicates. [research] (https://www.amazon.science/publications/deep-metric-learning-to-hierarchically-rank-an-application-in-product-retrieval, read 2026-10-14)
- **Not found.** I found no peer-reviewed study that measures the effect of Amazon listing completeness or suppression on sales. Completeness-to-conversion percentages on vendor blogs trace to no primary study and are not used here. "Amazon Search: The Joy of Ranking Products" (Sorokina, Cantú-Paz, SIGIR 2016, DOI 10.1145/2911451.2926725) exists, but its full text was not reached and is not cited for content.

## Stable enough for a skill

These hold at the level of mechanism. Every number below is located, not pinned.

- A listing's address is `{sellerId}/{SKU}`, and the ASIN-to-SKU step is `searchListingsItems` with `identifiersType=ASIN` (model file). One ASIN can have several of the seller's SKUs (a practitioner's statement, GitHub #4523, not an Amazon page).
- `includedData` must name what is wanted. The default is `summaries`, which carries no issues and no attributes.
- Health has three parts, read together:
  - `summaries[].status`: BUYABLE and DISCOVERABLE, per store.
  - `issues[]`: severity, categories, enforcements and exemption.
  - Whether the Catalog shows what was submitted.

  An empty `issues` list is not proof of health.
- Discoverable and buyable are separate. Search suppression removes discoverability and can leave buyability. `LISTING_SUPPRESSED` and `CATALOG_ITEM_REMOVED` remove buyability. `ATTRIBUTE_SUPPRESSED` drops one value from the catalog. An exemption with an expiry date is a dated warning.
- Listings Items `attributes` is the seller's submission. Catalog Items is Amazon's reconciled view, which can differ because of brand-owner precedence, Amazon's own data, AI rewrites and title splitting. `generic_keyword` exists only on the Listings side.
- `ACCEPTED` means queued, not done. Re-read the listing after processing, and expect a product type switch to surface "missing" attributes.
- Before writing:
  1. Read the live schema for the product type. Limits, required attributes and enums live in `getDefinitionsProductType`, change monthly and can change early.
  2. Read the listing's existing `attributes` and `issues`.
  3. Patch whole top-level attributes only.

  `VALIDATION_PREVIEW` checks without persisting and is for a handful of SKUs.
- The issue code table and the categories enum grow and get remapped. Read `code` and `message` from the live response, and point the seller to Error code explanations.
- Reports lag by hours (the freshness the listing-status page states). The FYP report is the store-wide suppression list with reasons. ALL_DATA is the whole inventory. Report names, options and waits are door.md's.
- Notifications exist for status, issues, branded content, product type, schema changes, offers, account status and hourly traffic, sales and inventory. Each type is delivered through the workflow Notification Type Values names for it (EventBridge for the listing types, SQS for offers, pricing health, traffic and account status).
- Detail page edits may only describe the same product more accurately. A different product needs a different ASIN. Deleting a listing does not clear an Account Health violation.
- Where numbers live: title, item-highlights, search-term and other field lengths and the image slots in the product type schema (`maxLength`, `maxUtf8ByteLength`, the attributes offered), read from `getDefinitionsProductType`; rate limits in `x-amzn-RateLimit-Limit` (the rate-limit page and the model disagree); report freshness and options in door.md's report entry; issue codes in the live `issues[].code`. Where Amazon's pages give different figures, the page figures are for human readers and the schema binds.
- Latency after a write is read, not assumed. Amazon states a different wait per change type and channel (section D's side-by-side list); cx re-reads the listing and the Catalog and does not use any one figure as a rule.
- (Gap fill) The sweep. `searchListingsItems` returns no issues unless `includedData` names `issues`. `withIssueSeverity` takes only WARNING and ERROR. A query pages through a capped number of SKUs (the cap is stated in the model's `numberOfResults` description). A page token expires (the tutorial states the window) and breaks if any parameter changes. With several stores, filters apply to the first store only. `issueLocale` sets the message language, falling back to `en_US`.
- (Gap fill) `LISTINGS_ITEM_ISSUES_CHANGE` names the SKU, severities and enforcement actions, not the issues; the issue detail is a Listings Items read.
- (Gap fill) `GET_MERCHANT_LISTINGS_DEFECT_DATA` is not on Amazon's report-type pages; the suppression report is the FYP report.
- (Gap fill) A listing can fail to show or sell for reasons that are not its copy:
  - stranded FBA units (no active offer);
  - a broken or split variation family;
  - a duplicate ASIN or a merge;
  - approval or a product-safety, compliance or hazmat requirement;
  - a pricing-error deactivation or Featured Offer ineligibility;
  - a non-compliant main image;
  - an Account Health violation;
  - Amazon or another contributor changing the content.

  Each has its own Amazon page and its own read.
- (Gap fill) Search terms: Amazon's help pages state an indexed byte limit, and an over-limit field is "completely ignored", not truncated. The help pages, the troubleshooting page and schema copies give different figures (item 101); the write limit for a run is the schema's, read live.
- (Gap fill) Account Health per policy is readable through `GET_V2_SELLER_PERFORMANCE_REPORT`, not through Listings Items.

## What cx must read at run time

- **The seller id.** door.md's Finances `listTransactions` or Pricing `getPricing` (ItemType=Sku) reply, or `getFeaturedOfferExpectedPriceBatch`'s `offerIdentifier.sellerId` by SKU (item 28; method/sp-api-access.md). Not the Sellers API, which carries none. Never guess it, and never take it from a featured-offer, competing-offer or Buy Box seller field, which can name another seller. [seat] Both Pricing routes need one of the seller's SKUs already in hand, so when only an ASIN is known the Finances route comes first.
- **ASIN to SKU.** `searchListingsItems` with `identifiers=<ASIN>`, `identifiersType=ASIN` and `marketplaceIds=<marketplaceId>`, optionally with `includedData=summaries,issues`.
- **The listing itself.** `getListingsItem` on `<sellerId>/<SKU>` with `includedData=summaries,attributes,issues,offers,fulfillmentAvailability,relationships,productTypes` and `issueLocale`. Read every value of `summaries[].status`, every issue's `severity`, `categories`, `attributeNames`, `enforcements.actions` and `exemption`, and the submitted `item_name`, `title_differentiation`, `bullet_point`, `product_description`, `generic_keyword` and image attributes.
- **Amazon's view.** `getCatalogItem` on `<ASIN>` with `includedData=summaries,attributes,images,classifications,relationships,salesRanks,productTypes,identifiers`. Diff it field by field against the submitted attributes.
- **Requirements.** `getDefinitionsProductType` for the listing's `productType`, store, `sellerId`, `requirements=LISTING` and the right `parentageLevel`. Read `maxLength` (and `maxUtf8ByteLength` where present) on `item_name`, `title_differentiation`, `bullet_point`, `product_description` and `generic_keyword`, the image attributes offered, required attributes, enums and conditionals, and keep the version and checksum. These are the binding figures wherever Amazon's help pages disagree with one another or with the schema.
- **Eligibility, when relevant.** `getListingsRestrictions`.
- **A preview, only with the seller's word.** `patchListingsItem` with `mode=VALIDATION_PREVIEW`. Then, after any real write, re-read `getListingsItem`.
- **Store-wide sweep.** `searchListingsItems` with `withIssueSeverity=ERROR`, or `withStatus=DISCOVERABLE&withoutStatus=BUYABLE`, and so on (cap 1,000). Or door.md's `createReport` / `getReport` / `getReportDocument` for `GET_MERCHANTS_LISTINGS_FYP_REPORT` and `GET_MERCHANT_LISTINGS_ALL_DATA`. Names, options and waits are door.md's.
- **Rate headers.** `x-amzn-RateLimit-Limit` on every reply.
- **Competitors' content.** The Keepa product fields listed above, from the Keepa skill. Changes are visible only as a diff between snapshots cx kept.
- **(Gap fill) The issue sweep, in full.**
  - `searchListingsItems` on `<sellerId>` with `marketplaceIds=<marketplaceId>` (one store per filtered sweep), `includedData=summaries,issues`, `issueLocale=<locale>` and `pageSize=20`. Add one filter set per pass: `withIssueSeverity=ERROR`; `withIssueSeverity=WARNING`; `withoutStatus=BUYABLE`; `withoutStatus=DISCOVERABLE`.
  - Page with `pageToken=<nextToken>` (`=` encoded as `%3D`) until no `nextToken` comes back, inside 24 hours and with unchanged parameters.
  - Compare `numberOfResults` with the paging cap the model states (1,000 when read on 2026-10-14). Above it, the sweep is incomplete: say so and fall back to door.md's report route.
  - Rate: the reply's `x-amzn-RateLimit-Limit`.
- **(Gap fill) Variation family.** `searchListingsItems` with `variationParentSku=<SKU>`, and the `relationships` dataset.
- **(Gap fill) Stranded and FBA units.** door.md's report route for `GET_STRANDED_INVENTORY_UI_DATA` and `GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA`, or the FBA Inventory API's `getInventorySummaries`, if door.md carries them. Report names, options and waits are door.md's.
- **(Gap fill) Account Health per policy.** door.md's report route for `GET_V2_SELLER_PERFORMANCE_REPORT` (role Selling Partner Insights), if door.md carries it.
- **(Gap fill) Not readable by API in this pass.** Review Listing Changes and its pending AI suggestions, the Enhance tab, Manage Your Compliance, the hazmat classification and Pricing Health's list. These are Seller Central screens; cx asks the seller.

## Pages read

Note (verification, 2026-10-14): every `https://developer-docs.amazon.com/sp-api/docs/<page>` URL below now answers 301 to `https://developer-docs.amazon/sp-api/docs/<page>`; the pages were re-read at the new host with the same titles. The old URLs still resolve through the redirect.

| Page name | URL | Date read | What it gave |
|---|---|---|---|
| listingsItems_2021-08-01.json (model) | https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-items-api-model/listingsItems_2021-08-01.json | 2026-10-14 | Operations, includedData, Issue object, categories, enforcements, exemption, status enum, search filters, 1000 cap |
| Listings Items API | https://developer-docs.amazon.com/sp-api/docs/listings-items-api | 2026-10-14 | Overview and version |
| Retrieve details about a listing for single or multiple Amazon stores | https://developer-docs.amazon.com/sp-api/docs/retrieve-details-about-a-listing | 2026-10-14 | Up to 12 stores, datasets, DISCOVERABLE/BUYABLE diagnostics, empty status example |
| Search for listings items by product identifier or other listings parameters | https://developer-docs.amazon.com/sp-api/docs/search-for-listings-items-by-id | 2026-10-14 | Identifier search, paging rules, role |
| Manage Listings Issues | https://developer-docs.amazon.com/sp-api/docs/manage-listings-issues | 2026-10-14 | Sync and async issues, four routes, VALIDATION_PREVIEW, pricing issues, code remap |
| Listings Items API Issues Troubleshooting | https://developer-docs.amazon.com/sp-api/docs/listings-items-api-issues-troubleshooting | 2026-10-14 | Code table, length limits, show catalog data |
| Listings APIs FAQ | https://developer-docs.amazon.com/sp-api/docs/listings-apis-faq | 2026-10-14 | Catalog vs Listings, precedence, timing, monthly schema changes, missing summary |
| Understanding Amazon listing status and seller-fulfilled inventory management | https://developer-docs.amazon.com/sp-api/docs/understanding-amazon-listing-status-and-seller-fulfilled-inventory-management | 2026-10-14 | Buyable vs discoverable, reports, freshness, lift suppression |
| Building Listings Management Workflows Guide | https://developer-docs.amazon.com/sp-api/docs/building-listings-management-workflows-guide | 2026-10-14 | Read attributes and issues before update, ACCEPTED/INVALID, parent not buyable |
| Manage Product Listings with the Selling Partner API | https://developer-docs.amazon.com/sp-api/docs/manage-product-listings-guide | 2026-10-14 | Workflow context |
| Partially update a listing | https://developer-docs.amazon.com/sp-api/docs/partially-update-a-listing | 2026-10-14 | JSON Patch usage |
| Preview errors before partially updating a listing | https://developer-docs.amazon.com/sp-api/docs/preview-errors-before-partially-updating-a-listing | 2026-10-14 | Whole-attribute patches, selectors, preview |
| Listings Items API Rate Limits | https://developer-docs.amazon.com/sp-api/docs/listings-items-api-rate-limits | 2026-10-14 | Per-pair and per-app limits, product-data throttle |
| Submit modular titles | https://developer-docs.amazon.com/sp-api/docs/submit-modular-titles | 2026-10-14 | 75/125/200, reconciliation, 100476 |
| Catalog Items API | https://developer-docs.amazon.com/sp-api/docs/catalog-items-api | 2026-10-14 | Version, role |
| catalogItems_2022-04-01.json (model) | https://github.com/amzn/selling-partner-api-models/blob/main/models/catalog-items-api-model/catalogItems_2022-04-01.json | 2026-10-14 | includedData, summary fields, image variants |
| Retrieve catalog item details | https://developer-docs.amazon.com/sp-api/docs/retrieve-catalog-item-details | 2026-10-14 | Usage |
| Product Type Definitions API | https://developer-docs.amazon.com/sp-api/docs/product-type-definitions-api | 2026-10-14 | Schema role, parentageLevel, custom vocabulary |
| definitionsProductTypes_2020-09-01.json (model) | https://github.com/amzn/selling-partner-api-models/blob/main/models/product-type-definitions-api-model/definitionsProductTypes_2020-09-01.json | 2026-10-14 | Parameters and enums |
| Retrieve a Product Type Definition | https://developer-docs.amazon.com/sp-api/docs/retrieve-a-product-type-definition | 2026-10-14 | 7-day link, requirements |
| SP-API Product Metadata Updates | https://developer-docs.amazon.com/sp-api/docs/sp-api-metadata-updates | 2026-10-14 | Monthly attribute changes |
| listingsRestrictions_2021-08-01.json (model) | https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-restrictions-api-model/listingsRestrictions_2021-08-01.json | 2026-10-14 | Reason codes |
| Notification Type Values | https://developer-docs.amazon.com/sp-api/docs/notification-type-values | 2026-10-14 | All listing-related notifications and caveats |
| Inventory Reports | https://developer-docs.amazon.com/sp-api/docs/report-type-values-inventory | 2026-10-14 | ALL_DATA and FYP report definitions |
| SP-API Release Notes | https://developer-docs.amazon.com/sp-api/docs/sp-api-release-notes | 2026-10-14 | PRODUCT/LISTING categories, generic_keyword removal from Catalog |
| analytics_sellerAnalytics_2025_03_31.graphql | https://github.com/amzn/selling-partner-api-models/blob/main/schemas/data-kiosk/analytics_sellerAnalytics_2025_03_31.graphql | 2026-10-14 | AccountHealth metric group |
| Suppressed listings (archived 2017) | https://web.archive.org/web/20171208054235/https://sellercentral.amazon.com/gp/help/external/200898440 | 2026-10-14 | Historical suppression rules and ASIN-search note |
| Listing quality (archived 2017) | https://web.archive.org/web/20171208054200/https://sellercentral.amazon.com/gp/help/external/200786710 | 2026-10-14 | Historical quality guidance |
| Product Detail Page Rules (archived 2020) | https://web.archive.org/web/20201024072125/https://sellercentral.amazon.com/gp/help/external/200390640 | 2026-10-14 | Detail page rules |
| Error code explanations (archived 2022) | https://web.archive.org/web/20220308065008/https://sellercentral.amazon.com/gp/help/external/17781 | 2026-10-14 | Index page only |
| Seller Forums: Updates to improve your product titles begin on July 27 | https://sellercentral.amazon.com/seller-forums/discussions/t/145b6d0f-999c-4555-896c-c694bda2e470 | 2026-10-14 | 75-character rule, AI rewrite, 14-day review |
| Seller Forums: Answers to your product title update questions | https://sellercentral.amazon.com/seller-forums/discussions/t/302aaac6-6f2b-4d86-bcd2-36fe24f0e6cd | 2026-10-14 | Searchable, Aug 10 display, bulk route |
| Seller Forums: Listing Lounge: Surviving Search Suppression | https://sellercentral.amazon.com/seller-forums/discussions/t/765f5738-4dee-4c42-9c8e-4991cf58ab9b | 2026-10-14 | Suppressed tab, Fix your products, 24h |
| Seller Forums: Why Isn't My Listing Showing in Search Results? A Complete Guide | https://sellercentral.amazon.com/seller-forums/discussions/t/fb1124b0-adf9-4933-b470-f75160082cdf | 2026-10-14 | Search Suppressed filter, Fix Your Products, 72h |
| Seller Forums: New tool to help professional sellers monitor account health | https://sellercentral.amazon.com/seller-forums/discussions/t/6601066b17ef3f7d150f32471db646af | 2026-10-14 | AHR, deleting does not clear |
| Seller Forums: Listing search suppressed or at risk of search suppression (seller thread) | https://sellercentral.amazon.com/seller-forums/discussions/t/32019e67-dff1-4b7c-8aec-63ba1ca1c382 | 2026-10-14 | "At risk" label exists; staff reply only points to Support |
| Amazon SEO: 7 ways to improve your product's search rankings | https://sell.amazon.com/blog/amazon-seo | 2026-10-14 | Quality and health affect rank; keyword stuffing |
| How to create Amazon product listings | https://sell.amazon.com/blog/amazon-product-listings | 2026-10-14 | Listing = detail page + offers; Brand Registry control |
| Amazon Selling Partner Blog index | https://sell.amazon.com/blog/amazon-account-health | 2026-10-14 | Returned the blog index; no Account Health content |
| Using LLMs to improve Amazon product listings | https://www.amazon.science/blog/using-llms-to-improve-amazon-product-listings | 2026-10-14 | Amazon's AI corrects attributes |
| CatalogRAG | https://www.amazon.science/publications/catalograg-retrieval-guided-llm-prediction-for-multilingual-e-commerce-product-attributes | 2026-10-14 | Amazon fills missing attributes |
| eComEngine: How do I fix inactive, suppressed, and deleted listings? | https://www.ecomengine.com/help/inactive-suppressed-deleted-listings | 2026-10-14 | Three states |
| eComEngine: How to Use the Amazon Listing Quality Dashboard | https://www.ecomengine.com/blog/amazon-listing-quality-dashboard | 2026-10-14 | Dashboard tabs, at-risk listings |
| Perpetua: Red Dot Errors and Ads Not Serving | https://help.perpetua.io/en/articles/3151158-red-dot-errors-and-ads-not-serving | 2026-10-14 | Health gates ads |
| GitHub issue #4516 | https://github.com/amzn/selling-partner-api-models/issues/4516 | 2026-10-14 | Notification vs current read |
| GitHub issue #4523 | https://github.com/amzn/selling-partner-api-models/issues/4523 | 2026-10-14 | One ASIN, many SKUs |
| GitHub issue #5388 | https://github.com/amzn/selling-partner-api-models/issues/5388 | 2026-10-14 | Pre-existing attribute issues block PATCH; ATTRIBUTE_SUPPRESSED meaning |
| Keepa Product.java | https://github.com/keepacom/api_backend/blob/master/src/main/java/com/keepa/api/backend/structs/Product.java | 2026-10-14 | Competitor content fields |
| Suppressed listings (live), G200898440 v13 r0 | https://sellercentral.amazon.com/help/hub/reference/external/G200898440 | 2026-10-14 | Read through the content call (capture capture `G200898440-v13`): child-listing rules, old 80/130 title figures, Activate listings |
| Listing quality (live), G200786710 v5 r1 | https://sellercentral.amazon.com/help/hub/reference/external/G200786710 | 2026-10-14 | Read through the content call (capture G200786710-v5.txt): seven components |
| Product title requirements and guidelines (live), GYTR6SYGFA5E3EQC v21 r2 | https://sellercentral.amazon.com/help/hub/reference/external/GYTR6SYGFA5E3EQC | 2026-10-14 | Read through the content call (capture GYTR6SYGFA5E3EQC-v21.txt): 75 characters, "automatically corrected or … not appear in our search results", Review listing changes, 24 to 48 hours |
| Error code explanations (live), G17781 v13 r1 | https://sellercentral.amazon.com/help/hub/reference/external/G17781 | 2026-10-14 | Read through the content call (capture G17781-v13.txt); no claim added from it |
| Fix Your Products | https://sellercentral.amazon.com/fixyourproducts | 2026-10-14 | unreachable: Seller Central sign-in |
| Amazon Ads eligibility page | https://advertising.amazon.com/API/docs/en-us/eligibility-prod-3p | 2026-10-14 | unreachable: page returned only its title |
| Amazon Search: The Joy of Ranking Products (anthology entry) | https://ir.webis.de/anthology/2016.sigirconf_conference-2016.50 | 2026-10-14 | unreachable: 404 |

Gap fill, 2026-10-14. Seller Central help pages were read through `POST https://sellercentral.amazon.com/help/hub/mons-api/GetHelpTopic` (locale `en-US`, layer `Published/US`). The URL given is the page's public address. Developer-docs pages are at `developer-docs.amazon`.

| Page name | URL | Date read | What it gave |
|---|---|---|---|
| listingsItems_2021-08-01.json (model, re-read) | https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-items-api-model/listingsItems_2021-08-01.json | 2026-10-14 | searchListingsItems parameters, `issueLocale`, `withIssueSeverity` enum, `pageSize` max 20, 1000 note, usage plan 5/5 |
| Search for listings items by product identifier or other listings parameters (re-read) | https://developer-docs.amazon/sp-api/docs/search-for-listings-items-by-id | 2026-10-14 | 1,000 cap example, 24-hour token, parameter-mismatch error, `%3D`, primary-store filtering |
| SP-API Release Notes (re-read) | https://developer-docs.amazon/sp-api/docs/sp-api-release-notes | 2026-10-14 | searchListingsItems launch (December 18, 2024), 1.0 payload removal date change |
| Notification Type Values (re-read) | https://developer-docs.amazon/sp-api/docs/notification-type-values | 2026-10-14 | LISTINGS_ITEM_ISSUES_CHANGE trigger and 2023-12-13 payload fields |
| Merge a listing | https://developer-docs.amazon/sp-api/docs/merge-a-listing | 2026-10-14 | `merge` op on `fulfillment_availability` and `purchasable_offer` |
| Report Type Values (index) | https://developer-docs.amazon/sp-api/docs/report-type-values | 2026-10-14 | Category page list; no DEFECT report |
| Report category pages: Amazon Business, Analytics, B2B Product Opportunities, Browse Tree, Easy Ship, Invoice Data, Order, Payment, Regulatory Compliance, Returns, Settlement, Tax Reports | https://developer-docs.amazon/sp-api/docs/report-type-values-amazon-business (and the matching `report-type-values-<category>` pages) | 2026-10-14 | Searched for `GET_MERCHANT_LISTINGS_DEFECT_DATA`: absent |
| Inventory Reports (re-read) | https://developer-docs.amazon/sp-api/docs/report-type-values-inventory | 2026-10-14 | Listing report list; no DEFECT report |
| Fulfillment by Amazon (FBA) Reports | https://developer-docs.amazon/sp-api/docs/report-type-values-fba | 2026-10-14 | Stranded inventory reports and columns, FBA Manage Inventory |
| Performance Reports | https://developer-docs.amazon/sp-api/docs/report-type-values-performance | 2026-10-14 | GET_V2_SELLER_PERFORMANCE_REPORT policy blocks |
| report-type-values-listings and report-type-values-seller-performance | https://developer-docs.amazon/sp-api/docs/report-type-values-listings | 2026-10-14 | unreachable: docs site 404 page (both) |
| SP-API Deprecations Schedule | https://developer-docs.amazon/sp-api/docs/sp-api-deprecations | 2026-10-14 | No DEFECT report listed |
| accountHealthReport-2020-11-18.json (schema) | https://github.com/amzn/selling-partner-api-models/blob/main/schemas/reports/accountHealthReport-2020-11-18.json | 2026-10-14 | Status enums; fields differ from the docs page |
| fbaInventory.json (model) | https://github.com/amzn/selling-partner-api-models/blob/main/models/fba-inventory-api-model/fbaInventory.json | 2026-10-14 | Quantity breakdown; no "stranded" |
| sellers.json (model) | https://github.com/amzn/selling-partner-api-models/blob/main/models/sellers-api-model/sellers.json | 2026-10-14 | No seller-id field |
| Fix stranded inventory, G201436600 v19 r2 | https://sellercentral.amazon.com/help/hub/reference/external/G201436600 | 2026-10-14 | Stranded definition, no-send rule, 48 h, system SKUs |
| Inventory Buyability, GFC63UNUF6LMLK2R v1 r0 | https://sellercentral.amazon.com/help/hub/reference/external/GFC63UNUF6LMLK2R | 2026-10-14 | Unit states that cannot be bought |
| Product variations overview, GH3RMVV3ZDYRRQ5S v2 r1 | https://sellercentral.amazon.com/help/hub/reference/external/GH3RMVV3ZDYRRQ5S | 2026-10-14 | Family rules |
| Create and manage product variations, GEKYC26YEZX2VSHM v4 r1 | https://sellercentral.amazon.com/help/hub/reference/external/GEKYC26YEZX2VSHM | 2026-10-14 | Parent carries no offer; 4,000 children |
| Troubleshoot product variations, GLQBFJDZ7ZDLXQW8 v4 r2 | https://sellercentral.amazon.com/help/hub/reference/external/GLQBFJDZ7ZDLXQW8 | 2026-10-14 | Waits, splits, Amazon manages families, hijacking |
| Variation relationship FAQ, G201951410 v16 r1 | https://sellercentral.amazon.com/help/hub/reference/external/G201951410 | 2026-10-14 | 15 minutes / 24 hours; theme fixed |
| Variation display and customer experience, G7UJDST28Q5Y7PWY v2 r1 | https://sellercentral.amazon.com/help/hub/reference/external/G7UJDST28Q5Y7PWY | 2026-10-14 | Read; nothing cited |
| Potential duplicates and split variations, G202105450 v7 r2 | https://sellercentral.amazon.com/help/hub/reference/external/G202105450 | 2026-10-14 | Pointer to Troubleshoot product variations |
| ASIN creation policy, G201844590 v27 r0 | https://sellercentral.amazon.com/help/hub/reference/external/G201844590 | 2026-10-14 | Variation misuse, creation limits |
| Merge Duplicate Product Pages, G201950590 v6 r0 | https://sellercentral.amazon.com/help/hub/reference/external/G201950590 | 2026-10-14 | Merge conditions and effects; Brand Registry self-contradiction |
| Seller Forums: Listing Lounge: Duplicate ASIN's, when and how to merge them | https://sellercentral.amazon.com/seller-forums/discussions/t/6abc87e8-d5a7-48fd-9ecf-c03bac600be6 | 2026-10-14 | Identical items only |
| Product detail page rules, G200390640 v21 r1 | https://sellercentral.amazon.com/help/hub/reference/external/G200390640 | 2026-10-14 | Duplicates, GTIN, Brand Registry contribution precedence, style guides |
| Error 8541, G200692330 v23 r0 | https://sellercentral.amazon.com/help/hub/reference/external/G200692330 | 2026-10-14 | Conflict with an existing ASIN |
| About products and listings, G200182950 v7 r0 | https://sellercentral.amazon.com/help/hub/reference/external/G200182950 | 2026-10-14 | Amazon picks the displayed contribution |
| Listings Items API Issues Troubleshooting (re-read) | https://developer-docs.amazon/sp-api/docs/listings-items-api-issues-troubleshooting | 2026-10-14 | 4005013; 90225 lengths |
| Seller Forums: Use new dashboard to view changes to your brand's product detail pages | https://sellercentral.amazon.com/seller-forums/discussions/t/69cc20fd-825d-447f-a58d-bce282519770 | 2026-10-14 | Review Listing Changes, 60 days, 14-day auto-publish |
| Amazon Brand Registry \| Sell on Amazon | https://sell.amazon.com/brand-registry | 2026-10-14 | Tools list, trademark eligibility |
| Manage Your Experiments, GVP453K5XRBJS7Y9 v7 r0 | https://sellercentral.amazon.com/help/hub/reference/external/GVP453K5XRBJS7Y9 | 2026-10-14 | Eligibility; no ranking effect |
| Restricted products, G200164330 v6 r0 | https://sellercentral.amazon.com/help/hub/reference/external/G200164330 | 2026-10-14 | Enforcement list |
| Categories and products that require approval, G200333160 v44 r0 | https://sellercentral.amazon.com/help/hub/reference/external/G200333160 | 2026-10-14 | Approval states, 2-7 days |
| Category, product, and listing restrictions, G200301050 v17 r1 | https://sellercentral.amazon.com/help/hub/reference/external/G200301050 | 2026-10-14 | Index page; nothing cited |
| Product categories with enhanced safety listing compliance requirements, GUQ848NB5HZ6M6A4 v1 r5 | https://sellercentral.amazon.com/help/hub/reference/external/GUQ848NB5HZ6M6A4 | 2026-10-14 | Account Health notice, insurance, TIC testing |
| Safety, compliance, and product restrictions, GXMGGPL6LC4CVXHT v10 r1 | https://sellercentral.amazon.com/help/hub/reference/external/GXMGGPL6LC4CVXHT | 2026-10-14 | Deactivation, suspended labs |
| Dangerous goods identification guide (hazmat), G201003400 v25 r0 | https://sellercentral.amazon.com/help/hub/reference/external/G201003400 | 2026-10-14 | No type-based classification, 14 business days |
| Account Health Rating program policy, G200205250 v24 r2 | https://sellercentral.amazon.com/help/hub/reference/external/G200205250 | 2026-10-14 | 0–1,000, bands, severities |
| Policies included in Account Health Rating, GQ5DSES264XVXNX7 v7 r0 | https://sellercentral.amazon.com/help/hub/reference/external/GQ5DSES264XVXNX7 | 2026-10-14 | Policy list |
| Account health rating, GR786P4BPEVKTBAG v17 r5 | https://sellercentral.amazon.com/help/hub/reference/external/GR786P4BPEVKTBAG | 2026-10-14 | Closing a listing does not remove it; critical, three days |
| Account health FAQ, G200285250 v9 r1 | https://sellercentral.amazon.com/help/hub/reference/external/G200285250 | 2026-10-14 | Compliance and EPR dashboards separate; other labels |
| Pricing Health, GSTH6YN3BR8XNWBW v22 r0 | https://sellercentral.amazon.com/help/hub/reference/external/GSTH6YN3BR8XNWBW | 2026-10-14 | Price-error deactivation against Featured Offer ineligibility |
| Amazon Marketplace Fair Pricing Policy, G5TUVJKZHUVMN77V v11 r0 | https://sellercentral.amazon.com/help/hub/reference/external/G5TUVJKZHUVMN77V | 2026-10-14 | Enforcement |
| Minimum and Maximum Price Validation, G202024630 v2 r10 | https://sellercentral.amazon.com/help/hub/reference/external/G202024630 | 2026-10-14 | Automate Pricing limits only |
| Product image guide, G1881 v28 r9 | https://sellercentral.amazon.com/help/hub/reference/external/G1881 | 2026-10-14 | Main image rules, removal from search |
| Image suppression, GT8RSE9S9NK4LP6Z v9 r0 | https://sellercentral.amazon.com/help/hub/reference/external/GT8RSE9S9NK4LP6Z | 2026-10-14 | Suppression actions and reasons |
| Enhance Listings, G88AQCL62ED7WDGA v1 r5 | https://sellercentral.amazon.com/help/hub/reference/external/G88AQCL62ED7WDGA | 2026-10-14 | AI suggestions, 48 h, quality indicator |
| Manage Products dashboard guide, GMZU6QTPKCVGLXKS v1 r0 | https://sellercentral.amazon.com/help/hub/reference/external/GMZU6QTPKCVGLXKS | 2026-10-14 | Fix tab, inactive reasons |
| Catalog and drafts, G202078860 v3 r0 | https://sellercentral.amazon.com/help/hub/reference/external/G202078860 | 2026-10-14 | Read; nothing cited |
| Manage All Inventory, G41 v9 r2 | https://sellercentral.amazon.com/help/hub/reference/external/G41 | 2026-10-14 | Read; nothing cited |
| Amazon launches generative AI to help sellers write product descriptions | https://www.aboutamazon.sg/amazon-launches-generative-ai-to-help-sellers-write-product-descriptions | 2026-10-14 | Enrich existing listings |
| Keyword attributes explained, GF2C2L6RCFZGWBXC v4 r1 | https://sellercentral.amazon.com/help/hub/reference/external/GF2C2L6RCFZGWBXC | 2026-10-14 | Under 250 bytes; an over-limit field is ignored |
| Optimize your product discoverability, G10471 v13 r1 | https://sellercentral.amazon.com/help/hub/reference/external/G10471 | 2026-10-14 | Under 250 bytes |
| Use search terms effectively, G23501 v14 r0 | https://sellercentral.amazon.com/help/hub/reference/external/G23501 | 2026-10-14 | Field stops at the byte limit; 23 product types |
| Product page style guides, G200270100 v18 r1 | https://sellercentral.amazon.com/help/hub/reference/external/G200270100 | 2026-10-14 | PDFs, lifestyle main-image types |
| Amazon Services Quick Start Style Guide (2018 PDF) | https://m.media-amazon.com/images/G/01/rainier/help/Selling_on_Amazon_Quick_Start_Style_Guide_2018.pdf | 2026-10-14 | Stale figures |
| Bulk listing templates, G1641 v36 r1 | https://sellercentral.amazon.com/help/hub/reference/external/G1641 | 2026-10-14 | No style-guide links served |
| Product Object — Keepa API Documentation | https://keepa.com/api-docs/product-object.html | 2026-10-14 | 4000 description, 4000 variations |
| Modern Retail: Amazon Briefing: Gen AI is taking over product listings on Amazon & sellers aren't happy about it | https://www.modernretail.co/technology/amazon-briefing-gen-ai-is-taking-over-product-listings-on-amazon-sellers-arent-happy-about-it/ | 2026-10-14 | AI bullet rewrites; practitioners |
| eComEngine: What are listing content alerts? What should I do if content changes? | https://ecomengine.com/help/listing-content-alerts | 2026-10-14 | Who changes content; fix order |
| SellerApp: Amazon Stranded Inventory Is Costing You More Than You Think ( Here's How to Fix It) | https://www.sellerapp.com/blog/amazon-stranded-inventory/ | 2026-10-14 | Stranded causes |
| Deep metric learning to hierarchically rank—An application in product retrieval | https://www.amazon.science/publications/deep-metric-learning-to-hierarchically-rank-an-application-in-product-retrieval | 2026-10-14 | Duplicate-detection research |
| Seller Central help topic G201749990 | (content call) | 2026-10-14 | unreachable: the call returned `topic: null` |

Reconciliation reads, 2026-10-14. Help-page captures were read from the office's capture folder (outside this repository) (no new content call was made).

| Page name | URL | Date read | What it gave |
|---|---|---|---|
| listingsItems_2021-08-01.json (model, re-read) | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/listings-items-api-model/listingsItems_2021-08-01.json | 2026-10-14 | Usage plans: get/put 5 burst 10; search/patch/delete 5 burst 5; `PatchOperation.op` enum with `merge` |
| Listings Items API Rate Limits (re-read) | https://developer-docs.amazon/sp-api/docs/listings-items-api-rate-limits | 2026-10-14 | get/search/put 5, 100, burst 5; patch 5, 500, burst 5 |
| catalogItems_2022-04-01.json (model, re-read) | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/catalog-items-api-model/catalogItems_2022-04-01.json | 2026-10-14 | Image variants MAIN, PT01–PT08, SWCH |
| productPricing_2022-05-01.json (model) | https://github.com/amzn/selling-partner-api-models/blob/main/models/product-pricing-api-model/productPricing_2022-05-01.json | 2026-10-14 | `OfferIdentifier.sellerId`; `sku` only on the requesting seller's target offer |
| Merge a listing (re-read) | https://developer-docs.amazon/sp-api/docs/merge-a-listing | 2026-10-14 | `merge` examples on two attributes; no stated restriction |
| Submit modular titles (re-read) | https://developer-docs.amazon/sp-api/docs/submit-modular-titles | 2026-10-14 | 75 / 125 / 200; "does not affect your current listings unless you submit an update"; `maxLength` 125 excerpt |
| Test listing content with Manage Your Experiments \| Sell on Amazon | https://sell.amazon.com/tools/manage-your-experiments | 2026-10-14 | "up to 20%" ("Amazon internal data") |
| Amazon Brand Registry \| Sell on Amazon (re-read) | https://sell.amazon.com/brand-registry | 2026-10-14 | "up to 25%" under Manage Your Experiments ("Amazon internal data") |
| Product Object — Keepa API Documentation (re-read) | https://keepa.com/api-docs/product-object.html | 2026-10-14 | description 4000, variations 4000, features 1000, itemHighlights 125 |
| Keepa Product.java (re-read) | https://github.com/keepacom/api_backend/blob/master/src/main/java/com/keepa/api/backend/structs/Product.java | 2026-10-14 | description 2000, variations "up to 50" |
| Product title requirements and guidelines, GYTR6SYGFA5E3EQC v21 (capture) | capture `GYTR6SYGFA5E3EQC-v21` | 2026-10-14 | Item 99 quotes matched, including "24 to 48 hours" |
| Product image guide, G1881 v28; Suppressed listings, G200898440 v13; Listing quality, G200786710 v5; Product detail page rules, G200390640 v21; Error code explanations, G17781 v13 (captures) | the office's capture folder (outside this repository) | 2026-10-14 | Quotes in items 53, 71, 74, 93, 97, 98, 102 matched |
| Keyword attributes explained, GF2C2L6RCFZGWBXC v4; Optimize your product discoverability, G10471 v13; Use search terms effectively, G23501 v14 and v9 en-GB (captures) | the office's capture folder (outside this repository) | 2026-10-14 | Item 101 quotes matched; UK: < 250 bytes, spaces not counted, none indexed if over |
| Variation relationship FAQ, G201951410 v16; Product variations overview, GH3RMVV3ZDYRRQ5S v2; Manage Your Experiments, GVP453K5XRBJS7Y9 v7 (captures) | the office's capture folder (outside this repository) | 2026-10-14 | Items 66, 68, 77 quotes matched; MYE help page states no percentage |
| Amazon search glossary, GF6B8ZPNY2AP72VV v2; My ASIN is unsearchable, GHGHDMU4X5K9QGCV v6 (captures) | the office's capture folder (outside this repository) | 2026-10-14 | 72-hour statements |

## Open questions

- What do the Seller Central screens Fix Your Products, the Listing Quality Dashboard (including its "at risk" tab and dates) and Account Health's listing-policy section show today? They are signed-in screens, not help pages, and this seat could not read them. (The help pages about them, Suppressed listings, Listing quality and the Account Health pages, were read; see section K.)
- ~~Search terms: how many bytes Amazon indexes.~~ Answered in the gap fill (item 101): two live US help pages say "less than 250 bytes", and an over-limit field "is completely ignored by Amazon Search". Still open: what `maxLength` and `maxUtf8ByteLength` the live schema gives `generic_keyword` per product type and store. Third-party schema copies recorded in elements/search-terms.md show 250 or 2000 bytes with 500 characters, so the write limit differs by store and product type; a first run reads it. The live UK page (G23501 v9 en-GB, from its capture) states the same "less than 250 bytes" and the same no-spaces rule as the US pages; other stores were not read.
- (Gap fill) Merge Duplicate Product Pages contradicts itself on Brand Registry. One line says a registered ASIN can never be merged; a note says it can be if the requester is the rights owner. Which governs needs a case answer or a later revision.
- (Gap fill) How long does a variation take to show? The Variation relationship FAQ says "about 15 minutes", escalating after 24 hours; Troubleshoot product variations says "24-28 hours".
- (Gap fill) Account Health labels: "Healthy / At Risk / Unhealthy" (program policy, Account health rating) against "Good / At Risk / Critical" (FAQ). The schema says `GREAT` / `WARNED`. Which label does the dashboard show today?
- (Gap fill) The Performance Reports page lists `customerProductReviewsPolicyViolations`, `policyViolationWarnings` and an AHR score; the 2020-11-18 schema file in Amazon's repository has none of them. Which does a real report carry? This needs a first run through door.md.
- (Gap fill) Does stranded inventory surface as an issue in `searchListingsItems` / `getListingsItem`, or only in FBA reports? "Stranded" is not a word in either model.
- (Gap fill) Does `withIssueSeverity=ERROR` include issues whose enforcement is `EXEMPT` or `EXEMPT_UNTIL_EXPIRY_DATE`? The model does not say.
- (Gap fill) Review Listing Changes (the 14-day auto-publish of Amazon's AI suggestions) and the Enhance tab have no API found in this pass. Can cx see a pending Amazon suggestion before it publishes?
- (Gap fill) A sweep over 1,000 matching SKUs: is it complete if sliced by `lastUpdatedAfter` / `lastUpdatedBefore` or `createdAfter` windows? Amazon's pages do not say.
- Do the FYP report's "Reason" values map one-to-one to `issues[].code`, or are they a separate vocabulary?
- After a 75-character AI rewrite, does `getCatalogItem` show the new name in `summaries.itemName`, in `attributes.item_name`, or in both? And does `BRANDED_ITEM_CONTENT_CHANGE` fire for it?
- Does `patchListingsItem` with `VALIDATION_PREVIEW` count as a write under this line's "nothing sent without the seller's word" rule? It persists nothing but is a PATCH. This needs the office's ruling.
- Should door.md carry the listing report names (`GET_MERCHANT_LISTINGS_ALL_DATA`, `GET_MERCHANTS_LISTINGS_FYP_REPORT`) with options and waits? It holds none today.
- Can cx ever receive notifications (SQS/EventBridge)? Without a destination, every "watch" is a poll against rate limits.
- How fresh are Keepa's content fields (`title`, `features`, `description`) relative to the live page? angles/competitor-set.md quotes Keepa's docs: "If our last update is older than ~1 hour, it will be automatically refreshed before being delivered." That bounds Keepa's own copy at request time; whether Keepa's copy matches what the detail page shows is still open.
- Are Keepa's `description` and `variations` cut at 2,000 / 50 (Java client) or 4,000 / 4000 (web page)? Settled by the length of one long description and the size of one large parent's list on a first read.
- Which issue in a Seller Central "at risk of search suppression" label corresponds to `EXEMPT_UNTIL_EXPIRY_DATE` in the API, if any?

## Positions

- **P-listing-content-and-health-1.** Read a listing at `getListingsItem` on `{sellerId}/{SKU}` and name the datasets: `summaries`, `attributes` and `issues` at least, because the default returns summaries only and an ASIN is not a listing address. Sources: listingsItems_2021-08-01.json; Retrieve details about a listing…
- **P-listing-content-and-health-2.** Turn an ASIN into the seller's SKUs with `searchListingsItems` (`identifiersType=ASIN`). Expect one ASIN to return several SKUs, and expect the search to need the seller id. Sources: listingsItems_2021-08-01.json; Search for listings items…; GitHub issue #4523.
- **P-listing-content-and-health-3.** Call a listing healthy only when every store's `status` holds both BUYABLE and DISCOVERABLE, no issue is ERROR or carries a NOT_EXEMPT enforcement, and the Catalog shows what was submitted. Amazon says an empty `issues` list does not represent all problems. Sources: Notification Type Values; Understanding Amazon listing status…; Listings APIs FAQ.
- **P-listing-content-and-health-4.** Report search suppression (DISCOVERABLE missing, or `SEARCH_SUPPRESSED`) as lost exposure, and lost buyability (BUYABLE missing, `LISTING_SUPPRESSED`, `CATALOG_ITEM_REMOVED`) as lost sales. Amazon says a search-suppressed listing can stay buyable. Sources: Understanding Amazon listing status…; listingsItems_2021-08-01.json.
- **P-listing-content-and-health-5.** Treat `ATTRIBUTE_SUPPRESSED` as one value dropped from the catalog. Treat `EXEMPT_UNTIL_EXPIRY_DATE` as a dated warning to show with its date. Sources: listingsItems_2021-08-01.json; GitHub issue #5388.
- **P-listing-content-and-health-6.** Compare the seller's submitted attributes (Listings Items) with Amazon's reconciled view (Catalog Items) field by field, and present a difference as a finding, not an error. Brand-owner precedence, Amazon's own data and title splitting can legitimately change what shows. Sources: Listings APIs FAQ; Submit modular titles; Using LLMs to improve Amazon product listings.
- **P-listing-content-and-health-7.** Read search terms (`generic_keyword`) only from the seller's own listing, because Catalog Items no longer returns them. Sources: SP-API Release Notes (2023-08-16).
- **P-listing-content-and-health-8.** Never report a write as done on `ACCEPTED`. Re-read the listing after processing, and expect asynchronous issues or a product type switch. Sources: Manage Listings Issues; Listings APIs FAQ; Building Listings Management Workflows Guide.
- **P-listing-content-and-health-9.** Before proposing new content, read the live product type schema (limits, required attributes, enums) and the listing's existing attributes and issues. Do not use remembered limits: the schema changes monthly (SP-API Product Metadata Updates lists a dated release each month), and an `INVALID` reply applies none of the submission's attributes. Sources: Listings APIs FAQ; Retrieve a Product Type Definition; SP-API Product Metadata Updates; Building Listings Management Workflows Guide; GitHub issue #5388 (staff reply of 2026-10-05).
- **P-listing-content-and-health-10.** Propose content changes as whole top-level attributes, because Amazon patches only entire attributes and deletes need selectors. Sources: listingsItems_2021-08-01.json; Preview errors before partially updating a listing.
- **P-listing-content-and-health-11.** For non-media titles, propose `item_name` and `title_differentiation` each within the `maxLength` the live product type schema gives them, never within a remembered figure: Amazon's own pages state different title figures (item 41). Warn the seller that over-limit titles are rewritten by Amazon's AI over time, and that a non-compliant title may instead be dropped from search; read `status`, `issues` and the Catalog name to see which happened. Sources: Submit modular titles; Product title requirements and guidelines; Seller Forums News_Amazon title posts; Retrieve a Product Type Definition.
- **P-listing-content-and-health-12.** For a store-wide health sweep, use `searchListingsItems` with `withIssueSeverity` or status filters, or the FYP and ALL_DATA reports through door.md. Tell the seller that the reports are hours old and that the search stops at the paging cap the model states. Sources: Understanding Amazon listing status…; Inventory Reports; listingsItems_2021-08-01.json.
- **P-listing-content-and-health-13.** When a notification and a fresh `getListingsItem` disagree, trust the fresh read. A notification is a prompt to read, not the detail. Sources: Retrieve details about a listing…; GitHub issue #4516.
- **P-listing-content-and-health-14.** Content edits may only describe the same product more accurately. A different product or version needs a different ASIN. Sources: Product Detail Page Rules (archived 2020); Product detail page rules, G200390640 v21 (live, capture under the office's capture folder (outside this repository)).
- **P-listing-content-and-health-15.** Never suggest deleting or closing a listing to clear a policy violation, because Amazon says that does not resolve it. Sources: Seller Forums News_Amazon, "New tool to help professional sellers monitor account health".
- **P-listing-content-and-health-16.** Read issue codes and messages from the live response and point to Error code explanations; never use a stored table, because Amazon remaps codes and grows the categories. Sources: Manage Listings Issues; Listings Items API Issues Troubleshooting; SP-API Release Notes.
- **P-listing-content-and-health-17.** For a store-wide issue sweep, call `searchListingsItems` with `includedData=summaries,issues`, `pageSize` at the model's maximum and one store per filtered call. Page by `pageToken` until no `nextToken` comes back, before the token expires and with unchanged parameters. Without `issues` in `includedData` the sweep returns no issues, and with several stores Amazon applies filters to the first store only. Sources: listingsItems_2021-08-01.json; Search for listings items by product identifier or other listings parameters.
- **P-listing-content-and-health-18.** Run the error sweep (`withIssueSeverity=ERROR`) and the status sweeps (`withoutStatus=BUYABLE`, `withoutStatus=DISCOVERABLE`) as separate passes. Compare `numberOfResults` with the paging cap the model states. When it is higher, tell the seller the sweep could not page through all matches and use the report route through door.md. `withIssueSeverity` has no INFO level. Sources: listingsItems_2021-08-01.json; Search for listings items…
- **P-listing-content-and-health-19.** Pass `issueLocale` in the seller's language. Expect `en_US` text when Amazon has no localization. Sources: listingsItems_2021-08-01.json.
- **P-listing-content-and-health-20.** Treat a `LISTINGS_ITEM_ISSUES_CHANGE` payload as a prompt naming a SKU, its severities and enforcement actions. Read the issues themselves from Listings Items, because the payload carries no issue codes or messages. Sources: Notification Type Values.
- **P-listing-content-and-health-21.** Do not request `GET_MERCHANT_LISTINGS_DEFECT_DATA`. It is not on Amazon's current report-type pages. Store-wide suppression with reasons is `GET_MERCHANTS_LISTINGS_FYP_REPORT`. Sources: Report Type Values and its category pages; Inventory Reports; SP-API Deprecations Schedule.
- **P-listing-content-and-health-22.** Before blaming a listing's copy for poor sales or visibility, check the causes Amazon names that are not copy, and report any found first:
  - stranded FBA units;
  - inactive or split variation children;
  - an approval or compliance requirement;
  - a pricing-error deactivation or Featured Offer ineligibility;
  - main-image suppression;
  - an Account Health listing-policy violation.

  Sources: Inventory Buyability; Manage Products dashboard guide; Troubleshoot product variations; Safety, compliance, and product restrictions; Pricing Health; Image suppression; Policies included in Account Health Rating.
- **P-listing-content-and-health-23.** Report FBA units without an active offer as stranded and unbuyable, and say what Amazon says: fix the listing, do not ship more units of that ASIN, and allow the wait the Fix stranded inventory page states before re-reading. Sources: Fix stranded inventory; Inventory Buyability; Fulfillment by Amazon (FBA) Reports.
- **P-listing-content-and-health-24.** Keep the two pricing states apart. A potential pricing error deactivates the offer; a price above the competitive or recent reference leaves it live without the Featured Offer. Only the first is lost buyability. Sources: Pricing Health; Amazon Marketplace Fair Pricing Policy.
- **P-listing-content-and-health-25.** On variation families, state Amazon's rules:
  - parent and children share product type and brand;
  - the parent carries no offer;
  - the theme cannot be changed after creation;
  - an inactive child blocks creating the family;
  - Amazon can split or manage families, and other sellers can change them.

  Never propose adding a newer model or a non-manufacturer multi-pack as a child. Sources: Product variations overview; Create and manage product variations; Troubleshoot product variations; Variation relationship FAQ; ASIN creation policy.
- **P-listing-content-and-health-26.** Propose a merge of duplicate ASINs only when the products are identical, of the same brand and not parents, and the seller is actively selling both. Say that the target's page, inventory, sales history and performance metrics absorb the source's, and that reviews are shared only "based on eligibility". Sources: Merge Duplicate Product Pages; Seller Forums, "Listing Lounge: Duplicate ASIN's…".
- **P-listing-content-and-health-27.** Tell the seller that Amazon chooses which contribution a detail page shows. On a Brand Registry ASIN, equal-role contributions are weighted equally, and Amazon may decide by sales volume, refund rate, buyer feedback and A-to-z claims. A submitted value that does not show is therefore not proof of a failed write. Sources: Product detail page rules; About products and listings; Enhance Listings.
- **P-listing-content-and-health-28.** Warn brand owners that Amazon's AI content suggestions publish automatically after the review window Amazon announces unless addressed in Review Listing Changes, and that AI-generated content "can include features and claims that were not in the listing's original content". Sources: Seller Forums News_Amazon, "Use new dashboard…"; Enhance Listings; Product title requirements and guidelines.
- **P-listing-content-and-health-29.** Read Account Health per policy from `GET_V2_SELLER_PERFORMANCE_REPORT` through door.md, not from Listings Items. Expect the field set to differ between Amazon's docs page and its schema file. Sources: Performance Reports; accountHealthReport-2020-11-18.json.
- **P-listing-content-and-health-30.** For a main image, state Amazon's current rules as the Product image guide states them, naming the page and the version this tree records (background, the share of the frame the product fills, the minimum size to upload and the size for zoom; today's figures are in item 93, for human readers). Say that without a compliant main image Amazon may remove the listing from search. Sources: Product image guide; Image suppression.
- **P-listing-content-and-health-31.** For search terms, say that Amazon indexes `generic_keywords` only within a byte limit and ignores the whole field when it is over, and that brand names, ASINs and offensive terms can get terms dropped or the ASIN suppressed. Amazon's pages state different figures (item 101); take the write limit from the live schema and name the help page when quoting the indexed one. Sources: Keyword attributes explained; Optimize your product discoverability; Use search terms effectively.
- **P-listing-content-and-health-32.** Use a category style guide's figures only where a live help page agrees. Amazon still links the 2018 Quick Start Style Guide, whose title and image figures are superseded by the live pages (item 102). Sources: Product page style guides; Amazon Services Quick Start Style Guide; Product image guide; Product title requirements and guidelines.
- **P-listing-content-and-health-33.** When a listing needs approval or carries a safety, compliance or dangerous-goods requirement, name the requirement and route the seller to the Amazon screen that holds it: Apply to sell, Account Health, Manage Your Compliance. Do not rewrite copy around a restriction, because Amazon treats miscategorizing to circumvent restrictions as grounds for termination. Sources: Restricted products; Categories and products that require approval; Product categories with enhanced safety listing compliance requirements; Dangerous goods identification guide (hazmat); Account health FAQ.

- **P-listing-content-and-health-34.** After a write, confirm the change by reading it (`getListingsItem`, then `getCatalogItem`), and name the wait Amazon states for that kind of change only as the earliest re-read. Do not start an effect window from any stated latency figure; Amazon's figures differ by change type and channel. Sources: Listings APIs FAQ; Product title requirements and guidelines; Product image guide; Variation relationship FAQ; Troubleshoot product variations; Amazon search glossary.

The seat's own (not for a skill):

- [seat] The roadmap lead's "good listing = issues empty and Catalog title equals submitted" would raise false alarms after July 27, 2026. Amazon's reconciled title can differ from the submission by design, so the test should be "differs, and here is how", not equality.
- [seat] A listing whose `summaries` is empty is the most urgent state cx can see. Amazon says the submission did not match an ASIN.
- [seat] Without an SQS or EventBridge destination, cx cannot subscribe. A health check is therefore a scheduled re-read, budgeted against the rate-limit header.
- [seat] Health gates ads. Practitioners report that ads stop serving for non-buyable listings, listings without images and listings that lost the Buy Box. The paid-keywords angle should read health first.
- [seat] Competitor content change detection needs cx to keep its own snapshots of Keepa content fields, because no history field was found.
- [seat] (Gap fill) A sweep whose `numberOfResults` exceeds 1,000 might be completed by slicing `lastUpdatedAfter` / `lastUpdatedBefore` into windows that each match fewer than 1,000. Amazon does not document this; it is untested.
- [seat] (Gap fill) A sensible order for "why isn't it selling":
  1. Account Health and restrictions.
  2. Buyability: status, stranded units, pricing deactivation.
  3. Discoverability: search suppression, images.
  4. Family and duplicates.
  5. Copy.

  This order is the seat's judgement, not Amazon's.
- [seat] (Gap fill) Practitioners describe content changed by hijackers, other resellers and Amazon's systems (eComEngine, Modern Retail). Together with Amazon's own pages on contribution precedence and AI suggestions, this argues for cx keeping a snapshot of the seller's submitted attributes to diff against later reads.

## Verification

Adversarial check, 2026-10-14, by a second research seat. Method: the five model files (Listings Items 2021-08-01, Catalog Items 2022-04-01, Product Type Definitions 2020-09-01, Listings Restrictions 2021-08-01, Data Kiosk `analytics_sellerAnalytics_2025_03_31.graphql`) were downloaded from `raw.githubusercontent.com/amzn/selling-partner-api-models/main` and parsed. Every developer-docs page in the table was re-read at its new host (the old host now redirects). The four archived Seller Central pages, the five Seller Forums posts, the two sell.amazon.com posts, the two eComEngine pages, the Perpetua page, the two Amazon Science pages, GitHub issues #4516, #4523 and #5388, and Keepa's `Product.java` were opened. No Amazon or Keepa API host was called.

Claims checked: about 95 (each numbered item in "Amazon's own rules and guidance" taken claim by claim, each practitioner and research entry, the positions' sources, and a scan for seller data).

Confirmed as written, among others: the `includedData` enums and defaults of both APIs; the Issue object (required `code`, `message`, `severity`, `categories`), severity texts, all ten categories (PRODUCT and LISTING added in the September 30, 2026 release), the four enforcement actions and three exemption statuses; summary `status` values and texts; the 1,000-SKU search cap; `identifiers` max 20; the 24-hour page token, commas, Product Listing role; the Catalog summary fields, `itemClassification` enum and image variants; the getDefinitionsProductType parameters and enums and the "valid for seven days" link; the FAQ's `$lifecycle` / `enumDeprecated` / `checksum` advice and "last week of every month"; Listings Restrictions reason codes; rate-limit table (5 / 100 / burst 5; model says burst 10 for getListingsItem) and the product-data 429 text; the 2023-08-16 `generic_keyword` release note; the report definitions, columns, options, cache window and freshness sentence; the archived 2017 and 2020 help-page quotes; the forum quotes and their author accounts; the sell.amazon.com quotes, authors and dates; eComEngine and Perpetua quotes; the Amazon Science blog and CatalogRAG (authors, venue, +43.32% at entry level, US/DE/FR); Sorokina and Cantú-Paz, SIGIR 2016, DOI 10.1145/2911451.2926725 (bibliographic only).

Corrections (was → now):

1. Item 1: an internal run's 400 `InvalidInput` was tagged [official] on the model file → split out as [seat] from the internal day-1 report, and described exactly: the ASIN sat where the single-segment search path expects `{sellerId}`.
2. Item 3: "getListingsItem accepts up to 12 stores" → both `getListingsItem` and `searchListingsItems` (July 29, 2026 release); the 12 is on the guide page only, the model has no `maxItems`.
3. Item 7: attribute names (`item_name`, `bullet_point`, `generic_keyword`…) were sourced to the listing-status page, which does not mention them → re-sourced to the model, Submit modular titles and Issues Troubleshooting; `bullet_point` / `product_description` are no longer named as read from a page.
4. Item 15: pricing issues described as arriving generally → they are what `VALIDATION_PREVIEW` surfaces on a price change; `100708` is new to preview; `19037`, `19038`, `18701` also come back asynchronously.
5. Item 23: misquote "To minimize throttling errors, you must use push notifications" → Amazon's sentence "you must use push notifications to receive real-time updates for status changes and issues with listings"; the 15-20 minute delay covers both `LISTINGS_ITEM_ISSUES_CHANGE` and `LISTINGS_ITEM_STATUS_CHANGE`.
6. Item 25: "One ASIN can map to several SKUs" was tagged [official] on the model and search page, neither of which says it → attributed to the practitioner in GitHub #4523 and the day-1 run [seat]; added sort/page defaults and the operation's December 18, 2024 launch.
7. Item 33: general advice "show the catalog's current data when a submission conflicts" → narrowed to Amazon's actual advice for code `4005011`, quoted.
8. Item 37: added that the model's `PatchOperation.op` now also lists `merge`, which the guide page does not mention.
9. Item 41: "including spaces" was quoted from the API page, which does not say it → attributed to the Seller Forums announcement; added the exact condition for `100476` (Item Highlights submitted while `item_name` > 75), its ERROR/INVALID_ATTRIBUTE fields, "does not affect your current listings unless you submit an update", and that the Troubleshooting page still lists `item_name` at 200.
10. Item 42: added the forum's verbatim 75-character sentence and the post dates as shown.
11. Item 48: "Every notification needs an SQS or EventBridge destination" → each type's named workflow (EventBridge for the listing types, SQS for ANY_OFFER_CHANGED, PRICING_HEALTH, DETAIL_PAGE_TRAFFIC_EVENT); the "same level of detailed information" quote is on Retrieve details…, not Notification Type Values; added `ACCOUNT_STATUS_CHANGED`, `ITEM_SALES_EVENT_CHANGE`, `ITEM_INVENTORY_EVENT_CHANGE`, which exist and were missing. `DETAIL_PAGE_TRAFFIC_EVENT` confirmed to exist.
12. Item 55: "retained for 30 days" → `@resultRetention P30D` is the retention of query result documents; added the 120-day product-defect rates, including inaccurate product information, and the September 30, 2026 launch note.
13. GitHub #4516: misquote "got validated and removed soon after" → Amazon's actual words, with the replier, date and "ignore the notification" advice.
14. GitHub #5388: signer was given as "Selling Partner API Services" → the assigned staff member signing "Ritika"; the file presented rejection over untouched attributes as behaviour → Amazon called it "a bug on our side" on 2026-10-09; the surviving point is "INVALID blocks all attribute updates on that SKU submission".
15. Keepa: `productType` was listed as a listing-content field → it is Keepa's own type code, not Amazon's product type; `returnRate` `null` also means average; added `parentAsinHistory` and the `itemHighlights` 125-character field.
16. P-9: its reason "a patch can be rejected over existing attributes it did not touch" rested on a since-fixed bug → replaced by "an INVALID reply applies none of the submission's attributes", with SP-API Product Metadata Updates added as a source.
17. "Stable enough for a skill": the one-ASIN-many-SKUs line and the notification line reworded to match 6 and 11.
18. Pages read: noted that `developer-docs.amazon.com` now redirects (301) to `developer-docs.amazon`.

No seller data found: no real ASIN, SKU, store name, seller id or store figure from the run reports appears in the file.

Stays unverified:

- The live Seller Central help pages (G200898440, G200786710, GYTR6SYGFA5E3EQC, G17781), Fix Your Products and the Listing Quality Dashboard: still JavaScript shells or sign-in; not retried beyond the archive. (Superseded for the four help pages: they were read through the content call later the same day and are captured under the office's capture folder (outside this repository); see section K and "Reconciled 2026-10-14". Fix Your Products and the dashboard remain signed-in screens.)
- The Amazon Ads eligibility page: not retried.
- Sorokina and Cantú-Paz: full text not read; cited for existence only, as the file already says.
- That Manage Listings Issues names Seller Central page G17781 by number: the page links "Error code explanations"; the id was read from the fetch summary, not from the raw link.
- door.md was read from the main checkout on disk, not from `origin/main`.

Missing for a senior Amazon operations lead (listed, not researched):

- Stranded inventory and FBA-side inactivity (the `GET_STRANDED_INVENTORY_UI_DATA` family, FBA Inventory API) as a reason a listing is not buyable.
- Variation-family health: orphaned children, broken parent-child relationships, `relationships` dataset reads, the Variations policy, and Amazon merging or splitting ASINs.
- Brand Registry levers: Brand Registry "Report a Brand Violation", content-contribution precedence in practice, and the "Review Listings Changes" / "Manage Your Experiments" tools.
- Restricted products, hazmat/dangerous-goods review and compliance-document requests (Product Compliance, `getListingsRestrictions` vs Account Health's "Product Policy Compliance") as causes of suppression.
- Account Health's listing-policy categories (Intellectual Property complaints, Product Authenticity, Product Condition, Restricted Product Policy, Listing Policy violations) and how each is read; the Account Health Rating's 0–1,000 scale and thresholds as Amazon states them.
- Pricing-driven inactivity: "Pricing error" deactivation, the Featured Offer (Buy Box) as a buyability-adjacent state, Competitive External Price.
- Image standards (main-image white background, 1,000-pixel zoom, image suppression), A+ content and Brand Story status via the A+ Content API, and video.
- Amazon's AI listing tools (generative listing content, "Enhance my listing") and catalog AI overwriting seller values, as a cause of unexpected content change.
- Duplicate-ASIN and "listing merged" handling; `GET_MERCHANT_LISTINGS_DEFECT_DATA` / listing-defect reports if they exist.
- Category style guides and the search-terms help page's indexed byte limit (still an open question in the file).

Gap fill 2026-10-14: 2 gaps filled, 5 left open.

Filled:

1. The catalogue-wide issue sweep (section M, items 56–62; positions 17–21). Covers:
   - `searchListingsItems` with `includedData=issues,summaries`;
   - `withIssueSeverity` (WARNING/ERROR only), `withStatus` / `withoutStatus`, the date filters and `sortBy`;
   - `pageSize` up to 20 and `pageToken` paging, with the 24-hour token, the parameter-mismatch error and the 1,000 cap;
   - `issueLocale`, and filters applying to the first store only;
   - the `LISTINGS_ITEM_ISSUES_CHANGE` 2023-12-13 payload against a polled sweep;
   - `GET_MERCHANT_LISTINGS_DEFECT_DATA`, which is not on any current report-type page.
2. The verifier's list (section N, items 63–102; positions 22–33):
   - stranded inventory and FBA buyability;
   - variation-family health;
   - duplicate ASINs and merges;
   - Brand Registry levers (contribution precedence, Review Listing Changes with the 14-day auto-publish, Manage Your Experiments, Report a Violation);
   - restricted products, approvals, enhanced safety and hazmat;
   - the Account Health Rating, its policies, and `GET_V2_SELLER_PERFORMANCE_REPORT` with its schema;
   - pricing-error deactivation against Featured Offer ineligibility;
   - image standards and image suppression;
   - Amazon's AI suggestions and content reconciliation;
   - the search-terms byte limit as indexed;
   - style guides.

Corrections made in place:
- Item 28: the Sellers API carries no seller id.
- Item 37: the `merge` op is documented on "Merge a listing" for offer and fulfilment attributes only.
- Item 55: the V2 performance report does carry listing-policy fields.
- Section K: the four help pages are readable through the help hub's content call.
- Item 53: the live G200390640 v21 r1 was added.
- The Keepa entry: the web docs give 4000/4000 against the Java comments' 2000/50.
- The search-terms open question is answered at help-page level.

Left open:

1. The `generic_keyword` `maxLength` in the live product type schema. No API call is allowed here; it is a first-run read.
2. An API route to Review Listing Changes, the Enhance tab, Manage Your Compliance and hazmat classification. None was found; it may not exist.
3. A+ Content / Brand Story status and video (A+ Content API). Not researched in this pass.
4. Fix Your Products, the Listing Quality Dashboard's "at risk" tab and the FYP reason ↔ `issues[].code` mapping. They are behind sign-in, and no page states the mapping.
5. Three conflicts between Amazon's own pages, recorded but not resolvable from documents:
   - the Brand Registry merge rule;
   - the variation display wait;
   - Account Health labels, and the docs page against the schema fields.

Adversarial re-check of the additions (same day). Method:
- The 37 Seller Central help pages cited in sections M and N were fetched again through the content call, 3 s apart. Every one returned the same version and revision as cited.
- 187 verbatim phrases were matched against the fresh text after normalising quotes and whitespace: 187 found.
- The nine developer-docs pages, the four GitHub model and schema files, sell.amazon.com/brand-registry, Keepa's Product Object page, the two forum posts, aboutamazon.sg, Modern Retail, eComEngine, SellerApp and the Amazon Science page were fetched again and matched in the same way: 92 phrases.

Two fixes followed:
- The eComEngine wording is "allowing at least 24 hours in between", and its line on other resellers is now quoted, not paraphrased.
- Item 62's count of report category pages was 16 and is now 15; `report-type-values-seller-performance` was added as a second 404.

The structural claims were re-read from the fresh model:
- the searchListingsItems enums and defaults: `pageSize` 10/max 20, `identifiers` maxItems 20, `sortBy`, the usage plan 5/5;
- the absence of "stranded" in the Listings Items and FBA Inventory models;
- the Sellers API's fields;
- the schema file's lack of `customerProductReviewsPolicyViolations`, `policyViolationWarnings` and `ahrScore`.

No Amazon API host or Keepa API host was called. No seller data was added; only placeholders (`<SKU>`, `<sellerId>`, `<locale>`) are used.

Reconciled 2026-10-14, against the critics' contradiction list and the rest of research/. Sources were re-opened: the Listings Items, Catalog Items and Product Pricing 2022-05-01 model files (raw GitHub), the Listings Items rate-limit page, Merge a listing, Submit modular titles, sell.amazon.com's Brand Registry and Manage Your Experiments pages, Keepa's Product Object page and Product.java, and the help-page captures under the office's capture folder (outside this repository) (no new help-hub content call; no Amazon or Keepa API host called). Changed:

1. Sources list and section K: the four help pages first called unreachable or behind a sign-in wall (G200898440, G200786710, GYTR6SYGFA5E3EQC, G17781) are now stated as read on 2026-10-14 through the content call, with their captures named; only Fix Your Products and the Listing Quality Dashboard (signed-in screens, not help pages) stay unread. The Pages-read rows for the four pages, the first open question and the verifier's "Stays unverified" line were brought into line.
2. Help-page quotes in items 53, 66, 68, 71, 74, 77, 93, 97, 98, 99 and 101 were matched against their captures; all found.
3. Item 8: the rate-limit disagreement is now stated with both figures (page: burst 5 for get/search/put; model: burst 10 for `getListingsItem` and `putListingsItem`) and the `x-amzn-RateLimit-Limit` header named as the binding value.
4. Section D: a side-by-side list of every latency figure the file holds (1–5 min, 15–20 min, 15 min, 15 min / 24 h vs 24–28 h, 24 h, 24–48 h, 48 h, about 8 h, 72 h), each with its change type and source, plus the two 72-hour help pages from their captures, and the rule that cx reads state rather than assuming a figure. New P-34 states it; a Stable line was added. The "24 to 48 hours" title figure is confirmed on Amazon's own page (capture GYTR6SYGFA5E3EQC-v21.txt); method/effect-measurement.md's verifier and method/listing-writes.md, which place it only in forums, blogs or SellerEngine, are the files out of date.
5. Item 28 and the run-time seller-id line: added the third route other files use, `getFeaturedOfferExpectedPriceBatch` `offerIdentifier.sellerId` (model wording quoted), with the warning that featured-offer and competing-offer seller fields can name another seller; cross-referenced method/sp-api-access.md. The Sellers API remains not a route.
6. Item 37: `merge` was already documented here (the critics' "semantics unknown" read an older draft); added that the page states no restriction beyond its two examples and that this agrees with listing-writes.md and price-position.md.
7. Item 41: the title-figure disagreement is now stated in full across Amazon's pages (75/125/200; 200 under code `90225`; 80/130 on Suppressed listings; the 2025 blog's 200/60), with `maxLength` from `getDefinitionsProductType` as the binding value.
8. Item 42: the forum post is named as the source for Amazon rewriting titles nobody updated, against Submit modular titles' "does not affect your current listings unless you submit an update". angles/competitor-set.md, which says Amazon does not change untouched titles, is the file out of date; it was not edited.
9. Item 99: Amazon's pages disagree on the outcome for a non-compliant existing title (auto-correct or not shown in search; stays searchable; unaffected unless updated); which applies is read from `status`, `issues` and the Catalog name.
10. Items 30 and 44: the image count is stated as Amazon's disagreement (nine photos = MAIN + PT01–PT08 against the workflows guide's main plus nine secondary), with the schema's image attributes as binding.
11. Item 76: the Brand Registry page's "up to 25%" is set against the Manage Your Experiments tools page's "up to 20%" (both "Amazon internal data", both re-read); the MYE help page states no percentage.
12. Item 101 and its open question: the search-terms figures (less than 250, 249, no figure, 500, schema copies 250/2000 bytes with 500 characters per elements/search-terms.md) are stated as a disagreement, binding value from the schema; the UK page's capture shows the same < 250 bytes and no-spaces rule, so the "spaces counted in the UK" line elsewhere is the 2022 archive's.
13. Keepa: `description` (2,000 Java / 4,000 web) and `variations` (50 Java / 4000 web) are now both stated as Keepa's own disagreement; the gap fill's "the web page is current, the Java comments stale" is withdrawn as unproven, matching angles/competitor-set.md; a new open question asks which cut a first read shows, and the freshness question now cites competitor-set.md's "~1 hour" refresh quote.
14. Stable lines and positions: no longer state a figure Amazon keeps in a schema or changes by announcement. Reworded: report freshness; the sweep cap and token window; search terms; P-11 (no 75); P-12, P-17, P-18 (the model's cap and `pageSize` maximum, not 1,000 and 20); P-23 (the stranded wait as the page states it); P-28 (the announced review window, not 14 days); P-30 (image figures by page and version); P-31 (no 250 bytes); P-32 (no stale figures). The figures stay in the rules sections for human readers.
15. Pages read: a "Reconciliation reads" table records every re-read above.

Not changed, other files being the ones out of date or the subject not this file's: the stale pointer in elements/attributes-and-browse-nodes.md that places the modular-title rule here (elements/title.md owns it); web.archive.org reachability (this file read archived copies, consistent with elements/search-terms.md and method/help-page-access.md A6: the difference is the fetch tool); the Item Highlights length (this file gives 125 with the schema binding; the "fixed 75" the critics attribute to it was P-11's `item_name` figure, now removed). No cross-reference in this file names inventory-and-fulfilment.md or elements/vendor-and-hybrid.md.
