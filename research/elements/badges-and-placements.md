# Badges and placements: what a listing wears in search results and on the detail page, and who controls it

Read 2026-10-14 by the research seat. Tags: [official] Amazon's own page or document; [opinion] a named practitioner; [research] published research; [seat] the seat's own reasoning, never a skill position.

## What this covers

**Funnel stage.** Mostly **click-through**. A badge sits on the search tile beside the title, main image, price and rating, so it changes which tile is clicked. Several badges also act at **conversion** on the detail page (the frequently-returned warning, the Small Business badge, the Prime badge and the delivery date near the buy box). Some feed **exposure** indirectly: Amazon says sales trend "can help drive an item's popularity and visibility in search rankings", and deals and coupons are surfaced on their own pages.

Amazon's own search glossary puts badges inside the search result itself: "A search result is made up of a title, description, image, price, and other features, such as badges." [official] (Amazon search glossary, GF6B8ZPNY2AP72VV v2 r0, read 2026-10-14; capture capture `GF6B8ZPNY2AP72VV-v2`)

**Skills it feeds.**
- **listing-review**: which badges the listing and its competitors wear, which of them the seller can act on (certification, delivery speed, return rate, promotion choice), and which the seller cannot buy or apply for (Amazon's Choice, Overall Pick, Best Seller, sales trend).
- **listing-change-log**: a change file records the badge state on the day of the change. A coupon, deal or Prime-exclusive discount scheduled inside the observation window is part of the record, not background.
- **effect-review**: a badge gained or lost in the baseline or observation window, by the listing or by a competitor in the set, moves click-through and conversion independently of copy. It is a named confounder, and for most badges it can only be observed partly or not at all through an API.

**Why a senior operator cares.** Three reasons.
- A content change judged in a window where the listing lost its Prime badge, gained a Lightning Deal badge or was marked "Frequently returned" says nothing about the content.
- Several badges cannot be bought or applied for; the review must not propose "get Amazon's Choice" as an action.
- The badges that can be acted on are mostly not copy: a sustainability certification, the delivery promise, the return rate, a promotion. A content playbook that ignores them misattributes effects.

## Amazon's own rules and guidance

RULE means Amazon states the condition as enforced (the badge is shown or removed by Amazon's own criteria, or a policy bars something). GUIDANCE means Amazon recommends or describes. Seller Central help pages were read on 2026-10-14 through the help hub's content call (`POST https://sellercentral.amazon.com/help/hub/mons-api/GetHelpTopic`, layer `Published/US`, locale `en-US`), the route `method/help-page-access.md` describes; the version and revision are given for each. That call is undocumented, and whether it may be used as a standing route is for the office to rule (help-page-access.md, Open question 1); cx does not depend on it at run time (P-help-page-access-7). Eight of the pages cited here have a saved capture under the office's capture folder (outside this repository) (G1881 v28, G202059240 v2, G202111490 v25, GJHCPEFJ5JJQD52D v14, GF6B8ZPNY2AP72VV v2, GHGHDMU4X5K9QGCV v6, GTRP6DXEA983DPD6 v6, G201687550 v20); their quotes below were re-checked against the capture text. The other Seller Central pages have no capture and stand on this file's own read of 2026-10-14. Amazon customer pages on www.amazon.com returned HTTP 503 to the WebFetch tool and were read with a plain `curl` (HTTP 200, no captcha).

### A. Badges in general

A1. **No Amazon badge may be put into a product image.** RULE: "No badges used on Amazon, or variations, modifications, or anything confusingly similar to such badges. This includes, but is not limited to "Amazon's Choice," "Premium Choice," "Amazon Alexa," "Works with Amazon Alexa," "Best seller," or "Top seller."" [official] (Product image guide, G1881 v28 r9, https://sellercentral.amazon.com/help/hub/reference/external/G1881, read 2026-10-14; capture capture `G1881-v28`)

A2. **Badges cannot be switched off by the seller.** "Similar to Customer Reviews, badges, and sales rank, sales trend cannot be turned off." [official] (Sales Trend FAQ, G2CRYWPU52D7TGAK v2 r1, https://sellercentral.amazon.com/help/hub/reference/external/G2CRYWPU52D7TGAK, read 2026-10-14)

A3. **The search page is under continuous experimentation.** "Shopping results can vary in look and feel. The product discovery and shopping landscape is subject to continuous experimentation." [official] (Amazon search glossary, GF6B8ZPNY2AP72VV v2) So badge names, placements and criteria are not fixed. Several pages below say so for a single badge as well.

### B. Amazon's Choice (and the "Overall Pick" label)

B1. **What it is.** GUIDANCE (Amazon's description to shoppers):
- "Amazon's Choice makes it easy to discover products that other customers frequently choose for similar shopping needs."
- "Products highlighted as Amazon's Choice are highly rated, well-priced and available to ship immediately. They are also, on average, delivered faster and returned less frequently than alternative products."

[official] (Amazon's Choice FAQs, https://www.amazon.com/b?node=21449952011, read 2026-10-14 by curl)

B2. **How it is earned and lost.** RULE in substance (Amazon decides; no seller action triggers it):
- "Amazon's Choice considers what customers tell us matters most to them, including ratings, price, popularity, product availability and fast delivery. As customer preferences and feedback change, so do the products we highlight."
- "Yes, products sold by third-party sellers can be highlighted as Amazon's Choice."
- "No, brands and selling partners cannot pay to have their products highlighted as Amazon's Choice, or apply to have their products considered for Amazon's Choice."

[official] (Amazon's Choice FAQs) The page gives no threshold, no refresh cadence, and does not say that the badge is tied to a search term.

B3. **What a brand owner can see.** Brand Analytics offers a monthly download of "Search funnel monthly query performance of your brand, with and without Amazon's Choice badge." "This is only available at the monthly reporting range." "Downloaded reports are available in the Download Manager." [official] (Download your Brand Analytics Search dashboard data, News_Amazon, https://sellercentral-europe.amazon.com/seller-forums/discussions/t/f3560b923f6e499d2ee7bc4f2ad8dd41, read 2026-10-14; page shows "4 years ago"; search-query-performance.md records the post's timestamp as 2023-03-10)
- This is a Seller Central download. The SP-API Search Query Performance and Search Catalog Performance report schemas carry no Amazon's Choice field (searched for "choice" and "badge", 2026-10-14). [official] (sellingPartnerSearchQueryPerformanceReport.json; sellingPartnerSearchCatalogPerformanceReport.json, https://github.com/amzn/selling-partner-api-models/tree/main/schemas/reports, read 2026-10-14)

B4. **"Overall Pick".** No Amazon page found in this session states what "Overall Pick" is or how it relates to Amazon's Choice. See *What practitioners add* and *Open questions*.

### C. Best Seller (#1) and New Release badges

C1. **How the Best Seller badge is earned.** RULE: "Best seller badges are achievement awards that are assigned to those ASIN's that are featured as #1 in a featured category with at least 100 products. In addition to this, there are ordering thresholds that are placed on ASINs. These are different in different marketplaces." [official] (Sales Rank FAQ, G202059240 v2 r0, https://sellercentral.amazon.com/help/hub/reference/external/G202059240, read 2026-10-14; capture capture `G202059240-v2`)

C2. **Where it is not shown.** "We do not show best seller badges on product detail pages for stores where orders of the child ASINs are assigned to the parent and a sales rank is generated for the parent ASIN." Amazon also says: "We keep revisiting and experimenting with this criteria". [official] (Sales Rank FAQ)

C3. **Cadence.** "While we update best sellers list every hour, it can take up to 12 hours for an order to show the sales rank." [official] (Sales Rank FAQ)
- The same sentence appears in a staff forum reply (Rose_Amazon, 2023-05-30) that competitor-discovery.md cites; that file now reads G202059240 v2 from its capture as well and records the forum reply as quoting the help page. A plain fetch of the page URL returns only a shell; the capture holds the article (capture `G202059240-v2`).
- The hourly list and the 12-hour order lag are figures Amazon can change; a skill cites the page, not the numbers.

C4. **What the rank is built from.** "Sales rank is calculated based on all-time sales of an ASIN/Product where recent sales are weighted more than older sales." "Sales rank is generated based on order data and product reviews are not taken into consideration." "Sales ranks are relative." [official] (Sales Rank FAQ)

C5. **Which category is shown on the page.** "We choose a few of the most popular subcategories in which the item has a high ranking in relation to other items in that subcategory, and showcase the item's rank on the product page." [official] (Amazon Best Sellers Rank, https://www.amazon.com/gp/help/customer/display.html?nodeId=GGGMZK378RQPATDJ, read 2026-10-14 by curl)

C6. **New Release badge.** "New release badges are achievements awards provided to ASINs that are #1 best sellers among the new releases in a category. The definition of new release varies from category to category. Ensure that the release date (street date), publication date (if applicable) and product site launch date for your ASINs are accurate." [official] (Sales Rank FAQ)
- So the date attributes are the one lever a listing write controls here.

### D. Sales trend ("bought in past month")

D1. **What it is.** GUIDANCE: "Sales trend helps customers differentiate products in Amazon's vast catalog by providing a broad estimate of the number of customers who recently purchased a product (for example, "10K+ bought in past month"). Sales trend data is refreshed at least daily and does not include returns and cancellations." [official] (Sales Trend FAQ, G2CRYWPU52D7TGAK v2 r1)

D2. **When it is shown.** RULE in substance: "Sales trend is shown when a minimum number of customers have purchased a particular ASIN. It is not shown for all categories." The minimum is not given. [official] (Sales Trend FAQ)

D3. **It counts customers, across all sellers.** "Sales trend provides a broad estimate of the number of customers who purchased a particular ASIN, across everyone selling that ASIN. Sales trend is not the number of units sold or orders made so it may not exactly match what you see in Seller Central." [official] (Sales Trend FAQ)

D4. **Variations.** "If the product is presented as a child ASIN with a single price, sales trend indicates the number of customers who purchased that child ASIN. If the product is presented as a parent ASIN with a range of prices, sales trend indicates the sum of customers who made purchases for all child ASINs in that variation family." [official] (Sales Trend FAQ)

D5. **Effect, in Amazon's words.** "Sales trend helps customers make more confident purchases, which can help drive an item's popularity and visibility in search rankings." To raise it: "improving the quality, availability, and competitive pricing of your products." It "cannot be turned off." [official] (Sales Trend FAQ)

D6. **No API named by Amazon.** Asked which API carries "bought in past month", an Amazon staff reply (Cooper_Amazon) answered only: "For the question around the API, you can check with Selling Partner Support if it is not answered in the help page." [official, forum staff reply] (On which API "bought in past month" data avaliable ?, https://sellercentral-europe.amazon.com/seller-forums/discussions/t/a2a31717-05a3-43ed-a05b-c6f7a2c876c0, read 2026-10-14; page shows "2 years ago")

### E. Climate Pledge Friendly

E1. **How it is earned.** RULE: "Climate Pledge Friendly highlights products that are recognized by at least one sustainability certification." "To enroll a product in the Climate Pledge Friendly program, it must have a qualifying third-party certification." The path: choose a certification, meet the certifier's standard, then "After your product is certified, work directly with the certifier to submit product details to Climate Pledge Friendly. The certifier will then provide relevant product-level data to us." [official] (Enroll products in our Climate Pledge Friendly program, GE94565V5PDYL5MZ v11 r0, https://sellercentral.amazon.com/help/hub/reference/external/GE94565V5PDYL5MZ, read 2026-10-14)
- Textile certifications (GOTS, GRS, OCS, RCS, RWS, LWG, Oeko-Tex Standard 100, Oeko-Tex Made in Green) have their own enrolment page. [official] (same page)

E2. **How it is lost or refused.** RULE: "We exclude select products (English only) from Climate Pledge Friendly based on 1) other product sustainability criteria or 2) if the relevant sustainability claim within a category is too commonplace to help customers make a more sustainable choice." Amazon "will routinely evaluate and reassess the certification landscape". [official] (same page)
- So a certification Amazon drops, or a category exclusion, removes the badge with no change on the listing.

E3. **Where it shows.** "Products that qualify for the Climate Pledge Friendly program are identified through a leaf icon and the sustainability features label." Customers find it through "badges, filters, recommendations, and our dedicated storefront". It is available "across 14 international stores". [official] (same page)
- The launch post says qualifying products are "clearly labeled in shopping results". [official] (Amazon launches 'Climate Pledge Friendly' program, https://www.aboutamazon.com/news/sustainability/climate-pledge-friendly, read 2026-10-14; no date shown on the page)

E4. **Amazon's effect claim.** "Climate Pledge Friendly-badged products see a +12% sales lift on average and a +10% lift in glance views on average within the first year of joining the program." The footnote: "Source: 2024 commissioned study with a PhD from USC Marshall School of Business. Based on data from the US and EU5, not a guarantee of future performance." [official] (Enroll products in our Climate Pledge Friendly program, GE94565V5PDYL5MZ v11)
- This is an Amazon-commissioned average, not a published paper. It measures sales and glance views, not search click-through.
- Amazon's sustainability site adds: "Since 2020, 187 million customers switched to Climate Pledge Friendly-badged products, including 43 million in 2025" and "4.2M+ products recognized by certifications". [official] (Customers - Amazon Sustainability, https://sustainability.aboutamazon.com/customers, read 2026-10-14)

E5. **Off Amazon.** Through Buy with Prime, eligible products can show the green leaf icon on the brand's own site; the page lists four "not eligible" reasons, the first being "Product doesn't have sustainability certifications". [official] (Display Climate Pledge Friendly's green leaf icon, sustainability attributes, and certification details on eligible products, GLT32C7D7L5PT6DM v1 r1, read 2026-10-14)

### F. Small Business badge (and the Black-Owned Business badge)

F1. **Origin.** In 2022 Amazon wrote: "this Prime Day we are excited to test a new Small Business badge that identifies products from small business intellectual property owners and artisans." For the 2022 promotion: "We follow Gartner's definition of small business. Small businesses are eligible for the Small Business sweepstakes if they are registered with Brand Registry or participate in the Handmade program. The specific products eligible for the sweepstakes are from small business brands and artisans based in the US." Sellers would "find the Small and Medium Business badge on the detail page of your promotion-eligible products." [official] (Prime Day Small Business Promotions FAQ, GB5KQ2GS6DMQA7RC v8 r0, https://sellercentral.amazon.com/help/hub/reference/external/GB5KQ2GS6DMQA7RC, read 2026-10-14)
- The page is dated by its content (June 21 to July 11, 2022). It is the only Seller Central page found that states who qualifies, and it states it for the 2022 promotion, not for the badge as it runs today.

F2. **Current use.** Amazon's 2025 Prime Day shopping post tells shoppers to look for "the Small Business badge on product detail pages" to "identify products from small businesses selling in Amazon's store". It gives no criteria. [official] (How to shop small and save big on small business deals this Prime Day, https://www.aboutamazon.com/news/retail/small-business-prime-day-deals-2025, read 2026-10-14; no date shown, content refers to Prime Day 2025)
- The Black History Month post mentions "the Black-Owned Business badge and Small Business badge on product detail pages", again without criteria. [official] (Black History Month: How to shop from Black-owned businesses on Amazon, https://www.aboutamazon.com/news/small-business/how-to-support-black-owned-businesses, read 2026-10-14)

F3. **The Black-Owned Business badge, which does have a page.** RULE:
- "The Black-Owned Business badge indicates to customers when the current featured offer for a product is sold by a certified Black-owned business."
- Eligibility needs "a valid minority-owned business registration or certification (for example, from the National Minority Supplier Development Council, U.S. System for Award Management, U.S. Small Business Administration, or SupplierGATEWAY)". It is uploaded in Seller Central; Amazon replies "within 24 hours of certificate submission".
- "We're currently testing the Black-owned Business badge on a subset of eligible offers in Search results and product detail pages."
- "the badge is free"; "we do not allow the exclusion of specific products"; leaving the programme "may take up to four business days to reflect on the store"; only "products sold in the U.S. Amazon store by US-based sellers are eligible".

[official] (Black-Owned Business badge, GBYJYA8MG6FV4XYC v2 r1, https://sellercentral.amazon.com/help/hub/reference/external/GBYJYA8MG6FV4XYC, read 2026-10-14)
- [seat] This badge follows the **featured offer**, not the ASIN: on a shared ASIN it appears or disappears as the featured offer changes hands. Whether the Small Business badge works the same way is not stated anywhere read.
- Who can hold the featured offer changed in 2026: "As of September 2026, Amazon no longer maintains a seller eligibility requirement, and offers from all sellers are now eligible to be evaluated for the Featured Offer." [official] (Becoming the Featured Offer, G201687550 v20, capture) funnel-and-search.md and price-position.md carry the same change. Any badge that follows the featured offer therefore follows a selection that, since then, is evaluated over every seller's offer.

### G. Coupon, deal, Prime-exclusive and strike-through badges

G1. **Coupons.** GUIDANCE: coupons get "automatic merchandising"; "Customers can discover coupons through the following options: Coupons home page Search results Product detail pages All-Offers Display In their carts". [official] (Coupons, G3QLEV6W2QK84C57 v8 r0, read 2026-10-14)
- RULE (eligibility): "you must be a Professional seller with at least a 3.5 Seller feedback rating. Sellers who haven't received any feedback rating yet are also eligible". "Products with 1-4 reviews must have an average rating of at least 2.5 stars. Products with 5+ reviews must have an average rating of at least 3 stars." "Product discounts must be at least 5% below the Was Price or List Price". [official] (Coupon eligibility criteria, GJHCPEFJ5JJQD52D v14 r0, read 2026-10-14; capture capture `GJHCPEFJ5JJQD52D-v14`)
- The 3.5 here is the seller's *feedback* rating; the deal page's 3.5 (G2) is the seller's "overall rating". Two different measures.
- Amazon's own pages disagree on the low-review product floor. price-position.md records that Amazon's coupon errors page (Understanding coupon errors, GLBL4T5C9UAB9T5P; not opened by this file, no capture) gives a minimum of 1 star for 1–4 reviews, where the eligibility page above says 2.5. This file picks neither: the binding floor for a given ASIN is what the coupon creation flow reports at run time, as the seller relays it.

G2. **Deals (Lightning Deal, Best Deal).** RULE:
- "A Lightning Deal is a time-bound, promotional offer where a product receives special merchandising such as a Deals badge for a limited number of hours, usually 4 to 12, as determined by us." A Best Deal gets "a Deals badge for a limited number of days".
- Seller: "a Professional seller with an overall rating of at least 3.5 stars". Product: "Products must have a sales history on Amazon and at least a 4-star rating."
- The product criteria are introduced as "(subject to change based on country and time of year)".
- "Amazon Deals is an invite-only program." "Eligible ASINs are refreshed every week".

[official] (Amazon deals, G202111490 v25 r11, read 2026-10-14; capture capture `G202111490-v25`)
- The deal fees are on a different page (Understand deal fees, G202111590 v27), recorded in help-page-access.md C2 and price-position.md; this file does not restate them.
- To shoppers, the deal item is "marked with a Lightning Deal badge", with a claimed-percentage bar and a timer. [official] (Lightning Deals, https://www.amazon.com/gp/help/customer/display.html?nodeId=GW3L8JX7Q9FH8ALB, read 2026-10-14 by curl)

G3. **Prime Exclusive Deals.** Created deals get "i) distinctive Prime deal badging and ii) inclusion in Prime deals dedicated marketing campaigns". RULE: "Sellers cannot independently request Prime Exclusive eligibility for their ASINs." Eligibility shows as "Prime customers" in the deals recommendations dashboard. [official] (Prime Exclusive Deals, GFXXXKMMQE9WLVNZ v1 r2, read 2026-10-14)

G4. **Price discounts and the strike-through.** RULE: "Price discounts for products with a validated reference price appear with a strike-through price in search results and on the product detail page." "Products without a validated reference price don't display a strike-through price or savings to customers." Discounts run "between 1 to 30 consecutive days". Seller: "at least a 3.5 seller feedback rating"; product: "at least a three-star rating". [official] (Price discounts, G7F8CQ4EJ5YA4272 v8 r3, read 2026-10-14)
- To shoppers: a List Price is displayed only if the product sold at or above it "in the past 90 days for non-seasonal products ... and in the past 180 days for seasonal products"; "The Typical Price is determined using the 90-day median price paid by customers"; "Lowest Price in XX Days" is defined. [official] (Strike-Through Pricing and Savings, https://www.amazon.com/gp/help/customer/display.html?nodeId=GQ6B6RH72AX8D2TD, read 2026-10-14 by curl)

G5. **Business Savings Blue Badge (Amazon Business only).** It shows "savings percentage messages (like "Save 5%")" on "Search results pages" of the Amazon Business store. RULE: Professional account; a single-unit business price "of at least a 5% discount off standard price or ... quantity discounts of at least a 3% discount on the first tier"; "Products must have at least a 4-star rating." [official] (Business Blue Savings Badge, GZK9RLHFV3K442KH v1 r1, read 2026-10-14)

### H. Prime badge and delivery-date messaging

H1. **The Prime badge depends on the delivery promise.** RULE: "In some cases, we may remove the Prime badge when the delivery time does not meet Prime customers' expectation of fast delivery times. If you see "FREE Prime delivery" on your offer and no Prime badge, the delivery promise is still a Prime branded offer, but likely to be slow. This experience applies to offers from both Amazon and sellers." [official] (Guidelines for Seller Fulfilled Prime offers missing Prime branding, G5LDV3NBM7ECSK5F v5 r0, read 2026-10-14)
- The same page's checks: the offer must be "featured on the detail page", on a Prime shipping template, Prime offers enabled, and under the "Prime daily order handling limit". [official] (same page)
- So Prime branding is lost by reaching the daily Prime order limit, by a template change or by a slow promise, none of which is a content change.

H2. **Delivery time is computed, and faster helps.** GUIDANCE: "Total Delivery Time = Handling Time + Transit Time + any holidays and weekends + additional buffer". "Customers are more likely to buy items that have faster delivery. Items with a faster delivery date are more likely to become a Featured Offer." [official] (Manage your delivery time, G202167920 v13 r0, read 2026-10-14)
- The Featured Offer page says the same: "Offers with fast, free shipping are more likely to become featured, as are offers with higher certainty on the delivery date (for example, a narrower delivery promise range)." [official] (Becoming the Featured Offer, G201687550 v20 r0, read 2026-10-14 from its capture capture `G201687550-v20`)
- "Customers are more likely to purchase products that have a faster delivery promise." [official] (Faster Regional Transit Time, G9HDKKR234ABGH6B v1 r6, read 2026-10-14)

H3. **Seller Fulfilled Prime rules that move the badge.** RULE: same-day, one-day and two-day orders ship the same day; standard Prime handling is "1-day or same-day/0-day"; order cut-off "2:00 p.m. or later local time Monday-Friday and 10:30 a.m. or later Saturday and Sundays"; below 100 SFP packages a month Amazon "will limit your maximum daily Prime order volume". [official] (Seller Fulfilled Prime program policy, G201812300 v7 r9, read 2026-10-14)

H4. **Guaranteed delivery date message.** RULE: eligible sellers "display a guaranteed delivery date message on item detail and checkout pages for offers fulfilled with Premium Shipping options"; eligibility needs 90 days of selling, 10 orders in 30 days, valid tracking on at least 94%, on-time delivery at least 96%, cancellation under 1% on Premium Shipping orders. Sellers who fall below "will no longer be eligible". [official] (Seller Guaranteed Delivery, G201817490 v5 r0, read 2026-10-14)

H5. **Amazon measures search by delivery message.** The Search Catalog Performance report counts, per ASIN, impressions, clicks, cart adds and purchases "with the same day delivery message", "with the one-day delivery message" and "with the two-day delivery message" in search results (`sameDayShippingImpressionCount`, `oneDayShippingClickCount`, `twoDayShippingPurchaseCount` and so on). The Search Query Performance report has the same split for all ASINs on a query (`totalSameDayShippingClickCount` and so on). [official] (sellingPartnerSearchCatalogPerformanceReport.json; sellingPartnerSearchQueryPerformanceReport.json, read 2026-10-14)
- Data Kiosk's seller analytics has `sameDayMetrics`, `oneDayMetrics`, `twoDayMetrics` ("Search performance metrics for products with same-day delivery option available"), each with `shippingImpression`, `shippingClick`, `shippingCartAdd`, `shippingPurchase`. [official] (analytics_sellerAnalytics_2025_03_31.graphql, https://github.com/amzn/selling-partner-api-models/blob/main/schemas/data-kiosk/analytics_sellerAnalytics_2025_03_31.graphql, read 2026-10-14)
- Note the wording differs: the reports count the delivery *message* shown; Data Kiosk counts where the delivery *option was available*.

H6. **Configured speed is not the promise the shopper sees, and FBA stock placement moves it.**
- "An offer can be configured for one-day or two-day delivery but provide a 3, 4, or even 5+ day promise when viewed by the customer due to order cut-off times, seller weekend operations, carrier weekend operations, and holidays." A promise of one or two days "is expected have a positive impact on your traffic and sales". "Delivery speed is aggregated on the brand level." [official] (Delivery Speed (FBM), GMQG9J9KCDF4Y8FM v2 r5, read 2026-10-14)
- For FBA: "Delivering faster speed to customers drives higher conversion rates and increases customer satisfaction." The first lever is to "Maintain inventory levels between 30-60 days of supply", because "The closer products are stored to customers, the faster we can deliver them." [official] (Maximizing Delivery Speed, GA8NP4NDZZ3EJRU5 v1 r0, read 2026-10-14)
- [seat] So an FBA listing's delivery badge can change with inventory depth and placement alone. Low stock in the observation window is a delivery-speed confounder as well as an availability one.

### I. "Frequently returned item" and the low-return badge

I1. **How it is earned.** RULE: "Your ASIN is determined to be a frequently returned ASIN by comparing your ASIN's return rate with the return rates of similar ASINs. The return rate is based on the number of units that were shipped, for which customers had initiated returns." [official] (Frequently returned item badge, GTRP6DXEA983DPD6 v6 r0, https://sellercentral.amazon.com/help/hub/reference/external/GTRP6DXEA983DPD6, read 2026-10-14; capture capture `GTRP6DXEA983DPD6-v6`)

I2. **Warning before it lands.** "ASINs with significant sales volume and return rates notably higher than the suggested return rate are at risk of receiving the frequently returned item badge. We identify these at-risk ASINs in the Voice of the Customer dashboard to give you time to address any issues". [official] (same page)

I3. **How it is lost.** "Amazon will be monitoring return rate and automatically remove the badge once return rate approaches the suggested return rate. Note that the suggested return rate refreshes periodically, and may change over time." Amazon "may remove the badge earlier if we see a consistent downward trend in returns". No threshold or period is given. [official] (same page)

I4. **What the seller can do.** GUIDANCE: "reviewing the information on your detail pages to ensure descriptions, images and size charts are accurate", product quality and packaging. [official] (same page) This is the one negative badge that listing content can address directly.

I5. **Where it is tracked.** "A list of ASINs that have the frequently returned badge on product detail pages"; "A warning for ASINs that are at risk"; "Three-month and 12-month return rate data"; "Suggested return rate to prevent or remove the return badge". The column is "Return badge displayed" under Performance > Voice of the Customer. [official] (Track and prevent product return badges, News_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/34d5f5d3-a8af-4b6a-84b9-1988c4eeabec, read 2026-10-14; page shows "2 years ago")

I6. **The positive counterpart.** The help page speaks of "the badges related to return rates on product detail page", in the plural. No Amazon page read names a low-return badge or quotes the wording "Customers usually keep this item". [official] (Frequently returned item badge, GTRP6DXEA983DPD6 v6) See practitioners and Open questions.

### J. What no API carries (as read in the models and schemas, 2026-10-14)

J1. Searched for "badge", "choice", "climate", "small business", "best seller" and "bought":
- SP-API Product Pricing (v0 and 2022-05-01) and Catalog Items (2022-04-01) models;
- the report schemas for Search Query Performance, Search Catalog Performance, promotions and coupons;
- the Data Kiosk schemas (economics, sales and traffic, seller analytics).

No field names Amazon's Choice, Overall Pick, Climate Pledge Friendly, the Small Business badge, the Best Seller badge, "bought in past month" or the return badges. [official] (models and schemas at https://github.com/amzn/selling-partner-api-models, read 2026-10-14)

J2. What the APIs do carry, from the same files:
- **Catalog Items** `salesRanks`: `classificationRanks` (`classificationId`, `title`, `link`, `rank`) and `displayGroupRanks` (`websiteDisplayGroup`, `title`, `link`, `rank`). [official] (catalogItems_2022-04-01.json)
- **Product Pricing v0** `getItemOffers` / `getItemOffersBatch` / `getListingOffers`: per offer `PrimeInformation` (`IsPrime`: "Indicates whether the offer is an Amazon Prime offer"; `IsNationalPrime`: "...throughout the entire marketplace where it is listed"), `ShippingTime` (`minimumHours`, `maximumHours`, `availableDate`, `availabilityType` NOW / FUTURE_WITHOUT_DATE / FUTURE_WITH_DATE), `IsFulfilledByAmazon`, `IsBuyBoxWinner`, `IsFeaturedMerchant`. [official] (productPricingV0.json)
- **Product Pricing 2022-05-01** `getCompetitiveSummary`: offers carry `primeDetails.eligibility` (NATIONAL, REGIONAL, NONE) and `promotions` with `promotionType` COUPON ("a live coupon that customers can clip"), DEAL ("for example, Lightning Deal or Best Deal") or BASKET_BUILDING, and `promotionSavings`. The model's last commit is 2026-07-29 ("Listings API and Product Pricing API updates"). [official] (productPricing_2022-05-01.json; commit history via GitHub API, read 2026-10-14)
- **Data Kiosk economics** names a "High Return Rate Fee, also know as Returns Processing Fee for Non-apparel and Non-shoes". This is a fee, not the badge. [official] (analytics_economics_2024_03_15.graphql)

## What practitioners add

**Amazon's Choice is per search term.** Brian Connolly (Jungle Scout, "What Does Amazon's Choice Mean? How to Get the Badge for FBA Sellers", July 6, 2023): the badge is "awarded to select products on Amazon that best match the customer search term", and "Your product can technically have more than one Amazon's Choice badge since the badge is based on keywords." He quotes Amazon's FAQ text (B1). [opinion] (https://www.junglescout.com/blog/amazons-choice/, read 2026-10-14)
- Amazon's FAQ says "similar shopping needs" and does not say "search term". The per-keyword reading is practitioner consensus, not an Amazon statement.

**"Overall Pick" replaced the Amazon's Choice label in search results.** Sellers Ask Sellers forum thread "Amazon's Choice vs. Overall Pick" (opened May 6, 2025). [opinion] (https://sellersasksellers.com/t/amazons-choice-vs-overall-pick/5990, read 2026-10-14)
- ASV_Vites: "That switch happened about a year ago."
- papy: "the 'Amazon's Choice' aspect has been relegated to the help text". He reports that the info-icon help text lists "Rated 4+ stars", "Purchased often" and "Returned infrequently" (from screenshots dated 2025-05-06).
- The thread also reports a "popular brand pick" label (seen less recently) and a "New Arrival Pick" label.
- These are sellers' observations, not Amazon's words.

**Overall Pick as the top result for a keyword.** SellerSprite ("How to Get Amazon's Choice Badge?", 2025-10-15, no author shown): "As the most selected item under the searched keyword, it can consolidate the best seller position under the word". It says the badge reflects "customer reviews, price, and shipping speed" and lists likely factors (return rates, inventory, shipping options, keywords in the listing) as guesses. It gives no figures. [opinion] (https://www.sellersprite.com/en/blog/amazon-choice, read 2026-10-14)

**"Having this badge usually increases sales."** Helium 10's glossary entry, unsourced, with no figure. [opinion] (Amazon's Choice | Aamzon Glossary | Helium 10, https://www.helium10.com/amazon-glossary/amazons-choice/, read 2026-10-14)
- No practitioner page read in this session gives a measured click-through or conversion lift for Amazon's Choice, Overall Pick or Best Seller.

**"Bought in past month" at launch.** Juozas Kaziukėnas (Marketplace Pulse, "Amazon Made Sales Data Public", March 17, 2023) [opinion] (https://www.marketplacepulse.com/articles/amazon-made-sales-data-public, read 2026-10-14):
- "The sales number is rounded to hundreds, thousands, or tens of thousands and is capped at one hundred thousand."
- The window is "either a week or a month" (at launch).
- "The data is not yet available to sellers through Seller Central or APIs."
- He calls it "a clear popularity signal to shoppers" that "makes buying from an unrecognizable brand easier".
- Disagreement on the cap: Amazon's own FAQ example is "10K+ bought in past month" (D1); the 2023 cap of 100,000 may no longer hold.

**Keepa reads the figure off Amazon's pages.** Keepa: `monthlySold` "represents the bought past month metric found on Amazon search result pages. It is not an estimate." "Amazon only provides the data in bracketed ranges such as "10+" or "100+"". "Most ASINs do not have this value set." "The value is variation specific." [opinion: tool vendor documentation] (Keepa Product Object, https://keepa.com/api-docs/product-object.html, read 2026-10-14)
- "Not an estimate" (Keepa) and "a broad estimate" (Amazon) do not conflict. Keepa means it reports Amazon's displayed bracket, not its own estimate; Amazon means the bracket itself is approximate.
- "Variation specific" (Keepa) needs Amazon's caveat (D4): when a parent is shown with a price range, the displayed figure sums the family.

**Keepa's deal badge and return-rate fields.** [opinion: tool vendor documentation] (Keepa Product Object; Product.java, https://github.com/keepacom/api_backend/blob/master/src/main/java/com/keepa/api/backend/structs/Product.java, read 2026-10-14)
- `deals[].badge`: "The badge text as shown on the product page", for example "Early Prime Deal".
- `deals[].dealType` (observed values include PRIME_DAY, PRIME_EXCLUSIVE, SELLING_FAST, LIMITED_TIME_DEAL, COUNTDOWN_ENDS_IN, CLEARANCE_NO_RETURNS; "New deal types can be added at any time").
- `deals[].accessType` (ALL, PRIME_EARLY_ACCESS, PRIME_EXCLUSIVE); `deals[].percentClaimed` for Lightning Deals.
- `returnRate`: "null: The return rate is either unavailable or considered average"; "1: The product has a low return rate"; "2: The product has a high return rate."
- `coupon` / `couponHistory` ("We started tracking coupon history on June 15th 2024"); `promotions` ("Only Amazon US promotions by Amazon (not 3rd party) are collected", per Product.java).
- In `stats` (with the offers or buybox parameter): `buyBoxIsPrimeEligible`, `buyBoxIsPrimeExclusive`, `buyBoxIsFBA`, `buyBoxIsAmazon`, `buyBoxShippingTime` ("The estimated handling time range (minimum and maximum hours) before the Buy Box offer ships"), `buyBoxAvailabilityMessage`. (Keepa Statistics Object, https://keepa.com/api-docs/statistics-object.html, read 2026-10-14)
- Keepa's product object has no field for Amazon's Choice, Overall Pick, Climate Pledge Friendly or the Small Business badge (Keepa Product Object).

**The frequently-returned badge in 2026.**
- Chris Dawson (ChannelX, "Amazon frequently returned item badge", 5 Feb 2026): "From the 16th of February 2026, you'll see a frequently returned item badge on some product listings". It sits beside "the already existing lower than average return rate badge for products with fewer returns than similar products". The article does not name the marketplace or quote the wording of either badge. [opinion] (https://channelx.world/2026/02/amazon-frequently-returned-item-badge/, read 2026-10-14)
- Jake Schwarzbaum (Velocity Sellers, "Amazon's 'Frequently Returned Item' Badge Is a Verdict on Your Creative — and Now It Brings Competitors With It", September 10, 2026) [opinion] (https://www.velocitysellers.com/2026/09/10/amazon-frequently-returned-item-badge-creative-2026/, read 2026-10-14):
  - The badge sits near the buy box; he describes a "'similar items customers keep' style module" beneath badged listings.
  - "there is no dispute mechanism."
  - Recovery takes "4 to 8 weeks" under good conditions.
  - "practitioner reports of 20-40% conversion drops circulate widely". He names no source and calls the figures directional.
  - Return reasons fixable by the page: "not as described", "didn't match expectations", wrong variant, "doesn't fit / not compatible". Broken-on-arrival returns are operational.
  - He notes the rollout date differs across sources (4 or 16 February 2026).
- Amazon's page (I3) speaks of removal once the rate "approaches the suggested return rate" and of earlier removal on "a consistent downward trend". Neither practitioner's recovery timings appear on an Amazon page.

## Published research

- **Fisher, Gallino and Xu, "The Value of Rapid Delivery in Omnichannel Retailing", Journal of Marketing Research 56(5):732–748, 2019** (DOI 10.1177/0022243719849940). A new distribution centre gave a US apparel retailer unannounced faster online delivery to western states. Difference-in-differences: "online store sales increased, on average, by 1.45% per business-day reduction in delivery time, from a baseline of seven business days", with gradual build-up and a spillover to offline stores. [research] (Crossref record with abstract, https://api.crossref.org/works/10.1177/0022243719849940, read 2026-10-14)
  - Transfer: it supports "faster promise, more sales" in direction. It is one retailer's own site, with a seven-day baseline. It says nothing about Amazon's same-day / one-day / two-day badges, where the baseline is already short.

- **Elfenbein, Fisman and McManus, "Market Structure, Reputation, and the Value of Quality Certification", American Economic Journal: Microeconomics 7(4):83–108, 2015** (DOI 10.1257/mic.20130182). eBay UK, near-identical listings that differ in the "top rated seller" certification. The certification's positive effect on demand is "stronger for categories with few other certified sellers, in more competitive markets, and for sellers with shorter records of past performance". [research] (AEA article page, https://www.aeaweb.org/articles?id=10.1257/mic.20130182; Crossref record, read 2026-10-14)
  - Transfer: the closest evidence that a platform badge moves demand, and that its value falls as more competitors wear it. For Amazon this suggests a badge matters most when few competitors in the set carry it. It is a seller certification on eBay, not a product badge on Amazon.

- **Sorensen, "Bestseller Lists and Product Variety", Journal of Industrial Economics 55(4):715–738, 2007** (DOI 10.1111/j.1467-6451.2007.00327.x). Using time lags and accidental omissions in the New York Times hardcover fiction list: "appearing on the list leads to a modest increase in sales for the average book, and ... the effect is more dramatic for bestsellers by debut authors." [research] (Crossref record with abstract, read 2026-10-14)
  - Transfer: a "best seller" designation has a causal but modest effect, largest for unknown names. It is books and a newspaper list, not an Amazon badge.

- **Cai, Chen and Fang, "Observational Learning: Evidence from a Randomized Natural Field Experiment", American Economic Review 99(3):864–882, 2009** (DOI 10.1257/aer.99.3.864). In restaurants, showing the five most popular dishes raised their demand "by 13 to 20 percent". The authors find no significant saliency effect, and stronger effects among infrequent customers. [research] (Crossref record with abstract, read 2026-10-14)
  - Transfer: popularity information alone moves choice. This bears on "bought in past month" and Best Seller, by analogy only.

- **Tucker and Zhang, "How Does Popularity Information Affect Choices? A Field Experiment", Management Science 57(5):828–842, 2011** (DOI 10.1287/mnsc.1110.1312). On a wedding-vendor listing site, "narrow-appeal vendors receive more visits than equally popular broad-appeal vendors after the introduction of popularity information." [research] (Crossref record with abstract, read 2026-10-14)
  - Transfer: a popularity count can help niche products more than mainstream ones at the same count. By analogy only.

- **No peer-reviewed or Amazon Science paper** measuring Amazon's Choice, Overall Pick, Climate Pledge Friendly, the Small Business badge or the return badges on Amazon was opened in this session. The session's web-search budget was exhausted before such a search could run (see Open questions). Amazon's own +12% / +10% Climate Pledge Friendly figure (E4) comes from a commissioned study that is not published.
- returns.md cites an EMAC 2025 extended abstract on "frequently returned" labels. It was not reopened here and is not cited as this file's source.

## Stable enough for a skill

1. Amazon's Choice cannot be bought or applied for, can be held by a third-party seller's product, and changes as "customer preferences and feedback change". (Amazon's Choice FAQs)
2. The Best Seller badge goes to an ASIN that is #1 in a featured category, subject to a minimum category size stated on the Sales Rank FAQ and a marketplace-specific ordering threshold Amazon does not publish. It is not shown on detail pages where child orders are rolled into the parent's rank. A rank of 1 alone does not prove the badge. The category-size figure and the list refresh figures are Amazon's to change ("We keep revisiting and experimenting with this criteria"); a skill cites the page, not the numbers. (Sales Rank FAQ)
3. The New Release badge depends on the release and launch date attributes being accurate. (Sales Rank FAQ)
4. Sales trend ("bought in past month") counts customers across all sellers of the ASIN, excludes returns and cancellations, refreshes at least daily, needs a minimum number of buyers, and is not shown in every category. On a parent shown with a price range it sums the family. (Sales Trend FAQ)
5. Climate Pledge Friendly requires a qualifying third-party certification whose certifier submits the product data. Amazon can exclude products or drop certifications without any listing change. (Enroll products in our Climate Pledge Friendly program)
6. The Black-Owned Business badge follows the current featured offer, not the ASIN. (Black-Owned Business badge)
7. Coupons, deals, Prime-exclusive deals and price discounts each carry their own badge or strike-through. Each has seller and product rating floors stated on its help page; the floors are Amazon's to change (the deal page says "subject to change based on country and time of year"), and Amazon's own coupon pages disagree on one of them, so a skill names the page and does not state the figures. Deals and Prime-exclusive eligibility are Amazon's invitation, not the seller's choice. (Coupons; Coupon eligibility criteria; Amazon deals; Prime Exclusive Deals; Price discounts)
8. A strike-through price shows only with a validated reference price. (Price discounts; Strike-Through Pricing and Savings)
9. The Prime badge can disappear when the delivery promise is slow, when the daily Prime order limit is reached, or when the offer moves off a Prime template. None of these is a content change. (Guidelines for Seller Fulfilled Prime offers missing Prime branding)
10. Faster delivery promises raise purchase likelihood and featured-offer likelihood, in Amazon's words. (Manage your delivery time; Faster Regional Transit Time)
11. The frequently-returned badge is relative to similar ASINs. It is preceded by an at-risk warning in Voice of the Customer, and it is removed automatically when the return rate approaches the suggested rate. (Frequently returned item badge; Track and prevent product return badges)
12. No Amazon badge may appear inside a product image. (Product image guide)
13. Amazon's own search reports split impressions, clicks, cart adds and purchases by the same-day, one-day and two-day delivery message. (Search Catalog Performance and Search Query Performance report schemas)

## What cx must read at run time

- **Sales rank and a Best Seller candidate:** Catalog Items `getCatalogItem` / `searchCatalogItems` with `includedData=salesRanks`, read from `classificationRanks` and `displayGroupRanks`. Keepa `salesRanks` and `salesRankReference` give the history. A rank of 1 in a classification is a candidate for the badge, not proof (the ordering threshold and the category-size rule are not visible through either source).
- **Prime and shipping speed of the own offer and of competitors' offers:** Product Pricing `getItemOffers` / `getItemOffersBatch` (`PrimeInformation.IsPrime`, `IsNationalPrime`, `ShippingTime.minimumHours` / `maximumHours`, `availabilityType`, `IsFulfilledByAmazon`, `IsBuyBoxWinner`) and `getCompetitiveSummary` (`primeDetails.eligibility`). Keepa `stats.buyBoxIsPrimeEligible`, `buyBoxIsFBA`, `buyBoxShippingTime`, `buyBoxAvailabilityMessage` (offers or buybox parameter; check `offersSuccessful`).
- **Live coupon and deal on an offer:** `getCompetitiveSummary` offer `promotions` (`promotionType` COUPON / DEAL / BASKET_BUILDING, `promotionSavings`). Keepa `coupon`, `couponHistory`, `deals[]` (`badge`, `dealType`, `accessType`, `startTime`, `endTime`) and `csv` slots for the Lightning Deal and Prime-exclusive prices. For the seller's own promotions, the sources and the roles each page states (`GET_PROMOTION_PERFORMANCE_REPORT`, `GET_COUPON_PERFORMANCE_REPORT`, and the Promotions API v2025-12-01 with its `PRICE_DISCOUNT` type) are recorded in angles/seasonality-and-events.md and angles/price-position.md; this file does not restate the roles. door.md (the amazon-sp-api source package's `references/door.md`) names no report types yet (research/README.md, open question on door.md).
- **Search funnel by delivery message:** the Search Catalog Performance report (`GET_BRAND_ANALYTICS_SEARCH_CATALOG_PERFORMANCE_REPORT`, per ASIN) and the Search Query Performance report (`GET_BRAND_ANALYTICS_SEARCH_QUERY_PERFORMANCE_REPORT`, per query), the `*SameDay*`, `*OneDay*`, `*TwoDay*` count fields. Options, periods and waits are recorded in angles/search-query-performance.md; door.md names no report types yet. Data Kiosk seller analytics `search.catalog.priceAndCountMetrics.sameDayMetrics` / `oneDayMetrics` / `twoDayMetrics`.
- **Sales trend:** Keepa `monthlySold`, `monthlySoldHistory`, `lastSoldUpdate`. There is no SP-API source. An absent value is not zero.
- **Return-rate badges:** Keepa `returnRate` (1 low, 2 high, null unavailable or average). The seller's own badge state, at-risk list and suggested rate are in Voice of the Customer, a Seller Central page with no API found. cx asks the seller for it (returns.md P-9 says the same).
- **Not readable by any API found:** Amazon's Choice, Overall Pick and the other "Pick" labels, Climate Pledge Friendly, the Small Business and Black-Owned Business badges, and the Best Seller badge itself. Brand Analytics' monthly "with and without Amazon's Choice badge" file is a Seller Central download. cx records these as "seen on the page by the seller (date)" or "unknown", never as absent.

## Pages read

| Page name | URL | Date read | What it gave |
|---|---|---|---|
| Amazon's Choice FAQs | https://www.amazon.com/b?node=21449952011 | 2026-10-14 | Definition, criteria, third-party eligible, cannot pay or apply (read by curl; WebFetch got HTTP 503 on amazon.com) |
| Amazon Best Sellers Rank (customer help) | https://www.amazon.com/gp/help/customer/display.html?nodeId=GGGMZK378RQPATDJ | 2026-10-14 | Subcategory rank shown on page (curl) |
| Lightning Deals (customer help) | https://www.amazon.com/gp/help/customer/display.html?nodeId=GW3L8JX7Q9FH8ALB | 2026-10-14 | "Lightning Deal badge", claimed bar, timer (curl) |
| Strike-Through Pricing and Savings (customer help) | https://www.amazon.com/gp/help/customer/display.html?nodeId=GQ6B6RH72AX8D2TD | 2026-10-14 | List Price 90/180-day rule, Typical Price, Lowest Price in XX Days (curl) |
| Climate Pledge Friendly storefront | https://www.amazon.com/b?node=21221607011 | 2026-10-14 | unreachable: HTTP 503 to WebFetch; not retried |
| US Small Businesses storefront | https://www.amazon.com/smallbusiness | 2026-10-14 | Product carousels only; no badge definition |
| Sales Trend FAQ | https://sellercentral.amazon.com/help/hub/reference/external/G2CRYWPU52D7TGAK | 2026-10-14 | v2 r1; bought in past month definition, minimum, variations, search effect |
| Sales Rank FAQ | https://sellercentral.amazon.com/help/hub/reference/external/G202059240 | 2026-10-14 | v2 r0; Best Seller and New Release badge rules, hourly list, 12 h; capture capture `G202059240-v2` |
| Enroll products in our Climate Pledge Friendly program | https://sellercentral.amazon.com/help/hub/reference/external/GE94565V5PDYL5MZ | 2026-10-14 | v11 r0; certification path, exclusions, +12% / +10% claim |
| Display Climate Pledge Friendly's green leaf icon ... | https://sellercentral.amazon.com/help/hub/reference/external/GLT32C7D7L5PT6DM | 2026-10-14 | v1 r1; Buy with Prime display, ineligibility reasons |
| Black-Owned Business badge | https://sellercentral.amazon.com/help/hub/reference/external/GBYJYA8MG6FV4XYC | 2026-10-14 | v2 r1; featured-offer based, certification, test, no exclusion |
| Prime Day Small Business Promotions FAQ | https://sellercentral.amazon.com/help/hub/reference/external/GB5KQ2GS6DMQA7RC | 2026-10-14 | v8 r0; 2022 Small Business badge test, Gartner, Brand Registry or Handmade |
| Frequently returned item badge | https://sellercentral.amazon.com/help/hub/reference/external/GTRP6DXEA983DPD6 | 2026-10-14 | v6 r0; relative to similar ASINs, at-risk, removal; capture capture `GTRP6DXEA983DPD6-v6` |
| Voice of the Customer | https://sellercentral.amazon.com/help/hub/reference/external/GRTPNYUAU5EQ9RGU | 2026-10-14 | v10 r3; CX Health relative to similar offers, NCX rates (context only) |
| Coupons | https://sellercentral.amazon.com/help/hub/reference/external/G3QLEV6W2QK84C57 | 2026-10-14 | v8 r0; where coupons show |
| Coupon eligibility criteria | https://sellercentral.amazon.com/help/hub/reference/external/GJHCPEFJ5JJQD52D | 2026-10-14 | v14 r0; 3.5 seller feedback, 2.5 / 3-star product floors, 5%; capture capture `GJHCPEFJ5JJQD52D-v14` |
| Amazon deals | https://sellercentral.amazon.com/help/hub/reference/external/G202111490 | 2026-10-14 | v25 r11; Deals badge, 4–12 h, 3.5 seller / 4-star product, "subject to change", invite-only; capture capture `G202111490-v25` |
| Prime Exclusive Deals | https://sellercentral.amazon.com/help/hub/reference/external/GFXXXKMMQE9WLVNZ | 2026-10-14 | v1 r2; Prime deal badging, no self-request |
| Price discounts | https://sellercentral.amazon.com/help/hub/reference/external/G7F8CQ4EJ5YA4272 | 2026-10-14 | v8 r3; strike-through in search and detail page, 1–30 days, floors |
| Business Blue Savings Badge | https://sellercentral.amazon.com/help/hub/reference/external/GZK9RLHFV3K442KH | 2026-10-14 | v1 r1; B2B savings badge rules |
| Guidelines for Seller Fulfilled Prime offers missing Prime branding | https://sellercentral.amazon.com/help/hub/reference/external/G5LDV3NBM7ECSK5F | 2026-10-14 | v5 r0; Prime badge removed for slow promise |
| Guidelines to turn off persistent Prime branding on Seller Fulfilled Prime offers | https://sellercentral.amazon.com/help/hub/reference/external/G4HBG47F73MK7257 | 2026-10-14 | v4 r0; template and toggle checks |
| Manage your delivery time | https://sellercentral.amazon.com/help/hub/reference/external/G202167920 | 2026-10-14 | v13 r0; delivery time formula, faster helps purchase and Featured Offer |
| Seller Guaranteed Delivery | https://sellercentral.amazon.com/help/hub/reference/external/G201817490 | 2026-10-14 | v5 r0; guaranteed date message eligibility |
| Faster Regional Transit Time | https://sellercentral.amazon.com/help/hub/reference/external/G9HDKKR234ABGH6B | 2026-10-14 | v1 r6; faster promise, purchase likelihood |
| Seller Fulfilled Prime program policy | https://sellercentral.amazon.com/help/hub/reference/external/G201812300 | 2026-10-14 | v7 r9; handling, cut-off, volume limit |
| Delivery Speed (FBM) | https://sellercentral.amazon.com/help/hub/reference/external/GMQG9J9KCDF4Y8FM | 2026-10-14 | v2 r5; configured vs shown promise, brand-level metric |
| Maximizing Delivery Speed | https://sellercentral.amazon.com/help/hub/reference/external/GA8NP4NDZZ3EJRU5 | 2026-10-14 | v1 r0; faster delivery drives conversion; 30–60 days of supply |
| Product image guide | https://sellercentral.amazon.com/help/hub/reference/external/G1881 | 2026-10-14 | v28 r9; no Amazon badges in images; capture capture `G1881-v28` |
| Amazon search glossary | https://sellercentral.amazon.com/help/hub/reference/external/GF6B8ZPNY2AP72VV | 2026-10-14 | v2 r0; search result includes badges; continuous experimentation; 72 h latency; capture capture `GF6B8ZPNY2AP72VV-v2` |
| My ASIN is unsearchable | https://sellercentral.amazon.com/help/hub/reference/external/GHGHDMU4X5K9QGCV | 2026-10-14 | v6 r0; context (72 h for offer/browse/launch-date changes); capture capture `GHGHDMU4X5K9QGCV-v6` |
| Becoming the Featured Offer | https://sellercentral.amazon.com/help/hub/reference/external/G201687550 | 2026-10-14 | v20 r0, read from its capture capture `G201687550-v20` at reconciliation; fast, certain delivery favoured; all sellers' offers evaluated since September 2026 |
| Keep your listings discoverable | https://sellercentral.amazon.com/help/hub/reference/external/G2KNH9H3CXZN6ULZ | 2026-10-14 | v6 r0; context (search suppression, 48 h) |
| Seller Central help tree nodes (Seller Central Help, Increase sales, Create and manage offers, Amazon Search, Product detail pages and offers, Account Health Rating program policy, Price discounts, Coupons) | https://sellercentral.amazon.com/help/hub/reference/external/G2 (and the ids listed) | 2026-10-14 | Hierarchy used to find the pages above; no page titled for the Small Business badge, Amazon's Choice or Overall Pick in the branches walked |
| Track and prevent product return badges (News_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/34d5f5d3-a8af-4b6a-84b9-1988c4eeabec | 2026-10-14 | VOC badge column, at-risk, 3/12-month rates; "2 years ago" |
| Download your Brand Analytics Search dashboard data (News_Amazon) | https://sellercentral-europe.amazon.com/seller-forums/discussions/t/f3560b923f6e499d2ee7bc4f2ad8dd41 | 2026-10-14 | Monthly with/without Amazon's Choice file |
| On which API "bought in past month" data avaliable ? | https://sellercentral-europe.amazon.com/seller-forums/discussions/t/a2a31717-05a3-43ed-a05b-c6f7a2c876c0 | 2026-10-14 | Staff reply names no API |
| Amazon launches 'Climate Pledge Friendly' program | https://www.aboutamazon.com/news/sustainability/climate-pledge-friendly | 2026-10-14 | "clearly labeled in shopping results"; no date shown |
| Customers - Amazon Sustainability | https://sustainability.aboutamazon.com/customers | 2026-10-14 | 187 M / 43 M customers, 4.2 M+ products, 14 stores |
| Amazon Sustainability home | https://sustainability.aboutamazon.com/ | 2026-10-14 | Links only |
| How to shop small and save big on small business deals this Prime Day | https://www.aboutamazon.com/news/retail/small-business-prime-day-deals-2025 | 2026-10-14 | Small Business badge on detail pages; no criteria |
| Black History Month: How to shop from Black-owned businesses on Amazon | https://www.aboutamazon.com/news/small-business/how-to-support-black-owned-businesses | 2026-10-14 | Both badges named on detail pages |
| aboutamazon Small business news index | https://www.aboutamazon.com/news/small-business | 2026-10-14 | Article list; no badge post |
| Amazon selling programs | https://sell.amazon.com/programs | 2026-10-14 | No Climate Pledge Friendly or Small Business badge programme page |
| sell.amazon.com/programs/climate-pledge-friendly | https://sell.amazon.com/programs/climate-pledge-friendly | 2026-10-14 | unreachable: HTTP 404 |
| sustainability.aboutamazon.com/products-services/climate-pledge-friendly | (as named) | 2026-10-14 | unreachable: HTTP 404 |
| productPricingV0.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/product-pricing-api-model/productPricingV0.json | 2026-10-14 | PrimeInformation, ShippingTime, offer flags, operation ids |
| productPricing_2022-05-01.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/product-pricing-api-model/productPricing_2022-05-01.json | 2026-10-14 | primeDetails, promotions COUPON/DEAL/BASKET_BUILDING; last commit 2026-07-29 |
| catalogItems_2022-04-01.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/catalog-items-api-model/catalogItems_2022-04-01.json | 2026-10-14 | salesRanks structure |
| sellingPartnerSearchCatalogPerformanceReport.json | https://github.com/amzn/selling-partner-api-models/blob/main/schemas/reports/sellingPartnerSearchCatalogPerformanceReport.json | 2026-10-14 | Delivery-message splits; no badge field |
| sellingPartnerSearchQueryPerformanceReport.json | https://github.com/amzn/selling-partner-api-models/blob/main/schemas/reports/sellingPartnerSearchQueryPerformanceReport.json | 2026-10-14 | Delivery-message splits; no badge field |
| promotionReport.json, sellerCouponReport.json | https://github.com/amzn/selling-partner-api-models/tree/main/schemas/reports | 2026-10-14 | No badge field |
| analytics_sellerAnalytics_2025_03_31.graphql | https://github.com/amzn/selling-partner-api-models/blob/main/schemas/data-kiosk/analytics_sellerAnalytics_2025_03_31.graphql | 2026-10-14 | sameDay/oneDay/twoDayMetrics; no badge field |
| analytics_economics_2024_03_15.graphql, analytics_salesAndTraffic_2024_04_24.graphql | https://github.com/amzn/selling-partner-api-models/tree/main/schemas/data-kiosk | 2026-10-14 | High Return Rate Fee named; no badge field |
| Keepa Product Object | https://keepa.com/api-docs/product-object.html | 2026-10-14 | monthlySold, returnRate, deals.badge, coupon; no AC/CPF field |
| Keepa Statistics Object | https://keepa.com/api-docs/statistics-object.html | 2026-10-14 | buyBoxIsPrimeEligible, buyBoxShippingTime and related |
| Product.java (Keepa) | https://github.com/keepacom/api_backend/blob/master/src/main/java/com/keepa/api/backend/structs/Product.java | 2026-10-14 | Field comments, dealType values, couponHistory start date |
| What Does Amazon's Choice Mean? (Jungle Scout, Brian Connolly) | https://www.junglescout.com/blog/amazons-choice/ | 2026-10-14 | Keyword-based, multiple badges |
| How to Get Amazon's Choice Badge? (SellerSprite) | https://www.sellersprite.com/en/blog/amazon-choice | 2026-10-14 | Overall Pick as top result; guesses |
| Amazon's Choice (Helium 10 glossary) | https://www.helium10.com/amazon-glossary/amazons-choice/ | 2026-10-14 | "usually increases sales", unsourced |
| Helium 10 Amazon glossary index | https://www.helium10.com/amazon-glossary/ | 2026-10-14 | No Overall Pick, CPF or return-badge entries |
| Amazon's Choice vs. Overall Pick (Sellers Ask Sellers) | https://sellersasksellers.com/t/amazons-choice-vs-overall-pick/5990 | 2026-10-14 | Switch about a year before May 2025; help-text criteria |
| Amazon Made Sales Data Public (Marketplace Pulse) | https://www.marketplacepulse.com/articles/amazon-made-sales-data-public | 2026-10-14 | 2023 launch, rounding, cap, no API |
| Amazon frequently returned item badge (ChannelX) | https://channelx.world/2026/02/amazon-frequently-returned-item-badge/ | 2026-10-14 | 16 Feb 2026; existing low-return badge |
| Amazon's 'Frequently Returned Item' Badge Is a Verdict on Your Creative (Velocity Sellers) | https://www.velocitysellers.com/2026/09/10/amazon-frequently-returned-item-badge-creative-2026/ | 2026-10-14 | Placement, recovery claims, unsourced 20–40% |
| Amazon starts revealing secret formula behind influential Amazon's Choice selections (GeekWire) | https://www.geekwire.com/2018/amazon-starts-revealing-secret-formula-behind-influential-amazons-choice-selections/ | 2026-10-14 | unreachable: HTTP 403 |
| eStore Factory "amazon choice badge gets a revamp july 06 2023" | https://estorefactory.com/amazon-update/amazon-choice-badge-gets-a-revamp-july-06-2023 | 2026-10-14 | unreachable: served the agency landing page, not the article |
| Gorilla ROI "The Mighty Amazon Overall Pick Badge" | https://www.gorillaroi.com/?p=69812 | 2026-10-14 | unreachable: served a product landing page, not the article |
| Crossref records: Fisher et al. 2019; Elfenbein et al. 2015; Sorensen 2007; Cai et al. 2009; Tucker and Zhang 2011 | https://api.crossref.org/works/<DOI> | 2026-10-14 | Bibliographic data and abstracts |
| Market Structure, Reputation, and the Value of Quality Certification (AEA) | https://www.aeaweb.org/articles?id=10.1257/mic.20130182 | 2026-10-14 | Article page, abstract |

## Open questions

1. **Small Business badge eligibility today.** No current Seller Central page was found in the help-tree branches walked (Increase sales; Create and manage offers; account, policy, inventory and FBA branches). The only stated criteria are the 2022 promotion's (Gartner definition, Brand Registry or Handmade, US-based). It is also unknown whether the badge follows the featured offer, as the Black-Owned badge does. *Settles it:* a Seller Central page titled for the badge, or a Brand Registry help page (brandservices.amazon.com, not walked). A first real run can ask the seller whether the badge shows on their detail page.
2. **"Customers usually keep this item."** The wording is not on any Amazon page read. ChannelX calls it "the already existing lower than average return rate badge"; Keepa's `returnRate` = 1 is "low return rate". The link between the three is the seat's inference. *Settles it:* an Amazon page or announcement naming the low-return badge, or a page view of a product where Keepa reports `returnRate` 1.
3. **"Overall Pick" and the other "Pick" labels.** No Amazon page found. Practitioners say Overall Pick replaced the Amazon's Choice label in search results around 2024. Unknown: whether the criteria are the same, and whether Brand Analytics' "with and without Amazon's Choice badge" file counts Overall Pick. *Settles it:* an Amazon customer help page for the label (the info-icon text on a search tile), or the Brand Analytics file's column definitions.
4. **Measured click-through effect of Amazon's Choice / Overall Pick / Best Seller on Amazon.** No peer-reviewed paper, Amazon Science paper or practitioner measurement was opened in this session; the web-search budget ran out before a search could run. *Settles it:* a literature search (for example "Amazon's Choice" in SSRN, Management Science, Marketing Science), or the seller's own Brand Analytics with/without file.
5. **Climate Pledge Friendly in the catalog.** Unknown whether any product-type attribute or Catalog Items field records CPF status or the certification. No model or schema read names one; the product-type schema itself could not be read without an API call. *Settles it:* a `getDefinitionsProductType` read on a first real run, searched for "climate", "sustainab" or "certification".
6. **Climate Pledge Friendly certification list.** The live list of qualifying certifications and the excluded-products list sit behind links on the help page ("Explore qualifying certifications", "exclude select products") that were not followed. Amazon's own pages disagree on the count over time (19 at launch; "at least one" now). *Settles it:* the amazon.com Climate Pledge Friendly storefront (HTTP 503 to WebFetch; curl not tried).
7. **Sales-trend minimum and categories.** Amazon gives neither. Practitioners at launch gave a 100,000 cap; Amazon's example now shows "10K+". *Settles it:* not knowable from documentation; Keepa `monthlySold` across the competitor set shows which brackets appear.
8. **Whether the Best Seller badge, Amazon's Choice and the frequently-returned badge are shown per child or per parent.** Only the Best Seller rule on parent roll-up is stated. variations.md lists the same question for merges.
9. **Whether `getCompetitiveSummary` `promotions` covers Prime-exclusive discounts and price discounts.** The enum lists COUPON, DEAL and BASKET_BUILDING only. For the seller's own offers, seasonality-and-events.md and price-position.md record the Promotions API (v2025-12-01, launched 2026-08-26) whose promotion types include `PRICE_DISCOUNT`; that covers the own listing, not competitors. *Settles it:* the Product Pricing release notes on developer-docs.amazon, or a first run on an ASIN with a known Prime-exclusive discount.
10. **Display latency of a badge after the cause changes.** Amazon states "at least daily" for sales trend, "every hour" for the best seller list (up to 12 hours for an order), "up to four business days" for leaving the Black-Owned programme, and "periodically" for the return badge. Nothing is stated for Amazon's Choice, CPF, Prime badge restoration or deal badges. The search glossary's general figure ("It can take up to 72 hours for changes to new or existing ASINs to go live. Latency can be slower or faster", GF6B8ZPNY2AP72VV v2) and My ASIN is unsearchable's ("up to 72 hours" for offer, browse node and launch-date changes, GHGHDMU4X5K9QGCV v6) are about search, not badges. This adds to the latency scatter other files record; no single effect-window rule follows from it. In line with funnel-and-search.md P-15 and listing-writes.md, cx reads a badge's state on the dates that matter (Keepa history, the pricing reply, the seller's own view) rather than assuming a display delay.

## Positions

1. **P-badges-and-placements-1.** cx never proposes "earn Amazon's Choice", "earn Overall Pick" or "earn Best Seller" as an action, because Amazon says these cannot be paid for or applied for and follow ratings, price, popularity, availability, delivery and sales. — Amazon's Choice FAQs; Sales Rank FAQ
2. **P-badges-and-placements-2.** cx treats a Best Seller rank of 1 read from Catalog Items `salesRanks` as a candidate for the Best Seller badge, not proof, because the badge also needs a featured category of the minimum size the Sales Rank FAQ states and a marketplace ordering threshold Amazon does not publish, and it is hidden on parent-rolled pages. — Sales Rank FAQ; catalogItems_2022-04-01.json
3. **P-badges-and-placements-3.** For a New Release badge question, cx checks the release date and launch date attributes, the only listing-side lever Amazon names. — Sales Rank FAQ
4. **P-badges-and-placements-4.** cx reads "bought in past month" from Keepa `monthlySold` as Amazon's bracketed count of customers across all sellers, excluding returns and cancellations. An absent value is not zero. On a parent shown with a price range, the figure covers the whole family. — Sales Trend FAQ; Keepa Product Object; On which API "bought in past month" data avaliable ?
5. **P-badges-and-placements-5.** cx names Climate Pledge Friendly as a lever only through a qualifying third-party certification submitted by the certifier, quotes the sales and glance-view lift on Amazon's enrolment page only as "Amazon's commissioned average, not a guarantee" and names the page rather than carrying the figure, and warns that Amazon can exclude a product or drop a certification without any listing change. — Enroll products in our Climate Pledge Friendly program
6. **P-badges-and-placements-6.** cx treats the Prime badge and the delivery promise as offer and fulfilment facts. It reads them per offer from `getItemOffers` (`PrimeInformation`, `ShippingTime`) and `getCompetitiveSummary` (`primeDetails`), and never attributes a click-through change to content when the Prime badge or shipping speed changed in either window. — Guidelines for Seller Fulfilled Prime offers missing Prime branding; Manage your delivery time; productPricingV0.json; productPricing_2022-05-01.json
7. **P-badges-and-placements-7.** When a review needs the effect of delivery speed on search click-through, cx reads the same-day / one-day / two-day split of the Search Catalog Performance report or Data Kiosk seller analytics, not a practitioner figure. — sellingPartnerSearchCatalogPerformanceReport.json; analytics_sellerAnalytics_2025_03_31.graphql
8. **P-badges-and-placements-8.** Every change file records, on the change date, the listing's live coupon, deal, Prime-exclusive and strike-through state and its Prime / shipping-speed state, from `getCompetitiveSummary` and Keepa (`coupon`, `deals[]`, `stats.buyBoxIsPrimeEligible`, `stats.buyBoxShippingTime`). — Coupons; Amazon deals; Price discounts; productPricing_2022-05-01.json; Keepa Product Object; Keepa Statistics Object
9. **P-badges-and-placements-9.** effect-review names as a confounder any badge the listing or a competitor in the set gained or lost in the baseline or observation window: deal, coupon, Prime, delivery speed, return badge, sales trend bracket. It answers "cannot tell" when such a change on the listing itself coincides with the change under review. — Amazon deals; Coupons; Guidelines for Seller Fulfilled Prime offers missing Prime branding; Frequently returned item badge; Sales Trend FAQ; Market Structure, Reputation, and the Value of Quality Certification
10. **P-badges-and-placements-10.** For badges no API carries (Amazon's Choice, Overall Pick, Climate Pledge Friendly, Small Business, Black-Owned Business, Best Seller itself, the seller's own return-badge state), cx records "seen by the seller on <date>" or "unknown", and never "absent". — Models and schemas listed in Pages read; Keepa Product Object; Track and prevent product return badges
11. **P-badges-and-placements-11.** The frequently-returned badge is the one negative badge that listing content can address. cx treats it as relative to similar ASINs and preceded by an at-risk warning in Voice of the Customer. Its remedy is accurate descriptions, images and size charts. cx judges removal by the badge's own clearing, not by a fixed period. — Frequently returned item badge; Track and prevent product return badges
12. **P-badges-and-placements-12.** cx reads Keepa `returnRate` (1 low, 2 high, null unavailable or average) for the listing and each competitor as the only API trace of the return badges. — Keepa Product Object; Product.java
13. **P-badges-and-placements-13.** A proposal never puts an Amazon badge, or anything resembling one, into an image. — Product image guide
14. **P-badges-and-placements-14.** cx names the help page that holds each coupon, deal and price-discount rating floor (Coupon eligibility criteria; Amazon deals; Price discounts) and does not carry the figures: Amazon changes them, the deal page calls its product criteria "subject to change based on country and time of year", and Amazon's own coupon pages disagree on one floor. Coupons and price discounts are floored on the seller's feedback rating, deals on the seller's overall rating, and each also on the product's star rating. Deals and Prime-exclusive eligibility are Amazon's invitation. When a floor matters, the current value comes from the page read in a signed-in seat or from what the Seller Central creation flow reports, as the seller relays it, not from the undocumented content call. — Coupon eligibility criteria; Amazon deals; Price discounts; Prime Exclusive Deals; P-help-page-access-7
15. **P-badges-and-placements-15.** The Black-Owned Business badge follows the featured offer. On a shared ASIN, cx does not attribute its appearance or disappearance to the listing. — Black-Owned Business badge

### The seat's own (not for a skill)

- [seat] The badge whose effect a seller can measure directly is Amazon's Choice, through Brand Analytics' monthly with/without file. A skill could ask the seller for that file before claiming any Amazon's Choice effect. Not checked: whether the file still exists under that name.
- [seat] By Elfenbein et al.'s logic, a badge is worth most when few competitors in the set carry it. A review might count badges across the competitor set before weighting a gain. This is an analogy from eBay, not an Amazon finding.
- [seat] "Customers usually keep this item" is probably the shopper-facing text of the low-return badge that ChannelX mentions and that Keepa's `returnRate` = 1 traces. Unverified.
- [seat] Overall Pick probably inherits Amazon's Choice's criteria, given the info-icon text sellers report ("Rated 4+ stars", "Purchased often", "Returned infrequently"). Unverified on an Amazon page.

## Verification

Gap fill 2026-10-14: 7 gaps filled, 4 left open.

Filled (one badge family per gap):
1. Amazon's Choice: Amazon's FAQ read (criteria, no pay or apply, third-party eligible); Brand Analytics with/without file; no API field.
2. Best Seller (#1) and New Release: Sales Rank FAQ read (≥100 products, ordering threshold, parent roll-up, hourly, 12 h); Catalog `salesRanks` as candidate only.
3. Climate Pledge Friendly: Seller Central enrolment page read (certification path, exclusions, Amazon's +12% / +10% commissioned figure); no API field.
4. "Bought in past month": Sales Trend FAQ read (customers across sellers, at least daily, minimum, variations, search effect); Keepa `monthlySold`; no SP-API source.
5. Coupon / Deal / Prime Exclusive / strike-through badges: five Seller Central pages and two customer pages read; `getCompetitiveSummary` `promotions` and Keepa `deals[].badge` found.
6. Prime and delivery-date messaging: Prime badge removal for slow promises, delivery formula, SFP and guaranteed-delivery rules; the report and Data Kiosk delivery-message splits; pricing-API Prime and shipping fields.
7. "Frequently returned item": help page and News post read; Keepa `returnRate`; practitioners on 2026 rollout and recovery.

Left open:
1. Small Business badge: only the 2022 test criteria and 2025 shopper mentions were read; no current eligibility page found (OQ1).
2. "Customers usually keep this item": wording not found on any Amazon page; low-return badge known only through ChannelX and Keepa (OQ2).
3. Overall Pick: no Amazon page; practitioners only (OQ3).
4. Click-through effect of individual badges: no Amazon-specific peer-reviewed or Amazon Science study opened; only Amazon's commissioned CPF figure and adjacent research (OQ4).

Adversarial re-check of the claims added (2026-10-14).
- **Seller Central pages.** All 22 pages quoted were re-fetched through the content call, with no cache. 91 of 93 quoted phrases matched character for character. Two failed only on a space the link markup puts before the full stop ("Gartner's definition of small business ." on GB5KQ2GS6DMQA7RC; "become a Featured Offer ." on G202167920); the wording is unchanged. Versions were unchanged on re-read.
- **amazon.com pages.** The four pages (Amazon's Choice FAQs, Best Sellers Rank, Lightning Deals, Strike-Through Pricing) were re-fetched by curl; all 11 quoted phrases matched.
- **Model and schema files.** These were re-downloaded from GitHub. All 20 cited field names and descriptions matched. The negative claim also held: no file contains "Amazon's Choice", "climate", "small business", "bought in past" or "best seller badge".
- **Practitioner pages.** Jungle Scout, Sellers Ask Sellers, Marketplace Pulse, ChannelX and Velocity Sellers were re-opened. One correction: Velocity Sellers writes "there is no dispute mechanism." in lowercase, and the quote was fixed. Sellers Ask Sellers and ChannelX use curly apostrophes where this file has straight ones; the wording is otherwise identical.
- **Not re-opened in the re-check:** the aboutamazon and sustainability pages, the two News_Amazon forum posts, the Keepa web docs (the Product.java fields were re-checked instead) and the Crossref records.

Contradictions this file touches, settled at the source:
- **Deal floors.** The seller needs "an overall rating of at least 3.5 stars" and the product "at least a 4-star rating" (G202111490 v25). This agrees with price-position.md; seasonality-and-events.md now quotes the same floors from G202111490 v25, so its earlier ambiguity is gone. The practitioner "3 stars" in reviews-and-qa.md matches the **price-discount** product floor ("at least a three-star rating", G7F8CQ4EJ5YA4272), not the deal floor.
- **Coupon floor.** The 3.5 is the seller's feedback rating. The product floors are 2.5 stars with 1–4 reviews and 3 stars with 5+ reviews (GJHCPEFJ5JJQD52D v14).
- **G202059240 (Sales Rank FAQ).** The page reads through the content call (v2 r0; capture capture `G202059240-v2`) and carries the "every hour / up to 12 hours" sentence that competitor-discovery.md first sourced from a staff forum reply; competitor-discovery.md has since been reconciled to the capture.
- **"Bought in past month".** Keepa says "not an estimate" and Amazon says "a broad estimate". Both hold: Keepa relays Amazon's displayed bracket, and the bracket itself is approximate. Keepa's "variation specific" needs Amazon's parent-sum rule (Sales Trend FAQ).

Reconciled 2026-10-14 (against research/ and the contradictions list; no help page fetched, captures read instead):
1. Route paragraph (section intro): states that the help hub content call is undocumented, that its standing use is for the office to rule (help-page-access.md OQ1), and that cx does not depend on it at run time (P-help-page-access-7). Names the eight cited pages that have a capture under the office's capture folder (outside this repository); every quote from them (G1881, G202059240, G202111490, GJHCPEFJ5JJQD52D, GF6B8ZPNY2AP72VV, GHGHDMU4X5K9QGCV, GTRP6DXEA983DPD6, and the newly cited G201687550) was re-checked against the capture text and matched. Capture paths added to those citations and to *Pages read*.
2. C3: the competitor-discovery.md "shell only" remark was out of date (that file now reads G202059240 from its capture); rewritten. Added that the hourly and 12-hour figures are Amazon's to change.
3. G2 (deals): added Amazon's "(subject to change based on country and time of year)" from the capture, and a pointer to the separate fee page (G202111590) instead of restating fees.
4. G1 (coupons): added that the coupon 3.5 is the seller's *feedback* rating while the deal 3.5 is the "overall rating"; recorded, via price-position.md, that Amazon's coupon errors page (GLBL4T5C9UAB9T5P, not opened here) gives 1 star where the eligibility page gives 2.5, with the binding floor read at run time from the coupon creation flow as the seller relays it.
5. H2 and F3: cited Becoming the Featured Offer (G201687550 v20, capture) for fast, certain delivery and for the September 2026 removal of seller eligibility, which bears on badges that follow the featured offer. Consistent with funnel-and-search.md, price-position.md and triggers.md as they now read.
6. Stable 2 and 7, P-2, P-5, P-14: removed figures Amazon keeps on changeable pages (the 100-product category size, the CPF +12% / +10% lift, the coupon, deal and price-discount rating floors). The figures stay in the body for human readers; P-14 now names the pages and the run-time source.
7. Run-time section and P-7: "door.md's" report pointers corrected. door.md (amazon-sp-api source package) names no report types (research/README.md open question); the report type names are now given, and roles and options are pointed to seasonality-and-events.md, price-position.md and search-query-performance.md without restating the role split.
8. OQ9: noted the Promotions API (v2025-12-01) and its `PRICE_DISCOUNT` type recorded in seasonality-and-events.md and price-position.md, for the own listing only.
9. OQ10: added the glossary and My ASIN is unsearchable 72-hour figures as search latencies, not badge latencies, and aligned with funnel-and-search.md P-15 and listing-writes.md: read the state on the dates, assume no delay.
Left as is, other files being the stale ones: images-and-video.md's *Pages read* rows that still call G1881 unreachable (its own gap-fill note and capture G1881-v28 say it was read); reviews-and-qa.md's practitioner "3 stars" for deals (Amazon deals v25 says 4 for the product; reviews-and-qa.md already marks it superseded).
