# The listing write path

## PATCH and put

- A `patchListingsItem` operation adds, replaces or deletes a whole top-level attribute with its selector values, and leaves the attributes it does not name; a seller's `putListingsItem` replaces the item and drops every product fact it omits. (P-listing-writes-3)
- `mode=VALIDATION_PREVIEW` runs production's synchronous checks on a write without persisting it. (P-listing-writes-5)
- The schema fetched with `requirementsEnforced=NOT_ENFORCED` leaves required attributes unenforced and fits a partial (PATCH) payload; `ENFORCED` fits a full put. (P-attributes-and-browse-nodes-2)
- A length limit counts characters under `maxLength` and UTF-8 bytes under `maxUtf8ByteLength`. (P-attributes-and-browse-nodes-2)
- A search-terms edit is one `replace` on `/attributes/generic_keyword` carrying the full intended array. (P-search-terms-10; P-search-terms-22)
- A bullet edit is one `replace` on `/attributes/bullet_point` carrying every bullet in display order. (P-bullet-points-4)
- A description patch is one `replace` of the whole `product_description`; `merge` does not apply to it. (P-description-7)
- Amazon documents `merge` only for `fulfillment_availability` and `purchasable_offer`. (P-search-terms-22)
- A vendor `putListingsItem` merges and cannot remove an attribute, a vendor cannot delete a value with `patchListingsItem`, and a vendor cannot list offer-only. (P-vendor-and-hybrid-4)

## Value shape

- The Category Listings Report and inventory files name and format their columns differently from the product-type schema's attribute names (P-seller-central-only-tools-11).

- A value is an array of objects with `value` and the schema's selectors, such as `language_tag` and `marketplace_id`. (P-listing-writes-4)
- The selector key is `language_tag`, not `languageTag`, and its value takes an underscore, as in `en_US`, not `en-US`. (P-title-30)
- Each store's tag is in that store's schema under `$defs.language_tag`. (P-marketplaces-and-languages-7)
- Images go in their locator attributes with `media_location` (`main_product_image_locator`, `other_product_image_locator_N`, `swatch_product_image_locator`), as the schema names them. (P-images-and-video-4)

## What ACCEPTED means

- `ACCEPTED` means accepted for processing, not done. (P-listing-writes-6)
- Amazon raises issues asynchronously after acceptance, on a later `issues` read. (P-listing-policies-13)
- The Catalog view can differ from the submitted values through reconciliation, title splitting or another contributor's precedence, and it is what the shopper sees. (P-listing-writes-7)
- An image change is live when the Catalog shows the new image and `issues` carry no image problem. (P-images-and-video-8; P-images-and-video-19)
- A family write has taken when `issues` are empty and Catalog `relationships` show the intended parent, children and theme. (P-variations-10)
- Amazon's help pages state a display window per change type, the windows change with each page's revision, and for family changes the pages disagree with one another. (P-help-page-access-5; P-variations-23)

## One store per write

- A write to several stores at once exists only for `purchasable_offer` patches and deletes within one region, so title, bullets, description and keywords are written store by store, each in that store's language. (P-listing-writes-22)
- An image write applies to the ASIN in every store where it exists, whatever `marketplace_id` it carries. (P-listing-writes-10)
- Data requirements and help-page rules differ by store, each store having its own bullet requirements page and schema. (P-marketplaces-and-languages-8; P-bullet-points-25)
- A description change in one store is not known to reach another store, except that Amazon describes changes made in a Build International Listings source store as propagating to its target stores. (P-description-25; P-listing-writes-23)
- Where store layers disagree, as the title pages for Saudi Arabia, Egypt, Türkiye and the UAE do, the store's schema holds the limit Amazon validates. (P-title-23; P-marketplaces-and-languages-9)

## Sandbox

- The static sandbox returns canned replies, so it proves a request's shape and route, never the content's validity. (P-listing-writes-11)

## Locked attributes

- Whether an attribute can change on an existing item is the schema's `editable` keyword. (P-brand-protection-and-catalog-contribution-4)
- A change to a locked attribute returns issue `4005033`, a value that cannot be edited. (P-brand-protection-and-catalog-contribution-4)
- Issues `4005033`, `4005011` (a value that conflicts with another catalog item) and `4005039` (multiple submissions for the item) are resolved by a support case with the identifiers Amazon's resolution names, not by resubmitting. (P-brand-protection-and-catalog-contribution-4)

## Search terms

- A `VALID` preview proves only the schema's write limit; Amazon Search's indexing limit is a different limit. (P-search-terms-3; P-search-terms-21)
- Amazon says that over the indexing limit none of the terms are indexed. (P-search-terms-4)
- The indexing figure is on the marketplace's own "Use search terms effectively" page; the US page states none, so the US figure is on "Keyword attributes explained" and "Optimize your product discoverability". (P-search-terms-19)
- One marketplace's figure does not carry to another: Japan's differs. (P-search-terms-19)
- Amazon's relevance model may decline any supplied keyword, so a term in the field is not proof of indexing. (P-search-terms-12)
- Variation parents are not indexed; the terms shoppers reach are on each child listing. (P-search-terms-24)

## Enum values

- Channel codes, accepted fields and shipping-template keys are in the seller-specific schema (`getDefinitionsProductType` with `sellerId`), and a template is written by its `enum` key, not its display name. (P-inventory-and-fulfillment-15)
- Valid `item_type_keyword` and `recommended_browse_nodes` values are the schema's `enum` for that product type and store, though its `anyOf` passes other strings. (P-attributes-and-browse-nodes-6)
- `item_type_name` is a separate attribute from `item_type_keyword`, not a copy of it, and what it does is stated in the schema's description for that product type. (P-attributes-and-browse-nodes-21)
- Allowed variation themes and their required attributes are in the schema at the listing's `parentageLevel`, and a retired value is flagged `enumDeprecated`. (P-variations-2)
- A theme is not changed in place: Amazon documents a new family with the children moved, and the parent ASIN and reviews shown may change. (P-variations-15)
- The schema read at `parentageLevel=PARENT` holds a parent's title rules, and at `CHILD` a child's. (P-title-25)

## Unit count and size

- The schema's `required` shows whether a product type is in the price-per-unit scope, where a missing `unit_count` or `unit_count_type` is a search-suppression risk. (P-attributes-and-browse-nodes-14)
- In size-normalised product types Amazon derives the shown Size from `unit_count`, `number_of_items`, net content, weight or dimensions, not a typed `size`. (P-attributes-and-browse-nodes-15)
- Apparel and footwear sizes are the structured set the schema requires (system, class, value, range end, body or height type). (P-variations-18)
- A free-text or non-standard size loses size refinements. (P-attributes-and-browse-nodes-24)

## Compliance attributes

- Dangerous goods, battery, safety data sheet, Prop 65, CPSIA and GPSR values come from the seller: Amazon "cannot determine this information for you", and wrong values block sale. (P-attributes-and-browse-nodes-16)
- A Prop 65 warning on a variation parent fails; it goes on child SKUs. (P-attributes-and-browse-nodes-18)
- The compliance attributes are Amazon's only route for Prop 65, and a bullet does not stand in. (P-bullet-points-21)
- For an FBA product with a safety data sheet, the sheet's product name must be "the same as the listing title" and its manufacturer or brand must match the detail page. (P-attributes-and-browse-nodes-17)

## Restrictions

- `getListingsRestrictions` answers per store for a new offer on an existing ASIN, a category change or a product-type change: `APPROVAL_REQUIRED` with a link, or `NOT_ELIGIBLE`; an existing listing shows gating as `QUALIFICATION_REQUIRED` issues. (P-attributes-and-browse-nodes-23)

## A+ Content and Brand Story

- A+ is read and written only through the A+ Content API, not a Listings Items patch. (P-a-plus-content-2)
- A draft is judged by the `errors` and `warnings` of `validateContentDocumentAsinRelations` and by the ASIN badges, not by an HTTP 200. (P-a-plus-content-5)
- Brand Story is separate from A+ and the listing attributes, and is read through the A+ Content API. (P-brand-story-and-store-1)
- Brand Story validation does not check entitlements. (P-brand-story-and-store-4)
- Approving a Brand Story replaces the live story on every ASIN in its set, and posting an ASIN set replaces the whole set. (P-brand-story-and-store-3)

## Images and Seller-Central-only kinds

- An image write needs a URL Amazon can fetch, and a file in the seller's tree has none. (P-images-and-video-5)
- A replacement image is a new file at a new URL, and a new main image shows the same product; an identical file or a different product is refused. (P-images-and-video-20)
- Amazon requires the `contains-synthetic-performer` tag on an image or video that shows a photorealistic AI-generated person. (P-images-and-video-25; P-ai-shopping-surfaces-18)
- Main-block video, 3D models and Image-Manager-only image kinds are Seller Central tasks; the API's only video path is the A+ media library. (P-images-and-video-9)
- A detail-page video has an eligibility condition and a review before publication, stated in the current video guide. (P-images-and-video-24)
