# Element: Brand Story, Brand Store, Store insights, Brand Follow, Posts and Brand Tailored Promotions

Read 2026-10-14 by the research seat. Tags: [official] Amazon's own page or document; [opinion] a named practitioner; [research] published research; [seat] the seat's own reasoning, never a skill position.

How pages were read:
- **Seller Central help pages.** These are JavaScript shells, so their body was read on 2026-10-14 through the help hub's content call: `POST https://sellercentral.amazon.com/help/hub/mons-api/GetHelpTopic`, body `{"guid":"<id>","layer":"external","locale":"en-US"}`. This is the route described in `method/help-page-access.md`. The call is undocumented, and its standing use is for the office to rule; no further page is to be fetched through it. Each page is cited by its public URL plus the version and revision the call returned.
  - Two of the pages cited here have a saved capture, which is the text of record: A+ content guidelines (capture `GGW8U76SSNTRTBX7-v8`) and Business reports glossary (capture `G27691-v7`). Every quote taken from them below was string-matched against the capture at reconciliation.
  - The others (G202102930, G202134820, G202102960, GAEAQB7QC4G5Z2LC, G43381, GFM3F4GG5EYCC5XC, G200663330, GFJTFMCXPRQ5GHUK) were read by this seat through the same call on 2026-10-14 and have no saved capture. Their quotes rest on that read and the seat's same-day re-check (Verification).
- **SP-API documentation.** Read as Markdown from `developer-docs.amazon.com/sp-api/docs/<page>.md`, which redirects to `developer-docs.amazon/sp-api/docs/<page>.md`.
- **SP-API models and schemas.** Read from `amzn/selling-partner-api-models` on GitHub (`main`).
- **Amazon Ads API guides and release notes.** Read as Markdown from the docs site's content host, `d3a0d0y2hgofx6.cloudfront.net/en-us/<path>.md`. The Ads API's Stores OpenAPI reference page is script-rendered, and its specification file was not found (see Open questions).
- **Amazon Ads "what's new" posts, library guides, and sell.amazon.com pages.** Read as served HTML.
- **Old Amazon Stores help microsite.** Read from `m.media-amazon.com/images/G/01/AmazonStores/Help/en/...`.
- **Keepa.** Read from Keepa's Java client source on GitHub.

No Amazon API host and no Keepa API host was called. The session's shared web-search budget ran out after two searches by this seat. Every page after that was reached by a known URL, by a link inside a page already opened, or by Crossref.

## What this covers

**Funnel stage.**
- **Conversion, mainly.** Brand Story sits on the detail page under "From the brand", next to A+.
- **Cross-sell traffic, in both directions.** Brand Story's ASIN cards and its Store link send shoppers from one detail page to another, or to the Brand Store. The Store sends shoppers back to detail pages.
- **Exposure for the Store itself.** Brand Tailored Promotions add a badge on search and detail pages for a chosen audience, so they act at click-through and conversion. They do this only for that audience and with no listing write.
- **Posts: none.** Posts ended in July 2025.

**Skills it feeds.**
- `listing-review`:
  - whether a Brand Story is live on the ASIN, and which sibling ASINs and Store it points to;
  - whether the byline leads to a Store;
  - which of these surfaces exist, and so which detail-page sections the seller controls beyond the listing attributes;
  - which figures live outside SP-API.
- `listing-change-log`: a change to a Brand Story, a Store or a tailored promotion changes what the shopper sees on the detail page or in search. The change log must record it with its own request and receipt, or the seller must declare it. Otherwise a listing change's before and after windows are polluted.
- `effect-review`: these are confounders. A Brand Story is often applied across a whole catalog in one submission. A Store relaunch, a tailored promotion or a new follower-audience campaign moves sessions and conversion with no listing write. Store traffic itself is not a Business Reports session.
- `/listing-watch`: the seller's standing-instruction file is where the seller declares Store relaunches and tailored promotions. cx cannot read these through SP-API (see What cx must read at run time).

**Why a senior operator cares.** An operator reviewing A+ also looks at the Brand Story band, the byline link, and the Store's traffic sources and sales. They know three things a method without this file would miss:
- A Brand Story change can land on hundreds of ASINs at once.
- Store "sales" are attributed by visit date over a 14-day window, and are not Business Reports sales.
- A tailored promotion can lift one audience's conversion during the window being judged.

The beta run's day-2 proposal planned A+ changes through the Listings `PATCH` path (`office-mailbox/from-engineering/20261014-0921-beta-browser-listing-run-day-2.md`, its table of 13 changes, items 2, 3, 5, 6 and 9). A+ and Brand Story are not listing attributes. They have their own API, their own moderation and their own replacement rules (below).

## Amazon's own rules and guidance

### A. Brand Story: what it is, where it shows, who may publish it

A1. **Where it renders, and that it is not A+.**
- The A+ Content help page: "Basic or Premium A+ Content and A+ Brand Story content submitted by sellers shows in the Product description and in the From the brand section on the detail page, respectively." Brand Story "can be used in addition to A+ Content (Basic or Premium)". [official] (A+ Content, https://sellercentral.amazon.com/help/hub/reference/external/G202102930, v17 r0, read 2026-10-14)
- The SP-API page says Brand Story "appears on the Product Detail Page (PDP) under the "From the Brand" heading — a dedicated space completely separate from your product-level A+ Content". [official] (A+ Brand Story Modules, https://developer-docs.amazon.com/sp-api/docs/a-plus-brand-story-modules, page updatedAt 2026-09-30, read 2026-10-14)
- Neither page says whether "From the brand" sits above or below the Product description section. The page order is a practitioner claim (see "What practitioners add").

A2. **What it is for.**
- "Educate customers about the history of your brand, the brand's values, and product lines. Brand Story supports 1 module with up to 19 pre-formatted cards within a carousel experience". Features include "Links to other products and your Amazon brand store". [official] (A+ Content, G202102930 v17)
- The SP-API page: Brand Story lets you "tell your brand's unique story, build brand awareness, and cross-sell other products in your catalog". It adds: "while Premium Content focuses on product features to drive sales, Brand Story expands the customer's knowledge of your brand and provides cross-sell opportunities." [official] (A+ Brand Story Modules)
- sell.amazon.com: "Brand Story: Share your brand's story, values, and mission across all your product listings and drive traffic to your Amazon Brand Store." [official] (A+ Content | Sell on Amazon, https://sell.amazon.com/tools/a-content, read 2026-10-14)

A3. **Who may publish (RULE).**
- "To add ASINs to your A+ Content, you must be a professional Seller and have a Brand Representative or Reseller role assigned in the brand of that ASIN through the Amazon Brand Registry Process."
- "You can publish content to all ASINs that you own as a registered Brand Representative or Reseller in Amazon Brand Registry, and have up to 20 pending submissions in review at one time."
- "We do not charge any fee for adding the Standard Enhanced Product Description (Basic A+) and A+ Brand Story content features."

[official] (A+ Content, G202102930 v17)

The API refuses a non-enrolled account at creation, not at validation. The error is 400 `InvalidInput`, "User [<merchantId>] shouldn't be using project type: [BrandStory]", with the note "Validation does not check account entitlements. Brand Story requires Brand Registry enrollment". [official] (A+ Content Troubleshooting Guide, https://developer-docs.amazon.com/sp-api/docs/a-plus-troubleshooting, updatedAt 2026-09-30, read 2026-10-14)

A4. **Retail-vendor precedence (RULE).**
- "The "From the manufacturer" section of the detail page is reserved for A+ Content from retail vendors." Vendor A+ "is prioritized to prevent competing A+ Content submissions on a single ASIN. If an ASIN already has A+ Content contributed by a retail vendor at Amazon, you will not be able to add or edit A+ Content." [official] (A+ Content, G202102930 v17)
- The API's words: "You are unable to add content to this ASIN because there is an existing retail contribution on this ASIN." [official] (A+ Content Troubleshooting Guide)
- The help page speaks of "A+ Content". It does not say whether the retail precedence also blocks a seller's Brand Story. [seat] Open question 3.

A5. **Premium A+ eligibility depends on Brand Story (RULE, current US page).** Under "What is the eligibility criteria for Premium A+?", the page says you are eligible if:
- "You have already published A+ Brand Story to all ASINs that you own within your catalog. Essentially, all ASINs within your A+ Content Manager need to have a published Brand Story."
- "You have had at least 5 project submissions of A+ Content that have been approved and published within the past 12 months."

It adds that eligibility met "in one country" gives "Premium A+ access worldwide", and "Every week, we will re-evaluate the eligibility". Premium is "available to you at no cost during this promotional period". [official] (A+ Content, G202102930 v17)

`elements/a-plus-content.md` now quotes the same page and version for the same criteria, and records the older News_Amazon forum post (15 projects) as superseded. The two files agree on G202102930.

**Amazon's own pages disagree on Premium A+ eligibility.** Another live Seller Central page, A+ Content guide (https://sellercentral.amazon.com/help/hub/reference/external/GLG4RQK2Y2RJADU4, version 3), says "There is no additional eligibility criteria for sellers to access Premium A+". [official] (as quoted in `method/funnel-and-search.md` E12 and `elements/bullet-points.md`, both read 2026-10-14; this seat did not open GLG4RQK2Y2RJADU4, and it has no capture under the office's capture folder (outside this repository)) So one Amazon page (G202102930 v17) ties Premium A+ to a Brand Story on every ASIN plus a count of approved projects, and another (GLG4RQK2Y2RJADU4 v3) says there are no extra criteria. This file does not pick one. There is no schema field for it: the binding answer for a given seller is read at run time from A+ Content Manager's own eligibility display, or from the refusal a Premium submission draws.

A6. **Brand Story text rules differ from A+ in one respect (RULE).**
- The A+ guidelines bar time-sensitive words ("now / new / latest … or references to holidays"), then add: "(Note: Such time-sensitive references are permitted in the brand story section.)"
- The same page bars "Hyperlinks, external web links or language attempting to redirect to other sites inside or outside of Amazon (including your other products)".
- Content that breaks the guidelines "may not be allowed to publish or may not be fully displayed by default on detail pages".

[official] (A+ content guidelines, https://sellercentral.amazon.com/help/hub/reference/external/GGW8U76SSNTRTBX7, v8 r2, read 2026-10-14)

[seat] Read together with A7: a Brand Story links to sibling ASINs and to the Store only through the structured fields of its cards (`productAsin`, `brandStoreId`), never through words in its text.

A7. **The API shape of a Brand Story (RULE: the model and the developer page).**
- **Content type, not subtype.** A Brand Story document is `contentType` = `BrandStory`. The model's enum reads `EBC` (seller A+), `EMC` (vendor A+), and `BrandStory`: "A+ Brand Story content, which helps customers gain a better understanding of the brand."
- **`contentSubType` is free text.** It is described as "a special-purpose type of an A+ Content document. Not every A+ Content document type will have a subtype, and subtypes may change at any time." So there is no `BRAND_STORY` subtype. Brand Story is a content type, and `BRAND_STORY_*` are module types.

  [official] (aplusContent_2020-11-01.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/aplus-content-api-model/aplusContent_2020-11-01.json, read 2026-10-14)

- **The five module types**, as the model describes them:
  - `BRAND_STORY_IMAGE_WITH_LOGO`: "The required background card for all Brand Story Content … All other Brand Story modules appear within this carousel."
  - `BRAND_STORY_FOUR_ASIN`: "up to four product ASINs with images, enabling cross-selling to other products in your catalog". It carries an optional `brandStoreId`.
  - `BRAND_STORY_MEDIA_ASSET`: a single-image card.
  - `BRAND_STORY_ABOUT`: a text card for "your Brand's story, mission, or values".
  - `BRAND_STORY_QUESTIONS`: question-and-answer pairs.

  [official] (model, as above)

- **The developer page's rules:**
  - "Every Brand Story document must include exactly one `BrandStoryImageWithLogoModule`".
  - "Brand Story modules cannot be combined with Standard or Premium modules in the same content document."
  - The four-ASIN card's `asinImages` must hold "exactly 4 items". Its `brandStoreId` "Links the card to the brand's storefront".
  - The questions card holds "exactly 3" pairs.
  - Field limits: titles "max 30 chars"; the hero and media-card description "max 3 rows; total ≤ 135 chars"; the about-card slogan "max 10 rows; total ≤ 450 chars"; questions "max 70 chars"; answers "total ≤ 200 chars".
  - Image minimums: hero desktop 1464 × 625, hero mobile 463 × 625, ASIN card 166 × 182, media card 362 × 453, logo 315 × 145.

  [official] (A+ Brand Story Modules)

- **One internal discrepancy.** The troubleshooting guide's crop-error row gives "Brand Story logo 362 x 453". The module page gives 362 × 453 for the media-card image and 315 × 145 for the about-card logo. [official] (A+ Content Troubleshooting Guide; A+ Brand Story Modules) The validator's error message names the bound ("must be greater than or equal to N"), so the run-time answer is the validator's.
- **Help page against the model.** The help page's "up to 19 pre-formatted cards" and the model's five card types describe the same carousel at different levels: card count versus card kinds. No Amazon page read states the API's own maximum number of cards per Brand Story document.
- **Amazon's pages disagree on the number of Brand Story module types.** The model's `ContentModuleType` enum holds five `BRAND_STORY_*` values, and the 2026-09-30 release note (A8) says "five Brand Story content modules". The A+ Content quick guide (v1.1, https://m.media-amazon.com/images/G/01/bx-marketing/Quickguide_aplus-content.pdf) gives four Brand Story module types, and "Max modules per project" of 19 for Brand Story, which matches the help page's 19 cards. [official] (Quickguide as quoted in `elements/a-plus-content.md`; this seat did not open the PDF) The binding list of module types is the model's `ContentModuleType` enum, read at run time.

A8. **Brand Story through the API is recent (dated, announcement).** On 2026-09-30 the A+ Content API "Added support for the 19 Premium A+ content modules and five Brand Story content modules through the same operations used for Standard A+ Content", plus `createMedia`, `getMedia` and `updateMedia`. [official] (SP-API release notes, https://developer-docs.amazon.com/sp-api/docs/sp-api-release-notes, updatedAt 2026-10-01, read 2026-10-14)

A9. **One live Brand Story per ASIN; replacement is silent (RULE).**
- "Ownership, brand eligibility and account entitlements are enforced when the document is created or submitted, and one document per ASIN and content family (A+ or Brand Story) is live at a time."
- "Approving another document of the same family on the same ASIN takes over the publish record silently." The fix is: "Check searchContentPublishRecords for the ASIN before submitting."
- Posting ASIN relations to an approved document "resets the status" to DRAFT, and "The approved revision stays live until the new one is approved".

  [official] (A+ Content Troubleshooting Guide)

- `postContentDocumentAsinRelations` "Replaces all ASINs related to the specified A+ Content document … Removing an ASIN has the side effect of suspending the content document from that ASIN." [official] (model)
- "Post the entire set of ASINs related to a content document." [official] (Manage A+ content, https://developer-docs.amazon.com/sp-api/docs/manage-aplus-content, updatedAt 2026-09-09, read 2026-10-14)
- Publish records do not carry the tier. The tier is `badgeSet` "(`PREMIUM` or `STANDARD`; empty for Brand Story)". [official] (A+ Content Troubleshooting Guide)
- A content reference key "cannot form a permalink and may change in the future". [official] (model, `contentReferenceKey` parameter)

A10. **Bulk application (GUIDANCE, with a consequence).** "You can simplify publishing Brand Story content to all the ASINs in your catalog by using the bulk upload feature in the A+ Content Manager." [official] (A+ Content, G202102930 v17) The model's `ContentBadge` `BULK` means "This content is applied to ASINs in bulk." [official] (model)

[seat] One Brand Story submission can change the "From the brand" band on every ASIN of the brand at once. That includes ASINs in a sibling-ASIN effect comparison.

A11. **Moderation and publish latency (RULE/GUIDANCE, dated figures, for human readers).**
- "Once A+ content is submitted for approval, your content may take up to seven business days to be reviewed, or longer during the holiday season. We are not able to take expedited requests at this time."
- "Once approved, it can take 24 hours for content to be published to the detail page of the applied ASINs."
- Existing content "will remain on the detail page of all applied ASINs until the new submission is approved".
- "A+ content will only show up on the page in the language it was published in."

  [official] (Content publishing status and content rejection, https://sellercentral.amazon.com/help/hub/reference/external/GAEAQB7QC4G5Z2LC, v3 r1, read 2026-10-14) The page speaks of "A+ content". The Content Manager files Brand Story under A+ (A1–A3).

- The API adds: "Some accounts are approved automatically", so "Poll until `APPROVED` or `REJECTED`". [official] (A+ Content Troubleshooting Guide)
- The tutorial says: "Call the `getContentDocument` operation no more than once an hour for each content document that you check for approval status." [official] (Create, edit, and publish A+ content, https://developer-docs.amazon.com/sp-api/docs/create-edit-publish-aplus-content, updatedAt 2026-10-02, read 2026-10-14)
- Every A+ operation in the model lists rate 10 / burst 10 (re-read from the model's `main` branch at reconciliation, all 13 operations). [official] (model) The binding rate is the model's, read at run time; other files record SP-API docs pages and models disagreeing on rate figures for other APIs.
- These figures live in the pages above and may change. The live truth for "is it published" is the publish record (see What cx must read at run time).

A12. **Amazon may add translated Brand Story content (GUIDANCE).**
- "To help customers who shop in our stores in different languages, we may also create language variations automatically."
- "we may also translate and publish A+ content automatically to different countries for ASINs that have previously been localized to those countries."

[official] (Create A+ content, https://sellercentral.amazon.com/help/hub/reference/external/G202134820, v17 r1, read 2026-10-14)

[seat] A detail page in another language or marketplace can therefore gain A+ or Brand Story content the seller never submitted there.

A13. **Testing (GUIDANCE).**
- Manage Your Experiments tests "images, titles, bullet points, descriptions, and A+ Content—including Brand Story".
- "You must also have published a Brand Story or other A+ Content to run those types of experiments."
- The same page says "Optimized content can help increase sales by up to 20%", footnoted "Amazon internal data".

[official] (Test listing content with Manage Your Experiments | Sell on Amazon, https://sell.amazon.com/tools/manage-your-experiments, read 2026-10-14)

The Brand Registry page puts the MYE figure at "up to 25%", also "Amazon internal data". [official] (Amazon Brand Registry | Sell on Amazon, https://sell.amazon.com/brand-registry, read 2026-10-14) Both figures are on Amazon pages. Neither has a method attached.

### B. Brand Store

B1. **Eligibility and cost (RULE / fact).**
- "Brand Stores are available for sellers enrolled in Amazon Brand Registry, vendors, and agencies."
- "Only brands with a pending or registered trademark can create a Brand Store on Amazon."
- "You do not need to advertise on Amazon to create a Brand Store."
- "Creating and maintaining a Brand Store is free."

[official] (Brand Stores: Create a brand page on Amazon for free | Amazon Ads, https://advertising.amazon.com/solutions/products/stores, read 2026-10-14)

Seller Central routes "Questions related to your Brand Stores" to "the Advertiser Support team". [official] (Amazon Ads account and campaigns, https://sellercentral.amazon.com/help/hub/reference/external/G200663330, v10, read 2026-10-14) No Seller Central help page owns the Store. Amazon Ads does.

B2. **How the detail page and the Store connect (fact).**
- "Shoppers can visit a Brand Store directly by clicking the brand's byline (or brand name, which appears on product detail pages near the product title in blue text." [sic, unclosed parenthesis]
- "On product detail pages, your byline appears near the product title in blue text and can help provide organic traffic to your Brand Store."
- Stores are discovered "through their Amazon search results, product detail pages, and the Amazon Ads they receive".
- "Brand Stores associated with the byline carrying the same brand name have a canonical URL that contains the Store and page name, which provides search bots with a clear relationship".

[official] (A comprehensive guide to successful Brand Stores | Amazon Ads, https://advertising.amazon.com/library/guides/stores-best-practices, no date shown, read 2026-10-14)

Other entry points:
- The old Stores help advises: "Ensure you're getting Amazon organic traffic from your product detail pages … If the link does not lead to your store, contact Vendor or Seller Central support." [official] (Improving performance | Stores, https://m.media-amazon.com/images/G/01/AmazonStores/Help/en/Stores_Insights/Improving_performance.html, © 2019, read 2026-10-14)
- Amazon's AMC dataset enumerates Store ingress types: "1 - search", "2 - detail page byline", "4 - ads", "6 - store recommendations", "7 through 11 - experimentation". [official] (Amazon Brand Store insights tables, https://advertising.amazon.com/API/docs/en-us/guides/amazon-marketing-cloud/datasources/brand_store_insights_paid, read via its Markdown source 2026-10-14)
- The Brand Story four-ASIN card can carry `brandStoreId` (A7). That is the second documented link from the detail page into the Store.

B3. **Building rules (RULE: moderation; Stores content acceptance policy).**
- Store content may not contain "Time-sensitive promotions" or "Shipping or delivery claims".
- "Promotional messaging is only permitted when used with the Featured Deals widget."
- Claims about the brand "must be substantiated within the Store"; accolades "should be less than 18 months old".
- "We do not permit direct comparison to competitor brands."
- CTAs "must link to a product detail page, product grid or another Store page".

[official] (Content acceptance policy | Stores, https://m.media-amazon.com/images/G/01/AmazonStores/Help/en/Content_acceptance_policy.html, © 2019 footer, read 2026-10-14)

[seat] The microsite's footer says 2019. Whether it is the current policy text was not confirmed against the console.

B4. **Moderation latency: Amazon's pages disagree (dated figures).**
- "Submit for publishing (moderation review can take up to 24 hours)." [official] (stores-best-practices)
- "Ad moderation can take up to 24 hours". [official] (How to open your Store on Amazon | Amazon Ads, https://advertising.amazon.com/library/guides/getting-started-with-stores, read 2026-10-14)
- "The moderation process can take several days." [official] (Review and Publish | Stores, https://m.media-amazon.com/images/G/01/AmazonStores/Help/en/Review_and_Publish.html, © 2019 footer, read 2026-10-14)
- `angles/seasonality-and-events.md` quotes the Prime Day 2026 page: "at least one week for the moderation of your content" before Prime Day. This seat did not re-open that page.

B5. **Update cadence (GUIDANCE).**
- "Update your Brand Store at least once per quarter". [official] (Brand Stores … | Amazon Ads)
- "Are you updating your Brand Store regularly (every 90 days or fewer)?"
- "refresh your Brand Store any time your brand launches new products or runs a campaign or promotion".

[official] (stores-best-practices)

B6. **Amazon's Store statistics are visitor-versus-non-visitor comparisons (figures, for human readers only).**
- "New-to-brand shoppers who visited a Brand Store were 62.7% more likely to purchase" (footnote "Amazon internal data, August 2024").
- Store visitors "purchase 53.9% more frequently … and a 71.3% higher average order value" ("Amazon internal data, WW, 2024").
- "Brand Stores updated within the past 90 days had 11% more repeat visitors and 13% higher attributed sales per visitor" ("Amazon internal data, WW, 30/04/2022").

[official] (stores-best-practices; Brand Stores … | Amazon Ads)

These compare people who chose to visit with people who did not. They are not experiments (see Published research).

### C. Store insights: what it measures, how it attributes

C1. **Metrics and windows (RULE: definitions).**
- `SALES`: "Estimated total sales generated by Store visitors within 14 days of their last visit."
- `ORDERS`: "within 14 days of their visit".
- `VISITORS`: "calculated based on daily unique users or devices".
- `VISITS`: "Total visits to a page within a single day".
- Also `DWELL_TIME`, `BOUNCE_RATE` ("Ratio of total bounce visits … to total landing visits") and `NEW_TO_STORE`.
- Per-ASIN Store metrics: `VIEWS`, `ORDERS`, `UNITS`, `ADD_TO_CARTS`, `IN_STOCK_VIEWS`, `CONVERSION_RATE` ("Rate at which customers ordered a unit of the item over how many times customers clicked the item"), `CLICKS`, `RENDERS` ("this does not guarantee that the customer saw the `ASIN`").
- Dimensions: `DATE`, `PAGE`, `SOURCE`, `TAG`, `STORE`.
- "The insight metrics API allows fetching data for a date range spanning up to 100 days".

[official] (Brand Store insights metrics, https://advertising.amazon.com/API/docs/en-us/guides/brand-store/insight-metrics, read via its Markdown source 2026-10-14)

C2. **Attribution (RULE: definitions).**
- "We use a last discovery methodology". Halo sales are products "where the product purchased was not available on the store page viewed".
- "we display sales data in Stores insights based on the date of the visit, not the date the order was placed."

[official] (Orders, sales and units sold | Stores, https://m.media-amazon.com/images/G/01/AmazonStores/Help/en/Stores_Insights/Orders_sales_and_units.html, read 2026-10-14)

The four original traffic sources are "Amazon Sponsored Brands", "Amazon organic traffic" ("Traffic originating from your brand link on Amazon product detail pages"), "Your tags" and "Other sources". [official] (Metrics and traffic sources | Stores, https://m.media-amazon.com/images/G/01/AmazonStores/Help/en/Stores_Insights/Metrics_and_sources.html, read 2026-10-14)

C3. **Sources broken down further from 2025-10-01 (dated announcement).**
- "Brand Store sources insights now provides a detailed break down of your traffic sources." It covers "Sponsored Brands campaigns and Sponsored Display, as well as external channels such as search engines and social media".
- "Enhanced sources are available as of October 1, 2025."
- "The Brand Store insights API has been enhanced to support granular performance metrics by traffic source."

[official] (Enhanced Brand Store sources insights | Amazon Ads, https://advertising.amazon.com/resources/whats-new/enhanced-brand-store-sources-insights, dated November 07, 2025, read 2026-10-14)

C4. **Section-level metrics from 2026-01-10 (dated announcement, beta).** "renders, viewable impressions, clicks, and click-through-rate (CTR) for each section", "Metrics available as of January 10, 2026"; "The Stores Analytics API now includes new endpoints for retrieving section-level performance metrics." [official] (Section-level shopper engagement insights on Brand Store (Beta) | Amazon Ads, https://advertising.amazon.com/en-gb/resources/whats-new/brand-store-insights-at-section-level-beta, dated January 16, 2026, read 2026-10-14)

C5. **Store quality rating: Amazon's descriptions differ.**
- May 2024: "Brand Stores with a higher quality rating generally see shoppers spend more time engaging with the content on their store (dwell time)"; "Store Quality Rating API was release in Jan '24". [official] (New Brand Store quality rating is available to all advertisers | Amazon Ads, https://advertising.amazon.com/resources/whats-new/brand-store-quality-rating, dated May 30, 2024, read 2026-10-14)
- The best-practices guide: "Brand Stores are rated low, medium, or high based on the number of recommendations taken." [official] (stores-best-practices)
- The API guide: `SCORE_LEVEL` is "Store Quality rating calculated on various factors defining the quality of a store", and "A high rating means that you have taken actions that Amazon believes will increase the duration that shoppers spend on your Store (dwell time)". [official] (Brand Store insights metrics)
- A practitioner reports a December 2025 change to sales-based rating (see "What practitioners add"). No Amazon page read states it.

C6. **Followers in Store insights.** "Followers: Total count of customers following your brand via the "Follow" button on your Store or Posts. Available in the U.S. only." [official] (stores-best-practices)

C7. **Programmatic access lives in the Amazon Ads API, not SP-API (fact, dated).**
- 2024-10-09: a Brand Stores API lists stores and pages ("`name`, `id`, `status` and `url` for a given `brandEntityId`").
- 2025-06-28: management APIs to "retrieve Brand Store page content and update the product content and selection across Brand Stores pages and 2) submit store updates for moderation".
- 2026-02-18: "The Brand Stores management API has graduated from beta to general availability".
- 2026-01-27: "`/v2/stores` is being deprecated and replaced with /brand/stores/v1/storePages/list".

[official] (Amazon Ads API release notes, https://advertising.amazon.com/API/docs/en-us/release-notes/index, read via its Markdown source 2026-10-14)

The insights call shown in Amazon's guide is `POST /stores/{brandEntityId}/insights`, linked to operation `getInsightsForStoreAPI`. [official] (Brand Store insights metrics) The `brandEntityId` "is required in order to use the Brand Stores metrics APIs". [official] (Brand Stores overview, https://advertising.amazon.com/API/docs/en-us/guides/brand-store/overview, read via its Markdown source 2026-10-14)

C8. **AMC dataset (fact, dated).** Brand Store page-view and engagement-event tables exist in Amazon Marketing Cloud as a Paid Feature. "Starting June 1, 2026, you can query this dataset at no cost through December 31, 2026". [official] (Amazon Brand Store insights tables, AMC)

C9. **A Store visit is not a Business Reports session, and the glossary's word is "storefront".** "A storefront or browse node visit by a user is not counted as a session in Business Reports"; "a storefront or browse node visit does not count as a page view." [official] (Business reports glossary, https://sellercentral.amazon.com/help/hub/reference/external/G27691, v7, read 2026-10-14)

[seat] "Storefront" may mean the seller's offer storefront, the Brand Store, or both. The page does not define it. Either way, a Store page is not a detail page, and only the detail-page visit that follows counts as a session.

C10. **Third-party apps distort Store visits (GUIDANCE).** "Traffic from 3rd party mobile apps … may result in high visitor and page view counts, but little corresponding engagement or sales." [official] (Third-party mobile app traffic | Stores, https://m.media-amazon.com/images/G/01/AmazonStores/Help/en/Stores_Insights/3P_mobile_app_traffic.html, read 2026-10-14)

### D. Brand Follow

- **What it is (dated 2021).** "To follow a brand, shoppers can simply hit the 'Follow' button, which has been included as an every-day part of the shopping experience –across Stores, Posts, and Amazon Live." Followers "may now see deals from brands they follow when they visit the Amazon homepage". [official] (New ways for shoppers to follow brands on Amazon | Amazon Ads, https://advertising.amazon.com/resources/whats-new/brand-follow, dated October 26, 2021, read 2026-10-14)
- **Enrolment and measurement.** "All brands that have a Store on Amazon will automatically be enrolled in Brand Follow." "Follower Count is available within Store Insights and Posts Publisher". [official] (same) Posts Publisher no longer exists (E). The 2026 guide still says followers are counted "via the "Follow" button on your Store or Posts. Available in the U.S. only." [official] (stores-best-practices)
- **The follower audience is used for promotions.** "Brand followers: Customers who have clicked to follow your brand on Amazon", with data refresh "Daily". It is one of the Brand Tailored Promotion audiences (F). [official] (Brand Tailored promotions, GFM3F4GG5EYCC5XC v10)
- **What Amazon does not say.**
  - No Amazon page read says whether the Follow button appears on the detail page itself.
  - No page read gives a follower count through any API.
  - No page read says what a follower is shown in 2026 beyond the homepage deals line of 2021.

### E. Posts (discontinued)

- "Posts were discontinued in July 2025". "New Post creation was disabled in June 2025". [official] (Amazon Posts Discontinued – Explore Alternative Solutions | Amazon Ads, https://advertising.amazon.com/solutions/products/posts, read 2026-10-14)
- The API timeline: "The Posts API will be discontinued as of June 3, 2025 … new Posts creation to be discontinued after June 16, 2025, and a full shut-off date of July 31, 2025." [official] (Amazon Ads API release notes, entry dated June 2, 2025)
- **Stale Amazon pages still advertise Posts.**
  - The Brand Registry page still lists "Posts", with the line "Post engaging content at no cost in organic shopping feeds across the Amazon store." [official] (Amazon Brand Registry | Sell on Amazon, read 2026-10-14)
  - A Seller Central help page still says "Highlight your brand with A+ Content, Posts, Vine, and more." [official] (Unlock marketing opportunities, https://sellercentral.amazon.com/help/hub/reference/external/GFJTFMCXPRQ5GHUK, v2, read 2026-10-14)
  - A skill must not treat these as evidence that Posts exist.

### F. Brand Tailored Promotions

- **Eligibility (RULE).**
  - "Brand Tailored promotions are available to sellers that have a Brand Representative selling role assigned in Brand Registry."
  - Products with "1-4 reviews must have an average rating of 2.5 stars"; with "5+ reviews … at least 3 stars"; products "must be in "New" condition".
  - Adult, sexual wellness, hunting and fishing, and guns are excluded.

  [official] (Brand Tailored promotions, https://sellercentral.amazon.com/help/hub/reference/external/GFM3F4GG5EYCC5XC, v10 r0, read 2026-10-14)

- **Limits (RULE).**
  - "You will be eligible to create tailored promotions only for an audience size of 1,000 or more". For specific-product promotions "the lower limit of the audience size should be 1,000 or more".
  - "You can have a maximum of 20 active or scheduled promotions at any given time."
  - "There is no fee".
  - "You can always edit a discount up to six hours before the promotion goes live."

  [official] (same)

- **Audiences.** There are seventeen audiences under four goals:
  - Customer Acquisition: cart abandoners, potential new customers, views remarketing, cart remarketing, in-market.
  - Customer Retention: repeat, high-spend, recent, brand followers, top-tier, promising, one-time.
  - Re-engagement: declining top-tier, declining promising, at-risk, lapsed.
  - Cross-sell: complementary-products remarketing.

  Each has a stated refresh frequency, from daily to monthly. "the audiences are not mutually exclusive". [official] (same)

- **Where it shows (RULE: display).**
  - "Eligible customers (audiences) will be able to view the promotion on search and detail pages, promotion shopping page, as well as on the Brand Stores page", with "a green badge that has wording such as "Save X% with brand promotion XXXX.""
  - It may not show if "The tailored promotion is not the highest value promotion for a given ASIN" or "Your product might not be the Featured Offer".
  - It applies only to "offers from the seller who is the brand representative".

  [official] (same)

- **Stacking (RULE).** Tailored promotions "may combine with other unrestricted promotions, such as deals and coupons, that do not have claim codes". "Budget overspending is most likely to occur during high-traffic events". [official] (same)
- **Measurement (fact).**
  - The dashboard shows only "Sales", "Spends", "Redemptions".
  - "No, currently we don't generate a detailed order-level or ASIN-level report for tailored promotions."

  [official] (same)

- **Launch (dated 2023).**
  - "now available to all brand owners enrolled in the Brand Registry operating in Amazon's U.S. store".
  - "promotional discounts ranging from 10% to 50% off".
  - "limited to one unit redemption per customer".
  - At launch there were six audience types. The 2026 page lists seventeen.

  [official] (Brand Tailored Promotions: Offer exclusive discounts for loyal customers, Benjamin Hartman, sell.amazon.com, https://sell.amazon.com/blog/announcements/brand-tailored-promotions, read 2026-10-14)

### G. What SP-API data shows of these surfaces

- **Brand Story**: fully readable and writable through the A+ Content API (A7–A11). The operations are `searchContentPublishRecords`, `searchContentDocuments`, `getContentDocument`, `listContentDocumentAsinRelations`, `validateContentDocumentAsinRelations`, `createContentDocument`, `updateContentDocument`, `postContentDocumentAsinRelations`, `postContentDocumentApprovalSubmission`, `postContentDocumentSuspendSubmission`, and the media operations. The A+ API's role table lists "Brand Analytics" or "Product Listing" ("need at least one"). [official] (A+ Content API, https://developer-docs.amazon.com/sp-api/docs/a-plus-content-api-use-case-guide, updatedAt 2026-09-30, read 2026-10-14)
- **Store, Store insights, followers**: no SP-API operation or dataset read today names them. The Data Kiosk seller analytics schema has `sellerStoreURL` ("Web address of a merchant's online storefront on Amazon displaying all their listed ASINs"). That is the seller's offer storefront, not the Brand Store. [official] (analytics_sellerAnalytics_2025_03_31.graphql, https://github.com/amzn/selling-partner-api-models/blob/main/schemas/data-kiosk/analytics_sellerAnalytics_2025_03_31.graphql, read 2026-10-14)
- **Brand Tailored Promotions**: there is no ASIN-level report (F). Data Kiosk's `Promotion` group gives `promotionType` with "Example values are Best Deal, Deal of the Day, Lightning Deal, Sales Discount". The page does not say whether tailored promotions appear there. [official] (same schema) The SP-API `promotionReport` schema is a vendor report: "Currently three promotion types are supported: Best Deal, Lightning Deal, and Price Discount." [official] (promotionReport.json, https://github.com/amzn/selling-partner-api-models/blob/main/schemas/reports/promotionReport.json, read 2026-10-14)

### H. Keepa fields that describe these surfaces

- `brandStoreName`: "The store name of the item's brand. null if not available."
- `brandStoreUrl`: "The brand store URL path."
- `brandStoreUrlName`.
- `aPlus`: "Provides A+ Content of this product. The `aplus` parameter is mandatory for access. To request live data for this field, the `offers` parameter must also be included." Each `APlus` element has `module[]` (with `text`, `image`, `video`, `imageAltText`, `asin`) and `fromManufacturer`.

[official, Keepa] (Product.java, https://github.com/keepacom/api_backend/blob/master/src/main/java/com/keepa/api/backend/structs/Product.java, read 2026-10-14)

[seat] Keepa's docs read do not say whether a Brand Story carousel lands in `aPlus` or how it is told apart (Open question 5). The fields carry no history, so Keepa shows the present state only.

## What practitioners add

- **Brand Story's place on the page.** [opinion] SellerSprite Academy Team, "Amazon Brand Story: Grow AOV, Rank, and Brand Trust" (SellerSprite blog, datePublished 2026-02-24, dateModified 2026-03-02, https://www.sellersprite.com/en/blog/amazon-brand-story-guide):
  - "On the Amazon.com desktop, Brand Story typically appears above A+ content. On mobile, it often appears closer to the top of the page than you expect".
  - "Amazon does not position Brand Story as a direct ranking lever."
  - It treats Brand Story coverage as the Premium A+ prerequisite. That agrees with G202102930 (A5), not with the A+ Content guide's "no additional eligibility criteria" (A5).

  The brief's phrase "the A+ carousel above product description" rests on this practitioner account. No Amazon page read states the order.
- **Brand Story review time.** [opinion] eStore Factory, "How to Upload Brand Story on Amazon: Seller Guide" (no author or date shown; footer "© Copyright 2014 - 2024", https://estorefactory.com/amazon-guide/how-to-upload-brand-story-on-amazon): "Amazon may take up to 24 hours to review your brand story". This disagrees with Amazon's "up to seven business days" for A+ review (A11). It names card types as the console labels them: "Brand Carousel Background, Brand ASIN & Store Showcase, Brand Focus Image".
- **Store insights and external traffic.**
  - [opinion] Lailama Hasan, Helium 10, "How to Make an Amazon Storefront in 5 Easy Steps" (published August 31, 2023, updated March 1, 2024, https://www.helium10.com/blog/amazon-storefront/): the Store gives "a dedicated place to send all of your online traffic". A homepage meta description "can help your Amazon store rank highly in Google".
  - [opinion] Jungle Scout, "How to Create an Amazon Storefront in 2024" (Brian Connolly, shown date March 22, 2024, page metadata dateModified 2025-02-13, https://www.junglescout.com/resources/articles/amazon-storefront/): "With Sponsored Brands or Sponsored Display Ads, you can drive traffic directly to your Amazon Store. This allows you to funnel customers away from your competitor's products".
- **Brand Store rating basis changed in December 2025.** [opinion] Luis Rijo, PPC Land, "Amazon quietly shifts Brand Store ratings to prioritize sales over time spent" (December 20, 2025, https://ppc.land/amazon-quietly-shifts-brand-store-ratings-to-prioritize-sales-over-time-spent/):
  - From December 12, 2025, ratings are "High, Medium, or Low classifications based on sales attributed to Brand Store visits" against category peers, in 29 countries.
  - Dwell time no longer sets the rating, but "these engagement metrics remain visible within the insights dashboard".
  - It says "according to the announcement" but links no Amazon page.
  - Conflict: this disagrees with all three Amazon descriptions read (C5).
- **Brand Stores API timeline.** [opinion] Luis Rijo, PPC Land, "Amazon Brand Stores API exits beta - what brands can now automate" (February 22, 2026, https://ppc.land/amazon-brand-stores-api-exits-beta-what-brands-can-now-automate/):
  - Dated February 22, 2026, it says the API "this month moved" from beta to general availability. Amazon's release note is dated February 18, 2026 (C7), so the two agree on the month.
  - It dates bounce rate, dwell time and new-to-store counts in Store insights to February 2024.
  - It dates the Sponsored Brands Brand Store page-view metric to November 3, 2025, with history from September 15, 2025.
- **Brand Follow.** [opinion] Fahim Sheikh, Trellis, "Everything You Need to Know About Amazon Brand Follow" (October 30, 2021, page metadata dateModified 2026-08-25, https://gotrellis.com/resources/blog/amazon-brand-follow):
  - "Brands with a strong follower base see a 34% increase in repeat purchases".
  - Brands "with 1,000+ followers achieved: 34% higher repeat purchase rates".
  - The figures are unsourced. They read as selection, not effect.
  - It repeats Amazon's "20 million" follow relationships.
- **Follow button and MYCE.** [opinion] Seller Forums thread "How to add a "FOLLOW" button to the store homepage？" (asked by a seller, shown as "3 years ago", https://sellercentral.amazon.com/seller-forums/discussions/t/ed2d53d5-1d44-449b-b219-737c09001024). A reply, with no staff tag visible in the served text, says the Follow feature is added "via the Manage Your Customer Engagement tool", and "If your Brand already has an Amazon Store (in the US), Amazon should automatically enroll your Store in Brand Follow." MYCE stopped on 2024-02-16, per `angles/off-listing-traffic.md` F. The first half of the reply is out of date. The second agrees with Amazon (D).
- **Brand Tailored Promotions in practice.**
  - [opinion] Bradley Sutton (Helium 10, VP of Education and Strategy), "Amazon Brand-Tailored Promotions: A Game Changer for FBA Sellers?" (published August 4, 2023, updated November 20, 2023, https://www.helium10.com/blog/amazon-brand-tailored-promotions/). It relays seller comments, including "0.6% redemptions based on total audience size after 2 weeks. This is for cart abandoners."
  - [opinion] Archit Arora, Adbrew, "Amazon Brand-Tailored Promotion - 2024 Guide" (dated Feb 14, 2025, https://adbrew.io/blog/amazon-brand-tailored-promotion): the audience must be "at least 100 customers".
  - Conflict: Adbrew's 100 contradicts Amazon's 1,000 (F). Amazon's page governs.
- **Not reached.** Perpetua (`/blog/amazon-brand-store`: 404), Pacvue (403, bot wall), Marketplace Pulse (a guessed Posts URL: 404), Jungle Scout Brand Story and tailored-promotion URLs (404). With no search budget left, no further practitioner pages were found.

## Published research

- [research] Randall A. Lewis and Justin M. Rao, "The Unfavorable Economics of Measuring the Returns to Advertising", *The Quarterly Journal of Economics* 130(4):1941–1973, 2015, doi:10.1093/qje/qjv023 (abstract read via Crossref, 2026-10-14).
  - Narrow finding: across "Twenty-five large field experiments with major U.S. retailers and brokerages", "The median confidence interval on return on investment is over 100 percentage points wide". "selection bias, due to the targeted nature of advertising, is a crippling concern for widely employed observational methods."
  - Transfer: Store visitors, brand followers and tailored-promotion audiences are self-selected or targeted groups. Amazon's "visitors purchase 53.9% more frequently" (B6) is the kind of observational comparison this paper warns about. It does not measure what a Store or Brand Story causes.
- [research] Brett R. Gordon, Florian Zettelmeyer, Neha Bhargava and Dan Chapsky, "A Comparison of Approaches to Advertising Measurement: Evidence from Big Field Experiments at Facebook", *Marketing Science* 38(2):193–225, 2019, doi:10.1287/mksc.2018.1135 (Crossref record read 2026-10-14; the abstract was not served, only the one-line summary "Observational methods often fail to accurately recover the treatment effects generated from randomized advertising experiments on Facebook").
  - Narrow finding: observational methods often fail to recover the effects measured by randomised advertising experiments.
  - Transfer: the same caution applies to reading Store insights' attributed sales or follower comparisons as effects. Amazon's own randomised tool for Brand Story is Manage Your Experiments (A13).
- None found: no peer-reviewed or Amazon Science study read today measures the effect of a brand-story band, a brand storefront or a follow feature on a marketplace detail page's conversion. The search budget was gone before Amazon Science could be searched (Open question 7).

## Stable enough for a skill

1. Brand Story is a separate A+ content type (`BrandStory`). It shows under "From the brand" on the detail page, separate from the Product description section that A+ fills. (A+ Content, G202102930; A+ Brand Story Modules; aplusContent model)
2. Only a Brand Registry Brand Representative or Reseller on a professional account can publish a Brand Story. The API refuses others at creation, not at validation. (A+ Content, G202102930; A+ Content Troubleshooting Guide)
3. One Brand Story is live per ASIN. Approving another Brand Story on the same ASIN silently replaces it, and posting an ASIN set replaces the whole set. (A+ Content Troubleshooting Guide; aplusContent model; Manage A+ content)
4. A Brand Story is often applied to many ASINs at once, so one submission can change many detail pages. (A+ Content, G202102930; aplusContent model `BULK` badge)
5. A Brand Story links to sibling ASINs and to the Brand Store only through its card fields. Linking language in text is barred by the A+ guidelines. (A+ Brand Story Modules; A+ content guidelines)
6. Time-sensitive and holiday wording is barred in A+ but allowed in the Brand Story section. (A+ content guidelines)
7. A+ and Brand Story changes go through moderation and then take time to publish. The current figures are on Amazon's publishing-status page, and the live state is the publish record. (Content publishing status and content rejection; A+ Content Troubleshooting Guide)
8. Amazon's pages disagree on Premium A+ eligibility: one ties it to a published Brand Story on all the brand's ASINs plus a count of approved A+ projects, another says there are no additional criteria. A skill reads a seller's eligibility from A+ Content Manager (or a Premium submission's refusal) at run time, not from a help page. (A+ Content, G202102930; A+ Content guide, GLG4RQK2Y2RJADU4, as quoted in method/funnel-and-search.md)
9. Brand Stores need Brand Registry and a pending or registered trademark, cost nothing, and are run from Amazon Ads, not SP-API. (Brand Stores … | Amazon Ads; Amazon Ads account and campaigns, G200663330; Amazon Ads API release notes)
10. The detail-page byline is a documented entry into the Brand Store. Store insights counts it as "Amazon organic traffic". (stores-best-practices; Metrics and traffic sources | Stores; Amazon Brand Store insights tables)
11. Store insights attributes sales by last discovery over a window after the visit, and dates them by the visit, not the order. Its sales are not Business Reports sales. (Orders, sales and units sold | Stores; Brand Store insights metrics)
12. A Brand Store page visit is not a Business Reports session. Only the detail-page visit that follows is. (Business reports glossary, G27691)
13. Posts no longer exist (ended July 2025), and some Amazon pages still mention them. (Amazon Posts Discontinued; Amazon Ads API release notes; Amazon Brand Registry | Sell on Amazon)
14. Brand Tailored Promotions show a badge on search and detail pages only to a chosen audience. They need no listing write, have no ASIN-level report, and can stack with unrestricted deals and coupons. (Brand Tailored promotions, GFM3F4GG5EYCC5XC)
15. Brand followers are one of the tailored-promotion audiences. Follower counts are shown in Store insights (US). (Brand Tailored promotions; stores-best-practices; New ways for shoppers to follow brands on Amazon)
16. Amazon's Store and A+ uplift figures are "Amazon internal data" comparisons with no method shown. A skill does not use them as expected effects. (Brand Stores … | Amazon Ads; stores-best-practices; Test listing content with Manage Your Experiments; Amazon Brand Registry | Sell on Amazon; Lewis and Rao 2015)

## What cx must read at run time

- **Is a Brand Story live on the ASIN, and which one.**
  - Call `searchContentPublishRecords` (marketplaceId, asin) on the A+ Content API 2020-11-01. A record with `contentType` `BrandStory` gives its `contentReferenceKey`.
  - Then call `getContentDocument` with `includedDataSet=CONTENTS,METADATA` as one comma-separated value. This returns the cards, including `BRAND_STORY_FOUR_ASIN` → `asinImages[].productAsin` (the cross-sold siblings) and `brandStoreId`, plus `contentMetadata.status`, `badgeSet` and `updateTime`.
  - Then call `listContentDocumentAsinRelations` with `includedDataSet=METADATA` for the full ASIN set the Brand Story is applied to, with badges such as `CONTENT_PUBLISHED`, `BRAND_NOT_ELIGIBLE` and `CATALOG_NOT_FOUND`.
  - Record the ASIN and content type with the key, because the key "may change in the future".
- **Before proposing or writing a Brand Story.**
  - Call `validateContentDocumentAsinRelations` as the dry run. It does not check entitlements.
  - Read the field limits from the module page or the validator's own messages, not from a skill.
  - Read the current publish record so a replacement is deliberate.
- **After a Brand Story submission.**
  - Poll `getContentDocument` until `APPROVED` or `REJECTED`, no more often than the tutorial's stated interval per document (once an hour on 2026-10-14), as Amazon asks.
  - Read `searchContentPublishRecords` again to confirm the publish record moved.
  - The change log's observation window starts at that confirmation, not at submission.
- **Brand Store existence and the byline link.** Read Keepa's `brandStoreName`, `brandStoreUrl` and `brandStoreUrlName` on the product (`cx get amazon/us/<ASIN>/product --source keepa`, or the `/product` raw route). No history comes with them. SP-API reads today name no Brand Store field.
- **Store insights, followers, quality rating, section metrics.** These are only in the Amazon Ads API (`POST /stores/{brandEntityId}/insights`, operation `getInsightsForStoreAPI`, with up to a 100-day range) or the console. The package's SP-API door does not reach them. Until an Ads door exists, cx asks the seller for a Store insights export, or for the seller's declaration in the standing-instruction file.
- **Tailored promotions.** No SP-API report gives them at ASIN level. cx asks the seller and records the declaration in the standing-instruction file. Data Kiosk seller analytics' `promotion` group is the place to check first whether a tailored promotion shows up as a `promotionType` (Open question 6). The dataset, its query shape and its wait belong to door.md.
- **A+ content as Keepa sees it.** The Keepa `/product` raw route with `aplus` (and `offers` for live data) returns `aPlus[]`. Whether Brand Story cards appear there is open (Open question 5).

## Pages read

| Page name | URL | Date read | What it gave |
|---|---|---|---|
| A+ Content (G202102930, v17 r0) | https://sellercentral.amazon.com/help/hub/reference/external/G202102930 | 2026-10-14 | Brand Story placement, 19 cards, 20 pending, no fee, retail precedence, Premium eligibility (Brand Story on all ASINs + 5 approved in 12 months, weekly; contradicted by GLG4RQK2Y2RJADU4 v3, not opened by this seat, see A5) |
| Create A+ content (G202134820, v17 r1) | https://sellercentral.amazon.com/help/hub/reference/external/G202134820 | 2026-10-14 | Automatic language variations and cross-country translation; 20 pending |
| A+ content guidelines (GGW8U76SSNTRTBX7, v8 r2) | https://sellercentral.amazon.com/help/hub/reference/external/GGW8U76SSNTRTBX7 | 2026-10-14 | Time-sensitive words allowed in Brand Story; no redirecting language (capture: capture `GGW8U76SSNTRTBX7-v8`) |
| A+ content FAQ & troubleshooting (G202102960, v7 r1) | https://sellercentral.amazon.com/help/hub/reference/external/G202102960 | 2026-10-14 | Brand Registry route for brand errors; retail contribution; MYE 500-ASIN cap |
| Content publishing status and content rejection (GAEAQB7QC4G5Z2LC, v3 r1) | https://sellercentral.amazon.com/help/hub/reference/external/GAEAQB7QC4G5Z2LC | 2026-10-14 | Up to seven business days review; 24 h to publish; language-specific display |
| Increase sales (G43381, v13) | https://sellercentral.amazon.com/help/hub/reference/external/G43381 | 2026-10-14 | Help tree (navigation only); A+ access by Brand Representative or Reseller role |
| Brand Tailored promotions (GFM3F4GG5EYCC5XC, v10 r0) | https://sellercentral.amazon.com/help/hub/reference/external/GFM3F4GG5EYCC5XC | 2026-10-14 | Eligibility, 17 audiences, 1,000 minimum, 20 cap, display, stacking, no ASIN report |
| Amazon Ads account and campaigns (G200663330, v10) | https://sellercentral.amazon.com/help/hub/reference/external/G200663330 | 2026-10-14 | Store questions go to Advertiser Support |
| Unlock marketing opportunities (GFJTFMCXPRQ5GHUK, v2) | https://sellercentral.amazon.com/help/hub/reference/external/GFJTFMCXPRQ5GHUK | 2026-10-14 | Still mentions Posts |
| Business reports glossary (G27691, v7 r1) | https://sellercentral.amazon.com/help/hub/reference/external/G27691 | 2026-10-14 | Storefront visit not a session or page view (capture: capture `G27691-v7`) |
| aplusContent_2020-11-01.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/aplus-content-api-model/aplusContent_2020-11-01.json | 2026-10-14 | 13 operations, `ContentType` incl. `BrandStory`, free-text `ContentSubType`, 5 `BRAND_STORY_*` modules, badges, rate 10/10 |
| A+ Brand Story Modules | https://developer-docs.amazon.com/sp-api/docs/a-plus-brand-story-modules | 2026-10-14 | "From the Brand" slot, required hero card, field and image limits, `brandStoreId` |
| A+ Content Troubleshooting Guide | https://developer-docs.amazon.com/sp-api/docs/a-plus-troubleshooting | 2026-10-14 | BrandStory entitlement error, one live per family, silent replacement, badgeSet empty for Brand Story, logo-minimum discrepancy |
| Manage A+ content | https://developer-docs.amazon.com/sp-api/docs/manage-aplus-content | 2026-10-14 | Publishing replaces existing content; post the whole ASIN set |
| Create, edit, and publish A+ content | https://developer-docs.amazon.com/sp-api/docs/create-edit-publish-aplus-content | 2026-10-14 | Uploads API for images; poll at most hourly |
| A+ Content API (use case guide) | https://developer-docs.amazon.com/sp-api/docs/a-plus-content-api-use-case-guide | 2026-10-14 | Roles: Brand Analytics or Product Listing |
| SP-API release notes | https://developer-docs.amazon.com/sp-api/docs/sp-api-release-notes | 2026-10-14 | 2026-09-30: Premium and Brand Story modules, media operations |
| analytics_sellerAnalytics_2025_03_31.graphql | https://github.com/amzn/selling-partner-api-models/blob/main/schemas/data-kiosk/analytics_sellerAnalytics_2025_03_31.graphql | 2026-10-14 | `Promotion` group and `promotionType` examples; `sellerStoreURL`; no Brand Store fields |
| promotionReport.json | https://github.com/amzn/selling-partner-api-models/blob/main/schemas/reports/promotionReport.json | 2026-10-14 | Vendor report, three promotion types |
| Brand Stores: Create a brand page on Amazon for free \| Amazon Ads | https://advertising.amazon.com/solutions/products/stores | 2026-10-14 | Eligibility, trademark, free, byline/ads/URL entry, quarterly update, internal-data figures |
| A comprehensive guide to successful Brand Stores \| Amazon Ads | https://advertising.amazon.com/library/guides/stores-best-practices | 2026-10-14 | Byline, canonical URL, 24 h moderation, dwell/bounce/followers (US), rating by recommendations, 90-day cadence, footnoted figures |
| How to open your Store on Amazon \| Amazon Ads | https://advertising.amazon.com/library/guides/getting-started-with-stores | 2026-10-14 | Brand Registry required; "Ad moderation can take up to 24 hours"; hard rejections |
| New ways for shoppers to follow brands on Amazon \| Amazon Ads (2021-10-26) | https://advertising.amazon.com/resources/whats-new/brand-follow | 2026-10-14 | Follow on Stores/Posts/Live, auto-enrolment, follower count, US only |
| New Brand Store quality rating is available to all advertisers (2024-05-30) | https://advertising.amazon.com/resources/whats-new/brand-store-quality-rating | 2026-10-14 | Rating vs peers, dwell time, API Jan 2024 |
| Enhanced Brand Store sources insights (2025-11-07) | https://advertising.amazon.com/resources/whats-new/enhanced-brand-store-sources-insights | 2026-10-14 | Sources breakdown from 2025-10-01, API enhanced |
| Section-level shopper engagement insights on Brand Store (Beta) (2026-01-16) | https://advertising.amazon.com/en-gb/resources/whats-new/brand-store-insights-at-section-level-beta | 2026-10-14 | Section metrics from 2026-01-10, API endpoints |
| Amazon Ads "What's new" index | https://advertising.amazon.com/resources/whats-new | 2026-10-14 | Unreachable in substance: script-rendered list ("0 results") |
| Amazon Posts Discontinued – Explore Alternative Solutions \| Amazon Ads | https://advertising.amazon.com/solutions/products/posts | 2026-10-14 | Posts ended July 2025; creation off June 2025 |
| Amazon Ads API release notes (Markdown) | https://advertising.amazon.com/API/docs/en-us/release-notes/index | 2026-10-14 | Brand Stores API 2024-10-09; management API 2025-06-28; GA 2026-02-18; `/v2/stores` deprecation; Posts API shut-off 2025-07-31; AMC Store datasets |
| Brand Stores overview (Ads API guide, Markdown) | https://advertising.amazon.com/API/docs/en-us/guides/brand-store/overview | 2026-10-14 | `/v2/stores`, `brandEntityId` required |
| Brand Store insights metrics (Ads API guide, Markdown) | https://advertising.amazon.com/API/docs/en-us/guides/brand-store/insight-metrics | 2026-10-14 | Metric definitions, 14-day windows, 100-day range, ASIN metrics, quality metrics, `getInsightsForStoreAPI` |
| Amazon Brand Store insights tables (AMC, Markdown) | https://advertising.amazon.com/API/docs/en-us/guides/amazon-marketing-cloud/datasources/brand_store_insights_paid | 2026-10-14 | Ingress types incl. "detail page byline"; free June–December 2026 |
| Stores OpenAPI reference | https://advertising.amazon.com/API/docs/en-us/stores/open-api | 2026-10-14 | Unreachable in substance: script-rendered shell; spec file not found at tried paths |
| Stores help microsite: Stores; Stores Insights; Metrics and traffic sources; Orders, sales and units sold; Improving performance; Third-party mobile app traffic; Review and Publish; Content acceptance policy | https://m.media-amazon.com/images/G/01/AmazonStores/Help/en/index.html (and siblings named in the text) | 2026-10-14 | Old (© 2019) definitions: sources, last discovery, visit-date sales, several-day moderation, content policy |
| Amazon Brand Registry \| Sell on Amazon | https://sell.amazon.com/brand-registry | 2026-10-14 | Tool list incl. Posts (stale), BTP, Stores; A+ 8%/20%, MYE 25%, Store 53.9%/71.3% with footnotes |
| A+ Content \| Sell on Amazon | https://sell.amazon.com/tools/a-content | 2026-10-14 | Brand Story drives traffic to the Brand Store |
| Test listing content with Manage Your Experiments \| Sell on Amazon | https://sell.amazon.com/tools/manage-your-experiments | 2026-10-14 | A+ incl. Brand Story testable; published Brand Story needed; "up to 20%" |
| Brand Tailored Promotions: Offer exclusive discounts for loyal customers (Benjamin Hartman) | https://sell.amazon.com/blog/announcements/brand-tailored-promotions | 2026-10-14 | 2023 launch: US, 10–50%, one unit, six audiences |
| Keepa Product.java | https://github.com/keepacom/api_backend/blob/master/src/main/java/com/keepa/api/backend/structs/Product.java | 2026-10-14 | `brandStoreName`, `brandStoreUrl`, `brandStoreUrlName`, `aPlus` (`fromManufacturer`, modules) |
| Keepa Request.java | https://github.com/keepacom/api_backend/blob/master/src/main/java/com/keepa/api/backend/structs/Request.java | 2026-10-14 | `aplus` parameter: "include A+ content" |
| Amazon Brand Story: Grow AOV, Rank, and Brand Trust (SellerSprite) | https://www.sellersprite.com/en/blog/amazon-brand-story-guide | 2026-10-14 | Placement above A+ (opinion); not a ranking lever |
| How to Upload Brand Story on Amazon (eStore Factory) | https://estorefactory.com/amazon-guide/how-to-upload-brand-story-on-amazon | 2026-10-14 | 24 h review claim; console card names |
| How to Make an Amazon Storefront in 5 Easy Steps (Helium 10) | https://www.helium10.com/blog/amazon-storefront/ | 2026-10-14 | Store as external-traffic landing page; Google meta description |
| How to Create an Amazon Storefront in 2024 (Jungle Scout) | https://www.junglescout.com/resources/articles/amazon-storefront/ | 2026-10-14 | SB/SD to Store; Attribution; meta description |
| #453 – Amazon Brand Story, A+ Content & Photography Strategies (Helium 10 podcast page) | https://www.helium10.com/blog/amazon-brand-story/ | 2026-10-14 | Episode outline only (2023-05-16); no claim carried |
| Amazon quietly shifts Brand Store ratings to prioritize sales over time spent (PPC Land) | https://ppc.land/amazon-quietly-shifts-brand-store-ratings-to-prioritize-sales-over-time-spent/ | 2026-10-14 | Sales-based rating from 2025-12-12 (opinion) |
| Amazon Brand Stores API exits beta - what brands can now automate (PPC Land) | https://ppc.land/amazon-brand-stores-api-exits-beta-what-brands-can-now-automate/ | 2026-10-14 | API timeline; GA in February 2026, the month of Amazon's note |
| Everything You Need to Know About Amazon Brand Follow (Trellis) | https://gotrellis.com/resources/blog/amazon-brand-follow | 2026-10-14 | 34% repeat-purchase claim, unsourced |
| How to add a "FOLLOW" button to the store homepage？ (Seller Forums) | https://sellercentral.amazon.com/seller-forums/discussions/t/ed2d53d5-1d44-449b-b219-737c09001024 | 2026-10-14 | MYCE route (stale), auto-enrolment |
| Amazon Brand-Tailored Promotions: A Game Changer for FBA Sellers? (Helium 10, Bradley Sutton) | https://www.helium10.com/blog/amazon-brand-tailored-promotions/ | 2026-10-14 | Seller comments, 0.6% redemption anecdote |
| Amazon Brand-Tailored Promotion - 2024 Guide (Adbrew) | https://adbrew.io/blog/amazon-brand-tailored-promotion | 2026-10-14 | 100-customer claim (contradicts Amazon) |
| python-amazon-ad-api issue #192 (GitHub) | https://github.com/denisneuf/python-amazon-ad-api/issues/192 | 2026-10-14 | Third-party pointer to `/stores/{brandEntityId}/asinMetrics`, `getAsinEngagementForStore`; not used as a source of truth |
| Perpetua, Pacvue, Marketplace Pulse, Jungle Scout (guessed URLs) | https://www.perpetua.io/blog/amazon-brand-store ; https://pacvue.com/blog/amazon-brand-store ; https://www.marketplacepulse.com/articles/amazon-discontinues-posts ; https://www.junglescout.com/resources/articles/amazon-brand-story/ | 2026-10-14 | Unreachable: 404 / 403 / 404 / 404 |
| Crossref: Lewis and Rao 2015; Gordon et al. 2019 | https://api.crossref.org/works/10.1093/qje/qjv023 ; https://api.crossref.org/works/10.1287/mksc.2018.1135 | 2026-10-14 | Bibliographic records and abstract (Lewis and Rao) |

## Open questions

1. **The 2025–2026 "Brand Store on the detail page" surfaces.**
   - Amazon documents two detail-page links into the Store: the byline (B2) and the Brand Story card's `brandStoreId` (A7). It also documents Sponsored Brands placements "on product pages".
   - No Amazon page read here announces a new 2025–2026 Store module on the detail page. Neither the Ads API release notes nor the four Store "what's new" posts found mention one.
   - The search budget ran out before a search could be made.
   - *Settles it:* a search of Amazon Ads "what's new" and Seller Forums News for "Brand Store" plus "detail page" since 2025-01, or a look at a live detail page in a first real run, recorded as a screenshot by the seller.
2. **The Store quality rating's basis today.** Amazon's 2024 post and API guide tie it to dwell time and recommendations. A practitioner reports sales-based ratings from 2025-12-12 (C5). *Settles it:* an Amazon "what's new" post from December 2025, or the current Brand Store insights tab in the seller's console.
3. **Whether a retail vendor's A+ blocks a seller's Brand Story.** A4 speaks of "A+ Content" only. *Settles it:* an A+ Content Manager attempt on an ASIN with vendor content, or a `createContentDocument` refusal text on a first real run.
4. **The API's card limit for a Brand Story document.** The help page says "up to 19" cards. The developer page gives no maximum. *Settles it:* a `validateContentDocumentAsinRelations` dry run with 20 modules on a first real run. The validator's message names the bound.
5. **Whether Keepa's `aPlus` includes Brand Story cards, and how it marks them.** *Settles it:* Keepa's web documentation of the product object (script-rendered, not read), or one `/product` read with `aplus` on an ASIN known to carry a Brand Story.
6. **Whether a Brand Tailored Promotion shows in Data Kiosk's `promotion` group or in the Orders report's promotion ids.** *Settles it:* a seller with a running tailored promotion and one Data Kiosk seller analytics query over its dates, compared with the Tailored Promotion dashboard.
7. **Published research on brand-story or storefront effects on marketplace conversion.** None was found before the budget ran out. *Settles it:* an Amazon Science and Google Scholar search for "brand store" and "brand following" with "e-commerce".
8. **The Stores OpenAPI specification (exact operation names, request fields, section-level endpoints).** The reference page is script-rendered and the specification file was not found. *Settles it:* the Ads API docs' Markdown index for the `stores` reference, or the specification link in the console.
9. **Store moderation time.** Amazon's pages say "up to 24 hours" (2026 guides) and "several days" (old microsite). A Prime Day page says to allow a week. *Settles it:* the seller's console status times on a first real Store change.
10. **What "storefront" means in the Business Reports glossary** (C9). *Settles it:* a seller's Store visit followed by a session count. Practically, a Business Reports read on a day with a known Store campaign.
11. **Whether Brand Follow appears on the detail page today, and what followers see in 2026.** *Settles it:* a current Amazon page on Brand Follow. None was found beyond the 2021 post and the undated guide.
12. **Premium A+ eligibility: which Amazon page is current** (A5). A+ Content (G202102930 v17) names a Brand Story on all ASINs plus approved projects; the A+ Content guide (GLG4RQK2Y2RJADU4 v3) says there are no additional criteria. Neither page has a saved capture under the office's capture folder (outside this repository) *Settles it:* A+ Content Manager's eligibility display for the seller, or the next revision of either page.

## Positions

1. **P-brand-story-and-store-1.** cx treats Brand Story as a conversion-stage, cross-sell element, separate from A+ and from the listing attributes. It reads it through the A+ Content API, never through Listings Items. (A+ Content, G202102930; A+ Brand Story Modules; aplusContent model)
2. **P-brand-story-and-store-2.** In a listing review, cx reads `searchContentPublishRecords` for the ASIN and reports whether a `BrandStory` record is live. It then reads `getContentDocument` and reports which sibling ASINs and which Store the cards point to. (aplusContent model; A+ Brand Story Modules)
3. **P-brand-story-and-store-3.** Before any Brand Story write, cx reads the live publish record and the document's full ASIN set. It tells the seller that approval replaces the live Brand Story on every ASIN in the set, and that posting an ASIN set replaces the whole set. (A+ Content Troubleshooting Guide; Manage A+ content; aplusContent model)
4. **P-brand-story-and-store-4.** cx validates a Brand Story with `validateContentDocumentAsinRelations` and takes field limits from the validator's messages and Amazon's module page. It does not state limits from memory. It tells the seller that validation does not check entitlements. (A+ Content Troubleshooting Guide; A+ Brand Story Modules)
5. **P-brand-story-and-store-5.** The change-log entry for a Brand Story records:
   - the document name;
   - the content type;
   - the ASIN set as posted;
   - the submission time;
   - the time the approval was read;
   - the time the publish record was confirmed.

   The observation window starts at the confirmed publish record, not at submission. (Content publishing status and content rejection; A+ Content Troubleshooting Guide; aplusContent model)
6. **P-brand-story-and-store-6.** cx polls a submitted A+ or Brand Story document no more often than the interval Amazon's A+ tutorial states, read from that page. It reports `APPROVED` or `REJECTED` as Amazon states it. (Create, edit, and publish A+ content; A+ Content Troubleshooting Guide)
7. **P-brand-story-and-store-7.** In an effect review, cx treats a Brand Story publication or replacement as a confounder for every ASIN it was applied to, including siblings used for comparison. (A+ Content, G202102930; aplusContent model `BULK` badge)
8. **P-brand-story-and-store-8.** When a seller asks about Premium A+, cx says that Amazon's own pages disagree: the A+ Content help page names a Brand Story on all of the brand's ASINs plus a count of approved projects, and the A+ Content guide says there are no additional criteria. cx takes the seller's actual eligibility from A+ Content Manager's display or a Premium submission's result, and quotes no count, Amazon's or a practitioner's, as binding. (A+ Content, G202102930; A+ Content guide, GLG4RQK2Y2RJADU4, as quoted in method/funnel-and-search.md)
9. **P-brand-story-and-store-9.** cx does not propose Brand Story text that links or redirects to other products in words. Cross-sell goes through the four-ASIN card and the Store field. (A+ content guidelines; A+ Brand Story Modules)
10. **P-brand-story-and-store-10.** cx reads whether the listing's byline leads to a Brand Store from Keepa's `brandStoreUrl` and `brandStoreName`. It says this is a present-state read with no history. (Keepa Product.java; stores-best-practices)
11. **P-brand-story-and-store-11.** cx never adds Store insights sales to Business Reports or Data Kiosk sales, and never compares them day by day. Store sales are last-discovery, attributed over days after the visit and dated by the visit. (Orders, sales and units sold | Stores; Brand Store insights metrics; Business reports glossary)
12. **P-brand-story-and-store-12.** cx says that Store insights, followers and the Store quality rating are outside SP-API and come from the Amazon Ads API or the seller's console. Until that door exists, cx asks the seller for the export or the declaration. (Amazon Ads API release notes; Brand Store insights metrics; Amazon Ads account and campaigns, G200663330)
13. **P-brand-story-and-store-13.** In an effect review, cx asks whether the seller ran a Brand Tailored Promotion in either window and records the answer. Tailored promotions change the badge and price for an audience with no listing write, and have no ASIN-level report. (Brand Tailored promotions, GFM3F4GG5EYCC5XC)
14. **P-brand-story-and-store-14.** In an effect review, cx asks whether the Store was republished or relaunched in either window. It treats a yes as a confounder for sessions and conversion. (stores-best-practices; Metrics and traffic sources | Stores; Business reports glossary)
15. **P-brand-story-and-store-15.** cx does not ask a seller about Posts as a live tool, and does not take an Amazon page's mention of Posts as evidence they exist. (Amazon Posts Discontinued; Amazon Ads API release notes)
16. **P-brand-story-and-store-16.** cx does not quote Amazon's Store, A+ or MYE uplift percentages as the expected effect of a change. It says they are Amazon's internal comparisons with no method shown. (Brand Stores … | Amazon Ads; stores-best-practices; Test listing content with Manage Your Experiments; Amazon Brand Registry | Sell on Amazon; Lewis and Rao 2015; Gordon et al. 2019)
17. **P-brand-story-and-store-17.** When judging a Brand Story change, cx prefers a Manage Your Experiments result exported by the seller over a before/after comparison. MYE randomises shoppers and supports Brand Story. (Test listing content with Manage Your Experiments; Gordon et al. 2019)
18. **P-brand-story-and-store-18.** cx tells the seller that a Brand Story appears only in the language it was published in, and that Amazon may create translated variations itself. A missing or unexpected band on another language page is checked before it is blamed on a write. (Content publishing status and content rejection; Create A+ content, G202134820)

The seat's own (not for a skill):
- Brand Story's position above the Product description section on desktop is a practitioner claim (SellerSprite), not an Amazon statement. A skill should not depend on the page order.
- A Store's "Amazon organic traffic" is partly the listing's own byline clicks going round. A better listing may raise Store traffic rather than the reverse. This is unmeasured, and the same point appears in `angles/off-listing-traffic.md`.
- The follower audience is likely small for most sellers, given the audience-size minimum on the Brand Tailored promotions page (F). This is unmeasured.

## Verification

Gap fill 2026-10-14: 5 gaps filled, 2 left open (gaps counted as: 1 Brand Story; 2 Brand Store and Store insights; 3 Posts; 4 Brand Follow; 5 Brand Tailored Promotions; 6 the 2025–2026 "Brand Store on detail page" surfaces; 7 the API route for Brand Story, named in the brief as `contentSubType`).

- **Filled:**
  - 1: A1–A13, G, H.
  - 2: B, C. Store insights is filled. Section-level and source metrics are filled at announcement level, with the exact operation names open as OQ8.
  - 3: E.
  - 5: F.
  - 7: A7 states that Brand Story is `contentType=BrandStory`. `contentSubType` is free text and has no `BRAND_STORY` value. `BRAND_STORY_*` are module types.
- **Left open:**
  - 4, in part: Brand Follow is sourced only to a 2021 post, an undated guide and the tailored-promotion audience list. Its 2026 presence on the detail page is open as OQ11.
  - 6: no Amazon source was found (OQ1).
- **Adversarial re-check of what was added.**
  - Each Seller Central page (G202102930, G202134820, GGW8U76SSNTRTBX7, G202102960, GAEAQB7QC4G5Z2LC, GFM3F4GG5EYCC5XC, G200663330, GFJTFMCXPRQ5GHUK, G27691) was re-fetched through the content call. Each quoted string, version and revision was string-matched.
  - The SP-API Markdown pages, the A+ model, the Data Kiosk schema, the promotion report schema, Keepa's Product.java and Request.java, and the Ads API Markdown guides and release notes were re-downloaded and string-matched.
  - The four Amazon Ads "what's new" posts, the two library guides, the Stores product page and the sell.amazon.com pages were re-downloaded as HTML and string-matched.
  - Practitioner quotes were string-matched against the downloaded pages.
  - Results of the re-check are listed below the line that follows.
- **Re-check results (2026-10-14).**
  - 219 quoted strings were matched against the fresh copies, after HTML tags, Markdown links and escapes were removed. Every quote matched except those corrected below.
  - Corrected:
    - G202134820 is v17 **r1**, not r0. G202102960 and G27691 carry r1, now shown.
    - The Brand Registry page's Posts entry is a heading "Posts" plus a line. The quote no longer joins them with a colon.
    - Lewis and Rao's experiments are with "major U.S. retailers and brokerages", not retail only.
    - PPC Land's Stores API article does not give its own GA date. It says "this month moved" in an article dated February 22, 2026. It is now reported as agreeing with Amazon's February 18 note on the month, not contradicting it.
    - PPC Land's rating article says "according to the announcement" but links no Amazon page. It is now worded that way.
    - Added authors and dates the pages carry:
      - Helium 10 storefront: Lailama Hasan.
      - Jungle Scout: Brian Connolly, March 22, 2024.
      - Trellis: Fahim Sheikh, metadata modified 2026-08-25.
    - The forum thread shows "3 years ago", not "updated 3 years ago".
  - Re-confirmed:
    - Help versions: G202102930 v17 r0, GAEAQB7QC4G5Z2LC v3 r1, GGW8U76SSNTRTBX7 v8 r2, GFM3F4GG5EYCC5XC v10 r0, G200663330 v10 r0, GFJTFMCXPRQ5GHUK v2 r0, G43381 v13 r0. All read Live, Published/US.
    - SP-API page dates: Brand Story Modules 2026-09-30, Troubleshooting 2026-09-30, Manage 2026-09-09, Create/edit/publish 2026-10-02, use case guide 2026-09-30, release notes 2026-10-01.
    - Brand Story image minimums: 1464 × 625 and 463 × 625 (hero), 166 × 182 (ASIN card), 362 × 453 (media card), 315 × 145 (about logo).
    - The troubleshooting row "Brand Story logo 362 x 453" is still on the page, so the discrepancy stands.
  - Not re-checkable by string match: the claim that no Amazon page read announces a 2025–2026 detail-page Store surface. It is an absence, bounded by the pages listed above.

**Reconciled 2026-10-14** (against `.listing-playbook-scratch/contradictions.txt` and the rest of research/):
- Premium A+ eligibility. The line saying `elements/a-plus-content.md` denies a current Amazon page is removed: that file now quotes G202102930 v17 for the same criteria. Added (A5, Stable 8, P-8, OQ12) that Amazon's own pages disagree: A+ Content guide GLG4RQK2Y2RJADU4 v3 ("no additional eligibility criteria", as quoted in `method/funnel-and-search.md` and `elements/bullet-points.md`; not opened by this seat, no capture) against G202102930 v17. Stable 8 and P-8 no longer state Amazon's criteria as settled; the binding answer is A+ Content Manager's display or a Premium submission's result, read at run time. The SellerSprite bullet now says which Amazon page it agrees with. `elements/description.md`'s TR-deck "5" agrees with G202102930; `elements/bullet-points.md`'s note that the 5-project rule is "superseded" takes GLG4RQK2Y2RJADU4 as current, which this file does not do.
- Brand Story module types (A7): added that the model and release note say five while the Quickguide (as quoted in `elements/a-plus-content.md`) says four; the model enum is binding at run time. The Quickguide's 19 per Brand Story matches the help page's 19 cards.
- Help-page reachability: "How pages were read" now names the two captures (GGW8U76SSNTRTBX7-v8, G27691-v7), against which every quote from those pages was string-matched (all found), and says the other eight Seller Central pages were read through the content call on 2026-10-14 with no saved capture, and that no further page is fetched through that call. The file never called any of its pages unreachable, so no reachability claim was changed. Pages read rows for the two captured pages name their capture.
- Rate limits (A11): re-read the A+ model on GitHub; all 13 operations say 10 / 10. Added that the binding rate is the model's, read at run time.
- Numbers out of positions and stable lines: P-6 and the run-time poll line no longer fix "once an hour" as cx's rule; they defer to the tutorial's stated interval (the run-time line keeps the 2026-10-14 figure for human readers). The seat's own note no longer quotes the 1,000 audience minimum. No Stable line states a schema-held or announced figure.
- MYE uplift (20% vs 25%): already named both Amazon pages (A13); no change. Rufus/Alexa for Shopping, shopping-assistant feeds, Keepa truncation and variation sizes, Data Kiosk roles and conversion metrics: this file states none of them; no change.
- Cross-references checked: `method/help-page-access.md`, `angles/seasonality-and-events.md`, `angles/off-listing-traffic.md`, `elements/a-plus-content.md` exist. The file cites neither inventory-and-fulfilment.md nor vendor-and-hybrid.md. "door.md" is the package's door document named in `research/README.md`, not a research file.
