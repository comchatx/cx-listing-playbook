# Trigger families: what market change looks like in the data, and how often to look

Read 2026-10-14 by the research seat. Tags: [official] Amazon's own page or document; [opinion] a named practitioner; [research] published research; [seat] the seat's own reasoning, never a skill position.

## What this covers

**Funnel stage:** cross-cutting. A trigger tells cx why to look at a listing again. It does not tell cx what to change. The four families are the roadmap's (§1.1): competitor moves, demand changes, own-listing signals, and constraints (stock, Featured Offer / Buy Box, suppression, rule changes). Each signal touches a stage in its own way:

- A demand move changes **exposure**: query volume, impressions.
- A competitor's price, coupon or main-image change hits **click-through** and **conversion**.
- Suppression removes the listing from the funnel entirely. `DISCOVERABLE` absent means not searchable. `BUYABLE` absent means not buyable.
- A lost Featured Offer or a stock-out cuts **conversion** whatever the content says.

**Skills fed:**
- `listing-review`: its trigger-families section and "which source carries which figure".
- `/listing-watch`: the standing-instruction file it writes.
- `effect-review`: indirectly. The same signals are the confounders that must be ruled out before a verdict.

**Why a senior operator cares:** most of what moves a listing's numbers is not the listing. An operator who rewrites a title because sessions fell, when the real cause was a competitor's coupon, an empty FBA bin or a seasonal query dip, has wasted the change. The baseline is then polluted for the next one too. The first discipline is: *which family fired, which stage, which file proves it*. The second is cadence. Amazon's data arrives on several clocks: hourly (push only), near real-time, daily, two days late, weekly, and about 45 days late for returns. Looking faster than the data refreshes buys noise, not signal.

The day-2 run makes the gap concrete:
- cx answered "a day later" with a to-do list and "named nothing to watch in the market".
- On day 1 it "picked three of five competitors before knowing what they were".
- Yesterday's market survived only in chat text, because a `--source keepa` read overwrote `product.json`. That overwrite is the day-2 report's own observation (lesson 6); neither Keepa's documents nor the box's Keepa skill state it, and the skill does say a kept reply can be re-read with `cx raw keepa --record <id>`.

Sources: internal run reports 20261013-0904 and 20261014-0921, read for behaviour only.

## Amazon's own rules and guidance

### A. Push signals Amazon offers (Notifications API): what exists, what each carries, who can get it

These are **RULE**-level facts about availability. Each type exists, needs a role, and needs a destination.

**Destinations need the developer's own AWS account.** Notifications go to an Amazon SQS queue or to Amazon EventBridge. The EventBridge tutorial's prerequisite is "An AWS account. This AWS account will be responsible for charges related to receiving notifications." and "You can only create one EventBridge destination per AWS account." [official] (Set up notifications using the Amazon EventBridge workflow, https://developer-docs.amazon/sp-api/docs/set-up-notifications-with-amazon-eventbridge, read 2026-10-14; developer-docs.amazon.com now 301-redirects to developer-docs.amazon).

**Which types go to EventBridge.** Seven listing-side types do: `BRANDED_ITEM_CONTENT_CHANGE`, `ITEM_PRODUCT_TYPE_CHANGE`, `LISTINGS_ITEM_STATUS_CHANGE`, `LISTINGS_ITEM_ISSUES_CHANGE`, `LISTINGS_ITEM_MFN_QUANTITY_CHANGE`, `PRODUCT_TYPE_DEFINITIONS_CHANGE`, `SHIPMENT_TRACKING_MILESTONE_CHANGED`. "If you want to receive any other notification type, skip this tutorial." Every other type goes to SQS [official] (same page).

**Amazon's guidance on push versus polling (GUIDANCE, phrased strongly):**
- "To minimize throttling errors, you must use push notifications to receive real-time updates for status changes and issues with listings." [official] (Listings APIs FAQ, https://developer-docs.amazon/sp-api/docs/listings-apis-faq, read 2026-10-14).
- "Rely on push notifications instead of polling mechanisms."
- "Code naturally against events rather than running on a loop. If you use events, you don't need a timer." [official] (Usage Plans and Rate Limits, https://developer-docs.amazon/sp-api/docs/usage-plans-and-rate-limits, read 2026-10-14).

**The trigger-relevant types, verified on the Notification Type Values page** [official] (Notification Type Values, https://developer-docs.amazon/sp-api/docs/notification-type-values, read 2026-10-14), except `DATA_KIOSK_QUERY_PROCESSING_FINISHED`, which is not on that page and is described on its own page (Data Kiosk Query Processing Finished Notification, https://developer-docs.amazon/sp-api/docs/data-kiosk-notification, read 2026-10-14). Roles come from Role Mappings for SP-API Types (https://developer-docs.amazon/sp-api/docs/role-mappings-for-types, read 2026-10-14). Payload fields come from the model JSON at github.com/amzn/selling-partner-api-models, `main` at commit `bad4c9b6ad6a88fc57d9aa98760901d8c8c47179`, 2026-10-13.

| Type | Family | What fires it (Amazon's words) | What it carries | Destination / role |
|---|---|---|---|---|
| `ANY_OFFER_CHANGED` | competitor, constraint | "sent whenever there is a change to any of the top 20 offers, by condition (new or used), or if the external price (the price from other retailers) changes for an item that you sell, or if there is a change to which offer wins the BuyBox, or a change to the BuyBox price". Top 20 is by landed price ("price plus shipping minus Amazon Points"). `OfferChangeType` is `External` ("The CompetitivePriceThreshold in the Summary object has changed"), `Internal` ("The price of an offer on Amazon's retail website has changed") or `Featured Offer` ("The Buy Box winner or Buy Box price has changed"). | Top 20 offers, `NumberOfOffers`, `LowestPrices`, `BuyBoxPrices`, `ListPrice`, `SalesRankings`, `NumberOfBuyBoxEligibleOffers`, `CompetitivePriceThreshold` | SQS / Pricing. **"You will only receive `ANY_OFFER_CHANGED` notifications for items for which you have active offers."** It cannot watch a competitor's own ASIN. |
| `PRICING_HEALTH` | constraint | "sent whenever a seller offer is ineligible to be the Featured Offer" because of an uncompetitive price | `merchantOffer`, `buyBoxPrices`, `salesRankings`, reference prices (`averageSellingPrice`, `competitivePriceThreshold`, `retailOfferPrice`, `msrpPrice`) | SQS / Pricing |
| `BRANDED_ITEM_CONTENT_CHANGE` | own-listing | "whenever there is a change to the title, description, bullet points, or images" of an ASIN where the seller "has a brand relationship" (verified brand owner under Amazon Registered Brands) | `MarketplaceId`, `BrandName`, `Asin`, `AttributesChanged` (`bullet_point`, `item_name`, `product_description`, image attributes). The model schema's description says "for now if any image changes all the image attributes will be present in the notification"; the docs page now says only that the number of image values "does not necessarily match the number of images changed". Either way an image entry means "some image changed", not which. No before/after values. | EventBridge / Product Listing |
| `LISTINGS_ITEM_ISSUES_CHANGE` | constraint | "triggered when an issue on a listing is either created, fixed, or updated" | Payload 2023-12-13: `Severities` (`ERROR`, `WARNING`, `NONE`), `EnforcementActions` (`LISTING_SUPPRESSED`, `ATTRIBUTE_SUPPRESSED`, `CATALOG_ITEM_REMOVED`, `SEARCH_SUPPRESSED`) | EventBridge / Product Listing. Payload 1.0's removal date is August 26, 2026 (SP-API Deprecations Schedule). |
| `LISTINGS_ITEM_STATUS_CHANGE` | constraint | status of a listings item changes | `Status` array: `BUYABLE`, `DISCOVERABLE`, `DELETED`; "When omitted, the listings item is non-buyable" | EventBridge |
| `ITEM_PRODUCT_TYPE_CHANGE` | constraint (rules) | product type of a brand-relationship item changes | `PreviousProductType`, `CurrentProductType` | EventBridge |
| `PRODUCT_TYPE_DEFINITIONS_CHANGE` | constraint (rules) | "sent whenever there is a new Product Type or Product Type Version" | `ProductTypeVersion`, `NewProductTypes` | EventBridge |
| `DETAIL_PAGE_TRAFFIC_EVENT` | own-listing | "sent five minutes after the beginning of each hour"; covers "the hour before the previous hour", plus "any delayed data from up to 24 hours earlier"; only "ASINs that have glance views are included" | **`glanceViews` only**, per ASIN per hour. No sessions, no conversion. | SQS / **Brand Analytics** |
| `ITEM_SALES_EVENT_CHANGE` | own-listing | sent five minutes after each hour; covers "the previous hour" plus delayed data up to 24 hours; ASINs "included when they have orders or cancellations" | `orderedUnits` ("can be negative if there are more cancellations than orders"), `orderedRevenue` | SQS / Brand Analytics |
| `ITEM_INVENTORY_EVENT_CHANGE` | constraint | sent five minutes after each hour; covers "the previous hour" plus delayed data up to 24 hours; ASINs whose units available for purchase changed | `highlyAvailableInventory` | SQS / Brand Analytics |
| `FBA_INVENTORY_AVAILABILITY_CHANGES` | constraint | change in FBA inventory | fulfillable, unfulfillable, inbound, reserved per marketplace | SQS |
| `B2B_ANY_OFFER_CHANGED` (gap fill) | competitor (Amazon Business) | "sent whenever there is a change in any of the top 20 B2B offers for Amazon Business, in the form of any price change (for single-unit and seven pre-defined quantity discount tiers: 2, 3, 5, 10, 20, 30, and 50) for an item listed by the seller". Top 20 by "the single-unit landed price, which is the price plus shipping". | `OfferChangeTrigger`, `Summary`, `Offers` (top 20 B2B offers), `SellerId`; payload 1.0 | SQS / Pricing. Same scope rule as the consumer type: "You will only receive `B2B_ANY_OFFER_CHANGED` notifications for items for which the seller has active offers." |
| `ACCOUNT_STATUS_CHANGED` (gap fill) | constraint (account) | "published whenever the selling partner's account status changes between `NORMAL`, `AT_RISK`, and `DEACTIVATED`" | payload 2021-01-01 | SQS / Selling Partner Insights |
| `FEE_PROMOTION` (gap fill) | constraint (fees) | "Sent when a promotion becomes active"; on first subscription "the seller receives all currently active promotions" | promotion details; "The estimated fees returned by this API are not guaranteed" | SQS |
| `REPORT_PROCESSING_FINISHED` / `DATA_KIOSK_QUERY_PROCESSING_FINISHED` | plumbing | a report "reaches a report processing status of DONE, CANCELLED, or FATAL" / a Data Kiosk query "finishes processing" (its own page) | `processingStatus`, `reportDocumentId` / `processingStatus`, `dataDocumentId` (only "when there is data available"), `errorDocumentId` | SQS |

**Latency Amazon states for push:**
- For listing notifications: "a 15-20 minute delay for the LISTINGS_ITEM_ISSUES_CHANGE and LISTINGS_ITEM_STATUS_CHANGE notifications is normal. Our data sources can be up to 15 minutes behind."
- For a direct read, `getListingsItem` "directly queries the current state, which is why the results are available faster (within 1-5 minutes)" [official] (Listings APIs FAQ).
- The Notifications API overview advises a fallback to "retrieve needed information in the event of an unexpected outage or delay in notification delivery" [official] (Notifications API, https://developer-docs.amazon/sp-api/docs/notifications-api, read 2026-10-14). The overview itself states no delivery guarantee. The SQS tutorial does state the delivery terms; see A2 (gap fill).

**Two pricing facts that bear on reading these signals** [official] (Product Pricing API and Notifications FAQ, https://developer-docs.amazon/sp-api/docs/pricing-faq, read 2026-10-14):
- `PRICING_HEALTH` "doesn't mean that the offer has lost placement as the Featured Offer because of competitors. It means that Amazon cannot select the offer as the Featured Offer at the current price, regardless of changes to price or stock of competitors."
- The Competitive External Price is "the lowest price for an item, or items that customers might consider being equivalent, recently found at another reputable retailer outside the Amazon store."

A Featured Offer loss can therefore be triggered by a price **outside** Amazon. No Amazon competitor needs to have moved. (RULE-level: it is how eligibility is decided.)

### A2. Subscription mechanics and delivery terms (gap fill, 2026-10-14)

The three gap-fill rows in the table above come from Notification Type Values (B2B and account-status text, payload versions, the `FEE_PROMOTION` first-subscription and fee-estimate sentences), the SQS tutorial (the `FEE_PROMOTION` one-line description and its list of SQS types) and Role Mappings for SP-API Types (Pricing for `B2B_ANY_OFFER_CHANGED`, Selling Partner Insights for `ACCOUNT_STATUS_CHANGED`). All were read 2026-10-14.

**A trigger is only real if something can receive it.** The receiving side is a chain of three calls and one AWS resource. All of it is RULE: the API refuses otherwise.

1. **An AWS account and a queue or bus come first.** The SQS tutorial's prerequisites are "Authorization from the selling partners", "An AWS Account" and "An Amazon Simple Queue Service (SQS) queue". Step 1 is to "grant the Selling Partner API permission to write to your SQS queue". With server-side encryption, Step 2 also grants Amazon's account access to the KMS key. [official] (Set up notifications using the Amazon Simple Queue Service workflow, https://developer-docs.amazon/sp-api/docs/set-up-notifications-with-amazon-sqs, read 2026-10-14). The EventBridge route has the same AWS-account prerequisite (section A above).
2. **`createDestination` is grantless.** It "does not require authorization from any selling partner". The destination is one of two resource types. `sqs.arn` must match `^arn:aws:sqs:\S+:\S+:\S+`. `eventBridge` takes `accountId` and `region` ("The AWS region in which you will be receiving the notifications"). "Applications should use one resource type (sqs or eventBridge) per destination." [official] (same tutorial; createDestination, https://developer-docs.amazon/sp-api/reference/createdestination, read 2026-10-14). `getDestination(s)`, `deleteDestination`, `getSubscriptionById` and `deleteSubscriptionById` are grantless too [official] (Notifications API, roles section).
3. **`createSubscription` is made once per `notificationType`.** It requires the role "associated with the notification type". Body: `payloadVersion` (required), `destinationId` (required), `processingDirective` (optional). "We allow multiple subscriptions with different payload versions per application, notification type, and party (seller/vendor)." The `PayloadVersion` together with the `NotificationType` "controls the structure of the `Payload object`". [official] (Notifications API; SQS tutorial; createSubscription, https://developer-docs.amazon/sp-api/reference/createsubscription, read 2026-10-14)

**Filtering and throttling at the source (`processingDirective`):**
- `eventFilter` "is currently only supported for use with the `ANY_OFFER_CHANGED`, `ORDER_CHANGE`, and `SHIPMENT_TRACKING_MILESTONE_CHANGED` notification types". "Usage with an unsupported notification type results in a request failure with an HTTP 400 response." `eventFilterType` is required inside it. [official] (SQS tutorial)
- `aggregationSettings.aggregationTimePeriod` takes `FiveMinutes` or `TenMinutes`. The table lists it for `ANY_OFFER_CHANGED` only. Amazon's own example: "if FiveMinutes is the value chosen, and 50 price updates occur for an ASIN within 5 minutes, Amazon will send only two notifications; one for the first event, and then a subsequent notification 5 minutes later with the final end state of the data. The 48 interim events will be dropped." [official] (createSubscription, `AggregationTimePeriod`; SQS tutorial)
- `marketplaceIds` ("To receive notifications for every Amazon store, do not provide this list") is likewise listed for `ANY_OFFER_CHANGED` only. The tutorial says outright: "Note that `marketplaceIds` is not a supported filter for `ORDER_CHANGE`." `ORDER_CHANGE`'s own filter is `orderChangeTypes` (`BuyerRequestedChange`, `DeliveryTipChange`, `OrderStatusChange`). [official] (SQS tutorial; Subscribe to the ORDER_CHANGE Notification, https://developer-docs.amazon/sp-api/docs/tutorial-subscribe-to-order-change-notification, read 2026-10-14). **Correction to the gap brief:** Amazon's pages give `ORDER_CHANGE` no marketplace or aggregation filter. The model's `EventFilter` schema does allow all filter objects together (`allOf`). The narrower per-type table is the documented behaviour.
- `filterExpression` (added in the May 27, 2026 release) is a CEL expression on payload fields. It covers more types, including `ANY_OFFER_CHANGED`, `B2B_ANY_OFFER_CHANGED`, `PRICING_HEALTH`, `DETAIL_PAGE_TRAFFIC_EVENT`, `ITEM_SALES_EVENT_CHANGE`, `ITEM_INVENTORY_EVENT_CHANGE`, `FBA_INVENTORY_AVAILABILITY_CHANGES`, `ACCOUNT_STATUS_CHANGED`, `FEE_PROMOTION` and `REPORT_PROCESSING_FINISHED`. It does **not** cover the listing types (`LISTINGS_ITEM_ISSUES_CHANGE`, `LISTINGS_ITEM_STATUS_CHANGE`, `LISTINGS_ITEM_MFN_QUANTITY_CHANGE`, `BRANDED_ITEM_CONTENT_CHANGE`, `ITEM_PRODUCT_TYPE_CHANGE`, `PRODUCT_TYPE_DEFINITIONS_CHANGE`).
  - "You cannot use `eventFilter` and `filterExpression` together"; "If you need both aggregation and filtering, continue to use `eventFilter`."
  - Arithmetic and `[]` indexing are not supported.
  - A trap: "If your `filterExpression` references a field that is absent from the payload, the filter evaluation fails at runtime and the event is dropped". Guard such fields with `has()`.

  [official] (Create and Filter Notification Subscriptions, https://developer-docs.amazon/sp-api/docs/filter-notification-subscriptions, read 2026-10-14; SP-API Release Notes, May 27, 2026)

**Delivery terms (RULE: the receiver must be built for them):**
- "Selling Partner API does not support delivery to FIFO queues. You must use Amazon SQS standard queues".
- "Selling Partner API standard queues do not guarantee that notifications will be received in the order they were sent … you must design your application to accept notifications in any order."
- "Amazon SQS standard queue notifications might be delivered more than once … you must design your application to accept multiple copies of any given notification."
- "You can determine if a notification is a duplicate … by looking at the `notificationId` property", found in the notification's metadata object. The table there spells it `NotificationMetadata.NotificationId`, beside `SubscriptionId`, `PublishTime` ("the notification was sent") and `EventTime` ("the event which triggered the notification occurred").

[official] (Set up notifications using the Amazon Simple Queue Service workflow, read 2026-10-14). The EventBridge tutorial says nothing about duplicates or ordering (read 2026-10-14). The SQS terms are the only stated ones.

**What this means for triggers (RULE consequence plus [seat] reading):**
- Without an AWS account, a standard SQS queue (or an EventBridge bus) and a consumer, none of the push types exists for the box.
- With one, a single competitor price move can arrive as two `ANY_OFFER_CHANGED` messages, or as an aggregated pair. A trigger must count deduplicated events (by `NotificationId`) and order them by `EventTime`, not by arrival. [seat] The ordering-by-`EventTime` step is the seat's inference from Amazon's field definitions.

### B. Pull sources: which report, dataset or operation carries each signal, and on what clock

**Sales and Traffic report** (`GET_SALES_AND_TRAFFIC_REPORT`):
- Carries sessions, page views, "buy box percentage", "unit session percentage" (with B2B variants) and ordered sales/units.
- `dateGranularity` `DAY|WEEK|MONTH`; `asinGranularity` `PARENT|CHILD|SKU`; start date at most two years back.
- "If the expanded `dataEndTime` value is in the future, then the report will contain partial data for the most recent report period."
- Rate: "You can request this report up to three times every five minutes." The same note advises "Cache results locally rather than re-requesting the same date ranges" and "Use date ranges between 7 and 30 days to reduce processing time". The report "can be requested or scheduled".
- A `CANCELLED` report is not necessarily an error: one of the three reasons Amazon gives is "No data can be found for the report" [official] (Reports API FAQ, https://developer-docs.amazon/sp-api/docs/reports-faq, read 2026-10-14).
- **The page states no data latency** [official] (Analytics Reports, https://developer-docs.amazon/sp-api/docs/report-type-values-analytics, read 2026-10-14).
- Role: Brand Analytics (Role Mappings for SP-API Types).

**Seller Central Business Reports, the same family seen in the web UI:**
- "'By date' reports update hourly with recent data, while other reports update daily."
- Data is viewable "for up to two years".
- The page advises "Set a consistent schedule for reviewing your B2B data" and "Compare similar periods like month-to-month for more accurate insights" (GUIDANCE) [official] (Get actionable B2B insights with Amazon business reports, https://sell.amazon.com/blog/amazon-business-reports, shown as "Aug 5, 2025" (metadata 2025-08-06 UTC), read 2026-10-14). The same page says "Some reports show real-time data, while others update daily".
- The Business Reports help pages, which the blog says hold "information about data timing", were read on 2026-10-14 through the help hub content call (captures under the office's capture folder (outside this repository); method/help-page-access.md C7). The first pass had called them unreachable (sign-in wall).
  - "Data for these reports is generally available for up to two years." "Business reports will have a lag of 24 hours when compared to the real-time data." [official] (Business reports, https://sellercentral.amazon.com/help/hub/reference/external/G200633570, version 8, read 2026-10-14)
  - "The "by date" reports are updated every hour with the data from the past few days, similar to the Sales dashboard. All other reports are updated daily and consist of data from the previous day. For instance, Wednesday's data is shared on Thursday. The data from the past week is shared by the end of each Sunday." "A week runs from Sunday through Saturday." "Since March 29, 2022, Page views and Sessions metrics include mobile app and browser traffic data". [official] (Business Reports FAQ, https://sellercentral.amazon.com/help/hub/reference/external/G28761, version 7, read 2026-10-14)
  - These are the Seller Central view's clocks. They do not state the `GET_SALES_AND_TRAFFIC_REPORT` API report's latency (Open question 1).

**Data Kiosk seller analytics dataset** (`analytics_sellerAnalytics_2025_03_31`, release note 2026-09-30):
- Clock: "All metrics in the seller analytics dataset are ready after 34 hours. Data for a given day is generally available at 10 AM local time two days later."
- Delayed data: "In the event that data is delayed and unavailable, the response is null for the specific date or dates for which data is unavailable." The guide adds that partial availability "occurs when data is requested within one to two business days", and that the `endDate` is "capped to the most recent date for which all requested metrics have data". A `null` in a grouped row can also mean "this metric is not available at this granularity", not zero.
- Returns: "Return data is computed with a delay of about 45 days". Returns are attributed to the ship day.
- Granularity: `aggregateBy` `DAY|WEEK|MONTH`. Weeks roll to Sunday–Saturday.
- Benchmarks: `weekOverWeek`, `yearOverYear` and others exist at `WEEK`/`MONTH` only. "No benchmarking is available at `DAY` granularity."
- Domains: sales, traffic (`sessions`, `pageViews`, `glanceViews`, `featureOfferGlanceViews`…), promotion, accountHealth, search (`search.query` per keyword with `impressionsWithPrice`, `clicksWithPrice`, `cartAddsWithPrice`, `purchasesWithPrice`; `search.catalog` adds `clickRate`, `conversionRate`), reviews (`lowRatingReviewCount`, `totalReviewCount`, `criticalReviewRate`), defects, returns.
- Reconciled 2026-10-14: three of the dataset's rate names do not mean what the Business Reports names suggest. The schema defines `traffic.featureOfferPct` over **glance views** ("dividing the number of times your offer is the Featured Offer by the number of times customers viewed it (that is, Glance Views)"), while Business Reports' Featured Offer % is over **page views** (section B, Featured Offer). `traffic.conversionRatePct` is "the percentage of purchases to clicks for ASINs originated from the search results page", not unit session percentage; `traffic.conversationRatePct` is the deprecated spelling ("No longer supported. Use conversionRatePct instead."). `search.catalog` `conversionRate` is "Percentage of impressions that resulted in a purchase". [official] (schema `analytics_sellerAnalytics_2025_03_31.graphql`, selling-partner-api-models `main` @ `bad4c9b6ad6a88fc57d9aa98760901d8c8c47179`, re-read 2026-10-14). A trigger on one of these compares like with like: the same field from the same source, its definition read from that source's schema at run time.
- The trailing 120-day product-defect snapshot metrics (accountHealth) carry extra date limits: at `DAY` start and end must be the same snapshot date; at `WEEK` "Eight weeks … the current week and the previous seven weeks"; at `MONTH` 24 months [official] (Seller Analytics Dataset Use Case Guide, https://developer-docs.amazon/sp-api/docs/seller-analytics-dataset-guide, read 2026-10-14; SP-API Release Notes, https://developer-docs.amazon/sp-api/docs/sp-api-release-notes, read 2026-10-14).

**Cadence guidance for Data Kiosk** (GUIDANCE): "The choice of rate depends on how often your data updates. For example, if your data updates daily, a daily frequency is appropriate. Do not query too frequently. If a dataset updates daily, an hourly query would be redundant." Also: "Query creation fails if the previous query is still running." [official] (Schedule Data Kiosk Queries, https://developer-docs.amazon/sp-api/docs/schedule-data-kiosk-queries, read 2026-10-14).

**Brand Analytics reports, the demand and competitive-position source.** Periods per report type (RULE: the SQP and Search Catalog Performance report schemas say a start or end date off the period boundary means "a fatal error returns", and that more than one marketplace means "a fatal error returns and report generation fails"):
- Search Query Performance: `WEEK|MONTH|QUARTER`. `asin` required, "There is a 200 character limit". "This report type supports only one marketplaceId per report" (schema). "Requests cannot span multiple periods". A `WEEK` runs Sunday to Saturday: the page says "`dataStartTime` must be a Sunday and `dataEndTime` must be a Saturday when `reportPeriod=WEEK`", and the schema says "dataStartTime must be a Sunday for the WEEK reportPeriod" and "dataEndTime must be a Saturday", "or else a fatal error returns" (both re-read 2026-10-14 at reconciliation; angles/paid-keywords.md has withdrawn its "not in the schema" note).
  - The page's "Maximum reporting periods" list gives "MONTH: 17 months" (N/A for the others) and defines the list as "The maximum reporting periods that you can specify using the `dataStartTime` and `dataEndTime` parameters", that is, a bound on a request's span, not a history depth. The same page also says SQP "Requests cannot span multiple periods". **Amazon's page states both, and they do not fit together for `MONTH`.** The page's separate "Maximum lookback windows (from the current date)" lists appear only under vendor reports; it states no lookback for SQP.
  - Amazon's only statement on how far back Brand Analytics goes is the blog's "usually goes back three years" (below). Business Reports in Seller Central keep "up to two years" (G200633570), and the Sales and Traffic API report refuses a `dataStartTime` "more than two years before the date of the request" (Analytics Reports). These are different products with different limits, not one figure.
  - The binding answer for SQP is the report's own result for the span requested (`DONE` with rows, `FATAL`, or `CANCELLED`), read at run time; method/report-lifecycle.md owns reading those states.
- Search Catalog Performance: `WEEK|MONTH|QUARTER`.
- Top Search Terms: `DAY|WEEK|MONTH|QUARTER`. "the most-clicked ASINs by search keyword and department"; the schema says "top-3 clicked ASINs", with `searchFrequencyRank`, `clickShare`, `clickShareRank` and `conversionShare`.
- Market Basket and Repeat Purchase: periods may span.

Source for all of the above: [official] (Analytics Reports; selling-partner-api-models `schemas/reports/sellingPartnerSearchQueryPerformanceReport.json`, `sellingPartnerSearchCatalogPerformanceReport.json`, `sellingPartnerSearchTermsReport.json`, read 2026-10-14). The same Analytics Reports page states availability clocks only for vendor reports (for example "weekly data … is available by the end of the day Tuesday", and a not-yet-available period returns `FATAL`); it states none for the seller Brand Analytics reports.

**What makes SQP the market's yardstick.** The Search Query Performance schema carries, per query and period:
- the market total: `searchQueryVolume`, `totalQueryImpressionCount`, `totalClickCount`, `totalClickRate`, `totalCartAddCount`, `totalPurchaseCount`, `totalPurchaseRate`, and median prices;
- the ASIN's part of it: `asinImpressionCount` / `asinImpressionShare`, `asinClickShare`, `asinCartAddShare`, `asinPurchaseShare`.

[official] (selling-partner-api-models `schemas/reports/sellingPartnerSearchQueryPerformanceReport.json`, read 2026-10-14). One file therefore separates "the query shrank" (demand) from "my share of the query shrank" (competition or listing).

**SQP counts paid placements too (reconciled 2026-10-14).** The Seller Central SQP page says the queries "includes organic and Sponsored Products originating from the search results page for all customers. It excludes traffic from widgets on the search page such as "Top Rated " or "New Arrivals."" It also advises: "we do not recommend comparing the metric names of data across different dashboards." [official] (Search Query Performance dashboard, https://sellercentral.amazon.com/help/hub/reference/external/G8J4CB5ZBF3NX7TP, version 5, capture read 2026-10-14). The SQP report schema itself says nothing on sponsored results; the Search Catalog Performance schema says "Impressions include sponsored search results". So a fall in the ASIN's share can come from the seller's own ad change (D4) as well as from a competitor or the listing. angles/search-rank-and-volume.md's note that this page was unreachable is superseded by the capture.

**Brand Analytics latency, Amazon's only statement found:** "Data in Brand Analytics usually goes back three years and is generally available within three days, with quarter-end data typically available within one week." [official] (What is Amazon Brand Analytics?, https://sell.amazon.com/blog/brand-analytics, published 2025-10-08, read 2026-10-14). The sentence sits in the Demographics section but is phrased about "Data in Brand Analytics". Whether SQP's API report follows the same clock is not stated on the API page.

**Listing state and suppression:**
- `getListingsItem` / `searchListingsItems` with `includedData=issues` give issues with `severity` (`ERROR`, `WARNING`, `INFO`), `categories` and `enforcements`.
- `summaries.status` gives `BUYABLE` / `DISCOVERABLE` [official] (listingsItems_2021-08-01.json, read 2026-10-14).
- Amazon's own description of the issue lifecycle: "**Accepted** does not mean the process is complete. Multiple downstream processes create the item in the Amazon catalog, and any of these processes can generate issues that return asynchronously" [official] (Manage Listings Issues, https://developer-docs.amazon/sp-api/docs/manage-listings-issues, read 2026-10-14).
- Release note 2026-09-30: "Added PRODUCT-level and LISTING-level issue classification to the `categories` attribute."
- Report-side: Suppressed Listings Report `GET_MERCHANTS_LISTINGS_FYP_REPORT` ("Contains suppressed listings, the reason each listing is suppressed, and instructions for removing each suppression"; the one report on its page that can be scheduled) and Inactive Listings Report `GET_MERCHANT_LISTINGS_INACTIVE_DATA`.
- Listing reports may come from a cache "between one and six hours depending on the number of entries" [official] (Inventory Reports, https://developer-docs.amazon/sp-api/docs/report-type-values-inventory, read 2026-10-14).

**Featured Offer and price position, pulled:**
- `getCompetitiveSummary` (Product Pricing 2022-05-01, batch) returns `featuredBuyingOptions` (with segment `glanceViewWeightPercentage`), `referencePrices`, `lowestPricedOffers` and **`similarItems`**: "a list of up to 20 ASINs which are similar to the item" (added 2026-04-01).
- Since 2026-07-29, offers carry a `promotions` array (`COUPON`, `DEAL`, `BASKET_BUILDING`).
- Default rate 0.033 requests a second, burst 1; the page and the model's usage-plan table agree (model re-read at reconciliation). The model says the `x-amzn-RateLimit-Limit` response header "returns the usage plan rate limits that are applied", so the binding value is read from the reply at run time [official] (getCompetitiveSummary, https://developer-docs.amazon/sp-api/reference/getcompetitivesummary, read 2026-10-14; SP-API Release Notes).
- Seller Central's own route: "Visit the Pricing Health page and select the Pricing Opportunities tab to view your offers that aren't currently eligible to become the Featured Offer."
- Ineligibility causes Amazon lists: "You ran out of stock." "Your price is too high." "Your price is too low." [official] (Maximize Your Sales Potential with the Amazon Featured Offer (formerly Buy Box), https://sell.amazon.com/blog/buy-box-featured-offer, published 2026-04-10, read 2026-10-14).
- In `VALIDATION_PREVIEW`, issue `100708` (`WARNING`, `INVALID_PRICE`) reads "Not eligible to be the Featured Offer due to uncompetitive price"; Amazon marks it "new to Validation Preview" [official] (Manage Listings Issues).

**The Featured Offer constraint after the 2026 eligibility change (gap fill, 2026-10-14).** The three lines above come from Amazon's April 2026 blog, which predates the change. The current help pages restate the constraint.

- **Seller eligibility is gone; offer competitiveness is not (RULE).**
  - "As of September 2026, Amazon no longer maintains a seller eligibility requirement, and offers from all sellers are now eligible to be evaluated for the Featured Offer. However, individual offers may still not be selected as the Featured Offer if they are not competitive." [official] (Becoming the Featured Offer, https://sellercentral.amazon.com/help/hub/reference/external/G201687550, version 20, read 2026-10-14 through the help hub content call)
  - The old page now reads "This page has been removed." [official] (Featured Offer eligibility, G200418100, version 23; Featured Offer, G37911, version 19, now a pointer page; both read 2026-10-14). The first pass called G37911 unreachable behind a sign-in wall; what a plain fetch returns is the help hub's JavaScript shell, and the page reads through the content call (capture capture `G37911-v19`; method/help-page-access.md A1–A2).
  - Amazon's News post: "Starting in July 2026, we'll begin removing seller eligibility requirements for the Featured Offer." "This change will roll out gradually across all Amazon stores globally, completing by the end of 2026." "We're not changing how the Featured Offer is selected." "Being considered for the Featured Offer doesn't guarantee your offer will be featured." [official] (Updates to Featured Offer eligibility requirements, Seller Forums News by News_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/7336583f-09ac-41de-99d1-667017a88db2, shown "3 months ago", read 2026-10-14). The help page's "As of September 2026" is the US page. Other stores may keep the gate until the end of 2026.
- **What `PRICING_HEALTH` means now.** It was always an **offer-level price** signal, not a seller-level gate.
  - It fires "whenever a seller offer is ineligible to be the Featured Offer (Buy Box offer) because of an uncompetitive price" [official] (Notification Type Values).
  - Pricing Health still lists "offers that are currently ineligible to become the Featured Offer … because they aren't priced competitively compared with other retailers outside of Amazon (the competitive external price) or they're priced significantly higher than recent prices observed on Amazon or elsewhere" [official] (Pricing Health, https://sellercentral.amazon.com/help/hub/reference/external/GSTH6YN3BR8XNWBW, version 22, read 2026-10-14).
  - So the 2026 change removes no `PRICING_HEALTH` cause. What changes is the population. A seller formerly ineligible on account grounds never had a contested Featured Offer, so a price problem on its offer was invisible behind the seller gate. Now its offers are evaluated, and an uncompetitive price shows up as a `PRICING_HEALTH` / Pricing Health item. [seat] This is an inference from the two pages. No Amazon page describes the transition's effect on notification volume.
  - Amazon's developer pages still carry the old wording. The `PRICING_HEALTH` entry says "you must price competitively and meet other qualifying criteria". The FAQ says "confirm you meet the eligibility criteria". The v0 model defines `IsFeaturedMerchant` as "When true, the seller of the item is eligible to win the Buy Box". [official] (Notification Type Values; Product Pricing API and Notifications FAQ; productPricingV0.json; all read 2026-10-14). What `IsFeaturedMerchant` returns after the change is not stated. See Open questions.
- **What Featured Offer % (`buyBoxPercentage`) means now.** The definition is unchanged and is over **page views**.
  - "Your Featured Offer percentage is calculated as the total number of page views in which your offer is featured divided by the total number of page views for your products." [official] (Becoming the Featured Offer)
  - The glossary adds that it falls below 100% when "The product was out of stock", when "The Featured Offer would result in the customer purchasing from another seller", or when "Your product was not available for purchase using the Featured Offer". It is "not necessarily an indication of the availability of your product for purchase". [official] (Business reports glossary, https://sellercentral.amazon.com/help/hub/reference/external/G27691, version 7, read 2026-10-14)
  - Data Kiosk's `traffic.featureOfferPct` is a different ratio: the schema puts glance views in the denominator (section B, Data Kiosk). Amazon's two sources define their "Featured Offer percentage" differently, so cx never compares one with the other; the definition is read from the source used.
  - Consequence (RULE plus [seat]): for a seller who was ineligible before the change, Featured Offer % can rise from zero with no listing or price change. A baseline window that straddles the store's switch is not comparable for this metric or for conversion. Amazon gives no per-store switch date, only "gradually … completing by the end of 2026".
- **A suppressed Featured Offer is its own trigger state.**
  - "Keep in mind that Amazon will not feature any offer if none of the available offers meet our customer experience requirements, even if the product has only one available offer. If you are listing a product but don't see a Featured Offer, make sure your offer is shippable to the customer's location, ensure that you have inventory in stock, and check Pricing Health for potential pricing issues." [official] (Becoming the Featured Offer)
  - Pricing Health opens: "We then decide which (if any) offer to highlight … We don't feature offers that don't meet its criteria for a great customer experience." [official] (Pricing Health)
  - This state differs from "lost to a competitor". Nobody holds the Featured Offer. The trigger family is constraint (price against external or recent prices, stock, shippability), and no content edit addresses it.
- **How each source shows a suppressed Featured Offer:**
  - **Keepa** documents the state explicitly. `competitivePriceThreshold`: "Competitive Price Threshold (CPT) for the Buy Box, if the buy box is suppressed". `suggestedLowerPrice`: "Suggested Lower Price for the Buy Box, if the buy box is suppressed". `stats.buyBoxIsUnqualified`: "Whether or not a seller won the buy box. If there are only sellers with bad offers none qualifies for the buy box". In `buyBoxSellerIdHistory`, "If no seller qualified for the Buy Box the sellerId "-1" is used". The Buy Box price history (`csv[18]`): "If no offer qualified for the buy box the price has the value -1". All need the `offers` parameter. (Keepa's own field documentation, a vendor source, not Amazon's: `Product.java` and `Stats.java`, keepacom/api_backend master, read 2026-10-14)
  - **`getCompetitiveSummary`** has no field that says "suppressed". In the model, `featuredBuyingOptions` is optional ("A list of featured buying options"). Each `FeaturedBuyingOption` requires `segmentedFeaturedOffers` with `minItems: 1`. [official] (getCompetitiveSummary, https://developer-docs.amazon/sp-api/reference/getcompetitivesummary, read 2026-10-14). So a reply with no featured buying option, or no segment for the seller's location, is the only shape a suppressed Featured Offer can take there. [seat] Amazon does not document this reading.
  - The external-price reference is also not where older files put it. The `CompetitivePriceThreshold` reference price type of Product Pricing v2022-05-01 was deprecated June 25, 2025 and removed September 30, 2025 [official] (SP-API Deprecations Schedule, read 2026-10-14). The featured-offers tutorial now says `CompetitivePrice` is "available in all Amazon stores except JP" and `CompetitivePriceThreshold` is "available only in the JP Amazon store" [official] (Retrieve a list of featured offers for a batch of up to 20 ASINs, https://developer-docs.amazon/sp-api/docs/retrieve-featured-offers-batch-asins, read 2026-10-14). The notification payloads (`ANY_OFFER_CHANGED` `Summary.CompetitivePriceThreshold`, `PRICING_HEALTH` `competitivePriceThreshold`) still document the field.
  - **v0 `getItemOffers`** returns `IsBuyBoxWinner` per offer ("There can be up to two Buy Box winners at any time per ASIN, one that is eligible for Prime and one that is not") and `Summary.BuyBoxPrices`. If no offer carries `IsBuyBoxWinner`, the read is consistent with suppression. [seat] This is not a documented test.

**Stock (constraint):**
- "A near real-time FBA report is generated no more than once every 30 minutes." "A daily FBA report is generated no more than once every four hours."
- `GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA`, `GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT` and the stranded-inventory reports are "Content updated in near real-time".
- `GET_FBA_FULFILLMENT_CUSTOMER_RETURNS_DATA` is "Content updated daily" [official] (Fulfillment by Amazon (FBA) Reports, https://developer-docs.amazon/sp-api/docs/report-type-values-fba, read 2026-10-14).

**Rule changes (constraint).**
- Amazon publishes a monthly table: "Amazon updates the attribute usage and enumeration values of numerous product types across Amazon stores." Its rows run from January 2024 to September 28, 2026, roughly one per month, each linking an `.xlsx` changelog [official] (SP-API Product Metadata Updates, https://developer-docs.amazon/sp-api/docs/sp-api-metadata-updates, read 2026-10-14). This is a RULE source: writes are validated against the current schema ("Listings data submitted to the Listings Items API must conform to the JSON Schema format provided by the … Product Type Definitions" API) [official] (Manage Listings Issues).
- Operation and payload retirements live on the deprecation schedule (SP-API Deprecations Schedule, https://developer-docs.amazon/sp-api/docs/sp-api-deprecations, read 2026-10-14).

**Rank:**
- "Amazon calculates Best Sellers Ranks using sales volume data. Both recent sales and all-time sales factor into a BSR, though recent sales count more than older sales. BSRs aren't influenced by page views or customer reviews."
- "a top BSR doesn't always equal a high organic search ranking."
- Movers & Shakers "showcase the biggest gainers in sales rank over the past 24 hours" [official] (What is Amazon BSR and how does it work?, https://sell.amazon.com/blog/amazon-best-sellers-rank, published 2025-09-03, read 2026-10-14).

BSR is therefore an outcome signal for the competitor set's sales, not a listing-quality signal.

**Content that changes without the seller writing it:**
- Manage Your Experiments: under the "pre-selected settings", experiments "run until there's enough data to declare a winner" and "Winning content is also published automatically"; a seller choosing their own duration is advised "8 to 10 weeks". Auto-publishing is therefore the default, not a fixed rule [official] (Test listing content with Manage Your Experiments, https://sell.amazon.com/tools/manage-your-experiments, read 2026-10-14).
- On contributions: "Brand owners have the highest precedence to update data on the product details page on Amazon. If Amazon uses its own data on the product details page, brand owners can override it via a ticket to Seller Central support", and "the information submitted by a vendor might not have priority" [official] (Listings APIs FAQ).

The live page can thus move away from what this seller last submitted.

**Major sale windows (confounder, and a reason not to trigger):**
- Prime Day 2026 "runs from June 23 through June 26" [official] (Prime Day 2026: Amazon's 4-day deal event starts June 23, https://www.aboutamazon.com/news/retail/amazon-prime-day-june-2026, published 2026-04-29, read 2026-10-14).
- Prime Big Deal Days 2026 ran "October 6–7", starting "12:01 a.m. PDT", with early deals before it [official] (Prime Big Deal Days 2026 is set for October 6-7, 2026, https://www.aboutamazon.com/news/retail/amazon-prime-big-deals-day-2026-when-october-6-7, published 2026-09-15, read 2026-10-14).

These are dated facts for human readers. As of 2026-10-14, any baseline reaching back eight days contains a major sale.

**The search page itself is a mover.** An Amazon Science paper by Amazon authors reports, on data from "a major e-commerce store", that "39% queries are highly seasonally relevant to the time of search", and that an online A/B test of seasonal-relevance ranking features raised purchases (see Published research). The abstract reports a test, not a deployment. It shows that ranking for a query can depend on the season, so a listing's exposure can shift with the calendar while nothing about the listing changed.

### C. What is RULE and what is GUIDANCE, in one place

**RULE (enforced):**
- Report period boundaries (Sunday–Saturday weeks; one period per SQP request; `FATAL` otherwise).
- Roles per report/notification type.
- Notification destinations (SQS/EventBridge in an AWS account).
- `ANY_OFFER_CHANGED` only for items with the seller's active offer.
- `BRANDED_ITEM_CONTENT_CHANGE` only for verified brand owners.
- Schema validation of writes.
- Enforcement actions (`SEARCH_SUPPRESSED`, `LISTING_SUPPRESSED`, `ATTRIBUTE_SUPPRESSED`, `CATALOG_ITEM_REMOVED`).
- Featured Offer selection tests at **offer** level: price against the competitive external price and recent prices, stock, and shippability. Amazon also features no offer at all when none meets its customer-experience requirements. The **seller**-level eligibility gate is removed: "As of September 2026" on the US page, all stores "by the end of 2026" (gap fill; Becoming the Featured Offer; Pricing Health; Updates to Featured Offer eligibility requirements). The first pass listed "Featured Offer eligibility tests" from the April 2026 blog. That wording predates the change and is superseded.
- Notification delivery terms: standard SQS queues only, possible duplicates, no ordering guarantee, dedup by `NotificationId`. Also the per-type filter support (`eventFilter` on three types; `filterExpression` not on listing types). (gap fill; SQS tutorial; Create and Filter Notification Subscriptions.)

**GUIDANCE:**
- Push over polling.
- Don't query faster than the data updates.
- A consistent review schedule.
- Compare like periods.

**Figures that live elsewhere and change:**
- Rates (each model's usage plan).
- Notification delays (Listings APIs FAQ).
- Data Kiosk readiness (dataset guide).
- Report cache windows (report-type pages).
- Product-type limits (the schema).
- Event dates (aboutamazon announcements).

### D. The families a senior operator also watches (gap fill, 2026-10-14)

The first pass named these as missing. Each is a member of one of the four families. Each entry gives what fires it in Amazon's words, where it lives, and the research file that owns the detail. The owning files hold the depth; this file holds the trigger.

**D1. Account health (constraint, account level).**
- "The AHR is a color-coded score that ranges from 0 to 1,000 and provides near real-time status of your account's health". The bands are green "Healthy" (200–1,000), yellow "At Risk" (100–199) and red "Unhealthy" (99 or lower). It reflects "policy adherence and selling activities over the last 180 days". "Regardless of your AHR score, Amazon may deactivate your account immediately if we suspect fraudulent, deceptive, illegal, or otherwise harmful activity". [official] (Account Health Rating program policy, https://sellercentral.amazon.com/help/hub/reference/external/G200205250, version 24, read 2026-10-14)
- Push: `ACCOUNT_STATUS_CHANGED` (`NORMAL` / `AT_RISK` / `DEACTIVATED`; SQS; Selling Partner Insights) [official] (Notification Type Values; Role Mappings).
- Pull: `GET_V2_SELLER_PERFORMANCE_REPORT` "Contains the individual performance metrics data from the Seller Central Account Health dashboard" (schema `accountHealthReport-2020-11-18`). `GET_V1_SELLER_PERFORMANCE_REPORT` (XML) carries `listingPolicyStatus`, `productAuthenticityStatus`, `productSafetyStatus`, `intellectualPropertyStatus` among others. Both "can only be requested", with role Selling Partner Insights [official] (Performance Reports, https://developer-docs.amazon/sp-api/docs/report-type-values-performance, read 2026-10-14).
- Why it is a listing trigger: seller performance is one of Amazon's Featured Offer ranking factors ("Sellers that consistently and reliably fulfill customer orders are more likely to be featured"), so an account-health slide can move Featured Offer % and conversion with no listing change [official] (Becoming the Featured Offer).
- Owner: angles/account-health.md.

**D2. Hijackers and unauthorised offers (competitor plus constraint, for brand owners).**
- Amazon names no "hijacker" signal. The observable is a new seller on the ASIN.
- Push: `ANY_OFFER_CHANGED` on items where the seller has an active offer (section A).
- Pull: `getItemOffers` (v0) `Summary.TotalOfferCount` ("The number of unique offers contained in NumberOfOffers") and `Offers[].SellerId` / `MyOffer` / `IsBuyBoxWinner` [official] (productPricingV0.json, selling-partner-api-models main, read 2026-10-14).
- Keepa: `csv[11]` "New offer count history" and `buyBoxSellerIdHistory` ("-2" for "an unknown seller (a brand new one)") (Keepa `Product.java`, read 2026-10-14).
- The trigger is a new `SellerId` or a jump in offer count against the last kept copy. A new seller winning the Featured Offer is the urgent case. Owner: angles/brand-protection-and-catalog-contribution.md.

**D3. The seller's own promotion calendar (confounder, not a reason to edit).**
- The Promotions API v2025-12-01 (release note August 26, 2026) lets an app "search, retrieve, and manage promotions" of types `DEAL`, `COUPON`, `PRICE_DISCOUNT` and `BASKET_BUILDING`. Statuses are `PROCESSING`, `UPCOMING`, `RUNNING`, `EXPIRED`, `FAILED`, `CANCELLING`, `CANCELLED`.
- `searchPromotions` filters on start/end dates and on last-modified time. `schedule.eventId` "associates the promotion with a specific event … (for example, `Prime Day`)". Roles: Pricing or Product Listing.
- `searchPromotions` default rate 0.1 requests a second, burst 4.
- [official] (Promotions API, https://developer-docs.amazon/sp-api/docs/promotions-api; searchPromotions, https://developer-docs.amazon/sp-api/reference/searchpromotions; promotions_2025-12-01.json; all read 2026-10-14)
- Use: before any baseline or observation window is fixed, cx lists the seller's own `RUNNING`/`UPCOMING`/`EXPIRED` promotions overlapping it. A coupon that started mid-window is a confounder, not an effect.
- The performance reports have separate roles: `GET_PROMOTION_PERFORMANCE_REPORT` takes Brand Analytics **or** Selling Partner Insights ("need at least one"); `GET_COUPON_PERFORMANCE_REPORT` takes Brand Analytics [official] (Role Mappings for SP-API Types, read 2026-10-14).
- Owners: angles/price-position.md and angles/seasonality-and-events.md.

**D4. Advertising (confounder for exposure and click-through).**
- Amazon Marketing Stream "delivers the data to partner or advertiser-owned AWS destinations in near real-time". "Traffic and conversion data is summarized hourly". Its messaging covers "campaign, ad group, ad, and targeting entity changes, as well as budget consumption updates, which notify you whenever your budget allotment changes by 5% or more".
- Destinations are "Amazon Data Firehose and AWS Simple Queue Service (SQS)", and "Amazon Marketing Stream only allows simple SQS queues"; "FIFO queues are not supported". "Retail data is not available in Amazon Marketing Stream."
- Stream v1 "will be shut off on June 30, 2027". v2 "delivers complete reporting datasets as Apache Parquet files to an Amazon S3 bucket you own, with total values per time window (not deltas)".
- [official] (Overview - Amazon Marketing Stream, read through the docs site's content host https://d3a0d0y2hgofx6.cloudfront.net/en-us/guides/amazon-marketing-stream/overview.md, 2026-10-14; Migrate from Version 1, …/guides/amazon-marketing-stream/v2/migrate-from-v1.md, read 2026-10-14). The first pass recorded the advertising.amazon.com page as "unreachable: client-rendered shell". The content host serves the same page as Markdown (route found in angles/paid-keywords.md).
- Trigger use: a budget running out mid-day, a paused campaign or a targeting change moves sessions and sponsored impressions with no listing change. The same AWS prerequisite applies as for SP-API push.
- Without the Ads API there is still a partial SP-API source (reconciled 2026-10-14, from angles/paid-keywords.md §I): Data Kiosk's Economics dataset carries `ads: [AdSummary]` per product, "The advertising spend data for the product within the specified date range", aggregated "By default … by MSKU and DAY" [official] (schema `analytics_economics_2024_03_15.graphql`, selling-partner-api-models `main` @ `bad4c9b6ad6a88fc57d9aa98760901d8c8c47179`, re-read 2026-10-14). It shows spend, not terms, clicks, budget-outs or campaign state. A day whose spend falls to nothing is a confounder flag; for the rest cx asks the seller. Which role the dataset needs is read from the `createQuery` result, because Amazon's pages disagree (angles/paid-keywords.md, open question 9).
- Owner: angles/paid-keywords.md.

**D5. Review and complaint signals (own-listing).**
- Amazon's own customer-complaint feed reaches the Featured Offer. Factors include "Complaints from your Voice of the Customer dashboard" (damaged, defective, "Inaccurate website description", missing parts, wrong item, quality, wrong size, condition, style, version/expiry). Amazon explicitly does not consider "Customer reviews and star ratings" of the seller. [official] (Becoming the Featured Offer)
- An "Inaccurate website description" complaint is a listing trigger in Amazon's own vocabulary.
- Data Kiosk's `reviews` group (`lowRatingReviewCount`, `totalReviewCount`, `criticalReviewRate`) is the API route (section B).
- Keepa `csv[16]` "The product's rating history" and `csv[17]`, which Keepa's two documents name differently: "The product's review count history" (Keepa `Product.java`) and "The product's rating count history. Requires the offers parameter." (Product Object, Keepa API documentation, https://keepa.com/api-docs/product-object.html); both re-read 2026-10-14. Neither is carried as the answer: whether slot 17 counts ratings or written reviews is checked at run time (angles/reviews-and-qa.md, open question 4).
- Keepa's freeze note is attached only to the separate, variation-specific `reviews` object: "The ratingCount history has not been updated since April 9th 2025 as that data point was removed by Amazon." `csv[17]` (non-variation-specific) carries no such note, and its freshness is not stated; it shows in `lastRatingUpdate` and the slot's last data point. See "What cx must read at run time".
- The Voice of the Customer help page itself was not found through the content call: three candidate ids returned `HelpArticleNotFound`. A practitioner dates the dashboard's replacement of Customer Reviews to October 1, 2025 (see practitioners).
- Owner: angles/reviews-and-qa.md.

**D6. Variation changes and ASIN merges (own-listing and competitor; content drift).**
- Variation timing (RULE-level FAQ): "In most cases, variation families and reviews merge onto a single detail page in under 15 minutes. However, wait a full 24 hours before contacting Selling Partner Support" [official] (Variation relationship FAQ, https://sellercentral.amazon.com/help/hub/reference/external/G201951410, version 16, read 2026-10-14).
- Merges: an Amazon staff post says "Amazon may also merge multiple product detail pages with identical attributes into one product detail page". It also says "Amazon may incorrectly assign a listing to a product detail page that represents a different product". Unmerging goes through a self-service tool, and "ASINs for brands registered in Amazon Brand Registry can only be split if the requester is the rights owner". [official, staff forum post] (Listing Lounge: Incorrect ASIN Merge, Michelle_Amazon, Seller Forums, https://sellercentral.amazon.com/seller-forums/discussions/t/fdadeb6d-3b10-4486-a499-bccccf6a312a, shown "3 years ago", read 2026-10-14)
- **No notification exists for a merge.** No notification type on Notification Type Values names a merge or a redirect (read 2026-10-14). Sellers on the same thread ask that "when a merge happens that involves an ASIN that we have a listing on, that we get a notification" [opinion]. Elsewhere a seller reports "Amazon merged 2 of our ASINs without notifying us or giving us a way to unmerge them" [opinion] (Getting past the first level of support Merged ASINs, Seller Forums, shown "4 years ago", read 2026-10-14).
- **Detector, since nothing pushes one.**
  - Keepa `isRedirectASIN`: "Boolean indicating if the ASIN will be redirected to another one on Amazon (example: the ASIN has the color black variation, which is not available any more and is redirected on Amazon to the color red)". It needs the `offers` parameter (Keepa `Product.java`). `parentAsinHistory` ("null if the parentAsin field never changed") catches family moves.
  - On Amazon's side, Catalog Items `relationships` ("Relationship details of an Amazon catalog item (for example, variations)") and `summaries` per kept copy.
  - Whether `getCatalogItem` on a merged-away ASIN returns the surviving ASIN, an error or the old record is **not documented**: the getCatalogItem reference and the Catalog Items guides say nothing about merges (read 2026-10-14). See Open questions.
- Why it matters: a merge moves reviews and traffic between ASINs and breaks every ASIN-keyed series cx has stored. Every kept file should record the ASIN that was asked for and the ASIN that came back. [seat]
- Owner: elements/variations.md.

**D7. Fees, size tier and re-measurement (constraint, margin).**
- The FBA Fee Preview Report (`GET_FBA_ESTIMATED_FBA_FEES_TXT_DATA`) carries `longest-side`, `median-side`, `shortest-side`, `item-package-weight`, `product-size-tier` (US) and the per-unit fee estimates. "The content is updated at least once every 72 hours". "This report can only be requested once per day per seller." [official] (Fulfillment by Amazon (FBA) Reports, read 2026-10-14)
- The trigger is a changed size tier or dimension against the last kept copy. Push: `FEE_PROMOTION` covers fee promotions only, not re-measurement (Notification Type Values).
- No Amazon page on re-measurement requests was read: the web-search budget ran out before one was found. See Open questions.
- Owner: angles/inventory-and-fulfillment.md.

**D8. Inventory performance and capacity (constraint, future stock-outs).**
- IPI's four categories are excess ("over 90 days of supply based on the forecasted demand"), 90-day sell-through, stranded inventory and in-stock rate [official] (Inventory performance, https://sellercentral.amazon.com/help/hub/reference/external/G202174810, version 9, read 2026-10-14).
- "Sell-through rate is updated daily". IPI scores are shown per week. "We will inform you four to eight weeks before the new period limit goes into effect what the IPI threshold will be". "Newly created ASINs in their first 90 days do not affect your IPI score" [official] (IPI frequently asked questions, GZJF4DY2W6MERBAL, version 19, read 2026-10-14).
- Capacity: "You'll receive one capacity limit for each storage type per month"; "typically announced during the fourth week of the month". "If your on-hand inventory plus shipments on the way to our fulfillment centers exceeds your capacity limit, you'll be blocked from creating new shipments" [official] (FBA capacity limits, GAFNWEYTJUV2GBFC, version 22, read 2026-10-14).
- Trigger use: a capacity block or low days of supply predicts a stock-out weeks ahead. It is a reason to warn, and to keep any content test out of the window it will hit. No API returns the IPI score itself (angles/inventory-and-fulfillment.md).

**D9. Browse node and BSR category changes (exposure; corrupts rank comparisons).**
- Catalog Items: `classifications` ("Classifications (browse nodes) that are associated with the item in the Amazon catalog") and `salesRanks` with `classificationRanks` and `displayGroupRanks` [official] (getCatalogItem, https://developer-docs.amazon/sp-api/reference/getcatalogitem, read 2026-10-14).
- Keepa: `salesRankReference` ("The category node id of the main sales rank") and `salesRankReferenceHistory` ("The category node id history of the main sales rank") (Keepa `Product.java`).
- A change of rank category makes the old BSR series incomparable. A browse-node change can move the listing out of a category's filters. Both are triggers to re-read, not effects of the last edit.
- Owner: elements/attributes-and-browse-nodes.md.

**D10. Operator routine cadences.** See "What practitioners add". Few named sources were found before the web-search budget ran out; see Open questions.

## What practitioners add

**What tools watch: the de-facto trigger list.**
- Helium 10's Alerts tracks "Product Title Changed – Another seller or Amazon has changed the title", "Product Image Changed" (main image), "Buy Box Lost / Won", "Product Dimensions Changed" (fee impact), "Number of Sellers Changed", and "Price Changed" by other sellers on the same ASIN.
- It keeps before/after screenshots and an event history.
- Each change is classified positive/negative/neutral, summarised "in 24-hour or 7-day intervals".
- Delivery is configurable (email/text), and you can "set a time frame during which you DO NOT wish to receive alerts" [opinion] (Jonathan Dean, Helium 10, "Alerts: 7 New Powerful Methods to Better Monitor Your Listing", 2019-02-01, updated 2019-06-25, https://www.helium10.com/blog/alerts-7-new-powerful-methods-to-better-monitor-your-listing/).
- The current product page adds the "adult category" trick and new 1-star reviews as watch items, and promises "24/7 surveillance … in real-time" [opinion] (Helium 10, "Amazon Fraud Detector & Alerts", https://www.helium10.com/tools/alerts/, undated, read 2026-10-14).

**Thresholds are the user's, not the tool's.**
- Jungle Scout's Alerts lets the user "choose the types of product changes you want to monitor … and how often you want to be notified".
- Its example threshold: alert when "best-seller rating crosses a certain threshold, such as 20% above or below its previous value".
- Snapshots come "on a daily or weekly basis" [opinion] (Greg Mercer, Jungle Scout, "Amazon Product Alerts: Track Your Product Data (Wherever You Are)!", 2019-11-05, updated 2024-10-08, https://www.junglescout.com/blog/amazon-product-alerts/).

This supports the package's stance that thresholds belong to the seller's standing instruction. The 20% is an example, not a norm.

**Judge against the market, not against yourself.**
- "Your brand is growing 20% year over year … Then you check the category, and it's growing 40% … you're losing share."
- "A brand growing slower than its category is losing ground, even if its own revenue is still climbing" [opinion] (Tracy Turner, Jungle Scout, "Amazon Brand Performance: Are You Beating the Category?", 2026-09-30, https://www.junglescout.com/resources/articles/amazon-brand-performance-vs-category/).
- A companion piece flags an ASIN "when sales decline, rank falls, or reviews trend negative compared with its history or its peers" [opinion] (Sarah Adi, Jungle Scout, "Track Amazon Product Performance Before Small Problems Grow", 2026-10-07, https://www.junglescout.com/resources/articles/amazon-product-performance/).
- Both are product pitches; the method claim is the useful part.

**SQP as the competitive lens.**
- "If the overall CTR for that keyword is 5% [and yours is 10%], you know you're outperforming competitors … if your CTR is below the market average, it may be time to improve your listing images, title, or price point."
- The same article says cart adds and purchases are "tracked within 24 hours of a shopper's query". No Amazon page read here states that attribution window [opinion] (William B, Helium 10, "What Is Amazon's Search Query Performance Report", 2025-03-26, https://www.helium10.com/blog/amazons-search-query-performance-sqp-report-and-why-it-matters/).

**Competitor price cadence.**
- "On Amazon, where prices change frequently …"; "Frequent Buy Box shifts can signal pricing trends" [opinion] (Brian Connolly, Jungle Scout, "Competitor Price Monitoring Strategies for Established Sellers", 2025-02-24, https://www.junglescout.com/resources/articles/competitor-price-monitoring-for-amazon-sellers/).
- Jungle Scout's guide asserts Featured Offer holders capture "83% by some estimates!" of sales, with no source given. Treat as unsourced [opinion] (Jungle Scout, "The Ultimate Guide To Monitoring Amazon Competitor Prices", 2025-03-20, https://www.junglescout.com/resources/articles/monitoring-competitor-pricing-trends/).
- Helium 10's Market Tracker "updates daily" and is meant to be checked "periodically" [opinion] (Kai Maranon, Helium 10, "See the Bigger Picture with Market Tracker by Helium 10", 2020-04-08, https://www.helium10.com/blog/competitor-amazon-research-with-market-tracker/).
- Practitioners split here. Alert tools sell "real-time, 24/7". Market trackers and Amazon's own Data Kiosk guidance settle on daily. Amazon's Automate Pricing reprices "24/7" ("price updates are usually processed in less than 15 minutes") [official] (Automate Pricing, https://sell.amazon.com/tools/automate-pricing, read 2026-10-14). Competitors' prices can therefore move many times between two daily looks.

**The search page is not a fixed shelf.**
- "Of the first twenty products a shopper sees when searching on Amazon, only four are organic results … It takes scrolling past three browser windows worth of search results to get to the fifth organic result" [opinion] (Juozas Kaziukėnas, Marketplace Pulse, "Amazon Is Burying Organic Search Results", 2022-03-09, https://www.marketplacepulse.com/articles/amazon-is-burying-organic-search-results).
- A 2026 vendor study reported by Marketplace Pulse: of Alexa for Shopping's recommendations, "63.9% of its picks fell outside the organic top-10 for the matched search term". Marketplace Pulse itself cautions that "this is a single snapshot from one US account, captured early" [opinion] (Ben Donovan, Marketplace Pulse, "Amazon's AI Doesn't Read the Rankings", 2026-07-16, https://www.marketplacepulse.com/articles/amazons-ai-doesnt-read-the-rankings).
- Consequence for triggers: a session drop with stable organic rank can come from ad load, layout or AI-assistant placement, none of which a listing edit addresses.

**Older-metric thresholds circulating** (Helium 10 Team, "Amazon Seller Metrics", 2020-10-02, updated 2022-08-16, https://www.helium10.com/blog/amazon-seller-metrics/; Brian Connolly, Jungle Scout, "8 Amazon KPIs for FBA Sellers in 2023", updated 2026-07-22, https://www.junglescout.com/blog/amazon-seller-metrics/):
- ODR "under 1%", pre-fulfillment cancel "less than 2.5%", late shipment "under 4%" (account-health targets).
- "a good average conversion rate can be around 10%" (Jungle Scout).
- These are account-health and benchmark figures. The conversion "average" has no stated basis and should not become a trigger default [opinion].

**On alerting itself (outside Amazon, practitioner).**
- "When pages occur too frequently, employees second-guess, skim, or even ignore incoming alerts, sometimes even ignoring a 'real' page that's masked by the noise."
- "Every page should be actionable." "Pages should be about a novel problem or an event that hasn't been seen before."
- "I can only react with a sense of urgency a few times a day before I become fatigued."
- Monitoring should separate symptoms ("what's broken") from causes ("why") [opinion] (Rob Ewaschuk, ed. Betsy Beyer, Google, *Site Reliability Engineering*, ch. 6 "Monitoring Distributed Systems", https://sre.google/sre-book/monitoring-distributed-systems/).
- Mapped to listings: sessions down is the symptom; the four families are the candidate causes.

**Gap fill, 2026-10-14.**

**Suppressed Featured Offer, as practitioners describe it.**
- Colin Palin (RepricerExpress, "Amazon Buy Box Suppressed: What Causes It and How to Get It Restored", 2026-09-17, "Last verified: September 2026", https://www.repricerexpress.com/amazon-buy-box-suppressed-causes-and-fixes/) [opinion]:
  - Suppression is when "Amazon removes the featured Add to Cart and Buy Now buttons from a product detail page"; shoppers see "See all buying options". He separates it from losing the Buy Box to a competitor.
  - Causes he lists: price well above the ASIN's recent selling price or above other platforms; a new ASIN with no price history; condition or listing-quality problems; account health.
  - His numbers are his own, not Amazon's: 20 to 25% above recent selling price as the diagnostic line, and clearance within a few hours for price fixes against 24 to 72 hours for the other causes (paraphrased; the tool returned a summary, not his exact wording).
  - He does not mention the 2026 seller-eligibility removal. That is consistent with Amazon: suppression is offer-level and survives the change.
- Anata Inc. ("How to Audit an Amazon Product Listing", published 2026-07-31, updated 2026-09-08; reached at https://anatainc.com/amazon-buy-box-suppression-fix/, which serves this article) [opinion]: "Keep listing suppression separate from Featured Offer selection, formerly called the Buy Box", and "re-audit in 30 days".

**Merges, from sellers.** Sellers on Amazon's own forum report merges they learned of only from wrong orders: "The worst part is that they don't even tell you it's happening so orders go out wrong". [opinion] (Getting past the first level of support Merged ASINs, Seller Forums, a seller, shown "4 years ago"). This supports a detector over waiting for a notice. The age of the threads limits how far it describes today.

**Voice of the Customer replaced Customer Reviews.** Nhan Dinh (Seller Labs, "Amazon Voice of the Customer (VoC): Replacing the Customer Reviews Dashboard in 2026", published 2025-09-26, marked "Updated April 2026", https://www.sellerlabs.com/blog/amazon-voice-of-the-customer-transition-2026/) [opinion]:
- "On September 30, 2025, Amazon will retire the long-standing Customer Reviews dashboard in Seller Central."
- "The new Voice of the Customer dashboard becomes fully active October 1, 2025."
- No refresh cadence is given; the only advice is to "Monitor patterns and apply fixes consistently".
- Not confirmed on an Amazon page in this session.

**Charting noisy rates (software vendor documentation).** Minitab (statistical software maker), "Overdispersion and underdispersion" and "Overview for Laney P' Chart" (support.minitab.com, undated, read 2026-10-14) [opinion]:
- "The control limits on a traditional P chart or U chart become more narrow when your subgroups are larger."
- "Overdispersion can cause a traditional P chart to show an increased number of points outside the control limits."
- "If there is overdispersion, the control limits on a Laney attributes chart are wider than those of a traditional attributes chart."
- Method page: "Each subgroup proportion is converted to a z-score", then "a moving range of length 2 is used to evaluate the variation in the z-scores and calculate Sigma Z" ("1.128 is an unbiasing constant").
- Mapped to listings [seat]: a conversion rate or Featured Offer % over thousands of sessions is a large-subgroup proportion. Its binomial limits are far narrower than its real week-to-week wobble, so a classic p-chart would alarm constantly.

**Operator cadences.** Beyond the tool cadences above (Helium 10 daily trackers; Jungle Scout daily or weekly snapshots; RepricerExpress's hours-to-days clearance; Anata's 30-day re-audit), no named agency's routine was read in this pass. Open question 12.

## Published research

- **Le Chen, Alan Mislove, Christo Wilson, "An Empirical Analysis of Algorithmic Pricing on Amazon Marketplace", WWW 2016 (Montréal)** [research].
  - Four months of crawls of 1,641 best-seller products. The authors identify 543 sellers "very likely using algorithmic pricing".
  - These sellers "win the Buy Box more frequently (even when they do not offer the lowest price)".
  - "the lowest price and the Buy Box for products with algorithmic sellers are significantly more volatile".
  - The authors "observe cases where algorithmic sellers change prices tens or even hundreds of times per day".
  - For non-algorithmic sellers, "the price never changes for 65% of the pairs".
  - Transfer: narrow and dated (2014–15 data, best-sellers only). It supports one point. On ASINs with repricers, a once-a-day snapshot sees one sample of a fast-moving series. A price trigger should read the history (Keepa's change-only arrays, `stats`) rather than compare two snapshots.
- **Haode Yang, Parth Gupta, Roberto Fernandez Galan, Dan Bu, Dongmei Jia, "Seasonal relevance in e-commerce search", CIKM 2021 (Amazon Science)** [research].
  - "we find 39% queries are highly seasonally relevant to the time of search".
  - An online A/B test over "784 MM queries" of seasonal-relevance ranking features gave "2.20% higher purchases".
  - Transfer: close on mechanism. The authors are Amazon's and the paper is on amazon.science, but the abstract names only "a major e-commerce store" and reports an A/B test, not a production launch. Exposure for a query can shift with the season through ranking alone. A demand-family trigger must therefore be checked against the same period last year (SQP `MONTH`/`QUARTER`, Keepa rank history, Data Kiosk `yearOverYear`) before being read as a listing problem.
- **Ramesh Johari, Leo Pekelis, David J. Walsh, "Always Valid Inference: Bringing Sequential Analysis to A/B Testing", arXiv:1512.04922, 2015** [research].
  - Frequentist inferences "are wholly unreliable if users endogenously choose samples sizes by *continuously monitoring* their tests".
  - Transfer: by analogy only. A watcher that checks a noisy metric every day against a fixed threshold, and acts the first time it crosses, raises far more false alarms than its nominal rate. This argues for weekly read-outs on weekly data and for thresholds stated over a window, not a single day.
- **Pavel Dmitriev, Somit Gupta, Dong Woo Kim, Garnet Vaz, "A Dirty Dozen: Twelve Common Metric Interpretation Pitfalls in Online Controlled Experiments", KDD 2017 (Microsoft)** [research].
  - §5.10 "Novelty and Primacy Effects": a feature's effect "declined quickly" day over day, and was gone after the first visit.
  - Transfer: by analogy, to effect-review more than to triggers. A post-change bump in the first days is not yet a trigger to change something else.
- **Alert-fatigue clinical literature** (e.g., the BMC Medical Informatics and Decision Making 2017 study on repeated alerts): **unreachable**. The publisher returned a bot challenge. No finding is cited from it.

**Statistical process control for watch thresholds (gap fill, 2026-10-14).** The first pass's "below the 4-week range for two consecutive weeks" was the seat's analogy. The quality-control literature has a designed answer. It was read at the level below; where only a title page or metadata was reachable, the entry says so, and no finding is drawn from it.

- **NIST/SEMATECH e-Handbook of Statistical Methods, §6.3 "Univariate and Multivariate Control Charts"** (U.S. National Institute of Standards and Technology; pages 6.3.2, 6.3.2.3, 6.3.2.3.1, 6.3.2.4, 6.3.3.2; https://www.itl.nist.gov/div898/handbook/pmc/section3/, read 2026-10-14) [research, government reference handbook]:
  - **False alarms are the design quantity.** For a Shewhart chart with the plain 3-sigma rule "you will have "false alarms" every 371 points on the average". Adding the Western Electric rules raises this to "about once in every 91.75 points" (citing Champ and Woodall, 1987). The average run length (ARL) "is the average number of samples (subgroups) taken before an action signal is given". The designer wants "a high ARL" for L0 "when the process is on target, (i.e. in control), and a low ARL" for L1 "when the process mean shifts to an unsatisfactory level" (6.3.2; 6.3.2.3.1).
  - **CUSUM for small shifts.** CUSUM charts "have been shown to be more efficient in detecting small shifts in the mean of a process … better than Shewhart control charts when it is desired to detect shifts in the mean that are 2 sigma or less" (6.3.2.3). Its design uses α, "the probability of a false alarm", β, the probability of missing a shift, and δ, the shift to detect.
  - **EWMA for gradual drift.** "By the choice of weighting factor, λ, the EWMA control procedure can be made sensitive to a small or gradual drift in the process, whereas the Shewhart control procedure can only react when the last data point is outside a control limit." The equation "is due to Roberts (1959)". λ "is usually set between 0.2 and 0.3 (Hunter, 1986)". Limits use Lucas and Saccucci (1990) tables, and "The data are assumed to be independent and these tables also assume a normal population" (6.3.2.4).
  - **Known parameters are assumed.** "control chart properties, such as false alarm probabilities, are generally given under the assumption that the parameters … are known. When the control limits are not computed from a large amount of data, the actual properties might be quite different" (6.3.2). The p-chart model assumes "successive units produced are independent" (6.3.3.2).
  - Transfer: by analogy, close in method. A watched ASIN metric is a process. A week is a subgroup. "Independent", "normal" and "known parameters" are exactly what weekly e-commerce series violate: weekday and seasonal pattern, promotions, short history. The ARL arithmetic still sets the order of magnitude of false alarms.
- **E. S. Page, "Continuous Inspection Schemes", *Biometrika* 41(1–2):100–115, 1954** [research]. Title page and metadata read (Oxford Academic, https://academic.oup.com/biomet/article-abstract/41/1-2/100/456627; Crossref, DOI 10.1093/biomet/41.1-2.100); the text is behind a paywall and no abstract is shown. It is listed because the gap brief names it as the CUSUM source. The NIST pages read do not cite it. No finding is drawn from the paper itself.
- **S. W. Roberts, "Control Chart Tests Based on Geometric Moving Averages", *Technometrics* 1(3):239–250, 1959** [research]. Metadata read (Crossref, DOI 10.1080/00401706.1959.10489860). The publisher page returned HTTP 403. Cited only as the origin of EWMA, which NIST attributes to "Roberts (1959)".
- **David B. Laney, "Improved Control Charts for Attributes", *Quality Engineering* 14(4):531–537, 2002** [research]. Metadata read (Crossref, DOI 10.1081/QEN-120003555). The publisher page returned a bot challenge and no abstract is in Crossref. The p′/u′ method is described here only through Minitab's documentation (practitioners section), not from the paper.
- **Yoav Benjamini, Yosef Hochberg, "Controlling the False Discovery Rate: A Practical and Powerful Approach to Multiple Testing", *Journal of the Royal Statistical Society Series B* 57(1):289–300, 1995** [research]. Abstract read (Crossref; Oxford Academic page, https://academic.oup.com/jrsssb/article/57/1/289/7035855):
  - "The common approach to the multiplicity problem calls for controlling the familywise error rate (FWER). This approach, though, has faults".
  - They propose "controlling the expected proportion of falsely rejected hypotheses — the false discovery rate".
  - "A simple sequential Bonferronitype procedure is proved to control the false discovery rate for independent test statistics".
  - Transfer: by analogy. A weekly watch over N ASINs × M metrics is N·M simultaneous tests. Controlling the share of false alarms among the alarms raised is the right criterion for an alert digest. The independence condition is not met by metrics of one ASIN (sessions and orders move together).
- **D. C. Montgomery, *Introduction to Statistical Quality Control*** (Wiley): not opened in this session. Nothing is cited from it.

## Stable enough for a skill

- A trigger is a reason to look, not a reason to edit. Suppression, a lost Featured Offer and a stock-out are not fixed by copy. (Manage Listings Issues; Maximize Your Sales Potential with the Amazon Featured Offer.)
- Amazon reports listing problems as issues with severities and enforcement actions, read through `getListingsItem`/`searchListingsItems` with `includedData=issues`. `ACCEPTED` does not mean the downstream process finished. (Manage Listings Issues; listingsItems model.)
- A listing absent `DISCOVERABLE` is not in search, and one absent `BUYABLE` cannot be bought. (Notification Type Values; Listings APIs FAQ.)
- Featured Offer ineligibility can come from a price outside Amazon (the Competitive External Price), from stock, or from a suspected pricing error. No Amazon competitor needs to have moved. (Product Pricing API and Notifications FAQ; Maximize Your Sales Potential with the Amazon Featured Offer; Becoming the Featured Offer; Pricing Health.) This is offer-level ineligibility, which survives Amazon's removal of the seller-level gate (see the gap-fill lines below); the April 2026 blog's list predates that removal.
- Search Query Performance gives, for the same query and period, the market's totals and the ASIN's shares. A drop in the total is demand; a drop in the share is competition or the listing. (SQP schema.)
- Search Query Performance and Search Catalog Performance periods are whole weeks (Sunday–Saturday), months or quarters, one period and one marketplace per request; Top Search Terms adds `DAY`. The period bounds are read from the report schema at run time; a request off them fails. (Analytics Reports; SQP and Search Catalog Performance report schemas.)
- Search Query Performance counts organic and Sponsored Products results from the search results page, so the seller's own advertising moves its impression share. (Search Query Performance dashboard; Search Catalog Performance report schema.)
- Amazon's analytics arrive late and the most recent period may be partial or null. Amazon's own pages say where each clock is stated. (Seller Analytics Dataset Use Case Guide; Analytics Reports; What is Amazon Brand Analytics?)
- Querying faster than a dataset refreshes returns nothing new. (Schedule Data Kiosk Queries.)
- Amazon's hourly and event-driven signals (offer changes, pricing health, content changes, issue changes, hourly traffic and sales) are push notifications to an AWS destination. A reader with no destination sees them only by pulling the underlying state. (Notification Type Values; Set up notifications using the Amazon EventBridge workflow.)
- `ANY_OFFER_CHANGED` covers only items where the seller has an active offer. `BRANDED_ITEM_CONTENT_CHANGE` covers only items of a verified brand owner. (Notification Type Values.)
- A detail page can change without the seller's own write: under Manage Your Experiments' default settings the winner publishes automatically, and contributors with higher precedence can change attributes. (Manage Your Experiments; Listings APIs FAQ.)
- Product-type definitions change on a recurring schedule Amazon publishes. The schema in force at write time is the one that counts. (SP-API Product Metadata Updates; Manage Listings Issues.)
- BSR reflects sales volume, recent sales weighted more. It is not moved by page views or reviews. (What is Amazon BSR and how does it work?)
- Keepa keeps history arrays for prices, rank, offer counts, rating and a rating or review count (its two documents name that slot differently), coupons, Buy Box seller and parent ASIN. It documents no history field for title, bullets, description or images, so content change is found by comparing kept snapshots. (Keepa `Product.java`; Product Object, Keepa API documentation.)
- Major sale events are announced by Amazon with dates. A baseline or observation window that contains one is not comparable to one that does not. (aboutamazon Prime Day / Prime Big Deal Days pages; Amazon Science seasonal relevance paper for the seasonal analogue.)

Gap fill, 2026-10-14:

- Amazon is removing the seller-level eligibility gate for the Featured Offer store by store. Where it is gone, every seller's offer is evaluated. What still keeps an offer from being featured is offer-level: price against external and recent prices, stock, and shippability. The store's own help page says which regime applies. (Becoming the Featured Offer; Featured Offer eligibility; Updates to Featured Offer eligibility requirements; Pricing Health.)
- Amazon can feature no offer at all on a product, even one with a single offer. That state is a constraint trigger of its own, distinct from losing the Featured Offer to another seller. (Becoming the Featured Offer; Pricing Health.)
- `PRICING_HEALTH` reports an offer that cannot be featured at its current price. It is a price signal about the seller's own offer, not a sign that a competitor moved. (Notification Type Values; Product Pricing API and Notifications FAQ; Pricing Health.)
- Business Reports' Featured Offer % is the share of page views in which the seller's offer was featured. It falls when stock runs out, when another seller is featured, or when no offer is featured. Data Kiosk's `featureOfferPct` divides by glance views instead, so the two are not one series; cx reads the definition from the source it uses. (Becoming the Featured Offer; Business reports glossary; `analytics_sellerAnalytics_2025_03_31` schema.)
- SP-API push needs an AWS account and a destination: a standard SQS queue, or EventBridge for the listing types. `createDestination` is grantless. `createSubscription` is made per notification type and payload version, under the type's role. (Set up notifications using the Amazon SQS workflow; EventBridge workflow; Notifications API; createDestination; createSubscription.)
- A notification can arrive more than once and out of order. Its `NotificationId` identifies duplicates. (Set up notifications using the Amazon SQS workflow.)
- Offer-change notifications can be aggregated at the source, keeping the first event and the end state of each window and dropping the rest. (createSubscription.)
- Amazon sends no notification when it merges or redirects an ASIN; a merge is found by reading the catalog and comparing kept copies. (Notification Type Values; Listing Lounge: Incorrect ASIN Merge.)
- Account status changes (normal, at risk, deactivated) and the account health report are Amazon's own account-level constraint signals. Seller performance is also a Featured Offer ranking factor. (Notification Type Values; Performance Reports; Account Health Rating program policy; Becoming the Featured Offer.)
- A watch's false-alarm rate is a design choice, expressed as average run length. Across many watched series, false alarms add up unless the threshold is set for the whole watch. (NIST/SEMATECH e-Handbook §6.3; Benjamini and Hochberg 1995.)

## What cx must read at run time

**SP-API operations and report or dataset names.** Report types, options, waits and polling belong to door.md's report section, and the create-poll-download lifecycle to method/report-lifecycle.md; this file names the operations only. Rate limits are read from each reply's `x-amzn-RateLimit-Limit` header where present, and Data Kiosk's required role from the `createQuery` result (Amazon's pages disagree on it; angles/paid-keywords.md open question 9).

| Family | Signal | Where it lives at run time |
|---|---|---|
| Own-listing | sessions, page views, Featured Offer % ("buy box percentage"), unit session % by ASIN | `createReport` → `getReport` → `getReportDocument` for `GET_SALES_AND_TRAFFIC_REPORT` (door.md's options and waits). Or Data Kiosk `createQuery` on `analytics_sellerAnalytics_2025_03_31` (daily per ASIN; readiness per the dataset guide), or `analytics_salesAndTraffic_2024_04_24` `salesAndTrafficTrends`. Seller analytics' `featureOfferPct` (over glance views) and `conversionRatePct` (search purchases over search clicks) are not Business Reports' Featured Offer % and unit session %; definitions from the schema. |
| Own-listing / demand / competitor | per-query volume, impressions, clicks, cart adds, purchases; ASIN shares | `GET_BRAND_ANALYTICS_SEARCH_QUERY_PERFORMANCE_REPORT` (door.md's). `GET_BRAND_ANALYTICS_SEARCH_CATALOG_PERFORMANCE_REPORT`. `GET_BRAND_ANALYTICS_SEARCH_TERMS_REPORT` for top-3 clicked ASINs per term. Data Kiosk `search.query` / `search.catalog`. |
| Constraint | issues, severities, enforcements, BUYABLE/DISCOVERABLE | `getListingsItem` `includedData=summaries,issues` (plus `attributes` for content). `searchListingsItems`. `GET_MERCHANTS_LISTINGS_FYP_REPORT`, `GET_MERCHANT_LISTINGS_INACTIVE_DATA` (door.md's). |
| Constraint / competitor | Featured Offer holder, reference prices, lowest offers, promotions, similar items | `getCompetitiveSummary` (`featuredBuyingOptions`, `referencePrices`, `lowestPricedOffers`, `similarItems`); `getFeaturedOfferExpectedPriceBatch`; `getItemOffers` / `getPricing` (door.md's). |
| Constraint | own stock | `getInventorySummaries`. FBA near-real-time reports (`GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA`, `GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT`, stranded-inventory reports) (door.md's). |
| Own-listing | returns, reviews counts | `GET_FBA_FULFILLMENT_CUSTOMER_RETURNS_DATA` (daily). Data Kiosk `returns` (lag per the guide) and `reviews` (`lowRatingReviewCount`, `totalReviewCount`, `criticalReviewRate`). |
| Own-listing (drift) | what the page shows now versus what was submitted | `getCatalogItem` (Catalog Items 2022-04-01) `includedData=attributes,summaries,images,classifications,salesRanks,productTypes` compared with `getListingsItem` `attributes` and with the last kept snapshot. |
| Constraint (rules) | limits, required attributes, enums | `getDefinitionsProductType` for the listing's product type at write time; the SP-API Product Metadata Updates page and Release Notes as the human-readable change log. |
| Constraint (events) | sale calendar | Amazon's announcement pages (aboutamazon.com); the seller's own deal/coupon calendar. |
| Constraint (Featured Offer suppressed or lost; gap fill) | who holds the Featured Offer, if anyone | `getCompetitiveSummary` `featuredBuyingOptions` (absent, or no segment, means no featured offer; Amazon does not document this reading); `getItemOffers` `IsBuyBoxWinner`, `Summary.BuyBoxPrices`; Pricing Health in Seller Central (the seller reads it). Keepa with `offers`: `stats.buyBoxIsUnqualified`, `buyBoxSellerIdHistory` (`-1`), `csv[18]` (`-1`), `competitivePriceThreshold` / `suggestedLowerPrice` (set "if the buy box is suppressed"). |
| Constraint (eligibility rollout; gap fill) | whether the store still applies the seller gate | The store's own "Becoming the Featured Offer" page through the help hub (method/help-page-access.md); never a remembered date. |
| Constraint (account; gap fill) | AHR, account status, policy states | `GET_V2_SELLER_PERFORMANCE_REPORT`, `GET_V1_SELLER_PERFORMANCE_REPORT` via `createReport` → `getReport` → `getReportDocument` (door.md's; request-only; Selling Partner Insights). `ACCOUNT_STATUS_CHANGED` if a destination exists. Data Kiosk `accountHealth` group. |
| Competitor / constraint (new sellers; gap fill) | a new `SellerId`, an offer-count jump, a new Featured Offer holder | `getItemOffers` `Summary.TotalOfferCount`, `Offers[].SellerId`, `MyOffer`, `IsBuyBoxWinner` (door.md's). Keepa `csv[11]`, `buyBoxSellerIdHistory` (`-2` = new seller). Diff against the last kept copy. |
| Confounder (own promotions; gap fill) | the seller's deals, coupons and price discounts in a window | Promotions API `searchPromotions` (statuses, start/end filters), `getPromotion`, `getSelection`. |
| Confounder (ads; gap fill) | budget-outs, paused campaigns, hourly ad traffic | Amazon Ads API / Amazon Marketing Stream (an AWS destination); not reachable from the box today. Per-product daily ad spend only: Data Kiosk Economics `ads` (role read from the `createQuery` result). For campaign state and budget-outs, cx asks the seller. Owner: angles/paid-keywords.md. |
| Constraint (fees; gap fill) | size tier, measured dimensions, fee estimates | `GET_FBA_ESTIMATED_FBA_FEES_TXT_DATA` (door.md's; once per day per seller; content refreshed at least every 72 hours); diff against the last kept copy. |
| Constraint (capacity, IPI; gap fill) | capacity block, days of supply | The report routes in angles/inventory-and-fulfillment.md (door.md's names). The IPI score and Capacity Monitor are Seller Central screens. |
| Own-listing / competitor (merge, variation; gap fill) | ASIN redirected, merged or moved to another family | Keepa `isRedirectASIN` (needs `offers`), `parentAsin`, `parentAsinHistory`; `getCatalogItem` `includedData=relationships,summaries`, recording the ASIN asked for and the ASIN returned. |
| Exposure (category; gap fill) | browse node or rank category changed | `getCatalogItem` `includedData=classifications,salesRanks` (`classificationRanks`, `displayGroupRanks`); Keepa `salesRankReference`, `salesRankReferenceHistory`, `rootCategory`. |
| Plumbing (push; gap fill) | whether any push trigger is live | Notifications API `getDestinations`, and `getSubscription` per type (needs the type's role). `createDestination` (grantless) and `createSubscription` (`payloadVersion`, `destinationId`, `processingDirective`) only after a platform ruling. |

**Keepa fields per signal.** Typed path `cx get amazon/us/<ASIN>/product --source keepa`; conversions are in the keepa skill's `references/product-file.md`.

- **Competitor price:** `csv` slots 0 (Amazon), 1 (new), 18 (Buy Box); `stats.current`; `lastPriceChange` (a change) versus `lastUpdate` (a check).
- **Coupons and deals:** `coupon`, `couponHistory` (Keepa: tracked "since June 15th 2024"), `deals`, slot 8 (lightning deal).
- **Rank and sales outcome:** slot 3, `salesRanks`, `salesRankReference`, `salesRankReferenceHistory` (category moves), `stats.salesRankDrops30`, `monthlySold`, `monthlySoldHistory`.
- **Reviews:** slots 16 (rating) and 17 ("review count" in `Product.java`, "rating count" on Keepa's Product Object page and in the box's `references/product-file.md`; what it counts is checked at run time). Its freshness is `lastRatingUpdate` and the slot's last data point. Keepa's freeze note ("has not been updated since April 9th 2025 as that data point was removed by Amazon") is on the variation-specific `reviews.ratingCount` only, not on slot 17.
- **Offers and Buy Box:** `buyBoxSellerIdHistory`, `offers` / `liveOffersOrder`, slots 11/34/35 (offer counts), `buyBoxEligibleOfferCounts`, `competitivePriceThreshold` ("if the buy box is suppressed").
- **Stock-outs:** `stats.outOfStockPercentage90`, `availabilityAmazon`.
- **Variations:** `parentAsin`, `parentAsinHistory`.
- **Content (current only; diff kept files):** `title`, `itemHighlights`, `features`, `description`, `images`, `videos`, `aPlus` (Keepa's field name; only with the `aplus` request parameter), `brand`.
- **Freshness:** `lastUpdate`, and the request's `update` hours. Keepa's library: "If the product's last refresh is older than update-hours force a refresh … Default 1." Keepa's Product Request page: "If our last update is older than ~1 hour, it will be automatically refreshed before being delivered", and "All offers-related data is updated independently, irregularly, and not as often as all other product data" (https://keepa.com/api-docs/product.html, re-read 2026-10-14). The box's Keepa skill: "`latest` accepts a copy up to 1h old".

Each Keepa read is kept as a dated copy of cx's own. The day-2 run saw a fresh read overwrite `product.json`; whether or not that holds, cx does not rely on the landed file surviving the next read.

## Pages read

All dates read 2026-10-14. developer-docs.amazon.com 301-redirects to developer-docs.amazon; both forms are given where cited.

| Page name | URL | Date read | What it gave |
|---|---|---|---|
| Notification Type Values | https://developer-docs.amazon/sp-api/docs/notification-type-values | 2026-10-14 | every trigger-relevant type, payloads, timing for hourly types, ANY_OFFER_CHANGED scope, BRANDED_ITEM_CONTENT_CHANGE scope, OfferChangeType values |
| Notifications API | https://developer-docs.amazon/sp-api/docs/notifications-api | 2026-10-14 | fallback advice; no delivery guarantee stated |
| Set up notifications using the Amazon EventBridge workflow | https://developer-docs.amazon/sp-api/docs/set-up-notifications-with-amazon-eventbridge | 2026-10-14 | AWS-account prerequisite; seven EventBridge types |
| Listings APIs FAQ | https://developer-docs.amazon/sp-api/docs/listings-apis-faq | 2026-10-14 | 1–5 min read, 15–20 min notification delay; "must use push"; brand-owner precedence |
| Usage Plans and Rate Limits | https://developer-docs.amazon/sp-api/docs/usage-plans-and-rate-limits | 2026-10-14 | "Rely on push notifications…", "Code naturally against events…" |
| Analytics Reports | https://developer-docs.amazon/sp-api/docs/report-type-values-analytics | 2026-10-14 | Sales and Traffic options, partial-period rule, no latency stated; BA report periods; vendor-only hourly reports |
| Seller Analytics Dataset Use Case Guide | https://developer-docs.amazon/sp-api/docs/seller-analytics-dataset-guide | 2026-10-14 | 34 h / "10 AM local time two days later"; 45-day returns lag; domains; benchmarks |
| Schedule Data Kiosk Queries | https://developer-docs.amazon/sp-api/docs/schedule-data-kiosk-queries | 2026-10-14 | "Do not query too frequently…" |
| Data Kiosk Query Processing Finished Notification | https://developer-docs.amazon/sp-api/docs/data-kiosk-notification | 2026-10-14 | completion notification payload |
| Reports API FAQ | https://developer-docs.amazon/sp-api/docs/reports-faq | 2026-10-14 | generation time varies; Data Kiosk "limited compared to the Reports API"; no freshness figure |
| Schedule and retrieve reports | https://developer-docs.amazon/sp-api/docs/schedule-and-retrieve-reports | 2026-10-14 | `createReportSchedule` + `REPORT_PROCESSING_FINISHED` via SQS |
| Inventory Reports | https://developer-docs.amazon/sp-api/docs/report-type-values-inventory | 2026-10-14 | suppressed/inactive listing reports; 1–6 h cache |
| Fulfillment by Amazon (FBA) Reports | https://developer-docs.amazon/sp-api/docs/report-type-values-fba | 2026-10-14 | 30-min / 4-h generation; per-report freshness |
| Manage Listings Issues | https://developer-docs.amazon/sp-api/docs/manage-listings-issues | 2026-10-14 | async issues; enforcement actions; schema conformance; issue 100708 |
| Product Pricing API and Notifications FAQ | https://developer-docs.amazon/sp-api/docs/pricing-faq | 2026-10-14 | PRICING_HEALTH vs ANY_OFFER_CHANGED; CEP, ASP definitions |
| getCompetitiveSummary | https://developer-docs.amazon/sp-api/reference/getcompetitivesummary | 2026-10-14 | `similarItems` (up to 20), segments, rate |
| SP-API Release Notes | https://developer-docs.amazon/sp-api/docs/sp-api-release-notes | 2026-10-14 | 2025–2026 changes: seller analytics dataset, similarItems, promotions, CEL filters, issue classification |
| SP-API Product Metadata Updates | https://developer-docs.amazon/sp-api/docs/sp-api-metadata-updates | 2026-10-14 | monthly product-type change log |
| SP-API Deprecations Schedule | https://developer-docs.amazon/sp-api/docs/sp-api-deprecations | 2026-10-14 | LISTINGS_ITEM_ISSUES_CHANGE 1.0 removal 2026-08-26 |
| Role Mappings for SP-API Types | https://developer-docs.amazon/sp-api/docs/role-mappings-for-types | 2026-10-14 | roles per notification/report type |
| SP-API docs index (llms.txt) | https://developer-docs.amazon/sp-api/llms.txt | 2026-10-14 | page map used to find the above |
| selling-partner-api-models (SQP, Search Catalog Performance and Search Terms report schemas; BrandedItemContentChange, DetailPageTrafficEvent, AnyOfferChanged schemas; listingsItems_2021-08-01; catalogItems_2022-04-01; productPricing_2022-05-01; Data Kiosk `analytics_sellerAnalytics_2025_03_31` and `analytics_salesAndTraffic_2024_04_24` GraphQL) | https://github.com/amzn/selling-partner-api-models (main @ bad4c9b6ad6a88fc57d9aa98760901d8c8c47179) | 2026-10-14 | field-level truth for SQP shares, notification payloads, includedData values |
| Get actionable B2B insights with Amazon business reports | https://sell.amazon.com/blog/amazon-business-reports | 2026-10-14 | "By date" hourly vs daily; two-year history; review-schedule guidance |
| What is Amazon Brand Analytics? | https://sell.amazon.com/blog/brand-analytics | 2026-10-14 | "generally available within three days"; dashboards |
| Maximize Your Sales Potential with the Amazon Featured Offer (formerly Buy Box) | https://sell.amazon.com/blog/buy-box-featured-offer | 2026-10-14 | ineligibility causes; Pricing Health page |
| What is Amazon BSR and how does it work? | https://sell.amazon.com/blog/amazon-best-sellers-rank | 2026-10-14 | BSR = sales; not page views/reviews |
| How to fix Amazon listing errors | https://sell.amazon.com/blog/amazon-listing-errors | 2026-10-14 | Fix Your Products / search-suppressed tab route |
| Test listing content with Manage Your Experiments | https://sell.amazon.com/tools/manage-your-experiments | 2026-10-14 | winners auto-publish |
| Automate Pricing | https://sell.amazon.com/tools/automate-pricing | 2026-10-14 | 24/7 repricing, <15 min updates |
| Amazon Brand Registry | https://sell.amazon.com/brand-registry | 2026-10-14 | BA/MYE positioning only |
| Ready, set, sell! Prepare for Prime Day 2026 | https://sell.amazon.com/blog/prime-day-tips | 2026-10-14 | event prep, deals as confounders |
| Prime Day 2026: Amazon's 4-day deal event starts June 23 | https://www.aboutamazon.com/news/retail/amazon-prime-day-june-2026 | 2026-10-14 | dates |
| When is Amazon Prime Day 2026? Shop deals now through June 26 | https://www.aboutamazon.com/news/retail/amazon-prime-day-2026-date | 2026-10-14 | dates, end time |
| Prime Big Deal Days 2026 is set for October 6-7, 2026 | https://www.aboutamazon.com/news/retail/amazon-prime-big-deals-day-2026-when-october-6-7 | 2026-10-14 | dates, start time, early deals |
| Seasonal relevance in e-commerce search | https://www.amazon.science/publications/seasonal-relevance-in-e-commerce-search | 2026-10-14 | 39% seasonal queries; ranking uses season |
| An Empirical Analysis of Algorithmic Pricing on Amazon Marketplace | https://mislove.org/publications/Amazon-WWW.pdf | 2026-10-14 | repricer frequency, Buy Box volatility |
| Always Valid Inference (arXiv:1512.04922) | https://arxiv.org/abs/1512.04922 | 2026-10-14 | continuous-monitoring false alarms |
| A Dirty Dozen | https://exp-platform.com/Documents/2017-08%20KDDMetricInterpretationPitfalls.pdf | 2026-10-14 | novelty effects |
| Keepa API backend `Product.java`, `Request.java`, `Tracking.java` | https://github.com/keepacom/api_backend (master) | 2026-10-14 | field docs; no content history; `update` default; Tracking API causes (price/stock only), webhook/API pull |
| Google SRE book ch. 6 Monitoring Distributed Systems | https://sre.google/sre-book/monitoring-distributed-systems/ | 2026-10-14 | alerting philosophy |
| Helium 10 Alerts article and tool page; Amazon Seller Metrics; SQP article; Market Tracker | URLs in "What practitioners add" | 2026-10-14 | watch lists, settings, quiet hours, cadence |
| Jungle Scout Alerts; KPIs; two price-monitoring articles; Brand vs Category; Product Performance | URLs in "What practitioners add" | 2026-10-14 | thresholds as user settings, market-relative judging |
| Marketplace Pulse: Amazon Is Burying Organic Search Results; Amazon's AI Doesn't Read the Rankings; Amazon's Longest Prime Day and Biggest AI Test | https://www.marketplacepulse.com/articles/… (slugs above) | 2026-10-14 | search-page movers |
| Seller Central help (Featured Offer G37911; error codes G17781) | https://sellercentral.amazon.com/help/hub/reference/external/G37911 and …/G17781 | 2026-10-14 | first pass: a plain fetch returns the help hub's JavaScript shell, not the article (method/help-page-access.md A1). Gap fill: G37911 read through the help hub content call, version 19, "This page has been removed" (a pointer to G201687550). Reconciliation: G17781 "Error code explanations" read from its capture (version 13); it lists error causes and points to per-error pages, and states no trigger or timing. |
| Amazon Ads API docs (Marketing Stream overview; search-term report) | https://advertising.amazon.com/API/docs/en-us/guides/amazon-marketing-stream/overview | 2026-10-14 | first pass: unreachable, client-rendered shell. Gap fill: the Marketing Stream overview was read as Markdown on the content host (row below). |
| Seller Forums "News" announcements | — | 2026-10-14 | first pass: no thread id known and the web-search budget was exhausted. Gap fill: the Featured Offer eligibility News post was read (row below). |
| Ancker et al., alert fatigue, BMC Med Inform Decis Mak 2017 | https://bmcmedinformdecismak.biomedcentral.com/articles/10.1186/s12911-017-0430-8 | 2026-10-14 | unreachable: publisher bot challenge (Springer) |
| Amazon Brand Analytics tool page | https://sell.amazon.com/tools/amazon-brand-analytics | 2026-10-14 | loaded; no timing statements |
| *Gap fill, 2026-10-14* | | | |
| Becoming the Featured Offer (G201687550, v20 r0) | https://sellercentral.amazon.com/help/hub/reference/external/G201687550 (content call) | 2026-10-14 | seller eligibility removed "As of September 2026"; "will not feature any offer"; FO % over page views; VoC complaints and seller performance as factors |
| Featured Offer eligibility (G200418100, v23) | https://sellercentral.amazon.com/help/hub/reference/external/G200418100 (content call) | 2026-10-14 | "This page has been removed" (saved copy in the office's capture folder (outside this repository), not re-fetched; text matches the live G201687550 sentence) |
| Pricing Health (GSTH6YN3BR8XNWBW, v22 r0) | https://sellercentral.amazon.com/help/hub/reference/external/GSTH6YN3BR8XNWBW (content call) | 2026-10-14 | offer-level ineligibility (external and recent prices); "which (if any) offer"; competitive price threshold definition |
| Business reports glossary (G27691, v7 r1) | https://sellercentral.amazon.com/help/hub/reference/external/G27691 (content call) | 2026-10-14 | Featured Offer percentage definition and its three reasons below 100% |
| Updates to Featured Offer eligibility requirements (Seller Forums News, News_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/7336583f-09ac-41de-99d1-667017a88db2 | 2026-10-14 | July 2026 start, global by end of 2026, selection unchanged, no guarantee |
| Account Health Rating program policy (G200205250, v24 r2) | https://sellercentral.amazon.com/help/hub/reference/external/G200205250 (content call) | 2026-10-14 | 0–1,000 scale, bands, 180 days, immediate deactivation clause |
| Inventory performance (G202174810, v9 r1) | https://sellercentral.amazon.com/help/hub/reference/external/G202174810 (content call) | 2026-10-14 | IPI's four categories; 90-day excess definition |
| IPI frequently asked questions (GZJF4DY2W6MERBAL, v19 r2) | https://sellercentral.amazon.com/help/hub/reference/external/GZJF4DY2W6MERBAL (content call) | 2026-10-14 | weekly scores; 4–8 weeks' notice of threshold; daily sell-through; new ASINs excluded 90 days |
| FBA capacity limits (GAFNWEYTJUV2GBFC, v22 r2) | https://sellercentral.amazon.com/help/hub/reference/external/GAFNWEYTJUV2GBFC (content call) | 2026-10-14 | monthly limits, fourth-week announcement, shipment block |
| Variation relationship FAQ (G201951410, v16 r1) | https://sellercentral.amazon.com/help/hub/reference/external/G201951410 (content call) | 2026-10-14 | variation and review merge "under 15 minutes", 24 hours before a case |
| Voice of the Customer help page | candidate ids G202102210, G202102200, GTRDLL38PRD2KLJJ through the content call | 2026-10-14 | unreachable: `HelpArticleNotFound` for each guessed id; the real id is unknown |
| Set up notifications using the Amazon Simple Queue Service workflow | https://developer-docs.amazon/sp-api/docs/set-up-notifications-with-amazon-sqs | 2026-10-14 | AWS prerequisites; SQS types incl. B2B_ANY_OFFER_CHANGED, ACCOUNT_STATUS_CHANGED, FEE_PROMOTION; createDestination / createSubscription parameters; eventFilter table; FIFO not supported; duplicates; no ordering; NotificationId; notification structure |
| Create and Filter Notification Subscriptions | https://developer-docs.amazon/sp-api/docs/filter-notification-subscriptions | 2026-10-14 | filterExpression types, CEL limits, has() trap, exclusivity with eventFilter |
| createSubscription (reference) | https://developer-docs.amazon/sp-api/reference/createsubscription | 2026-10-14 | EventFilter schema, AggregationTimePeriod example, MarketplaceIds |
| createDestination (reference) | https://developer-docs.amazon/sp-api/reference/createdestination | 2026-10-14 | SqsResource ARN pattern; EventBridge accountId + region; one resource type per destination |
| Subscribe to the ORDER_CHANGE Notification | https://developer-docs.amazon/sp-api/docs/tutorial-subscribe-to-order-change-notification | 2026-10-14 | ORDER_CHANGE eventFilter = orderChangeTypes only |
| Notifications API (re-read) | https://developer-docs.amazon/sp-api/docs/notifications-api | 2026-10-14 | grantless operations; multiple payload versions per type |
| Notification Type Values (re-read) | https://developer-docs.amazon/sp-api/docs/notification-type-values | 2026-10-14 | B2B_ANY_OFFER_CHANGED, ACCOUNT_STATUS_CHANGED, FEE_PROMOTION, PRICING_HEALTH wording, filter support per type; no merge type |
| Product Pricing API and Notifications FAQ (re-read) | https://developer-docs.amazon/sp-api/docs/pricing-faq | 2026-10-14 | PRICING_HEALTH vs ANY_OFFER_CHANGED; "confirm you meet the eligibility criteria" |
| getCompetitiveSummary (re-read) | https://developer-docs.amazon/sp-api/reference/getcompetitivesummary | 2026-10-14 | `featuredBuyingOptions` optional; `segmentedFeaturedOffers` minItems 1 |
| Retrieve a list of featured offers for a batch of up to 20 ASINs | https://developer-docs.amazon/sp-api/docs/retrieve-featured-offers-batch-asins | 2026-10-14 | `CompetitivePrice` all stores except JP; `CompetitivePriceThreshold` JP only |
| SP-API Deprecations Schedule (re-read) | https://developer-docs.amazon/sp-api/docs/sp-api-deprecations | 2026-10-14 | CompetitivePriceThreshold reference price removed 2025-09-30 |
| SP-API Release Notes (re-read) | https://developer-docs.amazon/sp-api/docs/sp-api-release-notes | 2026-10-14 | filterExpression added May 27, 2026 |
| Role Mappings for SP-API Types (re-read) | https://developer-docs.amazon/sp-api/docs/role-mappings-for-types | 2026-10-14 | roles for ACCOUNT_STATUS_CHANGED, B2B_ANY_OFFER_CHANGED, PRICING_HEALTH, DETAIL_PAGE_TRAFFIC_EVENT, promotion/coupon/sales-and-traffic reports |
| Performance Reports | https://developer-docs.amazon/sp-api/docs/report-type-values-performance | 2026-10-14 | V1/V2 seller performance reports, request-only, Selling Partner Insights |
| Fulfillment by Amazon (FBA) Reports (re-read) | https://developer-docs.amazon/sp-api/docs/report-type-values-fba | 2026-10-14 | FBA Fee Preview Report fields, 72-hour refresh, once per day |
| Promotions API; searchPromotions; promotions_2025-12-01.json | https://developer-docs.amazon/sp-api/docs/promotions-api ; …/reference/searchpromotions ; github.com/amzn/selling-partner-api-models (main) | 2026-10-14 | promotion types, statuses, event id, roles, 0.1/4 rate |
| getCatalogItem; Catalog Items API guides | https://developer-docs.amazon/sp-api/reference/getcatalogitem ; …/docs/catalog-items-api ; …/docs/retrieve-catalog-item-details ; …/docs/search-catalog-items | 2026-10-14 | classifications, salesRanks, relationships; nothing on merges |
| productPricingV0.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/product-pricing-api-model/productPricingV0.json | 2026-10-14 | TotalOfferCount, SellerId, MyOffer, IsBuyBoxWinner, IsFeaturedMerchant wording |
| Overview - Amazon Marketing Stream; Migrate from Version 1 | https://d3a0d0y2hgofx6.cloudfront.net/en-us/guides/amazon-marketing-stream/overview.md ; …/v2/migrate-from-v1.md | 2026-10-14 | hourly traffic, budget messages at 5%, Firehose/SQS, no FIFO, v1 shut-off 2027-06-30, v2 Parquet to S3 |
| Keepa `Product.java`, `Stats.java` (re-read) | https://github.com/keepacom/api_backend (master) | 2026-10-14 | competitivePriceThreshold / suggestedLowerPrice "if the buy box is suppressed", buyBoxIsUnqualified, buyBoxSellerIdHistory -1/-2, csv[18] -1, isRedirectASIN, parentAsinHistory, salesRankReferenceHistory, rootCategory, csv[11], csv[16], csv[17] |
| Listing Lounge: Incorrect ASIN Merge (Michelle_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/fdadeb6d-3b10-4486-a499-bccccf6a312a | 2026-10-14 | Amazon may merge identical pages; unmerge tool; Brand Registry rule; sellers ask for merge notices |
| Getting past the first level of support Merged ASINs | https://sellercentral.amazon.com/seller-forums/discussions/t/c9e76bed03938f02b54bf073124a3252 | 2026-10-14 | merges without notice (sellers) |
| Amazon Buy Box Suppressed: What Causes It and How to Get It Restored (RepricerExpress) | https://www.repricerexpress.com/amazon-buy-box-suppressed-causes-and-fixes/ | 2026-10-14 | suppressed vs lost; causes; practitioner thresholds |
| How to Audit an Amazon Product Listing (Anata) | https://anatainc.com/amazon-buy-box-suppression-fix/ | 2026-10-14 | suppression vs Featured Offer separation; 30-day re-audit |
| Amazon Voice of the Customer (VoC): Replacing the Customer Reviews Dashboard in 2026 (Seller Labs) | https://www.sellerlabs.com/blog/amazon-voice-of-the-customer-transition-2026/ | 2026-10-14 | VoC replaced Customer Reviews 2025-10-01 |
| Amazon Growth Checklist (PDF, ecomranker.com) | https://ecomranker.com/wp-content/uploads/2026/02/Amazon_Growth_Checklist.pdf | 2026-10-14 | not used: anonymous, and its text could not be decoded by the fetch tool |
| NIST/SEMATECH e-Handbook §6.3.2, 6.3.2.3, 6.3.2.3.1, 6.3.2.4, 6.3.3.2 | https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc32.htm (and pmc323, pmc3231, pmc324, pmc332) | 2026-10-14 | ARL 371 / 91.75, CUSUM small shifts, EWMA λ and independence assumption, known-parameter caveat |
| Overdispersion and underdispersion; Overview for Laney P' Chart; Methods and formulas for Laney P' Chart (Minitab) | https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/control-charts/ (supporting-topics/understanding-attributes-control-charts/overdispersion-and-underdispersion/; how-to/attributes-charts/laney-p-chart/…) | 2026-10-14 | narrow limits with large subgroups; Laney limits wider; z-score and Sigma Z method |
| Continuous Inspection Schemes (Page 1954) | https://academic.oup.com/biomet/article-abstract/41/1-2/100/456627 ; Crossref | 2026-10-14 | metadata only; text behind paywall |
| Control Chart Tests Based on Geometric Moving Averages (Roberts 1959) | https://www.tandfonline.com/doi/abs/10.1080/00401706.1959.10489860 ; Crossref | 2026-10-14 | unreachable: HTTP 403; Crossref metadata only |
| Improved Control Charts for Attributes (Laney 2002) | https://www.tandfonline.com/doi/abs/10.1081/QEN-120003555 ; Crossref | 2026-10-14 | unreachable: bot challenge / 403; Crossref metadata only |
| Controlling the False Discovery Rate (Benjamini & Hochberg 1995) | https://academic.oup.com/jrsssb/article/57/1/289/7035855 ; Crossref | 2026-10-14 | abstract (via Crossref) |
| *Reconciliation, 2026-10-14* | | | |
| Business reports (G200633570, v8 r1) | https://sellercentral.amazon.com/help/hub/reference/external/G200633570 (capture capture `G200633570-v8`) | 2026-10-14 | "up to two years"; "lag of 24 hours" |
| Business Reports FAQ (G28761, v7 r0) | https://sellercentral.amazon.com/help/hub/reference/external/G28761 (capture capture `G28761-v7`) | 2026-10-14 | by-date hourly, others daily, weekly by end of Sunday; Sunday–Saturday week; app traffic since 2022-03-29 |
| Search Query Performance dashboard (G8J4CB5ZBF3NX7TP, v5 r0) | https://sellercentral.amazon.com/help/hub/reference/external/G8J4CB5ZBF3NX7TP (capture capture `G8J4CB5ZBF3NX7TP-v5`) | 2026-10-14 | organic and Sponsored Products, widgets excluded; "-" means unavailable; no attribution window, lag or retention stated |
| Error code explanations (G17781, v13 r1) | https://sellercentral.amazon.com/help/hub/reference/external/G17781 (capture capture `G17781-v13`) | 2026-10-14 | error causes; nothing on triggers |
| Product title requirements and guidelines (GYTR6SYGFA5E3EQC, v21); Amazon search glossary (GF6B8ZPNY2AP72VV, v2); My ASIN is unsearchable (GHGHDMU4X5K9QGCV, v6); Variation relationship FAQ (G201951410, v16) | https://sellercentral.amazon.com/help/hub/reference/external/<id> (captures under the office's capture folder (outside this repository)) | 2026-10-14 | the latency figures in Open question 8 |
| Analytics Reports (re-read as Markdown) | https://developer-docs.amazon/sp-api/docs/report-type-values-analytics.md | 2026-10-14 | "Maximum reporting periods" defined as a request span; "Requests cannot span multiple periods"; lookback lists for vendor reports only; Sales and Traffic two-year start limit |
| sellingPartnerSearchQueryPerformanceReport.json; sellingPartnerSearchCatalogPerformanceReport.json (re-read) | https://github.com/amzn/selling-partner-api-models (main @ bad4c9b6ad6a88fc57d9aa98760901d8c8c47179) | 2026-10-14 | Sunday start / Saturday end "or else a fatal error returns"; one marketplace; SCP "Impressions include sponsored search results"; SQP silent on sponsored |
| analytics_sellerAnalytics_2025_03_31.graphql; analytics_economics_2024_03_15.graphql (re-read) | https://github.com/amzn/selling-partner-api-models (main @ bad4c9b6ad6a88fc57d9aa98760901d8c8c47179), schemas/data-kiosk/ | 2026-10-14 | `featureOfferPct` over glance views; `conversionRatePct` search purchases over clicks; `conversationRatePct` deprecated; Economics `ads` per product, MSKU×DAY default |
| productPricing_2022-05-01.json (re-read) | https://github.com/amzn/selling-partner-api-models (main @ bad4c9b6ad6a88fc57d9aa98760901d8c8c47179) | 2026-10-14 | getCompetitiveSummary 0.033 / 1 default; `x-amzn-RateLimit-Limit` header |
| Role Mappings for SP-API Types (re-read as Markdown) | https://developer-docs.amazon/sp-api/docs/role-mappings-for-types.md | 2026-10-14 | Sales and Traffic and coupon reports: Brand Analytics; promotion report: Brand Analytics or Selling Partner Insights; V2 seller performance: Selling Partner Insights; no Data Kiosk entry |
| Product Object; Product Request (Keepa API documentation) | https://keepa.com/api-docs/product-object.html ; https://keepa.com/api-docs/product.html | 2026-10-14 | slot 17 "rating count history"; freeze note on `reviews` only; "~1 hour" refresh on request; offers data "updated independently, irregularly" |
| Keepa skill (box) SKILL.md and references/product-file.md | src/source-packages/keepa/box/skills/keepa/ (comchatx main checkout, read only) | 2026-10-14 | `latest` up to 1 h old; `cx raw keepa --record`; slot 17 "rating count, not written reviews"; no statement that a read overwrites `product.json` |

## Open questions

1. **Sales and Traffic report latency.** Amazon's API page states none. The Data Kiosk dataset says 34 hours, about 10 AM local two days later. Seller Central's Business Reports pages (read from captures at reconciliation) give the Seller Central view's clocks: "by date" hourly, other reports daily with the previous day's data, the past week by the end of Sunday, and "a lag of 24 hours when compared to the real-time data". None of this is stated for the API report. *Settle by* the first real run: request yesterday and the day before, and record which days come back non-zero.
2. **SQP availability lag.** The blog says "within three days" for Brand Analytics; the API page says nothing, and neither does the Seller Central SQP page (capture G8J4CB5ZBF3NX7TP v5). *Settle by* requesting the just-closed Sunday–Saturday week on Monday through Wednesday and recording the first `DONE` with rows. door.md owns the wait.
3. **Do `LISTINGS_ITEM_ISSUES_CHANGE`-class issues include the Featured-Offer price warning (`100708`) outside Validation Preview?** The page says it is "new to Validation Preview" only. *Settle by* reading `getListingsItem` issues on a listing known to be Featured-Offer-ineligible.
4. **Will the box ever have a notification destination?** Every hourly signal (glance views, sales events, offer changes, pricing health, content changes) is push-only. *Settle by* a platform ruling (AWS account, consumer, per-tenant routing). This is not this package's to decide. Gap fill: what such a ruling must cover is now known from Amazon's pages:
   - an AWS account;
   - a standard (non-FIFO) SQS queue with SP-API write permission (and KMS access if encrypted), or an EventBridge bus for the listing types;
   - one grantless `createDestination`;
   - one `createSubscription` per type, under that type's role;
   - a consumer that deduplicates by `NotificationId` and tolerates disorder.

   Still open: per-tenant routing. One application destination receives every authorising seller's events. The payloads carry seller identifiers (for example `SellerId` in `B2B_ANY_OFFER_CHANGED`, `sellerId` in `PRICING_HEALTH`), and routing by them is a platform design question.
5. **Keepa's background refresh frequency per product.** Partly answered at reconciliation: Keepa's Product Request page says a request refreshes data "older than ~1 hour" before delivering it (the `update` parameter, default 1 hour), and that offers-related data (which includes slots 16 and 17) "is updated independently, irregularly" (angles/competitor-set.md quotes the same page). Still open: how often Keepa re-checks a product between requests, which decides whether a daily read's history arrays are complete between reads. *Settle by* comparing `lastUpdate` and `csv[15]` (offer-data update history) across daily reads in the first watch week.
6. **Whether `similarItems` matches what a seller calls "my competitors".** *Settle by* comparing it to the seller's own named set on the first real review.
7. **The 24-hour attribution window for SQP cart adds and purchases** is a practitioner claim. Amazon's SQP help page (Search Query Performance dashboard, G8J4CB5ZBF3NX7TP v5, read from its capture at reconciliation) does not state it; it points to a "Metric Glossary" for "precise definitions", which was not read. *Settle by* that glossary.
8. **The roadmap's "indexing hours to days; rank effect 1–2 weeks"** found no Amazon source. Amazon does state several latencies, each for a different path, and they do not reduce to one figure (reconciled 2026-10-14 from the captures and pages named):
   - `getListingsItem` reflects a write "within 1-5 minutes"; listing notifications run "15-20 minutes" behind (Listings APIs FAQ).
   - Variation families and reviews merge "in under 15 minutes", with "a full 24 hours" before contacting support (Variation relationship FAQ, G201951410 v16).
   - Listing reports may come from a cache of "between one and six hours" (Inventory Reports).
   - A title or item-highlights update "is accepted immediately but can take 24 to 48 hours to be processed and displayed on Amazon stores, including search results and the product detail page" (Product title requirements and guidelines, GYTR6SYGFA5E3EQC v21). method/effect-measurement.md's note that this figure is found only in forums is wrong: it is on Amazon's page.
   - "It can take up to 72 hours for changes to new or existing ASINs to go live. Latency can be slower or faster, depending on the website traffic volumes and other technical factors." (Amazon search glossary, GF6B8ZPNY2AP72VV v2); "Any changes to an ASIN’s offer, browse node, launch date can take up to 72 hours to reflect in shopping results." (My ASIN is unsearchable, GHGHDMU4X5K9QGCV v6).
   - Business Reports lag real-time data by 24 hours (G200633570 v8); Data Kiosk seller analytics are ready "after 34 hours" (dataset guide).

   These are figures for human readers; no trigger or skill line takes one as a wait. cx confirms that a change is live by reading it (`getListingsItem`, `getCatalogItem`), and a rank effect window stays an effect-review question. *Settle by* observation windows in effect-review runs.

Gap fill, 2026-10-14:

9. **What `IsFeaturedMerchant` (v0) and Featured Offer % show for a seller formerly ineligible.** The model still defines `IsFeaturedMerchant` as eligibility "to win the Buy Box". *Settle by* one `getItemOffers` read on the seller's ASIN in the first real run, and the Business Reports Featured Offer % for the weeks around the store's switch.
10. **The per-store switch date of the eligibility removal.** Amazon gives "gradually … completing by the end of 2026". *Settle by* each store's own "Becoming the Featured Offer" page through its own help hub (`sellercentral.amazon.<tld>`, locale per method/help-page-access.md A5), re-read monthly until every store the seller uses says so.
11. **The shape of `getCompetitiveSummary` when no offer is featured.** The model allows `featuredBuyingOptions` to be absent. Amazon does not say that absence means suppression. *Settle by* reading an ASIN that Keepa marks `stats.buyBoxIsUnqualified = true` on the same day.
12. **Whether `PRICING_HEALTH` and `ANY_OFFER_CHANGED` still carry `competitivePriceThreshold` outside JP** after the reference-price removal of September 30, 2025 (shared with angles/price-position.md Open question 3). *Settle by* a live payload, which needs a destination.
13. **What `getCatalogItem` returns for a merged-away ASIN** (the surviving ASIN, an error, or the stale record). No Amazon page says. *Settle by* the first case where Keepa `isRedirectASIN` is true: read `getCatalogItem` on the old ASIN and record what comes back.
14. **Named operator routines.** The web-search budget ran out before agency or tool-vendor routine pages (daily, weekly, monthly) could be found and opened. *Settle by* a second pass reading at least two named agencies' published SOPs, or Jack's own routine as the operator.
15. **Re-measurement and size-tier change pages.** No Amazon help page on dimension re-measurement was found in this pass. *Settle by* the help hub's FBA fees hierarchy (the `hierarchyNode` of G201074400 "FBA features and fees" lists its children).
16. **The Voice of the Customer help page id.** Three guessed ids failed. *Settle by* opening the Voice of the Customer page in Seller Central once (the URL carries the id), then reading it through the content call.
17. **Calibration of a statistical watch.** Not settled from sources:
    - which chart per metric (EWMA on weekly sessions; a Laney-style p′ chart on conversion and Featured Offer %; CUSUM on SQP share);
    - how much history each needs (NIST's caveat on estimated parameters);
    - how to remove weekly and seasonal pattern before charting.

    *Settle by* a backtest on the first 26 or more weeks of kept data per ASIN: count alarms per week across all series when nothing was changed, and tune to a stated false-alarm budget.

## Positions

1. **P-triggers-1** — A trigger is a reason for cx to look, and its report names the family (competitor, demand, own-listing, constraint), the funnel stage it threatens and the file that shows it; it never by itself justifies a listing edit. — Manage Listings Issues; Maximize Your Sales Potential with the Amazon Featured Offer; What is Amazon BSR and how does it work?; Google SRE ch. 6 [opinion].
2. **P-triggers-2** — Before any content proposal, cx checks the constraints first: `issues` and `BUYABLE`/`DISCOVERABLE` from `getListingsItem`, the Featured Offer holder and reference prices from `getCompetitiveSummary`, and own stock, because copy cannot fix suppression, a price-ineligible offer or a stock-out. — Manage Listings Issues; listingsItems model; Product Pricing API and Notifications FAQ; Becoming the Featured Offer; Pricing Health; FBA Reports.
3. **P-triggers-3** — cx separates demand from competition with Search Query Performance: a fall in a query's `searchQueryVolume` or totals is demand, a fall in the ASIN's `asin*Share` at stable totals is competition or the listing. — SQP report schema; Analytics Reports.
4. **P-triggers-4** — cx compares an own-metric move with the same-period movement of the market (SQP totals, the competitor set's Keepa history, same period last year) before calling it a listing problem. — SQP report schema; Seller Analytics Dataset Use Case Guide (benchmarks); Seasonal relevance in e-commerce search [research]; Amazon Brand Performance: Are You Beating the Category? [opinion].
5. **P-triggers-5** — cx reads competitor price and Featured Offer moves from history arrays and Keepa `stats`, not from two snapshots, because repriced offers can change many times a day. — An Empirical Analysis of Algorithmic Pricing on Amazon Marketplace [research]; Automate Pricing; Keepa `Product.java`.
6. **P-triggers-6** — cx keeps every market and listing read as its own dated file and finds content changes (title, bullets, description, images) by comparing kept files, because Keepa documents no history field for content and a landed product file is not a kept record (the day-2 run saw a fresh read overwrite it). — Keepa `Product.java`; Product Object (Keepa API documentation); internal run report 20261014-0921, lesson 6.
7. **P-triggers-7** — cx checks whether the live page still matches what the seller last submitted (`getCatalogItem` against `getListingsItem` and the last kept file), because under Manage Your Experiments' default settings the winning version publishes automatically and higher-precedence contributors can change attributes. — Test listing content with Manage Your Experiments; Listings APIs FAQ; Notification Type Values (`BRANDED_ITEM_CONTENT_CHANGE`).
8. **P-triggers-8** — cx sets each look's cadence to its source's refresh: never more often than the data changes, on the report's own period bounds for Brand Analytics (weeks as the schema defines them), and the readiness stated by the dataset guide, read at run time, for daily analytics. — Schedule Data Kiosk Queries; Seller Analytics Dataset Use Case Guide; Analytics Reports; What is Amazon Brand Analytics?
9. **P-triggers-9** — cx never reads the latest partial or not-yet-ready period as a drop: a Sales and Traffic period ending in the future is partial, a delayed Data Kiosk day is `null`, and returns lag weeks. — Analytics Reports; Seller Analytics Dataset Use Case Guide.
10. **P-triggers-10** — cx treats any window that contains a major Amazon sale (including its early-deal days) as not comparable to one without, and takes the dates from Amazon's announcement. — Prime Day 2026 and Prime Big Deal Days 2026 announcement pages; Ready, set, sell! Prepare for Prime Day 2026.
11. **P-triggers-11** — cx treats a rule change as a constraint trigger by re-reading the product-type schema before every write, since Amazon changes product-type metadata on a published recurring schedule. — SP-API Product Metadata Updates; Manage Listings Issues.
12. **P-triggers-12** — cx tells the seller that Amazon's hourly and event signals (offer changes, pricing health, content changes, issue changes, hourly traffic and sales) arrive only as push notifications to an AWS destination, so a watch from the box pulls state on its cadence instead. — Notification Type Values; Set up notifications using the Amazon EventBridge workflow; Usage Plans and Rate Limits.
13. **P-triggers-13** — The standing instruction written by `/listing-watch` states what to watch (ASINs, the competitor set, which families), how often, the seller's own thresholds, when to speak, when to stay quiet (quiet hours, sale windows, already-reported changes), and where to report; the package supplies no default threshold. — Amazon Product Alerts (Jungle Scout) [opinion]; Alerts: 7 New Powerful Methods (Helium 10) [opinion]; Google SRE ch. 6 [opinion].
14. **P-triggers-14** — cx speaks between scheduled summaries only for a signal that is new and that the seller can act on (a suppression, a lost Featured Offer, a stock-out, a content change nobody on the seller's side made), and folds the rest into the summary. — Google SRE ch. 6 [opinion]; Amazon Product Alerts (Jungle Scout) [opinion]; Alerts: 7 New Powerful Methods (Helium 10) [opinion]; Manage Listings Issues.
15. **P-triggers-15** — cx builds the competitor set from the seller's named rivals plus Amazon's `similarItems`, and confirms what each is before tracking it. — getCompetitiveSummary; SP-API Release Notes.
16. **P-triggers-16** — cx does not read a BSR change or an organic-rank change as a verdict on listing content, because BSR reflects sales only and the share of the search page given to organic results is set by Amazon's layout and ads. — What is Amazon BSR and how does it work?; Amazon Is Burying Organic Search Results [opinion]; Amazon's AI Doesn't Read the Rankings [opinion].

Gap fill, 2026-10-14:

17. **P-triggers-17**: cx treats "no Featured Offer on the product" as its own constraint trigger, separate from "Featured Offer held by another seller", and checks price against Pricing Health's references, stock and shippability before any content review. — Becoming the Featured Offer; Pricing Health; Keepa `Product.java` / `Stats.java`.
18. **P-triggers-18**: cx does not tell a seller their account is "not eligible" for the Featured Offer without reading the store's current Becoming the Featured Offer page, because Amazon is removing seller-level eligibility store by store on a schedule it announces, and the page says which regime applies. — Becoming the Featured Offer; Featured Offer eligibility; Updates to Featured Offer eligibility requirements.
19. **P-triggers-19**: cx reads a `PRICING_HEALTH` item, or a Pricing Health entry, as a price problem on the seller's own offer, not as a competitor move and not as a listing-content problem. — Notification Type Values; Product Pricing API and Notifications FAQ; Pricing Health.
20. **P-triggers-20**: cx marks any baseline that spans the store's eligibility switch as not comparable for Featured Offer % and conversion, because a formerly ineligible seller's Featured Offer % can rise with no listing change. — Becoming the Featured Offer; Business reports glossary; Updates to Featured Offer eligibility requirements.
21. **P-triggers-21**: cx designs no push trigger until the platform has an AWS destination. When one exists, the trigger counts each `NotificationId` once and orders events by `EventTime`, because Amazon may deliver a notification more than once and out of order. — Set up notifications using the Amazon Simple Queue Service workflow; Notifications API; createSubscription.
22. **P-triggers-22**: cx lists the seller's own promotions overlapping a window (Promotions API) before reading a move as market or listing, and names any as a confounder. — Promotions API; searchPromotions; promotions_2025-12-01.json.
23. **P-triggers-23**: cx checks account status and the account health report as a constraint before a content review, because seller performance is a Featured Offer factor and account actions can suppress offers. — Account Health Rating program policy; Performance Reports; Notification Type Values; Becoming the Featured Offer.
24. **P-triggers-24**: cx records, in every kept read, the ASIN it asked for and the ASIN and parent that came back, and raises a merge or redirect when they differ (Keepa `isRedirectASIN`, `parentAsinHistory`, Catalog `relationships`), because Amazon sends no notice of a merge. — Notification Type Values; Listing Lounge: Incorrect ASIN Merge; Keepa `Product.java`; getCatalogItem.
25. **P-triggers-25**: cx treats a new seller on the ASIN (a new `SellerId`, an offer-count jump, `-2` in Keepa's Buy Box seller history) as a constraint trigger for brand owners, with a new seller holding the Featured Offer as the urgent case. — productPricingV0.json; Keepa `Product.java`; Notification Type Values.
26. **P-triggers-26**: cx re-reads size tier, dimensions and fee estimates from the FBA Fee Preview Report no more often than the report's page allows and flags a changed tier as a margin constraint, not a listing effect. — Fulfillment by Amazon (FBA) Reports.
27. **P-triggers-27**: cx treats a capacity block, a low days-of-supply or a stock-out forecast as a reason to keep a content test out of the window it will hit. — FBA capacity limits; IPI frequently asked questions; Inventory performance.
28. **P-triggers-28**: cx treats a change of rank category or browse node as making the previous rank series incomparable, and reports it as a trigger in its own right. — getCatalogItem; Keepa `Product.java`.
29. **P-triggers-29**: the standing instruction states the watch's false-alarm budget for the whole watch (all ASINs × metrics), not only a per-metric threshold, and cx charts each metric against that ASIN's own history. — NIST/SEMATECH e-Handbook §6.3; Benjamini and Hochberg 1995; Google SRE ch. 6 [opinion].
30. **P-triggers-30**: cx does not chart a rate over thousands of sessions (conversion, Featured Offer %) with plain binomial limits, because large-subgroup limits are too narrow when the rate itself drifts. — Overdispersion and underdispersion (Minitab) [opinion]; NIST/SEMATECH e-Handbook §6.3.3.2.

**The seat's own (not for a skill)**

- [seat] The box needs a notification consumer to turn polling into push. A platform-side SQS/EventBridge receiver per tenant would make P-triggers-12's limitation go away. It is a platform decision with cost, a new AWS account and a data-handling face, so it is out of scope here.
- [seat] Daily is a sensible default for a heartbeat that reads Keepa and `getListingsItem`; weekly for SQP; monthly for a market re-scan. This is the seat's inference from the refresh clocks, not a source, and the seller's instruction overrides it.
- [seat] A threshold stated over a window (for example "below the 4-week range for two consecutive weeks") will raise fewer false alarms than a one-day crossing. This rests on the analogy to continuous monitoring (Johari et al.), not on any Amazon source.
- [seat] Practitioner "real-time 24/7" alerting is aimed at hijackers and Buy Box theft on resold ASINs, a different problem from listing optimisation. For a private-label brand owner, the high-value pushes are content drift and suppression.
- [seat] The Keepa Tracking API (webhook or API pull; causes limited to price, stock and expiry per `Tracking.java`) is a push alternative for competitor price and stock. It is not in the gate's Keepa route table today.

Gap fill, 2026-10-14:

- [seat] **False-alarm arithmetic.** NIST's ARL of about 371 for a plain 3-sigma rule is per series and assumes independence, normality and known limits. Take a modest watch: 40 ASINs × 5 weekly metrics = 200 series. It would raise about 200 / 371 ≈ 0.5 false alarms a week under ideal conditions, roughly one every two weeks. Adding run rules (ARL about 92) gives about 2 a week. Overdispersion and seasonality push both higher. A watch therefore needs a stated budget (for example "at most one unforced alert a month across the whole watch"), and per-series limits must be set from it, not the other way round.
- [seat] **A plausible design for /listing-watch, untested:**
  - deseasonalise each weekly series against the same weeks last year, or a trailing median of the same weekday mix, where history allows;
  - chart the residual with EWMA (λ about 0.2–0.3) for slow drift and a CUSUM for small step changes;
  - for proportions over large n, set limits from the observed week-to-week spread of z-scores (the Laney idea) rather than from the binomial;
  - across all series in one week, rank alarms and keep those that survive a false-discovery-rate cut.
  - This rests on the sources above by analogy. Nothing in it has been run on Amazon data.
- [seat] **Hard constraints are exempt from statistics.** A suppression, an `ACCOUNT_STATUS_CHANGED` to `AT_RISK`, a lost or suppressed Featured Offer, a stock-out and an ASIN redirect are events, not noisy rates. They alert on occurrence. The control-chart machinery is for rates (sessions, conversion, Featured Offer %, SQP shares), where alert fatigue lives.
- [seat] **Order matters in a single reading.** When several families fire at once, cx can rank them by the funnel: constraint first (suppression, no Featured Offer, stock, account), then competitor and demand, then own-listing.

## Verification

Adversarial check, 2026-10-14, by a second research seat. Every developer-docs page cited was re-fetched (raw HTML from developer-docs.amazon, text extracted and searched for the quoted phrases); model JSON files were read at selling-partner-api-models `main` @ `bad4c9b6ad6a88fc57d9aa98760901d8c8c47179` (the commit the file names, confirmed as `main`'s head today); the sell.amazon.com, aboutamazon.com, Helium 10, Jungle Scout, Marketplace Pulse and Google SRE pages were re-fetched and their titles, authors and published/modified metadata compared; the four papers were opened (amazon.science abstract page, the WWW 2016 PDF, the arXiv abstract, the KDD 2017 PDF); Keepa claims were checked against `Product.java`, `Stats.java`, `Request.java` and `Tracking.java` in keepacom/api_backend `master`. No Amazon or Keepa API host was called. The file contains no store name, seller id, real ASIN or store figure; the run-report quotes match the day-1 and day-2 reports.

**Claims checked:** about 115 (every [official] quote and figure, every notification row and its role, every [opinion] attribution and quote, every [research] citation and finding, the Keepa field names).

**Corrections (was → now):**
1. Notification table intro said all rows were verified on Notification Type Values → `DATA_KIOSK_QUERY_PROCESSING_FINISHED` is not on that page; now cited to "Data Kiosk Query Processing Finished Notification", with its real fields (`processingStatus`, `dataDocumentId` only when data exists, `errorDocumentId`) and trigger wording ("finishes processing").
2. `ANY_OFFER_CHANGED` quoted only "a change to any of the top 20 offers" → now the full trigger list (external price change, Buy Box winner, Buy Box price), the landed-price rule, and Amazon's definitions of `External` / `Internal`.
3. `DETAIL_PAGE_TRAFFIC_EVENT` "covers the earlier hour" → "the hour before the previous hour" (Amazon's words); the sales and inventory events cover "the previous hour".
4. `ITEM_INVENTORY_EVENT_CHANGE` role was blank → Brand Analytics (Role Mappings for SP-API Types).
5. `BRANDED_ITEM_CONTENT_CHANGE` image note attributed only to the schema → schema wording kept and the docs page's newer, weaker wording added.
6. SQP "Maximum lookback of 17 months for MONTH" (presented as a quote) → the page's real wording, "Maximum reporting periods … MONTH: 17 months"; it is not called a lookback.
7. SQP "One marketplace" and "enforced by `FATAL` per the schema" were cited to Analytics Reports, which says neither → now cited to the SQP and Search Catalog Performance report schemas, which say "a fatal error returns". Added that the Analytics Reports page's availability clocks and `FATAL`-if-not-ready rule belong to vendor reports only.
8. Top Search Terms "with click and conversion share" → the page's "most-clicked ASINs by search keyword and department"; the schema's "top-3 clicked ASINs" and its four fields.
9. Data Kiosk "Snapshot metrics are kept for eight weeks" → the eight-week limit applies only to the 120-day product-defect snapshot metrics at `WEEK` (24 months at `MONTH`; same-date at `DAY`). Added the guide's "within one to two business days" partial-data note, the `endDate` cap, and that a grouped-row `null` can mean "not available at this granularity".
10. Delayed-data quote was truncated to end at "`null`." → full sentence ("…null for the specific date or dates for which data is unavailable").
11. Listings APIs FAQ quote "Brand owners have the highest precedence to update product detail page data" (not verbatim) → verbatim, with the next sentence on overriding Amazon's own data by a ticket.
12. Manage Your Experiments "Winning content is also published automatically" stated without its condition → it holds under the "pre-selected settings"; a seller-chosen duration (Amazon advises 8 to 10 weeks) is the alternative. Stable sentence and P-triggers-7 tightened to "default settings".
13. "Amazon added seasonal-relevance features to ranking" → the abstract reports an A/B test on "a major e-commerce store" by Amazon authors, not a deployment; transfer tightened from "direct" to "close on mechanism".
14. Keepa content field `aplus` → `aPlus` (Keepa's field name; the `aplus` request parameter is required).
15. Page name "SP-API Deprecation Schedule" → "SP-API Deprecations Schedule" (three places).
16. Page name "When is Amazon Prime Day 2026?" → "When is Amazon Prime Day 2026? Shop deals now through June 26".
17. Helium 10 article title "See the Bigger Picture with Market Tracker" → "… with Market Tracker by Helium 10".
18. Business Reports blog "published 2025-08-06" → shown on the page as "Aug 5, 2025" (metadata 2025-08-06 UTC).
19. Stable sentence "Brand Analytics periods are whole weeks, months or quarters" → limited to SQP and Search Catalog Performance; Top Search Terms also has `DAY`.
20. Added (sourced): the Sales and Traffic note's caching and 7-to-30-day advice and that it can be scheduled; the Reports API FAQ's "No data can be found for the report" as a cause of `CANCELLED`.

**Confirmed as written (selection):** the EventBridge page's AWS-account prerequisite, one-destination limit and seven types; the 15–20 minute and 1–5 minute figures; "you must use push notifications"; the Usage Plans quotes; the `PRICING_HEALTH` and Competitive External Price quotes; `LISTINGS_ITEM_ISSUES_CHANGE` severities, four enforcement actions and the 1.0 payload's August 26, 2026 removal; `LISTINGS_ITEM_STATUS_CHANGE` statuses; the 34-hour / 10 AM sentence (it sits in the guide's FAQ); 45-day returns lag; benchmarks; the Schedule Data Kiosk Queries quotes; the Manage Listings Issues quotes and issue 100708; the 2026-09-30, 2026-07-29 and 2026-04-01 release notes; `getCompetitiveSummary`'s 0.033/1 rate, `similarItems` "up to 20" and `promotions`; the 1–6 hour listing-report cache and the FYP report being the one schedulable report on its page; FBA 30-minute / four-hour limits and per-report freshness; the metadata-updates table (32 rows, January 19, 2024 to September 28, 2026, `.xlsx` links); the BA, Featured Offer and BSR blog quotes and dates; the Prime Day and Prime Big Deal Days dates and times; every practitioner quote, author and date; the four papers' authors, venues, years and quoted findings; the SRE chapter's author, editor and quotes; Keepa's `couponHistory` date, the `ratingCount` note, csv slot numbers, `competitivePriceThreshold` wording, `update` default and Tracking causes.

**Still unverified:**
- Seller Central help pages (G37911, G17781 and the Business Reports help page): a plain fetch returned a page titled "Amazon" with no help content. Superseded: that is the help hub's JavaScript shell; all were later read through the content call (G37911 v19 in the gap fill; G17781 v13, Business reports G200633570 v8 and Business Reports FAQ G28761 v7 from their captures at reconciliation). They give the Seller Central view's clocks only; the API report's latency and the SQP availability lag still rest on Open questions 1 and 2.
- Amazon Ads API pages and Seller Forums announcements: not re-tried.
- The Ancker et al. BMC paper: not re-tried; no finding is cited from it.
- `getFeaturedOfferExpectedPriceBatch`, `getItemOffers`, `getPricing` and `getInventorySummaries` appear in the run-time table only as operation names; `getFeaturedOfferExpectedPriceBatch` was confirmed in the Product Pricing 2022-05-01 model, and the others were not opened.
- Johari et al. is cited as the 2015 arXiv preprint; the peer-reviewed version was not checked.

**What a senior Amazon operations lead would expect and does not find here (not researched now):**
- Account-health triggers as a family member: Account Health Rating, policy warnings, IP complaints, listing deactivations for safety or restricted-product reasons, and the `ACCOUNT_STATUS_CHANGED` and other account notifications.
- Hijacker and unauthorised-seller detection as a constraint for brand owners (new offers on the ASIN, offer-count changes), and the Brand Registry tools that report them.
- The Promotions API (v2025-12-01, launched in the 2026-08-26 release notes) and the coupon or promotion performance reports, as the source for the seller's own deal calendar, which is a confounder.
- Advertising as a trigger and confounder: the sponsored-ads search-term and impression-share reports, Amazon Marketing Stream's hourly push, and budget-out or campaign-paused events; the Ads API pages were unreachable.
- Review and rating signals from Amazon itself (Voice of the Customer / NCX, Customer Reviews in Brand Analytics), not only Keepa counts.
- Variation-family changes (parent/child merges and splits) and ASIN merges as content-drift triggers, and how Catalog Items `relationships` shows them.
- Fee, size-tier and dimension re-measurements (a practitioner watch item) and their sources (FBA fee preview report).
- Inventory-performance constraints: FBA capacity limits, IPI, low-inventory-level fee, stranded and inbound problems as a stock-out precursor.
- Category or browse-node reassignment and BSR category changes (Keepa `salesRankReference` is listed, the Amazon source is not).
- The cadences of named operator routines (daily Buy Box and suppression sweep, weekly SQP read-out, monthly market re-scan) from more than one practitioner, and any source on how agencies phrase a client monitoring brief.

Gap fill 2026-10-14: 12 gaps filled, 5 left open

How the additions were re-checked: every quote added in A (three table rows), A2, B (the Featured Offer paragraph), C, D, the practitioners section, published research, stable lines and positions was searched again in the copy of its page saved this session. Help-hub pages were checked against the content-call text, developer-docs pages against their Markdown, Keepa against `Product.java` / `Stats.java`, NIST against the page text, and Benjamini and Hochberg against a fresh Crossref record. Corrections made in the re-check:
- the Marketing Stream FIFO quote was rewritten to Amazon's two sentences;
- the `FEE_PROMOTION` first-subscription sentence was attributed to Notification Type Values, not the SQS tutorial;
- the NIST ARL sentence was re-quoted without the page's formula markup;
- Page 1954 is no longer said to be cited by NIST; the pages read do not cite it;
- the RepricerExpress figures are marked as a paraphrase.

No Amazon or Keepa API host was called. No store name, seller id, real ASIN or store figure was added.

Filled:
1. Featured Offer constraint after the seller-eligibility removal: the RULE text, PRICING_HEALTH as offer-level, Featured Offer % over page views, the suppressed state, and how Keepa, `getCompetitiveSummary` and v0 show it (B; C; stable lines; P-triggers-17 to 20).
2. Notifications plumbing:
   - the AWS prerequisite;
   - grantless `createDestination` (SQS ARN or EventBridge account and region);
   - `createSubscription` per type and payload version;
   - `eventFilter` scope (aggregation and `marketplaceIds` for `ANY_OFFER_CHANGED` only; `orderChangeTypes` for `ORDER_CHANGE`) and `filterExpression`;
   - `B2B_ANY_OFFER_CHANGED`;
   - delivery terms (standard queues, duplicates, no ordering, `NotificationId`).

   See A, A2, C and P-triggers-21.
3. Account health: AHR, `ACCOUNT_STATUS_CHANGED`, performance reports (D1; P-triggers-23).
4. Hijackers and new sellers (D2; P-triggers-25).
5. The Promotions API calendar and report roles (D3; P-triggers-22).
6. Ads through Amazon Marketing Stream (D4). The first pass's "unreachable" is superseded through the content host.
7. Review and complaint signals (D5). Partial: the VoC help page itself is open.
8. Variation timing, ASIN merges and the merge/redirect detector (D6; P-triggers-24). Partial: Catalog behaviour on a merged ASIN is open.
9. Fees and size tier through the FBA Fee Preview Report (D7; P-triggers-26). Partial: re-measurement is open.
10. IPI and capacity (D8; P-triggers-27).
11. Browse node and rank category (D9; P-triggers-28).
12. Statistical process control: ARL, CUSUM, EWMA, Laney-style limits through Minitab, FDR, and the seat's arithmetic (published research; practitioners; seat; P-triggers-29 and 30).

Left open (Open questions 9 to 17):
1. Named operator routine cadences: the web-search budget ran out (D10; OQ 14).
2. An Amazon page on re-measurement and size-tier disputes (OQ 15).
3. The Voice of the Customer help page id (OQ 16).
4. What `getCatalogItem` returns for a merged-away ASIN (OQ 13).
5. Full texts of Page 1954, Roberts 1959, Laney 2002 and Montgomery: metadata only, or not opened. Chart calibration stays a backtest question (OQ 17).

Superseded "Still unverified" items above:
- G37911 is now read: a removed-page pointer to G201687550.
- The Marketing Stream overview is now read.
- The Seller Forums News post on eligibility is now read.
- G17781 and the Business Reports help pages were not re-read in the gap fill; G27691, the glossary, was read instead. At reconciliation all three were read from their captures (G17781 v13, G200633570 v8, G28761 v7): the "sign-in wall" in "Still unverified" was the help hub's JavaScript shell, not a sign-in requirement (method/help-page-access.md A1–A2).

**Reconciled 2026-10-14** (against the critics' contradictions list; sources re-opened: the SQP and Search Catalog Performance report schemas, the Analytics Reports and Role Mappings pages as Markdown, the seller-analytics and Economics Data Kiosk schemas, productPricing_2022-05-01.json, Keepa's `Product.java` and its Product Object and Product Request pages, the box's Keepa skill, and the help-page captures G200633570-v8, G28761-v7, G8J4CB5ZBF3NX7TP-v5, G17781-v13, G37911-v19, GYTR6SYGFA5E3EQC-v21, GF6B8ZPNY2AP72VV-v2, GHGHDMU4X5K9QGCV-v6 and G201951410-v16). No Amazon or Keepa API host was called; no help page was fetched.
1. Business Reports help page: "unreachable (sign-in wall)" → the capture texts of Business reports (G200633570) and Business Reports FAQ (G28761), with their clocks; Open question 1 no longer says "sign-in needed".
2. SQP `MONTH: 17 months`: the page defines "Maximum reporting periods" as a request span, while the same page says SQP "Requests cannot span multiple periods". Both now named as Amazon's own disagreement, with the binding answer the report's own result at run time. The three-year (Brand Analytics blog), two-year (Business Reports; Sales and Traffic API start limit) figures are set apart as different products.
3. SQP week: this file's Sunday–Saturday rule re-checked against the schema and the page, and now quoted. angles/paid-keywords.md was the wrong one and has withdrawn its note.
4. SQP and sponsored results: added the SQP help page's "includes organic and Sponsored Products" (capture) and the SCP schema's sentence, with the consequence for share triggers; new stable line. angles/search-rank-and-volume.md's "unreachable" for that page is the stale one.
5. Featured Offer %: added that Data Kiosk's `featureOfferPct` is over glance views and Business Reports' over page views (both Amazon's), plus the schema definitions of `conversionRatePct`, the deprecated `conversationRatePct` and `search.catalog` `conversionRate`; the stable line and run-time row say the definition is read from the source used.
6. Featured Offer eligibility: section C already marked the April 2026 blog's "eligibility tests" superseded; the stable line and P-triggers-2 now cite Becoming the Featured Offer and Pricing Health instead of the removed "Featured Offer page", and P-triggers-18 no longer carries the announced end date.
7. Keepa `csv[17]`: "review count" only → both of Keepa's names ("review count" in `Product.java`, "rating count" on the Product Object page and in the box's reference), checked at run time; the April 9, 2025 freeze is placed on the variation-specific `reviews.ratingCount` only (D5, run-time Keepa list, stable line).
8. Keepa refresh (Open question 5): partly answered from Keepa's Product Request page ("~1 hour" on request; offers data "irregularly"); the background cadence stays open.
9. Keepa overwrite: P-triggers-6 cited the Keepa skill's `references/product-file.md` for "replaced on each read"; neither that file nor SKILL.md says so. Now attributed to the day-2 run report's observation, and the run-time line no longer states it as Keepa behaviour.
10. Ads confounder: added Data Kiosk Economics `ads` (per-product spend, MSKU×DAY default) as a partial source without the Ads API, with the role read from `createQuery` (D4; run-time row). method/effect-measurement.md's "no ads source until the Ads API is connected" is the incomplete one.
11. Latency (Open question 8): "Only the 1–5 min … and 15–20 min … figures are Amazon's" was wrong; now lists each Amazon figure with its path and page (including the title page's "24 to 48 hours" and the glossary's "up to 72 hours"), states that none is a wait for a skill, and notes that method/effect-measurement.md's "forums only" for the 24–48 hour figure is wrong.
12. Open question 7: the SQP help page was read (capture) and does not state the 24-hour attribution window; it now points to the Metric Glossary.
13. Rates and roles: getCompetitiveSummary's 0.033/1 re-checked against the model (they agree) with the `x-amzn-RateLimit-Limit` header as the binding value; roles re-checked on Role Mappings (Sales and Traffic and coupon: Brand Analytics; promotion: Brand Analytics or Selling Partner Insights). angles/seasonality-and-events.md's "promotion report needs Selling Partner Insights" is incomplete; this file stands. This file never assigned a Data Kiosk dataset role; the run-time preamble now says it is read from `createQuery`.
14. Positions and stable lines: P-triggers-8 (period bounds from the schema; readiness at run time), P-triggers-18 (no announced end date) and P-triggers-26 ("no more often than the report's page allows" instead of a fixed count) no longer state a figure Amazon keeps in a schema or changes by announcement.
15. Cross-references: method/report-lifecycle.md added beside door.md for the report lifecycle; angles/inventory-and-fulfillment.md (the merged file) is the only inventory reference; no reference to elements/vendor-and-hybrid.md. Pages read gained a reconciliation block; the G37911/G17781 and Seller Forums News rows were brought up to date.
