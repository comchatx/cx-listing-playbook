# Writing a listing: the schema, the validation preview, submissions, issues and what the Catalog shows

Read 2026-10-14 by the research seat. Tags: [official] Amazon's own page or document; [opinion] a named practitioner; [research] published research; [seat] the seat's own reasoning, never a skill position.

## What this covers

This file covers the write side of a listing, from the moment cx has a proposed change to the moment it can say what Amazon now shows. It has six parts:

- **What a write must conform to.** The Product Type Definitions schema and its custom keywords.
- **How a write is sent.** `patchListingsItem` and `putListingsItem` on Listings Items v2021-08-01, the JSON Patch operations, and the bulk `JSON_LISTINGS_FEED`.
- **How a write can be checked without being kept.** `mode=VALIDATION_PREVIEW`, and the static sandbox.
- **What a write's answer means.** `status`, `submissionId` and `issues`, the synchronous/asynchronous split, the processing delay, and the rate limits.
- **What the shopper sees after a write.** The Catalog's reconciled values, set against the Listings Items record of what was submitted, plus contribution precedence and the global reach of images.
- **Who else writes.** Amazon-initiated changes: AI titles and Item Highlights, Enhance Listings, Review Listings Changes, View Change History and `BRANDED_ITEM_CONTENT_CHANGE`. This part also says what Amazon keeps of a change.

The file is cross-cutting. It feeds `references/writing.md` and the listing-change-log skill. The sibling file `research/angles/listing-content-and-health.md` covers reading a listing's health. This file overlaps with it only where a write must be read back.

Sources, in order of weight:

- **Amazon's developer documentation.** Pages fetched in their `.md` form from developer-docs.amazon.com.
- **The OpenAPI models.** The three models in `amzn/selling-partner-api-models`, including their static-sandbox cases.
- **Amazon's sample AI sandbox code** in `amzn/selling-partner-api-samples`.
- **Seller Forums threads posted by Amazon staff accounts.** These are server-rendered and read in full.
- **Two Amazon editorial pages.** aboutamazon.com and sell.amazon.com.
- **Practitioner pages**, and two published papers.

In the first pass, the seat's plain fetch of each Seller Central help page this file needed returned only the page's JavaScript shell, with no article text. The gap fill of 2026-10-14 read them through the help hub's content call, the route `research/method/help-page-access.md` describes. Each text read is saved under the office's capture folder (outside this repository)<page id>-v<version>.txt`; every help page cited here with such a capture was read on 2026-10-14, and its words are quoted from the capture. Where a page read in the gap fill corrects a first-pass line, the correction is marked "Gap fill" next to the line.

The gap fill added three parts, as sections G–I below:

- **Deleting a listing**, and what a delete takes with it.
- **The bulk and asynchronous path:** the Feeds API with `JSON_LISTINGS_FEED`, and its processing report.
- **Stores and languages:** one write per store, `language_tag`, Build International Listings and Pan-European FBA.

The ComChatX run's own findings are kept apart and labelled as the run's, not Amazon's. They come from the internal report `office-mailbox/from-engineering/20261014-0921-beta-browser-listing-run-day-2.md`. Examples use placeholders (`<sellerId>`, `<SKU>`, `<ASIN>`, `<marketplaceId>`). No store name, seller id, ASIN or figure from any run report is copied here.

## Amazon's own rules and guidance

### A. What a write must conform to

1. **RULE.** "Listings data submitted to the Listings Items API must conform to the JSON Schema format provided by the Selling Partner API for Product Type Definitions. Use the Product Type Definitions API to retrieve the latest JSON schema for a product type."
   - The troubleshooting page says the same with "abide by".
   - The exact phrase "listing submissions are validated against the product type definition" was not found on any page read. These two sentences are Amazon's wording.
   - [official] (Manage Listings Issues, https://developer-docs.amazon.com/sp-api/docs/manage-listings-issues, read 2026-10-14; Listings Items API Issues Troubleshooting, https://developer-docs.amazon.com/sp-api/docs/listings-items-api-issues-troubleshooting, read 2026-10-14)

2. **RULE: the order of an update, as Amazon writes it** (the guide's eight steps, condensed).
   1. Identify the SKU.
   2. "If you need to inspect the existing attributes", `getListingsItem` with `attributes` and `issues` in `includedData`.
   3. `getDefinitionsProductType` with `requirements` `LISTING` or `LISTING_PRODUCT_ONLY`. A note under this step says to "Cache the JSON schemas" and, on a `PRODUCT_TYPE_DEFINITIONS_CHANGE` notification, "refresh the cached JSON schemas for your product types".
   4. Prepare attributes "adhering to the JSON Schema for the product type. Non-editable values (`"editable": false`) cannot be modified from their existing values".
   5. Check the data "by using JSON Schema validation utilities" against the meta-schema — a client-side check; this step does not name `VALIDATION_PREVIEW`.
   6. `patchListingsItem` (partial) or `putListingsItem` (full).
   7. Read `ACCEPTED` or `INVALID`.
   8. Wait for `LISTINGS_ITEM_STATUS_CHANGE` / `LISTINGS_ITEM_ISSUES_CHANGE` (which must be subscribed to), then read issues with `getListingsItem` or `searchListingsItems` and `includedData=issues`.

   The same guide warns that "getListingsItem returns some attributes that are not part of the Product Type schema and are not valid for submission". A read listing cannot be echoed back unchanged as a write.
   [official] (Building Listings Management Workflows Guide, https://developer-docs.amazon.com/sp-api/docs/building-listings-management-workflows-guide, read 2026-10-14)

3. **RULE: the schema's parameters.** All of these are in the `getDefinitionsProductType` model.
   - `requirements`: `LISTING` by default; `LISTING_PRODUCT_ONLY`; `LISTING_OFFER_ONLY`.
   - `requirementsEnforced`: `ENFORCED` by default, or `NOT_ENFORCED`. The model describes `NOT_ENFORCED` as "used for partial payload validation, such as for single attributes". It also says "Non-enforced requirements enable structural validation of individual attributes without all the required attributes being present (such as for partial updates)".
   - `productTypeVersion`: `LATEST` by default, or `RELEASE_CANDIDATE`.
   - `marketplaceIds`: "limited to one marketplaceId".
   - `locale`: `DEFAULT` by default (the store's default language), or a listed locale such as `en_US`.
   - `parentageLevel`: `NONE`, `CHILD` or `PARENT`; it returns a schema "simplified by resolving all conditional logic related to the specified parentage level". Added in the release notes of May 27, 2026.
   - `sellerId`: the Retrieve page says it is used to "retrieve the seller-specific attributes, including B2B audience values … If the `sellerId` is not provided, the API returns a generic schema without the seller-specific configurations." The model's own wording is different: "seller-specific requirements and values are populated within the product type definition schema, such as brand names associated with the selling partner."

   [official] (definitionsProductTypes_2020-09-01.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/product-type-definitions-api-model/definitionsProductTypes_2020-09-01.json, read 2026-10-14; Retrieve a Product Type Definition, https://developer-docs.amazon.com/sp-api/docs/retrieve-a-product-type-definition, read 2026-10-14; SP-API Release Notes, https://developer-docs.amazon.com/sp-api/docs/sp-api-release-notes, read 2026-10-14)

4. **RULE: the schema is not inline.**
   - The response carries `schema` and `metaSchema` as links (`link.resource`, `verb` GET) with a `checksum`. The model describes the checksum as a Base64 MD5 used to identify changes for caching.
   - "The links provided are valid for seven days."
   - "Meta schema names cannot be resolved using the web."
   - Fetching the schema is therefore a second download, separate from the API call.
   - [official] (definitionsProductTypes_2020-09-01.json, as above; Retrieve a Product Type Definition, as above)

5. **RULE: the schema changes.**
   - "Unless you specify a previous productTypeVersion, the Amazon Product Type Definitions always describe the latest up-to-date Amazon catalog requirements."
   - "Amazon reviews product attributes regularly and plans necessary updates for the last week of every month. Sometimes, Amazon makes some updates before the planned release … Before you update any attribute for your listing submission, use the Product Type Definitions API" to get the latest schema.
   - `PRODUCT_TYPE_DEFINITIONS_CHANGE` fires "whenever there is a new Product Type or Product Type Version".
   - The metadata-updates page lists a monthly changelog spreadsheet. The latest row is September 28, 2026; earlier rows include July 27 and August 31, 2026.
   - [official] (Product Type Definitions API, https://developer-docs.amazon.com/sp-api/docs/product-type-definitions-api, read 2026-10-14; Listings APIs FAQ, https://developer-docs.amazon.com/sp-api/docs/listings-apis-faq, read 2026-10-14; Notification Type Values, https://developer-docs.amazon.com/sp-api/docs/notification-type-values, read 2026-10-14; SP-API Product Metadata Updates, https://developer-docs.amazon.com/sp-api/docs/sp-api-metadata-updates, read 2026-10-14)

6. **RULE: the meta-schema's custom keywords decide what a limit means.**
   - The meta-schema extends JSON Schema 2019-09.
   - `editable`: "Indicates whether or not a property value can be modified for an existing item."
   - `maxUtf8ByteLength` and `minUtf8ByteLength` measure "the maximum length of a string, measured in UTF-8 bytes". Standard `maxLength` counts characters.
   - It also defines `selectors`, `$lifecycle` and `enumDeprecated`.
   - Amazon warns that ignoring the custom vocabulary means "you may get validation errors". It also calls custom vocabulary validation "recommended but not required".
   - A limit can therefore be in characters or in bytes, and only the keyword says which.
   - [official] (Amazon Product Type Definitions Meta-Schema (v1), https://developer-docs.amazon.com/sp-api/docs/product-type-definition-meta-schema, read 2026-10-14; Product Type Definitions API, as above)

7. **RULE: the shape of an attribute value.** Attributes are arrays of objects, keyed by selectors.
   - Amazon's examples write text values as `{"value": …, "language_tag": "en_US", "marketplace_id": "ATVPDKIKX0DER"}`. They use snake_case keys and an underscore in the locale.
   - Non-text values omit `language_tag`, for example `{"value": 4, "marketplace_id": …}`. Measured values add `unit`.
   - The modular-titles schema excerpt for `title_differentiation` declares `"selectors": ["marketplace_id","language_tag"]` and `"required": ["language_tag","value"]`.
   - "Attributes cannot be deleted by name alone, the selector values identify which instance of attributes to delete."
   - The selector values in a write are therefore part of what is written, not decoration.
   - [official] (Retrieve details about a listing for single or multiple Amazon stores, https://developer-docs.amazon.com/sp-api/docs/retrieve-details-about-a-listing, read 2026-10-14; Submit modular titles, https://developer-docs.amazon.com/sp-api/docs/submit-modular-titles, read 2026-10-14; Partially update a listing, https://developer-docs.amazon.com/sp-api/docs/partially-update-a-listing, read 2026-10-14)

8. **RULE: images are attributes with their own names.**
   - The names are:
     - MAIN: `main_product_image_locator`.
     - PT01–PT08: `other_product_image_locator_1` to `other_product_image_locator_8`.
     - SWCH: `swatch_product_image_locator`.
   - Each value is `{"media_location": "https://…"}`.
   - Sources can be public S3, CloudFront, private S3 by `s3://`, or third-party servers "publicly available to Amazon".
   - "Seller Central's Image Manager supports additional image variants that are not available through the Listings Items API."
   - "Supported image variants and their requirements differ by product type and marketplace." The page sends the reader to `getDefinitionsProductType` for which image attributes exist.
   - The workflows guide adds that offer images (`main_offer_image_locator` and others) also exist, and that "Images must comply with Amazon's product image requirements". Those requirements are the Seller Central page Product image guide (G1881 v28), read 2026-10-14 from its capture capture `G1881-v28`.
   - **Amazon's pages disagree on the image count, recorded as found:**
     - Building Listings Management Workflows Guide: "A main product image and up to nine secondary images can be uploaded using the Listings Items API" (ten in all).
     - Submit media attributes: MAIN plus eight secondary attributes, `other_product_image_locator_1` to `_8` (`PT01`–`PT08`), nine in all.
     - Add product images and video (G200216080 v15, capture read 2026-10-14), of the Seller Central upload tab: "Maximum 9 images are allowed." It also says "It can take up to 24 hours after you add an image for it to appear on the website."
     - Product image guide (G1881 v28, capture read 2026-10-14) lists variant codes up to `PT01–PT99`. These are variant codes, not slots per listing. It also says "If your image is selected for display, it can take up to 24 hours after you upload it to appear on the product detail page."
     - This file does not pick one figure. The binding count for a write is the set of image locator attributes that `getDefinitionsProductType` returns for the product type and store, read at run time. `research/elements/images-and-video.md` carries the same disagreement.
   - [official] (Submit media attributes, https://developer-docs.amazon.com/sp-api/docs/submit-media, read 2026-10-14; Building Listings Management Workflows Guide, as above; Add product images and video, G200216080 v15, https://sellercentral.amazon.com/help/hub/reference/external/G200216080, read 2026-10-14; Product image guide, G1881 v28, https://sellercentral.amazon.com/help/hub/reference/external/G1881, read 2026-10-14)

9. **RULE: images reach every store.** "The image attributes provided by the Listings Items API v2021-08-01 operations map images to ASINs at a global level where the ASIN exists, even if you specify the `marketplace_id` selector."
   [official] (Listings APIs FAQ, as above)

### B. How a write is sent

10. **RULE: patch versus put.**
    - `putListingsItem` "creates a new listing or replaces the existing content of a listing. Existing attributes may be dropped if omitted".
    - For sellers, put "replaces previously submitted product fact attributes and merges previously submitted sales term attributes". Omitting an optional product fact removes it; omitting an offer price does not.
    - "The patchListingsItem operation is intended only for editing existing listings."

    [official] (Listings Items API, https://developer-docs.amazon.com/sp-api/docs/listings-items-api, read 2026-10-14; Building Listings Management Workflows Guide, as above)

11. **RULE: what a patch can touch.** The model defines the patch operations as follows.
    - The enum is `add`, `replace`, `merge` and `delete`.
    - `add` and `replace` are each described as "adds or replaces the target property".
    - `path` is a JSON Pointer, for example `/attributes/item_name`.
    - `value` is an array of objects.
    - A `PatchRequest` needs `productType` and `patches` (at least one).
    - "Only top-level listings item attributes can be patched. Patching nested attributes is not supported."
    - The guide says: "JSON Patch documents can add, replace, or delete entire attributes. Patching content within attributes is not supported."
    - `merge` was added on May 28, 2025. The model describes it only as "The `merge` operation merges the target property." Its scope is on the Listings Items API page: "The merge operation is not supported for other attributes outside of `fulfillment_availability` and `purchasable_offer`". The release note names its two uses: the `quantity` in `fulfillment_availability` without the optional fields, and deleting `quantity_discount_plan` from `purchasable_offer` for B2B offers.
    - Partially update a listing, by contrast, says patch documents "can add, replace, or delete entire attributes" and does not name `merge`. Read together: for content attributes (title, bullets, description, search terms, images) the usable operations are `add`, `replace` and `delete` on whole attributes, and `merge` applies only to the two offer attributes. Files that say patch is whole-attribute add/replace/delete (bullet-points, description, search-terms) are right for content; the merge semantics are not unknown, they are scoped as above.
    - For product types "not yet fully supported by the Listings Items API, offer-only submissions for existing ASINs and partial updates are supported by using the `PRODUCT` product type" (Listings Items API page).
    - For vendors (not sellers), the workflows guide says "deleting individual attribute values is not supported for vendors at this time", and put merges rather than replaces.

    [official] (listingsItems_2021-08-01.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/listings-items-api-model/listingsItems_2021-08-01.json, read 2026-10-14; Partially update a listing, as above; Listings Items API, as above; SP-API Release Notes, as above)

12. **RULE: the path and its parameters.**
    - The path is `/listings/2021-08-01/items/{sellerId}/{sku}`.
    - Query parameters on put and patch: `marketplaceIds`; `includedData` (`identifiers`, `issues`; default `issues`); `mode` (`VALIDATION_PREVIEW`); `issueLocale`.
    - The put body is `{productType, requirements, attributes}`.
    - The role needed is Product Listing.

    [official] (listingsItems_2021-08-01.json, as above; Listings Items API, as above)

13. **Amazon page inconsistency, recorded as found.** Step 2 of "Submit modular titles" is labelled as a PATCH. Its example body is `{productType, requirements: "LISTING", attributes: {…}}`, which is the put body. The model's patch body is `{productType, patches: [...]}`. The model decides.
    [official] (Submit modular titles, as above; listingsItems_2021-08-01.json, as above)

14. **GUIDANCE: bulk.**
    - `JSON_LISTINGS_FEED` is "the bulk equivalent of the Listings Items API, offering the same features and schemas".
    - It takes up to 25,000 messages per feed, with 5 feeds per 5 minutes.
    - "The suggested minimum feed size is 1,500 items; using the Listings Items API directly is faster with less than 1,500 items during a five-minute period."
    - Feed submissions "are not guaranteed to be processed in the same order".
    - "a feed with only a few records can still take several hours".
    - Since February 23, 2026, a feed shows `DONE` only after all processing.
    - "Repeated submission of duplicate data increases your processing backlogs unnecessarily".
    - On whether a later feed overwrites a patch: "No. Amazon uses submission timestamps to ensure that updates happen in the correct order." The FAQ's worked example is about inventory updates; it does not say the same for content attributes in so many words.
    - The feed route in full (documents, polling, the processing report, the retired feed types and the multi-store rule) is in section H.

    [official] (Listings Items API, as above; Building Listings Management Workflows Guide, as above; Listings Feed Type Values, https://developer-docs.amazon.com/sp-api/docs/listings-feed-type-values, read 2026-10-14; Listings APIs FAQ, as above; SP-API Release Notes, as above)

### C. Checking a write without keeping it

15. **RULE: what preview is.**
    - "`VALIDATION_PREVIEW` mode synchronously performs the same checks that are done on production submissions, but without persisting to your catalog."
    - It "provides a test environment to identify asynchronous errors that could prevent a listing from being created or updated, without persisting the data in production."
    - Preview is a production call with `mode=VALIDATION_PREVIEW`. Amazon's own example on Manage Listings Issues is a PATCH to `https://sellingpartnerapi-na.amazon.com/…?…&mode=VALIDATION_PREVIEW`.
    - The mode was announced in the release notes of January 31, 2024: "validate a listings item without persisting the data in the catalog … preview listing errors in production without creating listings."
    - Both preview tutorials say preview "returns the pricing validation issues when you include the price attributes in the request body".

    [official] (Listings APIs FAQ, as above; Manage Listings Issues, as above; SP-API Release Notes, January 31, 2024 entry, as above; Preview errors before partially updating a listing, https://developer-docs.amazon.com/sp-api/docs/preview-errors-before-partially-updating-a-listing, read 2026-10-14; Preview errors before creating or fully updating a listing, https://developer-docs.amazon.com/sp-api/docs/preview-errors-before-creating-a-listing, read 2026-10-14)

16. **RULE: preview is limited testing, not a production path.** "This mode has lower rate limits and is intended for testing a small number of listings. It is not designed for production workflows."
    [official] (Manage Listings Issues, as above)

17. **RULE: what preview answers.**
    - `status` `VALID` "Only returned when the mode is VALIDATION_PREVIEW". Otherwise `INVALID`, with issues.
    - On pricing: "A `status` of `VALID` with `WARNING`-level pricing issues means the listing update is accepted, but the offer may not be eligible for the Featured Offer." The page says this of pricing warnings; it is not stated as a general rule for every WARNING. The sentence is quoted as the page read on 2026-10-14; `research/angles/price-position.md` and `research/method/funnel-and-search.md` record a 2026 change to Featured Offer eligibility, which this file does not settle.
    - Preview's error codes are being changed to new codes ("The validation logic remains functionally equivalent, but error codes change"; "We support both current and new error codes"). For example, 90004145 maps to 90225 ("Max length rule violated"); the page's example message is "The value provided for 'item_name' exceeds the maximum length of 200 characters." "These changes affect only the Validation Preview mode".
    - Preview surfaces pricing issues under `INVALID_PRICE`: 100708 (WARNING, new to preview), and 19038, 19037 and 18701 (ERROR). The release notes of April 29, 2026 record this as a documentation change ("Added pricing validation details to the Listings Items API … guides"); the launch date of the behaviour itself was not found.

    [official] (listingsItems_2021-08-01.json, as above; Manage Listings Issues, as above; SP-API Release Notes, as above)

18. **RULE: what the static sandbox is.**
    - "The SP-API static sandbox uses pattern matching to return static, mock responses."
    - "Making static sandbox calls is identical to making production calls, except you direct calls to the … sandbox endpoints."
    - "Use the hosted sandbox environments to test functionality, *not* scalability." Calls to the hosted sandbox endpoints are limited to rate five per second and burst 15.
    - The page names three sandboxes: static (pattern matching), dynamic (a sandbox backend), and a local sample AI sandbox. Its "Sandbox support by API" table lists the Listings Items, Product Type Definitions and Catalog Items APIs as **Static**; neither the Listings Items model nor the Product Type Definitions model carries a `dynamic` sandbox object.
    - The patch cases in the model are as follows:
      - A case whose request pattern is an empty body (`"body": {}`) answers `status: ACCEPTED`, a fixed `submissionId` and no issues. How loosely an empty pattern matches is not stated; the page says a response is returned "when the specified parameters are present".
      - The SKU `VALIDATION_VALID` with `mode=VALIDATION_PREVIEW` returns `VALID`.
      - The SKU `VALIDATION_INVALID` with `mode=VALIDATION_PREVIEW` returns `INVALID` with code 90000900 on `fake_attribute`.
      - The SKU `BadSKU` returns 400.
    - The static sandbox therefore proves the request's shape, signing and route. It does not prove that the content would pass.

    [official] (Selling Partner API Sandbox, https://developer-docs.amazon.com/sp-api/docs/sp-api-sandbox, read 2026-10-14; listingsItems_2021-08-01.json, as above)

19. **GUIDANCE: Amazon's own AI sandbox sends put to production preview.**
    - Amazon's sample local AI sandbox "validates requests against SP-API OpenAPI schemas, simulates API responses using an AI agent backed by Amazon Bedrock".
    - Its `putListingsItem` handler states: "Rather than reimplement Amazon's validation, every PUT calls the real API with `mode=VALIDATION_PREVIEW` … PUT therefore requires real credentials — deliberate, since a local approximation would go stale and teach callers the wrong rules."
    - The handler sends to `https://sellingpartnerapi-<region>.amazon.com`.
    - It drops catalog-matching issues, because production judges them against the real catalog.

    [official] (Selling Partner API Sandbox, as above; selling-partner-api-samples `local-ai-sandbox/src/operation/listingsValidationPreview.ts`, https://raw.githubusercontent.com/amzn/selling-partner-api-samples/main/local-ai-sandbox/src/operation/listingsValidationPreview.ts, read 2026-10-14; `passThroughOperations.ts` in the same folder, https://raw.githubusercontent.com/amzn/selling-partner-api-samples/main/local-ai-sandbox/src/operation/passThroughOperations.ts, read 2026-10-14)

### D. What a write's answer means

20. **RULE: the response.** `ListingsItemSubmissionResponse` requires `sku`, `status` and `submissionId`, and may carry `issues` and `identifiers`.
    - `ACCEPTED`: the submission "was accepted for processing".
    - `INVALID`: "not valid and was not accepted".
    - `VALID`: preview only.
    - Each issue carries:
      - `code` and `message`;
      - `severity`: ERROR, WARNING or INFO;
      - `attributeNames`;
      - `categories`, for example `INVALID_ATTRIBUTE`, `MISSING_ATTRIBUTE`, `INVALID_IMAGE`, `INVALID_PRICE`, `QUALIFICATION_REQUIRED`;
      - `enforcements`: `LISTING_SUPPRESSED`, `ATTRIBUTE_SUPPRESSED`, `CATALOG_ITEM_REMOVED` or `SEARCH_SUPPRESSED`, with an exemption of `EXEMPT`, `EXEMPT_UNTIL_EXPIRY_DATE` or `NOT_EXEMPT`;
      - `marketplaceIds`.

    [official] (listingsItems_2021-08-01.json, as above)

21. **RULE: ACCEPTED is not done.**
    - "**Accepted** does not mean the process is complete. Multiple downstream processes create the item in the Amazon catalog".
    - "Responses do not include issues that occur after accepting the submission for processing. Responses to the Listings Items getListingsItem operation can include issues that occur after the submission has been processed."
    - "A client must handle issues reported both synchronously and asynchronously."

    [official] (Manage Listings Issues, as above; Listings Items API, as above; Listings Items API Issues Troubleshooting, as above)

22. **RULE: the processing time, with its figures and where they come from.**
    - `getListingsItem` "directly queries the current state, which is why the results are available faster (within 1-5 minutes)".
    - "the Amazon backend updates every 15 minutes", so a 15–20 minute delay for `LISTINGS_ITEM_ISSUES_CHANGE` and `LISTINGS_ITEM_STATUS_CHANGE` "is normal".
    - "To minimize throttling errors, you must use push notifications".
    - These figures are prose in the FAQ, not values in an API, so cx cannot read them at run time. A skill should say "re-read after processing", not quote a minute count.

    [official] (Listings APIs FAQ, as above)

23. **RULE: issues worth knowing by code.** All from the troubleshooting page.
    - 90220: a required attribute is missing.
    - 90225: the value is too long. Its examples are "item_name : 200 characters; generic_keyword : 500 bytes".
    - 4005033: the attribute is not editable.
    - 4005011: conflicts with another catalog item.
    - 90199: no HTML.
    - 90196: no URL.
    - 18280 speaks of "deleting this attribute from the contribution".
    - `getDefinitionsProductType` "roll[s] up" an unlaunched product type to its parent, usually `PRODUCT`, and still answers 200.
    - The 90225 figures are examples on the troubleshooting page, a developer-docs page. They disagree with other Amazon pages: for `item_name`, 200 here against 75 on the title pages (item 28 and 29); for `generic_keyword`, 500 bytes here against "less than 250 bytes" on Keyword attributes explained (Open question 3). The binding limit is the one in the product type's schema (`maxLength` or `maxUtf8ByteLength`), read at run time from `getDefinitionsProductType`.
    - The resolutions for 4005011 and 4005033 send the submitter to a support case (the 4005011 text names "an Amazon Vendor Central Support case"); a write cannot clear them on its own.
    - Manage Listings Issues (not the troubleshooting page) links a Seller Central page, "Error code explanations" (G17781), for asynchronous error messages.
    - Gap fill: Error code explanations (G17781 v13) was read on 2026-10-14 from its capture capture `G17781-v13`. It says errors result "when you submit a product that does not comply with the Product Detail Page Rules", including values that "Exceed the character limit". Its example: "if you submit a product with a description that exceeds 1000 characters, this will result in an error in the processing report, and your product will not be included in the catalog." Individual error pages sit under it in the help navigation; they were not read.

    [official] (Listings Items API Issues Troubleshooting, as above; Manage Listings Issues, as above)

24. **RULE: the rate limits.** "Requests are rate-limited by whichever threshold you reach first."
    - `patchListingsItem` allows 5 requests per second per selling-partner/application pair and 500 per application, with burst 5. Within that:
      - relationship updates: 100 per second per application;
      - product data attributes such as `item_name`: 100 per second per application;
      - "Validation previews: Limit of 20 requests per application per second."
    - get, put, delete and search: 5 per pair and 100 per application, burst 5. `putListingsItem` also carries the relationship class (100 per second per application); the page lists the preview class only under patch. The model gives burst 10 for get and put (and 5 for patch, delete and search), so the page and the model disagree on burst for get and put. Re-checked 2026-10-14: the page's v2021-08-01 table gives burst 5 for all five operations; the model's operation descriptions give 10 for `getListingsItem` and `putListingsItem`. This file does not pick one. The binding rate is the one Amazon returns at run time in `x-amzn-RateLimit-Limit` (below); neither source is to be quoted as the burst.
    - The model adds: "Selling partners whose business demands require higher throughput can receive higher rate and burst values."
    - At run time the figure lives in the `x-amzn-RateLimit-Limit` header, "if available". That header does not show the per-application or per-attribute-class limits.
    - Three 429 messages name which limit was hit: application, relationships, or product data.
    - For the door, door.md states: "Amazon's rates are per operation and stated in each model; the door adds no wait and retries nothing of its own."

    [official] (Listings Items API Rate Limits, https://developer-docs.amazon.com/sp-api/docs/listings-items-api-rate-limits, read 2026-10-14; listingsItems_2021-08-01.json, as above; Usage Plans and Rate Limits, https://developer-docs.amazon.com/sp-api/docs/usage-plans-and-rate-limits, read 2026-10-14)

### E. What the shopper sees after a write

25. **RULE: Listings returns what was submitted; Catalog returns what Amazon reconciled.**
    - "The Catalog Items API v2022-04-01 provides information at the ASIN level, which is reconciled from various listings against that item. The Listings Items API v2021-08-01 provides information about the specific listing submitted by a selling partner."
    - The Listings attributes section "shows the latest data provided by the selling partner".
    - Catalog Items attributes "conform to the related Amazon product type definitions".
    - Catalog Items no longer returns `generic_keyword`: "Selling Partners can use the Listings Items API to view submitted values." A search-terms write is therefore read back from `getListingsItem` (`includedData=attributes`), never from `getCatalogItem`; a plan that verifies search terms on the Catalog view will find nothing there.

    [official] (Listings APIs FAQ, as above; Listings Items API, as above; catalogItems_2022-04-01.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/catalog-items-api-model/catalogItems_2022-04-01.json, read 2026-10-14; SP-API Release Notes, Aug 16, 2023 entry, as above)

26. **RULE: a submission may not win the detail page.**
    - "Downstream process and rules governing catalog data are the same regardless of submission method. In some cases, especially where we already have a listing for a product, the information submitted by a vendor might not have priority." The sentence names vendors.
    - "Brand owners have the highest precedence to update data on the product details page on Amazon. If Amazon uses its own data on the product details page, brand owners can override it via a ticket to Seller Central support."

    [official] (Listings APIs FAQ, as above)

27. **RULE: images on a shared detail page.** "We'll now prioritize brand owner images and only use third-party sellers' images if the required images are missing in the product detail page." "To remove an incorrect or inaccurate image, contact Selling Partner Support." The post shows only a relative date ("2 years ago" on 2026-10-14), so it predates the 2026 title changes.
    [official] (Seller Forums, "Update to how product detail page images are selected", News_Amazon, no absolute date shown, https://sellercentral.amazon.com/seller-forums/discussions/t/9bf72c46-d413-404f-8e28-208ee75d54ee, read 2026-10-14)

28. **RULE: modular titles.**
    - "Starting July 27, 2026, this structure applies to all non-media product types submitted through the Listings Items API or the JSON_LISTINGS_FEED."
    - The page's table: `item_name` up to 75 characters and `title_differentiation` (Item Highlights) up to 125, for 200 in total.
    - "You can only submit title_differentiation when item_name is 75 characters or fewer." Error 100476 enforces this with `ATTRIBUTE_SUPPRESSED` / `NOT_EXEMPT`.
    - "you can still submit an item_name longer than 75 characters, and these submissions are accepted."
    - "If you submit an item_name longer than 75 characters (up to 200), Amazon may reconcile the value in the catalog, splitting it across item_name and title_differentiation. The getListingsItem and searchListingsItems operations return your original submitted value, while the catalog shows Amazon's reconciled version."
    - The page's own step 1 is `getDefinitionsProductType`. The figures 75, 125 and 200 are therefore read from the schema at run time.
    - **Amazon's pages give different title figures, recorded as found** (all read 2026-10-14):
      - Submit modular titles: `item_name` up to 75, `title_differentiation` up to 125, 200 in total; an `item_name` "longer than 75 characters (up to 200)" is accepted.
      - Product title requirements and guidelines (GYTR6SYGFA5E3EQC v21, capture): "Titles must not exceed 75 characters, including spaces"; Item highlights "provide an additional 125 characters".
      - Seller Forums announcement (News_Amazon): titles "will need to be 75 characters or less including spaces".
      - Listings Items API Issues Troubleshooting, 90225 example ("item_name : 200 characters"), and Manage Listings Issues' preview example message ("exceeds the maximum length of 200 characters").
      - Suppressed listings (G200898440 v13, capture): a search-and-browse suppression standard of "less than 80 characters for apparel, shoes, and luggage categories and 130 characters for all other categories".
      - These are different kinds of figure (a write limit, a policy, a suppression standard, an example), and they change by announcement. For a write, the binding value is `maxLength` on `item_name` and `title_differentiation` in the schema `getDefinitionsProductType` returns for that product type and store, read at run time. The policy length is read from the title page of that store at review time. Practitioner figures such as "under 60" (other files) are not Amazon's.

    [official] (Submit modular titles, as above)

29. **RULE, and a tension between two Amazon pages.**
    - The Seller Forums announcement says titles "will need to be 75 characters or less including spaces" and "After July 27, any titles still over 75 characters will be updated to the AI recommendation gradually."
    - The developer page says over-75 submissions "are accepted".
    - Both can be true: the write is accepted, and the catalog value is later replaced. A write that is accepted can still be overwritten.
    - The announcement also says, of the same gradual update: "Your listings stay active throughout this process, and you can make changes to your titles and Item Highlights at any time." The companion Q&A thread (item 30) says the changes "will take place throughout 2026, and your listings will remain active, editable, and searchable, even if they haven't been updated yet". Both threads were re-opened on 2026-10-14 for this reconciliation and the sentences matched. Amazon therefore does change titles that nobody updated: titles still over 75 characters are replaced by the AI recommendation over time. A file that says Amazon leaves untouched titles alone is contradicted by these posts.
    - Gap fill: the Seller Central title page was read on 2026-10-14 from its capture (Product title requirements and guidelines, GYTR6SYGFA5E3EQC v21, capture `GYTR6SYGFA5E3EQC-v21`). It says:
      - "Titles must not exceed 75 characters, including spaces."
      - On listings already live: "If your product is already listed and the title doesn't comply with these requirements or contains inaccurate information, the title might be automatically corrected or it might not appear in our search results."
      - On timing: "the change is accepted immediately but can take 24 to 48 hours to be processed and displayed on Amazon stores, including search results and the product detail page … If your change doesn't appear after 48 hours, you can edit and resubmit it or contact Selling Partner Support."

      The 24–48 hours figure is therefore Amazon's own words, on Amazon's help page, for title and Item Highlights changes. It is not only in seller forum posts or third-party blogs, and the first pass's attribution of it to SellerEngine alone was wrong.
    - **Two Amazon sources state different outcomes for a non-compliant title, recorded as found.** The forum posts say listings "stay active" and "remain … searchable" while the AI recommendation is applied. The title page says a non-compliant live title "might be automatically corrected or it might not appear in our search results". Neither is picked here; a skill says both are possible, and cx reads the listing's `issues` (enforcement `SEARCH_SUPPRESSED` or none) at run time to see which applies.

    [official] (Seller Forums, "Updates to improve your product titles begin on July 27", News_Amazon, updated Jun 10, 2026, https://sellercentral.amazon.com/seller-forums/discussions/t/145b6d0f-999c-4555-896c-c694bda2e470, read 2026-10-14; Seller Forums, "Answers to your product title update questions", as in item 30; Submit modular titles, as above; Product title requirements and guidelines, GYTR6SYGFA5E3EQC v21, https://sellercentral.amazon.com/help/hub/reference/external/GYTR6SYGFA5E3EQC, read 2026-10-14)

### F. Who else writes, and what Amazon keeps of a change

30. **RULE: Amazon writes titles and Item Highlights for brand owners, after a review window.**
    - "When changes are made to your listings, brand owners will have 14 days before implementation to review, modify, and approve AI-generated recommendations for titles and Item Highlights in Review Listings Changes."
    - The Q&A thread adds: "On July 27, 2026, we began making recommendations, using your existing product titles, on non-compliant listings. These changes will take place throughout 2026".
    - "If you disagree … update your listings at any time in Manage All Inventory or … List Your Products tool."
    - "effective August 10, 2026, Item highlights will display beneath the Item name across desktop and mobile".
    - "Item name and Item highlights are both inputs for search, and one isn't prioritized over the other."

    [official] (Seller Forums, "Updates to improve your product titles begin on July 27", as above; Seller Forums, "Answers to your product title update questions", News_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/302aaac6-6f2b-4d86-bcd2-36fe24f0e6cd, read 2026-10-14)

31. **GUIDANCE: Enhance Listings and View Change History.**
    - "Use Enhance Listings today – Review, modify, and apply AI-recommended titles and Item Highlights".
    - "Brand owners: Review and approve AI-generated recommendations in Review Listings Changes up to 14 days before changes go live."
    - "All sellers: View any AI-applied changes in Manage All Inventory → click View Change History."
    - The announcement names the route "Manage All Inventory … Edit … View enhancements".

    [official] (Seller Forums, "Engage With Amazon: Get your Product Title Update Questions Answered!", Dougal_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/ac660707-60c7-43e3-a3fd-420d7321cc4e, read 2026-10-14; "Updates to improve your product titles begin on July 27", as above)

32. **GUIDANCE: the bulk route for titles in Seller Central.**
    - Amazon staff named the Category Listings Report: "Update titles in Column B and I (they must match) and add Item Highlights in Column J". Add Products via Spreadsheet was named as the other way.
    - "Listings are typically updated within eight hours." This figure is for the Seller Central route, not the API. It is a staff forum figure. The title page gives 24 to 48 hours for a title change to be "processed and displayed" (item 29). [seat] The staff post does not say whether "updated" means the record or the store display, so the two figures are not reconciled here. Neither is an API value.

    [official] (Seller Forums, "How can sellers download a pre-populated template for bulk title and Item Highlights updates?", Kai_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/cbcfa2a1-ecb3-4440-80a2-1f6ff93e907c, read 2026-10-14; "Answers to your product title update questions", as above)

33. **GUIDANCE: Amazon's generative listing tools.**
    - Sellers "can directly submit the automatically generated content to the Amazon catalog" (2023).
    - The generative features "create compelling titles, descriptions, and other attributes from a few words, image, or existing listings" (2026).

    [official] (aboutamazon.com, "Amazon launches generative AI to help sellers write product descriptions", Mary Beth Westmoreland; the page shows no date, and 2023-09-13 comes from search results (a TechCrunch URL dated that day), not from the page, https://www.aboutamazon.com/news/small-business/amazon-sellers-generative-ai-tool, read 2026-10-14; Sell on Amazon blog, "How to create Amazon product listings", Mickey Toogood, Apr 29, 2026, https://sell.amazon.com/blog/amazon-product-listings, read 2026-10-14)

34. **RULE: the brand owner is told which content attributes changed, not what changed.**
    - `BRANDED_ITEM_CONTENT_CHANGE` is sent "whenever there is a change to the title, description, bullet points, or images, for any ASIN that the selling partner has a brand relationship with".
    - Its payload is `MarketplaceId`, `BrandName`, `Asin` and `AttributesChanged`, which names `item_name`, `bullet_point`, `product_description` and image locators.
    - "A selling partner has a brand relationship with an ASIN, as defined in the Amazon Registered Brands program, when they are a verified brand owner." It is sent "for items listed in any Amazon store".
    - For image attributes it signals that "*at least one* image changed".
    - It carries no old or new value and no actor. It is delivered by the Amazon EventBridge workflow.
    - `ITEM_PRODUCT_TYPE_CHANGE` covers a product type change on brand items.

    [official] (Notification Type Values, as above)

35. **What Amazon keeps of a change** (the RULE as found, with a gap).
    - A write returns a `submissionId`.
    - `getListingsItem` returns only "the latest data provided", with no history.
    - Feed processing reports cover a feed.
    - Seller Central shows "View Change History" for AI-applied changes.
    - No page read describes an API that returns a listing's earlier attribute values, or who changed a value.
    - A change log that needs before, after and actor must keep them itself, and must re-read the Catalog to see what actually shows.

    [official] (listingsItems_2021-08-01.json, as above; Listings Items API, as above; "Engage With Amazon…", as above; Notification Type Values, as above)

### G. Deleting a listing, and what a delete takes with it (gap fill)

Variation restructuring and product-type fixes are often done by deleting a listing and re-creating it. This section records what Amazon says a delete does, and what it leaves out.

36. **RULE: the operation, and what it lacks.**
    - `deleteListingsItem` is `DELETE /listings/2021-08-01/items/{sellerId}/{sku}`. Its model description is only "Delete a listings item for a selling partner." The rate is 5 per second, burst 5.
    - It takes four parameters: `sellerId`, `sku`, `marketplaceIds` and `issueLocale`. `marketplaceIds` has `maxItems: 1`, the same as `putListingsItem`.
    - There is no `mode` parameter, so a delete cannot be sent as `VALIDATION_PREVIEW`. There is no `includedData` either.
    - A 200 means "Successfully understood the listings item delete request. Refer to the response to determine whether the submission has been accepted." The body is the same `ListingsItemSubmissionResponse` as a write: `sku`, `status`, `submissionId`, `issues`.
    - Roles: the Listings Items API page lists either "Inventory and Order Tracking" or "Product Listing" for `deleteListingsItem`.
    - Amazon's tutorial "Delete a listing" says nothing beyond "Call the `deleteListingsItem` operation to delete a listing." None of the developer pages read says what a delete removes besides the listing.
    - In a feed, a `DELETE` message carries only `messageId`, `sku` and `operationType`. The schema says "`requirements`, `attributes`, `productType`, and `patches` are not applicable to `DELETE` operations."
    - `LISTINGS_ITEM_STATUS_CHANGE` is published "upon the creation or deletion of a listing item".

    [official] (listingsItems_2021-08-01.json, as above; deleteListingsItem, https://developer-docs.amazon.com/sp-api/reference/deletelistingsitem, read 2026-10-14; Delete a listing, https://developer-docs.amazon.com/sp-api/docs/delete-a-listing, read 2026-10-14; Listings Items API, as above; listings-feed-schema-v2.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/schemas/feeds/listings-feed-schema-v2.json, read 2026-10-14; Listings APIs FAQ, as above)

37. **RULE: a delete removes relationships, and that is the only documented way to unlink.**
    - The workflows guide says:
      - "To remove a parent-child relationship for a listing item, delete the parent or child listing."
      - "When you delete a parent listing, the relationships between the parent and all of its child listings are removed. When you delete a child listing, only the relationship between that particular child listing and its parent is removed."
      - "the statuses of any remaining listings are not impacted. For example, if a listing was purchasable before you delete the relationship, it remains purchasable after you delete the relationship."
      - "You must remove a child listing from its current parent-child relationship before you relate it to a new parent."
    - The Seller Central FAQ adds what a seller's delete does **not** remove. A delete by inventory file "only removes your contribution (your offer) from the ASIN. If other sellers are also contributing to that ASIN and the variation family, the child ASIN will continue to exist in the family on the product detail page." Full removal of a child from a family goes through Selling Partner Support, which "will approve your request only if they confirm the child ASIN is incorrect for the variation family".
    - Neither page says whether deleting a parent in one store removes relationships in the seller's other stores. The API delete takes exactly one `marketplaceIds` value (item 36).

    [official] (Building Listings Management Workflows Guide, as above; Variation relationship FAQ, G201951410 v16, https://sellercentral.amazon.com/help/hub/reference/external/G201951410, read 2026-10-14)

38. **RULE (Seller Central): a delete is permanent, and the same listing waits 24 hours.** From "Stop selling a product" (G200216110 v9):
    - On closing a listing: "When you close a listing, your product will no longer be available for sale on Amazon, but you will retain your sales history. You can relist the product at any time." Also: "Your listing should appear as Inactive within 24 hours."
    - On deleting: "Important: Deleting a listing is permanent. If you want to offer the listing again, you must wait 24 hours before you can add it."
    - On offers left live: "If the inventory is not updated to zero (0), the offer will remain live on the All-Offers Display since SKU deletion and inventory quantity deletion are separate operations."
    - The page contrasts close (sales history retained) with delete (permanent). It does not list what a delete loses.
    - It is a Seller Central page. Whether the 24-hour wait and the separate quantity operation apply in the same way to `deleteListingsItem` is not stated on any developer page read (Open questions 10 and 12).

    [official] (Stop selling a product, G200216110 v9, https://sellercentral.amazon.com/help/hub/reference/external/G200216110, read 2026-10-14)

39. **RULE: FBA stock is tied to the SKU and the ASIN, so a delete strands it.** "Resolve stranded inventory issues" (GEYJTVJPWRYUTADQ v22) has a table of stranded reasons, each with Amazon's resolution:
    - Deleted listing: "This listing has been deleted. To activate an offer, select Create a new listing."
    - Discontinued listing: "To resolve this issue, click Create a new listing and create a listing with the same ASIN and SKU as your FBA inventory."
    - Missing SKU: "Your inventory is stranded because the FBA and Manage inventory SKUs or ASINs for this listing do not match." The repair is a new listing, then Change to FBA. The page warns: "It might take a few minutes between steps and up to 24 hours for the listing to be fully updated."
    - "Automatic relist" relists stock "stranded for seven days" under two reasons, "Listing closed" and "Item discontinued". It "can be set to relist in as little as two days". A deleted listing is not one of the two.
    - Pan-European FBA (UK layer, G201855460 v14) adds: "your Pan-European FBA inventory is treated as a single inventory pool that is sellable in all Amazon EU stores (provided that all offers are listed against the same SKU)".
    - The Sell Globally FAQ (GNFDSYQP7TR7SPUW v1) says the same: "List your FBA products with the same SKU in all required Amazon EU stores".
    - So re-creating an FBA listing under a new SKU leaves the stock stranded. Deleting the SKU in one EU store breaks the pool's condition for that store.

    [official] (Resolve stranded inventory issues, GEYJTVJPWRYUTADQ v22, https://sellercentral.amazon.com/help/hub/reference/external/GEYJTVJPWRYUTADQ, read 2026-10-14; Pan-European FBA: How it Works, G201855460 v14 (Published/GB), https://sellercentral.amazon.co.uk/help/hub/reference/external/G201855460, read 2026-10-14; Sell Globally experience FAQ, GNFDSYQP7TR7SPUW v1, https://sellercentral.amazon.com/help/hub/reference/external/GNFDSYQP7TR7SPUW, read 2026-10-14)

40. **RULE: a SKU's identity cannot be edited, which is why sellers delete.** From the troubleshooting page:
    - 4005013: "A SKU is an un-editable attribute; after the item is created, it cannot be changed." The row's text speaks of a vendor.
    - 4005038: "The product ID you provided differs from one that you previously provided for the same SKU. Provide the original product ID."
    - 4005012: "A single vendor code + SKU can be assigned to only one ASIN."

    For a wrong product type, Amazon's documented path is not a delete. Warning 18367 ("Product type modified by Amazon", GXMA2QU3JZTG8JNL v1) arises "when Amazon categorizes your product under a different product type based on the attributes that you had provided". The page's resolution is to "choose the product type suggested by Amazon and resubmit the SKU", or else to make the title, description and bullets match the product "and resubmit the SKU".

    [official] (Listings Items API Issues Troubleshooting, as above; Warning code 18367: Product type modified by Amazon, GXMA2QU3JZTG8JNL v1, https://sellercentral.amazon.com/help/hub/reference/external/GXMA2QU3JZTG8JNL, read 2026-10-14)

41. **RULE: rank, history and reviews are kept on the ASIN.**
    - Sales Rank FAQ (G202059240 v2):
      - "Sales rank is calculated based on all-time sales of an ASIN/Product where recent sales are weighted more than older sales."
      - On variations: "In some stores, we add up all the sales for a child ASIN and apply it to the parent ASIN … In other stores, we count the orders for each child ASIN separately".
      - "it can take up to 12 hours for an order to show the sales rank."
    - Variation relationship FAQ: "Existing ASINs may already have sales history and reviews … Using existing ASINs preserves this history and improves search relevancy." Also: "In most cases, variation families and reviews merge onto a single detail page in under 15 minutes."
    - No Amazon page read says in so many words that "reviews stay when a SKU is deleted". The pages tie rank, history and reviews to the ASIN, and a SKU delete does not delete the ASIN.
    - The seller's own per-SKU figures are keyed differently. In the Sales and Traffic report schema, the `sku` field is "only present when ASIN aggregation is SKU". [seat] A listing re-created under a new SKU therefore starts a new row in that view.

    [official] (Sales Rank FAQ, G202059240 v2, https://sellercentral.amazon.com/help/hub/reference/external/G202059240, read 2026-10-14; Variation relationship FAQ, as above; sellerSalesAndTrafficReport.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/schemas/reports/sellerSalesAndTrafficReport.json, read 2026-10-14)

42. **Amazon staff on re-using a SKU** (staff forum posts; relative dates only).
    - Michelle_Amazon, about two years ago, answering a seller who could not relist because "the GTIN is a match for the deleted listing":
      - "Delete both your offers and item data contributions."
      - "Enter an "x" in the add-delete field in your Inventory Loader file."
      - "This will completely remove all data associated with your SKU."
      - "allow at least a few hours before you try to relist it".
    - Glenn_Amazon, about four years ago, on the error "Sku cannot be reused for an active offer unless it's deleted and re-created again": "Sometimes, even after being deleted some of the SKU data may be retained." Deleting and relisting "via upload in many cases it resolves this issue."
    - These posts show two kinds of delete in Seller Central: an offer delete, and a delete of offer plus item data. The developer pages do not say which of the two `deleteListingsItem` performs (Open question 10).

    [official, staff forum post] (Seller Forums, "Can't Relist Deleted Products", https://sellercentral.amazon.com/seller-forums/discussions/t/da540c46-c91e-46f9-bc9d-68d3b6dff6b9, read 2026-10-14; Seller Forums, "Help with Error Message: Sku cannot be reused for an active offer unless it's deleted and re-created again", https://sellercentral.amazon.com/seller-forums/discussions/t/c6a77b67-699d-4054-a54f-437b807616ce, read 2026-10-14)

### H. The bulk and asynchronous path: Feeds API v2021-06-30 and `JSON_LISTINGS_FEED` (gap fill)

43. **RULE: the sequence.** Amazon's "Submit a feed" tutorial, the Feeds model and the workflows guide's diagram agree on these steps.
    1. `createFeedDocument` with a body of `{contentType}`.
       - It returns `feedDocumentId` and `url`. The url is "The presigned URL for uploading the feed contents. This URL expires after 5 minutes."
       - The tutorial adds: "This `feedDocumentId` value expires after two days."
    2. Upload the document by HTTP PUT to that url.
       - "The contentType must match the input provided to the createFeedDocument operation."
       - The tutorial's Java sample for a JSON feed builds the upload type as `application/json; charset=` plus UTF-8, and says the type "may be different depending on your chosen feedType". The sample listings application uses the constant `application/json` for both calls.
       - No page read states a required content type for `JSON_LISTINGS_FEED`.
    3. `createFeed` with `{feedType: "JSON_LISTINGS_FEED", marketplaceIds, inputFeedDocumentId}`.
       - The model allows 1 to 25 `marketplaceIds`, but see item 48. It returns `feedId`.
    4. `getFeed`, polled "until the feed moves into one of the following terminal states: `DONE`, `CANCELLED`, or `FATAL`".
       - The enum adds `IN_QUEUE` and `IN_PROGRESS`.
       - A `DONE` feed carries `resultFeedDocumentId`.
       - "The `getFeed` operation only serves information for feed requests that were created within the last 28 days."
       - The guide's diagram listens for `FEED_PROCESSING_FINISHED` instead of polling.
    5. `getFeedDocument` on the result id. It returns a `url` ("expires after 5 minutes") and, if compressed, `compressionAlgorithm` `GZIP`.
    6. Download and decompress the processing report. Amazon adds: "Unencrypted feed processing report content should never be stored on disk, even temporarily".

    Other terminal states:
    - `FATAL`: "Some, none, or all of the operations within the feed might have completed successfully. In some (but not all) cases Amazon generates a feed processing report", possibly "in a different format".
    - `cancelFeed`: "Only feeds with `processingStatus=IN_QUEUE` can be cancelled."

    [official] (Submit a feed, https://developer-docs.amazon.com/sp-api/docs/submit-a-feed, read 2026-10-14; feeds_2021-06-30.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/feeds-api-model/feeds_2021-06-30.json, read 2026-10-14; Building Listings Management Workflows Guide, as above; selling-partner-api-samples `use-cases/listings/app/api/feeds/route.ts` and `app/constants/global.ts`, https://github.com/amzn/selling-partner-api-samples/tree/main/use-cases/listings, read 2026-10-14)

44. **RULE: limits.** Figures as stated on 2026-10-14. The live rate is in the `x-amzn-RateLimit-Limit` header, "if available".
    - Feeds API Rate Limits, per account-application pair:

      | Operation | Rate (per second) | Burst |
      |---|---|---|
      | `createFeed` | 0.0083 | 15 |
      | `createFeedDocument` | 0.5 | 15 |
      | `getFeed` | 2 | 15 |
      | `getFeedDocument` | 0.0222 | 10 |
      | `getFeeds` | 0.0222 | 10 |
      | `cancelFeed` | 2 | 15 |

    - For `JSON_LISTINGS_FEED`, the same page states "Limit of 5 feeds submission per account per 5 minutes" and "Limit of 25,000 records per feed submission". The feed schema sets `messages` `maxItems: 25000`.
    - Feeds API Best Practices:
      - "Keep file size less than 10 MiB".
      - "Upload one feed of the same type no more than once every 20 minutes."
      - "Avoid submitting a lot of feeds with only a few records in each feed."
      - "Under high load conditions it is not uncommon for feeds to take up to eight hours to process."
    - The crossover between the two routes is Amazon's: "The suggested minimum feed size is 1,500 items; using the Listings Items API directly is faster with less than 1,500 items during a five-minute period" (item 14). The task brief's "more than a few hundred SKUs" is not Amazon's figure.

    [official] (Feeds API Rate Limits, https://developer-docs.amazon.com/sp-api/docs/feeds-api-rate-limits, read 2026-10-14; Feeds API Best Practices, https://developer-docs.amazon.com/sp-api/docs/feeds-api-best-practices, read 2026-10-14; listings-feed-schema-v2.json, as above; Building Listings Management Workflows Guide, as above)

45. **RULE: a feed message is a Listings Items submission.**
    - The guide: "`JSON_LISTINGS_FEED` feed type is contractually compatible with the Listings Items API and attributes in feed messages follow the same product type definition schemas that the `getDefinitionsProductType` operation provides. These feeds enqueue your data and invoke the Listings Items API on your behalf."
    - Schema `Selling Partner Listings Feed (v2)`, header: `sellerId`, `version` (const `"2.0"`), `issueLocale`, and an optional `report` of `{includedData, apiVersion: "2021-08-01"}`.
    - Each message has `messageId` (1 to 2147483647, "unique within this feed submission"), `sku`, `operationType`, `productType`, `requirements`, `attributes` and `patches`.
    - The operation types, in the schema's words:
      - `UPDATE`: "the full set of item attributes are provided and any existing attributes data will be replaced with the provided attributes". This matches put.
      - `PARTIAL_UPDATE`: "only the provided item attributes will be updated"; it "is equivalent to using "PATCH" with the "replace" op".
      - `PATCH`: "the provided JSON Patch operations will be used to update the applicable attributes", with the same op enum as the API: `add`, `replace`, `merge`, `delete`.
      - `DELETE`: "the listings item will be deleted".
    - The schema's `oneOf` makes `productType` plus `attributes` required for `UPDATE` and `PARTIAL_UPDATE`, and `productType` plus `patches` for `PATCH`.
    - The feed schema has no `mode` field. A feed cannot be sent as a validation preview.
    - Listings Feed Type Values names the role (Product Listing) and the availability (Sellers, Vendors).

    [official] (Building Listings Management Workflows Guide, as above; listings-feed-schema-v2.json, as above; Listings Feed Type Values, as above)

46. **RULE: the processing report says, per message, what was accepted and what Amazon now holds.** Schema `Selling Partner JSON Listings Feed Processing Report (v2)`:
    - `header` carries `feedId`.
    - `issues[]` carries `messageId`, `sku`, `code`, `severity` (`ERROR` / `WARNING` / `INFO`), `message` and `attributeName`.
      - `messageId` is "Not provided if the error is not related to a message (e.g. feed formatting issue)".
      - `sku` was added in the December 3, 2025 release notes, "to map issues back to the input in a more convenient way".
    - `summary` holds `errors`, `warnings`, `messagesProcessed`, `messagesAccepted` and `messagesInvalid`:
      - `messagesAccepted`: "accepted, the associated updates are being applied";
      - `messagesInvalid`: "invalid, the associated updates will not be applied".
    - `items[]` is present when the header asked for `includedData` (`summaries`, `attributes`, `issues`, `offers`, `fulfillmentAvailability`, `procurement`, `relationships`, `productTypes`). It holds "the listings items output from the Selling Partner Listings Items API with the "includedData" elements from the request".
    - The guide: "the feed processing report contains a list of issues that prevent the acceptance of the submissions and a list of issues that occur after the acceptance of submissions."
    - Since the February 23, 2026 release notes, the feed status changes to `DONE` "only after all processing is complete"; "Processing times remain unchanged." The guide adds that "a feed with only a few records can still take several hours" (item 14).
    - An accepted message is in the same state as an `ACCEPTED` response: being applied, not shown. The Catalog read-back of section E still decides what the shopper sees.

    [official] (listings-feed-processing-report-schema-v2.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/schemas/feeds/listings-feed-processing-report-schema-v2.json, read 2026-10-14; SP-API Release Notes, December 3, 2025 and February 23, 2026 entries, as above; Building Listings Management Workflows Guide, as above)

47. **RULE: the legacy XML and flat-file feeds are gone from the API, but not from Seller Central.**
    - The pages for Submit a feed, Listings Feed Type Values, Feeds API Best Practices and Listings Management Workflow Migration all say: "Starting July 31, 2025, the Feeds API no longer supports legacy XML and flat file listing feeds, including pricing, inventory, relationships, and images. Developers will receive fatal `processingStatus` in the `getFeed` API response for these feeds."
    - The deprecation announcement (no date shown on the page) gave March 31, 2025. The release notes of June 25, 2025 moved the removal "from June 30, 2025 to July 31, 2025".
    - The removed types include `POST_PRODUCT_DATA`, `POST_INVENTORY_AVAILABILITY_DATA`, `POST_PRODUCT_OVERRIDES_DATA`, `POST_PRODUCT_PRICING_DATA`, `POST_PRODUCT_IMAGE_DATA`, `POST_PRODUCT_RELATIONSHIP_DATA`, `POST_FLAT_FILE_INVLOADER_DATA`, `POST_FLAT_FILE_LISTINGS_DATA`, `POST_FLAT_FILE_BOOKLOADER_DATA`, `POST_FLAT_FILE_CONVERGENCE_LISTINGS_DATA`, `POST_FLAT_FILE_PRICEANDQUANTITYONLY_UPDATE_DATA` and `POST_UIEE_BOOKLOADER_DATA`.
    - The announcement also says: "This deprecation does not impact any listings feeds submitted by sellers directly through Seller Central." The Category Listings Report and inventory-file uploads of item 32 therefore remain the seller's own routes.
    - Feeds API Best Practices still carries advice about `POST_PRODUCT_DATA` ordering, written for the removed types.

    [official] (Submit a feed, as above; Listings Feed Type Values, as above; Feeds API Best Practices, as above; Listings Management Workflow Migration, https://developer-docs.amazon.com/sp-api/docs/listings-management-workflow-migration, read 2026-10-14; Deprecation of Feeds API support for XML and Flat File Listings Feeds, https://developer-docs.amazon.com/sp-api/changelog/deprecation-of-feeds-api-support-for-xml-and-flat-file-listings-feeds, read 2026-10-14; SP-API Release Notes, June 25, 2025 entry, as above)

48. **Amazon pages disagree on one feed for several stores, recorded as found.**
    - The FAQ: "No. The `JSON_LISTINGS_FEED` and Listings Items API v2021-08-01 supports a single Amazon store per feed."
    - Submit a feed: "The JSON Listings Feed (`JSON_LISTINGS_FEED`) only supports a single Amazon store per feed. When using the `JSON_LISTINGS_FEED`, you must send a feed for each Amazon store."
    - "Update prices for multiple Amazon stores" shows one `JSON_LISTINGS_FEED` that patches `purchasable_offer` for "US, Canada, and Amazon Mexico stores in a single feed". Its table gives:
      - `PATCH`: "Supports only `purchasable_offer` attributes. Fails for `nonpurchasable_offer` attributes".
      - `DELETE`: "Supported across multiple Amazon stores".
      - `UPDATE` and `PARTIAL_UPDATE`: "Returns a feed-level error if attempted with multiple Amazon stores".
    - The same page says: "Multi-Amazon store functionality supports only `PATCH` operations within the same region". This is about the API patch.
    - Read together: content attributes (title, bullets, description, keywords) go one store per feed. Only the offer price and the delete have a multi-store form.

    [official] (Listings APIs FAQ, as above; Submit a feed, as above; Update prices for multiple Amazon stores, https://developer-docs.amazon.com/sp-api/docs/update-price-for-multiple-amazon-stores, read 2026-10-14)

### I. Stores and languages (gap fill)

The sibling file `research/angles/marketplaces-and-languages.md` covers this ground more widely: store rules, title layers by store, BIL's status report and the Canadian practice. This section keeps what a write needs.

49. **RULE: text values carry `language_tag` and `marketplace_id`, under these exact keys.**
    - The modular-titles page prints the schema for `title_differentiation`:
      - `"selectors": ["marketplace_id", "language_tag"]`;
      - items `"required": ["language_tag", "value"]`;
      - `language_tag` as `{"$ref": "#/$defs/language_tag"}` and `marketplace_id` as `{"$ref": "#/$defs/marketplace_id"}`;
      - `"additionalProperties": false`.
    - [seat] Under that schema, a value written as `{"value": …, "languageTag": "en-US"}` fails twice: the required `language_tag` is missing, and `languageTag` is a property the schema does not allow.
    - The allowed tags are not printed on the page. They live in the product type schema's `$defs`, fetched per store.
    - The `locale` parameter of `getDefinitionsProductType` is a different thing: "Locale for retrieving display labels and other presentation details". Its enum uses underscores (`en_US`, `de_DE`, `fr_CA` …). It is not the tag a write carries.
    - Amazon's own example on "Retrieve details about a listing" gives the Canada store's (`A2EUQ1WTGCTBG2`) text value `"language_tag": "en_US"`. A store's language tag is not something to derive from the store's country.

    [official] (Submit modular titles, as above; definitionsProductTypes_2020-09-01.json, as above; Retrieve details about a listing for single or multiple Amazon stores, as above)

50. **RULE: one store per write, except images.**
    - `putListingsItem` and `deleteListingsItem` take one `marketplaceIds` value.
    - `getDefinitionsProductType`: "This parameter is limited to one marketplaceId at this time."
    - The model sets no `maxItems` on patch. The only Amazon page read that shows a multi-store patch limits it to `purchasable_offer` within one region (item 48).
    - The FAQ: "the data for each ASIN differs by Amazon store because countries have different data requirements", and "because most attributes are localized text, the text can differ depending on the Amazon store or locale". Its advice: "Use the `marketplaceIds` filter in the Product Type Definitions API … to get the Amazon store-specific requirements".
    - Images are the exception: they "map images to ASINs at a global level where the ASIN exists, even if you specify the `marketplace_id` selector" (item 9).
    - So a title fix in a unified account is one write per store, each in that store's language and checked against that store's schema. The change log records each store as its own change.

    [official] (listingsItems_2021-08-01.json, as above; definitionsProductTypes_2020-09-01.json, as above; Listings APIs FAQ, as above; Update prices for multiple Amazon stores, as above)

51. **RULE (Seller Central): a listing is in the store's language.**
    - "Listing Creation for Global Accounts" (G201468480 v3): "Listings need to be in the language of the Amazon marketplace where you intend to sell. For example, to sell on Amazon.de or Amazon.jp, your product listings need to be in German or Japanese, respectively."
    - "Manage offers manually in Amazon Europe marketplaces" (G201394330 v2): the seller switches store with the drop-down and lists "through the Add Products tool, by uploading inventory files, or connecting your systems with Amazon Selling Partner API (Amazon SP-API)".
    - The Sell Globally FAQ names three ways to translate: "create and translate one product at a time, in bulk through inventory file templates or with Build International Listing tool".

    [official] (Listing Creation for Global Accounts, G201468480 v3, https://sellercentral.amazon.com/help/hub/reference/external/G201468480, read 2026-10-14; Manage offers manually in Amazon Europe marketplaces, G201394330 v2, https://sellercentral.amazon.com/help/hub/reference/external/G201394330, read 2026-10-14; Sell Globally experience FAQ, as above)

52. **RULE: Build International Listings (BIL) syncs offers and prices. Amazon does not say it overwrites target-store content.**
    - From "Build International Listings" (G202121570; US layer v14, GB layer v13):
      - The tool "helps you create and update offers from a single source store to one or more target stores".
      - It "Synchronizes the offer prices in target stores based on the price you set in the source store and your price rules".
      - It "Adds or deletes offers in the target stores when you make changes to eligible ASINs in the source store".
      - It "Attempts to translate and create product detail pages in a target store", with the note "Amazon does not guarantee the creation of a product detail page".
      - Among what it does not do: it does not "Remove offers in the target store when the offer becomes inactive in the source store".
      - It deletes connections that have not synced or sold "in the past 12 months" unless paused.
    - "Managing Offers in Europe" (G201394320 v2) describes BIL as a way "to quickly create listings in other marketplaces and automate pricing and product updates".
    - BIL price rules (G202121610 v10):
      - "If you make a manual change to your ASIN price in your target store or stores, the connection to your US price will be broken, and your prices must be set manually."
      - "A sale price in the source store will initiate a sale in the target store."
      - "It may take up to four hours before the price changes are reflected in each target store." After a settings change, "Processing and creation of offers may take up to 4 hours to complete" (G202121650 v7). For a new connection, "Processing and creating offers may take up to four hours to complete" (G202121580 v6).
    - An Amazon staff post (Julia_Amzn, EU forum, about a year ago): "Just make changes to your source store and Amazon will propagate them internationally."
    - **Finding:**
      - No Amazon page read says that BIL overwrites a title, bullet or description a seller edited in a target store.
      - For price, Amazon says the opposite: a manual target-store price change breaks the sync.
      - The premise that "BIL overwrites edits made in a target store" is unsourced for content and contradicted for price.
      - What is sourced: BIL and the staff post describe source-store changes propagating. A target-store reviewer must therefore check whether a change it sees was made in the source store.

    [official] (Build International Listings, G202121570 v14, https://sellercentral.amazon.com/help/hub/reference/external/G202121570, and v13 Published/GB, https://sellercentral.amazon.co.uk/help/hub/reference/external/G202121570, read 2026-10-14; Managing Offers in Europe, G201394320 v2, https://sellercentral.amazon.com/help/hub/reference/external/G201394320, read 2026-10-14; Build International Listings price rules, G202121610 v10, https://sellercentral.amazon.com/help/hub/reference/external/G202121610, read 2026-10-14; Edit target store settings, G202121650 v7, https://sellercentral.amazon.com/help/hub/reference/external/G202121650, read 2026-10-14; Create a connection using Build International Listings, G202121580 v6, https://sellercentral.amazon.com/help/hub/reference/external/G202121580, read 2026-10-14) [official, staff forum post] (Seller Forums EU, "Easily Translate Your Product Listings to Sell Globally", Julia_Amzn, https://sellercentral-europe.amazon.com/seller-forums/discussions/t/578b67b8-2d36-4f25-96a7-256fd4cec3ca, read 2026-10-14)

53. **RULE: Pan-European FBA makes the SKU, and the set of stores, part of the listing.** Pan-European FBA (UK layer, G201855460 v14):
    - It becomes active only after "You have created an active FBA offer in all of the Amazon European stores listed as required on Pan-European FBA inventory and enrol the ASIN in Pan-European FBA".
    - "Starting on 3 September 2026, all Pan‑EU FBA products (new and existing) must have an active Netherlands offer to enrol and to continue receiving Pan‑EU benefits." Also: "starting on 26 February 2027, all Pan‑EU FBA products must also have an active offer in Belgium at enrolment."
    - The pool needs the same SKU in every store (item 39).
    - A delete or a SKU change in one required EU store is therefore a Pan-EU change.

    [official] (Pan-European FBA: How it Works, as above)

## What practitioners add

- **Seller experience of AI titles.** Sellers in the Amazon threads report the following, from their own experience:
  - Error 100476 ("This attribute 'Item Highlight' is currently unsupported") on early submissions ("Engage With Amazon…").
  - Unanswered questions about who applies AI titles when several resellers share an ASIN, and how parent and child titles are treated ("Engage With Amazon…").
  - A dip in traffic of "about a 2 week" length after a title update, which the seller attributed to "the reindexing period" ("Answers to your product title update questions").
  - Amazon "putting the title and the highlight together in the title, and pulling out one or two random terms", from a seller who "changed my titles and highlights a week ago" ("New Titles Requirements and Fields").
  - "DO NOT update the parent ASIN with the new "Item Highlights" attribute." ("New Titles Requirements and Fields").

  These are single sellers' reports, unverified; the posters are anonymised seller accounts. [opinion] (Seller Forums replies in "Engage With Amazon…", "Answers to your product title update questions", and "New Titles Requirements and Fields", https://sellercentral.amazon.com/seller-forums/discussions/t/4c229291-c727-47a3-9090-b7eaa2d9f16e, all read 2026-10-14)

- **Large-catalog sellers on bulk support.** One seller with a catalogue in the thousands asked "Will Amazon release updated flat files that include an Item Highlights field?" and "Will API integrations support this attribute?", noting "manual updates through Seller Central are simply not practical". The page dates the post only as "4 months ago" (about June 2026). [opinion] (Seller Forums, "New Title Requirements", https://sellercentral.amazon.com/seller-forums/discussions/t/696cd2fe-6d48-4f04-b4a1-eea327eb95b6, read 2026-10-14)

- **SellerEngine.** Elena ("Amazon seller advocate, and content lead at SellerEngine"), "Amazon Product Title Update: What Sellers Need to Know in 2026", September 2, 2026, https://sellerengine.com/amazon-product-title-update-2026/. "Amazon says title and Item Highlights changes can take 24 to 48 hours to appear across Amazon stores". The article attributes the figure to Amazon without citing where Amazon said it, and does not name a channel (Seller Central, flat file or API). [opinion] (read 2026-10-14) Gap fill: Amazon's own title page (GYTR6SYGFA5E3EQC v21, item 29) gives the same 24 to 48 hours, so the figure is Amazon's and SellerEngine repeats it.

- **Sellers on delete and relist** (gap fill). These are seller replies in Seller Forums threads; the dates shown are relative.
  - "Is Deleting Listing then Re-listing it Bad?" (about four years ago):
    - "You should wait at least 24 hours before relisting the same SKU".
    - "You cannot delete ASINs."
  - "Deleting and relisting an ASIN" (EU forum, about five years ago).
    - The opening post relays what seller support told the poster: "Deleting and relisting the product with the exact SKU will not affect your existing FBA inventory (if any), ASIN sales history or reviews." This is support's answer as a seller reports it, not an Amazon page.
    - Other sellers in the thread replied:
      - "the reviews will remain on the catalogue";
      - "be sure to use the same SKU, or you will have stranded inventory";
      - "In my experience deleting and relisting a SKU does not resolve issues."
  - "Deleted my listings to relist after 24 hours, Do i need to put all the information again?": "You wouldn't have to put all the info in again, just make sure to use the same SKU."
  - "Proper way to delete a product listing?" (about eight years ago): "So, you can only delete your offers, you cannot delete a product page."

  Read with items 38, 39 and 41, these reports are consistent with Amazon's pages: same SKU and ASIN to keep the FBA link, a 24-hour wait, and reviews on the ASIN. None of them speaks of the API.

  [opinion] (Seller Forums, "Is Deleting Listing then Re-listing it Bad?", https://sellercentral.amazon.com/seller-forums/discussions/t/35cf67861eb42a306e4394599b77f842; Seller Forums EU, "Deleting and relisting an ASIN", https://sellercentral-europe.amazon.com/seller-forums/discussions/t/0cffdf3ad116f62be780342c5e71c6b9; Seller Forums, "Deleted my listings to relist after 24 hours, Do i need to put all the information again?", https://sellercentral.amazon.com/seller-forums/discussions/t/f8180b808d5ac5dc926a4498f2f201c9; Seller Forums, "Proper way to delete a product listing?", https://sellercentral.amazon.com/seller-forums/discussions/t/8c1ffd385c0002f10b731bccc1ec42dd; all read 2026-10-14)

- **Agency blogs on delete versus close** (gap fill).
  - Team4eCom, "A Quick Way To Delete & Close Your Amazon Listings!" (no date shown; by the firm's marketing team):
    - closing removes the product from the storefront, "however, the product remains in your inventory";
    - deleting "permanently removes the product from the storefront as well as the inventory".
  - Mir Waleed, "How to Delete an SKU from Amazon Like a Pro?", Scale Fortune, February 21, 2024:
    - "all relevant data, including product details, sales data, and SKU, is permanently removed from the seller account";
    - "The deleted listing cannot be reinstated."

  Both say what Seller Central's page says (close keeps history, delete is permanent). Neither cites a source, and neither speaks of reviews, rank or the API.

  [opinion] (Team4eCom, https://www.team4ecom.com/blog/deleting-or-closing-listings-on-amazon/, read 2026-10-14; Scale Fortune, https://www.scalefortune.com/how-to-delete-an-sku-from-amazon-like-a-pro/, read 2026-10-14)

- **A seller on BIL translations** (gap fill). Replies under Julia_Amzn's BIL post (item 52), about a year ago, both [opinion]:
  - "I spoke to amazon and they told me it was MY responsibility to ensure that THEIR translation was correct."
  - "How do I get control back over my listing translations?"

  These are single sellers' accounts. The second suggests that BIL's translated content is not simply editable in the target store, but it is a question, not a finding. (Seller Forums EU, "Easily Translate Your Product Listings to Sell Globally", as in item 52, read 2026-10-14)

- **EcomCrew.** Alexa Alix, "Amazon's Brand Elevation Program Puts Brands Ahead of Third-Party Sellers on Product Pages", last updated June 25, 2026, https://www.ecomcrew.com/?p=66850. The article says the program "prioritizes content submitted directly by participating brands". It is a secondary report, citing TipRanks; Amazon's primary page was not read. [opinion] (read 2026-10-14)

- **Marketplace Pulse.** Ben Donovan, "How Marketplace Sellers Are Using AI", https://www.marketplacepulse.com/articles/how-marketplace-sellers-are-using-ai, dated April 23, 2026 as shown. Listing optimisation is the leading AI use reported in its Seller Index survey (63.5%). [opinion] (read 2026-10-14)

No practitioner page read covered the API write path itself: preview, patch semantics or reconciliation. The gap fill found none on `deleteListingsItem` or on `JSON_LISTINGS_FEED` either.

## Published research

Two papers give background on why catalog attribute data is cleaned and consolidated rather than taken from one source as submitted. Neither describes Amazon's detail-page contribution or reconciliation rules, and neither tests a write path; they do not explain any specific Catalog-versus-Listings difference.

- **AutoKnow.** Xin Luna Dong, Xiang He, Andrey Kan, Xian Li, Yan Liang, Jun Ma, Yifan Ethan Xu, Chenwei Zhang et al. (22 authors in all, including Christos Faloutsos, Andrew McCallum and Jiawei Han), "AutoKnow: Self-Driving Knowledge Collection for Products of Thousands of Types", KDD 2020, arXiv:2006.13473 (https://arxiv.org/abs/2006.13473; Amazon Science page https://www.amazon.science/publications/autoknow-self-driving-knowledge-collection-for-products-of-thousands-of-types).
  - It describes an Amazon system for "taxonomy construction, product property identification, knowledge extraction, anomaly detection, and synonym discovery" over "sparsity and noise of structured data for products".
  - It was "operational in collecting product knowledge for over 11K product types".
  - [research] (read 2026-10-14, abstract only)

- **MAVE.** Li Yang, Qifan Wang, Zac Yu, Anand Kulkarni, Sumit Sanghai, Bin Shu, Jon Elsas and Bhargav Kanagal, "MAVE: A Product Dataset for Multi-source Attribute Value Extraction", WSDM 2022, arXiv:2112.08663 (https://arxiv.org/abs/2112.08663).
  - It is "a curated set of 2.2 million products from Amazon pages" with "3 million attribute-value annotations across 1257 unique categories".
  - Its abstract notes that product attribute values are "usually incomplete and vary over time". That is the paper's motivation, not a measured finding about Amazon's catalog.
  - It is a dataset paper on extraction from Amazon pages; the Amazon Science URL for it returned 404 and its authors' affiliation was not checked.
  - [research] (read 2026-10-14, abstract only)

Nothing else was found within this file's scope. No research on the effect of title length or reconciliation on sales was opened.

## Stable enough for a skill

These hold across schema versions. Where a figure matters, the skill should name the place it lives, not the figure.

- **Conformance.** Listings writes must conform to the product type's schema from `getDefinitionsProductType`. Limits, required attributes, enums, `editable`, image slots, and character-versus-byte limits live in that schema and change on the schedule Amazon publishes on SP-API Product Metadata Updates. Where Amazon's pages give a different figure (title length, search-terms bytes, image count), the schema read at run time decides the write.
- **Patch for edits.** Use patch for edits of existing listings. Put replaces product facts and drops what is omitted.
- **Whole attributes.** Patch works on whole top-level attributes. Delete needs the selector values. `merge` applies only to `fulfillment_availability` and `purchasable_offer`.
- **Preview.** `mode=VALIDATION_PREVIEW` runs production's synchronous checks without persisting. It is meant for testing a small number of listings, not for production workflows. Its rate is on the Listings Items API Rate Limits page and in the `x-amzn-RateLimit-Limit` header.
- **Status.** `ACCEPTED` means only "accepted for processing". Issues found later appear only on a fresh `getListingsItem` (or the notifications). The expected delay is FAQ prose, so the skill says "re-read after processing".
- **Two records.** Listings Items returns what the seller submitted; Catalog Items returns what Amazon reconciled. A difference between them is a finding, not an error in cx.
- **Precedence.** The brand owner's contribution has the highest precedence. Others' submissions may not show.
- **Images.** Image writes apply to the ASIN globally, whatever `marketplace_id` says.
- **Amazon writes too.** AI titles and Item Highlights are applied by Amazon, including on non-compliant listings the seller never updated. Brand owners get a review window in Review Listings Changes, and AI-applied changes show in View Change History. The length of the window is forum text, not an API value.
- **Brand-owner signal.** `BRANDED_ITEM_CONTENT_CHANGE` tells a brand owner which content attributes changed, without values.
- **Static sandbox.** It returns canned replies. It proves the request's shape and route, not the content. Amazon's sandbox page lists the Listings Items API as static-only.
- **Bulk.** `JSON_LISTINGS_FEED` is the bulk route. Amazon's crossover point is in the workflows guide.
- **Delete** (gap fill).
  - `deleteListingsItem` is per SKU, per store, with no preview.
  - Deleting a parent or child is the documented way to remove a relationship.
  - In Seller Central, a delete is "permanent" and the same listing waits before it can be added again; the wait is stated on Stop selling a product (G200216110), read at run time. Closing keeps sales history.
  - FBA stock stays linked only through the same SKU and ASIN. Pan-EU needs the same SKU in every required store.
  - Rank, history and reviews are kept on the ASIN.
- **The feed route** (gap fill).
  - The steps: `createFeedDocument`, then upload to the presigned URL with the same content type, then `createFeed`, then `getFeed` until `DONE` / `CANCELLED` / `FATAL`, then `getFeedDocument`, then the JSON processing report.
  - The report's per-message `issues` and `summary`, not the feed status, say which SKUs were accepted.
  - A feed message is a Listings Items submission in the same schema, with no preview mode.
  - Legacy XML and flat-file listing feeds no longer run through the API. Seller Central uploads are unaffected.
- **Stores and languages** (gap fill).
  - A text value carries `language_tag` and, where the schema lists it, `marketplace_id`. Each store's schema states the allowed tags.
  - Content writes are one store at a time, in that store's language.
  - Only `purchasable_offer` patches and deletes have a multi-store feed form.
  - BIL syncs offers and prices from a source store. A manual target-store price breaks the price sync.

## What cx must read at run time

The operations are named here. Report names and their options are door.md's, not this file's.

- **Product Type Definitions v2020-09-01 `getDefinitionsProductType`.**
  - Parameters: the product type, one `marketplaceIds`, `requirements` (`LISTING` or `LISTING_PRODUCT_ONLY`), `requirementsEnforced=NOT_ENFORCED` for a partial patch, `locale`, and `sellerId` for seller-specific values.
  - Then fetch the schema document at the returned `schema.link.resource` (valid seven days), and keep its `checksum`.
  - `searchDefinitionsProductTypes` applies when the product type is unknown.
- **Listings Items v2021-08-01 `getListingsItem`** on `{sellerId}/{sku}`.
  - Use `includedData=summaries,attributes,issues` before the write to capture "before".
  - Read it again after processing to capture issues and "after-submitted".
- **Listings Items v2021-08-01 `patchListingsItem`.**
  - First with `mode=VALIDATION_PREVIEW` for a small number of items.
  - Then without the mode for the real write.
  - Use `putListingsItem` only for a new listing or a deliberate full replacement.
  - Each response yields `status`, `submissionId` and `issues`.
- **Listings Items v2021-08-01 `searchListingsItems`**, to map an ASIN to the seller's SKUs before a write, and to sweep recent changes.
- **Catalog Items v2022-04-01 `getCatalogItem`** with `includedData=attributes,summaries,images` and the marketplace, to see what Amazon reconciled after the write. Search terms (`generic_keyword`) are not in the Catalog view; their read-back is `getListingsItem` with `includedData=attributes`.
- **Listings Restrictions `getListingsRestrictions`**, before writing a new offer on an ASIN.
- **Notifications** (if the door ever subscribes): `LISTINGS_ITEM_ISSUES_CHANGE`, `LISTINGS_ITEM_STATUS_CHANGE`, `BRANDED_ITEM_CONTENT_CHANGE`, `PRODUCT_TYPE_DEFINITIONS_CHANGE`.
- **Feeds.** `JSON_LISTINGS_FEED` through the Feeds API, for bulk work only. How the door carries a feed is door.md's.
  - Feeds v2021-06-30, in order (gap fill):
    - `createFeedDocument`, with the content type to be used for the upload;
    - the PUT to the returned `url`, within its 5 minutes;
    - `createFeed`, with one marketplace for any content operation;
    - `getFeed`, polled for `processingStatus` and `resultFeedDocumentId`;
    - `getFeedDocument` on that id, then the report's `issues` (by `messageId` and `sku`) and `summary`.
  - The header's `report.includedData` (for example `issues`, `attributes`) makes the report carry each item's state, saving a `getListingsItem` per SKU.
- **Before a delete** (gap fill):
  - `getListingsItem` with `includedData=summaries,attributes,issues,offers,fulfillmentAvailability,relationships`, to log what will go;
  - for a parent, `searchListingsItems` with `variationParentSku`, or `getCatalogItem` with `includedData=relationships`, to list the children whose relationships the delete removes;
  - whether the SKU has FBA stock (the Fix stranded inventory page in Seller Central; the report or API name is door.md's).
- **Per store** (gap fill):
  - the product type schema fetched for that store's `marketplaceIds`, and its `$defs.language_tag` and `$defs.marketplace_id`;
  - which stores the seller sells in (the Sellers API route is door.md's);
  - whether the store is a BIL target (a Seller Central screen; no API for BIL connections was found).

## Pages read

| Page name | URL | Date read | What it gave |
|---|---|---|---|
| Listings Items API | https://developer-docs.amazon.com/sp-api/docs/listings-items-api | 2026-10-14 | 1x1 vs feed, put drops omitted attributes, merge scope, sync-only issues, attributes = latest submitted |
| Manage Listings Issues | https://developer-docs.amazon.com/sp-api/docs/manage-listings-issues | 2026-10-14 | "must conform" wording, Accepted ≠ complete, preview box wording, code remapping, pricing preview |
| Listings APIs FAQ | https://developer-docs.amazon.com/sp-api/docs/listings-apis-faq | 2026-10-14 | Same checks without persisting, 1-5 min / 15-20 min, precedence, reconciled vs submitted, global images, monthly schema changes, timestamps |
| Submit modular titles | https://developer-docs.amazon.com/sp-api/docs/submit-modular-titles | 2026-10-14 | item_name / title_differentiation, accepted over 75, reconciliation, 100476, selector example, put-shaped PATCH example |
| Listings Items API Rate Limits | https://developer-docs.amazon.com/sp-api/docs/listings-items-api-rate-limits | 2026-10-14 | Per pair / per application, preview 20/s, product-data and relationship classes, 429 texts |
| Building Listings Management Workflows Guide | https://developer-docs.amazon.com/sp-api/docs/building-listings-management-workflows-guide | 2026-10-14 | Update steps, editable, put semantics for sellers, feed vs API table, backlog warning |
| Amazon Product Type Definitions Meta-Schema (v1) | https://developer-docs.amazon.com/sp-api/docs/product-type-definition-meta-schema | 2026-10-14 | editable, maxUtf8ByteLength, selectors, $lifecycle |
| Product Type Definitions API | https://developer-docs.amazon.com/sp-api/docs/product-type-definitions-api | 2026-10-14 | Latest by default; custom vocabulary recommended |
| Retrieve a Product Type Definition | https://developer-docs.amazon.com/sp-api/docs/retrieve-a-product-type-definition | 2026-10-14 | Links valid seven days, sellerId, meta schema names not web-resolvable |
| Partially update a listing | https://developer-docs.amazon.com/sp-api/docs/partially-update-a-listing | 2026-10-14 | Whole attributes only, delete by selector |
| Preview errors before partially updating a listing | https://developer-docs.amazon.com/sp-api/docs/preview-errors-before-partially-updating-a-listing | 2026-10-14 | Preview = mode parameter on patch |
| Create or fully update a listing | https://developer-docs.amazon.com/sp-api/docs/create-a-listing | 2026-10-14 | Put flow |
| Preview errors before creating or fully updating a listing | https://developer-docs.amazon.com/sp-api/docs/preview-errors-before-creating-a-listing | 2026-10-14 | Preview on put |
| Submit media attributes | https://developer-docs.amazon.com/sp-api/docs/submit-media | 2026-10-14 | Image attribute names, media_location, sources, Image Manager variants |
| Listings Items API Issues Troubleshooting | https://developer-docs.amazon.com/sp-api/docs/listings-items-api-issues-troubleshooting | 2026-10-14 | Issue codes, 90225 examples, PT roll-up, contribution wording |
| Retrieve details about a listing for single or multiple Amazon stores | https://developer-docs.amazon.com/sp-api/docs/retrieve-details-about-a-listing | 2026-10-14 | Attribute value shapes with language_tag / marketplace_id |
| Listings Feed Type Values | https://developer-docs.amazon.com/sp-api/docs/listings-feed-type-values | 2026-10-14 | JSON_LISTINGS_FEED, same format as Listings Items |
| Feeds API FAQ | https://developer-docs.amazon.com/sp-api/docs/feeds-api-faq | 2026-10-14 | 25,000-item feed limit |
| Selling Partner API Sandbox | https://developer-docs.amazon.com/sp-api/docs/sp-api-sandbox | 2026-10-14 | Static pattern matching, functionality not scalability, AI sandbox |
| Notification Type Values | https://developer-docs.amazon.com/sp-api/docs/notification-type-values | 2026-10-14 | BRANDED_ITEM_CONTENT_CHANGE payload, PT definitions change |
| Usage Plans and Rate Limits | https://developer-docs.amazon.com/sp-api/docs/usage-plans-and-rate-limits | 2026-10-14 | x-amzn-RateLimit-Limit header and its limits |
| SP-API Release Notes | https://developer-docs.amazon.com/sp-api/docs/sp-api-release-notes | 2026-10-14 | merge (2025-05-28), pricing preview, parentageLevel, feed DONE, generic_keyword removal from Catalog |
| SP-API Product Metadata Updates | https://developer-docs.amazon.com/sp-api/docs/sp-api-metadata-updates | 2026-10-14 | Monthly attribute changes table |
| SP-API Updates: Solution Provider Portal Agreement and Policy Updates, BR Store ShipperTrackingNumber Validation, and Listings Attribute and Enumeration Values Changes | https://developer-docs.amazon.com/sp-api/changelog/sp-api-updates-solution-provider-portal-agreement-and-policy-updates-br-store-shippertrackingnumber-validation-and-listings-attribute-and-enumeration-values-changes | 2026-10-14 | August 31, 2026 attribute update; AUP quality standard for submissions made on behalf of users |
| Catalog Items API | https://developer-docs.amazon.com/sp-api/docs/catalog-items-api | 2026-10-14 | Version 2022-04-01 current |
| Terminology | https://developer-docs.amazon.com/sp-api/docs/terminology | 2026-10-14 | Meta schema vocabulary |
| listingsItems_2021-08-01.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/listings-items-api-model/listingsItems_2021-08-01.json | 2026-10-14 | Ops enum, top-level only, status enum, issue shape, rate/burst, sandbox cases |
| definitionsProductTypes_2020-09-01.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/product-type-definitions-api-model/definitionsProductTypes_2020-09-01.json | 2026-10-14 | Parameters, requirementsEnforced wording, SchemaLink and checksum |
| catalogItems_2022-04-01.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/catalog-items-api-model/catalogItems_2022-04-01.json | 2026-10-14 | Attributes conform to PT definitions |
| listingsValidationPreview.ts (sample AI sandbox) | https://raw.githubusercontent.com/amzn/selling-partner-api-samples/main/local-ai-sandbox/src/operation/listingsValidationPreview.ts | 2026-10-14 | Put delegated to production preview |
| passThroughOperations.ts (sample AI sandbox) | https://raw.githubusercontent.com/amzn/selling-partner-api-samples/main/local-ai-sandbox/src/operation/passThroughOperations.ts | 2026-10-14 | Production and sandbox origins |
| Seller Forums: Updates to improve your product titles begin on July 27 | https://sellercentral.amazon.com/seller-forums/discussions/t/145b6d0f-999c-4555-896c-c694bda2e470 | 2026-10-14 | 75 rule, AI replacement, 14-day review |
| Seller Forums: Answers to your product title update questions | https://sellercentral.amazon.com/seller-forums/discussions/t/302aaac6-6f2b-4d86-bcd2-36fe24f0e6cd | 2026-10-14 | Rollout through 2026, search parity, display date, eight hours |
| Seller Forums: Engage With Amazon: Get your Product Title Update Questions Answered! | https://sellercentral.amazon.com/seller-forums/discussions/t/ac660707-60c7-43e3-a3fd-420d7321cc4e | 2026-10-14 | Enhance Listings, Review Listings Changes, View Change History; seller replies |
| Seller Forums: How can sellers download a pre-populated template for bulk title and Item Highlights updates? | https://sellercentral.amazon.com/seller-forums/discussions/t/cbcfa2a1-ecb3-4440-80a2-1f6ff93e907c | 2026-10-14 | Category Listings Report columns |
| Seller Forums: Update to how product detail page images are selected | https://sellercentral.amazon.com/seller-forums/discussions/t/9bf72c46-d413-404f-8e28-208ee75d54ee | 2026-10-14 | Brand owner images prioritised |
| Seller Forums: New Titles Requirements and Fields | https://sellercentral.amazon.com/seller-forums/discussions/t/4c229291-c727-47a3-9090-b7eaa2d9f16e | 2026-10-14 | Seller reports [opinion] |
| Seller Forums: New Title Requirements | https://sellercentral.amazon.com/seller-forums/discussions/t/696cd2fe-6d48-4f04-b4a1-eea327eb95b6 | 2026-10-14 | Bulk-support question [opinion] |
| Amazon launches generative AI to help sellers write product descriptions | https://www.aboutamazon.com/news/small-business/amazon-sellers-generative-ai-tool | 2026-10-14 | Generated content submitted to the catalog |
| How to create Amazon product listings - Sell on Amazon | https://sell.amazon.com/blog/amazon-product-listings | 2026-10-14 | Generative listing features |
| Amazon Brand Registry - Sell on Amazon | https://sell.amazon.com/brand-registry | 2026-10-14 | General; nothing decisive for writes |
| SellerEngine: Amazon Product Title Update: What Sellers Need to Know in 2026 | https://sellerengine.com/amazon-product-title-update-2026/ | 2026-10-14 | 24-48 hours, attributed to Amazon, channel not named [opinion] |
| EcomCrew: Amazon's Brand Elevation Program… | https://www.ecomcrew.com/?p=66850 | 2026-10-14 | Brand content priority, secondary [opinion] |
| Marketplace Pulse: How Marketplace Sellers Are Using AI | https://www.marketplacepulse.com/articles/how-marketplace-sellers-are-using-ai | 2026-10-14 | AI use survey [opinion] |
| AutoKnow (arXiv 2006.13473; Amazon Science page) | https://arxiv.org/abs/2006.13473 | 2026-10-14 | Catalog knowledge reconciliation [research] |
| MAVE (arXiv 2112.08663) | https://arxiv.org/abs/2112.08663 | 2026-10-14 | Attribute values incomplete and changing [research] |
| Seller Central help: Product title requirements and guidelines (GYTR6SYGFA5E3EQC) | https://sellercentral.amazon.com/help/hub/reference/external/GYTR6SYGFA5E3EQC | 2026-10-14 | Read as v21 (capture capture `GYTR6SYGFA5E3EQC-v21`): "must not exceed 75 characters", "might be automatically corrected or it might not appear in our search results", Amazon's own 24 to 48 hours |
| Seller Central help: Error code explanations (G17781) | https://sellercentral.amazon.com/help/hub/reference/external/G17781 | 2026-10-14 | Read as v13 (capture capture `G17781-v13`): errors appear in the processing report; 1000-character description example |
| Seller Central help: Product image guide (G1881) | https://sellercentral.amazon.com/help/hub/reference/external/G1881 | 2026-10-14 | Read as v28 (capture capture `G1881-v28`): variant codes to PT99; up to 24 hours to appear |
| Seller Central help: Use search terms effectively (G23501, US layer) | https://sellercentral.amazon.com/help/hub/reference/external/G23501 | 2026-10-14 | Read as v14 (capture capture `G23501-v14`): field stops at the byte limit; spaces and punctuation not counted |
| Seller Central help: Use search terms effectively (G23501, GB layer) | https://sellercentral.amazon.co.uk/help/hub/reference/external/G23501 | 2026-10-14 | Read as v9 (capture capture `G23501-v9-en-GB`), for the reconciliation only: spaces and punctuation not counted |
| Seller Central help: Suppressed listings (G200898440) | https://sellercentral.amazon.com/help/hub/reference/external/G200898440 | 2026-10-14 | Read as v13 (capture capture `G200898440-v13`), for the reconciliation only: 80 / 130 character suppression standard |
| Seller Central help: Review Listings Changes, Enhance Listings, detail page rules | sellercentral.amazon.com help | 2026-10-14 | Not looked for; no capture. (In the first pass this seat's WebFetch refused web.archive.org and an archive request answered 429; `help-page-access.md` A6 records that `curl` reads archive `id_` copies, so the archive was refused by the tool, not unreachable. No archive copy is cited here.) |
| Seller Central help: Add product images and video (G200216080) | https://sellercentral.amazon.com/help/hub/reference/external/G200216080 | 2026-10-14 | "Maximum 9 images", up to 24 hours (capture `G200216080-v15`) |
| Seller Central help: Keyword attributes explained (GF2C2L6RCFZGWBXC) | https://sellercentral.amazon.com/help/hub/reference/external/GF2C2L6RCFZGWBXC | 2026-10-14 | `generic_keywords` 249 bytes in the table, "less than 250 bytes", "completely ignored" (capture `GF2C2L6RCFZGWBXC-v4`) |
| Seller Central help: Stop selling a product (G200216110) | https://sellercentral.amazon.com/help/hub/reference/external/G200216110 | 2026-10-14 | Close keeps sales history; delete permanent; 24-hour wait; quantity separate (capture `G200216110-v9`) |
| Seller Central help: Resolve stranded inventory issues (GEYJTVJPWRYUTADQ) | https://sellercentral.amazon.com/help/hub/reference/external/GEYJTVJPWRYUTADQ | 2026-10-14 | Deleted listing, same ASIN and SKU, Missing SKU, automatic relist (capture `GEYJTVJPWRYUTADQ-v22`) |
| Seller Central help: Variation relationship FAQ (G201951410) | https://sellercentral.amazon.com/help/hub/reference/external/G201951410 | 2026-10-14 | Delete removes only the seller's contribution; history and reviews on existing ASINs (capture `G201951410-v16`, saved by help-page-access) |
| Seller Central help: Sales Rank FAQ (G202059240) | https://sellercentral.amazon.com/help/hub/reference/external/G202059240 | 2026-10-14 | Rank on all-time ASIN sales, variation roll-up differs by store, 12 hours (capture `G202059240-v2`) |
| Seller Central help: Warning code 18367: Product type modified by Amazon (GXMA2QU3JZTG8JNL) | https://sellercentral.amazon.com/help/hub/reference/external/GXMA2QU3JZTG8JNL | 2026-10-14 | Product-type fix by resubmitting, no delete (capture `GXMA2QU3JZTG8JNL-v1`) |
| Seller Central help: How can I delete or replace all my listings? (G201447780) | https://sellercentral.amazon.com/help/hub/reference/external/G201447780 | 2026-10-14 | not found: the content call answered HelpArticleNotFound |
| Seller Central help: Build International Listings (G202121570) | https://sellercentral.amazon.com/help/hub/reference/external/G202121570 (and the .co.uk host, GB layer) | 2026-10-14 | What BIL does and does not do, US v14 and GB v13 (capture `G202121570-v14`, `G202121570-v13-en-GB.txt`) |
| Seller Central help: Build International Listings price rules (G202121610) | https://sellercentral.amazon.com/help/hub/reference/external/G202121610 | 2026-10-14 | Manual target price breaks the sync; up to four hours (capture `G202121610-v10`) |
| Seller Central help: Edit target store settings (G202121650); Create a connection using Build International Listings (G202121580) | https://sellercentral.amazon.com/help/hub/reference/external/G202121650; https://sellercentral.amazon.com/help/hub/reference/external/G202121580 | 2026-10-14 | Up to four hours (capture `G202121650-v7`, `G202121580-v6.txt`) |
| Seller Central help: Managing Offers in Europe (G201394320); Manage offers manually in Amazon Europe marketplaces (G201394330) | https://sellercentral.amazon.com/help/hub/reference/external/G201394320; https://sellercentral.amazon.com/help/hub/reference/external/G201394330 | 2026-10-14 | BIL automates "pricing and product updates"; listing per store (capture `G201394320-v2`, `G201394330-v2.txt`) |
| Seller Central help: Listing Creation for Global Accounts (G201468480) | https://sellercentral.amazon.com/help/hub/reference/external/G201468480 | 2026-10-14 | Listings in the store's language (capture `G201468480-v3`) |
| Seller Central help: Sell Globally experience FAQ (GNFDSYQP7TR7SPUW) | https://sellercentral.amazon.com/help/hub/reference/external/GNFDSYQP7TR7SPUW | 2026-10-14 | Three ways to translate; Pan-EU same SKU (capture `GNFDSYQP7TR7SPUW-v1`) |
| Seller Central help: Pan-European FBA: How it Works (G201855460, GB layer) | https://sellercentral.amazon.co.uk/help/hub/reference/external/G201855460 | 2026-10-14 | Required stores, NL from 3 September 2026, BE from 26 February 2027, same-SKU pool (capture `G201855460-v14-en-GB`) |
| Seller Central help: Expand Offers Internationally (G200942970) | https://sellercentral.amazon.com/help/hub/reference/external/G200942970 | 2026-10-14 | Background only; not cited for a claim (capture `G200942970-v1`) |
| deleteListingsItem (reference) | https://developer-docs.amazon.com/sp-api/reference/deletelistingsitem | 2026-10-14 | Parameters, 200 wording, rate |
| Delete a listing | https://developer-docs.amazon.com/sp-api/docs/delete-a-listing | 2026-10-14 | Prerequisites and one call; no consequences stated |
| Submit a feed | https://developer-docs.amazon.com/sp-api/docs/submit-a-feed | 2026-10-14 | The six steps, two-day id, 28 days, FATAL wording, single store per feed, July 31, 2025 |
| Feeds API Rate Limits | https://developer-docs.amazon.com/sp-api/docs/feeds-api-rate-limits | 2026-10-14 | Rate table, 5 feeds per 5 minutes, 25,000 records |
| Feeds API Best Practices | https://developer-docs.amazon.com/sp-api/docs/feeds-api-best-practices | 2026-10-14 | 10 MiB, 20 minutes, few-record feeds, eight hours |
| Listings Management Workflow Migration | https://developer-docs.amazon.com/sp-api/docs/listings-management-workflow-migration | 2026-10-14 | July 31, 2025 note |
| Deprecation of Feeds API support for XML and Flat File Listings Feeds | https://developer-docs.amazon.com/sp-api/changelog/deprecation-of-feeds-api-support-for-xml-and-flat-file-listings-feeds | 2026-10-14 | Removed feed types; Seller Central uploads unaffected |
| Update prices for multiple Amazon stores | https://developer-docs.amazon.com/sp-api/docs/update-price-for-multiple-amazon-stores | 2026-10-14 | Multi-store `purchasable_offer` PATCH; feed operation table |
| feeds_2021-06-30.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/feeds-api-model/feeds_2021-06-30.json | 2026-10-14 | Operations, 5-minute URLs, status enum, 1-25 marketplaceIds, cancel only IN_QUEUE |
| listings-feed-schema-v2.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/schemas/feeds/listings-feed-schema-v2.json | 2026-10-14 | Header, 25,000 messages, operation types and their requirements |
| listings-feed-processing-report-schema-v2.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/schemas/feeds/listings-feed-processing-report-schema-v2.json | 2026-10-14 | issues, summary, items |
| sellerSalesAndTrafficReport.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/schemas/reports/sellerSalesAndTrafficReport.json | 2026-10-14 | `sku` present only at SKU aggregation |
| selling-partner-api-samples, use-cases/listings (feeds route, constants) | https://github.com/amzn/selling-partner-api-samples/tree/main/use-cases/listings | 2026-10-14 | `application/json` for document and upload |
| Seller Forums: Can't Relist Deleted Products | https://sellercentral.amazon.com/seller-forums/discussions/t/da540c46-c91e-46f9-bc9d-68d3b6dff6b9 | 2026-10-14 | Staff: offers versus item data contributions, a few hours [official, staff forum post] |
| Seller Forums: Help with Error Message: Sku cannot be reused for an active offer unless it's deleted and re-created again | https://sellercentral.amazon.com/seller-forums/discussions/t/c6a77b67-699d-4054-a54f-437b807616ce | 2026-10-14 | Staff: SKU data may be retained after a delete [official, staff forum post] |
| Seller Forums EU: Easily Translate Your Product Listings to Sell Globally | https://sellercentral-europe.amazon.com/seller-forums/discussions/t/578b67b8-2d36-4f25-96a7-256fd4cec3ca | 2026-10-14 | Staff: changes propagate from the source store; seller replies on translations |
| Seller Forums: Is Deleting Listing then Re-listing it Bad?; EU: Deleting and relisting an ASIN; Deleted my listings to relist after 24 hours, Do i need to put all the information again?; Proper way to delete a product listing? | as in What practitioners add | 2026-10-14 | Seller reports on delete and relist [opinion] |
| Team4eCom: A Quick Way To Delete & Close Your Amazon Listings! | https://www.team4ecom.com/blog/deleting-or-closing-listings-on-amazon/ | 2026-10-14 | Close versus delete [opinion] |
| Scale Fortune: How to Delete an SKU from Amazon Like a Pro? | https://www.scalefortune.com/how-to-delete-an-sku-from-amazon-like-a-pro/ | 2026-10-14 | Delete removes data, cannot be reinstated [opinion] |
| listings-feed-schema-v2 (docs page) | https://developer-docs.amazon.com/sp-api/docs/listings-feed-schema-v2 | 2026-10-14 | unreachable in `.md` form ("Page Not Found"); the GitHub schema file was read instead |
| Seller Central help: G201955360 | sellercentral.amazon.com, .co.uk and .de help | 2026-10-14 | not a page: no topic on the US, GB or DE layer |
| help.godatafeed.com | help.godatafeed.com | 2026-10-14 | unreachable: 403 |
| Amazon Science MAVE page | https://www.amazon.science/publications/mave-a-product-dataset-for-multi-source-attribute-value-extraction | 2026-10-14 | unreachable: 404 (the arXiv record was read instead) |

Internal, read for what the run did (not cited as Amazon):

- `office-mailbox/from-engineering/20261014-0921-beta-browser-listing-run-day-2.md`
- `office-mailbox/from-engineering/20261013-0904-beta-browser-listing-run-day-1.md`
- `ceo-office/drafts/2026-10-09-roadmap-candidates.md`
- the door's SKILL.md and door.md

## Open questions

1. Does `summaries.itemName` on `getListingsItem` show the submitted `item_name` or the catalog's reconciled name? The model describes it as the "Name, or title, associated with an Amazon catalog item". A first real write and read-back settles this.
2. How does the door fetch the schema document at `schema.link.resource`? It is a second host and possibly a presigned URL. Is that download inside the door's allowed origins, and does cx cache it by `checksum`?
3. `generic_keyword`: Amazon's pages give different figures, recorded as found.
   - The troubleshooting page's 90225 example: "generic_keyword : 500 bytes" (a write-limit example).
   - Keyword attributes explained (GF2C2L6RCFZGWBXC v4, capture read 2026-10-14): 249 in the table's "Length Limit (Bytes)" column, and "Search Terms (generic_keywords) should be less than 250 bytes long (read more). If it exceeds the limit, the attribute is completely ignored by Amazon Search."
   - Use search terms effectively (G23501 v14, US, capture read 2026-10-14): Seller Central's field "stops accepting inputs when the byte limit is reached", and "Amazon search does not count spaces or punctuation". It states no figure.
   - `research/elements/search-terms.md` records schema copies with `maxUtf8ByteLength` 250 for one store and 2000 (with `maxLength` 500) for others, and that Amazon's example validator counts the whole string, spaces included. A 2022 archived UK page said search counts spaces; the live UK page (G23501 v9, GB layer, capture capture `G23501-v9-en-GB`, read 2026-10-14) now says, like the US page, that "Amazon search does not count spaces or punctuation". The disagreement that remains is search's count against the schema validator's.
   - These are two kinds of limit (what a write accepts, what search indexes) and they differ by store. This file does not pick one. The binding write limit is `maxUtf8ByteLength` and `maxLength` on `generic_keyword` in the schema `getDefinitionsProductType` returns for that product type and store, read at run time; the indexing limit is read from that store's help page at review time.
   - What stays open is whether the API rejects a value over the help page's indexing figure or accepts it and search ignores it. Keyword attributes explained says search ignores the whole attribute; no developer page read says the write is rejected below the schema's limit.
4. Who applies AI titles on an ASIN shared by several resellers, and how are parent and child titles handled? Sellers asked; no Amazon answer was found on the pages read.
5. Does the 14-day review window in Review Listings Changes also cover non-title AI changes? The pages read speak of titles and Item Highlights only.
6. Is there any API that returns a listing's attribute history or the actor of a change? None was found. View Change History is a Seller Central screen.
7. Does `VALIDATION_PREVIEW` on patch apply product-type requirements as `ENFORCED`, or only to the patched attributes? The pages say "same checks" but do not say how required attributes are treated on a partial preview.
8. The 75-character figure. The forum says titles "will need to be" 75 or less; the developer page says longer ones are accepted. Will longer submissions ever turn from accepted into an issue?
9. Brand Elevation. Only a secondary report was read; Amazon's own page on it was not found.
10. (Gap fill) Does `deleteListingsItem` remove only the seller's offer, or also the seller's item data contributions? Seller Central has both kinds of delete (item 42). The developer pages say only "Delete a listings item". After an API delete, can the same SKU be re-created at once, or is it blocked by the Seller Central 24-hour wait, or by a GTIN still matching (item 38)? None of the pages read answers either question.
11. (Gap fill) When a parent is deleted in one store, are its relationships removed in the seller's other stores too? The delete takes one `marketplaceIds` value, and the guide speaks of "the relationships", without a store. Not answered by any page read.
12. (Gap fill) Does a `deleteListingsItem` on an FBA SKU with stock also need a separate quantity change, as the Seller Central page requires ("SKU deletion and inventory quantity deletion are separate operations")? Is the offer kept on the All-Offers Display until then? Not stated for the API.
13. (Gap fill) Does a SKU re-created under the same name continue its per-SKU history in the Sales and Traffic report (SKU granularity), or start again? Item 41 shows only that the report keys on the SKU there. No page says what happens across a delete.
14. (Gap fill) Does BIL overwrite a title, bullets or description that the seller edited directly in a target store? No Amazon page read says so. One staff post says changes in the source store propagate, and one seller asks how to "get control back" of translations. For price only, Amazon says a manual target-store change breaks the sync (item 52). A test in a real BIL account would settle it.
15. (Gap fill) Is a value whose `language_tag` is not in the store schema's `$defs.language_tag` enum rejected synchronously by preview, or accepted? Which tags does each store's schema allow? The modular-titles page does not print the enum. The sibling marketplaces file saw a third-party copy only. Fetching one schema per target store settles it.
16. (Gap fill) Amazon's pages disagree on whether one `JSON_LISTINGS_FEED` can cover several stores (item 48). The newer, specific page allows `PATCH` of `purchasable_offer` and `DELETE` across stores in one region. The FAQ and Submit a feed say one store per feed, without exceptions. Until a feed with two `marketplaceIds` is seen to work, the single-store rule is the safe reading for content.

## Positions

- **P-listing-writes-1.** Before proposing or sending a write, cx reads the product type's schema with `getDefinitionsProductType` (and the linked schema document), and takes every limit, required attribute, enum, `editable` flag and selector from it rather than from memory. Sources: Manage Listings Issues; Building Listings Management Workflows Guide; Submit modular titles; Listings APIs FAQ.
- **P-listing-writes-2.** A length limit is counted in the unit the schema keyword names: characters for `maxLength`, UTF-8 bytes for `maxUtf8ByteLength`. Sources: Amazon Product Type Definitions Meta-Schema (v1).
- **P-listing-writes-3.** Edits to an existing listing go through `patchListingsItem` as whole top-level attributes, with their selector values. `putListingsItem` is used only for a new listing or a deliberate full replacement, because put drops omitted product facts. Sources: listingsItems_2021-08-01.json; Partially update a listing; Listings Items API; Building Listings Management Workflows Guide.
- **P-listing-writes-4.** Attribute values are written in Amazon's shape: an array of objects with `value` and the schema's selectors, for example `language_tag` like `en_US` and `marketplace_id`. Images use their named locator attributes with `media_location`. Sources: Retrieve details about a listing; Submit modular titles; Submit media attributes.
- **P-listing-writes-5.** `mode=VALIDATION_PREVIEW` is used to check a small number of proposed writes against production's synchronous checks without persisting them. It is not used as a production workflow. Sources: Listings APIs FAQ; Manage Listings Issues; Listings Items API Rate Limits.
- **P-listing-writes-6.** A write is reported as accepted for processing, never as done, on `ACCEPTED`. cx re-reads `getListingsItem` issues after processing before saying the change took. Sources: Manage Listings Issues; Listings Items API; Listings APIs FAQ; Listings Items API Issues Troubleshooting.
- **P-listing-writes-7.** After a write, cx compares the Catalog Items view with the submitted values. Where they differ (reconciliation, title splitting, another contributor's precedence), it presents the difference as what the shopper sees. Sources: Listings APIs FAQ; Submit modular titles; catalogItems_2022-04-01.json.
- **P-listing-writes-8.** The change log records for every write:
  - the before values;
  - the submitted values;
  - the operation;
  - the `submissionId`, `status` and issues;
  - the later Catalog view.

  No page read describes an API that returns attribute history or the actor of a change. Sources: listingsItems_2021-08-01.json; Listings Items API; Notification Type Values.
- **P-listing-writes-9.** cx tells the seller that Amazon may change titles, Item Highlights and other content itself. For brand owners, it points to Review Listings Changes and View Change History, since a value cx wrote may not stay. Sources: Seller Forums "Updates to improve your product titles begin on July 27"; "Engage With Amazon…"; "Answers to your product title update questions"; Notification Type Values.
- **P-listing-writes-10.** cx warns before an image write that it applies to the ASIN in every store where it exists, whatever `marketplace_id` is given. Sources: Listings APIs FAQ.
- **P-listing-writes-11.** A static-sandbox answer is reported only as proof of a request's shape and route, never of the content's validity, because its replies are canned. Sources: Selling Partner API Sandbox; listingsItems_2021-08-01.json.
- **P-listing-writes-12.** `JSON_LISTINGS_FEED` is proposed only for bulk work above the crossover the workflows guide states. Edits to a few items go through the Listings Items API. Sources: Building Listings Management Workflows Guide; Listings Items API.
- **P-listing-writes-13.** For titles in non-media product types, cx proposes `item_name` within the schema's limit plus `title_differentiation`. It warns that a longer `item_name` is accepted but may be reconciled, split, or replaced by an AI recommendation. Sources: Submit modular titles; Seller Forums "Updates to improve your product titles begin on July 27".
- **P-listing-writes-14.** cx does not resend unchanged data. Amazon says duplicate submissions lengthen processing. Sources: Building Listings Management Workflows Guide.
- **P-listing-writes-15.** A product type schema cx has fetched may be reused, but is re-fetched when the product type definitions change. Sources: Building Listings Management Workflows Guide (the caching note under step 3); Notification Type Values; definitionsProductTypes_2020-09-01.json (`checksum`).
- **P-listing-writes-16.** cx proposes a delete only as an irreversible change, never as a cheap way to fix a listing. Before the seller approves, cx tells them what the delete takes with it:
  - the offer in that store;
  - the item's relationships (all children's, for a parent);
  - the FBA link, if a re-created listing does not have the same SKU and ASIN;
  - the wait before the listing can be offered again, as Stop selling a product (G200216110) states it when cx proposes the delete.

  It also says what stays: the ASIN, its reviews and its rank. The "before" read of P-listing-writes-8 includes offers, fulfillment availability and relationships.
  Sources: deleteListingsItem; Building Listings Management Workflows Guide; Stop selling a product (G200216110); Resolve stranded inventory issues (GEYJTVJPWRYUTADQ); Variation relationship FAQ (G201951410); Sales Rank FAQ (G202059240).
- **P-listing-writes-17.** cx prefers the documented non-destructive path:
  - **To stop selling:** close the listing (sales history kept) rather than delete. Closing is described as a Seller Central action. No API page read names a "close" operation, so cx points the seller to Manage All Inventory.
  - **To fix a wrong product type:** resubmit the SKU with the product type Amazon suggests, rather than delete and re-create.

  A delete is proposed only where no update path is documented, such as removing a parent-child relationship.
  Sources: Stop selling a product (G200216110); Warning code 18367 (GXMA2QU3JZTG8JNL); Building Listings Management Workflows Guide; Listings Items API Issues Troubleshooting (4005013, 4005038).
- **P-listing-writes-18.** When a listing must be re-created, cx re-creates it under the same SKU and on the same ASIN, in every store where it existed. For Pan-European FBA, that is every required EU store. Sources: Resolve stranded inventory issues; Pan-European FBA: How it Works (G201855460); Sell Globally experience FAQ (GNFDSYQP7TR7SPUW).
- **P-listing-writes-19.** A bulk change above the workflows guide's crossover goes as a `JSON_LISTINGS_FEED`:
  1. `createFeedDocument`, then upload with the same content type;
  2. `createFeed` for one store;
  3. `getFeed` until a terminal status;
  4. `getFeedDocument`.

  cx reports per SKU from the processing report's `issues` and `summary`, not from the feed's `DONE`. A `FATAL` feed is reported as "some, none or all applied", followed by a re-read. Sources: Submit a feed; feeds_2021-06-30.json; listings-feed-processing-report-schema-v2.json; Building Listings Management Workflows Guide.
- **P-listing-writes-20.** Feed messages are written in the same product type schema as a Listings Items write. `UPDATE` is treated as put (it replaces), and `PATCH` or `PARTIAL_UPDATE` as patch. Since a feed has no preview, a change that needs checking is previewed item by item through `patchListingsItem` first. Sources: listings-feed-schema-v2.json; Building Listings Management Workflows Guide; Listings Items API Rate Limits.
- **P-listing-writes-21.** cx never proposes a legacy XML or flat-file feed type (`POST_PRODUCT_DATA`, `POST_FLAT_FILE_LISTINGS_DATA` and the like) through the API, since Amazon answers them with `FATAL`. A seller's own inventory-file upload in Seller Central stays a valid route that cx may point to. Sources: Submit a feed; Deprecation of Feeds API support for XML and Flat File Listings Feeds.
- **P-listing-writes-22.** Content writes (title, bullets, description, keywords) go one store per request and one store per feed. Each is checked against that store's schema and written in that store's language. Each text value carries `language_tag` (as the schema spells it, for example `en_US`) and, where listed, `marketplace_id`. Multi-store writes are used only for `purchasable_offer` patches and deletes, within one region. Sources: Submit modular titles; listingsItems_2021-08-01.json; definitionsProductTypes_2020-09-01.json; Listings APIs FAQ; Update prices for multiple Amazon stores; Listing Creation for Global Accounts (G201468480).
- **P-listing-writes-23.** Before a content or price write in a store, cx asks whether that store is a Build International Listings target. For prices, cx tells the seller that a manual change there breaks BIL's price sync. For content, it notes that changes made in the source store propagate. Sources: Build International Listings (G202121570); Build International Listings price rules (G202121610); Managing Offers in Europe (G201394320); Seller Forums EU staff post (Julia_Amzn).

### The seat's own (not for a skill)

- [seat] The day-2 run's finding, recorded as the run's and not Amazon's: cx wrote a shown request with the sandbox origin `https://sandbox.sellingpartnerapi-na.amazon.com`. The origin was carried over from day 1's instruction that changes go only to the sandbox, while the production origin was meant. The run's lesson is that a request shown for approval names the production origin it would go to, and says whether it is a preview (`mode=VALIDATION_PREVIEW`) or a real write. (internal: day-2 report, lesson 1; day-1 report)
- [seat] The run's other write-side findings, all as the run's:
  - cx never called `getDefinitionsProductType`, and guessed limits (lesson 8).
  - It used `main_image_url` with `{value}` where Amazon's attribute is `main_product_image_locator` with `media_location`.
  - It used `"languageTag": "en-US"` where Amazon's examples use `language_tag` with `en_US`.
  - It invented a truncation note.
  - It put an ASIN in the Listings path, which takes `{sellerId}/{sku}`. Amazon answered 400 `InvalidInput`.

  Each of these is what P-listing-writes-1 and P-listing-writes-4 would have prevented. (internal: day-2 report)
- [seat] RFC 6902 (not opened in this session) names `remove`. Amazon's enum names `delete` and has no `move`, `copy` or `test`. A generic JSON Patch library may therefore emit an operation Amazon does not list. Treat the model's enum as the only list.
- [seat] Amazon's workflows guide already says to cache schemas and refresh them on `PRODUCT_TYPE_DEFINITIONS_CHANGE` (now P-listing-writes-15). The seat's own addition: since the door subscribes to no notifications and the link is valid seven days, a cached schema should be re-fetched before each write session, or whenever the `checksum` differs.
- [seat] Amazon's own AI sandbox chose to send put to production preview rather than imitate validation. That is a design hint for any cx test harness: a local imitation of Amazon's validation would go stale.
- [seat] The time from write to visible change differs by surface:
  - `getListingsItem`: 1-5 minutes (FAQ).
  - Notifications: 15-20 minutes (FAQ).
  - Seller Central bulk: "typically … within eight hours" (forum).
  - Title and Item Highlights on the store: 24 to 48 hours. This is Amazon's own title page (GYTR6SYGFA5E3EQC v21), not only a practitioner report as the first pass had it.
  - Images on the detail page: up to 24 hours (G1881, G200216080).
  - Feeds under high load: up to eight hours (Feeds API Best Practices).
  - BIL price or settings changes in target stores: up to four hours (G202121610, G202121650).
  - Close a listing: Inactive within 24 hours. Same listing after a delete: wait 24 hours (G200216110).

  Other files carry further figures for other surfaces (for example 72 hours for search on Amazon's glossary and "My ASIN is unsearchable" pages, per `research/elements/search-terms.md`, and a seller's two-week "reindexing period" in What practitioners add). They are about different things: a record, a notification, a display, search. They do not reconcile into one effect window, and none is an API value; each is help-page or forum prose Amazon can change.

  A skill should not quote any one of these; it should say "re-read after processing", and where a wait is needed before judging an effect, name the Amazon page that states it for that surface and read it at the time. This agrees with `research/method/funnel-and-search.md` P-15; positions elsewhere that build in a fixed hour count are the ones out of line.
- [seat] The day-2 run's `"languageTag": "en-US"` would fail the schema twice: the required `language_tag` is missing, and the extra key is refused (`additionalProperties: false`, item 49). The run also offered to write a `DELETE` for an inactive SKU. Under P-listing-writes-16 and P-listing-writes-17, closing or leaving the SKU inactive keeps its history, and a delete would have to be argued for. (internal: day-2 report; no SKU copied)
- [seat] The modular-titles page's put-shaped "PATCH" example is a trap for a model that copies examples. The model file is the authority on the request body.

## Verification

Verified 2026-10-14 by an adversarial verifier seat. Method: the 25 developer-docs pages were re-downloaded in their `.md` form and every quoted phrase was string-matched against them; the three model JSON files in `amzn/selling-partner-api-models` (main) were parsed for the operation, parameter, enum, rate and sandbox claims; the two `selling-partner-api-samples` files were re-read; the six Seller Forums threads, aboutamazon.com, the Sell on Amazon blog, SellerEngine, EcomCrew, Marketplace Pulse and the two arXiv records were re-opened with WebFetch. The internal day-2 report was re-read for the run's findings. No Amazon API host or Keepa host was called.

Claims checked: about 120 (every quotation, figure, date, enum value, operation and attribute name, page title and URL in sections A–F, the practitioner and research entries, and the run's findings).

Confirmed as written (selection): all developer-docs page titles and URLs; "must conform" (Manage Listings Issues) and "abide by" (troubleshooting); the PatchOperation enum `add`/`replace`/`merge`/`delete` and its descriptions; "Only top-level listings item attributes can be patched"; `ACCEPTED`/`INVALID`/`VALID` and the `VALID` description; the issue shape, enforcement actions and exemption statuses; `requirements`, `requirementsEnforced`, `productTypeVersion`, `parentageLevel` enums and wording; `SchemaLink` and the Base64 MD5 `checksum`; seven-day links; meta-schema keywords and Draft 2019-09; preview wording ("without persisting", "lower rate limits … not designed for production workflows"); the 1-5 / 15-20 minute FAQ figures; the rate-limit table (5 / 500 / burst 5 for patch; 100 relationship, 100 product data, 20 preview per application); the modular-titles table (75 / 125 / 200), 100476 with `ATTRIBUTE_SUPPRESSED` / `NOT_EXEMPT`, and the splitting paragraph; global image mapping; precedence wording; release-note dates (merge 2025-05-28, feed `DONE` 2026-02-23, `parentageLevel` 2026-05-27, `generic_keyword` 2023-08-16); `BRANDED_ITEM_CONTENT_CHANGE` payload; metadata-update rows (2026-07-27, 08-31, 09-28); all forum quotes by Amazon staff accounts; Marketplace Pulse 63.5%; EcomCrew title/author/date; the arXiv titles, venues and abstract phrases; the run's findings against the day-2 report. No store name, seller id, real seller ASIN or store figure appears in the file (`ATVPDKIKX0DER` is Amazon's public US marketplace id from its docs).

Corrections (was → now):

1. Item 2, update order: "4. Validate" with the ASIN-read as unconditional → the guide's step 5 is client-side JSON Schema validation (not `VALIDATION_PREVIEW`), the `getListingsItem` read is conditional ("If you need to inspect"), and the guide's caching note (refresh on `PRODUCT_TYPE_DEFINITIONS_CHANGE`) is recorded.
2. Item 3, `sellerId`: quote attributed to the model → the quote is the Retrieve page's; the model's different wording is added. `locale` default `DEFAULT` added.
3. Item 8, images: added "differ by product type and marketplace", and the uncaught page inconsistency (workflows guide "up to nine secondary images" vs Submit media's PT01–PT08).
4. Item 11: "partially supported product types are written as `PRODUCT`" → Amazon's narrower words (offer-only submissions for existing ASINs and partial updates); vendor put/delete semantics added.
5. Item 14: "a feed and a patch that touch the same SKU are ordered by timestamps" → quoted FAQ answer, noting its example concerns inventory updates.
6. Item 15: added the January 31, 2024 release-note launch of `VALIDATION_PREVIEW` and its wording.
7. Item 17: "A `VALID` result that carries a WARNING means 'the listing update is accepted'" → stated by Amazon of pricing warnings only, with its Featured Offer clause; "preview remaps some asynchronous codes" → preview's codes are changing to new ones, both supported; "Since April 29, 2026, preview also checks pricing" → April 29, 2026 is a documentation-change entry; launch date of the behaviour not found.
8. Item 18, static sandbox: "An empty body returns ACCEPTED … whatever is sent" → a case whose pattern is an empty body; matching looseness not stated. "Every sandbox operation has rate 5 and burst 15" → the hosted sandbox endpoints. Added that Listings Items, Product Type Definitions and Catalog Items are Static-only in Amazon's support table.
9. Item 23: G17781 "linked" by the troubleshooting page → it is linked from Manage Listings Issues; vendor support-case resolutions for 4005011/4005033 added.
10. Item 24: added put's relationship class and the page-vs-model burst disagreement.
11. Item 27: images announcement undated in the file → page shows "2 years ago", quote completed.
12. Item 33: aboutamazon.com date "2023-09-13" given as read from the page → the page shows no date; the date comes from search results.
13. Item 34: added the verified-brand-owner condition and "at least one image changed".
14. Practitioners, SellerEngine: "This is through Seller Central; the API is not mentioned" → the article attributes the 24-48 hours to Amazon without a citation and names no channel; URL added.
15. Practitioners, forum replies: each reply now names its thread; the "a week after" timing is the seller's own words; the parent-ASIN advice quoted.
16. Research: "Two papers explain why the Catalog shows reconciled values" → background only, neither describes Amazon's reconciliation rules; AutoKnow's author list marked "et al. (22 authors)"; MAVE's "incomplete and vary over time" marked as motivation, not a finding.
17. Pages read: the changelog page's invented-style name → its real title; SellerEngine URL added; Seller Central title-requirements URL written out.
18. Positions: P-listing-writes-8's "Amazon's APIs return no attribute history" → "No page read describes…"; new P-listing-writes-15 (schema caching and refresh) from the official caching note; the seat's caching item rewritten to keep only the seat's addition.

Still unverified:

- The 2023-09-13 date of the aboutamazon.com post (not on the page).
- Whether the static sandbox's empty-body case matches any body.
- Whether `summaries.itemName` on `getListingsItem` is the submitted or reconciled title (open question 1).
- Whether preview applies `ENFORCED` requirements to a partial patch (open question 7).
- Review Listings Changes and Enhance Listings (Seller Central help): not looked for, so no capture. Error code explanations (G17781), Product image guide (G1881), Use search terms effectively (G23501) and Product title requirements and guidelines (GYTR6SYGFA5E3EQC) were read on 2026-10-14 from their captures under the office's capture folder (outside this repository), and the help-page side of title, image and search-term rules rests on them.
- The Sell on Amazon Brand Registry page and the Amazon Science AutoKnow page were not re-opened by the verifier.
- The EcomCrew Brand Elevation claim rests on a secondary report; Amazon's own page was not found.

What a senior Amazon operations lead would expect here and is missing (not researched now):

- The Seller Central side of a write: the flat-file / Category Listings Report routes and their processing reports, "Edit" in Manage All Inventory, and how a Seller Central edit and an API write to the same SKU are ordered.
- Listing quality and suppression read-back beyond `issues`: the Listing Quality / "Fix Your Listings" dashboards, `searchListingsItems` with `withIssueSeverity` / `withStatus` for a sweep, and the suppressed-listings report (its name and options are door.md's; not checked here).
- Variation (parent/child) writes: `child_parent_sku_relationship`, `variation_theme`, and what a title or image write on a parent does to children.
- Brand Registry tools that change what shows: A+ Content (a separate API, not Listings Items), brand story, the "Report a violation"/catalog-update case path when a brand owner's write loses to another contributor.
- Restricted words / prohibited characters for titles and the category style guides, and how a policy-driven `SEARCH_SUPPRESSED` differs from a schema rejection. (The title page, GYTR6SYGFA5E3EQC v21, was read from its capture and lists prohibited characters and restricted phrases; this file did not take them up, as they are a review rule, not a write rule.)
- Multi-marketplace writes: one `marketplaceIds` per call, unified-account behaviour, and translation (language_tag) per store. (Gap fill: now section I, with Open questions 14–16.)
- The "Request approval"/brand-gating `QUALIFICATION_REQUIRED` path and `getListingsRestrictions` reasons in practice.
- How long a title or search-term change takes to affect organic rank (practitioner evidence only). For display, Amazon's title page gives 24 to 48 hours "including search results" (item 29); that is display, not rank.

Gap fill 2026-10-14: 3 gaps filled, 7 left open

Method:

- Every quotation added for sections G–I, the corrections and the new practitioner entries was string-matched against the page text as downloaded in this session:
  - the developer-docs pages in `.md` form;
  - the model and schema JSON files from `amzn/selling-partner-api-models` (main);
  - the Seller Central help texts saved under the office's capture folder (outside this repository).
- The Seller Forums threads were re-opened and each quoted sentence was confirmed verbatim, with its poster's kind (staff or seller).
- No Amazon API host or Keepa host was called.

The re-check caught and corrected these before the file was left:

- The stranded-inventory reasons are table rows, not "Reason: text" sentences.
- The processing report gained `sku` in the December 3, 2025 release notes, not on September 11, 2024.
- The "few records … several hours" sentence is the guide's, not a release note's.
- The JSON upload type is the tutorial's Java sample's `application/json; charset=` plus UTF-8.
- The BIL four-hour wording differs between G202121650 ("4 hours") and G202121580 ("four hours").
- The EU forum's support quote is the opening post's relay, and runs on to "ASIN sales history or reviews".
- Closing a listing is a Seller Central action; a quantity-0 "stop selling" path was not on the page and was removed.

Filled:

1. **Delete semantics** (section G, items 36–42; P-listing-writes-16, -17, -18). Sourced:
   - what a delete removes: the offer, relationships, and the FBA link when the SKU or ASIN changes;
   - permanence and the 24-hour wait (Seller Central);
   - that rank, history and reviews are kept on the ASIN.
2. **The bulk and asynchronous path** (section H, items 43–48; P-listing-writes-19, -20, -21). Sourced:
   - the five-call flow and the processing report;
   - the limits (25,000 messages, 5 feeds per 5 minutes, 10 MiB, 1,500-item crossover);
   - that messages use the same schema;
   - the July 31, 2025 retirement of XML and flat-file feeds in the API.
3. **Per-store and language rules** (section I, items 49–53; P-listing-writes-22, -23). Sourced:
   - `language_tag` and `marketplace_id` as required, exact keys, and `languageTag` refused;
   - one store per content write;
   - listings in the store's language;
   - BIL's sync scope;
   - Pan-EU's same-SKU and required-store rules.

Corrected in the first-pass text:

- The 24–48 hours is Amazon's own (item 29; SellerEngine entry).
- The help pages are readable through the content call (line 27; Pages read).
- The image count: "Maximum 9" upload tab against `PT01`–`PT08` (item 8).
- G17781 (item 23).
- `generic_keyword` 249 / under 250 bytes (Open question 3).
- The [seat] latency list.

Left open (Open questions 10–16, one of them a page disagreement):

1. Whether `deleteListingsItem` removes only the offer or also the item data, and whether the SKU can be re-created at once (10).
2. Whether a parent delete removes relationships in other stores (11).
3. Whether an API delete of an FBA SKU needs a separate quantity change (12).
4. Whether a re-created SKU continues its per-SKU history (13).
5. Whether BIL overwrites target-store content edits (14).
6. Which `language_tag` values each store's schema allows, and whether an outside value fails preview (15).
7. One feed for several stores: the FAQ and Submit a feed against "Update prices for multiple Amazon stores" (16).

Reconciled 2026-10-14

Method: the contradictions list of three critics was read whole; each item naming this file or a subject it states was settled at the source. Re-read in this pass: `listingsItems_2021-08-01.json` (rate tables in the operation descriptions, the `PatchOperation` enum and descriptions); the developer-docs pages Listings Items API, Partially update a listing, Building Listings Management Workflows Guide, Listings Items API Rate Limits and SP-API Release Notes in `.md` form; the help-page captures GYTR6SYGFA5E3EQC v21, G1881 v28, G200216080 v15, GF2C2L6RCFZGWBXC v4, G23501 v14 (US) and v9 (GB), G17781 v13 and G200898440 v13; and the two News_Amazon title threads (145b6d0f…, 302aaac6…). No Amazon API host or Keepa host was called, and no help page was fetched through the content call.

Changed in this file:

1. Reachability. Line 27, item 8 (G1881 no longer "unreachable"), item 23 (G17781), the Pages read rows for GYTR6SYGFA5E3EQC, G17781, G1881 and G23501, Open question 3 ("could not be read"), and the Still-unverified and missing-list lines now say each page was read on 2026-10-14 from its capture, with its page name. The web.archive.org note now says the seat's WebFetch refused it, not that it was unreachable (help-page-access.md A6).
2. Image count (item 8). The [seat] reading that made the workflows guide "the outlier" was removed. The three Amazon statements (guide: main plus nine; Submit media: MAIN plus PT01–PT08; G200216080: "Maximum 9") are named side by side, and the binding count is the schema's image locator attributes from `getDefinitionsProductType`, read at run time.
3. `merge` (item 11). Settled from the model and the Listings Items API page: `merge` exists, is described as "merges the target property", and is scoped to `fulfillment_availability` and `purchasable_offer`; Partially update a listing omits it. For content attributes, add/replace/delete on whole attributes is the rule, so bullet-points, description and search-terms are right for content, and listing-content-and-health's "semantics unknown" is the one out of date.
4. Title figures (item 28). Added a list of Amazon's differing title figures (75 / 125 / 200, the 90225 and preview examples at 200, Suppressed listings' 80 / 130) and that the write limit is the schema's `maxLength`, read at run time; item 23's "examples on a help page" corrected to the troubleshooting page.
5. AI title rewrites (item 29). The announcement and Q&A threads were re-opened: titles still over 75 characters "will be updated to the AI recommendation gradually", and listings "remain active, editable, and searchable, even if they haven't been updated yet". This file was right; competitor-set.md (Amazon does not change titles nobody updated) is the file to correct. The stable "Amazon writes too" line now says so.
6. Non-compliant title outcome (item 29). The forum's "stay active" and the title page's "might be automatically corrected or it might not appear in our search results" are both recorded as Amazon's; neither is picked, and cx reads `issues` at run time.
7. 24–48 hours. Confirmed verbatim in the GYTR6SYGFA5E3EQC v21 capture; this file already had it as Amazon's. effect-measurement.md's verifier (forum posts and blogs only) is the file to correct.
8. Rate limits (item 24). Re-checked: the page gives burst 5 for get and put, the model 10. Both are named; neither is picked; the run-time header is binding.
9. `generic_keyword` (Open question 3). Rewritten as an Amazon-pages disagreement (500 example, 249 and "less than 250", no figure on G23501) with the schema's `maxUtf8ByteLength` / `maxLength` binding for writes. The "UK counts spaces" contrast in the critics' list is from a 2022 archive; the live GB capture says spaces are not counted.
10. Search-terms read-back (item 25; run-time list). `generic_keyword` is read back from `getListingsItem`, not Catalog Items, since the 2023-08-16 removal.
11. Latency. Item 32's "within eight hours" is kept as staff prose beside the title page's 24–48 hours, unreconciled; the [seat] latency list names the other files' figures, says they do not reconcile into one window, and agrees with funnel-and-search.md P-15. effect-measurement.md P-7 and any position with a fixed hour count are the ones out of line.
12. Numbers in skill lines. The stable Conformance line no longer says "monthly"; the stable Delete line and P-listing-writes-16 no longer state the 24-hour wait, and name Stop selling a product (G200216110) to read instead. The figure stays in item 38 for human readers.
13. Featured Offer (item 17). A note that other files record a 2026 eligibility change; not settled here.
14. Cross-references. Checked: this file names `research/angles/listing-content-and-health.md`, `research/angles/marketplaces-and-languages.md`, `research/elements/images-and-video.md`, `research/elements/search-terms.md`, `research/angles/price-position.md`, `research/method/funnel-and-search.md` and `research/method/help-page-access.md`, all of which exist; it names neither merged file.

Not changed, because another file is the wrong one: the AI title rewrite (competitor-set.md), the 24–48 hours source (effect-measurement.md), the merge semantics (listing-content-and-health.md), the G23501 / G1881 reachability claims in other files (images-and-video.md, search-terms.md).
