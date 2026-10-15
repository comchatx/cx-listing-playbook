# Vendors (1P) and hybrid brands: which account writes, whose data the page shows, whose offer is featured, and which reports exist and count what

Read 2026-10-14 by the research seat; two seats' files (this angle and an `elements/` copy) merged into this one on 2026-10-14. Tags: [official] Amazon's own page or document; [opinion] a named practitioner; [research] published research; [seat] the seat's own reasoning, never a skill position.

## What this covers

**Funnel stages.** All three, plus questions that come before them: which account the connection is, and *whose* listing and offer are on the page.

- Precondition. Before any element review cx must know:
  - which account type the connection is (Seller Central or Vendor Central);
  - whose contribution the detail page shows;
  - which A+ family an ASIN carries;
  - which reports and datasets exist for that account.
- Exposure and click-through. The title, images and attributes that search shows are the catalog's reconciled values. Several contributors feed them, Amazon retail (Vendor Central) among them.
- Conversion. The Featured Offer can be Amazon's own retail offer, not the brand's seller offer. In that case a content change still acts on the shopper, but the order lands in Amazon's retail books, not in the seller account's Sales and Traffic figures.
- Price position. Amazon sets the price of its own retail offer. The brand's seller-side price change then competes with Amazon's price, and it is also judged against reference prices that include Amazon's.

**Skills it feeds.**

- `listing-review`.
  - Tell whether the connection is a seller or a vendor account, and whether Amazon retail sells the ASIN or contributes to it.
  - Two of the package's "good listing" tests depend on this: `issues` empty, and the Catalog title equal to what was submitted. On a vendor or hybrid ASIN, both can hold or fail for reasons unrelated to the copy. `issues` empty plus a Listings `attributes` echo does not prove the page shows the account's data.
  - The reports cx reads to place a listing in the funnel (Sales and Traffic, Search Query Performance, Search Catalog Performance) do not exist for a vendor account. Know which reports exist for the vendor side and that a seller connection cannot reach them.
- `listing-change-log`. Record the account type, the `sellerId` path value (a merchant id or a vendor code) and the write semantics in force: a vendor's `putListingsItem` merges where a seller's replaces. Record whether Amazon retail offered the ASIN, and who held the Featured Offer, when the change was submitted.
- `effect-review`.
  - Amazon retail's presence, stock and Featured Offer share in each window are confounders.
  - The seller account's own orders understate a hybrid ASIN's demand.
  - A vendor's traffic figure is glance views counted only while retail holds the Featured Offer. It is not sessions or page views, so a vendor baseline and a seller baseline cannot be compared or summed.
- The report script and `/listing-watch`. Vendor report types, options and clocks (hourly, weekly, 48–72 hours) differ from seller ones. A request for a vendor period that is not ready ends `FATAL`. A seller connection asking for a vendor type fails, and a vendor asking for SQP fails after a 202.

**Why a senior operator cares.** Many brand clients are hybrid: they sell to Amazon through Vendor Central on some ASINs and sell through their own Seller Central account on others, sometimes on the same ASIN. On such an ASIN:

- the detail page may follow Amazon retail's or vendor-supplied data, not the seller's;
- a 3P edit can be accepted (`ACCEPTED`, `issues` empty) and still never reach the page;
- A+ can be locked by "an existing retail contribution";
- the Featured Offer may be Amazon's own, so seller-side price changes may not convert;
- a playbook built on Sales and Traffic plus SQP has no data source on the vendor side.

An assistant that does not know which account it is in, and reads only the seller account, will:

- diagnose a precedence problem as a copy problem, and mistake retail effects for content or price effects;
- call vendor report types on a seller token (the day-1 run report shows cx doing this: `GET_VENDOR_...` → 400 on the seller connection);
- compare glance views with sessions;
- take Amazon's Buy Box seller id for the seller's own (day-2 run report, point 4: cx found the seller id "in Keepa's Buy Box seller, which is right only while the seller holds the Buy Box").

The roadmap's angle table (§1.1) has no row for vendors or hybrid brands. This file fills that gap. [seat]

## Amazon's own rules and guidance

### A. Account types, listing routes and authorization

**A1. RULE: the Listings Items API serves both account types; the path id may be a vendor code.**

- The API overview's availability column reads "Sellers and Vendors". [official] (Listings Items API, https://developer-docs.amazon.com/sp-api/docs/listings-items-api, page updated 2026-09-09, read 2026-10-14)
- In the model, every operation's `sellerId` path parameter is "A selling partner identifier, such as a merchant account or vendor code." The operations are `getListingsItem`, `putListingsItem`, `patchListingsItem`, `deleteListingsItem` and `searchListingsItems`. [official] (listingsItems_2021-08-01.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-items-api-model/listingsItems_2021-08-01.json, read 2026-10-14)
- [seat] For a vendor, the path is `/listings/2021-08-01/items/<vendor code>/<SKU>`. A vendor group can hold several vendor codes (A3), so cx must know which code owns the SKU.

**A2. RULE: supported product types differ by account type.** "The Listings Items API does not yet fully support all Amazon product types. Supported Amazon product types differ by selling partner type (merchant or vendor) and by Amazon store." [official] (Listings Items API, Considerations)

- The Listings APIs FAQ adds, for vendors: "Items show as restricted if you don't have access to the product type. If you have access issues, reach out to your vendor manager or Contact Us".
- It also explains the issue text "Does not match your product categories": "the ASIN is set up in a product category the vendor does not have access to." The fix is a Vendor Central Contact Us case naming the message, the ASIN(s) and the correct product type. [official] (Listings APIs FAQ, https://developer-docs.amazon.com/sp-api/docs/listings-apis-faq, page updated 2026-09-09, read 2026-10-14)

**A3. RULE: seller and vendor authorizations are separate doors, and vendor authorization is per vendor group.**

- The authorization URI is built from "The Seller Central or Vendor Central URL for the specific Amazon store", plus `/apps/authorize/consent`. [official] (Authorize Public Applications, https://developer-docs.amazon.com/sp-api/docs/authorize-public-applications, page updated 2026-09-09, read 2026-10-14)
- When registering an app: "select **Sellers**, **Vendors**, or both, depending on the type of selling partner your application is for. The roles you can apply for depend on your selection." [official] (Register your Application, https://developer-docs.amazon.com/sp-api/docs/registering-your-application, page updated 2026-09-09, read 2026-10-14)
- "A vendor group is the account you log in to, which can include multiple vendor codes. Vendor codes allow you to: List products in specific categories. Include different business agreements. Manage different brands."
- "Use the refresh token that is assigned to the vendor group that you want to access in your API call. If you try to retrieve or submit data related to a different vendor group, the call fails due to an authorization error."
- "You can authorize a maximum of 10 vendor groups per application."

  [official] (Authorize your Application to Access Vendor Groups, https://developer-docs.amazon.com/sp-api/docs/authorize-your-application-to-access-vendor-groups, page updated 2026-09-09, read 2026-10-14)
- Vendor Central has its own host per store, for example `https://vendorcentral.amazon.com` for the US, and the page is marked "For vendor applications only". [official] (Vendor Central URLs, https://developer-docs.amazon.com/sp-api/docs/vendor-central-urls, page updated 2026-09-09, read 2026-10-14)
- "If you have an account with Amazon Brand Registry, Amazon Ads, or Vendor Central, use the same email and password for your Seller Central account if you want to sync access." "Vendor Central is by invitation only from Amazon. It's a first-party vendor relationship. Instead of selling directly to customers, vendors sell in bulk (wholesale) to Amazon." [official] (Amazon Seller Central | Sell, page heading "Seller Central: Your digital portal for selling with Amazon", https://sell.amazon.com/tools/seller-central, read 2026-10-14)
- [seat] A hybrid brand therefore has two authorizations, one per account. A connection to the Seller Central account reaches none of the vendor's data. The day-1 run fits this: cx's `createReport` with a `GET_VENDOR_...` type answered 400 on the seller connection (day-1 run report, internal). Whether the 400 meant "vendor-only type" or "malformed name" is not stated there; the rule that the vendor types are vendor-only rests on Amazon's availability lines (G1), not on that 400.

**A4. RULE: some roles a seller-oriented playbook relies on are not available to vendors.** The roles page (https://developer-docs.amazon.com/sp-api/docs/roles-in-the-selling-partner-api, page updated 2026-10-13, read 2026-10-14) [official]:

| Role | Available to sellers? | Available to vendors? |
|---|---|---|
| Product Listing | Yes | Yes |
| Brand Analytics | Yes | Yes |
| Pricing | Yes | No |
| Selling Partner Insights | Yes | No |
| Inventory and Order Tracking | Yes | No |

- The Product Pricing API (where `getFeaturedOfferExpectedPriceBatch` and `getCompetitiveSummary` live) lists availability "Sellers only" and requires the Pricing role. [official] (Product Pricing API, https://developer-docs.amazon.com/sp-api/docs/product-pricing-api, page updated 2026-09-09, read 2026-10-14)
- [seat] A vendor connection therefore cannot read Featured Offer expected prices through SP-API. On a vendor connection, the Featured Offer question goes to Keepa (I).

**A5. RULE: the schema a vendor's write is validated against comes from the same Product Type Definitions call.**

- `getDefinitionsProductType` takes `requirements` (`LISTING` "product facts and sales terms", `LISTING_PRODUCT_ONLY`, `LISTING_OFFER_ONLY`).
- It also takes an optional `sellerId`: "When provided, seller-specific requirements and values are populated within the product type definition schema, such as brand names associated with the selling partner." [official] (definitionsProductTypes_2020-09-01.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/product-type-definitions-api-model/definitionsProductTypes_2020-09-01.json, read 2026-10-14)
- [seat] Because offer-only is not supported for vendors (B2), `LISTING_OFFER_ONLY` is not a vendor route. The model does not say whether a vendor code passed as `sellerId` changes the returned requirements (Open question 4).
- The bulk route is the same for both: `JSON_LISTINGS_FEED` lists "Sellers and vendors". The legacy XML feeds (`POST_PRODUCT_DATA` and others) are "Sellers only" and deprecated. [official] (Listings Management Workflow Migration, https://developer-docs.amazon.com/sp-api/docs/listings-management-workflow-migration, page updated 2026-09-09, read 2026-10-14)

### B. How a vendor's write differs from a seller's

**B1. RULE: put replaces for sellers and merges for vendors.** From the Building Listings Management Workflows Guide (https://developer-docs.amazon.com/sp-api/docs/building-listings-management-workflows-guide, page updated 2026-09-24, read 2026-10-14) [official]:

- Sellers: "For sellers, using the `putListingsItem` operation replaces previously submitted product fact attributes and merges previously submitted sales term attributes. For example, omitting an optional product fact results in its removal. Conversely, however, omitting a purchasable offer price value does not result in its removal." "Sellers can use the `patchListingsItem` to add, replace, or remove one or more attribute values."
- Vendors: "For vendors, using the `putListingsItem` operation merges the provided attributes with previously submitted attributes. Omitting an optional attribute does not result in its removal. Vendors can use the `patchListingsItem` to add or replace one or more attribute values. However, deleting individual attribute values is not supported for vendors at this time."
- The general API overview says, without distinguishing account type, that `putListingsItem` "creates a new listing or replaces the existing content of a listing. Existing attributes may be dropped if omitted". The workflows guide is the narrower statement for vendors. [official] (Listings Items API, Considerations)

**B2. RULE: vendors cannot list offer-only.** "Note that offer-only listings are not supported for vendors at this time. For all items, vendors must provide product facts and sales terms". Listing "with or without providing offer details (sales terms) at the time of creation … enables you to create items that are purchasable or procurable in one submission"; "procurable" is the vendor case. [official] (same guide, "List an offer for an item that already exists in the Amazon catalog")

**B3. RULE: the patch `merge` operation is narrow.** "The merge operation is not supported for other attributes outside of `fulfillment_availability` and `purchasable_offer`." [official] (Listings Items API, use case "Merge a listing")

- [seat] Content attributes (title, bullets, description, search terms) are patched only with add, replace or delete. A vendor cannot delete them.

**B4. RULE: vendor cost price.** Under "Can I edit my cost price via API?": "You cannot use the API to increase prices for existing items. Significant price decreases also need to be verified." The vendor then uploads cost changes through "Items > Edit Item Costs". [official] (Listings APIs FAQ)

- The Listings Items model's `procurement` dataset is "The listings item's vendor procurement information", with `costPrice`: "The price (numeric value) that you want Amazon to pay you for this product." [official] (listingsItems_2021-08-01.json)
- [seat] This is the price Amazon pays the vendor, not the shelf price. No Listings field sets Amazon's retail price.

**B5. RULE: listing status for vendor listings.** `BUYABLE`: "The listings item can be purchased by shoppers. This status does not apply to vendor listings." [official] (listingsItems_2021-08-01.json)

- [seat] A vendor's listing therefore never shows `BUYABLE`. A check of "BUYABLE present" fails by design on a vendor account.

**B6. RULE: Catalog `vendorDetails` is for vendors only.** "Vendor details associated with an Amazon catalog item. Vendor details are only available to vendors." The fields are brand code, manufacturer code, product category or subcategory, product group and replenishment category. In `searchCatalogItems`, `sellerId` is "A selling partner identifier, such as a seller account or vendor code. **Note:** Required when `identifiersType` is `SKU`." [official] (catalogItems_2022-04-01.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/catalog-items-api-model/catalogItems_2022-04-01.json, read 2026-10-14)

**B7. Vendor schema drift.** "In some edge cases the schema might have changed and the original values that a vendor submitted are no longer valid. If this is the case, ask the vendor to open a case with the Amazon Support team". [official] (Listings APIs FAQ)

### C. Whose data the detail page shows: vendor, brand owner, seller and Amazon retail

**C1. RULE (stated as fact): a vendor's submission may not win.** Under the FAQ question "Why are my edits not making it to the detail page even though they appear as successful?", Amazon answers:

> "The APIs provide an alternative method for sending catalog data to Amazon. Downstream process and rules governing catalog data are the same regardless of submission method. In some cases, especially where we already have a listing for a product, the information submitted by a vendor might not have priority."

[official] (Listings APIs FAQ)

- The sentence names vendors. Amazon does not say on this page whether seller submissions fall under the same rule. The next item covers brand owners.

**C2. RULE: brand owners rank highest, and Amazon's own data can be overridden only by ticket.** "Brand owners have the highest precedence to update data on the product details page on Amazon. If Amazon uses its own data on the product details page, brand owners can override it via a ticket to Seller Central support." [official] (Listings APIs FAQ, under "Who has the highest precedence to override the product details page information on Amazon?")

- [seat] The FAQ does not say whether "Amazon … its own data" includes data contributed through Vendor Central. Read together, C1 and C2 say:
  - a brand owner outranks other contributors;
  - where Amazon's data is shown, the brand owner reaches it **by a support ticket, not by an API write**.

**C3. RULE: how Amazon picks among contributors (seller-side help), and silence after the stated window means another contributor won.** "When multiple sellers sell the same product through a single detail page, Amazon automatically combines the best product data from various seller submissions … Sellers and manufacturers can contribute product information on the product detail page. When evaluating contributions, we consider sales volume, refund rate, buyer feedback, and A-to-z guarantee claims." [official] (Suggest changes to your product detail page, https://sellercentral.amazon.com/help/hub/reference/external/G200335450, version 23, revision 0, read 2026-10-14 by both seats through the help hub's content call `POST /help/hub/mons-api/GetHelpTopic`; the HTML route returns a JavaScript shell; see method/help-page-access.md)

The same page also says:

- "For brand-registered ASINs, attribute values from sellers with brand selling roles appear on the product detail page. If a brand-registered ASIN has multiple attribute contributions from different Brand Representatives or Resellers of the same brand, the contribution from the seller with a Brand Representative role is displayed in the product detail page."
- "If your contribution is verified by Amazon, they will show on the product detail page within 48 hours. If, after the allotted period, your contributions do not show on the product detail page, it means Amazon's system has selected another contributor's information that best describes the product based on the guidelines set by Amazon."
- Images: "Upload one main image and up to eight additional images".
  - Amazon's pages disagree on this count. The Building Listings Management Workflows Guide says "A main product image and up to nine secondary images can be uploaded using the Listings Items API" (page updated 2026-09-24, re-read 2026-10-14). The figure here is for human readers only; the binding count is the image attributes the product type's schema carries, read at run time from `getDefinitionsProductType` (elements/images-and-video.md owns the image rules; method/listing-writes.md records the same conflict). [official, both pages]
- Title edits must "match the original product identity to avoid error 8541".

The page does not mention Vendor Central, vendors or Amazon retail as a contributor. [official] (same page) No capture of G200335450 exists under the office's capture folder (outside this repository); its text here rests on the two seats' content-call reads of 2026-10-14, made before the office's ruling on that call (method/help-page-access.md, Open question 1).

**C4. RULE: brand selling roles are defined for seller accounts, not vendors.**

- "The Brand Representative role is for internal, first-party sellers who are directly employed by the brand. When a trademark owner uses the same credentials to create their Brand Registry and Seller Central accounts, this role is automatically assigned to their Seller Central account".
- "The Reseller role is for external, third-party sellers who are authorized to sell a brand's goods and services". The Reseller role "doesn't grant access to Brand Analytics."
- The page does not mention vendors or Vendor Central. "First-party" here means the brand's own seller account, not a Vendor Central relationship.

[official] (Guide to Brand Registry roles, Mickey Toogood, Sell on Amazon blog, Apr 23, 2025, https://sell.amazon.com/blog/brand-registry-roles, read 2026-10-14)

**C5. Amazon staff on legacy Vendor Central ASINs (staff forum reply, weaker than a help page).**

- The thread "Unable to update detail page, ASINs created in legacy Vendor Central" was opened by a brand-registered owner. Their updated info "shows on the backend "Edit" page, but it will not publish to the live listing". A rep had told them an internal team "still has contribution priority over the listings".
- Kris_Amazon replied: "there is currently no other option for you to regain full control from the Brand Registry selling side" and "our partner team is able to assist you with updating those listings".
- Both posts are dated only "6 months ago" on the page.

[official, weak: staff forum reply] (Seller Forums, https://sellercentral.amazon.com/seller-forums/discussions/t/3617ebe6-d713-49ee-b8a5-aacc6cc5fa12, read 2026-10-14; six other replies were collapsed and not read)

**C6. Amazon staff on a Vendor Central title blocked by a "winning contributor" (weak: forum thread).**

- In the thread "Vendor Central Title Needs To Be Updated - Can't Update Due to "Winning contributor"", a brand owner quotes a support reply: "The winning contributor is selected by an automated system that we cannot influence nor override."
- Cooper_Amazon answered first with an escalation, then: "The next steps would be to contact the brand registry team using your vendor account to reactivate your brand".
- The page shows "3 years ago"; its `datetime` attribute reads 2023-12-19.

[official, weak: staff forum reply] (Seller Forums CA, https://sellercentral.amazon.ca/seller-forums/discussions/t/eb53239a-38ba-45b9-8c82-8e4992d892c7, read 2026-10-14)

**C7. Amazon staff on contribution control for brand owners.**

- The thread "Contribution Score and Detail Page Control for Brand Owners Using a Reseller Model" was opened by a manufacturer that is brand-registered and sells through resellers. It reports "Amazon override our contributions (e.g., title, bullet points, flavor names, sizes, etc.)".
- Dougal_Amazon: the outcome "really does depend on how you have the brand set up and what Selling Benefits you have granted to other Sellers". He gives the case "if your selling account is the ONLY selling account with the Brand Representative roll and ALL other Sellers are resellers".
- The thread does not mention Vendor Central. It is dated "a year ago".

[official, weak: staff forum reply] (Seller Forums, https://sellercentral.amazon.com/seller-forums/discussions/t/5db6cc8d-029e-420c-91c6-78d724db3aa5, read 2026-10-14)

**C8. What Amazon's public pages do not say.** No page read today states a general precedence order between:

- a brand's Vendor Central contribution,
- the same brand's Seller Central Brand Representative contribution, and
- Amazon retail's own data.

The Vendor Central help, where such a rule would most likely sit, is behind sign-in: the contact page, the content call and the help-node route on `vendorcentral.amazon.com` all answered 302 to sign-in (Pages read). None of the 54 Seller Central help-page captures of 2026-10-14 under the office's capture folder (outside this repository) contains the word "vendor" or the phrase "Vendor Central" (searched at reconciliation). [seat: absence recorded] (Open question 1)

### D. A+ by account type

**D1. RULE: one API, two content families by account.**

- The A+ Content API lists availability "Sellers and Vendors". [official] (A+ Content API, https://developer-docs.amazon.com/sp-api/docs/a-plus-content-api-use-case-guide, page updated 2026-09-30, read 2026-10-14)
- In the model, `contentType` is `EBC` ("A+ Enhanced Product Description content published through the A+ Content Manager in Seller Central"), `EMC` ("… published through the A+ Content Manager in Vendor Central") or `BrandStory`.
- `PublishRecord` carries `contentType` per ASIN and store. Badges include `PREMIUM`, `STANDARD` and `GENERATED` ("generated by an automated process. If any user modifies this content, it will lose the `GENERATED` badge").

  [official] (aplusContent_2020-11-01.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/aplus-content-api-model/aplusContent_2020-11-01.json, read 2026-10-14)
- "Use EBC for sellers, EMC for vendors, BrandStory for Brand Story." [official] (A+ Content Troubleshooting Guide, https://developer-docs.amazon.com/sp-api/docs/a-plus-troubleshooting, page updated 2026-09-30, read 2026-10-14)
- The vendor use-case directory lists A+ Content and Catalog Items under "Marketing content management" for vendors. [official] (SP-API Vendor Use Cases, https://developer-docs.amazon.com/sp-api/docs/sp-api-vendor-use-cases, page updated 2026-10-05, read 2026-10-14)

**D2. RULE: Amazon Retail can hold the A+ slot, and the API cannot override it.** For the failure "Submission is refused because Amazon Retail owns the content on the ASIN", Amazon's error text is "You are unable to add content to this ASIN because there is an existing retail contribution on this ASIN." The fix: "The selling partner asks Selling Partner Support (sellers) or their Vendor Manager (vendors) to release the ASIN; the API cannot override it." [official] (A+ Content Troubleshooting Guide)

**D3. RULE: Premium A+ module limits apply in the API.**

- "Content documents cannot contain both premium and standard module types."
- "Content module lists cannot have more than 7 modules." This limit "applies as soon as the list contains one Premium module; Standard-only documents are not capped by the API."

[official] (A+ Content Troubleshooting Guide)

- **Amazon's pages disagree on the module cap, and one of them splits it by account.**
  - The tutorial: "Content documents for selling partners can contain up to seven modules; content documents for vendors can contain up to five content modules." [official] (Create, edit, and publish A+ content, https://developer-docs.amazon.com/sp-api/docs/create-edit-publish-aplus-content, page updated 2026-10-02, read 2026-10-14)
  - The troubleshooting guide (above): the cap of seven applies once a Premium module is present, and Standard-only documents "are not capped by the API".
  - The model: `ContentModuleList` has `maxItems` 100. [official] (aplusContent_2020-11-01.json)
  - The seller-side pages give Basic five and Premium seven (Seller Central help G202102930 v17, the A+ Quickguide and the 2025-09-24 Sell on Amazon blog, as read in elements/a-plus-content.md).
  - The figures are recorded for human readers. No page is preferred: the binding limit for a given account and document is what the A+ API's validation returns at run time (`validateContentDocumentAsinRelations` `errors`), which elements/a-plus-content.md also names. Whether a vendor's Standard document of six or seven modules passes is not stated anywhere read (Open question 5).
- The Listings APIs FAQ, under "How do I update A+ premium content?", answers only "A+ premium content is not supported." The FAQ's other answers are vendor-oriented (vendor manager, Vendor Central Contact Us). It does not say whether this refers to the Listings APIs or to the A+ API, and the A+ guide documents Premium modules. [official] (Listings APIs FAQ) (Open question 5)

**D4. Premium A+ eligibility as Amazon announced it (seller side).**

- News_Amazon, "Brands: New Premium A+ content promotion" (page datetime 2022-08-08): eligible "If you have published A+ brand story across your ASIN catalog" and "have had at least 15 A+ content projects approved in the past 12 months"; "Access for Premium A+ is granted at the end of each month." [official] (Seller Forums, https://sellercentral.amazon.com/seller-forums/discussions/t/56714bc31667d6e317a4aa85bee089f1, read 2026-10-14)
- News_Amazon, "Update to Premium A+ Content eligibility requirements" (page datetime 2023-10-31): "We've updated the eligibility requirements for Premium A+ Content. … To be eligible to use Premium A+ Content, you'll need: Brand Story module published on all of your brand-owned product listings. Five approved A+ Content modules in the last 12 months." [official] (Seller Forums, https://sellercentral.amazon.com/seller-forums/discussions/t/301e6741-8ef5-485f-8829-a14c55647f9c, read 2026-10-14)
- Neither post mentions vendors. The absolute dates come from the pages' `datetime` attributes; the pages show "4 years ago" and "3 years ago". The later post is the current statement of the two.

### E. Amazon's retail offer as a Featured Offer competitor, and the price constraints around it

**E1. RULE: what the Featured Offer is, and how the seller's share is computed.**

- "The Featured Offer is the offer that appears with Add to Cart / Buy Now buttons in the Offer Display on a product detail page. Amazon selects the Featured Offer for a product by evaluating all offers to determine which is the most attractive for the customer."
- "Your Featured Offer percentage is calculated as the total number of page views in which your offer is featured divided by the total number of page views for your products."
- The FAQ: "We rank offers the same way for every product, and we never use manual overrides to select one offer over another."
- And: "As of September 2026, Amazon no longer maintains a seller eligibility requirement, and offers from all sellers are now eligible to be evaluated for the Featured Offer."
- The page does not name Amazon's own retail offer.

[official] (Becoming the Featured Offer, https://sellercentral.amazon.com/help/hub/reference/external/G201687550, version 20, read 2026-10-14; capture capture `G201687550-v20`)

- The Business reports glossary: Featured Offer percentage is "The percentage of page views where the Featured Offer (the "Add to shopping cart" link) appeared on the page for customers to add your product to their cart. This percentage will be less than 100% if the page view occurred when: … The Featured Offer would result in the customer purchasing from another seller." [official] (Business reports glossary, https://sellercentral.amazon.com/help/hub/reference/external/G27691, version 7, revision 1, capture capture `G27691-v7`, read 2026-10-14)

**E2. Amazon's own words on its retail offer and the Featured Offer.** In written answers to the House Judiciary antitrust subcommittee, the document, dated October 11, 2019, speaks for Amazon in the first person:

- Amazon "sets the prices on its first party sales to match competitors across all channels of retail. For sales by third parties, who are responsible for setting their own prices in the Amazon store, Amazon may suggest that a seller lower its price in its store, offer an Amazon-funded discount on the product, or choose not to feature higher-priced offers on a product's detail page."
- "Amazon identifies a Featured Offer by considering factors including price, fulfillment speed, delivery speed, Prime eligibility, and seller performance."
- To question 8: "If an Amazon retail offer is out of stock with no outstanding purchase orders and that same product is available at the same or a lower price from a Prime-eligible seller with a high-performance rating, then the Amazon retail offer would not be the Featured Offer."

[official, dated 2019] (Responses to Questions for the Record following the July 16, 2019, Hearing … "Online Platforms and Market Power, Part 2", https://docs.house.gov/meetings/JU/JU05/20190716/109793/HHRG-116-JU05-20190716-SD038.pdf, read 2026-10-14)

- [seat] The answer to question 8 is narrow. It does not say what happens when the retail offer is out of stock *with* outstanding purchase orders. It is also seven years old, and the factor list predates the 2026 help page.

**E3. Regulator-binding rule (EEA): equal treatment in Buy Box ranking.** The European Commission made Amazon's commitments legally binding (press release dated 2022-12-20, "Antitrust: Commission accepts commitments by Amazon barring it from using marketplace seller data, and ensuring equal access to Buy Box and Prime"). Amazon committed to:

- "treat all sellers equally when ranking the offers for the purposes of the selection of the Buy Box winner";
- "display a second competing offer to the Buy Box winner if there is a second offer from a different seller that is sufficiently differentiated from the first one on price and/or delivery".

The Commission had "preliminarily concluded that Amazon's rules and criteria for the Buy Box and Prime unduly favour its own retail business". The second-offer and Prime commitments run seven years.

[official: European Commission, not Amazon] (IP/22/7777, https://ec.europa.eu/commission/presscorner/detail/en/ip_22_7777, read 2026-10-14 through the press corner's document service; the HTML page renders empty)

- Scope: the investigation covered marketplaces in the EEA. Nothing read here extends the commitment to the US store. [seat]

**E4. RULE: Amazon's own price is one of the reference prices that can make a seller offer ineligible.** Pricing Health lists offers "currently ineligible to become the Featured Offer on the product detail page because they aren't priced competitively compared with other retailers outside of Amazon (the competitive external price) or they're priced significantly higher than recent prices observed on Amazon or elsewhere".

"Reference prices can include the following":

- the Featured Offer price;
- the 60-day average selling price;
- "The highest 14-day price (shipped and sold by Amazon)";
- the list price;
- the per-unit bundle price;
- the typical price;
- the 60-day average offer price.

Pricing Health also opens with: "You are responsible for setting your own prices in our store." [official] (Pricing Health, https://sellercentral.amazon.com/help/hub/reference/external/GSTH6YN3BR8XNWBW, version 22, read 2026-10-14 through GetHelpTopic; no capture of this page exists under the office's capture folder (outside this repository))

- [seat] This offer-level ineligibility and the removal of the *seller* eligibility requirement (E1, "As of September 2026") were both on live pages on 2026-10-14 and do not contradict each other on their face: Becoming the Featured Offer itself adds that "individual offers may still not be selected as the Featured Offer if they are not competitive" (capture G201687550-v20). Files that list "Featured Offer eligibility" as a seller-level test without the September 2026 change (method/triggers.md) are out of date on that point, not this file.

**E5. MAP.** No Amazon page read today states an Amazon policy on minimum advertised price, for sellers or for Amazon retail. The only MAP mechanics found are Keepa's description of Amazon's display (I). Vendor Central help, where any vendor-side MAP or price-protection terms would be, sits behind sign-in (Pages read). [seat: absence recorded] (Open question 13)

**E6. RULE (ads): Featured Offer eligibility gates Sponsored Products.** "Products must be in one or more eligible categories and be eligible for the Featured Offer in order to advertise." "Sponsored Products are available for professional sellers, vendors" and others. [official] (Sponsored Products - Help increase product sales | Amazon Ads, https://advertising.amazon.com/solutions/products/sponsored-products, read 2026-10-14)

- The page says "eligible for", not "be". Whether a seller's ad serves while Amazon retail holds the Featured Offer is not stated (Open question 9).

### F. What each seller-side data source counts on a hybrid ASIN

**F1. Seller-side Business Reports (Sales and Traffic report).**

- `buyBoxPercentage`: "The percentage of page views where the buy box (the add to shopping cart link) appeared on the page for customers to add your product to their cart."
- `unitSessionPercentage`: "calculated by dividing unitsOrdered by sessions".
- `sessions`: "visits to your Amazon.com pages using mobile app or browser by any user".

[official] (sellerSalesAndTrafficReport.json, https://github.com/amzn/selling-partner-api-models/blob/main/schemas/reports/sellerSalesAndTrafficReport.json, read 2026-10-14)

- The glossary gives "Units Ordered" as "The number of individual units or items ordered" and "Sessions- Total" as "Visits to your Amazon product detail pages by a customer within a 24-hour period". Neither names whose offer the units were bought on. [official] (Business reports glossary, G27691 v7)
- An Amazon moderator: "Sessions track total visits to a product page, regardless of the seller in the Buy Box" and "sessions are product-specific, not seller-specific". [official, weak: forum reply by SEAmod, no badge shown, "2 years ago"] (Business Reports - Sessions column explanation, https://sellercentral.amazon.com/seller-forums/discussions/t/832bfb75-4d50-4842-ae7e-2727848810be, read 2026-10-14)
- [seat] Put together: on a hybrid ASIN the seller account's sessions include visits during which Amazon retail held the Featured Offer, and `unitsOrdered` is presumably the seller's own units. Then `unitSessionPercentage` falls whenever Amazon retail wins more of the page, with no change in content quality. Neither the schema nor the glossary says whose units `unitsOrdered` counts (Open question 10).

**F2. Seller-side Data Kiosk (Seller Analytics).**

- `featureOfferPct`: "calculated by dividing the number of times your offer is the Featured Offer by the number of times customers viewed it (that is, Glance Views)".
- `glanceViews`: "the number of times customers actively engage with your product detail page".

[official] (analytics_sellerAnalytics_2025_03_31.graphql, https://github.com/amzn/selling-partner-api-models/blob/main/schemas/data-kiosk/analytics_sellerAnalytics_2025_03_31.graphql, read 2026-10-14)

- The two Featured Offer measures have different denominators: page views in E1 and F1, glance views here. Both are Amazon's words.

**F3. SQP and SCP on a hybrid ASIN.** The Search Query Performance dashboard page "surfaces query volume, impressions, clicks, add-to-cart, and buys" and says "The search queries are selected based on their overall performance in search results, and includes organic and Sponsored Products originating from the search results page for all customers. It excludes traffic from widgets on the search page such as "Top Rated" or "New Arrivals."" It does not say whether "buys" include purchases of the ASIN on Amazon retail's offer. [official] (Search Query Performance dashboard, https://sellercentral.amazon.com/help/hub/reference/external/G8J4CB5ZBF3NX7TP, version 5, revision 0, capture capture `G8J4CB5ZBF3NX7TP-v5`, read 2026-10-14) The SQP and SCP report schemas do not state it either; the SCP schema says "Impressions include sponsored search results". [official] (sellingPartnerSearchQueryPerformanceReport.json, sellingPartnerSearchCatalogPerformanceReport.json, read 2026-10-14) (Open question 11)

### G. Which reports and datasets exist for which account

**G1. RULE: seller retail analytics are seller-only; vendor retail analytics are vendor-only.** From Analytics Reports (https://developer-docs.amazon.com/sp-api/docs/report-type-values-analytics, page updated 2026-10-06, read 2026-10-14) [official]:

| Report type | Availability (Amazon's words) | Role |
|---|---|---|
| `GET_SALES_AND_TRAFFIC_REPORT` | "Sellers" | Brand Analytics |
| `GET_BRAND_ANALYTICS_SEARCH_QUERY_PERFORMANCE_REPORT` | "Sellers who have the Brand Analytics Selling Partner API role and are registered in Amazon Brand Registry." | Brand Analytics |
| `GET_BRAND_ANALYTICS_SEARCH_CATALOG_PERFORMANCE_REPORT` | same as SQP: "Sellers who have …" | Brand Analytics |
| `GET_BRAND_ANALYTICS_MARKET_BASKET_REPORT` | "Sellers and vendors who have the Brand Analytics Selling Partner API role and are registered in Amazon Brand Registry." | Brand Analytics |
| `GET_BRAND_ANALYTICS_SEARCH_TERMS_REPORT` | "Sellers and vendors who have the Brand Analytics Selling Partner API role, are registered in Amazon Brand Registry, and are a brand representative." | Brand Analytics |
| `GET_BRAND_ANALYTICS_REPEAT_PURCHASE_REPORT` | "Sellers and vendors who have the Brand Analytics Selling Partner API role and are registered in Amazon Brand Registry." | Brand Analytics |
| `GET_VENDOR_SALES_REPORT`, `GET_VENDOR_TRAFFIC_REPORT`, `GET_VENDOR_NET_PURE_PRODUCT_MARGIN_REPORT`, `GET_VENDOR_INVENTORY_REPORT`, `GET_VENDOR_FORECASTING_REPORT`, `GET_VENDOR_REAL_TIME_SALES_REPORT`, `GET_VENDOR_REAL_TIME_TRAFFIC_REPORT`, `GET_VENDOR_REAL_TIME_INVENTORY_REPORT` | "Vendors" | Brand Analytics |

- Every vendor type lists "This report can only be requested" and JSON output.
- The vendor directory agrees: its "Brand analytics" row lists only Market Basket, Search Terms and Repeat Purchase, and its "Retail analytics" row lists the `GET_VENDOR_*` types. Its "Catalog management" row lists the Catalog Items, Listings Items and Product Type Definitions APIs, with "Reports: Not applicable". [official] (SP-API Vendor Use Cases)
- The Reports FAQ: "Not all reports are available to vendors. However, some reports are exclusive to vendors." [official] (Reports API FAQ, https://developer-docs.amazon.com/sp-api/docs/reports-faq, page updated 2026-09-09, read 2026-10-14)
- The Brand Analytics role itself is "available to vendors? Yes" (A4). Holding the role does not open SQP or SCP to a vendor; the report's own availability line does not include vendors. [official] (roles page; Analytics Reports)

**G2. Seller-side Brand Analytics eligibility (dashboard).**

- "Brand Analytics is only available to sellers who have a Brand Representative role assigned to a brand in Brand Registry. You must be internal to the brand and responsible for selling the brand in the Amazon store." [official] (Search Query Performance dashboard, G8J4CB5ZBF3NX7TP v5)
- "To access Brand Analytics, you need a Professional selling account. You also need to be a Brand Representative for a brand enrolled in Amazon Brand Registry." [official] (Amazon Brand Analytics | Sell on Amazon, https://sell.amazon.com/tools/amazon-brand-analytics, undated, read 2026-10-14)
- The Brand Analytics blog adds: "Data in Brand Analytics usually goes back three years and is generally available within three days". [official] (Amazon Brand Analytics: Get data to grow your business, Daisy Quaker, Oct 8, 2025, https://sell.amazon.com/blog/brand-analytics, read 2026-10-14)
- None of these three pages mentions vendors.

**G3. Other performance reports split by account.** From Performance Reports (https://developer-docs.amazon.com/sp-api/docs/report-type-values-performance, page updated 2026-10-06, read 2026-10-14) [official]:

- `GET_PROMOTION_PERFORMANCE_REPORT`: "Sellers who have the Selling Partner Insights Selling Partner API role and vendors who have the Brand Analytics Selling Partner API role who are also registered in Amazon's Brand Registry."
- `GET_COUPON_PERFORMANCE_REPORT` appears twice: a seller section (Role Brand Analytics, Availability "Sellers") and a "Vendor Coupons Performance Report" section (Role Brand Analytics, Availability "Vendors", schema `vendorCouponReport`).

**G4. Data Kiosk.**

- The API is "Sellers and Vendors". [official] (Data Kiosk API, https://developer-docs.amazon.com/sp-api/docs/data-kiosk-api, page updated 2026-09-09, read 2026-10-14)
- "The Vendor Analytics and Sales and Traffic datasets require the Brand Analytics role. The Economics dataset requires the Selling Partner Insights role." [official] (Correction: Data Kiosk role requirements, https://developer-docs.amazon.com/sp-api/changelog/correction-data-kiosk-role-requirements, read 2026-10-14)
- The newer Seller Analytics dataset (2025-03-31) gates each field with `@paamRights(require: ["analytics_sales_and_traffic_view_pa", …])` in its schema; the directive speaks of "PAAM rights that Data Kiosk authorizes merchant account requests". The correction note predates that dataset. [official] (seller analytics schema)
- **Amazon's pages disagree on the Data Kiosk role.** The Data Kiosk API page's role table lists "Required roles (need at least one)" as Brand Analytics alone for every operation (`createQuery`, `getQuery`, `getQueries`, `getDocument`, `cancelQuery`), while the correction note above requires Selling Partner Insights for Economics, and the Seller Analytics schema gates fields by PAAM rights. The same page says "Each field available with Data Kiosk requires a certain role. Data Kiosk determines whether the requester has the required roles for each field in the query upon query creation." [official] (Data Kiosk API, re-read 2026-10-14) No page is preferred: the binding answer for a dataset is what `createQuery` returns on the connection at run time, against the field directives in the dataset's schema.
- The Selling Partner Insights role is "available to vendors? No" (A4).
- [seat] A vendor connection cannot reach Economics. The vendor's Data Kiosk is the Vendor Analytics dataset.

**G5. SQP request rules (read because the SQP-for-vendors gap depends on them).**

- The SQP report schema: `dataStartTime` "must correspond to the first day in the reportPeriod that you specify or else a fatal error returns. For example, dataStartTime must be a Sunday for the WEEK reportPeriod." [official] (sellingPartnerSearchQueryPerformanceReport.json, https://github.com/amzn/selling-partner-api-models/blob/main/schemas/reports/sellingPartnerSearchQueryPerformanceReport.json, read 2026-10-14)
- On the Analytics Reports page, SQP's "MONTH: 17 months" sits under "Maximum reporting periods" ("The maximum reporting periods that you can specify using the `dataStartTime` and `dataEndTime` parameters"), the request-span heading, beside "DAY: N/A", "WEEK: N/A", "QUARTER: N/A" and "YEAR: N/A". The same entry also says "Requests cannot span multiple periods." Amazon's two statements are recorded as written. [official] (Analytics Reports, re-read 2026-10-14)
  - The SQP entry has no "Maximum lookback windows" heading; on this page that heading appears only under the vendor reports (H3). So the page states no history depth for SQP, and "17 months" is not a retention figure. The only stated depth is the blog's "Data in Brand Analytics usually goes back three years" (G2), which is not an API page. [official; seat reading of the headings] A file that reads "17 months" as retention (angles/seasonality-and-events.md, Open question 9) reads it against the page's heading; this file is not changed by that.
- Launch: News_Amazon "New Brand Analytics search dashboards are now available" ("We have launched two new Brand Analytics search dashboards, Search Catalog Performance and Search Query Performance"), page `datetime` 2022-04-14; shown as "5 years ago". [official] (Seller Forums, https://sellercentral.amazon.com/seller-forums/discussions/t/1afe683eb0acb90bb31abdc34950ef74, read 2026-10-14)

### H. Vendor Retail Analytics: fields and clocks (vendor accounts only)

All from Analytics Reports, "Vendor retail analytics reports", unless another source is named [official].

**H1. Time zone.** "The universal default time zone for the Amazon store data in the Vendor Retail Analytics reports is Pacific Standard Time (PST). The Amazon store data for the Vendor Retail Analytics reports follows PST irrespective of the vendor's location or the Amazon store's local time zone." The rapid (real-time) reports' schemas give hours "in UTC" (vendorRealTimeTrafficReport.json). [official]

**H2. Rapid retail analytics (hourly).**

| Report type | Content | When an hour can be requested | Lookback / max span |
|---|---|---|---|
| `GET_VENDOR_REAL_TIME_INVENTORY_REPORT` | ASIN inventory, hourly (`highlyAvailableInventory`) | "five minutes after the close of each hour" | 30 days / 7 days |
| `GET_VENDOR_REAL_TIME_TRAFFIC_REPORT` | glance views by ASIN and hour | "approximately 65 to 115 minutes after the close of an hour" | 30 days / 14 days |
| `GET_VENDOR_REAL_TIME_SALES_REPORT` | ordered units/revenue by ASIN and hour; "ordered units may be negative" for cancellations | "five minutes after the close of each hour" | 30 days / 14 days |

- On the traffic report: "Glance Views (GVs) are calculated at the ASIN-level, and only when retail is the featured merchant."
- Also: "The Glance Views count in the `GET_VENDOR_REAL_TIME_TRAFFIC_REPORT` is not the same as the Glance Views count in the Vendor Central dashboard … less accurate than the Vendor Central dashboard for concluded days."
- The same data is "Available to sellers and vendors as the `DETAIL_PAGE_TRAFFIC_EVENT` notification", and inventory as `ITEM_INVENTORY_EVENT_CHANGE`. [official] (Analytics Reports; Notification Type Values, https://developer-docs.amazon.com/sp-api/docs/notification-type-values, page updated 2026-09-30, read 2026-10-14)

**H3. Periodic vendor reports.**

| Report type | reportOptions | Data availability (Amazon's words) |
|---|---|---|
| `GET_VENDOR_SALES_REPORT` | `reportPeriod`, `distributorView` (`MANUFACTURING`/`SOURCING`), `sellingProgram` (`RETAIL`/`BUSINESS`/`FRESH`), all required | "weekly reporting periods … is the end of the day Monday, 48 hours after the close of the period. The SLA for non-Saturday daily reporting periods is 72 hours after the close of the period." |
| `GET_VENDOR_TRAFFIC_REPORT` | `reportPeriod` (required) | same 48 h / 72 h wording |
| `GET_VENDOR_NET_PURE_PRODUCT_MARGIN_REPORT` | `reportPeriod` (required) | same 48 h / 72 h wording |
| `GET_VENDOR_INVENTORY_REPORT` | `reportPeriod`, `distributorView`, `sellingProgram` (`RETAIL`/`FRESH`), all required | "Refreshed data is available 72 hours after the close of the period. For example, weekly data (Sunday through Saturday dataset) is available by the end of the day Tuesday." |
| `GET_VENDOR_FORECASTING_REPORT` | `sellingProgram` | "Refreshed forecasting data is available within a 72-hour time frame after the week end." "Only the most recent forecast data is available." One store per request. |

- Too early is FATAL: "If you request a report for a reporting period that is not yet available, the report will not be generated and `processingStatus` for the report will be FATAL."
- Weeks run Sunday to Saturday: "`dataStartTime` must be a Sunday and `dataEndTime` must be a Saturday when `reportPeriod=WEEK`".
- The page uses two headings for the vendor sales, net pure product margin, traffic and inventory reports: "Maximum lookback windows" ("from the current date") and "Maximum reporting periods" ("that you can specify using the `dataStartTime` and `dataEndTime` parameters"). For the vendor sales report:
  - Maximum lookback windows: "DAY: 1,460 days", "WEEK: 7 weeks", "MONTH: 36 months", "QUARTER: 8 quarters", "YEAR: 3 years";
  - Maximum reporting periods: "DAY: 15 days", "WEEK: 7 weeks", "MONTH: 15 months", "QUARTER: 4 quarters", "YEAR: 2 years".
  - The WEEK lookback of 7 weeks beside a DAY lookback of 1,460 days is recorded as Amazon wrote it.
- `distributorView: MANUFACTURING` "provides data for ASINs of items manufactured by you, regardless of who sourced the products to Amazon". `SOURCING` "provides data for ASINs of items sourced directly from your vendor group". [official]

**H4. What the vendor traffic and sales reports hold.**

- `GET_VENDOR_TRAFFIC_REPORT` holds only `glanceViews`: "Customer views of the vendor's product detail pages" (aggregate) and "The number of customer views of the product detail page" (by ASIN). There are no sessions, no conversion and no Featured Offer share. [official] (vendorTrafficReport.json, https://github.com/amzn/selling-partner-api-models/blob/main/schemas/reports/vendorTrafficReport.json, read 2026-10-14)
- `GET_VENDOR_SALES_REPORT` fields:

| Field | Amazon's description |
|---|---|
| `orderedUnits` | "Number of units ordered by Amazon customers. This field is populated when distributorView is MANUFACTURING" |
| `orderedRevenue` | "populated when distributorView is MANUFACTURING" |
| `shippedRevenue` | "Revenue based on units shipped in the selected time frame. Adjustments are made for returns." |
| `shippedUnits` | shipped units |
| `shippedCogs` | shipped cost of goods sold |
| `customerReturns` | "populated when sellingProgram is RETAIL or BUSINESS" |

[official] (vendorSalesReport.json, read 2026-10-14)

**H5. Seller report clocks against vendor ones.** The page's seller section ("Seller retail analytics reports", Sales and Traffic Business Report) gives:

- "key sales performance metrics such as ordered product sales, revenue, units ordered, and claim amount, as well as page traffic metrics such as page views and buy box percentage of the seller's entire catalog";
- "The `dataStartTime` value provided when requesting this report must not be more than two years before the date of the request";
- granularity options;
- advice to "Use date ranges between 7 and 30 days to reduce processing time";
- advice to "Schedule reports outside peak hours".

It states **no** data-availability time. The Brand Analytics sections state none either. Of the Analytics Reports types, only the vendor ones carry a stated clock. [official] (Analytics Reports; checked by searching the page for "SLA", "after the close", "Data availability") The seller-side Brand Analytics clock Amazon does state is on a different page: "generally available within three days" (G2).

**H6. Data Kiosk Vendor Analytics dataset.** From analytics_vendorAnalytics_2024_09_30.graphql (https://github.com/amzn/selling-partner-api-models/blob/main/schemas/data-kiosk/analytics_vendorAnalytics_2024_09_30.graphql) and the Vendor Analytics Dataset Use Case Guide (https://developer-docs.amazon.com/sp-api/docs/vendor-analytics-dataset-guide, page updated 2026-09-30), both read 2026-10-14 [official]:

- The traffic group has two fields:
  - `glanceViews`: "Glance views where Retail is the featured offer (i.e., winning the buy box)."
  - `lostFeaturedOffer`: "The percentage of product page views where your offer loses the Featured Offer position (Buy Box) to others. It is equal to the number of glance views where you do not win the Featured Offer divided by the total number of glance views."
- Views: "`sourcingView`: Shows only data of ASINs sourced directly from the vendor … Certain metrics such as Glance Views are not available in `sourcingView`". "`manufacturingView`: Shows data for all ASINs manufactured by the vendor (regardless of who sourced the products to Amazon)". A vendor group that manufactures nothing gets "Error: VendorGroup does not have relevant rights to perform this operation".
- "The start date must be no more than two years ago." Fields carry `@resultRetention(duration : "P30D")`.
- Partial periods: "This scenario occurs when data is requested within one to two business days. In such cases, the response for days that are unavailable contains a null value."
- Weekly periods "always begin on Sunday". Inventory metrics are snapshots: "Weekly: Eight weeks", "Monthly: 24 Months".
- Catalog attributes "are always current and latest. There is no historical view of catalog data."
  - [seat] A vendor's Data Kiosk export cannot be used as the "before" of a content change. The before must be recorded at change time.
- The guide's own sentence "`startDate` must be in the future and `endDate` must be before `startDate`" is reversed on its face. It is recorded as written, not relied on.
- `vendorCode` grouping "is not compatible with" `glanceViews`, `lostFeaturedOffer`, `orderedUnitsWithRevenue` and others.

### I. Keepa fields for Amazon's own offer (third-party documentation of its own fields)

[official for Keepa's own documentation of its fields; Keepa is a third party] (keepacom/api_backend `Product.java`, `Stats.java`, `Offer.java`, https://github.com/keepacom/api_backend, read 2026-10-14):

- `csv[0]`, `CsvType.AMAZON(0)`: "Amazon price history".
- `csv[1]`, `NEW`: "Amazon is considered to be part of the marketplace as well, so if Amazon has the overall lowest new price, the marketplace new price in the corresponding time interval will be identical to the Amazon price (except if there is only one marketplace offer)." The same comment adds: "Shipping costs not included for data collections before Feb 16th 2026."
- `availabilityAmazon`: "Availability of the Amazon offer". Its codes include `NO_OFFER(-1)` "No Amazon offer exists", `NOW(0)` "Amazon offer is in stock and shippable", pre-order, unknown, back-order, and "delay", the last with `availabilityAmazonDelay` "min and max shipping delay in hours".
- `stats.buyBoxIsAmazon`: "Only set when the offers parameter was used. If Amazon is the seller in the buy box."
- `stats.buyBoxStats`: "Each key represents the sellerId of the buy box seller". Each entry carries `percentageWon` ("an approximation of the percentage the seller won the buy box"), `avgPrice` and `lastSeen`.
- `buyBoxSellerIdHistory`: "If no seller qualified for the Buy Box the sellerId "-1" is used. If it was hold by an unknown seller (a brand new one) the sellerId is "-2"."
- Offer `isAmazon`: "True if the seller is Amazon (e.g. "Amazon.com"). Note: Amazon's Warehouse Deals seller account or other accounts Amazon is maintaining under a different name are not considered to be Amazon."
- MAP display: offer `isMAP` ("If the price of this offer is hidden on Amazon due to a MAP ("minimum advertised price") restriction"), `stats.buyBoxIsMAP`, and `newPriceIsMAP` ("Can be used to differentiate out of stock vs. MAP restricted prices (as in both cases the current price is -1)").

The package's Keepa reference restates the slots and codes: "`availabilityAmazon: -1` means no Amazon offer, not no marketplace offers." (keepa skill `references/product-file.md`, internal)

## What practitioners add

**Hybrid overlap and the retail offer.**

- **Do not run one ASIN on both channels.** Rachel Seiton (MerchantSpring, "Amazon Hybrid Selling: Maximize Sales, Protect Margins", 2026-04-02): "do not list the same exact ASIN on both 1P and 3P simultaneously"; otherwise "you'll be competing with Amazon for the Buy Box". She warns that Amazon may then stop issuing purchase orders for that SKU. She suggests selling through 1P stock before a 3P offer goes up. [opinion] (https://merchantspring.io/resources/amazon-hybrid-selling-maximize-sales-protect-margins, read 2026-10-14)
- **Overlap is a purpose question.** Chris Turton ("Amazon 1P vs 3P: Is a Hybrid Model Right for Your Brand in 2026?", 2026-10-13):
  - "If Amazon and your seller account both offer the same product, your offer can compete with Amazon's for the Featured Offer."
  - "Amazon sets the price of its retail offer."
  - "Before creating overlapping offers, establish the purpose."
  - Allow for "stock already owned by Amazon" when the retail offer returns.

  [opinion] (https://www.christurtonecommerce.com/amazon-1p-vs-3p-hybrid-model/, read 2026-10-14)
- **Two failure modes on a shared ASIN.** AMALYZE glossary ("Seller / Vendor Hybrid", no author named, undated):
  - "the buy box becomes a competition between Amazon's vendor price and your 3P seller price";
  - Amazon may discount below the brand's seller price, or the seller price may fall below wholesale cost and lead Amazon to cut purchase orders.
  - Its table gives vendor accounts "Amazon may edit content" against seller "Full listing control", and recommends "MSRP and MAP enforcement across both channels".

  [opinion] (https://amalyze.com/resources/glossary/seller-vendor-hybrid, read 2026-10-14)
- **Amazon decides the page, and can undermine MAP.** Denny Smolinski (beBOLD Digital, "How Amazon Vendor Central Works and How It Can Grow Your Brand", published 2026-06-02, updated 2026-08-28):
  - "Vendors can submit contributions, but Amazon ultimately decides what appears live on the product detail page."
  - "Amazon sets the retail price and may discount aggressively to stay competitive."
  - "MAP policies can be undermined".

  [opinion] (https://www.bebolddigital.com/blog/amazon-vendor-central, read 2026-10-14)
- **Amazon may undercut MAP.** Peter Sims (Velocity Sellers, "Amazon Vendor Central Management: The Brand Playbook", 2026-01-22): Amazon "determines retail pricing", and "Amazon may undercut MAP policies, bundle products, or suppress visibility if margin expectations aren't met." [opinion] (https://www.velocitysellers.com/2026/01/22/amazon-vendor-central-management/, read 2026-10-14)
- **Amazon reselling a brand.** Mike Begg (Practical Ecommerce, "2 Ways Amazon Directly Sells a Brand's Products", 2019-11-15): "Amazon will compete against a brand for the buy box when it sells the brand's products". When Amazon buys from an authorized vendor and resells, "it is nearly impossible to remove it from the listings and the buy box". [opinion, old] (https://www.practicalecommerce.com/?p=186209, read 2026-10-14)

**Content precedence and vendor catalog work.**

- **Seller Central content often wins on a 1P item.** Seiton: "content submitted via Seller Central often publishes on the detail page even if the item is primarily 1P". [opinion] (MerchantSpring, same article)
- **Registered-brand content takes precedence; hybrid accounts create precedence fights.** Katy Luxem (eCommerce Nurse, "The Basics of Sellers vs Vendors On Amazon", 28 December 2023):
  - "Registered brands' content will take precedence over other content on a product's detail page";
  - "Multiple accounts (especially with one tied to the Brand Registry) can often create issues with what content takes precedence";
  - "In Seller Central A+ Content, sellers get two extra module spaces compared to vendors";
  - "High-volume vendors can also unlock other features, like premium A+".

  [opinion] (https://ecommercenurse.com/differences-between-sellers-and-vendors-on-amazon/, read 2026-10-14)
- **Legacy vendor contributions can keep driving indexing after the display changes.** William Fikhman (Marketplace Officer, "Amazon Listing Indexing Errors: The Catalog Problems Seller Central Won't Show You", June 25, 2026):
  - "Listing content on Amazon is stored as a series of contributions from different sources: the brand owner's submission, historic retail or vendor data, authorized third-party submissions, and catalog update feeds."
  - "Brands operating across both Vendor Central and Seller Central are particularly likely to encounter this pattern".
  - The search algorithm "may continue reading an older contribution from a prior source, such as a Vendor Central feed from a wholesale period … while the updated copy appears correctly to buyers".
  - His remedy: "a flat file hard overwrite … or a Catalog Support ticket".
  - [seat] The legacy XML feeds are deprecated in SP-API (A5). The claim that search reads a different contribution from the one displayed is observation, not an Amazon statement.

  [opinion] (https://www.marketplaceofficer.com/blog/silent-killers-catalog-errors-destroy-amazon-listing-indexing, read 2026-10-14)
- **Vendor catalog changes are slow and approved.** Henriette Rasmussen (AMALYTIX, "Creation of Amazon product listings in Vendor Central", 2024-02-26):
  - "Every change to your product catalog must be approved by Amazon";
  - "It can take up to two weeks for the new uploaded products to appear in your catalog";
  - images "up to 24 hours".

  These are practitioner figures, not Amazon's. [opinion] (https://www.amalytix.com/en/knowledge/marketing/vendor-productlisting-catalogue/, read 2026-10-14)

**A+ on the vendor side.**

- **Premium A+ on the vendor side was invite-only and paid; on the seller side it is free by eligibility.** Katy Luxem (eComEngine, "What is Amazon A+ Premium Content and Who Can Use It?", originally August 18, 2021, updated February 21, 2025):
  - "A+ Content is free for Professional Sellers and vendors enrolled in the Amazon Brand Registry";
  - Premium was "an invite-only program available to very large brand owners through Vendor Central", with costs "negotiated between the brand and the vendor manager", "Usually … between $250,000 to $500,000 per year";
  - seller eligibility: "a Brand Story module published" and "five approved A+ Content modules over the past year".

  The cost figure is the practitioner's alone; no Amazon page read gives a vendor Premium A+ price. [opinion] (https://www.ecomengine.com/blog/amazon-a-plus-premium-content, read 2026-10-14)
- **History of the names.** Tammy Duchow (Flywheel, "Deconstructing Amazon A+ and Enhanced Brand Content", February 19, 2018):
  - "A+ enhanced marketing content (EMC) for vendors, and enhanced brand content (EBC) for brand-registered sellers";
  - Basic vendor A+ "allows for five modules", Premium "allows for seven";
  - "Unless you have a Premium A+ agreement with Amazon, you won't see these modules available to you in Vendor Central".

  The page is eight years old. Amazon's model keeps the EMC/EBC names (D1), the 7-module cap survives in the API's Premium rule, and the tutorial still gives vendors five (D3, where Amazon's pages disagree). [opinion, old] (https://www.flywheeldigital.com/blog/amazon-a-plus-and-enhanced-brand-content, read 2026-10-14)

**Reports and traffic by account.**

- **SQP does not exist for vendors, even with Brand Analytics.** Marketplace Ad Pros ("Amazon Search Query Performance: How to Actually Read It", no individual byline, last updated September 2, 2026): "A note for 1P sellers: this report does not exist for you. It is seller-only. When we requested it on vendor accounts, Amazon accepted the request with a 202 and then failed it within about nine seconds with the message that the API is not available to vendors". They "re-confirmed the same result on a vendor account enrolled in Brand Analytics"; "Brand Analytics registration does not unlock it." "There is no vendor equivalent." This agrees with Amazon's availability line (G1) and adds the failure mode: a 202, then failure. [opinion] (https://marketplaceadpros.com/guides/amazon-search-query-performance-report-guide/, read 2026-10-14)
- **SQP is seller-only (agreeing voices).**
  - Reason Automation's help page "Search Query Performance by ASIN (Seller Only)": "This report is currently only available for Sellers who are brand registered." [opinion] (https://help.reasonautomation.com/brand-analytics/search-query-performance-by-asin-seller-only, read 2026-10-14)
  - Perpetua (Martin Saunders, October 16, 2024): "the Search Query Performance report is only available to brand-registered sellers." [opinion] (https://perpetua.io/blog-amazon-search-query-performance/, read 2026-10-14)
- **Seller reporting is deeper.** Seiton says "Seller Central's Brand Analytics and Business Reports go much deeper" than vendor reporting. [opinion] (MerchantSpring, same article)
- **Vendor traffic is retail-featured views only; vendors get no sessions.** Andrew Hamada (Reason Automation, "Amazon Glance Views and featured offer page views: About Vendor Central Traffic & Conversion Data"; the page shows Sep 25, 2025, and Sep 24, 2026 also appears on it):
  - "Glance views are only counted when a retail (1P) offer is featured (i.e. winning the buy box)";
  - "Glance views do not include traffic when a third-party (3P) offer is featured";
  - "Glance views are only available in manufacturing view in Retail Analytics in Vendor Central and via Amazon's SP-API";
  - "In 2025, glance views were renamed to featured offer page views (FOPVs) in Vendor Central, but the definition and data remained same. The new name makes it clearer that views are only counted when retail is the featured offer";
  - a sub-point under the rename: "This change also makes it clearer that page views are the same traffic measure for vendors and sellers", followed by "As of Q4 2025 this metric is being released with very limited availability". The page does not say which field or report carries a vendor "page views" metric; recorded as written, not relied on;
  - sessions "are not available to 1P vendors at this time";
  - on conversion, "Amazon doesn't calculate it for you" (vendors build it from Manufacturing-view metrics);
  - seller page views "do not exclude traffic when third-party (3P) offers are featured".

  The retail-featured scope agrees with Amazon's schema (H6) and report note (H2). The rename is not on any Amazon page read today. [opinion] (https://www.reasonautomation.com/resource-library/traffic-data-vendor-central-now-available, read 2026-10-14)
- **Vendor ARA tiers and Brand Registry.** Denny Smolinski (beBOLD Digital, "Amazon Brand Analytics in Vendor Central Explained 2026", published Jun 8, 2022, updated Feb 8, 2026):
  - "Premium is a suite of additional reports beyond what is available in Amazon Retail Analytics (ARA) Basic";
  - "As a prerequisite to keeping this reporting, a vendor must enroll in Brand Registry or they will lose access."

  The article does not name SQP or SCP. [opinion] (https://www.bebolddigital.com/blog/amazon-brand-analytics-explained, read 2026-10-14)

**Where practitioners disagree, and how it is settled.**

- *Who wins content precedence.* MerchantSpring (Seiton) says seller content often wins; Luxem says registered-brand content takes precedence; AMALYZE and beBOLD say Amazon decides; Fikhman says legacy vendor data can keep driving indexing; the staff replies in C5 and C6 describe legacy or winning retail/vendor contributions blocking the brand. Settled at the source as far as the source goes: Amazon's FAQ (C1, C2) is the only general statement, and it wins over every practitioner claim. Brand owners rank highest; a vendor's data "might not have priority"; Amazon's own data is reached by ticket. No Amazon page gives the order for a brand that is both vendor and brand owner (C8, Open question 1), so no practitioner direction is adopted as a rule.
- *Whether to overlap at all.* MerchantSpring says never on the same ASIN; Turton says only with a stated purpose. No Amazon page rules on it; neither becomes a position.
- *Vendor A+ module counts.* Flywheel (2018): vendors five, Premium seven. Luxem (2023): sellers get "two extra module spaces compared to vendors". Both agree with Amazon's A+ tutorial (sellers seven, vendors five), but Amazon's own pages disagree with each other (D3: tutorial, troubleshooting guide, model, seller-side help). Not settled by preference: the binding limit is the A+ API's validation reply at run time. Neither practitioner count becomes a rule.

## Published research

- **Le Chen, Alan Mislove, Christo Wilson, "An Empirical Analysis of Algorithmic Pricing on Amazon Marketplace", WWW 2016.** [research] (https://mislove.org/publications/Amazon-WWW.pdf, read 2026-10-14)
  - A random-forest model of the Buy Box winner found the two price features most important, then seller feedback.
  - "Although we observe that "being Amazon" does confer some advantage, we caution that this does not necessarily mean that Amazon has tilted the Buy Box algorithm in their favor", since unmeasured features such as sales volume may load onto it.
  - They saw "many cases where Amazon itself appears to be employing algorithmic pricing", for example pricing at "a premium above the lowest price of all other sellers".
  - Amazon offered "around 75% of all best-selling products" in their crawls.
  - **Transfer:** medium for "Amazon retail is a strong, price-reactive Featured Offer competitor". Low for any current weight, given 2014–2015 data and later changes to the Featured Offer rules (E1, E3).
- **Feng Zhu, Qihong Liu, "Competing with Complementors: An Empirical Look at Amazon.com", Strategic Management Journal 39(10), 2018, pp. 2618–2642.** [research] (Harvard DASH record, https://dash.harvard.edu/entities/publication/06b55865-1bab-4ccb-95c6-a17b6ff9100a, read 2026-10-14; abstract read as summarised by the fetch, opening sentence "Platform owners sometimes enter complementors' product spaces and compete against them.")
  - Amazon tends to enter successful product spaces as a retailer.
  - Entry lowers affected third-party sellers' later growth but raises product demand and lowers shipping costs for consumers.
  - **Transfer:** low to medium. It supports treating Amazon retail's arrival on an ASIN as an event, not a constant. It says nothing about content precedence.
- **Baojun Jiang, Kinshuk Jerath, Kannan Srinivasan, "Firm Strategies in the "Mid Tail" of Platform-Based Retailing", Marketing Science 30(5), 2011 (DOI 10.1287/mksc.1110.0656).** [research] (abstract read from the Crossref record, https://api.crossref.org/works/10.1287/mksc.1110.0656, read 2026-10-14)
  - Starting point: "Amazon tends to sell high-demand products and leave long-tail products for independent sellers to offer".
  - The model: a platform that learns from sellers' early sales which mid-tail products to sell directly. The seller then has an incentive "to mask any high demand by lowering his sales with a reduced service level".
  - **Transfer:** low. Like Zhu and Liu, it explains why retail's presence on an ASIN is an event that can start, not a constant. It says nothing about content precedence or listing metrics.
- **Chiara Farronato, Andrey Fradkin, Alexander MacKay, "Self-Preferencing at Amazon: Evidence from Search Rankings", NBER Working Paper 30894, January 2023.** [research] (https://www.nber.org/papers/w30894, read 2026-10-14)
  - "Amazon branded products are indeed ranked higher than observably similar products in consumer search results", with prominence "30% to 60% of the prominence granted to sponsored products".
  - **Transfer:** low. It concerns Amazon's own brands (private label), not Amazon reselling a vendor's brand.
- **Regina Seibel, Florian Dendorfer, "What's In the Box? The Effect Of Self-Preferencing On Amazon Marketplace", SSRN, 2026 (DOI 10.2139/ssrn.6181653; an earlier 2025 version is 10.2139/ssrn.5219585).** [research] (abstract read from the Crossref record, https://api.crossref.org/works/10.2139/ssrn.6181653, read 2026-10-14; the SSRN page answered 403)
  - In the "Similar item to consider" box, Amazon suppresses alternatives to Amazon Basics products on the Canadian site but not the US site.
  - Non-Amazon Basics products denied a recommendation "suffer a 11% decrease in the volume of sales".
  - **Transfer:** low. It covers private label and a recommendation widget, not 1P resale of a brand.
- **Andrei Hagiu, Tat-How Teh, Julian Wright, "Should platforms be allowed to sell on their own marketplaces?", RAND Journal of Economics, 2022 (DOI 10.1111/1756-2171.12408).** [research] (abstract read from the Crossref record, read 2026-10-14)
  - A model of the "dual mode": "running marketplaces for third-party products, while selling their own products on those marketplaces". A ban on the dual mode "can harm consumer surplus and welfare even when the platform would otherwise engage in product imitation and self-preferencing".
  - **Transfer:** very low for listing work. It is policy economics, cited here only so a reader knows the literature on 1P/3P coexistence is about competition policy, not about listing content.

No published study was found on content precedence between vendor and seller contributions, on conversion of seller offers on ASINs where Amazon retail also sells, on SQP access by account type, or on how vendor glance views relate to seller sessions.

## Stable enough for a skill

- The Listings Items API serves sellers and vendors. Its `sellerId` path value is "a merchant account or vendor code". Supported product types differ between merchants and vendors; cx reads them per account rather than assuming. (Listings Items API; listingsItems_2021-08-01.json)
- A seller authorization and a vendor authorization are separate; an app chooses Sellers, Vendors or both, and roles depend on that choice. Vendor authorization is per vendor group, and a refresh token for one group fails for another group's data. (Authorize Public Applications; Register your Application; Authorize your Application to Access Vendor Groups)
- The Pricing and Selling Partner Insights roles are not available to vendors, and the Product Pricing API is "Sellers only". (roles page; Product Pricing API)
- For sellers, `putListingsItem` replaces product facts and `patch` can delete. For vendors, `put` merges, `patch` adds or replaces only, individual values cannot be deleted, and offer-only listings are not supported. (Building Listings Management Workflows Guide)
- `BUYABLE` never applies to a vendor listing. Catalog `vendorDetails` and Listings `procurement` (`costPrice`) are vendor-only. (listingsItems_2021-08-01.json; catalogItems_2022-04-01.json)
- A vendor's submission to an ASIN that already has a listing "might not have priority" on the detail page. Brand owners have the highest precedence. Where Amazon uses its own data, the brand owner overrides it by a ticket to support, not by an API write. (Listings APIs FAQ)
- When several contributors exist, Amazon picks the shown value. On the seller side, a verified contribution not shown after the window the help page states means "another contributor's information" was selected. (Suggest changes to your product detail page)
- A+ is one API with two families: `EBC` from Seller Central and `EMC` from Vendor Central. An "existing retail contribution" blocks A+ submissions; only support (sellers) or the Vendor Manager (vendors) can release it; "the API cannot override it". (aplusContent_2020-11-01.json; A+ Content Troubleshooting Guide)
- Amazon sets the prices of its own first-party sales. (Responses to Questions for the Record, 2019)
- A seller's Featured Offer eligibility can be lost by pricing above reference prices, and one listed reference price is the highest recent price shipped and sold by Amazon. (Pricing Health)
- The seller's Featured Offer percentage counts only page views where the seller's offer was featured. Sessions count the product page "regardless of the seller in the Buy Box". (Becoming the Featured Offer; Business reports glossary; Sales and Traffic schema; SEAmod forum reply)
- `GET_SALES_AND_TRAFFIC_REPORT`, SQP and SCP are available to sellers, not vendors. Market Basket, Search Terms and Repeat Purchase are available to both. The `GET_VENDOR_*` retail analytics types are vendor-only. Each report's own "Availability" line on the Analytics Reports page decides, not the role alone. (Analytics Reports; SP-API Vendor Use Cases; roles page)
- A vendor's glance views count only views while retail holds the Featured Offer, and the vendor traffic report carries no sessions or conversion. Vendor glance views are not comparable with seller sessions or page views. (Analytics Reports; vendorTrafficReport.json; analytics_vendorAnalytics_2024_09_30.graphql)
- Vendor ordered units and revenue are populated only in the manufacturing view. Glance views are absent from the sourcing view. The vendor dataset keeps no historical catalog attributes. (vendorSalesReport.json; Vendor Analytics Dataset Use Case Guide)
- Vendor Retail Analytics reports use Pacific time and Sunday-to-Saturday weeks. A request for a period that is not yet available ends `FATAL`. (Analytics Reports)
- Keepa marks Amazon's own offer separately: `csv[0]`, `availabilityAmazon`, `stats.buyBoxIsAmazon` (with offers), and offer `isAmazon`. Warehouse Deals and other Amazon-run accounts are not "Amazon" there. (Keepa Product.java, Stats.java, Offer.java)

## What cx must read at run time

- **Which account the connection is.**
  - The SP-API door holds one connection per region and "holds no seller id; listing paths carry one" (SP-API door `SKILL.md`, internal).
  - Whether that connection is a Seller Central or a Vendor Central authorization is a fact of the tenant's settings, not of any one reply. cx records it once per tenant (Open question 2).
  - The day-2 run shows a seller connection. On a seller connection, `GET_VENDOR_*` types and the Vendor Analytics dataset are not requested (Amazon's availability lines; the day-1 run's 400 is consistent with that). On a vendor connection, SQP fails after a 202 (Marketplace Ad Pros).
- **The path id.** For a seller, the merchant id comes from the route the SP-API skill names (`SKILL.md`: the Sellers API replies carry no seller id; read it from a reply such as `GET /products/pricing/v0/price` by SKU). For a vendor, the vendor code that owns the SKU comes from the vendor (Vendor Central Settings > Contacts lists the group's codes, per the vendor groups page). cx never takes the Keepa Buy Box seller id as the account's own id.
- **Is Amazon retail on the ASIN, and does it hold the Featured Offer?**
  - Keepa product file (`cx get amazon/us/<ASIN>/product --source keepa`): `availabilityAmazon`; `csv[0]` (terminal value); `stats.buyBoxIsAmazon`, `stats.buyBoxSellerId`, `stats.buyBoxStats` (needs the offers parameter, so a `cx raw keepa` route with offers; see the keepa skill's `raw-routes.md`); offers' `isAmazon`; `buyBoxSellerIdHistory`.
  - On a seller connection only: SP-API Product Pricing `getFeaturedOfferExpectedPriceBatch` (`currentFeaturedOffer`, `competingFeaturedOffer`, `offerIdentifier.sellerId`) and `getCompetitiveSummary`. door.md owns the call shapes. On a vendor connection the Product Pricing API is not available, so Keepa alone answers it.
- **The schema for a vendor write.** `getDefinitionsProductType` with `requirements=LISTING` (never `LISTING_OFFER_ONLY` for a vendor) and the vendor code as `sellerId` if Amazon accepts it. The schema, not this file, carries limits and required attributes. Then `putListingsItem` or `patchListingsItem` with `mode=VALIDATION_PREVIEW` before the real call.
- **Whose data the page shows: what this account submitted against what the page shows.**
  - `getListingsItem` with `includedData=attributes,issues,summaries` returns "the latest data provided by the selling partner" (Listings Items API, Considerations).
  - `getCatalogItem` with `includedData=attributes,summaries` (plus `vendorDetails` on a vendor connection) returns the reconciled ASIN data.
  - A difference on a hybrid ASIN is a precedence question before it is a content question.
- **A+ family and ownership.** `searchContentPublishRecords` (by ASIN and store) for `contentType` `EBC`/`EMC`/`BrandStory`; `getContentDocument` for `badgeSet`. The submit-time error text "existing retail contribution" marks an ownership block (D2).
- **Funnel figures by account.**
  - Seller: `GET_SALES_AND_TRAFFIC_REPORT` (`buyBoxPercentage`, `sessions`, `unitsOrdered`), SQP and SCP, or Data Kiosk Seller Analytics (`featureOfferPct`, `glanceViews`).
  - Vendor, when a vendor authorization exists: `GET_VENDOR_TRAFFIC_REPORT` and `GET_VENDOR_SALES_REPORT` (with `distributorView=MANUFACTURING` for ordered units and glance views), `GET_VENDOR_REAL_TIME_*`, `GET_VENDOR_INVENTORY_REPORT`, `GET_VENDOR_NET_PURE_PRODUCT_MARGIN_REPORT`, `GET_VENDOR_FORECASTING_REPORT`, or Data Kiosk `analytics_vendorAnalytics_2024_09_30` (`manufacturingView` for traffic). If the brand is hybrid and only the seller connection exists, cx asks for a vendor-side export or a vendor authorization (Open question 3).
  - Both: Market Basket, Search Terms, Repeat Purchase.
  - Report names, options, waits and the FATAL-if-early rule are door.md's; the availability clocks live on the Analytics Reports page and may change. The operations are `createReport` → `getReport` → `getReportDocument`, and Data Kiosk `createQuery` → `getQuery` → `getDocument`.
- **Hourly glance views without a report.** The `DETAIL_PAGE_TRAFFIC_EVENT` notification ("Sellers and vendors can subscribe to this notification") needs a notification subscription. Whether the package may subscribe is not settled (Open question 12).

## Pages read

| Page name | URL | Date read | What it gave |
|---|---|---|---|
| Listings Items API | https://developer-docs.amazon.com/sp-api/docs/listings-items-api | 2026-10-14 | "Sellers and Vendors"; product types differ by merchant or vendor; `merge` only for `fulfillment_availability`/`purchasable_offer`; attributes = latest data from the selling partner (updated 2026-09-09) |
| listingsItems_2021-08-01.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-items-api-model/listingsItems_2021-08-01.json | 2026-10-14 | `sellerId` "merchant account or vendor code"; `procurement.costPrice`; `BUYABLE` not for vendors; patch ops; `VALIDATION_PREVIEW` |
| Building Listings Management Workflows Guide | https://developer-docs.amazon.com/sp-api/docs/building-listings-management-workflows-guide | 2026-10-14 | Seller put replaces / vendor put merges; vendor no delete; vendor no offer-only; "procurable"; "A main product image and up to nine secondary images" (updated 2026-09-24; re-read at reconciliation) |
| Listings APIs FAQ | https://developer-docs.amazon.com/sp-api/docs/listings-apis-faq | 2026-10-14 | Vendor "might not have priority"; brand owner precedence and ticket override; product-type access; vendor cost-price limits; vendor schema drift; "A+ premium content is not supported" (read as `.md`, updated 2026-09-09) |
| definitionsProductTypes_2020-09-01.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/product-type-definitions-api-model/definitionsProductTypes_2020-09-01.json | 2026-10-14 | `requirements` values; optional `sellerId` |
| catalogItems_2022-04-01.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/catalog-items-api-model/catalogItems_2022-04-01.json | 2026-10-14 | `vendorDetails` vendor-only; `sellerId` "seller account or vendor code" |
| Listings Management Workflow Migration | https://developer-docs.amazon.com/sp-api/docs/listings-management-workflow-migration | 2026-10-14 | `JSON_LISTINGS_FEED` sellers and vendors; XML feeds sellers only, deprecated (updated 2026-09-09) |
| Selling Partner API Roles | https://developer-docs.amazon.com/sp-api/docs/roles-in-the-selling-partner-api | 2026-10-14 | Per-role seller/vendor availability (updated 2026-10-13; re-read at merge) |
| Product Pricing API | https://developer-docs.amazon.com/sp-api/docs/product-pricing-api | 2026-10-14 | "Sellers only"; Pricing role (updated 2026-09-09; re-read at merge) |
| productPricing_2022-05-01.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/product-pricing-api-model/productPricing_2022-05-01.json | 2026-10-14 | FOEP `currentFeaturedOffer`/`competingFeaturedOffer`, `offerIdentifier.sellerId` |
| sellers.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/sellers-api-model/sellers.json | 2026-10-14 | Two operations; no seller id field in replies |
| Authorize Public Applications | https://developer-docs.amazon.com/sp-api/docs/authorize-public-applications | 2026-10-14 | Seller Central or Vendor Central consent URL |
| Register your Application | https://developer-docs.amazon.com/sp-api/docs/registering-your-application | 2026-10-14 | Sellers / Vendors / both; roles depend on it |
| Authorize your Application to Access Vendor Groups | https://developer-docs.amazon.com/sp-api/docs/authorize-your-application-to-access-vendor-groups | 2026-10-14 | Vendor group / vendor codes; token per group; 10 groups (updated 2026-09-09) |
| Vendor Central URLs | https://developer-docs.amazon.com/sp-api/docs/vendor-central-urls | 2026-10-14 | Vendor Central host per store (updated 2026-09-09) |
| SP-API Vendor Use Cases | https://developer-docs.amazon.com/sp-api/docs/sp-api-vendor-use-cases | 2026-10-14 | Vendor directory: A+ and Catalog for marketing content; BA reports = Market Basket, Search Terms, Repeat Purchase; retail analytics types (updated 2026-10-05) |
| Analytics Reports | https://developer-docs.amazon.com/sp-api/docs/report-type-values-analytics | 2026-10-14 | Availability per report type; all `GET_VENDOR_*` types, options, PST, lookback and reporting-period headings, availability SLAs, FATAL-if-early; no clock for seller types; seller two-year start; SQP "MONTH: 17 months" under "Maximum reporting periods", no lookback heading for SQP (updated 2026-10-06; re-read at merge and at reconciliation) |
| Reports API FAQ | https://developer-docs.amazon.com/sp-api/docs/reports-faq | 2026-10-14 | "Not all reports are available to vendors" (updated 2026-09-09) |
| Performance Reports | https://developer-docs.amazon.com/sp-api/docs/report-type-values-performance | 2026-10-14 | Promotion report roles by account; separate seller and vendor coupon sections (updated 2026-10-06) |
| Inventory Reports | https://developer-docs.amazon.com/sp-api/docs/report-type-values-inventory | 2026-10-14 | Merchant listings report roles; no vendor statement (updated 2026-10-06) |
| vendorTrafficReport.json, vendorSalesReport.json, vendorRealTimeTrafficReport.json | https://github.com/amzn/selling-partner-api-models/tree/main/schemas/reports | 2026-10-14 | Vendor field definitions; glance views only; UTC hours in rapid reports |
| sellerSalesAndTrafficReport.json | https://github.com/amzn/selling-partner-api-models/blob/main/schemas/reports/sellerSalesAndTrafficReport.json | 2026-10-14 | `buyBoxPercentage`, `sessions`, `unitSessionPercentage` definitions |
| sellingPartnerSearchQueryPerformanceReport.json, sellingPartnerSearchCatalogPerformanceReport.json | https://github.com/amzn/selling-partner-api-models/tree/main/schemas/reports | 2026-10-14 | Sunday/Saturday rule with "fatal error"; neither states whose offer a purchase was on; SCP "Impressions include sponsored search results" |
| Data Kiosk API | https://developer-docs.amazon.com/sp-api/docs/data-kiosk-api | 2026-10-14 | "Sellers and Vendors"; role table lists Brand Analytics alone for every operation; roles checked per field "upon query creation" (updated 2026-09-09; re-read at reconciliation) |
| Correction: Data Kiosk role requirements | https://developer-docs.amazon.com/sp-api/changelog/correction-data-kiosk-role-requirements | 2026-10-14 | Vendor Analytics and Sales and Traffic need Brand Analytics; Economics needs Selling Partner Insights |
| Vendor Analytics Dataset Use Case Guide | https://developer-docs.amazon.com/sp-api/docs/vendor-analytics-dataset-guide | 2026-10-14 | Sourcing vs manufacturing views; glance views manufacturing-only; date behaviour; partial data; incompatibilities; catalog attributes current only (updated 2026-09-30) |
| analytics_vendorAnalytics_2024_09_30.graphql | https://github.com/amzn/selling-partner-api-models/blob/main/schemas/data-kiosk/analytics_vendorAnalytics_2024_09_30.graphql | 2026-10-14 | `glanceViews` "where Retail is the featured offer"; `lostFeaturedOffer`; two-year start; P30D retention |
| analytics_sellerAnalytics_2025_03_31.graphql | https://github.com/amzn/selling-partner-api-models/blob/main/schemas/data-kiosk/analytics_sellerAnalytics_2025_03_31.graphql | 2026-10-14 | `featureOfferPct` over glance views; `glanceViews`; PAAM rights for merchant account requests |
| Notification Type Values | https://developer-docs.amazon.com/sp-api/docs/notification-type-values | 2026-10-14 | `DETAIL_PAGE_TRAFFIC_EVENT` and `ITEM_SALES_EVENT_CHANGE` for sellers and vendors, hourly (updated 2026-09-30) |
| Notifications API v1 use case guide | https://developer-docs.amazon.com/sp-api/docs/notifications-api-v1-use-case-guide | 2026-10-14 | unreachable: `.md` route returned "Page Not Found" (the anchor is linked from Analytics Reports) |
| SP-API vendor FAQs / reports FAQ | https://developer-docs.amazon.com/sp-api/docs/sp-api-vendor-faqs | 2026-10-14 | unreachable: `.md` route returned the site shell, no page body |
| A+ Content API | https://developer-docs.amazon.com/sp-api/docs/a-plus-content-api-use-case-guide | 2026-10-14 | "Sellers and Vendors"; roles (updated 2026-09-30) |
| aplusContent_2020-11-01.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/aplus-content-api-model/aplusContent_2020-11-01.json | 2026-10-14 | EBC/EMC/BrandStory definitions; badges; publish records |
| A+ Content Troubleshooting Guide | https://developer-docs.amazon.com/sp-api/docs/a-plus-troubleshooting | 2026-10-14 | "existing retail contribution"; EBC/EMC; Premium 7-module rule; Standard-only "not capped by the API" (updated 2026-09-30; re-read at reconciliation) |
| Create, edit, and publish A+ content | https://developer-docs.amazon.com/sp-api/docs/create-edit-publish-aplus-content | 2026-10-14 | "up to seven modules" for selling partners, "up to five" for vendors (updated 2026-10-02; read at reconciliation) |
| Suggest changes to your product detail page | https://sellercentral.amazon.com/help/hub/reference/external/G200335450 | 2026-10-14 | Contribution criteria; Brand Representative precedence; 48 hours; 1 main + 8 images; error 8541; no vendor mention (GetHelpTopic, v23 r0; no capture under the office's capture folder (outside this repository)) |
| Becoming the Featured Offer | https://sellercentral.amazon.com/help/hub/reference/external/G201687550 | 2026-10-14 | FO definition; FO % over page views; "same way for every product"; September 2026 eligibility removal (GetHelpTopic, v20; capture capture `G201687550-v20` re-read at merge) |
| Business reports glossary | https://sellercentral.amazon.com/help/hub/reference/external/G27691 | 2026-10-14 | Featured Offer percentage "less than 100% if … purchasing from another seller"; Units Ordered and Sessions definitions name no offer (capture capture `G27691-v7`, read at merge) |
| Offer placement | https://sellercentral.amazon.com/help/hub/reference/external/G201687530 | 2026-10-14 | FO from eligible offers; up to three other offers; no mention of Amazon retail (read by a seat; route and version not recorded; no capture under the office's capture folder (outside this repository); not cited for any claim) |
| Pricing Health | https://sellercentral.amazon.com/help/hub/reference/external/GSTH6YN3BR8XNWBW | 2026-10-14 | Reference prices include "highest 14-day price (shipped and sold by Amazon)"; competitive external price (GetHelpTopic, version 22; no capture under the office's capture folder (outside this repository)) |
| Search Query Performance dashboard | https://sellercentral.amazon.com/help/hub/reference/external/G8J4CB5ZBF3NX7TP | 2026-10-14 | Sellers with Brand Representative role only; organic and Sponsored Products; "buys" not split by offer (GetHelpTopic, v5 r0; capture capture `G8J4CB5ZBF3NX7TP-v5` re-read at merge) |
| Vendor Central help (contact page, content call and help node) | https://vendorcentral.amazon.com/hz/vendor/members/contact ; https://vendorcentral.amazon.com/help/hub/mons-api/GetHelpTopic ; https://vendorcentral.amazon.com/hz/vendor/members/support/help/node/G200335450 | 2026-10-14 | unreachable: all answered 302 to sign-in |
| Seller Forums: Unable to update detail page, ASINs created in legacy Vendor Central | https://sellercentral.amazon.com/seller-forums/discussions/t/3617ebe6-d713-49ee-b8a5-aacc6cc5fa12 | 2026-10-14 | Kris_Amazon: no option to regain control from the Brand Registry side; partner team (6 replies collapsed, unread) |
| Seller Forums CA: Vendor Central Title … "Winning contributor" | https://sellercentral.amazon.ca/seller-forums/discussions/t/eb53239a-38ba-45b9-8c82-8e4992d892c7 | 2026-10-14 | Winning contributor "cannot influence nor override"; Cooper_Amazon: brand registry team via vendor account |
| Seller Forums: Contribution Score and Detail Page Control for Brand Owners Using a Reseller Model | https://sellercentral.amazon.com/seller-forums/discussions/t/5db6cc8d-029e-420c-91c6-78d724db3aa5 | 2026-10-14 | Dougal_Amazon: depends on brand set-up and Selling Benefits |
| Seller Forums: Business Reports - Sessions column explanation | https://sellercentral.amazon.com/seller-forums/discussions/t/832bfb75-4d50-4842-ae7e-2727848810be | 2026-10-14 | Sessions "regardless of the seller in the Buy Box" (SEAmod) |
| Seller Forums: Update to Premium A+ Content eligibility requirements | https://sellercentral.amazon.com/seller-forums/discussions/t/301e6741-8ef5-485f-8829-a14c55647f9c | 2026-10-14 | News_Amazon 2023-10-31: Brand Story on all + five approved modules in 12 months |
| Seller Forums: Brands: New Premium A+ content promotion | https://sellercentral.amazon.com/seller-forums/discussions/t/56714bc31667d6e317a4aa85bee089f1 | 2026-10-14 | News_Amazon 2022-08-08: 15 projects in 12 months |
| Seller Forums: New Brand Analytics search dashboards are now available | https://sellercentral.amazon.com/seller-forums/discussions/t/1afe683eb0acb90bb31abdc34950ef74 | 2026-10-14 | News_Amazon 2022-04-14: SQP and SCP launched |
| Guide to Brand Registry roles | https://sell.amazon.com/blog/brand-registry-roles | 2026-10-14 | Brand Representative and Reseller definitions; Reseller no Brand Analytics; no vendor mention (Mickey Toogood, 2025-04-23) |
| Amazon Seller Central \| Sell (heading "Seller Central: Your digital portal for selling with Amazon") | https://sell.amazon.com/tools/seller-central | 2026-10-14 | "Vendor Central is by invitation only … first-party vendor relationship"; vendors "sell in bulk (wholesale) to Amazon"; same credentials sync Brand Registry, Ads, Vendor Central (title and heading re-read at merge) |
| Amazon Brand Analytics \| Sell on Amazon | https://sell.amazon.com/tools/amazon-brand-analytics | 2026-10-14 | Professional account + Brand Representative; dashboards list; no vendor mention |
| Amazon Brand Analytics: Get data to grow your business | https://sell.amazon.com/blog/brand-analytics | 2026-10-14 | "usually goes back three years"; "generally available within three days"; no vendor mention (Daisy Quaker, 2025-10-08) |
| Sponsored Products - Help increase product sales \| Amazon Ads | https://advertising.amazon.com/solutions/products/sponsored-products | 2026-10-14 | "be eligible for the Featured Offer in order to advertise"; sellers and vendors |
| Responses to Questions for the Record (House Judiciary, 2019) | https://docs.house.gov/meetings/JU/JU05/20190716/109793/HHRG-116-JU05-20190716-SD038.pdf | 2026-10-14 | Amazon sets first-party prices; FO factors; retail OOS answer |
| European Commission IP/22/7777 | https://ec.europa.eu/commission/presscorner/detail/en/ip_22_7777 | 2026-10-14 | Equal treatment in Buy Box ranking; second competing offer (HTML empty; read through the press corner document service) |
| FTC Sues Amazon for Illegally Maintaining Monopoly Power | https://www.ftc.gov/news-events/news/press-releases/2023/09/ftc-sues-amazon-illegally-maintaining-monopoly-power | 2026-10-14 | Allegations of anti-discounting; no Buy Box text; case outcome not checked |
| Keepa Product.java, Stats.java, Offer.java | https://github.com/keepacom/api_backend | 2026-10-14 | `csv[0]`, `NEW` includes Amazon, `availabilityAmazon`, `buyBoxIsAmazon`, `buyBoxStats`, `isAmazon`, MAP flags |
| MerchantSpring (Seiton) | https://merchantspring.io/resources/amazon-hybrid-selling-maximize-sales-protect-margins | 2026-10-14 | Avoid same-ASIN overlap; seller content often publishes |
| Chris Turton | https://www.christurtonecommerce.com/amazon-1p-vs-3p-hybrid-model/ | 2026-10-14 | Overlap competes for FO; Amazon sets retail price |
| AMALYZE glossary | https://amalyze.com/resources/glossary/seller-vendor-hybrid | 2026-10-14 | Two failure modes; MAP across channels |
| beBOLD Digital (Smolinski), Vendor Central | https://www.bebolddigital.com/blog/amazon-vendor-central | 2026-10-14 | Amazon decides page; sets price; MAP undermined |
| beBOLD Digital (Smolinski), Brand Analytics in Vendor Central | https://www.bebolddigital.com/blog/amazon-brand-analytics-explained | 2026-10-14 | ARA Basic/Premium; Brand Registry prerequisite for vendors |
| beBOLD Digital (Smolinski), ARA guide | https://www.bebolddigital.com/blog/new-amazon-retail-analytics-2024 | 2026-10-14 | New ARA dashboards in vendor accounts; nothing decisive (not cited) |
| Velocity Sellers (Sims) | https://www.velocitysellers.com/2026/01/22/amazon-vendor-central-management/ | 2026-10-14 | Amazon may undercut MAP |
| Practical Ecommerce (Begg) | https://www.practicalecommerce.com/?p=186209 | 2026-10-14 | Amazon competes for Buy Box when it resells |
| Reason Automation (Hamada) | https://www.reasonautomation.com/resource-library/traffic-data-vendor-central-now-available | 2026-10-14 | Glance views only when retail featured; no vendor sessions; FOPV rename; "page views … same traffic measure" sub-point (re-read at merge) |
| AMALYTIX (Rasmussen) | https://www.amalytix.com/en/knowledge/marketing/vendor-productlisting-catalogue/ | 2026-10-14 | Vendor catalog changes approved; up to two weeks |
| Marketplace Officer (Fikhman) | https://www.marketplaceofficer.com/blog/silent-killers-catalog-errors-destroy-amazon-listing-indexing | 2026-10-14 | Legacy vendor contributions and indexing |
| eCommerce Nurse (Luxem) | https://ecommercenurse.com/differences-between-sellers-and-vendors-on-amazon/ | 2026-10-14 | Registered-brand precedence; hybrid precedence fights; module difference |
| eComEngine (Luxem) | https://www.ecomengine.com/blog/amazon-a-plus-premium-content | 2026-10-14 | Vendor Premium A+ invite-only and negotiated; seller eligibility |
| Flywheel (Duchow, 2018) | https://www.flywheeldigital.com/blog/amazon-a-plus-and-enhanced-brand-content | 2026-10-14 | EMC/EBC names; vendor module counts (old) |
| Marketplace Ad Pros | https://marketplaceadpros.com/guides/amazon-search-query-performance-report-guide/ | 2026-10-14 | SQP on vendor accounts: 202 then failure; no vendor equivalent |
| Reason Automation help: SQP by ASIN (Seller Only) | https://help.reasonautomation.com/brand-analytics/search-query-performance-by-asin-seller-only | 2026-10-14 | "only available for Sellers who are brand registered" |
| Perpetua (Saunders) | https://perpetua.io/blog-amazon-search-query-performance/ | 2026-10-14 | SQP only for brand-registered sellers |
| SellerApp (Arishekar N) | https://www.sellerapp.com/blog/amazon-search-query-performance/ | 2026-10-14 | No vendor statement; Brand Registry needed (not cited for vendors) |
| Jarvio (Mulholland) | https://jarvio.io/blog/search-query-performance-report | 2026-10-14 | No vendor statement (not cited) |
| Kapoq SQP article | https://kapoq.com/search-query-performance-report-explained/ | 2026-10-14 | unreachable: HTTP 403 to fetch and to curl |
| MerchantSpring podcast: Navigating Brand Registry as an Amazon Vendor | https://podcast.merchantspring.io/2048790/episodes/18915478-amazon-vendor-navigating-brand-registry-as-an-amazon-vendor | 2026-10-14 | Show notes only; the transcript was not served, so the "hierarchy" claim a search snippet attributed to it is not cited |
| MindgruveMacarta: How to Update Content on Amazon Vendor Central | https://www.macarta.com/blog-how-to-update-amazon-vendor-central-content/ | 2026-10-14 | unreachable: HTTP 403 |
| Chen, Mislove, Wilson (WWW 2016) | https://mislove.org/publications/Amazon-WWW.pdf | 2026-10-14 | "being Amazon" some advantage, caveated; Amazon algorithmic pricing |
| Zhu, Liu (SMJ 2018) | https://dash.harvard.edu/entities/publication/06b55865-1bab-4ccb-95c6-a17b6ff9100a | 2026-10-14 | Amazon entry into successful spaces |
| Farronato, Fradkin, MacKay (NBER w30894) | https://www.nber.org/papers/w30894 | 2026-10-14 | Amazon brands ranked higher in search |
| Seibel, Dendorfer (SSRN 2026) | https://api.crossref.org/works/10.2139/ssrn.6181653 | 2026-10-14 | Abstract via Crossref; SSRN page 403 |
| Crossref: Jiang, Jerath, Srinivasan (2011); Hagiu, Teh, Wright (2022) | https://api.crossref.org/works | 2026-10-14 | Abstracts |
| "Amazon Confidential Vendor Guide to Listing Products" (PDF on a third-party S3 bucket) | https://vssc.s3.eu-west-2.amazonaws.com/VSSC_Vendor_Guides/Vendor+Cheat+Sheet+(Softlines)(english).pdf | 2026-10-14 | not opened: marked "Amazon Confidential" and hosted by a third party; not used |
| Internal: roadmap §1.1, day-1 and day-2 run reports, SP-API door `SKILL.md` and `door.md`, keepa `product-file.md` | ceo-office/drafts, office-mailbox/from-engineering, comchatx origin/main | 2026-10-14 | No vendor row in the roadmap; `GET_VENDOR_...` 400 on day 1; seller-id-from-Buy-Box lesson; the door holds no seller id; Sellers API carries no seller id |

## Open questions

1. **Hybrid precedence.** What precedence applies when a hybrid brand's seller account (Brand Representative) and its own Vendor Central account both contribute, alongside Amazon retail's data? Amazon's pages give brand owners precedence and say vendors "might not have priority"; staff replies point to support, the partner team and the brand registry team. *Settles it:* Vendor Central help (sign-in, a vendor's own browser), or a recorded first run: a seller-side `putListingsItem` on a hybrid ASIN, `getCatalogItem` after the help page's window, then the support case answer, logged in listing-change-log.
2. **How cx knows the account type.** Tenant settings, the door's connection record, or a probe call? This is an office and engineering question for the SP-API door, not a research one. Until settled, cx asks the seller.
3. **May the package ask a hybrid brand for a second (vendor) authorization?** This is an office ruling, not a research question. Until then, cx reads vendor figures only from a file the brand provides.
4. **Does `getDefinitionsProductType` accept a vendor code as `sellerId`, and does it change the schema?** The model says "a selling partner identifier" only. *Settles it:* the first call on a vendor connection.
5. **"A+ premium content is not supported" (Listings APIs FAQ) against Premium module rules (A+ Troubleshooting Guide), and the vendor module cap.** The FAQ may mean the Listings APIs, or vendor Premium A+ through any API. The A+ tutorial's "content documents for vendors can contain up to five content modules" (D3) is a further hint, not a ruling; the troubleshooting guide and the model state other caps. *Settles it:* a vendor's first `validateContentDocumentAsinRelations` (with a Premium module, and with a six-module Standard document) before any `createContentDocument`.
6. **Does `searchContentPublishRecords` return records published by another account (Amazon Retail, the brand's vendor account) for the same ASIN?** The model does not say. *Settles it:* a hybrid brand's first call from the seller connection on an ASIN known to carry EMC.
7. **Which vendors count as "a brand representative" for the Search Terms report?** The Brand Representative role is defined for seller accounts (C4). *Settles it:* a vendor connection's first `GET_BRAND_ANALYTICS_SEARCH_TERMS_REPORT` request.
8. **Vendor Premium A+ terms today.** Practitioners say it is invite-only and negotiated. No Amazon page read states the current vendor terms. *Settles it:* Vendor Central A+ help (sign-in).
9. **Does a seller's Sponsored Products ad serve while Amazon retail holds the Featured Offer?** The Ads page says only "eligible for the Featured Offer". *Settles it:* the Amazon Ads help on ad eligibility (sign-in), or an Ads API connection showing impressions on a hybrid ASIN in hours when `buyBoxIsAmazon` is true.
10. **Whose units does the seller's Sales and Traffic `unitsOrdered` count on a hybrid ASIN?** The seat expects only the seller's own units. Neither the schema nor the Business reports glossary (G27691 v7, read at merge) says. *Settles it:* a hybrid ASIN's report set beside the vendor sales report for the same week.
11. **Do Brand Analytics SQP and SCP purchases include Amazon retail's sales of the brand's ASIN?** The schemas say "any ASIN" and "your catalog" without naming offers, and the SQP help page (G8J4CB5ZBF3NX7TP v5, read) speaks of "buys" without naming offers. *Settles it:* a first hybrid run comparing SQP purchases with seller units plus vendor ordered units.
12. **Does `DETAIL_PAGE_TRAFFIC_EVENT` for a seller count only hours when the seller is featured?** Amazon says the vendor report counts only retail-featured views. The notification's seller semantics are not stated. *Settles it:* the Notifications API use case guide (its `.md` route answered "Page Not Found" today), or a first subscription. Whether the package may subscribe at all is an office ruling.
13. **Amazon's MAP policy.** No Amazon page read states it. Keepa documents prices "hidden on Amazon due to a MAP … restriction". Vendor-side terms are behind Vendor Central sign-in. *Settles it:* Vendor Central help through a vendor's own signed-in browser, or Seller Central help on "See price in cart".
14. **Retail out of stock with open purchase orders.** Amazon's 2019 answer covers only "no outstanding purchase orders". *Settles it:* a Keepa history showing `availabilityAmazon` 3 (back-order) or 4 (delayed) alongside `buyBoxSellerIdHistory` on a hybrid ASIN.
15. **Status of the FTC case and of the EU commitments in 2026.** Not checked, because the search budget ran out. *Settles it:* the FTC case page and the Commission's case AT.40703.
16. **The FOPV rename.** Is "featured offer page views" the Vendor Central name for glance views now, do the SP-API fields keep `glanceViews`, and is there a vendor "page views" metric of the kind Hamada's sub-point describes? Only Reason Automation states it. *Settles it:* a Vendor Central release note, or a schema change in `selling-partner-api-models`.

## Positions

1. **P-vendor-and-hybrid-1.** Before any listing review or write, cx establishes whether the connection is a seller or a vendor account and records it in the review and in every change-log entry. Sources: Listings Items API; Authorize Public Applications; Register your Application; Authorize your Application to Access Vendor Groups; Selling Partner API Roles.
2. **P-vendor-and-hybrid-2.** cx never takes the account's own id from Keepa's Buy Box seller; on a hybrid ASIN that id may be Amazon's. On a seller connection, cx uses the route the SP-API skill names. On a vendor connection, the Listings Items path id is the vendor code that owns the SKU, and cx asks for it rather than inferring it. Sources: Keepa Product.java (`buyBoxSellerIdHistory`), Offer.java (`isAmazon`); listingsItems_2021-08-01.json; Authorize your Application to Access Vendor Groups; SP-API door `SKILL.md` (internal).
3. **P-vendor-and-hybrid-3.** Before reviewing or changing a listing, cx establishes whether Amazon retail offers the ASIN and who holds the Featured Offer, and records the answer in the review. Inputs: Keepa `availabilityAmazon`, `csv[0]`, offers' `isAmazon`, and with offers `stats.buyBoxIsAmazon` / `buyBoxStats`; on a seller connection also the FOEP batch reply's `currentFeaturedOffer`. On a vendor connection Keepa alone answers it, because the Product Pricing API is seller-only. Sources: Keepa Product.java, Stats.java, Offer.java; productPricing_2022-05-01.json; Product Pricing API; Selling Partner API Roles.
4. **P-vendor-and-hybrid-4.** cx applies the write semantics of the account in use and never assumes a put on one account type behaves like the other. A seller put replaces product facts. A vendor `putListingsItem` merges and cannot remove an attribute; a vendor cannot delete a value with `patchListingsItem`; vendors cannot list offer-only. cx never plans a removal (for example, a dropped bullet) as a vendor write. Source: Building Listings Management Workflows Guide.
5. **P-vendor-and-hybrid-5.** cx does not treat a missing `BUYABLE` status as a defect on a vendor listing. Source: listingsItems_2021-08-01.json.
6. **P-vendor-and-hybrid-6.** On an ASIN with more than one contributor (a vendor, Amazon retail, or the brand's seller account), cx compares Catalog Items reconciled attributes with the account's submitted Listings attributes before proposing content, and reports a write with empty `issues` as "accepted", not "shown". It reads `getCatalogItem` before calling the change live. Sources: Listings APIs FAQ; Listings Items API (attributes are the latest data from the selling partner); Suggest changes to your product detail page.
7. **P-vendor-and-hybrid-7.** When a verified seller-side contribution is still not shown after the window the help page states, cx reports that another contributor's data was selected. It names the support route Amazon gives (a ticket to Seller Central support for brand owners; the Vendor Manager or a Vendor Central case for vendors) and does not resubmit the same write. Sources: Suggest changes to your product detail page; Listings APIs FAQ; Seller Forums (Kris_Amazon); Seller Forums CA (Cooper_Amazon).
8. **P-vendor-and-hybrid-8.** cx reads an ASIN's A+ family from its publish records (`EBC` from Seller Central, `EMC` from Vendor Central). It reports an "existing retail contribution" refusal as an ownership block for Selling Partner Support or the Vendor Manager, never as a content fault, and never retries through the API. Sources: aplusContent_2020-11-01.json; A+ Content Troubleshooting Guide.
9. **P-vendor-and-hybrid-9.** cx does not propose or promise a change to Amazon's retail price; Amazon sets the price of its first-party sales. A vendor's lever is cost price, which the API cannot raise. Sources: Responses to Questions for the Record (2019); Listings APIs FAQ.
10. **P-vendor-and-hybrid-10.** Before a seller-side price proposal on a hybrid ASIN, cx names Amazon's current retail price and the Featured Offer price. It states that Pricing Health may judge the seller offer against reference prices that include the highest recent price shipped and sold by Amazon. Sources: Pricing Health; Keepa Product.java; productPricing_2022-05-01.json.
11. **P-vendor-and-hybrid-11.** listing-change-log records, for each change: the submitting account type (seller or vendor) and path id; whether Amazon retail offered the ASIN at submission; and who held the Featured Offer. Sources: Listings APIs FAQ; Becoming the Featured Offer; Keepa Stats.java.
12. **P-vendor-and-hybrid-12.** listing-change-log records the "before" of a vendor ASIN's content at change time, because the vendor dataset keeps no historical catalog attributes. Source: Vendor Analytics Dataset Use Case Guide.
13. **P-vendor-and-hybrid-13.** effect-review treats a change in Amazon retail's presence, stock or Featured Offer share between baseline and observation windows as a confounder. Where it moved, the verdict is "cannot tell" unless the targeted metric is offer-independent. Sources: Becoming the Featured Offer; Sales and Traffic schema; Seller Forums (SEAmod); Keepa Product.java and Stats.java.
14. **P-vendor-and-hybrid-14.** On a hybrid ASIN, effect-review does not read the seller account's units or unit session percentage alone as the conversion outcome. Sessions count the product page whoever is featured, while the seller's Featured Offer share counts only its own featured views. Sources: Sales and Traffic schema; Becoming the Featured Offer; Business reports glossary; Seller Forums (SEAmod).
15. **P-vendor-and-hybrid-15.** cx never compares or adds vendor glance views to seller sessions or page views, and effect-review never compares a vendor baseline with a seller observation window. Vendor glance views count only views where retail is the featured offer. Sources: Analytics Reports; analytics_vendorAnalytics_2024_09_30.graphql; Amazon Brand Analytics pages (seller-only eligibility).
16. **P-vendor-and-hybrid-16.** cx requests a report type or dataset only if its Availability line includes the connection's account type. On a seller connection, that means no `GET_VENDOR_*` type and no Vendor Analytics dataset; for a hybrid brand cx asks for the vendor export instead. On a vendor connection, that means no Sales and Traffic, SQP or SCP. Sources: Analytics Reports; SP-API Vendor Use Cases; Reports API FAQ; Correction: Data Kiosk role requirements; Authorize Public Applications; Register your Application.
17. **P-vendor-and-hybrid-17.** On a vendor account, listing-review places the listing in the funnel with vendor glance views and manufacturing-view ordered units. It says that these count only retail-featured views and that no sessions or search-query data exist for the vendor. Sources: Analytics Reports; vendorTrafficReport.json; vendorSalesReport.json; Vendor Analytics Dataset Use Case Guide.
18. **P-vendor-and-hybrid-18.** With a vendor source, cx waits for the availability stated on the Analytics Reports page (door.md holds the figures) and reads vendor dates in Pacific time. A `FATAL` for a period not yet available counts as "too early", not as an error. Source: Analytics Reports.
19. **P-vendor-and-hybrid-19.** In the EEA, cx may cite Amazon's binding commitment to rank offers equally for the Buy Box. It does not extend that commitment to other stores. Source: European Commission IP/22/7777.

**The seat's own (not for a skill)**

- Amazon.com retail's seller id in the US store is widely reported to be the same string as the US marketplace id. No Amazon page read today states it. Keepa's flag `isAmazon` is the documented test; a hard-coded id is not.
- A hybrid brand is best reviewed per ASIN: which account sells it, and which account last contributed each attribute. A single-account review of a hybrid catalogue will misread precedence as copy quality.
- For a hybrid brand, the cleanest effect-review is on ASINs sold on one channel only. Where an ASIN is on both, the honest default verdict for content changes is "cannot tell" unless Amazon retail's Featured Offer share was stable in both windows. This is the seat's reading, not a rule.
- A hybrid brand's content team should submit content from one account per ASIN. Practitioners differ on which account wins, and Amazon's pages do not settle it.
- The package's "good listing" test (Catalog title equals what was submitted) will raise false alarms on hybrid ASINs where Amazon retail's or the vendor's contribution is shown. The test should name which contributor's value is displayed.
- The Marketplace Ad Pros observation (202, then failure) means a report-script poll on a vendor SQP request will end in a failure state, not an HTTP error at create time. The script should not read a 202 as "this report exists for this account".
- Practitioners' "legacy vendor contribution drives indexing" is plausible but is not an Amazon statement. A skill should not tell a seller that search reads a different contribution than the page shows.

## Verification

This file is the merge (2026-10-14) of two seats' files on the same subject: the angle file at this path and the former element file `elements/vendor-and-hybrid.md`, now merged into this file (cite this file, not that one). Vendor and hybrid selling is an angle, not a listing element, so the merged file lives here. Every sourced claim of both files is kept, deduplicated; where both quoted the same page, the fuller quote is kept. Section letters were re-lettered (A account types and routes; B vendor writes; C precedence; D A+; E retail offer and price; F seller-side counts; G report availability; H vendor analytics; I Keepa).

**Position id map (old → new).**

- angles/vendor-and-hybrid.md: P-vendor-and-hybrid-1 → P-vendor-and-hybrid-3; P-vendor-and-hybrid-2 → P-vendor-and-hybrid-6; P-vendor-and-hybrid-3 → P-vendor-and-hybrid-7; P-vendor-and-hybrid-4 → P-vendor-and-hybrid-8; P-vendor-and-hybrid-5 → P-vendor-and-hybrid-4; P-vendor-and-hybrid-6 → P-vendor-and-hybrid-9; P-vendor-and-hybrid-7 → P-vendor-and-hybrid-10; P-vendor-and-hybrid-8 → P-vendor-and-hybrid-11; P-vendor-and-hybrid-9 → P-vendor-and-hybrid-13; P-vendor-and-hybrid-10 → P-vendor-and-hybrid-14; P-vendor-and-hybrid-11 → P-vendor-and-hybrid-15; P-vendor-and-hybrid-12 → P-vendor-and-hybrid-16; P-vendor-and-hybrid-13 → P-vendor-and-hybrid-18; P-vendor-and-hybrid-14 → P-vendor-and-hybrid-2; P-vendor-and-hybrid-15 → P-vendor-and-hybrid-19.
- former elements/vendor-and-hybrid.md: P-vendor-and-hybrid-el-1 → P-vendor-and-hybrid-1; P-vendor-and-hybrid-el-2 → P-vendor-and-hybrid-2; P-vendor-and-hybrid-el-3 → P-vendor-and-hybrid-4; P-vendor-and-hybrid-el-4 → P-vendor-and-hybrid-5; P-vendor-and-hybrid-el-5 → P-vendor-and-hybrid-6; P-vendor-and-hybrid-el-6 → P-vendor-and-hybrid-7; P-vendor-and-hybrid-el-7 → P-vendor-and-hybrid-8; P-vendor-and-hybrid-el-8 → P-vendor-and-hybrid-16; P-vendor-and-hybrid-el-9 → P-vendor-and-hybrid-17; P-vendor-and-hybrid-el-10 → P-vendor-and-hybrid-15; P-vendor-and-hybrid-el-11 → P-vendor-and-hybrid-3; P-vendor-and-hybrid-el-12 → P-vendor-and-hybrid-12.

**Disagreements between the two files, settled at the source.**

1. *Featured Offer expected price as an input.* The angle file's P-1 listed the FOEP batch reply as an input with no account condition; the element file said the Product Pricing API is seller-only. Product Pricing API page re-read at merge: availability "Sellers only", Pricing role required; roles page re-read: Pricing "Role available to vendors? No". The element file wins for vendor connections; the FOEP input stands on seller connections (P-vendor-and-hybrid-3).
2. *What the day-1 400 shows.* The element file read the day-1 `GET_VENDOR_...` 400 as "vendor types fail on a seller connection"; the angle file said the 400's cause is not stated. The angle file wins on the reading of the 400 (the run report does not state the cause). The rule itself stands on Amazon's own availability lines ("Vendors" for every `GET_VENDOR_*` type, re-read at merge), not on the 400 (A3, G1).
3. *Vendor report lookback labels.* The angle file wrote "lookback" and "maximum span" and placed the figures "as written for the Sales and Traffic reports"; the element file named Amazon's headings. Analytics Reports `.md` re-read at merge: the headings are "Maximum lookback windows" and "Maximum reporting periods", both headings appear under the vendor sales, net pure product margin, traffic and inventory reports, and the vendor sales report's figures match the angle file's (the inventory report writes "DAY: 1,460" and "DAY: 15" without a unit). Amazon's headings are used (H3).
4. *Content precedence.* The files cited different practitioners pointing different ways (MerchantSpring: seller content often wins; Luxem: registered brand wins; Fikhman, AMALYZE, beBOLD, staff replies: retail or legacy vendor data can win). Amazon's FAQ is the only general statement and wins; no Amazon page settles the hybrid case, which stays Open question 1.
5. *Vendor A+ module counts.* Flywheel (five/seven) against Luxem (sellers two more than vendors). At merge the A+ Troubleshooting Guide was taken to win (Premium cap of seven, no API cap on Standard-only documents). Superseded at reconciliation (below): Amazon's own pages disagree, the tutorial gives vendors five, and the binding limit is read at run time (D3).
6. *Name of the sell.amazon.com Seller Central page.* The angle file named it "Amazon Seller Central | Sell"; the element file named it "Seller Central: Your digital portal for selling with Amazon". Page re-read at merge: the HTML title is "Amazon Seller Central | Sell" and the page text carries "Seller Central: Your digital portal for selling with Amazon". Both are kept, title first; the quoted sentences were re-found.
7. *Reason Automation date.* The angle file gave Sep 25, 2025 plus metadata Sep 24, 2026; the element file gave Sep 25, 2025. Page re-read at merge: both dates appear. Both are recorded. The re-read also found the sub-point "This change also makes it clearer that page views are the same traffic measure for vendors and sellers" and "As of Q4 2025 this metric is being released with very limited availability", which neither file had; it is recorded as practitioner text, not relied on, and folded into Open question 16.
8. *Whether the SQP help page answers "do SQP buys include retail's sales".* The angle file named G8J4CB5ZBF3NX7TP as a settler "not opened by this seat"; the element file read it for eligibility. Capture G8J4CB5ZBF3NX7TP-v5 re-read at merge: it speaks of "buys" without naming offers, so it does not settle the question; that settler is struck and Open question 11 stays open.
9. *Whose units `unitsOrdered` counts.* The angle file named "a Seller Central Business Reports help page (not read)" as a settler. Capture G27691-v7 (Business reports glossary) read at merge: "Units Ordered" is "The number of individual units or items ordered", with no offer named. The settler is struck; Open question 10 stays open. The glossary's Featured Offer percentage definition ("less than 100% if … purchasing from another seller") is added to E1 and F1.

**Re-checks at merge (2026-10-14).** Re-opened: Analytics Reports (`.md`, `updatedAt` 2026-10-06; availability lines, PST note, vendor lookback and reporting-period figures, 48 h / 72 h / Tuesday / 72-hour forecast wording, FATAL sentence, seller section's two-year start and 7–30-day advice, SQP "MONTH: 17 months" and "Requests cannot span multiple periods"); Product Pricing API (`.md`, "Sellers only", Pricing role); Selling Partner API Roles (`.md`, the five rows in A4); sell.amazon.com/tools/seller-central (title, heading, invitation-only and credential-sync sentences); Reason Automation (Hamada quotes and dates). Read from the 2026-10-14 captures under the office's capture folder (outside this repository): G201687550-v20 (E1 quotes found), G27691-v7, G8J4CB5ZBF3NX7TP-v5 (G2 eligibility and F3 quotes found). No further help page was fetched; no Amazon or Keepa API host was called.

**Angle file's gap fill (2026-10-14): 5 gaps filled, 0 left open**, with residual sub-questions carried in Open questions (MAP policy, ad serving under a retail Featured Offer, whose units the seller reports count).

1. Vendor contributions and their priority against seller writes: filled (C1–C7; Listings APIs FAQ re-read, both sentences quoted exactly; G200335450 re-read).
2. Vendor put merging rather than replacing: filled (B1–B2; workflows guide re-read, quoted exactly).
3. Amazon's retail offer as a Featured Offer competitor, and pricing constraints: filled (E1–E6; Becoming the Featured Offer, Pricing Health, the 2019 QFR PDF and IP/22/7777 re-read). MAP from Amazon's own pages: not found (E5, Open question 13).
4. Vendor Retail Analytics reports and their clocks: filled (H1–H6, G4; Analytics Reports re-read; the only stated clocks are on the vendor types, confirmed by searching the page).
5. How cx behaves on a hybrid ASIN: filled as positions, each resting on pages read. Seat-only reasoning is kept apart.

**Element file's gap fill (2026-10-14): 4 gaps filled, 1 left open.**

1. Vendor Central content precedence over 3P: **left open** (partly filled). Amazon's public words are recorded (C1–C7, D2). No Amazon page states the hybrid order; Vendor Central help is behind sign-in (Open question 1).
2. Vendor listing routes (Listings Items with a vendor code): **filled** (A1–A5, B1–B6).
3. Retail Analytics in place of Sales and Traffic: **filled** (G1, G4, H1–H6).
4. A+ for vendors: **filled** (D1–D4). Vendor Premium terms are left to Open question 8.
5. SQP and other Brand Analytics for vendors: **filled** (G1, G2, G5; practitioner observation of the vendor failure mode).

**Adversarial re-checks carried from the two files (2026-10-14).**

- Angle file, pages re-opened from saved copies and live routes:
  - the FAQ heading "Why are my edits not making it to the detail page even though they appear as successful?" and its answer, word for word; "Brand owners have the highest precedence …";
  - vendor put/patch wording; "offer-only listings are not supported for vendors at this time";
  - vendor SLA wording ("end of the day Monday, 48 hours after the close of the period"; "72 hours after the close of the period"; inventory "by the end of the day Tuesday"; forecasting "within a 72-hour time frame after the week end");
  - rapid report timings ("five minutes", "approximately 65 to 115 minutes", 30-day lookback, 7- and 14-day spans); "only when retail is the featured merchant"; the PST note;
  - the `glanceViews` and `lostFeaturedOffer` schema text; "The start date must be no more than two years ago."; the reversed `startDate` sentence as Amazon's own text; the Data Kiosk role correction;
  - Becoming the Featured Offer: the "As of September 2026" sentence, the "page views" formula, "We rank offers the same way for every product";
  - Pricing Health: "The highest 14-day price (shipped and sold by Amazon)";
  - G200335450: "within 48 hours" and "Upload one main image and up to eight additional images";
  - the A+ "existing retail contribution" row; the 2019 QFR wording for answers 3, 5 and 8; the Keepa comments in the Java sources.
  - The forum and practitioner quotes in that file rest on one fetch each; the forum pages show relative dates only.
  - Corrections then: the 2019 PDF's author is not named on its pages, so it is described as speaking for Amazon in the first person; the EU press release is tagged as the Commission's words, not Amazon's.
- Element file, every page cited for a new claim opened again:
  - 16 SP-API documentation `.md` pages and the changelog note; every quoted phrase found verbatim (41 checks), including "Sellers and Vendors", the product-type sentence, the `merge` limit, vendor put/patch and offer-only, "might not have priority", the brand-owner precedence answer, "A+ premium content is not supported.", the vendor-group sentences, "Sellers only" (Product Pricing), the Reports FAQ, each Availability line, "only when retail is the featured merchant", "**MONTH**: 17 months" and "Requests cannot span multiple periods.", the promotion-report availability, the sourcing-view and catalog-history sentences, the A+ retail-contribution, EBC/EMC and 7-module rows, and the Data Kiosk role correction;
  - models and schemas from `selling-partner-api-models` (listings, catalog, A+, product type definitions, vendor sales, SQP, vendor analytics, seller analytics): all quotes found;
  - Keepa Java sources: quotes found;
  - help pages read again through GetHelpTopic: G200335450 (still v23 r0) and G8J4CB5ZBF3NX7TP (still v5 r0); quotes found; neither page contains the word "vendor";
  - forum posts: wording and `datetime` attributes confirmed (Premium A+ 2023-10-31 and 2022-08-08; SQP/SCP launch 2022-04-14; CA winning-contributor thread 2023-12-19);
  - sell.amazon.com pages and all practitioner pages: exact-phrase checks, all present.
  - Corrections then: the "Basics of Sellers vs Vendors" article is on eCommerce Nurse, not eComEngine (Katy Luxem wrote both); the beBOLD title is "Amazon Brand Analytics in Vendor Central Explained 2026"; the CA forum thread's absolute date was added.
  - Not re-checked: Vendor Central help stayed behind sign-in; Kapoq and MindgruveMacarta stayed 403, and neither is cited for a claim.

**Reconciled 2026-10-14** against the critics' contradiction list for research/. Sources re-opened: Analytics Reports, Data Kiosk API, Listings Items API, A+ Content Troubleshooting Guide, Building Listings Management Workflows Guide, Performance Reports (all `.md` routes); Create, edit, and publish A+ content (`.md`, new); the models and schemas `listingsItems_2021-08-01.json`, `aplusContent_2020-11-01.json`, `sellers.json`, `sellingPartnerSearchQueryPerformanceReport.json`, `analytics_sellerAnalytics_2025_03_31.graphql`; the captures G201687550-v20, G27691-v7 and G8J4CB5ZBF3NX7TP-v5. No help page was fetched; no Amazon or Keepa API host was called.

- D3: added that Amazon's pages disagree on the A+ module cap: tutorial (selling partners seven, vendors five), troubleshooting guide (seven once Premium is present; Standard-only not capped by the API), model (`maxItems` 100), seller-side help and guides (Basic five, Premium seven). No page is preferred; the binding limit is the A+ validation reply at run time. The practitioners' disagreement note and merge item 5, which had let the troubleshooting guide win, were corrected; Open question 5 now names the validation call as the settler.
- C3: added that Amazon's pages disagree on the image count (G200335450: one main plus eight; workflows guide: one main plus nine secondary); the binding count is the product type schema at run time.
- G4: added that the Data Kiosk API page lists Brand Analytics alone for every operation, against the correction note (Economics needs Selling Partner Insights) and the Seller Analytics PAAM directives; the binding answer is `createQuery` on the connection at run time.
- G5: added the SQP entry's "N/A" lines and that it has no "Maximum lookback windows" heading, so "17 months" is a span figure, not retention; the only stated depth is the blog's "usually goes back three years".
- E4: added a note that offer-level price ineligibility (Pricing Health) and the September 2026 removal of the seller eligibility requirement (G201687550 v20) coexist; method/triggers.md is the file without the change.
- C8: recorded that none of the 54 help-page captures contains "vendor".
- Reachability: every Seller Central help page this file quotes that has a capture (G201687550, G27691, G8J4CB5ZBF3NX7TP) was already cited with its capture; no "unreachable" or "sign-in" claim in this file concerns a captured Seller Central page (the remaining ones are Vendor Central help, Amazon Ads help, two developer pages and two third-party pages). G200335450, GSTH6YN3BR8XNWBW and G201687530 have no capture; this is now said where they are cited, and Offer placement is marked as not cited for any claim.
- Cross-references: the former `elements/vendor-and-hybrid.md` is named as merged into this file; no reference to `inventory-and-fulfilment.md` existed.
- Checked and left unchanged, because this file already agrees with the source and another file is the stale one: SQP includes "organic and Sponsored Products" (capture G8J4CB5ZBF3NX7TP-v5; angles/paid-keywords.md and angles/search-rank-and-volume.md are behind); SQP Sunday-to-Saturday WEEK with "a fatal error" (SQP schema; paid-keywords.md Open question 2 is wrong); SQP launch 2022-04-14 (News_Amazon `datetime`; "about 2021" elsewhere is wrong); the patch `merge` op exists in the model's enum and is limited to `fulfillment_availability` and `purchasable_offer` (Listings Items API; angles/listing-content-and-health.md is behind); Premium A+ eligibility, where the 2023-10-31 News_Amazon post (five approved modules plus Brand Story) is the later Amazon statement (elements/a-plus-content.md's "only the 15-project post" is behind); promotion and coupon report roles (Performance Reports, as G3 states); Featured Offer % over page views against `featureOfferPct` over glance views (both Amazon's words, F2); the Sellers API carries no seller id (`sellers.json`: `/sellers/v1/marketplaceParticipations`, `/sellers/v1/account`).
- Stable lines and positions were checked for figures Amazon keeps in a schema or changes by announcement: none states one (contribution window, report clocks, module caps and image counts appear only as human-reader figures in the body).
