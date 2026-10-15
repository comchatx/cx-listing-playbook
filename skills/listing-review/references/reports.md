# Reports, Data Kiosk and feeds

Report type names, `reportOptions` and period rules are door.md's (the amazon-sp-api skill's references/door.md), and a type door.md has no entry for is not named here either. (P-report-lifecycle-7)

## A report's asks

- A report is fetched in Amazon's asks: `createReport`, `getReport` on the `reportId` Amazon returned, and `getReportDocument` on the `reportDocumentId` the record carries. (P-report-lifecycle-20)
- An id not read from Amazon's reply can name another report. (P-report-lifecycle-20)
- A `createReport` sent only to test a report name or option either fails, a client-side error the Acceptable Use Policy asks an application to minimise, or retrieves information the application does not need, which the policy asks it not to retrieve. (P-report-lifecycle-22)

## Statuses

- `DONE`, `CANCELLED` and `FATAL` are terminal; a report `IN_QUEUE` or `IN_PROGRESS` is unfinished, not failed, and its `createdTime` says since when. (P-report-lifecycle-1)
- `CANCELLED` means the request produced no report: an explicit cancel, no data, or a repeat inside the type's period, and never zero sales. (P-report-lifecycle-2)
- `FATAL` is a failed report; a `reportDocumentId` on it holds Amazon's explanation, which can name the parameter at fault and is not data. (P-report-lifecycle-3)
- A vendor `FATAL` for a period not yet available means the request came too early. (P-vendor-and-hybrid-18)
- An unfinished report is read later through the same `reportId`, and a new `createReport` for a type Amazon accepts only once within a period is cancelled. (P-report-lifecycle-26)

## Earlier reports

- A `getReports` record carries type, store and data range but not `reportOptions`, so the record does not show which options a report was made with; only a landed receipt does. (P-report-lifecycle-6)
- A merchant listings report covers one store, and Amazon's Inventory Reports page gives it a cache period, inside which a repeat request may return an earlier copy. (P-report-lifecycle-18)

## Periods

- A Brand Analytics search report request whose range breaks the report's period rule (door.md's) is accepted by `createReport` and then ends `FATAL`. (P-search-query-performance-7)
- Amazon states a time after a week's close within which that week's Brand Analytics search data is generally available; door.md holds that timing. (P-search-query-performance-22)
- A Sales and Traffic period that ends in the future is partial. (P-report-lifecycle-9)
- The dates Data Kiosk returns can differ from those asked, after the weekly or monthly roll-back and the availability cap, and a null for a recent day means not yet available, not zero. (P-report-lifecycle-16)
- Brand Analytics and Economics weeks start on Sunday and the Replenishment API's `WEEK` on Monday, so weekly buckets from them do not line up by label. (P-price-position-26)
- A weekly Data Kiosk or Sales and Traffic request already aligned to Sunday and Saturday comes back with the dates as sent. (P-effect-measurement-25)

## Account type

- A report type or Data Kiosk dataset is open only to the account types on its Availability line: a seller connection has no vendor reports or Vendor Analytics, and a vendor connection has no Sales and Traffic, Search Query Performance or Search Catalog Performance. (P-vendor-and-hybrid-16)
- A hybrid brand's seller connection is a seller connection: vendor reports and Vendor Analytics are not open to it, and its vendor figures come from the vendor side's export. (P-vendor-and-hybrid-16)

## Role refusals

- A 403 on a report type, or a Data Kiosk authorization error, means the connection lacks the role for that data; another report name does not change that. (P-report-lifecycle-19)
- The Brand Analytics role covers Search Query Performance, Search Catalog Performance, Search Terms, Sales and Traffic and coupons; Selling Partner Insights covers seller performance and seller promotion reports. (P-sp-api-access-6)
- Brand Analytics reports have two gates, the application's role and the seller's Brand Registry status (plus brand representative for Search Terms). (P-sp-api-access-7)
- Amazon's pages disagree on the role for the Economics dataset: Selling Partner Insights in Amazon's correction on Data Kiosk role requirements, Brand Analytics on Role Mappings and the Data Kiosk API page. (P-sp-api-access-6)
- The seller analytics `returns` and `defects` groups are gated by a PAAM right no Amazon page maps to a role. (P-returns-22)
- A Data Kiosk `createQuery` authorization error names the refused field and means that field is not open to this connection, not that its value is zero. (P-sp-api-access-8)
- A role added to the application reaches the seller's data only after the connection is re-authorized. (P-sp-api-access-13)

## Rate limits

- A 429 is throttling, not failure, and Amazon's guidance answers it with exponential, jittered waits under a maximum delay and a maximum number of retries. (P-sp-api-access-12)
- Published rates are defaults; the `x-amzn-RateLimit-Limit` header, sent on a 20x, 400 or 404 reply but not on a 429, is the plan in force when present. (P-sp-api-access-11; P-report-lifecycle-10)
- Amazon's own pages print different rate figures for the same operation. (P-competitor-set-29)

## Documents

- A report document with `compressionAlgorithm` `GZIP` is compressed; a Data Kiosk document relies on `Content-Encoding`. (P-report-lifecycle-5)
- Amazon keeps reports for a limited time and Data Kiosk results per `@resultRetention`; after that the id no longer reaches the document, and the landed document remains. (P-report-lifecycle-17)
- Amazon periodically adds fields to reports and keeps deprecated columns in place to hold the original column order; a column or field name identifies the data. (P-report-lifecycle-25)
- The listing flat files begin with a UTF-8 byte order mark, which precedes the first column's name. (P-report-lifecycle-25)
- Amazon states that the format and structure of document identifiers may change, and an id carries no meaning to parse. (P-report-lifecycle-25)

## Schedules and cancels

- A new report schedule silently replaces any existing schedule for the same type and stores; `getReportSchedules` lists those in force. (P-report-lifecycle-11)
- `cancelReport` acts only on a report `IN_QUEUE`; `cancelQuery` acts on a query `IN_QUEUE` or `IN_PROGRESS`. (P-report-lifecycle-12)

## Data Kiosk

- `getQuery` reads a query to a terminal status: `dataDocumentId` is data, `errorDocumentId` is Amazon's explanation, and `DONE` with neither means no data for that range. (P-report-lifecycle-13)
- A result is complete only when no `pagination.nextToken` remains; each page is a new `createQuery` with the same `query` and that token. (P-report-lifecycle-14)
- Data Kiosk refuses a query identical to one pending; a `createQuery` 429 clears when the pending query finishes or is cancelled. (P-report-lifecycle-15)

## Suppression and FBA reports

- Amazon's former listings-defect report is not on its current report-type pages; store-wide suppression with reasons is in the report door.md lists for suppressed listings. (P-listing-content-and-health-21)
- Amazon has removed FBA report types, listed on its Deprecation Schedule, so an FBA report type that once existed may not exist now; the FBA reports' current type names are door.md's. (P-inventory-and-fulfillment-25)
- The FBA Fee Preview report carries size tier, Amazon's measured dimensions and fee estimates. (P-inventory-and-fulfillment-20; P-triggers-26)
- When the seller's weight or dimensions differ from Amazon's verified measurement, Amazon's measurement governs the fee. (P-inventory-and-fulfillment-20)

## Feeds for bulk changes

- Above the crossover the Building Listings Management Workflows Guide states, Amazon's bulk listing route is a `JSON_LISTINGS_FEED`, in four asks: `createFeedDocument` and an upload with the same content type, `createFeed` for one store, `getFeed` to a terminal status, then `getFeedDocument`. (P-listing-writes-19)
- The per-SKU result is the processing report's `issues` and `summary`; a `DONE` feed need not have applied every item, and a `FATAL` one may have applied some, none or all. (P-listing-writes-19)
- Feed messages use the product type schema; `UPDATE` replaces, and `PATCH` or `PARTIAL_UPDATE` patch. (P-listing-writes-20)
- A feed has no preview. (P-listing-writes-20)
- `patchListingsItem` with `mode=VALIDATION_PREVIEW` runs production's synchronous checks on one item without persisting it. (P-listing-writes-5)
- Legacy XML and flat-file listings feed types end `FATAL` through the API. (P-listing-writes-21)
