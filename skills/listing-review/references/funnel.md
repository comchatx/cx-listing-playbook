# The listing funnel

Each sentence ends with the research item it rests on: P-<file>-<n> is in the package's research/<angles|elements|method>/<file>.md.

## Stages

- A listing's sales pass the stages findable, exposure, click-through, conversion and the offer, and each shows in a named file and field (P-funnel-and-search-1).
- For search traffic, purchases are impressions times click rate times conversion rate by the Search Catalog Performance report's definitions; for all traffic, units are sessions times unit session percentage by the Sales and Traffic report's; the two conversion rates are different measures (P-funnel-and-search-2).
- Search Query Performance and Search Catalog Performance count organic and Sponsored Products results on the search results page only, exclude widgets, and do not say whether Sponsored Brands or Sponsored Display are counted (P-funnel-and-search-19).

## Which element serves which stage

- Exposure: the title, search terms, `item_type_keyword` and browse classification, and structured attributes with valid values (P-funnel-and-search-4).
- Amazon describes lexical matching against catalog data; a query word absent from it relies on semantic matching Amazon does not promise (P-funnel-and-search-5).
- Bullets and description serve exposure only when Amazon chooses to index them, and conversion always (P-funnel-and-search-4).
- In the US store a too-general `item_type_keyword` can drop the product from All Departments results restricted to an item type; other stores classify through `recommended_browse_nodes` (P-attributes-and-browse-nodes-20).
- Click-through: what a search result shows, which is the main image, the title with item highlights, price, badges, rating and the delivery message (P-funnel-and-search-6).
- For high impressions with low click-through, Amazon tells sellers to review the title, the main image and the price (P-title-28).
- Conversion: the detail page (images, bullets, and the description or the A+ content that replaces it) together with the offer (P-funnel-and-search-7).
- Search terms serve exposure only (P-search-terms-1).
- The main image serves click-through; secondary images, video and 3D serve conversion (P-images-and-video-1).
- A+ and Brand Story are conversion-stage elements, and an A+ change is judged at conversion (P-a-plus-content-1; P-funnel-and-search-30).
- Amazon states that A+ image alt text helps search; no Amazon page says whether A+ body text is searched (P-funnel-and-search-30).

## Gates copy does not fix

- An ASIN is unsearchable when it is a parent, has no browse node, has no buyable offer, has a future launch date, or is search-suppressed (P-funnel-and-search-3; P-search-terms-13).
- Search suppression shows in the Listings Items model as the enforcement action `SEARCH_SUPPRESSED` (P-funnel-and-search-3).
- A listing is healthy in a store only when its `getListingsItem` `status` holds `BUYABLE` and `DISCOVERABLE`, no `issues` item has severity `ERROR` or carries a `NOT_EXEMPT` enforcement, and the Catalog shows what was submitted (P-listing-content-and-health-3).
- Amazon says an empty `issues` list does not represent every problem; policy removals show under Account Health's Product Policy Compliance (P-account-health-2).
- An offer that is out of stock, Inactive or not shippable is not buyable, and such an offer cannot be featured (P-inventory-and-fulfillment-3).
- Live quantity is `getListingsItem` `fulfillmentAvailability`; FBA fulfillable units come from `getInventorySummaries` with `details=true` (P-inventory-and-fulfillment-1).
- FBA units without an active offer are stranded and unbuyable; Amazon's remedy is fixing the listing, not shipping more units (P-listing-content-and-health-23).
- Amazon also names these causes of lost sales or visibility that are not copy: inactive or split variation children, an approval or compliance requirement, main-image suppression and an Account Health listing-policy violation (P-listing-content-and-health-22).
- Adult classification restricts an ASIN from All Departments search, and a main image that breaks the image rules may be removed from search (P-funnel-and-search-23).

## Pricing states

- A potential pricing error deactivates the offer; a price above the competitive or recent reference leaves it live but without the Featured Offer, and only the first is lost buyability (P-listing-content-and-health-24).
- A price outside the seller's minimum and maximum allowed prices is an error or a deactivation (P-price-position-10).
- A Pricing Health entry is a price problem on the seller's own offer, not a competitor move or a content problem (P-triggers-19).

## The account layer

- `getMarketplaceParticipations` returns `hasSuspendedListings` for each store; when true it marks an account-level Inactive status that would explain every listing's lost buyability at once (P-sp-api-access-14).
- The seller-performance report (the report door.md, the amazon-sp-api skill's references/door.md, lists for account health) holds each policy metric's `status`, `targetValue` and `targetCondition` and the Account Health Rating fields (P-account-health-3).
- Its field set differs between Amazon's docs page and its schema file (P-listing-content-and-health-29).
- Account actions can suppress offers (P-triggers-23).
- Product Policy Compliance details, Performance Notifications, Manage Your Compliance, Voice of the Customer and Account Health Assurance status are not readable through the connection (P-account-health-12).
- A policy item that names the detail page itself (a trademark on the page, a prohibited claim, a page that does not match the product) has a content fix, and the appeal is a separate step (P-account-health-5).
- A policy item about the product, its packaging, authenticity, safety or documents is resolved by no listing edit; Amazon asks for invoices, an order ID, a licence or retraction, compliance documents, or a Letter of Compliance (P-account-health-6).
- Closing, deleting or zeroing stock on a listing does not remove an account-health violation (P-account-health-7).
- Amazon's appeal structure is the violation and product, the cause, the reactive steps and the proactive steps (P-account-health-13).
- Amazon does not accept a reused or recycled earlier appeal (P-account-health-13).
- Account Health Assurance covers the account, not a listing, and only while the seller engages within the window Amazon's Account Health Assurance FAQ states (P-account-health-14).

## The Featured Offer

- Amazon states the factors as total price, delivery promise, free shipping, free returns and seller performance (P-price-position-4).
- Stock decides it too, and no listing-text change alters these factors (P-funnel-and-search-8).
- Seller star rating, Prime and FBA are not factors Amazon names (P-account-health-9).
- Promotions and much of the detail page's selling power reach the shopper only through the Featured Offer (P-price-position-1).
- Whether the seller's offer can be featured, and why not, shows in `getFeaturedOfferExpectedPriceBatch` `resultStatus` and `getListingsItem` `issues` (P-price-position-1).
- Amazon is removing the seller eligibility requirement store by store, and the store's Becoming the Featured Offer page says which regime applies (P-price-position-3).
- Where it is removed, a new seller's offer is judged on the same criteria as the brand's (P-offer-competition-and-hijackers-15).
- A formerly ineligible seller's Featured Offer share can rise with no listing change after the store's switch, so a series that spans the switch is not comparable for Featured Offer share or conversion (P-triggers-20).

## Amazon search and Alexa for Shopping

- Amazon publishes no ranking weights for Amazon search, and Seller Labs, Canopy and Eva describe "A10" as a name sellers use, not an Amazon one (P-funnel-and-search-17).
- The shopping assistant is Alexa for Shopping, formerly Rufus, and sources that say Rufus describe the same assistant (P-ai-shopping-surfaces-1).
- Amazon states the assistant answers product questions from the detail page's listing details, customer reviews, community Q&A, information from across the web and the shopper's own history, and it names no field it reads (P-ai-shopping-surfaces-2; P-description-12).
- Complete, accurate structured attributes are the one element Amazon names as helping the assistant, and a wrong value can be repeated to shoppers (P-ai-shopping-surfaces-3).
- Amazon's remedy for a wrong answer is a detail page holding the right facts plus a help-center ticket with the ASIN, a screenshot of the question and answer, the issue, the expected answer and supporting proof (P-ai-shopping-surfaces-4).
- Sellers have no control over Help Me Decide, AI Shopping Guides or assistant recommendations (P-ai-shopping-surfaces-17).

## Amazon-written content

- Amazon replaces non-compliant titles with AI recommendations without a submission, so any title, the seller's or a competitor's, may be Amazon-written (P-ai-shopping-surfaces-11).
- What shoppers see is the Catalog's reconciled data, which Amazon may re-classify or rewrite (P-funnel-and-search-16).
- In Review listing changes, Amazon-proposed changes to a brand's listings publish automatically when the review window ends unless the brand representative responds, disagreeing pauses a change while Amazon reviews the feedback, and the connection does not read that queue (P-ai-shopping-surfaces-9).
- Review listing changes does not show image or browse-node changes; those show by comparing Catalog Items reads over time (P-ai-shopping-surfaces-10).
- Amazon documents View Change History for AI-applied changes only (P-brand-protection-and-catalog-contribution-11).
- A content change the change file does not hold shows as a difference between the Catalog read and the logged "after" (P-brand-protection-and-catalog-contribution-9).

## Rank

- No Amazon API gives a keyword position (P-search-rank-and-volume-1).
- A position in `searchCatalogItems`, Keepa `/search` or Creators API `SearchItems` results is not search rank (P-search-rank-and-volume-2).
- Amazon's measured exposure per query is Search Query Performance impressions and impression share, or Data Kiosk keyword impressions (`search.query`) (P-search-rank-and-volume-1).
- Best Sellers Rank is relative sales within a named category, not a unit count (P-competitor-set-14).
- Amazon's guide to sales rank says a top Best Sellers Rank does not always equal a high organic search rank (P-competitor-discovery-1).
- Catalog Items returns `classificationRanks` and `browseClassification` separately, so the rank category need not be the browse node; an item may hold several ranks, and a rank compares only with ranks in the same `classificationId` (P-attributes-and-browse-nodes-22).
- A change of rank category or browse node makes the earlier rank series incomparable (P-triggers-28).
- Amazon's Choice, Overall Pick and Best Seller cannot be paid for or applied for, and follow ratings, price, popularity, availability, delivery and sales (P-badges-and-placements-1).
- The top rank in a `salesRanks` category does not prove the Best Seller badge, which also needs a featured category of the size the Sales Rank FAQ states and an ordering threshold Amazon does not publish, and is hidden on parent-rolled pages (P-badges-and-placements-2).
