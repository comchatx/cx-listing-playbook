# Element: structured attributes, product type, browse nodes and item type keyword

Read 2026-10-14 by the research seat. Tags: [official] Amazon's own page or document; [opinion] a named practitioner; [research] published research; [seat] the seat's own reasoning, never a skill position.

## What this covers

This file covers the parts of a listing that are not prose:

- the **product type**, which decides which attributes exist, which are required and what values they may take;
- the **structured attributes**, such as color, material, size, `special_feature`, units and compliance fields;
- **`item_type_keyword`**, which places a new ASIN in Amazon's product graph;
- **`recommended_browse_nodes`**, which places the product in a section of the store;
- the store's view of all four, as Amazon reconciles them in the Catalog.

**Funnel stages.**

- **Exposure, through two routes.**
  - Browse placement: if the node is missing or wrong, "customers may not be able to find your product".
  - Refinements (the left-hand filters): the browse tree data ties each node's refinements to named attributes. A product whose attribute is empty, or whose value is not one the refinement accepts, cannot be found in that filtered view.
- **Conversion.** Attribute values are the spec answers a shopper reads, and Rufus answers from "product listing details". The detail-page layout itself is not sourced here (see Open questions).
- **No click-through role was found.** Nothing read ties an attribute to the search-result tile, apart from the title, which is its own file.

**Which skills it feeds.**

- **listing-review.** Which element serves which stage. Exposure triggers: a product type switch, a browse node that changed or vanished, refinements the product is missing from. What "good" looks like in Amazon's answers: empty `issues`, no `MISSING_ATTRIBUTE` warning, a Catalog product type and classification that match what was submitted. Which Keepa fields describe classification. The writing reference: the schema is the validation authority, and limits and enums live there.
- **listing-change-log.** An attribute or node change is a change like any other. The record must say which product type schema version the write was validated against.
- **effect-review.** A product type switch Amazon made, or a browse node Amazon moved, is a confounder. It can move exposure with no seller change at all.

**Why a senior operator cares.** Three reasons:

- Attribute and classification errors are the quiet exposure losses. The product is live and buyable, but it is absent from a node or from a filter.
- Amazon changes the rules monthly. It can switch the product type, and with it the required attributes, after a submission.
- An AI that writes from memory gets attribute names wrong. In the day-2 run on this line, cx wrote a PATCH for an image attribute under a name that Amazon's media guide does not use, and it never read the schema (the day-2 report's item 8: "`getDefinitionsProductType` was never called").

Scope boundaries:

- Title, bullets, description, search terms and images have their own element files. The modular-title rule (`item_name` plus `title_differentiation`) is owned by `elements/title.md`.
- Compliance and gating are covered here only as attributes that move findability or buyability. `angles/listing-content-and-health.md` (dangerous goods, restrictions), `angles/account-health.md` and `angles/marketplaces-and-languages.md` (GPSR, G1–G6) hold the account-health and marketplace sides.
- `issues`, suppression and the Listings/Catalog split are covered in depth in that same file. They are repeated here only where they bear on attributes and classification.

## Amazon's own rules and guidance

RULE means enforced by schema, API or policy. GUIDANCE means Amazon's recommendation. Figures are for human readers, and each one says where it lives at run time.

### A. The product type and its schema

1. RULE. A product type's requirements are a JSON Schema. "Amazon Product Type Definitions describe the attribute and data requirements for items in the Amazon catalog using" JSON Schema, and the schemas "extend JSON Schema 2019-09". [official] (Product Type Definitions API, https://developer-docs.amazon/sp-api/docs/product-type-definitions-api.md, last updated 2026-09-09, read 2026-10-14)
2. RULE. The product type comes first. Amazon's FAQ: "To identify the appropriate listing requirements, you must first select the correct product type." [official] (Listings APIs FAQ, https://developer-docs.amazon/sp-api/docs/listings-apis-faq.md, read 2026-10-14)
3. RULE. `getDefinitionsProductType` (`GET /definitions/2020-09-01/productTypes/{productType}`) takes these parameters:
   - `marketplaceIds`, required and currently limited to one store.
   - `sellerId`, optional. With it, "seller-specific requirements and values are populated within the product type definition schema, such as brand names associated with the selling partner" (model). The tutorial adds that `sellerId` returns "B2B audience values", and "B2B attributes only when the seller is enrolled in the Amazon Business program"; without it "the API returns a generic schema without the seller-specific configurations" (Retrieve a Product Type Definition).
   - `productTypeVersion`, default `LATEST`. `RELEASE_CANDIDATE` returns a prerelease version where one exists.
   - `requirements`, default `LISTING`:
     - `LISTING`: "Request schema containing product facts and sales terms."
     - `LISTING_PRODUCT_ONLY`: "Request schema containing product facts only."
     - `LISTING_OFFER_ONLY`: "Request schema containing sales terms only."
   - `requirementsEnforced`, default `ENFORCED`:
     - `ENFORCED` gives the schema "with required and conditionally required attributes enforced (used for full payload validation)".
     - `NOT_ENFORCED` gives it with them not enforced, for partial payloads such as single-attribute updates.
   - `locale`, default `DEFAULT`, the store's default locale. It controls the display labels.

   [official] (definitionsProductTypes_2020-09-01.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/product-type-definitions-api-model/definitionsProductTypes_2020-09-01.json, read 2026-10-14)
4. RULE. `parentageLevel` (`CHILD`, `PARENT`, `NONE`) was added on 2026-05-27. Behaviour by value:
   - `CHILD` makes `parent_sku` required.
   - `NONE` excludes the variation attributes.
   - Omitting it returns "the full schema with all conditional logic".

   [official] (Retrieve a Product Type Definition, https://developer-docs.amazon/sp-api/docs/retrieve-a-product-type-definition.md, last updated 2026-09-09; SP-API Release Notes, https://developer-docs.amazon/sp-api/docs/sp-api-release-notes.md, 2026-05-27 entry; both read 2026-10-14)
5. RULE. The response does not contain the schema. It holds:
   - links (`metaSchema`, `schema`), each with a `checksum`, "Checksum hash of the schema (Base64 MD5)";
   - `propertyGroups` (title, description, `propertyNames`);
   - `productTypeVersion` (`version`, `latest`, `releaseCandidate`);
   - `displayName`, `requirements` and `requirementsEnforced`.

   "The links provided are valid for seven days." Some JSON Schema libraries try to resolve the meta-schema by name online, which it does not support, so those libraries should use a downloaded copy. [official] (definitionsProductTypes_2020-09-01.json; Retrieve a Product Type Definition, read 2026-10-14)
6. RULE (example). Amazon's own example names these property groups: "Offer", "Images", "Shipping", "Variations", "Safety & Compliance", "Product Identity", "Product Details". `item_type_keyword` sits in the product identity group (with `item_name`, `brand`, `item_type_name`, `model_number`, `manufacturer` and the identifier fields). The "Product Details" group is described as "Information and characteristics to describe the product to support search, browse and detail page content" — the one sentence found in Amazon's developer docs that ties the details attributes to search, browse and the detail page together. [official] (Manage Product Listings with the Selling Partner API, https://developer-docs.amazon/sp-api/docs/manage-product-listings-guide.md, last updated 2026-09-09, read 2026-10-14)
7. RULE. The Amazon meta-schema v1 adds 12 custom keywords on top of Draft 2019-09. Its URIs "are identifiers; they are **not** network addressable."
   - Validation keywords:
     - `maxUtf8ByteLength` / `minUtf8ByteLength`: "the maximum length of a `string`, measured in UTF-8 bytes". Byte limits sit beside the standard `maxLength`, which counts characters.
     - `maxUniqueItems` / `minUniqueItems`, used with `selectors`.
     - `selectors`: "an array of property names that define the combination of properties that make an object unique".
   - Informational keywords:
     - `editable`: "whether or not a property value can be modified for an existing item".
     - `hidden`, `enumNames` (display labels, in the same order as `enum`).
     - `$lifecycle`, `replacedBy`, `replaces`.
     - `enumDeprecated`: "Instances of deprecated `enum` values must be replaced with valid values before the deprecated values are removed."

   [official] (Amazon Product Type Definitions Meta-Schema (v1), https://developer-docs.amazon/sp-api/docs/product-type-definition-meta-schema.md, read 2026-10-14)
8. GUIDANCE. Validating against the schema is the submitter's job. Amazon's words:
   - "Validating data with custom data prevents most listings-related issues from occurring before submitting to Amazon."
   - "Custom vocabulary data validation is recommended but not required."
   - "Check that the listing data meets requirements prior to submission by using JSON Schema validation utilities."

   [official] (Product Type Definitions API; Building Listings Management Workflows Guide, https://developer-docs.amazon/sp-api/docs/building-listings-management-workflows-guide.md, last updated 2026-09-24, read 2026-10-14)
9. RULE. Requirements change on a schedule, and sometimes off it:
   - The FAQ: "Based on customer search and buying signals, Amazon reviews product attributes regularly and plans necessary updates for the last week of every month. Sometimes, Amazon makes some updates before the planned release to address customer feedback and resolve any defects or gaps."
   - "The schema version always updates to the latest version of the Amazon product type definition."
   - "Deprecated content is content that is still technically valid but is removed in the future."

   The metadata-updates page lists monthly releases with per-release spreadsheets. The latest rows are 2026-09-28, 2026-08-31 and 2026-07-27. It applies to Listings Items v2021-08-01. [official] (Listings APIs FAQ; SP-API Product Metadata Updates, https://developer-docs.amazon/sp-api/docs/sp-api-metadata-updates.md, last updated 2026-09-10, read 2026-10-14)
10. GUIDANCE. Cache the schemas and the product-type list, and refresh on notification:
    - "Cache the JSON schemas returned through the getDefinitionsProductType operation."
    - Cache the `searchDefinitionsProductTypes` response.
    - Subscribe to `PRODUCT_TYPE_DEFINITIONS_CHANGE`, which "is sent whenever there is a new Product Type or Product Type Version". Its payload is `AccountId`, `MarketplaceId`, `ProductTypeVersion`, `NewProductTypes`, and it is delivered through the Amazon EventBridge workflow.

    [official] (Building Listings Management Workflows Guide; Notification Type Values, https://developer-docs.amazon/sp-api/docs/notification-type-values.md, last updated 2026-09-30, read 2026-10-14)

### B. Choosing, and losing, a product type

11. RULE. `searchDefinitionsProductTypes` (`GET /definitions/2020-09-01/productTypes`) takes either of two inputs, never both:
    - `keywords` ("Cannot be used with `itemName`");
    - `itemName` ("Title of ASIN to get product type recommendation").

    It also takes `marketplaceIds`, `locale` and `searchLocale`. The guide says passing `itemName` gives a "high-confidence recommendation", and that an empty parameter returns the entire list. The tutorial gets recommendations "for a given Amazon store, type of selling partner account, and item name". [official] (definitionsProductTypes_2020-09-01.json; Building Listings Management Workflows Guide; Get Product Type Definition recommendations, https://developer-docs.amazon/sp-api/docs/get-product-type-definition-recommendations.md, read 2026-10-14)
12. RULE. Amazon can switch a listing's product type after submission. "If the listing deviates from the selected product type, the listing's product type switches to a recommended product type." Amazon presents the switch as a warning. Attributes required by the new type then "show up as missing". [official] (Listings APIs FAQ, read 2026-10-14)
    - Seller Central names the same event as a warning code. "This warning code refers to incorrect product type warning and occurs when Amazon categorizes your product under a different product type based on the attributes that you had provided, such as, title, product description, and bullet points in your listing instead of the product type that you had specified in the listing." The fix Amazon gives: accept the suggested type and resubmit (with "the latest template for the suggested product type" for feed users), or, if the seller's type is right, "ensure that attributes, such as title, product description, and bullet points match the product" and resubmit. So the switch is driven by the prose fields, not only by the structured attributes. [official] (Warning code 18367: Product type modified by Amazon, GXMA2QU3JZTG8JNL v1 r1, https://sellercentral.amazon.com/help/hub/reference/external/GXMA2QU3JZTG8JNL, read 2026-10-14 from the saved capture capture `GXMA2QU3JZTG8JNL-v1`)
13. RULE. Amazon notifies a brand owner when an item's product type changes:
    - `ITEM_PRODUCT_TYPE_CHANGE` fires "whenever there is a change to the product type of any item that the selling partner has a brand relationship with".
    - Payload: `MarketplaceId`, `Asin`, `PreviousProductType`, `CurrentProductType`.
    - Recipients are sellers with a verified brand relationship. Delivery is the EventBridge workflow.

    A seller without a brand relationship gets no such notice. [official] (Notification Type Values, read 2026-10-14)
14. RULE. Wrong or unavailable product types fail in named ways:
    - `4000003` "The Amazon Product Type specified is invalid or not supported." Unlaunched types may roll up to a parent type such as `PRODUCT`.
    - The FAQ: "Items show as restricted if you don’t have access to the product type." The answer goes on to vendor channels ("reach out to your vendor manager"), so it is written for vendors; whether sellers see the same is not stated.
    - Luxury pairing: `4005018` ("Luxury brand products require a luxury or professional product category.") and `4005019` ("Non-luxury brands cannot be submitted for a luxury or professional product category.").

    [official] (Listings Items API Issues Troubleshooting, https://developer-docs.amazon/sp-api/docs/listings-items-api-issues-troubleshooting.md, last updated 2026-09-09; Listings APIs FAQ; read 2026-10-14)
15. RULE. "Sales terms are defined on the root `PRODUCT` product type, which should be used when listing items with sales terms only" (Building guide). `putListingsItem` "creates a new listing or replaces the existing content of a listing. Existing attributes may be dropped if omitted from the `putListingsItem` submission"; Amazon's example: a put with `LISTING_OFFER_ONLY` "without including the bullet points, the `putListingsItem` submission will remove the bullet points content on existing listings" (Create or fully update a listing). [official] (Building Listings Management Workflows Guide; Create or fully update a listing, https://developer-docs.amazon/sp-api/docs/create-a-listing.md, read 2026-10-14)
16. RULE. Whether the product type itself can be changed by the seller is not settled in Amazon's documents.
    - The PATCH body carries `productType` ("The Amazon product type of the listings item"), but no page says a PATCH can change it.
    - An Amazon staff reply in Seller Forums says: "In some instances the Product Type can be updated but in others Amazon may be making the final decision on the ASIN", and "you may need to make requests in batches".

    [official, forum staff] (listingsItems_2021-08-01.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/listings-items-api-model/listingsItems_2021-08-01.json; Seller Forums "How to Change Feed-Product-Type", Glenn_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/c5074d92-aeea-4882-a899-d4bc93cca8a6, "2 years ago"; read 2026-10-14)

### C. Item type keyword and recommended browse nodes

17. RULE and GUIDANCE (tutorial dated 2026-01-28 in the release notes):
    - "Item type keywords are used to place new ASINs in the appropriate place(s) within the graph." Guidance: "Select the most specific accurate term for optimal placement."
    - Recommended browse nodes "Indicate the browse node or section of the Amazon website where the product will be assigned". If the node is missing or wrong, "customers may not be able to find your product".
    - Both carry an `enum` list in the product type schema, with `enumNames` giving a readable category path; "The enumerated values correspond to the category browse paths found in the Browse Tree Guide and visible in Seller Central create product page."
    - Structurally the enum is not exclusive. In both of Amazon's examples the `value` is `anyOf` [`{"type": "string"}`, `{"type": "string", "enum": [...]}`], so a JSON Schema validator accepts any string up to `maxLength`. Rejection of a value outside the list happens at Amazon's processing, not at schema validation (item 19: `101158` says a `recommended_browse_nodes` value "must match one of the accepted browse node IDs for the marketplace and product type").
    - In both examples `value` is marked `"editable": true` and `"hidden": false` (LUGGAGE only; other product types are read at run time).

    [official] (Get recommended browse nodes or item type keywords, https://developer-docs.amazon/sp-api/docs/get-recommended-browse-nodes-or-item-type-keywords.md, last updated 2026-09-09; SP-API Release Notes, 2026-01-28 entry; read 2026-10-14)
18. RULE (figures for humans; they live in the schema). Amazon's examples, both for LUGGAGE:
    - `item_type_keyword` in the US: `maxUniqueItems` 1, a single value, string `maxLength` 500.
    - `recommended_browse_nodes` in CA: `maxUniqueItems` 232, numeric node IDs with string `maxLength` 15.

    These counts are per product type and per store. They live in `getDefinitionsProductType`. [official] (same page, read 2026-10-14; the `maxLength` 500 and `maxUniqueItems` 1 / 232 were re-read on the page on 2026-10-14)
    - **Two Amazon sources give different figures for `item_type_keyword`.** The schema example above sets a string `maxLength` of 500 (characters, the write limit). "Keyword attributes explained" (GF2C2L6RCFZGWBXC v4 r1, item 48) gives `item_type_keyword` a "Length Limit (Bytes)" of 250, and says that past the limit "Amazon Search indexes up until the length limit and ignores any excess". The two may measure different things (a write limit in characters and a search-indexing limit in bytes), but neither page says so. This file does not pick one. The binding write limit is read at run time from `getDefinitionsProductType` for the product type and store. The help page's indexing figure is for human readers.
19. RULE. Invalid classification values have named errors:
    - `4000001` "The provided value for attribute_name is invalid." Amazon says it "is most commonly associated with Product Category, Product Subcategory, Item Type Keyword, or Recommended Browse Node", and "conditionality must be followed, meaning that only certain subcategories can be selected for a certain product category and only certain browse nodes for certain subcategories".
    - `101158` "The value, that you entered for the attribute Product Category, is not one of the valid values." Amazon names the attribute as "Product Category (recommended_browse_nodes)" and says the value "must match one of the accepted browse node IDs for the marketplace and product type". The fix is to read the valid node IDs for the store and product type.
    - `90244` "Invalid enumerated value value for attribute attribute_name."

    [official] (Listings Items API Issues Troubleshooting, read 2026-10-14)
20. RULE. "Starting **July 31, 2025**, the Feeds API no longer supports legacy XML and flat file listing feeds" (this is the Feeds API; the page does not speak to Seller Central's own upload screens). Amazon's mapping files "do not include the product type or Amazon store-specific relevancy of each" attribute. Variation-theme names changed format, "from **CamelCase** in flat files (`SizeName`) to **Underscore** format in the JSON schema (`Size_Name`)", so a name remembered from a flat file can differ from the JSON schema name. [official] (Mapping product attributes to the Listings Items API and JSON-based feeds, https://developer-docs.amazon/sp-api/docs/mapping-product-attributes.md, read 2026-10-14)
21. RULE. Image attributes in the JSON world are named `main_product_image_locator`, `other_product_image_locator_{1-8}` and `swatch_product_image_locator`, each with a `media_location`. The page does not mention `main_image_url`. The page's table maps `PT01`–`PT08` to the secondary slots. Other Amazon pages give a different image count (`elements/images-and-video.md` owns that conflict); the slots a product type actually has are read from its schema at run time. [official] (Submit media attributes, https://developer-docs.amazon/sp-api/docs/submit-media.md, last updated 2026-09-09, read 2026-10-14)

### D. Browse tree, refinements and the Catalog's classification

22. RULE. The browse tree is a report, `GET_XML_BROWSE_TREE_DATA`.
    - Format and access: XML, for sellers, requestable or schedulable. Roles include Product Listing.
    - Options: `MarketplaceId`, `RootNodesOnly`, `BrowseNodeId`. "RootNodesOnly takes precedence" when both are given.
    - Each `Node` carries:
      - `browseNodeId`, `browseNodeName`, `browseNodeStoreContextName`
      - `browseNodeAttributes`, `browsePathById` / `browsePathByName`
      - `hasChildren`, `childNodes`
      - `productTypeDefinitions`, `refinementsInformation`
    - Amazon recommends diffing each new report against the last one with the same options to see which nodes changed.
    - Amazon's example node carries `<browseNodeAttributes count="1"><attribute name="item_type_keyword">…</attribute></browseNodeAttributes>`: the report ties each node to an `item_type_keyword` value, which is how a node and a keyword can be matched.
    - "Amazon recommends that you do not include the `MarketplaceId`s parameter with calls to the `createReport` operation" for this report; the store goes in `reportOptions.MarketplaceId`, and "Amazon may update the BrowseTreeReport.xsd schema".

    [official] (Browse Tree Reports, https://developer-docs.amazon/sp-api/docs/report-type-values-browse-tree.md, last updated 2026-09-09, read 2026-10-14)
23. RULE. The XSD of that report ties refinements to attributes. In `refinementsInformation`, each `refinementName` (with a `name`) holds `refinementField` elements with `acceptedValues`, `hasModifier`, `modifiers` and **`refinementAttribute`**. This is the one place found in Amazon's own documents that says, node by node, which attribute feeds which filter and which values it accepts. Amazon's own page example shows an empty block (`count="0"`), and Amazon does not explain the fields in prose. [official] (BrowseTreeReport.xsd, https://images-na.ssl-images-amazon.com/images/G/01/mwsportal/doc/en_US/Reports/XSDs/BrowseTreeReport.xsd, read 2026-10-14)
24. RULE. The Catalog holds Amazon's classification of any ASIN:
    - `includedData=classifications`: "Classifications (browse nodes) for an item in the Amazon catalog". Each `ItemBrowseClassification` has `displayName`, `classificationId` and a `parent` chain.
    - `summaries.browseClassification`: "Classification (browse node) that is associated with the Amazon catalog item".
    - `summaries.websiteDisplayGroup` / `websiteDisplayGroupName`.
    - `productTypes`: "Product type that is associated with the Amazon catalog item, grouped by `marketplaceId`".
    - `salesRanks` comes in two lists. `classificationRanks` are keyed by `classificationId`, so the rank categories are browse classifications. `displayGroupRanks` are keyed by website display group.

    [official] (catalogItems_2022-04-01.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/catalog-items-api-model/catalogItems_2022-04-01.json, read 2026-10-14)
25. RULE. `searchCatalogItems` with `keywords` returns `refinements`, made of brands and classifications. Each carries `numberOfResults`, "The estimated number of results that would be returned if you refine your search by the specified `classificationId`". `classificationIds` limits a keyword search to given classifications. Results are capped at 1,000 items. [official] (catalogItems_2022-04-01.json; Search catalog items, https://developer-docs.amazon/sp-api/docs/search-catalog-items.md, read 2026-10-14)
26. RULE. The Customer Feedback API's `getItemBrowseNode` "returns the associated browse node of the requested ASIN" as `browseNodeId` and `displayName`. Its category-level review and return topics are keyed to that node. The model does not say how that one node is chosen among several. [official] (customerFeedback_2024-06-01.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/customer-feedback-api-model/customerFeedback_2024-06-01.json, read 2026-10-14)
27. GUIDANCE (Amazon staff, forum, "11 months ago"). For a listing missing from search:
    - "Confirm browse node assignment is correct" and "Use relevant browse nodes for better visibility".
    - "Using incorrect browse nodes" is listed under common mistakes.
    - "Allow up to 72 hours for changes to reflect in search results".

    A seller reply in the same thread: "your browse node got deleted mysteriously and it takes forever for Amazon to fix". [official, forum staff] (Seller Forums "Why Isn't My Listing Showing in Search Results? A Complete Guide", Manny_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/fb1124b0-adf9-4933-b470-f75160082cdf, read 2026-10-14)

### E. Completeness, precedence and Amazon's own attribute work

28. RULE (example of the live signal). Amazon's guide shows a `getListingsItem` issue with severity `WARNING` and an `attributeNames` list:
    - "Attributes tagged as relevant_attributes are incomplete."
    - "Provide values for the following attribute(s): item_weight, theme, item_dimensions, item_diameter".

    The same example carries a second WARNING, "Attributes tagged as customer_returns are incomplete. Provide values for the following attribute(s): color, item_dimensions, item_weight", so Amazon tags missing attributes by purpose (relevance, returns), not only as required/optional.

    Completeness is therefore reported in `issues`, not only in a Seller Central dashboard. [official] (Manage Product Listings with the Selling Partner API, read 2026-10-14)
29. RULE. Issue `categories` include `MISSING_ATTRIBUTE` ("One or more required attributes are missing.") and `INVALID_ATTRIBUTE`. Since 2026-09-30 they also include `PRODUCT` ("Issue applies to the product (ASIN).") and `LISTING` ("Issue applies to the listing (SKU)."). [official] (listingsItems_2021-08-01.json; SP-API Release Notes, 2026-09-30 entry; read 2026-10-14)
30. RULE. Required-attribute errors:
    - `90220` "attribute_name is required but not supplied."
    - `4000002` "A value for attribute_name is required." The fix includes subscribing to schema-change notifications so new required attributes are not missed.
    - `4005033` "The value for attribute_name cannot be edited." This applies to properties marked `editable: false`.

    [official] (Listings Items API Issues Troubleshooting, read 2026-10-14)
31. RULE. What the seller submits is not necessarily what shows:
    - "Brand owners have the highest precedence to update data on the product details page."
    - Edits may not reach the page because "the information submitted by a vendor might not have priority".
    - Backend updates run "every 15 minutes". Direct `getListingsItem` reads reflect changes "within 1-5 minutes".
    - Gap-fill note on what these two figures measure. The FAQ's question is why the `LISTINGS_ITEM_ISSUES_CHANGE` and `LISTINGS_ITEM_STATUS_CHANGE` notifications lag `getListingsItem`: "the Amazon backend updates every 15 minutes", so "a 15-20 minute delay for the … notifications is normal", while `getListingsItem` "directly queries the current state … (within 1-5 minutes)". Neither figure is a search or detail-page display latency. Display and search windows are stated per change type on other pages. Up to 72 hours for an offer, browse-node or launch-date change to reach shopping results (item 27 and item 47). The Amazon search glossary gives the same bound for any change, and says it is not fixed: "It can take up to 72 hours for changes to new or existing ASINs to go live. Latency can be slower or faster, depending on the website traffic volumes and other technical factors" (GF6B8ZPNY2AP72VV v2 r0, capture capture `GF6B8ZPNY2AP72VV-v2`). For the EU GPSR checks, 2 to 48 hours, and then "within seven days" for the listing to become active (item 45). Other files hold other figures for other change types (title, images, bulk paths). This file states no single effect window. The figures are for human readers; cx confirms that a change is live by reading the Catalog, not by waiting out a figure (`method/funnel-and-search.md` P-funnel-and-search-15).

    [official] (Listings APIs FAQ, read 2026-10-14; re-read in the gap fill)
32. GUIDANCE / disclosure. Amazon's own catalogue AI corrects attribute values at scale:
    - "These catalogue AI solutions are correcting and updating product attributes at the scale of the Amazon Stores."
    - It uses attribute statistics as correctness signals ("if products with a certain attribute value are more frequently viewed by customers, we can trust that the attribute is correct").
    - It normalises synonyms (e.g. "Bluetooth" over "BT 5.1").
    - It makes "the latest seller values are included in the catalogue more quickly (within days)".

    [official] (Using LLMs to improve Amazon product listings, Abhishek Agrawal, Amazon Science, 2025-11-28, https://www.amazon.science/blog/using-llms-to-improve-amazon-product-listings, read 2026-10-14)
33. GUIDANCE. Amazon describes the Product Identity tab as holding "the product name, type, the item type keywords". On the Product Details tab, "The required information can differ from product to product". [official] (How to create Amazon product listings, sell.amazon.com, 2026-04-29, https://sell.amazon.com/blog/amazon-product-listings, read 2026-10-14)
34. GUIDANCE. Amazon's SEO article says "Customers refine a search by using different filters like delivery day, customer reviews, and price". It recommends selecting "product categories with care", and says "Listing quality and your account health can contribute to search rankings". [official] (Amazon SEO: 7 ways to improve your product's search rankings, sell.amazon.com, 2025-09-03, https://sell.amazon.com/blog/amazon-seo, read 2026-10-14)
35. GUIDANCE (shopper-facing). Rufus answers "based on the helpful information found in product listing details, customer reviews, and community Q&As". Customers use it "to quickly compare features" (e.g. "Compare OLED and QLED TVs"). [official] (Amazon's Rufus AI assistant now available to all US customers, Rajiv Mehta, aboutamazon.com, https://www.aboutamazon.com/news/retail/how-to-use-amazon-rufus, read 2026-10-14) Naming: Amazon renamed Rufus "Alexa for Shopping" on 2026-05-13. `elements/bullet-points.md` (G6, G13) holds Amazon's rename note and announcement. Items 35, 36 and 57 keep the name the cited pages use.
36. GUIDANCE (technical). At answer time Rufus retrieves from "customer reviews, the product catalogue, and community questions and answers" and from "relevant Stores APIs". The article does not single out structured attributes. [official] (The technology behind Amazon's GenAI-powered shopping assistant, Rufus, Trishul Chilimbi, Amazon Science, 2024-10-04, https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus, read 2026-10-14)

### F. Routes, and what was not read

- A plain fetch of a Seller Central help URL (the `help/hub/reference/external/G1661`, `gp/help/external/1661` and EU forms were tried) returns only the Seller Central landing page. That is a property of the route, not of the page.
- The pages themselves were read on 2026-10-14 through the help hub's content call (`POST https://sellercentral.amazon.com/help/hub/mons-api/GetHelpTopic`, `method/help-page-access.md` A2). Classify your products using Browse Tree Guides - BTG (G1661 v15 r1), Amazon search glossary (GF6B8ZPNY2AP72VV v2 r0), My ASIN is unsearchable (GHGHDMU4X5K9QGCV v6 r0), Keyword attributes explained (GF2C2L6RCFZGWBXC v4 r1), Listing quality (G200786710 v5 r1), Sales Rank FAQ (G202059240 v2 r0) and Warning code 18367 (GXMA2QU3JZTG8JNL v1 r1) have their text saved under the office's capture folder (outside this repository)<id>-v<version>.txt`. The other help pages in sections G–M were read the same way in the gap fill and are cited with their versions. No further help page is fetched through that call until the office rules on its standing use (`method/help-page-access.md` Open question 1).
- web.archive.org: the WebFetch tool refuses it, while `curl` reads `id_` copies (`method/help-page-access.md` A6). No archive copy was needed here, and none was read.
- Not read in this session: the Listing Quality Dashboard's own help page, the Product Classifier page and Amazon's category style guides. No capture of them exists under the office's capture folder (outside this repository)
- Before the gap fill, Amazon's own prose on refinements was read only through the browse-tree XSD (item 23) and a forum staff post (item 27). The search glossary, G1661 and G201950630 (item 53) now add Amazon's help-page wording.

### G. Gap fill: unit count, price per unit and derived size

Help pages in sections G–M were read through the help hub content call (route in `method/help-page-access.md` A2). Each is cited with its title as shown, its canonical id, its version (v) and revision (r), and its layer. All are US (`Published/US`, en-US) unless marked DE (`Published/DE`, en-GB, read through the `sellercentral.amazon.de` host).

37. RULE. Price per unit (PPU) depends on two attributes, and missing values cost search visibility in the listed product types.
    - The attributes: "Unit count includes a value unit_count, such as,"5" and a type unit_count_type, such as, "Count", "Foot", "Sq Ft", "Fl Oz" and, "Ounce"." Amazon also says "PPU information is required by law for many products."
    - New listings in the product types of Amazon's "price per unit requirements table" (an .xlsx linked from the page, not opened here) must carry the unit count attributes.
    - Existing listings: "Product updates will show errors for ASINs that do not follow the new PPU requirements."
    - Suppression: ASINs without `unit_count`, or with incorrect `unit_count_type`, "have to be updated within a certain time period that is shown in the Listing Quality Dashboard. After this period has passed, certain listings that do not contain the above-mentioned attributes will no longer be shown in search." "These search-suppressed ASINs will then be available under Fix Your Product (FYP)."
    - Allowed units by packaging: solids, semi-solids, powders and aerosols take "Ounce"; liquids take "Fl Oz"; roll or sheet goods take "Sq Ft"; length goods take "Foot"; goods sold by count take "the total "Count" of functional units". For "bundles of dissimilar items", "set unit_count_type to "Count" and unit_count to "1"."
    - Display: a correct PPU shows "in Search and on Detail page". Whether it shows at all is decided by "an automated system". For example, a "Car_seat" gets no PPU and "Coffee" does. "We are constantly reviewing these rules".
    - Funnel reading: exposure (search suppression), click-through (PPU on the search result) and conversion (PPU on the detail page).

    [official] (Price per unit requirements, G201618190 v2 r0, https://sellercentral.amazon.com/help/hub/reference/external/G201618190, read 2026-10-14)
38. RULE. Amazon narrows `unit_count_type` by product type and item form, and requires the packaging attributes in many product types.
    - "Enabled Unit Count Type derivation based on Item Form for 138 Product Types (PTs)". The page's example: a "Shampoo" product type with Item Form "Liquid" takes "Fl oz".
    - "Note only the values which are available in the list are considered as valid values. Entering values other than those mentioned in the list might lead to catalog errors. If these errors are not corrected the ASIN might be removed from search since they are not compliant with listing requirements. Once the values Unit Count Type and Item Form is updated, ASIN will be reinstated."
    - Mandatory counts as the page gives them: Net Content for 8 product types, Item Form for 86, Number of Items for 154. These figures are dated and the live truth is the schema's `required` list.
    - Number of Items "is the lowest level of branded packaging that encases the product sold". The page's examples: a box of 8 oat packets has Number of Items 8; a box of coffee pods counts the boxes, not the pods.
    - Item Form: a value typed outside the drop-down "may exclude your ASIN from customer-facing experiences which require normalized values."

    [official] (Conditional Unit Count based on Item Form, Normalized Value of Size, Item Form, Number of Items and Net Content details, G2RCDMZR4SKGQFAY v3 r1, https://sellercentral.amazon.com/help/hub/reference/external/G2RCDMZR4SKGQFAY, read 2026-10-14)
39. RULE. In normalised product types, Amazon derives the shown Size from other attributes. A seller-typed size is not displayed.
    - "Seller contributions containing Size will not be visible and will instead be derived from other catalog attributes, such as item_weight, dimensions (item_length_width and item_length_width_height), capacity, unit_count, number_of_items, net_content_weight, net_content_volume, and net_content_count."
    - The formula Amazon gives for quantity: "unit_count / number_of_items + <unit_count.type> + ("Pack of" + number_of_items)". So "32 Count" with Number of Items 1 becomes "32 Count (Pack of 1)", "and both the sellers' offers will be associated with the same product."
    - "to change the value of Size, corresponding catalog attributes must be edited which are used to derive Size for that product type."
    - "Amazon retains the right to remove Sizes, which appear inaccurate or incorrectly formatted."
    - Amazon's own claim, with no figure: "ASINs with valid Size values had higher purchases from customers".

    [official] (Size normalization FAQ, GZJRCRLWW7WKKDAH v11 r1, https://sellercentral.amazon.com/help/hub/reference/external/GZJRCRLWW7WKKDAH, read 2026-10-14)
40. RULE (pricing link, stated narrowly). Pricing Health uses per-unit prices as reference prices.
    - The reference prices include "The price derived from the per-unit Featured Offer price for a smaller bundle of the same product". "The per-unit derived price is the price per unit of the Featured Offer from a smaller bundle of the same product, multiplied by number of units in your listing."
    - The competitive price threshold can come from "the per-unit price of a six-pack of hand sanitizer found at a reputable retailer outside Amazon … for a 12-pack of the same product in our store".
    - Offers with potential pricing errors are deactivated: "we notify you and deactivate the affected listings". Offers above the reference prices can be ineligible for the Featured Offer.
    - Neither Pricing Health nor "Listing blocked due to potential pricing error" (G201141430 v7 r1, which names no unit attribute) says which attribute supplies the "number of units in your listing". The link from a wrong `unit_count` or `number_of_items` to a pricing deactivation is therefore a [seat] inference (see the seat's list). It is not an Amazon statement.

    [official] (Pricing Health, GSTH6YN3BR8XNWBW v22 r0, https://sellercentral.amazon.com/help/hub/reference/external/GSTH6YN3BR8XNWBW; Listing blocked due to potential pricing error, G201141430 v7 r1, https://sellercentral.amazon.com/help/hub/reference/external/G201141430; both read 2026-10-14)

### H. Gap fill: compliance attributes and how Amazon enforces them

41. RULE (example). The schema keeps compliance attributes in their own property group.
    - In Amazon's LUGGAGE example the "Safety & Compliance" group is described as "Information to indicate product compliance, hazardous materials, and legal and safety warnings (e.g., lithium batteries, choking hazards, Consumer Product Safety Information Act (CPSIA))". The expansion of CPSIA is Amazon's own wording.
    - Its property names: `country_of_origin`, `warranty_description`, `batteries_required`, `batteries_included`, `battery`, `num_batteries`, `number_of_lithium_metal_cells`, `number_of_lithium_ion_cells`, `lithium_battery`, `supplier_declared_dg_hz_regulation`, `hazmat`, `safety_data_sheet_url`, `item_weight`, `ghs`, `supplier_declared_material_regulation`, `california_proposition_65`, `pesticide_marking`. `compliance_media` sits in "Product Details" in the same example.
    - Amazon's `getListingsItem` example shows the value shapes:
      - `supplier_declared_dg_hz_regulation` holds `"value": "not_applicable"`;
      - `california_proposition_65` holds `compliance_type` (`on_product_combined_cancer_reproductive`, or `chemical` with `chemical_names`);
      - `num_batteries` holds `quantity` and `type`;
      - `cpsia_cautionary_statement` holds a `value`.
    - Membership of the group is per product type. It is read from `propertyGroups` at run time.

    [official] (Manage Product Listings with the Selling Partner API, https://developer-docs.amazon/sp-api/docs/manage-product-listings-guide.md, updatedAt 2026-09-09, read 2026-10-14)
42. RULE. Dangerous goods (hazmat) and batteries: required for FBA, with no type-based shortcut.
    - "The physical and chemical properties of a unique, finished product define whether or not it's a dangerous good. That's why there is no predefined classification based on product type. It's also why we require specific dangerous goods information and documentation even if your product is not regulated as a dangerous good." "You have 14 business days to comply with product safety compliance requirements."
    - "When creating or converting a listing for FBA, you must include dangerous goods (hazmat) information for both batteries and products regulated as dangerous goods". "If the information requested above is missing, a product listing cannot be created or converted to FBA. Also, if the provided information is incomplete, inaccurate, or conflicting, your product may be blocked for sale". The review takes "two business days".
    - Lithium: an unanswered "Has Less than 30 Percent State of Charge" question means the products "will not be eligible for shipment via air methods."
    - The safety data sheet must "Be created or updated within the past five years" and must "Match your product listing". Two of the matches Amazon names: "The product name shown on the SDS is the same as the listing title (the product name, as it appears on the detail page)" and "Manufacturer or brand name of your product on the SDS is the same as what appears on the detail page".
    - Scope: both pages are written for FBA. They say nothing of merchant-fulfilled offers or of search visibility.

    [official] (Dangerous goods identification guide (hazmat), G201003400 v25 r0, https://sellercentral.amazon.com/help/hub/reference/external/G201003400; Dangerous goods (hazmat) required information and documentation, G201371860 v17 r1, https://sellercentral.amazon.com/help/hub/reference/external/G201371860; both read 2026-10-14)
43. RULE. California Proposition 65 is declared through attributes, on the child.
    - "For all existing and new product listings, you must: Determine if the product needs a Prop 65 warning. Provide Amazon with the correct Prop 65 warning using the instructions on this page (and not in any other way, such as by email)."
    - "Provide Prop 65 warnings for any applicable child SKUs. If you provide a Prop 65 warning on a parent SKU, you will receive an error message and the submission will fail."
    - The duty holds "even if you have fewer than 10 employees, and even if someone else is selling the same product."
    - The warning type is picked on the Compliance tab or in the template's "Compliance group". For on-product warnings and for the named special types (alcoholic beverage, raw wood, vehicles, vessels, diesel engines), "you may not select a Chemical Name".
    - Amazon displays the warning text that belongs to the chosen type, so the value is shopper-facing (conversion).

    [official] (California Proposition 65 (Prop 65), G202141960 v7 r0, https://sellercentral.amazon.com/help/hub/reference/external/G202141960, read 2026-10-14)
44. RULE. CPSIA choking-hazard statements are a shopper-facing attribute.
    - The statements "must be displayed in internet advertisements for applicable products. This includes all applicable product detail pages on Amazon." The chosen statement "will appear in a yellow warning box located above the Product Description section on the product detail page."
    - "Amazon cannot determine this information for you."
    - "You may select up to four cautionary statements for a single product". The valid values are the six `choking_hazard_*` values plus `no_warning_applicable`.
    - The statements "must be completed for toys and games intended for children 12 years of age and under, regardless of the category in which these products are listed".

    [official] (CPSIA cautionary statements, G200292910 v2 r2, https://sellercentral.amazon.com/help/hub/reference/external/G200292910, read 2026-10-14)
45. RULE (EU). The GPSR makes manufacturer, Responsible Person and safety information listing conditions.
    - "Effective December 13, 2024, the General Product Safety Regulation (GPSR) sets out requirements for most non-food consumer products offered for sale in the EU."
    - "All listings in scope of the GPSR must be compliant with the requirements, and we deactivate them if we become aware of non-compliance. This includes, but is not limited to, cases where information has been submitted, but we find it to be invalid, or the contract with the service provider acting as the Responsible Person has ended."
    - The manufacturer and EU Responsible Person must be on the label and "on the product detail page", which shows them in "Safety and Product Resources". "We display one manufacturer submission per ASIN". "We display all Responsible Person submissions".
    - Warning and safety information is given as images, as product documents, or as a safety attestation. For new listings the attributes are "Safety Attestation", "Compliance media language", "Compliance media content type" and "Compliance media source location", in Manage All Inventory, a template "or the application programming interface (API)".
    - "If you choose this option, but the product does require warning and safety information, your listing will not be created."
    - Timing for an unbranded product: "Pending compliance checks … can take between 2 and 48 hours". Once the information is valid, "your listing will become active within seven days."
    - Manufacturer and Responsible Person details for branded products are submitted once per brand on the Account Health page. That is a Seller Central step.
    - A deactivated listing stays "non-sellable until you provide the required information". Inventory is returned or disposed of after 30 days. Reinstatement also needs the listing's other suppressions fixed.
    - The help pages name display labels, not JSON attribute names. Only `compliance_media` appears in an Amazon developer example read here. The other JSON names are read from the EU store's schema (Open question 12).

    [official] (General Product Safety Regulation (GPSR), DE GQAYBJPNAZ2LMDDT v15 r1, https://sellercentral.amazon.de/help/hub/reference/external/GQAYBJPNAZ2LMDDT; Submitting manufacturer, Responsible Person, and warning and safety information, DE G8AECGHY2KLD88D7 v15 r0, https://sellercentral.amazon.de/help/hub/reference/external/G8AECGHY2KLD88D7; Regulatory compliance - how to reinstate deactivated listings, DE GCS5NTUWXUMCESN2 v3 r0, https://sellercentral.amazon.de/help/hub/reference/external/GCS5NTUWXUMCESN2; Product safety and compliance, DE GUH6FA4XSJ2LZFLY v14 r0, https://sellercentral.amazon.de/help/hub/reference/external/GUH6FA4XSJ2LZFLY; all read 2026-10-14. `angles/marketplaces-and-languages.md` G1–G6 holds the marketplace side and records that the GB layer of the GPSR page has no body.)
46. RULE. The API names Amazon's enforcement on each issue, which is how an attribute-driven suppression shows up without any copy change.
    - Each `Issue` may carry `enforcements.actions[].action`:
      - `LISTING_SUPPRESSED`: "takes down the current listing item's buyability";
      - `ATTRIBUTE_SUPPRESSED`: "An attribute's value on the listing item is invalid, which causes it to be rejected by Amazon";
      - `CATALOG_ITEM_REMOVED`;
      - `SEARCH_SUPPRESSED`: "the catalog item is hidden from search results".
    - `enforcements.exemption.status` is `EXEMPT`, `EXEMPT_UNTIL_EXPIRY_DATE` (with `expiryDate`, "when the temporary exemption ends … and Amazon begins enforcing the listed actions") or `NOT_EXEMPT` ("Amazon has already taken the specified enforcement actions").
    - `summaries[].status` holds `BUYABLE` and `DISCOVERABLE` ("The listings item is visible to shoppers").
    - Issue `categories` include `QUALIFICATION_REQUIRED` ("Approval or qualification is required to list the product."), `INVALID_PRICE`, `MISSING_PRICE`, `DUPLICATE`, `INVALID_IMAGE` and `MISSING_IMAGE`, besides those in item 29.

    [official] (listingsItems_2021-08-01.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/listings-items-api-model/listingsItems_2021-08-01.json, read 2026-10-14)

### I. Gap fill: `item_type_keyword` versus `item_type_name`

47. RULE. `item_type_keyword` is the US classification lever. Other stores use `recommended_browse_nodes`.
    - "Amazon uses Item Type Keywords (used only for US MP) or recommended browse node (used for other MPs), Product Description, Bullet Points and other detail page elements to classify your products under the correct categories." [G1661 v15 r1]
    - The release notes word it as "`item_type_keyword` (US) and `recommended_browse_nodes` (other Amazon stores)". [SP-API Release Notes, January 28, 2026]
    - "Item Type Keywords, also known as ITK are primarily used in the U.S. store. They are a means of assigning ASINs to specific browse nodes. For example, U.S. ASINs that have an ITK value of "skin-care-products" are automatically assigned to the Skin care browse nodes." [Amazon search glossary, GF6B8ZPNY2AP72VV v2 r0]
    - ITK also constrains keyword search, not only browse: "Amazon may restrict shopping results to return products that belong to specific item type keyword when customers search in All Departments." Amazon's example: for "gluten free brownie mix", results may show only ITK "brownie mixes", and a brownie mix classified as "cooking-and-baking-supplies" "may not appear in shopping results for otherwise relevant queries". [Accurately classifying your products, G25771 v3 r1]
    - "ASINs that don't have a browse node assigned are not indexed by Amazon. To make the ASIN searchable, update a relevant and specific Item Type Keyword for your listing." "Any changes to an ASIN's offer, browse node, launch date can take up to 72 hours to reflect in shopping results." [My ASIN is unsearchable, GHGHDMU4X5K9QGCV v6 r0]
    - "By changing a product's item type keyword you can assign it to a different category". In Seller Central the edit is made "in the Item Type Keyword field". [Change a product's category or browse path, G201950630 v15 r0]

    [official] (pages as bracketed, all https://sellercentral.amazon.com/help/hub/reference/external/<id>; SP-API Release Notes, https://developer-docs.amazon/sp-api/docs/sp-api-release-notes.md; all read 2026-10-14. G1661, GF6B8ZPNY2AP72VV and GHGHDMU4X5K9QGCV are saved under the office's capture folder (outside this repository), and the quotes above were re-checked against those captures.)
48. RULE (shape only). `item_type_name` is a different attribute, and no Amazon page read here gives it a classification role.
    - It sits in the same "Product Identity" group as `item_type_keyword` in Amazon's example (item 6).
    - In Amazon's `getListingsItem` example it is a language-tagged display value: `"item_type_name": [{"language_tag": "en_US", "value": "TV", …}]`. `item_type_keyword` carries no `language_tag` there.
    - The keyword-attributes table gives `item_type_keyword` a "Length Limit (Bytes)" of 250 and the description "ITKs automatically assign products to browse nodes and are primarily used in the US". It does not list `item_type_name`.
    - The same page explains how keyword fields feed browse. "the browse assignment query of "style_keywords:sport-sandals" assigns products that have a style_keywords value of sport-sandals to the Sports Sandals browse node." It also says "Free text must match a valid value listed in the BTGs, so that it is possible to use the data in browse queries." (Keyword attributes explained, GF2C2L6RCFZGWBXC v4 r1, https://sellercentral.amazon.com/help/hub/reference/external/GF2C2L6RCFZGWBXC, re-opened live 2026-10-14.)
    - The 250-byte figure for `item_type_keyword` differs from the schema example's `maxLength` 500 (item 18). The binding write limit is read from `getDefinitionsProductType` at run time.
    - What `item_type_name` feeds (title assembly, a display label, search) is not stated in any page read. It is Open question 14.

    [official] (Manage Product Listings with the Selling Partner API, read 2026-10-14)

### J. Gap fill: size system, size class and size charts (apparel and footwear)

49. RULE. Apparel and footwear sizes are a set of conditional attributes, and they apply catalog-wide.
    - "Apparel size-specific attributes are catalog-wide rules that apply to all listings submissions, whether submitted through the SP-API or Seller Central." "Required or conditionally required values depend on the attributes selected for **Target Gender** and **Age Range Description** as well as the **Product Type**."
    - Footwear (all required unless noted):
      - Footwear Size System, "The footwear size system displays Amazon store-specific shoe sizes to customers onsite";
      - Shoe Size Age Group;
      - Shoe Size Class: Numeric, Numeric Range, Alpha, Alpha Range, Age, Age Range;
      - Shoe Size Width;
      - Shoe Size;
      - Shoe Size To Range, required for the range classes;
      - Shoe Size Gender and the "Opposite Gender values", required for adult Unisex, "to generate customer facing shoe sizes such as 7 UK Men/ 6 UK Women".
    - Apparel: "The attribute name prefix `Apparel Size` depends on the product type, for example `Shirt Size` for `SHIRT PT`, `Bottoms Size` for `PANTS`, `SHORTS` and `OVERALLS`." The attributes:
      - Apparel Size System (required), "used to display Amazon store-specific apparel sizes";
      - Apparel Size Class: Age, Alpha, Numeric;
      - Body Type and Height Type, both "Conditionally Mandatory";
      - Size Value;
      - Size to Value, optional, for ranges.
    - The page gives display names. The JSON names and the enums are read from the product type's schema (Open question 13).

    [official] (Guidance for Complex Attributes, https://developer-docs.amazon/sp-api/docs/listings-items-guidance-for-complex-attributes.md, updatedAt 2026-09-09, read 2026-10-14)
50. RULE. A non-standard apparel size costs refinements, and on mobile it can cost visibility.
    - Amazon's standard size formats come with "Syntax and letter case must be exactly as described in the examples below."
    - "Seller contributions containing apparel size that does not follow the guidelines of the store will be re-formatted to Amazon standard sizing. If a contribution is not visible due to an invalid apparel size, you will need to re-submit the contribution with a valid US apparel size".
    - "products with clean sizes are discoverable via size-specific browse refinements and show better sales conversion compared to products with size defects." Also: "ASINs with a valid size name had a higher percentage of Glance Views". No figure is given.
    - "If you provided non-compliant or unacceptable apparel sizes, customers may not be able to view your listings on the Amazon shopping mobile application but may still be able to view them while accessing Amazon on desktop."
    - The new attributes were enforced "beginning February 2021" across 26 product types, which the page lists from DRESS to HAT. `size_name` "will remain in the Amazon catalog, but will not be available in listing experiences". Amazon fills it from the new attributes.

    [official] (Apparel size standards, GZXM4PHSSX9YUT87 v6 r1, https://sellercentral.amazon.com/help/hub/reference/external/GZXM4PHSSX9YUT87; Apparel size standards FAQ, GQ2JFF7DLWVHU7YX v8 r1, https://sellercentral.amazon.com/help/hub/reference/external/GQ2JFF7DLWVHU7YX; both read 2026-10-14)
51. RULE. Size charts are a Brand Registry feature outside the listing attributes.
    - "Size charts are only applicable to listings that are Brand registered." They are made in the size chart self-service tool ("Catalog > Add size charts") from per-subcategory templates. A brand owner without access to the tool sends the filled template to Seller Support, and Amazon's team creates the chart. [G201842330]
    - "Size charts are displayed when a customer clicks the size chart link on the detail page." For a manufacturer size that differs from Amazon's valid sizes, sellers "are expected to convert the manufacturer size to an equivalent size from the valid sizes", and a size chart is "highly recommended". [Apparel size standards FAQ]
    - No SP-API operation for size charts appears in the pages read.

    [official] (Create a Size Chart for Your Products, G201842330 v2 r0, https://sellercentral.amazon.com/help/hub/reference/external/G201842330; Apparel size standards FAQ; both read 2026-10-14)

### K. Gap fill: the assigned browse node versus the Best Sellers Rank categories

52. RULE. The Catalog keeps the assigned classification and the rank categories in separate fields.
    - `summaries.browseClassification` is one "Classification (browse node) that is associated with the Amazon catalog item". `classifications` lists the item's classifications with `parent` chains.
    - `salesRanks[].classificationRanks[]` are "Sales ranks of an Amazon catalog item for a `marketplaceId`, grouped by classification": `classificationId`, `title` ("Name of the sales rank"), `link` ("Corresponding Amazon retail website URL for the sales category") and `rank`.
    - `displayGroupRanks[]` rank by "website display group".
    - Rank categories were added on 2022-05-18 ("Added browse classifications and website display groups to sales ranks").
    - The model does not say how the rank classifications are chosen, nor that they equal `browseClassification`.
    - Seller Central's Sales Rank FAQ names them. "Sales ranks are displayed for an ASIN with a sale record and if it has been assigned to the featured categories." "Featured categories are special browse nodes." "Sales ranks are not generated for all categories because not all of them are useful to our customers." Variations: "Variations handling depends on the Website Display Group (wdg) of the parent ASIN"; in some stores parent and child share one rank, in others each child is ranked. Amazon asks that child and parent sit in the same website display group and that the parent has "the right browse categories assigned to it or you might not see a sales rank". Cadence, for human readers: "we update best sellers list every hour, it can take up to 12 hours for an order to show the sales rank." It does not say how the featured categories are picked from the assigned node.

    [official] (catalogItems_2022-04-01.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/catalog-items-api-model/catalogItems_2022-04-01.json; SP-API Release Notes, May 18, 2022 entry; Sales Rank FAQ, G202059240 v2 r0, https://sellercentral.amazon.com/help/hub/reference/external/G202059240, capture capture `G202059240-v2`; all read 2026-10-14)
53. RULE and GUIDANCE. One node can sit on several paths, and refinements depend on the node.
    - "A node can have multiple paths." Amazon's example: node 2478444011 sits under both "Baby Products/…/Hats & Caps" and "Clothing, Shoes & Jewelry/…/Hats & Caps".
    - "Multiple browse node assignments are not supported except in the case of media ASINs and items such as unisex items."
    - "For the refinement to work correctly, it is important that the correct category node is assigned. Each browse tree guide template has a sheet named Refinements." [G201950630 v15 r0]
    - "Keyword search and browse-based search are done in different ways." Keyword search matches "the ASIN's attributes (for example, title, bullet points, product description, and so on) while browse-based search is dependent on the browse assignment of the ASIN." "High quality information in the three key product attributes (title, bullet points, and product description) is critical for a product's browse assignment."
    - "If your product is not listed within a browse node, it will not be available in both search and browse results."
    - "If you believe your product's Browse Node is incorrect, you can submit a request to update it using the Category update tool." [G1661 v15 r1]
    - Refinements read attribute valid values. "The search query, red dresses is constrained to show shopping results that are assigned to a dress browse node and to a red color refinement picker." "blue is a valid value, as used in the color browse refinement, for the catalog attribute Color name, whereas midnight blue is not a valid value." "Products must be assigned to at least one specific, relevant browse node in order to be searchable." [Amazon search glossary, GF6B8ZPNY2AP72VV v2 r0]
    - Latency for a node change: up to 72 hours, for human readers (item 47, My ASIN is unsearchable; item 31 for how the figures relate).

    [official] (Change a product's category or browse path, G201950630 v15 r0; Classify your products using Browse Tree Guides - BTG, G1661 v15 r1; Amazon search glossary, GF6B8ZPNY2AP72VV v2 r0; all https://sellercentral.amazon.com/help/hub/reference/external/<id>, read 2026-10-14)
54. RULE (Keepa's documentation). Keepa exposes the listed nodes, the rank nodes and the history of the main rank node apart from each other.
    - `categories`: "Array of Amazon category node IDs this product is listed in".
    - `salesRankReference`: "The category node id of the main sales rank". `salesRankReferenceHistory` "can be used to match historical sales ranks provided in the csv field to their reference category".
    - `salesRanks`: "Each key represents the categoryId of the rank".
    - `salesRankDisplayGroup`: "The categorization of products for which the primary sales rank is based on".
    - The fields for this gap fill's attributes: `unitCount` (`unitValue`, `unitType`, `eachUnitCount`; "to facilitate per unit pricing"), `numberOfItems`, `hazardousMaterials` (aspect/value pairs such as `united_nations_regulatory_id`), `batteriesRequired`, `batteriesIncluded`, `safetyWarning`.

    [official for Keepa's own data, not Amazon's] (Keepa Product Object, https://keepa.com/api-docs/product-object.html, read 2026-10-14)

### L. Gap fill: category gating and `QUALIFICATION_REQUIRED`

55. RULE. Gating shows up through two operations under two different names.
    - On an existing listing: the issue category `QUALIFICATION_REQUIRED`, "Approval or qualification is required to list the product." (item 46).
    - Before listing: `getListingsRestrictions` (`GET /listings/2021-08-01/restrictions`; parameters `asin`, `sellerId`, `marketplaceIds`, optional `conditionType`, `reasonLocale`, `productType`) returns `reasons[].reasonCode`:
      - `APPROVAL_REQUIRED`: "A path forward link will be provided that may allow Selling Partners to remove the restriction.";
      - `ASIN_NOT_FOUND`;
      - `NOT_ELIGIBLE`: "No path forward link will be provided to remove the restriction."
    - The model describes `productType` this way: "When provided with the brand name, the API evaluates GTIN exemption restrictions in addition to brand restrictions for the specified product type". The model has no brand parameter (Open question 16).
    - The Listings Restrictions API page: "Each Amazon store ID in a request counts as a separate request against the rate limit". The role is Product Listing. "If no restrictions exist, you can then call the Listings Items API to create offer-only listings."

    [official] (listingsRestrictions_2021-08-01.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/listings-restrictions-api-model/listingsRestrictions_2021-08-01.json; Listings Restrictions API, https://developer-docs.amazon/sp-api/docs/listings-restrictions-api.md, updatedAt 2026-09-29; Get listings restrictions for an item in the catalog, https://developer-docs.amazon/sp-api/docs/get-listings-restrictions.md; listingsItems_2021-08-01.json; all read 2026-10-14)
56. RULE. Approval is granted per ASIN, brand, brand-in-category, category or sub-category, and it can change after listing.
    - The kinds of restriction: "Individual ASINs", "Brands", "Brands within a specific category", "Categories", "Sub-categories". "Some products require multiple approvals."
    - Review time: "Wait for review (2-7 business days)". "Your account does not qualify" means "This decision cannot be appealed".
    - Selling privileges can change when "New restrictions are added to existing products" or when "Product safety or compliance requirements change".
    - Categories "with enhanced safety listing requirements" also need commercial liability insurance with "at least USD 1 million per occurrence and aggregate".
    - The enhanced-safety list "changes as Amazon adds new categories, and it does not cover all products with these requirements". It currently names children's products, consumable and ingestible products, fire-related products, general household devices, home medical devices, lithium battery products, outdoor power and heating equipment, personal safety equipment, sleep products, transport-related products, and water and marine safety products.

    [official] (Categories and products that require approval, G200333160 v44 r0, https://sellercentral.amazon.com/help/hub/reference/external/G200333160; Product categories with enhanced safety listing requirements, G4RUG6EAT2ZLVSRT v1 r1, https://sellercentral.amazon.com/help/hub/reference/external/G4RUG6EAT2ZLVSRT; both read 2026-10-14)

### M. Gap fill: Amazon's attribute page

57. GUIDANCE and RULE. Amazon's own "Attributes guide" ties attributes to search, filters and the assistant.
    - "Complete and accurate attributes: Improve your product's visibility in search results and enable customers to filter results to find your product." They also "Enable Rufus (Amazon's AI shopping assistant) to provide more accurate product information to customers." The page still says "Rufus", although `elements/bullet-points.md` records the 2026-05-13 rename to Alexa for Shopping.
    - Seller Central shows three attribute views: "Required", "Recommended" ("important for your product category") and "All".
    - "Use only templates downloaded within the last 90 days to ensure they include the latest attribute requirements." The template version is in cell B1. Amazon notes that unit count "consists of both a number value and a unit count type".
    - The page's error table: 90057 (value not in the valid list), 90220 (missing required), 90225 (character limit), 90248 (field forbidden by a precondition), 97779 ("The generic keywords exceed our length limit of 200 bytes"), 99001 and 99010 (conditional group missing or conflicting).
    - The 97779 figure of 200 bytes conflicts with the 249 bytes / "less than 250 bytes" on Keyword attributes explained and Optimize your product discoverability. `elements/search-terms.md` owns that conflict and has recorded 97779 only from an amazon.in staff reply. This page is a second, US source for it. The error has its own US page too, "Error 97779" (GR7SLAHMDLBSSDHP v1 r2, https://sellercentral.amazon.com/help/hub/reference/external/GR7SLAHMDLBSSDHP, read 2026-10-14). Its message reads "Please reduce your generic keyword length to less than ${max_character_limit} bytes", and its fix says "Review the feed processing summary report for max character limit for generic keyword. Amazon limits the length to 200 bytes." So the limit is a placeholder in the message and 200 in the prose. A submission-time limit of 200 and an indexing limit of 249/250 can both hold. Which applies to which route is unsettled (`elements/search-terms.md` Open question 13).
    - **Amazon's own sources disagree on the `generic_keyword` figure, and this file does not pick one.** 200 bytes: Attributes guide (GBWHYLJ7NNQMXBAQ) and Error 97779 (GR7SLAHMDLBSSDHP). 249 bytes in the table and "less than 250 bytes" in the prose: Keyword attributes explained (GF2C2L6RCFZGWBXC v4 r1, capture capture `GF2C2L6RCFZGWBXC-v4`). "less than 250 bytes": Optimize your product discoverability (G10471 v13, capture capture `G10471-v13`). `elements/search-terms.md` records further values in schema copies (`maxUtf8ByteLength`) and in the `90225` troubleshooting example. The binding write limit is read at run time from `generic_keyword`'s `maxUtf8ByteLength` and `maxLength` in `getDefinitionsProductType` for the product type and store, and a write is checked with `VALIDATION_PREVIEW`. The help-page figures are for human readers.

    [official] (Attributes guide, GBWHYLJ7NNQMXBAQ v3 r2, https://sellercentral.amazon.com/help/hub/reference/external/GBWHYLJ7NNQMXBAQ, read 2026-10-14)

## What practitioners add

- **Trutz Fries (AMALYTIX), "Amazon Categories and Product Type: How It's All Related", 2025-05-26.** [opinion] (https://www.amalytix.com/en/knowledge/seo/amazon-categories-product-type, read 2026-10-14)
  - The product type "determines which fields in the catalog can or must be filled in".
  - "Note that a product should always be classified in the lowest category."
  - "The category stored in Seller Central does not have to match the category displayed in the frontend."
  - Refinements show only if specified in the Browse Tree Guide; "Otherwise, Amazon will not display your products if the customer uses these search restrictions."
  - "Some sellers place their products in small but inappropriate categories to gain an advantage over competitors"; "Refrain from doing so because Amazon can reject the placement".
  - "Once the product is uploaded, you cannot change the 'Product type' field." The workaround offered: "delete the product, wait 24 hours and create it again", with the same EAN and ASIN.
  - **Disagreements.** With Amazon staff (item 16), who say the product type can sometimes be updated. With Amazon's FAQ (item 12), where Amazon itself switches the type. Fries's account is the seller-side view of Seller Central's edit screens, not of the API.
- **AMALYZE, "Finding Amazon synonyms from the category browse node", undated (© 2026).** [opinion] (https://amalyze.com/resources/guides/listing/amazon-listing-seo-synonyms-category, read 2026-10-14)
  - "every filter label is a controlled-vocabulary term Amazon has decided shoppers use".
  - Filter values "map directly to attributes you should fill in your flat-file and reference verbatim in bullets".
  - The deepest node name is a useful synonym source.
  - It also claims the algorithm indexes against filter words, with no evidence given. Treat that as unsupported.
- **Ellen Sipp-Paris (eComEngine), "How to Use the Amazon Listing Quality Dashboard", published 2021-01-12, updated 2025-02-21.** [opinion] (https://www.ecomengine.com/blog/amazon-listing-quality-dashboard, read 2026-10-14)
  - The dashboard "identifies items that are missing important product information" and "shows recommendations on which attributes you need to provide".
  - A seller can tell Amazon an attribute does not apply.
  - An "at-risk" tab lists data needed "before a certain date" to prevent suppression.
  - Since early 2023 it shows a "potential sales lift" estimated from comparable sellers.
  - "Customers often filter search results using specific product attributes."
  - This is the only source read for the dashboard; the dashboard's own Amazon help page was not read in this session. Amazon's "Listing quality" page (G200786710 v5 r1, capture capture `G200786710-v5`, read 2026-10-14) does not mention the dashboard or a sales-lift figure. It says listing quality "is determined by seven key components: title, bullet points, attributes, images, video, A+ Content, and search optimization", that "Attributes improve search filtering and help customers compare products", and it sends sellers to the "Enhance" tab, which "provides AI-generated suggestions". The search glossary still points to "the Listing Quality Dashboard" for continuous audits. No SP-API operation returns the dashboard's sales-lift figure in the pages read.
- **Shaival Choksi (Your Seller Agency), "How to Make Your Products Visible in Amazon Search Filters", dated "Dec 5", year not shown.** [opinion] (https://yourselleragency.com/blog/make-products-visible-amazon-search-filters, read 2026-10-14)
  - "If you haven't specified these attributes in your listing, your product won't show up in these filtered results."
  - The example is a chocolate filtered by occasion.
  - The fix route is the Listing Quality Dashboard, filling "item type, product form, or usage occasions".
- **Marissa Incitti (Feedvisor), "Amazon Search: How Product Search and Filters Work for Buyers and Sellers", updated 2026-04-23.** [opinion] (https://feedvisor.com/university/advanced-search/, read 2026-10-14)
  - "Category-specific filters" are "Size, color, material, and other attributes (vary by category)".
  - "A10" is a community term Amazon "has never officially used".
  - It cites no Amazon source. It is weak on mechanism and recorded only as a common practitioner frame.
- **Sellers in Seller Forums.** [opinion]
  - A seller reports that `Item_Type_Keyword` edits went through while the category listings report still showed the old `feed_product_type`. They suspected this broke valid variations ("How to Change Feed-Product-Type", Seller_0qyRtqm32cQSi, "2 years ago", read 2026-10-14).
  - A seven-year-old thread on "Refine by" filters got no mechanism, only "a comprehensive study of the BTGs" and a warning that templates lag ("Product Attributes / Feature Filters", https://sellercentral.amazon.com/seller-forums/discussions/t/fbca25c48655ed8811d2af5718590a6a, read 2026-10-14).
- **Where practitioners agree with each other.** Attributes drive filters; the deepest accurate node is right; Seller Central's stored category and the storefront's can differ.
- **Where they go beyond Amazon.** Claims that attributes or nodes raise ranking in keyword search. No Amazon page read says so for search ranking. Amazon's words cover placement and findability (item 17), browse-node correctness (item 27) and "listing quality" contributing (item 34).

**Gap fill 2026-10-14.**
- **Brian Connolly (Jungle Scout), "Amazon Best Sellers Rank (BSR) Meaning: Everything You Need to Know in 2024", 2023-12-08.** [opinion] (https://www.junglescout.com/blog/amazon-best-sellers-rank/, read 2026-10-14)
  - "the BSR only applies to how a product sells in a particular category." "Since many products sell in multiple categories on Amazon, it is possible for an item to have more than one BSR." The example is one product ranked 2,000 in Kitchen & Dining and 20,000 in another category.
  - Rank is "updated hourly". "The product's position on Amazon's SERP has no bearing on the product's current Amazon Best Sellers Rank."
  - **Fit with Amazon.** This matches the Catalog's list of `classificationRanks` (item 52). The page does not say which node the rank categories come from, or how they relate to the assigned browse node. The hourly cadence matches Amazon's Sales Rank FAQ ("we update best sellers list every hour", item 52), which also says ranks are generated only for "featured categories". The FAQ says nothing about search position, so Jungle Scout's "no bearing" line stays practitioner opinion.
- **Amazon's own forum announcements on unit count (2021).** [official, forum staff; dated] Both are shown as "5 years ago".
  - News_Amazon, "New unit count or price per unit requirements for product listings" (https://sellercentral.amazon.com/seller-forums/discussions/t/86469fa85c808b17933893cbed640430, read 2026-10-14):
    - "Starting September 30, 2021, we will require all product listings for the Product Types listed in the price per unit requirements table to include the unit_count and unit_count_type attributes, which are used to calculate and display price per unit (PPU)."
    - "All new listings, or any updates to existing listings, submitted without unit count information will no longer be accepted after September 30, 2021. This includes all product-level data submissions, whether through excel templates, Seller Central, or feeds."
  - Jeniffer_Amazon, "Change to Unit Count attribute" (https://sellercentral.amazon.com/seller-forums/discussions/t/65df0faf76fc57564ccec20ac338ea46, read 2026-10-14):
    - "Starting 23th July, 2021, products sold under Beauty, Grocery, Health_Personal_Care, Food, Beverage, Cleaning_Product, and Pet Supplies will require your feeds to include the unit count and unit_count_type attributes."
    - The 2020 requirement in templates covered "the US, Spain, UK, France, Germany, Italy, and India". The post adds, "This makes these required attributes across all listing methods."
- **Sellers in the same unit-count thread.** [opinion] One seller (handle not copied) asks about decade-old listings "with a unit count of 1 but are actually a pack of 50". They write: "This field has been locked for years and I have tried many times to update the information via seller support but always get denied." Another reports items "suppressed for missing that information when it is NOT". Another asks for the new mandatory fields in inventory reports. These are seller reports from 2021, not Amazon statements. They are consistent with item 39, where Amazon derives Size and the seller cannot set it directly.

Not reached: Jungle Scout, Helium 10, Carbon6, Perpetua and SellerApp pages on browse nodes or attributes. Guessed URLs returned 404, and the shared web-search budget ran out twice during this session. See Open questions. In the gap fill, Jungle Scout's BSR article (above) was reached. A guessed Jungle Scout resources URL and Helium 10's `/blog/gpsr/` returned 404, and no practitioner page on unit count, compliance attributes or apparel size attributes was found without search.

## Published research

- **Yu, Liu, Maia, Cao, Li, Gao, Song, Goutam, Zhang, Yin, Li, "COSMO: A large-scale e-commerce common sense knowledge generation and serving system at Amazon", SIGMOD/PODS 2024.** [research] (https://www.amazon.science/publications/cosmo-a-large-scale-e-commerce-common-sense-knowledge-generation-and-serving-system-at-amazon; Amazon Science blog "Building commonsense knowledge graphs to aid product recommendation", Yu and Li, 2024-05-10, https://www.amazon.science/blog/building-commonsense-knowledge-graphs-to-aid-product-recommendation; read 2026-10-14)
  - **Finding (narrow).** COSMO prompts an LLM with query–purchase pairs and co-purchase pairs to propose commonsense relations (the blog names `usedFor`, `capableOf`, `isA`, `cause`, later codified as forms such as `used_for_function`, `used_for_event`, `used_for_audience`). Candidates are winnowed by heuristics and then by a classifier trained on human annotations that scores plausibility and typicality.
  - The abstract says "COSMO has been deployed in Amazon search applications such as search navigation", and that "Both offline and online A/B experiments demonstrate our proposed system achieves significant improvement" (no online figure in the abstract). The blog does not mention the search-navigation deployment.
  - Offline on the Shopping Queries data, the COSMO-based model gained 60% macro-F1 over the best baseline with frozen encoders, and 28% with fine-tuning. Those figures are the paper's.
  - **Transfer.** The lead said COSMO uses seller attributes. The sources say it is built from shopper behaviour, and uses the product graph's categories only to prune noisy co-purchase pairs. It tells an operator that Amazon models intent such as audience, use and occasion as relations. It does not say which listing field feeds them.
- **Dong et al. (22 authors incl. Faloutsos, McCallum, Han), "AutoKnow: Self-Driving Knowledge Collection for Products of Thousands of Types", KDD 2020.** [research] (arXiv:2006.13473, https://arxiv.org/abs/2006.13473, read 2026-10-14)
  - **Finding.** Amazon's product knowledge graph faces "sparsity and noise of structured data for products" across "millions of product types and thousands of attributes".
  - AutoKnow automates taxonomy construction, property identification, extraction, anomaly detection and synonym discovery. It was "operational in collecting product knowledge for over 11K product types".
  - **Transfer.** Amazon fills and corrects attributes itself, so the Catalog's value can differ from the seller's for reasons unrelated to the seller.
- **Zheng, Mukherjee, Dong, Li, "OpenTag: Open Attribute Value Extraction from Product Profiles", KDD 2018.** [research] (arXiv:1806.01264, read 2026-10-14)
  - **Finding.** Missing attribute values can be extracted from titles and descriptions by sequence tagging, with about 150 annotated samples, at a reported 83% F-score.
  - **Transfer.** Indirect. Amazon has the means to infer attributes from prose, so an empty structured field is not proof the value is absent from Amazon's view. The paper does not measure any search or sales effect.
- **Zhang, Li, Cao, Luo, Wu, Lu, Song, Yin, Zhao, Yang, "QUEACO: Borrowing Treasures from Weakly-labeled Behavior Data for Query Attribute Value Extraction", CIKM 2021.** [research] (arXiv:2108.08468, read 2026-10-14)
  - **Finding.** Attribute values can be recognised in shopper queries and normalised to canonical product values using weak behavioural labels.
  - **Transfer.** It shows the query side of attribute matching is studied at scale. The abstract names no deployment and no effect size, so it supports no claim about ranking.
- **Reddy et al., "Shopping Queries Dataset: A Large-Scale ESCI Benchmark for Improving Product Search", arXiv:2206.06588, 2022 (KDD Cup 2022).** [research] (https://arxiv.org/abs/2206.06588; https://github.com/amazon-science/esci-data; read 2026-10-14)
  - About 130k queries and 2.6M human relevance judgements, labelled Exact / Substitute / Complement / Irrelevant.
  - Product fields: title, description, bullet points, brand, color.
  - **Transfer.** Amazon's public relevance benchmark carries only `brand` and `color` as structured fields. It is evidence of what Amazon released, not of what production ranking uses.
- **Sorokina and Cantú-Paz, "Amazon Search: The joy of ranking products", SIGIR 2016 (talk).** [research] (https://www.amazon.science/publications/amazon-search-the-joy-of-ranking-products, read 2026-10-14)
  - **Finding.** Ranking is learned "within categories", with separate rankings blended in All Product Search, and category-specific algorithms for books and fashion.
  - **Transfer.** Category membership shapes which ranking applies. It is ten years old and states no attribute features.
- **Chen and Yao, "Sequential Search with Refinement: Model and Application with Click-Stream Data", Management Science 63(12), 2017, pp. 4345–4365.** [research] (Crossref record, https://api.crossref.org/works/10.1287/mnsc.2016.2557, read 2026-10-14; the publisher page returned 403)
  - **Finding** on a hotel-booking site: refinement tools (sort and filter) increased searches by about 33% and the utility of purchased products by about 17%, and led to a less concentrated market.
  - **Transfer.** A different vertical. It supports only the general point that filters change which products are considered.
- **Kim, Albuquerque, Bronnenberg, "Online Demand Under Limited Consumer Search", Marketing Science 29(6), 2010, pp. 1001–1023.** [research] (Crossref record, https://api.crossref.org/works/10.1287/mksc.1100.0574, read 2026-10-14)
  - **Finding** from Amazon.com camcorder search data: consumer search is typically limited to about 10–15 options.
  - **Transfer.** Old, and one category. It supports why being in the filtered or browsed set matters, since a product outside the small considered set is not weighed at all.

No peer-reviewed study was found that measures the effect on an Amazon listing's sales of filling a structured attribute or correcting a browse node. The only figure of that kind is Amazon's own Listing Quality Dashboard "potential sales lift", reported second-hand by eComEngine.

Gap fill 2026-10-14: no published research was read on price-per-unit display, compliance attributes, size normalisation or BSR categories. The web-search budget was spent, and no paper was known by URL. Amazon's own claims without figures stand in for it: valid Size values "had higher purchases" (item 39), and clean apparel sizes "show better sales conversion" and "a higher percentage of Glance Views" (item 50). They are vendor claims, not measured studies.

## Stable enough for a skill

- A listing's attribute names, required attributes, allowed values and length limits are defined by its product type's schema, retrieved with `getDefinitionsProductType` for that store. Writes are validated against it. (Product Type Definitions API; Building Listings Management Workflows Guide)
- The schema distinguishes character limits (`maxLength`) from UTF-8 byte limits (`maxUtf8ByteLength`), and value counts (`maxUniqueItems`) from item counts. Which one applies is read from the schema. (Meta-Schema v1)
- `requirementsEnforced=NOT_ENFORCED` is the schema to validate a partial (PATCH) payload against. `ENFORCED` is for a full payload. (definitionsProductTypes_2020-09-01.json)
- The response holds links that expire (the validity period is stated in the model) and checksums. The version and checksum identify which schema a write was checked against. (Retrieve a Product Type Definition; model)
- Amazon updates product-type requirements on a recurring release schedule and sometimes off it. A schema read in an earlier session is not proof of today's rules. (Listings APIs FAQ; SP-API Product Metadata Updates)
- Amazon may switch a listing's product type to a recommended one after submission, based on the attributes the seller provided, "such as, title, product description, and bullet points". The new type's required attributes then appear as missing. (Listings APIs FAQ; Warning code 18367: Product type modified by Amazon)
- `item_type_keyword` places a new ASIN in Amazon's product graph. `recommended_browse_nodes` names the store section. The valid values are the `enum` the schema lists for that product type and store; the schema's `anyOf` also admits a free string, so passing schema validation does not prove the value is valid, and Amazon rejects an unrecognised value at processing (`4000001`, `101158`). The most specific accurate value is Amazon's guidance. (Get recommended browse nodes or item type keywords; Listings Items API Issues Troubleshooting)
- A wrong or missing browse node can make a product unfindable in browse. Amazon's staff list browse-node correctness among the first checks when a listing is missing from search. (same; Seller Forums staff guide)
- Refinements are defined per browse node in Amazon's browse tree data, with the attribute each refinement reads and its accepted values. (Browse Tree Reports; BrowseTreeReport.xsd)
- Amazon's classification of an ASIN (browse classification, product type, rank categories) is read from Catalog Items, which may differ from what the seller submitted. (catalogItems_2022-04-01.json; Listings APIs FAQ)
- Attribute names remembered from flat files or from training data can differ from the JSON schema's names. Only the schema's names are valid in a Listings Items write. (Mapping product attributes; Submit media attributes)
- Completeness gaps can arrive as `issues` with severity `WARNING` naming the missing `attributeNames`, not only as errors. (Manage Product Listings with the Selling Partner API)
- Amazon corrects and fills attributes itself, and brand owners' contributions take precedence. A seller's submitted value is one input to the Catalog value. (Using LLMs to improve Amazon product listings; Listings APIs FAQ)
- (Gap fill.) In the product types of Amazon's price-per-unit table, `unit_count` with a valid `unit_count_type` is required. Listings missing them can be removed from search after a deadline shown in the Listing Quality Dashboard. Amazon decides per product type whether price per unit is displayed. (Price per unit requirements; Conditional Unit Count …)
- (Gap fill.) In size-normalised product types the shown Size is derived from `unit_count`, `number_of_items`, net content, weight and dimensions. To change it, change those attributes. (Size normalization FAQ)
- (Gap fill.) Compliance attributes (dangerous goods, batteries, safety data sheet, Prop 65, CPSIA, and in the EU the GPSR manufacturer, Responsible Person and safety information) are declared by the seller. Amazon will not infer them ("Amazon cannot determine this information for you"). Missing or wrong values block listing creation, FBA conversion or sale. They do not change ranking. (G201371860; G200292910; G202141960; GPSR pages)
- (Gap fill.) An issue's `enforcements.actions` names what Amazon did (`LISTING_SUPPRESSED`, `ATTRIBUTE_SUPPRESSED`, `CATALOG_ITEM_REMOVED`, `SEARCH_SUPPRESSED`), and `exemption.expiryDate` names when a grace period ends. (listingsItems_2021-08-01.json)
- (Gap fill.) `item_type_keyword` assigns US ASINs to browse nodes, and in All Departments search it can restrict which results show. Other stores classify through `recommended_browse_nodes`. (G1661; GF6B8ZPNY2AP72VV; G25771)
- (Gap fill.) Best Sellers Rank categories (`salesRanks[].classificationRanks`) are a separate field from the assigned `browseClassification`. Amazon calls them "featured categories", "special browse nodes", and generates ranks only for those. One node can sit on several browse paths, and one item can carry several ranks. (catalogItems_2022-04-01.json; G201950630; Sales Rank FAQ G202059240)
- (Gap fill.) Gating is checked before listing with `getListingsRestrictions` (`APPROVAL_REQUIRED` with a path forward, or `NOT_ELIGIBLE` with none). On an existing listing it appears as the issue category `QUALIFICATION_REQUIRED`. (listingsRestrictions_2021-08-01.json; listingsItems_2021-08-01.json)
- (Gap fill.) Apparel and footwear sizes are conditional attribute sets (size system, class, value, range, body and height type) whose requirements depend on target gender, age range and product type. A non-standard size loses size refinements. (Guidance for Complex Attributes; Apparel size standards FAQ)

## What cx must read at run time

- **The listing's product type and submitted classification.** Read `getListingsItem` on `{sellerId}/{sku}` with `includedData=summaries,attributes,issues,productTypes`. Then read:
  - `summaries[].productType` and `productTypes[]`;
  - submitted `item_type_keyword`, `recommended_browse_nodes` and every structured attribute;
  - every issue's `code`, `severity`, `categories` (incl. `MISSING_ATTRIBUTE`, `INVALID_ATTRIBUTE`, `PRODUCT`/`LISTING`) and `attributeNames`.
- **The rules for that product type.** Call `getDefinitionsProductType` with:
  - `productType`, one `marketplaceIds`, and `sellerId` (brand values are seller-specific);
  - `requirements=LISTING`, or `LISTING_PRODUCT_ONLY` for content-only work;
  - `requirementsEnforced=NOT_ENFORCED` for a PATCH, `ENFORCED` for a full put;
  - `parentageLevel` matching the item;
  - `locale`.

  Download the schema from `schema.link.resource` before it expires. Record `productTypeVersion.version` and `schema.checksum` in the change log. Read the specifics from the schema: `required`, the conditionals (`allOf`/`if`/`then`), `enum` with `enumNames`, `enumDeprecated`, `$lifecycle`, `maxLength`/`maxUtf8ByteLength`, `maxUniqueItems`, `selectors`, and `editable`. For classification, read the `enum`/`enumNames` of `item_type_keyword` and `recommended_browse_nodes`.
- **Whether the product type is right.** Call `searchDefinitionsProductTypes` with `itemName=<the listing's title>` (not with `keywords` at the same time) and `marketplaceIds`. Compare its recommendation with the listing's current type.
- **Amazon's view.** Call `getCatalogItem` on `<ASIN>` with `includedData=summaries,attributes,classifications,productTypes,salesRanks`. Read `summaries.browseClassification`, `classifications[].classifications[]` (with the `parent` chain), `productTypes`, `salesRanks[].classificationRanks` and the reconciled attribute values. Diff each against the submission. For the node the Customer Feedback data is keyed on: `getItemBrowseNode`.
- **Which refinements a node has and which attribute each reads.** door.md's browse-tree report entry (`GET_XML_BROWSE_TREE_DATA`; door.md on origin/main had no such entry when this file was verified, so it must be added there before a skill points to it), through `createReport` → `getReport` → `getReportDocument`, scoped with `BrowseNodeId` to the product's node. Read `refinementsInformation/refinementName/refinementField/refinementAttribute` and `acceptedValues`. Diff it against the previous copy taken with the same options.
- **Competitors' classification and filled attributes.** Two sources:
  - Keepa product fields:
    - classification: `type` (the item-level product type string, not the integer `productType`), `itemTypeKeyword`, `categories`, `categoryTree`, `rootCategory`, `salesRankReference`, `websiteDisplayGroup`;
    - attributes: `color`, `size`, `style`, `pattern`, `material`/`materials`, `itemForm`, `includedComponents`, `specificUsesForProduct`, `recommendedUsesForProduct`, `targetAudienceKeyword`, `specialFeatures`, `unitCount`.

    (Keepa Product Object, https://keepa.com/api-docs/product-object.html, read 2026-10-14; Keepa's own `productType` integer 0–5 is Keepa's code for what data the record holds — standard, downloadable, ebook, inaccessible, no data, variation parent — per the Keepa skill's product-file reference; Keepa's page says it "Must always be evaluated first. Determines what data for the product is available.")
  - `searchCatalogItems` with `keywords` and `classificationIds`, whose `refinements.classifications[].numberOfResults` sizes a node.
- **Whether the rules changed.** The schema `checksum` and `productTypeVersion` compared with the last read. `PRODUCT_TYPE_DEFINITIONS_CHANGE` and `ITEM_PRODUCT_TYPE_CHANGE` exist but need an EventBridge destination. Without one, a re-read is the only detector.
- **(Gap fill) Suppression and enforcement on the listing.** From the same `getListingsItem` `issues`, read `enforcements.actions[].action` (`SEARCH_SUPPRESSED` and `LISTING_SUPPRESSED` above all), `enforcements.exemption.status` and `expiryDate`, and `categories` (`QUALIFICATION_REQUIRED`, `INVALID_PRICE`). Also read whether `summaries[].status` holds `DISCOVERABLE` and `BUYABLE`. An exposure drop with a `SEARCH_SUPPRESSED` issue is an attribute problem, not a copy problem.
- **(Gap fill) Unit count, size and compliance attributes for the product type.** In the schema, read whether `unit_count` (with its type), `number_of_items`, `item_form` and the net-content attributes are `required` or conditionally required, and their enums. Read the compliance group's properties (the "Safety & Compliance" property group) and the apparel or footwear size attributes, with their real JSON names, from the same schema. Then compare the listing's values with them. No Amazon page read here gives the JSON names of the GPSR or size attributes, so they are read only from the schema.
- **(Gap fill) Gating before a new offer.** `getListingsRestrictions` with `asin`, `sellerId` and one `marketplaceIds` (each store counts as a request), plus the optional `conditionType` and, when known, `productType`. Read `reasons[].reasonCode` and `links`. door.md's own entry for this operation, if any, governs how cx calls it. This file only names what to read.
- **(Gap fill) Rank categories versus the assigned node.** Read from Catalog `salesRanks[].classificationRanks[]` (`classificationId`, `title`, `rank`) and `displayGroupRanks[]`, next to `summaries.browseClassification` and `classifications`. From Keepa, read `salesRankReference`, `salesRankReferenceHistory`, `salesRanks` keys and `categories`. In effect-review, watch the rank entry whose `classificationId` stayed the same across the window. A rank whose category changed is not a comparable series.
- **(Gap fill) Competitors' unit and compliance fields.** Read Keepa `unitCount`, `numberOfItems`, `hazardousMaterials`, `batteriesRequired`/`batteriesIncluded` and `safetyWarning`. They show how comparable listings declare units and hazards.
- **Before any write.** `patchListingsItem` with `mode=VALIDATION_PREVIEW` returns issues and changes nothing. Its limits and its "small number of listings" scope are in `angles/listing-content-and-health.md` and the Listings rate-limit page.

## Pages read

| Page name | URL | Date read | What it gave |
|---|---|---|---|
| Product Type Definitions API v2020-09-01 Use Case Guide | https://developer-docs.amazon.com/sp-api/docs/product-type-definitions-api-v2020-09-01-use-case-guide (redirected to developer-docs.amazon) | 2026-10-14 | unreachable: "Page Not Found"; content now lives in the tutorials below |
| SP-API llms.txt index | https://developer-docs.amazon/sp-api/llms.txt | 2026-10-14 | Page list incl. browse-node and recommendation tutorials |
| Product Type Definitions API | https://developer-docs.amazon/sp-api/docs/product-type-definitions-api.md | 2026-10-14 | JSON Schema 2019-09, validation is submitter's, parentageLevel |
| Retrieve a Product Type Definition | https://developer-docs.amazon/sp-api/docs/retrieve-a-product-type-definition.md | 2026-10-14 | 7-day links, sellerId, parentageLevel values |
| Search available Product Type Definitions | https://developer-docs.amazon/sp-api/docs/search-available-product-type-definitions.md | 2026-10-14 | Operation only |
| Get Product Type Definition recommendations | https://developer-docs.amazon/sp-api/docs/get-product-type-definition-recommendations.md | 2026-10-14 | itemName recommendation basis (page partly read) |
| Get recommended browse nodes or item type keywords | https://developer-docs.amazon/sp-api/docs/get-recommended-browse-nodes-or-item-type-keywords.md | 2026-10-14 | Definitions, "most specific accurate term", LUGGAGE examples |
| Amazon Product Type Definitions Meta-Schema (v1) | https://developer-docs.amazon/sp-api/docs/product-type-definition-meta-schema.md | 2026-10-14 | 12 custom keywords |
| definitionsProductTypes_2020-09-01.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/product-type-definitions-api-model/definitionsProductTypes_2020-09-01.json | 2026-10-14 | Parameters, enums, response shapes, checksum |
| Notification Type Values | https://developer-docs.amazon/sp-api/docs/notification-type-values.md | 2026-10-14 | ITEM_PRODUCT_TYPE_CHANGE, PRODUCT_TYPE_DEFINITIONS_CHANGE, LISTINGS_ITEM_ISSUES_CHANGE, BRANDED_ITEM_CONTENT_CHANGE |
| Listings APIs FAQ | https://developer-docs.amazon/sp-api/docs/listings-apis-faq.md | 2026-10-14 | Product type switch, monthly updates, precedence, 15-minute backend |
| Listings Items API Issues Troubleshooting | https://developer-docs.amazon/sp-api/docs/listings-items-api-issues-troubleshooting.md | 2026-10-14 | Codes 90220, 4000001-3, 90244, 101158, 4005018/19, 4005033 |
| Building Listings Management Workflows Guide | https://developer-docs.amazon/sp-api/docs/building-listings-management-workflows-guide.md | 2026-10-14 | itemName search, caching, schema validation, PRODUCT root type |
| Manage Product Listings with the Selling Partner API | https://developer-docs.amazon/sp-api/docs/manage-product-listings-guide.md | 2026-10-14 | Property groups, relevant_attributes WARNING example |
| Mapping product attributes to the Listings Items API and JSON-based feeds | https://developer-docs.amazon/sp-api/docs/mapping-product-attributes.md | 2026-10-14 | Flat-file end 2025-07-31, naming differences |
| Guidance for Complex Attributes | https://developer-docs.amazon/sp-api/docs/listings-items-guidance-for-complex-attributes.md | 2026-10-14 | Size attributes depend on product type |
| Partially update a listing | https://developer-docs.amazon/sp-api/docs/partially-update-a-listing.md | 2026-10-14 | Whole-attribute patches; nothing on changing productType |
| Create or fully update a listing | https://developer-docs.amazon/sp-api/docs/create-a-listing.md | 2026-10-14 | Put replaces; LISTING_OFFER_ONLY drops bullets |
| Submit media attributes | https://developer-docs.amazon/sp-api/docs/submit-media.md | 2026-10-14 | JSON image attribute names |
| SP-API Product Metadata Updates | https://developer-docs.amazon/sp-api/docs/sp-api-metadata-updates.md | 2026-10-14 | Monthly release list |
| SP-API Release Notes | https://developer-docs.amazon/sp-api/docs/sp-api-release-notes.md | 2026-10-14 | 2026-01-28 tutorial, 2026-05-27 parentageLevel, 2026-09-30 PRODUCT/LISTING categories |
| listingsItems_2021-08-01.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/listings-items-api-model/listingsItems_2021-08-01.json | 2026-10-14 | Patch/put bodies, requirements enum, issue categories |
| catalogItems_2022-04-01.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/catalog-items-api-model/catalogItems_2022-04-01.json | 2026-10-14 | classifications, browseClassification, productTypes, salesRanks, refinements |
| Search catalog items | https://developer-docs.amazon/sp-api/docs/search-catalog-items.md | 2026-10-14 | 1,000-result cap |
| Browse Tree Reports | https://developer-docs.amazon/sp-api/docs/report-type-values-browse-tree.md | 2026-10-14 | GET_XML_BROWSE_TREE_DATA, options, node fields, diff advice |
| BrowseTreeReport.xsd | https://images-na.ssl-images-amazon.com/images/G/01/mwsportal/doc/en_US/Reports/XSDs/BrowseTreeReport.xsd | 2026-10-14 | refinementAttribute, acceptedValues per node |
| customerFeedback_2024-06-01.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/customer-feedback-api-model/customerFeedback_2024-06-01.json | 2026-10-14 | getItemBrowseNode |
| Seller Central help G1661 (Browse Tree Guides, by ID), plain fetch | https://sellercentral.amazon.com/help/hub/reference/external/G1661 | 2026-10-14 | This route returns only the landing page. The page itself was read through the content call: see the G1661 v15 row below and capture `G1661-v15` |
| Seller Central help 1661 (legacy form), plain fetch | https://sellercentral.amazon.com/gp/help/external/1661 | 2026-10-14 | This route returns only the landing page; same page as G1661 v15 |
| Seller Central EU help G1661, plain fetch | https://sellercentral-europe.amazon.com/help/hub/reference/external/G1661 | 2026-10-14 | This route returns only the landing page; the US G1661 v15 was read instead |
| Archive copy of help 1661 | https://web.archive.org/web/2024/https://sellercentral.amazon.com/gp/help/external/1661 | 2026-10-14 | not read: the WebFetch tool refuses web.archive.org, while `curl` reads `id_` copies (`method/help-page-access.md` A6). The live page was read instead, so no archive copy was needed |
| Why Isn't My Listing Showing in Search Results? A Complete Guide (Seller Forums, Manny_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/fb1124b0-adf9-4933-b470-f75160082cdf | 2026-10-14 | Browse-node checks, 72 hours |
| How to Change Feed-Product-Type (Seller Forums) | https://sellercentral.amazon.com/seller-forums/discussions/t/c5074d92-aeea-4882-a899-d4bc93cca8a6 | 2026-10-14 | Glenn_Amazon on product-type changes |
| Product Attributes / Feature Filters (Seller Forums) | https://sellercentral.amazon.com/seller-forums/discussions/t/fbca25c48655ed8811d2af5718590a6a | 2026-10-14 | No mechanism; BTGs |
| How to create Amazon product listings (sell.amazon.com) | https://sell.amazon.com/blog/amazon-product-listings | 2026-10-14 | Product Identity tab holds type and item type keywords |
| Amazon SEO: 7 ways to improve your product's search rankings (sell.amazon.com) | https://sell.amazon.com/blog/amazon-seo | 2026-10-14 | Filters, category care, listing quality |
| Amazon's Rufus AI assistant now available to all US customers (aboutamazon.com) | https://www.aboutamazon.com/news/retail/how-to-use-amazon-rufus | 2026-10-14 | Rufus uses "product listing details" |
| The technology behind Amazon's GenAI-powered shopping assistant, Rufus | https://www.amazon.science/blog/the-technology-behind-amazons-genai-powered-shopping-assistant-rufus | 2026-10-14 | Retrieval sources |
| Using LLMs to improve Amazon product listings | https://www.amazon.science/blog/using-llms-to-improve-amazon-product-listings | 2026-10-14 | Amazon AI corrects attributes |
| Building commonsense knowledge graphs to aid product recommendation | https://www.amazon.science/blog/building-commonsense-knowledge-graphs-to-aid-product-recommendation | 2026-10-14 | COSMO method and results |
| COSMO (publication page) | https://www.amazon.science/publications/cosmo-a-large-scale-e-commerce-common-sense-knowledge-generation-and-serving-system-at-amazon | 2026-10-14 | Authors, venue, deployment in search navigation |
| AutoKnow (arXiv) | https://arxiv.org/abs/2006.13473 | 2026-10-14 | Product graph sparsity, 11K product types |
| OpenTag (arXiv) | https://arxiv.org/abs/1806.01264 | 2026-10-14 | Attribute extraction |
| QUEACO (arXiv) | https://arxiv.org/abs/2108.08468 | 2026-10-14 | Query attribute extraction |
| Shopping Queries Dataset (arXiv) | https://arxiv.org/abs/2206.06588 | 2026-10-14 | ESCI benchmark |
| esci-data (GitHub) | https://github.com/amazon-science/esci-data | 2026-10-14 | Product columns, ESCI labels |
| Amazon Search: The joy of ranking products | https://www.amazon.science/publications/amazon-search-the-joy-of-ranking-products | 2026-10-14 | Per-category ranking |
| Crossref: Sequential Search with Refinement | https://api.crossref.org/works/10.1287/mnsc.2016.2557 | 2026-10-14 | Refinement tools effect (publisher page 403) |
| Crossref: Online Demand Under Limited Consumer Search | https://api.crossref.org/works/10.1287/mksc.1100.0574 | 2026-10-14 | 10–15 options searched |
| Crossref: On Application of Learning to Rank for E-Commerce Search | https://api.crossref.org/works/10.1145/3077136.3080838 | 2026-10-14 | Metadata only, no abstract: not used |
| Keepa Product Object | https://keepa.com/api-docs/product-object.html | 2026-10-14 | type, itemTypeKeyword, categories, attribute fields |
| Amazon Categories and Product Type: How It's All Related (AMALYTIX) | https://www.amalytix.com/en/knowledge/seo/amazon-categories-product-type | 2026-10-14 | Practitioner view |
| Finding Amazon synonyms from the category browse node (AMALYZE) | https://amalyze.com/resources/guides/listing/amazon-listing-seo-synonyms-category | 2026-10-14 | Filters as vocabulary |
| How to Use the Amazon Listing Quality Dashboard (eComEngine) | https://www.ecomengine.com/blog/amazon-listing-quality-dashboard | 2026-10-14 | Dashboard, sales-lift estimate |
| How to Make Your Products Visible in Amazon Search Filters (Your Seller Agency) | https://yourselleragency.com/blog/make-products-visible-amazon-search-filters | 2026-10-14 | Attributes gate filtered results |
| Amazon Search: How Product Search and Filters Work for Buyers and Sellers (Feedvisor) | https://feedvisor.com/university/advanced-search/ | 2026-10-14 | Common frame; no sources |
| Refining search results (Amazon Business API docs) | https://docs.business.amazon.com/docs/refining-search-results | 2026-10-14 | Refinements are dynamic, per product type (Business search, not the retail SERP) |
| Amazon Ads product targeting guide | https://advertising.amazon.com/API/docs/en-us/guides/sponsored-products/product-targeting | 2026-10-14 | unreachable: JavaScript shell, title only |
| PA-API SearchRefinements | https://webservices.amazon.com/paapi5/documentation/search-refinements.html | 2026-10-14 | unreachable: redirects to the PA-API deprecation page |
| Jungle Scout / Helium 10 / SellerApp / Carbon6 / Marketplace Pulse guessed URLs | (various) | 2026-10-14 | unreachable: 404; search budget exhausted |
| **Gap fill 2026-10-14.** Seller Central rows below were read through the content call (`POST https://<host>/help/hub/mons-api/GetHelpTopic`); the URL given is the page's canonical address. US = layer Published/US, en-US; DE = Published/DE, en-GB on sellercentral.amazon.de | | | |
| Price per unit requirements, G201618190 v2 r0 (US) | https://sellercentral.amazon.com/help/hub/reference/external/G201618190 | 2026-10-14 | unit_count/unit_count_type; search suppression after LQD deadline; PPU display decided by product type |
| Conditional Unit Count based on Item Form, Normalized Value of Size, Item Form, Number of Items and Net Content details, G2RCDMZR4SKGQFAY v3 r1 (US) | https://sellercentral.amazon.com/help/hub/reference/external/G2RCDMZR4SKGQFAY | 2026-10-14 | 138 / 8 / 86 / 154 product types; invalid values may remove from search |
| Size normalization FAQ, GZJRCRLWW7WKKDAH v11 r1 (US) | https://sellercentral.amazon.com/help/hub/reference/external/GZJRCRLWW7WKKDAH | 2026-10-14 | Size derived from other attributes; "Pack of" formula |
| Pricing Health, GSTH6YN3BR8XNWBW v22 r0 (US) | https://sellercentral.amazon.com/help/hub/reference/external/GSTH6YN3BR8XNWBW | 2026-10-14 | Per-unit derived reference price |
| Listing blocked due to potential pricing error, G201141430 v7 r1 (US) | https://sellercentral.amazon.com/help/hub/reference/external/G201141430 | 2026-10-14 | No unit attribute named |
| Dangerous goods identification guide (hazmat), G201003400 v25 r0 (US) | https://sellercentral.amazon.com/help/hub/reference/external/G201003400 | 2026-10-14 | No type-based classification; 14 business days |
| Dangerous goods (hazmat) required information and documentation, G201371860 v17 r1 (US) | https://sellercentral.amazon.com/help/hub/reference/external/G201371860 | 2026-10-14 | FBA listing blocked without DG info; SDS must match title and brand |
| California Proposition 65 (Prop 65), G202141960 v7 r0 (US) | https://sellercentral.amazon.com/help/hub/reference/external/G202141960 | 2026-10-14 | Child SKUs only; parent fails |
| CPSIA cautionary statements, G200292910 v2 r2 (US) | https://sellercentral.amazon.com/help/hub/reference/external/G200292910 | 2026-10-14 | Yellow box; valid values; up to four |
| General Product Safety Regulation (GPSR), GQAYBJPNAZ2LMDDT v15 r1 (DE) | https://sellercentral.amazon.de/help/hub/reference/external/GQAYBJPNAZ2LMDDT | 2026-10-14 | Deactivation; display of manufacturer and Responsible Person |
| Submitting manufacturer, Responsible Person, and warning and safety information, G8AECGHY2KLD88D7 v15 r0 (DE) | https://sellercentral.amazon.de/help/hub/reference/external/G8AECGHY2KLD88D7 | 2026-10-14 | Safety Attestation and compliance media attributes; 2–48 h; seven days |
| Regulatory compliance - how to reinstate deactivated listings, GCS5NTUWXUMCESN2 v3 r0 (DE) | https://sellercentral.amazon.de/help/hub/reference/external/GCS5NTUWXUMCESN2 | 2026-10-14 | Listing removed; 30 days; other suppressions block reinstatement |
| Product safety and compliance, GUH6FA4XSJ2LZFLY v14 r0 (DE) | https://sellercentral.amazon.de/help/hub/reference/external/GUH6FA4XSJ2LZFLY | 2026-10-14 | "Safety and Product Resources" on the detail page |
| Classify your products using Browse Tree Guides - BTG, G1661 v15 r1 (US) | https://sellercentral.amazon.com/help/hub/reference/external/G1661 | 2026-10-14 | ITK US-only, RBN elsewhere; keyword vs browse search; Category update tool |
| Amazon search glossary, GF6B8ZPNY2AP72VV v2 r0 (US) | https://sellercentral.amazon.com/help/hub/reference/external/GF6B8ZPNY2AP72VV | 2026-10-14 | ITK definition; refinement valid values; node required to be searchable |
| My ASIN is unsearchable, GHGHDMU4X5K9QGCV v6 r0 (US) | https://sellercentral.amazon.com/help/hub/reference/external/GHGHDMU4X5K9QGCV | 2026-10-14 | No node, not indexed; 72 hours |
| Accurately classifying your products, G25771 v3 r1 (US) | https://sellercentral.amazon.com/help/hub/reference/external/G25771 | 2026-10-14 | ITK restricts All Departments results |
| Change a product's category or browse path, G201950630 v15 r0 (US) | https://sellercentral.amazon.com/help/hub/reference/external/G201950630 | 2026-10-14 | Multiple paths; single node assignment; refinements need the right node |
| Keyword attributes explained, GF2C2L6RCFZGWBXC v4 r1 (US) | https://sellercentral.amazon.com/help/hub/reference/external/GF2C2L6RCFZGWBXC | 2026-10-14 | item_type_keyword 250 bytes; browse assignment queries |
| Apparel size standards, GZXM4PHSSX9YUT87 v6 r1 (US) | https://sellercentral.amazon.com/help/hub/reference/external/GZXM4PHSSX9YUT87 | 2026-10-14 | Exact size syntax |
| Apparel size standards FAQ, GQ2JFF7DLWVHU7YX v8 r1 (US) | https://sellercentral.amazon.com/help/hub/reference/external/GQ2JFF7DLWVHU7YX | 2026-10-14 | Refinements and mobile visibility; 26 product types; size charts shown by link |
| Create a Size Chart for Your Products, G201842330 v2 r0 (US) | https://sellercentral.amazon.com/help/hub/reference/external/G201842330 | 2026-10-14 | Brand Registry only; self-service tool |
| Categories and products that require approval, G200333160 v44 r0 (US) | https://sellercentral.amazon.com/help/hub/reference/external/G200333160 | 2026-10-14 | Restriction kinds; 2–7 business days; privileges change |
| Product categories with enhanced safety listing requirements, G4RUG6EAT2ZLVSRT v1 r1 (US) | https://sellercentral.amazon.com/help/hub/reference/external/G4RUG6EAT2ZLVSRT | 2026-10-14 | Category list |
| Attributes guide, GBWHYLJ7NNQMXBAQ v3 r2 (US) | https://sellercentral.amazon.com/help/hub/reference/external/GBWHYLJ7NNQMXBAQ | 2026-10-14 | Search, filters, Rufus; 90-day templates; error table incl. 97779 200 bytes |
| Error 97779, GR7SLAHMDLBSSDHP v1 r2 (US) | https://sellercentral.amazon.com/help/hub/reference/external/GR7SLAHMDLBSSDHP | 2026-10-14 | "Amazon limits the length to 200 bytes" |
| Error code explanations, G17781 v13 r1 (US, hierarchy only) | https://sellercentral.amazon.com/help/hub/reference/external/G17781 | 2026-10-14 | Navigation only: child pages; the error-series pages are indexes |
| Hazardous and prohibited items G200164570 v18; FBA prohibited products G201730840 v28 (US) | https://sellercentral.amazon.com/help/hub/reference/external/G200164570; https://sellercentral.amazon.com/help/hub/reference/external/G201730840 | 2026-10-14 | Titles and navigation only; not cited for a claim |
| About product documents, GZJNHR2M4GDNM3Q3 v24 r2 (US) | https://sellercentral.amazon.com/help/hub/reference/external/GZJNHR2M4GDNM3Q3 | 2026-10-14 | Documents per store; display not guaranteed; not cited for a claim beyond that |
| Listings Restrictions API | https://developer-docs.amazon/sp-api/docs/listings-restrictions-api.md | 2026-10-14 | updatedAt 2026-09-29; per-store request counting; Product Listing role |
| Get listings restrictions for an item in the catalog | https://developer-docs.amazon/sp-api/docs/get-listings-restrictions.md | 2026-10-14 | Empty list when no restriction |
| listingsRestrictions_2021-08-01.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/listings-restrictions-api-model/listingsRestrictions_2021-08-01.json | 2026-10-14 | Parameters; APPROVAL_REQUIRED / ASIN_NOT_FOUND / NOT_ELIGIBLE |
| getListingsRestrictions (reference) | https://developer-docs.amazon/sp-api/reference/getlistingsrestrictions.md | 2026-10-14 | Same parameters as the model; no `brand` parameter |
| Regulatory Compliance Reports | https://developer-docs.amazon/sp-api/docs/report-type-values-regulatory-compliance.md | 2026-10-14 | EPR reports only; not relevant to listing attributes |
| Amazon Best Sellers Rank (BSR) Meaning: Everything You Need to Know in 2024 (Jungle Scout, Brian Connolly) | https://www.junglescout.com/blog/amazon-best-sellers-rank/ | 2026-10-14 | BSR per category; several BSRs per item |
| New unit count or price per unit requirements for product listings (Seller Forums, News_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/86469fa85c808b17933893cbed640430 | 2026-10-14 | 2021-09-30 requirement; seller replies |
| Change to Unit Count attribute (Seller Forums, Jeniffer_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/65df0faf76fc57564ccec20ac338ea46 | 2026-10-14 | 2021-07-23 feeds requirement; categories and stores |
| Amazon.com customer help, Best Sellers Rank (nodeId GGGMZK378RQPATDJ and 525376) | https://www.amazon.com/gp/help/customer/display.html?nodeId=GGGMZK378RQPATDJ | 2026-10-14 | unreachable: WebFetch 503; curl a 1,147-byte block page |
| Helium 10 GPSR guess; Jungle Scout resources guess | https://www.helium10.com/blog/gpsr/ (and a junglescout.com/resources/articles/ guess) | 2026-10-14 | unreachable: 404 |
| **Reconciliation 2026-10-14.** Rows below were read from the saved captures under the office's capture folder (outside this repository) (the text the content call returned on 2026-10-14); no help page was fetched in the reconciliation | | | |
| Warning code 18367: Product type modified by Amazon, GXMA2QU3JZTG8JNL v1 r1 (US) | https://sellercentral.amazon.com/help/hub/reference/external/GXMA2QU3JZTG8JNL | 2026-10-14 | Product type switch from title, description and bullets; fix by resubmitting (capture `GXMA2QU3JZTG8JNL-v1.txt`) |
| Sales Rank FAQ, G202059240 v2 r0 (US) | https://sellercentral.amazon.com/help/hub/reference/external/G202059240 | 2026-10-14 | Ranks only in "featured categories" ("special browse nodes"); hourly list update; variations by website display group (capture `G202059240-v2.txt`) |
| Listing quality, G200786710 v5 r1 (US) | https://sellercentral.amazon.com/help/hub/reference/external/G200786710 | 2026-10-14 | Seven components incl. attributes; attributes "improve search filtering"; Enhance tab; no dashboard named (capture `G200786710-v5.txt`) |
| Optimize your product discoverability, G10471 v13 (US) | https://sellercentral.amazon.com/help/hub/reference/external/G10471 | 2026-10-14 | Generic Keyword "less than 250 bytes" (capture `G10471-v13.txt`), for the item 57 conflict only |
| Captures re-checked: G1661-v15, GF6B8ZPNY2AP72VV-v2, GHGHDMU4X5K9QGCV-v6, GF2C2L6RCFZGWBXC-v4 | the office's capture folder (outside this repository) | 2026-10-14 | Quotes in items 47, 48, 53 and 31 match the captures |
| Get recommended browse nodes or item type keywords (re-read) | https://developer-docs.amazon/sp-api/docs/get-recommended-browse-nodes-or-item-type-keywords.md | 2026-10-14 | `item_type_keyword` `maxLength` 500, `maxUniqueItems` 1; `recommended_browse_nodes` `maxUniqueItems` 232, `maxLength` 15 |
| Submit media attributes (re-read) | https://developer-docs.amazon/sp-api/docs/submit-media.md | 2026-10-14 | `PT01`–`PT08` map to `other_product_image_locator_{1-8}` |
| Amazon EU hosts with US help ids | sellercentral.amazon.de / sellercentral.amazon.co.uk / sellercentral-europe.amazon.com content call | 2026-10-14 | `HelpArticleNotFound` for US-only ids; GPSR read on the DE layer instead |

## Open questions

1. **Can a seller change a listing's product type through `patchListingsItem` or `putListingsItem` with a different `productType`?** Amazon's pages are silent. Staff say "sometimes"; AMALYTIX says no.
   - Settled by `VALIDATION_PREVIEW` on a sandbox-safe SKU, or by Amazon's "Listings Items API" FAQ if it adds the case.
   - On this line, only after Jack's word on preview against the real store.
2. **Can `recommended_browse_nodes` and `item_type_keyword` be changed on an existing ASIN, and is that field `editable`?** Amazon's LUGGAGE examples mark both `"editable": true`; whether that holds for other product types, and whether an edit on an ASIN the seller does not own the brand of reaches the Catalog, is not settled. Settled by reading `editable` on both properties in the first real `getDefinitionsProductType` for the test SKU's type, and the Catalog `classifications` after a write.
3. **How refinements actually show up in the browse-tree report.**
   - Amazon's page example shows an empty `refinementsInformation`. Whether production files fill `refinementAttribute` with schema attribute names (`color`, `material`) or with legacy names is unknown.
   - Settled by the first `GET_XML_BROWSE_TREE_DATA` run scoped with `BrowseNodeId`. The report's availability to this application's roles is also unconfirmed.
4. **Which of several browse classifications is the "main" one** across these fields: Catalog `summaries.browseClassification`, the first `classifications` entry, `getItemBrowseNode`, Keepa `salesRankReference`. Settled by reading all four for one ASIN in the first real run.
   - Gap fill: the question now has two parts. The assigned node (one per ASIN except media and unisex items, G201950630) is a different thing from the rank categories (`salesRanks[].classificationRanks`, possibly several). Keepa's `salesRankReference` is "the main sales rank", not the assigned node. Neither Amazon nor Keepa says how the rank categories are chosen. The first real run should record, for one ASIN, whether `browseClassification.classificationId` appears among the `classificationRanks` ids.
   - Reconciliation: Amazon's Sales Rank FAQ (G202059240 v2 r0, item 52) says ranks are generated for "featured categories", which are "special browse nodes", and that sellers can ask Selling Partner Support whether the ASIN is assigned to the right ones. It still does not say how featured categories are derived from the assigned node.
5. **The Listing Quality Dashboard and its "potential sales lift".** No SP-API operation was found that exposes them, and the dashboard's own help page was not read. (Gap fill: the price-per-unit page confirms the dashboard shows the deadline after which listings without `unit_count` leave search, item 37. Reconciliation: Amazon's "Listing quality" page, G200786710 v5 r1, read from its capture, names no dashboard and no sales-lift figure; it points to the "Enhance" tab.) Settled by a read of the dashboard's help page once the office rules on the help-page route, or by the seller exporting the dashboard into the tree.
6. **Whether `relevant_attributes` WARNING issues appear for ordinary seller listings or only in the guide's example.** Settled by the first `getListingsItem` with `issues` on a listing known to have gaps.
7. **Amazon Seller Forums "News" announcements on product-type, browse-node or attribute changes in 2025–2026 were not found.** The search budget ran out. Settled by a search of the News_Amazon announcements for "product type", "browse node" and "attribute" when budget allows.
8. **Ads category targeting and browse nodes.** Sponsored Products category targets use category IDs. Whether a wrong browse node removes an ASIN from category-targeted ads was not read, because the Ads docs page is a JavaScript shell. Settled by the Ads API "targetable categories" reference.
9. **Detail-page placement of attributes.** Whether attribute values feed the detail page's spec and "Product information" tables, and in what order. The only Amazon line found is the "Product Details" property group's description, "to support search, browse and detail page content" (item 6), which says the attributes feed the detail page but not where or in what order. Settled by a Seller Central style guide or category style guide, which were not read in this session (no capture exists under the office's capture folder (outside this repository)).
10. **The prior SP-API report's lead about v0 `listCatalogCategories`.** The lead says it was deprecated 2025-05-21 with conflicting removal dates. It was not re-read here; the deprecation schedule page would settle it. It matters only if cx is tempted to use it for "which node am I in".
11. **(Gap fill) Which issue code reports a missing or invalid `unit_count`.** The PPU page says only that updates "will show errors". No code was found on the Listings Items troubleshooting page, the Attributes guide's table or the Error code explanations tree. Item 38's "catalog errors" are not named either. Settled by the first `getListingsItem` `issues` on a listing in a price-per-unit product type without `unit_count`, or by `VALIDATION_PREVIEW`.
12. **(Gap fill) The JSON names of the GPSR attributes.** The help pages give display labels ("Safety Attestation", "Compliance media …", manufacturer and Responsible Person). Only `compliance_media` appears in an Amazon developer example read here. No page showed a JSON name for a manufacturer-contact or Responsible Person attribute, so none is written here. Settled by a `getDefinitionsProductType` read for an EU store (DE, FR, IT, ES) on the listing's product type.
13. **(Gap fill) The JSON names of the apparel and footwear size attributes.** Guidance for Complex Attributes gives display names, and says the prefix varies by product type (`Shirt Size`, `Bottoms Size`). Settled by reading the product type's schema (for example `SHIRT`, `PANTS`) for the store.
14. **(Gap fill) What `item_type_name` feeds.** It is a language-tagged attribute in "Product Identity", separate from `item_type_keyword`. No Amazon page read defines it or links it to titles, browse or search. `elements/title.md` may hold the title-side view. Settled by its `description` in a real product-type schema, or by an Amazon category style guide.
15. **(Gap fill) Whether dangerous-goods attributes matter for merchant-fulfilled offers and for search.** Both dangerous goods pages are written for FBA. The schema lists the attributes for every listing. Settled by the schema's `required` and conditional rules for a battery-containing product type, and by any issue a merchant-fulfilled listing without them returns.
16. **(Gap fill) The `brand` input of `getListingsRestrictions`.** The model's `productType` description says "When provided with the brand name, the API evaluates GTIN exemption restrictions", but neither the model nor the operation's reference page (https://developer-docs.amazon/sp-api/reference/getlistingsrestrictions.md, read 2026-10-14) has a `brand` parameter. Settled by the next model revision.
17. **(Gap fill) Dated 2024–2026 US announcements on compliance or size attributes**, such as new required compliance fields. None was found without search. Settled as for Open question 7.
18. **(Gap fill) The price-per-unit table itself** (`Table_US_v3.xlsx`, linked from G201618190) was not opened. It names the product types that need `unit_count`. Settled by downloading it, or more simply by reading `required` in the schema of the listing's product type, which is the live truth anyway.

## Positions

- **P-attributes-and-browse-nodes-1.** Before writing or proposing any attribute value, cx reads the product type's schema with `getDefinitionsProductType` for that store and seller. It takes attribute names, required attributes, allowed values and limits from the schema, never from memory. Sources: Product Type Definitions API; Building Listings Management Workflows Guide; Mapping product attributes to the Listings Items API and JSON-based feeds; Submit media attributes.
- **P-attributes-and-browse-nodes-2.** cx validates a PATCH body against the schema fetched with `requirementsEnforced=NOT_ENFORCED`, and a full put against `ENFORCED`. It reads both kinds of length limit: characters (`maxLength`) and UTF-8 bytes (`maxUtf8ByteLength`). Sources: definitionsProductTypes_2020-09-01.json; Amazon Product Type Definitions Meta-Schema (v1).
- **P-attributes-and-browse-nodes-3.** The change log records the product type, the schema version and the schema checksum each write was validated against. A schema read in an earlier session is re-read before the next write. Sources: definitionsProductTypes_2020-09-01.json; Listings APIs FAQ; SP-API Product Metadata Updates.
- **P-attributes-and-browse-nodes-4.** In a listing review, cx compares the listing's product type with the recommendation `searchDefinitionsProductTypes` gives for its title. It also compares it with the Catalog's `productTypes`. Any difference is reported as an exposure risk, not silently corrected. Sources: Building Listings Management Workflows Guide; Get Product Type Definition recommendations; Listings APIs FAQ; catalogItems_2022-04-01.json.
- **P-attributes-and-browse-nodes-5.** When attributes suddenly appear as missing, cx first checks whether Amazon switched the product type. It does so by comparing the current `productTypes` with the last recorded one, since Amazon switches deviating listings to a recommended type. Sources: Listings APIs FAQ; Notification Type Values; Warning code 18367: Product type modified by Amazon (GXMA2QU3JZTG8JNL).
- **P-attributes-and-browse-nodes-6.** cx treats `item_type_keyword` and `recommended_browse_nodes` as exposure elements. It proposes only values from the schema's `enum` for that product type and store (not any string the schema's `anyOf` would pass), and the guidance is the most specific accurate value. Sources: Get recommended browse nodes or item type keywords; Listings Items API Issues Troubleshooting.
- **P-attributes-and-browse-nodes-7.** For an exposure drop with stable demand, cx checks classification before rewriting text. It looks at the Catalog's browse classification, the product type, and whether the browse node still exists in the browse tree. Sources: Seller Forums staff guide "Why Isn't My Listing Showing in Search Results?"; Browse Tree Reports; catalogItems_2022-04-01.json.
- **P-attributes-and-browse-nodes-8.** To judge filter coverage, cx reads the product's browse node refinements from the browse tree report (each refinement's attribute and accepted values). It then checks the listing's value for each of those attributes. It does not guess which filters exist. Sources: Browse Tree Reports; BrowseTreeReport.xsd.
- **P-attributes-and-browse-nodes-9.** cx reads attribute completeness from `issues`, including `WARNING` issues that name missing `attributeNames` and the `MISSING_ATTRIBUTE` category. It names those attributes in the review rather than calling the listing complete. Sources: Manage Product Listings with the Selling Partner API; listingsItems_2021-08-01.json.
- **P-attributes-and-browse-nodes-10.** cx distinguishes what the seller submitted (Listings Items `attributes`) from what Amazon shows (Catalog Items `attributes`, `classifications`). It reports a difference as Amazon's reconciliation, brand precedence or Amazon's own correction, not as a failed write. Sources: Listings APIs FAQ; Using LLMs to improve Amazon product listings; catalogItems_2022-04-01.json.
- **P-attributes-and-browse-nodes-11.** In effect-review, a product type switch, a browse node change or a browse-tree change that coincides with the observation window is a confounder for exposure metrics. Sources: Listings APIs FAQ; Browse Tree Reports; Notification Type Values.
- **P-attributes-and-browse-nodes-12.** To compare classification and filled attributes against competitors, cx reads Keepa's `type`, `itemTypeKeyword`, `categories`/`categoryTree` and attribute fields. It does not treat Keepa's integer `productType` as Amazon's product type. Sources: Keepa Product Object.
- **P-attributes-and-browse-nodes-13.** cx treats attribute values as conversion content as well as exposure content, because Amazon says Rufus answers from "product listing details". Spec values must be accurate, because the shopper and the assistant both read them. Sources: Amazon's Rufus AI assistant now available to all US customers; The technology behind Amazon's GenAI-powered shopping assistant, Rufus.
- **P-attributes-and-browse-nodes-14.** When a listing's product type is in the price-per-unit scope (read from the schema's `required`), cx checks that `unit_count` and its `unit_count_type` are present and that the type is one the schema allows for the item form. It reports a gap as a search-suppression risk, and does not treat it as cosmetic. For a bundle of different items, it follows the bundle rule the Price per unit page states (item 37), read from that page and the schema, not from memory. Sources: Price per unit requirements (G201618190); Conditional Unit Count … (G2RCDMZR4SKGQFAY).
- **P-attributes-and-browse-nodes-15.** cx does not propose a typed `size` value in size-normalised product types. To change what shoppers see as Size, it proposes changes to `unit_count`, `number_of_items`, net content, weight or dimensions, and says that Amazon derives the shown value. Sources: Size normalization FAQ (GZJRCRLWW7WKKDAH).
- **P-attributes-and-browse-nodes-16.** cx never infers or fills a compliance value from the listing copy: dangerous goods class, battery facts, safety data sheet, Prop 65 warning type, CPSIA statement, or GPSR manufacturer, Responsible Person and safety information. It reports what is missing or inconsistent, and the seller supplies the value. Amazon says it "cannot determine this information for you", and wrong values block sale. Sources: CPSIA cautionary statements (G200292910); Dangerous goods (hazmat) required information and documentation (G201371860); California Proposition 65 (G202141960); General Product Safety Regulation (GPSR) (GQAYBJPNAZ2LMDDT).
- **P-attributes-and-browse-nodes-17.** Before proposing a title or brand change on an FBA listing that has a safety data sheet, cx flags the SDS match rule. Amazon requires the product name on the SDS to be "the same as the listing title" and the manufacturer or brand to match the detail page. Source: Dangerous goods (hazmat) required information and documentation (G201371860).
- **P-attributes-and-browse-nodes-18.** When the seller supplies a Prop 65 warning, cx places it only on child SKUs, never on a variation parent, because Amazon fails the submission on a parent. Source: California Proposition 65 (G202141960).
- **P-attributes-and-browse-nodes-19.** For an exposure drop, cx reads the listing's `issues` for `enforcements.actions` (`SEARCH_SUPPRESSED`, `LISTING_SUPPRESSED`, `ATTRIBUTE_SUPPRESSED`) and for an `exemption.expiryDate` before any copy diagnosis. An active enforcement explains the drop, and a near expiry date is a deadline to report. Sources: listingsItems_2021-08-01.json; Price per unit requirements (G201618190).
- **P-attributes-and-browse-nodes-20.** In the US store, cx treats `item_type_keyword` as a search-scope lever as well as a browse lever. A too-general value can drop the product from All Departments results that Amazon restricts to a specific item type. In other stores cx works through `recommended_browse_nodes`. Sources: Accurately classifying your products (G25771); Classify your products using Browse Tree Guides - BTG (G1661); Amazon search glossary (GF6B8ZPNY2AP72VV).
- **P-attributes-and-browse-nodes-21.** cx keeps the `item_type_keyword` it proposes and the `item_type_name` apart. It never copies one into the other, and it makes no claim about what `item_type_name` does until the schema's description is read. Sources: Manage Product Listings with the Selling Partner API; Keyword attributes explained (GF2C2L6RCFZGWBXC).
- **P-attributes-and-browse-nodes-22.** cx does not equate a Best Sellers Rank category with the listing's browse node. It reads `classificationRanks` and `browseClassification` separately, and an item may have several ranks. In effect-review it compares rank only within the same `classificationId`. Sources: catalogItems_2022-04-01.json; Change a product's category or browse path (G201950630); Keepa Product Object.
- **P-attributes-and-browse-nodes-23.** Before proposing a new offer on an existing ASIN, or a category or product-type change, cx checks gating with `getListingsRestrictions` for each store. It reports `APPROVAL_REQUIRED` with its link and `NOT_ELIGIBLE` as a stop. On an existing listing it reads `QUALIFICATION_REQUIRED` issues. Sources: listingsRestrictions_2021-08-01.json; Listings Restrictions API; listingsItems_2021-08-01.json; Categories and products that require approval (G200333160).
- **P-attributes-and-browse-nodes-24.** For apparel and footwear, cx checks the size attribute set the schema requires: system, class, value, range end, and body and height type where conditional. Values must match Amazon's exact syntax. cx reports free-text or non-standard sizes as lost size refinements and a possible mobile visibility loss. Sources: Guidance for Complex Attributes; Apparel size standards (GZXM4PHSSX9YUT87); Apparel size standards FAQ (GQ2JFF7DLWVHU7YX).

### The seat's own (not for a skill)

- [seat] Attribute fixes probably pay most where the node has refinements on that attribute and the listing's value is empty or off-vocabulary. This is reasoning from items 17, 23 and the practitioners. No source measures it.
- [seat] Since cx has no EventBridge destination, a re-read on each scheduled visit is the practical detector for product type switches and schema changes. Comparing `productTypes`, schema checksum and Catalog `classifications` with the last recorded copy does the job.
- [seat] Amazon's catalogue AI (item 32) can overwrite or normalise values. Re-reading the Catalog a few days after an attribute write is likely needed before judging the write. Amazon's blog says only "within days", not when.
- [seat] The day-2 run's PATCH named an image attribute that does not appear in Amazon's JSON media guide. It is an instance of P-1's failure mode, but the run never reached Amazon. Whether Amazon would have rejected it is not established.
- [seat] COSMO's relation types (audience, use, occasion) suggest that attributes like `target_audience`, `specific_uses_for_product` and occasion fields are worth filling where the schema has them. No source links COSMO to those fields.
- [seat, gap fill] A wrong `unit_count` or `number_of_items` may skew Pricing Health's per-unit reference price ("multiplied by number of units in your listing") and so trigger a pricing deactivation or a lost Featured Offer. Amazon does not say which attribute supplies "number of units", so this is a hypothesis to watch, not a rule.
- [seat, gap fill] Because the shown Size is derived from `unit_count` and `number_of_items` and offers with the same derived Size are associated with the same product (item 39), a wrong unit count can probably also mis-group a listing within its variation family. Nothing read states this directly.
- [seat, gap fill] Practitioners' "the category shown in BSR is not my category" complaints are probably the assigned node versus the rank categories (item 52), not a mis-assignment. Checking `browseClassification` first should settle most of them.
- [seat, gap fill] The enhanced-safety and approval rules (item 56) can change after a listing is live. A product that was sellable can become gated without any listing edit, so a sudden `QUALIFICATION_REQUIRED` issue is an account-side event, not a listing defect.
- [seat, gap fill; revised in reconciliation] The 72-hour figure (items 27, 31, 47), the 15-minute notification lag and the 1–5-minute `getListingsItem` read-back measure different things: shopper-facing search, notification delivery and API state. The API read-back only proves the write landed. Amazon calls the 72 hours an upper bound that "can be slower or faster", so an effect-review window for a classification change should start when the Catalog shows the new classification (`getCatalogItem` `classifications`, `browseClassification`), not after a fixed wait. This matches `method/funnel-and-search.md` P-funnel-and-search-15.

## Verification

Verified 2026-10-14 by an adversarial verifier seat. Method:
- Every developer-docs page cited was re-fetched as markdown from `developer-docs.amazon/sp-api/docs/<slug>.md`. Each page's title and `updatedAt` matched the file, and every quoted phrase was searched for in the page text.
- The four model JSON files were downloaded from github.com/amzn/selling-partner-api-models and their parameters, enums, definitions and descriptions were checked.
- The BrowseTreeReport.xsd was downloaded and its elements were checked.
- The Amazon Science, sell.amazon.com and aboutamazon.com pages, the three Seller Forums threads, the five practitioner pages, the Keepa Product Object page, the arXiv abstracts, the esci-data README, the Crossref records and the Amazon Business refinements page were re-opened.
- No Amazon API host or Keepa API host was called.

**Claims checked:** about 95, covering every [official], [opinion] and [research] claim in sections A–E, the practitioner list, the research list and the run-time list.

**Corrections (was → now):**
1. Item 3, `sellerId`: the quote was not verbatim. It now quotes the model ("seller-specific requirements and values are populated within the product type definition schema, such as brand names associated with the selling partner"), and the tutorial's B2B note and generic-schema note were added.
2. Item 11: "based on the Amazon store, the type of selling partner account, and an item name" was not verbatim. It now reads "for a given Amazon store, type of selling partner account, and item name".
3. Item 14: the FAQ "restricted" line now uses the page's exact wording and is marked as vendor-directed. The 4005018/4005019 messages were added.
4. Item 15: "without bullet points removes those bullet points from existing listings" was not verbatim, and it was cited to the Building guide. It is now Amazon's full sentence from Create or fully update a listing. The `PRODUCT` root sentence is quoted in full from the Building guide.
5. Item 17 / Stable / P-6: "Both are enums" and "Both take only values enumerated in the schema" were wrong. Amazon's own examples wrap the enum in `anyOf` with a plain string, so schema validation accepts any string. It now says the enum is the valid list, schema validation does not enforce it, and Amazon rejects bad values at processing (`4000001`, `101158`). P-6 now says cx proposes only enum values.
6. Item 17: added that both examples mark `value` `"editable": true`, `"hidden": false`. Open question 2 was updated to match.
7. Item 18: added `item_type_keyword` `maxLength` 500 from the same example.
8. Item 19: the `4000001` paraphrase in quotes ("Only certain subcategories are valid for a given category…") is replaced by Amazon's wording. `101158` gained Amazon's "Product Category (recommended_browse_nodes)" naming and its "must match one of the accepted browse node IDs" sentence.
9. Item 20: "ended for listings" now quotes the page. The page is about the Feeds API, not Seller Central upload screens. The `SizeName` → `Size_Name` wording is now Amazon's.
10. Item 22: added the node's `browseNodeAttributes` / `item_type_keyword` link from Amazon's example. Added Amazon's note to leave `MarketplaceIds` off `createReport` for this report, and the note that the XSD may change.
11. Item 28: added the second WARNING in the same example (`customer_returns`).
12. Item 6: added the "Product Details" group description ("to support search, browse and detail page content"). Open question 9 was updated to match.
13. Item 9: the FAQ quote was extended. Amazon bases attribute updates on "customer search and buying signals", and some updates come before the planned release.
14. AMALYTIX: "cannot be edited after upload" was not on the page. It is now "Once the product is uploaded, you cannot change the 'Product type' field." The 24-hour workaround is quoted. "Gaming a small or wrong category can be rejected" is replaced by the page's own two sentences.
15. eComEngine: the original publication date (2021-01-12) was added.
16. COSMO: "deployed in Amazon search navigation" was not verbatim. It is now the abstract's "deployed in Amazon search applications such as search navigation". "Filtered by human-trained critics" is replaced by what the blog says: heuristics, then a classifier trained on human annotations of plausibility and typicality. The relation list is now as the blog gives it. "Cross-encoder" was not confirmed and became "COSMO-based model".
17. Run-time section: the Keepa `productType` gloss was corrected. It is Keepa's 0–5 record-type code (standard, downloadable, ebook, inaccessible, no data, variation parent), not purely "data-availability". door.md on origin/main has no browse-tree report entry. The pointer stays, flagged as an entry door.md must gain.

**Confirmed as written:**
- All 20 developer-docs page titles and their last-updated dates.
- The getDefinitionsProductType and searchDefinitionsProductTypes parameters, defaults and enum descriptions.
- The response shape and checksum text.
- The 2026-05-27 `parentageLevel`, 2026-01-28 tutorial and 2026-09-30 `PRODUCT`/`LISTING` release notes.
- The 12 meta-schema keywords and their quotes.
- The metadata-update rows.
- Both notifications, with their payloads and the EventBridge workflow.
- The error codes 90220, 90244, 4000002, 4000003 (with the PRODUCT roll-up), 4005033.
- The Catalog `classifications`, `browseClassification`, `productTypes`, `salesRanks` and `refinements` descriptions.
- The 1,000-result cap.
- `getItemBrowseNode`.
- The Listings FAQ precedence and 15-minute / 1–5-minute lines.
- The Amazon Science LLM-listings post (author, date, quotes).
- The sell.amazon.com posts and their dates, the Rufus posts, and the three forum threads (authors, quotes, relative dates).
- The AMALYZE, Your Seller Agency and Feedvisor quotes.
- The Keepa field list.
- AutoKnow, OpenTag, QUEACO, ESCI (authors, venues, figures; the product columns via the esci-data README), Sorokina & Cantú-Paz, Chen & Yao (hotel-booking travel site, 33% / 17%), and Kim, Albuquerque & Bronnenberg (10–15 options, Amazon.com camcorders).
- No real seller ASIN, store name or figure appears in the file. The day-2 report reference describes cx's behaviour only.

**Still unverified:**
- The Seller Central help pages (Browse Tree Guides G1661, Listing Quality Dashboard, product classifier): not opened by this verifier. (Superseded: G1661 v15 r1 was read through the content call in the gap fill and its text is saved as capture `G1661-v15`; the Listing Quality Dashboard and Product Classifier pages were not read and have no capture. See section F.)
- The eComEngine report of "potential sales lift" (early 2023) has no Amazon page behind it in this file.
- Whether production browse-tree reports fill `refinementAttribute` (Open question 3).
- The QUEACO abstract states no deployment or effect size; the full paper was not read.
- "Rufus answers from product listing details" is shopper-facing prose. It does not establish that structured attributes, as opposed to prose, feed Rufus.

**Missing for a senior operator (listed, not researched here):**
- Variation families: `parent_sku`, `variation_theme` and `child_parent_sku_relationship`; how a wrong theme or product type breaks or merges a family; the attribute rules for child and parent; the Variation Wizard.
- Category approval / gating and `QUALIFICATION_REQUIRED` issues, and how restricted product types interact with brand gating.
- Brand Registry contribution precedence in practice: Amazon's "Brand owners have the highest precedence" versus a non-brand-owner reseller's attribute edits being ignored. How to escalate a wrong Catalog value (the Catalog Style Guide, "Fix a product page" / Contact Us flows).
- The `item_name` / `item_type_name` / `product_type` interplay in titles. Amazon's item-type-name requirement in some categories is in the title file's remit, but the attribute side is not covered here.
- Compliance and safety attributes that suppress (batteries, `hazmat`/dangerous goods, CPSIA, Prop 65, `country_of_origin`), and the at-risk suppression dates from the Listing Quality Dashboard.
- `unit_count`/`unit_count_type` and per-unit pricing display; size-chart and `size` system attributes in apparel (the Guidance for Complex Attributes page was read but barely used).
- The JSON Listings Feed (`JSON_LISTINGS_FEED`) as the bulk route for attribute fixes across many SKUs, and the Listings Items rate limits for bulk attribute work.
- Sponsored Products category targeting and auto-targeting's dependence on browse node and attributes (Open question 8).
- Best Seller Rank categories versus the browse node: when BSR shows a different category from the one assigned, which `salesRanks` entry to watch in effect-review.
- Seller Forums News announcements in 2025–2026 on attribute or product-type changes (Open question 7).

Gap fill 2026-10-14: 6 gaps filled, 6 left open

Filled (sections G–M, practitioner and run-time additions, positions 14–24):
1. Unit count and price per unit: requirement, search suppression, display rule, Size derivation, and the narrow Pricing Health link (items 37–40, P-14, P-15).
2. Compliance attributes and suppressions: the schema's compliance group, dangerous goods and batteries with the SDS match rule, Prop 65, CPSIA, EU GPSR, and enforcement actions on issues (items 41–46, P-16 to P-19).
3. `item_type_keyword` versus `item_type_name`: what the first does (US browse assignment, All Departments restriction) and what is known of the second, which is only its shape (items 47–48, P-20, P-21). Filled in part (see open 3).
4. Apparel and footwear size system, class and size charts (items 49–51, P-24). Filled in part (see open 2).
5. Browse node versus BSR categories: separate Catalog fields, multiple paths, Keepa's rank-node fields, Jungle Scout's per-category BSR (items 52–54, P-22).
6. Gating: `QUALIFICATION_REQUIRED`, `getListingsRestrictions` reason codes, the approval and enhanced-safety pages (items 55–56, P-23).
Also: the Attributes guide (item 57) and the contradictions listed below.

Left open:
1. The JSON names of the GPSR attributes (Open question 12). No page read gives them.
2. The JSON names of the apparel and footwear size attributes (Open question 13). Only display names are published in the pages read.
3. What `item_type_name` feeds (Open question 14). No Amazon definition was found.
4. The issue code for a missing `unit_count` (Open question 11), and the price-per-unit product-type table (Open question 18).
5. How rank categories are chosen relative to the assigned node (Open question 4). Neither Amazon nor Keepa states it.
6. Published research on any of the six topics. The search budget was spent, and no paper was known by URL.

Contradictions resolved in this file:
- Line "What this covers": the modular-title rule is now pointed to `elements/title.md`, not `angles/listing-content-and-health.md`.
- Section F and Pages read: "Seller Central help pages unreachable" is now scoped to plain fetch and WebFetch. G1661 and 20+ help pages were read through the content call. "web.archive.org unreachable" is now "WebFetch refuses it; curl `id_` works" (`method/help-page-access.md` A6).
- Item 31's latency figures: the 15-minute and 1–5-minute figures are notification lag and API read-back. The 72-hour figure is shopper-facing search. The GPSR 2–48 h and seven days are compliance checks and activation. The file states no single effect window.
- `generic_keyword` read-back: this file makes no claim about it. The 2023-08-16 release note ("will no longer be returned by the Catalog Items API") is owned by `elements/search-terms.md`. Nothing to change here.
- Error 97779: `elements/search-terms.md` (Open question 13 and the IN row of its limit table) says 97779 is seen only in an amazon.in staff reply and is not on "Error code explanations". That is no longer true. The US Attributes guide (GBWHYLJ7NNQMXBAQ v3 r2) and a US "Error 97779" page (GR7SLAHMDLBSSDHP v1 r2) both carry it with "200 bytes" (item 57). search-terms.md should be corrected by its owner. It was not edited here.
- Gating names: `QUALIFICATION_REQUIRED` (an issue category on an existing listing) and `APPROVAL_REQUIRED` (a restrictions reason code before listing) are two names in two APIs, not a conflict (item 55).

Adversarial re-check of the gap fill (same day). Method:
- Every Seller Central page cited in G–M was re-opened live through the content call: 20 US and 4 DE pages, plus GF2C2L6RCFZGWBXC and the new GR7SLAHMDLBSSDHP. Titles, versions and revisions were confirmed as cited.
- About 130 quoted phrases were checked by normalised string match. The developer-docs pages (Guidance for Complex Attributes, Manage Product Listings, Listings Restrictions API, Get listings restrictions, getListingsRestrictions reference, Release Notes), the three model JSON files, the Keepa Product Object page, the Jungle Scout article and both forum threads were re-fetched and checked the same way.
- Corrections made during the re-check:
  1. The size-chart display sentence is on the Apparel size standards FAQ, not on G201842330. The citation was moved, and G201842330's Seller Support route was restated in the page's own terms.
  2. The enhanced-safety category list was incomplete. Sleep products, transport-related products, and water and marine safety products were added.
  3. "The guide" for per-store request counting was the Listings Restrictions API page. The attribution was fixed.
  4. Item 48's keyword-table line had cited another file's reading. GF2C2L6RCFZGWBXC was re-opened live, the unit (bytes) was confirmed, and its browse-assignment sentences were added.
  5. Seller forum handles in the unit-count thread were not copied. The posts are described without them.
- Not re-opened: the price-per-unit table (.xlsx) and the Listing_requirement_updates workbook (neither cited for a figure); Warning 18367 (not cited in the gap fill).
- No Amazon API host or Keepa API host was called. No seller's data appears in the additions.

Reconciled 2026-10-14 (against the contradictions list from three critics; sources re-opened: the help-page captures under the office's capture folder (outside this repository), the "Get recommended browse nodes or item type keywords" and "Submit media attributes" developer pages; no help page fetched, no Amazon or Keepa API host called):
1. Section F rewritten. "Unreachable" now describes only the plain-fetch route. G1661, the search glossary, My ASIN is unsearchable, Keyword attributes explained, Listing quality, Sales Rank FAQ and Warning 18367 are named with their captures. web.archive.org is described as refused by WebFetch and readable by `curl` `id_` copies. Pages not read (Listing Quality Dashboard help, Product Classifier, category style guides) are listed as not read, with no capture. The standing use of the content call is left to the office.
2. Pages read: the three G1661 plain-fetch rows say the route returns the landing page and point to the G1661 v15 row and capture. A reconciliation block adds rows for the captures read and the two developer pages re-read.
3. Verification "Still unverified": the "sign-in wall" line for G1661 is marked superseded, with the capture named.
4. Practitioner eComEngine line and Open question 5: "Amazon's help page was unreachable" became "the dashboard's own help page was not read", with what Amazon's Listing quality page (G200786710 v5 r1) says and does not say. Open question 9: "unreachable" became "not read; no capture".
5. Item 12, Stable line and P-5: added Warning code 18367 (GXMA2QU3JZTG8JNL v1 r1). Amazon switches the product type based on the title, description and bullet points.
6. Items 18 and 48: the schema example's `item_type_keyword` `maxLength` 500 and Keyword attributes explained's 250-byte limit are stated as a disagreement between two Amazon sources. The binding write limit is read from `getDefinitionsProductType`.
7. Item 21: the PT01–PT08 slot mapping is noted, and the 8-versus-9 image count is pointed to `elements/images-and-video.md`. The slot count is read from the schema.
8. Item 31 and item 53: latency figures are marked as for human readers. The glossary's "can be slower or faster" is added, and the file points to P-funnel-and-search-15 (confirm by reading, not by a fixed wait). The last seat note now starts an effect window when the Catalog shows the new classification, not after 72 hours.
9. Item 52, Jungle Scout's fit line, the BSR Stable line and Open question 4: added Amazon's Sales Rank FAQ (G202059240 v2 r0). It says ranks are generated for "featured categories", which are "special browse nodes", and that the best sellers list updates hourly. The "hourly cadence has no Amazon page" line was out of date.
10. Item 57: the `generic_keyword` figures (200 on GBWHYLJ7NNQMXBAQ and GR7SLAHMDLBSSDHP; 249 / "less than 250" on GF2C2L6RCFZGWBXC; "less than 250" on G10471) are stated as a disagreement between Amazon's pages. The binding write limit is the schema's `maxUtf8ByteLength` / `maxLength`, checked with `VALIDATION_PREVIEW`. `elements/search-terms.md` (its F11 and Open question 13) still says 97779 appears only in an amazon.in staff reply. That file is the out-of-date one and was not edited here.
11. Item 35: the 2026-05-13 rename of Rufus to Alexa for Shopping is noted, pointing to `elements/bullet-points.md` G6 and G13. This file had not marked the rename unverified.
12. Stable lines: removed the seven-day link validity figure and the "roughly monthly" cadence. Both now point to the model and the FAQ. P-14 no longer states the bundle `unit_count` value; it points to the Price per unit page (item 37).
13. Checked and left unchanged: the modular-title cross-reference already names `elements/title.md`. The `generic_keyword` Catalog read-back is owned by `elements/search-terms.md`, and this file makes no claim about it. No reference to `inventory-and-fulfilment.md` or `elements/vendor-and-hybrid.md` exists in this file. Rate-limit figures, SQP, Keepa `/search`, `csv[17]`, deals, coupons and Data Kiosk roles are not stated here.
