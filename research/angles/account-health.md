# Account health as a cause of listing outcomes

Read 2026-10-14 by the research seat. Tags: [official] Amazon's own page or document; [opinion] a named practitioner; [research] published research; [seat] the seat's own reasoning, never a skill position.

How the Seller Central help pages were read: each `sellercentral.amazon.com/help/hub/reference/external/<id>` page is a JavaScript shell. Its body was read through the help hub's own content call (`POST /help/hub/mons-api/GetHelpTopic`, body `guid` + layer `external` + locale `en-US`), the same call the page makes in a browser. The call is undocumented, and whether it may be a standing route is the office's ruling to make (method/help-page-access.md, Open question 1). The call returns the page's title and version, both recorded below. Five of the pages cited here have a text capture saved on 2026-10-14 under the office's capture folder (outside this repository): Product detail page rules (G200390640 v21), Becoming the Featured Offer (G201687550 v20), Featured Offer eligibility (G200418100 v23), Featured Offer (G37911 v19) and Business reports glossary (G27691 v7). The other help pages were read once by this seat; their text is not saved in the tree. The URL recorded is the page's public URL. The content call throttles ("Rate exceeded"), so pages were fetched with pauses and retried. Seller Forums threads were read from their server-rendered HTML (title, `datePublished`, author, `articleBody`). SP-API developer pages were read in their `.md` form at `developer-docs.amazon/sp-api/docs/<page>.md`; model and schema files came from `main` of `amzn/selling-partner-api-models`. No Amazon API host and no Keepa API host was called. The session's web-search budget ran out partway through this file. Everything after that was reached by known URL or by links inside pages already open; the Open questions say what that left unread.

## What this covers

- **Funnel stage:** none directly, and all of them indirectly. Account health sits underneath the listing.
  - It can remove the offer or the whole listing (exposure is zero).
  - It can hide the listing from search (exposure).
  - It can take away the Featured Offer, which removes the Add to Cart button from the detail page (conversion).
  - It can hold the seller's whole store.
- **Skills it feeds:**
  - **listing-review**, through its trigger families and its "is this a content problem at all?" gate.
  - **effect-review**, through its confounder list. An account event inside an observation window is a confounder, and a deactivated offer makes the verdict "cannot tell".
  - **/listing-watch**, through the standing-instruction file, since `ACCOUNT_STATUS_CHANGED` and the account-health report are things a seller asks cx to watch.
  - **listing-change-log**, because a listing edit can itself start a policy review.
- **Why a senior operator cares:**
  - A drop in sessions, Featured Offer % or orders that started with a policy hold, an IP complaint, a compliance-document request or an FBM metric breach looks the same as a content problem in the traffic report. Copy edits cannot fix it.
  - Some edits make it worse. Repeatedly adding and removing prohibited claims is "evasive behavior" with no path to reinstatement. A listing rewritten to slip past a restriction can end the selling account.
  - The account layer has its own clocks: a three-day grace period, 180-day windows, 60-day ODR and appeal replies. These clocks decide when a listing can be judged at all.

## Amazon's own rules and guidance

### A. The Account Health Rating (AHR)

- **A1. RULE — what the AHR is.** "The AHR indicates your selling account's risk of deactivation due to non-compliance with certain Amazon selling policies." It is "a color-coded score that ranges from 0 to 1,000" giving "near real-time status", shown "for each store in which you sell worldwide". [official] (Account Health Rating program policy, https://sellercentral.amazon.com/help/hub/reference/external/G200205250, version 24, read 2026-10-14)
- **A2. RULE — bands (figures for human readers; the live score and band are on the Account Health page and in the seller-performance report).**
  - Green "Healthy" is 200–1,000: "not at risk of deactivation based on the policies comprising the score".
  - Yellow "At Risk" is 100–199.
  - Red "Unhealthy" is 99 or lower: "either eligible for deactivation or already deactivated".
  - "All new sellers start with a score of 200". The score reflects "policy adherence and selling activities over the last 180 days".
  - [official] (Account Health Rating program policy, G200205250; Account health rating, https://sellercentral.amazon.com/help/hub/reference/external/GR786P4BPEVKTBAG, version 17; both read 2026-10-14)
  - The band labels are not uniform across Amazon's own pages. The older "Account health FAQ" says "To maintain 'Good' account health … If your AHR is 'At Risk' or 'Critical'". [official] (Account health FAQ, https://sellercentral.amazon.com/help/hub/reference/external/G200285250, version 9, read 2026-10-14)
  - The SP-API schema's AHR status enum is `GREAT` / `WARNED` (see D2).
- **A3. RULE — points.**
  - "Point values for each violation are based on the severity level and typically range from two to eight. However, critical violations automatically bring your AHR score to zero."
  - Repeats: "sometimes, negative point values double per repeat violation".
  - Volume credit: "you also gain four points for every 200 successful orders you fulfilled over the last 180 days".
  - The score can move with no new violation, because violations and orders both age out of the 180 days.
  - FBM sellers "can also earn points based on their Buyer Contact Rate, Average Contact Response Time, and Buyer Dissatisfaction Rate", and Amazon "will not restrict your selling privileges because of below-average performance on these metrics".
  - [official] (Account health rating, GR786P4BPEVKTBAG, read 2026-10-14)
- **A4. RULE — severities.** There are four levels plus "No Impact". Amazon's examples:
  - *Critical:* "Product is counterfeit or pirated as determined via a test buy"; "Solicitation of product reviews or inclusion of non-compliant inserts"; "Attempting to damage or abuse another seller"; "Manipulating search results or sales rankings".
  - *High:* "Rights owner submits valid notice of infringement"; "Customer reports of infringing or counterfeit products".
  - *Medium:* "Listings that provide links that prompt users to visit external websites".
  - *Low:* a used item listed as new, or an expired item.
  - "No Impact" violations "encourages you to address the issues flagged with listings. However, they don't have an impact on your Account Health Rating now."
  - "We may change the severity of a violation".
  - [official] (Account health rating, GR786P4BPEVKTBAG, read 2026-10-14)
- **A5. RULE — the clocks.**
  - A critical violation turns the AHR red at zero, with "a three-day grace period to address the violation before account deactivation".
  - Repeat caps per policy in 180 days: "five for infringement-related policies and two for restricted products policies". Reaching the cap surfaces a critical violation, with the same three-day period.
  - After a violation is addressed, "your AHR will update within a few hours".
  - A forgiven appeal still counts toward the repeat cap: violations removed "after a successful appeal, where you didn't dispute the activity occurred, may still count toward the maximum threshold".
  - If the account is deactivated for AHR, violations "remain static" and do not age out after 180 days. Reinstatement comes "once your AHR score rises above the threshold of 100".
  - [official] (Account health rating, GR786P4BPEVKTBAG, read 2026-10-14)
- **A6. RULE — closing a listing does not clear it.** "Listings aren't removed from the Account Health page if you change the listing status (such as closing or deleting the listing from your inventory)." Removal comes from a successful dispute or appeal, a rights owner's retraction, a corrective action "such as removing infringing content", or 180 days. [official] (Account health rating, GR786P4BPEVKTBAG)
  - On restricted products, "moving a restricted product listing to Out of Stock (OOS) does not make the listing compliant". [official] (Additional information and resources for sellers about our Restricted Products policy, https://sellercentral.amazon.com/help/hub/reference/external/G201567350, read 2026-10-14)
- **A7. RULE — the AHR is not the whole story.**
  - "Amazon may deactivate your account immediately … if we suspect fraudulent, deceptive, illegal, or otherwise harmful activity … or if you violate other policies outside of AHR". [official] (Account health rating, GR786P4BPEVKTBAG)
  - "not all of Amazon's policies are currently included in AHR". [official] (Policies included in Account Health Rating, https://sellercentral.amazon.com/help/hub/reference/external/GQ5DSES264XVXNX7, version 7, read 2026-10-14)
- **A8. RULE — the policies in the AHR (as listed today; the page "will be updated as new policies are added"):** Anti-Counterfeiting, Brand Name, Intellectual Property, Marketplace Fair Pricing, ASIN Creation, Communication guidelines, Customer Product Reviews, INFORM Consumers Act, Product condition guidelines, **Product detail page rules**, adult products, software, **Product safety and compliance**, **Restricted Products**, and Selling policies and seller code of conduct.
  - Detection uses "a combination of advanced machine learning techniques and automation and expert human review"; the tools "learn and get better at proactively and automatically blocking offers".
  - [official] (Policies included in Account Health Rating, GQ5DSES264XVXNX7, read 2026-10-14)
  - [seat] Three of these policies (product detail page rules, restricted products, IP) are ones a listing edit can breach. A content edit therefore carries account-level risk, not only listing-level risk.
- **A9. GUIDANCE — Amazon links account health to search.** "Listing quality and your account health can contribute to search rankings". [official, GUIDANCE] (Amazon SEO: 7 ways to improve your product's search rankings, https://sell.amazon.com/blog/amazon-seo, read 2026-10-14). The post does not say how.

### B. Order performance: ODR family, cancellation, late shipment, tracking

For human readers. The live target for each metric is in the report's `targetValue` / `targetCondition` (D2), not here.

- **B1. RULE — Order Defect Rate.**
  - ODR is "all orders with one or more defects … represented as a percentage of total orders during a given 60-day time period".
  - Defects are "Negative feedback", "An A-to-z Guarantee claim" and "Credit card chargeback".
  - "Our policy is that sellers maintain an Order Defect Rate under 1% … above 1% may result in loss or restriction of selling privileges".
  - [official] (Order Performance program policy, https://sellercentral.amazon.com/help/hub/reference/external/GGJVNFDXQT8C3RA8, version 14, read 2026-10-14)
  - The ODR page adds:
    - Negative feedback is "1- and 2-star seller reviews". It is "order-correlated", so "the negative feedback that counts towards ODR might not match the feedback that buyers see".
    - "Amazon doesn't count fraudulent chargebacks", only service chargebacks the issuer decides for the buyer.
    - A-to-z claims count when granted with seller fault, refunded after filing, cancelled, or pending appeal. They do not count when there is no fault, when the claim is denied or withdrawn, or when it is a property-damage or injury claim.
    - Withdrawn feedback can take "up to 48 hours" to leave the ODR.
    - "ODR only applies to seller-fulfilled orders".
    - Enforcement can be offer-level: Amazon "may remove an offer if there is a history of these in a compressed time period". Reactivation is under "Other policy violations".
    - [official] (Order Defect Rate, https://sellercentral.amazon.com/help/hub/reference/external/G200285170, version 19, read 2026-10-14)
  - **Amazon's own sources disagree on FBA:**
    - The ODR page says seller-fulfilled only.
    - The SP-API report splits `orderDefectRate` into `afn` and `mfn` (D2).
    - The Data Kiosk schema says its negative-feedback and chargeback counts apply "to both seller-fulfilled and amazon-fulfilled orders", while its A-to-z count applies "to seller-fulfilled orders only" (E2).
- **B2. RULE — Cancellation Rate (Pre-Fulfillment Cancellation Rate on the Account Health page).** FBM only. It counts seller-cancelled orders over "a given 7-day period", excluding customer-requested cancellations. The target is "under 2.5%". [official] (Order Performance program policy, GGJVNFDXQT8C3RA8)
- **B3. RULE — Late Shipment Rate.**
  - LSR counts orders whose shipment confirmation came after the expected ship date, "over both a 10-day or 30-day period". It is seller-fulfilled only, and the target is "under 4%". [official] (Order Performance program policy, GGJVNFDXQT8C3RA8)
  - The LSR page says above 4% "may result in suspension of your Fulfilled by Merchant selling privileges or deactivation of your seller-fulfilled offers with high rates of late shipments".
  - Tracking edits: "Allow 72 hours for the report and metric to reflect the changes."
  - [official] (Late Shipment Rate, https://sellercentral.amazon.com/help/hub/reference/external/G200285190, version 23, read 2026-10-14)
  - From June 29, 2026, sellers must set an accurate handling time per SKU: "Your handling time is considered accurate when the actual handling time consistently matches your configured handling time", monitored over 30 days. [official] (Order Performance program policy)
- **B4. RULE — Valid Tracking Rate.** VTR is "a given 30-day period", seller-fulfilled only, with the policy "greater than 95%". "A Valid Tracking Rate below 95% in a product category may result in restrictions on your ability to sell non-FBA items within that category." [official] (Order Performance program policy)
- **B5. RULE — On-Time Delivery Rate and Business Hour Delivery Rate.**
  - "effective September 25, 2024, we require a minimum of a 90% OTDR without promise extensions to have seller-fulfilled products listed on Amazon.com". 95% is recommended. It does not apply to FBA.
  - BHDR (Amazon Business, FBM) is over 14 days. Below 90% brings a warning, and then possible deactivation of FBM offers for Business customers.
  - [official] (Order Performance program policy)
- **B6. RULE — 2026 change: FBM offer-level deactivation.** "Starting August 31, 2026, if any of your FBM offers put your Account Health at risk, we'll temporarily deactivate that offer. Previously, listings that didn't meet required metrics put your entire account at risk. Now, only the affected offer is deactivated."
  - "You'll receive a warning email before any offer is deactivated".
  - Deactivated offers are under "Other Policy Violations".
  - The policies evaluated are Cancellation Rate, Late Shipment Rate, Order Defect Rate and On-Time Delivery Rate.
  - [official] (Review Account Health updates for FBM offers, Seller Forums, News_Amazon, datePublished 2026-08-31, https://sellercentral.amazon.com/seller-forums/discussions/t/7d5f264e-d83e-4557-9557-3999722b7e23, read 2026-10-14)
  - [seat] Since 2026-08-31, an FBM listing can go dark for a fulfilment metric while the account stays green. That is exactly the case cx would misread as a content problem.

### C. How seller performance feeds the Featured Offer

- **C1. RULE — what is weighed.** Amazon ranks offers on price, delivered promise, free shipping, free returns and "Seller Performance: Sellers that consistently and reliably fulfill customer orders are more likely to be featured". The performance dimensions named are:
  - "Order volume"
  - "Chargeback rate"
  - complaints from the Voice of the Customer dashboard, including "Inaccurate website description", "Wrong item sent", "Product condition not as expected", "Style not as expected" and "Wrong size"

  "Keep in mind that late deliveries can impact your Late Shipment Rate. For more information, go to Account Health Rating." [official] (Becoming the Featured Offer, https://sellercentral.amazon.com/help/hub/reference/external/G201687550, version 20, read 2026-10-14; capture capture `G201687550-v20`)
- **C2. RULE — what is not weighed.** "Customer reviews and star ratings: We evaluate seller performance along the dimensions listed above, not through customer-submitted seller reviews or star ratings." Prime eligibility and fulfilment method are also not weighed. [official] (Becoming the Featured Offer)
  - [seat] So seller feedback stars enter the account layer (ODR) but, by Amazon's statement, not the Featured Offer ranking directly. Chargebacks enter both.
- **C3. RULE — eligibility gate removed (US).** "As of September 2026, Amazon no longer maintains a seller eligibility requirement, and offers from all sellers are now eligible to be evaluated for the Featured Offer." Still, "Amazon will not feature any offer if none of the available offers meet our customer experience requirements, even if the product has only one available offer." The old eligibility page now reads "This page has been removed." [official] (Becoming the Featured Offer, G201687550; Featured Offer eligibility, https://sellercentral.amazon.com/help/hub/reference/external/G200418100, version 23; both read 2026-10-14; captures `G201687550-v20.txt`, `G200418100-v23.txt`)
  - Both pages are the US layer (`Published/US`). Whether the gate is gone in another store, and when the rollout there ends, is read from that store's own Becoming the Featured Offer page at run time; angles/price-position.md owns the rollout (its Open question 10). method/triggers.md still lists "Featured Offer eligibility tests" as a rule; on the US pages that rule is gone.
- **C4. RULE — Featured Offer % definition.** "the total number of page views in which your offer is featured divided by the total number of page views for your products", in Business Reports. [official] (Becoming the Featured Offer) The Business reports glossary agrees: "The percentage of page views where the Featured Offer (the "Add to shopping cart" link) appeared". [official] (Business reports glossary, https://sellercentral.amazon.com/help/hub/reference/external/G27691, version 7, read 2026-10-14; capture `G27691-v7.txt`)
  - Amazon has a second metric under the same name with a different denominator. The Sales and Traffic report's `buyBoxPercentage` is "The percentage of page views where the buy box (the add to shopping cart link) appeared" [official] (sellerSalesAndTrafficReport.json, https://github.com/amzn/selling-partner-api-models/blob/main/schemas/reports/sellerSalesAndTrafficReport.json, read 2026-10-14). The Data Kiosk seller analytics `featureOfferPct` is "calculated by dividing the number of times your offer is the Featured Offer by the number of times customers viewed it (that is, Glance Views)" [official] (analytics_sellerAnalytics_2025_03_31.graphql, read 2026-10-14). Page views and glance views are not the same count, so the two are two series, not one.
- **C5. RULE — the content link.** Voice of the Customer CX Health compares an offer's negative-customer-experience rate with similar offers. The feedback comes from "returns, refunds, customer service contacts, buyer-seller messaging, seller feedback, A-Z claims, and product reviews".
  - "inaccurate or incomplete product detail pages" are a named root cause.
  - "it may take several weeks for actions you take to be reflected in those metrics."
  - The fix Amazon proposes for a confusing page is to edit "the title, bullet points, product description, or images".
  - [official] (Voice of the Customer, https://sellercentral.amazon.com/help/hub/reference/external/GRTPNYUAU5EQ9RGU, version 10; Resolve your CX Health issues, https://sellercentral.amazon.com/help/hub/reference/external/G6XR2DNVSQ7Q7NK5, version 5; both read 2026-10-14)
  - [seat] This is the one account-adjacent path where a content edit is the remedy: complaints that the page misdescribes the product.

### D. Policy categories, the report that names them, and the notification

- **D1. RULE — the report.** `GET_V2_SELLER_PERFORMANCE_REPORT`, named "Seller Performance Report", "Contains the individual performance metrics data from the Seller Central Account Health dashboard". Role: Selling Partner Insights. "This report can only be requested." Schema: `accountHealthReport-2020-11-18`. [official] (Performance Reports, https://developer-docs.amazon/sp-api/docs/report-type-values-performance.md, updatedAt 2026-10-06, read 2026-10-14)
  - Its attributes on the doc page are:
    - `accountStatuses[]` (`marketplaceId`, `status`)
    - performance metrics: `lateShipmentRate`, `lateShipmentRateList`, `invoiceDefectRate`, `orderDefectRate` (`afn` / `mfn`, each with `claims`, `chargebacks`, `negativeFeedback`), `onTimeDeliveryRate`, `unitOnTimeDeliveryRate`, `validTrackingRate`, `preFulfillmentCancellationRate`, `warningStates`, and `accountHealthRating` (`ahrStatus`, `ahrScore`)
    - policy metrics, each with `defectsCount`, `status`, `targetValue`, `targetCondition`: `listingPolicyViolations`, `productAuthenticityCustomerComplaints`, `productConditionCustomerComplaints`, `productSafetyCustomerComplaints`, `receivedIntellectualPropertyComplaints`, `restrictedProductPolicyViolations`, `suspectedIntellectualPropertyViolations`, `foodAndProductSafetyIssues`, `customerProductReviewsPolicyViolations`, `otherPolicyViolations`, `documentRequests`
    - `policyViolationWarnings` (`warningsCount`)
  - The same page lists `GET_V1_SELLER_PERFORMANCE_REPORT` ("XML Customer Metrics Report", same role, request only). It carries `returnDissatisfactionRate`, `customerServiceDissatisfactionRate`, `contactResponseTime`, `productAuthenticityStatus`, `productSafetyStatus`, `listingPolicyStatus` and `intellectualPropertyStatus`.
  - It also lists `GET_SELLER_FEEDBACK_DATA`, which "Contains negative and neutral feedback (one to three stars)".
- **D2. RULE — the published schema differs from the doc page.**
  - `accountHealthReport-2020-11-18.json` lists no `customerProductReviewsPolicyViolations` and no `policyViolationWarnings`.
  - Its `accountHealthRating` declares a property `accountHealthRatingStatus` with enum `GREAT` / `WARNED`, while its own `required` list names `ahrStatus`. It has no `ahrScore`.
  - `status` is `GOOD` / `BAD` / `NONE`. `targetCondition` is `GREATER_THAN` / `LESS_THAN` / `EQUALS`.
  - `accountStatuses[].status` is `NORMAL` / `AT_RISK` / `DEACTIVATED`.
  - `warningStates[]` carries a free-string `warningType` (example `spammingSellerMessaging`).
  - The schema's example target values are examples, not policy. For instance, the example pre-fulfilment cancellation target is 0.01, while the help page says 2.5%.
  - [official] (accountHealthReport-2020-11-18.json, https://github.com/amzn/selling-partner-api-models/blob/main/schemas/reports/accountHealthReport-2020-11-18.json, read 2026-10-14)
- **D3. RULE — the notification.** "The `ACCOUNT_STATUS_CHANGED` notification is sent whenever the Account Status changes … between `NORMAL`, `AT_RISK`, and `DEACTIVATED`."
  - Payload `accountStatusChangeNotification` with `previousAccountStatus` and `currentAccountStatus`; payload version 2021-01-01.
  - "Workflow: Amazon Simple Queue Service workflow". It supports `filterExpression`.
  - [official] (Notification Type Values, https://developer-docs.amazon/sp-api/docs/notification-type-values.md, updatedAt 2026-09-30, read 2026-10-14)
  - The same page says `LISTINGS_ITEM_STATUS_CHANGE` fires "when a listings item is created, deleted, or its buyability changes".
  - It also says, of `LISTINGS_ITEM_ISSUES_CHANGE`: "All problems that can occur with a listing do not have corresponding defined issues. As a result, this notification does not necessarily represent all problems with a listing (neither does the **Selling Partner API for Listings Items**)." [official] (same page)
- **D4. RULE — the cheap check on the Sellers API.** `getMarketplaceParticipations` returns, per store, `isParticipating` and `hasSuspendedListings`: "`true` if the seller Listing Status is set to Inactive". `getAccount` returns `sellingPlan` (`PROFESSIONAL` / `INDIVIDUAL`). [official] (sellers.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/sellers-api-model/sellers.json, read 2026-10-14)
  - Neither operation returns a seller id. The model's response shapes carry `marketplace`, `participation` and `storeName` (participations) and `marketplaceParticipationList`, `businessType`, `sellingPlan`, `business` and `primaryContact` (account), with no `sellerId` field. A route to the seller's own seller id is not the Sellers API. [official] (sellers.json, re-read 2026-10-14)
- **D5. RULE — the listing layer's own signals.**
  - A listing's `issues[].enforcements.actions[].action` is `LISTING_SUPPRESSED`, `ATTRIBUTE_SUPPRESSED`, `CATALOG_ITEM_REMOVED` or `SEARCH_SUPPRESSED`.
  - Issue categories include `QUALIFICATION_REQUIRED` ("Approval or qualification is required to list the product") and `DUPLICATE`.
  - [official] (listingsItems_2021-08-01.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-items-api-model/listingsItems_2021-08-01.json, read 2026-10-14)
  - The Suppressed Listings report `GET_MERCHANTS_LISTINGS_FYP_REPORT` (role Product Listing) "Contains suppressed listings, the reason each listing is suppressed, and instructions for removing each suppression". [official] (Inventory Reports, https://developer-docs.amazon/sp-api/docs/report-type-values-inventory.md, read 2026-10-14)

### E. Data Kiosk `accountHealth` group

- **E1. RULE — what the dataset offers.**
  - The Seller Analytics dataset (`analytics_sellerAnalytics_2025_03_31`, view `sellerAnalyticsView`) has metric groups for "sales, traffic, promotions, account health, search, reviews, defects, and returns".
  - "Access to the seller analytics dataset is governed by the role assigned to your application". The guide names two access levels; "Sales and traffic access" grants these groups. The guide names no SP-API role.
  - **Amazon's pages disagree on the role.**
    - Role Mappings for SP-API Operations (updatedAt 2026-10-13) lists Brand Analytics as the only required role for the Data Kiosk operations (`createQuery`, `getDocument` and the rest). [official] (https://developer-docs.amazon/sp-api/docs/role-mappings.md, read 2026-10-14) The Data Kiosk API page (updatedAt 2026-09-09) shows the same, and adds that "Each field available with Data Kiosk requires a certain role" and that authorisation is checked per field "upon query creation". [official] (https://developer-docs.amazon/sp-api/docs/data-kiosk-api.md, read 2026-10-14)
    - Correction: Data Kiosk role requirements says not all datasets need Brand Analytics: "The Vendor Analytics and Sales and Traffic datasets require the Brand Analytics role. The Economics dataset requires the Selling Partner Insights role." It does not name the Seller Analytics dataset. [official] (https://developer-docs.amazon/sp-api/changelog/correction-data-kiosk-role-requirements.md, read 2026-10-14)
    - The schema gates each field with PAAM rights, not role names (E2).
    - These are Amazon's own statements and they are not reconciled. The binding answer for a given seller's application is what Data Kiosk returns to the first `createQuery`: data, or an authorization error per field.
  - "Requesting a field your application is not authorized for returns an authorization error rather than a null value."
  - `startDate` must be "no more than two years ago".
  - [official] (Seller Analytics Dataset Use Case Guide, https://developer-docs.amazon/sp-api/docs/seller-analytics-dataset-guide.md, updatedAt 2026-09-30, read 2026-10-14)
- **E2. RULE — the `accountHealth` fields.**
  - Counts: `accountHealthOrderCount`, `…NegativeFeedbackOrderCount`, `…AtozClaimOrderCount`, `…ChargebackClaimOrderCount`, `…LateShipmentOrderCount`, `…PreFulfillmentCancelOrderCount`, `…ValidTrackingDefectPackageCount`, `…PackageCount`, `…PackageUnits`, `…OnTimeDeliveryDefectPackageUnits`, `…OnTimeDeliveryDefectPackageCount`, `accountHealthTotalOrderDefects`.
  - Rates: `accountHealthOrderDefectRate`, `…NegativeFeedbackRate`, `…AtozGuaranteeClaimRate`, `…ChargebackClaimRate`, `…LateShipmentRate`, `…PreFulfillmentCancelRate`, `…ValidTrackingRate`, `…OnTimeDeliveryRate`.
  - Score: `accountHealthRatingScore`, "0-1,000 point scale indicating account suspension risk based on compliance with Amazon's selling policies".
  - Trailing-120-day snapshot rates, each "snapshot data, always returns latest value": `regionIncorrectLabelDefectRateT120Days`, `regionLabelMissingDefectRateT120Days`, `regionInaccurateProductDefectRateT120Days` ("products with inaccurate product information"), `regionUnexpectedProductDefectRateT120Days`, `regionOtherDefectsProductRelatedDefectRateT120Days`, `regionDistinctCountDefectTypeT120Days`, `regionResolvedDefectsUnitT120Days`.
  - Every field lists `analytics_sales_and_traffic_view_pa` in `@paamRights(require: […])`; some also list `analytics_sales_and_lending_view` (for example `accountHealthRatingScore` and the T120 rates), and some list only the first (for example `accountHealthOrderDefectRate`). The directive says "Requesters must have at least one right from the list".
  - Every field carries `@resultRetention(duration: "P30D")`. The directive defines it as "the retention duration of a query containing a particular field", the shortest one applying when fields differ, and "The retention of a query's resulting documents always matches the retention of the query." It bounds how long a query and its result documents are kept, not how far back the data goes; that limit is the guide's `startDate` rule (E1).
  - Each value is an `IntWithBenchmarking` or `FloatWithBenchmarking` (`value` plus `timeRangeBenchmarking`). The schema has no target or status field for these metrics; those are in the seller-performance report (D1).
  - "A null value for a given metric means that this metric is not yet available."
  - [official] (analytics_sellerAnalytics_2025_03_31.graphql, https://github.com/amzn/selling-partner-api-models/blob/main/schemas/data-kiosk/analytics_sellerAnalytics_2025_03_31.graphql, read 2026-10-14)
- **E3. RULE — snapshot behaviour.**
  - The T120 metrics "are snapshots rather than period sums". Daily requests need `startDate` = `endDate` on a date with snapshot data. Weekly requests are limited to eight weeks and monthly requests to 24 months. They are "not supported in `totals`".
  - The separate `defects` group (return-defect topics) is "computed over a trailing six-month window".
  - "Requesting an incompatible combination is not an error … Metrics that cannot be broken down by the requested attribute are returned as null for those rows".
  - [official] (Seller Analytics Dataset Use Case Guide)

### F. Deactivation, appeal and reinstatement mechanics

- **F1. RULE — where a removed listing is found.** Account Health, then "First, check the Product Policy Compliance tab for the issue". "If your listing doesn't appear there, check Manage Inventory for inactive listings". "Review your Performance Notifications for removal details." [official] (Appeal an account deactivation or listing removal, https://sellercentral.amazon.com/help/hub/reference/external/G200370560, version 13, read 2026-10-14)
  - Some removals sit elsewhere: "Some policy violations related to product safety and Extended Producer Responsibility are reported separately on the Manage Your Compliance and Extended Producer Responsibility dashboards. We're in the process of merging these dashboards with the account health page". [official] (Account health FAQ, G200285250)
- **F2. RULE — account appeal.**
  - The route is Account Health, then "Reactivate your account". The seller "may be asked to submit a questionnaire, acknowledge a violation, complete a quiz, or provide supporting documents".
  - "Please expect a reply to your appeal within two days." [official] (Appeal an account deactivation or listing removal, G200370560)
  - Questionnaire guidance: "Be clear and concise. Be factual and direct". "look for the root causes". "Provide specific actions … dates of changes, or documentation". "Some products require invoices from the last 365 days." [official] (Complete an appeal questionnaire to reinstate selling privileges, https://sellercentral.amazon.com/help/hub/reference/external/G201623610, version 12, read 2026-10-14; linked from other pages under the older name "Reinstate selling privileges")
- **F3. RULE — the four-part appeal (Amazon's own structure; practitioners call it a Plan of Action).** For restricted products, "A viable appeal must answer the following four questions":
  1. "What was the restricted product violation or which policy was violated by what product?"
  2. "What caused the violation?"
  3. "What reactive steps have you taken to resolve the violation?"
  4. "What proactive steps have you taken to prevent future violation?"

  The guide also says:
  - It names invalid root causes, such as "I did not create the ASIN, I just listed against a product already on the website."
  - It names invalid preventive steps: asking Selling Partner Support to pre-screen, or setting listings Inactive.
  - "Amazon will assume that all reactive and proactive steps described in your appeal have been implemented at the time of submission."
  - "You cannot re-use or recycle an old appeal."
  - Reactive steps include "updating the detail page for your listing to remove prohibited claims".

  [official] (Additional information and resources for sellers about our Restricted Products policy, G201567350, read 2026-10-14). None of the Amazon pages read today uses the phrase "Plan of Action".
- **F4. RULE — invoices.** An invoice must show "issue date within the past 365 days before the receipt of the performance notification" and "Quantity sufficient to cover your sales volumes and in-stock inventory for each ASIN cited … over the past 365 days".
  - Not accepted: pro forma invoices, self-issued invoices, editable formats.
  - Format: PDF or image, no larger than 10MB.
  - [official] (Invoice requirements for appealing a policy violation, https://sellercentral.amazon.com/help/hub/reference/external/GDQ9K277NYP6WNEW, version 4, read 2026-10-14)
- **F5. RULE — IP: which remedy depends on where the infringement is.**
  - "Trademark or Counterfeit infringement on the product or packaging": provide an invoice or Order ID through Account Health.
  - "Trademark or Counterfeit infringement on the product detail page": "Modify the product detail page or pages to ensure they do not infringe the trademark and then submit your appeal".
  - With a licence: ask the rights owner for a retraction ("Your content may be reinstated if we receive a retraction").
  - Copyright: a DMCA counter-notice. Patent: reply with reasons or a court order.
  - "Amazon terminates the accounts of repeat infringers in appropriate circumstances." "Even if a seller is infringing IP without knowledge, we will still take action".
  - [official] (Intellectual Property Policy, https://sellercentral.amazon.com/help/hub/reference/external/G201361070, version 20, read 2026-10-14)
- **F6. RULE — product authenticity and condition.** "Violations related to product authenticity are categorized as intellectual property violations." "products that do not match their descriptions, can be categorized as product condition violations."
  - "The product you list and ship must exactly match the description, pictures, and all other information on the product detail page."
  - Enforcement can "Remove your listings", "Limit, suspend, or block your ability to list and sell", remove FBA inventory, or "Withhold your payments".
  - [official] (Amazon product authenticity and quality, https://sellercentral.amazon.com/help/hub/reference/external/G202010130, version 4, read 2026-10-14)
- **F7. RULE — product safety.**
  - "If your product does not meet Amazon's safety or compliance requirements, your listing may be deactivated, and your account may be subject to further action."
  - Documentation from suspended labs risks "product suppression".
  - "Listing a restricted product, even unintentionally, may result in enforcement action".
  - [official] (Safety, compliance, and product restrictions, https://sellercentral.amazon.com/help/hub/reference/external/GXMGGPL6LC4CVXHT, version 10, read 2026-10-14)
  - Safety alerts: "When Amazon receives safety alerts, affected products are removed and sellers notified." The page defines the types (Notice of Violation, Stop Sale Order, Public Recall and others).
  - Reinstatement after a safety suppression needs documented resolution, removal of impacted inventory and a "Letter of Compliance (LOC)" on manufacturer letterhead. "All products may not be eligible for reinstatement."
  - Amazon "will suspend accounts for non-compliance or suppression circumvention". Sellers are responsible "for maintaining product safety compliance under original ASIN".
  - [official] (Product safety alerts, recalls, stop sales, and market withdrawal policy for sellers, https://sellercentral.amazon.com/help/hub/reference/external/GRD4EMBNNW3P47GH, version 8, read 2026-10-14)
- **F8. RULE — edits that are themselves violations.**
  - "You may not update detail pages to repeatedly add and remove prohibited claims … may be subjected to corrective actions, including but not limited to the immediate termination of selling privileges."
  - "You may not repeatedly update your listing to add and remove prohibited images, disclaimers, or content to circumvent Amazon policy controls … Listing products on Amazon in a manner to avoid detection is considered evasive behavior. Evasive behavior does not have a path to reinstatement unless you provide valid proof of your adherence to all applicable laws and Amazon policies."
  - "If listings are identified to be purposefully inaccurate, miscategorized, or deceptively described to circumvent any of Amazon's Category, product, and listing restrictions, your account may be subjected to corrective actions".
  - [official] (Product detail page rules, https://sellercentral.amazon.com/help/hub/reference/external/G200390640, version 21, revision 1, read 2026-10-14, capture capture `G200390640-v21`; the same miscategorisation clause is on Restricted products, https://sellercentral.amazon.com/help/hub/reference/external/G200164330, read 2026-10-14)
- **F9. GUIDANCE (Amazon staff, forum) — compliance documents.**
  - "it can take up to 15 business days (weekends are not counted in this review process) for the Compliance team to get back to you".
  - Submissions go through "the Manage Your Compliance dashboard", which generates a case ID.
  - Rejection #3 is "Misalignment/Missing Information on Detail Page": sellers need "to update information on the detail page as it was not aligned with previously submitted information".
  - [official, staff forum post] (Keep on, Keeping on with the Compliance Document Review Process, Seller Forums, Cooper_Amazon, datePublished 2025-04-30, https://sellercentral.amazon.com/seller-forums/discussions/t/c04d30eb-54fd-4540-882a-3c64ebb1c3e4, read 2026-10-14)
  - The dashboard lets you "upload and manage product compliance documents one at a time or through bulk uploads". "If a product lacks the right compliance documentation, your listings could be removed." [official, GUIDANCE] (Simplify product safety with the Manage Your Compliance dashboard, Lola Okusami, sell.amazon.com blog, 2022-08-03, https://sell.amazon.com/blog/manage-your-compliance, read 2026-10-14)
- **F10. RULE — Account Health Assurance (AHA).**
  - "a benefit available to professional sellers who consistently achieve a high Account Health Rating (AHR). With Account Health Assurance, we will no longer deactivate your selling account as long as you work with us within 72 hours of contacting you to resolve any issues."
  - Eligibility (human-read figures): "AHR … score of 250 or higher for at least 6 months with no more than 10 days below 250 and have a valid emergency contact number on file". Enrolment is automatic, with an email.
  - Seasonal dips: below 250 with no violations, the seller stays enrolled "for an additional 180 days".
  - The seller loses AHA by: an AHR below 250 for "more than 10 consecutive days"; no verified emergency contact; unmet regulatory obligations; not engaging within 72 hours; not fully resolving; or "repeating the same policy compliance issues".
  - Amazon may still "remove you from the AHA program and deactivate your seller account immediately" for fraudulent, deceptive, illegal or harmful activity.
  - "If you can't see a numeric AHR score yet, you are not eligible".
  - [official] (Account Health Assurance: Frequently asked questions, https://sellercentral.amazon.com/help/hub/reference/external/GGQY933W4RDPJT29, version 12, read 2026-10-14)
  - Launch: "a new benefit … for professional sellers in our US and Canada stores (other countries will be launched over the coming months)". [official] (Account Health Assurance helps you address issues without account deactivation, Seller Forums, News_Amazon, datePublished 2022-11-16, https://sellercentral.amazon.com/seller-forums/discussions/t/a69cf5c3d9eb7dcf387c21f0f2d3fb78, read 2026-10-14)
  - An Amazon staff post says AHA "gives you up to 13 days (instead of 3) to resolve issues before suspension". [official, staff forum post] (Stay in Control: A Seller's Guide to Account Health, Seller Forums, Roberto_Amazon, datePublished 2026-04-24, https://sellercentral.amazon.com/seller-forums/discussions/t/f360047c-af63-4910-a37a-e26df9b14b45, read 2026-10-14). The help page states no 13-day figure; see Open questions.
- **F11. RULE — Seller Challenge (AHA only).**
  - "Currently Seller Challenge is available only to US-based sellers enrolled in the Account Health Assurance program."
  - It gives "an enhanced review of specific enforcements or decisions after multiple attempts to resolve them": "Three (3) Seller Challenges initially", and "Each failed challenge replenishes after six (6) months".
  - "eligible listing-level enforcements only". "We aim to respond to all cases with a decision within 48 hours."
  - A deactivated listing "will remain deactivated … while the challenge is in review".
  - [official] (Seller Challenge FAQ, https://sellercentral.amazon.com/help/hub/reference/external/G7XWXBNSYMBJAPX5, version 2, read 2026-10-14)
- **F12. RULE — Account Health Support.** "All professional sellers have access to the Contact us button on their Account health page". The team is "available 7 days a week". For IP violations the evidence is "authorization letters, invoices from authorized distributors". [official] (Account health support FAQ, https://sellercentral.amazon.com/help/hub/reference/external/GBMCHQ8MJ9KDYQ9A, version 12, read 2026-10-14)
- **F13. Account Health page sections, as Amazon's pages name them** (the dashboard itself is behind sign-in): "Customer Service Performance" and "Shipping Performance" (Order Performance program policy); "Product Policy Compliance" (Appeal page; Account health FAQ: "clicking View all at the bottom of the Product Policy Compliance section … a history of all the content (listings, images) that was removed"); "Other policy violations" (ODR page; FBM news post); and the "Impact" column, which labels repeat violations (Account health rating FAQ). [official] (pages as cited)

### G. Featured Offer loss that is not account health

- **G1. RULE — pricing.**
  - Offers can be "deactivated because of potential pricing errors" under the Marketplace Fair Pricing policy, which is itself in the AHR list.
  - Offers can be "ineligible to become the Featured Offer … because they aren't priced competitively compared with other retailers outside of Amazon".
  - Both show in Pricing Health.
  - [official] (Pricing Health, https://sellercentral.amazon.com/help/hub/reference/external/GSTH6YN3BR8XNWBW, read 2026-10-14)
  - [seat] Pricing is price-position's domain. It is named here only so the account-layer check does not take the blame for a pricing hold.

## What practitioners add

- **AHA does not protect listings.** AHA "does not protect individual listings from deactivation". "Amazon's automated enforcement systems can act on ASINs before any 72-hour window opens". IP complaints, inauthentic-item complaints, listing-quality enforcement and other ASIN-level actions "proceed without AHA involvement regardless of the seller's enrollment status". The firm says "counterfeit, payment fraud, identity fraud, and child safety violations — are excluded entirely". "the seller receives no separate notification that their protection has lapsed." Reinstatement needs a Plan of Action with root cause, dated corrective actions and preventive measures. [opinion] (DAM Law Firm / David Allen Miller Law, PLLC, "Amazon Account Health Assurance: What It Covers, Who Qualifies, and What It Doesn't Protect", no date shown, https://damlawfirm.com/blog/amazon-account-health-assurance-sellers-guide/, read 2026-10-14)
  - *Disagreement:* Amazon's AHA FAQ lists no named exclusion categories. It says only "fraudulent, deceptive, illegal, or otherwise harmful activity". The listing-level point agrees with Amazon's Seller Challenge FAQ, which covers "listing-level enforcements only".
- **AHA eligibility.** "Only sellers with a Professional selling plan are eligible". The post adds at least one year of activity and availability in the US, Canada and the UK. [opinion] (Patricia Lewis, Seller Assistant blog, "Amazon Account Health Assurance", 2025-08-05, https://www.sellerassistant.app/blog/amazon-account-health-assurance/, read 2026-10-14)
  - *Disagreement:* Amazon's FAQ states no one-year rule and names no stores ("in Amazon stores").
- **Policy violations are binary and do not age with clean metrics.** Violations are "not percentage-based": a single unresolved one lowers the AHR even when shipping metrics are clean. "removing the affected ASIN does not close the case." A POA states root cause, corrective steps and preventive measures, and the author advises talking to Account Health specialists before writing it. [opinion] (Hai Mag, Eva, "Amazon Account Health: 2026 Operating Guide for Sellers", 2026-06-01, https://eva.guru/blog/amazon-account-health/, read 2026-10-14). This agrees with Amazon's A6.
- **Compliance-document requests.** "If you fail to comply, Amazon can block or remove your listings." Submissions still in progress "will not appear" on the Manage Your Compliance dashboard. [opinion] (Ellen Sipp-Paris, eComEngine, "Manage Your Amazon Product Compliance in Seller Central", 2022-04-28, updated 2023-09-14, https://www.ecomengine.com/blog/amazon-product-compliance, read 2026-10-14)
- **Compliance appeals and listing text.** The author advises that titles, bullets and attributes must match the packaging, and that appeals should be concise, documented and free of blame. [opinion] (Steven Pope, My Amazon Guy, "How to Survive Amazon Compliance Issues Without Losing Your Mind", 2023-03-14, updated 2025-12-26, https://myamazonguy.com/amazon/amazon-compliance-issues-what-you-can-do/, read 2026-10-14). This agrees with Amazon's staff post on "Misalignment/Missing Information on Detail Page" (F9).
- **AHR is "only the front page".** In the firm's 2026 deal records, suspension history and Buy Box share track business value within AHR bands. A resolved suspension carried a lower median multiple than warnings-only. The author says this is correlation. [opinion] (The FBA Guys, "Amazon Account Health Rating Explained: The Score Is Only the Front Page", 2026-06-19, https://thefbaguys.com/blog/amazon-account-health-rating-explained, read 2026-10-14)
- **Where practitioners and Amazon differ on timing.** Practitioners repeat "72 hours" for AHA (Seller Assistant, Eva). An Amazon staff forum post says "up to 13 days (instead of 3)". The FAQ frames 72 hours as the window to engage after Amazon makes contact, not a resolution deadline. None of the practitioner pages read gives a reinstatement duration.

## Published research

- **Le Chen, Alan Mislove, Christo Wilson, "An Empirical Analysis of Algorithmic Pricing on Amazon Marketplace", WWW 2016 (Montréal), https://mislove.org/publications/Amazon-WWW.pdf, read 2026-10-14.** [research]
  - Finding (narrow): the authors trained a random-forest classifier on crawled Buy Box outcomes for 1,641 best-seller products. "low prices are the most important feature used by the Buy Box algorithm to select sellers, but that customer feedback and ratings are also used." Feature weights were price difference to lowest 0.36, price ratio to lowest 0.33, positive feedback 0.10, Amazon-is-seller 0.10, feedback count 0.06, average rating 0.03 and FBA 0.02. Naive lowest-price baselines reached only 50–60% accuracy.
  - Transfer: limited.
    - It is a 2014–2015 crawl.
    - It is correlational: feedback may proxy for the performance dimensions Amazon actually uses.
    - Amazon's current page says seller "reviews and star ratings" are not considered (C2).
    - What transfers: price dominates, and offer-side seller attributes beyond listing text explain who is featured. Listing copy was not a feature at all.
- No other peer-reviewed or Amazon Science work on account health, appeals or enforcement and listing outcomes was found. The search budget ran out before a dedicated literature pass; see Open questions.

## Stable enough for a skill

- An account-layer event can remove an offer or a listing, hide it from search, or take the Featured Offer, and no listing-text edit reverses it. (Account health rating; Becoming the Featured Offer; Review Account Health updates for FBM offers)
- An empty `issues` array is not proof of a healthy listing: Amazon says not every listing problem has a defined issue, in the notification or in the Listings Items API. (Notification Type Values, `LISTINGS_ITEM_ISSUES_CHANGE`)
- A removed listing is found under Account Health's Product Policy Compliance, then inactive listings in Manage Inventory, then Performance Notifications. Some safety and EPR removals are on the separate Manage Your Compliance dashboard. (Appeal an account deactivation or listing removal; Account health FAQ)
- Amazon's seller-performance report carries a target and a status per policy metric. The binding threshold is the one Amazon returns, not a remembered figure. The Data Kiosk `accountHealth` fields carry a value and a time-range benchmark, not a target. (Performance Reports; accountHealthReport-2020-11-18.json; analytics_sellerAnalytics_2025_03_31.graphql)
- Amazon defines two Featured Offer shares: Business Reports and the Sales and Traffic report divide by page views, Data Kiosk `featureOfferPct` by glance views. They are not one series. (Becoming the Featured Offer; Business reports glossary; sellerSalesAndTrafficReport.json; analytics_sellerAnalytics_2025_03_31.graphql)
- Featured Offer selection weighs price, delivery promise, free shipping, free returns and seller performance (order volume, chargebacks, Voice of the Customer complaints). It does not weigh seller star ratings, Prime or fulfilment method. (Becoming the Featured Offer)
- On Amazon's US pages the seller-level Featured Offer eligibility gate is gone; for another store, that store's own page is read. An offer can still go unfeatured, and Amazon may feature no offer at all. (Becoming the Featured Offer; Featured Offer eligibility)
- Since 2026-08-31 an FBM offer that puts account health at risk on cancellation, late shipment, ODR or on-time delivery is deactivated alone, after a warning email, and shows under Other Policy Violations. (Review Account Health updates for FBM offers)
- Closing, deleting or setting a listing out of stock does not remove an account-health violation or make a restricted listing compliant. (Account health rating; Additional information … Restricted Products policy)
- Repeatedly adding and removing prohibited claims, images or content, and describing a product so it slips past a restriction, are violations in their own right. Evasive behaviour has no path to reinstatement without proof of compliance. (Product detail page rules; Restricted products)
- An IP complaint about the detail page can be answered by changing the page and then appealing. One about the product or packaging needs invoices, an order ID, a licence or a retraction. (Intellectual Property Policy)
- Voice of the Customer complaints that the page misdescribes the product are an account-adjacent signal that a content edit can address, and the metrics take weeks to move. (Voice of the Customer; Resolve your CX Health issues)
- Amazon's appeal for restricted products answers four things: the violation, its cause, the reactive steps and the proactive steps. Amazon assumes the steps are in place when the appeal is submitted, and an old appeal cannot be reused. (Additional information … Restricted Products policy)
- Account Health Assurance protects the account, not individual listings. It needs the seller to engage within Amazon's stated window, and it depends on a numeric AHR that the seller sees. (Account Health Assurance FAQ; Seller Challenge FAQ)
- `ACCOUNT_STATUS_CHANGED` reports account status moving between `NORMAL`, `AT_RISK` and `DEACTIVATED`, and is delivered through the SQS workflow. (Notification Type Values)

## What cx must read at run time

- **Is the seller participating and are listings suspended?** Sellers API `getMarketplaceParticipations` (`GET /sellers/v1/marketplaceParticipations`): `participation.isParticipating`, `participation.hasSuspendedListings` per store. `getAccount` (`GET /sellers/v1/account`) gives `sellingPlan`. (sellers.json)
- **The account's status, AHR and policy counts.** `GET_V2_SELLER_PERFORMANCE_REPORT` through the Reports API `createReport` → `getReport` → `getReportDocument` (role Selling Partner Insights; request only). Its name, options and waits are door.md's.
  - Read `accountStatuses[].status`, `accountHealthRating` (status and score, under whichever key the delivered document uses), each policy metric's `defectsCount` / `status` / `targetValue` / `targetCondition`, `documentRequests`, `warningStates` and `policyViolationWarnings`.
  - Read the delivered JSON, since the doc page and the schema differ (D2).
- **Customer-service and return metrics and recent negative feedback.** `GET_V1_SELLER_PERFORMANCE_REPORT` (XML) and `GET_SELLER_FEEDBACK_DATA`, through the same operations. Names and waits are door.md's.
- **Account-health trend, per period.** Data Kiosk `createQuery` → `getQuery` → `getDocument` on `analytics_sellerAnalytics_2025_03_31` / `sellerAnalyticsView`, group `accountHealth` (and `defects`).
  - Respect the snapshot rules for the T120 metrics.
  - Read a null in a grouped row as "not available at this granularity".
  - A query and its result documents are kept for the duration the schema's `@resultRetention` states (read from the schema, not remembered); this is not the data's history depth, which the guide's `startDate` rule bounds.
  - Whether the seller's application may read the group at all is the first `createQuery`'s answer: data, or a per-field authorization error. Amazon's role pages disagree (E1), so no role is assumed.
- **The listing's own enforcement state.** Listings Items `getListingsItem` with `includedData=summaries,issues` (status `BUYABLE` / `DISCOVERABLE`, `issues[].enforcements`), and `searchListingsItems` for many SKUs. The Suppressed Listings report `GET_MERCHANTS_LISTINGS_FYP_REPORT` (door.md's).
- **Account status changes, pushed.** `ACCOUNT_STATUS_CHANGED` via Notifications API `createDestination` (SQS) and `createSubscription`; also `LISTINGS_ITEM_STATUS_CHANGE` and `LISTINGS_ITEM_ISSUES_CHANGE`. These need a destination the box can read; see Open questions.
- **Whether the seller's offer is featured.** Product Pricing offers operations, and a Featured Offer share (price-position's and own-traffic-funnel's domain): Business Reports / Sales and Traffic `buyBoxPercentage` (over page views) or Data Kiosk `featureOfferPct` (over glance views). cx names which one it read and never joins the two in one series (C4). From Keepa, `stats.buyBoxSellerId` and `buyBoxSellerIdHistory` on the product file. A null, `-1` or `-2` there identifies no seller.
- **A competitor's or the seller's public feedback, as shoppers see it.** Keepa raw `GET /seller`: `positiveRating` / `negativeRating` / `neutralRating` / `ratingCount` (each for 30 days, 90 days, 365 days and lifetime), `currentRating`, `currentRatingCount`, `lastRatingUpdate`. (Seller.java, https://github.com/keepacom/api_backend/blob/master/src/main/java/com/keepa/api/backend/structs/Seller.java, read 2026-10-14)
  - This is not the ODR. The ODR counts feedback by order date (B1).
- **What no API read here exposes:** the Product Policy Compliance tab's per-ASIN violations, Performance Notifications text, Manage Your Compliance requests, Voice of the Customer CX Health and AHA enrolment. cx asks the seller to read them, or reads them in a browser where a browser source is connected. [seat]: no SP-API operation found for them in the pages read.

## Pages read

| Page name | URL | Date read | What it gave |
|---|---|---|---|
| Account Health Rating program policy (v24) | https://sellercentral.amazon.com/help/hub/reference/external/G200205250 | 2026-10-14 | Scale, bands, 180 days, start 200, severities, repeats, immediate deactivation |
| Account health rating (FAQ, v17) | https://sellercentral.amazon.com/help/hub/reference/external/GR786P4BPEVKTBAG | 2026-10-14 | Severity examples, grace, repeat caps, points, removal rules, closing does not clear, reinstatement at 100 |
| Policies included in Account Health Rating (v7) | https://sellercentral.amazon.com/help/hub/reference/external/GQ5DSES264XVXNX7 | 2026-10-14 | Policy list; ML + human review |
| Account health FAQ (v9) | https://sellercentral.amazon.com/help/hub/reference/external/G200285250 | 2026-10-14 | Manage Your Compliance / EPR dashboards separate; Product Policy Compliance; "Good/At Risk/Critical" labels |
| Order Performance program policy (v14) | https://sellercentral.amazon.com/help/hub/reference/external/GGJVNFDXQT8C3RA8 | 2026-10-14 | ODR, CR, LSR, VTR, OTDR, BHDR targets and windows; handling-time rule |
| Order Defect Rate (v19) | https://sellercentral.amazon.com/help/hub/reference/external/G200285170 | 2026-10-14 | Defect definitions; what counts; seller-fulfilled only; offer removal |
| Late Shipment Rate (v23) | https://sellercentral.amazon.com/help/hub/reference/external/G200285190 | 2026-10-14 | LSR policy; offer deactivation; 72 h tracking edit |
| Becoming the Featured Offer (v20) | https://sellercentral.amazon.com/help/hub/reference/external/G201687550 | 2026-10-14 | Factors incl. seller performance; not-considered list; eligibility removed; FO % definition |
| Featured Offer eligibility (v23) | https://sellercentral.amazon.com/help/hub/reference/external/G200418100 | 2026-10-14 | "This page has been removed"; as of September 2026 (capture capture `G200418100-v23`) |
| Featured Offer (v19) | https://sellercentral.amazon.com/help/hub/reference/external/G37911 | 2026-10-14 | Removed; points to G201687550 (capture capture `G37911-v19`) |
| Business reports glossary (v7) | https://sellercentral.amazon.com/help/hub/reference/external/G27691 | 2026-10-14 | Featured Offer percentage over page views (read from capture capture `G27691-v7`) |
| Voice of the Customer (v10) | https://sellercentral.amazon.com/help/hub/reference/external/GRTPNYUAU5EQ9RGU | 2026-10-14 | CX Health, NCX, inaccurate detail pages, weeks to move |
| Resolve your CX Health issues (v5) | https://sellercentral.amazon.com/help/hub/reference/external/G6XR2DNVSQ7Q7NK5 | 2026-10-14 | Content edit as remedy |
| Appeal an account deactivation or listing removal (v13) | https://sellercentral.amazon.com/help/hub/reference/external/G200370560 | 2026-10-14 | Appeal steps; "within two days"; where a removed listing is |
| Complete an appeal questionnaire to reinstate selling privileges (v12) | https://sellercentral.amazon.com/help/hub/reference/external/G201623610 | 2026-10-14 | Appeal writing guidance; 365-day invoices |
| Additional information and resources for sellers about our Restricted Products policy | https://sellercentral.amazon.com/help/hub/reference/external/G201567350 | 2026-10-14 | Four-question appeal; OOS not compliant; no reuse |
| Invoice requirements for appealing a policy violation (v4) | https://sellercentral.amazon.com/help/hub/reference/external/GDQ9K277NYP6WNEW | 2026-10-14 | Invoice rules |
| Intellectual Property Policy (v20) | https://sellercentral.amazon.com/help/hub/reference/external/G201361070 | 2026-10-14 | Remedy by notice type; repeat infringers |
| Amazon product authenticity and quality (v4) | https://sellercentral.amazon.com/help/hub/reference/external/G202010130 | 2026-10-14 | Authenticity = IP; condition = mismatch; enforcement list |
| Restricted products | https://sellercentral.amazon.com/help/hub/reference/external/G200164330 | 2026-10-14 | Corrective actions; miscategorisation clause |
| Product detail page rules (v21 r1) | https://sellercentral.amazon.com/help/hub/reference/external/G200390640 | 2026-10-14 | Add/remove claims; evasive behaviour; miscategorisation clause (capture capture `G200390640-v21`) |
| Safety, compliance, and product restrictions (v10) | https://sellercentral.amazon.com/help/hub/reference/external/GXMGGPL6LC4CVXHT | 2026-10-14 | Listing deactivation; suspended labs |
| Product safety alerts, recalls, stop sales, and market withdrawal policy for sellers (v8) | https://sellercentral.amazon.com/help/hub/reference/external/GRD4EMBNNW3P47GH | 2026-10-14 | Safety action types; LOC; circumvention |
| Pricing Health | https://sellercentral.amazon.com/help/hub/reference/external/GSTH6YN3BR8XNWBW | 2026-10-14 | Pricing deactivation and FO ineligibility |
| Account Health Assurance: Frequently asked questions (v12) | https://sellercentral.amazon.com/help/hub/reference/external/GGQY933W4RDPJT29 | 2026-10-14 | AHA terms |
| Seller Challenge FAQ (v2) | https://sellercentral.amazon.com/help/hub/reference/external/G7XWXBNSYMBJAPX5 | 2026-10-14 | Listing-level challenges; 48 h |
| Account health support FAQ (v12) | https://sellercentral.amazon.com/help/hub/reference/external/GBMCHQ8MJ9KDYQ9A | 2026-10-14 | AHS channel; evidence types |
| Customer Service Quality Insights on Feedback Manager | https://sellercentral.amazon.com/help/hub/reference/external/GEGVWH65EDJLWHQD | 2026-10-14 | Title only (fetched, body not used) |
| Program Policies; Amazon Anti-Counterfeiting policy; Frequently asked questions on BHDR; On-time delivery rate; Handling time requirement | G521; G201165970; GGQLPFRCMQRGUCDF; G200847280; GD559HDD5ZUZ8LNM | 2026-10-14 | Fetched; titles confirmed; bodies not used for claims |
| Product safety and compliance | https://sellercentral.amazon.com/help/hub/reference/external/GUH6FA4XSJ2LZFLY | 2026-10-14 | unreachable: content call returned an empty body |
| G200285750, G202113160, G200285700, G200285800, G200205140, G202113200, G200285200, G201190440 (guessed ids for valid tracking, cancellation and other pages) | https://sellercentral.amazon.com/help/hub/reference/external/<id> | 2026-10-14 | unreachable: empty or error body; titles unknown |
| Account Health Assurance helps you address issues without account deactivation (News_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/a69cf5c3d9eb7dcf387c21f0f2d3fb78 | 2026-10-14 | AHA launch 2022-11-16, US/CA |
| Review Account Health updates for FBM offers (News_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/7d5f264e-d83e-4557-9557-3999722b7e23 | 2026-10-14 | FBM offer-level deactivation from 2026-08-31 |
| Stay in Control: A Seller's Guide to Account Health (Roberto_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/f360047c-af63-4910-a37a-e26df9b14b45 | 2026-10-14 | Bands, metric targets, AHA "13 days (instead of 3)" |
| Keep on, Keeping on with the Compliance Document Review Process (Cooper_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/c04d30eb-54fd-4540-882a-3c64ebb1c3e4 | 2026-10-14 | 15 business days; detail-page misalignment; evasive behaviour |
| Product compliance requests; No Response on Compliance Documents and My Listing Was Removed (seller threads) | https://sellercentral.amazon.com/seller-forums/discussions/t/eeb251ddda2f573baa61f38fdb78c5c5 ; …/35da8688-eea0-4f7f-9473-c61b7eae0e2a | 2026-10-14 | Seller reports of listings removed while documents were under review (anecdote, not cited as rule) |
| Simplify product safety with the Manage Your Compliance dashboard (sell.amazon.com) | https://sell.amazon.com/blog/manage-your-compliance | 2026-10-14 | MYC purpose; listings could be removed |
| Amazon SEO: 7 ways to improve your product's search rankings | https://sell.amazon.com/blog/amazon-seo | 2026-10-14 | "account health can contribute to search rankings" |
| Performance Reports | https://developer-docs.amazon/sp-api/docs/report-type-values-performance.md | 2026-10-14 | V1/V2 seller performance and feedback reports |
| Notification Type Values | https://developer-docs.amazon/sp-api/docs/notification-type-values.md | 2026-10-14 | ACCOUNT_STATUS_CHANGED; listing notifications; issues not exhaustive |
| Seller Analytics Dataset Use Case Guide | https://developer-docs.amazon/sp-api/docs/seller-analytics-dataset-guide.md | 2026-10-14 | accountHealth group, snapshots, access ("governed by the role assigned to your application"; no role named) |
| Role Mappings for SP-API Operations (updatedAt 2026-10-13) | https://developer-docs.amazon/sp-api/docs/role-mappings.md | 2026-10-14 | Data Kiosk operations: Brand Analytics only; "any one of them grants you access"; `getMarketplaceParticipations` roles |
| Data Kiosk API (updatedAt 2026-09-09) | https://developer-docs.amazon/sp-api/docs/data-kiosk-api.md | 2026-10-14 | Operations list Brand Analytics; per-field authorisation at query creation |
| Correction: Data Kiosk role requirements | https://developer-docs.amazon/sp-api/changelog/correction-data-kiosk-role-requirements.md | 2026-10-14 | Sales and Traffic / Vendor Analytics: Brand Analytics; Economics: Selling Partner Insights; Seller Analytics not named |
| sellerSalesAndTrafficReport.json | https://github.com/amzn/selling-partner-api-models/blob/main/schemas/reports/sellerSalesAndTrafficReport.json | 2026-10-14 | `buyBoxPercentage` over page views |
| Inventory Reports | https://developer-docs.amazon/sp-api/docs/report-type-values-inventory.md | 2026-10-14 | Suppressed Listings report |
| accountHealthReport-2020-11-18.json | https://github.com/amzn/selling-partner-api-models/blob/main/schemas/reports/accountHealthReport-2020-11-18.json | 2026-10-14 | Enums, field set, ahrStatus/required mismatch |
| analytics_sellerAnalytics_2025_03_31.graphql | https://github.com/amzn/selling-partner-api-models/blob/main/schemas/data-kiosk/analytics_sellerAnalytics_2025_03_31.graphql | 2026-10-14 | AccountHealth field descriptions, PAAM rights per field, `@paamRights` and `@resultRetention` directive texts, `featureOfferPct` over glance views |
| listingsItems_2021-08-01.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-items-api-model/listingsItems_2021-08-01.json | 2026-10-14 | Issue categories, enforcement actions |
| sellers.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/sellers-api-model/sellers.json | 2026-10-14 | hasSuspendedListings, sellingPlan; no seller id in either response |
| Keepa Seller.java | https://github.com/keepacom/api_backend/blob/master/src/main/java/com/keepa/api/backend/structs/Seller.java | 2026-10-14 | Seller rating fields |
| DAM Law Firm, AHA guide | https://damlawfirm.com/blog/amazon-account-health-assurance-sellers-guide/ | 2026-10-14 | [opinion] AHA limits |
| Seller Assistant, "Amazon Account Health Assurance" | https://www.sellerassistant.app/blog/amazon-account-health-assurance/ | 2026-10-14 | [opinion] eligibility |
| Eva, "Amazon Account Health: 2026 Operating Guide for Sellers" | https://eva.guru/blog/amazon-account-health/ | 2026-10-14 | [opinion] violations binary; POA |
| eComEngine, "Manage Your Amazon Product Compliance in Seller Central" | https://www.ecomengine.com/blog/amazon-product-compliance | 2026-10-14 | [opinion] compliance requests |
| My Amazon Guy, "How to Survive Amazon Compliance Issues…" | https://myamazonguy.com/amazon/amazon-compliance-issues-what-you-can-do/ | 2026-10-14 | [opinion] compliance appeals |
| The FBA Guys, "Amazon Account Health Rating Explained…" | https://thefbaguys.com/blog/amazon-account-health-rating-explained | 2026-10-14 | [opinion] AHR vs business value |
| Chen, Mislove, Wilson (WWW 2016) | https://mislove.org/publications/Amazon-WWW.pdf | 2026-10-14 | [research] Buy Box features |
| Seller Central Account Health dashboard, Product Policy Compliance, Manage Your Compliance, /ah/eligibility | https://sellercentral.amazon.com/performance/dashboard (and others) | 2026-10-14 | unreachable: behind sign-in, not attempted |

## Open questions

1. **Do policy removals (IP, restricted, safety, compliance holds) show in a listing's `issues` / `enforcements`?** Amazon says the issues set is not exhaustive (D3), and its appeal page sends sellers to Product Policy Compliance, not to listing issues. *Settles it:* the first real run on a store with a known Product Policy Compliance item, comparing `getListingsItem` `issues` and `summaries.status` with what the seller sees there.
2. **Which key carries the AHR in the delivered V2 document** (`ahrStatus` / `ahrScore` on the doc page, against `accountHealthRatingStatus` `GREAT`/`WARNED` in the schema), and does `warningStates` name `warningType` values beyond the example? *Settles it:* the first delivered `GET_V2_SELLER_PERFORMANCE_REPORT` document.
3. **Can the Data Kiosk `accountHealth` metrics be grouped by ASIN or SKU, or only by store?** The guide says incompatible combinations come back null. *Settles it:* a first `sellerAnalyticsView` query grouped by `asin` that asks for `accountHealthOrderDefectRate` and `regionInaccurateProductDefectRateT120Days`. Which SP-API role grants `analytics_sales_and_traffic_view_pa` is not stated anywhere read: Role Mappings and the Data Kiosk API page say Brand Analytics for the operations, the role correction names datasets other than Seller Analytics, and the guide names no role (E1; the same open point as own-traffic-funnel's Open question 4, and against returns.md's reading that Role Mappings settles it). *Settles it:* the first `createQuery` on `sellerAnalyticsView` under the seller's actual roles.
4. **Can the box receive `ACCOUNT_STATUS_CHANGED`?** It is SQS-only and needs a destination the seller's app owns. door.md names the grantless `sellingpartnerapi::notifications` scope but no destination. *Settles it:* an engineering ruling on whether the box gets a queue. Until then, polling the V2 report (or `getMarketplaceParticipations`) is the only route.
5. **AHA resolution window.** The help page says engage "within 72 hours". An Amazon staff forum post says "up to 13 days (instead of 3)". *Settles it:* a News_Amazon announcement or a help-page revision stating 13 days. The seat could not search for one (budget exhausted).
6. **"Plan of Action" as Amazon's term.** No Amazon page read today uses it. Amazon's structure is the questionnaire and the four-question appeal. *Settles it:* a search of Seller Central help for the phrase (not done; budget exhausted).
7. **How long reinstatement takes, end to end.** Amazon gives only: an appeal reply "within two days" (account), Seller Challenge "within 48 hours", an AHR update "within a few hours", and up to 15 business days for compliance documents (staff post). No practitioner duration was read. *Settles it:* a practitioner survey (e.g., an agency's published case data) or the first real appeal the seller runs.
8. **Valid Tracking Rate and Pre-fulfilment Cancellation Rate dedicated pages, and the Product safety and compliance page (GUH6FA4XSJ2LZFLY).** These were unreadable or their ids are unknown; the figures used here come from the Order Performance program policy. *Settles it:* the browser seat reading them signed in.
9. **ODR scope for FBA.** The ODR help page says seller-fulfilled only, while the report has an `afn` ODR and Data Kiosk counts AFN negative feedback and chargebacks. *Settles it:* a store with FBA orders and the delivered V2 document.
10. **Published research.** No paper beyond Chen et al. was read on enforcement, reputation and marketplace outcomes. *Settles it:* a literature pass when the search budget refills.

## Positions

1. **P-account-health-1.** Before cx proposes a content edit to fix a drop in exposure, Featured Offer % or orders, it checks the account layer: participation and suspended listings, the seller-performance report's account status and policy metrics, and the listing's status and enforcements. If any of these explains the drop, it reports an account or offer problem instead of a copy change. — Account health rating; Becoming the Featured Offer; sellers.json; Performance Reports; Review Account Health updates for FBM offers.
2. **P-account-health-2.** cx does not treat an empty `issues` array as proof that nothing is wrong with a listing. Amazon says not every listing problem has a defined issue, and policy removals are shown under Account Health's Product Policy Compliance. — Notification Type Values; Appeal an account deactivation or listing removal.
3. **P-account-health-3.** cx reads every account-health threshold, status and score from what Amazon returns (`targetValue`, `targetCondition`, `status`, the AHR fields) and does not quote remembered thresholds. — Performance Reports; accountHealthReport-2020-11-18.json; Account health rating.
4. **P-account-health-4.** cx never proposes, and never writes under a standing instruction, an edit that re-adds content Amazon removed, cycles claims in and out, or re-describes or re-categorises a product to get past a restriction. Amazon treats these as violations with no path back. — Product detail page rules; Restricted products.
5. **P-account-health-5.** When a policy item names the detail page itself (a trademark on the page, a prohibited claim, a page that does not match the product or the compliance documents), cx may propose the content change. It tells the seller that the appeal on Account Health is a separate step the seller takes. — Intellectual Property Policy; Additional information … Restricted Products policy; Keep on, Keeping on with the Compliance Document Review Process.
6. **P-account-health-6.** When a policy item concerns the product, its packaging, its authenticity, its safety or its documents, cx says plainly that no listing edit resolves it. It names what Amazon asks for instead: invoices, an order ID, a licence or retraction, compliance documents, or a Letter of Compliance. — Intellectual Property Policy; Invoice requirements for appealing a policy violation; Product safety alerts, recalls…; Safety, compliance, and product restrictions.
7. **P-account-health-7.** cx does not advise closing, deleting or setting a listing out of stock as a fix for an account-health violation. — Account health rating; Additional information … Restricted Products policy.
8. **P-account-health-8.** effect-review gives no verdict, and says "cannot tell", for an observation or baseline window in which the offer was deactivated, the listing was removed or suppressed, or the account's status changed. The account-layer event is recorded as the confounder. — Review Account Health updates for FBM offers; Notification Type Values; Account health rating.
9. **P-account-health-9.** cx names the Featured Offer factors as Amazon states them, including the seller-performance dimensions (order volume, chargebacks, Voice of the Customer complaints). It does not present seller star rating, Prime or FBA as Featured Offer factors. — Becoming the Featured Offer.
10. **P-account-health-10.** When Voice of the Customer complaints say the page misdescribes the product, cx treats that as a content signal it may act on, and sets the observation window in weeks, not days. — Voice of the Customer; Resolve your CX Health issues.
11. **P-account-health-11.** A seller's standing instruction to watch the account is carried out by reading the seller-performance report (and `getMarketplaceParticipations`) on the seller's cadence. `ACCOUNT_STATUS_CHANGED` is used only where a notification destination exists. — Performance Reports; Notification Type Values; sellers.json.
12. **P-account-health-12.** cx tells the seller which account-health facts it cannot read through the connection (Product Policy Compliance details, Performance Notifications, Manage Your Compliance, Voice of the Customer, AHA status) and asks for them, rather than inferring them. — Appeal an account deactivation or listing removal; Account health FAQ; Account Health Assurance FAQ.
13. **P-account-health-13.** When the seller asks for help with an appeal, cx drafts it in Amazon's structure: the violation and product, the cause, the reactive steps taken, and the proactive steps. Each is factual and specific, and cx does not reuse an earlier appeal. — Additional information … Restricted Products policy; Complete an appeal questionnaire to reinstate selling privileges.
14. **P-account-health-14.** cx does not tell a seller that Account Health Assurance protects a listing. It covers the account, on condition that the seller engages within Amazon's window. — Account Health Assurance FAQ; Seller Challenge FAQ.

**The seat's own (not for a skill)**

- [seat] Of all the account-layer causes, the FBM offer-level deactivation (from 2026-08-31) is the most likely to be misread as a content problem. The account stays green while one listing goes dark.
- [seat] A content edit to a listing under a policy hold may itself start a new review (Amazon re-evaluates content). No Amazon page read states the mechanism; the "evasive behavior" clause covers only repeated add/remove cycles.
- [seat] Keepa's public seller feedback (`negativeRating` for 30 days) is a rough outside view of one ODR component for a competitor, but it is not the ODR.
- [seat] Chen et al.'s feedback weights probably proxy for the performance dimensions Amazon names. They should not be read as contradicting Amazon's "not through … star ratings".

## Verification

Gap fill 2026-10-14: 2 gaps filled, 0 left open. Four sub-points remain partly open, listed in Open questions 5–8.

- Gap 1 (account layer as a cause of listing outcomes): filled.
  - AHR and the ODR family (A-to-z, negative feedback, chargebacks), late shipment, valid tracking and pre-fulfilment cancel targets, and how seller performance feeds Featured Offer selection: B1–B6, C1–C5.
  - Account Health Assurance: F10–F11.
  - Policy categories, appeal mechanics, listing deactivation for safety or IP reasons: D1, F1–F9.
  - `ACCOUNT_STATUS_CHANGED`: D3.
  - Data Kiosk `accountHealth` group: E1–E3.
- Gap 2 (account-health signals that remove or suppress listings): filled.
  - AHR scale and thresholds: A1–A5.
  - Policy categories (IP, authenticity, restricted, listing policy, product safety, food and product safety) mapped to report fields: A8, D1, F5–F8.
  - `GET_V2_SELLER_PERFORMANCE_REPORT` fields and the schema mismatch: D1–D2.
  - `ACCOUNT_STATUS_CHANGED`: D3.
  - Product Compliance document requests: F1, F9 and practitioners.
  - Appeal mechanics and reinstatement time: F2–F4, F10–F11.
  - Left partly open: the Amazon term "Plan of Action" (OQ6), end-to-end reinstatement duration (OQ7), the AHA 72 h vs 13 days figure (OQ5), and the dedicated VTR, PFCR and Product safety and compliance pages (OQ8).
- Adversarial re-check: every help page cited was re-fetched through the content call after writing, and each quoted phrase was matched by script against the page text. The forum posts, the developer `.md` pages, the schema files and Seller.java were re-read. The practitioner pages were re-opened through the fetch tool. Corrections from the re-check are listed below.
  - Result: 244 quoted strings were checked by script. Eleven did not match verbatim. On hand inspection, each was a link-rendering or column-layout artifact, the seat's own label (e.g. "cannot tell", the verdict term), or Amazon's double quotes rendered as single quotes inside a quote. None was a misquote.
  - Corrected: the DAM Law Firm bullet. The first draft paraphrased the listing-level point as "proceed without the 72-hour window". The page says such actions "proceed without AHA involvement regardless of the seller's enrollment status", and the bullet now quotes it.
  - Corrected: the AHA launch quote. A bracketed completion "[ming months]" was replaced with the post's actual text "over the coming months".
  - Corrected: "click View all" became the page's "clicking View all".
  - Removed: an eComEngine quote about what triggers compliance requests, which the re-fetched page does not contain verbatim.
  - Confirmed unchanged:
    - every help-page title and version
    - the V2 report field list and the schema's `ahrStatus` / `accountHealthRatingStatus` mismatch
    - the `ACCOUNT_STATUS_CHANGED` enum and SQS workflow
    - the Data Kiosk field names, P30D retention and snapshot rules
    - `hasSuspendedListings`
    - the FBM news post's date (2026-08-31) and text
    - the staff posts' dates (2025-04-30, 2026-04-24) and the "13 days (instead of 3)" line
    - Chen et al.'s feature weights

Reconciled 2026-10-14, against the cross-file contradiction list, each point settled at the source:

- Help-page reachability. This file declares no captured page unreachable; its unreachable rows (GUH6FA4XSJ2LZFLY and the eight guessed ids) have no capture under the office's capture folder (outside this repository) The method paragraph now says the content call is undocumented and its standing use is the office's to rule, and names the five cited pages that have a saved capture. Product detail page rules is now cited as G200390640 v21 r1 with its capture; F8's three quotes were matched against `G200390640-v21.txt`. C1–C4 were matched against `G201687550-v20.txt`, `G200418100-v23.txt` and `G37911-v19.txt`.
- C1: the late-delivery quote was not verbatim ("Late deliveries can impact …"); it now quotes the page's sentence as written.
- C3, Featured Offer eligibility: the removal is stated for the US layer, other stores' rollout is pointed to price-position.md (Open question 10), and method/triggers.md's "Featured Offer eligibility tests" rule is named as stale on the US pages. This file was not wrong; triggers.md is the file out of date.
- C4, run-time list and a new stable line, Featured Offer share denominators: Business Reports (Becoming the Featured Offer; Business reports glossary G27691 v7, from its capture) and the Sales and Traffic `buyBoxPercentage` (sellerSalesAndTrafficReport.json, opened) divide by page views; Data Kiosk `featureOfferPct` divides by glance views (schema, opened). The file previously spoke of "the Business Reports / Sales and Traffic Featured Offer %" as one metric.
- E1, OQ3 and run-time list, Data Kiosk role: Role Mappings for SP-API Operations and the Data Kiosk API page (opened) list Brand Analytics for the operations; the Correction changelog (opened) names Brand Analytics for Sales and Traffic and Vendor Analytics and Selling Partner Insights for Economics, and does not name Seller Analytics; the guide (re-opened) names no role. The file now states the disagreement and makes the first `createQuery` the binding answer. paid-keywords.md, triggers.md and returns.md each read one of these pages as settling the question; on Amazon's own pages it is not settled for the Seller Analytics dataset.
- E2: "every field carries `@paamRights(require: ["analytics_sales_and_traffic_view_pa", …])`" was imprecise; the schema lists that right on every field, with `analytics_sales_and_lending_view` on some, and "at least one right from the list" suffices. `@resultRetention` is now explained by the directive's own text (query and result-document retention, not data history depth), matching search-rank-and-volume.md's reading; the run-time line no longer states the figure.
- Stable line on targets: corrected. The Data Kiosk `accountHealth` fields carry a value and a time-range benchmark, not a target or status (schema `IntWithBenchmarking` / `FloatWithBenchmarking`); only the seller-performance report carries targets.
- D4, seller id: sellers.json was re-read; neither `getMarketplaceParticipations` nor `getAccount` returns a seller id. Recorded so that no file routes the seller's own id through the Sellers API.
- Not changed, checked: this file states no Keepa variation, description or `csv[17]` figure, no latency figure for listing edits (its 72 hours is the Late Shipment Rate page's tracking-edit allowance, an account metric), no SQP, deal, coupon or title figure, and no cross-reference to inventory-and-fulfilment.md or elements/vendor-and-hybrid.md. No "Stable enough for a skill" line or position states a figure Amazon keeps in a schema or changes by announcement.
