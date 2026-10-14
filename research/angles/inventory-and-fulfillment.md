# Inventory and fulfillment: stock, the delivery promise and FBA fees as a gate on buyability and a confounder

Read 2026-10-14 by the research seat. Tags: [official] Amazon's own page or document; [opinion] a named practitioner; [research] published research; [seat] the seat's own reasoning, never a skill position.

Two seats researched this angle on 2026-10-14: one wrote `inventory-and-fulfillment.md` (US spelling), the other wrote `inventory-and-fulfilment.md` (British spelling) as a gap fill. This file is their merge. It holds the union of both files' sourced content, deduplicated. Where the two disagreed, the cited page was re-opened where the rules allow, and the winner is named under *Verification*.

How pages were read.

- **Seller Central help pages.** Pages at `https://sellercentral.amazon.com/help/hub/reference/external/<id>` are JavaScript shells. Both seats read each body through the help hub's own content call (`POST https://sellercentral.amazon.com/help/hub/mons-api/GetHelpTopic`, body `{"guid":"<id>","layer":"external","locale":"en-US"}`; see method/help-page-access.md A2). Each reply carried the page's title, version and `Live` status in layer `Published/US`, and the version is recorded below. The URL recorded is the page's public URL. The merge pass did not call the content call. It re-read only the help pages captured under the office's capture folder (outside this repository) (G201687550 v20 and GHGHDMU4X5K9QGCV v6). The reconcile pass read those two captures and two more (G200418100 v23 and G37911 v19) and made no content call either. A page that has a capture there was read on 2026-10-14, whatever another file says about it.
- **"Unreachable" help-page ids.** Where this file says an id answered HTTP 400, the seat did not record the error body. Per method/help-page-access.md A3, the content call answers HTTP 400 both for "Rate exceeded" (transient: seven of sixteen back-to-back calls there got it) and for `HelpArticleNotFound`. So "unreachable" here means "not read on 2026-10-14", not "the page does not exist".
- **SP-API pages.** Read in their `.md` form at `developer-docs.amazon/sp-api/...`; the `developer-docs.amazon.com` host redirects there.
- **Models and schemas.** Read from the `main` branch of `amzn/selling-partner-api-models`.
- **Keepa fields.** Read from Keepa's Java client, `keepacom/api_backend` on `master`.
- **Hosts not called.** No Amazon API host and no Keepa API host was called.
- **Search.** The session's shared web-search budget ran out early, after one search for one seat and partway through for the other. New practitioner and research sources could only be reached through URLs already known. That limit is noted wherever it bites.

## What this covers

**Funnel stage: all three, as a gate and a confounder rather than a content lever.** Stock and the delivery promise are not listing content, but they act at every stage:

- **Exposure.** "In order to be searchable, an ASIN needs a buyable offer." A stock-out can take an ASIN out of search when no other offer is buyable. Shoppers can also filter results by delivery day.
- **Click-through.** The search results page shows a delivery message. Amazon counts impressions, clicks, cart adds and purchases separately for same-day, one-day and two-day messages (Search Catalog Performance).
- **Conversion.** "Your offer can't become featured if you're out of stock." The Featured Offer also leans on delivery speed and certainty, and it differs with the shopper's shipping location. Amazon says faster, more accurate promises raise the likelihood of a purchase.

**Skills fed.**

- **effect-review** (main). Stock-outs are its commonest confounder, along with a slower promise, a lost Prime badge, a fee-period boundary and a fee-driven change in stock policy. Any of these inside a window can explain a move that a content change gets credited for. The skill needs these events and the sources that date them.
- **listing-review.** It must tell an offer problem from a content problem before any copy is proposed. Offer problems are stock, the promise, the Prime badge, and units that are stranded, reserved, researching, unfulfillable, inbound-only or regionally unavailable. Any price idea needs a fee check.
- **listing-change-log.** The offer state at write time goes into the change file beside the content change, so the observation window can be read against it later. That state covers fulfillable and inbound units, days of supply, quantity, channel, handling time, shipping template, size tier and fee estimate.
- **The report script.** Its first real customers here are the FBA reports. Names, options and waits belong to door.md (the amazon-sp-api skill's `references/door.md`, outside `research/`; "door.md's" below means the same file).

**Why a senior operator cares.** An operator checks stock and the promise before reading any conversion change. A stock-out, a lost Prime badge or a promise that slipped from two days to five looks exactly like a failed title or image. Many "the new title didn't work" verdicts are really "we ran out on day 9". A price recommendation made without fees can lose money per unit, and more so from 2026-10-15, when the holiday peak fulfillment fees start (G3).

The day-2 run showed cx doing the opposite. It proposed deleting an Inactive duplicate SKU on the same ASIN "to clean the back office", without asking why the SKU was inactive or whether FBA units sat under it (day-2 report, item D, request 9 / proposal item 9; the SKU is not reproduced here). Amazon itself creates SKUs for units that arrive mislabelled (C1), and such units sit as stranded inventory under a SKU the seller never made.

Amazon's FBA economics decide how much stock a seller can and will hold: capacity limits, the IPI, the low-inventory-level fee, inbound placement fees and size-tier fees. They are the reasons a listing runs thin, so the playbook must name them even though no listing edit touches them.

## Amazon's own rules and guidance

### A. What "buyable" and "discoverable" mean, and where live stock lives

A1. RULE (system behaviour). Listings have two main states: "**Buyable** (Can customers buy it?)" and "**Discoverable** (Can customers find it?)". "When a listing is search suppressed, it is no longer discoverable. However, this suppressed listing can still maintain its buyability." [official] (Understanding Amazon listing status and seller-fulfilled inventory management, https://developer-docs.amazon/sp-api/docs/understanding-amazon-listing-status-and-seller-fulfilled-inventory-management.md, updated 2026-09-09, read 2026-10-14)

A2. RULE. The same page's table describes Inactive listings as "Listings unavailable for purchase". Its reasons start with "Is out of stock" and include "Is past scheduled sale period", "Has no offer provided", "Is blocked from offer by Amazon" and "Is not buyable". [official] (same page)

A3. RULE. "In order to be searchable, an ASIN needs a buyable offer. If an ASIN's offer expires, this causes it to become unsearchable." "Diagnosis: ASINs without a buyable offer are unsearchable." The page's note: "Any changes to an ASIN's offer, browse node, launch date can take up to 72 hours to reflect in shopping results." [official] (My ASIN is unsearchable, https://sellercentral.amazon.com/help/hub/reference/external/GHGHDMU4X5K9QGCV, version 6, read 2026-10-14; re-read from the capture capture `GHGHDMU4X5K9QGCV-v6`)

- The 72 hours is this page's stated ceiling for offer, browse-node and launch-date changes, kept for human readers. Amazon states a different window for each kind of change (method/help-page-access.md lists them: images, titles, offers, variation families), and the research files carry other figures from other sources (see method/funnel-and-search.md, method/effect-measurement.md and method/listing-writes.md). This file sets no effect window from it. cx confirms that a restocked offer is buyable again by reading `summaries[].status` (A5), not by waiting out a figure.
- [seat] A1–A3 together: the seller's own stock-out makes its offer Inactive. If no other seller holds a buyable offer on the ASIN, the ASIN drops out of search. If another seller does, the ASIN stays searchable but the seller's own sales stop. The pages read do not state this second case outright.

A4. RULE (data semantics). "The attributes section shows the latest data provided by the selling partner. Other sections, such as `fulfillmentAvailability`, represent the latest live data for the listing. For example, if the last inventory quantity submitted was `1` and that item is sold, the attributes section shows `1` … and the `fulfillmentAvailability` section shows `0` as the live quantity available for purchase." [official] (Listings Items API, https://developer-docs.amazon/sp-api/docs/listings-items-api.md, updated 2026-09-09, read 2026-10-14). The listing-status guide calls `fulfillmentAvailability` the "source of truth for actual inventory levels". [official] (Understanding Amazon listing status…)

A5. RULE (model). `getListingsItem` takes these `includedData` values: `summaries`, `attributes`, `issues`, `offers`, `fulfillmentAvailability`, `procurement`, `relationships` and `productTypes`. The summary `status` enum is `BUYABLE` ("can be purchased by shoppers") and `DISCOVERABLE` ("visible to shoppers"). `FulfillmentAvailability` carries `fulfillmentChannelCode` and `quantity`. [official] (listingsItems_2021-08-01.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-items-api-model/listingsItems_2021-08-01.json, read 2026-10-14)

A6. FIGURE (freshness; lives on the page and may change). "Inventory reports are not near real-time. The SLA for stock data freshness is 3 hours. For subsequent report calls from the same merchant account, data is 1 to 6 hours old, depending on inventory size." `searchListingsItems` "is limited to 1000 listings total across all pages". [official] (Understanding Amazon listing status…)

A7. RULE. The page lists the reports by state:

- `GET_MERCHANT_LISTINGS_ALL_DATA` covers all listings, "active, inactive and suppressed".
- `GET_MERCHANT_LISTINGS_DATA` covers listings that are purchasable or "have zero inventory".
- `GET_MERCHANT_LISTINGS_INACTIVE_DATA` covers "zero (0) quantity, … blocked, … suppressed, … not yet opened, and … past their sale end date".
- `GET_MERCHANTS_LISTINGS_FYP_REPORT` covers suppressed listings only.

The notifications are `LISTINGS_ITEM_STATUS_CHANGE` ("when a listings item is created, deleted, or its buyability changes"), `LISTINGS_ITEM_ISSUES_CHANGE` and `LISTINGS_ITEM_MFN_QUANTITY_CHANGE` (seller-fulfilled available quantity). [official] (Understanding Amazon listing status…; Notification Type Values, https://developer-docs.amazon/sp-api/docs/notification-type-values.md, updated 2026-09-30, read 2026-10-14)

A8. RULE. Under "Delete a listing": "Deleting a listing completely removes it from the seller inventory. It does not appear in any of the reports or API data." [official] (Understanding Amazon listing status…)

### B. FBA inventory states: what counts as sellable, and where to read it

B1. RULE. "If units are stranded, reserved, being researched, or unfulfillable, customers won't be able to buy them." [official] (Inventory Buyability, https://sellercentral.amazon.com/help/hub/reference/external/GFC63UNUF6LMLK2R, version 1, read 2026-10-14). The page defines each state:

- **Stranded:** "in fulfillment centers but associated with a product that doesn't have an active offer. This is usually due to a listing or account health issue."
- **Reserved:** "Usually, it's set aside to fulfill customer orders." Also "set aside … to fulfill customer orders. In rare cases … for additional processing, verification, investigations, or pending removal orders"; "typically temporary".
- **Researching:** "Research may take up to 60 days but is typically completed much faster."
- **Unfulfillable:** "isn't in sellable condition", for example expired or damaged.

B2. RULE (regional availability). The same page says: "Your product may be temporarily unavailable for shipping to certain parts of the country. We prioritize our fulfillment capacity and fastest delivery methods to drive more sales for you." It goes on: "When we have products with limited quantities of inventory in our network … and these products have very low sales volume, there may be rare situations where the product isn't available for sale to all customers." Its advice: "maintaining sufficient inventory levels, replenishing regularly, and ensuring shipment and packaging quality". [official] (Inventory Buyability)

B3. RULE (API). FBA Inventory v1 `getInventorySummaries`:

- Without `details=true` the `inventoryDetails` object is absent: "This object will not appear if the details parameter in the request is false."
- With `details=true` it carries:
  - `fulfillableQuantity` ("The item quantity that can be picked, packed, and shipped");
  - `inboundWorkingQuantity`, `inboundShippedQuantity` and `inboundReceivingQuantity`;
  - `reservedQuantity`, split into `pendingCustomerOrderQuantity`, `pendingTransshipmentQuantity` ("being transferred from one fulfillment center to another") and `fcProcessingQuantity` ("sidelined at the fulfillment center for additional processing");
  - `researchingQuantity`, split into short-, mid- and long-term entries;
  - `unfulfillableQuantity`, split into customer-, warehouse-, distributor- and carrier-damaged, defective and expired.
- Each summary also has `totalQuantity` ("The total number of units in an inbound shipment or in Amazon fulfillment centers"), `lastUpdatedTime` and a `stores` list. The `stores` list was added in the 2024-09-25 release.
- `granularityType` is required and takes only `Marketplace`. `marketplaceIds` takes one id (`maxItems: 1`). For `Marketplace` granularity, "the fulfillable quantity will reflect inventory that could be fulfilled in the given marketplace". The API has no regional or fulfillment-center granularity.
- `sellerSkus` takes "up to 50 SKUs". The bound is stated in the model.
- `startDateTime` returns summaries "that have changed since then". It must be "no earlier than 18 months prior". "Changes in inboundWorkingQuantity, inboundShippedQuantity and inboundReceivingQuantity are not detected."
- `nextToken` "will expire 30 seconds after being created".
- Default usage plan: rate 2, burst 2. The reference page and the model's description carry the same table (re-checked in the reconcile pass). Both call it the default and say that "The x-amzn-RateLimit-Limit response header returns the usage plan rate limits that were applied to the requested operation, when available", and that higher-throughput partners "may see higher rate and burst values". The rate in force is read from that header at run time, not from this file.

[official] (fbaInventory.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/fba-inventory-api-model/fbaInventory.json; getInventorySummaries, https://developer-docs.amazon/sp-api/reference/getinventorysummaries.md, updated 2026-09-09; FBA Inventory API, https://developer-docs.amazon/sp-api/docs/fba-inventory-api.md; Get inventory summaries, https://developer-docs.amazon/sp-api/docs/get-fba-inventory-summaries.md, updated 2026-09-09; SP-API release notes, https://developer-docs.amazon/sp-api/docs/sp-api-release-notes.md; all read 2026-10-14)

B4. RULE (current FBA inventory reports). These are the run-time sources. Report type names are recorded here; options and waits belong to door.md.

- **`GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA`** (FBA Manage Inventory): "current details of active (not archived) inventory", with "Content updated in near real-time." Columns include `afn-fulfillable-quantity`, `afn-unsellable-quantity`, `afn-reserved-quantity`, `afn-researching-quantity`, the three `afn-inbound-working/shipped/receiving-quantity` columns, `afn-future-supply-buyable`, `afn-onhand-buyable-quantity` and `store`.
- **`GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT`** (Restock Inventory), near real-time. Columns include "Total Days of Supply (including units from open shipments)", "Days of Supply at Amazon Fulfillment Network", `Alert`, "Recommended replenishment qty" and "Recommended ship date".
- **`GET_FBA_INVENTORY_PLANNING_DATA`** (FBA Manage Inventory Health). Role: Amazon Fulfillment. "Not available in the NL, PL, SE, or BE stores." Columns include:
  - sales over 7, 30, 60 and 90 days;
  - inventory-age buckets and `estimated-excess-quantity`;
  - `days-of-supply`, `historical-days-of-supply`, `fba-minimum-inventory-level` and `fba-inventory-level-health-status`;
  - "Exempted from Low-Inventory-Level fee?" and "Low-Inventory-Level fee applied in current week?";
  - "Short term historical days of supply" and "Long term historical days of supply";
  - "Recommended ship-in quantity" and "Recommended ship-in date";
  - `featuredoffer-price` and `sales-rank`;
  - `is-seasonal-in-next-3-months` and `season-name`.
- **`GET_STRANDED_INVENTORY_UI_DATA`** (FBA Stranded Inventory), near real-time. Columns include `primary-action`, `date-stranded`, `stranded-reason`, `status-primary`, `error-message`, `Date-to-take-auto-removal` and `fulfillable-qty`.
- **`GET_LEDGER_SUMMARY_VIEW_DATA`** (Inventory Ledger, summary), "like a bank statement of your inventory".
  - With `aggregatedByTimePeriod` set to `DAILY` it gives an end-of-day row with `Disposition`, "Starting Warehouse Balance", `Receipts`, "Customer Shipments" and "Ending Warehouse Balance".
  - With `aggregateByLocation` set to `FC` it is per fulfillment center.
- **`GET_LEDGER_DETAIL_VIEW_DATA`** (Inventory Ledger, detail): "all historical movements of your inventory for 18 months".
- **`GET_FBA_OVERAGE_FEE_CHARGES_DATA`**: covers overage against storage limits (D6).
- **`GET_FBA_STORAGE_FEE_CHARGES_DATA`**: monthly storage estimate per ASIN, with `product_size_tier`.
- **Others:**
  - `GET_RESERVED_INVENTORY_DATA` and `GET_AFN_INVENTORY_DATA`.
  - `GET_FBA_FULFILLMENT_INBOUND_NONCOMPLIANCE_DATA`, for inbound problems: "Content updated daily".
  - `GET_REMOTE_FULFILLMENT_ELIGIBILITY`: "ASIN eligibility can change. This report can take up to 24 hours to generate".

Generation limits: "A near real-time FBA report is generated no more than once every 30 minutes" and "A daily FBA report is generated no more than once every four hours". "These frequencies describe how often Amazon generates updated report content. They do not set how many report requests you can submit." [official] (Fulfillment by Amazon (FBA) Reports, https://developer-docs.amazon/sp-api/docs/report-type-values-fba.md, updated 2026-10-13, read 2026-10-14). Role Mappings lists Amazon Fulfillment and Pricing for the MYI, stranded and fee-preview reports. [official] (Role Mappings for SP-API Types, https://developer-docs.amazon/sp-api/docs/role-mappings-for-types.md, read 2026-10-14)

B5. RULE (deprecated: do not use). These report types have been removed:

- `GET_EXCESS_INVENTORY_DATA`, `GET_FBA_FULFILLMENT_INVENTORY_HEALTH_DATA` and `GET_FBA_INVENTORY_AGED_DATA`: deprecated 2022-03-31, removed 2022-06-27.
- `GET_FBA_FULFILLMENT_CURRENT_INVENTORY_DATA`, `…_INVENTORY_ADJUSTMENTS_DATA`, `…_INVENTORY_RECEIPTS_DATA`, `…_INVENTORY_SUMMARY_DATA`, `…_MONTHLY_INVENTORY_DATA` and `GET_FBA_RECONCILIATION_REPORT_DATA`: removed 2023-01-31.

[official] (SP-API Deprecation Schedule, https://developer-docs.amazon/sp-api/docs/sp-api-deprecations.md, updated 2026-09-09, read 2026-10-14)

### C. Stranded inventory, including SKUs Amazon creates

C1. RULE. "Stranded inventory is FBA inventory in fulfillment centers that does not have an associated active offer and is not available for sale on Amazon. When inventory is stranded, it requires either reactivating the listing or removing inventory." [official] (Fix stranded inventory, https://sellercentral.amazon.com/help/hub/reference/external/G201436600, version 19, read 2026-10-14). The page also says:

- Causes include "the listing is suppressed or was never created".
- On new shipments: "If you have units of an ASIN stranded …, do not send additional inventory of that ASIN … your shipment will not be processed." "If you add an ASIN with stranded inventory to your shipment, you will receive an alert and your shipment will not be processed."
- "If you address the cause for the stranded inventory yourself, allow 48 hours for the updates to reflect in your stranded inventory."
- Amazon creates two SKU formats itself:
  - `Amazon.Found.Bxxxxxxxxx`, when "your product is not labeled correctly";
  - `FBAXXXXXXX.Missing#`, created "during an inbound shipment investigation".

  Units under these SKUs appear stranded because "the system-generated SKU does not correspond to an active listing".
- If no listing is created, the inventory "will be removed from our fulfillment centers based on your auto-removal settings".
- The page carries a banner: "The content in this help page will no longer be updated". It points to the FBA Dashboard page.

C2. RULE. Unresolved stranded units are removed or disposed of. "If you have not configured your stranded removal settings, your inventory will be disposed after maximum days allowed for the stranded reason code." "Stranded inventory units with active offers will not be automatically removed." [official] (Stranded inventory required removals, https://sellercentral.amazon.com/help/hub/reference/external/GKQ8DGGU529BJJ7E, version 14, read 2026-10-14)

### D. Capacity limits, the IPI and the Q4 inbound calendar

D1. RULE (capacity). [official] (FBA capacity limits, https://sellercentral.amazon.com/help/hub/reference/external/GAFNWEYTJUV2GBFC, version 22, read 2026-10-14)

- "You'll receive one capacity limit for each storage type per month."
- "Capacity limits are typically announced during the fourth week of the month."
- The limit "is influenced by your IPI score, as well as other factors such as historical sales volume, seasonal and peak selling periods …, forecasts for your ASINs, the new selection that you carry, deals that you've scheduled, fulfillment center capacity, and shipment lead time."
- "Individual selling accounts have a capacity limit of 15 cubic feet". "New professional selling accounts (active in FBA for less than 39 weeks) don't receive FBA capacity limits."
- Apparel and footwear storage types "are based on listing category, not physical dimensions".

D2. RULE (enforcement and Capacity Manager). [official] (FBA capacity limits)

- "If your on-hand inventory plus shipments on the way to our fulfillment centers exceeds your capacity limit, you'll be blocked from creating new shipments to Amazon."
- "Each storage type has its own independent capacity limit". "Capacity cannot be transferred or exchanged between storage types." The other seat quoted this rule as "Capacity can't be exchanged between storage types"; see *Verification*.
- "Open shipments count toward your total capacity usage".
- "Removal orders are reflected in your capacity usage within 24 hours of the order being created, even if the order is still in Pending status."
- "Customer returns are added back into your capacity usage when the returns are received."
- Capacity Manager lets a seller "request an increase … at a reservation fee that you specify". Requests are granted by "the highest reservation fee per cubic foot first". The seller earns "a $0.15 performance credit for every dollar of sales that you generate using additional capacity".

D3. RULE (IPI and its parts). [official] (Inventory performance, https://sellercentral.amazon.com/help/hub/reference/external/G202174810, version 9, read 2026-10-14)

- The IPI has four parts: excess inventory, 90-day sell-through, stranded inventory and in-stock rate.
- Excess: "We consider an item to be excess if it has over 90 days of supply based on the forecasted demand."
- In-stock rate: "the percent of time your replenishable FBA ASINs have been in stock during the last 30 days, weighted by the number of units sold for each SKU in the last 60 days".
- Lost sales: "Estimated FBA lost sales in the last 30 days is equal to the forecasted unit sales on days that your products were out of stock multiplied by the average sales price."
- "The Restock today button shows the number of SKUs for which the days of supply is less than the restock lead time."
- GUIDANCE: "A good guideline is to maintain enough inventory to cover 30 to 60 days of your expected sales."

D4. RULE (IPI FAQ). [official] (IPI frequently asked questions, https://sellercentral.amazon.com/help/hub/reference/external/GZJF4DY2W6MERBAL, version 19, read 2026-10-14)

- "The IPI score and the Inventory Performance dashboard are available only for sellers with a Professional selling plan."
- "If you are new to FBA or have not been active in the past 13 weeks, you may not have an IPI score".
- "Newly created ASINs in their first 90 days do not affect your IPI score."
- "The in-stock rate itself is not a direct input into your IPI score, and a low in-stock rate does not hurt your score, unless your most popular products consistently go out of stock".
- "A very high sell-through rate can indicate scarce inventory levels, which can lead to slower customer delivery and out of stocks."
- "Sell-through rate is updated daily and looks at the past 90 days of shipped units and average inventory over that same period."
- On storage volume limits: "We will inform you four to eight weeks before the new period limit goes into effect what the IPI threshold will be."
- GUIDANCE: "maintain enough inventory to cover 30 to 60 days of your expected sales." The same guideline is on Inventory performance (D3).

D5. FIGURE. The FBA Dashboard's key-indicator cards show the current day "with about a 15-minute delay". Its "Plan inventory" card shows the IPI score. [official] (FBA dashboard, https://sellercentral.amazon.com/help/hub/reference/external/GPDFH32J7DYNM378, version 6, read 2026-10-14)

D6. RULE (report). `GET_FBA_OVERAGE_FEE_CHARGES_DATA` covers fees for inventory "that exceeds your storage limits". Its columns include `storage_limit_volume`, `storage_usage_volume` and `overage_volume`. [official] (FBA Reports page)

D7. RULE (Q4 2026 inbound cut-offs, dated). "To maximize your sales potential and ensure your products are Prime badge-ready, your Fulfillment by Amazon (FBA) inventory must arrive at our fulfillment centers by the following dates." [official] (Q4 2026 peak readiness playbook, https://sellercentral.amazon.com/help/hub/reference/external/G4QH4XCRWUXRJBLY, version 15, read 2026-10-14)

- Black Friday Week and Cyber Monday:
  - October 14 for AWD shipments;
  - October 21 for FBA "minimal shipment splits";
  - October 28 for FBA "Amazon-optimized shipment splits".
- Prime Big Deal Days (passed): September 2, 9 and 16.
- "our fulfillment center teams will focus on receiving shipments in September and October, then shift to processing customer orders in November and December". "you may see lower estimated capacity limits for October and November."

### E. The low-inventory-level fee: why sellers run thin, and what it signals

E1. RULE. Amazon's stated reason: "When you carry low inventory relative to unit sales, it inhibits our ability to distribute products across our network, degrading delivery speed, and increasing shipping costs." [official] (Low-inventory-level fee, https://sellercentral.amazon.com/help/hub/reference/external/GV43F6S76Y9DHYRH, version 29, read 2026-10-14)

- "We'll only charge a low-inventory-level fee when both the long-term historical days of supply (last 90 days) and short-term historical days of supply (last 30 days) are below 28 days (4 weeks)."
- From 2026-01-15: "we will calculate the historical days of supply metric at the seller-FNSKU level instead of the parent-ASIN level".
- The fee is charged per unit when the order ships, by size tier, shipping weight and days-of-supply band. The bands are 0–14, 14–21 and 21–28 days. The rate table lives on the page, is for human readers only and changes by announcement.

E2. RULE (the metric). [official] (Low-inventory-level fee)

- Historical days of supply = "average daily inventory units on hand divided by average daily shipped units", over 90 and 30 days. The other seat read the page as saying the larger of the two decides; that reading is not a quote.
- Inventory counts sellable units, transfers and FC processing. "It doesn't include unsellable units (such as units that are pending removal, disposal, or liquidation), as well as units that are currently being inbounded to our fulfillment network."
- Shipped units include MCF and Remote Fulfillment.
- "The metric will be updated weekly, and the latest available historical days of supply will determine the fee rate for units shipped that week."
- On seller-fulfilled stock: "No. The historical days of supply metric only considers FBA inventory stored in our fulfillment network."
- No sales: "If your product has had no sales in the past 30 or 90 days … your historical days of supply will be above 28 days".

E3. RULE (exemptions and slow movers). The page lists five exempt cases:

- new Professional sellers, for 365 days after the first inventory-received date;
- New-to-FBA parent products in FBA New Selection, for 180 days;
- SKUs where 70% or more was auto-replenished through AWD over the prior 90 days;
- "Products that have sold less than 20 units in the past 7 days";
- Grocery.

On Amazon-caused inbound delays: "we'll automatically reimburse you if the low-inventory-level fees are charged". On slow movers: "Slower moving items will also remain exempt from low-inventory-level fees, but they may see slower delivery promises or limited nationwide availability." [official] (Low-inventory-level fee; the slow-mover line is repeated on the 2026 summary page, G1)

E4. GUIDANCE (forward metric and capacity conflict). [official] (Low-inventory-level fee, FAQ)

- "Minimum Inventory Level is a forward-looking metric measured in units". "Keeping your inventory above this minimum level helps increase delivery speed and reduces your risk of low-inventory-fee."
- On capacity conflict: "If you have a capacity limit that prevents you from inbounding products with low inventory, we recommend that you reduce excess inventory".

### F. Inbound placement: where stock lands decides how fast it can be promised

F1. RULE. "Placing your inventory closer to customers improves the delivery speed of their orders". [official] (FBA inbound placement service fee, https://sellercentral.amazon.com/help/hub/reference/external/GC3Q44PBK8BXQW3Z, version 16, read 2026-10-14) The page gives three options:

- "Minimal shipment splits": "generally to a single location, for a fee, and we'll decide on your behalf how to place the inventory across our network";
- "Amazon-optimized shipment splits": "multiple inbound locations yourself for no fee". "To qualify, shipments must include at least five identical cartons or pallets per item."
- "Partial shipment splits": Bulky only.

Further terms:

- "The availability of these inbound placement options is based on several factors, including the product types and quantities in your shipping plan, your existing inventory levels across our network, location of customer demand, and capacity availability in our fulfillment centers."
- The fee is "charged … 45 days after your shipment is received". "The fee may be adjusted periodically within the ranges listed below". It "doesn't apply to Extra-Large products".

The FBA fees overview says the fee "reflects the cost of distributing inventory to fulfillment centers close to customers". [official] (FBA features, services, and fees, https://sellercentral.amazon.com/help/hub/reference/external/G201074400, version 41, read 2026-10-14)

### G. Fees: the 2026 schedule, estimates, size tier and measurement

G1. FIGURES (2026 schedule, for human readers; the rates live on the fee pages and change by announcement). [official] (2026 US Referral and FBA fee changes summary, https://sellercentral.amazon.com/help/hub/reference/external/G201411300, version 47, read 2026-10-14)

- "In 2026, FBA fees will increase by an average of $0.08 per unit sold".
- "There will be no new FBA fee types in 2026".
- "Unless otherwise noted, all changes will be effective January 15, 2026."
- The low-inventory-level fee moved to the FNSKU level, now applies to Small and Large Bulky, and exempts Grocery.
- Standard-size inbound placement fees rose by about $0.05 per unit on minimal splits.
- A single inbound defect fee replaced the double charge.
- A new aged-inventory tier was added for items over 15 months.
- The Bulky tiers were split, and the SIPP discount on Bulky was replaced.
- Coupon variable fees are capped at $2,000 per coupon (from 2025-11-05).
- "Preview of 2026 fee rates will also be available via the economicsPreview query of the analytics_economics_2024_03_15 schema on our Data Kiosk API".

The summary page names no change to referral fees. [seat: read as silence, not as a statement.]

G2. RULE (price bands). The 2026 fulfillment fee rate cards are split by price: "<$10", "$10-$50" and ">$50". "Products priced under $10 will automatically receive Low-Price FBA rates that are $0.86 less than standard FBA rates on average." A price change that crosses $10 or $50 therefore changes the fulfillment fee per unit, not only the referral fee. [official] (2026 US FBA fulfillment fee changes, https://sellercentral.amazon.com/help/hub/reference/external/GABBX6GZPA8MSZGW, version 58, read 2026-10-14)

G3. RULE (2026 surcharge and holiday peak; dated, and live from tomorrow). [official] (2026 US FBA fulfillment fee changes, version 58; Q4 2026 peak readiness playbook, version 15; both read 2026-10-14)

- "Starting April 17, 2026, a 3.5% fuel and logistics-related surcharge will be applied to fulfillment fees across Fulfillment by Amazon (FBA) in the US and Canada".
- "holiday peak fulfillment fees will apply from October 15, 2026 to January 14, 2027". "The fuel and logistics-related surcharge will apply to these fees."
- "FBA fulfillment fees are calculated and charged when shipments leave fulfillment centers. If a product is ordered before October 15, 2026, but is shipped on or after that date, the peak fulfillment fees indicated to start on October 15, 2026 will apply."
- Amazon's tools "have all been updated to reflect the peak rates and surcharge": the Revenue Calculator, Profit Analytics, and Fee and Economics Preview.

The FBA fees index adds: "Each year, Amazon reassess the FBA fees to reflect changes in costs". [official] (FBA fulfillment fees, https://sellercentral.amazon.com/help/hub/reference/external/G200209150, version 39, read 2026-10-14)

G4. RULE (the Seller Central fee tools, and what they leave out). [official] (Estimated fee per unit sold, https://sellercentral.amazon.com/help/hub/reference/external/G200680700, version 7; Fee and Economics Preview report, https://sellercentral.amazon.com/help/hub/reference/external/GQNVDV46U9JQ25HY, version 3; both read 2026-10-14)

- "Estimated fee per unit sold" includes referral, closing, per-item and FBA fulfillment fees (with the lithium battery fee), plus fee discounts. It excludes, among others, the "Long-term storage fee", "Removal order fee" and "Return processing fee". "The value is only an estimate and actual costs may vary and do not include optional fees."
- The Fee and Economics Preview report estimates fees "at the MSKU level for up to 120 days in the future". "Data used to generate estimates in this report can be up to 24 hours old."
- "To include Low Inventory Level fees in your report be sure to select fulfillment base rate and surcharges".
- "To preview announced fee changes in this report, select a date range that includes the upcoming change date."

G5. RULE (Product Fees API v0). Three operations:

| Operation | Path | Usage plan |
|---|---|---|
| `getMyFeesEstimateForSKU` | `POST /products/fees/v0/listings/{SellerSKU}/feesEstimate` | rate 1, burst 2 |
| `getMyFeesEstimateForASIN` | `POST /products/fees/v0/items/{Asin}/feesEstimate` | rate 1, burst 2 |
| `getMyFeesEstimates` | `POST /products/fees/v0/feesEstimate` | rate 0.5, burst 1 |

- The batch takes "up to 20 product requests in a single batch".
- A request needs `MarketplaceId`, `PriceToEstimateFees` (`ListingPrice`, optional `Shipping`, `Points`) and a caller `Identifier`.
- It optionally takes `IsAmazonFulfilled` and `OptionalFulfillmentProgram`: `FBA_CORE` ("the standard Amazon fulfillment fees … This is the default"), `FBA_SNL` or `FBA_EFN`.
- The reply is a `FeesEstimate` with `TotalFeesEstimate` and a `FeeDetailList`. Each entry has `FeeType`, `FeeAmount`, `FeePromotion`, `TaxAmount` and `FinalFee`. `FeeType` is a free string; the model enumerates no values.
- `Status` reads `Success`, `ClientError` or `ServiceError`.
- The three usage plans above match between the reference pages and `productFeesV0.json` (re-checked in the reconcile pass). As with B3, they are defaults; the applied limit comes back in the `x-amzn-RateLimit-Limit` header.

[official] (getMyFeesEstimateForSKU, https://developer-docs.amazon/sp-api/reference/getmyfeesestimateforsku.md; getMyFeesEstimateForASIN, …/getmyfeesestimateforasin.md; getMyFeesEstimates, …/getmyfeesestimates.md, all updated 2026-09-10; Get product fees for a batched set of up to 20 items, https://developer-docs.amazon/sp-api/docs/get-product-fees-batch.md; productFeesV0.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/product-fees-api-model/productFeesV0.json, last commit 030c6de38d of 2025-08-27; all read 2026-10-14)

G6. RULE (what the estimate is based on). [official] (the three reference pages; Product Fees API, https://developer-docs.amazon/sp-api/docs/product-fees-api.md, updated 2026-09-09, read 2026-10-14)

- SKU: "When sellers use the `getMyFeesEstimateForSKU` operation with their `SellerSKU`, they get accurate fees based on real item measurements, but only after they've sent their items to Amazon."
- ASIN: "When using the `getMyFeesEstimateForASIN` operation with an ASIN, the fee estimates might be different. This is because these estimates use the item's catalog size, which might not always match the actual size of the item sent to Amazon."
- Both: "Actual costs may vary. Search "fees" in Seller Central and consult the store-specific fee schedule for the most up-to-date information." The API page says: "The estimated fees returned by this API are not guaranteed. Actual fees can vary."
- `FBA_SNL`: "The FBA Small and Light program sunset in the US and EU regions on September 26, 2023". It is a dead option in those regions.

G7. RULE (roles). `getMyFeesEstimates` needs the Pricing or Product Listing role. The single-item operations accept any one role from a long list that includes Amazon Fulfillment, Pricing, Product Listing, Inventory and Order Tracking, Finance and Accounting, and Selling Partner Insights. [official] (Product Fees API)

G8. RULE (FBA Fee Preview report). `GET_FBA_ESTIMATED_FBA_FEES_TXT_DATA` "Contains the estimated Amazon Selling and Fulfillment Fees for the seller's FBA inventory with active offers. The content is updated at least once every 72 hours." [official] (FBA Reports page)

- It must be requested with `dataStartTime` at least 72 hours before now and `dataEndTime` set to now.
- "This report can only be requested once per day per seller."
- Roles: Pricing, Amazon Fulfillment.
- Columns:
  - all stores: `longest-side`, `median-side`, `shortest-side`, `length-and-girth`, `item-package-weight`, `your-price`, `sales-price`, `estimated-fee-total` and `estimated-referral-fee-per-unit`;
  - the US store only (under the page's "US store only" heading): `product-size-tier`, `expected-future-fulfillment-fee-per-unit` and `estimated-future-order-handling-fee-per-order`;
  - US and Canada: `expected-fulfillment-fee-per-unit`;
  - US and Mexico: `estimated-future-fee (Current Selling on Amazon + Future Fulfillment fees)`.

G9. RULE (fees that move with size tier). "The product size tier of an item is used to calculate certain fees". These are FBA fulfillment fees, monthly storage, the aged inventory surcharge, removal, disposal, MCF and inbound placement. The 2024 tier table ended 2026-01-14. The 2026 table starts 2026-01-15, adds Small Bulky and defines Overmax. Amazon points to the Fee Preview report: "View the product size tier in the product-size-tier field." [official] (Product size tiers, https://sellercentral.amazon.com/help/hub/reference/external/GG5KW835AHDJCH8W, version 7, read 2026-10-14)

G10. RULE (Amazon's measurement governs).

- "Amazon may verify the weight and dimensions of a product using representative samples. Amazon's information … will be used to calculate fees if there is a difference …. Amazon may change its information … from time to time to reflect updated measurements. Fees … are calculated using Amazon's information … at the time the fee is calculated." [official] (Product dimensions and volume, https://sellercentral.amazon.com/help/hub/reference/external/G37G73BJXHF75ACH, version 5, read 2026-10-14)
- "When the weight or dimensions that the seller provides vary from our verified measurement, our measurement will govern." A reimbursement request must be made "within 90 days of the date on which the fee was charged". [official] (FBA fees reimbursement policy: Weight and dimensions, https://sellercentral.amazon.com/help/hub/reference/external/GL7U4JFSDXUTQAJ, version 14, read 2026-10-14)
- The capacity page also says: "If our weight and dimension information differs from yours, our information is used to calculate fees." [official] (FBA capacity limits)

G11. RULE (re-measurement process). [official] (Understanding item package weight and dimensions, https://sellercentral.amazon.com/help/hub/reference/external/G6WAEPTECPT2JUH3, version 11, read 2026-10-14)

- "Amazon uses a variety of sensors instrumented throughout fulfillment centers to capture item measurements … edge-to-edge, including loose material". "The measurement sensors will capture your item packaging edge-to-edge, including loose material, such as plastic bags, or loose parts, such as handles."
- A remeasurement "typically takes 10 days". "Your FNSKU's updated item package weight and dimensions will apply across all stores within the region where we received your request".
- Each FNSKU "can only be remeasured twice within the preceding 60 days". Account limits are monthly: "The limit is based on the number of offers with inventory in your account."
- Requests go "through the Remeasure FBA products and confirm fees widget".
- GUIDANCE: "avoid dimensions that are close to the size-tier boundaries".

G12. RULE (Data Kiosk economics). [official] (analytics_economics_2024_03_15.graphql, https://github.com/amzn/selling-partner-api-models/blob/main/schemas/data-kiosk/analytics_economics_2024_03_15.graphql, read 2026-10-14)

- The fee properties carry, for example, "Product Size Tier, an important property that determines the amountPerUnit of FBA_FULFILLMENT_FEE".
- `economics` (history): the start date must be "no more than two years ago". When a range spans "the Amazon fee change date", the response splits the range in two.
- `economicsPreview`:
  - "The end date must be no more than 120 days after today", and `startDate` "must be not earlier than today".
  - It takes a `feeTypes: [PreviewFeeType!]!` list. `PreviewFeeType` includes `LOW_INVENTORY_LEVEL_FEE`, `FBA_INBOUND_PLACEMENT_SERVICE_FEE`, `AGED_INVENTORY_SURCHARGE` and `STORAGE_UTILIZATION_SURCHARGE`.
  - Aggregation supported for preview: "MSKU and RANGE".
- `economicsSimulation` simulates actions (`ActionType` includes `AWD` and `SIPP`) for at most "100 products per request", ending "no more than 90 days after today".

Roles: two Amazon pages disagree.

- The Data Kiosk page says "Each field available with Data Kiosk requires a certain role". It lists only the Brand Analytics role on `createQuery`, `getQuery`, `getQueries`, `getDocument` and `cancelQuery`. [official] (Data Kiosk API, https://developer-docs.amazon/sp-api/docs/data-kiosk-api.md, updated 2026-09-09, read 2026-10-14; re-opened in the reconcile pass)
- Amazon's changelog correction says: "The initial version of that announcement stated that all datasets require the Brand Analytics role. This is not correct. The Vendor Analytics and Sales and Traffic datasets require the Brand Analytics role. The Economics dataset requires the Selling Partner Insights role." [official] (Correction: Data Kiosk role requirements, https://developer-docs.amazon/sp-api/changelog/correction-data-kiosk-role-requirements.md, read 2026-10-14 in the reconcile pass)
- Role Mappings for SP-API Types lists no Data Kiosk dataset; its only Data Kiosk row is the `DATA_KIOSK_QUERY_PROCESSING_FINISHED` notification (Amazon Warehousing and Distribution or Brand Analytics). The economics schema carries no role directive.

This file does not pick one. The binding answer is Amazon's reply to a `createQuery` on `analytics_economics_2024_03_15` under the seller's actual roles (Open question 13). method/sp-api-access.md and angles/paid-keywords.md record the same conflict.

### H. The delivery promise: handling time, shipping templates, SSA, channel order and the Featured Offer

H1. RULE. "Amazon provides the estimated delivery time to customers … two parts to that calculation: handling time and transit time." Handling time ("also known as production time or lead time to ship") is set in one of four ways: automated handling time (AHT), SKU-specific, default (account-wide) or pallet-specific. "SKU-specific handling time overrides your default handling time. Automated handling time overrides both … unless there isn't enough shipping history or Amazon has approved an override exception." [official] (Modify handling time, https://sellercentral.amazon.com/help/hub/reference/external/G200955560, version 50, read 2026-10-14)

H2. RULE (2026 requirement). [official] (same page)

- "Starting June 29, 2026, we are implementing a new requirement that sellers set accurate handling time for their seller-fulfilled SKUs."
- For SKUs managed individually: "If you consistently ship faster by at least one day or more, the SKU will show as non-compliant".
- "If accurate handling times are not set within 30 days after receiving a notification, we'll monitor and adjust on your behalf for the next 180 days … You won't be able to change your handling time during this period."
- "This requirement is only applicable to Professional sellers."

H3. FIGURE (offer latency). [official] (same page)

- "Leaving the Handling time or Lead time-to-ship fields empty in the above templates will cause Amazon to revert to your account's default handling time. Your offer will update on Amazon within 15 minutes. In case of maximum load on Amazon systems, it can take up to 24 hours".
- AHT "may take up to three weeks to update to your new fulfillment actual speed".
- "You can enable automated handling time once in a 24-hour window."

H4. RULE (schema). [official] (Manage Amazon Haul, Advanced Multiple-Offer, and Multiple-Fulfillment Use Cases, https://developer-docs.amazon/sp-api/docs/manage-amazon-haul-advanced-multiple-offer-multiple-fulfillment-use-cases.md, updated 2026-09-09, read 2026-10-14)

- "The `fulfillment_availability` attribute is an array that accepts one or more distinct fulfillment records, each keyed by the `fulfillment_channel_code`."
- The MFN example carries `quantity`, `restock_date` and `lead_time_to_ship_max_days`.
- "The available `fulfillment_channel_code` values differ by selling partner and Amazon store …. To retrieve the list of available values …, use the Product Type Definitions API. Include the `sellerId` parameter …."
- "For example, `quantity` information is supported for MFN fulfillment, but not for Fulfillment by Amazon (FBA) fulfillment."
- The common codes are `DEFAULT` (MFN), `AMAZON_NA`, `AMAZON_EU` and `AMAZON_JP`.

H5. RULE (channel order). [official] (same page; Merge a listing, https://developer-docs.amazon/sp-api/docs/merge-a-listing.md, updated 2026-09-09, read 2026-10-14)

- "When FBA inventory is available, it is used first. MFN inventory is used after the FBA inventory is depleted."
- "you no longer need to include the `lead_time_to_ship_max_days` value to maintain the handling time defined at the SKU-level".
- A `merge` patch can update `quantity` alone: "You can use the Patch `merge` operation to update the `quantity` field within the `fulfillment_availability` without specifying other optional fields such as `restock_date` and `lead_time_to_ship_max_days`. You must provide non-empty values for the selector field such as `fulfillment_channel_code`." The same page shows `merge` on `purchasable_offer`, deleting `quantity_discount_plan` with an explicit `null` (re-opened in the reconcile pass).
- The model agrees. `PatchOperation.op` in listingsItems_2021-08-01.json enumerates `add`, `replace`, `merge` and `delete`, with "The `merge` operation merges the target property." The Listings Items API page bounds it: "**The merge operation is not supported for other attributes outside of `fulfillment_availability` and `purchasable_offer`**." (Both re-read in the reconcile pass.)
- Amazon's pages disagree in wording. Partially update a listing (https://developer-docs.amazon/sp-api/docs/partially-update-a-listing.md) and Preview errors before partially updating a listing (https://developer-docs.amazon/sp-api/docs/preview-errors-before-partially-updating-a-listing.md) still say "JSON Patch documents can add, replace, or delete entire attributes. Patching content within attributes is not supported." (both read 2026-10-14 in the reconcile pass). The model and the Listings Items API page name `merge` for the two offer attributes; the two partial-update pages describe every other attribute. For a quantity write, the binding check is the model's `op` enum and a `VALIDATION_PREVIEW` submission at run time. elements/bullet-points.md (R16) and elements/search-terms.md (F7) already read it this way; elements/description.md quotes only the partial-update sentence, and angles/listing-content-and-health.md leaves `merge` open.

H6. RULE (shipping template). The shipping template is the listing attribute `merchant_shipping_group`: "The ship configuration group for an offer. The ship configuration group is created and managed by the seller through the ship setting UI." In the seller-specific schema, its `enum` holds template keys and `enumNames` holds the Seller Central names. Writes must "pass the `enum` key (**not** the `enumNames` value)". [official] (Tutorial: Retrieve Merchant Shipping Templates, https://developer-docs.amazon/sp-api/docs/tutorial-retrieve-merchant-shipping-templates.md, updated 2026-09-09, read 2026-10-14)

H7. GUIDANCE with an Amazon claim. [official] (Shipping Settings Automation, https://sellercentral.amazon.com/help/hub/reference/external/G8WRJF2N5B787XKQ, version 16, read 2026-10-14)

- Shipping Settings Automation (SSA) "automatically calculates more accurate delivery dates … based on: The customer's location; Your warehouse/location closest to the customer; Up-to-date carrier transit time …; Inventory availability".
- "SSA provides customers with sharper delivery promises which are on average 30% more accurate and typically faster than seller-set transit times. Faster delivery promises increase the likelihood of customers making a purchase and helps your offers to be featured more frequently."
- It names the failure mode it addresses: "many sellers choose to set unnecessarily long transit times … or limit fast delivery regions … this leads to buyers seeing delivery dates that look less attractive".

An older announcement by News_Amazon on the Seller Forums ("New Shipping Settings Automation tool helps with delivery time accuracy", shown as "5 years ago") says a more accurate transit time "can help increase the likelihood that your offer is featured". [official] (https://sellercentral.amazon.com/seller-forums/discussions/t/79a49dd1d3ca1e5b1d2e7214aa69e303, read 2026-10-14)

H8. RULE (Featured Offer). [official] (Becoming the Featured Offer, https://sellercentral.amazon.com/help/hub/reference/external/G201687550, version 20, read 2026-10-14; re-read from the capture capture `G201687550-v20`)

- Speed and certainty: "Offers with fast, free shipping are more likely to become featured, as are offers with higher certainty on the delivery date (for example, a narrower delivery promise range)."
- Shippability: "Offers must be shippable to the customer to become featured. If your offer cannot be shipped to a particular customer …, that offer will never be shown to that customer."
- Stock: "Your offer can't become featured if you're out of stock."
- Prime and fulfillment method are listed under "What factors are NOT considered when selecting the Featured Offer?":
  - "Prime eligibility of the offer: If all other factors are equal, offers with or without the 'Prime' badge are equally likely to be featured."
  - "Fulfillment method: If all other factors are equal, offers fulfilled by Amazon or Fulfilled by Merchant are equally likely to be featured."
- Delivery filters: "When customers activate a search filter such as delivery date search, they may see different Featured Offers that better meet their needs."
- The share Business Reports shows: "Your Featured Offer percentage is calculated as the total number of page views in which your offer is featured divided by the total number of page views for your products." Data Kiosk's `featureOfferPct` and its denominator belong to angles/own-traffic-funnel.md; this file uses neither.
- Location: the page says this twice. "customers may see different Featured Offers when shopping from different shipping locations or when enrolled in a Prime membership". "Customers may also see a different Featured Offer based on shipping location and/or enrollment in Prime".
- Eligibility: "As of September 2026, Amazon no longer maintains a seller eligibility requirement, and offers from all sellers are now eligible to be evaluated for the Featured Offer." The old pages agree: Featured Offer eligibility (G200418100 v23) now reads "This page has been removed. As of September 2026, Amazon no longer maintains a seller eligibility requirement", and Featured Offer (G37911 v19) reads "This page has been removed." [official] (captures capture `G200418100-v23` and `G37911-v19.txt`, read 2026-10-14). method/triggers.md's first-pass "Featured Offer eligibility tests" line is superseded in that file by the same September 2026 change.

H9. FIGURE (funnel measurement). [official] (sellingPartnerSearchCatalogPerformanceReport.json and sellingPartnerSearchQueryPerformanceReport.json, https://github.com/amzn/selling-partner-api-models/tree/main/schemas/reports, read 2026-10-14)

- The Search Catalog Performance report schema counts, per ASIN, `sameDayShippingImpressionCount`, `oneDayShippingImpressionCount` and `twoDayShippingImpressionCount`, with matching click, cart-add and purchase counts. The impression field is "The number of times the impressed ASIN displays with the same day delivery message in a search results page".
- The Search Query Performance schema carries query totals: `totalSameDayShippingClickCount`, with one-day and two-day equivalents, for clicks, cart adds and purchases. The click field is "The number of times customers click on any ASIN with the same-day delivery message from the search results page for the specific query."

### I. Prime: FBA eligibility, the badge and Seller Fulfilled Prime

I1. GUIDANCE. "With FBA, your products are eligible for Amazon Prime free Two-Day Shipping". [official] (Get started with Fulfillment by Amazon (FBA), https://sellercentral.amazon.com/help/hub/reference/external/G53921, version 20, read 2026-10-14)

I2. Amazon support's words on the badge, relayed on the forum [official as relayed; old]. In the thread "Amazon no longer showing the Prime Badge on some FBA items" (shown "6 years ago"), a seller reposts an Amazon Selling Partner Support message:

- "In some cases, we may remove the Prime badge on offers from both Amazon and sellers with slower delivery."
- It names "certain heavy and bulky products".
- "These items continue to be Prime eligible and display the "FREE Delivery" message."

The quoted support text does not mention location. (https://sellercentral.amazon.com/seller-forums/discussions/t/f663e413d119a480b173dad52f7f02b1, read 2026-10-14)

I3. A forum post by KJ_Amazon, "[April FBA Series] ⭐Prime Badge Missing? 5 Fixes to Restore FBA Listing Eligibility", is shown as "updated by moderator 6 months ago". The page does not label the account as staff in so many words. The post says: "The Prime badge won't display if your FBA inventory is at zero or if your listing is suppressed due to a stock-out." It adds that stock-outs and stranded inventory can cause loss of status. [official, forum post by an `_Amazon` account] (https://sellercentral.amazon.com/seller-forums/discussions/t/b422836f-fc63-4097-9248-0ee0f2b58484, read 2026-10-14)

I4. RULE (SFP badge). "For offers with longer delivery times, we may not show the Prime badge, since the offers don't meet Prime customers' expectations for delivery speed." [official] (Seller Fulfilled Prime program policy, https://sellercentral.amazon.com/help/hub/reference/external/G201812300, version 7, read 2026-10-14). The same policy sets these rules:

- Handling: "zero-day handling time" for same-, one- and two-day orders received before cut-off. The cut-off is "2:00 p.m. or later local time Monday-Friday".
- Performance: reviewed weekly, Sunday to Saturday. A second miss of the same requirement means "Prime offers will be disabled for your account". A third revokes enrolment ("Prime offers will be disabled for all Prime shipping templates").
- Volume: a daily Prime order limit applies. It is capped if the seller ships fewer than 100 SFP packages a month.
- Weekends: "Sellers must operate on at least one of the weekends". "toggling Prime, reducing Prime order limit … to … evade the weekend operations requirement … is against the Seller Fulfilled Prime policy".

I5. RULE (SFP metrics). [official] (Seller Fulfilled Prime performance requirements, https://sellercentral.amazon.com/help/hub/reference/external/G202072550, version 15, read 2026-10-14)

- On-time delivery, valid tracking, cancellation and a delivery-speed metric are evaluated "for each size tier independently" (since November 5, 2025).
- Delivery speed "is the count of Prime customer page views where your offer was featured and the customer saw a delivery date of less than or equal to (≤) 1 day or ≤ 2 days".
- "An offer can be configured for one-day or two-day delivery but provide a three-, four-, or even five-plus-day promise when viewed by the customer due to order cutoff times, seller weekend operations, carrier weekend operations, and holidays."
- A temporary weekend exclusion runs "From May 31, 2026, to October 17, 2026".
- Thresholds are on the page and "refreshed quarterly".

I6. RULE. "When you enable a shipping template for Seller Fulfilled Prime, the template will automatically configure the default minimum settings". "Your configured same-day, one-day, and two-day delivery regions are one component of the delivery speed the Prime customer will see." [official] (Seller Fulfilled Prime shipping requirements, https://sellercentral.amazon.com/help/hub/reference/external/G202098380, version 5, read 2026-10-14)

### J. Stock-change notifications

J1. RULE. `FBA_INVENTORY_AVAILABILITY_CHANGES` "is sent whenever there is a change in the Fulfillment By Amazon (FBA) inventory quantities. This notification includes a snapshot of the FBA inventory in all eligible Amazon stores in a particular region." Per marketplace its payload carries:

- `Fulfillable` ("units … that can be used to fulfill orders in the given Amazon store");
- `Unfulfillable`;
- `Researching`;
- the `InboundQuantityBreakdown` and `ReservedQuantityBreakdown`;
- `FutureSupplyBuyable` ("units available for customers to find and buy while inventory is on its way … through In-Stock Head Start").

Workflow: Amazon Simple Queue Service (SQS). [official] (Notification Type Values). Role Mappings lists Amazon Fulfillment for this notification. [official] (Role Mappings for SP-API Types)

J2. RULE. `ITEM_INVENTORY_EVENT_CHANGE` [official] (Notification Type Values):

- "is sent five minutes after the beginning of each hour".
- It "includes data for the previous hour, as well as any delayed data from up to 24 hours earlier".
- "ASINs are included if the number of units available for purchase by customers has changed."
- Its field `highlyAvailableInventory` is "The number of units available to be sold on the website, based on units in Amazon fulfillment centers that are in sellable condition, minue [sic] units in customer shopping carts or otherwise bound for other orders".
- "Sellers and vendors can subscribe."
- Workflow: SQS.

J3. RULE. `LISTINGS_ITEM_MFN_QUANTITY_CHANGE` is sent "whenever the available quantity for the seller-fulfilled (MFN) listings item changes". [official] (Notification Type Values)

### K. Keepa: what it shows about stock, Prime and fees (third-party data from one vantage point, for competitors and as a cross-check)

K1. Stats and Buy Box fields:

- `Stats.outOfStockPercentage30` and `outOfStockPercentage90`, and `outOfStockPercentageInInterval`, hold, per csv price type, "0 = never was out of stock, 100 = was out of stock 100% of the time", and "-1 if there is insufficient data or the CsvType is not a price".
- `outOfStockCountAmazon30/90` count Amazon's own stock-outs.
- `stockBuyBox` and `stockAmazon` are "Only set when the offers parameter was used", with "Max. reported stock is 10".
- With the offers parameter: `buyBoxIsFBA`, `buyBoxIsPrimeEligible`, `buyBoxIsPrimeExclusive`, `buyBoxIsShippable`, `buyBoxIsBackorder` and `buyBoxAvailabilityMessage` (example "In Stock.").

[official for Keepa's own field docs; Keepa is not Amazon] (Stats.java, https://github.com/keepacom/api_backend/blob/master/src/main/java/com/keepa/api/backend/structs/Stats.java, read 2026-10-14)

K2. Offer, product and request fields:

- Per offer:
  - `isPrime` ("Can be used as a FBA … indicator as well");
  - `isFBA`;
  - `isShippable` ("If not this could mean for example that it is temporarily out of stock or a pre-order");
  - `shipsFromChina`;
  - `stockCSV` ("available stock of this offer as well as, if available, the stock's history"; in Keepa time minutes, then stock).
- `Product.availabilityAmazonDelay` is "min and max shipping delay in hours".
- `Product.fbaFees` is an `FBAFeesObject` (`pickAndPackFee`, `storageFee` and their taxes):
  - "If FBA fee information has not yet been collected for this product the field will be null".
  - "If the total fee is 0 the product does not have (valid) dimensions".
- Package dimensions are in millimetres and weight in grams ("0 or -1 if not available").
- The `stock` request parameter: "If true the product object will include stock data".

These are Keepa's descriptions, not Amazon's. The Keepa skill's `references/product-file.md` (outside `research/`) already records the units and `fbaFees.pickAndPackFee`. [official, Keepa's own code doc] (Offer.java, Product.java, Request.java, https://github.com/keepacom/api_backend/tree/master/src/main/java/com/keepa/api/backend/structs, read 2026-10-14)

## What practitioners add

O1. **Low-inventory-level fee, staff explanation.** [opinion, Amazon staff on the forum] Bryce_Amazon, Seller Forums, "Low-inventory-level fee further explained" (dated "3 years ago"): when sellers don't carry enough inventory, "we are unable to distribute products as effectively and efficiently across our network", which "slows delivery speed to customers and increases shipping costs". The post describes a parent-product level calculation. The help page's 2026 FNSKU level supersedes that (E1). (https://sellercentral.amazon.com/seller-forums/discussions/t/aa9f98e5-fa91-4949-af8f-6cf918c86a77, read 2026-10-14)

O2. **eComEngine on the fee.** [opinion] Becky Trowbridge, eComEngine, "How to Avoid the Amazon Low-inventory-level Fee", published 2024-01-22, updated 2025-02-07.

- "Amazon low-inventory-level fees are not charged when a product is out of stock."
- "The historical days of supply metric is calculated at the parent-product level." That is outdated: Amazon's page has said FNSKU since 2026-01-15 (E1).
- She relays a claim about the Minimum Inventory Level: "Amazon noted that sellers who maintain units above this level see an average of a 15% increase in sales over four weeks". No Amazon page read here states it; the FBA inventory overview page (GTMXYZN64UJL7TT6) was not read on 2026-10-14 and has no capture under the office's capture folder (outside this repository) (see *Pages read*).
- Advice: have enough inventory at FBA "at least four weeks before your peak season begins". To avoid the fee after the season, "sell through the inventory within six weeks after it".

(https://www.ecomengine.com/blog/amazon-inventory-management, read 2026-10-14; re-opened in the merge pass)

O3. **eComEngine on capacity.** [opinion] Becky Trowbridge, eComEngine, "Strategies for Managing Amazon FBA Capacity Limits", 2025-05-15.

- The article says that "Amazon adjusted capacity limits for US FBA sellers in April 2025" and that the adjusted limits "are expected to provide sufficient FBA capacity to support approximately five months of sales, including Prime Day".
- "most sellers can expect to see higher estimated capacity limits for October and lower estimated limits for November". Amazon's Q4 2026 playbook says lower for both October and November (D7). The practitioner's 2025 line does not describe this year.
- Overage fees "are charged monthly at $10 per cubic foot based on the daily average volume of the space your inventory occupies beyond your capacity limits". They apply "if your on-hand inventory (not including open shipments) exceeds your FBA capacity limit".
- "Improving your FBA inventory sell-through rate is the fastest way to free up capacity for new products. It also helps increase your IPI score."

Amazon links: the overage line links a Seller Central help page. The storage-type and Capacity Manager passages link two others. The five-month, October/November and sell-through lines link no Amazon page. The linked help pages were not opened here and are not cited. (https://www.ecomengine.com/blog/fba-capacity-limits, read 2026-10-14; re-opened in the merge pass)

O4. **AMZ Prep on 2025–2026 capacity cuts.** [opinion] Arishekar N Nagaraj, AMZ Prep, "Amazon FBA Capacity Limits Cut by 75%: The Complete Survival Guide for 2026", published and last modified 2026-09-25. AMZ Prep is a 3PL that sells the services it recommends. Claims:

- "Amazon reduced FBA storage space by up to 75% in May 2025".
- "from 6 months to 5 months of expected sales" (the FAQ block says "of projected sales").
- "Individual products now have 90-day supply caps".
- "Amazon's official update confirmed these limits are permanent."

None of these is tied to an Amazon link, and Amazon's current capacity page (D1–D2) states none of them. The article is also inconsistent on dates: it says "current as of January 2026" but was published 2026-09-25. Treat it as unverified. (https://amzprep.com/amazon-fba-capacity-cut-seller-guide/, read 2026-10-14; re-opened in the merge pass)

O5. **Stock-outs and rank: asserted, not shown.**

- [opinion] Chuck Kessler, Canopy Management, "Decoding the Amazon Algorithm in 2026: 10 Things Every Seller Needs to Know", 2026-06-08: "A history of stockouts doesn't just hurt you during the stockout." "Frequent stockouts now trigger ranking suppression that persists even after you restock." No data or source is cited. (https://canopymanagement.com/decoding-the-amazon-algorithm/, read 2026-10-14)
- [opinion] Brian Connolly, Jungle Scout, "Amazon Inventory Management", published 2023-12-14 and modified 2024-11-06. (https://www.junglescout.com/resources/articles/amazon-inventory-management/, read 2026-10-14; re-opened in the merge pass)
  - It quotes Eva Hart, one of Jungle Scout's Amazon experts: "Never go out of stock because it hurts your Best Seller Rank. A great way to stay in stock when you're running low on inventory and waiting on a shipment is to slow things down on the demand side." She does this by pausing off-channel ads and raising the price.
  - In the article's own voice: "it may be difficult for you to recover from lost ranking". "It is better to slow down your sales, even if it slightly affects your rankings, than it is to completely go out of stock." "keep around 60 days of inventory on hand at all times".
  - No data is given.
- **Disagreement with Amazon.** Practitioners assert a lasting rank penalty. Amazon's pages state only the immediate effects: no buyable offer means unsearchable (A3), no Featured Offer (H8), the IPI in-stock rate and the lost-sales estimate (D3). No Amazon page read states a lasting rank penalty after restock. Jungle Scout's 60 days sits at the top of Amazon's "30 to 60 days" guideline (D3, D4). Amazon's excess threshold, over 90 days of supply, caps the other side.

O6. **SSA in practice.** [opinion, seller] One reply under News_Amazon's SSA announcement (seller handle not reproduced): "Amazon wound up quoting my customers longer than it actually takes to be delivered. Sales took a slight dip so I switched it back." This is a single anecdote against Amazon's average claim (H7). (same thread as H7, read 2026-10-14)

O7. **Capacity requests in practice.** [opinion, seller] A reply under Dominic_Amazon's "Refresher: FBA Capacity Limits & How They Work" (a staff post dated "3 years ago") reports Capacity Manager requests staying pending until expiry. (https://sellercentral.amazon.com/seller-forums/discussions/t/7dd1b421-5863-46c8-a88a-ba2cdcabad94, read 2026-10-14)

O8. **The announcement week, then and now.**

- [official, historical] "Amazon announces new streamlined FBA capacity management system", Selling Partner Blog, 2023-01-17. From 2023-03-01 one "single monthly limit" replaced the restock and storage limits. At that time limits were announced in "the third full week". (https://sell.amazon.com/blog/announcements/fba-capacity, read 2026-10-14)
- Jungle Scout (O5) still says "Capacity limits are set during the third week of each month".
- Amazon's current help page says "fourth week of the month" (D1), and eComEngine (O3) agrees. The help page wins.

O9. **Not reached.** No practitioner page could be opened on dimension re-measurement disputes, fee overcharge recovery, or the 2026 peak fees and surcharge. The search budget was exhausted. One guessed Marketplace Pulse URL returned 404 and is not cited.

## Published research

R1. [research] Marshall L. Fisher, Santiago Gallino, Joseph Jiaqi Xu, "The Value of Rapid Delivery in Omnichannel Retailing", *Journal of Marketing Research* 56(5):732–748, 2019, DOI 10.1177/0022243719849940 (abstract read via Crossref).

- **Setting.** A quasi-experiment: a US apparel retailer opened a distribution center, which gave unannounced faster delivery to western states. Estimated by difference-in-differences.
- **Finding.** "online store sales increased, on average, by 1.45% per business-day reduction in delivery time, from a baseline of seven business days". The effect grew "gradually in the short-to-medium run".
- **Transfer.** One retailer's own site, not a marketplace with a per-offer delivery message, and a seven-day baseline far slower than Prime. It supports the direction (a faster promise raises sales) and a lagged response. It gives no Amazon effect size.

R2. [research] Eric T. Anderson, Gavan J. Fitzsimons, Duncan Simester, "Measuring and Mitigating the Costs of Stockouts", *Management Science* 52(11):1751–1763, 2006, DOI 10.1287/mnsc.1060.0577 (abstract via Crossref; re-opened in the merge pass).

- **Setting.** A large field test at a catalog retailer measured "the short- and long-run opportunity cost of a stockout".
- **Finding.** "the adverse impact of a stockout extends to both other items in the current order as well as future orders". Discounts to encourage backorders were "the least profitable" of the responses tested.
- **Transfer.** A direct retailer's customer relationship, not Amazon search ranking. It supports treating the days after a stock-out as disturbed, not only the stock-out days. It says nothing about Amazon ranking after restock.

R3. [research] Xiaoqing Jing, Michael Lewis, "Stockouts in Online Retailing", *Journal of Marketing Research* 48(2):342–354, 2011, DOI 10.1509/jmkr.48.2.342 (abstract via Crossref; re-opened in the merge pass).

- **Setting.** Data from an online grocer.
- **Finding.** "stockout rates have a dramatic but nonlinear impact on the seller's profitability". Short- and long-run effects on purchase behaviour differ by customer segment.
- **Transfer.** One grocer's own customers. It supports reading a stock-out inside a window as a window-breaking event, not as noise.

R4. [research] Andrés Musalem, Marcelo Olivares, Eric T. Bradlow, Christian Terwiesch, Daniel Corsten, "Structural Estimation of the Effect of Out-of-Stocks", *Management Science* 56(7):1180–1197, 2010, DOI 10.1287/mnsc.1100.1170 (abstract via Crossref).

- **Method.** A demand model "simulating a time-varying set of available alternatives".
- **Finding.** It quantifies "the lost sales induced by out-of-stock products" and the substitution between alternatives.
- **Transfer.** Store-level retail data, not Amazon. It supports the point that a **competitor's** stock-out moves demand to substitutes. That is a confounder for an own-listing effect, and Keepa's competitor out-of-stock percentages can date it.

Amazon Science: none found. The search budget was exhausted before a search could be made.

## Stable enough for a skill

1. An ASIN needs a buyable offer to be searchable. An out-of-stock listing is Inactive, not buyable. (My ASIN is unsearchable; Understanding Amazon listing status…)
2. An offer can't become the Featured Offer while out of stock or not shippable to the shopper. The Featured Offer can differ with shipping location and Prime membership. (Becoming the Featured Offer)
3. A listing's `attributes` hold what the seller last submitted. `fulfillmentAvailability` holds the live quantity. (Listings Items API; Understanding Amazon listing status…)
4. Only fulfillable FBA units are buyable. Stranded, reserved, researching and unfulfillable units are not. Stranded means FBA units with no active offer. (Inventory Buyability; Fix stranded inventory; getInventorySummaries)
5. `getInventorySummaries` returns the breakdown only with `details=true`. It aggregates by marketplace only, and its changed-since mode does not detect inbound changes. (getInventorySummaries; fbaInventory.json)
6. Deleting a listing removes it from all reports and API data. An FBA SKU whose offer is gone strands its units. (Understanding Amazon listing status…; Fix stranded inventory)
7. Stock stranded under a SKU the seller did not create can sit under Amazon's own SKU for mislabelled or unmatched units. (Fix stranded inventory)
8. Low inventory relative to sales can slow delivery promises and make an FBA product unavailable in parts of the country. (Low-inventory-level fee; Inventory Buyability)
9. The delivery promise is handling time plus transit time. Handling time comes from automated handling time, a SKU setting, the account default or a pallet setting. (Modify handling time)
10. When a listing carries both FBA and MFN records, FBA inventory is used first and MFN after FBA is depleted. (Manage Amazon Haul, Advanced Multiple-Offer, and Multiple-Fulfillment Use Cases)
11. The fulfillment channel codes, and which fields each channel accepts, come from the seller-specific product-type schema. The shipping template is `merchant_shipping_group`, written by its `enum` key. (Manage Amazon Haul…; Tutorial: Retrieve Merchant Shipping Templates)
12. Amazon counts search impressions, clicks, cart adds and purchases by same-, one- and two-day delivery message: per ASIN in Search Catalog Performance, and as query totals in Search Query Performance. (Search Catalog Performance and Search Query Performance report schemas)
13. For Seller Fulfilled Prime, Amazon may withhold the Prime badge on slow offers, and it disables Prime offers after repeated performance misses. (Seller Fulfilled Prime program policy; Seller Fulfilled Prime performance requirements)
14. FBA fees follow Amazon's own measurement of the item package. When it differs from the seller's figures, Amazon's governs, and Amazon may change it. A re-measurement takes days, not hours. (Product dimensions and volume; FBA fees reimbursement policy; Understanding item package weight and dimensions; FBA capacity limits)
15. A SKU fee estimate uses measured dimensions once the item is at Amazon. An ASIN estimate uses catalog size. Neither is guaranteed. (getMyFeesEstimateForSKU; getMyFeesEstimateForASIN; Product Fees API)
16. FBA fulfillment fee rates depend on size tier, shipping weight and the item's price band. They are charged when a unit ships, so the rate in force on the ship date applies. (2026 US FBA fulfillment fee changes; Product size tiers)
17. Amazon reassesses FBA fees each year and announces dated changes and seasonal peak rates on Seller Central. The live rates are on the fee pages and in Amazon's preview tools. (FBA fulfillment fees; 2026 US Referral and FBA fee changes summary; Fee and Economics Preview report)
18. FBA capacity limits are set monthly per storage type, and exceeding them blocks new shipments. The IPI and other factors set them. They are announced in Seller Central, not through any API operation named in the pages read. (FBA capacity limits; IPI frequently asked questions)
19. The low-inventory-level fee uses historical days of supply per FNSKU, excludes inbound units and is updated weekly. (Low-inventory-level fee)
20. Several older FBA inventory report types have been removed and return nothing. (SP-API Deprecation Schedule)

## What cx must read at run time

| Question | Read | Operation / source |
|---|---|---|
| Is the offer buyable and discoverable now, and how many units are live? | `summaries[].status` (`BUYABLE`, `DISCOVERABLE`), `issues`, `offers`, `fulfillmentAvailability` | Listings Items `getListingsItem` with `includedData=summaries,issues,offers,fulfillmentAvailability,attributes` |
| Live MFN quantity vs last submitted | `fulfillmentAvailability[].quantity` vs `attributes.fulfillment_availability` | same call |
| FBA units by state, per SKU | `fulfillableQuantity`, inbound (3), reserved (3 parts), researching, unfulfillable (6 parts), `lastUpdatedTime` | FBA Inventory `getInventorySummaries` (`details=true`, `granularityType=Marketplace`, one marketplace, `sellerSkus` ≤ 50 per the model) |
| Which SKUs changed since T | changed summaries (inbound changes not detected) | `getInventorySummaries` with `startDateTime` |
| Whole FBA inventory, buyable on hand | `afn-onhand-buyable-quantity`, `afn-future-supply-buyable` | `GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA` (door.md's) |
| Daily stock history for the baseline and observation windows | end-of-day balance by disposition, per FC if needed | `GET_LEDGER_SUMMARY_VIEW_DATA` (`DAILY`); movements in `GET_LEDGER_DETAIL_VIEW_DATA` (door.md's) |
| Days of supply, HDOS, low-inventory-level fee flags, minimum inventory level, ship-in recommendation, seasonality | `days-of-supply`, `historical-days-of-supply`, `fba-minimum-inventory-level`, "Low-Inventory-Level fee applied in current week?", "Recommended ship-in date", `is-seasonal-in-next-3-months` | `GET_FBA_INVENTORY_PLANNING_DATA` (door.md's) |
| Restock alert and ship-by date | `Alert`, "Recommended ship date", "Days of Supply at Amazon Fulfillment Network" | `GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT` (door.md's) |
| Stranded units and why | `stranded-reason`, `date-stranded`, `Date-to-take-auto-removal`, `primary-action` | `GET_STRANDED_INVENTORY_UI_DATA` (door.md's) |
| Inactive or zero-quantity listings, account-wide | rows | `GET_MERCHANT_LISTINGS_INACTIVE_DATA`, `GET_MERCHANT_LISTINGS_ALL_DATA` (door.md's) |
| Storage limit vs usage | `storage_limit_volume`, `storage_usage_volume` | `GET_FBA_OVERAGE_FEE_CHARGES_DATA` (door.md's). The Capacity Monitor and the IPI score are Seller Central screens; no API was found for either. |
| Size tier, measured dimensions, current and future per-unit fees | `product-size-tier` (US), `longest-side`, `median-side`, `shortest-side`, `item-package-weight`, `expected-future-fulfillment-fee-per-unit` | `GET_FBA_ESTIMATED_FBA_FEES_TXT_DATA` (door.md's; once per day per seller) |
| Fees at a proposed price | `TotalFeesEstimate`, `FeeDetailList` | `getMyFeesEstimateForSKU` (FBA SKU at Amazon), `getMyFeesEstimateForASIN` (before stock arrives), `getMyFeesEstimates` (≤ 20) |
| Fees over a past window, by fee type | fee lines, `LOW_INVENTORY_LEVEL_FEE`, size-tier property | Data Kiosk `analytics_economics_2024_03_15` `economics` |
| Fees over the next months, including announced changes and the low-inventory-level fee | per-fee estimates | Data Kiosk `economicsPreview`; the Seller Central Fee and Economics Preview report |
| Channel codes, `lead_time_to_ship_max_days`, shipping template keys | `fulfillment_availability` and `merchant_shipping_group` definitions | Product Type Definitions `getDefinitionsProductType` with `sellerId` |
| Did the delivery message shift in the window? | same/one/two-day impression, click, cart-add and purchase counts | Search Catalog Performance report; Search Query Performance query totals (door.md's) |
| Featured Offer holder and shipping | Featured Offer and offer details | Product Pricing (owned by `angles/price-position.md`) |
| Competitor stock-outs, Prime and FBA status | `stats.outOfStockPercentage30/90` (per csv price type), `buyBoxIsFBA`, `buyBoxIsPrimeEligible`, `buyBoxAvailabilityMessage`, offer `isPrime`/`isFBA`/`isShippable`, `stockCSV` | Keepa product (`cx get amazon/us/<ASIN>/product --source keepa`). The offers fields need the offers parameter; stock needs the `stock` parameter, which the raw `/product` route accepts. |
| Push signals, if a destination exists | `FBA_INVENTORY_AVAILABILITY_CHANGES` (snapshot per region), `ITEM_INVENTORY_EVENT_CHANGE` (hourly ASIN changes), `LISTINGS_ITEM_MFN_QUANTITY_CHANGE`, `LISTINGS_ITEM_STATUS_CHANGE` | Notifications API (SQS for the first three, EventBridge for status change) |
| Data Kiosk economics role (two Amazon pages disagree, G12) | the authorization result | the `createQuery` reply under the seller's roles |
| The rate limit actually applied to an operation | `x-amzn-RateLimit-Limit` | the response header of each SP-API call; the pages' usage plans are defaults |
| Fee and rate figures, cut-off dates, the month's capacity limit | rates, dates, the limit | Seller Central pages and screens: the fee pages, the Q4 playbook, the Capacity Monitor and the IPI dashboard |

## Pages read

All on 2026-10-14. Help-page versions are those the content call returned on that day.

| Page name | URL | What it gave |
|---|---|---|
| My ASIN is unsearchable (v6) | https://sellercentral.amazon.com/help/hub/reference/external/GHGHDMU4X5K9QGCV | A buyable offer is needed; up to 72 h. Re-read from the capture in the merge pass. |
| Inventory Buyability (v1) | https://sellercentral.amazon.com/help/hub/reference/external/GFC63UNUF6LMLK2R | Non-buyable states; regional unavailability |
| Fix stranded inventory (v19) | https://sellercentral.amazon.com/help/hub/reference/external/G201436600 | Definition; no new shipments; 48 h; Amazon.Found / .Missing# SKUs; no-longer-updated banner |
| Stranded inventory required removals (v14) | https://sellercentral.amazon.com/help/hub/reference/external/GKQ8DGGU529BJJ7E | Auto-removal and disposal |
| FBA capacity limits (v22) | https://sellercentral.amazon.com/help/hub/reference/external/GAFNWEYTJUV2GBFC | Monthly per-storage-type limits; blocking; Capacity Manager; storage-type mapping; Amazon's measurement governs |
| Inventory performance (v9) | https://sellercentral.amazon.com/help/hub/reference/external/G202174810 | IPI parts; excess over 90 days; in-stock rate; lost-sales estimate; 30–60 day guideline |
| IPI frequently asked questions (v19) | https://sellercentral.amazon.com/help/hub/reference/external/GZJF4DY2W6MERBAL | Professional only; 13 weeks; new ASINs; sell-through; storage-limit notice; 30–60 day guideline |
| FBA dashboard (v6) | https://sellercentral.amazon.com/help/hub/reference/external/GPDFH32J7DYNM378 | IPI card; 15-minute KPI delay |
| Q4 2026 peak readiness playbook (v15) | https://sellercentral.amazon.com/help/hub/reference/external/G4QH4XCRWUXRJBLY | Cut-off dates; lower October/November capacity; peak fees |
| Low-inventory-level fee (v29) | https://sellercentral.amazon.com/help/hub/reference/external/GV43F6S76Y9DHYRH | Rationale; 28-day rule; FNSKU level; HDOS formula; weekly update; exemptions; reimbursement; MIL; slower promises for exempt slow movers |
| FBA inbound placement service fee (v16) | https://sellercentral.amazon.com/help/hub/reference/external/GC3Q44PBK8BXQW3Z | Split options; availability factors; charged 45 days after receipt; ranges adjusted periodically |
| FBA features, services, and fees (v41) | https://sellercentral.amazon.com/help/hub/reference/external/G201074400 | Placement-fee rationale; hierarchy used to find the fee pages |
| 2026 US Referral and FBA fee changes summary (v47) | https://sellercentral.amazon.com/help/hub/reference/external/G201411300 | 2026 changes; links to fee pages; Data Kiosk economicsPreview |
| 2026 US FBA fulfillment fee changes (v58) | https://sellercentral.amazon.com/help/hub/reference/external/GABBX6GZPA8MSZGW | 3.5% surcharge from 2026-04-17; peak 2026-10-15 to 2027-01-14; price bands; charged at ship |
| FBA fulfillment fees (v39) | https://sellercentral.amazon.com/help/hub/reference/external/G200209150 | Annual reassessment; fee index |
| Estimated fee per unit sold (v7) | https://sellercentral.amazon.com/help/hub/reference/external/G200680700 | Included and excluded fees |
| Fee and Economics Preview report (v3) | https://sellercentral.amazon.com/help/hub/reference/external/GQNVDV46U9JQ25HY | 120 days ahead; 24 h data; low-inventory-level fee option |
| Product size tiers (v7) | https://sellercentral.amazon.com/help/hub/reference/external/GG5KW835AHDJCH8W | Fees by tier; 2024 vs 2026 tables; Fee Preview field |
| Product dimensions and volume (v5) | https://sellercentral.amazon.com/help/hub/reference/external/G37G73BJXHF75ACH | Amazon's measurement governs and may change |
| FBA fees reimbursement policy: Weight and dimensions (v14) | https://sellercentral.amazon.com/help/hub/reference/external/GL7U4JFSDXUTQAJ | "our measurement will govern"; 90-day claim window |
| Understanding item package weight and dimensions (v11) | https://sellercentral.amazon.com/help/hub/reference/external/G6WAEPTECPT2JUH3 | Sensors; 10 days; twice per 60 days; region-wide; account limit |
| Selling on Amazon fee schedule (v119) | https://sellercentral.amazon.com/help/hub/reference/external/G200336920 | Referral minimum rule; no 2026 change line found |
| Modify handling time (v50) | https://sellercentral.amazon.com/help/hub/reference/external/G200955560 | Handling + transit; four handling-time sources; 2026-06-29 accuracy rule; 15 min / 24 h offer update |
| Product-level shipping preferences (v4) | https://sellercentral.amazon.com/help/hub/reference/external/GVHT3TKQTDRKNLJW | Handling Time report in Seller Central |
| Shipping Settings Automation (v16) | https://sellercentral.amazon.com/help/hub/reference/external/G8WRJF2N5B787XKQ | SSA inputs; 30% more accurate; faster promises raise purchase likelihood and featuring |
| Becoming the Featured Offer (v20) | https://sellercentral.amazon.com/help/hub/reference/external/G201687550 | Delivery promise, shippability, stock, Prime/FBA neutrality, location; September 2026 eligibility removal. Re-read from the capture in the merge pass. |
| Get started with Fulfillment by Amazon (FBA) (v20) | https://sellercentral.amazon.com/help/hub/reference/external/G53921 | FBA Prime eligibility |
| Seller Fulfilled Prime (v14) | https://sellercentral.amazon.com/help/hub/reference/external/G201812230 | Program overview, links |
| Seller Fulfilled Prime program policy (v7) | https://sellercentral.amazon.com/help/hub/reference/external/G201812300 | Badge display; handling; disablement path; weekend rule |
| Seller Fulfilled Prime performance requirements (v15) | https://sellercentral.amazon.com/help/hub/reference/external/G202072550 | Metrics per size tier; delivery-speed definition; weekend exclusion to 2026-10-17 |
| Seller Fulfilled Prime shipping requirements (v5) | https://sellercentral.amazon.com/help/hub/reference/external/G202098380 | Prime templates; region configuration is one component of speed |
| FBA fulfillment fee; Late Shipment Rate; Manage All Inventory | https://sellercentral.amazon.com/help/hub/reference/external/GPDC3KPYAGDTVDJP (and G200285190, G41) | Opened for titles and links only; nothing cited from them |
| FBA inventory overview (GTMXYZN64UJL7TT6); Seller Fulfilled Prime trial and program enrollment (GEK38DWGHERUDUT6) | https://sellercentral.amazon.com/help/hub/reference/external/GTMXYZN64UJL7TT6 | Not read: the content call answered HTTP 400 for both ids; the error body (rate limit or article not found) was not recorded; no capture under the office's capture folder (outside this repository) |
| Probed ids G201652430, G201460730, GU6JCA4XAD5HUS7J, GCLWLKFYPJ3BY5BN, G200298140, G201723280, GZQKZXQ55SVV6TU3, G201841980, G200208620, G201468580, G201723290, G201723330 | https://sellercentral.amazon.com/help/hub/reference/external/<id> | Not read: guessed ids, HTTP 400 (body not recorded) or empty; not cited |
| Featured Offer eligibility (v23); Featured Offer (v19) | https://sellercentral.amazon.com/help/hub/reference/external/G200418100 (and G37911) | Both "This page has been removed"; the first carries the September 2026 eligibility sentence. Read from the captures in the reconcile pass. |
| Selling-fees overview ("How much does it cost to sell on Amazon?") | https://sell.amazon.com/pricing | Plans and category referral rates; no 2026 changes, peak or surcharge on the page |
| Amazon announces new streamlined FBA capacity management system (Selling Partner Blog) | https://sell.amazon.com/blog/announcements/fba-capacity | 2023 single monthly limit; third-full-week timing then |
| Understanding Amazon listing status and seller-fulfilled inventory management | https://developer-docs.amazon/sp-api/docs/understanding-amazon-listing-status-and-seller-fulfilled-inventory-management.md | Buyable/discoverable; status table; report choice; 3 h freshness SLA; attributes vs live quantity; delete |
| Listings Items API | https://developer-docs.amazon/sp-api/docs/listings-items-api.md | Attributes vs `fulfillmentAvailability`; `merge` bounded to `fulfillment_availability` and `purchasable_offer` (reconcile pass) |
| listingsItems_2021-08-01.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-items-api-model/listingsItems_2021-08-01.json | includedData values; status enum; FulfillmentAvailability |
| Manage Amazon Haul, Advanced Multiple-Offer, and Multiple-Fulfillment Use Cases | https://developer-docs.amazon/sp-api/docs/manage-amazon-haul-advanced-multiple-offer-multiple-fulfillment-use-cases.md | fulfillment_availability shape; channel codes from the seller-specific schema; FBA first, then MFN |
| Merge a listing | https://developer-docs.amazon/sp-api/docs/merge-a-listing.md | merge op on fulfillment_availability quantity and purchasable_offer; selector field required. Re-opened in the reconcile pass. |
| Partially update a listing; Preview errors before partially updating a listing | https://developer-docs.amazon/sp-api/docs/partially-update-a-listing.md (and preview-errors-before-partially-updating-a-listing.md) | "add, replace, or delete entire attributes"; read in the reconcile pass |
| Correction: Data Kiosk role requirements | https://developer-docs.amazon/sp-api/changelog/correction-data-kiosk-role-requirements.md | Economics needs Selling Partner Insights; read in the reconcile pass |
| Manage purchasable offer | https://developer-docs.amazon/sp-api/docs/manage-purchasable-offer.md | merge recommended, consistent with fulfillment_availability |
| Tutorial: Retrieve Merchant Shipping Templates | https://developer-docs.amazon/sp-api/docs/tutorial-retrieve-merchant-shipping-templates.md | merchant_shipping_group; enum vs enumNames; schema link valid 7 days |
| getInventorySummaries | https://developer-docs.amazon/sp-api/reference/getinventorysummaries.md | Parameters, schema, granularity, usage plan |
| fbaInventory.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/fba-inventory-api-model/fbaInventory.json | getInventorySummaries parameters, quantities, 50-SKU bound, usage plan 2/2 |
| FBA Inventory API | https://developer-docs.amazon/sp-api/docs/fba-inventory-api.md | State definitions; roles |
| Get inventory summaries | https://developer-docs.amazon/sp-api/docs/get-fba-inventory-summaries.md | Three call modes (all, changed since a time, named SKUs); `details` defaults to false; Product Listing role |
| Fulfillment by Amazon (FBA) Reports | https://developer-docs.amazon/sp-api/docs/report-type-values-fba.md | Report types, columns, roles, near-real-time vs daily generation limits, Fee Preview rules, Ledger options (updated 2026-10-13) |
| SP-API Deprecation Schedule | https://developer-docs.amazon/sp-api/docs/sp-api-deprecations.md | Removed FBA report types |
| SP-API release notes | https://developer-docs.amazon/sp-api/docs/sp-api-release-notes.md | `stores` array 2024-09-25; Product Fees 2025-08-27 change; batch op 2022-05-18 |
| Role Mappings for SP-API Types | https://developer-docs.amazon/sp-api/docs/role-mappings-for-types.md | Roles for the FBA reports and notification; no Data Kiosk dataset rows. Re-opened in the reconcile pass. |
| Notification Type Values | https://developer-docs.amazon/sp-api/docs/notification-type-values.md | FBA_INVENTORY_AVAILABILITY_CHANGES payload; ITEM_INVENTORY_EVENT_CHANGE timing and field; MFN quantity; status change; FEE_PROMOTION |
| Product Fees API | https://developer-docs.amazon/sp-api/docs/product-fees-api.md | Not guaranteed; roles; release notes |
| getMyFeesEstimateForSKU / ForASIN / getMyFeesEstimates | https://developer-docs.amazon/sp-api/reference/getmyfeesestimateforsku.md (and …forasin.md, …getmyfeesestimates.md) | Measurement notes; usage plans; schema |
| Get product fees for a batched set of up to 20 items; Get product fee estimates for a specific ASIN / SKU | https://developer-docs.amazon/sp-api/docs/get-product-fees-batch.md (and get-product-fee-estimates-asin.md, -sku.md) | 20 per batch; fees before a price is set |
| productFeesV0.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/product-fees-api-model/productFeesV0.json | Required fields; FeeType a free string |
| Data Kiosk API | https://developer-docs.amazon/sp-api/docs/data-kiosk-api.md | Per-field roles; Brand Analytics on the operations. Re-opened in the reconcile pass. |
| Seller Analytics Dataset Use Case Guide | https://developer-docs.amazon/sp-api/docs/seller-analytics-dataset-guide.md | No inventory or delivery-promise metric beyond the account-health OTDR fields and lending `totalFbaInventoryValue` |
| analytics_economics_2024_03_15.graphql | https://github.com/amzn/selling-partner-api-models/blob/main/schemas/data-kiosk/analytics_economics_2024_03_15.graphql | economics, economicsPreview, economicsSimulation; fee types; size-tier property; fee-change split |
| sellingPartnerSearchCatalogPerformanceReport.json; sellingPartnerSearchQueryPerformanceReport.json | https://github.com/amzn/selling-partner-api-models/tree/main/schemas/reports | Delivery-message counts at each step |
| Keepa Stats.java, Offer.java, Product.java, Request.java | https://github.com/keepacom/api_backend/tree/master/src/main/java/com/keepa/api/backend/structs | Stock, out-of-stock %, Buy Box FBA/Prime/shippable, offer stock, fee fields, `stock` parameter |
| Seller Forums: "Low-inventory-level fee further explained" (Bryce_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/aa9f98e5-fa91-4949-af8f-6cf918c86a77 | Staff rationale; parent level (superseded) |
| Seller Forums: "Refresher: FBA Capacity Limits & How They Work" (Dominic_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/7dd1b421-5863-46c8-a88a-ba2cdcabad94 | Staff summary; seller reply on pending requests |
| Seller Forums: "New Shipping Settings Automation tool helps with delivery time accuracy" (News_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/79a49dd1d3ca1e5b1d2e7214aa69e303 | SSA featuring claim; seller counter-anecdote |
| Seller Forums: "Amazon no longer showing the Prime Badge on some FBA items" | https://sellercentral.amazon.com/seller-forums/discussions/t/f663e413d119a480b173dad52f7f02b1 | Relayed support text on badge removal for slower delivery |
| Seller Forums: "[April FBA Series] ⭐Prime Badge Missing? 5 Fixes…" (KJ_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/b422836f-fc63-4097-9248-0ee0f2b58484 | No badge at zero FBA stock |
| How to Avoid the Amazon Low-inventory-level Fee (eComEngine) | https://www.ecomengine.com/blog/amazon-inventory-management | O2; outdated parent level; relayed 15% claim. Re-opened in the merge pass. |
| Strategies for Managing Amazon FBA Capacity Limits (eComEngine) | https://www.ecomengine.com/blog/fba-capacity-limits | O3. Re-opened in the merge pass. |
| Amazon FBA Capacity Limits Cut by 75% (AMZ Prep) | https://amzprep.com/amazon-fba-capacity-cut-seller-guide/ | O4; unverified cut claims. Re-opened in the merge pass. |
| Decoding the Amazon Algorithm in 2026 (Canopy Management) | https://canopymanagement.com/decoding-the-amazon-algorithm/ | O5; persistent stock-out penalty claim, no evidence |
| Amazon Inventory Management (Jungle Scout) | https://www.junglescout.com/resources/articles/amazon-inventory-management/ | O5, O8; BSR and stock-out opinion; slow-demand advice; 60 days. Re-opened in the merge pass. |
| Marketplace Pulse articles index | https://www.marketplacepulse.com/articles | No fee, capacity or delivery article on the index page |
| A guessed Marketplace Pulse article URL | (not cited) | Unreachable: HTTP 404; not cited |
| Crossref records for R1–R4 | https://api.crossref.org/works/10.1177/0022243719849940 (and 10.1287/mnsc.1060.0577, 10.1509/jmkr.48.2.342, 10.1287/mnsc.1100.1170) | Bibliographic data and abstracts. R2 and R3 re-opened in the merge pass. |
| WebSearch | n/a | Unreachable after the session's shared search budget ran out. Not found: Marketplace Pulse, Helium 10 and Carbon6 inventory pieces; Amazon Science delivery-promise papers; a Seller Central page on FBA Prime-badge loss; aboutamazon.com on regional fulfillment |

## Open questions

1. **The live `fulfillment_availability` and `merchant_shipping_group` definitions for a real seller and product type.** Open: which channel codes, what bound on `lead_time_to_ship_max_days`, and whether `restock_date` is accepted. Only Amazon's documentation examples were read here. *Settle by* the first `getDefinitionsProductType` call with `sellerId` on a real run.
2. **The FBA Prime-badge rule by region.**
   - Amazon's current pages say:
     - Featured Offers differ by shipping location (H8);
     - limited stock can make a product unavailable in parts of the country (B2);
     - slow movers may see "slower delivery promises" (E3).
   - The only words on removing the badge for slower delivery are a support message relayed on the forum six years ago (I2).
   - No current Seller Central page read states when an FBA offer shows or loses the badge by region.
   - *Settle by* a Seller Central page on Prime eligibility for FBA offers (none found), and by the Search Catalog Performance delivery-message counts before and after a low-stock week on a real ASIN.
3. **Is there a lasting rank penalty after a stock-out?** Canopy and Jungle Scout assert one. Amazon's pages are silent. R2 and R3 show lasting customer effects at single retailers, not ranking effects. *Settle by* `effect-review` data around a real stock-out: Search Catalog Performance impressions and Search Query Performance impression share before, during and for several weeks after.
4. **Can cx receive the push notifications at all?** Both inventory notifications need an SQS destination. Whether the platform will hold one is for door.md and the platform. Until then, cx polls `getInventorySummaries` and the near-real-time reports.
5. **Is there an API for the IPI score, the capacity limit or the Capacity Monitor?** None was found in the pages read. Only `GET_FBA_OVERAGE_FEE_CHARGES_DATA` exposes `storage_limit_volume`. *Settle by* SP-API release notes, a full read of the FBA Inbound v2024-03-20 reference and the Supply Sources / AWD references, or the seller exporting the screen into the tree.
6. **The 15% sales claim for Minimum Inventory Level** (O2) is unverified. The FBA inventory overview page that may carry it returned HTTP 400 on the content call (body not recorded) and has no capture. *Settle by* reading that page in a signed-in Seller Central session (for example through `pi-web-access`).
7. **AMZ Prep's 2025 "75%" capacity cut, five-month basis and per-product 90-day caps.** These are not on Amazon's current capacity page. *Settle by* a News_Amazon announcement or the Capacity Monitor on a real account.
8. **When FBA runs out and an MFN record exists, what does the shopper see?** H5 says MFN fills in, and the promise then follows the MFN handling and transit times. KJ_Amazon's forum post says the badge "won't display if your FBA inventory is at zero" (I3). No Seller Central help page read states it for a dual-channel SKU (SFP aside). *Settle by* a real dual-channel SKU.
9. **The re-measurement widget has no SP-API route in the pages read.** Open: whether a size-tier change is visible other than through the Fee Preview report's `product-size-tier` (US) and the Data Kiosk fee properties. *Settle by* diffing two Fee Preview reports a week apart on a real account.
10. **The SFP trial page (GEK38DWGHERUDUT6)** returned HTTP 400. Trial graduation restrictions around major events are known only from the policy's summary sentence.
11. **Does the Product Fees API include the holiday peak rate, the 3.5% surcharge and the low-inventory-level fee?** Amazon's pages say the Revenue Calculator, Profit Analytics and Fee and Economics Preview were updated for peak and surcharge (G3). The Product Fees API pages say nothing on the point. *Settle by* comparing three figures on a first real run on or after 2026-10-15: a `getMyFeesEstimateForSKU` reply's `FeeDetailList`, the Fee Preview report's `expected-future-fulfillment-fee-per-unit`, and the FBA fulfillment fee rate card.
12. **Keepa's vantage point.** Keepa's `buyBoxIsPrimeEligible`, `buyBoxAvailabilityMessage` and offer `isShippable` describe what Keepa saw from its own crawl location. Keepa's code docs read here do not state that location. Because Featured Offers vary by region (H8), Keepa may differ from what a given shopper sees. *Settle by* Keepa's documentation on crawl location, or by Keepa support.
13. **Which role the Data Kiosk economics fields need.** Two Amazon pages disagree (G12): the Data Kiosk API page lists only Brand Analytics on the operations, and Amazon's changelog correction says "The Economics dataset requires the Selling Partner Insights role". The economics schema carries no role directive, and Role Mappings for SP-API Types has no dataset row. *Settle by* Amazon's reply to a first `createQuery` on `analytics_economics_2024_03_15` (for example `economicsPreview`) under the seller's actual roles; until then cx names both roles when the read fails.
14. **When the low-inventory-level fee began.** No Amazon page read states the start date. The task brief says 2024, the staff forum explanation is dated "3 years ago", and eComEngine's article was published 2024-01-22; none of these is an Amazon dated statement. *Settle by* the 2024 fee-change page on Seller Central or the Selling Partner Blog announcement.
15. **Fees after 2027-01-14.** No page read announces the 2027 schedule. The 2026 summary promised "at least 90 days" notice before increases. *Settle by* re-reading the fee-change summary pages from mid-October 2026 on.
16. **Whether the `stores` list in `getInventorySummaries` reveals anything regional.** The schema says only "A list of seller-enrolled stores that apply to this seller SKU". *Settle by* a first real read.

## Positions

1. **P-inventory-and-fulfillment-1.** Before attributing any change to content, cx reads the offer state for the whole period being read:
   - `BUYABLE` and `DISCOVERABLE` status, `issues` and live `fulfillmentAvailability` from `getListingsItem`;
   - for FBA, fulfillable units from `getInventorySummaries` with `details=true`.

   Sources: My ASIN is unsearchable; Understanding Amazon listing status and seller-fulfilled inventory management; Listings Items API; listingsItems_2021-08-01.json; getInventorySummaries; fbaInventory.json; Inventory Buyability.
2. **P-inventory-and-fulfillment-2.** cx takes live quantity from `fulfillmentAvailability`, never from the `fulfillment_availability` attribute, which echoes the last submission. Sources: Listings Items API; Understanding Amazon listing status….
3. **P-inventory-and-fulfillment-3.** In listing-review, a drop that coincides with the seller's offer being out of stock, Inactive or not shippable is reported as an offer problem, not a content problem: an ASIN without a buyable offer is unsearchable, and such an offer cannot be featured. No copy change is proposed for it. Sources: My ASIN is unsearchable; Becoming the Featured Offer; Understanding Amazon listing status….
4. **P-inventory-and-fulfillment-4.** cx counts only fulfillable FBA units as sellable. It names stranded, reserved, researching, unfulfillable and inbound units separately, because shoppers cannot buy them. Sources: Inventory Buyability; FBA Inventory API; getInventorySummaries; fbaInventory.json; Fulfillment by Amazon (FBA) Reports.
5. **P-inventory-and-fulfillment-5.** cx never proposes deleting, closing or "cleaning up" an Inactive or unfamiliar SKU without first reading why it is inactive, its FBA units and their stranded reason.
   - An FBA SKU without an active offer strands its units.
   - A deleted listing disappears from every report.
   - Amazon itself creates SKUs for mislabelled or unmatched units, and those units are removed if left unlisted.

   Sources: Fix stranded inventory; Understanding Amazon listing status…; Stranded inventory required removals; Inventory Buyability.
6. **P-inventory-and-fulfillment-6.** Stranded units are a listing-fix trigger with a deadline. cx reads `stranded-reason` and the auto-removal date from the stranded inventory report and puts the fix ahead of any content work. Sources: Fix stranded inventory; Stranded inventory required removals; Fulfillment by Amazon (FBA) Reports.
7. **P-inventory-and-fulfillment-7.** cx reads stock-out precursors as constraint triggers, from the restock and inventory planning reports and the capacity page. Each is reported as "stock risk", never as a listing problem, and cx warns before a stock-out lands in a planned test window. The precursors:
   - a restock alert or recommended ship-by / ship-in date;
   - low historical days of supply or the low-inventory-level fee flag;
   - a below-minimum inventory level;
   - a capacity-limit block.

   Sources: Fulfillment by Amazon (FBA) Reports; Low-inventory-level fee; Inventory performance; FBA capacity limits.
8. **P-inventory-and-fulfillment-8.** For the baseline and observation windows, cx reconstructs the seller's own daily stock from the Inventory Ledger summary at daily granularity, not from today's snapshot. Any day without sellable stock is marked in the change file. Sources: Fulfillment by Amazon (FBA) Reports (Inventory Ledger Report – Summary View); Low-inventory-level fee (HDOS excludes inbound units).
9. **P-inventory-and-fulfillment-9.** effect-review returns "cannot tell" for the targeted stage when the observation window holds either of these:
   - a day on which the seller's own offer had no buyable stock;
   - a change in handling time, shipping template, SSA or fulfillment channel.

   It records the days and names stock or the promise as the cause before content. A matching disruption in the baseline does not restore a verdict: a stock-out's costs reach past the stock-out days and are nonlinear. Sources: My ASIN is unsearchable; Becoming the Featured Offer; Modify handling time; Shipping Settings Automation; Measuring and Mitigating the Costs of Stockouts; Stockouts in Online Retailing.
10. **P-inventory-and-fulfillment-10.** Before crediting a click-through or conversion change to content, cx checks whether the delivery message moved between baseline and observation windows. It compares the share of impressions and purchases carrying a same-, one- or two-day message in Search Catalog Performance, and the query-level splits in Search Query Performance. A shift there is a delivery-promise confounder, not a content effect. Sources: sellingPartnerSearchCatalogPerformanceReport.json; sellingPartnerSearchQueryPerformanceReport.json; Becoming the Featured Offer; The Value of Rapid Delivery in Omnichannel Retailing.
11. **P-inventory-and-fulfillment-11.** cx checks the competitor set's out-of-stock history for the same period: Keepa out-of-stock percentages and Buy Box availability. A rival's stock-out can raise the seller's sales with no listing change. Keepa's percentages describe whether any offer of a given price type existed, so they are the competitor-side signal only. The seller's own stock always comes from SP-API. Sources: Keepa Stats.java; fbaInventory.json; Structural Estimation of the Effect of Out-of-Stocks.
12. **P-inventory-and-fulfillment-12.** cx dates a stock event from a settled read, not the first signal:
    - hourly inventory events also carry delayed data from earlier hours (the delay is stated on Notification Type Values);
    - inventory reports are not near real-time (their freshness is stated on Understanding Amazon listing status…);
    - the changed-since query misses inbound changes.

    Sources: Notification Type Values; Understanding Amazon listing status…; getInventorySummaries; fbaInventory.json.
13. **P-inventory-and-fulfillment-13.** cx does not state a lasting search-rank penalty from a past stock-out as fact. Amazon's pages state only the immediate effects, and the practitioner claims carry no evidence. Sources: My ASIN is unsearchable; Inventory performance; Decoding the Amazon Algorithm in 2026 (as the unsupported claim); Amazon Inventory Management (Jungle Scout).
14. **P-inventory-and-fulfillment-14.** cx treats the delivery promise as offer configuration, which a listing-text change does not touch: the handling-time source, `lead_time_to_ship_max_days`, `merchant_shipping_group`, SSA and channel. In the change file it records the offer state at write time, each item with its source report or operation and read time:
    - that configuration;
    - fulfillable and inbound units;
    - days of supply;
    - size tier;
    - the per-unit fee estimate.

    Sources: Modify handling time; Manage Amazon Haul, Advanced Multiple-Offer, and Multiple-Fulfillment Use Cases; Tutorial: Retrieve Merchant Shipping Templates; Shipping Settings Automation; getInventorySummaries; Fulfillment by Amazon (FBA) Reports; getMyFeesEstimateForSKU.
15. **P-inventory-and-fulfillment-15.** cx reads channel codes, accepted fields and shipping-template keys from the seller-specific product-type schema (`getDefinitionsProductType` with `sellerId`). It writes a template by its `enum` key, never its display name. Sources: Manage Amazon Haul…; Tutorial: Retrieve Merchant Shipping Templates.
16. **P-inventory-and-fulfillment-16.** When a SKU carries both FBA and MFN records, cx reads an FBA stock-out as a switch to the MFN promise, not as an outage. It checks the MFN quantity and handling time before calling the offer unbuyable. Sources: Manage Amazon Haul…; Modify handling time.
17. **P-inventory-and-fulfillment-17.** A Seller Fulfilled Prime offer's badge is an offer state: Amazon withholds it on slow promises and disables Prime offers after repeated misses. A lost badge in a window is a confounder, read from the SFP rules, not from the listing. Sources: Seller Fulfilled Prime program policy; Seller Fulfilled Prime performance requirements.
18. **P-inventory-and-fulfillment-18.** cx does not use a single view of the detail page as evidence of the promise or the Featured Offer. Both vary with the shopper's location and Prime status, and low stock can make a product unavailable in parts of the country. Sources: Becoming the Featured Offer; Inventory Buyability.
19. **P-inventory-and-fulfillment-19.** When the seller is thin on stock, cx names Amazon's stated consequences: slower delivery promises, narrower availability and the low-inventory-level fee. It also names the opposing pressures: capacity limits, excess and aged-inventory costs, and placement fees. cx presents these as the seller's trade-off, not as a listing fix. Sources: Low-inventory-level fee; Inventory Buyability; FBA capacity limits; Inventory performance; FBA inbound placement service fee.
20. **P-inventory-and-fulfillment-20.** A change in FBA fees after a re-measurement or a tier-table change is reported as a fee event, not as a listing effect or listing problem. cx reads the size tier and measured dimensions from the FBA Fee Preview report (within the request limit the FBA Reports page states for it) or Data Kiosk economics. It states that Amazon's measurement governs and names Amazon's re-measurement route. Sources: Product dimensions and volume; FBA fees reimbursement policy: Weight and dimensions; Understanding item package weight and dimensions; Product size tiers; Fulfillment by Amazon (FBA) Reports; analytics_economics_2024_03_15.graphql.
21. **P-inventory-and-fulfillment-21.** cx does not propose editing package-dimension attributes to lower a fee. Amazon's verified measurement sets the fee, and the remedy Amazon names is its remeasurement request in Seller Central. Sources: FBA fees reimbursement policy: Weight and dimensions; Understanding item package weight and dimensions.
22. **P-inventory-and-fulfillment-22.** Any price recommendation carries a fee estimate at the proposed price from the Product Fees API: by SKU once the item is at Amazon, by ASIN before. cx says the estimate is not guaranteed. Sources: getMyFeesEstimateForSKU; getMyFeesEstimateForASIN; Product Fees API.
23. **P-inventory-and-fulfillment-23.** cx flags a proposed price that crosses a fulfillment-fee price band as a fee change. It reads the band edges from Amazon's current rate card, not from memory. Sources: 2026 US FBA fulfillment fee changes.
24. **P-inventory-and-fulfillment-24.** cx reads fee rates, peak periods and surcharges from Amazon's current fee pages or preview tools at run time. A fee-period boundary inside a window is a margin event. Fees are charged at the ship date. Sources: 2026 US FBA fulfillment fee changes; FBA fulfillment fees; Fee and Economics Preview report; analytics_economics_2024_03_15.graphql.
25. **P-inventory-and-fulfillment-25.** cx uses only current FBA report types, never a removed one. Sources: SP-API Deprecation Schedule; Fulfillment by Amazon (FBA) Reports.
26. **P-inventory-and-fulfillment-26.** During Amazon's announced peak inbound periods, cx treats the published inbound cut-off dates as the last dates by which FBA stock is expected to be Prime-badge-ready for the event. It reads those dates from the current season's playbook. Sources: Q4 2026 peak readiness playbook.

**The seat's own (not for a skill)**

- [seat] The fees push in opposite directions. The low-inventory-level fee punishes thin stock. Capacity limits, the aged-inventory surcharge, the IPI's excess threshold and the per-unit placement fee punish holding or shipping a lot. A seller running thin is often choosing that, not neglecting it, and cx's tone should reflect this.
- [seat] Minimal-split inbound sends stock "generally to a single location", and Amazon then distributes it. The days right after a restock may carry a narrower fast-promise footprint than steady state. That is plausible, but Amazon does not state it. If true, those days are themselves a confounder.
- [seat] `highlyAvailableInventory` (units net of carts and committed orders) is closer to "can a shopper buy now" than `fulfillableQuantity`. Neither is a regional measure.
- [seat] A stock-out also changes Keepa-visible competitor behaviour: competitors' sales rank improves while the seller is out. In effect-review this can make a competitor set look like it "rose" during the seller's own outage.
- [seat] On a Featured-Offer-sharing ASIN, the seller's own stock-out may leave the ASIN searchable through another seller's offer while the seller's sales stop (see A3). The pages read do not state this case outright.
- [seat] An observation window that straddles 2026-10-15 combines the peak-fee start, Black Friday Week preparations and the start of holiday demand. A content verdict across that boundary is unlikely to be clean, whatever the stock.
- [seat] The help-hub content call (`GetHelpTopic`) is undocumented. It worked on 2026-10-14 for every page cited here and returned HTTP 400 for some ids (body not recorded, so rate limit and missing article cannot be told apart). Its standing use is for the office to rule. Until then, cx should read policy pages through a browser (`pi-web-access`) and not depend on that call.

## Verification

**Merge, 2026-10-14.** This file merges `inventory-and-fulfillment.md` (the earlier file, US spelling) and `inventory-and-fulfilment.md` (the gap fill, British spelling). Every sourced item of both is kept once. Where both held the same item, the fuller quote is kept and the page citations are unioned.

**Disagreements, settled at the source.**

1. **"Diagnosis:" spacing on My ASIN is unsearchable.** The capture capture `GHGHDMU4X5K9QGCV-v6` line 46 reads "Diagnosis: ASINs without a buyable offer are unsearchable." `inventory-and-fulfillment.md`'s form wins. The gap fill's "Diagnosis : " was a spacing slip.
2. **The Featured Offer location sentence.** The two files quoted different sentences. The capture `G201687550-v20.txt` holds both, at lines 12 and 65. Both stand and both are quoted in H8.
3. **Jungle Scout attribution.** Re-opened in the merge pass. The opening quotation mark before "Never go out of stock" closes only after "slow down acquiring new ones." So "slow things down on the demand side" is Eva Hart's.
   - The gap fill's re-check note, which moved that phrase to the article's own voice, is reversed.
   - The gap fill was right that "keep around 60 days of inventory on hand at all times" is the article's own words. So are "it may be difficult for you to recover from lost ranking" and "It is better to slow down your sales…".
   - `inventory-and-fulfillment.md` had left the slow-demand advice unattributed.
   - The page also shows a modified date of 2024-11-06, added to O5.
4. **Whether eComEngine's capacity article links Amazon pages.** Re-opened in the merge pass. The earlier file said it cites no Amazon page for these claims; the gap fill said only the overage line links an Amazon page.
   - Among the lines the two files quote, the gap fill's reading wins: the overage line links a Seller Central help page, and the five-month, October/November and sell-through lines link none.
   - The article also links Seller Central help pages from its storage-type and Capacity Manager passages, which neither file quoted. Those pages were not opened and are not cited.
   - The phrase "including Prime Day" is on the page after "approximately five months of sales". The gap fill's re-check had removed it as unconfirmed, and it is restored.
5. **eComEngine fee article, AMZ Prep.** Re-opened in the merge pass.
   - eComEngine: every quote in O2 matched, including "calculated at the parent-product level" and "sell through the inventory within six weeks after it".
   - AMZ Prep: the four claims matched. The body says "of expected sales" where the FAQ block says "of projected sales", and O4 now gives both. Both "current as of January 2026" and the 2026-09-25 publish and modify dates were confirmed.
6. **Window rule in effect-review.**
   - The earlier file's position (`inventory-and-fulfillment.md` P-9) let a matching disruption in the baseline restore a verdict.
   - The gap fill's position (`inventory-and-fulfilment.md` P-3) gave no verdict whenever the observation window held a stock-out day.
   - The Crossref abstracts were re-opened. R2 measures "the short- and long-run opportunity cost of a stockout" and finds effects on "future orders". R3 finds a "nonlinear impact".
   - A baseline stock-out therefore does not cancel an observation-window one. The gap fill's rule wins, now P-9.
7. **Not re-opened.** Settling these would need the help-hub content call, which the merge pass may not use, and none of these pages is in the office's capture folder (outside this repository)
   - FBA capacity limits (GAFNWEYTJUV2GBFC): the earlier file quoted "Capacity can't be exchanged between storage types"; the gap fill quoted "Capacity cannot be transferred or exchanged between storage types." Each seat's re-check reported a verbatim match. D2 keeps the gap fill's fuller sentence and flags the other. The rule is the same either way.
   - The "30 to 60 days" guideline: the earlier file found it on the IPI FAQ, the gap fill on Inventory performance. Each re-check matched it on its own page. Both pages are cited (D3, D4).
   - Inventory Buyability's "Reserved" wording and Fix stranded inventory's shipment sentence: the two files quoted different sentences, which do not conflict. Both are kept.
   - The gap fill's "the larger of the two decides" (HDOS) was never a quote, and E2 marks it as that seat's reading.

**Gap fills recorded by the two source files, under the new labels.**

- `inventory-and-fulfillment.md` (8 gaps filled, 0 left open):
  1. capacity and IPI → D1–D6, O3, O4, O7, O8;
  2. low-inventory-level and placement fees → E1–E4, F1, G1, O1, O2;
  3. stranded, inactive and unfulfillable inventory → A2, A7, A8, B1, B3, B4, C1, C2;
  4. regional stock and the promise → B2, E3, H8;
  5. FBM handling time and shipping templates → H1–H7;
  6. Seller Fulfilled Prime and the badge → I1, I4–I6;
  7. size tier and re-measurement → G8–G12;
  8. the notification pair → J1–J3, B3.

  Sub-questions it left open are now Open questions 1, 2 and 6.
- `inventory-and-fulfilment.md` (7 gaps filled, 2 left partly open):
  1. `getInventorySummaries` details → B3;
  2. stranded inventory, MYI reports, IPI and capacity → C1, B4, D1–D4;
  3. the low-inventory-level fee → E1–E4 (start date: Open question 14);
  4. inbound placement → F1;
  5. size tier, the Fee Preview report and the Product Fees API → G4–G12;
  6. the 2026 fee schedule → G1–G3;
  7. stock as a confounder and a cause of non-buyability → A1–A4, B1, B2, H8, H9, R1–R4.

  Left partly open: the FBA badge by region (I2, I3; Open question 2) and whether the Product Fees API reflects peak, surcharge and the low-inventory-level fee (Open question 11).

**Re-checks made by the source files, the same day.**

- `inventory-and-fulfillment.md`:
  - Each quoted string was matched verbatim against a fresh copy of its page fetched that session: every Seller Central help page cited (60 strings); the developer pages, models and schemas; the four Keepa struct files; three forum threads; the 2023 blog post; the five practitioner articles.
  - Corrections made then: four eComEngine paraphrases replaced by the page's words; the 50-SKU bound credited to fbaInventory.json; the US-only heading for the size-tier column.
- `inventory-and-fulfilment.md`:
  - 17 Seller Central help pages were fetched again, and 104 of 104 quoted phrases matched after normalising whitespace and curly quotes.
  - 43 of 43 phrases matched in the SP-API pages, schemas and Keepa code.
  - Forum threads: the support quote's inner double quotes were corrected, and the KJ_Amazon sentence is quoted whole.
  - Practitioner pages: the Jungle Scout attribution and the "including Prime Day" removal are both superseded by items 3 and 4 above. Canopy, eComEngine (fee) and AMZ Prep were confirmed.
  - The four Crossref abstracts were read once.

**Position id map** (old file name : old id → new id).

- `inventory-and-fulfillment.md`:
  - P-inventory-and-fulfillment-1 → P-inventory-and-fulfillment-1
  - P-inventory-and-fulfillment-2 → P-inventory-and-fulfillment-2
  - P-inventory-and-fulfillment-3 → P-inventory-and-fulfillment-3
  - P-inventory-and-fulfillment-4 → P-inventory-and-fulfillment-4
  - P-inventory-and-fulfillment-5 → P-inventory-and-fulfillment-5
  - P-inventory-and-fulfillment-6 → P-inventory-and-fulfillment-6
  - P-inventory-and-fulfillment-7 → P-inventory-and-fulfillment-7
  - P-inventory-and-fulfillment-8 → P-inventory-and-fulfillment-8
  - P-inventory-and-fulfillment-9 → P-inventory-and-fulfillment-9
  - P-inventory-and-fulfillment-10 → P-inventory-and-fulfillment-10
  - P-inventory-and-fulfillment-11 → P-inventory-and-fulfillment-14
  - P-inventory-and-fulfillment-12 → P-inventory-and-fulfillment-15
  - P-inventory-and-fulfillment-13 → P-inventory-and-fulfillment-16
  - P-inventory-and-fulfillment-14 → P-inventory-and-fulfillment-17
  - P-inventory-and-fulfillment-15 → P-inventory-and-fulfillment-18
  - P-inventory-and-fulfillment-16 → P-inventory-and-fulfillment-20
  - P-inventory-and-fulfillment-17 → P-inventory-and-fulfillment-21
  - P-inventory-and-fulfillment-18 → P-inventory-and-fulfillment-19
  - P-inventory-and-fulfillment-19 → P-inventory-and-fulfillment-11
  - P-inventory-and-fulfillment-20 → P-inventory-and-fulfillment-12
- `inventory-and-fulfilment.md`:
  - P-inventory-and-fulfilment-1 → P-inventory-and-fulfillment-1
  - P-inventory-and-fulfilment-2 → P-inventory-and-fulfillment-4
  - P-inventory-and-fulfilment-3 → P-inventory-and-fulfillment-9
  - P-inventory-and-fulfilment-4 → P-inventory-and-fulfillment-10
  - P-inventory-and-fulfilment-5 → P-inventory-and-fulfillment-11
  - P-inventory-and-fulfilment-6 → P-inventory-and-fulfillment-5
  - P-inventory-and-fulfilment-7 → P-inventory-and-fulfillment-22
  - P-inventory-and-fulfilment-8 → P-inventory-and-fulfillment-23
  - P-inventory-and-fulfilment-9 → P-inventory-and-fulfillment-24
  - P-inventory-and-fulfilment-10 → P-inventory-and-fulfillment-20
  - P-inventory-and-fulfilment-11 → P-inventory-and-fulfillment-7
  - P-inventory-and-fulfilment-12 → P-inventory-and-fulfillment-19
  - P-inventory-and-fulfilment-13 → P-inventory-and-fulfillment-12
  - P-inventory-and-fulfilment-14 → P-inventory-and-fulfillment-25
  - P-inventory-and-fulfilment-15 → P-inventory-and-fulfillment-14
  - P-inventory-and-fulfilment-16 → P-inventory-and-fulfillment-13
  - P-inventory-and-fulfilment-17 → P-inventory-and-fulfillment-26

**Reconciled 2026-10-14.** Checked against the critics' contradictions list. Sources re-opened in this pass: the captures capture `G201687550-v20`, `GHGHDMU4X5K9QGCV-v6.txt`, `G200418100-v23.txt` and `G37911-v19.txt`; listingsItems_2021-08-01.json, fbaInventory.json and productFeesV0.json from `main`; the developer pages Merge a listing, Listings Items API, Partially update a listing, Preview errors before partially updating a listing, getInventorySummaries, the three Product Fees reference pages, Data Kiosk API, Role Mappings for SP-API Types and Correction: Data Kiosk role requirements. No help-hub content call, Amazon API host or Keepa API host was called.

1. *How pages were read*: names the four captures this pass read, says a page with a capture was read on 2026-10-14, and adds that this file's HTTP 400 "unreachable" ids had no recorded error body (help-page-access.md A3: rate limit or missing article), so "unreachable" now reads "not read". The same wording is applied in O2, *Pages read*, Open question 6 and the seat note on the content call. No page this file cites is called unreachable while holding a capture.
2. A3: the 72-hour note is marked as that page's ceiling for offer, browse-node and launch-date changes, for human readers; the file sets no effect window from it and points to the method files that own latency. cx confirms a restocked offer by reading its status.
3. B3 and G5: the usage plans were checked; the reference pages and the models agree (2/2; 1/2, 1/2, 0.5/1). Both call them defaults, and the applied rate is read from `x-amzn-RateLimit-Limit` at run time (new run-time row).
4. G12 and Open question 13: the Data Kiosk economics role is now stated as a disagreement between two Amazon pages (Data Kiosk API: Brand Analytics only; changelog correction: Economics needs Selling Partner Insights), with Role Mappings silent. The binding answer is the `createQuery` reply (new run-time row). This file had left it open; angles/paid-keywords.md and method/sp-api-access.md were right to cite the correction.
5. H5: the `merge` patch was re-checked. The model's `op` enum and the Listings Items API page support it for `fulfillment_availability` and `purchasable_offer` only; two partial-update pages still say "add, replace, or delete entire attributes". Both are named. This file was right. elements/bullet-points.md and elements/search-terms.md already agree; elements/description.md quotes only the older sentence and angles/listing-content-and-health.md leaves `merge` open (those files are the ones to update, not this one).
6. H8: Prime and fulfillment method are now quoted under the page's "NOT considered" heading; added the delivery-filter sentence, the page-views definition of Featured Offer percentage, the full September 2026 eligibility sentence, and the two removed pages G200418100 and G37911 from their captures. This file was already consistent with the change; method/triggers.md carries the stale first-pass line only as superseded.
7. P-inventory-and-fulfillment-12 and P-inventory-and-fulfillment-20: figures removed from the positions (24 hours, 1–6 hours, once a day); each now names the page that states the value.
8. Cross-references: door.md and product-file.md are named as the amazon-sp-api and Keepa skills' reference files outside `research/`; every `research/` file this file names exists. `inventory-and-fulfilment.md` is named only as merge provenance; position ids follow the id map above, unchanged in this pass.
9. Left as is, with the other file named: method/effect-measurement.md lists Keepa `stats.outOfStockPercentage90` beside the FBA reports as a stock source; P-inventory-and-fulfillment-11 keeps the seller's own stock on SP-API and Keepa for competitors only.
