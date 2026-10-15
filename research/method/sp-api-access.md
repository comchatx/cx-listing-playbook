# SP-API access: the seller's own id, its stores, roles, restricted data, usage plans and grantless calls

Read 2026-10-14 by the research seat. Tags: [official] Amazon's own page or document; [opinion] a named practitioner; [research] published research; [seat] the seat's own reasoning, never a skill position.

## What this covers

Funnel stage: none. This is a method file. It decides whether a read happens at all, so it sits under every stage.

It feeds all three skills and the report script:

- **listing-review.** Both Listings Items paths carry `{sellerId}`. A listing read needs that id, the right marketplace id and a role that opens the operation.
- **listing-change-log.** A change's request and receipt id are only good evidence if cx can tell a role refusal or a throttle from a listing problem.
- **effect-review.** Its inputs are Brand Analytics reports, Data Kiosk datasets, Business Reports and Pricing. Each sits behind a different role, and some also need Brand Registry. A verdict of "cannot tell" has to name the missing access, not invent a figure.
- **The report script.** Create, poll and download are Reports API operations. Each is rate-limited, and a report type's role decides whether `createReport` is accepted.

Why a senior operator cares: on this line's first two runs (internal reports 2026-10-13 and 2026-10-14), cx spent quota guessing, told the seller "the application has no Sellers role" after a 403 on a path that does not exist, and finally took the seller's own id from Keepa's Buy Box seller. That id is right only while the seller holds the Buy Box. An operator would not accept a listing diagnosis built on a misread 403 or a borrowed id.

The SP-API door's own reference (`door.md`) owns token steps, the two door headers, report names, options and waits. This file states what Amazon says about access and points to `door.md` for the door's mechanics.

## Amazon's own rules and guidance

### A. The seller's stores: the Sellers API

A1. RULE. The Sellers API v1 has two paths: `GET /sellers/v1/marketplaceParticipations` (`getMarketplaceParticipations`) and `GET /sellers/v1/account` (`getAccount`). [official] (sellers.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/sellers-api-model/sellers.json, read 2026-10-14)

A2. RULE. `getMarketplaceParticipations` "Returns a list of marketplaces where the seller can list items and information about the seller's participation in those marketplaces."
- Each element has `marketplace`, `participation` and `storeName` ("The name of the seller's store as displayed in the marketplace").
- `marketplace` carries `id` ("The encrypted marketplace value."), `name`, `countryCode`, `defaultCurrencyCode`, `defaultLanguageCode` and `domainName`.
- `participation` carries `isParticipating` ("If `true`, the seller participates in the marketplace") and `hasSuspendedListings` ("`true` if the seller Listing Status is set to Inactive, otherwise `false`").
- No field in either reply is a seller id.

[official] (sellers.json, read 2026-10-14; getMarketplaceParticipations reference, https://developer-docs.amazon/sp-api/reference/getmarketplaceparticipations.md, updatedAt 2026-09-10, read 2026-10-14)

A3. RULE. `getAccount` returns `marketplaceParticipationList`, `businessType`, `sellingPlan` (`PROFESSIONAL` / `INDIVIDUAL`), `business` and `primaryContact`. It carries no seller id either. "The `getAccount` operation is only available in the Amazon EU store." The role mapping lists its region as "EU". [official] (sellers.json; Get the account information of a seller, https://developer-docs.amazon/sp-api/docs/get-account-information-eu-seller.md, read 2026-10-14; Sellers API, https://developer-docs.amazon/sp-api/docs/sellers-api.md, read 2026-10-14)

A4. Timeline. Release notes: August 14, 2024, "Added the `getAccount` operation to retrieve information about seller accounts". December 18, 2024, `MarketplaceParticipationList` replaced `MarketplaceLevelAttributes`, `sellingPlan` moved to the root, and "The `getAccount` operation requires the Account Information Service Provider (AISP) role". [official] (SP-API Release Notes, https://developer-docs.amazon/sp-api/docs/sp-api-release-notes.md, updatedAt 2026-10-01, read 2026-10-14)

A5. Amazon's pages disagree on `getAccount`'s role. The role mapping lists Account Information Service Provider **or** Finance and Accounting (Role Mappings for SP-API Operations; Sellers API page). The use-case page's prerequisites name only Finance and Accounting. The December 2024 release note names only AISP. [official] (same three pages, read 2026-10-14)

A6. RULE. `getMarketplaceParticipations` roles, any one of which is enough:
- in every region: **Product Listing** or **Selling Partner Insights**;
- FE only: Amazon Fulfillment, Buyer Communication, Finance and Accounting, Inventory and Order Tracking, Pricing, Direct to Consumer Shipping (Restricted).

The use-case page names Selling Partner Insights. [official] (Role Mappings for SP-API Operations, https://developer-docs.amazon/sp-api/docs/role-mappings.md, updatedAt 2026-10-13, read 2026-10-14; Get the market participation of a seller, https://developer-docs.amazon/sp-api/docs/get-seller-market-participation.md, read 2026-10-14)

A7. GUIDANCE. Amazon's troubleshooting steps say: "If the API is supported in the given Amazon store, use the `getMarketplaceParticipations` operation to determine whether the seller's account is correctly configured for that Amazon store." The page lists three response texts that call for verifying the account or re-authorizing: "The seller is not registered in the marketplace", "The seller's account is suspended" and "The seller has not completed marketplace-specific requirements". Its prerequisites tell a developer to log "Seller ID" and "Marketplace ID" with every request. [official] (Troubleshoot SP-API Errors, https://developer-docs.amazon/sp-api/docs/troubleshoot-sp-api-errors.md, read 2026-10-14)

A8. Default usage plan for both Sellers operations: rate 0.016 requests a second, burst 15. Amazon calls these default values. The figure lives in the model and the `x-amzn-RateLimit-Limit` header (see F4). [official] (sellers.json, read 2026-10-14)

A9. Marketplace ids are public constants, listed by Amazon per region; for example United States `ATVPDKIKX0DER`. [official] (Marketplace IDs, https://developer-docs.amazon/sp-api/docs/marketplace-ids.md, updatedAt 2026-09-30, read 2026-10-14)

### B. The seller's own id

B1. RULE. Every Listings Items path takes `sellerId` as a required path parameter: "A selling partner identifier, such as a merchant account or vendor code." This covers `getListingsItem`, `putListingsItem`, `patchListingsItem`, `deleteListingsItem` and `searchListingsItems`. `searchCatalogItems` takes an optional `sellerId`, "Required when `identifiersType` is `SKU`". `getDefinitionsProductType` takes an optional `sellerId` that fills in "seller-specific requirements and values". [official] (listingsItems_2021-08-01.json; catalogItems_2022-04-01.json; definitionsProductTypes_2020-09-01.json, all at https://github.com/amzn/selling-partner-api-models/tree/main/models, read 2026-10-14)

B2. RULE. Amazon hands the id over at authorization. In the website workflow, the log-in URI and the redirect URI both carry `selling_partner_id`, "The identifier of the selling partner who authorized your application". Amazon tells the application to "Securely store the `selling_partner_id` if your application needs to track or manage selling partner-specific data". [official] (Website Authorization Workflow, https://developer-docs.amazon/sp-api/docs/website-authorization-workflow.md, updatedAt 2026-09-09, read 2026-10-14)

B3. Self-authorization of a private application shows a refresh token in Seller Central or the Solution Provider Portal. The page describes no `selling_partner_id` handed back. "For selling partner accounts that are merged with accounts in other regions: The **Authorize app** button appears for each of your merged accounts." [official] (Authorize Private Applications, https://developer-docs.amazon/sp-api/docs/self-authorization.md, read 2026-10-14)

B4. The id is per regional account: "Different Amazon store-specific selling partner accounts have different seller IDs." [official] (Usage Plans and Rate Limits, https://developer-docs.amazon/sp-api/docs/usage-plans-and-rate-limits.md, updatedAt 2026-09-09, read 2026-10-14)

B5. Replies that name the requesting seller (read in the models; none is documented by Amazon as an id lookup):
- **Finances `listTransactions`** (`GET /finances/2024-06-19/transactions`): `transactions[].sellingPartnerMetadata.sellingPartnerId`, "The unique seller identifier". Role: Finance and Accounting. Default plan 0.5/s, burst 10.
- **Product Pricing v0 `getPricing`** (`GET /products/pricing/v0/price`, `ItemType=Sku`, up to twenty `Skus`): `Product.Identifiers.SKUIdentifier.SellerId`, "The seller identifier submitted for the operation". Role: Pricing **or Product Listing**. Default plan 0.5/s, burst 1.
- **Product Pricing 2022-05-01 `getFeaturedOfferExpectedPriceBatch`**: each response body's `offerIdentifier` is "Metadata that identifies the target offer", with `sellerId` and a `sku` that "will only be present for the target offer, which belongs to the requesting seller". `currentFeaturedOffer` and `competingFeaturedOffer` describe other offers and may be another seller's. Role: Pricing.
- **Notifications `LISTINGS_ITEM_STATUS_CHANGE`**: the payload's `SellerId` is the "Selling partner identifier, such as a selling partner (merchant) account, of the affected listings item". Role: Product Listing. It needs a destination and a subscription.

[official] (finances_2024-06-19.json; productPricingV0.json; productPricing_2022-05-01.json; Role Mappings for SP-API Operations; Notification Type Values, https://developer-docs.amazon/sp-api/docs/notification-type-values.md, updatedAt 2026-09-30, all read 2026-10-14)

B6. None of these operations appears on the deprecation schedule as of today. The schedule lists Finances v0's three `listFinancialEvents*` operations (deprecated July 21, 2025, removal August 27, 2027), but not `listTransactions` or Pricing v0 `getPricing`. [official] (SP-API Deprecations, https://developer-docs.amazon/sp-api/docs/sp-api-deprecations.md, read 2026-10-14)

B7. An Amazon solutions architect, replying on Amazon's model repository in 2021: "Currently we do not offer an API to pull Seller information." [official, staff reply in a GitHub issue] (amzn/selling-partner-api-models issue #383 "How to retrieve Seller Profile information from Selling Partner API?", https://github.com/amzn/selling-partner-api-models/issues/383, comment of 2021-03-11, read 2026-10-14)

B8. An Amazon Seller Forums post by KJ_Amazon, moderator-updated, titled "Quick Tip: find your Merchant Token / Seller ID", gives the path for a Professional account: Settings → Account Info → Business Information → "Your Merchant Token". It says the merchant token is "sometimes referred to as a Seller ID". The post is dated only "2 years ago". [official, forum post by an account named as Amazon's] (https://sellercentral-europe.amazon.com/seller-forums/discussions/t/82392cdf-6537-400d-a377-d2a5a45616d4, read 2026-10-14)

### C. Roles: which role opens which read

C1. RULE. "If you call an operation for which you don't have the required roles, you get a 403 error." A role reaches a seller's connection only through re-authorization: "get new authorizations to generate a new refresh token that grants access to the API operations, reports, feeds, and notifications that the new role provides". [official] (Selling Partner API Roles, https://developer-docs.amazon/sp-api/docs/roles-in-the-selling-partner-api.md, updatedAt 2026-10-13, read 2026-10-14)

C2. RULE. "Each operation requires at least one role from its list of possible roles (unless the operation is marked as grantless)"; "you don't need all listed roles; any one of them grants you access." Restricted-data operations "typically require both a general role and a restricted role". Report, feed and notification types have their own mapping. [official] (Role Mappings for SP-API Operations; Role Mappings for SP-API Types, https://developer-docs.amazon/sp-api/docs/role-mappings-for-types.md, updatedAt 2026-09-09, read 2026-10-14)

C3. The role map for the reads and writes this package uses. Any one listed role is enough. [official] (Role Mappings for SP-API Operations; Role Mappings for SP-API Types; Listings Items API page, https://developer-docs.amazon/sp-api/docs/listings-items-api.md; Data Kiosk API, https://developer-docs.amazon/sp-api/docs/data-kiosk-api.md; Analytics Reports, https://developer-docs.amazon/sp-api/docs/report-type-values-analytics.md; Performance Reports, https://developer-docs.amazon/sp-api/docs/report-type-values-performance.md; all read 2026-10-14)

| Operation or type | Roles (any one) | Note |
|---|---|---|
| Listings Items v2021-08-01: `getListingsItem`, `searchListingsItems`, `putListingsItem`, `patchListingsItem`, `deleteListingsItem` | Product Listing; Inventory and Order Tracking | Path needs `{sellerId}` |
| Product Type Definitions: `getDefinitionsProductType`, `searchDefinitionsProductTypes` | Product Listing; Inventory and Order Tracking | Not grantless (see E) |
| Catalog Items v2022-04-01: `getCatalogItem`, `searchCatalogItems` | Product Listing | Inventory and Order Tracking alone does **not** open Catalog |
| Listings Restrictions `getListingsRestrictions` | Product Listing | |
| A+ Content Management (all operations listed) | Brand Analytics; Product Listing | |
| Uploads `createUploadDestinationForResource` | Product Listing | |
| `JSON_LISTINGS_FEED` | Product Listing; Inventory and Order Tracking | |
| Notifications `LISTINGS_ITEM_STATUS_CHANGE`, `LISTINGS_ITEM_ISSUES_CHANGE`, `BRANDED_ITEM_CONTENT_CHANGE`, `PRODUCT_TYPE_DEFINITIONS_CHANGE` | Product Listing | `ITEM_PRODUCT_TYPE_CHANGE`: Product Listing, or Pricing (NA only) |
| `GET_MERCHANT_LISTINGS_ALL_DATA` and the other merchant-listings reports | Product Listing; Pricing; Inventory and Order Tracking; Direct to Consumer Shipping (Restricted) | `..._DEFECT_DATA` and `..._INACTIVE_DATA` omit the restricted role |
| `GET_BRAND_ANALYTICS_SEARCH_QUERY_PERFORMANCE_REPORT`, `..._SEARCH_CATALOG_PERFORMANCE_REPORT`, `..._SEARCH_TERMS_REPORT`, `..._MARKET_BASKET_REPORT`, `..._REPEAT_PURCHASE_REPORT` | Brand Analytics | The seller must also be "registered in Amazon Brand Registry"; Search Terms also needs "a brand representative" |
| `GET_SALES_AND_TRAFFIC_REPORT` | Brand Analytics | "Availability: Sellers"; no Brand Registry condition stated |
| `GET_COUPON_PERFORMANCE_REPORT` | Brand Analytics | |
| `GET_PROMOTION_PERFORMANCE_REPORT` | Brand Analytics; Selling Partner Insights | Performance Reports page: sellers need Selling Partner Insights, vendors Brand Analytics |
| `DETAIL_PAGE_TRAFFIC_EVENT`, `ITEM_SALES_EVENT_CHANGE`, `ITEM_INVENTORY_EVENT_CHANGE` notifications | Brand Analytics | |
| Data Kiosk: `createQuery`, `getQuery`, `getQueries`, `getDocument`, `cancelQuery` | Brand Analytics | Field-level roles are checked at `createQuery`; the 2024 correction gives the Economics dataset to Selling Partner Insights, which these rows do not list (C5) |
| `DATA_KIOSK_QUERY_PROCESSING_FINISHED` | Brand Analytics; Amazon Warehousing and Distribution | |
| Customer Feedback v2024-06-01 (review and return topics and trends) | Brand Analytics; Selling Partner Insights | |
| Sellers `getMarketplaceParticipations` | Product Listing; Selling Partner Insights (plus FE-only roles, A6) | |
| `GET_V1_SELLER_PERFORMANCE_REPORT`, `GET_V2_SELLER_PERFORMANCE_REPORT`, `MARKETPLACE_ASIN_PAGE_VIEW_METRICS`, `ACCOUNT_STATUS_CHANGED` | Selling Partner Insights | |
| Product Pricing 2022-05-01: `getFeaturedOfferExpectedPriceBatch`, `getCompetitiveSummary` | Pricing | |
| Product Pricing v0: `getPricing`, `getCompetitivePricing`, `getItemOffers(Batch)`, `getListingOffers(Batch)` | Pricing; Product Listing | |
| Product Fees `getMyFeesEstimates` | Pricing; Product Listing | |
| Promotions v2025-12-01: `searchPromotions`, `getPromotion`, `getSelection` | Pricing; Product Listing | |
| `ANY_OFFER_CHANGED`, `PRICING_HEALTH` notifications | Pricing | |
| FBA Inventory `getInventorySummaries` | Amazon Fulfillment; Product Listing | |
| `GET_FBA_FULFILLMENT_CUSTOMER_RETURNS_DATA`, `GET_FBA_MYI_ALL_INVENTORY_DATA`, `GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT` | Amazon Fulfillment; Pricing | |
| `GET_LEDGER_DETAIL_VIEW_DATA`, `GET_FBA_INVENTORY_PLANNING_DATA` | Amazon Fulfillment | |
| Finances v2024-06-19: `listTransactions`, `listBalances`, `listSummary` | Finance and Accounting | |
| Finances v0 `listFinancialEvents` | Finance and Accounting; AISP (EU only); Amazon Fulfillment (NA, FE only) | On the deprecation schedule (B6) |
| `GET_V2_SETTLEMENT_REPORT_DATA_FLAT_FILE_V2`, `GET_REFERRAL_FEE_PREVIEW_REPORT` | Finance and Accounting | |
| Sellers `getAccount` | AISP; Finance and Accounting | EU only (A3, A5) |

C4. Amazon's own tables are inconsistent for Reports. The `createReport` operation row lists twelve roles but not Brand Analytics. The Brand Analytics type rows, and the Roles page's own example ("the `createReport` operation … when you request the `GET_BRAND_ANALYTICS_SEARCH_TERMS_REPORT` report"), require Brand Analytics. [official] (Role Mappings for SP-API Operations; Selling Partner API Roles; Role Mappings for SP-API Types, read 2026-10-14)
- [seat] In the day-1 internal run, Amazon accepted a Search Query Performance `createReport` with 202. The report type's role is what Amazon applies, not the operation row.

C5. RULE, Data Kiosk.
- "Each field available with Data Kiosk requires a certain role. Data Kiosk determines whether the requester has the required roles for each field in the query upon query creation." "Data Kiosk only allows one request per query / selling partner / application combination."
- The 2024 correction: "The Vendor Analytics and Sales and Traffic datasets require the Brand Analytics role. The Economics dataset requires the Selling Partner Insights role."
- The seller analytics guide speaks of access levels, not roles: "Sales and traffic access" (sales, traffic, promotion, account health, search, reviews, defects, returns) and "Sales and lending access". "Requesting a field your application is not authorized for returns an authorization error rather than a null value." A store outside an authorized set returns `Unauthorized marketplace access`.
- The `analytics_sellerAnalytics_2025_03_31` schema marks fields with `@paamRights(require: ["analytics_sales_and_traffic_view_pa"])` and/or `"analytics_sales_and_lending_view"`, and `@supportedAccountTypes(types: [MERCHANT])`. The Economics and Sales and Traffic schemas carry no such directive.

[official] (Data Kiosk API, updatedAt 2026-09-09; Correction: Data Kiosk role requirements, https://developer-docs.amazon/sp-api/changelog/correction-data-kiosk-role-requirements.md; Seller Analytics Dataset Use Case Guide, https://developer-docs.amazon/sp-api/docs/seller-analytics-dataset-guide.md, updatedAt 2026-09-30; schemas at https://github.com/amzn/selling-partner-api-models/tree/main/schemas/data-kiosk; all read 2026-10-14)

Amazon's pages disagree on the Data Kiosk role, re-read 2026-10-14 at reconciliation:
- Role Mappings for SP-API Operations and the Data Kiosk API page list **Brand Analytics** as the only role ("need at least one") for all five Data Kiosk operations, including `createQuery`.
- The changelog "Correction: Data Kiosk role requirements" says "The Economics dataset requires the Selling Partner Insights role", and Brand Analytics for Sales and Traffic and Vendor Analytics.
- The `analytics_sellerAnalytics_2025_03_31` schema names PAAM rights, not an SP-API role, and no Amazon page read today names which role carries them. The two role pages the correction links (`brand-analytics-role`, `selling-partner-insights-role`) now return "Page Not Found".

This file does not pick one. The binding answer is Amazon's reply to a `createQuery` on the dataset under the seller's actual roles: acceptance, or the authorization error naming the field (Open question 2). `angles/paid-keywords.md`, `angles/returns.md`, `angles/inventory-and-fulfillment.md` and `method/effect-measurement.md` record the same disagreement.

C6. RULE, 403 texts. Amazon's common 403 messages are:
- `Expired or revoked API tokens` ("Access tokens expire after 1 hour, refresh tokens are valid for 365 days, and client secrets for 180 days");
- `Missing required SP-API roles or permissions`;
- `Incorrect account credentials` (vendor credentials on a seller API);
- `Region mismatch` ("Seller accounts are region-specific even if applications are global");
- `Incorrect resource path or version`;
- `Deprecated endpoint`;
- `Unsupported API marketplace`;
- `Seller account deactivation or suspension`.

A 403 is therefore not by itself a missing role. [official] (Resolve Common HTTP and Authorization Error Codes, https://developer-docs.amazon/sp-api/docs/resolve-common-http-and-authorization-error-codes.md, updatedAt 2026-09-09, read 2026-10-14)

C7. The body Amazon returned for a role-or-authorization 403, as a developer captured it in 2021: header `x-amzn-ErrorType: AccessDeniedException`, body `"code": "Unauthorized"`, `"message": "Access to requested resource is denied."`. Amazon's support replied in that thread: "Please generate new refresh token whenever you update your app id with new roles", and "If you are using a EU account on NA endpoint it will return access denied error." [official, staff replies; error body as Amazon returned it] (amzn/selling-partner-api-models issue #1179 "marketplaceParticipations: 403 Forbidden (Access to requested resource is denied.)", https://github.com/amzn/selling-partner-api-models/issues/1179, 2021-04-01/02, read 2026-10-14)
- [seat] On day 1 on this line, Amazon answered 403 `Unauthorized` for `/sellers/v1/partners` and `/reports/2021-06-30/reportTypes` (paths no model lists) and for `/catalog/2022-09-01/items/<ASIN>` (a version no model lists). The same body therefore comes back for a wrong path. cx read it as a missing role and told the seller so (internal run report 20261013-0904).

### D. Restricted Data Tokens

D1. RULE. "Restricted operations return customers' Personally Identifiable Information (PII). You need an RDT to call a restricted operation." Amazon's list of restricted operations:
- Direct Fulfillment Orders and Shipping;
- Easy Ship `createScheduledPackageBulk`;
- Merchant Fulfillment shipments;
- Orders API `getOrders`, `getOrder`, `getOrderItems`, `getOrderRegulatedInfo`, `getOrderAddress`, `getOrderBuyerInfo`, `getOrderItemsBuyerInfo`;
- Reports API `getReportDocument`;
- Shipment Invoicing `getShipmentDetails`;
- Shipping API `getShipment`.

No Listings Items, Product Type Definitions, Catalog Items, Pricing, Finances, Sellers or Data Kiosk operation is on it. [official] (Tokens API, https://developer-docs.amazon/sp-api/docs/tokens-api.md, updatedAt 2026-09-09, read 2026-10-14)

D2. RULE. "The `getReportDocument` operation is considered a restricted operation only when a restricted report type is specified." For such a report, the RDT's restricted resource "can contain only a specific path, not a generic path". The roles it needs are Direct-to-consumer shipping, Tax remittance and Tax invoicing. [official] (Get authorization to access restricted report types with PII information, https://developer-docs.amazon/sp-api/docs/get-authorization-to-access-restricted-report-types.md, read 2026-10-14)

D3. RULE. "RDTs are specific to restricted operations and cannot be used for standard SP-API calls." The prerequisite is a restricted role, and Amazon asks the developer to "Ensure that your application needs to perform functions that require PII access". The Tokens API default plan is 1/s, burst 10. [official] (Authorization with the Restricted Data Token, https://developer-docs.amazon/sp-api/docs/authorization-with-the-restricted-data-token.md; tokens_2021-03-01.json; read 2026-10-14)

D4. None of the report types this package reads appears in the restricted lists: listings, Brand Analytics, Sales and Traffic, coupon, promotion, FBA inventory and returns, settlement. Their rows name no restricted-only role. Exception: the merchant-listings reports list Direct to Consumer Shipping (Restricted) as one of four alternatives, so a general role suffices. [official] (Role Mappings for SP-API Types, read 2026-10-14)

### E. Grantless operations and their separate token

E1. RULE. "A grantless operation is an operation that you can call without explicit authorization from a selling partner." Its Login with Amazon trade uses `grant_type=client_credentials` and a `scope` instead of a refresh token. "Grantless operations apply only to seller applications." [official] (Grantless Operations, https://developer-docs.amazon/sp-api/docs/grantless-operations.md, updatedAt 2026-09-09, read 2026-10-14; Connecting to the Selling Partner API, https://developer-docs.amazon/sp-api/docs/connecting-to-the-selling-partner-api.md, read 2026-10-14)

E2. RULE. The complete grantless list on that page:
- `createDestination`, `deleteDestination`, `getDestination`, `getDestinations`;
- `getSubscriptionById`, `deleteSubscriptionById`;
- `getShipmentTracking`;
- `getAuthorizationCode`;
- `rotateApplicationClientSecret`.

The three scopes are `sellingpartnerapi::notifications`, `sellingpartnerapi::client_credential:rotation` and `sellingpartnerapi::shipments:track`. "If you include scope, do not include `refresh_token`." [official] (same two pages)

E3. RULE. `createSubscription` and `getSubscription` are **not** grantless. They need "The role that is associated with the notification type". [official] (Role Mappings for SP-API Operations, read 2026-10-14)

E4. `searchDefinitionsProductTypes` takes no `sellerId` parameter, but it is not grantless. It is absent from the grantless list and needs Product Listing or Inventory and Order Tracking, so it goes on the seller's authorization like any listing read. [official] (definitionsProductTypes_2020-09-01.json; Grantless Operations; Role Mappings for SP-API Operations, read 2026-10-14)

E5. Inconsistency in Amazon's pages: the grantless page gives `deleteSubscriptionById` as `DELETE /notifications/v2/subscriptions/...`, while the Notifications model lists it under `/notifications/v1/subscriptions/...`. [official] (Grantless Operations; notifications.json, read 2026-10-14)

### F. Usage plans and rate limits

F1. RULE. The SP-API "uses the token bucket algorithm". Tokens are added "at a set rate per second until the maximum limit of the bucket is reached. The maximum limit is also called the burst rate". "Throttling occurs when you make a request for which no token is available". "A throttled request results in an error response." [official] (Usage Plans and Rate Limits, updatedAt 2026-09-09, read 2026-10-14)

F2. RULE. "Most operations' rate limits are per the selling partner and application pair." A different seller, a different regional account or a different application each has a separate bucket. "Multiple usage plans can apply to an individual operation. Requests are rate limited by whichever threshold you reach first." The per-API rate-limit pages show a second ceiling "per application" across all sellers. [official] (same page; Listings Items API Rate Limits, https://developer-docs.amazon/sp-api/docs/listings-items-api-rate-limits.md; Catalog Items API Rate Limits, https://developer-docs.amazon/sp-api/docs/catalog-items-api-rate-limits.md, read 2026-10-14)

F3. RULE. Two plan types.
- **Standard**: "rate limits have static values for all callers".
- **Dynamic**: "automatically adjusted to each selling partner based on the current and historical business needs". "These metrics are business metrics only and do not include a historical number of API requests. Rates do not dynamically increase because an application makes API requests more frequently."

Each operation's model description says the table shows "the default rate and burst values" and that selling partners "whose business demands require higher throughput may have higher rate and burst values". [official] (Usage Plans and Rate Limits; e.g. sellers.json, read 2026-10-14)

F4. RULE. The `x-amzn-RateLimit-Limit` response header, "if available, specifies the operation's rate limits per account-application pair. However, you must not depend on this header being present". It is sent "for HTTP status codes 20x, 400 and 404. Unauthorized, or unauthenticated request, don't include this header". It "doesn't include other usage plan rate limits". [official] (Usage Plans and Rate Limits, read 2026-10-14)

F5. GUIDANCE. "A 429 is a retry-able status code. You can try again, but repeated throttled requests require a back-off strategy."
- Amazon recommends retry, "Exponential back-off" ("Implement a maximum delay interval and a maximum number of retries") and "Jitter".
- Amazon says not to hardcode timers, and to prefer notifications over polling and batch operations over many calls.
- "Can my application completely avoid getting throttled? No."
- The 429 section of the error page: "Wait a few minutes, then retry the request."

[official] (Usage Plans and Rate Limits; Optimize Rate Limits for Application Workloads, https://developer-docs.amazon/sp-api/docs/strategies-to-optimize-rate-limits-for-your-application-workloads.md; Resolve Common HTTP and Authorization Error Codes; read 2026-10-14)

F6. RULE. "We can raise rate limits at any time. If we ever lower the rate limits posted in the API reference documentation, we communicate the change in advance". Dynamic plans "auto-adjust higher or lower depending on business context". [official] (Usage Plans and Rate Limits, read 2026-10-14)

F7. Listings Items throttle texts, all HTTP 429:
- "The frequency of requests was greater than what is allowed for the application."
- "… allowed for relationships."
- "… allowed for product data."

Separate per-application caps apply to relationship updates, to product-data updates (attributes that are not inventory, pricing or relationship attributes, "for example, `item_name`") and to "Validation previews". [official] (Listings Items API Rate Limits, updatedAt 2026-09-09, read 2026-10-14)

F8. The published default figures disagree across Amazon's own pages. They are for human readers only. Amazon's pages themselves disagree, so this file picks none: the binding value is the `x-amzn-RateLimit-Limit` header on each reply, and where the header is absent, the default in the operation's model JSON as read at run time (F4, F6).

| Operation | Rate-limits page | Operation reference page | Model file | API-level reference page |
|---|---|---|---|---|
| `getListingsItem` | 5/s, burst 5 (per application 100) | 5/s, burst 10 | 5, 10 | — |
| `putListingsItem` | 5, 5 (per application 100) | — | 5, 10 | — |
| `patchListingsItem`, `deleteListingsItem`, `searchListingsItems` | 5, 5 (per application: patch 500, others 100) | — | 5, 5 | — |
| `getCatalogItem`, `searchCatalogItems` (2022-04-01) | 2, 2 (per application 250 / 500; keyword searches 50 per application) | 2, 2 | 2, 2 | 5, 5 ("Catalog Items API v2022-04-01 Reference") |
| `getDefinitionsProductType`, `searchDefinitionsProductTypes` | — | — | 5, 10 | — |
| Data Kiosk `createQuery` / `getQuery` / `getDocument` | — | — | 0.0167, 15 / 2.0, 15 / 0.0167, 15 | — |

The two disagreements are named plainly:
- **Listings Items burst.** For `getListingsItem` and `putListingsItem`, the Listings Items API Rate Limits page's v2021-08-01 table prints burst 5, while the model and the `getListingsItem` reference page print burst 10. The same rate-limits page has a second table, for the older v2020-09-01 version, that prints burst 10 for delete, patch and put; a reader who takes a figure from that table is reading the wrong version.
- **Catalog Items rate and burst.** The "Catalog Items API v2022-04-01 Reference" page prints 5 and 5 for both operations, while the Catalog Items API Rate Limits page, the model and the `getCatalogItem` and `searchCatalogItems` reference pages print 2 and 2. `angles/competitor-discovery.md`, `angles/competitor-set.md`, `elements/variations.md` and `angles/listing-content-and-health.md` record the same split.

[official] (pages and models named in F2 and in *Pages read*, read 2026-10-14; models and the four rate pages re-read at reconciliation the same day, figures unchanged)

F9. Amazon names its own throttling status in the error page's categories ("429 rate limit breaches") and advises logging status, message, seller id and marketplace id per request (A7). [official] (Optimize Rate Limits for Application Workloads; Troubleshoot SP-API Errors, read 2026-10-14)

## What practitioners add

- **Trellis**, "Amazon Marketplace Participations Report (Sellers API)", no date shown (footer ©2026). [opinion] (https://gotrellis.com/reports/amazon-marketplace-participations-report, read 2026-10-14)
  - The reply's only account column is `store_name`.
  - Some rows are named "Non-Amazon" with an internal store domain, and "Amazon's Sellers documentation does not describe them at all"; filter them before counting stores.
  - `has_suspended_listings` is "an account-level state per marketplace, not a count of individually suppressed listings".
  - "The operation returns 403 for vendor credentials."
  - Agrees with Amazon's model (no seller id). The "Non-Amazon" rows are not in any Amazon page read today.
- **Eric Blade** (GitHub `ericblade`), 2023-12-08, on issue #383: "Several SPAPI calls require the SellerID as an input to them, but there's no way to obtain it." Feature requests for an LWA `profile` scope run from 2021 to 2023 in the same thread (Mitalee; openbridge-james of Openbridge; tspicer). [opinion] (https://github.com/amzn/selling-partner-api-models/issues/383, read 2026-10-14)
- **pradeep-gox**, issue #4076 "Need Seller Information - Seller ID & Seller Name" (2024-08-05): "Currently we can get only the selling partner id who authorized our app and not the seller id which he/she had selected while authorization." An SP-API solutions architect replied that he would "+1 this request internally" with no ETA. The developer treats `selling_partner_id` and the seller id as possibly different. No Amazon page read today settles it. [opinion; staff reply] (https://github.com/amzn/selling-partner-api-models/issues/4076, read 2026-10-14)
- **Daasity**, "How to find your Amazon Seller ID", no date shown: Account Info → Business Information → Merchant Token; "This is the Merchant Token, also called your Seller ID." It does not tie this value to any SP-API field. [opinion] (https://support.daasity.com/migrated/knowledge/get-amazon-seller-id, read 2026-10-14)
- **Antoine, CEO of Nova Analytics**, "Amazon SP-API Rate Limits: The Complete 2026 Guide", published 2025-12-04, updated 2026-05-12. [opinion] (https://novadata.io/resources/blog/amazon-sp-api-rate-limits-guide, read 2026-10-14)
  - Limits "vary by seller tier, marketplace, time of day, and endpoint".
  - "Amazon also changes limits without warning". This disagrees with Amazon's promise of advance notice before lowering a posted limit (F6).
  - It gives Catalog Items as 5 RPS, burst 40. No Amazon page read today shows burst 40 (F8).
  - It does not mention the `x-amzn-RateLimit-Limit` header.
- **moltar** (GitHub), issue #1179, 2021: three engineers spent two weeks on a 403 for `marketplaceParticipations` in NA and FE that worked in EU. Amazon support's answers pointed to the region of the authorization and to regenerating the refresh token after adding a role. A later commenter (abuzuhri) fixed it by using a Role ARN instead of a User ARN. That was the AWS signing step, which the SP-API no longer requires (Connecting to the Selling Partner API shows calls "with a URI and headers but no signing information"). [opinion; staff replies] (https://github.com/amzn/selling-partner-api-models/issues/1179, read 2026-10-14)

Disagreements: Nova's "without warning" vs Amazon's advance-notice promise. Nova's Catalog burst 40 vs Amazon's 2 or 5. pradeep-gox's distinction between `selling_partner_id` and the seller id vs Daasity's and KJ_Amazon's equation of merchant token and seller id.

## Published research

- **Marc Brooker**, "Exponential Backoff And Jitter", AWS Architecture Blog, 2015-03-04. Amazon's own SP-API page links it. In the post's simulation of contending clients, exponential back-off with full jitter cut total calls by more than half against back-off without jitter, and the work finished sooner; no jitter is "the clear loser". [research, with a caveat: an engineering blog simulation by an Amazon engineer, not peer-reviewed] (https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/, read 2026-10-14)
  - Transfer: this supports jitter when many callers share a bucket. One cx box calling for one seller is a single client, where jitter matters less than respecting the bucket.
- No peer-reviewed work on SP-API authorization, roles or usage plans was found. This is product documentation territory.

## Stable enough for a skill

1. Neither Sellers API reply carries a seller id. `getMarketplaceParticipations` gives the seller's stores, and `getAccount` gives business details in the EU only. (sellers.json; Get the account information of a seller)
2. A listing is addressed by `{sellerId}/{sku}` on every Listings Items path. Without the seller id there is no listing read. (listingsItems_2021-08-01.json)
3. Amazon hands the seller id over at authorization as `selling_partner_id` and tells the application to store it. A self-authorized private application receives none from the flow. (Website Authorization Workflow; Authorize Private Applications)
4. Seller ids are per regional account. (Usage Plans and Rate Limits)
5. These replies name the requesting seller: `getPricing` by SKU (`SKUIdentifier.SellerId`), FOEP's `offerIdentifier.sellerId`, `listTransactions`' `sellingPartnerMetadata.sellingPartnerId`, and the `LISTINGS_ITEM_STATUS_CHANGE` payload's `SellerId`. A featured-offer or Buy Box seller field may name another seller. (productPricingV0.json; productPricing_2022-05-01.json; finances_2024-06-19.json; Notification Type Values)
6. An operation needs any one of its listed roles. A missing role answers 403, and a role added later reaches a seller only after re-authorization. (Selling Partner API Roles; Role Mappings for SP-API Operations)
7. Listings Items and Product Type Definitions open with Product Listing or Inventory and Order Tracking. Catalog Items opens only with Product Listing. (Role Mappings for SP-API Operations)
8. Brand Analytics reports need the Brand Analytics role and, except Sales and Traffic, Brand Registry. The Search Terms report also needs a brand representative. (Analytics Reports; Role Mappings for SP-API Types)
9. Data Kiosk checks roles per field at `createQuery`. An unauthorized field is an authorization error, not a null. Amazon's pages disagree on which role opens the Economics dataset (Brand Analytics on Role Mappings and the Data Kiosk API page, Selling Partner Insights in the correction), so the `createQuery` reply is the answer. (Data Kiosk API; Seller Analytics Dataset Use Case Guide; Role Mappings for SP-API Operations; Correction: Data Kiosk role requirements)
10. A 403 has several documented causes besides a missing role, including a wrong path or version and a region mismatch. It is not proof of a missing role. (Resolve Common HTTP and Authorization Error Codes)
11. No listing, catalog, product-type, pricing, finance, Brand Analytics or Data Kiosk read needs a Restricted Data Token. `getReportDocument` is restricted only for a restricted report type. (Tokens API; Get authorization to access restricted report types)
12. Grantless operations are a closed list: Notifications destinations and subscription-by-id, tracking, the authorization code and client-secret rotation. Product type search is not among them. (Grantless Operations)
13. Rates are token buckets per seller-application pair. Published figures are defaults, Amazon's own pages print different defaults for the same operation, and some plans adjust per seller. The live figure is the `x-amzn-RateLimit-Limit` header when present, else the model's default read at run time. (Usage Plans and Rate Limits; F8)
14. A 429 is retryable with exponential back-off, jitter, a maximum delay and a maximum number of retries. (Optimize Rate Limits for Application Workloads)

## What cx must read at run time

- **The seller's stores.** `getMarketplaceParticipations` (`GET /sellers/v1/marketplaceParticipations`) on each origin the seller connected. Read `marketplace.id` (match it to Amazon's Marketplace IDs table), `countryCode`, `defaultLanguageCode` (the `issueLocale` / `locale` to ask for), `defaultCurrencyCode`, `participation.isParticipating` and `participation.hasSuspendedListings`.
- **The seller's id.** Use the connection's stored `selling_partner_id` if the platform ever carries one (door.md says today's door holds none). Otherwise read one reply, per origin:
  1. `getPricing` with `ItemType=Sku` and one of the seller's SKUs (Pricing or Product Listing). A SKU comes from the merchant-listings report; its name and options are door.md's.
  2. `getFeaturedOfferExpectedPriceBatch` by SKU, reading `offerIdentifier.sellerId` (Pricing).
  3. `listTransactions` with a recent `postedAfter` (Finance and Accounting); it is empty for a seller with no recent transactions.

  door.md owns the call shapes.
- **Whether a role is the problem.** The 403 body and status as landed. Check the path against the model's `paths` first: a wrong path or version also answers 403. Then check the region against the origin, then the operation's role row in Role Mappings for SP-API Operations or the type row in Role Mappings for SP-API Types.
- **Whether Brand Analytics data is open.** The `createReport` answer or the report's `FATAL` document for the Brand Analytics type. For Data Kiosk, the `createQuery` authorization error, field by field. door.md owns report names, options and waits.
- **The live rate.** `x-amzn-RateLimit-Limit` in each receipt (door.md lists it among the receipt's headers). It is absent on 401/403 replies and sometimes on others.
- **Throttling.** A landed `429` (`provider_rate_limit` in door.md's words). The door "adds no wait and retries nothing of its own", so the wait is cx's.
- **An account-level stop.** `hasSuspendedListings` from `getMarketplaceParticipations`, and the `ACCOUNT_STATUS_CHANGED` notification or `GET_V2_SELLER_PERFORMANCE_REPORT` (Selling Partner Insights). Amazon names these as the way to track a deactivated or suspended account.
- **Grantless calls.** Only for the E2 list, through door.md's `x-cx-grantless-scope` header with Amazon's scope string.

## Pages read

| Page name | URL | Date read | What it gave |
|---|---|---|---|
| The Selling Partner API for Sellers (model) | https://github.com/amzn/selling-partner-api-models/blob/main/models/sellers-api-model/sellers.json | 2026-10-14 | Two paths; reply fields; no seller id; 0.016/15 |
| Sellers API | https://developer-docs.amazon/sp-api/docs/sellers-api.md | 2026-10-14 | Roles per operation; getAccount EU; release-note dates |
| getMarketplaceParticipations (reference) | https://developer-docs.amazon/sp-api/reference/getmarketplaceparticipations.md | 2026-10-14 | Default plan; header wording |
| getAccount (reference) | https://developer-docs.amazon/sp-api/reference/getaccount.md | 2026-10-14 | Opened; same model content |
| Get the account information of a seller | https://developer-docs.amazon/sp-api/docs/get-account-information-eu-seller.md | 2026-10-14 | EU-only note; Finance and Accounting prerequisite |
| Get the market participation of a seller | https://developer-docs.amazon/sp-api/docs/get-seller-market-participation.md | 2026-10-14 | Selling Partner Insights prerequisite |
| SP-API Release Notes | https://developer-docs.amazon/sp-api/docs/sp-api-release-notes.md | 2026-10-14 | 2024-08-14 getAccount added; 2024-12-18 AISP |
| Selling Partner API Roles | https://developer-docs.amazon/sp-api/docs/roles-in-the-selling-partner-api.md | 2026-10-14 | 403 for missing role; re-authorization; role definitions and examples |
| Role Mappings for SP-API Operations | https://developer-docs.amazon/sp-api/docs/role-mappings.md | 2026-10-14 | Operation → roles (updatedAt 2026-10-13) |
| Role Mappings for SP-API Types | https://developer-docs.amazon/sp-api/docs/role-mappings-for-types.md | 2026-10-14 | Report, feed, notification type → roles |
| Listings Items API | https://developer-docs.amazon/sp-api/docs/listings-items-api.md | 2026-10-14 | Roles per operation |
| Data Kiosk API | https://developer-docs.amazon/sp-api/docs/data-kiosk-api.md | 2026-10-14 | Brand Analytics on every operation; field-level roles; one pending query per combination |
| Correction: Data Kiosk role requirements | https://developer-docs.amazon/sp-api/changelog/correction-data-kiosk-role-requirements.md | 2026-10-14 | Sales and Traffic / Vendor Analytics → Brand Analytics; Economics → Selling Partner Insights |
| Seller Analytics Dataset Use Case Guide | https://developer-docs.amazon/sp-api/docs/seller-analytics-dataset-guide.md | 2026-10-14 | Access levels; authorization error not null; `Unauthorized marketplace access` |
| Data Kiosk schemas (economics, salesAndTraffic, sellerAnalytics) | https://github.com/amzn/selling-partner-api-models/tree/main/schemas/data-kiosk | 2026-10-14 | `@paamRights` only in sellerAnalytics |
| brand-analytics-role; selling-partner-insights-role | https://developer-docs.amazon/sp-api/docs/brand-analytics-role.md ; .../selling-partner-insights-role.md | 2026-10-14 | unreachable: "Page Not Found" (links from the correction) |
| Analytics Reports | https://developer-docs.amazon/sp-api/docs/report-type-values-analytics.md | 2026-10-14 | Brand Analytics role and Brand Registry per report; Sales and Traffic role |
| Performance Reports | https://developer-docs.amazon/sp-api/docs/report-type-values-performance.md | 2026-10-14 | Promotion: Selling Partner Insights (sellers) / Brand Analytics (vendors); coupon (sellers): Brand Analytics |
| Tokens API | https://developer-docs.amazon/sp-api/docs/tokens-api.md | 2026-10-14 | Restricted operations list |
| Authorization with the Restricted Data Token | https://developer-docs.amazon/sp-api/docs/authorization-with-the-restricted-data-token.md | 2026-10-14 | RDT only for restricted operations |
| Get authorization to access restricted report types with PII information | https://developer-docs.amazon/sp-api/docs/get-authorization-to-access-restricted-report-types.md | 2026-10-14 | getReportDocument restricted only for restricted types |
| Tokens model | https://github.com/amzn/selling-partner-api-models/blob/main/models/tokens-api-model/tokens_2021-03-01.json | 2026-10-14 | 1/s, burst 10 |
| Grantless Operations | https://developer-docs.amazon/sp-api/docs/grantless-operations.md | 2026-10-14 | Grantless list; scope trade |
| Connecting to the Selling Partner API | https://developer-docs.amazon/sp-api/docs/connecting-to-the-selling-partner-api.md | 2026-10-14 | Grant types; three scopes; access token one hour; no signing |
| Notifications model | https://github.com/amzn/selling-partner-api-models/blob/main/models/notifications-api-model/notifications.json | 2026-10-14 | v1 paths; 1/s burst 5 |
| Website Authorization Workflow | https://developer-docs.amazon/sp-api/docs/website-authorization-workflow.md | 2026-10-14 | `selling_partner_id`; "Securely store" |
| Authorize Private Applications | https://developer-docs.amazon/sp-api/docs/self-authorization.md | 2026-10-14 | Refresh token in UI; merged regional accounts |
| Usage Plans and Rate Limits | https://developer-docs.amazon/sp-api/docs/usage-plans-and-rate-limits.md | 2026-10-14 | Token bucket; pair; dynamic plans; header; 429; per-store seller ids |
| Optimize Rate Limits for Application Workloads | https://developer-docs.amazon/sp-api/docs/strategies-to-optimize-rate-limits-for-your-application-workloads.md | 2026-10-14 | Retry, exponential back-off, jitter |
| Resolve Common HTTP and Authorization Error Codes | https://developer-docs.amazon/sp-api/docs/resolve-common-http-and-authorization-error-codes.md | 2026-10-14 | 403 causes; 429 advice; token lifetimes |
| Troubleshoot SP-API Errors | https://developer-docs.amazon/sp-api/docs/troubleshoot-sp-api-errors.md | 2026-10-14 | Log seller id and marketplace id; use getMarketplaceParticipations; three account texts |
| Listings Items API Rate Limits | https://developer-docs.amazon/sp-api/docs/listings-items-api-rate-limits.md | 2026-10-14 | 429 texts; per-application caps; 5/5 for v2021-08-01; a separate v2020-09-01 table with burst 10 |
| Catalog Items API Rate Limits | https://developer-docs.amazon/sp-api/docs/catalog-items-api-rate-limits.md | 2026-10-14 | 2/2; per-application 250/500; keyword 50 |
| getListingsItem; searchCatalogItems; getCatalogItem (references) | https://developer-docs.amazon/sp-api/reference/getlistingsitem.md (and searchcatalogitems.md, getcatalogitem.md) | 2026-10-14 | 5/10; 2/2; 2/2 |
| Catalog Items API v2022-04-01 Reference | https://developer-docs.amazon/sp-api/docs/catalog-items-api-v2022-04-01-reference.md | 2026-10-14 | Shows 5/5 for both operations |
| Listings Items, Product Type Definitions, Catalog Items, Finances 2024-06-19, Product Pricing v0 and 2022-05-01, Data Kiosk models | https://github.com/amzn/selling-partner-api-models/tree/main/models | 2026-10-14 | `sellerId` parameters; seller-id reply fields; default plans |
| Notification Type Values | https://developer-docs.amazon/sp-api/docs/notification-type-values.md | 2026-10-14 | `LISTINGS_ITEM_STATUS_CHANGE` `SellerId` |
| Marketplace IDs | https://developer-docs.amazon/sp-api/docs/marketplace-ids.md | 2026-10-14 | Store ids by region |
| SP-API Deprecations | https://developer-docs.amazon/sp-api/docs/sp-api-deprecations.md | 2026-10-14 | Finances v0 events deprecated; getPricing, listTransactions not listed |
| Quick Tip: find your Merchant Token / Seller ID (Seller Forums) | https://sellercentral-europe.amazon.com/seller-forums/discussions/t/82392cdf-6537-400d-a377-d2a5a45616d4 | 2026-10-14 | Merchant Token path; "sometimes referred to as a Seller ID" |
| GitHub issue #383 | https://github.com/amzn/selling-partner-api-models/issues/383 | 2026-10-14 | "we do not offer an API to pull Seller information"; practitioners |
| GitHub issue #4076 | https://github.com/amzn/selling-partner-api-models/issues/4076 | 2026-10-14 | selling_partner_id vs seller id request |
| GitHub issue #1179 | https://github.com/amzn/selling-partner-api-models/issues/1179 | 2026-10-14 | 403 body text; staff answers on region and re-token |
| Amazon Marketplace Participations Report (Sellers API), Trellis | https://gotrellis.com/reports/amazon-marketplace-participations-report | 2026-10-14 | Columns; "Non-Amazon" rows; vendor 403 |
| How to find your Amazon Seller ID, Daasity | https://support.daasity.com/migrated/knowledge/get-amazon-seller-id | 2026-10-14 | Merchant Token = Seller ID |
| Amazon SP-API Rate Limits: The Complete 2026 Guide, Nova Analytics | https://novadata.io/resources/blog/amazon-sp-api-rate-limits-guide | 2026-10-14 | Practitioner limits; disagreements |
| Exponential Backoff And Jitter, AWS Architecture Blog | https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/ | 2026-10-14 | Jitter simulation |
| Amazon Ads API overview | https://advertising.amazon.com/API/docs/en-us/guides/get-started/overview | 2026-10-14 | unreachable at this URL: the page served only its title ("Amazon Ads Advanced Tools Center") to the fetch tool and, on a retry at reconciliation, to a plain HTTP read; its text is drawn by script. Not cited for any claim. Ads access is covered in angles/paid-keywords.md, which read the onboarding overview at …/guides/onboarding/overview |
| Internal: SP-API door SKILL.md and references/door.md (origin/main) | comchatx `src/source-packages/amazon-sp-api/box/skills/amazon-sp-api/` | 2026-10-14 | Door holds no seller id; two routes; headers; no retries |
| Internal: run reports day 1 and day 2 | office-mailbox/from-engineering/20261013-0904-…, 20261014-0921-… | 2026-10-14 | 403 `Unauthorized` on non-paths; 429 on createReport; seller id taken from Keepa Buy Box |

## Open questions

1. **Is `selling_partner_id` the Listings `sellerId`?** Amazon's pages describe both as "selling partner identifier" but never equate them. One developer (issue #4076) suggests they can differ. *Settles it:* the first connection made through the website workflow. Compare the `selling_partner_id` Amazon hands over with `SKUIdentifier.SellerId` from a `getPricing` by SKU, then use it on `getListingsItem`.
2. **Which SP-API role carries the seller-analytics PAAM rights** (`analytics_sales_and_traffic_view_pa`, `analytics_sales_and_lending_view`)? The Data Kiosk operations list only Brand Analytics, the correction gives Economics to Selling Partner Insights, and the role pages the correction links are gone. *Settles it:* the first `createQuery` on `analytics_sellerAnalytics_2025_03_31` and on `analytics_economics_2024_03_15` under the seller's actual roles; Amazon's authorization error names the gap. Also a re-read of the role-mappings page when Amazon updates it.
3. **`getAccount`'s role.** AISP alone (December 2024 note), Finance and Accounting alone (use-case page), or either (role mapping)? It is EU-only, so it matters only for an EU connection. *Settles it:* a first EU call.
4. **What a "Non-Amazon" participation row is** (Trellis). No Amazon page describes one. *Settles it:* the first real reply's rows, matched against the Marketplace IDs table.
5. **Which roles the seller's connection holds today.** No API lists an application's granted roles to the seller's box. The developer sees them in the Solution Provider Portal. *Settles it:* the platform's app registration, written once into door.md, rather than probing with calls.
6. **Whether Amazon's 403 body for a non-existent path is identical to a missing-role 403.** Day 1 shows `Unauthorized` for both shapes, but the internal report did not keep the full body text. *Settles it:* the landed raw record of the next such 403, compared with a known role refusal.

## Positions

1. **P-sp-api-access-1.** cx learns the seller's stores from `getMarketplaceParticipations` on each connected origin. It keeps the rows whose `marketplace.id` is in Amazon's Marketplace IDs table, and takes the store's language and currency from that row. Sources: sellers.json; Marketplace IDs; Amazon Marketplace Participations Report (Trellis).
2. **P-sp-api-access-2.** cx never looks for the seller id in a Sellers API reply, because neither reply carries one. Sources: sellers.json; Sellers API.
3. **P-sp-api-access-3.** Before any `{sellerId}` path, cx takes the seller id from an Amazon reply that names the requesting seller: `getPricing` by SKU, FOEP `offerIdentifier.sellerId`, or `listTransactions`. It never takes the id from Keepa's Buy Box seller or from a featured-offer field, which can name another seller. Sources: productPricingV0.json; productPricing_2022-05-01.json; finances_2024-06-19.json; Role Mappings for SP-API Operations.
4. **P-sp-api-access-4.** cx keeps the seller id with the origin it was read on and reads it again for another region, because each regional account has its own id. Sources: Usage Plans and Rate Limits; Authorize Private Applications.
5. **P-sp-api-access-5.** When a listing read returns 403, cx first checks the path and version against Amazon's model and the origin against the store's region. Only then does it name a missing role, using the operation's row in the role mapping, and it never reports a 403 as a listing problem. Sources: Resolve Common HTTP and Authorization Error Codes; Role Mappings for SP-API Operations; GitHub issue #1179.
6. **P-sp-api-access-6.** cx tells the seller which role an unread source needs. Brand Analytics covers SQP, Search Catalog Performance, Search Terms, Sales and Traffic, coupons and the Data Kiosk operations. Selling Partner Insights covers seller performance and seller promotion reports. Pricing covers FOEP and competitive summary. Finance and Accounting covers transactions and settlements. Product Listing, or Inventory and Order Tracking, covers Listings Items and product-type schemas, and Product Listing alone covers Catalog Items. For a Data Kiosk dataset that `createQuery` refuses, cx names the field from Amazon's authorization error and says that Amazon's pages disagree on the role (Economics: Selling Partner Insights in the correction, Brand Analytics on Role Mappings and the Data Kiosk API page; seller analytics: PAAM rights with no role named); it does not name one role as certain. Sources: Role Mappings for SP-API Operations; Role Mappings for SP-API Types; Analytics Reports; Performance Reports; Data Kiosk API; Correction: Data Kiosk role requirements.
7. **P-sp-api-access-7.** For Brand Analytics reports, cx says that two gates apply, the application's role and the seller's Brand Registry status (plus brand representative for Search Terms), and it reads the answer from Amazon's acceptance or `FATAL`. Sources: Analytics Reports.
8. **P-sp-api-access-8.** For Data Kiosk, cx treats an authorization error on `createQuery` as "this field is not open to this connection", never as zero, and names the field. Sources: Data Kiosk API; Seller Analytics Dataset Use Case Guide.
9. **P-sp-api-access-9.** cx never asks for a Restricted Data Token for listing, catalog, product-type, pricing, finance, Brand Analytics or Data Kiosk reads. Sources: Tokens API; Authorization with the Restricted Data Token; Get authorization to access restricted report types with PII information.
10. **P-sp-api-access-10.** cx uses the grantless door header only for operations on Amazon's grantless list. It sends product-type search, subscriptions and every listing read on the seller's authorization. Sources: Grantless Operations; Role Mappings for SP-API Operations; definitionsProductTypes_2020-09-01.json.
11. **P-sp-api-access-11.** cx treats published rates as defaults, reads `x-amzn-RateLimit-Limit` from the receipt when present, and does not quote a fixed rate to the seller. Sources: Usage Plans and Rate Limits; Listings Items API Rate Limits; Catalog Items API Rate Limits; Catalog Items API v2022-04-01 Reference.
12. **P-sp-api-access-12.** On a 429, cx waits and retries with growing, jittered waits up to a stated cap and count, and tells the seller the source was throttled, not that it failed. Sources: Usage Plans and Rate Limits; Optimize Rate Limits for Application Workloads; Resolve Common HTTP and Authorization Error Codes.
13. **P-sp-api-access-13.** When a role is added to the application, cx tells the seller that the connection must be re-authorized before the new reads work. Sources: Selling Partner API Roles; Resolve Common HTTP and Authorization Error Codes; GitHub issue #1179.
14. **P-sp-api-access-14.** Before diagnosing one listing's lost buyability, cx checks `hasSuspendedListings` for the store, an account-level Inactive status that would explain every listing at once. Sources: sellers.json; Amazon Marketplace Participations Report (Trellis).
15. **P-sp-api-access-15.** cx calls `getAccount` only on an EU connection. Sources: Get the account information of a seller; Role Mappings for SP-API Operations.

### The seat's own (not for a skill)

- The platform could capture `selling_partner_id` at connection time and hand it to the box, which would remove the lookup altogether. This is a product suggestion; door.md says today's door holds none.
- For a connection that holds only Product Listing, `getPricing` by SKU is the one seller-id route that needs no further role. This is a reading of the role rows, not an Amazon statement.
- Amazon applies the report **type**'s role, not the `createReport` operation row (C4). This rests on one internal 202, not on an Amazon sentence.

## Verification

Gap fill 2026-10-14: 5 gaps filled, 0 left open.
- Filled: (1) how cx learns its seller id and marketplaces (Sellers API fields, no seller id in either reply, `selling_partner_id` at authorization, four replies that name the seller, per-region ids); (2) per-operation role map (C3, with Amazon's own inconsistencies C4, A5); (3) RDT scope (D1–D4); (4) usage-plan mechanics (F1–F8: header, token bucket, pair, dynamic plans, 429 and back-off, figure conflicts); (5) grantless operations and their separate token (E1–E5; product-type search is not grantless).
- Sub-questions left open (see Open questions 1–6): `selling_partner_id` vs `sellerId` equality; the role behind PAAM rights; `getAccount`'s role; "Non-Amazon" rows; granted roles not readable from the box; 403 body for a non-path.
- Adversarial re-check: the cited Amazon pages were downloaded again into a fresh directory, as Markdown or as model JSON. 47 quoted phrases were matched by exact text search against them, with 0 misses. The phrases came from Selling Partner API Roles, Role Mappings for SP-API Operations, Usage Plans and Rate Limits, Grantless Operations, Tokens API, Authorization with the RDT, restricted report types, Resolve Common HTTP and Authorization Error Codes, Troubleshoot SP-API Errors, Website Authorization Workflow, Get the account information of a seller, Data Kiosk API, the Data Kiosk correction, Seller Analytics guide, Optimize Rate Limits, Listings Items API Rate Limits, Authorize Private Applications, Connecting to the SP-API, Release Notes, and the sellers, productPricing_2022-05-01, finances_2024-06-19 models and Notification Type Values. The role-map rows and rate figures (C3, F8) were extracted programmatically from the same pages and models in this session. Practitioner quotes (Trellis, Daasity, Nova Analytics, KJ_Amazon) were read once through the fetch tool and are tagged accordingly. The GitHub issue texts (#383, #1179, #4076) were read through GitHub's issues API.

Reconciled 2026-10-14, against the critics' contradictions list. Sources re-read this session: the Listings Items, Catalog Items, Product Type Definitions, Sellers and Data Kiosk models (raw GitHub, `main`); Listings Items API Rate Limits; Catalog Items API Rate Limits; Catalog Items API v2022-04-01 Reference; the `getListingsItem`, `getCatalogItem` and `searchCatalogItems` reference pages; Role Mappings for SP-API Operations (Data Kiosk section); Data Kiosk API; Correction: Data Kiosk role requirements; Performance Reports (promotion and coupon rows).
1. **Rate limits (Catalog 2/2 vs 5/5; Listings burst 5 vs 10).** This file already carried both figures; every figure in F8 was re-read and is unchanged. F8 now names both disagreements plainly, adds the Listings per-application figures, notes that the rate-limits page's burst-10 table belongs to v2020-09-01, and states that the binding value is the `x-amzn-RateLimit-Limit` header, else the model's default read at run time. Stable line 13 says the same without a figure. Files that quote one figure alone are the ones to correct, not this file.
2. **Data Kiosk role (Brand Analytics vs Selling Partner Insights vs PAAM).** Re-read: Role Mappings and the Data Kiosk API page still list Brand Analytics alone for all five operations, and the correction still gives Economics to Selling Partner Insights. C5 now states the disagreement and names the `createQuery` reply as the binding answer. The C3 Data Kiosk row, stable line 9 and P-sp-api-access-6 no longer present "Brand Analytics covers Data Kiosk" or "Selling Partner Insights covers Economics" as settled.
3. **Promotion and coupon report roles.** Re-read Performance Reports: promotion is Selling Partner Insights for sellers and Brand Analytics for vendors; the seller coupon report is Brand Analytics. This file (C3) and `angles/seasonality-and-events.md` agree. The files that cite the reports without the split are the ones to correct. No change here.
4. **Seller-id route ("no file names the Sellers API").** This file names the Sellers API (A1–A3) and says neither reply carries a seller id; its routes (B5) match `angles/listing-content-and-health.md`'s reconciled item 28. No change.
5. **Help-page reachability.** This file cites no Seller Central help page, so it has no capture to substitute. The one page it marks unreachable, the Amazon Ads API overview, was retried at reconciliation. It still serves only its title, so the row now says so and says the page is cited for no claim. `angles/paid-keywords.md` read a different Ads page, the onboarding overview, so the two files do not conflict.
6. A8 pointed to "(see D)" for the rate header. It now points to F4.
7. Stable line 10 said "eight documented causes", a count that sits on an Amazon page Amazon can change. It now says "several documented causes".
