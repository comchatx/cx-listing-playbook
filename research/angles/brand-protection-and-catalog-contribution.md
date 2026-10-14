# Brand protection and catalog contribution: who wins the detail page, and what to do when it is not the seller

Read 2026-10-14 by the research seat. Tags: [official] Amazon's own page or document; [opinion] a named practitioner; [research] published research; [seat] the seat's own reasoning, never a skill position.

How pages were read. SP-API developer pages were read in their `.md` form at `developer-docs.amazon/sp-api/docs/<page>.md` (the `developer-docs.amazon.com` form redirects there); the `updatedAt` line of each page is recorded. Seller Central help pages were read through the help hub's own content call (`POST https://sellercentral.amazon.com/help/hub/mons-api/GetHelpTopic`, body `guid` + layer `external` + locale `en-US`), the call the page's own script makes; the public URL is recorded with the page title and version the call returned. That route is undocumented and is a research route only, never one for cx; whether research seats may keep using it is the office's ruling (`method/help-page-access.md`, Open question 1). Three of the help pages cited here have a saved text under the office's capture folder (outside this repository) (Product detail page rules `G200390640-v21.txt`, Suppressed listings `G200898440-v13.txt`, Product image guide `G1881-v28.txt`); the quotes from those pages were re-checked against the captures at reconciliation. The other help pages cited here were read by this seat through the same call on 2026-10-14 and have no capture. Seller Forums threads and sell.amazon.com pages were read with a page fetch. Models were read from `amzn/selling-partner-api-models` on GitHub. No Amazon API host and no Keepa API host was called. The session's web-search budget ran out part-way through; every page cited here was opened, and what search could not reach is in "Open questions".

## What this covers

- **Funnel stage.** None directly: this is the precondition for all three. A listing change can only move exposure, click-through or conversion if the change is what the shopper sees. On a shared ASIN the detail page is a reconciliation of several contributions, and the offer that wins the Featured Offer may not be the seller's. Both decide what any stage metric measures.
- **The cases.**
  - A write is ACCEPTED, but the detail page keeps showing another contributor's value (brand owner, a brand representative of the same brand, a reseller with better metrics, or Amazon's own data).
  - Someone else changes the page: another seller, Amazon's AI rewrite, or a hijacker turning the page into a different product.
  - A new seller appears on the ASIN, or the offer count jumps. The new seller may be a reseller of genuine goods, a counterfeiter, or a seller that also edits the page.
- **The skills it feeds.**
  - `listing-review`: who controls the page, and whether the Catalog equals what the seller submitted. A difference is a finding with a cause, not a failed write.
  - `listing-change-log`: record the seller's brand role and the contributor state at the time of the change.
  - `effect-review`: a page changed by others, or an offer set that changed inside the window, is a confounder that usually makes the verdict "cannot tell".
- **Why a senior operator cares.** A large share of catalog time on shared or contested ASINs goes to this. The right action when a write loses, or when a page is changed by someone else, is an escalation through the correct Amazon route. Rewriting the same value again is the wrong action, and filing the wrong report type costs the brand its reporting accuracy.

## Amazon's own rules and guidance

### A. How contribution precedence works

1. **RULE: precedence goes to brand owners, and Amazon's own data can be overridden by ticket.**
   - FAQ question: "Who has the highest precedence to override the product details page information on Amazon?"
   - Answer: "Brand owners have the highest precedence to update data on the product details page on Amazon. If Amazon uses its own data on the product details page, brand owners can override it via a ticket to Seller Central support."
   - A separate FAQ answer, to "Why are my edits not making it to the detail page even though they appear as successful?", reads: "Downstream process and rules governing catalog data are the same regardless of submission method. In some cases, especially where we already have a listing for a product, the information submitted by a vendor might not have priority."
   - The FAQ is written largely for vendors (its Contact Us links go to Vendor Central).

   [official] (Listings APIs FAQ, https://developer-docs.amazon.com/sp-api/docs/listings-apis-faq, updatedAt 2026-09-09, read 2026-10-14)

2. **RULE: how Amazon chooses among contributions.**
   - "When multiple sellers sell the same product through a single detail page, Amazon automatically combines the best product data from various seller submissions".
   - "When evaluating contributions, we consider sales volume, refund rate, buyer feedback, and A-to-z guarantee claims."
   - "ASINs registered for a brand will most likely show the brand owners contributions on the detail page."
   - "For brand-registered ASINs, attribute values from sellers with brand selling roles appear on the product detail page."
   - Where several Brand Representatives or Resellers of the same brand contribute, "the contribution from the seller with a Brand Representative role is displayed".
   - "If your contribution is verified by Amazon, they will show on the product detail page within 48 hours. If, after the allotted period, your contributions do not show on the product detail page, it means Amazon's system has selected another contributor's information".
   - For an incorrect value on a brand-registered listing, Amazon recommends "reaching out to the brand Administrator", and adds: "Amazon doesn't share Administrator contact details or trademark information for enrolled brands."

   [official] (Suggest changes to your product detail page, https://sellercentral.amazon.com/help/hub/reference/external/G200335450, version 23, read 2026-10-14)

3. **RULE: within one brand, roles decide; ties go to metrics; Amazon will not mediate.**
   - "If several authorized users of a brand have the same selling role and contribute to the same ASIN, those contributions will be weighted equally".
   - "Only the Brand Administrators can update selling roles on a brand via the Manage selling accounts tool in the Brand Registry portal."
   - With two or more such contributors, "our automatic system may choose which information should be displayed based on the contributing parties sales volume, refund rate, buyer feedback, and A-to-z claims."
   - "We won't mediate between authorized users to decide the displayed contribution for a given ASIN, nor will we disclose information about the users who have the displayed contribution."
   - "Contributions made by an authorized user to a Brand Registry branded ASIN can't be edited by the Selling Partner Support team. If there's incorrect information on a product detail page, refer to Account Health - Report Abuse".

   [official] (Product detail page rules, https://sellercentral.amazon.com/help/hub/reference/external/G200390640, version 21, read 2026-10-14)

4. **RULE (staff, forum): brand ownership is the main factor.**
   - Glenn_Amazon (Community Management) wrote that "Amazon's systems will then determine which Seller's contribution is published to the detail page".
   - "The main factor is Brand Ownership."
   - "This is one of the main reasons Amazon recommends Brand Registry as a way to have more control of your detail pages."
   - The page shows "3 years ago" and no absolute date.

   [official, forum staff post] (Seller Forums, "Listings Lounge: Meeting the Attributes", https://sellercentral.amazon.com/seller-forums/discussions/t/4851d334-cb98-41ed-8898-1bfce50d651f, read 2026-10-14)

5. **RULE: images on a shared page.** Posted by News_Amazon; the page shows "2 years ago" and no absolute date.
   - "We'll now prioritize brand owner images and only use third-party sellers' images if the required images are missing".
   - "each product detail page must have at least three required images: one with the product on a white background", plus one in an environment and one with product information.
   - The post says the January change let detail pages for hardlines product types "display images from multiple sellers", with softlines and consumables to follow.
   - "To remove an incorrect or inaccurate image, contact Selling Partner Support."
   - Seller replies in the same thread complain that brand owners cannot remove hijackers who change images.

   [official] (Seller Forums, "Update to how product detail page images are selected", https://sellercentral.amazon.com/seller-forums/discussions/t/9bf72c46-d413-404f-8e28-208ee75d54ee, read 2026-10-14)

   **The current help pages are less absolute than the post.** The Product image guide says: "Uploading an image doesn't guarantee it will be displayed on the product detail page. We select and arrange images from multiple selling partners to ensure each product has enough high-quality images for buyers." It adds: "We may also modify images that you submit". [official] (Product image guide, https://sellercentral.amazon.com/help/hub/reference/external/G1881, version 28, capture capture `G1881-v28`, read 2026-10-14) `elements/images-and-video.md` (item 38) records the display-issues page (G17811 v20) going further: "We may select images different from those you provided, including images that are different from those provided by sellers with a selling role (Brand Representative or Reseller) assigned in the brand." So brand-owner priority for images is the forum post's statement; the help pages reserve the choice to Amazon, even against brand-role sellers. `elements/images-and-video.md` owns image display.

6. **RULE: who may create new ASINs under a registered brand.**
   - "we limit sellers who do not have a selling role assigned by a brand from creating new ASINs under that brand when the brand is enrolled in Brand Registry."
   - The same page bans "Changing the product's detail page (parent or child) to become fundamentally different from the original product listed" and adding incorrect child variations.

   [official] (ASIN creation policy, https://sellercentral.amazon.com/help/hub/reference/external/G201844590, version 27, read 2026-10-14)

7. **GUIDANCE: what the two selling roles are.**
   - Brand Representative is for "internal, first-party sellers" employed by the brand. It is assigned automatically when the same credentials are used for Brand Registry and Seller Central.
   - Reseller is for external third parties with a selling agreement. It lets "eligible third parties to create new listings, promote the brand's products, and more".
   - One selling account holds one selling role.
   - Protection roles: Rights Owner, Administrator, Registered Agent.

   [official] (Sell on Amazon blog, "Guide to Brand Registry roles", Mickey Toogood, Apr 23, 2025, https://sell.amazon.com/blog/brand-registry-roles, read 2026-10-14)

8. **What Amazon says about its own data.** An Amazon Science post says "These catalogue AI solutions are correcting and updating product attributes at the scale of the Amazon Stores." It adds that the new process puts "the latest seller values … in the catalogue more quickly (within days)". [official] (Amazon Science, "Using LLMs to improve Amazon product listings", Abhishek Agrawal, November 28, 2025, https://www.amazon.science/blog/using-llms-to-improve-amazon-product-listings, read 2026-10-14)

**The order, as Amazon's pages state it** (a reading of items 1–6 together):
- The brand owner, then within the brand the Brand Representative over the Reseller, takes precedence.
- Among equals, or among non-brand sellers, Amazon picks by sales volume, refund rate, buyer feedback and A-to-z claims.
- Amazon's own data can stand on the page, and a brand owner overrides it by ticket.
- A vendor's (1P) submission "might not have priority".

No Amazon page read gives a single ranked list that places Amazon retail or vendor contributions against a brand owner's. That remains open (see Open questions).

### B. When a brand owner's write loses: the case paths Amazon names

9. **RULE: issue codes whose resolution is a case, not a rewrite.** All from the troubleshooting page (updatedAt 2026-09-09). The page is written for integrators and speaks largely of vendors.
   - **4005011.** Message: "The value of `attribute_name` conflicts with another item in the Amazon catalogue, `conflicting_asin`. Either change the value to `conflicting_value` or contact Amazon to resolve the conflicting data issue."
     - Resolution: "If you wish to change any existing values, you need to submit an Amazon Vendor Central Support case."
     - Advice: "Build a workflow to surface any pre-existing catalog data for the SKU using the `getListingsItem` and `getCatalogItem` API."
   - **4005033.** Message: "The value for `attribute_name` cannot be edited. Revert the value to `original_value` and resubmit."
     - If the original is wrong, "submit a Contact Us case" (linked to developer.amazonservices.com/support) with "A list of UPCs/EANs", "The attribute name to be changed" and "The new value".
     - For a vendor catalog submission, also Vendor Central Support.
   - **4005039.** Message: "You have multiple submissions for this item. To edit one of them, contact Amazon Vendor Central Support."
     - Explanation: "There are multiple contributions within the catalog for this item."
     - Route: a Contact Us case via Vendor Central for vendors, or "Developer Support if you're a seller", listing the issue, the EANs/UPCs, and the SKUs and vendor code.
   - **18280.** Arises when there is "already a bad `fabric_type` value in the Contribution Catalog". The fix if the seller did not mean to set it: "deleting this attribute from the contribution".
   - **4005007.** The external ID is not registered for the brand. The fix is proof of affiliation (for example "a license agreement") and a GS1 certificate.

   [official] (Listings Items API Issues Troubleshooting, https://developer-docs.amazon.com/sp-api/docs/listings-items-api-issues-troubleshooting, read 2026-10-14)

10. **RULE: catalog conflict on the Seller Central side (error 8541).**
    - Cause: "a listing attribute, such as the brand, title, UPC, or color, submitted by the seller corresponds to the product ID of an existing ASIN".
    - "The data submitted by you should match the catalog data to clear the conflict. If the catalog data is incorrect, you can contact Selling Partner Support to evaluate your request to fix the data."
    - If the product found is different: "click Request product detail page change and create a new request". The request is tracked in "Help > Case log".
    - Accepting Amazon's values in Fix Your Products is processed "in the next 15 minutes".
    - Edits allowed by identity:
      - descriptions and bullet points can change "as much as you want as long as they do not change the identity of the ASIN";
      - some attributes can change only slightly;
      - "Some attributes cannot change after ASIN creation. Examples include attributes like GTIN and item package quantity."

    [official] (Error 8541, https://sellercentral.amazon.com/help/hub/reference/external/G200692330, version 23, read 2026-10-14)

11. **RULE: what proof a detail-page correction needs.**
    - "If you can't update attributes using these methods, contact Selling Partner Support. Include proof that supports your suggested changes".
    - Acceptable proof: the manufacturer's (or publisher's) URL with a visible product identifier; high-resolution product pictures with the identifier; a photo of the item in its original packaging showing the identifier.
    - "Manufacturer's or publisher's (for books) website URL is the only acceptable proof for product image update requests. Any requests without valid proof supporting the changes will not be accepted."

    [official] (Suggest changes to your product detail page, as above)

12. **RULE: the detail-page abuse route is Report Abuse, not a listing write.**
    - Product detail page rules sends incorrect information on a branded ASIN to "Account Health - Report Abuse" (item 3).
    - Amazon's Report a violation help page:
      - "Go to Report abuse. Select the violation type. Provide the concerned order ID or ASIN/ISBN".
      - Include "A concise explanation of the violation based on the policy" and supporting documents.
      - "For privacy reasons, the results of our investigations can't be disclosed".

    [official] (Report a violation, https://sellercentral.amazon.com/help/hub/reference/external/G200444420, version 14, read 2026-10-14; Product detail page rules, as above)

13. **RULE (staff, forum): the topics under Report a Violation that touch listings.** Posted by Manny_Amazon; the page shows "2 years ago".
    - "Product detail page violates Amazon's policies or is misleading customers": "Things like duplicate listings, incorrect variations, wrong category for a listing", plus incorrect content, misuse of keywords and digital download abuse.
    - "Report a product detail page that was modified to represent a different product."
    - "Results of investigations are not shared due to privacy reasons".

    [official, forum staff post] (Seller Forums, "Listings Lounge: Report a Violation", https://sellercentral.amazon.com/seller-forums/discussions/t/91fc52b8-38ef-4d60-ae48-d11bdea89cf6, read 2026-10-14)

14. **GUIDANCE (staff, forum): a locked attribute the seller cannot edit.**
    - Jurgen_Amazon (page shows "3 years ago") advised: "Try to "Edit" the listing and wait 24-48 hours to see if it will update", then a partial and then a full file update, then escalation of the case "to an internal team".
    - He quoted the rule "You may only update detail pages to better or more accurately describe the product as originally listed."
    - In the same thread, Brand Registry Support had suggested deleting the listing for 24 hours to change one attribute; the seller objected.

    [official, forum staff post] (Seller Forums (CA), "Just to update one "Manufacturer Contact Information" attribute, "Amazon Brand Registry Support" Suggesting to delete all our listing? Not Acceptable.", https://sellercentral.amazon.ca/seller-forums/discussions/t/35b55605-7ad6-4e84-ae14-74a51ead2a78, read 2026-10-14)

15. **Not read: the Brand Registry Support case form ("update a product detail page").** The Brand Registry help at `brandregistry.amazon.com/help/` returned an "Amazon Sign-In" page (`angles/offer-competition-and-hijackers.md` records the same redirect to sign-in). Two help ids linked from G200335450, "Registering products to your brand" (G6DU75NSM86VXKZC) and "selling role" (GJ84K745AL3R5N3Q), were not served as topics by the content call (no topic in the reply; `elements/images-and-video.md` records `{"topic":null}` for GJ84K745AL3R5N3Q, one of the "not served" replies `method/help-page-access.md` A3 describes). Neither id has a capture under the office's capture folder (outside this repository) Amazon's own words on that case type were therefore not read.

### C. Locked attributes

16. **RULE: "editable" is a schema keyword.**
    - The meta-schema keyword `editable`: "Indicates whether or not a property value can be modified for an existing item. Properties that can't be modified may still be required for a valid submission."
    - Its purpose is "Informational". Enforcement shows up as issue 4005033 (item 9).

    [official] (Amazon Product Type Definitions Meta-Schema (v1), https://developer-docs.amazon.com/sp-api/docs/product-type-definition-meta-schema, updatedAt 2026-09-09, read 2026-10-14)

17. **RULE: attributes that lock, in Seller Central's words.**
    - "Some attributes lock after you create a listing and can't be changed."
    - "there are attributes that cannot be changed after they were applied once", for example `item_package_quantity`.

    [official] (Suggest changes to your product detail page, as above)

18. **RULE: product ID and re-branding are locked.**
    - The product ID "is a non-editable value and cannot be modified once a listing is created, unless it was created with a GTIN exemption."
    - "You must not use an existing listing for a new version of a product. This includes changes in color, size, material, features, and product name."
    - Minor brand-name corrections are allowed ("typos, capitalization, or legal abbreviations"). Anything else "will not be supported" and needs a new ASIN.

    [official] (Product detail page rules, as above)

### D. Report a Violation, Transparency and Project Zero as they touch listings

19. **GUIDANCE: what Brand Registry gives.**
    - Brand Registry "puts additional protections in place to help safeguard your brand's product information".
    - Report a Violation: "Report suspected IP infringement, store policy violations, and regulatory compliance concerns—all in one place."
    - Project Zero: "Drive counterfeits to zero with the ability to block and remove listings immediately."
    - Transparency: "Use unique serial codes to stop counterfeits".
    - The page does not mention detail-page control, authorized resellers or Brand Elevation.

    [official] (Amazon Brand Registry | Sell on Amazon, https://sell.amazon.com/brand-registry, read 2026-10-14; brandservices.amazon.com redirects there with a 301)

20. **GUIDANCE: who reports, and where.**
    - "If your brand is enrolled in Brand Registry, you can report violations using the Report a Violation tool." Others use the Report Infringement form.
    - A Submission History tab "tracks every report's status in real time".
    - Amazon frames Brand Registry as helping "block and prevent inaccurate product information, counterfeits, fraud, abuse, and bad actors".

    [official] (Sell on Amazon blog, "How to report an IP violation to Amazon", Mickey Toogood, Mar 26, 2025, https://sell.amazon.com/blog/report-a-violation-to-amazon, read 2026-10-14)

21. **RULE (staff, forum): what Report a Violation will not enforce.** Posted by Dougal_Amazon; the page shows "2 years ago".
    - "Amazon respects a manufacturer's right to enter into exclusive distribution agreements for its products."
    - "However, violations of such agreements do not constitute intellectual property rights infringement." Amazon says "it would not be appropriate for Amazon to assist in enforcement activities."
    - "Amazon does not take action on intellectual property notices concerning registered trademarks, designs, or patents" registered in a country other than the one where takedown is asked.
    - Only the chosen complaint type is processed: "we will only process the specific complaint type you have chosen in the Report Infringement form or RAV".
    - Advice: "Complete a test buy, determine the type of specific infringement and report accordingly", and "Sometimes, this does mean to "Report Abuse," from the Account Health Dashboard instead of the Report a Violation tool."

    [official, forum staff post] (Seller Forums, "Top 3 Mistakes when Reporting a Violation through Brand Registry", https://sellercentral.amazon.com/seller-forums/discussions/t/a9cbc533-004d-4042-8a4f-f5dc75a966a7, read 2026-10-14)

22. **RULE: Project Zero.**
    - "Once confirmed, you can return to the tool to remove individual offers or an entire product listing."
    - Eligibility: the rights owner of a registered trademark; Report a Violation use in the last six months with "at least a 90% acceptance rate on those reports".
    - "They must maintain an accuracy rate of at least 99% in order to maintain access to Project Zero."
    - On removal, "a notice of complaint is sent to each seller associated with the removal."
    - "Counterfeiting requires the use of a registered trademark on the product, packaging, or the product detail page."
    - The page recommends a test buy before removal.

    [official] (Project Zero | Sell on Amazon, https://sell.amazon.com/brand-registry/project-zero, read 2026-10-14)

23. **RULE: Transparency.**
    - "a valid Transparency code must accompany every unit listed or shipped in Amazon's Transparency-supported stores"; per the page this holds whether Amazon or the seller fulfills.
    - "If a unit fails a Transparency check, we'll investigate and notify you."
    - "Some brands may be eligible for a Transparency badge on their product detail page."
    - Eligibility: the Brand Registry "rights owner" role, an active registered trademark, and a GTIN per product.
    - Codes are priced per unit by volume. The prices are on the page and change; this file does not carry them.

    [official] (Transparency | Sell on Amazon, https://sell.amazon.com/brand-registry/transparency, read 2026-10-14)

24. **Figures Amazon publishes about scale** (for human readers only).
    - The 2024 report, published March 2025, says Amazon's systems "scan billions of attempted changes to product detail pages daily for signs of potential abuse".
    - "Since launch, Project Zero has empowered more than 35,000 brands"; "More than 2.5 billion product units have been verified as genuine".
    - The Transparency page (May 2026 data) says 2.7 billion and more than 90,000 brands. The two pages give different dates for these counts.

    [official] (2024 Brand Protection Report, https://trustworthyshopping.aboutamazon.com/2024-brand-protection-report, read 2026-10-14; Transparency, as above)

25. **RULE: the IP appeal side** (what happens to the other party). For "Trademark or Counterfeit infringement on the product detail page" the accused seller must "Modify the product detail page … and then submit your appeal" through Account Health. [official] (Intellectual Property Policy, https://sellercentral.amazon.com/help/hub/reference/external/G201361070, version 20, read 2026-10-14)

### E. Hijacker and unauthorised-seller detection

26. **RULE: the push signal for offers.**
    - `ANY_OFFER_CHANGED` "is sent whenever there is a change to any of the top 20 offers, by condition (new or used)", on an external price change, "a change to which offer wins the BuyBox, or a change to the BuyBox price".
    - "You will only receive `ANY_OFFER_CHANGED` notifications for items for which you have active offers."
    - It uses the Amazon SQS workflow. The payload `Offers` holds "The top 20 competitive offers for the item and condition", each with `SellerId`, `IsBuyBoxWinner`, `IsFulfilledByAmazon` and `SellerFeedbackRating`. The `Summary` holds `NumberOfOffers` and `NumberOfBuyBoxEligibleOffers`.

    [official] (Notification Type Values, https://developer-docs.amazon.com/sp-api/docs/notification-type-values, updatedAt 2026-09-30, read 2026-10-14)

27. **RULE: the pull read for offers.**
    - `getItemOffers` "Returns the lowest priced offers for a single item based on ASIN". Its `Offers` list is "the same length as the TotalOfferCount in the Summary or 20, whichever is less".
    - `Summary.TotalOfferCount` is "The number of unique offers contained in NumberOfOffers"; `NumberOfOffers` gives counts by condition and fulfillment channel.
    - Each `OfferDetail` carries `SellerId`, `MyOffer` ("When true, this is the seller's offer"), `SellerFeedbackRating` and `IsFulfilledByAmazon`.
    - The model's default usage plan is shown in its description, and the live figure is in the `x-amzn-RateLimit-Limit` header.

    [official] (productPricingV0.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/product-pricing-api-model/productPricingV0.json, read 2026-10-14)

28. **Keepa (third-party data source, documentation read).**
    - `csv` slot 11 `COUNT_NEW` is "New offer count history"; slots 12–14 are used, refurbished and collectible counts.
    - `buyBoxSellerIdHistory` is a history of the sellers that held the Buy Box. It is "Only set if the offers parameter was used". A seller id "-1" means no seller qualified, and "-2" means held "by an unknown seller (a brand new one)".
    - The keepa skill's own reference (`product-file.md`) adds that only `liveOffersOrder` identifies current offers.

    [official for Keepa's own API] (Keepa Java client, Product.java, https://raw.githubusercontent.com/keepacom/api_backend/master/src/main/java/com/keepa/api/backend/structs/Product.java, read 2026-10-14; keepa skill `references/product-file.md` on origin/main)

### F. Seeing detail-page changes made by other contributors

29. **RULE: the brand owner's notification.**
    - "Sellers can subscribe to this notification."
    - `BRANDED_ITEM_CONTENT_CHANGE` is sent "whenever there is a change to the title, description, bullet points, or images, for any ASIN that the selling partner has a brand relationship with". A brand relationship exists "when they are a verified brand owner". It covers "items listed in any Amazon store".
    - Payload: `MarketplaceId`, `BrandName`, `Asin` and `AttributesChanged` (`bullet_point`, `item_name`, `product_description` and image locators).
    - For images, the presence of an image attribute "indicates that *at least one* image changed". The count "*does not necessarily*" match.
    - It uses the EventBridge workflow. The payload carries no old value, no new value and no actor.
    - `ITEM_PRODUCT_TYPE_CHANGE` covers a product-type change on brand items.

    [official] (Notification Type Values, as above)

30. **GUIDANCE: View Change History is described only for AI-applied changes.**
    - "All sellers: View any AI-applied changes in Manage All Inventory → click View Change History."
    - "Brand owners: Review and approve AI-generated recommendations in Review Listings Changes".
    - No staff reply on the page says whether View Change History shows other contributors' changes.

    [official, forum staff post] (Seller Forums, "Engage With Amazon: Get your Product Title Update Questions Answered!", Dougal_Amazon, page shows "4 months ago", https://sellercentral.amazon.com/seller-forums/discussions/t/ac660707-60c7-43e3-a3fd-420d7321cc4e, read 2026-10-14)

31. **RULE: the two views to compare.**
    - Catalog `attributes` "conform to the related Amazon product type definitions".
    - `includedData` values: `attributes`, `classifications`, `dimensions`, `identifiers`, `images`, `productTypes`, `relationships`, `salesRanks`, `summaries`, `vendorDetails`.
    - Trap: `summaries.contributors` means "Individual contributors to the creation of the item, such as the authors or actors". It is not catalog contributors.
    - For human readers: the model and the `getCatalogItem` reference page (updatedAt 2026-09-10) both give a default of 2 requests per second, burst 2, and both say the `x-amzn-RateLimit-Limit` response header carries the plan applied. The binding figure is that header at run time. (The 2/2 against 5/5 disagreement other files record concerns `searchCatalogItems`; on 2026-10-14 its model and its reference page both read 2/2.)
    - The FAQ (item 1) explains why the Listings record (what this seller submitted) and the Catalog (the reconciled page) can differ.
    - Not every submitted attribute comes back from the Catalog: "The `generic_keyword` attribute is proprietary seller-specific data and will no longer be returned by the Catalog Items API. Selling Partners can use the Listings Items API to view submitted values." (release-notes entry of August 16, 2023). An attribute the Catalog does not return is not a difference between the two views; `elements/search-terms.md` owns the search-terms read-back.

    [official] (catalogItems_2022-04-01.json, https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/catalog-items-api-model/catalogItems_2022-04-01.json, read 2026-10-14; getCatalogItem reference, https://developer-docs.amazon/sp-api/reference/getcatalogitem.md, updatedAt 2026-09-10, read 2026-10-14; SP-API Release Notes, https://developer-docs.amazon/sp-api/docs/sp-api-release-notes.md, updatedAt 2026-10-01, read 2026-10-14; Listings APIs FAQ, as above)

## What practitioners add

- **Brand Elevation (secondary reports only).**
  - Salsify, "Amazon's New Brand Elevation Rule: 5 Things Brands Must Know", June 25, 2026: "If a brand opts in, its data gets the highest priority rating on the product detail page". It also says "Effective June 1, 2026, Amazon began blocking" new catalog entries by sellers not designated "an authorized reseller through Amazon's Brand Registry system".
  - The same article says access "appears limited to brands and sellers that pay Amazon additional fees" for a dedicated account manager, while also reporting that Amazon says the program is not paid.
  - Noah Wickham (My Amazon Guy), "Amazon Brand Elevation Program Favors Brands Over Third-Party Sellers", June 24, 2026: "information submitted directly by participating brands receives a higher priority". It cites TipRanks, Shopifreaks and The Information (Ann Gehan), and no Amazon document.
  - Paul Drecksler (Shopifreaks), "Amazon's new Brand Elevation program favors big brands over the independent sellers who drive most of its sales", June 18, 2026: brand-submitted data gets "priority over third-party sellers in how products are described". No Amazon spokesperson quote appears.
  - Agreement with Amazon: all three trace to one press report (The Information). Amazon's own ASIN creation policy (item 6) states the new-ASIN limit for sellers without a selling role, but no Amazon page read names "Brand Elevation".
  - Practitioners disagree among themselves on fees.

  [opinion] (Salsify; My Amazon Guy; Shopifreaks, all read 2026-10-14)

- **Hijacker types and routes.** Chuck Kessler (Canopy Management), "Amazon Hijackers: How to Remove Unauthorized Sellers and Keep Them Off", October 9, 2026.
  - Three types: counterfeiters, unauthorised resellers of genuine goods, and detail-page hijackers.
  - Signs: a new offer priced under the brand's, loss of the Featured Offer, content changes, reviews describing a different product, and stockouts that hand the Featured Offer away.
  - "Check offers and listing content weekly."
  - "For detail page hijacks: report the change as listing abuse."
  - "For genuine product you didn't authorize: don't file it as counterfeit." Brands that do "file report after report, get rejected, and in the process damage the reporting accuracy".
  - This matches Amazon's forum post (item 21) and Project Zero's acceptance-rate rule (item 22).

  [opinion] (Canopy Management, read 2026-10-14)

- **The Contact Us path for a wrong page.** Elliot K. (Sellbrite Help Center), "How Do I Fix Incorrect Data on an Amazon Product Page?", page dated August 17, 2026.
  - Path: Help, then "Contact Us", then "Products and Inventory", then "Product page issue", then "Choose Fix a product page", with "proof of the accurate information".
  - The menu names are a practitioner's account. Amazon's help names "Request product detail page change" (8541) and Selling Partner Support with proof (G200335450).

  [opinion] (Sellbrite, read 2026-10-14)

- **Historic framing.** SellerEngine, "The basics of updating Amazon product pages", November 15, 2016, no byline: "Page creators and other contributors are not identified as page owners". It also gives the same Contact Us > Products and inventory > Product page issue path. It is ten years old; treat it as history only. [opinion] (SellerEngine, read 2026-10-14)

- **Seller experience of reverting pages.** A seller on the EU forum ("Product's detail page updates revert", page shows "3 years ago") reports that after Seller Support fixed the attributes, "all these attributes revert back to an older version within a day or so".
  - The staff reply (Maja_Amazon) asked for a case ID and pointed to Brand Registry, with no explanation.
  - This is one seller's report and shows the shape of the problem, not a rule.

  [opinion: seller forum post] (https://sellercentral-europe.amazon.com/seller-forums/discussions/t/c417238b-e0cf-4a4e-9586-4e2881ddf6dd, read 2026-10-14)

- **Who "owns" an ASIN.** A community member on "Detail page is controlled by the brand owner?" wrote "We may be the 'brand owner' of the product in question, but we are NOT the 'ASIN owner'."
  - The automated Amazon message quoted in the post reads "It appears the detail page associated with this ASIN is controlled by the brand owner". It names the route for the brand to "assign you a role for this brand" via "Update your brand profile" then "Update role for user account".

  [opinion: seller forum] (https://sellercentral.amazon.com/seller-forums/discussions/t/83726afd31f3fbd2d0921b35b8b7f0fe, page shows "5 years ago", read 2026-10-14)

## Published research

- **Xin Luna Dong et al., "AutoKnow: self-driving knowledge collection for products of thousands of types", KDD 2020 (Amazon Science publication page).**
  - The abstract names "sparsity and noise of structured data for products" as a core challenge and anomaly detection among its techniques.
  - It reports operation for "over 11K product types".
  - Transfer: it shows that Amazon runs its own systems over seller-supplied attributes, which is why the Catalog can differ from what any one seller submitted. It says nothing about contribution precedence.

  [research] (https://www.amazon.science/publications/autoknow-self-driving-knowledge-collection-for-products-of-thousands-of-types, read 2026-10-14)

- No peer-reviewed study of contribution precedence, hijacking or unauthorised resellers on Amazon was found. The search budget ran out before a full search of journals was possible (see Open questions).

## Stable enough for a skill

- On a shared ASIN, the detail page is Amazon's reconciliation of several contributions. A write that Amazon accepted may not be what shows. (Listings APIs FAQ; Suggest changes to your product detail page)
- Brand owners have the highest precedence. Within a brand, a Brand Representative's contribution is shown over a Reseller's; among equals, Amazon chooses by sales volume, refund rate, buyer feedback and A-to-z claims. (Listings APIs FAQ; Suggest changes to your product detail page; Product detail page rules)
- Amazon does not tell one contributor who another contributor is, and does not mediate between users of the same brand. (Product detail page rules; Suggest changes to your product detail page)
- Amazon selects and arranges the displayed images from several selling partners, and an upload is not guaranteed to display. A staff announcement says brand-owner images are prioritised and third-party images fill missing required images; the current help pages keep the choice with Amazon, even against brand-role sellers. (Product image guide; Update to how product detail page images are selected; Image upload errors and display issues as recorded in `elements/images-and-video.md`)
- Whether an attribute can change after creation is stated in the product-type schema (`editable`). Trying to change a locked one returns issue 4005033, and the fix for a wrong locked value is a case. (Meta-Schema; Listings Items API Issues Troubleshooting)
- Product ID, item package quantity and the product's identity (a new version, a re-brand) cannot be changed on an existing ASIN. (Product detail page rules; Error 8541; Suggest changes to your product detail page)
- Issues 4005011, 4005033 and 4005039 are resolved by a support case, not by resubmitting. (Listings Items API Issues Troubleshooting)
- A wrong contribution by an authorised brand user on a branded ASIN is reported through Account Health → Report Abuse; Selling Partner Support cannot edit it. (Product detail page rules)
- A correction request through Selling Partner Support needs proof, and for images only the manufacturer's website counts. (Suggest changes to your product detail page)
- Report a Violation is for IP and policy violations by a brand enrolled in Brand Registry. A breach of a distribution agreement is not IP infringement, and Amazon does not enforce it. Only the complaint type filed is processed. (How to report an IP violation to Amazon; Top 3 Mistakes when Reporting a Violation through Brand Registry)
- Project Zero removes offers or whole listings, and keeping access depends on a report-accuracy rate that Amazon states on the page. (Project Zero)
- A brand owner can be notified when the title, bullets, description or images of a branded ASIN change (`BRANDED_ITEM_CONTENT_CHANGE`). The notice says which attributes changed, not to what or by whom. (Notification Type Values)
- `ANY_OFFER_CHANGED` and `getItemOffers` cover a capped list of top offers by condition (the cap is stated in the notification page and the model, and is read there), with each offer's `SellerId`, and only for items where the seller has an active offer (the notification) or by ASIN (the read). (Notification Type Values; productPricingV0.json)
- Catalog Items does not return every attribute a seller submits (`generic_keyword` is not returned), so the Catalog-against-Listings comparison covers only attributes both views return. (SP-API Release Notes)
- View Change History is documented for AI-applied changes; no Amazon page read says it lists other contributors' changes. (Engage With Amazon…)

## What cx must read at run time

- **What the seller submitted:** `getListingsItem` with `includedData=attributes,issues,summaries` for the SKU. `attributes` is the seller's latest submission; `issues` carries 4005011 / 4005033 / 4005039 / 8541-type conflicts.
- **What the page shows:** `getCatalogItem` (Catalog Items 2022-04-01) with `includedData=attributes,summaries,images,relationships`. A field-by-field difference from the Listings record is a finding: another contributor, Amazon's own data or reconciliation. Compare only attributes the Catalog returns: an attribute absent from the Catalog reply (for example `generic_keyword`) is not a difference. Do not read `summaries.contributors` as catalog contributors. The rate is the `x-amzn-RateLimit-Limit` header's, not a figure from this file.
- **Whether an attribute is locked:** the product-type schema from `getDefinitionsProductType` (the `editable` keyword on the property), and the `issues` returned by a `VALIDATION_PREVIEW` of the change.
- **The seller's brand standing:** whether the seller is the brand owner, a Brand Representative or a Reseller. No SP-API operation read in this session returns the seller's Brand Registry role. cx asks the seller and records the answer in the change log (see Open questions).
- **Who sells on the ASIN:** `getItemOffers` (Product Pricing v0) for the ASIN: `Summary.TotalOfferCount`, `NumberOfOffers`, and `Offers[].SellerId` / `MyOffer` / `IsBuyBoxWinner`. Compare against the last dated copy. A new `SellerId`, or a jump in `TotalOfferCount`, is the signal. The rate and the call shape are door.md's; the operation is `getItemOffers`.
- **Offer history from Keepa:** `cx get amazon/us/<ASIN>/product --source keepa` for `csv[11]` (new offer count history) and, when offers were requested, `buyBoxSellerIdHistory`, `liveOffersOrder` and `stats.totalOfferCount`, as the keepa skill's `product-file.md` defines them.
- **Content changed by others:** the `BRANDED_ITEM_CONTENT_CHANGE` notification (EventBridge) and `ANY_OFFER_CHANGED` (SQS), if the box ever has a destination for them. Until then: re-read `getCatalogItem` and `getItemOffers` on the review cadence and diff against the stored copy. The other research files record that the box has no queue destination today.
- **Seller Central only (no API):** View Change History, Review Listings Changes, Report a Violation / Report Abuse, case log, Project Zero and Transparency enrolment. cx asks the seller to read them, or to export or screenshot them into the tree.

## Pages read

| Page name | URL | Date read | What it gave |
|---|---|---|---|
| Listings APIs FAQ | https://developer-docs.amazon.com/sp-api/docs/listings-apis-faq | 2026-10-14 | Brand-owner precedence; override of Amazon's data by ticket; vendor submissions "might not have priority" |
| Listings Items API Issues Troubleshooting | https://developer-docs.amazon.com/sp-api/docs/listings-items-api-issues-troubleshooting | 2026-10-14 | 4005011, 4005033, 4005039, 4005007, 18280 texts and their case routes |
| Notification Type Values | https://developer-docs.amazon.com/sp-api/docs/notification-type-values | 2026-10-14 | ANY_OFFER_CHANGED scope and payload; BRANDED_ITEM_CONTENT_CHANGE scope, payload and image note; ITEM_PRODUCT_TYPE_CHANGE |
| Amazon Product Type Definitions Meta-Schema (v1) | https://developer-docs.amazon.com/sp-api/docs/product-type-definition-meta-schema | 2026-10-14 | `editable` keyword |
| productPricingV0.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/product-pricing-api-model/productPricingV0.json | 2026-10-14 | getItemOffers: top 20, TotalOfferCount, SellerId, MyOffer |
| catalogItems_2022-04-01.json | https://raw.githubusercontent.com/amzn/selling-partner-api-models/main/models/catalog-items-api-model/catalogItems_2022-04-01.json | 2026-10-14 | includedData enum; `contributors` meaning; getCatalogItem and searchCatalogItems default plans (both 2/2, re-read at reconciliation) |
| getCatalogItem (reference) | https://developer-docs.amazon/sp-api/reference/getcatalogitem.md | 2026-10-14 | Default plan 2/2, same as the model; header carries the applied plan (updatedAt 2026-09-10); the searchCatalogItems reference page read the same day also gives 2/2 |
| SP-API Release Notes | https://developer-docs.amazon/sp-api/docs/sp-api-release-notes.md | 2026-10-14 | August 16, 2023: `generic_keyword` no longer returned by Catalog Items (updatedAt 2026-10-01) |
| Suggest changes to your product detail page (G200335450, v23) | https://sellercentral.amazon.com/help/hub/reference/external/G200335450 | 2026-10-14 | Contribution criteria, role precedence, 48 h, locked attributes, proof rules, "one main image and up to eight additional images" (main plus eight, the count `elements/images-and-video.md` reconciles with the PT01–PT08 slots; the binding slot list is the product-type schema's) |
| Product detail page rules (G200390640, v21) | https://sellercentral.amazon.com/help/hub/reference/external/G200390640 | 2026-10-14 | Editing policy, product ID lock, re-branding, branded-ASIN contributions, no mediation, Report Abuse; capture capture `G200390640-v21`, quotes re-checked against it |
| Product image guide (G1881, v28) | https://sellercentral.amazon.com/help/hub/reference/external/G1881 | 2026-10-14 | Read from the capture capture `G1881-v28`: upload not guaranteed to display; Amazon selects and arranges images from multiple selling partners |
| ASIN creation policy (G201844590, v27) | https://sellercentral.amazon.com/help/hub/reference/external/G201844590 | 2026-10-14 | New-ASIN limit without a selling role; variation misuse |
| Error 8541 (G200692330, v23) | https://sellercentral.amazon.com/help/hub/reference/external/G200692330 | 2026-10-14 | Conflict cause, Request product detail page change, case log, locked attributes |
| Report a violation (G200444420, v14) | https://sellercentral.amazon.com/help/hub/reference/external/G200444420 | 2026-10-14 | Report abuse steps; results not disclosed |
| Intellectual Property Policy (G201361070, v20) | https://sellercentral.amazon.com/help/hub/reference/external/G201361070 | 2026-10-14 | Appeal for detail-page infringement; Brand Registry definition |
| Amazon Anti-Counterfeiting policy (G201165970, v7) | https://sellercentral.amazon.com/help/hub/reference/external/G201165970 | 2026-10-14 | Read; "we remove suspect listings based on our own review"; not used for a position |
| Suppressed listings (G200898440, v13) | https://sellercentral.amazon.com/help/hub/reference/external/G200898440 | 2026-10-14 | Read for the reachability question only; capture capture `G200898440-v13`. Its "less than 80 characters for apparel, shoes, and luggage categories and 130 characters for all other categories" title text differs from the current title rule in `elements/title.md`; this file uses neither figure |
| Registering products to your brand (G6DU75NSM86VXKZC) | https://sellercentral.amazon.com/help/hub/reference/external/G6DU75NSM86VXKZC | 2026-10-14 | not served: the content call returned no topic; no capture |
| Selling role (GJ84K745AL3R5N3Q) | https://sellercentral.amazon.com/help/hub/reference/GJ84K745AL3R5N3Q | 2026-10-14 | not served: no topic (`{"topic":null}` in `elements/images-and-video.md`); no capture |
| Enhance your listings (G200403880) | https://sellercentral.amazon.com/help/hub/reference/external/G200403880 | 2026-10-14 | not served: this seat's call answered "HelpArticleNotFound" for Published/US; `angles/ai-shopping-surfaces.md` recorded `topic: null` for the same id. Both are "not served" replies (`method/help-page-access.md` A3); no capture |
| Brand Registry help | https://brandregistry.amazon.com/help/ | 2026-10-14 | unreachable: sign-in wall ("Amazon Sign-In") |
| Amazon Brand Registry \| Sell on Amazon | https://sell.amazon.com/brand-registry | 2026-10-14 | Tool list; RAV, Project Zero, Transparency taglines |
| Project Zero \| Sell on Amazon | https://sell.amazon.com/brand-registry/project-zero | 2026-10-14 | Offer/listing removal, eligibility, accuracy rule, notice |
| Transparency \| Sell on Amazon | https://sell.amazon.com/brand-registry/transparency | 2026-10-14 | Every-unit rule, check failure, badge, eligibility |
| How to report an IP violation to Amazon | https://sell.amazon.com/blog/report-a-violation-to-amazon | 2026-10-14 | Who uses RAV; Submission History |
| Guide to Brand Registry roles | https://sell.amazon.com/blog/brand-registry-roles | 2026-10-14 | Selling and protection roles |
| 2024 Brand Protection Report | https://trustworthyshopping.aboutamazon.com/2024-brand-protection-report | 2026-10-14 | Scale figures |
| Resource Library - Trustworthy Shopping at Amazon | https://trustworthyshopping.aboutamazon.com/resources | 2026-10-14 | Report editions |
| Using LLMs to improve Amazon product listings | https://www.amazon.science/blog/using-llms-to-improve-amazon-product-listings | 2026-10-14 | Amazon corrects attributes; seller values "within days" |
| AutoKnow (publication page) | https://www.amazon.science/publications/autoknow-self-driving-knowledge-collection-for-products-of-thousands-of-types | 2026-10-14 | Abstract only |
| Seller Forums: Update to how product detail page images are selected | https://sellercentral.amazon.com/seller-forums/discussions/t/9bf72c46-d413-404f-8e28-208ee75d54ee | 2026-10-14 | Brand-owner images first; Selling Partner Support for wrong images |
| Seller Forums: Listings Lounge: Meeting the Attributes | https://sellercentral.amazon.com/seller-forums/discussions/t/4851d334-cb98-41ed-8898-1bfce50d651f | 2026-10-14 | "The main factor is Brand Ownership." |
| Seller Forums: Listings Lounge: Report a Violation | https://sellercentral.amazon.com/seller-forums/discussions/t/91fc52b8-38ef-4d60-ae48-d11bdea89cf6 | 2026-10-14 | Listing-related RAV topics |
| Seller Forums: Top 3 Mistakes when Reporting a Violation through Brand Registry | https://sellercentral.amazon.com/seller-forums/discussions/t/a9cbc533-004d-4042-8a4f-f5dc75a966a7 | 2026-10-14 | Distribution agreements not enforced; country of registration; one type per notice |
| Seller Forums: Engage With Amazon: Get your Product Title Update Questions Answered! | https://sellercentral.amazon.com/seller-forums/discussions/t/ac660707-60c7-43e3-a3fd-420d7321cc4e | 2026-10-14 | View Change History scope (AI-applied) |
| Seller Forums (CA): Just to update one "Manufacturer Contact Information" attribute… | https://sellercentral.amazon.ca/seller-forums/discussions/t/35b55605-7ad6-4e84-ae14-74a51ead2a78 | 2026-10-14 | Staff route for a locked attribute |
| Seller Forums: Detail page is controlled by the brand owner? | https://sellercentral.amazon.com/seller-forums/discussions/t/83726afd31f3fbd2d0921b35b8b7f0fe | 2026-10-14 | Automated message; role-assignment route |
| Seller Forums (EU): Product's detail page updates revert | https://sellercentral-europe.amazon.com/seller-forums/discussions/t/c417238b-e0cf-4a4e-9586-4e2881ddf6dd | 2026-10-14 | Seller report of reverting attributes |
| Keepa Product.java | https://raw.githubusercontent.com/keepacom/api_backend/master/src/main/java/com/keepa/api/backend/structs/Product.java | 2026-10-14 | COUNT_NEW; buyBoxSellerIdHistory "-1"/"-2" |
| Salsify: Amazon's New Brand Elevation Rule: 5 Things Brands Must Know | https://www.salsify.com/blog/amazons-new-brand-elevation-rule-5-things-brands-must-know | 2026-10-14 | Brand Elevation (secondary) |
| My Amazon Guy: Amazon Brand Elevation Program… | https://myamazonguy.com/news/amazon-brand-elevation-program/ | 2026-10-14 | Brand Elevation (secondary) |
| Shopifreaks: Amazon's new Brand Elevation program… | https://www.shopifreaks.com/amazons-new-brand-elevation-program-favors-big-brands-over-the-independent-sellers-who-drive-most-of-its-sales/ | 2026-10-14 | Brand Elevation (secondary) |
| Canopy Management: Amazon Hijackers… | https://canopymanagement.com/amazon-hijackers-unauthorized-sellers/ | 2026-10-14 | Hijacker types, signs, routes |
| Sellbrite: How Do I Fix Incorrect Data on an Amazon Product Page? | http://support.sellbrite.com/en/articles/3367356-how-do-i-fix-incorrect-data-on-an-amazon-product-page | 2026-10-14 | Contact Us path |
| SellerEngine: The basics of updating Amazon product pages | https://sellerengine.com/updating-amazon-product-pages | 2026-10-14 | 2016 framing |
| Riverbend Consulting (?p=28852) | https://riverbendconsulting.com/?p=28852 | 2026-10-14 | unreachable: the URL served the firm's home page, not the article |

## Open questions

1. **Brand Elevation, in Amazon's words.** No Amazon page, forum announcement or aboutamazon post naming "Brand Elevation" was found. Every source read traces to one press report. *Settles:* an Amazon announcement (Seller Forums News, Brand Registry news) or the seller's own Brand Registry portal. Until then a skill does not name it.
2. **Amazon retail or vendor against brand owner.** The FAQ gives brand owners precedence and lets them override "Amazon's own data" by ticket, and says a vendor's submission "might not have priority". No page read ranks a 1P vendor's contribution against a 3P brand owner's on the same ASIN. *Settles:* a Vendor Central help page on catalog precedence, or a staff answer.
3. **The Brand Registry Support case form.** The case types, including "update a product detail page", sit behind the sign-in wall. *Settles:* a signed-in read by the seller (or the browser package with the seller present) on the first real case.
4. **The seller's brand role from the API.** No SP-API operation read here returns whether the seller is the brand owner, a Brand Representative or a Reseller. `BRANDED_ITEM_CONTENT_CHANGE` works only for verified brand owners. *Settles:* the Brand Registry or Sellers model docs; or the first subscription attempt's reply.
5. **Does View Change History show other contributors' changes?** It is documented for AI-applied changes only. *Settles:* the seller opening it on an ASIN known to have been edited by another seller.
6. **Contribution latency.** Three figures stand:
   - "within 48 hours" (G200335450) for a verified contribution;
   - "within days" (Amazon Science) for seller values reaching the catalogue;
   - "in the next 15 minutes" (8541) for accepting Amazon's values.

   None is a value cx can read. Other files carry further figures for other paths (listing reads in minutes, notifications, bulk uploads, title display, search indexing; see `method/listing-writes.md` and `method/funnel-and-search.md`), and no Amazon page reconciles them. This file follows `method/funnel-and-search.md` (P-funnel-and-search-15) and `method/listing-writes.md`: cx confirms a contribution is displayed by reading it, and quotes no waiting figure. *Settles:* the first real write, by re-reading `getCatalogItem` on a schedule and recording when the value appears.
7. **Published research.** No peer-reviewed work on contribution precedence, listing hijacking or unauthorised resellers on Amazon was found before the search budget ran out. *Settles:* a search of marketing-science and IS journals (for example counterfeit-entry studies) in a later session.

## Positions

1. **P-brand-protection-and-catalog-contribution-1.** When `getCatalogItem` shows a value different from the seller's accepted submission (for an attribute the Catalog returns; one it does not return, such as `generic_keyword`, is never counted as a difference), cx reports it as another contributor's or Amazon's value winning the page, not as a failed write, and does not resubmit the same value. — Listings APIs FAQ; Suggest changes to your product detail page; Product detail page rules; SP-API Release Notes.
2. **P-brand-protection-and-catalog-contribution-2.** Before proposing a content change, cx records the seller's relationship to the brand (brand owner, Brand Representative, Reseller or none), asking the seller if no source answers. Whether the change can win the page depends on that relationship. — Suggest changes to your product detail page; Product detail page rules; Guide to Brand Registry roles.
3. **P-brand-protection-and-catalog-contribution-3.** For a seller without a brand selling role on a brand-registered ASIN, cx says a content write is a suggestion that will most likely not display, and offers the brand-owner route instead. — Suggest changes to your product detail page; Listings Items API Issues Troubleshooting.
4. **P-brand-protection-and-catalog-contribution-4.** cx reads whether an attribute is editable from the product-type schema before proposing a change. On issue 4005033, 4005011 or 4005039 it stops writing and prepares the support case with the identifiers Amazon's resolution names. — Amazon Product Type Definitions Meta-Schema (v1); Listings Items API Issues Troubleshooting.
5. **P-brand-protection-and-catalog-contribution-5.** cx never proposes changing a product's identity, product ID, item package quantity or brand on an existing ASIN; such a change is a new ASIN. — Product detail page rules; Error 8541; Suggest changes to your product detail page.
6. **P-brand-protection-and-catalog-contribution-6.** When the detail page is wrong and the seller's own write cannot fix it, cx names Amazon's route by case and the proof it needs:
   - Selling Partner Support with proof; for images, only the manufacturer's website URL counts as proof;
   - "Request product detail page change" for 8541;
   - Account Health → Report Abuse for an authorised brand user's wrong contribution or a page changed into a different product;
   - Brand-owner override of Amazon's data by ticket.

   — Suggest changes to your product detail page; Error 8541; Product detail page rules; Listings APIs FAQ; Report a violation; Listings Lounge: Report a Violation.
7. **P-brand-protection-and-catalog-contribution-7.** cx does not advise filing a counterfeit or IP report against a reseller of genuine goods. Amazon does not enforce distribution agreements, and Project Zero access depends on report accuracy; cx advises a test buy first and the report type that matches the finding. — Top 3 Mistakes when Reporting a Violation through Brand Registry; Project Zero; How to report an IP violation to Amazon.
8. **P-brand-protection-and-catalog-contribution-8.** At each review, cx reads the offers on the seller's ASIN (`getItemOffers`; Keepa offer-count history where available), compares seller ids and offer count with the last stored copy, and reports a new seller or a jump as a finding for the seller to classify. — productPricingV0.json; Notification Type Values; Keepa Product.java.
9. **P-brand-protection-and-catalog-contribution-9.** At each review and at the end of every observation window, cx re-reads the Catalog for the changed ASIN and compares it with the logged "after". A content change cx did not log is recorded as an outside change, with `BRANDED_ITEM_CONTENT_CHANGE` as the push signal for a brand owner if the box can ever receive it. — Notification Type Values; catalogItems_2022-04-01.json; Listings APIs FAQ.
10. **P-brand-protection-and-catalog-contribution-10.** An effect review whose window contains an outside content change, a change of Featured Offer holder, or a new seller on the ASIN names it as a confounder, and returns "cannot tell" unless the change is shown not to touch the targeted stage. — Notification Type Values; Suggest changes to your product detail page; productPricingV0.json.
11. **P-brand-protection-and-catalog-contribution-11.** cx does not tell the seller that View Change History shows other sellers' edits. Amazon documents it for AI-applied changes only. — Engage With Amazon: Get your Product Title Update Questions Answered!
12. **P-brand-protection-and-catalog-contribution-12.** cx does not present "Brand Elevation" as an Amazon program with known rules. Only press and practitioner reports were found. It may cite Amazon's own rule that sellers without a brand selling role are limited from creating new ASINs under an enrolled brand. — ASIN creation policy; Salsify; My Amazon Guy; Shopifreaks.

### The seat's own (not for a skill)

- [seat] The ACCEPTED-but-not-shown case should be its own outcome in the change log ("accepted, not displayed"). It is distinct from "rejected" and from "displayed", and its next step is an escalation.
- [seat] A jump in offer count on the seller's own branded ASIN, right before a conversion drop, is the most common reason a listing change "failed" that is not about the listing. The offer read belongs in the baseline, not only in the review.
- [seat] The help-hub content call that served these pages is a research route. cx should not depend on it; a browser read with the seller is the route for live policy text.

## Verification

Gap fill 2026-10-14: 6 gaps filled (2 of them in part), 1 left open.

- Filled: contribution precedence (FAQ, G200335450 v23, G200390640 v21, Glenn_Amazon, image-selection post). In part: no Amazon page ranks a vendor or Amazon retail contribution against a brand owner's (Open question 2).
- Filled, in part: case paths when a brand owner's write loses.
  - Read and quoted: the 4005011 / 4005033 / 4005039 / 18280 resolutions, 8541's "Request product detail page change", Selling Partner Support with proof, Account Health → Report Abuse, and the brand-owner ticket override.
  - Not read: the Brand Registry Support case form, which is behind the sign-in wall (Open question 3).
  - Practitioner only: the "Fix a product page" menu path (Sellbrite).
- Filled: locked attributes (meta-schema `editable`, 4005033, G200335450, G200390640, 8541).
- Filled: Report a Violation, Transparency and Project Zero as they touch listings (sell.amazon.com pages, G200444420, Dougal_Amazon and Manny_Amazon posts).
- Filled: hijacker and unauthorised-seller detection (ANY_OFFER_CHANGED, getItemOffers model, Keepa COUNT_NEW and buyBoxSellerIdHistory, Canopy Management).
- Filled: seeing changes by other contributors (BRANDED_ITEM_CONTENT_CHANGE, View Change History scope, Catalog vs Listings diff, `contributors` trap).
- Left open: Amazon's own primary page on Brand Elevation (Open question 1).
- Adversarial re-check: each page cited for a new claim was reopened.
  - The developer pages and help pages were re-read from the saved copies of the same session.
  - The forum threads 4851d334, 91fc52b8, a9cbc533 and 9bf72c46, the Project Zero and Transparency pages, the Amazon Science blog and Canopy Management were refetched with verbatim-quote prompts.
  - Canopy wording corrected: the page says "don't file it as counterfeit" and "damage the reporting accuracy", not that reports "lower your acceptance rate".
  - The Amazon Science "within days" quote is a truncated sentence, marked with an ellipsis.

Reconciled 2026-10-14 (against the contradictions list from three critics; sources reopened this day):

- Help-page reachability: the method note now says which cited help pages have a capture under the office's capture folder (outside this repository) (G200390640 v21, G200898440 v13, G1881 v28), that the quotes from G200390640 match its capture, and that the content call's standing use is the office's ruling (`method/help-page-access.md`, Open question 1). G6DU75NSM86VXKZC, GJ84K745AL3R5N3Q and G200403880 have no capture and stay unread; their rows now say "not served" in the wording of `method/help-page-access.md` A3, and the G200403880 row names the different reply `angles/ai-shopping-surfaces.md` recorded. No page in this file was called unreachable while having a capture.
- Image selection (item 5 and its stable line): the forum post's "prioritize brand owner images" is now set against the current Product image guide (G1881 v28 capture: "doesn't guarantee", "We select and arrange images from multiple selling partners") and the display-issues text `elements/images-and-video.md` records (G17811 v20). The stable line no longer states brand-owner image priority as Amazon's settled rule.
- Image count: G200335450's "one main image and up to eight additional images" agrees with MAIN plus PT01–PT08; the Pages read row now says so and names the product-type schema as the binding slot list. `elements/images-and-video.md` owns the 8-versus-9 question.
- Catalog Items rate limits: model and reference page reopened; `getCatalogItem` and `searchCatalogItems` both read 2/2 on both. This file's figure was right; it is now marked for human readers, with the `x-amzn-RateLimit-Limit` header as the binding value. Files quoting 5/5 for `searchCatalogItems` are the ones out of line with both pages read today.
- Catalog read-back of `generic_keyword`: SP-API Release Notes (August 16, 2023 entry) reopened. Item 31, the run-time list, a new stable line and P-1 now say an attribute the Catalog does not return is not a Catalog-against-Listings difference.
- Stable line on offers: "top 20" removed from the stable line (the cap lives in the notification page and the model); the figure stays in items 26–27 for human readers.
- Contribution latency (Open question 6): the other files' figures are named as unreconciled and this file aligns with P-funnel-and-search-15 and `method/listing-writes.md` (confirm by reading; quote no waiting figure). No stable line or position here carries a latency.
- Suppressed listings (G200898440): its 80/130-character title text is quoted from the capture and flagged as differing from the current title rule `elements/title.md` owns; this file uses neither.
- Not changed: Featured Offer eligibility, SQP, Data Kiosk roles, MYE, Keepa slot and size disputes, and the AI title rewrite items in the list do not concern statements this file makes. Its Keepa use (`csv[11]`, `buyBoxSellerIdHistory`) is not among the disputed fields. No cross-reference here named `inventory-and-fulfilment.md` or `elements/vendor-and-hybrid.md`.
