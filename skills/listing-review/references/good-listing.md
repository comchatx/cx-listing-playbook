# What a good listing shows

## Marketplaces and off-listing content

- The seller's stores are listed in `marketplaceParticipations` (P-marketplaces-and-languages-2).
- A listing in an EU store needs GPSR content in the store's official language (manufacturer contact, an EU Responsible Person, warning and safety information or a safety attestation), and a missing item is a deactivation risk (P-marketplaces-and-languages-11).
- GPSR safety images go in Amazon's dedicated PS safety-image variants named on the store's layer of the Submitting manufacturer page, in the store's official language, not in the gallery (P-marketplaces-and-languages-12).
- Amazon's marking guidance accepts both CE and UKCA in Great Britain, and says EU and Northern Ireland sales need CE plus an EU Responsible Person (P-marketplaces-and-languages-13).
- A detail page may carry influencer videos the seller did not add (P-off-listing-traffic-10).
- Brand Store visits are not sessions or page views; Store traffic reaches Business Reports only as the detail-page visits it leads to (P-off-listing-traffic-3).
- Store insights, Amazon Live, Amazon Attribution and ad-attributed sales use their own attribution windows, credit rules and dating, so they neither add to Sales and Traffic units nor match them day by day (P-off-listing-traffic-6).

## Status and issues

- `getListingsItem` on `{sellerId}/<SKU>` returns `summaries` alone unless `attributes` and `issues` are named (P-listing-content-and-health-1).
- An ASIN is not a listing address (P-listing-content-and-health-1).
- `searchListingsItems` with `identifiersType=ASIN` returns the seller's SKUs for an ASIN, possibly several (P-listing-content-and-health-2).
- A healthy listing reads: `status` holds BUYABLE and DISCOVERABLE in every store, no issue is ERROR or carries a NOT_EXEMPT enforcement, and the Catalog shows what was submitted; Amazon says an empty `issues` list does not represent all problems (P-listing-content-and-health-3).
- DISCOVERABLE missing or `SEARCH_SUPPRESSED` is lost exposure, and BUYABLE missing, `LISTING_SUPPRESSED` or `CATALOG_ITEM_REMOVED` is lost sales; Amazon says a search-suppressed listing can stay buyable (P-listing-content-and-health-4).
- `SEARCH_SUPPRESSED` looks like a ranking loss in the metrics, `ATTRIBUTE_SUPPRESSED` means the value was rejected, and `EXEMPT_UNTIL_EXPIRY_DATE` carries its date (P-title-31).
- An active enforcement explains an exposure drop, and an `exemption.expiryDate` is a deadline (P-attributes-and-browse-nodes-19).
- One rule can carry an old and a new code (`90004145` and `90225` for a too-long `item_name`); the message, `attributeNames` and enforcement identify it alongside the code (P-title-32).
- Missing attributes show in `issues`: a required one carries the `MISSING_ATTRIBUTE` category, and gaps can also arrive as WARNING issues that name them in `attributeNames` (P-attributes-and-browse-nodes-9).

## Submitted versus shown

- Listings Items `attributes` hold the seller's submission; Catalog Items `attributes` and `classifications` hold Amazon's reconciled view (P-attributes-and-browse-nodes-10).
- Submitted and shown values can rightly differ through brand-owner precedence, Amazon's own data or a title split (P-listing-content-and-health-6).
- They also differ where a vendor or Amazon retail contributes to the ASIN (P-vendor-and-hybrid-6).
- A title shown in the Catalog can also differ from the submission through Amazon's split or AI rewrite (P-title-7).
- Empty `issues` on a write means Amazon accepted the submission, not that the page shows it; `getCatalogItem` shows what is live (P-vendor-and-hybrid-6).
- A Catalog value differing from an accepted submission is another contributor's or Amazon's value winning the page, not a failed write (P-brand-protection-and-catalog-contribution-1).
- An attribute the Catalog does not return, such as `generic_keyword`, has no Catalog value to differ from (P-brand-protection-and-catalog-contribution-1).
- A submitted value still not shown after the window Amazon states on Suggest changes to your product detail page means another contribution was chosen, and on a brand-registered ASIN Amazon says it displays the Brand Representative's contribution (P-description-24).
- Amazon's support route for a seller-side contribution that is not shown is a Seller Central support ticket for a brand owner, and the Vendor Manager or a Vendor Central case for a vendor (P-vendor-and-hybrid-7).
- Whether a content change can win the page depends on the seller's relationship to the brand: brand owner, Brand Representative, reseller or none (P-brand-protection-and-catalog-contribution-2).
- From a seller without a brand selling role on a brand-registered ASIN, a content write is a suggestion that will most likely not display (P-brand-protection-and-catalog-contribution-3).
- An offer-only listing may carry no `generic_keyword` (P-search-terms-17).

## Bullets

- Good bullets in Amazon's answers: no issue names `bullet_point`, the Catalog bullets equal the submitted ones, the count meets the minimum Amazon's bullet page and the schema set, and nothing repeats the title, description, Item Highlights or dedicated-field content (P-bullet-points-10).
- A fact an attribute already displays in the bullet area belongs in that attribute (P-bullet-points-27).
- Amazon's bullet page asks for the same bullets across a variation family, except a bullet describing the variant's own attribute (P-bullet-points-16).
- Research on claim lists finds that added weaker claims can lower the overall impression (P-bullet-points-28).

## Title

- A title is `item_name` and, where the product type's schema has it, `title_differentiation` (Item Highlights); the schema holds their limits, their unit (`maxLength` for characters, `maxUtf8ByteLength` for bytes) and whether `title_differentiation` exists (P-title-1).
- The live Product title requirements and guidelines page can be stricter than the schema (P-title-2).
- The order of a title's elements is set by the category's style guide where the seller has one, and otherwise by the "Information order" row of the title page (P-title-21).
- Amazon's help link to the category style guides lands on a page that carries none (P-title-21).
- A length figure in a category style guide is not the rule; the schema and the current title page govern (P-title-22).
- In a family the parent title is the detail page's display title and the child titles are the searchable units, and a policy breach in the parent title puts every child at risk (Error `18559`) (P-title-24).
- Amazon's title page asks for size and colour in the child titles and not in the parent title (P-title-13).
- Amazon's AI title proposals for a brand owner wait in Review Listings Changes and publish if left alone when the window closes (P-title-12).
- No API reads that queue, so its content reaches the box only as the seller's export (P-title-12).
- Amazon says its AI suggestions may add claims not in the original (P-title-18).
- Helium 10 reports that Amazon's AI title rewrites can break multi-word phrases apart, so a phrase the seller's Search Query Performance traffic depends on may no longer stand whole in `item_name` or Item Highlights; this rests on Helium 10's finding, not on an Amazon statement (P-title-35).

## Images

- Image suppression shows across the seller's catalog in the suppressed listings report, and Seller Central's Content compliance issues report is the seller's own view of it (P-images-and-video-22).
- Per SKU it shows in `issues` as `MISSING_IMAGE`, `INVALID_IMAGE` or an enforcement action such as `SEARCH_SUPPRESSED`, so a main image breaching the rules is an exposure risk as well as a click-through matter (P-images-and-video-2).
- The images shoppers see are read from `getCatalogItem` `includedData=images` alone, since Amazon picks among contributors and may show another seller's image or its own (P-images-and-video-18).
- The Catalog's images carry each image's variant, link and pixel size, and among contributors brand owners take precedence (P-images-and-video-7).
- The Live/Not Live status and the winning contributor show only in the seller's Image Manager view (P-images-and-video-18).

## Attributes and product type

- Amazon switches a listing that deviates from its selected product type to a recommended one, judged from attributes such as the title, description and bullets, and the new type's required attributes then read as missing (P-attributes-and-browse-nodes-5).
- The switch shows as warning `18367` and as a Catalog `productTypes` value that differs from the last recorded one (P-attributes-and-browse-nodes-5).
- A product type Amazon changes after a bullet write is part of that write's result, and the new type's schema is the one that applies (P-bullet-points-23).
- `searchDefinitionsProductTypes` recommends a type for a title; a listing whose type differs from it or from the Catalog's `productTypes` is at exposure risk (P-attributes-and-browse-nodes-4).
- Exposure also rests on classification: the Catalog's browse classification, the product type, and whether the browse node still exists in the browse tree (P-attributes-and-browse-nodes-7).
- The schema's enum holds the accepted `item_type_keyword` (US) or `recommended_browse_nodes` (other stores) values (P-search-terms-25).
- The browse tree report gives each node's refinements, with their attributes and accepted values (P-attributes-and-browse-nodes-8).

## Description and A+

- The description shown is the Catalog's; if it differs from the submitted one, the shown text is not the seller's (P-description-1).
- Published seller A+ (`EBC`), Basic or Premium, replaces the plain description in the Product description section; a Brand Story alone does not (P-description-21).
- Vendor A+ (`EMC`, or Keepa `aPlus[].fromManufacturer` true) sits under "From the Manufacturer" and is not proof that the plain description is hidden (P-description-4).
- Amazon says retail-vendor A+ in most cases appears in place of seller A+, and the seller cannot add or edit A+ on such an ASIN (P-description-4).
- Description visibility is per child ASIN and per publish-record `locale` (P-description-22).
- A+ is read and written only through the A+ Content API, never a Listings Items patch (P-a-plus-content-2).
- `searchContentPublishRecords` then `getContentDocument` show what is live (P-a-plus-content-4).
- A Brand Story is a `BrandStory` publish record, and its content document names the sibling ASINs and the Store its cards point to (P-brand-story-and-store-2).
- A+ needs a Brand Registry role, a brand-owned ASIN and no retail contribution; a 403 at submit is an eligibility answer (P-a-plus-content-3).

## Variations and review sharing

- A family has the seller's side (`relationships`, `variationParentSku`) and Amazon's (Catalog `relationships`) (P-variations-1).
- Amazon's variation rules require children to share the non-varying attributes (product type, brand, item type keyword, model name, style), to have the same function and purpose, and to follow the theme-value rules: colour holds only colour, size holds no compatibility, and a multi-pack is the manufacturer's (P-variations-14).
- A child differing in function, generation or model is a policy risk, and Amazon's answer is a separate detail page (P-variations-4).
- Joining a family to borrow reviews, rating or rank is variation abuse, the subject of the FTC's order against The Bountiful Company, and Amazon's channel for it is the Report abuse page (P-variations-5).
- A child's displayed rating or review count can drop with no new reviews when Amazon's review-sharing rule is applied to the family's theme (P-variations-6).
- Amazon names no appeal for a review-sharing decision (P-variations-22).
- The Featured Offer is decided per variation, and a child visit is not a parent visit (P-variations-16).
- Whether a child's rank is shared with the parent depends on its website display group, which shows in Catalog `salesRanks` or Keepa `websiteDisplayGroup` (P-variations-16).

## Badges, Prime and delivery

- A Best Seller rank of 1 in a Catalog `salesRanks` category is a candidate for the Best Seller badge, not proof: the badge also needs a featured category of at least the minimum size the Sales Rank FAQ states and a marketplace ordering threshold Amazon does not publish, and it is hidden on parent-rolled pages (P-badges-and-placements-2).
- The release and launch date attributes are the only listing-side lever Amazon names for New Release (P-badges-and-placements-3).
- Prime and the delivery promise are offer and fulfilment facts, read per offer from `getItemOffers` (`PrimeInformation`, `ShippingTime`) and `getCompetitiveSummary` (`primeDetails`), not listing content (P-badges-and-placements-6).
- A click-through change in a window where the Prime badge or shipping speed changed is not evidence about content (P-badges-and-placements-6).
- No API carries Amazon's Choice, Overall Pick, Climate Pledge Friendly, Small Business, Black-Owned Business or the Best Seller badge, so absence from the data is not absence of the badge (P-badges-and-placements-10).
- The Black-Owned Business badge follows the featured offer, so on a shared ASIN its appearance or disappearance is not the listing's (P-badges-and-placements-15).
- The frequently-returned badge is the one negative badge content can address; it is relative to similar ASINs, follows an at-risk warning in Voice of the Customer, and Amazon's remedy for it is accurate descriptions, images and size charts (P-badges-and-placements-11).
- Its removal is the badge clearing, not a fixed period (P-badges-and-placements-11).
- Keepa `returnRate` is the only API trace of the return badges: `1` low, `2` high, `null` unavailable or average (P-badges-and-placements-12).

## Brand Store

- Keepa's `brandStoreUrl` and `brandStoreName` show whether the byline leads to a Brand Store, as a present-state read with no history (P-brand-story-and-store-10).
- Store insights, followers and the Store quality rating are outside SP-API, in the Amazon Ads API or the seller's console (P-brand-story-and-store-12).
