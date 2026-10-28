# The Featured Offer: how Amazon picks it, how to read who holds it and why not, and which causes a listing write reaches

Read 2026-10-28 for the `featured-offer` skill. It gathers what the four angle files already hold on the Featured Offer (`angles/price-position.md`, `angles/offer-competition-and-hijackers.md`, `angles/inventory-and-fulfillment.md`, `angles/account-health.md`) and adds the facts none of them holds: the Support API, the fields of the Featured Offer expected price (FOEP) reply, the batch sizes of the offer reads, and which causes of a lost Featured Offer a Listings Items write reaches.

## What this covers

- How Amazon picks the Featured Offer in the US store today, as its own page states it.
- How a seller's offer is read as featured or not, and why not, from Amazon's replies and Keepa's history.
- Which causes a `patchListingsItem` reaches, and which sit where no SP-API operation reaches.
- The Support API: what it reads, and that it opens nothing.

Out of scope: what to do when the Featured Offer is lost. That is the seller's standing instruction, written by a template, not a skill.

The OpenAPI models are read at commit `3677bb9d96f4450e6843f1f8207005e925d5c867` of `amzn/selling-partner-api-models`, the commit the `cx-amazon-sp-api` door names. Seller Central help pages are read only from the captures of 2026-10-14 (`method/help-page-access.md`).

## Amazon's own rules and guidance

### A. How Amazon picks the Featured Offer (US)

- The Featured Offer is "the offer that appears with Add to Cart / Buy Now buttons", chosen by "evaluating all offers to determine which is the most attractive for the customer", and where none is clearly better it "could be a rotation of the best offers". [official] (Becoming the Featured Offer, G201687550 v20, capture `G201687550-v20.txt`, read 2026-10-14)
- "As of September 2026, Amazon no longer maintains a seller eligibility requirement, and offers from all sellers are now eligible to be evaluated for the Featured Offer." Amazon "will not feature any offer if none of the available offers meet our customer experience requirements, even if the product has only one available offer". [official] (same capture). The rollout outside the US runs to the end of 2026 (`angles/price-position.md` A).
- Ranked: total price (item plus shipping), the delivery promise, free shipping, free returns, and seller performance (order volume, chargeback rate, Voice of the Customer complaints). Not ranked: the seller's reviews and star rating, and, "if all other factors are equal", Prime eligibility and fulfilment method. Amazon ranks "the same way for every product, and we never use manual overrides". [official] (same capture)
- "Offers must be shippable to the customer to become featured." "Your offer can't become featured if you're out of stock." The Featured Offer "is determined separately for each variation", and differs by shipping location and Prime membership. [official] (same capture)

### B. Reading who holds it, and why not

- **`getItemOffersBatch`** (v0) takes up to 20 item requests (`ItemOffersRequestList` `maxItems` 20); each `getItemOffers` reply carries `IsBuyBoxWinner` and `MyOffer` per offer, and "up to two Buy Box winners", Prime and non-Prime. [official] (productPricingV0.json at the pin)
- **`getFeaturedOfferExpectedPriceBatch`** (v2022-05-01) takes "up to 40 requests", each by `marketplaceId` and `sku` (and optional `segment`). Each result carries:
  - `featuredOfferExpectedPrice`, "The item price at or below which the target offer may be featured";
  - `resultStatus`, "Possible values include `VALID_FOEP`, `NO_COMPETING_OFFER`, `OFFER_NOT_ELIGIBLE`, `OFFER_NOT_FOUND`, and `ASIN_NOT_ELIGIBLE`. Additional values might be added in the future.";
  - `currentFeaturedOffer`, "The offer that is currently the featured offer. If the target offer is not currently featured, then this property will be equal to `competingFeaturedOffer`.";
  - `competingFeaturedOffer`, "The offer that will likely be the featured offer if the target offer is priced above its FOEP".

  Each offer's `offerIdentifier` has `sellerId`, `asin`, `fulfillmentType` and `sku`, which "will only be present for the target offer, which belongs to the requesting seller". The operation says "Featured offer is not guaranteed because competing offers might change. Other offers might be featured based on factors such as fulfillment capabilities to a specific customer." [official] (productPricing_2022-05-01.json at the pin)
- **`getCompetitiveSummary`** takes up to 20 requests (`CompetitiveSummaryRequestList` `maxItems` 20). [official] (productPricing_2022-05-01.json at the pin). Its segments and promotions are in `angles/price-position.md` E.
- **Default rates** are in each operation's Usage Plan table in the model and in `x-amzn-RateLimit-Limit` (`method/sp-api-access.md`, P-sp-api-access-11).
- **FBM offer-level deactivation.** "Starting August 31, 2026, if any of your FBM offers put your Account Health at risk, we'll temporarily deactivate that offer." [official] (Review Account Health updates for FBM offers, News_Amazon; as recorded in `angles/account-health.md` B6)
- **Keepa's history:** `buyBoxSellerIdHistory` ("-1" none qualified, "-2" "a brand new one"), `stats.buyBoxIsAmazon`, offers' `isAmazon`, and `stats.buyBoxStats` per seller (`percentageWon`, "an approximation"). [official] (Keepa Product.java; Stats.java; as recorded in `angles/offer-competition-and-hijackers.md`)

### C. Which causes a Listings Items write reaches

- **Price.** Price lives in `purchasable_offer` (`our_price`, `discounted_price`, `minimum_seller_allowed_price`, `maximum_seller_allowed_price`), changed with `patchListingsItem` `op` `merge` on a sub-attribute. [official] (Manage purchasable offer; `angles/price-position.md` F)
- **Price against the seller's own band.** Pricing Health lists offers deactivated for potential pricing errors, such as "your offer price is lower than the minimum price that you previously set", apart from offers live but ineligible on price. The preview names the band breach (`19037`, `19038`) and the potential high pricing error (`18701`) as `ERROR`, and `100708` "Not eligible to be the Featured Offer due to uncompetitive price" as a `WARNING` with the update accepted. [official] (Pricing Health; Manage Listings Issues; `angles/price-position.md` B and F)
- **Seller-fulfilled quantity and handling time.** `fulfillment_availability` is keyed by `fulfillment_channel_code`; the MFN record carries `quantity` and `lead_time_to_ship_max_days`, and a `merge` can change `quantity` alone. "`quantity` information is supported for MFN fulfillment, but not for Fulfillment by Amazon (FBA) fulfillment." [official] (Manage Amazon Haul, Advanced Multiple-Offer, and Multiple-Fulfillment Use Cases; Merge a listing; `angles/inventory-and-fulfillment.md` H4–H5)
- **Attributes an issue names.** `getListingsItem` `issues` name the attribute and the code; a write is previewed with `mode=VALIDATION_PREVIEW` (`method/listing-writes.md`).

### D. Which causes no SP-API operation reaches

- **FBA stock.** Fulfillable FBA units are units at Amazon (`angles/inventory-and-fulfillment.md` B); a listing write carries no FBA quantity (C above).
- **Account health and policy.** Appeals and reinstatement go through Account Health in Seller Central, and Product Policy Compliance, Performance Notifications and Manage Your Compliance have no read through the connection. [official] (`angles/account-health.md` F; P-account-health-12)
- **Other sellers' offers.** Counterfeit and IP reports go through the Brand Registry portal's Report a Violation, and inaccurate-listing reports through Report Abuse in Account Health; neither has an API. [official] (`angles/offer-competition-and-hijackers.md` E; P-offer-competition-and-hijackers-9)
- **Amazon's own choice.** Amazon may feature no offer, and Amazon retail may hold it (`angles/vendor-and-hybrid.md`, P-vendor-and-hybrid-3).
- **A price found off Amazon.** The competitive price threshold is a price "recently found at another reputable retailer outside the Amazon store"; Amazon does not name the retailer, and a seller disputes an outdated one through a self-service case. [official] (Pricing Health; `angles/price-position.md` B)

### E. The Support API

- The Support API (v2025-02-01) "provides programmatic access to information about Selling Partner support". Its model has three operations: `listCases` (`POST /support/2025-02-01/cases`, a search by `caseFilters`, `marketplaceId`, `maxResults`, `nextToken`, `sortField`, `sortOrder`), `getCase` (`GET …/cases/{caseId}`) and `listContacts` (`GET …/cases/{caseId}/contacts`). None creates, answers or closes a case. [official] (support_2025-02-01.json at the pin)
- The page: "You can list a selling partner's support cases, retrieve the details and status of a specific case, and review the full history of contacts (email, phone, and chat communications) exchanged with Amazon support". Availability "Sellers only"; sandbox "Static"; each operation in NA, EU and FE needs "Selling Partner Support (Restricted)". [official] (Support API, https://developer-docs.amazon/sp-api/docs/support-api.md, updatedAt 2026-09-30, read 2026-10-28)
- A case's status is `RESOLVED`, `TRANSFERRED`, `PENDING_MERCHANT_ACTION` or `PENDING_AMAZON_ACTION`. [official] (Retrieve and review selling partner support cases, …/retrieve-review-support-cases.md, read 2026-10-28)
- The routes Amazon's help pages name for a case are Seller Central's: the self-service case that disputes an outdated competitive price (Pricing Health), and "contact Selling Partner Support" for a manipulated variation family (Variation relationship FAQ, G201951410 v16, capture `G201951410-v16.txt`). [official]

## What practitioners add

Nothing new here: the practitioner material is in the four angle files.

## Stable enough for a skill

Sections A–E, each fact cited to its position below or to the angle file's.

## What cx must read at run time

- The store's own Becoming the Featured Offer page outside the US, for whether the seller eligibility gate is gone there (P-price-position-3).
- Each operation's current rate from the reply header (P-sp-api-access-11).
- Whether the connection's application has the Selling Partner Support (Restricted) role, from Amazon's answer to a Support API call.

## Pages read

| Page name | URL | updatedAt or version | Date read | What it gave |
|---|---|---|---|---|
| Support API | https://developer-docs.amazon/sp-api/docs/support-api.md | 2026-09-30 | 2026-10-28 | What it reads, availability, sandbox, the role and regions of each operation |
| Retrieve and review selling partner support cases | https://developer-docs.amazon/sp-api/docs/retrieve-review-support-cases.md | — | 2026-10-28 | Case status values |
| Retrieve the contact history for a support case | https://developer-docs.amazon/sp-api/docs/retrieve-contact-history-support-case.md | — | 2026-10-28 | Contact channels; attachment links expire after 15 minutes |
| support_2025-02-01.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/3677bb9d96f4450e6843f1f8207005e925d5c867/models/support-api-model/support_2025-02-01.json | pin | 2026-10-28 | The three operations and the list request's fields |
| productPricingV0.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/3677bb9d96f4450e6843f1f8207005e925d5c867/models/product-pricing-api-model/productPricingV0.json | pin | 2026-10-28 | `getItemOffersBatch` size and Usage Plan |
| productPricing_2022-05-01.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/3677bb9d96f4450e6843f1f8207005e925d5c867/models/product-pricing-api-model/productPricing_2022-05-01.json | pin | 2026-10-28 | FOEP request and result fields, `offerIdentifier`, batch sizes |
| Becoming the Featured Offer | https://sellercentral.amazon.com/help/hub/reference/external/G201687550 | v20 | 2026-10-14 (capture) | Section A |
| Variation relationship FAQ | https://sellercentral.amazon.com/help/hub/reference/external/G201951410 | v16 | 2026-10-14 (capture) | "contact Selling Partner Support" |

## Open questions

1. Whether a corrected price, or a widened minimum and maximum, brings an offer deactivated for a potential pricing error back by itself, or needs a step in Pricing Health. Pricing Health has no capture in the 2026-10-14 set. *Settle:* the read-back of `summaries[].status` after a sandbox-free correction, or the page's capture.
2. Whether the GL application holds the Selling Partner Support (Restricted) role. *Settle:* the seller's Developer Central page, or the answer to one `listCases`.
3. The capture of Becoming the Featured Offer is of 2026-10-14. *Settle:* a fresh capture before the skill is next revised.

## Positions

- **P-featured-offer-1.** The Support API v2025-02-01 has three operations, `listCases` (a POST search), `getCase` and `listContacts`; none opens, answers or closes a case. Sources: support_2025-02-01.json; Support API.
- **P-featured-offer-2.** Each Support API operation needs the restricted role Selling Partner Support, is for sellers only, and runs in NA, EU and FE; its sandbox is static. Sources: Support API.
- **P-featured-offer-3.** A support case's status is `RESOLVED`, `TRANSFERRED`, `PENDING_MERCHANT_ACTION` or `PENDING_AMAZON_ACTION`, and a case's contacts carry email, phone and chat history. Sources: Retrieve and review selling partner support cases; Retrieve the contact history for a support case.
- **P-featured-offer-4.** The case routes Amazon's help pages name are in Seller Central: Pricing Health's self-service case for an outdated competitive price, and Selling Partner Support for a manipulated variation family. Sources: Pricing Health; Variation relationship FAQ.
- **P-featured-offer-5.** A FOEP result carries the expected price, a `resultStatus` that may take values beyond the five listed, the current featured offer and the competing one; the current equals the competing one when the target offer is not featured, and only the requester's own offer carries a `sku`. Sources: productPricing_2022-05-01.json.
- **P-featured-offer-6.** `getFeaturedOfferExpectedPriceBatch` takes up to 40 requests by SKU, `getItemOffersBatch` and `getCompetitiveSummary` up to 20 by ASIN, and each operation's default rate is in its Usage Plan table. Sources: productPricing_2022-05-01.json; productPricingV0.json.
- **P-featured-offer-7.** A Listings Items patch reaches the price and the seller's minimum and maximum (`purchasable_offer`), the seller-fulfilled quantity and handling time (`fulfillment_availability`, MFN record), and the attributes an issue names; it carries no FBA quantity. Sources: Manage purchasable offer; Manage Amazon Haul, Advanced Multiple-Offer, and Multiple-Fulfillment Use Cases; Merge a listing; Manage Listings Issues.
- **P-featured-offer-8.** No SP-API operation restocks FBA, files an account-health or policy appeal, uploads a compliance document, reports another seller's offer through Brand Registry, or chooses the Featured Offer; those are in Seller Central, in the Brand Registry portal, or Amazon's. Sources: Account health rating; Appeal an account deactivation or listing removal; Report a Violation: all reports in one place; Becoming the Featured Offer; FBA Inventory API.
- **P-featured-offer-9.** The competitive price threshold is a price found at a retailer outside Amazon that Amazon does not name, and an outdated one is disputed through a self-service case. Sources: Pricing Health.
- **P-featured-offer-10.** Since 2026-08-31 an FBM offer that puts account health at risk is deactivated on its own, after a warning email, while the account stays in good standing, and shows under Other Policy Violations. Sources: Review Account Health updates for FBM offers.
- **P-featured-offer-11.** A `getItemOffers` reply marks each offer's `IsBuyBoxWinner`, `IsFeaturedMerchant` and, for the seller's own, `MyOffer`, and there can be two Buy Box winners at a time per ASIN, one eligible for Prime and one not. Sources: productPricingV0.json.

## Verification

Checked 2026-10-28 by the research seat. Every quotation in sections B and E was string-matched against the model files at the pin (parsed with `jq`) and the developer pages fetched in `.md` form this session; every quotation in section A against the capture `G201687550-v20.txt`; the "contact Selling Partner Support" line against `G201951410-v16.txt`. Sections C and D quote the angle files, whose own verification stands. The downloaded files were deleted at the end of the session.
