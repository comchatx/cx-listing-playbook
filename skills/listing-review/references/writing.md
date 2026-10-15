# Writing a listing: schema, preview, title

## The schema validates the write

- The product-type schema that `getDefinitionsProductType` returns (Product Type Definitions API) and the listing's `issues` are the binding limit for a write (P-help-page-access-6).
- The schema holds the product type's required attributes, allowed values, limits, `editable` flags and selectors (P-listing-writes-1).
- It is read for a store and a seller (P-attributes-and-browse-nodes-1).
- Its limits differ by product type and marketplace (P-search-terms-2).
- The Amazon Product Type Definitions Meta-Schema (v1) names a limit's unit by its keyword: characters for `maxLength`, UTF-8 bytes for `maxUtf8ByteLength` (P-listing-writes-2).
- The validating keyword binds, not the attribute's description text, which can disagree with it (P-bullet-points-3).

## VALIDATION_PREVIEW changes nothing

- The Listings APIs FAQ says a Listings Items write sent with `mode=VALIDATION_PREVIEW` runs production's synchronous checks without persisting anything (P-listing-writes-5).
- A preview answers `status` `VALID`, a value returned only in that mode, or `INVALID` with its `issues` (P-listing-writes-5).
- The `issues` a preview returns are Amazon's verdict on the draft; a length counted in the box is not (P-title-5).
- Manage Listings Issues says the mode has lower rate limits and is meant for testing a small number of listings, not for production workflows (P-listing-writes-5).

## A long title may be split or rewritten

- On non-media product types the title is two attributes, `item_name` and `title_differentiation` (P-listing-writes-13).
- The schema `getDefinitionsProductType` returns shows whether `title_differentiation` exists for the product type (P-title-1).
- `title_differentiation` is accepted only with an `item_name` within the length Amazon ties to it; otherwise Amazon returns issue `100476`, which suppresses `title_differentiation` (P-title-4).
- Amazon's schema description and its title pages describe Item Highlights as comma-separated phrases, not full sentences, that do not repeat the item name (P-title-3).
- Amazon recommends keeping the brand name in `item_name` (P-title-3).
- Submit modular titles says an `item_name` longer than the length Amazon ties to `title_differentiation`, but within the maximum the page and the schema state, is accepted, and Amazon may reconcile it in the Catalog by splitting it across `item_name` and `title_differentiation` (P-listing-writes-13; P-title-4).
- Amazon's Seller Forums announcement on title updates says titles over the title policy's length are rewritten to an AI recommendation gradually (P-listing-writes-13).
- Product title requirements and guidelines says instead that a non-compliant existing title might be automatically corrected or might not appear in search results (P-listing-content-and-health-11).
- The listing's `status`, its `issues` and the Catalog name show which of these happened (P-listing-content-and-health-11).
- `getListingsItem` returns the submitted title in `attributes.item_name`, while its `summaries[].itemName` describes the ASIN (P-title-8).
- `getCatalogItem` returns the title Amazon shows, and a difference between the two is Amazon's split, its rewrite or another contributor's value (P-title-7).

## Counting in the box

- `printf %s "$t" | LC_ALL=C.UTF-8 wc -m` counts characters, the unit of `maxLength`, and `printf %s "$t" | wc -c` counts UTF-8 bytes, the unit of `maxUtf8ByteLength` (P-listing-writes-2; P-title-5).
- `printf %s "$t" | wc -c` counts the UTF-8 bytes of the whole string, spaces and punctuation included (P-search-terms-5).
- For search terms (`generic_keyword`), the schema's validator counts the whole string, spaces and punctuation included (P-search-terms-5).
- Use search terms effectively says Amazon Search does not count spaces or punctuation when it measures search terms against its indexing limit, so the UTF-8 byte count of the whole string is the stricter of the two counts (P-search-terms-20).
- The Japanese layers of Product title requirements and guidelines and Use search terms effectively state title and Item Highlights lengths in characters and search-term lengths in bytes (P-marketplaces-and-languages-10).
