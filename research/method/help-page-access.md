# How Seller Central help pages are read, and the pages other files left unread

Read 2026-10-14 by the research seat. Tags: [official] Amazon's own page or document; [opinion] a named practitioner; [research] published research; [seat] the seat's own reasoning, never a skill position.

## What this covers

Funnel stage: none directly. This is a method file. It feeds every file that cites a Seller Central help page, and so feeds all three skills indirectly. Listing-review cites Amazon's rules (title, images, search terms, claims, variations, review sharing). Listing-change-log needs the latency Amazon states for each kind of change. Effect-review needs the Manage Your Experiments method, the Business Reports definitions and the deal and coupon rules that confound a window.

Why a senior operator cares. On 2026-10-14 the research seats read the same Seller Central help pages by five different routes. Some seats read a page; others declared the same page "unreachable" or "behind sign-in". The verifiers then re-opened pages by yet other routes. As a result, rules Amazon states in plain text on a live page (the main-image rules, the deal rating floors, the search-terms "completely ignored" rule, the review-sharing list, the MYE statistics) were marked open or unverified in some files. A skill that calls a stated rule "unverified" under-flags a listing. A skill that treats a stale archive figure as current mis-flags one.

This file does three things:

1. It fixes one route, with a fallback order and a way to record a page's version.
2. It lists the page ids that some file still marks unread although they can be read.
3. It re-reads each of those pages once (2026-10-14) and hands the text over. The text is saved as one file per page under the office's capture folder (outside this repository)<page id>-v<version>.txt`. The decisive lines are quoted below, each with the file that owns the rule.

No other research file was edited.

## Amazon's own rules and guidance

### A. The route itself

A1. **Every help page at `https://sellercentral.amazon.com/help/hub/reference/external/<id>` is a JavaScript shell to a plain fetch.** On 2026-10-14 a plain `curl` of G23501 returned HTTP 200 with `<title>Amazon</title>` and no article text. The WebFetch tool on G1881 returned only navigation, a language selector, a seller promotion banner and footer links. [official] (Product image guide, https://sellercentral.amazon.com/help/hub/reference/external/G1881, read 2026-10-14; Use search terms effectively, https://sellercentral.amazon.com/help/hub/reference/external/G23501, read 2026-10-14)

A2. **The article body comes from the help hub's own content call.** The call is `POST https://sellercentral.amazon.com/help/hub/mons-api/GetHelpTopic` with JSON body `{"guid":"<id>","layer":"external","locale":"en-US"}` and no sign-in. The reply is JSON: `topic.content` (the HTML body), plus `topic.title`, `topic.guid` (canonical id), `topic.layer` (here `Published/US`), `topic.locale`, `topic.status` (`Live`), `topic.version`, `topic.revision`, `topic.hierarchyNode` (ancestors, siblings, children with titles) and `availableLocales`. The call is undocumented. One web search for "GetHelpTopic" found no Amazon or third-party page describing it. [official, as observed] (each page in *Pages read*; no documentation page exists to cite)

A3. **The call's own error texts.** These are Amazon's words and define the fallback triggers:
- Too fast: HTTP 400 `{"message":"Rate exceeded"}`. Seven of sixteen back-to-back calls got this; the same ids answered after a 2–3 second pause.
- Page not in this marketplace's layer: HTTP 400 `"AjudaCMSService returned a response but getContentWithHierarchy was empty for guid [G8841] for layers/locales [LayerAndLocale(layer=Published/US, locale=en-US)]","type":"HelpArticleNotFound"`.
- Malformed id: `"Value 'GG8841' at 'guid' failed to satisfy constraint: Member must satisfy regular expression pattern: G?([A-Z0-9]{15}|\d{1,9})"`.
- An id the hub does not serve as a topic: HTTP 200 `{"availableLocales":null,"topic":null}`. This was the answer for G201047930 and for 201047930.

[official, as observed]

A4. **Ids are canonicalised.** Per the pattern in A3, an id is an optional `G` followed by 15 alphanumerics or by up to nine digits. Two ids in the research files are 15-character ids that lost their leading `G`. The server read each as a bare 15-character id and returned the canonical id:
- `GW8U76SSNTRTBX7` → `GGW8U76SSNTRTBX7` (A+ content guidelines).
- `YZYA77YZTWTF7YZ` → `GYZYA77YZTWTF7YZ` (Create a listing experiment).

Amazon's own pages link the canonical forms. The MYE page links `/help/hub/reference/GGW8U76SSNTRTBX7`. [official] (Create a listing experiment, read 2026-10-14)

A5. **Other marketplaces use their own host and locale.** `POST https://sellercentral.amazon.co.uk/help/hub/mons-api/GetHelpTopic` with locale `en-GB` returned G23501 from layer `Published/GB` (version 9, revision 3). Its text differs from the US page (see C3). A US page is not the rule for another marketplace. [official] (Use search terms effectively (UK), https://sellercentral.amazon.co.uk/help/hub/reference/external/G23501, read 2026-10-14)

A6. **Archive copies.** `curl` of `https://web.archive.org/web/20211023012109id_/https://sellercentral.amazon.com/gp/help/external/10471` returned HTTP 200 with the 2021 text ("less than 250 bytes"). The WebFetch tool refuses the same URL ("Claude Code is unable to fetch from web.archive.org"). That is why some files call web.archive.org unreachable while search-terms.md read it: the difference is the tool, not the site. search-terms.md records that archive copies from 2023 onward are the same JavaScript shell. [official, archived] (Optimize your product discoverability, archived 2021-10-23, read 2026-10-14)

### B. Pages another file marks unread: read 2026-10-14

| Page id (canonical) | Page name (as shown) | Version / revision | Files that mark it unread or unreachable | Files that read it |
|---|---|---|---|---|
| G1881 | Product image guide | v28 / r9 | images-and-video, listing-writes, a-plus-content (cites only) | listing-policies |
| G202111490 | Amazon deals | v25 / r11 | seasonality-and-events | price-position |
| G202111590 | Understand deal fees | v27 / r0 | (fees cited by seasonality-and-events from practitioners) | price-position (fees) |
| G200390640 | Product detail page rules | v21 / r1 | description | listing-policies, bullet-points, title |
| G202024200 | Misleading and prohibited claims | v11 / r0 | description | listing-policies, bullet-points |
| G23501 | Use search terms effectively | v14 / r0 | listing-writes; search-terms (calls live page a shell) | funnel-and-search, listing-policies, title |
| G201047930 | (no topic served) | — | search-terms (treats as the live page) | — |
| GYTR6SYGFA5E3EQC | Product title requirements and guidelines | v21 / r2 | listing-writes, listing-content-and-health | title, funnel-and-search, listing-policies |
| GF2C2L6RCFZGWBXC | Keyword attributes explained | v4 / r1 | search-terms (live copy) | funnel-and-search |
| G10471 | Optimize your product discoverability | v13 / r1 | search-terms (live copy) | funnel-and-search, title |
| G1661 | Classify your products using Browse Tree Guides - BTG | v15 / r1 | attributes-and-browse-nodes | — |
| GGW8U76SSNTRTBX7 (cited as GW8U76SSNTRTBX7) | A+ content guidelines | v8 / r2 | a-plus-content | — |
| GTRP6DXEA983DPD6 | Frequently returned item badge | v6 / r0 | returns | — |
| GM2ADTH3XH3A5N57 | Prime Day readiness playbook | v4 / r8 | seasonality-and-events | — |
| G8841 | (About parent-child relationships, per variations.md) | not served | variations | — |
| G8831 | Variation relationships | v9 / r0 (a pointer page) | variations | — |
| GH3RMVV3ZDYRRQ5S | Product variations overview | v2 / r1 | variations | — |
| G201951410 | Variation relationship FAQ | v16 / r1 | variations | — |
| G74DLBUEHT5GY88C | Guidelines for reviews shared across product variations | v3 / r4 | variations | — |
| GYZYA77YZTWTF7YZ (cited as YZYA77YZTWTF7YZ) | Create a listing experiment | v13 / r3 | effect-measurement | — |
| GY6DCFA53HYDH79H | Experiment results | v4 / r0 | (not cited) | — |
| GVP453K5XRBJS7Y9 | Manage Your Experiments | v7 / r0 | (not cited) | — |
| G2BNMJ8NFCGZQVFH | Tips for experiments | v5 / r0 | (not cited) | — |
| G17781 | Error code explanations | v13 / r1 | listing-writes, listing-content-and-health, triggers | — |
| G37911 | Featured Offer | v19 / r0 (removed page) | triggers | — |
| G200418100 | Featured Offer eligibility | v23 / r0 (removed page) | — | funnel-and-search, price-position |
| G201687550 | Becoming the Featured Offer | v20 / r0 | — | price-position |
| G27691 | Business reports glossary | v7 / r1 | own-traffic-funnel | — |
| G200633570 | Business reports | v8 / r1 | triggers ("the Business Reports help page") | — |
| G28761 | Business Reports FAQ | v7 / r0 | triggers | — |
| G8J4CB5ZBF3NX7TP | Search Query Performance dashboard | v5 / r0 | search-rank-and-volume, paid-keywords (silent) | search-query-performance |
| G200898440 | Suppressed listings | v13 / r0 | listing-content-and-health | listing-policies |
| G200216080 | Add product images and video | v15 / r1 | images-and-video ("image standards") | — |
| GF6B8ZPNY2AP72VV | Amazon search glossary | v2 / r0 | (search-terms read 2022 archive only) | — |
| GHGHDMU4X5K9QGCV | My ASIN is unsearchable | v6 / r0 | (search-terms read 2022 archive only) | — |
| G200786710 | Listing quality | v5 / r1 | listing-content-and-health | — |
| GJHCPEFJ5JJQD52D | Coupon eligibility criteria | v14 / r0 | — | price-position (in substance) |
| G202183600 | Deals for events | v10 / r1 | — | — |
| GX5L8BF8GLMML6CX | Product bullet point requirements | v11 / r8 | — | listing-policies ("revision 8"), bullet-points |

All rows were read through the content call (A2), layer `Published/US`, locale `en-US`, on 2026-10-14. The one exception is the UK row in A5. Each text is saved under the office's capture folder (outside this repository)

The "Files that mark it unread" column records what each file said when this table was written. It is not a current list: in the reconciliation of 2026-10-14 each file was asked to replace an "unreachable" or "sign-in" claim for a captured page with the capture's text and its page name. The rule that holds for every file: **a page with a capture under the office's capture folder (outside this repository) was read on 2026-10-14**, whatever a plain fetch, WebFetch or a verifier's later attempt returned. G8841 and G201047930 have no capture; they are the only ids here that the content call did not serve.

Other seats saved captures to the same directory on 2026-10-14, by the same call. They are read pages too, and are listed here so that the directory is indexed in one place (page name, canonical id, version, saving seat as the capture's header gives it):
- listing-writes gap fill: Stop selling a product (G200216110 v9); Expand Offers Internationally (G200942970 v1); Managing Offers in Europe (G201394320 v2); Manage offers manually in Amazon Europe marketplaces (G201394330 v2); Listing Creation for Global Accounts (G201468480 v3); Pan-European FBA: How it Works (G201855460 v14, Published/GB, en-GB); Sales Rank FAQ (G202059240 v2); Build International Listings (G202121570 v14 US, and v13 Published/GB en-GB); Create a connection using Build International Listings (G202121580 v6); Build International Listings price rules (G202121610 v10); Edit target store settings (G202121650 v7); Resolve stranded inventory issues (GEYJTVJPWRYUTADQ v22); Sell Globally experience FAQ (GNFDSYQP7TR7SPUW v1); Warning code 18367: Product type modified by Amazon (GXMA2QU3JZTG8JNL v1).
- seller-central-only-tools gap fill: Seller Assistant - Seller Central's agentic assistant (GLYJTRGQCYNYAZS9 v12).

This file quotes none of those sixteen; their owning files do.

### C. The hand-off: what each page says, by owning file

Quotes are verbatim from the live US page on 2026-10-14 unless marked. RULE means Amazon says the thing is enforced: blocked, removed, suppressed or not indexed. GUIDANCE means Amazon recommends it.

**C1. Images (owner: elements/images-and-video.md; also listing-writes, a-plus-content).** Source: Product image guide, G1881 v28, unless noted.
- RULE: "Every product requires at least one compliant main image."
- RULE: "Images below 500 pixels on the longest side cannot be uploaded". The maximum is "10,000 pixels on the longest side".
- RULE: Formats are "JPEG (.jpg or .jpeg), TIFF (.tif or .tiff), PNG (.png), non-animated GIF (.gif)"; "JPEG recommended".
- RULE: Resolution "At least 72 dpi". Color mode "RGB" is marked "Preferred".
- GUIDANCE: "We recommend 1,000+ pixels for the best customer experience. Images with 1,000+ pixels on the longest side enable the zoom function."
- RULE (main image): "Show the product as 85% of the image."
- RULE (main image): "Have a pure white background (RGB color values: 255, 255, 255)".
- RULE (main image): "Only show the product once in the image" and "Show only one unit of the product and any accessories that are included with the product".
- RULE (main image): no props not included; no mannequin; "Show a single shoe, facing left, at a 45-degree angle (applies to all footwear)"; adult clothing "on a model", "standing".
- RULE (main image): "Only a limited number of product types are allowed to have a lifestyle image as a main image (with no text or extra logos)."
- RULE (all images): "No images of customer reviews, five-star imagery, claims (for example, free shipping), or selling partner-specific information"; "No text or pricing details (swatch image only)".
  - [seat] Read literally, "No text" applies to the swatch image only. The page does not bar infographic text on secondary images. images-and-video.md's seller-quoted version should be replaced by this wording.
- RULE (all images): "Match the product's title"; no Amazon logos or badges ("Amazon's Choice," … "Best seller," or "Top seller").
- RULE (enforcement): "If there is no main image that meets the requirements, we may temporarily remove the product listing from search until a compliant main image is provided." Also: "Images that fail to meet our product image requirements listed cannot be uploaded to our system or may be removed from search."
- RULE (AI people): images with photorealistic AI-generated people must carry the keyword `contains-synthetic-performer` in the `dc:subject` (XMP) field.
- Display is not guaranteed: "Uploading an image doesn't guarantee it will be displayed … We select and arrange images from multiple selling partners". Amazon "may also modify images that you submit".
- Latency: "If your image is selected for display, it can take up to 24 hours after you upload it to appear on the product detail page."
- GUIDANCE (count): "We recommend that you upload at least six additional images and one video."
- Variant codes: `MAIN`, `PT01–PT99`, `PS01–PS06` (safety), `SWCH`, `IN01–IN99`, angle codes, `INGR`, `EEGL`, `DTLS`.
- From Add product images and video, G200216080 v15: "Maximum 9 images are allowed" in the Edit images upload tab. "We recommend that you provide six images and one video." Video is "available only to brand-registered and non-brand-registered sellers who have been selling for three months or more."
  - [seat] So the help pages say 9 as an upload-tab cap. They do not say 8.
  - **Amazon's pages disagree on the image count.** Add product images and video (G200216080 v15) says "Maximum 9 images are allowed" in the upload tab. Product image guide (G1881 v28) lists the variant codes `PT01–PT99`, which are codes, not a per-listing count. The SP-API page "Submit media attributes" lists `MAIN` and `PT01`–`PT08`, while "Building Listings Management Workflows Guide" says "A main product image and up to nine secondary images" (both as quoted and cited in elements/images-and-video.md and method/listing-writes.md; not opened by this seat). This file does not choose among them. The binding count for a write is the image attributes in the product type's schema, read at run time with `getDefinitionsProductType` for the store's product type and marketplace; elements/images-and-video.md owns the rule.

**C2. Deals and coupons (owner: angles/seasonality-and-events.md; also price-position, reviews-and-qa).**
- RULE (seller): "To be eligible for deals, you must be a Professional seller with an overall rating of at least 3.5 stars." [Amazon deals, G202111490 v25]
- RULE (product): "Products must have a sales history on Amazon and at least a 4-star rating."
  - So there are two floors: 3.5 stars for the seller and 4 stars for the product. This settles seasonality-and-events OQ1 and corrects reviews-and-qa's practitioner "3 stars".
- RULE (product): For some products "such as clothing and shoes, at least 65% of variations should be included in the deal". Only new condition is eligible. A "validated reference price" is required. Seller-fulfilled deals need late shipment rate ≤ 4%, ODR ≤ 1%, pre-fulfillment cancellation ≤ 0.5%, and free shipping.
- RULE (access): "Amazon Deals is an invite-only program." "Eligible ASINs are refreshed every week". A Lightning Deal runs "usually 4 to 12" hours.
- GUIDANCE (during an upcoming deal): avoid price edits, closing listings and "creating or assigning new child ASINs to the variation family after the deal has been submitted". Doing so makes the deal "revalidate" and can suppress or cancel it.
  - This is a listing-change-log case: a variation change can cancel a scheduled deal.
- Fees [Understand deal fees, G202111590 v27]:
  - Non-peak: "Upfront fee: $70 per day, plus Variable fee: 1.0% of sales (capped at $2,000)".
  - Peak, "The 2026 rates for Prime Day, Prime Big Deal Days, Black Friday and Cyber Monday": "$100 per promotion, plus Variable fee: 1.5% of sales (capped at $5,000)".
  - Early-bird savings of $50 per deal.
  - Fees are on G202111590, not G202111490.
- Event deals [Deals for events, G202183600 v10]: the Max Price draws on, among other inputs, "The lowest sales price across all selling partners in the past 30 days" and "in the past 60 days". "Peak event prices are excluded from the 30-day and 60-day lookback windows once the event ends". "The date and time of your deal will be revealed in Seller Central at least one week before the deal is scheduled to run."
- Prime Day 2026 dates [Prime Day readiness playbook, GM2ADTH3XH3A5N57 v4]:
  - "March 24, 2026: Prime-Exclusive Best Deal and Lightning Deal submissions open".
  - "June 9, 2026: Deal scheduling for Prime-Exclusive Best Deals and Lightning Deals for Prime Day closes."
  - Lightning Deals "can run for up to 12 hours (or until sold out), as scheduled by us".
  - Prime Day fee "$100 per Lightning Deal plus 1.5% of sales (capped at $5,000)".
  - Prime Member Coupon Prime Day fee "$5 per coupon plus 2.5% of sales".
  - These are 2026 figures, dated.
- Coupons [Coupon eligibility criteria, GJHCPEFJ5JJQD52D v14]:
  - RULE (seller): "you must be a Professional seller with at least a 3.5 Seller feedback rating". "Sellers who haven't received any feedback rating yet are also eligible".
  - RULE (product): "Products with 1-4 reviews must have an average rating of at least 2.5 stars." "Products with 5+ reviews must have an average rating of at least 3 stars."
  - RULE (product): "Product discounts must be at least 5% below the Was Price or List Price".
  - Reviews from coupon purchases "may not always get the Amazon Verified Purchase badge".
  - This confirms price-position and settles whose 3.5 it is (seasonality-and-events): it is the seller's feedback rating.

**C3. Search terms and indexing (owner: elements/search-terms.md; also funnel-and-search, title, listing-writes, description, listing-content-and-health).**
- Live US Use search terms effectively, G23501 v14:
  - "Search terms are keywords that are used by the search engine for lexical matching between an ASIN and a query."
  - The tips say "Maintain the text length limit of search terms". The live US page states no byte figure.
  - "Amazon search does not count spaces or punctuation."
  - RULE: "Violating the rules below may result in your ASIN being suppressed". Prohibited: brand names, ASINs, profanity, temporary statements, subjective claims, offensive terms.
  - "Effective December 6, 2023, the Generic keyword field is required for the following 23 product types".
  - "Amazon may not use the search terms that you supply for any reason".
  - The live page is G23501. G201047930 is served as no topic (A3), so search-terms.md's "G201047930 is the live page" does not hold.
- Keyword attributes explained, GF2C2L6RCFZGWBXC v4, live:
  - The table gives `generic_keywords` length limit "249" bytes.
  - RULE: "Search Terms (generic_keywords) should be less than 250 bytes long … If it exceeds the limit, the attribute is completely ignored by Amazon Search. For other length limits in the table above, if limit exceeds, Amazon Search indexes up until the length limit and ignores any excess."
  - So the "completely ignored" rule is on a live Amazon page today, not only in a 2021 archive or in My Amazon Guy.
  - Other limits in the table: `item_type_keyword` 250, `style_keywords` 100, `subject_keywords` 210, `thesaurus_subject_keywords` 250. "platinum_keywords as they are now redundant".
- Optimize your product discoverability, G10471 v13:
  - "We limit the length of the Generic Keyword attribute to less than 250 bytes."
  - Keywords "are matched against information such as title and description that you provide for a product".
  - "We reserve the right to not use all supplied content from the product description, including bullet points, for retrieving products".
- UK, G23501 v9 en-GB (Published/GB):
  - "Amazon limits the length of the Search Terms attribute to less than 250 bytes."
  - "No. For the purpose of calculating the length of search terms, Amazon search does not count spaces or punctuation."
  - "If Search Terms are over the limit, none of the Search Terms for that ASIN will be indexed".
  - So the "spaces are counted in the UK" line in search-terms.md is the 2022 archive's wording. The current UK page says the opposite.
- **Amazon's sources disagree on the search-terms figure.** The help pages give "less than 250 bytes" (G10471 v13; UK G23501 v9) and "249" (GF2C2L6RCFZGWBXC v4), and the live US G23501 v14 gives no figure. The SP-API page "Listings Items API Issues Troubleshooting" lists "`generic_keyword`: 500 bytes", and third-party copies of product-type schemas carry `maxUtf8ByteLength` 250 or 2000 with `maxLength` 500 (both as quoted and cited in elements/search-terms.md; not opened by this seat). The help pages state an indexing limit; the schema states what a write accepts. Neither is picked here. The binding value for a write is the `generic_keyword` limit `getDefinitionsProductType` returns for the product type and marketplace, read at run time; elements/search-terms.md owns the rule.
- Amazon search glossary, GF6B8ZPNY2AP72VV v2 (live; search-terms read only the 2022 archive):
  - "It can take up to 72 hours for changes to new or existing ASINs to go live. Latency can be slower or faster".
  - "Amazon Search does not do partial matching."
  - Bullet points: "All bullet points together must be less than 1,000 characters … They are not always indexed by Amazon Search".
  - "Products must be assigned to at least one specific, relevant browse node in order to be searchable."
- My ASIN is unsearchable, GHGHDMU4X5K9QGCV v6 (live): five reasons: "Parent ASIN", "No Browse Node", "No Offer", "Future Launch Date", "Listing Quality". "Any changes to an ASIN's offer, browse node, launch date can take up to 72 hours to reflect in shopping results."
  - So the 72-hour figure is on two live Amazon help pages (Amazon search glossary and My ASIN is unsearchable), not only in a forum guide, as effect-measurement.md's verifier had it. Each page scopes it: the glossary to "changes to new or existing ASINs" with "Latency can be slower or faster", the unsearchable page to offer, browse node and launch-date changes. Neither page makes it a fixed wait for every edit.
- Description indexing (owner: description.md):
  - G10471, quoted above, names the description as matched content.
  - G1661 v15: "Keyword search will try to match the keywords to all the possible ASINs by looking at the ASIN's attributes (for example, title, bullet points, product description, and so on)".
  - description.md's "no Amazon page states that the description is indexed" is contradicted by two live pages.

**C4. Title and item highlights (owner: elements/title.md; also listing-policies, funnel-and-search, effect-measurement, listing-writes).** Source: Product title requirements and guidelines, GYTR6SYGFA5E3EQC v21, unless noted.
- RULE: "Titles must not exceed 75 characters, including spaces."
- Item highlights: "Item highlights provide an additional 125 characters". Also on Product detail page rules, G200390640 v21: "a character limit of 125 characters (including spaces)".
  - These are help-page figures for human readers. What a write accepts for the title and the item highlights attribute is the attribute's `maxLength` in the product type's schema, read at run time with `getDefinitionsProductType`, plus the `issues` Amazon returns.
- Latency: "the change is accepted immediately but can take 24 to 48 hours to be processed and displayed on Amazon stores, including search results and the product detail page … If your change doesn't appear after 48 hours, you can edit and resubmit it".
  - This is Amazon's own page. It is not a forum or SellerEngine figure, so effect-measurement's verifier and listing-writes are mistaken on the source.
- RULE (existing listings): "the title might be automatically corrected or it might not appear in our search results".
- **Amazon's pages disagree on the title length.** Suppressed listings, G200898440 v13 says "less than 80 characters for apparel, shoes, and luggage categories and 130 characters for all other categories". Product title requirements and guidelines (GYTR6SYGFA5E3EQC v21) and Product detail page rules (G200390640 v21) say 75. The SP-API pages "Listings Items API Issues Troubleshooting" and "Manage Listings Issues" give 200 for `item_name` (as quoted and cited in elements/title.md; not opened by this seat). All the help pages are live on the same day. This file does not choose by preference: the binding value for a write is `item_name`'s `maxLength` in `getDefinitionsProductType` for the product type and marketplace, read at run time, with the `issues` Amazon returns; elements/title.md owns how a review cites the title requirement.
- Tips for experiments, G2BNMJ8NFCGZQVFH v5 suggests testing "Reducing product title length to under 100 characters". This is an older idea list, not a rule.

**C5. Variations and review sharing (owner: elements/variations.md; also reviews-and-qa, competitor-set).**
- Variation relationship FAQ, G201951410 v16:
  - RULE: "variation families with more than 4,000 child ASINs cannot be displayed on the detail page".
  - RULE: "Once you have created a product with a selected variation theme, you cannot change it."
  - "The order of variations is populated automatically and cannot be changed."
  - "In most cases, variation families and reviews merge onto a single detail page in under 15 minutes. However, wait a full 24 hours before contacting Selling Partner Support".
  - On a display problem: "Wait about 15 minutes for changes to take effect".
  - "Existing ASINs may already have sales history and reviews … Using existing ASINs preserves this history and improves search relevancy."
- Product variations overview, GH3RMVV3ZDYRRQ5S v2 (the current page; G8831 v9 now only says "For the most up-to-date information, go to … Product variations overview"):
  - RULE: "Child ASINs with different non-varying attribute values cannot be grouped into a single variation family". The named non-varying attributes are item type keyword, model name, style, brand.
  - RULE: "Parent and child products within a variation family must be of the same product type and brand".
  - "We regularly review and update our valid variation themes for each product type".
- Guidelines for reviews shared across product variations, G74DLBUEHT5GY88C v3:
  - "Reviews are only shared when product variations have minor differences that don't impact the product's core functionality."
  - Shared: color or pattern; size and dimensions; pack size or quantity; scent (secondary); fitment.
  - Not shared: performance and power; home appliances (power by size); platform compatibility; model or generation; bundles and accessories; "Flavor, ingredients, or formulation"; scent (primary); fit or special sizes; material composition or finish; design differences; use-case or intended user.
  - Rollout: "You'll receive email notification 30 days before any changes affect your products." "If you have to update your variation themes after the change takes effect, reviews will be re-shared for eligible products."
  - This settles variations.md OQ3 and the disputed flavor heading.
- G8841 is not served in the US or GB layer (A3). The "About parent-child relationships" text is unreadable by this route. A children-per-parent limit is now on G201951410 (4,000 displayed), which settles variations.md OQ7 at the help-page level.

**C6. Manage Your Experiments (owner: method/effect-measurement.md; also bullet-points, images-and-video).**
- Create a listing experiment, GYZYA77YZTWTF7YZ v13:
  - "Experiments typically run for 8 to 10 weeks."
  - "To significance" ends "whenever there are statistically relevant results—in as little as four weeks"; it is "available for title, image, and bullet point experiments".
  - "Eight weeks is the recommended length for a set duration experiment."
  - Auto-publish: "Amazon will only publish the winning version if there is at least a 66% probability that it will perform better than any other tested version."
  - "ASINs with low traffic may not show up in the available ASINs list".
  - "Secondary image experiments are only available for ASINs with four or fewer child ASINs."
  - A title edit can opt into an A/B test ("Create A/B experiment on product name upon listing submission"). Amazon recommends opting out "during holiday seasons" for time-specific keywords.
- Experiment results, GY6DCFA53HYDH79H v4:
  - "Experiment results are updated once a week".
  - "We use a Bayesian approach to analyze experiment results". The result reports "the mean effect size (in terms of change in units) and the 95% confidence interval (also known as a credible interval)".
  - "Customers are randomly assigned … persistently for the duration of the experiment". "Visits to your page where a customer cannot be identified are not included".
  - Projected one-year impact is daily difference × 365 and "doesn't take into account seasonality".
- Manage Your Experiments, GVP453K5XRBJS7Y9 v7:
  - "(Note: Experiments do not impact search rankings)".
  - Six content types.
  - "high-traffic ASINs may get several dozen orders per week, or more".
  - "Only one experiment can be run on any particular ASIN at a time".
- Tips for experiments, G2BNMJ8NFCGZQVFH v5: "Don't check your results too frequently before an experiment ends: Interim results can be misleading."
- None of the four MYE help pages states an uplift percentage (their captures were searched for "%" and "percent": the only percentages are the 66% auto-publish threshold, probabilities, the 95% interval and the percentile wording). The uplift figures are on sell.amazon.com pages and they differ: "up to 20%" on "Test listing content with Manage Your Experiments | Sell on Amazon" and "up to 25%" on "Amazon Brand Registry | Sell on Amazon" (both as quoted and cited in method/effect-measurement.md; not opened by this seat). A file that calls the 20% figure an MYE help-page figure has the wrong page.

**C7. Featured Offer and Business Reports (owner: angles/own-traffic-funnel.md; also price-position, triggers, funnel-and-search, effect-measurement).**
- Featured Offer eligibility, G200418100 v23: "This page has been removed. As of September 2026, Amazon no longer maintains a seller eligibility requirement".
- Featured Offer, G37911 v19: "This page has been removed."
  - triggers.md's "Featured Offer eligibility tests" RULE is stale.
- Becoming the Featured Offer, G201687550 v20:
  - "Your Featured Offer percentage is calculated as the total number of page views in which your offer is featured divided by the total number of page views for your products."
  - "the Featured Offer is determined separately for each variation".
  - Not considered: "Customer reviews and star ratings", "Prime eligibility of the offer", "Fulfillment method".
  - These help pages define the Featured Offer percentage over page views. angles/own-traffic-funnel.md records that the Data Kiosk seller analytics `featureOfferPct` is defined over glance views in its own schema. They are two sources with two denominators; cx takes the definition from the source it reads and does not treat them as one series. angles/own-traffic-funnel.md owns the rule.
- Business reports glossary, G27691 v7:
  - "Featured Offer percentage: The percentage of page views where the Featured Offer … appeared".
  - "Unit Session Percentage … Calculated by dividing the number of units by the number of sessions".
  - "Sessions- Total: Visits to your Amazon product detail pages by a customer within a 24-hour period."
  - "When a child ASIN is visited, it does not also count as a visit to the parent ASIN."
  - A trap: "When viewing the 'Detail Page Sales and Traffic' report, page views are summed only for days when there was sales activity on the ASIN. When viewing the 'Detail Page Sales and Traffic by Child Item' report, page views are summed for the entire date range".
  - "Week: Seven days, from Sunday 00:00:00 to the following Saturday 23:59:59 PT."
  - "Same Week Last Year" uses ISO weeks.
- Business reports, G200633570 v8: "Data for these reports is generally available for up to two years." "Business reports will have a lag of 24 hours when compared to the real-time data."
- Business Reports FAQ, G28761 v7:
  - "The 'by date' reports are updated every hour with the data from the past few days … All other reports are updated daily and consist of data from the previous day … The data from the past week is shared by the end of each Sunday."
  - "Since March 29, 2022, Page views and Sessions metrics include mobile app and browser traffic".
  - This answers triggers.md's "information about data timing" for the Seller Central view only. The API report's timing is door.md's.

**C8. Search Query Performance (owner: angles/search-query-performance.md; also paid-keywords, search-rank-and-volume, own-traffic-funnel, funnel-and-search).** Source: Search Query Performance dashboard, G8J4CB5ZBF3NX7TP v5.
- "The search queries are selected based on their overall performance in search results, and includes organic and Sponsored Products originating from the search results page for all customers. It excludes traffic from widgets on the search page such as 'Top Rated' or 'New Arrivals.'"
- Brand view: "a maximum of 1000 query results".
- Query Detail view: "the top 10 ASINs for the selected search query".
- "we do not recommend comparing the metric names of data across different dashboards".
- Access: "only available to sellers who have a Brand Representative role".
- The page states no launch date, week definition or retention, and no cap on an ASIN view (the capture's only result caps are the Brand view's 1000 queries and the Query Detail view's top 10 ASINs).
- So the page is readable (capture `G8J4CB5ZBF3NX7TP-v5.txt`) and is not silent on sponsored results: a file that calls it unreachable, or says Amazon does not say whether SQP includes Sponsored Products, is out of date. The Search Catalog Performance schema's sponsored wording is a different source for a different report and is cited by its owners.

**C9. Returns badge (owner: angles/returns.md).** Source: Frequently returned item badge, GTRP6DXEA983DPD6 v6.
- "Your ASIN is determined to be a frequently returned ASIN by comparing your ASIN's return rate with the return rates of similar ASINs. The return rate is based on the number of units that were shipped, for which customers had initiated returns."
- Voice of the Customer gives "trailing 3-month and trailing 12-month return rates" and "the suggested return rate".
- "Amazon will be monitoring return rate and automatically remove the badge once return rate approaches the suggested return rate … may remove the badge earlier if we see a consistent downward trend".
- The page names no numeric threshold.

**C10. Errors, classification, A+, listing quality (owners: listing-writes, listing-content-and-health, attributes-and-browse-nodes, a-plus-content).**
- Error code explanations, G17781 v13: an example error "if you submit a product with a description that exceeds 1000 characters, this will result in an error in the processing report, and your product will not be included in the catalog". Per-error pages are its children (for example "Error 4000", "5000 Series Error Codes").
- Classify your products using Browse Tree Guides - BTG, G1661 v15:
  - "Amazon uses Item Type Keywords (used only for US MP) or recommended browse node (used for other MPs), Product Description, Bullet Points and other detail page elements to classify your products".
  - "If your product is not listed within a browse node, it will not be available in both search and browse results."
  - "High quality information in the three key product attributes (title, bullet points, and product description) is critical for a product's browse assignment."
- A+ content guidelines, GGW8U76SSNTRTBX7 v8:
  - "Do not mention awards received more than 2 years ago."
  - "A maximum of four quotes or endorsements is allowed".
  - "Comparison charts may only compare against other products owned by the same brand".
  - Environmental words "eco-friendly," "biodegradable," and "compostable" are "not allowed".
  - "Images and text must be unique to A+".
  - Images ".jpg, .bmp, and .png", "under 2 MB".
  - Time-sensitive words are barred, "permitted in the brand story section".
  - This settles a-plus-content OQ2 at the source.
- Listing quality, G200786710 v5: quality "is determined by seven key components: title, bullet points, attributes, images, video, A+ Content, and search optimization". The page points to the "Enhance" tab with "AI-generated suggestions".

## What practitioners add

None found on the narrow question of how Seller Central help pages are read. No practitioner page describes the help hub's content call. One web search for "GetHelpTopic" returned nothing relevant. search-terms.md records that SellerSprite cites a page "G201047930". The content call serves no topic for that id (A3); the SellerSprite page itself was not opened in this session.

Practitioner claims that the C sections overturn or confirm are listed under *Contradictions settled* in the summary returned to the office. They are not re-cited here.

## Published research

None applies. This file is about document access, not about search or conversion.

## Stable enough for a skill

- A Seller Central help page is cited by its title as shown, its canonical page id, and the version it was read at. The text may change by revision with no announcement. (Every page in *Pages read* carries a version number and a status.)
- Help-page figures are for human readers. Where a write is concerned, the binding limit is the product-type schema (`getDefinitionsProductType`) and the listing's `issues`, not the help page. Amazon's own pages disagree with each other on the title length, the search-terms limit and the image count (section C), which is why no help-page figure is carried by a skill. (Use search terms effectively and Keyword attributes explained state limits that differ from each other and from other marketplaces' pages; Suppressed listings and Product title requirements and guidelines state different title lengths; Product image guide: "Images that fail to meet technical requirements cannot be uploaded".)
- A US help page states the US rule. Another marketplace's page can differ. (Use search terms effectively, US and UK.)
- Amazon states a different display or indexing window for each kind of change, each on its own page: images, title and item highlights, offer / browse node / launch date, ASIN changes generally, and variation families. The windows are help-page text that changes by revision; the figures read on 2026-10-14 are in section C for human readers. A skill does not carry them: cx confirms a change by reading it back, and when it explains a delay to the seller it quotes the page by name and recorded version. (Product image guide; Product title requirements and guidelines; My ASIN is unsearchable; Amazon search glossary; Variation relationship FAQ)
- Manage Your Experiments randomises customers persistently, reports weekly, uses a Bayesian analysis, and does not affect search ranking. (Experiment results; Manage Your Experiments)
- Business Reports' Featured Offer percentage is a share of page views. (Business reports glossary; Becoming the Featured Offer)
- Business Reports' "Detail Page Sales and Traffic" sums page views only over days with sales. The "by Child Item" view sums over the whole range. (Business reports glossary)
- SQP counts organic and Sponsored Products results from the search results page and excludes widgets. (Search Query Performance dashboard)
- A deal needs both a seller rating floor and a product rating floor. A coupon needs a seller feedback floor and a product rating floor that depends on review count. (Amazon deals; Coupon eligibility criteria) The floors themselves are figures that can change. Cite the page.
- Search terms over the byte limit are ignored entirely, not truncated. (Keyword attributes explained; UK Use search terms effectively)

## What cx must read at run time

- The limit a write is validated against: `getDefinitionsProductType` (Product Type Definitions API). Never a help-page figure.
- Whether a submitted value passed: `putListingsItem` / `patchListingsItem` with `mode=VALIDATION_PREVIEW`, then the live `issues` from `getListingsItem` (Listings Items API).
- What Amazon displays after a change: `getCatalogItem` (Catalog Items API, `attributes` / `summaries`), read again after the page's stated window for that change type, not assumed. For report names and waits, see door.md (operation `createReport` / `getReport` / `getReportDocument`).
- A help page's current wording, when cx must justify a flag to the seller: the page by id, read through a signed-in browser seat where the box has one (`pi-web-access` is in the image but was not installed in the day-1 run). Otherwise cx names the page and the version recorded in this tree and says it was read on that date.
- Deal and coupon eligibility for a specific ASIN: the seller's Deals dashboard ("Eligible ASINs" refresh weekly) and coupon creation flow. No SP-API operation exposes them; cx asks the seller.
- MYE eligibility and results: the seller's Manage Your Experiments dashboard. No SP-API operation was found in this pass.

## Pages read

All read 2026-10-14. Unless marked, the route is POST `https://sellercentral.amazon.com/help/hub/mons-api/GetHelpTopic` (layer external, locale en-US), and the URL given is the page's public address.

| Page name | URL | Date read | What it gave |
|---|---|---|---|
| Product image guide | https://sellercentral.amazon.com/help/hub/reference/external/G1881 | 2026-10-14 | v28 r9; main-image rules, specs, variant codes, 24 h, suppression from search, AI-people tag |
| Product image guide (plain fetch and WebFetch) | same | 2026-10-14 | these two routes return only a JavaScript shell titled "Amazon"; the page itself was read by the content call (row above; capture `G1881-v28.txt`) |
| Add product images and video | https://sellercentral.amazon.com/help/hub/reference/external/G200216080 | 2026-10-14 | v15; "Maximum 9 images", six images and one video, 24 h, video eligibility |
| Amazon deals | https://sellercentral.amazon.com/help/hub/reference/external/G202111490 | 2026-10-14 | v25 r11; seller 3.5, product 4 stars and sales history, invite-only, 65% variations |
| Understand deal fees | https://sellercentral.amazon.com/help/hub/reference/external/G202111590 | 2026-10-14 | v27; $70/day + 1% cap $2,000; 2026 peak $100 + 1.5% cap $5,000 |
| Deals for events | https://sellercentral.amazon.com/help/hub/reference/external/G202183600 | 2026-10-14 | v10; Max Price inputs, 30/60-day lookback, one-week reveal |
| Prime Day readiness playbook | https://sellercentral.amazon.com/help/hub/reference/external/GM2ADTH3XH3A5N57 | 2026-10-14 | v4 r8; 2026 timeline and event fees |
| Coupon eligibility criteria | https://sellercentral.amazon.com/help/hub/reference/external/GJHCPEFJ5JJQD52D | 2026-10-14 | v14; seller 3.5 feedback, product 2.5/3 stars by review count, 5% discount |
| Product detail page rules | https://sellercentral.amazon.com/help/hub/reference/external/G200390640 | 2026-10-14 | v21 r1; 75-char titles, 125-char item highlights, edit policy |
| Misleading and prohibited claims | https://sellercentral.amazon.com/help/hub/reference/external/G202024200 | 2026-10-14 | v11; readable (text saved; owners already quote it) |
| Use search terms effectively | https://sellercentral.amazon.com/help/hub/reference/external/G23501 | 2026-10-14 | v14; lexical matching, no figure, spaces/punctuation not counted, 23 required PTs |
| Use search terms effectively (UK) | https://sellercentral.amazon.co.uk/help/hub/reference/external/G23501 | 2026-10-14 | v9 r3 Published/GB via the .co.uk content call; < 250 bytes; spaces not counted; none indexed if over |
| Use search terms effectively (plain fetch) | https://sellercentral.amazon.com/help/hub/reference/external/G23501 | 2026-10-14 | a plain fetch returns only a shell, `<title>Amazon</title>`; the page itself was read by the content call (row above; capture `G23501-v14.txt`) |
| G201047930 | https://sellercentral.amazon.com/help/hub/reference/external/G201047930 | 2026-10-14 | not served: the content call answers `topic: null` (also for 201047930); no capture exists |
| Keyword attributes explained | https://sellercentral.amazon.com/help/hub/reference/external/GF2C2L6RCFZGWBXC | 2026-10-14 | v4 r1; byte table, 249, "completely ignored" |
| Optimize your product discoverability | https://sellercentral.amazon.com/help/hub/reference/external/G10471 | 2026-10-14 | v13 r1; "less than 250 bytes", title and description matched |
| Optimize your product discoverability (archived 2021-10-23) | https://web.archive.org/web/20211023012109id_/https://sellercentral.amazon.com/gp/help/external/10471 | 2026-10-14 | read with curl: "less than 250 bytes"; WebFetch refused web.archive.org |
| Amazon search glossary | https://sellercentral.amazon.com/help/hub/reference/external/GF6B8ZPNY2AP72VV | 2026-10-14 | v2; 72 h latency, no partial matching, bullets < 1,000 chars and not always indexed |
| My ASIN is unsearchable | https://sellercentral.amazon.com/help/hub/reference/external/GHGHDMU4X5K9QGCV | 2026-10-14 | v6; five reasons, 72 h |
| Product title requirements and guidelines | https://sellercentral.amazon.com/help/hub/reference/external/GYTR6SYGFA5E3EQC | 2026-10-14 | v21 r2; 75 chars, 125-char item highlights, 24–48 h, auto-correct or not shown |
| Suppressed listings | https://sellercentral.amazon.com/help/hub/reference/external/G200898440 | 2026-10-14 | v13; older 80/130 wording, child-listing suppression list |
| Classify your products using Browse Tree Guides - BTG | https://sellercentral.amazon.com/help/hub/reference/external/G1661 | 2026-10-14 | v15 r1; ITK US-only; description and bullets used for classification and keyword search |
| A+ content guidelines | https://sellercentral.amazon.com/help/hub/reference/external/GGW8U76SSNTRTBX7 | 2026-10-14 | v8 r2; awards ≤ 2 years, four quotes, own-brand comparisons, eco words barred |
| Frequently returned item badge | https://sellercentral.amazon.com/help/hub/reference/external/GTRP6DXEA983DPD6 | 2026-10-14 | v6; comparison with similar ASINs, 3/12-month rates, removal |
| About parent-child relationships (G8841) | https://sellercentral.amazon.com/help/hub/reference/external/G8841 | 2026-10-14 | not served: `HelpArticleNotFound` in Published/US and Published/GB; no capture exists |
| Variation relationships | https://sellercentral.amazon.com/help/hub/reference/external/G8831 | 2026-10-14 | v9; pointer to Product variations overview |
| Product variations overview | https://sellercentral.amazon.com/help/hub/reference/external/GH3RMVV3ZDYRRQ5S | 2026-10-14 | v2 r1; non-varying attributes, same product type and brand |
| Variation relationship FAQ | https://sellercentral.amazon.com/help/hub/reference/external/G201951410 | 2026-10-14 | v16 r1; 4,000 children, theme unchangeable, 15 min / 24 h |
| Guidelines for reviews shared across product variations | https://sellercentral.amazon.com/help/hub/reference/external/G74DLBUEHT5GY88C | 2026-10-14 | v3 r4; shared / not-shared lists, 30-day email notice |
| Create a listing experiment | https://sellercentral.amazon.com/help/hub/reference/external/GYZYA77YZTWTF7YZ | 2026-10-14 | v13 r3; 8–10 weeks, four weeks, 66% auto-publish |
| Experiment results | https://sellercentral.amazon.com/help/hub/reference/external/GY6DCFA53HYDH79H | 2026-10-14 | v4; weekly, Bayesian, 95% interval, persistent randomisation |
| Manage Your Experiments | https://sellercentral.amazon.com/help/hub/reference/external/GVP453K5XRBJS7Y9 | 2026-10-14 | v7; no search-rank effect, six types, one experiment per ASIN |
| Tips for experiments | https://sellercentral.amazon.com/help/hub/reference/external/G2BNMJ8NFCGZQVFH | 2026-10-14 | v5; do not peek, run full duration |
| Error code explanations | https://sellercentral.amazon.com/help/hub/reference/external/G17781 | 2026-10-14 | v13 r1; error causes, 1,000-char description example |
| Featured Offer | https://sellercentral.amazon.com/help/hub/reference/external/G37911 | 2026-10-14 | v19; "This page has been removed." |
| Featured Offer eligibility | https://sellercentral.amazon.com/help/hub/reference/external/G200418100 | 2026-10-14 | v23; removed; "As of September 2026" no seller eligibility requirement |
| Becoming the Featured Offer | https://sellercentral.amazon.com/help/hub/reference/external/G201687550 | 2026-10-14 | v20; FO% over page views; per-variation; factors not considered |
| Business reports glossary | https://sellercentral.amazon.com/help/hub/reference/external/G27691 | 2026-10-14 | v7 r1; metric definitions, Week Sun–Sat PT, page-view summing trap |
| Business reports | https://sellercentral.amazon.com/help/hub/reference/external/G200633570 | 2026-10-14 | v8 r1; two years of data, 24 h lag |
| Business Reports FAQ | https://sellercentral.amazon.com/help/hub/reference/external/G28761 | 2026-10-14 | v7; update cadence, Sunday weekly data, app traffic since 2022-03-29 |
| Search Query Performance dashboard | https://sellercentral.amazon.com/help/hub/reference/external/G8J4CB5ZBF3NX7TP | 2026-10-14 | v5; organic + Sponsored Products, widgets excluded, 1,000 cap, top 10 |
| Listing quality | https://sellercentral.amazon.com/help/hub/reference/external/G200786710 | 2026-10-14 | v5 r1; seven components, Enhance tab |
| Product bullet point requirements | https://sellercentral.amazon.com/help/hub/reference/external/GX5L8BF8GLMML6CX | 2026-10-14 | v11 r8; readable (text saved; owners already quote it) |
| Web search "GetHelpTopic" sellercentral help hub mons-api | (search engine) | 2026-10-14 | no page documents the call |

## Open questions

1. **Is the content call allowed as a standing route?** It is undocumented. It needs no sign-in and is the call the page itself makes. In this session the permission layer allowed single `curl` calls and refused one scripted batch. effect-measurement.md's seat reports its permission layer refused the call outright, and seller-central-only-tools.md's seat had its second and third calls refused. Its standing use is for the office to rule; until then no further pages are fetched through it, and the captures under the office's capture folder (outside this repository) are the read text. *Settles it:* the office's ruling on whether research seats (and ever cx) may use it, or a permission rule that names it.
2. **G8841 ("About parent-child relationships").** `HelpArticleNotFound` in the US and GB layers. It may be retired or region-only. *Settles it:* a signed-in Seller Central read of the URL, or Amazon's own link to it from a live page. The hierarchy of G8831 lists no G8841.
3. **G201047930.** The call answers `topic: null`, which differs from `HelpArticleNotFound`. It may be an alias the browser redirects to G23501. *Settles it:* opening the URL in a browser seat and recording where it lands.
4. **What `version` and `revision` mean.** Both are returned. Files have quoted one or the other (title.md "version 21", listing-policies "revision 8" for the bullet page, which is version 11 revision 8). *Settles it:* not settleable from Amazon; this file records both as `v<version> r<revision>`.
5. **Image count for a write.** The help pages say "Maximum 9 images" (upload tab) and PT01–PT99 variant codes; the SP-API pages cited in elements/images-and-video.md say PT01–PT08 on one page and "up to nine secondary images" on another (C1). The binding count for an SP-API write is in the product-type schema. *Settles it:* `getDefinitionsProductType` for the seller's product type, read on the first real run.
6. **Whether the US live G23501 ever states a byte figure again.** Today it does not; G10471 and GF2C2L6RCFZGWBXC do. *Settles it:* the next re-read, comparing version numbers.

## Positions

1. **P-help-page-access-1.** A help page is cited by its title as shown, its canonical page id, its version and revision, the marketplace layer and the read date. A page id that drops its leading `G` (GW8U76SSNTRTBX7, YZYA77YZTWTF7YZ) is corrected to the canonical id. *Sources:* every page in *Pages read* (content call metadata); Create a listing experiment (links GGW8U76SSNTRTBX7).
2. **P-help-page-access-2.** A Seller Central help page is read first from its capture under the office's capture folder (outside this repository) Beyond the captures, the research route is this order, with route (1) used only once the office rules on it (open question 1):
   - (1) the help hub content call on the marketplace's own host, paced at least two seconds apart, retrying on "Rate exceeded";
   - (2) a signed-in browser seat for a page the call answers with `HelpArticleNotFound` or `topic: null`, or when the permission layer refuses the call;
   - (3) a dated Wayback `id_` copy fetched with `curl`, marked historical;
   - (4) Amazon staff quoting the page in Seller Forums, marked as a quotation.

   A plain fetch or WebFetch of the page URL is never evidence that a page is unreachable. *Sources:* Product image guide (WebFetch shell vs content call); Use search terms effectively (plain fetch shell); Optimize your product discoverability (archived; curl vs WebFetch).
3. **P-help-page-access-3.** No file may call a page "unreachable" or "behind sign-in" when a capture of it exists under the office's capture folder (outside this repository): such a page was read on 2026-10-14, and the file cites the capture's page name, id and version, whatever another route returned. For a page with no capture, a file says which routes it tried, and a plain fetch or WebFetch shell is not one that counts. *Sources:* the 37 US pages and one UK page in *Pages read* that route (1) served without sign-in; the sixteen further captures listed under table B.
4. **P-help-page-access-4.** A figure from an archive copy or another marketplace's page is never stated as the current US rule. The 2022 UK "counts spaces" wording is contradicted by the current UK page. *Sources:* Use search terms effectively (UK, live); Use search terms effectively (US, live).
5. **P-help-page-access-5.** cx confirms a change by reading it back, not by waiting a fixed figure. Amazon states a separate window per change type on separate help pages (images; title and item highlights; offer, browse node and launch date; ASIN changes generally; variation families), and those windows change with the page's revision. A skill carries no window figure; when cx explains a delay to the seller, it quotes the page for that change type by name and recorded version. *Sources:* Product image guide; Product title requirements and guidelines; My ASIN is unsearchable; Amazon search glossary; Variation relationship FAQ.
6. **P-help-page-access-6.** The binding limit for a write is the product-type schema and the listing's `issues`. Help-page figures are cited only to explain a flag to the seller. *Sources:* Keyword attributes explained; Use search terms effectively (US and UK disagree in wording); Product image guide ("cannot be uploaded").
7. **P-help-page-access-7.** cx does not depend on the undocumented content call at run time. When it must quote current policy to the seller, it reads the page in a signed-in browser seat or names the page and the version recorded in the tree. *Sources:* Web search "GetHelpTopic" (no documentation); Product image guide (the public URL is a shell).

**The seat's own (not for a skill)**

- [seat] Leave `version`/`revision` uninterpreted. A change in either between two reads is the cheapest signal that a page's text changed.
- [seat] A quarterly re-read of the 54 captures in the office's capture folder (outside this repository), diffed against the saved text, would keep the elements files honest at low cost. Whether that is a workflow or a person's job is the office's call.

## Verification

Gap fill 2026-10-14: 3 gaps filled, 0 left open (with 6 open questions recorded above).
- Gap 1(1), one route with fallback order and version recording: filled (A1–A6, P-help-page-access-1 to -3).
- Gap 1(2), the list of ids marked unread elsewhere: filled (table B). G8841 and G201047930 are not served by the content call (open questions 2–3).
- Gap 1(3), re-read once and hand over: filled (section C; texts under the office's capture folder (outside this repository)).

Adversarial re-check, same day. Every US page cited for a new claim (35 pages) was fetched a second time through the content call, 3 seconds apart, and each verbatim phrase quoted in section C (103 phrases) was searched for in the second copy's text after normalising curly quotes and whitespace. Result: 103 found, 0 missing. Every page returned the same version and revision as the first read. The UK G23501 page was re-fetched and its three quoted phrases were found. Two readings checked with care: the deal fees sit on Understand deal fees (G202111590), not on Amazon deals (G202111490), so a file citing G202111490 for the fees cites the wrong page; and the "No text" bar on G1881 is qualified "(swatch image only)", so the file does not report a text ban on all secondary images. Not re-checked: G202024200 and GX5L8BF8GLMML6CX, which this file only lists as readable and does not quote.

Reconciled 2026-10-14 (against the critics' contradiction list; quotes re-checked in the captures under the office's capture folder (outside this repository), no page fetched):
- Table B: added that its "marks unread" column is a snapshot, the rule that a captured page was read on 2026-10-14, and an index of the sixteen captures other seats saved (listing-writes and seller-central-only-tools gap fills).
- C1: Amazon's pages disagree on the image count ("Maximum 9" upload tab; PT01–PT99 codes; PT01–PT08 on "Submit media attributes"; "up to nine secondary" on the Building guide). Named all four; binding count read at run time from `getDefinitionsProductType`. Removed the seat line that made PT01–PT08 the binding count.
- C3: Amazon's sources disagree on the search-terms figure (help pages "less than 250" / "249"; troubleshooting page "500 bytes"; schema copies 250 / 2000 bytes, 500 characters). Named them; binding value read at run time from `getDefinitionsProductType`. Recorded that the 72-hour figure is on two live Amazon help pages (Amazon search glossary; My ASIN is unsearchable), each scoped, against effect-measurement.md's verifier's "forum guide".
- C4: replaced "the 75 rule is the current one" with a plain statement that Suppressed listings (80/130), the title and detail-page rules (75) and the SP-API issue pages (200) disagree, binding value `item_name` `maxLength` read at run time; item highlights' 125 marked as help-page text, binding value from the schema. The 24-to-48-hour quote was re-found in the GYTR6SYGFA5E3EQC v21 capture (three places).
- C6: MYE uplift: the four MYE help-page captures carry no uplift percentage (searched); the 20% and 25% figures are on two sell.amazon.com pages, named.
- C7: noted the page-views (help pages) versus glance-views (Data Kiosk `featureOfferPct`, per own-traffic-funnel.md) denominators as two sources, not one series.
- C8: the SQP page states no ASIN-view cap; a file calling the page unreachable or Amazon silent on Sponsored Products is out of date.
- Stable enough for a skill and P-help-page-access-5: removed the latency figures (24 h, 24–48 h, 72 h, 15 min); cx reads a change back and quotes the page by name and version. The help-page-figure line now names the three subjects on which Amazon's pages disagree.
- P-help-page-access-2 and -3, open question 1: the content call's standing use is for the office to rule; until then the captures are the read text and no further page is fetched through it. P-3 now keys "read" to the existence of a capture.
- *Pages read*: the plain-fetch and WebFetch rows no longer say "unreachable"; they name the capture by which the page was read. G8841 and G201047930 are "not served", with no capture.
- Seat note: "~40 pages" corrected to the 54 captures.
- Not changed here, other files are the wrong ones (per the captures): reachability claims for G1881, G202111490, G200390640, G202024200, G23501, GYTR6SYGFA5E3EQC and G8J4CB5ZBF3NX7TP in images-and-video, listing-writes, seasonality-and-events, description, search-terms, search-rank-and-volume, a-plus-content, attributes-and-browse-nodes and variations; description.md on description indexing; search-terms.md on G201047930 as the live page and UK spaces; triggers.md on Featured Offer eligibility; seasonality-and-events.md on whose deal and coupon floor; effect-measurement.md and listing-writes.md on the source of the 24–48 h figure; paid-keywords.md on SQP and sponsored results.
