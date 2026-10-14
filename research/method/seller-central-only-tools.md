# Seller Central tools with no API: how cx gets their output, how fresh it is, how far to trust it

Read 2026-10-14 by the research seat. Tags: [official] Amazon's own page or document; [opinion] a named practitioner; [research] published research; [seat] the seat's own reasoning, never a skill position.

## What this covers

Funnel stage: none directly. This is a method file. It covers the tools a senior operator works in every week whose output Amazon gives only on a Seller Central screen or as a Seller Central download:

1. Manage Your Experiments (MYE): results, eligibility, and what can be edited while an experiment runs.
2. Review Listings Changes (RLC), and its companion View Change History.
3. The listing-quality queues: Fix Your Products (the suppressed / search-suppressed view), Improve Listing Quality, and its current form, the Enhance tab.
4. Seller Assistant answers, in particular review-sharing eligibility.
5. A+ Content analytics.
6. Product Opportunity Explorer (POE).
7. Business Reports, Detail Page Sales and Traffic by Parent Item / by Child Item.
8. Voice of the Customer (VOC).
9. The Category Listings Report and the flat-file (inventory file) templates.

It feeds all three skills:
- **listing-review** needs the quality queues, RLC proposals, VOC complaints and review-sharing answers as trigger evidence.
- **listing-change-log** needs RLC/View Change History, so it knows when Amazon, not the seller, changed a listing. It also needs the Category Listings Report as the seller's own bulk-write route.
- **effect-review** needs MYE results, Business Reports figures and the as-of date of every pasted figure, so it does not judge a change on stale numbers.

Why a senior operator cares. Many positions across `research/` end in "ask the seller to read X". If no file fixes one handoff, each skill invents its own. cx then cannot tell a figure the seller pasted three weeks ago from one it read live. It cannot tell an Amazon-generated file from a number the seller retyped. It also cannot tell an AI answer from a Seller Central figure. The roadmap already assumes this route: MYE results and RLC proposals "走树里的文件" (go into the tree as files), with MYE to be "第一次真跑时核对" (checked on the first real run) (roadmap §3, lines 71–72). This file says, tool by tool:
- what Amazon states about the tool;
- what an API can stand in for, and what it cannot;
- what form the seller's handoff takes;
- how fresh Amazon says the data is;
- how far cx should trust each form.

## Amazon's own rules and guidance

How pages were read. Two routes were used for Seller Central help pages:
- One page (GLYJTRGQCYNYAZS9) was read by this seat through the help hub content call (see help-page-access.md A2). The next two calls in this session were refused by the session's permission layer, so no other help page was fetched live by this seat.
- Other help pages are cited from the verbatim copies another seat fetched through the same call earlier today and saved under the office's capture folder (outside this repository) This seat opened and read those copies. Each such citation says "saved copy". A page with a capture there was read on 2026-10-14; this file calls a help page unread only where no capture exists (see *Pages read*).

Seller Forums threads, sell.amazon.com, aboutamazon.com, developer-docs and the GitHub models were opened directly this session.

### 1. Manage Your Experiments

1.1 **What it is (GUIDANCE/description).** MYE "lets you run A/B tests (also known as split tests) on your brand's listings content". Customers "are randomly split into two groups", each seeing one version "for the entire experiment". "Experiments do not impact search rankings". [official] (Manage Your Experiments, GVP453K5XRBJS7Y9 v7, saved copy, https://sellercentral.amazon.com/help/hub/reference/external/GVP453K5XRBJS7Y9, read 2026-10-14)

1.2 **Eligibility (RULE).**
- Brand: "you must own a brand". The tool page says "You also need to be a Brand Representative for a brand enrolled in Amazon Brand Registry" and "you need a Professional selling account". [official] (Manage Your Experiments, saved copy; Test listing content with Manage Your Experiments | Sell on Amazon, https://sell.amazon.com/tools/manage-your-experiments, read 2026-10-14)
- ASIN: "An ASIN is eligible if it belongs to your brand and has received enough traffic in recent weeks". "Depending on the category, high-traffic ASINs may get several dozen orders per week, or more." "ASINs with very low traffic may not appear at all." [official] (Manage Your Experiments, saved copy)
- A+ and Brand Story experiments "must have published A+ Content and Brand Story to be eligible". "Secondary image experiments are only available for ASINs with four or fewer child ASINs." [official] (Manage Your Experiments, saved copy; Create a listing experiment, GYZYA77YZTWTF7YZ v13 r3, saved copy)
- "Only one experiment can be run on any particular ASIN at a time". [official] (Manage Your Experiments, saved copy)
- Amazon states no numeric traffic threshold. Eligibility is shown per ASIN inside the tool: "The system will display ASIN eligibility status, along with details about why some ASINs may be ineligible." [official] (Create a listing experiment, saved copy)

1.3 **The edit-freeze rule (RULE, as far as Amazon states it).** Create a listing experiment lists what can be edited in each state:
- "Scheduled, successful content validation: Your content has passed validation, and your experiment schedule is locked. If you choose to change the experiment contents, you must select a new experiment start date".
- "Experiment in-progress (partial editing available): While an experiment is in-progress, the content can no longer be revised. However, you can still revise the hypothesis and duration of the experiment. If you want to change the experimental content once the experiment is in progress, you must cancel the existing experiment and create a new one."
- "Canceled" and "Completed" experiments "can't be edited". At completion "all customers will see your original (control) content unless and until you decide to publish another version."

[official] (Create a listing experiment, saved copy)

**What Amazon does not state:** what happens to a running experiment if the seller edits the live listing (Version A) through Manage All Inventory, a file upload or the Listings Items API. No Amazon page read today addresses it (MYE help pages, the sell.amazon.com tool page, the 2024 sell.amazon.com blog, and three News_Amazon/staff threads were checked). See *Open questions* 1.

1.4 **Results: what, how often, how computed (description).**
- "Experiment results are updated once a week until the experiment ends."
- For each version Amazon shows "Units, sales, conversion rate, units sold per unique visitor, and sample size". "Results are aggregated for all enrolled ASINs in an experiment."
- "Projected one-year impact … is only populated for completed experiments". It is "the average daily sales increase of the winning content … multiply by 365" and "doesn't take into account seasonality, price changes, or other factors".
- Method: "We use a Bayesian approach"; Amazon reports "the mean effect size (in terms of change in units) and the 95% confidence interval (also known as a credible interval)". "Visits to your page where a customer cannot be identified are not included in the sample size."

[official] (Experiment results, GY6DCFA53HYDH79H v4, saved copy)

1.5 **Duration and auto-publish (GUIDANCE with a stated rule).** "Experiments typically run for 8 to 10 weeks". "To significance" ends "whenever there are statistically relevant results—in as little as four weeks". "Eight weeks is the recommended length for a set duration experiment." Auto-publish fires only "if there is at least a 66% probability that it will perform better than any other tested version". [official] (Create a listing experiment, saved copy)

1.6 **Peeking (GUIDANCE).** "Don't check your results too frequently before an experiment ends: Interim results can be misleading." [official] (Tips for experiments, G2BNMJ8NFCGZQVFH v5, saved copy)

1.7 **No export is stated.** No Amazon page read today mentions downloading or exporting MYE results. Amazon says results are read "by clicking on the experiment name in the experiments dashboard" (Experiment results) or "select View Details" (tool page). [official, by absence] (Experiment results, saved copy; Test listing content with Manage Your Experiments | Sell on Amazon)

1.8 **Uplift marketing figures (claims, not rules).**
- The MYE tool page says "Optimized content can help increase sales by up to 20%", footnoted "Amazon internal data".
- The Brand Registry page says listing changes from optimized content "can increase sales by up to 25%".

Both are Amazon pages, and they disagree: the MYE tool page says 20%, the Brand Registry page's MYE paragraph says 25%. Both were re-read on 2026-10-14 and both figures are still printed. Neither figure is on an MYE help page, neither is a rule, and no skill line uses either; a human reader is told both, with the page each is on. [official] (Test listing content with Manage Your Experiments | Sell on Amazon; Amazon Brand Registry | Sell on Amazon, https://sell.amazon.com/brand-registry, read 2026-10-14)

1.9 **No API.** The SP-API docs index lists no experiment page or operation. The Data Kiosk schemas carry no experiment field. [official, by absence] (SP-API docs index, https://developer-docs.amazon/llms.txt; models `schemas/data-kiosk/*.graphql`, read 2026-10-14)

### 2. Review Listings Changes and View Change History

2.1 **What it is (RULE about Amazon's own writes).** RLC "allows brand owners to see proposed updates to product information on ASINs stamped with brands they own". Michelle_Amazon's staff guide says:
- "You have 14 days to review and respond."
- If the brand owner does nothing, "the proposed changes will automatically be applied to your product detail pages."
- Menu: "Navigate to: Manage All Inventory > Review Listing Updates".
- Scope: "This view currently does not include any updates made to product images and browse nodes."
- Since April 20: "Starting April 20, this view will only show upcoming AI-suggested changes." The year is not printed; the post shows "6 months ago".

[official] (🚨 Review Listing Changes Tool: Your Guide to Managing AI Product Updates 🚨, Michelle_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/e1c8d51d-c27b-4d8a-bea1-26413e283699, read 2026-10-14)

2.2 **The handoff format Amazon itself uses (description).** The same guide's steps:
1. "Download and carefully review the Excel template".
2. Choose "Agree" or "Disagree" per change in the template.
3. "Upload your completed feedback file before the deadline".

So RLC proposals leave Seller Central as an Amazon-generated Excel file. [official] (Review Listing Changes Tool guide, Michelle_Amazon)

2.3 **The 2026 title programme runs through RLC (RULE).**
- "When changes are made to your listings, brand owners will have 14 days before implementation" to review in Review Listings Changes.
- "After July 27, any titles still over 75 characters will be updated to the AI recommendation gradually."

[official] (Updates to improve your product titles begin on July 27, News_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/145b6d0f-999c-4555-896c-c694bda2e470, read 2026-10-14)

The sentence does not limit the rewrite to listings a seller has edited: a title nobody touched is in scope if it is over Amazon's limit. (`angles/competitor-set.md` reads the programme otherwise; this file follows the News_Amazon wording, as `elements/title.md` and `method/listing-policies.md` do.) The title help page names the same route and both outcomes: "If your product is already listed and the title doesn't comply with these requirements or contains inaccurate information, the title might be automatically corrected or it might not appear in our search results. Policy-violating titles can be viewed directly in Manage All Inventory. Brand owners can also see these titles in Review listing changes." [official] (Product title requirements and guidelines, GYTR6SYGFA5E3EQC v21 r2, saved copy, https://sellercentral.amazon.com/help/hub/reference/external/GYTR6SYGFA5E3EQC, read 2026-10-14) The character limit itself is Amazon's figure, kept on those pages and in the product-type schema; it is not restated as a rule here.

2.4 **Past Amazon changes: View Change History (description).** "View any AI-applied changes in Manage All Inventory → click View Change History." [official] (💡 Engage With Amazon: Get your Product Title Update Questions Answered!, Dougal_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/ac660707-60c7-43e3-a3fd-420d7321cc4e, read 2026-10-14) No export of View Change History is mentioned there.

2.5 **What an API sees after the fact (description).**
- `BRANDED_ITEM_CONTENT_CHANGE` is sent "whenever there is a change to the title, description, bullet points, or images" of an ASIN the seller has a brand relationship with. Its payload carries `AttributesChanged`. "Sellers can subscribe to this notification." [official] (Notification Type Values, https://developer-docs.amazon/sp-api/docs/notification-type-values, read 2026-10-14)
- A notification marks an applied change. A proposal waiting in RLC is not a notification, and no SP-API operation reads the RLC queue (docs index, by absence).

### 3. The listing-quality queues: Fix Your Products, Improve Listing Quality, Enhance

3.1 **Current Amazon wording (description).**
- Listing quality "is determined by seven key components: title, bullet points, attributes, images, video, A+ Content, and search optimization".
- "To identify and fix listing quality issues, go to Enhance. The Enhance tab on Manage Products shows you which listings have improvement opportunities and provides AI-generated suggestions".

[official] (Listing quality, G200786710 v5 r1, saved copy)

Amazon's pages do not use one name. The Amazon search glossary still sends sellers to the older one: "To continuously audit your inventory, correct errors, and ensure that it is fully discoverable, go to the Listing Quality Dashboard." [official] (Amazon search glossary, GF6B8ZPNY2AP72VV v2 r0, saved copy) Neither page says the other's name is retired. cx names the screen as the seller sees it.

3.2 **Suppressed listings (RULE: suppression).** Amazon's steps:
- "go to the menu, click Inventory, and select Manage All Inventory".
- "Select Activate listings from the horizontal categories".
- "View all suppressed listings in Activate listings, or click the Listing Status filter".

[official] (Suppressed listings, G200898440 v13, saved copy) My ASIN is unsearchable says: "Check if it has a listing quality issue by reviewing Fix Your Products … review if the ASIN is search suppressed or inactive (detail page removed)". [official] (My ASIN is unsearchable, GHGHDMU4X5K9QGCV v6, saved copy)

3.3 **Staff on Fix Your Products (description).** Cooper_Amazon's guide:
- Suppressed listings can be seen "on the Fix your products page".
- "If you would like to download a suppressed listings report follow the steps outlined on the suppressed listings page".
- "some updates to detail pages may take up to 24 hours to process and appear live on the website."

[official] (Listing Lounge: Surviving Search Suppression, Cooper_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/765f5738-4dee-4c42-9c8e-4991cf58ab9b, read 2026-10-14) The 2025 seller blog adds: "You can also use the Fix Your Products tool in Seller Central to resolve attribute errors", and "Select the Accept Amazon's Value button to update the attribute." [official] (How to fix (and avoid) Amazon listing errors, Mickey Toogood, 2025-02-19, https://sell.amazon.com/blog/amazon-listing-errors, read 2026-10-14)

3.4 **The API stands in for the suppression side (description).**
- **Report.** `GET_MERCHANTS_LISTINGS_FYP_REPORT`, titled "Suppressed Listings Report", "Contains suppressed listings, the reason each listing is suppressed, and instructions for removing each suppression". It is a "Tab-delimited flat file" and can be requested or scheduled. Columns: Status, Reason, SKU, ASIN, Product name, Condition, Status Change Date, Issue Description. [official] (Inventory Reports, https://developer-docs.amazon/sp-api/docs/report-type-values-inventory, read 2026-10-14)
- **Listings Items `issues`.** Each issue carries `severity` (`ERROR`/`WARNING`/`INFO`), `categories` (for example `MISSING_ATTRIBUTE`, `INVALID_IMAGE`) and `enforcements.actions[].action`:
  - `LISTING_SUPPRESSED`: "takes down the current listing item's buyability";
  - `ATTRIBUTE_SUPPRESSED`;
  - `CATALOG_ITEM_REMOVED`;
  - `SEARCH_SUPPRESSED`: "the catalog item is hidden from search results".
- **Store-wide.** `searchListingsItems` takes `includedData`, `withIssueSeverity`, `withStatus` and `issueLocale`, so the queue can be read for all of a seller's SKUs.

[official] (listingsItems_2021-08-01.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-items-api-model/listingsItems_2021-08-01.json, read 2026-10-14)

3.5 **The improvement side has no API.** The Enhance tab's "AI-generated suggestions" and any per-listing quality score or sales-lift estimate have no counterpart in the Listings Items issue model, the reports pages or the Data Kiosk schemas read today. [official, by absence; seat's reading of the models]

### 4. Seller Assistant answers

4.1 **What it is, and Amazon's own trust warning (RULE about reliance).**
- "AI is experimental and can make mistakes. We recommend verifying information using the source links provided in the answers".
- "the information may not always be complete, up to date, or error-free. Independently verify any critical details before making decisions."
- Access: "Only the administrator of your account can grant permission to use Seller Assistant". With permission it "can also take actions on your behalf". Its listed agentic actions include "Update my product title, description, and bullet points" and "assess Featured Offer eligibility".
- Metrics questions such as "How many page views did I get this month compared to last month?" are answered in chat.

[official] (Seller Assistant - Seller Central's agentic assistant, GLYJTRGQCYNYAZS9 v12 r0, read live through the content call and saved as capture `GLYJTRGQCYNYAZS9-v12`, https://sellercentral.amazon.com/help/hub/reference/external/GLYJTRGQCYNYAZS9, read 2026-10-14)

Two Amazon pages disagree on one of those actions. The Seller Assistant page still lists "assess Featured Offer eligibility", while the Featured Offer eligibility page now opens: "This page has been removed. As of September 2026, Amazon no longer maintains a seller eligibility requirement, and offers from all sellers are now eligible to be evaluated for the Featured Offer." [official] (Featured Offer eligibility, G200418100 v23 r0, saved copy) cx does not ask Seller Assistant for a seller-level Featured Offer eligibility answer as if that requirement still stood; what governs the Featured Offer is read from Becoming the Featured Offer (G201687550, saved copy) at run time.

4.2 **Review-sharing eligibility is answered there and nowhere else Amazon names.**
- "now you can ask Seller Assistant which of your product variations are eligible for review sharing". No exact prompt and no answer format are given.
- "review sharing eligibility is determined by variation theme attribute".
- On BSR: "No, this is not impacted by review sharing."

[official] (Check review sharing eligibility with Seller Assistant, News_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/bf2eb6d6-f6a9-4880-a8f9-9e1fc9d64615, read 2026-10-14) The guideline page repeats: "You can use our Seller Assistant tool to see if your product variations are eligible for review sharing." [official] (Guidelines for reviews shared across product variations, G74DLBUEHT5GY88C v3, saved copy)

4.3 **A new route out of Seller Central: the Selling Partner plugin (announcement).**
- Amazon says it is "launching the Amazon Selling Partner plugin in Quick and in beta with Claude". The plugin "connects a seller's Amazon data, including their listing contributions, real-time performance metrics". It also "can act on it", with "human approval on actions".
- It is "available in beta for sellers in Amazon's U.S. stores".

[official] (Amazon gives sellers an even smarter Seller Assistant and a new plugin for Amazon Quick and Anthropic's Claude, Mary Beth Westmoreland, https://www.aboutamazon.com/news/innovation-at-amazon/seller-assistant-plugin-amazon-quick-claude, read 2026-10-14; no publication date printed)

The Seller Forums post dates it: the thread shows "3 weeks ago" and says the plugin "connects your listings, performance and analytics to Amazon Quick and Anthropic's Claude (both in beta)". [official] (New AI tools to sell smarter, free for a year- announced at Accelerate 2026, News_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/f1daefcb-8fe8-4526-9c06-fb34169c9804, read 2026-10-14)

Neither page says which Seller Central tools (MYE, VOC, RLC) the plugin reaches. It is not part of cx's box (see *Open questions* 6).

### 5. A+ Content analytics

5.1 **No Amazon page describing A+ analytics was read today.**
- The A+ tool page mentions only "key insights based on your ASIN and top-performing products in your category to guide content creation". It also gives the sales claims "Basic A+ Content can increase sales by up to 8%—and well-implemented Premium A+ Content can increase sales by up to 20%" ("Amazon internal data"). [official] (A+ Content | Sell on Amazon, https://sell.amazon.com/tools/a-content, read 2026-10-14)
- `https://sell.amazon.com/a-plus` answered 404.

5.2 **No API.** The A+ Content API's 13 operations create, read, relate, validate, publish, suspend and manage media. None returns performance data. The model's only `metrics`/`metricName` fields are comparison-table content inside a module ("Comparison metrics for the product."). [official] (aplusContent_2020-11-01.json, read 2026-10-14) The Data Kiosk schemas have no A+ field. [official, by absence]

5.3 **What Amazon does measure for A+.** MYE A+ and Brand Story experiments (1.1). Experiment results define their conversion rate as "the percentage of unique visitors in the experiment who saw the A+ Content and made a purchase". [official] (Experiment results, saved copy)

### 6. Product Opportunity Explorer

6.1 **Description and caveat (GUIDANCE).**
- POE "primarily categorizes products within niches, which represent specific customer needs". It shows "search terms and volume, customer reviews, and return activity".
- "The tool is only a guide and should not be a substitute for your own judgment about demand for your products".

[official] (Product Opportunity Explorer | Sell on Amazon, https://sell.amazon.com/tools/product-opportunity-explorer, read 2026-10-14)

6.2 **Freshness.**
- "Niche metrics are refreshed at the beginning of each week, and new niches are created at the start of each month."
- A niche is "a collection of search terms and products that represent a specific customer need". The Returns tab shows "the percentage of how often a theme is mentioned as compared to all returns for products in that niche."

[official] (Get product ideas with Product Opportunity Explorer, Lola Okusami, 2023-04-10, https://sell.amazon.com/blog/product-opportunity-explorer, read 2026-10-14)

6.3 **The API covers the review and return side.**
- "This API provides the same information as the Product Opportunity Explorer (OX) on Seller Central and Vendor Central."
- "The data provided by the Customer Feedback API is refreshed weekly." "This API is only available in English."
- Stores: US, UK, FR, IT, DE, ES, JP.
- Roles: Brand Analytics or Selling Partner Insights.
- Operations: `getItemReviewTopics`, `getItemBrowseNode`, `getBrowseNodeReviewTopics`, `getItemReviewTrends`, `getBrowseNodeReviewTrends`, `getBrowseNodeReturnTopics`, `getBrowseNodeReturnTrends`.

[official] (Customer Feedback API, https://developer-docs.amazon/sp-api/docs/customer-feedback-api, read 2026-10-14)

Asked for POE through the SP-API, Amazon's developer-support account answered: "this feature is already available in our Customer Feedback v2024-06-01 API". On 2025-07-22 it added: "We submitted the feature request for review." [official] (Product Opportunity Explorer via SPAPI, discussion #3373, BrunnoPigatto, https://github.com/amzn/selling-partner-api-models/discussions/3373, read 2026-10-14)

[seat] The seven operations are review and return topics and trends. None returns niche search volume, click share or niche product counts. "Same information" holds for the customer-feedback side only.

### 7. Business Reports: Detail Page Sales and Traffic by Parent / by Child Item

7.1 **Download and cadence (description).**
- "You can download data in CSV format by clicking Download on the Sales dashboard. You can also download filtered data, such as by date, and ASIN, by clicking Download (.csv)". A note adds that a file may open as "Text file (tab-delimited)".
- "The 'by date' reports are updated every hour with the data from the past few days … All other reports are updated daily and consist of data from the previous day … The data from the past week is shared by the end of each Sunday." "A week runs from Sunday through Saturday."

[official] (Business Reports FAQ, G28761 v7, saved copy)

"Data for these reports is generally available for up to two years." "Business reports will have a lag of 24 hours when compared to the real-time data." [official] (Business reports, G200633570 v8, saved copy)

7.2 **The parent/child trap (RULE about the figure's meaning).**
- "When viewing the 'Detail Page Sales and Traffic' report, page views are summed only for days when there was sales activity on the ASIN. When viewing the 'Detail Page Sales and Traffic by Child Item' report, page views are summed for the entire date range, regardless of sales activity."
- "When a child ASIN is visited, it does not also count as a visit to the parent ASIN."
- "a storefront or browse node visit does not count as a page view."

The glossary names "by Child Item" but not "by Parent Item" in this rule. [official] (Business reports glossary, G27691 v7 r1, saved copy)

The seller blog describes the views: by Parent Item, "See how product variations perform as a group"; by Child Item, "Monitor individual variations within a product group". [official] (Get actionable B2B insights with Amazon business reports, Mickey Toogood, 2025-08-05, https://sell.amazon.com/blog/amazon-business-reports, read 2026-10-14)

7.3 **API equivalents exist (description).**
- **Report.** `GET_SALES_AND_TRAFFIC_REPORT` takes `asinGranularity` `PARENT`, `CHILD` or `SKU` (default `PARENT`) and `dateGranularity` `DAY`/`WEEK`/`MONTH`. Its `dataStartTime` "must not be more than two years before the date of the request". Required role: Brand Analytics. [official] (Analytics Reports, https://developer-docs.amazon/sp-api/docs/report-type-values-analytics, read 2026-10-14)
- **Data Kiosk.** `analytics_salesAndTraffic_2024_04_24` aggregates by `CHILD`, `PARENT` or `SKU` ("Sales and traffic data is aggregated by parent ASIN."). It carries `unitSessionPercentage`, defined as "how many units were purchased relative to the number of people who viewed the products". [official] (analytics_salesAndTraffic_2024_04_24.graphql, read 2026-10-14)

7.4 **Same word, different measure (RULE about definitions).** Several metrics share a name but not a definition:
- **Business Reports Featured Offer %** is over page views ("The percentage of page views where the Featured Offer … appeared"). [official] (Business reports glossary, saved copy) Becoming the Featured Offer says the same: "the total number of page views in which your offer is featured divided by the total number of page views for your products." [official] (Becoming the Featured Offer, G201687550 v20, saved copy)
- **Data Kiosk sales and traffic `buyBoxPercentage`** is over page views too: "The percentage of page views where the buy box (the add to shopping cart link) appeared on the page". [official] (analytics_salesAndTraffic_2024_04_24.graphql, re-downloaded 2026-10-14)
- **Data Kiosk seller analytics `traffic.featureOfferPct`** is over glance views: "dividing the number of times your offer is the Featured Offer by the number of times customers viewed it (that is, Glance Views)".
- **Data Kiosk `traffic.conversionRatePct`** is "the percentage of purchases to clicks for ASINs originated from the search results page". Its misspelt twin `traffic.conversationRatePct` is `@deprecated(reason: "No longer supported. Use conversionRatePct instead.")`.
- **`SearchCatalogMetrics.conversionRate`** (`search.catalog`) is "Percentage of impressions that resulted in a purchase."
- **Sales and traffic `unitSessionPercentage`** is units over sessions: "calculated by dividing unitsOrdered by sessions". [official] (analytics_salesAndTraffic_2024_04_24.graphql)

[official] (analytics_sellerAnalytics_2025_03_31.graphql, read and re-downloaded 2026-10-14)

A pasted Business Reports figure and an API figure with the same name are therefore not interchangeable. The Business Reports Featured Offer % sits beside `buyBoxPercentage` (both over page views), not beside `traffic.featureOfferPct` (glance views); no page read says whether glance views and page views are the same count. (`method/effect-measurement.md` section F and `angles/own-traffic-funnel.md` record the same split.) No page read says either whether the share's meaning changed with the September 2026 removal of the seller eligibility requirement (4.1; `angles/price-position.md` leaves it open), so a Featured Offer series that spans that date is not read as one series without saying so. The binding definition of each field is the one in its own schema, read at run time.

Access to the seller analytics fields is marked in the schema by PAAM rights (`@paamRights(require: ["analytics_sales_and_traffic_view_pa", …])`), not by a role name. Files in `research/` disagree on which SP-API role Data Kiosk needs (Brand Analytics, Selling Partner Insights, or the PAAM rights); this file does not settle it. The binding answer is the authorization result of the seller's first `createQuery`, as `method/effect-measurement.md` section E records. [official] (analytics_sellerAnalytics_2025_03_31.graphql) [seat] for the run-time rule.

### 8. Voice of the Customer

8.1 **What it shows (description).**
- "The Voice of the Customer dashboard provides both the trailing 3-month and trailing 12-month return rates for your products, as well as the suggested return rate for your product to avoid badging."
- "We identify these at-risk ASINs in the Voice of the Customer dashboard to give you time to address any issues".

[official] (Frequently returned item badge, GTRP6DXEA983DPD6 v6, saved copy)

Among Featured Offer factors Amazon lists "Complaints from your Voice of the Customer dashboard", including "Inaccurate website description", "Style not as expected" and "Wrong size". [official] (Becoming the Featured Offer, G201687550 v20, saved copy) So a VOC complaint is listing-content evidence.

8.2 **Staff definitions (description).**
- "NCX Return Rate: Orders returned due to product/listing issues ÷ Total orders".
- "NCX Review Rate: Negative reviews (1-2 stars) citing product/listing issues ÷ Total orders".
- CX Health tiers run from "Excellent (green)" to "Very poor (red)", each judged against "similar offers".
- Lag: "Depending on your order volume, it may take several weeks for actions to be reflected in your metrics."

[official] (Voice of the Customer: A Seller's Guide, Xander_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/ec4b0f7a-8a96-49f6-ad94-660aa0f84012, read 2026-10-14; the page does not label the author as staff explicitly)

A staff post shown "2 years ago": the VOC return rate is "based on the total number of units shipped for which customers have initiated returns in the past 12 months". [official] (New Return Rate and Star Rating Features on the Voice of the Customer Dashboard, Danny_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/d2cf4612-ecbf-438a-b3b9-636486eb8074, read 2026-10-14)

No Amazon page read today mentions a VOC export.

8.3 **What an API carries nearby (description; not VOC).**
- Data Kiosk seller analytics has `defects.topics` with `returnDefectTopic`, `returnDefectFrequency` ("trailing six months") and `returnDefectRecommendations`.
- `returns.returnedRate` is "computed with a delay of about 45 days".
- Account health carries `regionInaccurateProductDefectRateT120Days`, the "Regional defect rate for products with inaccurate product information over the past 120 days".

[official] (analytics_sellerAnalytics_2025_03_31.graphql) None of these is named as VOC's NCX rate or CX Health. [seat] They overlap in subject, not in definition.

### 9. Category Listings Report and flat-file templates

9.1 **The Category Listings Report is a seller-side bulk route (description).**
- Amazon: "You can download the Category Listings report, which will be pre-populated with any product information that you've provided", with Item highlights "next to the Item name in the report".
- "Listings are typically updated within eight hours."

[official] (Answers to your product title update questions, News_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/302aaac6-6f2b-4d86-bcd2-36fe24f0e6cd, read 2026-10-14)

Kai_Amazon's steps:
- "Download your Category Listings Report from Inventory Reports".
- "Update titles in Column B and I (they must match) and add Item Highlights in Column J".
- "Upload the file to apply changes".

[official] (How can sellers download a pre-populated template for bulk title and Item Highlights updates?, https://sellercentral.amazon.com/seller-forums/discussions/t/cbcfa2a1-ecb3-4440-80a2-1f6ff93e907c, read 2026-10-14) The file format is not stated on either page.

**Latency figures disagree across Amazon's pages (figures for human readers).** This file quotes "within eight hours" for the Category Listings route (9.1) and Cooper_Amazon's "up to 24 hours" for detail-page updates (3.3). The title help page says "After you submit changes to your title or item highlights, allow 24 to 48 hours for updates to be processed and displayed on Amazon stores" [official] (Product title requirements and guidelines, GYTR6SYGFA5E3EQC v21, saved copy), and other files carry further figures for other paths and stages (`method/listing-writes.md`, `method/effect-measurement.md` section K, `method/funnel-and-search.md`). Each is Amazon's statement for its own path, and they are not one rule. No skill line here quotes one: cx confirms that a seller's file upload has landed by reading the listing back (`getListingsItem`), as `method/funnel-and-search.md` P-15 and `method/listing-writes.md` hold.

9.2 **No SP-API report of that name.** The Inventory Reports page lists twelve report types. "Category Listings Report" is not among them. The nearest are `GET_MERCHANT_LISTINGS_ALL_DATA` ("A detailed all listings report", tab-delimited) and the inactive and open listing reports. That page also says a repeated request "within the cache period (between one and six hours depending on the number of entries)" may return headers in a different locale. [official] (Inventory Reports)

9.3 **Flat files left the API, not Seller Central (RULE).**
- The Feeds API dropped the flat-file and XML listing feeds (`POST_FLAT_FILE_LISTINGS_DATA` and others), first set for "March 31, 2025". "This deprecation does not impact any listings feeds submitted by sellers directly through Seller Central." [official] (Deprecation of Feeds API support for XML and Flat File Listings Feeds, https://developer-docs.amazon/sp-api/changelog/deprecation-of-feeds-api-support-for-xml-and-flat-file-listings-feeds, read 2026-10-14)
- The mapping page gives the date as "Starting July 31, 2025". Names differ: "Variation theme format changes from CamelCase in flat files (SizeName) to Underscore format in the JSON schema", and "enum values and attribute names" can "differ between flat file and JSON_LISTINGS_FEED". [official] (Mapping product attributes to the Listings Items API and JSON-based feeds, https://developer-docs.amazon/sp-api/docs/mapping-product-attributes.md, read 2026-10-14)

So a seller's flat file or Category Listings Report uses Seller Central column names, which cx must map to the product-type schema's attribute names.

### 10. The Data Kiosk check (gap's "where to look")

The models repository holds four Data Kiosk schemas: `analytics_economics_2024_03_15`, `analytics_salesAndTraffic_2024_04_24`, `analytics_sellerAnalytics_2025_03_31` and `analytics_vendorAnalytics_2024_09_30` (GitHub contents API listing, read 2026-10-14). The three seller schemas were searched for experiment, A+, opportunity/niche, voice/NCX, listing quality and change-history fields. None was found, except the overlaps named in 7.3 and 8.3. [official, by absence] (schemas at https://github.com/amzn/selling-partner-api-models/tree/main/schemas/data-kiosk)

## What practitioners add

- **MYE edit freeze, stated more strongly than Amazon does.** Seller Labs: "Do not edit the ASIN's title, images, bullets, or description outside of the experiment while it is running". Its stated reason is that a mid-test edit adds a third variable. For a critical compliance fix it says "it's better to pause the experiment than to let contaminated data run its full course", and "Only apply a winner when Amazon reports at least 95% confidence".
  - Disagreement with Amazon. Amazon offers cancel, not pause, for a running experiment. Its auto-publish threshold is 66%, not 95%.

  [opinion] (Manage Your Experiments: A/B Testing Listings the Right Way, Seller Labs, last updated 2026-08-01, https://www.sellerlabs.com/knowledge-base/manage-your-experiments-a-b-testing-listings-the-right-way/, read 2026-10-14)
- **MYE: hold the rest constant.** "Ensure that all test elements (aside from the one you're experimenting with) remain the same for a fair comparison." On eligibility it says "You must be a brand-registered seller on the Amazon US marketplace". Amazon's pages read today say nothing about US-only. [opinion] (Boost Buyability with Amazon's Manage Your Experiments Tool, Jake Merrill (Launchbox Creative) on eComEngine, 2024-10-17, https://www.ecomengine.com/blog/amazon-manage-your-experiments, read 2026-10-14)
- **Listing quality menu, older than Amazon's current page.** eComEngine: "navigate to Inventory > Improve Listing Quality". It describes a per-attribute sales-lift estimate "based on how much adding the missing attribute impacted sales for sellers similar to you", and "Changes typically take 1.5 hours to be reflected on Amazon".
  - Disagreement with Amazon. Amazon's current Listing quality page sends sellers to the Enhance tab on Manage Products instead.

  [opinion] (How to Use the Amazon Listing Quality Dashboard, Ellen Sipp-Paris, eComEngine, updated 2025-02-21, https://www.ecomengine.com/blog/amazon-listing-quality-dashboard, read 2026-10-14)
- **VOC has no export.** Seller Labs: "No. Amazon does not provide a native export option". It says VOC replaced the Customer Reviews dashboard, retired "On September 30, 2025". [opinion] (Amazon Voice of the Customer (VoC): Replacing the Customer Reviews Dashboard in 2026, Nhan Dinh, Seller Labs, 2025-09-26, updated April 2026, https://www.sellerlabs.com/blog/amazon-voice-of-the-customer-transition-2026/, read 2026-10-14)
- **POE windows.** eComEngine lists "Search volume over the past 360 days", growth over "the past 90 days as compared to the previous 90 days", and "The data is shown for today, 90 days ago, and 360 days ago". It gives the path "Growth > Product Opportunity Explorer". [opinion] (Understand Demand with Amazon Product Opportunity Explorer, Becky Trowbridge, eComEngine, updated 2024-06-11, https://ecomengine.com/blog/amazon-product-opportunity-explorer, read 2026-10-14)
- **Business Reports: child view first.** Seller Labs: "Always use the 'By Child Item' view if you sell products with variations", and "Export your report to CSV weekly". [opinion] (Business Reports Explained: What the Numbers Actually Mean, Seller Labs, updated 2026-07-29, https://www.sellerlabs.com/knowledge-base/business-reports-explained-what-the-numbers-actually-mean/, read 2026-10-14)
- **Business Reports time zone and settling.** Daniks.AI: "Business Reports use the marketplace's local time zone", "data settling within about 48 hours", "read strategy at parent level and diagnose at child level", and "Download the CSV. Do it every week".
  - Disagreement with Amazon on the week. Amazon's glossary defines the week as "Seven days, from Sunday 00:00:00 to the following Saturday 23:59:59 PT" (Business reports glossary, G27691 v7, saved copy; also `help-page-access.md` C7). Amazon's FAQ gives "previous day" data with a 24-hour lag, not a 48-hour settle.

  [opinion] (Amazon Business Reports: Read Them Right (2026 Guide), Daniks.AI, 2026-09-23, https://daniks.ai/blog/amazon-business-reports-guide, read 2026-10-14)

No practitioner page read today describes a method for handing Seller Central screens to an assistant (format, freshness stamp, trust). That method is the seat's (see the seat's own list).

## Published research

- [research] Kohavi, Deng, Frasca, Longbotham, Walker, Xu, "Trustworthy Online Controlled Experiments: Five Puzzling Outcomes Explained", KDD 2012. Narrow findings:
  - "early results are often misleading". A significant effect more often grows in the same direction over time than reverses.
  - Re-using users from an earlier experiment produces "carryover effects, where the same users who were impacted by the first experiment are being used for the follow-on experiment". What surprised the authors was "the duration of the carryover effect".
  - Transfer: MYE's "Don't check your results too frequently" says the same as the first finding. The second bears on back-to-back MYE experiments on one ASIN, since MYE assigns customers "persistently". Whether MYE re-randomises between experiments is not stated by Amazon. (PDF at https://exp-platform.com/Documents/puzzlingOutcomesInControlledExperiments.pdf, read 2026-10-14 via text extraction)
- [research] Bajari, Burdick, Imbens, Masoero, McQueen, Richardson, Rosen, "Experimental design in marketplaces", Statistical Science, 2023 (Amazon Science). The abstract states: "A key assumption underlying a standard RCT is the absence of interactions between units", and interference "can invalidate the standard estimators".
  - Transfer: MYE randomises customers within one brand's listing. It cannot see cross-listing effects such as shoppers moving to a competitor. An MYE result is therefore an estimate for the seller's own ASIN under the market of that period, not a market-level effect. (https://www.amazon.science/publications/experimental-design-in-marketplaces, read 2026-10-14)

No published research on the trustworthiness of copied or pasted operational figures in marketplace contexts was found in this pass. The search budget was exhausted, so no new search was run.

## Stable enough for a skill

- MYE results live only in Seller Central. Amazon updates them on the cadence the Experiment results page states (read from that page, not fixed in the skill), aggregates them over all enrolled ASINs, and reports a Bayesian probability and credible interval, not a classical p-value. (Experiment results)
- Once an MYE experiment is in progress its content cannot be revised. Changing it means cancelling and creating a new experiment. (Create a listing experiment)
- An MYE projected one-year impact ignores seasonality and price changes, by Amazon's own statement. (Experiment results)
- Amazon's proposed AI changes for brand owners wait in Review Listings Changes for a stated window and apply themselves if not answered. The proposals leave Seller Central as an Excel template. Images and browse nodes are outside that view. (Review Listing Changes Tool guide; Updates to improve your product titles begin on July 27) The window's length is Amazon's figure and lives on those pages.
- An applied change to title, description, bullets or images on a brand's ASIN raises `BRANDED_ITEM_CONTENT_CHANGE`. (Notification Type Values)
- Suppression is readable by API: Listings Items `issues[].enforcements.actions` (`SEARCH_SUPPRESSED`, `LISTING_SUPPRESSED`) and the Suppressed Listings Report. Amazon's quality suggestions in the Enhance tab are not readable by API. (listingsItems_2021-08-01.json; Inventory Reports; Listing quality)
- Seller Assistant is an AI tool whose answers Amazon itself says to verify. It is the only channel Amazon names for review-sharing eligibility. (Seller Assistant help page; Check review sharing eligibility with Seller Assistant)
- POE's review and return insights are available by API through Customer Feedback, in the language, stores and refresh cadence that the Customer Feedback API page states (read there at run time). POE's niche demand metrics are not. (Customer Feedback API; Get product ideas with Product Opportunity Explorer)
- Business Reports' Detail Page Sales and Traffic has an API equivalent by parent, child or SKU: `GET_SALES_AND_TRAFFIC_REPORT` and the Data Kiosk sales-and-traffic dataset. In Seller Central, page views in the plain Detail Page view are summed only over days with sales. (Analytics Reports; Business reports glossary)
- A metric name does not carry its definition across sources. Featured Offer % is over page views in Business Reports and in the sales-and-traffic `buyBoxPercentage`, and over glance views in Data Kiosk seller analytics `traffic.featureOfferPct`. Data Kiosk `traffic.conversionRatePct` is search-originated purchases over clicks, not units over sessions; the `conversationRatePct` spelling is deprecated and not used. Each field's definition is read from its own schema at run time. (Business reports glossary; Becoming the Featured Offer; analytics_sellerAnalytics_2025_03_31.graphql; analytics_salesAndTraffic_2024_04_24.graphql)
- VOC complaints such as "Inaccurate website description" are listing-content evidence. VOC has no API, and Amazon says actions can take "several weeks" to show in its metrics. (Becoming the Featured Offer; Voice of the Customer: A Seller's Guide)
- The Category Listings Report and inventory-file uploads are the seller's own Seller Central routes and remain after the Feeds API dropped flat files. Their column names differ from the JSON schema's attribute names. (Deprecation of Feeds API support…; Mapping product attributes…; Answers to your product title update questions)

## What cx must read at run time

| Tool | Live API read that stands in (fully or partly) | What still needs the seller |
|---|---|---|
| MYE | none | Results ("View Details"), eligibility list, experiment state and dates |
| Review Listings Changes | `BRANDED_ITEM_CONTENT_CHANGE` notification (after the fact); `getCatalogItem` `attributes`/`summaries` read again and compared with the seller's own `getListingsItem` attributes | The pending proposals (Excel template); View Change History |
| Fix Your Products / suppression | `searchListingsItems` / `getListingsItem` with `includedData=issues` (severity, categories, `enforcements`); report `GET_MERCHANTS_LISTINGS_FYP_REPORT` via `createReport` → `getReport` → `getReportDocument` (door.md's options and waits) | None for suppression |
| Improve Listing Quality / Enhance | none | The Enhance tab's suggestions and any sales-lift estimate |
| Seller Assistant | none | The question asked and the answer, verbatim, with its source links |
| A+ analytics | none (A+ Content API `searchContentDocuments`/`searchContentPublishRecords` give status, not performance) | Any A+ performance view; MYE A+ results |
| POE | Customer Feedback API (`getItemReviewTopics`, `getBrowseNodeReturnTopics`, trends) for review/return topics | Niche search volume, click share, niche product counts and growth |
| Business Reports by Parent/Child | `GET_SALES_AND_TRAFFIC_REPORT` with `asinGranularity` (door.md's options and waits); Data Kiosk `createQuery` on `analytics_salesAndTraffic_2024_04_24` (`CHILD`/`PARENT`/`SKU`), then `getQuery`, `getDocument` | Only when the API is not authorised for the seller's role (the report's role is the one the Analytics Reports page names; for Data Kiosk, where files disagree on the role, it is known from the authorization result of the first `createQuery`; 7.4) |
| VOC | Partial neighbours only: Data Kiosk `analytics_sellerAnalytics_2025_03_31` `defects.topics`, `returns`, `accountHealth…InaccurateProduct…` (access per the schema's PAAM rights; 7.4) | NCX rate, CX Health, complaint list per ASIN |
| Category Listings Report | `getListingsItem` / `searchListingsItems` `attributes` for the seller's own SKUs; `GET_MERCHANT_LISTINGS_ALL_DATA` (door.md's) | The file itself when the seller works in it, and its processing report |
| Field names in a seller file | `getDefinitionsProductType` (the schema the write is validated against) | None |

## Pages read

| Page name | URL | Date read | What it gave |
|---|---|---|---|
| Seller Assistant - Seller Central's agentic assistant (GLYJTRGQCYNYAZS9 v12 r0) | https://sellercentral.amazon.com/help/hub/reference/external/GLYJTRGQCYNYAZS9 | 2026-10-14 | Read live once via the content call; AI caveats, admin permission, agentic actions; saved as capture `GLYJTRGQCYNYAZS9-v12` |
| Use Seller Assistant for support resolution (GCTMXALNDLGAR637); Seller Assistant Workflows (GQE54PXE5WDF2XWC) | https://sellercentral.amazon.com/help/hub/reference/external/GCTMXALNDLGAR637 ; …/GQE54PXE5WDF2XWC | 2026-10-14 | not read: the content call was refused by this session's permission layer ("Third-Party Attack" classifier), and no capture exists under the office's capture folder (outside this repository) |
| Manage Your Experiments (GVP453K5XRBJS7Y9 v7) | https://sellercentral.amazon.com/help/hub/reference/external/GVP453K5XRBJS7Y9 | 2026-10-14 | Saved copy: split, eligibility, one experiment per ASIN, no ranking effect |
| Create a listing experiment (GYZYA77YZTWTF7YZ v13 r3) | https://sellercentral.amazon.com/help/hub/reference/external/GYZYA77YZTWTF7YZ | 2026-10-14 | Saved copy: edit states, lock, cancel-to-change, 66%, durations |
| Experiment results (GY6DCFA53HYDH79H v4) | https://sellercentral.amazon.com/help/hub/reference/external/GY6DCFA53HYDH79H | 2026-10-14 | Saved copy: weekly, Bayesian, metrics shown, projection caveats |
| Tips for experiments (G2BNMJ8NFCGZQVFH v5) | https://sellercentral.amazon.com/help/hub/reference/external/G2BNMJ8NFCGZQVFH | 2026-10-14 | Saved copy: do not peek |
| Test listing content with Manage Your Experiments \| Sell on Amazon | https://sell.amazon.com/tools/manage-your-experiments | 2026-10-14 | Eligibility, "up to 20%", View Details, no export, no edit rule |
| Amazon Brand Registry \| Sell on Amazon | https://sell.amazon.com/brand-registry | 2026-10-14 | "up to 25%" (MYE), A+ 8%/20% |
| Optimize product content and increase sales with A/B testing (Avi Ravi, 2024-03-12) | https://sell.amazon.com/blog/manage-your-experiments | 2026-10-14 | Weekly results; nothing on edits or export |
| Manage Your Experiments: KEY BENEFITS & UPDATES (Sandy_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/d5e56fe5-fa97-459d-9021-e23e820c10e7 | 2026-10-14 | Nothing on edits or export |
| Create title and image experiments on the Manage inventory page (News_Amazon) | https://sellercentral-europe.amazon.com/seller-forums/discussions/t/82a2133685b74c35fdbacb380058ad35 | 2026-10-14 | Experiments created from the edit page; nothing on edits during a test |
| 🚨 Review Listing Changes Tool: Your Guide to Managing AI Product Updates 🚨 (Michelle_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/e1c8d51d-c27b-4d8a-bea1-26413e283699 | 2026-10-14 | 14 days, auto-apply, Excel template, upload, scope, April 20 change, menu |
| Updates to improve your product titles begin on July 27 (News_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/145b6d0f-999c-4555-896c-c694bda2e470 | 2026-10-14 | 14 days in RLC; gradual AI titles after July 27 |
| 💡 Engage With Amazon: Get your Product Title Update Questions Answered! (Dougal_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/ac660707-60c7-43e3-a3fd-420d7321cc4e | 2026-10-14 | View Change History; Enhance Listings; seller flat-file question unanswered |
| Answers to your product title update questions (News_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/302aaac6-6f2b-4d86-bcd2-36fe24f0e6cd | 2026-10-14 | Category Listings report pre-populated; "within eight hours"; List Your Products upload |
| How can sellers download a pre-populated template for bulk title and Item Highlights updates? (Kai_Amazon reply) | https://sellercentral.amazon.com/seller-forums/discussions/t/cbcfa2a1-ecb3-4440-80a2-1f6ff93e907c | 2026-10-14 | Columns B, I, J; Inventory Reports; upload |
| Listing quality (G200786710 v5 r1) | https://sellercentral.amazon.com/help/hub/reference/external/G200786710 | 2026-10-14 | Saved copy: seven components; Enhance tab |
| Suppressed listings (G200898440 v13) | https://sellercentral.amazon.com/help/hub/reference/external/G200898440 | 2026-10-14 | Saved copy: Activate listings path |
| My ASIN is unsearchable (GHGHDMU4X5K9QGCV v6) | https://sellercentral.amazon.com/help/hub/reference/external/GHGHDMU4X5K9QGCV | 2026-10-14 | Saved copy: Fix Your Products check |
| Listing Lounge: Surviving Search Suppression (Cooper_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/765f5738-4dee-4c42-9c8e-4991cf58ab9b | 2026-10-14 | Fix your products page; download pointer; up to 24 hours |
| How to fix (and avoid) Amazon listing errors (Mickey Toogood, 2025-02-19) | https://sell.amazon.com/blog/amazon-listing-errors | 2026-10-14 | Fix Your Products for attribute errors; Accept Amazon's Value |
| Check review sharing eligibility with Seller Assistant (News_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/bf2eb6d6-f6a9-4880-a8f9-9e1fc9d64615 | 2026-10-14 | Ask Seller Assistant; theme attribute; BSR unaffected; no other route |
| Guidelines for reviews shared across product variations (G74DLBUEHT5GY88C v3) | https://sellercentral.amazon.com/help/hub/reference/external/G74DLBUEHT5GY88C | 2026-10-14 | Saved copy: Seller Assistant sentence |
| Amazon gives sellers an even smarter Seller Assistant and a new plugin for Amazon Quick and Anthropic's Claude (Mary Beth Westmoreland) | https://www.aboutamazon.com/news/innovation-at-amazon/seller-assistant-plugin-amazon-quick-claude | 2026-10-14 | Selling Partner plugin, Quick and Claude beta, US, approval on actions; no date printed |
| New AI tools to sell smarter, free for a year- announced at Accelerate 2026 (News_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/f1daefcb-8fe8-4526-9c06-fb34169c9804 | 2026-10-14 | Plugin "(both in beta)"; shown "3 weeks ago" |
| A+ Content \| Sell on Amazon | https://sell.amazon.com/tools/a-content | 2026-10-14 | No analytics described; 8%/20% claims |
| sell.amazon.com/a-plus | https://sell.amazon.com/a-plus | 2026-10-14 | unreachable: HTTP 404 |
| aplusContent_2020-11-01.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/aplus-content-api-model/aplusContent_2020-11-01.json | 2026-10-14 | 13 operations; no performance data |
| Product Opportunity Explorer \| Sell on Amazon | https://sell.amazon.com/tools/product-opportunity-explorer | 2026-10-14 | Niches; "only a guide" |
| Get product ideas with Product Opportunity Explorer (Lola Okusami, 2023-04-10) | https://sell.amazon.com/blog/product-opportunity-explorer | 2026-10-14 | Weekly niche refresh, monthly new niches |
| Customer Feedback API | https://developer-docs.amazon/sp-api/docs/customer-feedback-api | 2026-10-14 | Same information as OX; weekly; English; seven stores; roles; operations |
| Product Opportunity Explorer via SPAPI (discussion #3373) | https://github.com/amzn/selling-partner-api-models/discussions/3373 | 2026-10-14 | Amazon points to Customer Feedback; feature request 2025-07-22 |
| Business reports (G200633570 v8) | https://sellercentral.amazon.com/help/hub/reference/external/G200633570 | 2026-10-14 | Saved copy: two years; 24-hour lag |
| Business Reports FAQ (G28761 v7) | https://sellercentral.amazon.com/help/hub/reference/external/G28761 | 2026-10-14 | Saved copy: CSV download; cadence; week |
| Business reports glossary (G27691 v7 r1) | https://sellercentral.amazon.com/help/hub/reference/external/G27691 | 2026-10-14 | Saved copy: page-view summing trap; FO% over page views; Sunday-to-Saturday PT week |
| Product title requirements and guidelines (GYTR6SYGFA5E3EQC v21 r2) | https://sellercentral.amazon.com/help/hub/reference/external/GYTR6SYGFA5E3EQC | 2026-10-14 | Saved copy: non-compliant titles "automatically corrected" or not in search; Review listing changes; 24 to 48 hours |
| Amazon search glossary (GF6B8ZPNY2AP72VV v2 r0) | https://sellercentral.amazon.com/help/hub/reference/external/GF6B8ZPNY2AP72VV | 2026-10-14 | Saved copy: "Listing Quality Dashboard" still named |
| Featured Offer eligibility (G200418100 v23 r0) | https://sellercentral.amazon.com/help/hub/reference/external/G200418100 | 2026-10-14 | Saved copy: page removed; seller eligibility requirement dropped "As of September 2026" |
| analytics_salesAndTraffic_2024_04_24.graphql; analytics_sellerAnalytics_2025_03_31.graphql (re-download) | https://github.com/amzn/selling-partner-api-models/tree/main/schemas/data-kiosk | 2026-10-14 | `buyBoxPercentage` over page views; `traffic.featureOfferPct` over glance views; `traffic.conversionRatePct`; `@deprecated` on `conversationRatePct`; `@paamRights` |
| Get actionable B2B insights with Amazon business reports (Mickey Toogood, 2025-08-05) | https://sell.amazon.com/blog/amazon-business-reports | 2026-10-14 | Parent vs child view purposes; CSV; two years |
| Analytics Reports | https://developer-docs.amazon/sp-api/docs/report-type-values-analytics | 2026-10-14 | `GET_SALES_AND_TRAFFIC_REPORT` options, two-year limit, Brand Analytics role; no MYE/A+/POE/VOC report |
| Inventory Reports | https://developer-docs.amazon/sp-api/docs/report-type-values-inventory | 2026-10-14 | `GET_MERCHANTS_LISTINGS_FYP_REPORT`; no Category Listings Report; cache note |
| Notification Type Values | https://developer-docs.amazon/sp-api/docs/notification-type-values | 2026-10-14 | `BRANDED_ITEM_CONTENT_CHANGE`; `DETAIL_PAGE_TRAFFIC_EVENT` (first 100,000 characters read) |
| listingsItems_2021-08-01.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-items-api-model/listingsItems_2021-08-01.json | 2026-10-14 | Issue model, enforcement actions, `searchListingsItems` filters |
| Data Kiosk schemas (four files) | https://github.com/amzn/selling-partner-api-models/tree/main/schemas/data-kiosk | 2026-10-14 | Absence of MYE/A+/POE/VOC; S&T granularity; metric definitions |
| SP-API docs index (llms.txt) | https://developer-docs.amazon/llms.txt | 2026-10-14 | No experiment, VOC, POE, Seller Assistant or Category Listings page |
| Deprecation of Feeds API support for XML and Flat File Listings Feeds | https://developer-docs.amazon/sp-api/changelog/deprecation-of-feeds-api-support-for-xml-and-flat-file-listings-feeds | 2026-10-14 | Feed types removed; Seller Central unaffected; March 31, 2025 |
| Mapping product attributes to the Listings Items API and JSON-based feeds | https://developer-docs.amazon/sp-api/docs/mapping-product-attributes.md | 2026-10-14 | July 31, 2025; flat-file vs JSON naming |
| Frequently returned item badge (GTRP6DXEA983DPD6 v6) | https://sellercentral.amazon.com/help/hub/reference/external/GTRP6DXEA983DPD6 | 2026-10-14 | Saved copy: VOC 3/12-month return rates, at-risk ASINs |
| Becoming the Featured Offer (G201687550 v20) | https://sellercentral.amazon.com/help/hub/reference/external/G201687550 | 2026-10-14 | Saved copy: VOC complaint list |
| Voice of the Customer: A Seller's Guide (Xander_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/ec4b0f7a-8a96-49f6-ad94-660aa0f84012 | 2026-10-14 | NCX definitions, tiers, "several weeks" |
| New Return Rate and Star Rating Features on the Voice of the Customer Dashboard (Danny_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/d2cf4612-ecbf-438a-b3b9-636486eb8074 | 2026-10-14 | 12-month return rate; star rating as displayed |
| Voice of the Customer help page (GRTPNYUAU5EQ9RGU); Review listing changes (G7T47V48CGE6FS32); Download Category Listings report (GFYSJC946YKTD68L); Bulk listing templates (G1641); Enhance Listings (G88AQCL62ED7WDGA); POE help (GNJ4YRTXWLMBY38U, G7G4RNVTPQ9CWV39) | https://sellercentral.amazon.com/help/hub/reference/external/<id> | 2026-10-14 | not read: no capture exists under the office's capture folder (outside this repository) (checked 2026-10-14), and this seat's content calls were refused by the permission layer; other files cite some of these from their own reads, not re-opened here |
| Manage Your Experiments: A/B Testing Listings the Right Way (Seller Labs) | https://www.sellerlabs.com/knowledge-base/manage-your-experiments-a-b-testing-listings-the-right-way/ | 2026-10-14 | No outside edits; pause; 95% |
| Boost Buyability with Amazon's Manage Your Experiments Tool (Jake Merrill, eComEngine) | https://www.ecomengine.com/blog/amazon-manage-your-experiments | 2026-10-14 | Hold the rest constant; US-only claim |
| How to Use the Amazon Listing Quality Dashboard (Ellen Sipp-Paris, eComEngine) | https://www.ecomengine.com/blog/amazon-listing-quality-dashboard | 2026-10-14 | Improve Listing Quality path, lift estimate, 1.5 h |
| Amazon Voice of the Customer (VoC): Replacing the Customer Reviews Dashboard in 2026 (Nhan Dinh, Seller Labs) | https://www.sellerlabs.com/blog/amazon-voice-of-the-customer-transition-2026/ | 2026-10-14 | No native export; dashboard retired 2025-09-30 |
| Understand Demand with Amazon Product Opportunity Explorer (Becky Trowbridge, eComEngine) | https://ecomengine.com/blog/amazon-product-opportunity-explorer | 2026-10-14 | 90/360-day windows; menu path |
| Business Reports Explained: What the Numbers Actually Mean (Seller Labs) | https://www.sellerlabs.com/knowledge-base/business-reports-explained-what-the-numbers-actually-mean/ | 2026-10-14 | Child view; weekly CSV |
| Amazon Business Reports: Read Them Right (2026 Guide) (Daniks.AI) | https://daniks.ai/blog/amazon-business-reports-guide | 2026-10-14 | Local time zone; 48 h settle; weekly CSV |
| Trustworthy Online Controlled Experiments: Five Puzzling Outcomes Explained (KDD 2012) | https://exp-platform.com/Documents/puzzlingOutcomesInControlledExperiments.pdf | 2026-10-14 | Early results misleading; carryover |
| Experimental design in marketplaces (Statistical Science 2023) | https://www.amazon.science/publications/experimental-design-in-marketplaces | 2026-10-14 | Interference invalidates standard estimators |
| Web search (MYE edit during experiment) | (search engine) | 2026-10-14 | One extended search; no Amazon page found; then the session's search budget was exhausted, so Seller University and A+ analytics announcements could not be searched |
| Roadmap §3 (internal, Chinese) | ceo-office/drafts/2026-10-09-roadmap-candidates.md lines 71–72 | 2026-10-14 | MYE and RLC go into the tree as files |
| Day-2 run report (internal) | office-mailbox/from-engineering/20261014-0921-beta-browser-listing-run-day-2.md | 2026-10-14 | Point 6: yesterday's figures were not kept in a file |

## Open questions

1. **Does editing the live listing during an MYE experiment cancel it, pause it, or silently change Version A?** Amazon states only that experimental content is locked in progress. *Settles it:* the Seller Central MYE dashboard on a first real brand-registered run (edit nothing; read the experiment-details screen), or a Seller Forums staff answer.
2. **Can MYE results be downloaded?** No page mentions it. *Settles it:* the seller's View Details screen on the first real run. If there is no download, a full-page screenshot plus typed figures is the handoff.
3. **A+ Content analytics: does a performance view exist in A+ Content Manager today, and what does it measure?** No Amazon page found. The search budget ran out before an announcement could be looked for. *Settles it:* a signed-in look at A+ Content Manager, or a News_Amazon announcement.
4. **VOC, RLC, Category Listings Report, Enhance and POE help pages.** These were not readable by this seat (permission layer). *Settles it:* the content call in a session whose permission layer allows it, saving copies under the office's capture folder (outside this repository); or a signed-in browser seat.
5. **Business Reports "by Parent Item": does the page-view summing rule apply to it?** The glossary names only "Detail Page Sales and Traffic" and "by Child Item". Also: does the API's `GET_SALES_AND_TRAFFIC_REPORT` with `PARENT` sum like either Seller Central view? *Settles it:* one seller's same-range CSV (by Parent, by Child) set beside the API report with `PARENT` and `CHILD`.
6. **The Selling Partner plugin (Quick, Claude beta).** Which Seller Central tools does it reach (MYE, VOC, RLC, Seller Assistant answers)? Could a seller's own Claude connection ever stand in for a paste? *Settles it:* Amazon's plugin documentation, and Jack's ruling on whether such a route is in scope; it is outside cx's box today.
7. **Category Listings Report file format and generation time.** title.md cites a help page (GFYSJC946YKTD68L) for "up to three days to generate"; this seat could not open it. *Settles it:* reading the page, and the first seller who downloads one.
8. **Does the RLC Excel template carry the before-value, or only the proposal?** *Settles it:* the first template a brand owner puts in the tree.
9. **`DETAIL_PAGE_TRAFFIC_EVENT`**: Amazon describes "hourly grain traffic metrics by ASIN" for sellers and vendors. Would it give cx a near-live traffic check after a change? *Settles it:* the payload schema on the rest of the Notification Type Values page (only the first 100,000 characters were read), and a subscription on a real account.
10. **door.md on origin/main names no report types today** (read 2026-10-14). The task says report names live there. Until the SP-API batch lands, the report names in this file are from the developer docs pages cited, not from door.md.

## Positions

1. **P-seller-central-only-tools-1.** cx treats MYE results, the RLC proposal queue, View Change History, the Enhance tab's suggestions, Seller Assistant answers, VOC, POE niche metrics and any A+ performance view as Seller Central-only. It gets them as files the seller puts in the tree, and never claims to have read them itself. *Sources:* SP-API docs index; Analytics Reports; Inventory Reports; Data Kiosk schemas; aplusContent_2020-11-01.json; Customer Feedback API.
2. **P-seller-central-only-tools-2.** Where an API covers the same facts, cx reads the API and does not ask for a paste. This covers:
   - suppression (Listings Items `issues` and enforcements, `GET_MERCHANTS_LISTINGS_FYP_REPORT`);
   - Detail Page Sales and Traffic by parent or child (`GET_SALES_AND_TRAFFIC_REPORT` `asinGranularity`, Data Kiosk sales and traffic);
   - POE's review and return topics (Customer Feedback API);
   - the seller's own listing content (`getListingsItem`).

   *Sources:* listingsItems_2021-08-01.json; Inventory Reports; Analytics Reports; analytics_salesAndTraffic_2024_04_24.graphql; Customer Feedback API.
3. **P-seller-central-only-tools-3.** Every seller handoff is stored with the tool's name, the marketplace, the date range or as-of time shown on the screen, and when the seller captured it. cx judges its freshness against the cadence Amazon's own page for that tool states, read from that page rather than fixed in the skill: Experiment results for MYE, Business Reports FAQ for Business Reports, Get product ideas with Product Opportunity Explorer for POE niches, and Voice of the Customer: A Seller's Guide for VOC. (What those pages said on 2026-10-14 is recorded in sections 1.4, 7.1, 6.2 and 8.2, for human readers.)

   *Sources:* Experiment results; Business Reports FAQ; Get product ideas with Product Opportunity Explorer; Voice of the Customer: A Seller's Guide.
4. **P-seller-central-only-tools-4.** cx prefers an Amazon-generated file kept as downloaded to a screenshot, and a screenshot to figures the seller typed. Amazon itself hands some of these tools out as files: the RLC Excel template, the Business Reports CSV, the Category Listings Report and the suppressed listings report. *Sources:* Review Listing Changes Tool guide; Business Reports FAQ; Answers to your product title update questions; Inventory Reports.
5. **P-seller-central-only-tools-5.** cx keeps a Seller Assistant answer verbatim with the question asked and the date, and labels it an AI answer that Amazon says to verify. It does not treat it as a Seller Central figure. For review-sharing eligibility, it checks the answer against the theme rule and the guideline page's share and no-share lists. *Sources:* Seller Assistant help page; Check review sharing eligibility with Seller Assistant; Guidelines for reviews shared across product variations.
6. **P-seller-central-only-tools-6.** cx does not edit a listing element that a running MYE experiment covers, and it records the experiment's dates in the change log. It treats any change on that ASIN during the experiment as a confounder of the result. Amazon locks experimental content once an experiment is in progress and allows only one experiment per ASIN. *Sources:* Create a listing experiment; Manage Your Experiments.
7. **P-seller-central-only-tools-7.** cx reports an MYE result in Amazon's own terms: the probability that one version is better, the credible interval, units and sample size. It says the one-year projection ignores seasonality and price. It does not restate an MYE result as a market-wide effect. *Sources:* Experiment results; Experimental design in marketplaces.
8. **P-seller-central-only-tools-8.** For a brand owner, cx asks for the pending RLC template whenever it plans a change to a field Amazon may be rewriting, because unanswered proposals apply themselves after Amazon's window. It reads `BRANDED_ITEM_CONTENT_CHANGE` and the Catalog attributes to detect a change Amazon already applied. *Sources:* Review Listing Changes Tool guide; Updates to improve your product titles begin on July 27; Notification Type Values.
9. **P-seller-central-only-tools-9.** cx never compares a pasted Seller Central metric with an API metric of the same name until it has checked both definitions:
   - Featured Offer %: page views (Business Reports, sales-and-traffic `buyBoxPercentage`) versus glance views (seller analytics `traffic.featureOfferPct`);
   - conversion: units over sessions (`unitSessionPercentage`) versus search purchases over clicks (`traffic.conversionRatePct`; the deprecated `conversationRatePct` is not used);
   - page views: summed over sales days only in the plain Detail Page view.

   Definitions are read from the source's own help page or schema at run time. *Sources:* Business reports glossary; Becoming the Featured Offer; analytics_sellerAnalytics_2025_03_31.graphql; analytics_salesAndTraffic_2024_04_24.graphql.
10. **P-seller-central-only-tools-10.** cx reads a VOC complaint such as "Inaccurate website description" as a listing-review trigger. When judging a fix, it expects the VOC metric to move over weeks, not days. *Sources:* Becoming the Featured Offer; Voice of the Customer: A Seller's Guide; Frequently returned item badge.
11. **P-seller-central-only-tools-11.** When a seller works in the Category Listings Report or an inventory file, cx maps its column names to the product-type schema's attribute names before comparing or writing. The two use different names and formats. *Sources:* Mapping product attributes to the Listings Items API and JSON-based feeds; Deprecation of Feeds API support for XML and Flat File Listings Feeds.

**The seat's own (not for a skill)**

- [seat] A proposed tree shape: `seller-central/<tool>/<YYYY-MM-DD>-<slug>.<ext>`, with a short sidecar `<same>.meta.md`. The sidecar records:
  - tool and view (for example "Business Reports › Detail Page Sales and Traffic by Child Item");
  - marketplace;
  - date range shown;
  - captured-at time;
  - form: `amazon-file` / `screenshot` / `typed` / `assistant-answer`;
  - the seller's words if typed.

  The file name's date is the capture date, not the data's.
- [seat] Trust tiers for effect-review: `amazon-file` ≈ an API read of the same moment. `screenshot` is good for what is visible. `typed` needs one figure checked against an API equivalent where one exists. `assistant-answer` is a lead, not evidence. Amazon states only the last of these (Seller Assistant's own disclaimer). The ordering is the seat's.
- [seat] A paste older than the tool's own refresh cycle is still usable as a baseline but not as a "now" reading. cx should say "as of <date>" every time it cites one. This matters most for MYE (weekly) and VOC (weeks).
- [seat] The `/listing-watch` standing instruction could name which Seller Central handoffs the seller agrees to refresh, and how often. Example: "I'll drop the MYE screenshot every Monday." The heartbeat can then ask for exactly that and nothing else.
- [seat] The day-2 run's point 6 (yesterday's market overwritten) applies equally to seller pastes. A handoff file is never overwritten. A new capture is a new file.
- [seat] Practitioners' "pause" for MYE does not match Amazon's states (scheduled, in progress, cancelled, completed). cx should not tell a seller to pause an experiment.

## Verification

Gap fill 2026-10-14: 8 gaps filled, 1 left open.

The single gap (no file says how cx obtains the output of Seller Central-only tools) was split into its nine tools.

- Manage Your Experiments: **filled**. Results, cadence, method, eligibility and the in-progress content lock are covered by sections 1.1–1.9 and P-1, P-3, P-6 and P-7. Two parts stay open:
  - what an outside edit does to a running experiment (OQ 1);
  - whether results can be exported (OQ 2).
- Review Listings Changes and View Change History: **filled**. This covers the 14-day window, auto-apply, the Excel template, scope and `BRANDED_ITEM_CONTENT_CHANGE` (sections 2.1–2.5, P-4, P-8). Open: whether the template carries before-values (OQ 8).
- Fix Your Products, Improve Listing Quality and Enhance: **filled**. The API covers suppression; the Enhance suggestions are Seller Central only (sections 3.1–3.5, P-2).
- Seller Assistant (review-sharing eligibility): **filled** (sections 4.1–4.3, P-5). Open: the plugin route (OQ 6).
- A+ Content analytics: **left open**. No Amazon page describing it was found or read. The absence of an API is confirmed (sections 5.1–5.3, OQ 3).
- Product Opportunity Explorer: **filled**. Customer Feedback covers the review and return side; niche metrics stay Seller Central only (sections 6.1–6.3).
- Business Reports by Parent and by Child: **filled**. This covers the CSV, cadence, the parent/child trap, the API equivalents and the definitions (sections 7.1–7.4, P-9). Open: the parent-view summing rule (OQ 5).
- Voice of the Customer: **filled** from staff posts and two help pages that name VOC (sections 8.1–8.3, P-10). The VOC help page itself was not readable (OQ 4).
- Category Listings Report and flat-file templates: **filled** (sections 9.1–9.3, P-11). Open: file format and generation time (OQ 7).

Adversarial re-check, same day. Every page cited for a claim was re-opened, or for saved copies and models re-searched.

- **Help-page saved copies:** 66 quoted phrases across 14 saved copies (13 from the earlier seat, plus this seat's GLYJTRGQCYNYAZS9 copy) were searched in the files after normalising quotes and whitespace. Result: 66 found, 0 missing.
- **Data Kiosk schemas:** the two schemas quoted were re-downloaded, with identical SHA-1 to the first copies. All 17 quoted strings from the schemas and the Listings Items and A+ models were found.
- **Forum, sell.amazon.com, aboutamazon.com, developer-docs, GitHub, practitioner and Amazon Science pages:** each was re-opened with WebFetch and each quoted string checked PRESENT/ABSENT. All were PRESENT except as corrected below.
- **Kohavi et al. PDF:** the three quoted strings were found in the text extracted from the PDF.

Corrections made on re-check:
1. The aboutamazon.com title is "Amazon gives sellers an even smarter Seller Assistant and a new plugin for Amazon Quick and Anthropic's Claude". The first fetch had returned a shorter title; the file now uses the full one.
2. The Danny_Amazon VOC post was relabelled from "2024-era" to the page's own "2 years ago".
3. The Seller Labs "pausing" paraphrase was replaced by the page's sentence ("it's better to pause the experiment than to let contaminated data run its full course").

Not re-checkable: GLYJTRGQCYNYAZS9 could not be re-opened live, because the content call was refused by this session's permission layer. Its quotes were re-checked against the reply this seat itself received and saved (capture `GLYJTRGQCYNYAZS9-v12`).

**Reconciled 2026-10-14.** Against the cross-file contradiction list, each point that names this file's subjects was settled at its source: the help-page captures under the office's capture folder (outside this repository) (read as the pages' text), the Data Kiosk schemas re-downloaded from the GitHub models repository, the Analytics Reports and Customer Feedback API developer pages, and the sell.amazon.com MYE and Brand Registry pages. No Amazon or Keepa API host was called; no help page was fetched through the help hub's content call.

1. MYE uplift (1.8): the 20% (MYE tool page) and 25% (Brand Registry page) figures were re-read on both pages and are now stated as a disagreement between two Amazon pages, used by no skill line.
2. AI title rewrites (2.3): added the plain reading that the News_Amazon sentence is not limited to listings a seller edited, and the title help page's own words (GYTR6SYGFA5E3EQC v21 capture): non-compliant titles "might be automatically corrected or it might not appear in our search results", and brand owners see them in Review listing changes. `angles/competitor-set.md` is the file that reads this otherwise; this file was already right and is unchanged on the point.
3. Listing-quality naming (3.1): added the Amazon search glossary capture (GF6B8ZPNY2AP72VV v2), which still names the "Listing Quality Dashboard" beside the Listing quality page's Enhance tab.
4. Featured Offer eligibility (4.1): the Seller Assistant page's "assess Featured Offer eligibility" is set beside the removed Featured Offer eligibility page (G200418100 v23 capture, "As of September 2026"); the two Amazon pages disagree, and the Featured Offer rule is read at run time from Becoming the Featured Offer.
5. Conversion and Featured Offer definitions (7.4, the *Stable* line, P-9): re-checked against the re-downloaded schemas. Added the sales-and-traffic `buyBoxPercentage` (page views) and `unitSessionPercentage` (units over sessions), the `traffic.` prefix, and the `@deprecated` text of `conversationRatePct`; Business Reports Featured Offer % pairs with `buyBoxPercentage`, not `traffic.featureOfferPct`. This file was already right; `method/effect-measurement.md` has since reconciled its own use.
6. Data Kiosk access (7.4, run-time table): the schema marks seller analytics fields with PAAM rights, not a role name; files disagree on the role, and this file now defers to the authorization result of the first `createQuery`. The Analytics Reports page's Brand Analytics role for `GET_SALES_AND_TRAFFIC_REPORT` and the Customer Feedback API's "Brand Analytics" or "Selling Partner Insights" were re-read and stand.
7. Latency (new note after 9.1): the "within eight hours", "up to 24 hours" and the title page's "24 to 48 hours" (confirmed on the GYTR6SYGFA5E3EQC v21 capture, so it is on an Amazon help page, not only in forum posts) are kept for human readers as path-specific figures; no skill line quotes one, and a landed upload is confirmed by reading it back.
8. Numbers out of skill lines: the *Stable* lines on MYE and POE and P-3 no longer state a cadence, store count or language that Amazon keeps on a page it can change; they point to the page to read at run time, and sections 1.4, 6.2, 7.1 and 8.2 keep the figures for human readers.
9. Week definition (practitioners, Daniks.AI): now cited to the Business reports glossary capture's own words, with `help-page-access.md` C7 as the secondary pointer.
10. Reachability: every help page this file cites with a capture under the office's capture folder (outside this repository) is marked read on 2026-10-14 (saved copy). The pages still marked not read (GCTMXALNDLGAR637, GQE54PXE5WDF2XWC, GRTPNYUAU5EQ9RGU, G7T47V48CGE6FS32, GFYSJC946YKTD68L, G1641, G88AQCL62ED7WDGA, GNJ4YRTXWLMBY38U, G7G4RNVTPQ9CWV39) have no capture; their rows now say so instead of "unreachable". Added Pages read rows for the three new captures (GYTR6SYGFA5E3EQC, GF6B8ZPNY2AP72VV, G200418100) and the schema re-download used here.
11. Cross-references: this file names no merged file (`inventory-and-fulfilment.md`, `elements/vendor-and-hybrid.md`); every `research/` file it names exists. `door.md` is not a `research/` file; it is named as the SP-API door on origin/main (Open question 10).
