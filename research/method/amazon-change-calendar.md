# Method: Amazon's change calendar — the structural breaks inside a baseline or year-over-year window

Read 2026-10-14 by the research seat. Tags: [official] Amazon's own page or document; [opinion] a named practitioner; [research] published research; [seat] the seat's own reasoning, never a skill position.

## What this covers

- **Funnel stage.** All three, by date. Each break below moves one stage's metric for reasons the seller did not cause:
  - exposure: title rewrites, Item Highlights becoming a search input, product-type attribute changes;
  - click-through: the Item Highlights display, Sponsored prompts;
  - conversion: the review-sharing split, Featured Offer eligibility.
- **Skills fed.** Mainly `effect-review`: its baseline and observation windows, the competitor subtraction, the confounder list and the "cannot tell" verdict. Also `listing-review`, when it compares this year with last year or reads a Catalog title that differs from what was submitted. And `listing-change-log`: the change file should record which known breaks fall inside its windows.
- **Why a senior operator cares.** A baseline that crosses one of these dates compares two regimes, and the change being judged gets the credit or the blame. Examples:
  - a seller that was ineligible for the Featured Offer becomes eligible, so its Featured Offer % rises with no price move;
  - a child ASIN loses its siblings' reviews, so its star rating and count fall with no customer change;
  - Amazon rewrites a title the seller never touched, so the Catalog title no longer equals what was submitted.

  An operator keeps such a calendar in their head. Today the dates are scattered across eight research files, and no file tells cx which dates to check. This file gathers them, re-reads each at its source, and says where cx finds the next one.

## Amazon's own rules and guidance

Each entry gives the date, what changed, and which metric or read it breaks. "RULE" marks an enforced change (policy, schema, system behaviour). "GUIDANCE" marks Amazon's advice.

### A. Listing-side and page-side breaks (what shoppers see or what Amazon does to a listing)

**A1. Title rule of 2025-01-21 (RULE; for windows that reach back into early 2025).**
- Posted 2025-01-03 (thread `datePublished` 2025-01-03T06:11Z). From 2025-01-21: "For most product categories, titles may not exceed 200 characters, including spaces". Certain special characters are banned. No word may appear "more than twice".
- On rewrites: "we'll provide override suggestions for non-compliant titles to brand owners in Review Listing Updates. Brand owners will have 14 days to act upon on the suggestions before we update the titles to comply with our requirements. These suggestions will be rolled out gradually." "Your listings will remain active during this process".
- So Amazon has been rewriting non-compliant titles since early 2025, not only since 2026. [official] (New product title requirements effective January 21, 2025, Seller Forums News and Announcements, News_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/b2b15728-0d43-453e-974f-59eb63f73059, read 2026-10-14)

**A2. Variation-theme cleanup, 2025-08-19/20 announcement and 2025-08-26 revision (RULE, narrowed).**
- The original News_Amazon thread (`datePublished` 2025-08-19T10:06Z, "updated by moderator"): "Between September 2, 2025, and November 30, 2025, we will remove variation themes from our product templates that aren't relevant or frequently used". Impacted themes are marked "Deprecated: Do Not Use". "If you try to update a listing with a deprecated variation theme, you'll receive an error message that states, "the value specified is invalid" and the update will not be successful." "If you're unable to update impacted variation themes, your child ASINs will remain active as stand-alone listings". The thread now opens with a pointer to the revision: "Please see the new announcement thread which covers updates made to the variation theme change". [official] (Removal of irrelevant variation themes will start September 2, Seller Forums News and Announcements, News_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/29b9e0b4-2b4d-4caa-b4af-83b57c47862d, read 2026-10-14)
- The revision thread's own record is `datePublished` 2025-08-26T15:08Z. It says: "On August 20, 2025, we announced that irrelevant or redundant variation themes would be removed from our listing experiences. These variation themes are marked as "Deprecated: Do Not Use" in our new product templates."
- The revision: "We've revised the list to only remove variation themes that had no sales in the past 12 months. Additionally, we won't remove any versions of critical variation themes like size, color, and style".
- On existing families: "Your existing variation families will continue to operate normally, with no disruption to sales … Child ASINs will stay active even if you choose to update your variation themes." [official] (Update to irrelevant or redundant variation theme removal, Seller Forums News and Announcements, News_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/0a027b19-0e4f-4525-9535-13aefae92cda, read 2026-10-14)
- The two Amazon threads date the first announcement differently: the revision says "On August 20, 2025", while the first thread's own `datePublished` is 2025-08-19 (UTC). The Seller News article of the same announcement redirects to Seller Central sign-in and was not read. The revision states no new window and does not repeat the error text; whether a deprecated theme is still refused is read at run time from the product type's schema (`getDefinitionsProductType`, the variation theme enumeration), not from either thread. [seat]
- Effect on windows: little for a family that kept its theme. For a family whose theme was removed, a family break or a re-theme is a break in every child's traffic and reviews. [seat]

**A3. Review sharing across variations, 2026-02-12 to 2026-05-31 (RULE, rolled out by category).**
- Posted 2026-01-07 (`datePublished` 2026-01-07T14:55Z). "Starting February 12, 2026, we're changing how reviews are shared across products in a variation". "Reviews will no longer appear on variations with significant differences which may affect your products' overall star ratings and review counts."
- Rollout: "we'll implement these changes gradually by product category between February 12, 2026, and May 31, 2026. You'll receive email notification 30 days before any changes affect your products."
- "If you need to update your variation themes after the change takes effect, reviews will be re-shared for eligible products." [official] (Changes to review sharing across product variations starting Feb 12, Seller Forums News and Announcements, News_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/a572986d-9bb1-4e91-a53f-41c575874dd7, read 2026-10-14)
- The live guideline page (version 3) repeats that it "may affect your products' overall star ratings and review counts". It lists what still shares (colour or pattern, same-function size, pack size, secondary scent, fitment) and what no longer shares (performance and power, platform, model or generation, bundles, flavour or formulation, primary scent, fit, material, design, intended user). It points to Seller Assistant to check eligibility. [official] (Guidelines for reviews shared across product variations, G74DLBUEHT5GY88C, https://sellercentral.amazon.com/help/hub/reference/external/G74DLBUEHT5GY88C, version 3, read 2026-10-14 through the help hub's content call; text kept as capture `G74DLBUEHT5GY88C-v3`)
- **The exact date for one product is not public.** It is in the 30-day email the seller received. The forum thread gives only the window.

**A4. "Rufus" renamed "Alexa for Shopping", 2026-05-13 (a name change; Amazon states no ranking change on that date).** "On May 13, 2026, Rufus was renamed Alexa for Shopping." This editor's note sits on the original 2024 Rufus launch post. [official] ('Amazon Rufus' AI experience comes to the Amazon Shopping app, aboutamazon.com, https://www.aboutamazon.com/news/retail/amazon-rufus, read 2026-10-14)

**A5. Modular titles, effective 2026-07-27; AI rewrites of non-compliant titles "throughout 2026" (RULE).**
- Posted 2026-06-10 (`datePublished` 2026-06-10T18:31Z), "updated by moderator". "Starting July 27, 2026, titles in all categories except for media will need to be 75 characters or less including spaces." "Item Highlights provides an additional 125 characters … This content is searchable and visible with titles in search results and on product detail pages."
- "After July 27, any titles still over 75 characters will be updated to the AI recommendation gradually. Your listings stay active throughout this process". "brand owners will have 14 days before implementation to review, modify, and approve AI-generated recommendations for titles and Item Highlights in Review Listings Changes." [official] (Updates to improve your product titles begin on July 27, Seller Forums News and Announcements, News_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/145b6d0f-999c-4555-896c-c694bda2e470, read 2026-10-14)
- The follow-up FAQ, posted 2026-07-29 (`datePublished` 2026-07-29T20:02Z):
  - "On July 27, 2026, we began making recommendations, using your existing product titles, on non-compliant listings. These changes will take place throughout 2026, and your listings will remain active, editable, and searchable, even if they haven't been updated yet."
  - "Item name and Item highlights are both inputs for search, and one isn't prioritized over the other."
  - "Your search and discoverability are unchanged."
  - On the bulk route (the Category Listings report, uploaded through the List Your Products tool): "Listings are typically updated within eight hours."
  - [official] (Answers to your product title update questions, Seller Forums News and Announcements, News_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/302aaac6-6f2b-4d86-bcd2-36fe24f0e6cd, read 2026-10-14)
- In the API: "If you submit an `item_name` longer than 75 characters (up to 200), Amazon may reconcile the value in the catalog, splitting it across `item_name` and `title_differentiation`. The `getListingsItem` and `searchListingsItems` operations return your original submitted value, while the catalog shows Amazon's reconciled version." [official] (Submit modular titles, https://developer-docs.amazon/sp-api/docs/submit-modular-titles, updatedAt 2026-09-10, read 2026-10-14)
- The SP-API Release Notes list this guide under 2026-09-30, "Documentation changes". [official] (SP-API Release Notes)
- The general rule on the title help page (version 21): "If your product is already listed and the title doesn't comply with these requirements or contains inaccurate information, the title might be automatically corrected or it might not appear in our search results." The same page: "After you submit changes to your title or item highlights, allow 24 to 48 hours for updates to be processed and displayed on Amazon stores." Its FAQ repeats the figure: the change "is accepted immediately but can take 24 to 48 hours to be processed and displayed on Amazon stores, including search results and the product detail page." [official] (Product title requirements and guidelines, GYTR6SYGFA5E3EQC, https://sellercentral.amazon.com/help/hub/reference/external/GYTR6SYGFA5E3EQC, version 21, read 2026-10-14 through the help hub's content call; text kept as capture `GYTR6SYGFA5E3EQC-v21`)
- **Two Amazon texts state the outcome for a non-compliant title differently.** The FAQ thread says listings "will remain active, editable, and searchable, even if they haven't been updated yet". The help page says such a title "might be automatically corrected or it might not appear in our search results". Neither is picked here. Whether one listing's title is suppressed from search is read at run time from that listing's issues (`getListingsItem` with `includedData=issues`) and the Catalog title, not inferred from either text. [seat, from the two official texts]
- **Latency figures are for human readers only.** Amazon states "within eight hours" for the bulk route and "24 to 48 hours" on the help page; other research files carry other figures for other paths (`method/listing-writes.md`, `method/funnel-and-search.md`, `method/effect-measurement.md`). This file sets no effect-window length from any of them. Whether a title change is live is read from the listing and the Catalog, as `method/funnel-and-search.md` P-15 says. [seat]
- The figures 75, 125 and 200 above are the posts' and the help page's, kept for human readers. The binding limits for `item_name` and `title_differentiation` (Item Highlights) are read at run time from `getDefinitionsProductType` for the listing's product type and store. [seat]

**A6. Item Highlights displayed under the title, from 2026-08-10 (RULE, display).** "effective August 10, 2026, Item highlights will display beneath the Item name across desktop and mobile. The number of characters that are visible on screen may vary". [official] (Answers to your product title update questions, above)

**A7. Featured Offer seller eligibility removed, July 2026 to end of 2026; done in the US "as of September 2026" (RULE).**
- Posted 2026-07-06 (`datePublished` 2026-07-06T15:47Z). "Starting in July 2026, we'll begin removing seller eligibility requirements for the Featured Offer. This change will roll out gradually across all Amazon stores globally, completing by the end of 2026."
- "We're not changing how the Featured Offer is selected." "Being considered for the Featured Offer doesn't guarantee your offer will be featured." [official] (Updates to Featured Offer eligibility requirements, Seller Forums News and Announcements, News_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/7336583f-09ac-41de-99d1-667017a88db2, read 2026-10-14)
- US help, version 23 of the old eligibility page: "This page has been removed. As of September 2026, Amazon no longer maintains a seller eligibility requirement, and offers from all sellers are now eligible to be evaluated for the Featured Offer." [official] (Featured Offer eligibility, G200418100, https://sellercentral.amazon.com/help/hub/reference/external/G200418100, version 23, read 2026-10-14 through the help hub's content call; text kept as capture `G200418100-v23`)
- Becoming the Featured Offer (version 20) repeats this. It adds: "Amazon will not feature any offer if none of the available offers meet our customer experience requirements, even if the product has only one available offer."
- The same page defines the Business Reports metric: "Your Featured Offer percentage is calculated as the total number of page views in which your offer is featured divided by the total number of page views for your products." [official] (Becoming the Featured Offer, G201687550, https://sellercentral.amazon.com/help/hub/reference/external/G201687550, version 20, read 2026-10-14 through the help hub's content call; text kept as capture `G201687550-v20`)
- **Two Amazon texts give the timing differently.** The announcement gives a store-by-store rollout from July 2026 to the end of 2026. The US help pages say "As of September 2026" for the US. Neither is picked here: whether a store has changed, and when, is read at run time from that store's own Featured Offer eligibility page and the seller's Featured Offer % series around the change (as `angles/own-traffic-funnel.md` and `method/funnel-and-search.md` also say). The removal is of the *seller* requirement; offer-level price ineligibility under Pricing Health stays (`method/funnel-and-search.md`). [seat, from the official texts]
- **Effect on windows.** For a seller whose offers were excluded before, Featured Offer % and every conversion figure built on it moves on a store-specific date between July and the end of 2026. For a seller who was always eligible, the competition for the Featured Offer may widen. Amazon says selection is unchanged, so no direction can be read from the announcement. [seat]

### B. Data-side breaks (the series cx reads changed shape or source)

**B1. Legacy XML and flat-file listings feeds. Amazon's pages give three removal dates.**
- The original changelog: "you have until March 31, 2025 to migrate". It adds: "This deprecation does not impact any listings feeds submitted by sellers directly through Seller Central." [official] (Deprecation of Feeds API support for XML and Flat File Listings Feeds, https://developer-docs.amazon/sp-api/changelog/deprecation-of-feeds-api-support-for-xml-and-flat-file-listings-feeds, read 2026-10-14)
- Release Notes, June 25, 2025: "The removal date for the following Feeds type values has changed from June 30, 2025 to July 31, 2025" (`POST_PRODUCT_DATA`, `POST_PRODUCT_RELATIONSHIP_DATA`, `POST_FLAT_FILE_LISTINGS_DATA` and others). [official] (SP-API Release Notes)
- The mapping guide: "Starting **July 31, 2025**, the Feeds API no longer supports legacy XML and flat file listing feeds … Developers will receive fatal `processingStatus`". [official] (Mapping product attributes to the Listings Items API and JSON-based feeds, https://developer-docs.amazon/sp-api/docs/mapping-product-attributes, updatedAt 2026-09-09, read 2026-10-14)
- **The Deprecation Schedule, updatedAt 2026-09-09, lists the same feed types with Deprecation date March 18, 2024 and Removal date December 3, 2025.** [official] (SP-API Deprecation Schedule, https://developer-docs.amazon/sp-api/docs/sp-api-deprecations, read 2026-10-14)
- Effect on windows: none on shopper metrics. It matters only if a seller's tool stopped writing in 2025 and the listing went stale. [seat]

**B2. Catalog Items v0 `getCatalogItem` / `listCatalogItems`.**
- The schedule shows removal on April 24, 2025.
- The January 29, 2025 release note had moved the date "from December 11, 2024 to March 31, 2025".
- `listCatalogCategories` was deprecated May 21, 2025, with removal on August 26, 2026.
- [official] (SP-API Deprecation Schedule; SP-API Release Notes)

**B3. SQP and Search Catalog Performance through the Reports API, from the February 26, 2025 release.** That release "Added two new Analytics Reports": Search Catalog Performance and Search Query Performance. On June 25, 2025, SQP gained "the ability to query a space-separated list of ASINs". [official] (SP-API Release Notes) API history for these two reports starts at the earliest period the report can be requested. That is a reach limit, not a regime change. [seat]

**B4. Data Kiosk Sales and Traffic dataset version.**
- `analytics_salesAndTraffic_2023_11_15` was deprecated on August 27, 2025.
- Its removal date differs between pages: "will be removed on February 26, 2026" in the release notes, and March 27, 2026 in the Deprecation Schedule.
- A series built on the old version cannot be extended with it. [official] (SP-API Release Notes; SP-API Deprecation Schedule)
- The successor `analytics_salesAndTraffic_2024_04_24` gained `salesAndTrafficTrends` on August 27, 2025. It gained B2B refund, feedback and claim metrics in the January 28 and February 23, 2026 notes. [official] (SP-API Release Notes)

**B5. Seller Analytics dataset, 2026-09-30.**
- "Added the Seller Analytics dataset … sales, traffic, promotions, account health, search, reviews, defects, and returns." [official] (SP-API Release Notes, September 30, 2026)
- In its schema, `Traffic.conversationRatePct` is `@deprecated(reason: "No longer supported. Use conversionRatePct instead.")`. Both are described as "the percentage of purchases to clicks for ASINs originated from the search results page".
- `featureOfferPct` is "calculated by dividing the number of times your offer is the Featured Offer by the number of times customers viewed it (that is, Glance Views)". [official] (analytics_sellerAnalytics_2025_03_31.graphql, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/schemas/data-kiosk/analytics_sellerAnalytics_2025_03_31.graphql, read 2026-10-14)
- The Sales and Traffic dataset's `buyBoxPercentage` is described as "The percentage of page views where the buy box (the add to shopping cart link) appeared on the page for customers to add your product to their cart". [official] (analytics_salesAndTraffic_2024_04_24.graphql, same repository, read 2026-10-14)
- The Business reports glossary gives a fourth wording: "The percentage of page views where the Featured Offer (the "Add to shopping cart" link) appeared on the page for customers to add your product to their cart." [official] (Business reports glossary, G27691, https://sellercentral.amazon.com/help/hub/reference/external/G27691, version 7, read 2026-10-14 through the help hub's content call; text kept as capture `G27691-v7`)
- So Amazon's own pages carry four wordings, with two denominators (page views in Business Reports, the glossary, Becoming the Featured Offer and Sales and Traffic; glance views in Seller Analytics), for what operators call Featured Offer %. A series must not switch between them inside one window. [seat, from the four official texts]
- The Seller Analytics `conversionRatePct` is search-originated purchases over clicks. It is not Business Reports' unit session percentage, and a series must not be spliced from the two. [seat, from the schema text above]

**B6. Product Type Definitions `parentageLevel`, 2026-05-27.**
- "Added the optional `parentageLevel` query parameter to retrieve schemas for a specific listing parentage level". [official] (SP-API Release Notes, May 27, 2026)
- The model describes it as "the schema is simplified by resolving all conditional logic related to the specified parentage level". The model also offers `productTypeVersion`, which "Defaults to "LATEST". Prerelease versions of product type definitions may be retrieved with "RELEASE_CANDIDATE"". [official] (definitionsProductTypes_2020-09-01.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/product-type-definitions-api-model/definitionsProductTypes_2020-09-01.json, read 2026-10-14)
- This changes how cx reads the schema. It does not change shopper metrics. [seat]

**B7. Product-type metadata changes, monthly (RULE, schema).**
- The page lists one release per month, each with a spreadsheet of changes per store, product type and attribute. 2026 rows: January 26, February 23, March 30, April 27, May 25, June 29, July 27, August 31, September 28. 2025 rows: January 26, February 23, March 23, April 27, May 25, June 29, July 27, August 24, September 28, October 26, November 9, December 14.
- "These adjustments eliminate redundant attributes and improve the curation of attributes and enumeration values". [official] (SP-API Product Metadata Updates, https://developer-docs.amazon/sp-api/docs/sp-api-metadata-updates, updatedAt 2026-09-10, read 2026-10-14)
- The July 2026 spreadsheet opens: "Based on customer search and buying signals, we review the product attributes and make necessary updates … we are making the following changes to product attributes on 27th July 2026". Its rows carry a status of "Published" or "Upcoming".
- The most common US change type in that file was "Attribute is deleted and no longer associated with the product type." Others: "A new conditionally required attribute is introduced", and the maximum count of an attribute "decreased from 2 to 1". [official] (Release_Notes_API_July_2026.xlsx, https://m.media-amazon.com/images/G/01/VSSC/API_release_notes/Release_Notes_API_July_2026.xlsx, read 2026-10-14)
- No US row in that file named a title, bullet, description, search-term or variation attribute (the seat's filter on attribute names).
- Effect on windows: a newly required attribute can raise a listing issue the seller did not cause. [seat]

**B8. Promotions data.**
- July 29, 2026: "Added the `promotions` array to the `getCompetitiveSummary` operation … for `Coupon`, `Deal`, and `Basket_Building` promotions."
- August 26, 2026: "Launched the new Promotions API … deals, coupons, price discounts, and basket building promotions". The same release added `promotionsApiMappingId` to `GET_COUPON_PERFORMANCE_REPORT` and `GET_PROMOTION_PERFORMANCE_REPORT`.
- [official] (SP-API Release Notes)
- Before 2026-07-29, no SP-API read showed competitors' live promotions. A competitor's coupon inside an older baseline is invisible to cx and stays an unmeasured confounder. [seat]

**B9. Listings issue categories, 2026-09-30.** "Added PRODUCT-level and LISTING-level issue classification to the `categories` attribute in issue descriptions returned by the `getListingsItem` and `searchListingsItems`." [official] (SP-API Release Notes, September 30, 2026) Issues stored before that date lack the two categories.

**B10. A+ Content API, 2026-09-30.**
- "Added support for the 19 Premium A+ content modules and five Brand Story content modules through the same operations used for Standard A+ Content", plus `createMedia` / `getMedia` / `updateMedia`. [official] (SP-API Release Notes, September 30, 2026)
- **This is API support for module types that already exist, not new modules on the page.** The lead's wording "new A+ modules 2026-09-30" overstates it.

**B11. Notifications.**
- `LISTINGS_ITEM_ISSUES_CHANGE` payload version 1.0 is listed with Removal date August 26, 2026, deprecated February 28, 2024. An older release note, December 18, 2024, had set the removal to March 26, 2025, so the date moved at least once.
- `ORDER_STATUS_CHANGE` removal: July 29, 2026.
- [official] (SP-API Deprecation Schedule; SP-API Release Notes)

**B12. Pricing reference prices.**
- June 25, 2025: "Added the `CompetitivePrice` value to the `getCompetitiveSummary` operation. You can use this value to determine featured offer eligibility based on the lowest price recently found at a reputable retailer outside of the Amazon store."
- `CompetitivePriceThreshold` was removed September 30, 2025.
- [official] (SP-API Release Notes; SP-API Deprecation Schedule)

**B12a. Business Reports traffic gained mobile app data, 2022-03-29 (data-side).** "Since March 29, 2022, Page views and Sessions metrics include mobile app and browser traffic data, such as page views, page views percentage, sessions, sessions percentage, order item session percentage, order item session percentage for B2B, unit session percentage, unit session percentage for B2B, and Featured Offer (Buy Box) percentage." [official] (Business Reports FAQ, G28761, https://sellercentral.amazon.com/help/hub/reference/external/G28761, version 7, read 2026-10-14 through the help hub's content call; text kept as capture `G28761-v7`) A year-over-year series that reaches back across that date compares two traffic definitions. [seat]

**B13. Keepa: `reviews.ratingCount` frozen since 2025-04-09 (third-party data, stated by Keepa).**
- The `reviews` object "Contains variation specific review and rating counts histories". "The ratingCount history has not been updated since April 9th 2025 as that data point was removed by Amazon."
- The same sentence sits on `ReviewObject.ratingCount`.
- The non-variation series `csv[17]` (`COUNT_REVIEWS`) is documented in Product.java as "The product's review count history". It carries no freeze note.
- [Keepa's own code documentation, not Amazon] (keepacom/api_backend, Product.java, https://github.com/keepacom/api_backend/blob/master/src/main/java/com/keepa/api/backend/structs/Product.java, last commit 2026-07-25, read 2026-10-14)
- **Keepa's two documents name slot 17 differently.** Keepa's web Product Object page calls the same slot "The product's rating count history", and carries the same freeze note on the `reviews` object only ("The ratingCount history has not been updated since April 9th 2025 as that data point was removed by Amazon."). [Keepa's own documentation, not Amazon] (Product Object, https://keepa.com/api-docs/product-object.html, read 2026-10-14) So files that call `csv[17]` "rating count" (`angles/competitor-set.md`, `angles/competitor-discovery.md`, `method/effect-measurement.md`) and files that call it "review count" (`angles/reviews-and-qa.md`, `method/triggers.md`, this file's earlier wording) each quote a real Keepa document. Neither is picked here; a series read from slot 17 is named as the document cx cites names it, and whether it stopped or changed meaning in April 2025 stays open (Open question 4).
- Amazon published nothing about removing a ratings data point that this seat could find. The search budget ran out; see Open questions.

### C. Ads- and fee-side breaks (inputs to the confounder list)

**C1. Sponsored Products and Sponsored Brands prompts (US GA 2026-03-25).** Announced 2026-03-10:
- the prompts are "officially moving from open beta to general availability in the U.S. on March 25, 2026";
- "Sponsored Products prompts and Sponsored Brands prompts were introduced in November 2025 in open beta";
- "campaigns will be automatically enrolled in prompts";
- "we will begin to charge for these ads as part of your CPC bidding and billing parameters";
- "When clicked, prompts may open a dialog in Rufus".

[official] (Sponsored Products prompts and Sponsored Brands prompts, Amazon Ads, https://advertising.amazon.com/resources/whats-new/unboxed-2025-sponsored-products-and-sponsored-brands-prompts, read 2026-10-14) An ad-spend or ad-click series that crosses 2026-03-25 (US) includes a new paid placement the seller did not add.

**C2. FBA fee change, effective 2026-01-15 (US).**
- "In 2026, FBA fees will increase by an average of $0.08 per unit sold … This is on top of no increase in US Referral and FBA fees in 2025." "Unless otherwise noted, all changes will be effective January 15, 2026." [official] (2026 Updates to US Referral and Fulfillment by Amazon Fees, Seller Forums News and Announcements, News_Amazon, posted 2025-10-15, https://sellercentral.amazon.com/seller-forums/discussions/t/f3fa3211-820b-4e2e-a023-158a9cf55f99, read 2026-10-14)
- The letter's cadence: "Near the end of each year, we provide our selling partners with an update on changes to Referral, Fulfillment by Amazon (FBA), and other fees". [official] (2026 Amazon Referral & FBA Fee Updates, Amazon Selling Partners blog, https://sellingpartners.aboutamazon.com/update-to-u-s-referral-and-fulfillment-by-amazon-fees-for-2026, published 2025-10-15, read 2026-10-14)
- A fee date is a reason for competitor price moves, so it is a price-position confounder. It does not itself break listing metrics. [seat]

### D. Major sales

Sale dates (Prime Day, Prime Big Deal Days, Black Friday Week) are the business of `research/angles/seasonality-and-events.md`, which re-read them. They are not repeated here. That file notes that a 30-day baseline pulled on 2026-10-13 already contains Prime Big Deal Days 2026.

## What practitioners add

- **The original theme-removal window.** Luís Rijo, PPC Land, "Amazon halts variation theme cleanup after seller backlash", 2025-08-26 (https://ppc.land/amazon-halts-variation-theme-cleanup-after-seller-backlash/): "According to the original August 20, 2025 announcement, Amazon planned to remove variation themes between September 2, 2025, and November 30, 2025." The article relays Jon Elder's LinkedIn posts: after the clarification "99.99% of brands will not be affected." [opinion] The window agrees with Amazon's own first thread (A2). Amazon's revision, read above, gives no window.
- **The April 2025 ratings change seen from the page.** Mariya Babaskina (Yogi), "Amazon's Evolving Review Landscape: Making Sense of Quiet Changes", 2025-06-09 (https://www.meetyogi.com/post/amazons-evolving-review-landscape-making-sense-of-quiet-changes):
  - "In March, Amazon updated its system to limit ratings-only submissions";
  - "Most recently, in April, Amazon also removed the separate display of ratings-only from product pages entirely";
  - "The only visible metric is now the total global ratings".

  [opinion] The article gives no year with "April", but its publication date makes it 2025. This agrees with Keepa's "April 9th 2025 … removed by Amazon" and is the only explanation of that note this seat found.
- **Keepa's count relabelled.** Simon Knight, FBA Mogul, "Keepa Product Finder: Every Filter Explained (2026 Guide)", 2026-04-03 (https://fbamogul.com/keepa-product-finder-getting-started-guide/): the filter is "The total number of ratings submitted for the product, including ratings without written reviews", and "Keepa notes this was previously labelled "Review Count"; it now reflects all ratings, not just written reviews." [opinion] The guide is about the Product Finder filter. It does not say whether `csv[17]` changed meaning, or when.
- **A seller's reading of the title change.** In the FAQ thread above, one seller wrote: "I have definitely noticed about a 2 week dip in traffic on the titles I have updated. I'm assuming that is the reindexing period." Another said the deadline had been "shadow extended". [opinion, Seller Forums replies, unnamed seller accounts, 2026-07/08] One account, no data. This disagrees with Amazon's "Your search and discoverability are unchanged."

No practitioner was found who publishes a maintained calendar of Amazon structural breaks for analysts. The seat's search budget ran out before a wider search could be made.

## Published research

- **Brodersen, Gallusser, Koehler, Remy, Scott, "Inferring causal impact using Bayesian structural time-series models", *The Annals of Applied Statistics* 9(1), 2015, 247–274, doi 10.1214/14-AOAS788.** [research] The method builds the counterfactual for a treated series from control series. The authors state the limit plainly: "As long as the control series received no intervention themselves, it is often reasonable to assume the relationship between the treatment and the control series that existed prior to the intervention to continue afterwards. Thus, a plausible estimate of the counterfactual time series can be computed up to the point in time where the relationship between treatment and controls can no longer be assumed to be stationary, for example, because one of the controls received treatment itself." They also say "all preceding results are based on the assumption that the model structure remains intact throughout the modelling period."
  - *Transfer:* direct, in logic. The package's competitor-set subtraction is a simple control-series design. An Amazon change that reaches the seller and the competitors on different dates breaks the pre-period relationship the subtraction relies on. Examples: review sharing by category, Featured Offer eligibility by store, title rewrites of non-compliant listings only. The paper tested advertising campaigns on search-related site visits, not Amazon listings.
- **Bai and Perron, "Estimating and Testing Linear Models with Multiple Structural Changes", *Econometrica*, 1998, doi 10.2307/2998540.** [research] The abstract says the paper "develops the statistical theory for testing and estimating multiple change points in regression models". It gives "Several test statistics … to determine the existence as well as the number of change points".
  - *Transfer:* narrow. It shows that unknown break dates can be estimated from a series. A daily listing series is too short and noisy for this to replace a known-date calendar. This is the seat's judgement, and the paper says nothing about listings.

## Stable enough for a skill

- Amazon changes listing rules, page display and data products on dated announcements. The dates live on Amazon's pages, not in memory. (SP-API Release Notes; SP-API Deprecation Schedule; Seller Forums News and Announcements)
- A window that crosses an Amazon rule or display change compares two regimes for the metric that change touches. (Brodersen et al. 2015, on the stability assumption; the announcements in A1–A7 each state an effect on ratings, titles or eligibility)
- Amazon rewrites non-compliant titles itself, including titles nobody resubmitted. Brand owners get a review period in Review Listing Changes before the rewrite (its length is set by the announcement). The announcements say the listing stays active; the title help page says a non-compliant title might be corrected or might not appear in search results, so the listing's own issues are read rather than either text assumed. (New product title requirements effective January 21, 2025; Updates to improve your product titles begin on July 27; Answers to your product title update questions; Product title requirements and guidelines)
- Listings Items returns the value the seller submitted, and the Catalog returns Amazon's reconciled value. A difference between the two is not by itself evidence of a seller edit. (Submit modular titles)
- Review sharing between variations depends on the variation theme and on whether the children differ in function. A change to sharing changes a child's displayed rating and count with no new reviews. (Changes to review sharing across product variations starting Feb 12; Guidelines for reviews shared across product variations)
- Amazon's Featured Offer selection did not change with the eligibility removal. Which sellers are considered did change. (Updates to Featured Offer eligibility requirements; Becoming the Featured Offer)
- Amazon defines Featured Offer % over page views in Business Reports and over glance views in the Seller Analytics dataset. (Becoming the Featured Offer; Business reports glossary; analytics_sellerAnalytics_2025_03_31.graphql; analytics_salesAndTraffic_2024_04_24.graphql)
- Product-type attributes change on releases Amazon lists on the Product Metadata Updates page. The upcoming version can be read before it goes live. (SP-API Product Metadata Updates; definitionsProductTypes_2020-09-01.json `productTypeVersion` RELEASE_CANDIDATE)
- Keepa's variation-specific `ratingCount` history stopped on 2025-04-09, by Keepa's own note. Keepa's two documents name `csv[17]` differently (rating count on the web page, review count in the Java client). (Product.java; Keepa Product Object)

## What cx must read at run time

- **New Amazon API-side breaks:**
  - the SP-API Release Notes page (https://developer-docs.amazon/sp-api/docs/sp-api-release-notes);
  - the SP-API Deprecation Schedule (https://developer-docs.amazon/sp-api/docs/sp-api-deprecations).

  These are documentation pages, read through the box's web access, not through the SP-API door. Where the two disagree on a removal date, cx reports both.
- **Schema changes for this listing's product type:**
  - `getDefinitionsProductType` with `productTypeVersion=LATEST`, and `RELEASE_CANDIDATE` when the seller asks what is coming;
  - `productTypeVersion.version` in the reply, stored in the change file at baseline and compared at review;
  - the SP-API Product Metadata Updates page for the month's spreadsheet.
- **Whether Amazon changed the title:**
  - Catalog Items `getCatalogItem` (summaries `itemName`, attributes `item_name` / `title_differentiation`) against Listings Items `getListingsItem` attributes;
  - Review Listing Changes in Seller Central, which has no API (the seller puts it in the tree).
- **Issues raised by a schema change rather than an edit:** Listings Items `getListingsItem` with `includedData=issues`. From 2026-09-30, issue `categories` include `PRODUCT` / `LISTING`.
- **Policy and display announcements:** Seller Forums News and Announcements (News_Amazon threads). The thread pages are public. Their `datePublished` gives the post date, while the page itself shows only "N months ago". Seller News articles sit behind sign-in.
- **Seller Central help pages (title rules, review sharing, Featured Offer, Business Reports):** the live page text and its version. The texts quoted here are the 2026-10-14 captures under the office's capture folder (outside this repository); the live page wins. The route, its fallbacks and the standing question over it are `method/help-page-access.md`'s.
- **The date review sharing changed for one product:** not in any API. It is in the seller's 30-day notice email, or Seller Assistant's eligibility check. cx asks the seller.
- **Featured Offer % series:**
  - Business Reports / `GET_SALES_AND_TRAFFIC_REPORT` or Data Kiosk Sales and Traffic `buyBoxPercentage` (page views);
  - Data Kiosk Seller Analytics `traffic.featureOfferPct` (glance views).

  Report names, options and waits are owned by the SP-API door's own reference, `door.md`, which sits outside this package (as `method/sp-api-access.md` also says) (operations `createReport`, `getReport`, `getReportDocument`; Data Kiosk `createQuery`, `getQuery`, `getDocument`).
- **Competitor promotions inside a window:** Product Pricing `getCompetitiveSummary` `promotions`, from 2026-07-29 only. The seller's own promotions come from the Promotions API (from 2026-08-26) or the coupon / promotion performance reports (door.md's).
- **Keepa rating series:** `csv[16]` (rating), `csv[17]` (`COUNT_REVIEWS`: "rating count history" on Keepa's web page, "review count history" in Product.java) and `reviews.ratingCount` / `reviews.reviewCount`, read from the landed file (`cx get amazon/us/<ASIN>/product --source keepa`). cx checks the series' last timestamp, and Keepa's Product Object page and Product.java doc comments, if a series looks frozen.

## Pages read

| Page name | URL | Date read | What it gave |
|---|---|---|---|
| SP-API Release Notes | https://developer-docs.amazon/sp-api/docs/sp-api-release-notes (.md form; updatedAt 2026-10-01) | 2026-10-14 | All dated API entries 2025-01 to 2026-09-30 (B1–B12, A5 guide date) |
| SP-API Deprecation Schedule | https://developer-docs.amazon/sp-api/docs/sp-api-deprecations (updatedAt 2026-09-09) | 2026-10-14 | Removal dates; legacy feeds Dec 3, 2025; DK dataset Mar 27, 2026; issues-notification v1.0 Aug 26, 2026 |
| Deprecation of Feeds API support for XML and Flat File Listings Feeds | https://developer-docs.amazon/sp-api/changelog/deprecation-of-feeds-api-support-for-xml-and-flat-file-listings-feeds | 2026-10-14 | Original March 31, 2025 date; Seller Central uploads not affected |
| Mapping product attributes to the Listings Items API and JSON-based feeds | https://developer-docs.amazon/sp-api/docs/mapping-product-attributes | 2026-10-14 | "Starting July 31, 2025" banner |
| Feed Type Values | https://developer-docs.amazon/sp-api/docs/feed-type-values | 2026-10-14 | Deprecation banner only |
| Migrate product feeds workflows (guessed slug) | https://developer-docs.amazon/sp-api/docs/migrate-product-feeds-workflows.md | 2026-10-14 | unreachable: "Page Not Found" (slug guessed by the seat; not cited) |
| SP-API Product Metadata Updates | https://developer-docs.amazon/sp-api/docs/sp-api-metadata-updates (updatedAt 2026-09-10) | 2026-10-14 | Monthly release rows 2024–2026 |
| July 2026 Selling Partner Release Notes (spreadsheet) | https://m.media-amazon.com/images/G/01/VSSC/API_release_notes/Release_Notes_API_July_2026.xlsx | 2026-10-14 | Row shape, statuses, change types |
| Submit modular titles | https://developer-docs.amazon/sp-api/docs/submit-modular-titles (updatedAt 2026-09-10) | 2026-10-14 | Submitted vs reconciled title; effective date |
| definitionsProductTypes_2020-09-01.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/product-type-definitions-api-model/definitionsProductTypes_2020-09-01.json | 2026-10-14 | `parentageLevel`, `productTypeVersion` (LATEST / RELEASE_CANDIDATE) |
| analytics_sellerAnalytics_2025_03_31.graphql | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/schemas/data-kiosk/analytics_sellerAnalytics_2025_03_31.graphql | 2026-10-14 | `conversationRatePct` deprecated; `featureOfferPct` over glance views |
| analytics_salesAndTraffic_2024_04_24.graphql | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/schemas/data-kiosk/analytics_salesAndTraffic_2024_04_24.graphql | 2026-10-14 | `buyBoxPercentage` over page views |
| New product title requirements effective January 21, 2025 | https://sellercentral.amazon.com/seller-forums/discussions/t/b2b15728-0d43-453e-974f-59eb63f73059 | 2026-10-14 | 2025 rule; override suggestions; 14 days |
| Update to irrelevant or redundant variation theme removal | https://sellercentral.amazon.com/seller-forums/discussions/t/0a027b19-0e4f-4525-9535-13aefae92cda | 2026-10-14 | Revision text; `datePublished` 2025-08-26 |
| Removal of irrelevant variation themes will start September 2 | https://sellercentral.amazon.com/seller-forums/discussions/t/29b9e0b4-2b4d-4caa-b4af-83b57c47862d | 2026-10-14 | Sept 2 – Nov 30, 2025 window; "Deprecated: Do Not Use"; "the value specified is invalid"; pointer to the revision; `datePublished` 2025-08-19 (reconciliation read) |
| Seller News article on theme removal (2025-08-20) | https://sellercentral.amazon.com/seller-news/articles/QTJFVVExV1RHQ1RCRzIjR0VaM1RZNlJaS0NMUlJNOQ | 2026-10-14 | unreachable: redirects to Seller Central sign-in (a Seller News article, not a help page; its content is in the News_Amazon thread above) |
| Changes to review sharing across product variations starting Feb 12 | https://sellercentral.amazon.com/seller-forums/discussions/t/a572986d-9bb1-4e91-a53f-41c575874dd7 | 2026-10-14 | Window, category rollout, 30-day email; `datePublished` 2026-01-07 |
| Guidelines for reviews shared across product variations (G74DLBUEHT5GY88C, v3) | https://sellercentral.amazon.com/help/hub/reference/external/G74DLBUEHT5GY88C | 2026-10-14 | Share / no-share lists; Seller Assistant (read via the help hub content call; capture capture `G74DLBUEHT5GY88C-v3`) |
| 'Amazon Rufus' AI experience comes to the Amazon Shopping app | https://www.aboutamazon.com/news/retail/amazon-rufus | 2026-10-14 | "On May 13, 2026, Rufus was renamed Alexa for Shopping." |
| Updates to improve your product titles begin on July 27 | https://sellercentral.amazon.com/seller-forums/discussions/t/145b6d0f-999c-4555-896c-c694bda2e470 | 2026-10-14 | 75/125; media excepted; AI rewrites; 14 days |
| Answers to your product title update questions | https://sellercentral.amazon.com/seller-forums/discussions/t/302aaac6-6f2b-4d86-bcd2-36fe24f0e6cd | 2026-10-14 | Non-compliant only, throughout 2026; Aug 10 display; eight hours; seller replies |
| Product title requirements and guidelines (GYTR6SYGFA5E3EQC, v21) | https://sellercentral.amazon.com/help/hub/reference/external/GYTR6SYGFA5E3EQC | 2026-10-14 | "might be automatically corrected…"; "allow 24 to 48 hours" (capture capture `GYTR6SYGFA5E3EQC-v21`) |
| Updates to Featured Offer eligibility requirements | https://sellercentral.amazon.com/seller-forums/discussions/t/7336583f-09ac-41de-99d1-667017a88db2 | 2026-10-14 | July 2026 start, global by end 2026; `datePublished` 2026-07-06 |
| Featured Offer eligibility (G200418100, v23) | https://sellercentral.amazon.com/help/hub/reference/external/G200418100 | 2026-10-14 | "This page has been removed. As of September 2026…" (capture capture `G200418100-v23`) |
| Becoming the Featured Offer (G201687550, v20) | https://sellercentral.amazon.com/help/hub/reference/external/G201687550 | 2026-10-14 | FO % over page views; all sellers evaluated; no offer may be featured (capture capture `G201687550-v20`) |
| Business reports glossary (G27691, v7) | https://sellercentral.amazon.com/help/hub/reference/external/G27691 | 2026-10-14 | Featured Offer percentage over page views (capture capture `G27691-v7`, reconciliation read) |
| Business Reports FAQ (G28761, v7) | https://sellercentral.amazon.com/help/hub/reference/external/G28761 | 2026-10-14 | Mobile app traffic included since March 29, 2022 (capture capture `G28761-v7`, reconciliation read) |
| Sponsored Products prompts and Sponsored Brands prompts | https://advertising.amazon.com/resources/whats-new/unboxed-2025-sponsored-products-and-sponsored-brands-prompts | 2026-10-14 | Open beta Nov 2025; US GA 2026-03-25; auto-enrolment; CPC |
| 2026 Updates to US Referral and Fulfillment by Amazon Fees | https://sellercentral.amazon.com/seller-forums/discussions/t/f3fa3211-820b-4e2e-a023-158a9cf55f99 | 2026-10-14 | Effective January 15, 2026 |
| 2026 Amazon Referral & FBA Fee Updates | https://sellingpartners.aboutamazon.com/update-to-u-s-referral-and-fulfillment-by-amazon-fees-for-2026 | 2026-10-14 | Annual cadence; published 2025-10-15 |
| keepacom/api_backend Product.java | https://github.com/keepacom/api_backend/blob/master/src/main/java/com/keepa/api/backend/structs/Product.java (raw form; commit list via GitHub's public API) | 2026-10-14 | ratingCount freeze note; `COUNT_REVIEWS` doc; last commit 2026-07-25 |
| Keepa Product Object | https://keepa.com/api-docs/product-object.html | 2026-10-14 | Slot 17 "rating count history"; freeze note on `reviews` only (reconciliation read) |
| Amazon halts variation theme cleanup after seller backlash (PPC Land) | https://ppc.land/amazon-halts-variation-theme-cleanup-after-seller-backlash/ | 2026-10-14 | Sept 2 – Nov 30, 2025 original window; Jon Elder |
| Amazon's Evolving Review Landscape (Yogi) | https://www.meetyogi.com/post/amazons-evolving-review-landscape-making-sense-of-quiet-changes | 2026-10-14 | March / April (2025) ratings changes |
| Keepa Product Finder: Every Filter Explained (FBA Mogul) | https://fbamogul.com/keepa-product-finder-getting-started-guide/ | 2026-10-14 | Keepa relabelled "Review Count" to all ratings |
| Brodersen et al. 2015 (arXiv 1506.00356 PDF; OpenAlex record) | https://arxiv.org/pdf/1506.00356 | 2026-10-14 | Stability assumption quotes |
| Bai and Perron 1998 (OpenAlex record, abstract only) | https://doi.org/10.2307/2998540 | 2026-10-14 | Abstract |
| Internal: roadmap §1.1 / §3 (read-only) | ceo-office/drafts/2026-10-09-roadmap-candidates.md | 2026-10-14 | Windows ≥7-day baseline + ≥14 days; "good listing" tests |
| Internal: day-2 run report (read-only) | office-mailbox/from-engineering/20261014-0921-beta-browser-listing-run-day-2.md | 2026-10-14 | Ten things cx had to be told (none names a calendar) |

## Open questions

1. **Which legacy-feed removal date is true: 2025-07-31 or 2025-12-03?** The release notes and the mapping guide say July 31, 2025. The Deprecation Schedule says December 3, 2025. *Settle:* Amazon Developer Support, or the GitHub announcement discussions. It has no effect on shopper metrics.
2. **The Data Kiosk `analytics_salesAndTraffic_2023_11_15` removal date: February 26 or March 27, 2026.** The two Amazon pages disagree. The model file for that version now returns 404 (per `angles/own-traffic-funnel.md`'s verifier), so it is gone either way.
3. **Which themes were removed in the end.** (The window itself is settled: Amazon's first News_Amazon thread gives September 2 – November 30, 2025, matching PPC Land.) The revision narrowed the list to themes with no sales in 12 months and gives no new list or date. *Settle:* the "Variation themes planned for removal" list the first thread links (not opened), the Seller News article signed in, or, for one product type, the theme enumeration in `getDefinitionsProductType`.
4. **What Amazon removed on 2025-04-09, and whether Keepa's `csv[17]` changed meaning then.** Keepa states the freeze only for `reviews.ratingCount`. Keepa's web page calls slot 17 "rating count history" and its Java client "review count history". A practitioner says Keepa relabelled its count to "all ratings". *Settle:* compare `csv[17]`'s latest value with the detail page's "global ratings" for one ASIN on the first real run, or ask Keepa support. Until then `csv[17]` across April 2025 is "cannot tell".
5. **The store-by-store dates of the Featured Offer eligibility removal outside the US.** The US help page says "As of September 2026". Other stores' help pages were not read. *Settle:* the G200418100 page in each store's Seller Central help.
6. **Review sharing: which categories changed on which date.** Not public. *Settle:* the seller's 30-day email, or Seller Assistant.
7. **Next month's schema release.** The cadence is about monthly, with the last row 2026-09-28. Whether an October 2026 row will appear, and when, is not known in advance. *Settle:* the metadata page at run time.
8. **A maintained practitioner calendar of Amazon breaks.** Not searched: the session's web-search budget ran out after the Keepa, ratings and fee searches.
9. **Whether Amazon's "Your search and discoverability are unchanged" holds in data.** Only a single seller's "2 week dip" contradicts it. *Settle:* SQP impressions for a title that Amazon split, against its competitor set, on the first real run after a rewrite.

## Positions

1. **P-amazon-change-calendar-1.** Before judging a change or a year-over-year comparison, cx lists the Amazon-side change dates that fall inside the baseline and observation windows and names the metric each one touches. Sources: SP-API Release Notes; SP-API Deprecation Schedule; Updates to improve your product titles begin on July 27; Changes to review sharing across product variations starting Feb 12; Updates to Featured Offer eligibility requirements; Brodersen et al. 2015.
2. **P-amazon-change-calendar-2.** If such a change reaches the targeted metric of this listing, the verdict is "cannot tell" unless cx can show from Amazon's reads that the change did not apply to it. Examples: the title was already compliant; the family's theme still shares reviews. Sources: Guidelines for reviews shared across product variations; Answers to your product title update questions; Brodersen et al. 2015.
3. **P-amazon-change-calendar-3.** cx does not subtract the competitor set's movement across a change that Amazon rolled out on different dates for different sellers, categories or stores, because the pre-period relation no longer holds. Examples: review sharing by category; Featured Offer eligibility by store; title rewrites on non-compliant listings only. Sources: Brodersen et al. 2015; Changes to review sharing across product variations starting Feb 12; Updates to Featured Offer eligibility requirements; Answers to your product title update questions.
4. **P-amazon-change-calendar-4.** For a Featured Offer % series that crosses the Featured Offer seller-eligibility rollout in the seller's store (its dates read at run time from the announcement and that store's Featured Offer eligibility page), cx asks whether the seller's offers were excluded under the old eligibility rule, and reads a rise without a price, delivery or stock change as the eligibility removal, not as the listing change. Sources: Updates to Featured Offer eligibility requirements; Featured Offer eligibility (G200418100); Becoming the Featured Offer.
5. **P-amazon-change-calendar-5.** cx does not mix Featured Offer % from Business Reports or Sales and Traffic (page views) with Seller Analytics `featureOfferPct` (glance views) inside one comparison. Sources: Becoming the Featured Offer; Business reports glossary; analytics_salesAndTraffic_2024_04_24.graphql; analytics_sellerAnalytics_2025_03_31.graphql.
6. **P-amazon-change-calendar-6.** A variation child's star rating or rating count that steps inside the review-sharing rollout window that Amazon's announcement gives is first checked against the review-sharing change, using the seller's notice email or Seller Assistant, before it is read as customer response. Sources: Changes to review sharing across product variations starting Feb 12; Guidelines for reviews shared across product variations.
7. **P-amazon-change-calendar-7.** When the Catalog title differs from the submitted title, cx first checks for an Amazon rewrite or split before attributing the text, or any metric move, to the seller. Two mechanisms apply: the reconciled value under the modular-title rule, and Amazon's rewrites of non-compliant titles (the AI recommendations of the modular-title rollout, and the override suggestions of the 2025 title rule). Whether a rollout is still running is read from Amazon's announcements, not assumed. Sources: Submit modular titles; Answers to your product title update questions; New product title requirements effective January 21, 2025.
8. **P-amazon-change-calendar-8.** A click-through comparison that crosses the date from which Item Highlights display under the title (read from Amazon's announcement) compares two search-result layouts. Source: Answers to your product title update questions.
9. **P-amazon-change-calendar-9.** cx stores the product-type schema version (`productTypeVersion.version`) with the change file. It treats a new issue or a newly required attribute that appears with a new version as Amazon's change, not the seller's. Sources: SP-API Product Metadata Updates; Release_Notes_API_July_2026.xlsx; definitionsProductTypes_2020-09-01.json.
10. **P-amazon-change-calendar-10.** cx does not read a flat Keepa `reviews.ratingCount` history after 2025-04-09 as "no new ratings". It makes no claim about `csv[17]` across April 2025 until that series is checked against the live page, and names that series as the Keepa document it cites names it. Sources: Product.java; Keepa Product Object; Amazon's Evolving Review Landscape (opinion, corroborating only).
11. **P-amazon-change-calendar-11.** An ad-click or ad-spend series that crosses the store's general-availability date for Sponsored prompts (read from Amazon Ads' announcement) includes Sponsored prompts, a placement campaigns were enrolled in automatically and charged for as CPC. Source: Sponsored Products prompts and Sponsored Brands prompts.
12. **P-amazon-change-calendar-12.** cx counts the yearly fee-change effective date, read from that year's fee announcement, as a possible reason for competitor price moves around it. Sources: 2026 Updates to US Referral and Fulfillment by Amazon Fees; 2026 Amazon Referral & FBA Fee Updates.
13. **P-amazon-change-calendar-13.** cx does not splice a series across a retired data product or field. Examples: the Data Kiosk Sales and Traffic 2023-11-15 version; the deprecated `conversationRatePct`. Sources: SP-API Deprecation Schedule; SP-API Release Notes; analytics_sellerAnalytics_2025_03_31.graphql.
14. **P-amazon-change-calendar-14.** The skill does not carry the dated list as its truth. cx reads the live sources each time: the SP-API Release Notes, the Deprecation Schedule, the Product Metadata Updates page, the Seller Forums News and Announcements threads, and the current help-page text. Where Amazon's pages give different dates for one change, cx says so. Sources: SP-API Release Notes; SP-API Deprecation Schedule; Mapping product attributes to the Listings Items API and JSON-based feeds; SP-API Product Metadata Updates.
15. **P-amazon-change-calendar-15.** "Rufus" in sources before the rename date on Amazon's editor's note and "Alexa for Shopping" after it are the same assistant. cx treats the rename date as a naming change, not a ranking event. Source: 'Amazon Rufus' AI experience comes to the Amazon Shopping app.

**The seat's own (not for a skill)**

- [seat] A one-line machine-readable list (date, scope, metric touched, source URL) kept in the package's references would help humans, provided cx is told it is a cache to re-check, not a source. Whether it belongs in the package is for the office.
- [seat] Competitor promotions before 2026-07-29 are invisible to SP-API. Any baseline older than that holds an unmeasured promotion confounder. Keepa's deal or coupon fields might fill the gap; not checked here.
- [seat] Seller Forums thread pages are public and carry an exact `datePublished`. Seller News articles need sign-in. cx's web access can therefore date News_Amazon threads but not Seller News items.
- [seat] The help hub's `GetHelpTopic` route (used here, as by sibling files) is undocumented. A skill should not depend on it; its standing use is for the office to rule (`method/help-page-access.md`).

## Verification

Gap fill 2026-10-14: 1 gap filled, 0 left open as a whole. All twelve dates listed in the gap were sourced at Amazon's or Keepa's own page. Four items carry residual conflicts or unreadable originals, kept in Open questions 1–4.

How the adversarial re-check was done: each page cited for a new claim was fetched again after the file was written. The quoted phrases were string-matched against the fresh text (developer-docs `.md` forms; forum thread HTML stripped to text; help pages through the content call; Product.java raw; the aboutamazon, Ads, PPC Land and Yogi pages; the Brodersen PDF text). Results are listed below.

**Re-check results (2026-10-14).**

- **Pages and quote checks.** 26 pages were re-fetched and about 110 quoted phrases or dates were string-matched. All matched, with two kinds of miss that were checked by hand:
  - the forum `datePublished` values sit in the page's JSON-LD, so they were read from the raw HTML. All seven held (2025-01-03T06:11, 2025-08-26T15:08, 2026-01-07T14:55, 2026-06-10T18:31, 2026-07-06T15:47, 2026-07-29T20:02, 2025-10-15T16:57). The Selling Partners blog post reads 2025-10-15T17:00Z;
  - the 2025 title thread's "override suggestions" sentence missed only on a link-spacing artifact ("Review Listing Updates ."). The words hold.
- **Brodersen et al.** All three quotes matched the PDF text. The first quote crosses a page break and the Figure 1 caption, and is one sentence in the paper.

**Twelve dates in the gap, as found at the source:**

| Lead | Held / corrected |
|---|---|
| Legacy feeds removed 2025-07-31 | Held in Release Notes (2025-06-25 entry) and the mapping guide. **The Deprecation Schedule says 2025-12-03; the original changelog said 2025-03-31.** Left open (OQ1). Seller Central uploads were never affected. |
| Variation theme cleanup 2025-08-20/26 | Held. 08-26 is now Amazon's own record (`datePublished`), not only PPC Land's. The Sept 2 – Nov 30, 2025 window is PPC Land's account only (OQ3). *Superseded at reconciliation: Amazon's first News_Amazon thread states the same window.* |
| Review sharing 2026-02-12 to 2026-05-31 | Held, by category, with a 30-day email per product. |
| Rufus renamed 2026-05-13 | Held on aboutamazon.com. |
| parentageLevel 2026-05-27 | Held. |
| Title AI rewrites from 2026-07-27; Item Highlights displayed 2026-08-10 | Held. Rewrites apply to "non-compliant listings", run "throughout 2026", and media is excepted. Amazon also rewrote non-compliant titles under the 2025-01-21 rule. |
| Promotions on getCompetitiveSummary 2026-07-29 | Held. |
| Promotions API 2026-08-26 | Held. |
| Featured Offer eligibility removal | Held: July 2026 start, global by end of 2026; US help "As of September 2026". |
| PRODUCT/LISTING issue categories and new A+ modules 2026-09-30 | Categories held. **"New A+ modules" corrected:** the release adds API support for the existing Premium A+ and Brand Story modules. |
| Monthly schema changelog rows | Held. Rows listed from the page, with the July 2026 spreadsheet opened. |
| Keepa ratingCount freeze 2025-04-09 | Held for `reviews.ratingCount` only. Keepa's doc gives `csv[17]` no freeze note (OQ4). |

**Reconciled 2026-10-14** (against the critics' contradiction list; every source below re-opened for this pass, no Amazon or Keepa API host called):

- **Variation-theme window (A2, practitioners, OQ3, Pages read).** This file said the September 2 – November 30, 2025 window was PPC Land's account only. Amazon's own first News_Amazon thread ("Removal of irrelevant variation themes will start September 2", `datePublished` 2025-08-19) states it, with the "Deprecated: Do Not Use" marking and the "the value specified is invalid" error. Added; the two Amazon threads' dates for the first announcement (August 20 in the revision, 2025-08-19 in the thread record) are named side by side. OQ3 now asks only which themes were removed in the end.
- **Title outcome (A5).** The FAQ thread's "active, editable, and searchable" and the help page's "might not appear in our search results" are stated as two Amazon texts that differ; the listing's own issues are the run-time answer. Re-checked against the FAQ thread and the GYTR6SYGFA5E3EQC v21 capture.
- **The "24 to 48 hours" figure (A5).** Held: it is in the GYTR6SYGFA5E3EQC v21 capture three times (rule note, FAQ, troubleshooting). `method/effect-measurement.md`'s verifier, which found it only in forums and blogs, and `method/listing-writes.md`, which gives it to SellerEngine, are the files that need correcting, not this one. The bulk-route "eight hours" now names its route (Category Listings report through List Your Products), as the FAQ thread does.
- **Latency and title-length figures (A5).** Marked as human-reader figures. No window length is set from them; the `item_name` / `title_differentiation` limits are read from `getDefinitionsProductType`.
- **Featured Offer (A7, B5).** The announcement's July-to-end-2026 rollout and the US help pages' "As of September 2026" are stated as two Amazon texts that differ, with the store's own page and the seller's series as the run-time answer (in line with `angles/own-traffic-funnel.md` and `method/funnel-and-search.md`). The Business reports glossary (G27691 v7) added as a fourth wording over page views. `method/triggers.md`, which lists Featured Offer eligibility tests without the removal, is the file out of date.
- **Data Kiosk conversion (B5).** Re-read in the schema: `conversationRatePct` deprecated, `conversionRatePct` is search-originated purchases over clicks. Added that it is not unit session percentage and is not spliced with it. `method/effect-measurement.md`'s use of `conversationRatePct` as the conversion outcome is that file's to correct.
- **Business Reports mobile traffic (new B12a).** Added from the G28761 v7 capture: page views and sessions include mobile app traffic since March 29, 2022.
- **Keepa `csv[17]` (B13, run time, Stable, P-10, OQ4).** This file quoted only Product.java ("review count history"). Keepa's web Product Object page calls the same slot "rating count history". Both are now named; neither is picked. The freeze note was re-read on both documents and covers `reviews.ratingCount` only.
- **Help-page reachability (A3, A5, A7, Pages read, run time).** Every help page this file quotes (G74DLBUEHT5GY88C v3, GYTR6SYGFA5E3EQC v21, G200418100 v23, G201687550 v20, G27691 v7, G28761 v7) has a capture under the office's capture folder (outside this repository); each citation now names it. This file declared no help page unreachable; the one sign-in wall it records is a Seller News article, which is not a help page.
- **Numbers out of Stable lines and positions.** The 14-day review period left the title Stable line; "monthly" became the Metadata page's listed releases. Positions 4, 6, 7, 8, 11, 12 and 15 no longer state a date Amazon sets by announcement; each names the announcement the date is read from. Keepa's 2025-04-09 (Keepa's own date) stays.
- **Cross-references.** `door.md` is named as the SP-API door's reference outside this package. The seasonality cross-reference now repeats what `angles/seasonality-and-events.md` says (a 30-day baseline pulled on 2026-10-13). No reference to a merged file (`inventory-and-fulfilment.md`, `elements/vendor-and-hybrid.md`) existed here.
- **Held, other files out of line.** Amazon's rewrites of untouched non-compliant titles (`angles/competitor-set.md` has since corrected itself); the Rufus rename and the Sponsored prompts GA, both confirmed on Amazon pages here (`angles/search-rank-and-volume.md` marks them unverified); Amazon's own two removal dates for the Sales and Traffic 2023 dataset and for legacy feeds stay named side by side (OQ1, OQ2).
