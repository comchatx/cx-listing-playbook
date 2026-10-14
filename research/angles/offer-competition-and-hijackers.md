# Offer competition and hijackers: other sellers on the brand's own ASIN

Read 2026-10-14 by the research seat. Tags: [official] Amazon's own page or document; [opinion] a named practitioner; [research] published research; [seat] the seat's own reasoning, never a skill position.

How pages were read. SP-API developer pages were read in their `.md` form (`https://developer-docs.amazon.com/sp-api/docs/<page>.md`), and each page's `updatedAt` line is recorded. Models and notification schemas were read from `amzn/selling-partner-api-models` on GitHub (raw files). Seller Central help pages were read through the help hub's own content call (`POST https://sellercentral.amazon.com/help/hub/mons-api/GetHelpTopic`, the route `method/help-page-access.md` documents). That route is for research only, never for cx, and its standing use is the office's to rule (`method/help-page-access.md`, Open question 1). The public URL, the title and the version the call returned are recorded. Four of the help pages cited here have a saved text capture under the office's capture folder (outside this repository) (G201687550-v20, G200418100-v23, G27691-v7, G200390640-v21); the quotes from those four were re-matched against the captures on 2026-10-14. The other help pages cited here have no capture there and rest on this seat's own read through the same call. sell.amazon.com, trustworthyshopping.aboutamazon.com and practitioner pages were read with a plain fetch. The publication month of the Sell on Amazon blog posts was taken from the blog's own sitemap. Seller Forums threads were read with a page fetch. Keepa field meanings come from Keepa's Java client source on GitHub (`Product.java`, `Stats.java`, `Offer.java`). No Amazon API host and no Keepa API host was called. The session's web-search budget was spent before this file began, so pages were found through Amazon's own links, site maps and known addresses. What that route could not reach is in "Open questions".

This file overlaps `angles/brand-protection-and-catalog-contribution.md`, which owns contribution precedence, locked attributes and the catalog case paths. Here those topics are re-read only where offer competition needs them. This file owns the offer side: who else sells on the seller's own ASIN, what that does to the Featured Offer, reviews and returns, and what Amazon offers against it.

## What this covers

- **Funnel stage.** Mainly conversion, plus none: offer competition is a precondition check before any content verdict.
  - A new seller with a lower total price, or a seller that takes the Featured Offer, moves the seller's own orders and its own conversion figures (units over its own sessions) without any change to the listing.
  - A counterfeit or "not as described" seller on the same ASIN adds reviews to the ASIN the brand owns.
  - A contributor whose value wins the detail page changes what shoppers see. That can touch click-through (title, main image) as well as conversion.
- **Skills fed.**
  - `listing-review`: whether other offers exist on the ASIN, who holds the Featured Offer and in what share, and whether the page shows what the seller submitted. These are checked before the content is judged. The review also names the Brand Registry route that fits each finding.
  - `listing-change-log`: the offer state at the time of the change is recorded in the "before". That means the offer count by condition and channel, the Featured Offer holder and the seller's Featured Offer share.
  - `effect-review`: a new seller, a change of Featured Offer holder, a drop in the seller's own Featured Offer share, or an outside content change inside the observation window is a named confounder.
- **Why a senior operator cares.** "Sales fell after we changed the title" is very often "a new seller undercut us and took the Featured Offer the same week" or "we stocked out and the Featured Offer went to a reseller". A content verdict that ignores the offer side is wrong in a way an experienced lead spots at once. On remedies, filing a counterfeit report against a reseller of genuine goods is the classic error. It fails, and it lowers the acceptance rate that Project Zero access depends on.

## Amazon's own rules and guidance

### A. Detecting other offers on the ASIN

A1. **RULE: `getItemOffers` returns offer counts by condition and fulfilment channel, plus up to 20 offers.**
- The operation "Returns the lowest priced offers for a single item based on ASIN". `ItemCondition` is a required filter ("New, Used, Collectible, Refurbished, Club"), and `CustomerType` is `Consumer` (the default) or `Business`.
- `Summary.NumberOfOffers` is "A list that contains the total number of offers for the item for the given conditions and fulfillment channels". Each entry (`OfferCountType`) holds `condition`, `fulfillmentChannel` (`Amazon` or `Merchant`) and `OfferCount`.
- `Summary.TotalOfferCount` is "The number of unique offers contained in NumberOfOffers".
- `Summary.BuyBoxEligibleOffers` counts the offers "eligible for the Buy Box for the given conditions and fulfillment channels".
- `Offers` is "the same length as the TotalOfferCount in the Summary or 20, whichever is less".
- Each `OfferDetail` carries:
  - `SellerId`;
  - `MyOffer` ("When true, this is the seller's offer");
  - `SubCondition`, `ConditionNotes`, `IsFulfilledByAmazon`, `SellerFeedbackRating` and `ShipsFrom`;
  - `IsBuyBoxWinner` ("There can be up to two Buy Box winners at any time per ASIN, one that is eligible for Prime and one that is not eligible for Prime");
  - `IsFeaturedMerchant` ("When true, the seller of the item is eligible to win the Buy Box").
- `getListingOffers` does the same for one of the seller's SKUs. `getItemOffersBatch` and `getListingOffersBatch` take up to 20 requests per batch (`maxItems: 20`).
- The model prints default usage plans: `getItemOffers` 0.5 requests per second with burst 1, `getItemOffersBatch` 0.1/1, `getListingOffersBatch` 0.5/1. The applied plan is returned in `x-amzn-RateLimit-Limit` and may be higher. These figures are for a human reader; the binding values are the model's at run time and the header's on each reply.

[official] (productPricingV0.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/product-pricing-api-model/productPricingV0.json, read 2026-10-14)

A2. **RULE: `ANY_OFFER_CHANGED` is the push form of the same picture, for items where the seller has an active offer.**
- It "is sent whenever there is a change to any of the top 20 offers, by condition (new or used), or if the external price (the price from other retailers) changes for an item that you sell, or if there is a change to which offer wins the BuyBox, or a change to the BuyBox price."
- "The top 20 offers are determined by the landed price, which is the price plus shipping minus Amazon Points."
- "You will only receive `ANY_OFFER_CHANGED` notifications for items for which you have active offers. You cannot subscribe to notifications for items for which you do not have active offers."
- The workflow is Amazon SQS. The payload carries:
  - `OfferChangeTrigger`: `MarketplaceId`, `ASIN`, `ItemCondition`, `TimeOfOfferChange` and `OfferChangeType`;
  - `Summary`: "The information in this summary applies to all conditions of the product". It holds `NumberOfOffers` (each `OfferCount` has `Condition`, `FulfillmentChannel` and "The total number of offers for the specified condition and fulfillment channel"), `NumberOfBuyBoxEligibleOffers`, `BuyBoxPrices`, `LowestPrices` and `CompetitivePriceThreshold`;
  - `Offers`: "The top 20 competitive offers for the item and condition that triggered the notification". Each offer has `SellerId`, `IsFulfilledByAmazon`, `IsBuyBoxWinner`, `IsFeaturedMerchant` and `SellerFeedbackRating`.
- `OfferChangeType` values, verbatim:
  - "External - The CompetitivePriceThreshold in the Summary object has changed, triggered by a new offer from a non-Amazon seller."
  - "Internal - The price of an offer on Amazon's retail website has changed."
  - "Featured Offer - The Buy Box winner or Buy Box price has changed."
- Subscriptions can be filtered by `marketplaceIds` and by `aggregationSettings`.

[official] (Notification Type Values, https://developer-docs.amazon.com/sp-api/docs/notification-type-values, updatedAt 2026-09-30, read 2026-10-14)

A3. **RULE: aggregation drops interim events.** `AggregationTimePeriod` is `FiveMinutes` or `TenMinutes`. "if FiveMinutes is the value chosen, and 50 price updates occur for an ASIN within 5 minutes, Amazon will send only two notifications … The 48 interim events will be dropped." A subscription therefore reports end states, not every offer that came and went. [official] (notifications.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/notifications-api-model/notifications.json, read 2026-10-14)

A4. **The notification schema file is thin.** In `AnyOfferChangedNotification.json`, every property description is the generator placeholder "An explanation about the purpose of this instance.", and the `Offers` example has no `IsBuyBoxWinner`. The documentation page (A2) is the readable definition. [official] (AnyOfferChangedNotification.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/schemas/notifications/AnyOfferChangedNotification.json, read 2026-10-14)

A5. **RULE: the FAQ's own boundaries.**
- `ANY_OFFER_CHANGED` "Alerts you when there is a price change to any of the top 20 offers or the Featured Offer". It "Contains the merchant offer only if it's in the top 20 offers". Unlike `PRICING_HEALTH`, "it does not alert you when an offer becomes ineligible for the Featured Offer."
- `getCompetitiveSummary` "builds upon the `getItemOffers` operation". It "returns all featured offers", with "segmented featured offer details, which include the specific customer segments (for example, Prime, Non-Prime and Glance views percentage) for each featured offer". Its offers can carry a `promotions` array (`COUPON`, `DEAL`, `BASKET_BUILDING`).

[official] (Product Pricing API and Notifications FAQ, https://developer-docs.amazon.com/sp-api/docs/pricing-faq, updatedAt 2026-09-09, read 2026-10-14)

A6. **RULE: `getCompetitiveSummary` names the Featured Offer holders, and their share by segment, at a moment.**
- `includedData` takes `featuredBuyingOptions`, `referencePrices`, `lowestPricedOffers` and `similarItems`. A batch holds at most 20 requests, and the default plan is 0.033 requests per second with burst 1.
- `featuredBuyingOptions[].segmentedFeaturedOffers[]` are offers with `sellerId`, `fulfillmentType` (`AFN`/`MFN`) and `featuredOfferSegments[]`.
- A segment is "a group of regional contexts that all have the same featured offer", where "A regional context is a combination of factors such as customer type, region, or postal code and buying option".
- `segmentDetails.glanceViewWeightPercentage` is "the glance views for this segment as a percentage of total glance views across all segments for the ASIN. A higher percentage indicates that more Amazon customers receive this offer as the Featured Offer."
- `buyingOptionType` "currently supports `NEW` as a value".
- `lowestPricedOffers[].offers` is "A list of up to 20 lowest priced offers" for the given condition and offer type.
- The operation needs the Pricing role, in the NA, EU and FE regions.

[official] (productPricing_2022-05-01.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/product-pricing-api-model/productPricing_2022-05-01.json, read 2026-10-14; Product Pricing API, https://developer-docs.amazon.com/sp-api/docs/product-pricing-api, updatedAt 2026-09-09, read 2026-10-14)

A7. **RULE: the FOEP read names the offer currently featured.** `getFeaturedOfferExpectedPriceBatch` (up to 40 requests) returns `currentFeaturedOffer` and `competingFeaturedOffer`, each with an `offerIdentifier` "used to identify the merchant of the featured offer. Since this may not belong to the requester, the SKU field is omitted." The `resultStatus` values include `VALID_FOEP`, `NO_COMPETING_OFFER`, `OFFER_NOT_ELIGIBLE`, `OFFER_NOT_FOUND` and `ASIN_NOT_ELIGIBLE`. "Featured offer is not guaranteed because competing offers might change." [official] (productPricing_2022-05-01.json, as above)

A8. **Trap: `averageOfferCount` is not an ASIN's offer count.** In `GET_SALES_AND_TRAFFIC_REPORT`, `averageOfferCount` sits in `TrafficByDate` (store level): "The average number of offers listed for sale in the selected time period". It counts the seller's own listings, not competing offers on one ASIN. [official] (sellerSalesAndTrafficReport.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/schemas/reports/sellerSalesAndTrafficReport.json, read 2026-10-14)

### B. Featured Offer share lost to other sellers

B1. **RULE: how the Featured Offer is chosen, as of the current US page.**
- "Amazon selects the Featured Offer for a product by evaluating all offers to determine which is the most attractive for the customer. When no single offer is clearly more attractive than the other competing offers, then the Featured Offer could be a rotation of the best offers."
- "the Featured Offer is determined separately for each variation", and customers "may see different Featured Offers when shopping from different shipping locations or when enrolled in a Prime membership".
- Factors considered: price ("Total price (item price plus shipping fee)"), delivery promise, free shipping, free returns and seller performance. Seller performance covers order volume, chargeback rate and Voice of the Customer complaints, including "Inaccurate website description", "Wrong item sent" and "Product condition not as expected".
- Not considered: "Customer reviews and star ratings" (of the seller), and, "If all other factors are equal", Prime eligibility and fulfilment method.
- "We rank offers the same way for every product, and we never use manual overrides".
- "As of September 2026, Amazon no longer maintains a seller eligibility requirement, and offers from all sellers are now eligible to be evaluated for the Featured Offer." Amazon still "will not feature any offer if none of the available offers meet our customer experience requirements, even if the product has only one available offer."
- "Your offer can't become featured if you're out of stock." The page also asks sellers to "Ensure the item is authentic and not expired".

[official] (Becoming the Featured Offer, https://sellercentral.amazon.com/help/hub/reference/external/G201687550, version 20, read 2026-10-14)

B2. **RULE: the eligibility gate is being removed, store by store, through 2026.**
- "Starting in July 2026, we'll begin removing seller eligibility requirements for the Featured Offer."
- "This change will roll out gradually across all Amazon stores globally, completing by the end of 2026."
- "We're not changing how the Featured Offer is selected."
- The former eligibility page now reads "This page has been removed. As of September 2026, Amazon no longer maintains a seller eligibility requirement".

[official] (Seller Forums, "Updates to Featured Offer eligibility requirements", News_Amazon, page shows "3 months ago", https://sellercentral.amazon.com/seller-forums/discussions/t/7336583f-09ac-41de-99d1-667017a88db2, read 2026-10-14; Featured Offer eligibility, https://sellercentral.amazon.com/help/hub/reference/external/G200418100, version 23, read 2026-10-14)

Note for this angle [seat]: a brand-new seller's offer is now evaluated on the same criteria as the brand's from its first day. A newly arrived seller with a lower total price no longer has to clear a seller-level gate before it can be featured.

B3. **RULE: Featured Offer percentage, as Business Reports define it.**
- Glossary: "The percentage of page views where the Featured Offer (the "Add to shopping cart" link) appeared on the page for customers to add your product to their cart. This percentage will be less than 100% if the page view occurred when: … The Featured Offer would result in the customer purchasing from another seller. … Your product was not available for purchase using the Featured Offer."
- Becoming the Featured Offer: "calculated as the total number of page views in which your offer is featured divided by the total number of page views for your products."
- Page Views – Total are "Visits to your offer pages". "When viewing the "Detail Page Sales and Traffic" report, page views are summed only for days when there was sales activity on the ASIN."

[official] (Business reports glossary, https://sellercentral.amazon.com/help/hub/reference/external/G27691, version 7, read 2026-10-14; Becoming the Featured Offer, as above)

B4. **RULE: the same metric in the API, under two names and two denominators.**

| Source | Field | Amazon's definition |
|---|---|---|
| `GET_SALES_AND_TRAFFIC_REPORT`, `TrafficByAsin` and `TrafficByDate` | `buyBoxPercentage` | "The percentage of page views where the buy box (the add to shopping cart link) appeared on the page for customers to add your product to their cart." |
| Data Kiosk `analytics_salesAndTraffic_2024_04_24` | `buyBoxPercentage` (and `buyBoxPercentageB2B`) | Same wording, page views |
| Data Kiosk `analytics_sellerAnalytics_2025_03_31`, `Traffic` | `featureOfferPct` | "how often your offer is the Featured Offer when customers can add to their cart. It's calculated by dividing the number of times your offer is the Featured Offer by the number of times customers viewed it (that is, Glance Views)." |
| same | `featureOfferGlanceViews` | "the count of glance views where your product appeared as the Featured Offer on the search results page" |

The two families use different denominators: page views against Glance Views. A file that treats them as one series mixes two measures; `method/effect-measurement.md`, `angles/price-position.md`, `angles/own-traffic-funnel.md` and `method/funnel-and-search.md` also keep them apart. Two further points from the same schema, recorded as written: `featureOfferGlanceViews` speaks of "the search results page" although the metric sits beside detail-page glance views, and `featureOfferPct` carries `@paamRights(require: ["analytics_sales_and_traffic_view_pa", "analytics_sales_and_lending_view"])` (which seller role grants those rights is `method/sp-api-access.md`'s to state, not this file's). [official] (sellerSalesAndTrafficReport.json, as above; analytics_salesAndTraffic_2024_04_24.graphql and analytics_sellerAnalytics_2025_03_31.graphql, https://github.com/amzn/selling-partner-api-models/tree/main/schemas/data-kiosk, read 2026-10-14)

B5. **RULE: a price-based Featured Offer loss has its own signal; a loss to another seller does not.**
- `PRICING_HEALTH` "is sent whenever a seller offer is ineligible to be the Featured Offer (Buy Box offer) because of an uncompetitive price".
- The Pricing Health page lists "offers that are currently ineligible to become the Featured Offer" because they are not "priced competitively compared with other retailers outside of Amazon (the competitive external price)" or are "priced significantly higher than recent prices". It also lists offers "priced within 5% of the Featured Offer price".
- Losing the Featured Offer to a better offer on Amazon raises no eligibility notice. It shows only as a lower Featured Offer percentage or a different holder.

[official] (Notification Type Values, as above; Pricing Health, https://sellercentral.amazon.com/help/hub/reference/external/GSTH6YN3BR8XNWBW, version 22, read 2026-10-14)

B6. **Regulator note (EU): a second offer box.** In the European Commission's commitments decision, Amazon committed to "treat all sellers equally when ranking the offers for the purposes of the selection of the Buy Box winner". It also committed to "display a second competing offer to the Buy Box winner if there is a second offer from a different seller that is sufficiently differentiated from the first one on price and/or delivery". The duration of the second-offer commitment was raised "to seven years". The release is dated 2022-12-20. This binds Amazon's EU stores. On an EU marketplace, a hijacker can therefore be shown next to the Featured Offer rather than hidden behind it. [research: regulator document, not Amazon's page] (European Commission press release IP/22/7777, "Antitrust: Commission accepts commitments by Amazon barring it from using marketplace seller data, and ensuring equal access to Buy Box and Prime", https://ec.europa.eu/commission/presscorner/detail/en/ip_22_7777, read 2026-10-14 through the press corner's document service)

### C. Reviews and returns when another seller ships the units

C1. **RULE: ratings and reviews belong to the ASIN, not to the seller.** "New listing (SKU) creation won't impact your product's ratings and reviews, because those metrics are measured for an ASIN. In addition, there will be no impact on your seller ranks and feedback which is measured across your seller profile." A bad unit shipped by another seller on the same ASIN therefore lands in the ASIN's reviews, which every seller on it shares. [official] (FBA Barcode Choice and Labeling FAQ, https://sellercentral.amazon.com/help/hub/reference/external/GEFKUGES6NSE7CBP, version 8, read 2026-10-14)

C2. **RULE: the detail page is common to every seller's offer.** "a product detail page allows customers to view a specific product available on Amazon with information common to all sellers' offers for that product, such as the product's title, brand, images, bullet points, descriptions, variations (such as size or color) and customer reviews. It can include one or more offers from both sellers or Amazon." [official] (Intellectual property for Rights Owners and Registered Agents, https://sellercentral.amazon.com/help/hub/reference/external/GU5SQCEKADDAQRLZ, version 8, read 2026-10-14)

C3. **RULE (2026 change): FBA commingling has ended.**
- "As of March 31, 2026, FBA barcode requirements have changed. Brand owners can continue to use manufacturer barcodes without stickers. Resellers are now required to use Amazon barcodes for products even if they have a manufacturer barcode."
- Commingling was "when we fulfill customer orders using exact product matches from the closest available inventory, even if that inventory belonged to a different seller".
- "This change means customers who buy from you will only receive products from your inventory, including returns and removals."
- "As of March 31, 2026, all resellers, including authorized resellers, must use Amazon barcodes".
- The stickerless exemption needs "the Brand Representative selling role", which the seller checks in "Seller Central Brand Relationships".
- Stickerless reseller units already in the network before the date "will continue to sell under their original SKUs".

[official] (FBA Barcode Choice and Labeling FAQ, as above; FBA barcode requirements, https://sellercentral.amazon.com/help/hub/reference/external/G201100910, version 22, read 2026-10-14)

C4. **RULE: authenticity and condition are policy, enforced against the offending seller.**
- "Products offered for sale on Amazon must be authentic." Amazon "may immediately suspend or terminate your Amazon selling account", and "we remove suspect listings based on our own review of products."
- Rights owners with authenticity concerns are pointed to Amazon's infringement form.
- A product listed as New must arrive "in brand new, unopened condition", and its "language, country version, model, or edition must match the description on the page". Approval is required "to list under brands, ASINs, or categories with listing restrictions."

[official] (Amazon Anti-Counterfeiting policy, https://sellercentral.amazon.com/help/hub/reference/external/G201165970, version 7, read 2026-10-14; Amazon product authenticity and quality, https://sellercentral.amazon.com/help/hub/reference/external/G202010130, version 4, read 2026-10-14)

C5. **What the seller's own return data does and does not hold.** Data Kiosk seller analytics `Returns.returnedUnits` is "Number of units returned by customers with a resolution (refund or replacement) … mapped to the day each unit was shipped". "Return data is computed with a delay of about 45 days". `Defects.topics[]` gives `returnDefectTopic`, `returnDefectFrequency` ("trailing six months") and `returnDefectRecommendations`. The `Reviews` group gives `lowRatingReviewCount` and `totalReviewCount`. [official] (analytics_sellerAnalytics_2025_03_31.graphql, as above) Whether `Returns` counts only the seller's own shipments is not stated on the schema. C3's "only receive products from your inventory, including returns" points that way (see Open questions).

### D. Detail-page contribution conflicts (re-read for this angle)

D1. **RULE: another contributor can win the page.**
- "When evaluating contributions, we consider sales volume, refund rate, buyer feedback, and A-to-z guarantee claims."
- "For brand-registered ASINs, attribute values from sellers with brand selling roles appear on the product detail page".
- Between a Brand Representative and a Reseller of the same brand, "the contribution from the seller with a Brand Representative role is displayed".
- "If your contribution is verified by Amazon, they will show on the product detail page within 48 hours. If, after the allotted period, your contributions do not show on the product detail page, it means Amazon's system has selected another contributor's information".
- "Amazon doesn't share Administrator contact details".

[official] (Suggest changes to your product detail page, https://sellercentral.amazon.com/help/hub/reference/external/G200335450, version 23, read 2026-10-14)

D2. **RULE: no mediation, no disclosure, and Report Abuse for branded-ASIN contributions.**
- "If several authorized users of a brand have the same selling role and contribute to the same ASIN, those contributions will be weighted equally".
- "We won't mediate between authorized users … nor will we disclose information about the users who have the displayed contribution. This includes, but isn't limited to, seller names, seller IDs, merchant tokens, and email addresses."
- "Contributions made by an authorized user to a Brand Registry branded ASIN can't be edited by the Selling Partner Support team. If there's incorrect information on a product detail page, refer to Account Health - Report Abuse".

[official] (Product detail page rules, https://sellercentral.amazon.com/help/hub/reference/external/G200390640, version 21, read 2026-10-14)

D3. **RULE: turning a page into a different product is prohibited.** The ASIN creation policy bans "Changing the product's detail page (parent or child) to become fundamentally different from the original product listed", and adding child variations that are not true variations. Separately, "we limit sellers who do not have a selling role assigned by a brand from creating new ASINs under that brand when the brand is enrolled in Brand Registry." [official] (ASIN creation policy, https://sellercentral.amazon.com/help/hub/reference/external/G201844590, version 27, read 2026-10-14)

D4. **The brand owner's push signal for content changes** is `BRANDED_ITEM_CONTENT_CHANGE`. It covers title, description, bullet points and images, says which attributes changed, and gives no actor and no values. That notification, and the Listings-against-Catalog diff, are recorded in `angles/brand-protection-and-catalog-contribution.md` (items 29–31). They were re-read on the same Notification Type Values page for this file and are not repeated here.

### E. The Brand Registry remedies, by case

E1. **RULE: Report a Violation is one guided tool (2026), open to every Brand Registry user for store-policy reports.**
- The Sell on Amazon announcement "Report brand violations faster with one guided experience" is by Mickey Toogood, dated Jul 31, 2026. It says the tool "now offers a single, guided experience for reporting intellectual property (IP) infringement, store policy violations, and regulatory compliance concerns".
- Features: "One destination", "Guided forms: Structured fields replace free-text forms", and "A Submission History tab tracks every report's status and outcome in real time."
- "Brands must be enrolled in Brand Registry to access Report a Violation. Any Brand Registry user associated with an enrolled brand can report store policy violations—you do not need to be assigned the Rights Owner role."

[official] (Report a Violation: all reports in one place, https://sell.amazon.com/blog/announcements/report-a-violation, read 2026-10-14)

E2. **RULE: IP reports need a protection role and work at three grains.**
- "To report an IP infringement, you must be a Brand Registry user with either the Rights Owner role or the Registered Agent role."
- For trademarks:
  - "ASIN-level: If a product or product packaging available on Amazon bears your trademark, but you don't make that product, then you may report the entire ASIN".
  - "Seller-level: If you believe a particular offer from a seller is listing a product that infringes your trademark, then you may report that offer as infringing. However, expect the product detail page and ASIN to remain live if you report an offer … It's also helpful to provide a test buy with a valid order ID".
  - "Product detail page: If your trademark is being used on the product detail page, but the product being sold is not your product, you may report use of the trademark on the product detail page as infringing."
- "If the infringing seller is listing on your ASIN, ensure the specific sellers are identified to safeguard against the entire ASIN being affected." The form "will automatically generate a list of sellers who are listing an ASIN" and offers "All sellers or the Specific sellers".
- "Do not submit more than one type of IP violation per notice."
- "We do not take action on intellectual property notices concerning registered trademarks, designs, or patents from countries other than the country for which takedown is requested."
- "Minimum advertised price (MAP) agreements: … violations of such agreements do not constitute intellectual property rights infringement. … we don't assist in this type of enforcement activity."
- Parallel imports: in the EEA and Brazil, rights owners "may prohibit third parties from importing their goods … without their consent", and can report parallel imports as trademark or copyright infringement. Amazon recommends a test buy.

[official] (Intellectual property for Rights Owners and Registered Agents, GU5SQCEKADDAQRLZ, as above)

E3. **RULE: Report Abuse is the route for policy violations and inaccurate listings outside IP.**
- Brand Registry FAQ: "You can use the Report abuse tool to report inaccurate listing information, violations of Amazon policy, and other issues. … select Performance, then Account Health. On the Account Health page, select Report abuse. If you don't have access to Seller Central, you can report issues using Brand Registry Support. Log in to your Brand Registry account and select Contact us from your homepage, then select Report a marketplace policy violation."
- The help page's steps: "Go to Report abuse. Select the violation type. Provide the concerned order ID or ASIN/ISBN". Include "The store or business name of the seller that you are reporting", "A concise explanation of the violation based on the policy" and supporting documents. "For privacy reasons, the results of our investigations can't be disclosed".

[official] (Amazon Brand Registry | Sell on Amazon, https://sell.amazon.com/brand-registry, read 2026-10-14; brandservices.amazon.com redirects there; Report a violation, https://sellercentral.amazon.com/help/hub/reference/external/G200444420, version 14, read 2026-10-14)

E4. **RULE: Project Zero is self-service removal of counterfeits only.**
- "Use Project Zero's self-service tool to search for counterfeit listings and immediately remove them from the Amazon store."
- "If you locate a suspected counterfeit, we recommend performing a test buy to confirm the violation. Once confirmed, you can return to the tool to remove individual offers or an entire product listing."
- "When you remove a counterfeit from the Amazon store, a notice of complaint is sent to each seller associated with the removal."
- "Project Zero's self-service counterfeit removal tool should only be used to remove counterfeit listings." "Counterfeiting requires the use of a registered trademark on the product, packaging, or the product detail page to imply that the product is genuine."
- Eligibility: rights owner of a registered trademark; use of Report a Violation "within the last six months" with "at least a 90% acceptance rate"; and "A history of using Brand Registry and the Report a Violation tool in accordance with Amazon's policies".
- Brands "must maintain an accuracy rate of at least 99% in order to maintain access". A 90% rate alone may not qualify: "We determine eligibility by reviewing a user's acceptance rate alongside additional criteria".
- Access is per store "where your brand has an active, registered trademark". The tool is free.

[official] (Project Zero | Sell on Amazon, https://sell.amazon.com/brand-registry/project-zero, read 2026-10-14)

E5. **RULE: Transparency blocks units and listing attempts without valid codes; it does not stop genuine coded resale.**
- "Once your products are protected, a valid Transparency code must accompany every unit listed or shipped in Amazon's Transparency-supported stores".
- "Once your products are fully protected by Transparency, they cannot be listed in Amazon's Transparency-supported stores without valid Transparency codes that match the enrolled product."
- "Alternative versions or materially different product variations will not pass listing verification. Products made for other global stores will not pass listing verification."
- "Transparency protections aren't active until your product passes the operational performance review."
- The performance report shows "Units blocked from shipment due to missing or invalid codes", "Scans where codes didn't match the enrolled product" and "Listing attempts rejected due to missing valid codes".
- Supported stores: "the US, Canada, Germany, France, Italy, Spain, the UK, Australia, India, and Japan."
- Eligibility: the "rights owner" role and a GTIN per product. Codes are paid per unit, and the prices are on the page.

[official] (Transparency | Sell on Amazon, https://sell.amazon.com/brand-registry/transparency, read 2026-10-14)

E6. **RULE: the other Brand Registry routes named on Amazon's pages.**
- Amazon Patent Evaluation Express (US utility patents): both parties deposit $5,000 with a neutral evaluator, and "Amazon follows the decision of the evaluator".
- The Counterfeit Crimes Unit: "Work with law enforcement and our global team to stop bad actors".
- Selling roles are managed by "Brand Administrators … via the Manage selling accounts tool in the Brand Registry portal".

[official] (Amazon Brand Registry | Sell on Amazon, as above; Product detail page rules, as above)

E7. **Not read: the Brand Registry Support case types ("update a product detail page" and similar).** `https://brandregistry.amazon.com/help/` and the Manage selling accounts page both redirected to the Brand Registry sign-in. The catalogue case escalation is known here only through the public pages above and the Seller Central routes in `angles/brand-protection-and-catalog-contribution.md` (Selling Partner Support with proof; "Request product detail page change" on error 8541).

### F. Brand-protection changes in 2025–2026, as Amazon states them

- **2025-03 (blog) and 2026-07-31 (announcement): Report a Violation consolidated.** IP, store policy and regulatory reports in one guided flow, with Submission History. Store-policy reports are open to any Brand Registry user (E1). The March 26, 2025 blog "How to report a violation to Amazon" now carries the same "single, guided experience" wording. [official] (How to report a violation to Amazon, https://sell.amazon.com/blog/report-a-violation-to-amazon, read 2026-10-14; E1)
- **2025-07-03: Standards for Brands (blog).** For the high-recognition brands the policy covers ("less than 0.01% of brands in our store"), Amazon "may choose to source certain products from the manufacturer and sell them directly to customers ourselves". The policy is applied also to a reseller that has "stepped into the brand's shoes". This means Amazon retail can be one of the offers on such an ASIN. [official] (Standards for Brands Selling in the Amazon Store, https://sell.amazon.com/blog/standards-for-brands, read 2026-10-14)
- **2026-03-31: FBA commingling ended** (C3).
- **2026-07 to end of 2026: Featured Offer seller eligibility removed** (B2).
- **2025 report (published April 2026).**
  - "Amazon's proactive controls blocked more than 99.9% of suspected infringing listings before a brand owner ever had to find and report them."
  - Amazon "scans billions of attempted changes to product detail pages daily".
  - "In 2025, Transparency joined GS1 as a Premier Solution Partner".
  - "in 2026, Amazon is expanding Amazon's Counterfeit Crimes Unit's (CCU) enforcement efforts to India".
  - Customers can flag "a detail page inaccuracy" through "Report an issue with this product or seller".

  [official] (Amazon's Trustworthy Shopping Experience Report, https://trustworthyshopping.aboutamazon.com/2025-trustworthy-shopping-experience-report, "Published April 2026", read 2026-10-14)
- **2026-06-05: "What is Amazon Brand Registry?" (blog).** It restates Report a Violation as "a single, guided experience" and lists Brand Registry's tools. It names no "Brand Elevation". [official] (What is Amazon Brand Registry? How does it work?, https://sell.amazon.com/blog/what-is-amazon-brand-registry, read 2026-10-14)
- **Not found in Amazon's words:** "Brand Elevation", or a June 2026 tightening of ASIN creation. The current ASIN creation policy (version 27) states the selling-role limit with no date. See "What practitioners add" and "Open questions".

## What practitioners add

- **Canopy Management: a three-way triage.** Chuck Kessler (Canopy Management), "Amazon Hijackers: How to Remove Unauthorized Sellers", published 2026-10-09.
  - Counterfeiter → "Trademark or counterfeit reports with evidence, usually a test buy".
  - Unauthorized reseller → "Generally nothing for the resale itself. Amazon treats it as a business dispute unless the product is materially different or the seller breaks a store policy".
  - Detail page hijack → "Detail page abuse reports".
  - "Brands lose weeks when they treat every unwanted seller as a counterfeiter … damage the reporting accuracy Amazon uses to decide who gets its strongest tools."
  - "Every stockout hands the Featured Offer to whoever else is on the listing." "Check offers and listing content weekly."
  - On Transparency: "It doesn't stop a reseller with genuine, coded product".
  - It also claims "Amazon tightened ASIN creation rules again in June 2026", with no Amazon link on that line.
  - Agreement with Amazon: matches E2–E5 and B1. The June 2026 claim is not confirmed on an Amazon page read here.

  [opinion] (https://canopymanagement.com/amazon-hijackers-unauthorized-sellers/, read 2026-10-14)

- **eComEngine (SellerPulse help): what an offer-count alert is for.** "What should I do if the number of offers on my listing changed?" (page undated).
  - "A new seller on your Amazon listing might be a piggybacker, counterfeiter, or hijacker."
  - Their tool alerts "whenever the number of offers on your listing increases or decreases".
  - "If you don't sell your own branded products and don't have an exclusive wholesale relationship with your supplier, it is generally legal (and allowed by Amazon) for other sellers to sell the same product on the same listing."
  - It warns that raising price too far "could cause Amazon to make your offer ineligible to win the Buy Box, even if you are the only seller".

  [opinion] (https://www.ecomengine.com/help/hijacker-number-offers-changed, read 2026-10-14)

- **eComEngine: reviews and Featured Offer.** Ellen Sipp (eComEngine), "How to Deal with Amazon Hijackers and Protect Your Account" (page shows May 2, 2023 and an update January 12, 2026).
  - "the negative reviews that follow will be displayed on your listing."
  - Hijackers "typically undercut you on price which can cause you to lose the Buy Box".
  - The tool also alerts when "listing content (title, main image, and brand name) has been modified".
  - It reports a tactic of getting a listing labelled "adult" so it drops from search.

  [opinion] (https://www.ecomengine.com/blog/how-to-deal-with-amazon-hijackers, read 2026-10-14)

- **Jungle Scout: monitoring and a 2% claim.** Jungle Scout, "The Right Way to Deal With Unauthorized Sellers on Amazon", 2025-01-31.
  - "A sudden dip in sales could indicate that an unauthorized seller has taken control of the Buy Box".
  - "Amazon will equally share the Buy Box on a listing as long as each seller's pricing is within 2% of each other."
  - Disagreement: Amazon's page says only that the Featured Offer "could be a rotation of the best offers" when none is clearly better (B1), and gives no 2% band. The 2% figure has no Amazon source and is not for a skill.

  [opinion] (https://www.junglescout.com/resources/articles/how-to-deal-with-unauthorized-sellers/, read 2026-10-14)

- **SellerApp: returns and ODR as signals; overstatement of price.** Brij Purohit (SellerApp), "How to Remove Unauthorized Sellers on Amazon in 2026", published 2025-09-15, modified 2026-10-07.
  - Spikes in returns, negative feedback or "claims about damaged or counterfeit items" may mean "an unauthorized seller piggybacking on your ASIN".
  - A practice: "look at FNSKU … labels in customer returns to see if units trace back to their own authorized inventory".
  - Escalation: "request escalation to the Counterfeit Crimes Unit".
  - It also says the algorithm "doesn't care who owns the brand; it cares who offers the cheapest landed cost". That contradicts Amazon's multi-factor list (B1).
  - With commingling ended (C3), a counterfeit wave no longer reaches the brand's own FBA returns through a shared pool. The ODR and returns signal it describes is now mostly the ASIN's reviews, not the brand's own metrics [seat].

  [opinion] (https://www.sellerapp.com/blog/unauthorized-sellers-on-amazon/, read 2026-10-14)

- **My Amazon Guy on commingling.** Noah Wickham (My Amazon Guy), "Amazon Commingling Program Ending In March 2026", 2025-12-12.
  - It repeats the March 31, 2026 date. It quotes a passage saying the phase-out completes "by mid-2026" and cites GeekWire (Todd Bishop).
  - It says "Resellers not enrolled in Brand Registry must now use Amazon barcode labeling".
  - Disagreement with Amazon: Amazon says "all resellers, including authorized resellers" (C3).

  [opinion] (https://myamazonguy.com/news/amazon-commingling-program-ending/, read 2026-10-14)

- **My Amazon Guy on ASIN-creation enforcement (2025).** Noah Wickham, "Walmart and Amazon vs Unauthorized Sellers", 2025-07-28. It reports seller-forum accounts of LEGO listings deactivated for all sellers under the ASIN Creation Policy, and that "Ungating is no longer permanent". These are second-hand seller accounts, not an Amazon statement. [opinion] (https://myamazonguy.com/news/walmart-and-amazon-vs-unauthorized-sellers/, read 2026-10-14)

- **My Amazon Guy on Featured Offer eligibility.** "Amazon Featured Offer Eligibility Criteria Updated in 2026", 2026-07-08. It agrees with Amazon that the gate is removed and selection unchanged. It adds that "Amazon has not disclosed how individual ranking factors are weighted". [opinion] (https://myamazonguy.com/news/amazon-featured-offer-eligibility-criteria/, read 2026-10-14)

- **Sellers' reaction to the eligibility change** (seller replies on the News thread, all "3 months ago"). Brand owners say they had been unable to win the Featured Offer on their own listings. One reply reads "I can't match a cheap knock off or a stolen goods listing on...other site(s)." None of the replies read raised hijackers by name. [opinion: seller forum replies] (Updates to Featured Offer eligibility requirements, as above)

- **Marketplace Pulse (Juozas Kaziukėnas), context only.**
  - "The Disappearing Amazon Resellers", January 26, 2021: the reseller model declined as brands went direct, and the remaining resellers often act as agencies.
  - "Slaying the Hydra of Counterfeits", July 25, 2018: brand gating is "Amazon making the decision".
  - Both are old and are background for a human reader, not skill positions.

  [opinion] (https://www.marketplacepulse.com/articles/the-disappearing-amazon-resellers; https://www.marketplacepulse.com/articles/slaying-the-hydra-of-counterfeits, read 2026-10-14)

- **Brand Elevation** (Salsify, My Amazon Guy, Shopifreaks; June 2026) is recorded in `angles/brand-protection-and-catalog-contribution.md`. No Amazon page read in this session names it either.

## Published research

- **Le Chen, Alan Mislove, Christo Wilson, "An Empirical Analysis of Algorithmic Pricing on Amazon Marketplace", WWW 2016 (Montréal).**
  - Data: four months covering "all merchants selling any of 1,641 best-seller products".
  - Finding: "low prices are the most important feature used by the Buy Box algorithm to select sellers, but that customer feedback and ratings are also used".
  - Finding: algorithmic sellers "win" the Buy Box more often, "even when they do not offer the lowest price".
  - Finding: "only 13% of products have static Buy Box prices over the entire period", and "the seller winning the Buy Box is constant for 31% of products".
  - Finding: "only 60% of the top-ranked sellers win the Buy Box".
  - Transfer: this is 2015 data on best-sellers with many resellers, before the 2026 removal of seller eligibility. It supports two narrow points. Featured Offer holders change often on multi-seller ASINs, so one snapshot is not a share. And the lowest price does not always win. It says nothing about brand-owned private-label ASINs.

  [research] (author copy, https://mislove.org/publications/Amazon-WWW.pdf, read 2026-10-14; the ACM page https://dl.acm.org/doi/10.1145/2872427.2883089 returned 403)

- **Yi Qian, "Counterfeiters: Foes or Friends? How Counterfeits Affect Sales by Product Quality Tier", Management Science, 2014.** Not read: the INFORMS page returned 403. It is not cited for any finding.
- No peer-reviewed study of hijacking on a shared Amazon ASIN, or of review contamination by another seller's units, was found by the routes open to this session (no web search).

## Stable enough for a skill

- An ASIN's offers can be read by condition and fulfilment channel (`Summary.NumberOfOffers`), with a capped list of individual offers. Each offer carries a seller id and a flag for the seller's own offer (`MyOffer`). (productPricingV0.json)
- The individual-offer list is capped (the cap is the one the model's `Offers` description states, read at run time), while the counts cover every offer. A new seller priced above the capped list's cheapest offers shows in the counts and not in the list. (productPricingV0.json; Notification Type Values)
- `ANY_OFFER_CHANGED` exists only for items where the seller has an active offer. It needs an SQS destination, and with aggregation it sends end states, not every event. (Notification Type Values; notifications.json)
- `getCompetitiveSummary` names the Featured Offer holder(s) by segment, with each segment's share of glance views, at the moment of the call. It is a snapshot, not a period share. (productPricing_2022-05-01.json; Product Pricing API and Notifications FAQ)
- Over a period, the seller's Featured Offer share is Amazon's Featured Offer percentage. Business Reports and `GET_SALES_AND_TRAFFIC_REPORT` measure it over page views (`buyBoxPercentage`). Data Kiosk seller analytics measures it over Glance Views (`featureOfferPct`). The two are different series. (Business reports glossary; sellerSalesAndTrafficReport.json; analytics_sellerAnalytics_2025_03_31.graphql)
- The Featured Offer is decided per variation and can differ by customer location and Prime membership. An out-of-stock offer cannot be featured. Amazon may feature no offer at all. (Becoming the Featured Offer)
- Amazon is removing the seller-level eligibility gate store by store. Where it is gone, every seller's offer is evaluated on the same selection criteria. (Updates to Featured Offer eligibility requirements; Becoming the Featured Offer; Featured Offer eligibility)
- A Featured Offer loss for price raises `PRICING_HEALTH` and shows in Pricing Health. A loss to a better offer on Amazon raises no eligibility notice. (Notification Type Values; Pricing Health)
- Ratings and reviews are measured for the ASIN and are shared by every seller on it. The detail page content is common to all offers. (FBA Barcode Choice and Labeling FAQ; Intellectual property for Rights Owners and Registered Agents)
- FBA commingling has ended. Customers who buy from a seller receive that seller's inventory, and resellers must label units with Amazon barcodes. (FBA Barcode Choice and Labeling FAQ; FBA barcode requirements)
- Selling genuine goods against a distribution or MAP agreement is not IP infringement, and Amazon does not enforce such agreements. (Intellectual property for Rights Owners and Registered Agents)
- IP reports can target the whole ASIN, specific sellers' offers or the use of a trademark on the detail page. Reporting an offer leaves the ASIN live. One notice carries one IP type, and the registration must be in the country of takedown. (Intellectual property for Rights Owners and Registered Agents)
- Store-policy reports through Report a Violation are open to any Brand Registry user of the brand. IP reports need the Rights Owner or Registered Agent role. Report Abuse in Account Health covers inaccurate listings and policy violations. (Report a Violation: all reports in one place; Intellectual property for Rights Owners and Registered Agents; Amazon Brand Registry | Sell on Amazon; Report a violation)
- Project Zero removes counterfeit offers or listings only. Access depends on report acceptance and accuracy rates that Amazon states on the Project Zero page, and Amazon recommends a test buy first. (Project Zero)
- Transparency blocks units and listing attempts without valid codes for enrolled products in supported stores. It does not block genuine coded units resold by others. (Transparency; Canopy Management agrees)
- Amazon does not disclose who made a winning contribution, does not mediate between authorised users, and does not disclose investigation results. (Product detail page rules; Report a violation)

## What cx must read at run time

- **Offers on the seller's ASIN, now:** `getItemOffers` for the ASIN, once per relevant `ItemCondition` (New at least), `CustomerType=Consumer`. Read:
  - `Summary.NumberOfOffers[]` (condition × channel), `Summary.TotalOfferCount` and `Summary.BuyBoxEligibleOffers`;
  - `Offers[]`: `SellerId`, `MyOffer`, `IsBuyBoxWinner`, `IsFulfilledByAmazon`, `SubCondition`, `SellerFeedbackRating`, `ShipsFrom`.

  `getListingOffers` / `getListingOffersBatch` do the same from the seller's SKU. The call shape and rate are door.md's to own; the operations are `getItemOffers`, `getItemOffersBatch`, `getListingOffers` and `getListingOffersBatch`. `MyOffer` identifies the seller's own offer without knowing its seller id. door.md names the routes to the seller id itself: Finances `transactions` (`sellingPartnerMetadata.sellingPartnerId`) and the v0 `getPricing` reply by SKU (`Product.Identifiers.SKUIdentifier.SellerId`). The Sellers API's two paths carry no seller id (sellers.json). The FOEP `offerIdentifier.sellerId` below is the featured offer's merchant, which "may not belong to the requester", so it is never the route to the seller's own id.
- **Who holds the Featured Offer, by segment:** `getCompetitiveSummary` with `includedData=featuredBuyingOptions,lowestPricedOffers`. Read `segmentedFeaturedOffers[].sellerId`, `fulfillmentType`, `featuredOfferSegments[].segmentDetails.glanceViewWeightPercentage`, and any `promotions` on a competing offer. Its default rate is low (the model prints it). `getFeaturedOfferExpectedPriceBatch` gives `currentFeaturedOffer.offerIdentifier.sellerId` per SKU.
- **The seller's Featured Offer share over a window:** `GET_SALES_AND_TRAFFIC_REPORT` by ASIN (`buyBoxPercentage`, page-view basis), or Data Kiosk `analytics_sellerAnalytics_2025_03_31` `traffic.featureOfferPct` (Glance View basis). The report name, options and waits are door.md's; the operations are `createReport` / `getReport` / `getReportDocument`, and `createQuery` for Data Kiosk. A window's figure is compared only with a figure from the same source.
- **Offer history (Keepa):** `cx get amazon/us/<ASIN>/product --source keepa` with offers requested. Fields:
  - `csv[11]` (COUNT_NEW, "New offer count history"), `csv[34]` (COUNT_NEW_FBA, "includes Amazon offer") and `csv[35]` (COUNT_NEW_FBM);
  - `buyBoxSellerIdHistory` ("-1" none qualified, "-2" "a brand new one");
  - `stats.buyBoxStats` (per seller id: `percentageWon`, "an approximation of the percentage the seller won the buy box"; `avgPrice`; `avgNewOfferCount`; `isFBA`; `lastSeen`) for the stats interval;
  - `stats.totalOfferCount`, `stats.buyBoxIsAmazon`, `stats.buyBoxIsFBA` and `stats.sellerIdsLowestFBA`;
  - `offers[]` with `liveOffersOrder` (only these indices are current), each offer's `sellerId`, `isFBA`, `isAmazon`, `isMAP`, `isShippable`, `lastSeen` and `stockCSV`;
  - `offersSuccessful` (if false, a missing offer proves nothing).

  The keepa skill's `product-file.md` owns the reading rules.
- **Push signals, if the box ever has destinations:** `ANY_OFFER_CHANGED` (SQS), `PRICING_HEALTH` (SQS) and `BRANDED_ITEM_CONTENT_CHANGE` (EventBridge). Until then the reads above run on the review cadence and are diffed against the stored copy.
- **What the page shows against what the seller submitted:** `getCatalogItem` against `getListingsItem` (see `angles/brand-protection-and-catalog-contribution.md`).
- **The ASIN's reviews and the seller's returns:** Data Kiosk seller analytics `reviews` (`lowRatingReviewCount`, `totalReviewCount`), `returns` and `defects.topics`. Keepa `csv[16]` (`RATING`) gives rating history. `csv[17]` (`COUNT_REVIEWS`) is "The product's review count history" in Keepa's Java client (`Product.java`) and "rating count history" on Keepa's documentation page (as recorded in `angles/competitor-set.md` and `angles/reviews-and-qa.md`); Keepa's two documents name it differently, so cx names the count as the document it cites does. Keepa's note that the history "has not been updated since April 9th 2025" is written for the variation-specific `reviews.ratingCount`, not for `csv[17]`; whether slot 17 froze too is unstated. The remaining caveats are recorded in `angles/reviews-and-qa.md`.
- **Seller Central only (no API):**
  - the seller's selling role, at Seller Central → Brand Relationships (the page Amazon names in the commingling FAQ);
  - Report a Violation, Submission History, Project Zero and Transparency enrolment, in the Brand Registry portal;
  - Report Abuse, in Account Health;
  - the Featured Offer column in Manage All Inventory, and Pricing Health.

  cx asks the seller to read or export them.

## Pages read

| Page name | URL | Date read | What it gave |
|---|---|---|---|
| productPricingV0.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/product-pricing-api-model/productPricingV0.json | 2026-10-14 | getItemOffers / getListingOffers / batches; NumberOfOffers by condition and channel; MyOffer, IsBuyBoxWinner, IsFeaturedMerchant; default rates; batch max 20 |
| productPricing_2022-05-01.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/product-pricing-api-model/productPricing_2022-05-01.json | 2026-10-14 | getCompetitiveSummary includedData, segments, glanceViewWeightPercentage, batch 20, rate; FOEP current/competing featured offer |
| Product Pricing API (v2022-05-01 guide) | https://developer-docs.amazon.com/sp-api/docs/product-pricing-api | 2026-10-14 (updatedAt 2026-09-09) | Pricing signals table; Pricing role; release-note dates |
| Product Pricing API and Notifications FAQ | https://developer-docs.amazon.com/sp-api/docs/pricing-faq | 2026-10-14 (updatedAt 2026-09-09) | ANY_OFFER_CHANGED vs PRICING_HEALTH; competitive summary "returns all featured offers" |
| Notification Type Values | https://developer-docs.amazon.com/sp-api/docs/notification-type-values | 2026-10-14 (updatedAt 2026-09-30) | ANY_OFFER_CHANGED scope, payload, OfferChangeType; PRICING_HEALTH; BRANDED_ITEM_CONTENT_CHANGE |
| AnyOfferChangedNotification.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/schemas/notifications/AnyOfferChangedNotification.json | 2026-10-14 | Structure; placeholder descriptions |
| notifications.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/notifications-api-model/notifications.json | 2026-10-14 | AggregationTimePeriod and the dropped interim events |
| sellerSalesAndTrafficReport.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/schemas/reports/sellerSalesAndTrafficReport.json | 2026-10-14 | buyBoxPercentage (page views); averageOfferCount is store-level by date |
| analytics_salesAndTraffic_2024_04_24.graphql | https://github.com/amzn/selling-partner-api-models/blob/main/schemas/data-kiosk/analytics_salesAndTraffic_2024_04_24.graphql | 2026-10-14 | buyBoxPercentage wording |
| analytics_sellerAnalytics_2025_03_31.graphql | https://github.com/amzn/selling-partner-api-models/blob/main/schemas/data-kiosk/analytics_sellerAnalytics_2025_03_31.graphql | 2026-10-14 | featureOfferPct (Glance Views) and its `@paamRights`, featureOfferGlanceViews, Returns (~45-day delay), Defects, Reviews (re-read for the reconciliation) |
| Becoming the Featured Offer (G201687550, v20) | https://sellercentral.amazon.com/help/hub/reference/external/G201687550 | 2026-10-14 | Selection factors, not-considered factors, rotation, per variation, eligibility removed, out of stock; capture capture `G201687550-v20` |
| Featured Offer eligibility (G200418100, v23) | https://sellercentral.amazon.com/help/hub/reference/external/G200418100 | 2026-10-14 | "This page has been removed"; September 2026; capture capture `G200418100-v23` |
| Business reports glossary (G27691, v7) | https://sellercentral.amazon.com/help/hub/reference/external/G27691 | 2026-10-14 | Featured Offer percentage; Page Views definitions; capture capture `G27691-v7` |
| Pricing Health (GSTH6YN3BR8XNWBW, v22) | https://sellercentral.amazon.com/help/hub/reference/external/GSTH6YN3BR8XNWBW | 2026-10-14 | FO ineligibility for price; within-5% list |
| Suggest changes to your product detail page (G200335450, v23) | https://sellercentral.amazon.com/help/hub/reference/external/G200335450 | 2026-10-14 | Contribution criteria, roles, 48 h |
| Product detail page rules (G200390640, v21) | https://sellercentral.amazon.com/help/hub/reference/external/G200390640 | 2026-10-14 | Equal weighting, no mediation, Report Abuse; capture capture `G200390640-v21` |
| ASIN creation policy (G201844590, v27) | https://sellercentral.amazon.com/help/hub/reference/external/G201844590 | 2026-10-14 | Fundamentally different page ban; selling-role limit on new ASINs |
| Report a violation (G200444420, v14) | https://sellercentral.amazon.com/help/hub/reference/external/G200444420 | 2026-10-14 | Report abuse steps; results not disclosed |
| Amazon Anti-Counterfeiting policy (G201165970, v7) | https://sellercentral.amazon.com/help/hub/reference/external/G201165970 | 2026-10-14 | Authenticity rule; Amazon removes suspect listings |
| Amazon product authenticity and quality (G202010130, v4) | https://sellercentral.amazon.com/help/hub/reference/external/G202010130 | 2026-10-14 | Condition and version match; listing restrictions |
| Intellectual property for Rights Owners and Registered Agents (GU5SQCEKADDAQRLZ, v8) | https://sellercentral.amazon.com/help/hub/reference/external/GU5SQCEKADDAQRLZ | 2026-10-14 | ASIN / seller / page grains; roles; one type per notice; country; MAP; parallel imports |
| Intellectual Property Policy (G201361070, v20) | https://sellercentral.amazon.com/help/hub/reference/external/G201361070 | 2026-10-14 | Read; appeal side only, not used for a new claim |
| Customer product reviews (G201972140, v11) | https://sellercentral.amazon.com/help/hub/reference/external/G201972140 | 2026-10-14 | Read; review-policy pointer only, not used for a claim |
| Amazon Brand Name policy (G2N3GKE5SGSHWYRZ, v21) | https://sellercentral.amazon.com/help/hub/reference/external/G2N3GKE5SGSHWYRZ | 2026-10-14 | Title confirmed; not used for a claim |
| FBA barcode requirements (G201100910, v22) | https://sellercentral.amazon.com/help/hub/reference/external/G201100910 | 2026-10-14 | March 31, 2026 change |
| FBA Barcode Choice and Labeling FAQ (GEFKUGES6NSE7CBP, v8) | https://sellercentral.amazon.com/help/hub/reference/external/GEFKUGES6NSE7CBP | 2026-10-14 | End of commingling; reviews measured per ASIN; Brand Relationships page |
| Use manufacturer barcodes (G200141480) | https://sellercentral.amazon.com/help/hub/reference/external/G200141480 | 2026-10-14 | Title only partly returned ("Use"); not used |
| Seller Forums: Updates to Featured Offer eligibility requirements | https://sellercentral.amazon.com/seller-forums/discussions/t/7336583f-09ac-41de-99d1-667017a88db2 | 2026-10-14 | July 2026 start, end-2026 completion, selection unchanged; seller replies |
| Amazon Brand Registry \| Sell on Amazon | https://sell.amazon.com/brand-registry | 2026-10-14 | Report abuse route; Brand Registry Support "Report a marketplace policy violation"; APEX |
| Project Zero \| Sell on Amazon | https://sell.amazon.com/brand-registry/project-zero | 2026-10-14 | Self-service removal, eligibility, 99% accuracy, notice to sellers |
| Transparency \| Sell on Amazon | https://sell.amazon.com/brand-registry/transparency | 2026-10-14 | Every-unit and listing verification; materially different and other-store versions; supported stores |
| Report a Violation: all reports in one place (Jul 31, 2026) | https://sell.amazon.com/blog/announcements/report-a-violation | 2026-10-14 | 2026 consolidation; store-policy reports open to any BR user |
| How to report a violation to Amazon (Mar 26, 2025) | https://sell.amazon.com/blog/report-a-violation-to-amazon | 2026-10-14 | Same wording; Report Infringement form for non-enrolled rights owners |
| What are Brand Registry roles? (Apr 23, 2025) | https://sell.amazon.com/blog/brand-registry-roles | 2026-10-14 | Selling and protection roles |
| What is Amazon Brand Registry? (Jun 5, 2026) | https://sell.amazon.com/blog/what-is-amazon-brand-registry | 2026-10-14 | Tool list; no Brand Elevation |
| Standards for Brands Selling in the Amazon Store (Jul 3, 2025) | https://sell.amazon.com/blog/standards-for-brands | 2026-10-14 | Amazon retail sourcing for high-recognition brands |
| Maximize Your Sales Potential with the Amazon Featured Offer (Apr 10, 2026) | https://sell.amazon.com/blog/buy-box-featured-offer | 2026-10-14 | Read; FO tooling (Manage All Inventory column, Pricing Health); no new claim |
| Reselling in Amazon Stores (Sep 17, 2025) | https://sell.amazon.com/blog/reselling | 2026-10-14 | Read; Brand Registry "Automated protections … unauthorized sellers" tagline (see Open questions) |
| Amazon's Trustworthy Shopping Experience Report (published April 2026) | https://trustworthyshopping.aboutamazon.com/2025-trustworthy-shopping-experience-report | 2026-10-14 | 99.9% proactive block; GS1; CCU India; customer report route |
| How Amazon Protects Rights Owners' Intellectual Property | https://trustworthyshopping.aboutamazon.com/focus/brand-ip-protection | 2026-10-14 | Read; restates tools |
| Resource Library - Trustworthy Shopping at Amazon | https://trustworthyshopping.aboutamazon.com/resources | 2026-10-14 | Report editions |
| European Commission IP/22/7777 | https://ec.europa.eu/commission/presscorner/detail/en/ip_22_7777 | 2026-10-14 | EU Buy Box commitments; second competing offer |
| Brand Registry help | https://brandregistry.amazon.com/help/ | 2026-10-14 | unreachable: redirect to Brand Registry sign-in |
| Brand Registry Manage selling accounts | https://brandregistry.amazon.com/brg/selling-benefits?view=overview | 2026-10-14 | unreachable: redirect to sign-in |
| Keepa Product.java | https://raw.githubusercontent.com/keepacom/api_backend/master/src/main/java/com/keepa/api/backend/structs/Product.java | 2026-10-14 | COUNT_NEW / COUNT_NEW_FBA / COUNT_NEW_FBM; RATING (16) and COUNT_REVIEWS (17, "review count history"); `reviews.ratingCount` freeze note; buyBoxSellerIdHistory; liveOffersOrder; offersSuccessful (re-read for the reconciliation) |
| Keepa Stats.java | https://raw.githubusercontent.com/keepacom/api_backend/master/src/main/java/com/keepa/api/backend/structs/Stats.java | 2026-10-14 | buyBoxStats (percentageWon etc.), totalOfferCount, buyBoxIsAmazon, sellerIdsLowestFBA |
| Keepa Offer.java | https://raw.githubusercontent.com/keepacom/api_backend/master/src/main/java/com/keepa/api/backend/structs/Offer.java | 2026-10-14 | Offer sellerId, isFBA, isAmazon, isMAP, isShippable, lastSeen, stockCSV |
| keepa skill product-file.md (main checkout) | src/source-packages/keepa/box/skills/keepa/references/product-file.md | 2026-10-14 | Reading rules for offers and Buy Box seller |
| SP-API door reference door.md (main checkout) | src/source-packages/amazon-sp-api/box/skills/amazon-sp-api/references/door.md | 2026-10-14 | Seller-id routes (Finances transactions; v0 getPricing by SKU); Sellers API carries no seller id |
| sellers.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/sellers-api-model/sellers.json | 2026-10-14 | Two paths (marketplaceParticipations, account); no seller id field anywhere in the model |
| Canopy Management: Amazon Hijackers (2026-10-09) | https://canopymanagement.com/amazon-hijackers-unauthorized-sellers/ | 2026-10-14 | Triage, stockout point, June 2026 claim |
| eComEngine: number of offers changed | https://www.ecomengine.com/help/hijacker-number-offers-changed | 2026-10-14 | Offer-count alert rationale |
| eComEngine: How to Deal with Amazon Hijackers | https://www.ecomengine.com/blog/how-to-deal-with-amazon-hijackers | 2026-10-14 | Reviews land on listing; content-change alerts |
| eComEngine: Buy Box Suppression (Matt Ellis) | https://www.ecomengine.com/blog/buy-box-suppression | 2026-10-14 | Read; suppression framing; not used for a position |
| Jungle Scout: The Right Way to Deal With Unauthorized Sellers (2025-01-31) | https://www.junglescout.com/resources/articles/how-to-deal-with-unauthorized-sellers/ | 2026-10-14 | Monitoring; unsourced 2% claim |
| SellerApp: How to Remove Unauthorized Sellers on Amazon in 2026 | https://www.sellerapp.com/blog/unauthorized-sellers-on-amazon/ | 2026-10-14 | Returns/ODR signals; cheapest-landed-cost overstatement |
| My Amazon Guy: Amazon Commingling Program Ending In March 2026 | https://myamazonguy.com/news/amazon-commingling-program-ending/ | 2026-10-14 | Commingling (with a reseller-scope error) |
| My Amazon Guy: Walmart and Amazon vs Unauthorized Sellers | https://myamazonguy.com/news/walmart-and-amazon-vs-unauthorized-sellers/ | 2026-10-14 | 2025 ASIN-creation enforcement accounts |
| My Amazon Guy: Featured Offer Eligibility Criteria Updated in 2026 | https://myamazonguy.com/news/amazon-featured-offer-eligibility-criteria/ | 2026-10-14 | Agrees with Amazon |
| Marketplace Pulse: The Disappearing Amazon Resellers | https://www.marketplacepulse.com/articles/the-disappearing-amazon-resellers | 2026-10-14 | Background |
| Marketplace Pulse: Slaying the Hydra of Counterfeits | https://www.marketplacepulse.com/articles/slaying-the-hydra-of-counterfeits | 2026-10-14 | Background |
| Chen, Mislove, Wilson, WWW 2016 (author PDF) | https://mislove.org/publications/Amazon-WWW.pdf | 2026-10-14 | Buy Box dynamics findings |
| ACM DL page for the same paper | https://dl.acm.org/doi/10.1145/2872427.2883089 | 2026-10-14 | unreachable: HTTP 403 |
| Qian, Management Science 2014 | https://pubsonline.informs.org/doi/10.1287/mnsc.2014.1914 | 2026-10-14 | unreachable: HTTP 403 |

## Open questions

1. **Brand Registry Support case types for catalogue escalation.** The case forms sit behind the Brand Registry sign-in (E7). *Settles:* a signed-in read by the seller on the first real case, recorded in the change log.
2. **"Brand Elevation" and a June 2026 ASIN-creation tightening, in Amazon's words.** Practitioners date both to June 2026. The ASIN creation policy (v27) states the selling-role limit with no date. *Settles:* a Seller Forums News post, or a dated Amazon help revision; the help hub's `version`/`revision` history is not public.
3. **Does `getItemOffers`' `Summary.NumberOfOffers` cover all conditions or only the requested one?** The notification says its summary "applies to all conditions of the product". The v0 model says "for the given conditions". *Settles:* the first real `getItemOffers` call with `ItemCondition=New` on an ASIN that has used offers.
4. **What `OfferChangeType` "External" really signals.** Amazon's text pairs the competitive price threshold (an outside-Amazon price) with "a new offer from a non-Amazon seller". A skill must not read "External" as "a new seller on Amazon". *Settles:* payloads from a live subscription, compared with `getItemOffers` before and after.
5. **Is `buyBoxPercentage` / `featureOfferPct` comparable across the September 2026 eligibility change?** `angles/price-position.md` raised this; nothing read here settles it. *Settles:* the seller's own series across the switch, marked as a break in any window that spans it.
6. **`IsFeaturedMerchant` after the eligibility removal.** It means "eligible to win the Buy Box", and that gate no longer exists in the US. *Settles:* the first real `getItemOffers` reply after September 2026.
7. **Do Data Kiosk `Returns` and `Defects` count only the seller's own shipments?** The schema does not say. The commingling FAQ implies returns follow the selling seller. *Settles:* the Data Kiosk seller analytics guide, or a comparison against the seller's FBA customer returns report.
8. **Amazon's tagline on unauthorised sellers.** The Sept 2025 reselling blog lists Brand Registry "Automated protections: Guard your business against counterfeit products and unauthorized sellers". Amazon's IP page says distribution agreements are not enforced. What, if anything, Brand Registry does automatically against genuine unauthorised resale is unstated. *Settles:* an Amazon page that defines those automated protections.
9. **Published research on hijacking and review contamination on shared ASINs.** None was found without web search. *Settles:* a literature search in a later session (marketing science / IS journals; counterfeit-entry studies such as Qian 2014 once readable).
10. **A seller's selling role through an API.** Amazon names Seller Central → Brand Relationships (commingling FAQ). No SP-API operation read here returns it. *Settles:* the Brand Registry or Sellers models; until then cx asks the seller.

## Positions

1. **P-offer-competition-and-hijackers-1.** Before judging any content change, cx reads the offers on the seller's ASIN (`getItemOffers` by condition: counts by condition and channel, and each offer's seller id, `MyOffer`, `IsBuyBoxWinner`). It compares them with the stored copy and reports any new seller id or count change as a finding first. — productPricingV0.json; Notification Type Values.
2. **P-offer-competition-and-hijackers-2.** cx records the offer state in every change log's "before": offer counts by condition and channel, the Featured Offer holder(s), and the seller's Featured Offer percentage for the baseline window with its source named. — productPricingV0.json; productPricing_2022-05-01.json; Business reports glossary.
3. **P-offer-competition-and-hijackers-3.** cx never compares a page-view Featured Offer percentage (`buyBoxPercentage`) with a Glance View one (`featureOfferPct`); baseline and window use the same source. — sellerSalesAndTrafficReport.json; analytics_sellerAnalytics_2025_03_31.graphql; Becoming the Featured Offer.
4. **P-offer-competition-and-hijackers-4.** cx treats a `getCompetitiveSummary` or Keepa Buy Box seller reading as a snapshot. For share over time it uses Amazon's Featured Offer percentage, or Keepa's `buyBoxStats` labelled as Keepa's approximation. — productPricing_2022-05-01.json; Keepa Stats.java; Chen, Mislove, Wilson (WWW 2016).
5. **P-offer-competition-and-hijackers-5.** In an effect review, a new seller on the ASIN, a change of Featured Offer holder, or a fall in the seller's Featured Offer percentage inside the window is a named confounder. The verdict is "cannot tell" unless the change is shown not to touch the targeted stage. — Becoming the Featured Offer; Business reports glossary; productPricingV0.json.
6. **P-offer-competition-and-hijackers-6.** When the seller's Featured Offer percentage falls, cx checks stock and Pricing Health before the offers. Amazon says an out-of-stock offer cannot be featured and names uncompetitive price as an ineligibility cause. — Becoming the Featured Offer; Pricing Health; Notification Type Values.
7. **P-offer-competition-and-hijackers-7.** cx tells the seller that reviews on the ASIN are shared by every seller on it, so a review wave about "not as described" or fake units can come from another seller's units. It checks the offer history for that period before attributing reviews to the listing. — FBA Barcode Choice and Labeling FAQ; Intellectual property for Rights Owners and Registered Agents.
8. **P-offer-competition-and-hijackers-8.** cx does not present commingling as a current cause of mixed inventory. Since March 31, 2026 Amazon says customers receive the selling seller's own inventory. — FBA Barcode Choice and Labeling FAQ; FBA barcode requirements.
9. **P-offer-competition-and-hijackers-9.** For a new seller, cx sorts the case before naming a route:
   - counterfeit or trademark misuse → Report a Violation with a test buy, naming the specific sellers, so the ASIN is not taken down;
   - page changed or inaccurate → Report Abuse;
   - genuine goods against a distribution or MAP agreement → outside Amazon, because Amazon does not enforce it.

   — Intellectual property for Rights Owners and Registered Agents; Report a violation; Amazon Brand Registry | Sell on Amazon; Project Zero.
10. **P-offer-competition-and-hijackers-10.** cx does not suggest Project Zero removal or a counterfeit report without a confirmed counterfeit. Project Zero is for counterfeits only, and access depends on report acceptance and accuracy rates Amazon states on the page. — Project Zero; Intellectual property for Rights Owners and Registered Agents.
11. **P-offer-competition-and-hijackers-11.** cx names the role each route needs: IP reports need Rights Owner or Registered Agent, store-policy reports any Brand Registry user of the brand, Project Zero and Transparency the rights owner. It asks the seller which roles it holds and records the answer. — Intellectual property for Rights Owners and Registered Agents; Report a Violation: all reports in one place; Project Zero; Transparency.
12. **P-offer-competition-and-hijackers-12.** cx describes Transparency as blocking uncoded or mismatched units and listing attempts on enrolled products in supported stores, never as a remedy for resale of genuine coded goods. — Transparency.
13. **P-offer-competition-and-hijackers-13.** cx does not read `ANY_OFFER_CHANGED` "External" as a new seller on Amazon, and does not rely on the notification while the box has no SQS destination. The scheduled read is the source. — Notification Type Values; notifications.json.
14. **P-offer-competition-and-hijackers-14.** cx does not use the Sales and Traffic `averageOfferCount` as the number of sellers on an ASIN; it is the seller's own listing count by date. — sellerSalesAndTrafficReport.json.
15. **P-offer-competition-and-hijackers-15.** cx states that since the 2026 removal of seller eligibility, a new seller's offer is evaluated for the Featured Offer on the same criteria as the brand's. The removal rolls out store by store, so the date and store are named. — Updates to Featured Offer eligibility requirements; Becoming the Featured Offer; Featured Offer eligibility.
16. **P-offer-competition-and-hijackers-16.** cx does not quote any fixed price band for Featured Offer rotation, such as "within 2%". Amazon states none. — Becoming the Featured Offer; Jungle Scout (as the contradicted source).
17. **P-offer-competition-and-hijackers-17.** On an EU marketplace, cx checks whether a second offer is displayed next to the Featured Offer before reading a competitor's share as zero. — European Commission IP/22/7777; Becoming the Featured Offer.

### The seat's own (not for a skill)

- [seat] The most common hidden cause of a "failed" listing change on a brand's own ASIN is an offer event: a stockout, or a lower-priced new seller. The offer read belongs in the baseline file, not only in the review.
- [seat] `ANY_OFFER_CHANGED` is sent only "for items for which you have active offers". A seller that is out of stock may stop receiving it exactly when a hijacker takes over. If notifications are ever wired, the scheduled read stays.
- [seat] Keepa's `buyBoxStats.percentageWon` and Amazon's Featured Offer percentage will rarely match: different denominators, sampling and segments. Their direction is the useful part.
- [seat] With the eligibility gate gone, the first days after a new seller appears are when Featured Offer share moves most. A daily offer read for the first week after a new seller appears is the seat's suggestion, not Amazon's.

## Verification

Gap fill 2026-10-14: 5 gaps filled (2 of them in part), 2 left open.

- **Filled: detecting new offers.**
  - `getItemOffers` / `getListingOffersBatch` `NumberOfOffers` by condition and channel, `TotalOfferCount`, the 20-offer cap and `MyOffer` (v0 model).
  - `ANY_OFFER_CHANGED` scope, payload, `OfferChangeType` and aggregation (Notification Type Values; notifications.json).
  - Keepa `csv[11]`/`[34]`/`[35]`, `buyBoxSellerIdHistory` and `offers`/`liveOffersOrder` (Keepa Java source).
- **Filled: Featured Offer share lost to others.**
  - Business Reports and report `buyBoxPercentage` (page views); Data Kiosk `featureOfferPct` (Glance Views).
  - `getCompetitiveSummary` segments with `glanceViewWeightPercentage`; FOEP `currentFeaturedOffer`; Keepa `buyBoxStats.percentageWon`.
  - Selection factors and the 2026 eligibility removal (G201687550 v20, G200418100 v23, News_Amazon thread).
- **Filled: detail-page contribution conflicts.** Re-read G200335450 v23, G200390640 v21 and G201844590 v27 for this angle. The rest stays in `brand-protection-and-catalog-contribution.md`.
- **Filled in part: Brand Registry remedies.**
  - Read: Report a Violation (2026 consolidation; roles); IP report grains, MAP, country and parallel imports (GU5SQCEKADDAQRLZ v8); Report Abuse (G200444420 v14, Brand Registry FAQ); Project Zero; Transparency; APEX.
  - Left open: the Brand Registry Support case forms (sign-in wall; Open question 1).
- **Filled in part: 2025–2026 Brand Registry changes.**
  - Amazon-sourced: RAV consolidation (Jul 31, 2026), end of commingling (Mar 31, 2026), Featured Offer eligibility removal (Jul–end 2026), Standards for Brands (Jul 3, 2025), the 2025 Trustworthy Shopping Experience Report (published April 2026: GS1, CCU India, 99.9%).
  - Left open: "Brand Elevation" and a June 2026 ASIN-creation tightening, both practitioner-only (Open question 2).
- **Adversarial re-check.** Every quoted phrase for a new claim was re-matched against the text of the page as fetched in this session:
  - the help pages through the content call (versions as recorded);
  - the developer `.md` pages and GitHub models and schemas;
  - the sell.amazon.com pages and the trustworthyshopping report;
  - the News_Amazon thread, fetched twice;
  - the practitioner pages.

  Corrections made while checking:
  - The `OfferChangeType` "External" text is quoted whole, because its wording is ambiguous.
  - The schema file's `Offers` example lacks `IsBuyBoxWinner`, so the documentation page is cited for that field.
  - The Report a Violation consolidation is dated by the announcement post (Jul 31, 2026), not by the 2025 blog that now carries the same wording.
- **Re-check result.** Every quoted phrase listed above was matched by string search against the saved page texts. All of them matched. Five appeared to miss at first, but only because of line wraps or link markers in the extracted help text. Those were confirmed by reading the passage: G200335450 (twice), G200390640, G201844590, and G201100910, where the FBA barcode wording is quoted from GEFKUGES6NSE7CBP and confirmed on G201100910 in its "barcode requirements have changed" form. The Seller Forums News thread was fetched again for this check.

Reconciled 2026-10-14 (against the contradictions list from three critics; settled at the source):

- **Featured-offer share denominators.** Re-read `analytics_sellerAnalytics_2025_03_31.graphql` (`featureOfferPct` over Glance Views), `analytics_salesAndTraffic_2024_04_24.graphql` (`buyBoxPercentage` over page views) and the captures of G201687550 v20 and G27691 v7 (page views). This file was right. B4's dangling "contradiction note in the summary" now names the files that keep the two series apart. Added the schema's `@paamRights` directive on `featureOfferPct` and the "search results page" wording of `featureOfferGlanceViews`, recorded as written; the role that grants the rights is left to `method/sp-api-access.md`.
- **Featured Offer eligibility removal.** Re-matched against the captures of G201687550 v20 and G200418100 v23; no change. The stale file is `method/triggers.md` (its "Featured Offer eligibility tests" RULE), not this one.
- **Keepa `csv[17]`.** The run-time line called `csv[16]`/`csv[17]` "rating and rating-count history". Re-read Keepa `Product.java`: slot 17 is `COUNT_REVIEWS`, "The product's review count history"; Keepa's documentation page (as cited in `angles/competitor-set.md` and `angles/reviews-and-qa.md`) says "rating count history". The line now names both of Keepa's wordings and scopes the 2025-04-09 freeze note to `reviews.ratingCount`, as Keepa writes it.
- **Route to the seller's own id.** Re-read door.md and `sellers.json`. The run-time line now names door.md's two routes (Finances transactions; v0 `getPricing` by SKU), states that the Sellers API's two paths carry no seller id, and says the FOEP `offerIdentifier.sellerId` is the featured merchant, not the requester. Added a `sellers.json` row to "Pages read".
- **Numbers in "Stable enough for a skill".** The two offer-list lines no longer state the 20-offer cap; they point to the cap the v0 model's `Offers` description states, read at run time. The figure stays in A1 for a human reader. A1 now says the default usage plans are for a human reader and the binding values are the model's and the `x-amzn-RateLimit-Limit` header's. Re-read the v0 and 2022-05-01 models: `getItemOffers` 0.5/1, `getItemOffersBatch` 0.1/1, `getListingOffersBatch` 0.5/1, `getCompetitiveSummary` and FOEP 0.033/1, batch caps 20 (competitive summary, offers batches) and 40 (FOEP), `Offers` "or 20, whichever is less", all as written in this file.
- **Help-page reachability.** No help page is called unreachable in this file. The four cited pages with a capture under the office's capture folder (outside this repository) (G201687550-v20, G200418100-v23, G27691-v7, G200390640-v21) now name their capture in "Pages read", and every quote from them was re-matched against the capture text. The other help pages cited (G200335450, G201844590, G200444420, G201165970, G202010130, GU5SQCEKADDAQRLZ, G201361070, G201972140, G2N3GKE5SGSHWYRZ, G201100910, GEFKUGES6NSE7CBP, GSTH6YN3BR8XNWBW, G200141480) have no capture; they rest on this seat's read through the content call and were not re-fetched, because the standing use of that call is the office's to rule. The brandregistry.amazon.com sign-in redirects (E7, Open question 1) are not Seller Central help pages and stand.
- **Return lag.** C5's "about 45 days" re-matched against the seller analytics schema; consistent with `angles/returns.md`. No change.
- **Cross-references.** Every file this one names exists (`angles/brand-protection-and-catalog-contribution.md`, `angles/reviews-and-qa.md`, `angles/price-position.md`, `angles/competitor-set.md`, `angles/own-traffic-funnel.md`, `method/effect-measurement.md`, `method/funnel-and-search.md`, `method/help-page-access.md`, `method/sp-api-access.md`). This file named neither `inventory-and-fulfilment.md` nor `elements/vendor-and-hybrid.md`, so no id map applied. No position id changed.
