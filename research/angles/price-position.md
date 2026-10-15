# Price position, the featured offer (Buy Box), coupons and deals

Read 2026-10-14 by the research seat. Tags: [official] Amazon's own page or document; [opinion] a named practitioner; [research] published research; [seat] the seat's own reasoning, never a skill position.

## What this covers

**Stages.** Price works on two stages and gates a third. Click-through: the price, a strike-through reference price with its savings figure, a coupon badge and a deal badge are shown in search results ([official] Amazon policy on reference prices; Coupons; Amazon deals). Conversion: on the detail page the customer buys through the featured offer (the "Buy Box"); promotions only display when the seller's offer is the featured offer ([official] Amazon promotions; Create a coupon). Exposure is touched indirectly: for some product types a listing with no unit-count data is "no longer shown in search" (price per unit), and Amazon says price discounts "may help drive additional customer discovery" ([official] Price per unit requirements; Price discounts).

**Skills fed.**
- `listing-review`: the offer is a listing element. Before calling a listing's content weak, cx must rule out a price problem. That means the offer is not featured, a pricing error has deactivated it, the strike-through has vanished, or a coupon is suppressed. The review reads where each price figure lives, from Amazon and from Keepa.
- `listing-change-log`: a price, coupon or deal change is a change in its own right. It has its own record, request and receipt. Each price entry is also a line in the confounder log of any content change running at the same time.
- `effect-review`: price is the first confounder in any content experiment. This file lists what must be read for the same baseline and observation windows (own price, featured-offer share, reference price, coupon, deal, the competitor set's prices) before a content verdict is allowed. It also says why the major-sale rule exists on Amazon's own terms: Amazon excludes peak events from its reference-price arithmetic.

**Why a senior operator cares.** Four facts changed in 2026, and most practitioner pages and most model memory still have them wrong:
- **Seller-level featured-offer eligibility is being removed.** Amazon's News announcement says it will "begin removing seller eligibility requirements" "Starting in July 2026", rolling out "gradually across all Amazon stores globally, completing by the end of 2026"; the US help page says "As of September 2026" Amazon "no longer maintains a seller eligibility requirement". Selection itself is unchanged ("We're not changing how the Featured Offer is selected"). Outside the US the change may not have landed yet.
- **List Price validation tightened.** Effective April 23, 2026 a List Price is validated only if the product was recently offered at it by another retailer or purchased as the Featured Offer on Amazon at it ([official] Upcoming Improvements to Reference Pricing, Seller Forums News).
- **The Typical Price rule changed.** From May 18, 2026 a product that is under its usual price most of the time gets a Typical Price that includes promotional sales.
- **Competitor promotions are now visible.** Since July 29, 2026 the SP-API returns the live coupon or deal on competing offers.

**Added by the gap fill (2026-10-14).** Five more facts change whether a price move pays and what the customer sees:
- **Fees move in steps.** Fees change at fixed price points. Some referral fees switch rate for the whole price at a threshold; in the US, Beauty and Baby go from 8% to 15% above $10.00, and Clothing moves three times by $20. FBA fulfillment fees have three US price bands (under $10, $10–$50, over $50). FBA fees also rise for the holiday peak (October 15, 2026 to January 14, 2027). A price or coupon judged "held" on units can still lose margin ([official] Selling on Amazon fee schedule; 2026 US FBA fulfillment fee changes).
- **Fee estimates are readable.** The Product Fees API estimates the fees at any proposed price before it is set ([official] productFeesV0.json).
- **Business buyers have their own price.** Amazon Business buyers see their own price, quantity tiers and featured offer. A consumer price cut can leave the business price above the standard price, which Amazon treats as an error ([official] Business pricing and quantity discounts FAQ; Pricing Health warning and error messages).
- **Subscribe & Save follows the one-time price.** The Subscribe & Save price is computed from the one-time price ([official] Strike-Through Pricing and Savings).
- **EU rules differ.** EU stores measure discounts against the lowest price of the last 30 days and cap discount duration ([official] Price discounts, EU version; Amazon policy on reference prices, EU version).

On day 2 of the beta run, cx proposed "a 10% coupon, CTR +10–15%". It gave no source and no check that the offer was featured. The proposal is in the internal run report `20261014-0921-beta-browser-listing-run-day-2.md`. That is the failure this angle exists to prevent.

## Amazon's own rules and guidance

### A. The featured offer (Buy Box)

**Rules**

- **What it is.** The Featured Offer is "the offer that appears with Add to Cart / Buy Now buttons". Amazon picks it by "evaluating all offers to determine which is the most attractive for the customer". When no offer is clearly better, the Featured Offer "could be a rotation of the best offers". [official] (Becoming the Featured Offer, https://sellercentral.amazon.com/help/hub/reference/external/G201687550, version 20, read 2026-10-14; text saved at capture `G201687550-v20`. Every quotation from this page in this file matches that capture.)
- **Eligibility removed.** "As of September 2026, Amazon no longer maintains a seller eligibility requirement, and offers from all sellers are now eligible to be evaluated for the Featured Offer." The former eligibility page now reads "This page has been removed." Amazon still "will not feature any offer if none of the available offers meet our customer experience requirements, even if the product has only one available offer". [official] (Featured Offer eligibility, https://sellercentral.amazon.com/help/hub/reference/external/G200418100; Becoming the Featured Offer, G201687550; both read 2026-10-14)
- **The announcement behind it.** "Starting in July 2026, we'll begin removing seller eligibility requirements for the Featured Offer." "This change will roll out gradually across all Amazon stores globally, completing by the end of 2026." "We're not changing how the Featured Offer is selected." "No action is required from you." [official] (Updates to Featured Offer eligibility requirements, Seller Forums News and Announcements by News_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/7336583f-09ac-41de-99d1-667017a88db2, read 2026-10-14; the page shows only "3 months ago", no absolute date). So the help page's "As of September 2026" describes the US store; other stores may still apply the old gate until the end of 2026. The two Amazon pages give different dates because they speak of different scopes (the US help layer against the global rollout); neither is wrong, and which regime a store is in is read at run time from that store's own Becoming the Featured Offer page (method/help-page-access.md A5), not from either date.
- **No shipping, no feature.** "Offers must be shippable to the customer to become featured." Also: "Your offer can't become featured if you're out of stock." [official] (Becoming the Featured Offer, G201687550, read 2026-10-14)
- **Decided per variation and per customer context.** The Featured Offer "is determined separately for each variation". Customers "may see different Featured Offers" by shipping location and Prime membership, and when a filter such as delivery-date search is on. [official] (Becoming the Featured Offer, G201687550, read 2026-10-14)
- **What is ranked.** Amazon names its factors:
  - "Total price (item price plus shipping fee)". Coupons are named as a way to improve the chances.
  - The delivery promise: faster, and a specific date rather than a range.
  - Free shipping. A $40 offer with free shipping "is preferable to a $35 offer with $5 shipping".
  - Free returns.
  - Seller performance: order volume, chargeback rate and Voice of the Customer complaints.

  [official] (Becoming the Featured Offer, G201687550, read 2026-10-14)
- **What is not ranked.** Amazon does not consider "Customer reviews and star ratings" (of the seller). It also does not consider "Prime eligibility of the offer" or "Fulfillment method" when "all other factors are equal". Amazon ranks "the same way for every product, and we never use manual overrides". [official] (Becoming the Featured Offer, G201687550, read 2026-10-14)
- **The measured share.** The "Featured Offer percentage" is page views where the seller's offer is featured divided by total page views. It sits in Business Reports and the Detail Page Sales and Traffic reports. [official] (Becoming the Featured Offer, G201687550; Pricing Health, https://sellercentral.amazon.com/help/hub/reference/external/GSTH6YN3BR8XNWBW; read 2026-10-14)
- **Offer display.** Besides the Featured Offer, "up to three additional eligible offers" show in "Other Sellers on Amazon". [official] (Offer placement, https://sellercentral.amazon.com/help/hub/reference/external/G201687530, read 2026-10-14). This page still speaks of a "pool of eligible offers". [seat] It likely predates the 2026 change and has not been updated: Amazon's own pages disagree in wording.

**Guidance**

- To raise the chance of being featured, Amazon says to:
  - price competitively, through Automate Pricing or promotions;
  - offer fast, free shipping with a narrow delivery window;
  - give a clean order experience;
  - keep stock;
  - offer free returns.

  [official] (Becoming the Featured Offer, G201687550, read 2026-10-14)

### B. Pricing that takes the featured offer away, or deactivates the offer

**Rules**

- **Fair Pricing Policy.** If Amazon sees pricing practices "that harms customer trust", it "can remove the Featured Offer, remove the offer, suspend the ship option, or in serious or repeated cases suspend or terminate selling privileges". The listed practices:
  - a misleading reference price;
  - a price "significantly higher than recent prices offered on or off Amazon";
  - multi-unit packs priced higher per unit than the single unit;
  - an excessive shipping fee.

  [official] (Amazon Marketplace Fair Pricing Policy, https://sellercentral.amazon.com/help/hub/reference/external/G5TUVJKZHUVMN77V, read 2026-10-14)
- **Two different failures.** Pricing Health lists:
  - offers **deactivated** for potential pricing errors, for example "your offer price is lower than the minimum price that you previously set";
  - offers **ineligible to become the Featured Offer** because they aren't priced competitively against "the competitive external price" or are "priced significantly higher than recent prices".

  It also lists offers "priced within 5% of the Featured Offer price". [official] (Pricing Health, GSTH6YN3BR8XNWBW, read 2026-10-14)
- **The competitive price threshold.** It is "the lowest price plus shipping for an item or items that customers may consider to be equivalent, recently found at another reputable retailer outside the Amazon store". Amazon may also use it for "near-identical" products under "different or generic brand names". Amazon does not name the retailers. A seller can dispute an outdated competitive price through a self-service case, with resolution "in as little as 30 minutes". [official] (Pricing Health, GSTH6YN3BR8XNWBW, read 2026-10-14)
- **Reference prices Pricing Health may show:**
  - the Featured Offer price;
  - the 60-day average selling price (promotional deal sales excluded, sale prices included);
  - the highest 14-day price shipped and sold by Amazon;
  - the list price;
  - the per-unit derived price;
  - the typical price (90-day median paid);
  - the 60-day average offer price.

  [official] (Pricing Health, GSTH6YN3BR8XNWBW, read 2026-10-14)
- **Min/max rules.** These Pricing Health messages are errors:
  - offer, sale or business price outside the seller's own minimum/maximum;
  - a business price above the offer price;
  - "Potential low pricing error";
  - "Potential high pricing error".

  Future promotional prices (Lightning Deals, 7-day deals) must sit inside the min/max band too. [official] (Pricing Health warning and error messages, https://sellercentral.amazon.com/help/hub/reference/external/GM665AS5HYKFJB8Z, read 2026-10-14)
- **Hard listing-price ceilings.** Individual-plan sellers may not list above $10,000. Professional sellers may not list above $300,000, Collectibles excepted. "Total price" includes shipping, discounts, rebates and promotions Amazon honors. [official] (Price your item, https://sellercentral.amazon.com/help/hub/reference/external/G62551, read 2026-10-14). The verifier could not reopen this page; the $10,000 figure is echoed by a practitioner page (Feedvisor, "pricing" university page, which says "$10,000, unless the item is in the category of Collectible Books"), the $300,000 Professional ceiling was found nowhere else (unverified).
- **Automate Pricing validation.** The minimum must exceed the minimum referral fee. The maximum must be "less than 6 times the ASIN's recent sales price or $200.00, whichever is higher". Prices set manually or by feed bypass these rules. [official] (Minimum and Maximum Price Validation, https://sellercentral.amazon.com/help/hub/reference/external/G202024630, read 2026-10-14). These figures are for human readers only. At run time the binding check is Amazon's validation response (section F).

**Guidance**

- For uncompetitive offers, "consider setting your offer's total price … at or below the competitive external price". For offers far above recent prices, align with the reference prices. Amazon's pre-defined "competitive price rule" is "configured to always match the competitive external price or the Featured Offer price, whichever is lower". [official] (Pricing Health, GSTH6YN3BR8XNWBW, read 2026-10-14)
- "Amazon aims to help customers … and may display a description of an offer's price when it is low or high." [official] (Price your item, G62551, read 2026-10-14)

### C. Reference prices and strike-through (List Price, Typical/Was Price)

**Rules**

- **Where reference prices show.** They are displayed "on product detail pages and in search results … to show savings". A List Price "must represent the price at which you, or other retailers or sellers, have recently made or intend to make substantial sales". The seller must keep it current. A value of 0 means "no List Price". "If Amazon cannot verify your List Price, we might not use it." [official] (Amazon policy on reference prices, https://sellercentral.amazon.com/help/hub/reference/external/G202170370, read 2026-10-14)
- **When a List Price displays.** The seller's offer must be lower than the list price. List prices are "validated against recent sales history, recent Featured Offer prices, and other retailers". When validation uses Amazon sales:
  - the lookback is 90 days;
  - a product needs "at least 9 days of Featured Offer data";
  - "a meaningful number of days" at the list price as the Featured Offer price is required, along with sales at it;
  - "equal to or within a small margin above" counts as a match;
  - for ASINs with 30+ days of history, the two weeks before and during peak events are excluded from the window.

  Updates "typically reflect within a few hours". Each month Amazon emails sellers whose list prices are missing or unvalidated. [official] (Show a reference price on your products by providing a list price, https://sellercentral.amazon.com/help/hub/reference/external/G27XM55CQM3SBMD2, read 2026-10-14)
- **The customer page's version.** The customer-facing page states the window differently: a List Price displays only if bought on Amazon or offered elsewhere at or above it "in the past 90 days for non-seasonal products … and in the past 180 days for seasonal products". The Typical Price is the "90-day median price paid", excluding limited-time promotions and Amazon Haul / Amazon Now prices. "Lowest Price in XX Days" means the current price is at or below the lowest featured-offer price in that period. [official] (Strike-Through Pricing and Savings - Amazon Customer Service, https://www.amazon.com/gp/help/customer/display.html?nodeId=GQ6B6RH72AX8D2TD, read 2026-10-14). The seller page says 90 days only; the customer page adds 180 days for seasonal goods.
- **The 2026 Typical Price change.** "Starting May 18, 2026, if the product's Featured Offer price is below its prevailing non-promotional price for more than half of the 90-day period, the calculation instead includes all sales, including promotional sales." Peak-event sales "are always excluded". BXGY, Subscribe & Save and tailored coupons are excluded. Price discounts "that are not advertised to customers as promotions" now count as non-promotional. Typical and List Price "update regularly without advance notice". [official] (Reference pricing and promotions FAQ, https://sellercentral.amazon.com/help/hub/reference/external/GFQCDTDE2HV9NMVV, read 2026-10-14)
- **The announcement behind both 2026 changes.** "Effective April 23, 2026, the List Price you provide must meet one of the following criteria to be validated": the product "has been offered at this List Price at another retailer recently", or "has been purchased by customers as the Featured Offer on Amazon at this List Price". For Typical Price, if more than half of the 90-day price history is below the non-promotional median, "we'll calculate Typical Price using all sales, including promotional sales"; "Price discounts that are not advertised to customers as promotions are treated as non-promotional sales". [official] (Upcoming Improvements to Reference Pricing, Seller Forums News and Announcements by News_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/f48a1fe5-aa8e-4806-b687-2d9aeec5c351, read 2026-10-14; page shows "7 months ago"). The announcement words the Typical Price trigger as "more than half of the 90-day price history"; the FAQ, as the original seat read it, words it as the Featured Offer price below the prevailing non-promotional price for more than half of the period. Same rule, two phrasings.
- **Amazon's public statement.** "Amazon deal savings are based on validated reference prices"; the Typical or "Was" Price "is the median price paid on Amazon in the last 90 days"; "We work hard to have our deals offer customers the lowest price in at least the last 30 days". [official] (Amazon's approach to offering genuine deals to customers, aboutamazon.com, https://www.aboutamazon.com/news/retail/how-amazon-offers-genuine-deals-to-customers, read 2026-10-14; no date shown)
- **Reference price as the promotion baseline.** "Deals, price discounts during peak events, and coupons all require a minimum percentage off reference prices." [official] (Reference pricing and promotions FAQ, GFQCDTDE2HV9NMVV, read 2026-10-14)

**Guidance**

- A displayed list price "may increase your sales". This is Amazon's claim, with no figure. [official] (Show a reference price…, G27XM55CQM3SBMD2, read 2026-10-14)

### D. Coupons, price discounts (incl. Prime-exclusive), deals, Subscribe & Save

**Rules: coupons**

- **Where shown.** Customers discover coupons on the Coupons page, in "Search results", on detail pages, in the All-Offers Display and in cart. [official] (Coupons, https://sellercentral.amazon.com/help/hub/reference/external/G3QLEV6W2QK84C57, read 2026-10-14)
- **When a coupon does not show.** It does not appear on the detail page if any of these holds:
  - it is not yet active, which takes "four to six hours after creation";
  - it was deactivated;
  - the offer isn't buyable;
  - "Your offer doesn't become the Featured Offer".
- **How a coupon is set.**
  - The discount is 5–50% (percentage) or money off.
  - It applies to one unit per order.
  - Edits can only increase the discount.
  - A second coupon on the same ASIN deactivates the newer one.
  - Coupons combine with Lightning Deals, sale price and other promotions. Amazon warns this "can result in an unexpected customer spike".
  - Discount percentages and event names are prohibited in coupon titles.

  [official] (Create a coupon, https://sellercentral.amazon.com/help/hub/reference/external/G202189350, read 2026-10-14)
- **Eligibility.**
  - Seller: a Professional seller with at least a 3.5 feedback rating, or no rating yet.
  - Product: new condition; 1–4 reviews need an average of at least 2.5 stars; 5+ reviews need at least 3 stars.
  - The discount must be "at least 5% below the Was Price or List Price".

  [official] (Coupon eligibility criteria, https://sellercentral.amazon.com/help/hub/reference/external/GJHCPEFJ5JJQD52D, version 14, read 2026-10-14; text saved at capture `GJHCPEFJ5JJQD52D-v14`: "To be eligible for coupons, you must be a Professional seller with at least a 3.5 Seller feedback rating."). The 3.5 here is the seller's *feedback* rating; the deal page's 3.5 is the seller's "overall rating". The coupon "overall rating of at least 3.5 stars" that seasonality-and-events.md first quoted without saying whose comes from Amazon's sell.amazon.com promotions guide, which does not say; this help page does, and seasonality-and-events.md's gap fill now cites it to the same effect.
- **Validation.** It runs about six hours before start and "continuously … as long as your coupon is active".
  - "No Validated Reference Price" suppresses the coupon on that ASIN.
  - Your Price may not be more than 30% above the Was Price.
  - The net price must beat the Was or validated List Price by at least 5%.
  - New ASINs, and established 4-star ASINs with no reference price, are exempt from the reference-price rules.

  [official] (Understanding coupon errors, https://sellercentral.amazon.com/help/hub/reference/external/GLBL4T5C9UAB9T5P, read 2026-10-14). The errors page gives a minimum star rating of 1 for 1–4 reviews. The eligibility page (GJHCPEFJ5JJQD52D v14) says 2.5. Amazon's two pages disagree; this file picks neither, and the binding floor for a given ASIN is what the coupon creation flow reports at run time, as the seller relays it (no SP-API operation creates or validates a coupon; section F).
- **Fees.** A $5 upfront fee per coupon plus 2.5% of coupon sales, capped at $2,000. The fees are separate from the discount budget and not refunded on returns. [official] (Coupon fees, https://sellercentral.amazon.com/help/hub/reference/external/GM2HYLSWFBZ267BB, read 2026-10-14). The $5 + 2.5% structure is confirmed by Amazon's News post: from June 2, 2025 (US) "Coupon fees will change from $0.60 per unit sold to an up-front fee of $5 per coupon plus 2.5% of coupon sales" ([official] Amazon is making it easier to try using deals and coupons to create additional demand for your products, Seller Forums News, https://sellercentral.amazon.com/seller-forums/discussions/t/c71e49a4-8f57-42ea-8d6a-accec5de1ebe, read 2026-10-14). That post names a $2,000 cap only for deals; the coupon cap rests on the help page alone (unverified by the verifier).
- **Discount range, from the announcement.** "Starting March 12, 2024, coupons will be subject to new pricing requirements"; discounts stay between "minimum (5% off) and maximum (50% off)"; products need "a sales history"; the promotion price must be below "the 'was price' or the recent lowest price". [official] (New coupon pricing requirements, Seller Forums News, https://sellercentral.amazon.com/seller-forums/discussions/t/030d95b5-3c38-4b9f-be57-837a9929e051, read 2026-10-14)

**Rules: price discounts, Prime Exclusive, stacking**

- **Price discounts.** These are the current home of the Prime-exclusive discount. They run 1–30 days on a committed number of units, for Prime, all customers or business customers.
  - The discount must be at least 5% off the 30-day lowest non-promotional price, at least 5% off the current price, and at least 5% off a validated reference price.
  - The product must have at least a three-star rating.
  - Prime-exclusive price discounts need a validated reference price; without one "the discounted price will be suppressed".
  - "Price discounts for products with a validated reference price appear with a strike-through price in search results and on the product detail page."
  - No fee on non-event days. Peak events cost $100 plus 1.5% of sales, capped at $5,000 (2026 rates).

  [official] (Price discounts, https://sellercentral.amazon.com/help/hub/reference/external/G7F8CQ4EJ5YA4272; Troubleshoot price discounts, …/GCCGZV46UWFMN9RV; Price discount fee, …/GVZXV3WZFCBR3VL2; read 2026-10-14)
- **Stacking.**
  - Coupons + price discounts and coupons + Lightning/Best Deals "always stack automatically".
  - Deals + price discounts do not stack: "best price wins, other is suppressed".
  - Discounts apply in sequence: 10% + 20% = 28%.

  [official] (Stacked promotions, https://sellercentral.amazon.com/help/hub/reference/external/G2ZCMMUXK7VP3K6S, read 2026-10-14)
- **Promotions need the featured offer.** Promotions "are most effective when your offer is the Featured Offer. Otherwise, the promotional messaging cannot appear on the detail page." [official] (Amazon promotions, https://sellercentral.amazon.com/help/hub/reference/external/G60951, read 2026-10-14)

**Rules: deals**

- **Types.** A Lightning Deal runs "usually 4 to 12" hours; a Best Deal runs for days.
  - "Amazon Deals is an invite-only program." Eligible ASINs "are refreshed every week".
  - Two rating floors, one on each party. Seller: "To be eligible for deals, you must be a Professional seller with an overall rating of at least 3.5 stars." Product: "Products must have a sales history on Amazon and at least a 4-star rating." The product criteria are "subject to change based on country and time of year".
  - A validated reference price is required.
  - The deal price may not exceed the maximum deal price, which "includes reference prices, recent promotions, recent sales history, and the lowest price from any seller with an offer on the product in new condition" and "also includes a minimum discount from the reference price".
  - Lowering the listing price during an upcoming deal may force a lower deal price "to avoid deal suppression". Creating or assigning new child ASINs to a variation family after the deal is submitted makes the deal "revalidate", which "will cause the deal to become suppressed or canceled".

  [official] (Amazon deals, https://sellercentral.amazon.com/help/hub/reference/external/G202111490, version 25, read 2026-10-14; text saved at capture `G202111490-v25`). seasonality-and-events.md's first pass called this page unreachable (an unsigned fetch of the page shell) and the 4-star floor ambiguous between seller and product; the capture settles both (the seller floor is an overall rating of 3.5, the product floor 4 stars), and that file's gap fill now reads version 25 to the same effect. The figures are for human readers; the live floors are the page and the Deals dashboard's Eligible ASINs list.
- **Suppression.** Errors must be fixed "25 hours before the scheduled start". A suppressed deal "may continue to display" its price. "Running a Deal does not guarantee that you will win the Featured offer." [official] (Troubleshoot suppressed and active deals, https://sellercentral.amazon.com/help/hub/reference/external/GKN9A84DGTYWYHWY, read 2026-10-14)
- **Deal fees.**
  - Non-peak: $70 per day plus 1.0% of sales, capped at $2,000.
  - Peak 2026 events: $100 plus 1.5%, capped at $5,000.
  - The upfront fee is charged "even if your deal does not produce any sales".

  - Peak "Rates may vary by event"; the page states the 2026 rates for Prime Day, Prime Big Deal Days, Black Friday and Cyber Monday.
  - "running a deal doesn't guarantee that you'll be the Featured Offer."

  [official] (Understand deal fees, https://sellercentral.amazon.com/help/hub/reference/external/G202111590, version 27, read 2026-10-14; text saved at capture `G202111590-v27`). These are figures for human readers: Amazon changes them by announcement, and the binding fee is the one the deal creation workflow displays ("The fee is displayed as part of the deal creation workflow"). Corroborated by Amazon's News posts: from June 2, 2025 (US) Best Deal and Lightning Deal up-front fees went "from $300/$150 per deal respectively, to $70 each per day plus a variable fee of 1.0% of deal sales with a cap for the variable fee at $2,000 per deal" (Amazon is making it easier to try using deals and coupons…, cited above); for holiday 2026 Best Deals, Lightning Deals and Prime Exclusive Price Discounts cost "$100 per promotion, plus" "1.5% of promotional sales (capped at $5,000)", with $50 off the upfront fee for early submission ([official] Holiday 2026: Same fees, same eligibility, earlier deadlines, Seller Forums News, https://sellercentral.amazon.com/seller-forums/discussions/t/3e31fbb7-04e0-4ed4-873e-f74b1052e2ff, read 2026-10-14).
- **Prime Exclusive Deals.** "Sellers cannot independently request Prime Exclusive eligibility." [official] (Prime Exclusive Deals, https://sellercentral.amazon.com/help/hub/reference/external/GFXXXKMMQE9WLVNZ, read 2026-10-14)

**Rules: Subscribe & Save**

- Requires Brand Registry (Brand Representative role).
- Seller-funded base tiers are 0/5/10/15/20%, with Amazon funding an extra 5% when a customer orders five or more items to arrive together. Amazon's public program page says less: "You can fund an additional 5% or 10% discount" and "Amazon funds a 5% discount on Subscribe & Save orders of five items or more" ([official] Subscribe & Save, https://sell.amazon.com/programs/subscribe-and-save, read 2026-10-14). The two Amazon pages disagree on the tiers; the 15% and 20% tiers rest on the Seller Central page alone (unverified by the verifier).
- Deliveries may be paused if "There is a lower-priced offer available for the ASIN".
- Coupons and deals are added on top of the S&S discount.

[official] (Subscribe & Save, https://sellercentral.amazon.com/help/hub/reference/external/G201620110, read 2026-10-14)

**Guidance**

- Amazon recommends combining coupons with Sponsored Products "which could help to improve search placement and increase page views". [official] (Create a coupon, G202189350, read 2026-10-14). Amazon gives no figure for the click-through effect of a coupon badge on any page read.

### E. The SP-API faces of price

- **Product Pricing versions.** v2022-05-01 is current; v0 is "Legacy". Neither page nor model marks v0 deprecated or gives a removal date. The one schedule row: the `CompetitivePriceThreshold` reference-price type of v2022-05-01 was deprecated on June 25, 2025 and removed on September 30, 2025. `CompetitivePrice` was added on June 25, 2025. The featured-offers tutorial still lists `CompetitivePriceThreshold` as "available only in the JP Amazon store". [official] (Product Pricing API, https://developer-docs.amazon/sp-api/docs/product-pricing-api.md; SP-API Deprecation Schedule, …/sp-api-deprecations.md; SP-API Release Notes, …/sp-api-release-notes.md; Retrieve a list of featured offers for a batch of up to 20 ASINs, …/retrieve-featured-offers-batch-asins.md; productPricingV0.json; all read 2026-10-14)
- **`getFeaturedOfferExpectedPriceBatch`.** It returns, for up to 40 SKUs, "the computed listing price at or below which a seller can expect to become the featured offer (before applicable promotions)". `resultStatus` values:
  - `VALID_FOEP`
  - `NO_COMPETING_OFFER`
  - `OFFER_NOT_ELIGIBLE`
  - `OFFER_NOT_FOUND`
  - `ASIN_NOT_ELIGIBLE`

  The model adds "Additional values might be added in the future", so a reader must tolerate an unknown status. Amazon warns that "FOEP values are automatically generated". It is "for items listed in new condition that ship nationwide". [official] (productPricing_2022-05-01.json; Return a batch of FOEP data for a set of SKUs, …/return-batch-foep-data-set-skus.md; read 2026-10-14)
- **`getCompetitiveSummary`.** Up to 20 ASINs per batch. `includedData` takes `featuredBuyingOptions`, `referencePrices`, `lowestPricedOffers` and `similarItems`.
  - Featured offers are segmented by `PRIME` / `NON_PRIME` / `DEFAULT`, with `glanceViewWeightPercentage` and a `sampleLocation`.
  - `WasPrice` is "determined using the 90-day median price paid by customers for the product on Amazon", excluding limited-time promotion prices. `CompetitivePrice` is "available in all Amazon stores except JP"; `CompetitivePriceThreshold` "available only in the JP Amazon store". (Retrieve a list of featured offers for a batch of up to 20 ASINs — the tutorial, not the model or the FAQ, carries these definitions.)
  - Since July 29, 2026 each offer may carry a `promotions` array (`COUPON`, `DEAL`, `BASKET_BUILDING`) with the discount and `discountedPrice`, in both `featuredBuyingOptions` and `lowestPricedOffers`. It "might not include every active promotion" (Price Adjustment Automation Workflows Guide). The model's `PromotionType` here has no `PRICE_DISCOUNT`; [seat] so a competitor's price discount presumably shows only as its price (unverified).

  [official] (productPricing_2022-05-01.json at commit 74ed063b28 of 2026-07-29; Retrieve a list of featured offers for a batch of up to 20 ASINs, …/retrieve-featured-offers-batch-asins.md; Price Adjustment Automation Workflows Guide, …/price-adjustment-automation-workflows-guide.md; read 2026-10-14)
- **v0 reads.** `getPricing` reads the seller's own price by SKU. `getItemOffers` returns a summary (`BuyBoxPrices`, `ListPrice`, `CompetitivePriceThreshold`, `SuggestedLowerPricePlusShipping`, `BuyBoxEligibleOffers`, `NumberOfOffers`) and up to 20 offers with `IsBuyBoxWinner`, `IsFeaturedMerchant` and `MyOffer`. "There can be up to two Buy Box winners at any time per ASIN, one that is eligible for Prime and one that is not." [official] (productPricingV0.json, read 2026-10-14)
- **Notifications.** `PRICING_HEALTH` fires "whenever a seller offer is ineligible to be the Featured Offer … because of an uncompetitive price". Its payload carries reference prices: `averageSellingPrice`, `competitivePriceThreshold`, `retailOfferPrice`, `msrpPrice`. `ANY_OFFER_CHANGED` fires on a change to the top 20 offers, the external price, the winner or the winning price, and only for items the seller has active offers on. Both need a subscription and a queue destination. [official] (Notification Type Values, …/notification-type-values.md; Product Pricing API and Notifications FAQ; read 2026-10-14)

### F. Writing a price, and how the write is validated

**Rules**

- **Where price lives.** Price lives in the Listings Items attribute `purchasable_offer`. It is an array keyed by `marketplace_id`, `currency` and `audience`. Its sub-attributes:
  - `our_price` (cannot be deleted);
  - `discounted_price` (a sale price with `start_at` and `end_at`);
  - `minimum_seller_allowed_price` and `maximum_seller_allowed_price`;
  - `map_price`, `start_at`, `end_at`;
  - `quantity_discount_plan` (B2B);
  - `automated_pricing_merchandising_rule_plan`.

  Use `op: "merge"` to update or null-delete one sub-attribute ("Surgically updates OR deletes individual sub-attributes (set to `null` to delete)"). `op: "replace"` "Replaces the sub-attributes you include, but does NOT delete what you omit". `op: "delete"` "Cannot target sub-attributes within `purchasable_offer`". Payloads must adhere to the product-type JSON Schema. [official] (Manage purchasable offer, https://developer-docs.amazon/sp-api/docs/manage-purchasable-offer.md, read 2026-10-14). The model agrees: `PatchOperation.op` is the enum `add`, `replace`, `merge`, `delete` ("The `merge` operation merges the target property") [official] (listingsItems_2021-08-01.json on `main`, re-read 2026-10-14). So `merge` exists; elements/bullet-points.md, elements/description.md and elements/search-terms.md, which describe patch as whole-attribute add/replace/delete only, omit it, and angles/listing-content-and-health.md's "semantics unknown" is answered for `purchasable_offer` by this page.
- **PUT does not remove a price.** For sellers, `putListingsItem` "merges previously submitted sales term attributes … omitting a purchasable offer price value does not result in its removal". [official] (Building Listings Management Workflows Guide, …/building-listings-management-workflows-guide.md, read 2026-10-14)
- **Validation preview.** `patchListingsItem` with `mode=VALIDATION_PREVIEW` returns pricing issues in category `INVALID_PRICE`:

  | Code | Severity | Meaning |
  |---|---|---|
  | `100708` | WARNING | "Not eligible to be the Featured Offer due to uncompetitive price". The update is accepted. |
  | `19038` | ERROR | Above the seller's maximum |
  | `19037` | ERROR | Below the seller's minimum |
  | `18701` | ERROR | "potential high pricing error" |

  "`VALID` with `WARNING`-level pricing issues means the listing update is accepted, but the offer may not be eligible." The mode "has lower rate limits and is intended for testing a small number of listings. It is not designed for production workflows." `ACCEPTED` on a real submit means only that "initial validations have passed". [official] (Manage Listings Issues, …/manage-listings-issues.md; Price Adjustment Automation Workflows Guide; read 2026-10-14)
- **Automate Pricing rules.** These can be attached through the API. The available rule ids come from the seller's product-type schema, in `automated_pricing_merchandising_rule_plan`'s `enum`/`enumNames`. One rule per SKU, with min/max guardrails. [official] (Manage automated pricing rules with SP-API, …/manage-automated-pricing-rules.md, read 2026-10-14)
- **Promotions cannot be created through the API.** The Promotions API (2025-12-01, launched August 26, 2026) has only `searchPromotions`, `getPromotion` and `getSelection`. Promotion types are `COUPON`, `DEAL`, `PRICE_DISCOUNT` and `BASKET_BUILDING`. It is for status, item selection and validation issues; no operation creates or edits a coupon or deal. Amazon's overview and release note say the API is "to search, retrieve, and manage promotions", but the model at its August–September 2026 commits documents only the three GET operations; "manage" is wording ahead of the model. Each operation needs the Pricing or Product Listing role. [official] (Promotions API, …/promotions-api.md; promotions_2025-12-01.json; SP-API Release Notes, August 26, 2026; read 2026-10-14)

### G. Where the price figures land in reports and datasets

- **`GET_SALES_AND_TRAFFIC_REPORT`.** Carries `buyBoxPercentage` and `averageSellingPrice` by date and ASIN, and can be requested "up to three times every five minutes". [official] (Analytics Reports, …/report-type-values-analytics.md, read 2026-10-14)
- **Search Query Performance report.** Per query it carries `totalMedianClickPrice` vs `asinMedianClickPrice`, and the same pair for cart adds and purchases. That is a direct, query-level read of price position at click and purchase. [official] (Analytics Reports, read 2026-10-14)
- **Coupon and promotion reports.** The two reports need different roles.
  - `GET_COUPON_PERFORMANCE_REPORT` (Role: Brand Analytics; Availability: Sellers) gives clips, redemptions, budget and sales, with start dates "up to two years before the current date". It is cumulative "up until the day prior" while running and updated daily.
  - `GET_PROMOTION_PERFORMANCE_REPORT` is available to "Sellers who have the Selling Partner Insights Selling Partner API role and vendors who have the Brand Analytics Selling Partner API role who are also registered in Amazon's Brand Registry". It covers only "Best Deal and Lightning Deal" for sellers.

  [official] (Performance Reports, …/report-type-values-performance.md, read 2026-10-14, re-read for roles 2026-10-14). This is the same split seasonality-and-events.md states; the roles are for human readers, and whether the connection holds them is door.md's to read.
- **Data Kiosk Seller Analytics dataset.** It has `featureOfferPct` and a `promotion` group (`promotionType`, discount %, `dealOurPrice`, promotion conversion rate). Its search metrics carry "price at time of impression/click/cart add/purchase". [official] (analytics_sellerAnalytics_2025_03_31.graphql; SP-API Release Notes, September 30, 2026; read 2026-10-14)

### H. The fee bands a price or coupon change crosses (gap fill)

All Seller Central pages in this section were read through the help hub's content service (`GetHelpTopic` with body `{"guid": "<id>"}`), US store unless marked.

**Rules: referral fees (US)**

- **What the fee is charged on.** "For all products, Amazon deducts the applicable referral fee percentage calculated on the total sales price, excluding any taxes … The total sales price is the total amount paid by the buyer, including the item price and any delivery or gift wrapping charges." "Amazon deducts the greater of the applicable referral fee percentage or applicable per-item minimum referral fee." [official] (Selling on Amazon fee schedule, https://sellercentral.amazon.com/help/hub/reference/external/G200336920, version 119, read 2026-10-14)
- **Two kinds of price tier.** The schedule has two kinds of price-dependent rate, and they behave differently when a price moves.
  - *The whole price changes rate at a threshold.* The fee jumps for the whole price when the price crosses the line:
    - Baby Products: "8% for products with a total sales price of $10.00 or less, and 15% for products with a total sales price greater than $10.00".
    - Beauty, Health and Personal Care: the same 8%/15% split at $10.00.
    - Clothing and Accessories: "5% … $15.00 or less", "10% … greater than $15.00 and less than or equal to $20.00", "17% … greater than $20.00".
    - Grocery and Gourmet: 8% at $15.00 or less, 15% above.
    - Lawn Mowers and Snow Throwers: 15% up to $500.00, 8% above.
  - *Marginal rates on portions of the price.* Only the part of the price above the line pays the second rate ("for the portion of the total sales price"):
    - 3D Printers ($200);
    - Compact Appliances ($300);
    - Electronics Accessories ($100);
    - Fine Art (four portions);
    - Furniture ($200);
    - Jewelry ($250);
    - Watches ($1,500).

  Most categories carry a "$0.30" per-item minimum. Pet Products is "15%, except 22% for veterinary diets". [official] (Selling on Amazon fee schedule, G200336920, read 2026-10-14). These figures are for human readers; the rates live on that page and in the fee estimate (section H, Product Fees API), and Amazon changes them by announcement.
- **Refunds.** On a refund Amazon returns the referral fee "minus the applicable refund administration fee, which is the lesser of $5.00 or 20% of the applicable referral fee". [official] (Selling on Amazon fee schedule, G200336920, read 2026-10-14)

**Rules: FBA fulfillment fees by price (US, 2026)**

- **Three price bands.** Standard-size and other rate cards are published in three price columns: "<$10", "$10-$50", ">$50". "Items priced at $10 and $50 will be eligible for $10-$50 rates. Items priced below $10 will be eligible for <$10 rates, and items priced above $50 will be eligible for >$50 rates." For 2026 Amazon said products priced below $10 "will now receive an effective fee discount of $0.86 per unit on average (up from $0.77 previously) compared to standard-size products priced $10 or higher". [official] (2026 US FBA fulfillment fee changes, https://sellercentral.amazon.com/help/hub/reference/external/GABBX6GZPA8MSZGW, version 58, read 2026-10-14)
- **Low-Price FBA is automatic.** "Products priced under $10 will automatically receive Low-Price FBA rates. No action is required." [official] (2026 US Low Price FBA fulfillment fee, https://sellercentral.amazon.com/help/hub/reference/external/GMUTB89XM7AATPR3, read 2026-10-14)
- **Which price sets the band is not stated.** Neither page defines "priced": not as the listing price, the sale price, the price after a coupon, or an average selling price. The product examples on GABBX6GZPA8MSZGW are labelled "ASP: <$10", "ASP: $10 - $50", which suggests an average selling price but does not define it. [seat] Open question 12.
- **Peak and surcharge.** "Starting April 17, 2026, a 3.5% fuel and logistics-related surcharge will be applied to fulfillment fees across Fulfillment by Amazon (FBA) in the US and Canada". Separately, "holiday peak fulfillment fees will apply from October 15, 2026 to January 14, 2027". Fees "are calculated and charged when shipments leave fulfillment centers", so an order placed before October 15 and shipped after pays the peak rate. [official] (FBA fulfillment fee, https://sellercentral.amazon.com/help/hub/reference/external/GPDC3KPYAGDTVDJP; 2026 US FBA fulfillment fee changes, GABBX6GZPA8MSZGW; read 2026-10-14)
- **The 2026 changes.** "Unless otherwise noted, all changes will be effective January 15, 2026". Small standard-size fees for $10–$50 products "will increase by $0.25 per unit", and for products above $50 "by $0.51 per unit", on average. "There will be no new FBA fee types in 2026". It also confirms: "Coupons variable fees will be capped at $2000 per coupon, effective for coupons created on or after November 5, 2025". [official] (2026 US Referral and FBA fee changes summary, https://sellercentral.amazon.com/help/hub/reference/external/G201411300, read 2026-10-14). This settles the coupon cap that section D marked unverified.
- **Coupon fees follow the coupon price.** "Coupon fees are based on the final price after that coupon has been redeemed. Multiple promotion fees (like deals and coupons) are charged separately." "Coupon fees apply to all coupon types (Standard, Subscribe and Save, Reorder and Save)". [official] (Coupon fees, GM2HYLSWFBZ267BB, re-read 2026-10-14). The referral-fee page does not say whether the referral fee is computed before or after a coupon (open question 13).

**Rules: estimating fees before a change (Product Fees API v0)**

- **Three operations.** `getMyFeesEstimateForSKU` and `getMyFeesEstimateForASIN` (rate 1, burst 2) and `getMyFeesEstimates` (rate 0.5, burst 1). Amazon's guide for `getMyFeesEstimates` is titled "Get product fees for a batched set of up to 20 items". Amazon says a developer "can call `getMyFeesEstimateForASIN` for an item on behalf of a selling partner before the selling partner sets the item's price". [official] (productFeesV0.json, commit 030c6de38d of 2025-08-27; Get product fees for a batched set of up to 20 items, https://developer-docs.amazon/sp-api/docs/get-product-fees-batch.md; read 2026-10-14)
- **Inputs.** `MarketplaceId`, `PriceToEstimateFees` (`ListingPrice` required, `Shipping`, `Points`), `IsAmazonFulfilled`, `Identifier`, and `OptionalFulfillmentProgram`:
  - `FBA_CORE` ("the default");
  - `FBA_SNL` (the Small and Light program "sunset in the US and EU regions on **September 26, 2023**");
  - `FBA_EFN` (cross-border European Fulfillment Network fees).

  The model takes no coupon, promotion or business-audience input. [official] (productFeesV0.json, read 2026-10-14)
- **Outputs.**
  - `Status` ("Success, ClientError, ServiceError");
  - `TotalFeesEstimate`;
  - `TimeOfFeesEstimation`;
  - `FeeDetailList` of `FeeType`, `FeeAmount`, `FeePromotion`, `TaxAmount`, `FinalFee`, with nested `IncludedFeeDetailList`;
  - `FeesEstimateIdentifier`, which carries `SellerId`.

  [official] (productFeesV0.json, read 2026-10-14)
- **What the estimate is worth.**
  - "The estimated fees returned by this API are not guaranteed. Actual fees can vary." (Product Fees API)
  - SKU estimates are accurate "based on real item measurements, but only after they've sent their items to Amazon". ASIN estimates "might be different. This is because these estimates use the item's catalog size, which might not always match the actual size of the item sent to Amazon." (productFeesV0.json)
  - Roles: the overview lists a long set of roles ("need at least one", Pricing and Product Listing among them). The tutorials name "the Pricing and Product Listing role".

  [official] (Product Fees API, https://developer-docs.amazon/sp-api/docs/product-fees-api.md, updatedAt 2026-09-09; Get product fee estimates for a specific ASIN, …/get-product-fee-estimates-asin.md; productFeesV0.json; read 2026-10-14)
- **Fee reports and datasets.**
  - `GET_FBA_ESTIMATED_FBA_FEES_TXT_DATA` (FBA Fee Preview). Roles: Pricing or Amazon Fulfillment. It carries `your-price`, `sales-price` ("Your current promotional price"), `product-size-tier`, `estimated-referral-fee-per-unit`, `estimated-fba-fulfillment-fee-per-unit` and `estimated-future-referral-fee-per-unit`. "This report can only be requested once per day per seller", and its data "may be up to 72 hours old".
  - `GET_REFERRAL_FEE_PREVIEW_REPORT`. Role: Finance and Accounting. The help page says it is "based on your current listed item price and does not account for shipping" and "may be up to 72 hours old". The SP-API page says "may be up to 24 hours old". Amazon's two pages disagree.

  [official] (Fulfillment By Amazon Reports, …/report-type-values-fba.md; Inventory Reports, …/report-type-values-inventory.md; Fee Preview report, https://sellercentral.amazon.com/help/hub/reference/external/201115050; How to read a Referral Fee Preview report, …/G201631600; read 2026-10-14). Report options and waits are door.md's.
- **Data Kiosk Economics.** The `analytics_economics_2024_03_15` dataset has three queries.
  - `economicsPreview`: a forward fee preview. The start date must be "not earlier than today" and the end date "no more than 120 days after today". It takes `feeTypes` from `PreviewFeeType`, which includes `REFERRAL_FEES`, `BASE_FBA_FULFILLMENT_FEE`, `FBA_FULFILLMENT_FEES` and `CLOSING_FEES`. It aggregates by MSKU and RANGE.
  - `economics`: history. The start date may be "no more than two years ago", and the WEEK granularity has "Sunday is the first day of the week".
  - `economicsSimulation`: simulates only `AWD` and `SIPP` actions, not a price change.

  Amazon's 2026 fee summary says the "Preview of 2026 fee rates will also be available via the economicsPreview query". The September 30, 2026 release note says the dataset was "Updated … with deal, coupon, removal, disposal, and fuel fees". The schema on GitHub `main` (last commit f525287ce2, 2025-12-22) shows none of those fee types: the model lags the note. [official] (analytics_economics_2024_03_15.graphql; SP-API Release Notes; 2026 US Referral and FBA fee changes summary; read 2026-10-14)

### I. Amazon Business (B2B) pricing (gap fill)

**Rules**

- **Two kinds of business discount.** "Business price: A discounted price available exclusively to Amazon Business customers regardless of the quantity purchased." "Quantity discount: Tiered discounts available exclusively to Amazon Business customers for higher-volume purchases." "These features are available to sellers on the Professional selling plan only." [official] (Business prices and quantity discounts, https://sellercentral.amazon.com/help/hub/reference/external/G201740300, read 2026-10-14)
- **Business price may not exceed the standard price.**
  - "Your business price cannot be higher than your standard price. If you submit a business price that's higher than your standard price, your standard price is shown to business customers."
  - "Business prices function as the base price on which promotions are calculated … This isn't the case for deals or sale prices, which are distinct prices and separate from your business price."
  - A business-only offer "has a business price and no standard price".
  - Percent quantity tiers are "a percentage off your business price"; the fixed model is "a fixed price per unit at different quantity tiers. It is not a fixed discount amount off the price."

  [official] (Business pricing and quantity discounts FAQ, https://sellercentral.amazon.com/help/hub/reference/external/G201824530; Business-Only Offers, …/G201740310; read 2026-10-14). Pricing Health lists "Your business price is greater than your offer price" as an error, and it also errors on a business price outside the seller's min/max. [official] (Pricing Health warning and error messages, GM665AS5HYKFJB8Z, re-read 2026-10-14)
- **Business strike-through.** "A reference price on the Amazon Business (B2B) store is the same as the reference price on the Amazon (B2C) store." "Amazon's was-price computation doesn't include B2B sales."
  - Single-unit business savings display "only when a validated list price or was/typical price exists", and the business price "must also offer a minimum savings of 2% against the validated reference price".
  - For quantity discounts with no validated reference price, "savings are calculated against the single-unit business price".
  - "Setting 2% business discounts … doesn't guarantee that your offers will show … savings."

  [official] (Reference pricing for business discounts and business savings, https://sellercentral.amazon.com/help/hub/reference/external/GNCA9MVMUDJM6PGA, read 2026-10-14)
- **Fee effect of business discounts.**
  - A business price or quantity discount of "3% or greater discount off the standard price" that applies "to the quantity ordered" earns a per-unit FBA fulfillment fee discount on business orders.
  - The discount is for small-standard and large-standard size tiers only, in quantity bands "2 to 4", "5 to 9", "10 to 24", "25+".
  - Referral fees on business orders "follow the Selling on Amazon fee schedule", but "Sellers can qualify for reduced referral fees on high value business orders" (Amazon Business bulk order fee discount).

  [official] (Amazon Business FBA multi-unit fulfillment fee discount, https://sellercentral.amazon.com/help/hub/reference/external/GMZ5WFTZHCM4Q4C5; Selling on Amazon Business fee schedule, …/G201762480; read 2026-10-14). The bulk-order referral discount page itself (GQBCQZZKZQ94LL55) returned HTTP 400 from the content service: unreachable, so its thresholds are not recorded here.
- **Automated business pricing.** A Business Price and Quantity Discount rule keeps the business price a set percentage below the standard price. Quantity tiers are capped: "You can add up to five quantity tiers." The rule's tier percentage also sets each tier's minimum price. A pre-created "Business Catalog rule" can reprice the whole catalogue. [official] (Create a business pricing rule, https://sellercentral.amazon.com/help/hub/reference/external/GD29LN5JBS94EL4L, read 2026-10-14)
- **Writing business prices through the API.**
  - `purchasable_offer` carries one offer per `audience` (`ALL`, `B2B`, and in the US the Industry Vertical Pricing audiences such as `B2B_EDUCATION`).
  - The audiences available to a seller come from `getDefinitionsProductType` "Include the `sellerId` parameter". Amazon gives an example: "`quantity_discount_plan` information is supported for Amazon Business offers, but is not supported for other offer types".
  - A PATCH updates "only the offer record that matches the specified `audience`, `currency`, and `marketplace_id`".
  - `includedData=offers` returns the single-unit price per audience; quantity plans come back only with `includedData=attributes`.
  - "IVP audiences are currently available in the Amazon US store only". IVP pricing rules set in Seller Central's Custom Pricing "take priority over IVP offers submitted through the Listings API".
  - The guide's B2B example is introduced as "percent-based quantity discounts" but its JSON uses `"discount_type":"fixed"`: Amazon's page contradicts itself.

  [official] (Manage Amazon Haul, Advanced Multiple-Offer, and Multiple-Fulfillment Use Cases, https://developer-docs.amazon/sp-api/docs/manage-amazon-haul-advanced-multiple-offer-multiple-fulfillment-use-cases.md, updatedAt 2026-09-09; SP-API Release Notes, May 27, 2026 and September 11, 2024; read 2026-10-14)
- **`merge` exists.** The Listings Items API gained "the JSON Patch `merge` operation", which can be used "to delete the `quantity_discount_plan` from `purchasable_offer` for B2B offers". [official] (SP-API Release Notes, May 28, 2025, read 2026-10-14)
- **Reading the business offer and its featured offer.**
  - v0 `getPricing` takes `OfferType` `B2C`/`B2B`. `getItemOffers`, `getListingOffers` and `getCompetitivePricing` take `CustomerType` `Consumer`/`Business`.
  - The v0 offer type carries `businessPrice` and `quantityDiscountPrices` (`quantityTier`, `QUANTITY_DISCOUNT`).
  - In v2022-05-01, `getCompetitiveSummary`'s `LowestPricedOffersInput.offerType` enum has only `Consumer`, and `FeaturedBuyingOption.buyingOptionType` "currently supports `NEW`". The B2B featured offer is therefore readable only through v0 with `CustomerType=Business`.

  [official] (productPricingV0.json; productPricing_2022-05-01.json; read 2026-10-14)
- **`B2B_ANY_OFFER_CHANGED`.**
  - It is "sent whenever there is a change in any of the top 20 B2B offers for Amazon Business, in the form of any price change (for single-unit and seven pre-defined quantity discount tiers: 2, 3, 5, 10, 20, 30, and 50)".
  - The top 20 "are determined by the single-unit landed price".
  - It is sent only for items where the seller has active offers, and it supports `filterExpression`.
  - Its payload carries `IsBuyBoxWinner`, `IsFeaturedMerchant`, `BuyBoxPrices` and `QuantityDiscountPrice`.

  [official] (Notification Type Values, …/notification-type-values.md, read 2026-10-14). Like the other notifications it needs a subscription and a queue destination.

**Guidance**

- **Amazon's Selling Partner Blog on B2B prices** (Amazon's own blog; Mickey Toogood, April 15, 2025):
  - Business prices "may take up to 15 minutes to appear to Amazon Business customers".
  - "Compare your business price with competitors, including the Business Savings Blue Badge price and B2B Featured Offer price."
  - The Blue Badge needs "at least a 5% discount off standard price" for a single-unit business price, "at least a 3% discount on the first tier" for quantity discounts, and "at least a 4-star rating".
  - "A percentage off applies to the deal price, not a standard price, during the deal window" for business prices managed by Automate Pricing.
  - It claims, from Amazon data, that in 2024 "products with business prices saw an average 10% sales lift and 11% more units sold".

  [official] (How to set B2B prices and quantity discounts with Amazon, https://sell.amazon.com/blog/amazon-b2b-prices, read 2026-10-14). The lift figure is Amazon's marketing claim with no method stated; it is not a figure for a skill.

### J. Subscribe & Save: what shows and what the Replenishment API reads (gap fill)

**Rules**

- **Tiers (settles open question 11).** "You can choose from five base funding tiers for your enrolled products: 0%, 5%, 10%, 15%, or 20%. Customers receive up to your selected base discount on every delivery, with an additional 5% funded by us when customers order five or more enrolled products to arrive together."
  - Eligible products "will be automatically enrolled … at the default enrollment discount that you've selected on Manage Products (0% by default)".
  - "Seller coupons and promotional discounts are added to Subscribe & Save discounts."
  - Product eligibility includes "buyable for at least 85% of the past 30 days".
  - Deliveries may pause when "There is a lower-priced offer available for the ASIN".
  - Subscribe & Save coupons "are redeemable on first delivery of a new subscription".

  [official] (Subscribe & Save, https://sellercentral.amazon.com/help/hub/reference/external/G201620110, version 29, re-read 2026-10-14). The sell.amazon.com page's "5% or 10%" is a summary, not the full tier list.
- **How the S&S price displays.** "The One-Time Price refers to the current Featured Offer price for a one-time purchase of the item. You may see it displayed as a strike-through price for Subscribe & Save offers. If a Subscribe & Save discount is available, that will be based on the One-Time price for the same item from the same seller." [official] (Strike-Through Pricing and Savings - Amazon Customer Service, https://www.amazon.com/gp/help/customer/display.html?nodeId=GQ6B6RH72AX8D2TD, re-read 2026-10-14). S&S promotions are excluded from Typical Price. [official] (Reference pricing and promotions FAQ, GFQCDTDE2HV9NMVV)
- **Replenishment API v2022-11-07.** It was launched June 21, 2023 and "returns a selling partner's replenishment program (Subscribe & Save) metrics and offer information". It has three POST operations, each rate 1, burst 1.
  - **`listOffers`.**
    - Filters: `marketplaceId` and `programTypes` are required; `skus` and `asins` take up to 20 each.
    - Each offer carries `eligibility`:
      - `ELIGIBLE`;
      - `INELIGIBLE`: "existing subscriptions will be cancelled";
      - `SUSPENDED`;
      - `REPLENISHMENT_ONLY_ORDERING`: this "also blocks one-time purchases".
    - It also carries `offerProgramConfiguration.promotions` (`sellingPartnerFundedBaseDiscount`, `sellingPartnerFundedTieredDiscount`, `amazonFundedBaseDiscount`, `amazonFundedTieredDiscount`), `enrollmentMethod` (`MANUAL`/`AUTOMATIC`), `autoEnrollment` (`OPTED_IN`/`OPTED_OUT`), `price` ("the listed price amount for the item"), `inventory`, `stockRisk` and `subscriptions`.
  - **`listOfferMetrics` and `getSellingPartnerMetrics`.** Metrics include:
    - `SHIPPED_SUBSCRIPTION_UNITS`, `ACTIVE_SUBSCRIPTIONS`;
    - `SUBSCRIBER_RETENTION` ("retained after 30 and 90 days");
    - `REVENUE_PENETRATION_BY_SELLER_FUNDING`, `SIGNUP_CONVERSION_BY_SELLER_FUNDING`;
    - `SHARE_OF_COUPON_SUBSCRIPTIONS`, `LOST_REVENUE_DUE_TO_OOS`.
  - **Time windows.**
    - "only data for the trailing 2 years is supported"
    - DAY aggregation "cannot exceed 31 days".
    - WEEK is "ISO Calendar Week", computed "from the first day of the week (Monday, based on ISO 8601)".
  - **Stores.** "US, CA, ES, UK, FR, IT, IN, DE, and JP" for sellers.

  [official] (replenishment-2022-11-07.json, last commit 4ab02a8675 of 2026-05-27; SP-API Release Notes, June 21, 2023, December 18, 2024, December 22, 2025, April 1, 2026, May 27, 2026; read 2026-10-14)

### K. List Price as a write attribute, sale price, and the EU rules (gap fill)

**Rules**

- **Where `list_price` lives.** Amazon's listings guide shows `list_price` in the product type schema's `offer` property group, as a top-level attribute `[{ "currency", "value", "marketplace_id" }]` ([official] Manage Product Listings with the Selling Partner API, https://developer-docs.amazon/sp-api/docs/manage-product-listings-guide.md). Amazon's XML-to-JSON mapping instead maps `MSRPWithTax` to `/attributes/purchasable_offer/0/list_price/0/schedule/0/value_with_tax` ([official] Mapping product attributes to the Listings Items API and JSON-based feeds, …/mapping-product-attributes.md). The Manage purchasable offer table does not list `list_price` among `purchasable_offer`'s sub-attributes. Amazon's pages disagree on the path; the seller's product-type schema decides (read 2026-10-14).
- **How a list price is supplied and when it shows.** In Seller Central the field is "List price" ("naming and order varies across stores and categories"); in templates it is "the list price field labeled list_price". "Changes typically reflect within a few hours". A value of 0 means no list price. Validation through Amazon sales needs "both sales at the list price, and the list price should match the Featured Offer price for a meaningful number of days in the last 90 days". [official] (Show a reference price on your products by providing a list price, G27XM55CQM3SBMD2, re-read 2026-10-14). This re-read confirms section C's 90-day, 9-day and peak-exclusion details, which the verifier had left unverified.
- **Sale price.** The sale price is `purchasable_offer.discounted_price` with `start_at`/`end_at` (XML `Sale/SalePrice`).
  - Coupon validation reads the live sale price: "If the ASIN has Sale Price live, change Sale Price under the Offer tab." [official] (Understanding coupon errors, GLBL4T5C9UAB9T5P, re-read 2026-10-14)
  - US Typical Price from May 18, 2026: "price discounts that are not advertised to customers as promotions are treated as non-promotional sales and are included in Typical Price". [official] (Reference pricing and promotions FAQ, GFQCDTDE2HV9NMVV, re-read)
  - [seat] A plain sale price probably counts as such a discount, so a long sale can pull the Typical Price down; no Amazon page read says so for `discounted_price` by name.
- **US customer display (re-read, confirms section C).** A List Price shows only if bought or offered at or above it "in the past 90 days for non-seasonal products … and in the past 180 days for seasonal products". "Lowest Price in XX Days means that the current price is lower than, or equal to, the lowest featured offer price for this item sold on Amazon in the past XX days (e.g. 30 days)." The Typical Price excludes promotional prices and "prices paid in the Amazon Haul or Amazon Now store". [official] (Strike-Through Pricing and Savings, GQ6B6RH72AX8D2TD, re-read 2026-10-14)
- **US price-discount floors (re-read).** Price discounts need "at least a three-star rating" and "At least 5% off the 30-day lowest non-promotional price bought by customers, including across all sellers". [official] (Price discounts, US, G7F8CQ4EJ5YA4272, re-read 2026-10-14)
- **EU stores differ.** These pages were read through `sellercentral.amazon.de`'s content service with locale en_GB.
  - **Reference prices.** The EU policy names a "Recommended retail price (RRP)", which "must represent the price applied by you or other retailers or sellers outside of short-term discounts". On duration: "Your discounts must respect any legal minimum and maximum durations. For some of our European stores, this is a maximum of 30 calendar days." [official] (Amazon policy on reference prices, EU version, https://sellercentral.amazon.de/help/hub/reference/external/G202170370, version 19, read 2026-10-14)
  - **Was Price.** It is "known as Typical Price, Median Price, and Previous Price in some stores". It excludes "Buy X, Get Y promotions, Subscribe and Save promotions, deals, and coupons". "Price discounts that receive merchandizing such as Deal badges … are considered promotional." The EU FAQ does not carry the US "more than half of the 90-day period" rule; it says only that a long-running promotion can become the Was Price. [official] (Reference pricing and promotions FAQ, EU version, https://sellercentral.amazon.de/help/hub/reference/external/GFQCDTDE2HV9NMVV, version 10, read 2026-10-14)
  - **Price discounts.** Products need "at least a 3.5-star rating" (US: three-star). Prime-exclusive discounts need "at least 5% off the lowest price excluding promotions in the last 30 days in the UK, Germany, and the Netherlands" and "at least 2.5% off the lowest price in the last 30 days in France, Spain, Belgium, Poland, and Italy and 5% off in Sweden". Non-Prime discounts need "at least 5% off the lowest price excluding promotions in the last 30 days". [official] (Price discounts, EU version, https://sellercentral.amazon.de/help/hub/reference/external/G7F8CQ4EJ5YA4272, version 8, read 2026-10-14)
  - **What could not be read.** The EU customer-facing strike-through pages (amazon.de, amazon.co.uk, amazon.fr with node GQ6B6RH72AX8D2TD) returned 403/503. The EU legal text behind the 30-day prior-price rule (EUR-Lex, Directive (EU) 2019/2161) returned an empty JavaScript-challenge page. How EU detail pages label the prior price is therefore not recorded (open question 15).

### L. Corrections and confirmations to sections A–G from the gap fill

- **Deals have two rating floors.** The seller needs "an overall rating of at least 3.5 stars", and the product needs "at least a 4-star rating". [official] (Amazon deals, G202111490 v25, re-read 2026-10-14; capture `G202111490-v25`). Section D first gave only the product floor; both floors are now in section D.
- **Coupon star floors.** Re-read: the eligibility page says "at least a 3.5 Seller feedback rating" for the seller, and 2.5 stars (1–4 reviews) or 3 stars (5+) for the product. The errors page says "a minimum star rating of 1 for products with one to four reviews and 3 for products with five or more reviews". The disagreement stands (open question 5). [official] (Coupon eligibility criteria, GJHCPEFJ5JJQD52D; Understanding coupon errors, GLBL4T5C9UAB9T5P; both re-read 2026-10-14)
- **Report roles.** `GET_PROMOTION_PERFORMANCE_REPORT` is available to "Sellers who have the Selling Partner Insights Selling Partner API role". `GET_COUPON_PERFORMANCE_REPORT` needs Brand Analytics. [official] (Performance Reports, re-read 2026-10-14). Now also stated in section G.
- **Two Featured Offer percentages with different denominators.** Business Reports' Featured Offer percentage is "the total number of page views in which your offer is featured divided by the total number of page views". Data Kiosk's `featureOfferPct` divides "by the number of times customers viewed it (that is, Glance Views)". These are two of Amazon's own definitions; they are not interchangeable. [official] (Becoming the Featured Offer, G201687550 v20, re-read; capture `G201687550-v20`; analytics_sellerAnalytics_2025_03_31.graphql; read 2026-10-14). angles/own-traffic-funnel.md and method/funnel-and-search.md (E2) record the same two denominators, and method/effect-measurement.md, whose first pass used the two as one "featured-offer share", now separates them (P-effect-measurement-44).
- **FOEP is not available in JP.** `getFeaturedOfferExpectedPriceBatch` "is now available in all Amazon stores except Japan (JP)". [official] (SP-API Release Notes, June 19, 2024, read 2026-10-14)

## What practitioners add

- **Sellers still told they need eligibility.** Jungle Scout tells sellers "Individual sellers are not eligible for the Buy Box". It lists suspected factors in order of importance: condition, price, Prime status, inventory, feedback, and says "Amazon gives priority to its Prime sellers". For a product meant to sell higher later, it advises Amazon's coupons and promotions instead of lowering the listed price, so as not to lose one's own Buy Box. [opinion] Brian Connolly, Jungle Scout, "Amazon Buy Box: What Is It & How to Win in 2024 (Step-by-Step Guide)", 2024-02-14. **Disagrees with Amazon** on Prime: Amazon says Prime eligibility is not considered "if all other factors are equal". Superseded on eligibility by Amazon's September 2026 change.
- **Practitioner factor lists.** eComEngine's factors include "Keyword-optimized title and description", feedback rating and response time. It says "The lowest offer doesn't necessarily win the Buy Box". It says rotation happens when sellers are similar, and that lower prices elsewhere can suppress the offer. [opinion] eComEngine (quoting Jay Lagarde, Liz Adamson, James Thomson, Colleen Quattlebaum), "How to Get the Buy Box on Amazon - Secrets Sellers Should Know", undated. **Disagrees with Amazon** on title/description and seller feedback: Amazon names neither and excludes seller star ratings. Agrees on rotation and external price.
- **Still on old eligibility, a month after the change.** SellerApp, as late as October 2026, says the Buy Box requires a Professional account and "at least 2 to 6 months" of trading, checked in a "Buy Box eligible" column. [opinion] Ankitha Nagaraj, SellerApp, "The Amazon Buy Box – Your Most Powerful Holiday Season Power Up", 2026-10-01. **Contradicted** by Amazon's September 2026 removal of seller eligibility.
- **Unsourced coupon figures.** SellerApp gives coupon figures, including "typically boost conversion 10-20%" and CTR +10–22% from the badge, and "67% of new Amazon coupon codes face suppression initially", nearly all without a source. It states a discount range of 5–80% and deal fees of $300/$1,000 (Best Deals) and $150/$500 (Lightning). [opinion] Brij Purohit, SellerApp, "Mastering Amazon Coupons in 2026 (The Complete Seller Strategy Guide)", 2026-09-29. **Disagrees with Amazon**: Amazon's coupon page says 5–50%, and its deal-fee page says $70/day + 1% non-peak, $100 + 1.5% peak. Its coupon fee ($5 + 2.5%) agrees with Amazon. The CTR and conversion figures have no source this seat could check; cx's day-2 "CTR +10–15%" is the same unsourced kind of figure.
- **Old deal rules.** Helium 10 says a Lightning Deal "will cost you $150". It says it needs "Prime-eligible in all regions" and three stars, and the same ASIN cannot run another Lightning Deal within seven days. [opinion] Helium 10 Team, "How to Use Amazon Lightning Deals: More Than Just a Quick Buck", published 2020-12-29, modified 2023-11-21. **Out of date against Amazon**: Amazon now says 4-star, invite-only, $70/day. The page does not cover post-deal organic rank, so the common claim that a deal lifts rank afterward was not sourced here.
- **The Buy Box that matters.** On a single-brand listing the contest that matters is "which product is the number #1 search result", not which seller holds the Buy Box. Rotation among same-priced sellers under MAP adds no value. [opinion] Juozas Kaziukėnas, Marketplace Pulse, "Et tu, Amazon Buy Box?", 2018-07-18. This bears on brand-owned listings, the playbook's main case: there price position against *competing products* drives click-through more than featured-offer rotation does.
- **Price as demand.** Amazon's CEO Andy Jassy said customers "continue to trade down on price when they can". Amazon cut apparel referral fees under $20 and said this "has spurred substantial year-over-year unit growth in apparel". [opinion] Juozas Kaziukėnas, Marketplace Pulse, "Competition Made Amazon a Better Deal", 2024-08-02 (quotes Amazon's Q2 2024 earnings call).
- **Fee thresholds as a lever (gap fill).** On re-reading for fees, the same article puts the apparel cut in figures: "In January, seller fees on clothing cheaper than $15 dropped from 17% to 5%" and "for items priced from $15 to $20 dropped to 10%". It reads the cuts as "a reaction to growing competition from Shein and Temu", and adds that this is "not translating into lower fees for sellers" overall. It quotes Jassy: "There are a lot of lower price items that we don't stock because they're not economic to stock". [opinion] Juozas Kaziukėnas, Marketplace Pulse, "Competition Made Amazon a Better Deal", 2024-08-02, re-read 2026-10-14. It does not discuss pricing to sit under a threshold.
- **Practitioner fee guides lag the schedule (gap fill).** Jungle Scout's fee guide reproduces the threshold tiers (Baby and Beauty at $10.00, Grocery at $15.00) and the January 15, 2024 apparel change. Its FBA rate tables are images, and it has nothing on Low-Price FBA or on how coupons affect fees. [opinion] Brian Connolly, Jungle Scout, "Amazon FBA Fees: How Much Does it Cost to Sell on Amazon in 2024?", 2024-09-30. **Out of date against Amazon**: it predates the 2026 three-band FBA rate card and the 2026 peak and surcharge. No practitioner page read in this session advises on pricing at or just under a fee threshold. The seat's search budget ran out before more practitioner pages could be found (see Open questions).

## Published research

- [research] Le Chen, Alan Mislove, Christo Wilson, "An Empirical Analysis of Algorithmic Pricing on Amazon Marketplace", Proceedings of WWW 2016, pp. 1339–1349.
  - Four months, 1,641 best-seller products, 543 sellers detected as using algorithmic pricing.
  - "low prices are the most important feature used by the Buy Box algorithm … but … customer feedback and ratings are also used".
  - Algorithmic sellers win the Buy Box more often "even when they do not offer the lowest price".
  - Prices and the Buy Box are "significantly more volatile" on products with algorithmic sellers.

  **Transfer:** about multi-seller listings in 2014–2015. Amazon's 2026 page denies that seller star ratings are used. Read it as evidence that price leads and repricers make the Buy Box volatile, not as today's factor list.
- [research] Dhruv Grewal, Kent B. Monroe, R. Krishnan, "The Effects of Price-Comparison Advertising on Buyers' Perceptions of Acquisition Value, Transaction Value, and Behavioral Intentions", Journal of Marketing 62(2):46–59, 1998. The paper exists as cited (Crossref DOI 10.2307/1252160). The finding the original seat stated — two experiments; internal reference prices moved "by both advertised selling and reference prices"; selling price acting on acquisition value through transaction value — could not be re-read: Crossref carries no abstract and JSTOR was not opened (unverified). **Transfer:** lab advertising, not Amazon. It supports the mechanism by which a strike-through changes behaviour, not its size on Amazon.
- [research] Gurumurthy Kalyanaram, Russell S. Winer, "Empirical Generalizations from Reference Price Research", Marketing Science 14(3 suppl.):G161–G169, 1995. Three generalizations:
  1. Consumers use reference prices in brand choice.
  2. Past prices form the reference price.
  3. Consumers are more sensitive to "losses" (prices above reference) than "gains".

  **Transfer:** scanner-panel grocery data. It suggests why a price raised after a coupon or deal can depress conversion beyond its arithmetic.
- [research] Tridib Mazumdar, S.P. Raj, Indrajit Sinha, "Reference Price Research: Review and Propositions", Journal of Marketing 69(4):84–102, 2005. A review of how reference prices form, are retrieved and affect decisions, including "promotional environment" as a moderator. **Transfer:** framework only; no Amazon estimate.
- [research] Glenn Ellison, Sara Fisher Ellison, "Search, Obfuscation, and Price Elasticities on the Internet", NBER Working Paper 10570, 2004 (Econometrica 77(2):427–452, 2009). Where a price search engine dominates, "easy price search makes demand tremendously price-sensitive". Retailers respond with obfuscation that lowers that sensitivity. **Transfer:** a price-comparison site for computer parts. It suggests price sensitivity is highest where products are shown side by side, as in Amazon search results, and lower once the customer is on a single detail page.
- [research] Chiara Farronato, Andrey Fradkin, Alexander MacKay, "Self-Preferencing at Amazon: Evidence from Search Rankings", AEA Papers and Proceedings 113:239–243, 2023. Amazon-branded products rank higher than "observably similar products"; their prominence is "30 percent to 60 percent of the prominence granted to sponsored products". **Transfer:** a reminder that rank is not a function of price and content alone. It is a confounder no seller controls.
- [research] Ron Kohavi, Roger Longbotham, Dan Sommerfield, Randal M. Henne, "Controlled experiments on the web: survey and practical guide", Data Mining and Knowledge Discovery 18(1):140–181, 2009. "Controlled experiments neutralize confounding variables by distributing them equally … through random assignment". Correlational patterns cannot separate cause from leak. **Transfer:** effect-review's before/after with a competitor control is not randomized. A price change in either window is exactly the kind of confounder randomization would remove, and here nothing removes it.
- [research] Manoj Thomas, Vicki Morwitz, "Penny Wise and Pound Foolish: The Left-Digit Effect in Price Cognition", Journal of Consumer Research 32(1):54–64, 2005 (DOI 10.1086/429600; abstract read on the publisher's page through a summarising fetch, not verbatim).
  - Five experiments.
  - A price ending in 9 is judged lower than a price one cent higher only when the leftmost digit changes (e.g. $2.99 against $3.00).
  - The effect depends on the comparison context.

  **Transfer:** lab judgements, not Amazon sales. It bears on the US $10.00 lines: the Low-Price FBA band and the Beauty and Baby referral threshold. A $9.99 price sits under both the left-digit line and the fee lines. Whether the left-digit effect moves Amazon conversion is not measured here.
- [research] Eric T. Anderson, Duncan I. Simester, "Effects of $9 Price Endings on Retail Sales: Evidence from Field Experiments", Quantitative Marketing and Economics 1(1):93–110, 2003. Bibliographic data only (Crossref, Semantic Scholar: abstract elided by the publisher); finding not read, not used.

## Stable enough for a skill

- **What wins.** Amazon ranks offers for the featured offer by total price (item plus shipping), delivery promise, free shipping, free returns and seller performance. It does not use seller star ratings, and it does not favour Prime or FBA when everything else is equal. (Becoming the Featured Offer)
- **Who is evaluated.** Amazon is removing the seller-level eligibility gate store by store, on the schedule its News announcement gives; where it is gone every seller's offer is evaluated. Which regime a store is in is read from that store's own Becoming the Featured Offer page, not from a remembered date. An offer that is out of stock, not shippable to the customer, or priced uncompetitively is not featured. Amazon may feature no offer at all. (Featured Offer eligibility; Becoming the Featured Offer; Updates to Featured Offer eligibility requirements)
- **Per variation, per customer.** The featured offer is decided per variation and can differ by customer location and Prime membership. (Becoming the Featured Offer; getCompetitiveSummary model)
- **Ineligible versus deactivated.** An offer priced above the competitive external price, or far above recent prices, can be ineligible to be featured while staying live. An offer with a suspected pricing error, for example outside its own min/max, is deactivated. (Pricing Health; Pricing Health warning and error messages)
- **Promotions need the featured offer.** Coupons and promotional messaging do not show on the detail page unless the seller's offer is the featured offer. Running a deal does not make it so. (Amazon promotions; Create a coupon; Troubleshoot suppressed and active deals)
- **Strike-throughs are Amazon's.** Amazon shows a List Price strike-through only after validating it against sales and featured-offer history or other retailers. It computes the Typical/Was Price itself. Both can change without notice. (Show a reference price…; Reference pricing and promotions FAQ; Strike-Through Pricing and Savings)
- **Discounts are measured from the reference price.** Coupons, deals and Prime-exclusive or peak-event price discounts require a minimum discount from a validated reference price. Without one they are suppressed or show no savings. (Reference pricing and promotions FAQ; Understanding coupon errors; Troubleshoot price discounts)
- **Peak events are excluded.** Amazon excludes peak-event sales from Typical Price and excludes the run-up to peak events from list-price validation. (Reference pricing and promotions FAQ; Show a reference price…)
- **The price attribute.** A seller's price lives in `purchasable_offer`. A write is validated against the product-type schema. `VALIDATION_PREVIEW` returns pricing issues without changing anything. A `WARNING` there does not block the write but means the offer may not be featured. (Manage purchasable offer; Manage Listings Issues)
- **FOEP is an estimate.** It is computed before promotions and is not a guarantee, and its status list is open ("Additional values might be added in the future"). (getFeaturedOfferExpectedPriceBatch model; Return a batch of FOEP data…)
- **No promotion writes through the API.** Coupons, deals and price discounts are created in Seller Central; the Promotions API reads them. (Promotions API; promotions model)
- **Fees step with price.** Referral fees in some categories change rate for the whole price at a price threshold; in others only the portion above a threshold pays the second rate. FBA fulfillment fees in the US have price bands. The rates and lines live on the store's fee schedule and FBA fee pages, and in the fee estimate. (Selling on Amazon fee schedule; 2026 US FBA fulfillment fee changes; 2026 US Low Price FBA fulfillment fee)
- **Referral fee base.** The referral fee is charged on the total sales price, including delivery and gift wrap, excluding tax, with a per-item minimum in most categories. (Selling on Amazon fee schedule)
- **Fees change by season and announcement.** FBA fees have a holiday peak rate card and surcharges announced during the year. Fees are charged when the shipment leaves the fulfillment center. (FBA fulfillment fee; 2026 US FBA fulfillment fee changes)
- **Fee estimates.** The Product Fees API estimates fees for a proposed price before it is set. The estimate is not guaranteed. An ASIN estimate uses the catalog size, and a SKU estimate uses measured size once the item is at Amazon. (productFeesV0.json; Product Fees API)
- **Business price.** Amazon Business offers are separate `purchasable_offer` entries keyed by `audience`. A business price may not exceed the standard price; if it does, business customers see the standard price and Pricing Health shows an error. Business strike-through savings need a validated reference price. (Business pricing and quantity discounts FAQ; Pricing Health warning and error messages; Reference pricing for business discounts and business savings; Manage Amazon Haul, Advanced Multiple-Offer, and Multiple-Fulfillment Use Cases)
- **The B2B featured offer.** It is read through Product Pricing v0 with the business customer type, not through `getCompetitiveSummary`. (productPricingV0.json; productPricing_2022-05-01.json)
- **Subscribe & Save.** The S&S discount is computed from the seller's one-time price for the same item. Coupons and promotions add to it. S&S deliveries can pause when a lower-priced offer exists. (Strike-Through Pricing and Savings; Subscribe & Save)
- **List price.** A list price is a seller input that Amazon shows only after validating it. Where `list_price` sits in a write is set by the product-type schema. (Show a reference price…; Manage Product Listings with the Selling Partner API; Mapping product attributes…)
- **EU discounts.** EU stores measure promotional discounts against a recent lowest price, and some cap a discount's duration. The window, the thresholds and the caps differ by store and are read from that store's own pages. (Price discounts, EU version; Amazon policy on reference prices, EU version)

## What cx must read at run time

- **Own price as submitted.** `getListingsItem` with `includedData=attributes,offers,issues`. `attributes.purchasable_offer` gives `our_price`, `discounted_price` with its schedule, and min/max. `offers[]` gives the price Amazon holds per audience. `issues` gives `INVALID_PRICE` and enforcement codes. Own price by SKU is also in `getPricing` (v0).
- **What a price write must look like.** `getDefinitionsProductType` for the SKU's product type: the `purchasable_offer` and `list_price` structure, and the seller's own pricing-rule ids in `automated_pricing_merchandising_rule_plan`. Then `patchListingsItem` with `mode=VALIDATION_PREVIEW` for a handful of SKUs, reading `status` and `issues`.
- **Featured offer and the price to win it.** `getFeaturedOfferExpectedPriceBatch`: `resultStatus`, `featuredOfferExpectedPrice.listingPrice`, `currentFeaturedOffer`, `competingFeaturedOffer`.
- **Competitive context.** `getCompetitiveSummary` with `featuredBuyingOptions`, `referencePrices` (`CompetitivePrice`, `WasPrice`), `lowestPricedOffers` with each offer's `promotions`, and `similarItems`. `getItemOffers` (v0) for `BuyBoxPrices`, `IsBuyBoxWinner`, `SuggestedLowerPricePlusShipping`.
- **Featured-offer share and price at the search stage.** Report names, options and waits are door.md's. Operations: `createReport` / `getReport` / `getReportDocument` for:
  - `GET_SALES_AND_TRAFFIC_REPORT` (`buyBoxPercentage`, `averageSellingPrice`);
  - the Search Query Performance report (`asinMedianClickPrice` against `totalMedianClickPrice`, and the cart and purchase pairs);
  - `GET_COUPON_PERFORMANCE_REPORT`;
  - `GET_PROMOTION_PERFORMANCE_REPORT`.

  Data Kiosk `createQuery` on the Seller Analytics dataset gives `featureOfferPct`, the `promotion` group, and search `priceAndCountMetrics`.
- **Own promotions.** `searchPromotions`, `getPromotion`, `getSelection`: what is running, its status and validation issues. Subscribe & Save offers come from the Replenishment API (`listOffers`, `listOfferMetrics`).
- **Keepa, for the competitor set and history.** Field meanings and units are the Keepa skill's `references/product-file.md`.
  - `csv[18]` Buy Box price with shipping; `csv[0]`, `csv[1]`, `csv[10]`, `csv[7]` Amazon, new, FBA and FBM prices; `csv[4]` list price; `csv[8]` Lightning Deal.
  - `stats.buyBoxPrice` / `buyBoxShipping` / `buyBoxSellerId` / `buyBoxIsUnqualified` / `buyBoxIsPrimeExclusive`.
  - `stats.buyBoxStats` (per-seller "approximation of the percentage the seller won the buy box").
  - `stats.buyBoxSavingBasis`, `buyBoxSavingBasisType` (`LIST_PRICE` or `WAS_PRICE`) and `buyBoxSavingPercentage` (the strike-through as shown).
  - `coupon` and `couponHistory` (tracked since June 15, 2024); `deals[]`; `stats.lightningDealInfo`; `promotions[]` (Amazon US promotions by Amazon only).
  - `competitivePriceThreshold` and `suggestedLowerPrice` (when the Buy Box is suppressed).
  - `buyBoxEligibleOfferCounts`; `buyBoxSellerIdHistory` (`-1` none qualified, `-2` unknown seller).

  The typed path requests `offers=20`, `buybox=1` and `stats=90` (Keepa SKILL.md).
- **Events.** `PRICING_HEALTH` and `ANY_OFFER_CHANGED` need a subscription and a queue the box does not have today. Until then cx learns of a disqualification by polling `getListingsItem` issues and the FOEP `resultStatus`.
- **Fee delta of a proposed price or coupon (gap fill).**
  - `getMyFeesEstimateForSKU` (preferred once the item is at Amazon), `getMyFeesEstimateForASIN`, or `getMyFeesEstimates` (batch).
  - Call it with `PriceToEstimateFees.ListingPrice` and `Shipping` at the current price, at the proposed price, and at a coupon's net price, with `IsAmazonFulfilled` set to match the offer.
  - Read `TotalFeesEstimate`, each `FeeDetailList[].FeeType`/`FinalFee`, `TimeOfFeesEstimation` and `Status`.
  - Fee lines and rates are never stated from memory.
- **Fees in bulk and ahead of a rate change.** Report names, options and waits are door.md's. Operations: `createReport` / `getReport` / `getReportDocument`.
  - `GET_FBA_ESTIMATED_FBA_FEES_TXT_DATA` (`your-price`, `sales-price`, `product-size-tier`, `estimated-referral-fee-per-unit`, `estimated-fba-fulfillment-fee-per-unit`, `estimated-future-referral-fee-per-unit`).
  - `GET_REFERRAL_FEE_PREVIEW_REPORT`.
  - Data Kiosk `createQuery` on `analytics_economics_2024_03_15`: `economicsPreview` for fees up to 120 days ahead (`REFERRAL_FEES`, `FBA_FULFILLMENT_FEES`), and `economics` for the fees actually charged in a window.
- **Business offer (gap fill).**
  - `getListingsItem` `includedData=attributes` gives `purchasable_offer` entries with `audience` `B2B` (and IVP audiences) and their `quantity_discount_plan`; `includedData=offers` gives only single-unit prices.
  - `getDefinitionsProductType` with `sellerId` gives the audiences the seller may write and whether `quantity_discount_plan` is allowed.
  - v0 `getPricing` with `OfferType=B2B`, and `getItemOffers` with `CustomerType=Business`, give the business featured offer and quantity tiers.
  - `B2B_ANY_OFFER_CHANGED` needs a queue, as with the other notifications.
- **Subscribe & Save (gap fill).**
  - Replenishment `listOffers` gives `eligibility`, the funded discount tiers in `offerProgramConfiguration.promotions`, `enrollmentMethod`, `price`, `inventory` and `stockRisk`.
  - `listOfferMetrics` and `getSellingPartnerMetrics` give `ACTIVE_SUBSCRIPTIONS`, `SHIPPED_SUBSCRIPTION_UNITS`, `SIGNUP_CONVERSION_BY_SELLER_FUNDING` and `SUBSCRIBER_RETENTION`.
  - Use DAY aggregation (at most 31 days per call): the API's WEEK is ISO Monday-start, while Brand Analytics and Economics weeks start on Sunday.
- **List price and sale price (gap fill).** `getDefinitionsProductType` gives where `list_price` sits (top-level attribute or inside `purchasable_offer`) and its shape. `getListingsItem` `attributes` gives `list_price` and `purchasable_offer.discounted_price` with its schedule. Whether the strike-through shows is read from `getCompetitiveSummary` `referencePrices` and Keepa `stats.buyBoxSavingBasis`, as above.
- **EU stores (gap fill).** The marketplace's own Seller Central help pages (EU host) give the 30-day-lowest-price discount floors and duration limits. The price discount and deal dashboards, as the seller reports them, give the live thresholds.

## Pages read

All read 2026-10-14. Seller Central help pages were read through the help hub's own public content service. The page shell at the listed URL needs a browser; the shell's script fetches the same `GetHelpTopic` content (`POST https://sellercentral.amazon.com/help/hub/mons-api/GetHelpTopic`; the route is described in method/help-page-access.md). Six of the pages below also have a saved text capture of 2026-10-14 under the office's capture folder (outside this repository) (G37911 v19, G200418100 v23, G201687550 v20, G202111490 v25, G202111590 v27, GJHCPEFJ5JJQD52D v14); their rows name the capture. Developer docs at developer-docs.amazon.com redirect (301) to developer-docs.amazon, and were read as each page's `.md` form, which the site offers for agents.

| Page name | URL | Date read | What it gave |
|---|---|---|---|
| Featured Offer | https://sellercentral.amazon.com/help/hub/reference/external/G37911 | 2026-10-14 | v19; "This page has been removed"; pointer to Becoming the Featured Offer (capture: capture `G37911-v19`) |
| Featured Offer eligibility | https://sellercentral.amazon.com/help/hub/reference/external/G200418100 | 2026-10-14 | v23; removed; "As of September 2026 … no longer maintains a seller eligibility requirement" (capture: capture `G200418100-v23`) |
| Offer placement | https://sellercentral.amazon.com/help/hub/reference/external/G201687530 | 2026-10-14 | Selection on price, availability, address; up to three other offers shown; older "eligible" wording |
| Becoming the Featured Offer | https://sellercentral.amazon.com/help/hub/reference/external/G201687550 | 2026-10-14 | v20; factors in and out; per variation and location; Featured Offer % over page views (capture: capture `G201687550-v20`) |
| Pricing Health | https://sellercentral.amazon.com/help/hub/reference/external/GSTH6YN3BR8XNWBW | 2026-10-14 | Deactivation vs FO ineligibility; competitive price threshold; reference price definitions; dispute path |
| Pricing Health warning and error messages | https://sellercentral.amazon.com/help/hub/reference/external/GM665AS5HYKFJB8Z | 2026-10-14 | Min/max/business-price error list |
| Amazon Marketplace Fair Pricing Policy | https://sellercentral.amazon.com/help/hub/reference/external/G5TUVJKZHUVMN77V | 2026-10-14 | Practices and enforcement |
| Amazon policy on reference prices | https://sellercentral.amazon.com/help/hub/reference/external/G202170370 | 2026-10-14 | List Price rule; Was Price computed |
| Show a reference price on your products by providing a list price | https://sellercentral.amazon.com/help/hub/reference/external/G27XM55CQM3SBMD2 | 2026-10-14 | Validation: 90 days, 9 days FO data, peak exclusion |
| Price your item | https://sellercentral.amazon.com/help/hub/reference/external/G62551 | 2026-10-14 | Price ceilings; total price definition |
| Automate Pricing | https://sellercentral.amazon.com/help/hub/reference/external/G201994820 | 2026-10-14 | Rules, min/max |
| Minimum and Maximum Price Validation | https://sellercentral.amazon.com/help/hub/reference/external/G202024630 | 2026-10-14 | 6×/$200 maximum rule |
| Match Low Price | https://sellercentral.amazon.com/help/hub/reference/external/G200836360 | 2026-10-14 | Lowest-price matching basis (minor) |
| Price per unit requirements | https://sellercentral.amazon.com/help/hub/reference/external/G201618190 | 2026-10-14 | Missing unit count can mean no longer shown in search |
| Amazon promotions | https://sellercentral.amazon.com/help/hub/reference/external/G60951 | 2026-10-14 | Promotions need the featured offer |
| Promotional messaging | https://sellercentral.amazon.com/help/hub/reference/external/G202134660 | 2026-10-14 | Empty body returned |
| Stacked promotions | https://sellercentral.amazon.com/help/hub/reference/external/G2ZCMMUXK7VP3K6S | 2026-10-14 | What stacks |
| Coupons | https://sellercentral.amazon.com/help/hub/reference/external/G3QLEV6W2QK84C57 | 2026-10-14 | Coupons shown in search results |
| Create a coupon | https://sellercentral.amazon.com/help/hub/reference/external/G202189350 | 2026-10-14 | 5–50%, activation hours, not shown without FO |
| Coupon eligibility criteria | https://sellercentral.amazon.com/help/hub/reference/external/GJHCPEFJ5JJQD52D | 2026-10-14 | v14; seller 3.5 feedback; product 2.5/3 stars by review count (capture: capture `GJHCPEFJ5JJQD52D-v14`) |
| Understanding coupon errors | https://sellercentral.amazon.com/help/hub/reference/external/GLBL4T5C9UAB9T5P | 2026-10-14 | Reference-price validation rules |
| Coupon fees | https://sellercentral.amazon.com/help/hub/reference/external/GM2HYLSWFBZ267BB | 2026-10-14 | $5 + 2.5%, cap |
| Increase sales | https://sellercentral.amazon.com/help/hub/reference/external/G43381 | 2026-10-14 | Index; pricing guidance |
| Amazon deals (index) | https://sellercentral.amazon.com/help/hub/reference/external/G202043110 | 2026-10-14 | Child list |
| Amazon deals | https://sellercentral.amazon.com/help/hub/reference/external/G202111490 | 2026-10-14 | v25; invite-only; seller 3.5 overall, product 4-star; max deal price (capture: capture `G202111490-v25`) |
| Understand deal fees | https://sellercentral.amazon.com/help/hub/reference/external/G202111590 | 2026-10-14 | v27; $70/day + 1%; peak $100 + 1.5% (capture: capture `G202111590-v27`) |
| Reference pricing and promotions FAQ | https://sellercentral.amazon.com/help/hub/reference/external/GFQCDTDE2HV9NMVV | 2026-10-14 | May 18, 2026 Typical Price change |
| Troubleshoot suppressed and active deals | https://sellercentral.amazon.com/help/hub/reference/external/GKN9A84DGTYWYHWY | 2026-10-14 | 25-hour fix window; deal ≠ FO |
| Prime Exclusive Deals | https://sellercentral.amazon.com/help/hub/reference/external/GFXXXKMMQE9WLVNZ | 2026-10-14 | Not requestable |
| Price discounts | https://sellercentral.amazon.com/help/hub/reference/external/G7F8CQ4EJ5YA4272 | 2026-10-14 | 1–30 days; 5% rules; strike-through in search |
| Price discount fee | https://sellercentral.amazon.com/help/hub/reference/external/GVZXV3WZFCBR3VL2 | 2026-10-14 | Peak-event fee |
| Troubleshoot price discounts | https://sellercentral.amazon.com/help/hub/reference/external/GCCGZV46UWFMN9RV | 2026-10-14 | Prime price suppressed without reference price |
| Subscribe & Save | https://sellercentral.amazon.com/help/hub/reference/external/G201620110 | 2026-10-14 | Tiers; pause on lower-priced offer |
| Strike-Through Pricing and Savings - Amazon Customer Service | https://www.amazon.com/gp/help/customer/display.html?nodeId=GQ6B6RH72AX8D2TD | 2026-10-14 | 90/180-day List Price; Typical Price; "Lowest Price in XX Days" (first fetch 503, second fetch read) |
| Product Pricing API | https://developer-docs.amazon/sp-api/docs/product-pricing-api.md | 2026-10-14 | Versions; four pricing signals |
| Product Pricing API and Notifications FAQ | https://developer-docs.amazon/sp-api/docs/pricing-faq.md | 2026-10-14 | PRICING_HEALTH vs ANY_OFFER_CHANGED; reference price names |
| Price Adjustment Automation Workflows Guide | https://developer-docs.amazon/sp-api/docs/price-adjustment-automation-workflows-guide.md | 2026-10-14 | Workflows; VALIDATION_PREVIEW for price; promotions caveat |
| Manage purchasable offer | https://developer-docs.amazon/sp-api/docs/manage-purchasable-offer.md | 2026-10-14 | Sub-attributes; merge/replace/delete |
| Manage automated pricing rules with SP-API | https://developer-docs.amazon/sp-api/docs/manage-automated-pricing-rules.md | 2026-10-14 | Rule ids in schema; guardrails |
| Manage Listings Issues | https://developer-docs.amazon/sp-api/docs/manage-listings-issues.md | 2026-10-14 | INVALID_PRICE codes 100708/19038/19037/18701 |
| Building Listings Management Workflows Guide | https://developer-docs.amazon/sp-api/docs/building-listings-management-workflows-guide.md | 2026-10-14 | PUT merges sales terms |
| Update prices for multiple Amazon stores | https://developer-docs.amazon/sp-api/docs/update-price-for-multiple-amazon-stores.md | 2026-10-14 | Multi-store PATCH |
| Return a batch of FOEP data for a set of SKUs | https://developer-docs.amazon/sp-api/docs/return-batch-foep-data-set-skus.md | 2026-10-14 | resultStatus meanings; warning |
| Retrieve a list of featured offers for a batch of up to 20 ASINs | https://developer-docs.amazon/sp-api/docs/retrieve-featured-offers-batch-asins.md | 2026-10-14 | Reference price types; promotions array |
| Promotions API | https://developer-docs.amazon/sp-api/docs/promotions-api.md | 2026-10-14 | Version, roles |
| Replenishment API | https://developer-docs.amazon/sp-api/docs/replenishment-api.md | 2026-10-14 | S&S metrics and offers exist |
| Notification Type Values | https://developer-docs.amazon/sp-api/docs/notification-type-values.md | 2026-10-14 | PRICING_HEALTH, ANY_OFFER_CHANGED |
| SP-API Deprecation Schedule | https://developer-docs.amazon/sp-api/docs/sp-api-deprecations.md | 2026-10-14 | CompetitivePriceThreshold row only |
| SP-API Release Notes | https://developer-docs.amazon/sp-api/docs/sp-api-release-notes.md | 2026-10-14 | 2025–2026 pricing/promotion entries |
| Performance Reports | https://developer-docs.amazon/sp-api/docs/report-type-values-performance.md | 2026-10-14 | Coupon and promotion reports; roles Brand Analytics (coupon) and Selling Partner Insights (promotion, sellers) re-read in the reconciliation |
| Analytics Reports | https://developer-docs.amazon/sp-api/docs/report-type-values-analytics.md | 2026-10-14 | SQP median prices; S&T buyBoxPercentage |
| productPricing_2022-05-01.json (model) | https://github.com/amzn/selling-partner-api-models/blob/main/models/product-pricing-api-model/productPricing_2022-05-01.json | 2026-10-14 | Operations, enums, promotions (commit 74ed063b28, 2026-07-29) |
| productPricingV0.json (model) | https://github.com/amzn/selling-partner-api-models/blob/main/models/product-pricing-api-model/productPricingV0.json | 2026-10-14 | v0 ops, no deprecation flag; offer summary fields |
| listingsItems_2021-08-01.json (model) | https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-items-api-model/listingsItems_2021-08-01.json | 2026-10-14 | `mode` enum; offers shape; `PatchOperation.op` enum add/replace/merge/delete (re-read in the reconciliation) |
| promotions_2025-12-01.json (model) | https://github.com/amzn/selling-partner-api-models/blob/main/models/promotions-api-model/promotions_2025-12-01.json | 2026-10-14 | Three read operations; type enums |
| analytics_sellerAnalytics_2025_03_31.graphql (schema) | https://github.com/amzn/selling-partner-api-models/blob/main/schemas/data-kiosk/analytics_sellerAnalytics_2025_03_31.graphql | 2026-10-14 | featureOfferPct; promotion group; search price metrics |
| Product.java (Keepa backend) | https://github.com/keepacom/api_backend/blob/master/src/main/java/com/keepa/api/backend/structs/Product.java | 2026-10-14 | coupon, couponHistory, deals, promotions, CPT, buyBoxSellerIdHistory |
| Stats.java (Keepa backend) | https://github.com/keepacom/api_backend/blob/master/src/main/java/com/keepa/api/backend/structs/Stats.java | 2026-10-14 | buyBoxStats, saving basis, lightningDealInfo |
| Amazon Buy Box: What Is It & How to Win in 2024 (Jungle Scout) | https://www.junglescout.com/resources/articles/amazon-buy-box/ | 2026-10-14 | Practitioner factor list |
| How to Get the Buy Box on Amazon - Secrets Sellers Should Know (eComEngine) | https://www.ecomengine.com/blog/amazon-buy-box | 2026-10-14 | Practitioner factor list |
| The Amazon Buy Box – Your Most Powerful Holiday Season Power Up (SellerApp) | https://www.sellerapp.com/blog/amazon-buy-box/ | 2026-10-14 | Outdated eligibility claims |
| Mastering Amazon Coupons in 2026 (SellerApp) | https://www.sellerapp.com/blog/amazon-coupons/ | 2026-10-14 | Unsourced coupon figures (first 100,000 characters read) |
| How to Use Amazon Lightning Deals: More Than Just a Quick Buck (Helium 10) | https://www.helium10.com/blog/amazon-lightning-deals/ | 2026-10-14 | Outdated deal rules |
| Et tu, Amazon Buy Box? (Marketplace Pulse) | https://www.marketplacepulse.com/articles/et-tu-amazon-buy-box | 2026-10-14 | Product vs seller competition |
| Competition Made Amazon a Better Deal (Marketplace Pulse) | https://www.marketplacepulse.com/articles/amazon-discovers-lower-fees-lead-to-lower-prices | 2026-10-14 | Trade-down quote |
| An Empirical Analysis of Algorithmic Pricing on Amazon Marketplace (PDF) | https://mislove.org/publications/Amazon-WWW.pdf | 2026-10-14 | Abstract and contributions |
| Crossref records for Grewal et al. 1998, Kalyanaram & Winer 1995, Mazumdar et al. 2005, Farronato et al. 2023 | https://api.crossref.org/works/{doi} | 2026-10-14 | Bibliographic data; abstracts for Kalyanaram & Winer and Farronato et al. only (verifier: Grewal et al.'s record carries no abstract; Mazumdar et al.'s DOI is 10.1509/jmkg.2005.69.4.84) |
| Search, Obfuscation, and Price Elasticities on the Internet (NBER) | https://www.nber.org/papers/w10570 | 2026-10-14 | Abstract |
| Controlled experiments on the web: survey and practical guide (PDF) | https://ai.stanford.edu/~ronnyk/2009controlledExperimentsOnTheWebSurvey.pdf | 2026-10-14 | Randomization passages |
| Seller Central help page HTML shell | https://sellercentral.amazon.com/help/hub/reference/external/G37911 | 2026-10-14 | unreachable as HTML: page needs JavaScript; read via the content service instead |
| Effects of $9 Price Endings on Retail Sales (Springer) | https://link.springer.com/article/10.1023/A:1023581927405 | 2026-10-14 | unreachable: "Client Challenge" bot wall; Crossref metadata only, finding not read, not used |
| A meta-analysis of the impact of price presentation on perceived savings (Krishna et al., J. Retailing 2002) | https://api.crossref.org/works/10.1016/S0022-4359(02)00072-6 | 2026-10-14 | metadata only, no abstract; finding not read, not used |
| Algorithmic Pricing Facilitates Tacit Collusion (Musolff, EC'22) | https://api.crossref.org/works/10.1145/3490486.3538239 | 2026-10-14 | metadata only; finding not read, not used |
| Seller Forums "News" announcements on pricing/strike-through | — | 2026-10-14 | not found by the original seat (search budget); five posts found and read by the verifier, rows below |
| Updates to Featured Offer eligibility requirements (Seller Forums News) | https://sellercentral.amazon.com/seller-forums/discussions/t/7336583f-09ac-41de-99d1-667017a88db2 | 2026-10-14 | Read by the verifier: removal starts July 2026, global by end of 2026; selection unchanged |
| Upcoming Improvements to Reference Pricing (Seller Forums News) | https://sellercentral.amazon.com/seller-forums/discussions/t/f48a1fe5-aa8e-4806-b687-2d9aeec5c351 | 2026-10-14 | Read by the verifier: List Price rule April 23, 2026; Typical Price rule May 18, 2026 |
| New coupon pricing requirements (Seller Forums News) | https://sellercentral.amazon.com/seller-forums/discussions/t/030d95b5-3c38-4b9f-be57-837a9929e051 | 2026-10-14 | Read by the verifier: March 12, 2024; 5–50%; sales history; below was price |
| Amazon is making it easier to try using deals and coupons to create additional demand for your products (Seller Forums News) | https://sellercentral.amazon.com/seller-forums/discussions/t/c71e49a4-8f57-42ea-8d6a-accec5de1ebe | 2026-10-14 | Read by the verifier: June 2, 2025 coupon and deal fee change |
| Holiday 2026: Same fees, same eligibility, earlier deadlines (Seller Forums News) | https://sellercentral.amazon.com/seller-forums/discussions/t/3e31fbb7-04e0-4ed4-873e-f74b1052e2ff | 2026-10-14 | Read by the verifier: $100 + 1.5% capped $5,000 for peak deals and PEPD |
| 🏷️ Featured Offer Update: Every Seller's Offers Are Now in the Running (Seller Forums, Indy_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/86513d71-2e86-4cc0-aaba-0fbeac6b43a9 | 2026-10-14 | Read by the verifier: restates the July 2026 change; not a News_Amazon post |
| Amazon's approach to offering genuine deals to customers (aboutamazon.com) | https://www.aboutamazon.com/news/retail/how-amazon-offers-genuine-deals-to-customers | 2026-10-14 | Read by the verifier: validated reference prices; 90-day median; 30-day lowest price aim |
| Maximize your sales potential with the Featured Offer (Amazon Selling Partner Blog, Apr 10, 2026) | https://sell.amazon.com/blog/buy-box-featured-offer | 2026-10-14 | Read by the verifier: total price incl. shipping; fast free shipping; out of stock cannot be featured; low price may be held as suspected error |
| Subscribe & Save (sell.amazon.com) | https://sell.amazon.com/programs/subscribe-and-save | 2026-10-14 | Read by the verifier: seller funds 5% or 10%; Amazon 5% on 5+ items; Brand Registry |
| Feedvisor pricing university page | https://feedvisor.com/university/pricing/ | 2026-10-14 | Read by the verifier: "$10,000" ceiling with Collectible Books exception; no $300,000 figure |
| Helium 10 Buy Box guide; Pacvue Buy Box page | https://www.helium10.com/blog/amazon-buy-box/ ; https://www.pacvue.com/blog/amazon-buy-box | 2026-10-14 | unreachable: 404; 403 |
| *Gap fill rows (2026-10-14). Seller Central pages read via `POST …/help/hub/mons-api/GetHelpTopic` with body `{"guid": "<id>"}`; EU pages via the same service on sellercentral.amazon.de with locale en_GB.* | | | |
| Selling on Amazon fee schedule | https://sellercentral.amazon.com/help/hub/reference/external/G200336920 | 2026-10-14 | Referral fee base; whole-price vs portion tiers; $0.30 minimum; refund administration fee (version 119) |
| 2026 US Referral and FBA fee changes summary | https://sellercentral.amazon.com/help/hub/reference/external/G201411300 | 2026-10-14 | Effective January 15, 2026; price-band fee changes; coupon variable fee cap $2,000 from November 5, 2025; economicsPreview |
| 2026 US FBA fulfillment fee changes | https://sellercentral.amazon.com/help/hub/reference/external/GABBX6GZPA8MSZGW | 2026-10-14 | <$10 / $10–$50 / >$50 bands; $10 and $50 in middle band; peak October 15, 2026–January 14, 2027; 3.5% surcharge; charged at ship |
| 2026 US Low Price FBA fulfillment fee | https://sellercentral.amazon.com/help/hub/reference/external/GMUTB89XM7AATPR3 | 2026-10-14 | Automatic under $10; $0.86 average less |
| FBA fulfillment fee | https://sellercentral.amazon.com/help/hub/reference/external/GPDC3KPYAGDTVDJP | 2026-10-14 | Fee charged when shipped; estimating tools |
| FBA features, services, and fees | https://sellercentral.amazon.com/help/hub/reference/external/G201074400 | 2026-10-14 | Index; links to fee preview tools and GetMyFeesEstimate |
| Fee Preview report | https://sellercentral.amazon.com/help/hub/reference/external/201115050 | 2026-10-14 | Fields your-price, sales-price, estimated fees; up to 72 h old |
| How to read a Referral Fee Preview report | https://sellercentral.amazon.com/help/hub/reference/external/G201631600 | 2026-10-14 | Based on listed item price, no shipping; up to 72 h old; once per 24 h |
| Coupon fees (re-read) | https://sellercentral.amazon.com/help/hub/reference/external/GM2HYLSWFBZ267BB | 2026-10-14 | Fees on final price after coupon; all coupon types incl. S&S; $2,000 cap |
| Business prices and quantity discounts | https://sellercentral.amazon.com/help/hub/reference/external/G201740300 | 2026-10-14 | Definitions; Professional only; fee-discount pointer |
| Business pricing and quantity discounts FAQ | https://sellercentral.amazon.com/help/hub/reference/external/G201824530 | 2026-10-14 | Business price ≤ standard; promotions base; fixed vs percent; 2% savings advice |
| Business-Only Offers | https://sellercentral.amazon.com/help/hub/reference/external/G201740310 | 2026-10-14 | Business price with no standard price |
| Reference pricing for business discounts and business savings | https://sellercentral.amazon.com/help/hub/reference/external/GNCA9MVMUDJM6PGA | 2026-10-14 | Same reference price as B2C; was price excludes B2B sales; 2% minimum |
| Amazon Business FBA multi-unit fulfillment fee discount | https://sellercentral.amazon.com/help/hub/reference/external/GMZ5WFTZHCM4Q4C5 | 2026-10-14 | 3% discount qualifies; standard sizes; quantity bands |
| Selling on Amazon Business fee schedule | https://sellercentral.amazon.com/help/hub/reference/external/G201762480 | 2026-10-14 | Referral per standard schedule; reduced referral on high-value business orders |
| Amazon Business bulk order fee discount | https://sellercentral.amazon.com/help/hub/reference/external/GQBCQZZKZQ94LL55 | 2026-10-14 | not read: content service returned HTTP 400 (body not kept; rate limit or not in layer, method/help-page-access.md A3); no capture |
| Create a business pricing rule | https://sellercentral.amazon.com/help/hub/reference/external/GD29LN5JBS94EL4L | 2026-10-14 | Up to five tiers; Business Catalog rule |
| Subscribe & Save (re-read) | https://sellercentral.amazon.com/help/hub/reference/external/G201620110 | 2026-10-14 | Five base tiers 0/5/10/15/20%; 0% default auto-enrolment; 85% buyability |
| Show a reference price … list price (re-read) | https://sellercentral.amazon.com/help/hub/reference/external/G27XM55CQM3SBMD2 | 2026-10-14 | list_price field; few hours; 90-day, 9-day, peak exclusion confirmed |
| Amazon policy on reference prices (re-read) | https://sellercentral.amazon.com/help/hub/reference/external/G202170370 | 2026-10-14 | Wording confirmed |
| Reference pricing and promotions FAQ (re-read) | https://sellercentral.amazon.com/help/hub/reference/external/GFQCDTDE2HV9NMVV | 2026-10-14 | Non-advertised discounts non-promotional from May 18, 2026; S&S excluded |
| Price discounts (US, re-read) | https://sellercentral.amazon.com/help/hub/reference/external/G7F8CQ4EJ5YA4272 | 2026-10-14 | Three-star; 5% off 30-day lowest non-promotional price |
| Amazon deals (re-read) | https://sellercentral.amazon.com/help/hub/reference/external/G202111490 | 2026-10-14 | Seller 3.5 overall rating and product 4-star; invite-only |
| Understand deal fees (re-read) | https://sellercentral.amazon.com/help/hub/reference/external/G202111590 | 2026-10-14 | $70/day + 1.0% capped $2,000; peak $100 + 1.5% capped $5,000 |
| Coupon eligibility criteria; Understanding coupon errors (re-read) | https://sellercentral.amazon.com/help/hub/reference/external/GJHCPEFJ5JJQD52D ; …/GLBL4T5C9UAB9T5P | 2026-10-14 | 3.5 seller feedback; 2.5 vs 1 star disagreement stands; live Sale Price used |
| Featured Offer eligibility; Becoming the Featured Offer; Pricing Health; Pricing Health warning and error messages (re-read) | …/G200418100 ; …/G201687550 ; …/GSTH6YN3BR8XNWBW ; …/GM665AS5HYKFJB8Z | 2026-10-14 | "As of September 2026" confirmed; FO % over page views; business-price errors |
| Amazon policy on reference prices (EU) | https://sellercentral.amazon.de/help/hub/reference/external/G202170370 | 2026-10-14 | RRP; 30-calendar-day maximum discount duration in some EU stores (version 19) |
| Reference pricing and promotions FAQ (EU) | https://sellercentral.amazon.de/help/hub/reference/external/GFQCDTDE2HV9NMVV | 2026-10-14 | Was Price names; exclusions; deal-badged discounts promotional (version 10) |
| Show a reference price … by providing an RRP (EU) | https://sellercentral.amazon.de/help/hub/reference/external/G27XM55CQM3SBMD2 | 2026-10-14 | "List price with tax" field; Featured Offer requirement for Amazon sales |
| Price discounts (EU) | https://sellercentral.amazon.de/help/hub/reference/external/G7F8CQ4EJ5YA4272 | 2026-10-14 | 3.5-star; 30-day lowest-price floors by country (version 8) |
| Strike-Through Pricing and Savings (re-read, US) | https://www.amazon.com/gp/help/customer/display.html?nodeId=GQ6B6RH72AX8D2TD | 2026-10-14 | 90/180 days; Typical Price; Lowest Price in XX Days; One-Time Price for S&S (read with curl --compressed) |
| Strike-Through page on amazon.de / amazon.co.uk / amazon.fr | https://www.amazon.de/gp/help/customer/display.html?nodeId=GQ6B6RH72AX8D2TD (and .co.uk, .fr) | 2026-10-14 | unreachable: 403 (curl), 503 (fetch) |
| Directive (EU) 2019/2161 on EUR-Lex | https://eur-lex.europa.eu/eli/dir/2019/2161/oj/eng | 2026-10-14 | unreachable: empty page behind a JavaScript challenge (HTTP 202) |
| Product Fees API | https://developer-docs.amazon/sp-api/docs/product-fees-api.md | 2026-10-14 | "not guaranteed"; roles; release notes (updatedAt 2026-09-09) |
| Get product fee estimates for a specific ASIN / SKU; Get product fees for a batched set of up to 20 items | https://developer-docs.amazon/sp-api/docs/get-product-fee-estimates-asin.md ; …/get-product-fee-estimates-sku.md ; …/get-product-fees-batch.md | 2026-10-14 | Call before setting price; batch of 20; Pricing and Product Listing role |
| productFeesV0.json (model) | https://github.com/amzn/selling-partner-api-models/blob/main/models/product-fees-api-model/productFeesV0.json | 2026-10-14 | Operations, rates, inputs, outputs, SKU vs ASIN size note (commit 030c6de38d, 2025-08-27) |
| analytics_economics_2024_03_15.graphql (schema) | https://github.com/amzn/selling-partner-api-models/blob/main/schemas/data-kiosk/analytics_economics_2024_03_15.graphql | 2026-10-14 | economics / economicsPreview / economicsSimulation; PreviewFeeType (commit f525287ce2, 2025-12-22) |
| replenishment-2022-11-07.json (model) | https://github.com/amzn/selling-partner-api-models/blob/main/models/replenishment-api-model/replenishment-2022-11-07.json | 2026-10-14 | Three operations; eligibility; funding tiers; metrics; ISO weeks (commit 4ab02a8675, 2026-05-27) |
| productPricingV0.json; productPricing_2022-05-01.json (re-read for B2B) | (as above) | 2026-10-14 | OfferType B2B / CustomerType Business in v0; Consumer-only in v2022-05-01 |
| Manage Amazon Haul, Advanced Multiple-Offer, and Multiple-Fulfillment Use Cases | https://developer-docs.amazon/sp-api/docs/manage-amazon-haul-advanced-multiple-offer-multiple-fulfillment-use-cases.md | 2026-10-14 | B2B and IVP audiences; quantity_discount_plan; PATCH per audience |
| Mapping product attributes to the Listings Items API and JSON-based feeds | https://developer-docs.amazon/sp-api/docs/mapping-product-attributes.md | 2026-10-14 | Price XML→JSON map incl. MSRP→purchasable_offer list_price, BusinessPrice, QuantityPrice |
| Manage Product Listings with the Selling Partner API | https://developer-docs.amazon/sp-api/docs/manage-product-listings-guide.md | 2026-10-14 | list_price in the offer property group, top-level shape |
| Manage purchasable offer (re-read) | https://developer-docs.amazon/sp-api/docs/manage-purchasable-offer.md | 2026-10-14 | Sub-attribute table; quantity_discount_plan B2B only; no list_price; merge/replace/delete table (re-read again in the reconciliation) |
| Fulfillment By Amazon Reports; Inventory Reports; Performance Reports | https://developer-docs.amazon/sp-api/docs/report-type-values-fba.md ; …/report-type-values-inventory.md ; …/report-type-values-performance.md | 2026-10-14 | FBA Fee Preview and Referral Fee Preview report types and roles; promotion report SPI role |
| Notification Type Values (re-read for B2B) | https://developer-docs.amazon/sp-api/docs/notification-type-values.md | 2026-10-14 | B2B_ANY_OFFER_CHANGED: top 20, seven tiers, filterExpression |
| SP-API Release Notes (re-read) | https://developer-docs.amazon/sp-api/docs/sp-api-release-notes.md | 2026-10-14 | Replenishment launch and metrics; merge op; B2B Listings support; IVP; FOEP not JP; Economics fees; Product Fees changes |
| How to set B2B prices and quantity discounts with Amazon (Amazon Selling Partner Blog) | https://sell.amazon.com/blog/amazon-b2b-prices | 2026-10-14 | 15 minutes; B2B Featured Offer price; Blue Badge 5%/3%/4-star; deal-window rule; lift claim |
| Amazon FBA Fees … in 2024? (Jungle Scout) | https://www.junglescout.com/resources/articles/amazon-fba-fees/ | 2026-10-14 | Practitioner tier copy; no low-price FBA or coupon effect |
| Competition Made Amazon a Better Deal (Marketplace Pulse, re-read) | https://www.marketplacepulse.com/articles/amazon-discovers-lower-fees-lead-to-lower-prices | 2026-10-14 | Apparel cut figures; Jassy quote on low-price items |
| SellerApp Amazon referral fees page | https://www.sellerapp.com/blog/amazon-referral-fees/ | 2026-10-14 | unreachable: 404 |
| Penny Wise and Pound Foolish (Oxford Academic) | https://academic.oup.com/jcr/article-lookup/doi/10.1086/429600 | 2026-10-14 | Abstract (summarised by the fetch tool, not verbatim) |
| Crossref / Semantic Scholar records for Thomas & Morwitz 2005 and Anderson & Simester 2003 | https://api.crossref.org/works/10.1086/429600 ; https://api.semanticscholar.org/graph/v1/paper/DOI:10.1023/A:1023581927405 | 2026-10-14 | Bibliographic data; abstracts elided |

## Open questions

1. **What does `buyBoxPercentage` mean now that seller eligibility is gone?** Amazon began removing seller-level eligibility in July 2026 (US page: gone as of September 2026). Does `IsFeaturedMerchant` (v0) still return anything meaningful? The *definition* of Business Reports' Featured Offer % has not changed in text: Becoming the Featured Offer v20, the page that carries the September 2026 sentence, still defines it over page views (capture `G201687550-v20`). What is open is the *behaviour* of the figure: for a seller formerly ineligible it can rise with no listing or price change (method/triggers.md, P-triggers-20). *Settles:* one `getItemOffers` read on the seller's ASIN in the first real run, and the Becoming the Featured Offer page re-read in a month.
2. **Typical Price, Was Price, `WasPrice`.** Are the help page's Typical Price, the coupon page's Was Price and `getCompetitiveSummary`'s `WasPrice` the same series after the May 18, 2026 change? The developer tutorial still describes `WasPrice` as excluding promotions. *Settles:* compare `WasPrice` with Keepa's `buyBoxSavingBasis` (type `WAS_PRICE`) on the same ASIN on the same day.
3. **CPT in notifications.** Do `PRICING_HEALTH` / `ANY_OFFER_CHANGED` still carry `competitivePriceThreshold` outside JP after the September 30, 2025 removal from `getCompetitiveSummary`? The notification page and the Seller Central Pricing Health page still name it. *Settles:* a live notification payload, which needs a queue destination; not available today.
4. **List Price windows.** Is the List Price validation window 90 days (Seller Central page) or 90/180 days by seasonality (customer page)? The April 2026 News post says only "recently". *Settles:* Amazon's pages disagree; ask Selling Partner Support or watch a seasonal ASIN.
5. **Coupon star floor.** Is the minimum for 1–4 reviews 2.5 (eligibility page, GJHCPEFJ5JJQD52D v14, captured) or 1 (errors page, GLBL4T5C9UAB9T5P, not captured)? Amazon's two pages disagree; neither is preferred here. *Settles:* the coupon dashboard's own error on a real low-rated ASIN, which is also the binding value at run time.
6. **Does VALIDATION_PREVIEW return `100708` for a price unchanged from the live one?** If so, it is a cheap "am I featurable at this price" probe for a handful of SKUs. *Settles:* one preview on the seller's SKU. It changes nothing, but runs on the real store, so ask Jack first, per the roadmap's §2 ruling.
7. **Size of the effects.** What is the click-through or conversion effect of a coupon badge or strike-through on Amazon? No Amazon page read gives a figure, and practitioner figures are unsourced. *Settles:* the seller's own `GET_COUPON_PERFORMANCE_REPORT` and SQP click share across a coupon on/off window, judged by effect-review. Not a number for a skill.
8. **Seller Forums News.** The verifier read five News posts (featured-offer eligibility, reference pricing 2026, coupon pricing 2024, deal/coupon fees 2025, holiday 2026 fees); none shows an absolute posting date, only "N months ago". Still unread: any News post on Prime Exclusive price discounts, on strike-through changes before 2026, and the regional (EU/UK/JP) versions of the eligibility rollout. *Settles:* the forum's News index opened per marketplace.
9. **Keepa coverage.** Does Keepa's `promotions[]` ("Only Amazon US promotions by Amazon (not 3rd party)") miss third-party Prime-exclusive discounts? Is `buyBoxIsPrimeExclusive` or `deals[]` the better witness? *Settles:* a Keepa read of an ASIN known to run a seller's Prime-exclusive price discount.
10. **Eligibility rollout per store.** Is seller-level eligibility already gone in every store the seller sells in? The announcement promises completion "by the end of 2026" only. *Settles:* the marketplace's own Becoming the Featured Offer page, and `getFeaturedOfferExpectedPriceBatch` `resultStatus` on the seller's SKU in that store.
11. ~~**Subscribe & Save tiers.**~~ *Settled by the gap fill:* the Seller Central page, re-read 2026-10-14, says verbatim "five base funding tiers … 0%, 5%, 10%, 15%, or 20%"; the sell.amazon.com page is a summary. The seller's own tier is read from `listOffers`.
12. **Which price sets the FBA price band?** The 2026 pages say "priced" and label their examples "ASP". Is the band set by the listing price, the sale price, the post-coupon price, or a trailing average selling price, and when is it re-evaluated? *Settles:* two `getMyFeesEstimateForSKU` calls at $9.99 and $10.00 show the estimator's band, but not the charge. The charged band shows in Payments – Transaction View for an order placed while a coupon took the price under $10. A Seller Central case could also ask Amazon directly.
13. **Is the referral fee charged on the price before or after a coupon?** The fee schedule says "total amount paid by the buyer"; the coupon-fee page says coupon fees use "the final price after that coupon has been redeemed"; no page read states the referral base under a coupon or a Prime-exclusive discount. *Settles:* the order's fee lines in Finances `listTransactions` for a coupon-redeemed order (door.md owns the route).
14. **The bulk-order referral discount for business orders.** The page (GQBCQZZKZQ94LL55) returned HTTP 400, so its thresholds are not recorded. The content call answers HTTP 400 both for "Rate exceeded" and for a page not in the layer ("HelpArticleNotFound"; method/help-page-access.md A3), and the reply body was not kept, so the page is unread, not shown to be absent; no capture of it exists under the office's capture folder (outside this repository) *Settles:* a re-read through another locale or host, or the link from the Selling on Amazon Business fee schedule opened in a signed-in browser.
15. **EU customer display of the prior price.** How do EU detail pages label the 30-day prior price, and does Amazon show "Lowest price in 30 days" or the RRP? The amazon.de, amazon.co.uk and amazon.fr help pages returned 403/503, and EUR-Lex returned a JavaScript challenge. *Settles:* the EU customer help page read from a browser, and the Directive's Article 6a read on EUR-Lex.
16. **Where `list_price` sits.** Is `list_price` written as a top-level attribute (listings guide example) or under `purchasable_offer` (XML mapping table)? Does it differ by product type or store? *Settles:* `getDefinitionsProductType` for the seller's product type, reading the `offer` property group.
17. **Economics fee types.** The September 30, 2026 release note adds deal, coupon, removal, disposal and fuel fees to the Economics dataset. The GitHub schema (2025-12-22) has none of them. *Settles:* the Data Kiosk schema explorer, or the next model commit.
18. **Referral Fee Preview freshness.** The help page says the report may be "up to 72 hours old", and the SP-API page says "up to 24 hours old". *Settles:* the report's own timestamp on a first run. door.md should state the wait it observes.
19. **B2B featured offer factors.** No Seller Central page read in this session describes how the business featured offer is chosen, or whether the 2026 removal of seller eligibility applies to it. *Settles:* a Seller Central B2B Featured Offer page (not located; the search budget ran out), or `getItemOffers` with `CustomerType=Business` on the seller's ASIN.
20. **Practitioner depth on fee thresholds.** The seat's web-search budget ran out during the gap fill. Named practitioner analyses of pricing under fee thresholds were not found (e.g. Marketplace Pulse, Helium 10 or Carbon6 on Low-Price FBA, or practitioner checks of whether the left-digit effect shows on Amazon). *Settles:* a follow-up search pass.

## Positions

- **P-price-position-1.** Before judging a listing's content, cx reads whether the seller's offer is the featured offer and why not. It uses `getFeaturedOfferExpectedPriceBatch` `resultStatus` and `getListingsItem` `issues`, because promotions and much of the detail page's selling power reach the customer only through the featured offer. — Becoming the Featured Offer; Amazon promotions; Create a coupon; Return a batch of FOEP data for a set of SKUs; Manage Listings Issues.
- **P-price-position-2.** cx distinguishes an offer that is deactivated for a suspected pricing error from one that is live but not featurable at its price, and names which it found. The fixes differ. — Pricing Health; Pricing Health warning and error messages; Product Pricing API and Notifications FAQ.
- **P-price-position-3.** cx does not tell a seller they must be "Buy Box eligible" without reading the store's own page: Amazon is removing seller-level eligibility store by store, and the store's own Becoming the Featured Offer page says whether it is gone there. What remains is offer competitiveness, stock, shippability and customer-experience requirements. — Featured Offer eligibility; Becoming the Featured Offer; Updates to Featured Offer eligibility requirements.
- **P-price-position-4.** cx names Amazon's featured-offer factors as Amazon states them: total price, delivery promise, free shipping, free returns and seller performance. It does not present title, description or seller star rating as Buy Box factors. — Becoming the Featured Offer.
- **P-price-position-5.** cx treats strike-through prices as Amazon's to show or withhold. It reads whether a saving basis is displayed (Keepa `buyBoxSavingBasis` and its type; `getCompetitiveSummary` `referencePrices`) instead of assuming the `list_price` it submitted is visible. — Show a reference price on your products by providing a list price; Reference pricing and promotions FAQ; Strike-Through Pricing and Savings; Retrieve a list of featured offers for a batch of up to 20 ASINs; Stats.java.
- **P-price-position-6.** Before proposing a coupon, deal or price discount, cx checks for a validated reference price, an offer that is the featured offer, and no conflicting promotion. Without these the promotion is suppressed or shows no savings. — Understanding coupon errors; Troubleshoot price discounts; Amazon deals; Stacked promotions; Create a coupon.
- **P-price-position-7.** cx does not predict a coupon's or deal's click-through or conversion lift as a figure. Amazon publishes none, and practitioner figures are unsourced. It records the bet and lets effect-review judge it. — Create a coupon; Coupons; Mastering Amazon Coupons in 2026 (as the counter-example).
- **P-price-position-8.** cx states that coupons, deals and price discounts are created in Seller Central and that the API only reads them. It proposes them as seller actions, not as writes it will make. — Promotions API; promotions_2025-12-01.json.
- **P-price-position-9.** cx writes a price only through `purchasable_offer` in a body built from the product-type schema. It previews a few SKUs with `VALIDATION_PREVIEW` and reads `INVALID_PRICE` issues. It treats a `WARNING` as "accepted but may not be featured", not as success. — Manage purchasable offer; Manage Listings Issues; Price Adjustment Automation Workflows Guide.
- **P-price-position-10.** cx records the seller's minimum and maximum allowed prices with any price change, and keeps any scheduled promotional price inside them. Prices outside the band are errors or deactivations. — Pricing Health warning and error messages; Manage purchasable offer.
- **P-price-position-11.** cx treats FOEP as an estimate before promotions that does not guarantee the featured offer. It reads competitors' live promotions from `getCompetitiveSummary` before concluding a price cut is needed. — productPricing_2022-05-01.json; Return a batch of FOEP data for a set of SKUs; Price Adjustment Automation Workflows Guide.
- **P-price-position-12.** To read price position in search, cx compares the ASIN's median click, cart-add and purchase prices with the query's in the Search Query Performance report. It does not infer position from list price alone. — Analytics Reports.
- **P-price-position-13.** In effect-review, cx logs for both windows of a content change:
  - own price and sale price;
  - featured-offer share;
  - any coupon, deal or price discount;
  - the displayed reference price;
  - the competitor set's prices and promotions.

  It holds the verdict ("cannot tell") if any of these moved. — Becoming the Featured Offer; Analytics Reports; Reference pricing and promotions FAQ; Controlled experiments on the web: survey and practical guide.
- **P-price-position-14.** cx gives no verdict on a window that overlaps a peak event or its run-up. Amazon itself excludes these from its reference-price arithmetic, and deal and discount fees and stacking change during them. — Reference pricing and promotions FAQ; Show a reference price on your products by providing a list price; Understand deal fees; Price discount fee.
- **P-price-position-15.** cx reads limits, fees and thresholds from Amazon at run time (schema, validation response, the coupon or deal dashboard as the seller reports it) and does not quote remembered figures. Amazon changed several in 2025–2026: eligibility, List Price validation, Typical Price, coupon, deal and discount fees. — Featured Offer eligibility; Updates to Featured Offer eligibility requirements; Upcoming Improvements to Reference Pricing; Reference pricing and promotions FAQ; Understand deal fees; Coupon fees; Amazon is making it easier to try using deals and coupons…; SP-API Release Notes.

- **P-price-position-16.** Before proposing a price, sale-price or coupon change, cx reads the fee estimate at the current price and at the proposed (or coupon-net) price with the Product Fees API. It states the fee delta and whether the move crosses a referral-fee threshold or an FBA price band. — Selling on Amazon fee schedule; 2026 US FBA fulfillment fee changes; 2026 US Low Price FBA fulfillment fee; productFeesV0.json; Product Fees API.
- **P-price-position-17.** The change log for a price, sale-price or coupon change holds both fee estimates:
  - `TotalFeesEstimate`, the `FeeDetailList` lines and `TimeOfFeesEstimation`;
  - whether the estimate was by SKU or by ASIN;
  - the coupon's own fees, as Amazon's dashboard shows them.

  — productFeesV0.json; Coupon fees.
- **P-price-position-18.** cx calls a fee figure an estimate. It prefers the SKU estimate once the item is at Amazon, because the ASIN estimate uses catalog size. — productFeesV0.json; Product Fees API.
- **P-price-position-19.** cx takes fee rates, bands and thresholds from the estimate, the fee preview reports or Data Kiosk `economicsPreview`, never from memory. Amazon changes them each year and by season, with a holiday peak rate card and mid-year surcharges. — 2026 US Referral and FBA fee changes summary; FBA fulfillment fee; 2026 US FBA fulfillment fee changes; analytics_economics_2024_03_15.graphql.
- **P-price-position-20.** In effect-review, cx does not call a price move "held" on units alone: it also reports per-unit fees for both windows. It flags a window that spans a fee-rate change date. — 2026 US FBA fulfillment fee changes; 2026 US Referral and FBA fee changes summary; analytics_economics_2024_03_15.graphql.
- **P-price-position-21.** For a seller enrolled in Amazon Business, cx reads the B2B offer alongside the consumer offer before proposing a consumer price cut. A cut below the business price is an error, and business customers then see the standard price. — Business pricing and quantity discounts FAQ; Pricing Health warning and error messages; Manage Amazon Haul, Advanced Multiple-Offer, and Multiple-Fulfillment Use Cases.
- **P-price-position-22.** cx writes a business price or quantity tier only as a `purchasable_offer` entry keyed by `audience`. It reads the allowed audiences and whether `quantity_discount_plan` applies from `getDefinitionsProductType` with `sellerId`. If a business pricing rule (or an IVP rule) manages the SKU, cx says so, because the rule reprices or takes priority. — Manage Amazon Haul, Advanced Multiple-Offer, and Multiple-Fulfillment Use Cases; Create a business pricing rule; SP-API Release Notes.
- **P-price-position-23.** cx reads the business featured offer through Product Pricing v0 with the business customer type, not through `getCompetitiveSummary`, which returns consumer offers only. — productPricingV0.json; productPricing_2022-05-01.json.
- **P-price-position-24.** cx states that business strike-through savings need a validated reference price shared with the consumer store, and that business sales do not count toward the was price. — Reference pricing for business discounts and business savings.
- **P-price-position-25.** When a seller uses Subscribe & Save, cx tells them that a change to the one-time price moves the S&S price. The S&S discount is computed from it, and coupons and promotions add on top. cx reads the enrolment and funded tier from `listOffers` before proposing either. — Strike-Through Pricing and Savings; Subscribe & Save; replenishment-2022-11-07.json.
- **P-price-position-26.** cx reads Subscribe & Save metrics at DAY granularity. The Replenishment API's WEEK starts on Monday (ISO), unlike the Sunday weeks of Brand Analytics and Economics, so weekly buckets from the two sources do not line up. — replenishment-2022-11-07.json; analytics_economics_2024_03_15.graphql.
- **P-price-position-27.** Before writing a list price, cx reads where `list_price` sits in the seller's product-type schema. It tells the seller that the strike-through appears only if Amazon validates the value, and that 0 means "no list price". — Manage Product Listings with the Selling Partner API; Mapping product attributes…; Show a reference price on your products by providing a list price; Amazon policy on reference prices.
- **P-price-position-28.** In an EU store, cx reads that store's own discount rules: thresholds against its recent-lowest-price window, discount duration limits, and star floors. It does not apply US rules. — Price discounts (EU version); Amazon policy on reference prices (EU version); Reference pricing and promotions FAQ (EU version).
- **P-price-position-29.** Before proposing a deal, cx checks both of Amazon's floors: the seller's overall rating and the product's star rating, plus the invitation. — Amazon deals.
- **P-price-position-30.** When cx compares featured-offer share, it names the source. Business Reports' percentage is over page views, and Data Kiosk's `featureOfferPct` is over glance views, so the two are not mixed in one comparison. — Becoming the Featured Offer; analytics_sellerAnalytics_2025_03_31.graphql.

**The seat's own (not for a skill)**

- [seat] On a single-seller brand listing the featured offer is mostly about *whether* it is featured (price versus external price and recent prices, stock), not *who* wins. Competing-product price position in search is the larger lever there. Leaning on Marketplace Pulse 2018 and Ellison & Ellison; not an Amazon statement.
- [seat] Raising price after a coupon or deal can depress conversion beyond the arithmetic (reference-price loss aversion). It can also lower the future Typical Price under the May 2026 rule, which shrinks later strike-through savings. A plausible chain, not measured on Amazon.
- [seat] Keepa's `buyBoxSellerId` is a fallback way to find the seller id only while the seller holds the Buy Box. The day-2 run found it that way; `getFeaturedOfferExpectedPriceBatch` `offerIdentifier.sellerId` is the seller's own by Amazon's model wording: in `OfferIdentifier`, `sku` "will only be present for the target offer, which belongs to the requesting seller", and `sellerId` is "The seller identifier for the offer" (productPricing_2022-05-01.json, re-read 2026-10-14). Other files name other routes (Finances `listTransactions`, `getPricing` replies, the Product Fees `FeesEstimateIdentifier.SellerId` of section H); they do not contradict this one, and which route the box uses is door.md's.
- [seat] `glanceViewWeightPercentage` per Prime/non-Prime segment may explain a conversion change that a single Featured Offer % hides. Unverified.
- [seat] A worked case from Amazon's US schedule (arithmetic, not an Amazon statement). A Beauty item at $10.00 pays 8% referral ($0.80); at $10.01 it pays 15% ($1.50), so the extra cent costs $0.70. Moving from $9.99 to $10.00 also leaves the Low-Price FBA band (on average $0.86 more). A $9.99–$10.01 move can change fees by about $1.50 a unit with no change in units.
- [seat] A coupon that takes the paid price under a referral or FBA line may or may not lower fees. That depends on open questions 12 and 13. Until they are settled, cx should show both readings rather than assume the saving.
- [seat] A business discount of 3% or more can lower FBA fees on multi-unit business orders. For a seller with business volume, a B2B tier may beat a consumer coupon on margin. This is untested, and no Amazon page compares them.

## Verification

Verified 2026-10-14 by an adversarial verifier seat. About 80 claims checked.

**How.** SP-API facts were checked against the model files fetched from `amzn/selling-partner-api-models` `main` (productPricing_2022-05-01.json, last commit 74ed063b28 of 2026-07-29; productPricingV0.json; listingsItems_2021-08-01.json; promotions_2025-12-01.json, last commit 3677bb9d96 of 2026-09-30; analytics_sellerAnalytics_2025_03_31.graphql) and the developer-docs pages (developer-docs.amazon.com does 301 to developer-docs.amazon, confirmed). Keepa fields were checked in `keepacom/api_backend` Product.java and Stats.java. Seller Central help-hub pages could **not** be reopened by the verifier: the page shell needs JavaScript and the verifier's request to the hub's content service was refused by this session's permission layer. Those claims were checked instead against Amazon's Seller Forums News posts, Amazon's public sell.amazon.com and aboutamazon.com pages, and third-party pages that quote the help pages. No call was made to any SP-API or Keepa API host.

**Confirmed as written.** FOEP operation, "up to 40 requests", "before applicable promotions", the five `resultStatus` values, the "automatically generated" warning and the "new condition … ship nationwide" scope; `getCompetitiveSummary` 20-ASIN batch, the four `includedData` values, `PRIME`/`NON_PRIME`/`DEFAULT`, `glanceViewWeightPercentage`, `sampleLocation`, the July 29, 2026 `promotions` array (`COUPON`/`DEAL`/`BASKET_BUILDING`) and "might not include every active promotion"; v0 operations with no deprecation flag, v0 "Legacy" on the overview page, the deprecation-schedule row for `CompetitivePriceThreshold` (June 25 → September 30, 2025) and the June 25, 2025 `CompetitivePrice` release note; v0 offer-summary fields and the "up to two Buy Box winners" sentence; `purchasable_offer` sub-attributes, the `our_price` non-deletion rule, `merge`-to-null and `delete` limits; the `putListingsItem` sales-terms merge sentence; `INVALID_PRICE` codes 100708/19038/19037/18701 with severities, the `VALID`+`WARNING` sentence and the preview-mode rate-limit sentence; the `ACCEPTED` sentence; automated pricing rule ids from the schema, one rule per SKU, guardrails; Promotions API three GET operations and type enum; `PRICING_HEALTH` wording and its four reference-price names, `ANY_OFFER_CHANGED` triggers; Sales and Traffic `buyBoxPercentage`/`averageSellingPrice` and "up to three times every five minutes"; SQP median price pairs; coupon and promotion performance reports; Data Kiosk `featureOfferPct`, `promotionType`, `dealOurPrice`, `promotionConversionRate`, price-at-impression/click/cart/purchase metrics and the September 30, 2026 release note; every Keepa field and csv index named, `couponHistory` from June 15, 2024, `promotions[]` "Only Amazon US promotions by Amazon (not 3rd party)", `buyBoxSellerIdHistory` `-1`/`-2`; Keepa SKILL.md's `stats=90`, `offers=20`, `buybox=1`. Practitioner pages: Jungle Scout (Connolly, 2024-02-14), eComEngine (undated, four named experts), SellerApp ×2 (Nagaraj 2026-10-01; Purohit 2026-09-29, all figures unsourced, 5–80% range), Helium 10 (2020-12-29 / 2023-11-21), Marketplace Pulse ×2 (2018-07-18; 2024-08-02). Research: Chen/Mislove/Wilson WWW 2016 pp. 1339–1349 (1,641 products, 543 sellers, quoted sentences found in the PDF), Kalyanaram & Winer 1995 (abstract matches), Mazumdar/Raj/Sinha 2005 (bibliography and "promotional environment"), Ellison & Ellison (NBER w10570 abstract; Econometrica 77(2):427–452), Farronato/Fradkin/MacKay 2023 (abstract matches, "30 percent to 60 percent"), Kohavi et al. DMKD 18(1):140–181 (quoted sentence found in the PDF). The day-2 run report does carry "CTR +10–15%" on a 10% coupon. No seller data (store name, seller id, ASIN, figure) appears in the file.

**Corrections (was → now).**
1. "Featured-offer eligibility is gone. As of September 2026…" presented as a single global date → removal "Starting in July 2026", rolling out "across all Amazon stores globally, completing by the end of 2026", selection unchanged; the US help page's "As of September 2026" kept; other stores may still apply the old gate (Updates to Featured Offer eligibility requirements, Seller Forums News). Same correction in Stable enough, P-price-position-3 and open question 1.
2. "Three facts changed" → four: the April 23, 2026 List Price validation rule added (Upcoming Improvements to Reference Pricing).
3. `WasPrice` definition and the JP/non-JP split of `CompetitivePriceThreshold`/`CompetitivePrice` were sourced to the model and the Pricing FAQ → sourced to the tutorial "Retrieve a list of featured offers for a batch of up to 20 ASINs"; neither the model nor the FAQ defines `WasPrice`.
4. FOEP `resultStatus` list presented as closed → the model's "Additional values might be added in the future" added.
5. Promotions API: added that Amazon's overview and release note say "manage" while the model documents only three GET operations; roles named.
6. Coupon fee cap "$2,000" stated flatly → kept with a note that Amazon's June 2025 News post names the $2,000 cap only for deals; coupon cap unverified.
7. Subscribe & Save tiers "0/5/10/15/20%" stated flatly → noted that Amazon's sell.amazon.com page says the seller funds "5% or 10%"; 15/20% unverified; new open question 11.
8. Professional listing ceiling "$300,000" → marked unverified (only the $10,000 figure was corroborated).
9. Jungle Scout's reason for coupons over a price cut ("a price far from average can suppress the Buy Box") → the page's own reason (to avoid losing one's own Buy Box) and its "Amazon gives priority to its Prime sellers".
10. Marketplace Pulse "lower prices brought more units" → Amazon's words, "has spurred substantial year-over-year unit growth in apparel", attributed to Andy Jassy / the Q2 report.
11. Grewal, Monroe & Krishnan 1998: finding → marked unverified (no abstract read); paper's existence confirmed.
12. "Offer placement … predates the September 2026 change" → tagged [seat].
13. Seller Forums News "unreachable" → five News posts read and cited; corroborating rows for Typical Price, coupon range, coupon and deal fees, and an aboutamazon.com statement added; open questions 8 and 10 added/rewritten.

**Still unverified (resting on the original seat's read of help pages the verifier could not open).** *Reconciliation note: the Becoming the Featured Offer and Amazon deals items formerly in this list are now confirmed against the 2026-10-14 captures under the office's capture folder (outside this repository) (Understand deal fees and Coupon eligibility criteria are now matched to their captures too); see the dated list at the end.* Pricing Health's reference-price list, "30 minutes" dispute path and competitive-price-rule wording; Pricing Health warning and error messages; List Price validation details (9 days of FO data, peak-event two-week exclusion, "within a few hours"); Reference pricing FAQ exclusions (BXGY, S&S, tailored coupons are corroborated only via a seller's quotation in the forum thread); Create a coupon (4–6 hours, one unit, edits only increase, stacking warning); Understanding coupon errors (30% above Was Price; exemptions; the 1-star discrepancy); Price discounts and their fees; Stacked promotions; Troubleshoot suppressed deals (25 hours); Prime Exclusive Deals; Subscribe & Save pause rule; Fair Pricing Policy wording (corroborated in substance by several quotations); the customer Strike-Through page (503 for the verifier too; 90/180-day wording unverified); Automate Pricing 6×/$200 rule (corroborated by forum quotations of Amazon staff).

**What a senior Amazon operations lead would expect here and does not find (not researched now).**
- Sponsored Products and Sponsored Brands serving depends on the featured offer; losing it stops ads, which confounds any CTR read.
- Account Health and its metrics (ODR, late shipment, cancellation, valid tracking) as the route by which "seller performance" removes an offer; the "See All Buying Options" display when no offer is featured and its effect on conversion.
- MAP policies, brand-level price parity, and Amazon Retail (1P) as a competing offer on the same ASIN; Amazon matching external prices.
- "Lowest price in 30 days" / "Typical price" badges and the "Prime member price" label as distinct customer-visible price treatments; EU Omnibus 30-day prior-price rules in EU stores.
- B2B: business price and quantity discounts as a separate featured offer for business customers.
- Price elasticity estimation from the seller's own history (and why Keepa `buyBoxStats` is an approximation); Product Opportunity Explorer price ranges for the niche.
- Event calendar: Prime Day, Prime Big Deal Days, BFCM dates per year as the windows effect-review must exclude, and the run-up effect on traffic.
- Coupon budget exhaustion and coupon auto-deactivation as a mid-window confounder; redemption-vs-clip economics.
- Price-gouging enforcement under the Fair Pricing Policy during emergencies.
- Regional differences (EU/UK/JP) for CPT, eligibility rollout, deal fees.

Gap fill 2026-10-14: 8 gaps filled, 9 left open.
- Filled:
  - (1) Category referral-fee tiers by price: whole-price thresholds vs portion tiers, the fee base and the minimum. Section H.
  - (2) US FBA price bands and Low-Price FBA, with the 2026 peak and surcharge. Section H.
  - (3) The per-ASIN and per-SKU fee estimate before a price or coupon change, with batch, limits, fee reports and Data Kiosk `economicsPreview`. Section H.
  - (4) Amazon Business pricing: the `purchasable_offer` audience B2B and IVP, quantity discounts, the B2B featured offer read, `B2B_ANY_OFFER_CHANGED`, business pricing rules and the multi-unit FBA fee discount. Section I.
  - (5) Subscribe & Save discount display and the Replenishment API (`listOffers`, `listOfferMetrics`, `getSellingPartnerMetrics`); this settles open question 11. Section J.
  - (6) Sale price vs List Price display rules, and `list_price` as a write attribute. Section K.
  - (7) US 'Typical price' and 'Lowest price in XX days'. Section K.
  - (8) EU seller-side rules (RRP, 30-day duration cap, 30-day-lowest discount floors, star floor). Section K.
  - Corrections to sections A–G: section L.
- Left open:
  - Open question 12: the price that sets the FBA band.
  - Open question 13: the referral fee base under a coupon.
  - Open question 14: bulk-order business referral discount (page unreachable).
  - Open question 15: EU customer-facing prior-price display (pages unreachable).
  - Open question 16: where `list_price` sits.
  - Open question 17: Economics schema lags the release note.
  - Open question 18: Referral Fee Preview age, 24 h vs 72 h.
  - Open question 19: B2B featured offer factors.
  - Open question 20: practitioner depth on fee thresholds (search budget exhausted).
- Adversarial re-check, 2026-10-14. Every quoted phrase added by the gap fill was re-matched against its page on a fresh fetch:
  - the Seller Central US and EU pages through the help content service;
  - the developer-docs pages and GitHub models through curl;
  - the US customer page through curl --compressed;
  - the Amazon blog, Marketplace Pulse, Jungle Scout and Oxford Academic pages through the fetch tool.

  One quote's capitalisation was corrected (the Replenishment "only data for the trailing 2 years is supported"). The fetch tool's readings of the practitioner and research pages are summaries, not byte matches.

**Reconciled 2026-10-14.** Settled against the cross-file contradiction list, at the source: the help-page captures under the office's capture folder (outside this repository), the Listings Items and Product Pricing models on GitHub `main`, and the Manage purchasable offer and Performance Reports developer pages, each re-read. No help page was fetched; no Amazon or Keepa API host was called.
- Help-page reachability. Six help pages this file cites have 2026-10-14 captures (G37911 v19, G200418100 v23, G201687550 v20, G202111490 v25, G202111590 v27, GJHCPEFJ5JJQD52D v14). Their quotations here were matched against the capture text, and each citation and *Pages read* row now names the version and the capture. Section A's Becoming the Featured Offer wording (factor list with order volume, chargeback rate and Voice of the Customer; "never use manual overrides"; the $40/$35 example; Prime and fulfillment method "If all other factors are equal"; seller reviews and star ratings not considered) and the Amazon deals items came off the verifier's "Still unverified" list; Understand deal fees and Coupon eligibility criteria are now matched to their captures as well. Files that call these pages unreachable (seasonality-and-events.md's first pass for G202111490) were wrong on the route, not on the page; this file was not.
- Deal floors and fees. Section D now carries both deal floors from the capture (seller: Professional, "overall rating of at least 3.5 stars"; product: sales history and "at least a 4-star rating"; product criteria "subject to change based on country and time of year"), the maximum-deal-price wording verbatim, and the "revalidate" risk of adding child ASINs during an upcoming deal. The deal-fee note adds "Rates may vary by event" and that the fee shown in the deal creation workflow is the binding one. This file was right; seasonality-and-events.md's first-pass ambiguity is settled the same way in its own gap fill.
- Coupon rating floors. The capture confirms seller "3.5 Seller feedback rating" and product 2.5 (1–4 reviews) / 3 (5+). Added that the coupon 3.5 is a *feedback* rating and the deal 3.5 an "overall rating", and that the unattributed "overall rating of at least 3.5" in seasonality-and-events.md came from the sell.amazon.com promotions guide. The 2.5-versus-1 disagreement between Coupon eligibility criteria and Understanding coupon errors is stated as Amazon's own, with the coupon creation flow named as the binding source at run time (section D, open question 5).
- `merge` patch operation. Confirmed in the model (`PatchOperation.op` enum `add`, `replace`, `merge`, `delete`) and on Manage purchasable offer (merge to update or null-delete a sub-attribute; replace "does NOT delete what you omit"; delete "Cannot target sub-attributes"). Section F now quotes both. This file and listing-writes.md were right; bullet-points.md, description.md and search-terms.md omit `merge`, and listing-content-and-health.md's "semantics unknown" is answered for `purchasable_offer`.
- Promotion and coupon report roles. Section G now states the split read on Performance Reports: coupon report Brand Analytics; promotion report Selling Partner Insights for sellers (Brand Analytics for brand-registered vendors). It matches seasonality-and-events.md; section L points to it.
- Featured Offer eligibility dates. The US help page's "As of September 2026" and the News post's July-to-end-2026 global rollout are two Amazon statements of different scope. Section A now says so and names the store's own Becoming the Featured Offer page as the run-time source. funnel-and-search.md's September-only wording is the US page's, and triggers.md's stale "eligibility tests" line is already superseded by its own gap fill. This file needed only the scope note.
- Featured Offer % denominators. Business Reports (page views, G201687550 v20 capture) against Data Kiosk `featureOfferPct` (glance views). Section L now notes that own-traffic-funnel.md and funnel-and-search.md agree and that effect-measurement.md now separates them (P-effect-measurement-44). Open question 1 now says the definition text is unchanged in v20 and only the figure's behaviour after the rollout is open.
- Figures out of skill lines. The "Who is evaluated" stable line and P-price-position-3 no longer carry the rollout dates; both now point to the store's own page. The "EU discounts" stable line and P-price-position-28 no longer state the 30-day window; the window and thresholds are read from the store's pages. The figures stay in sections A and K for human readers. Position ids are unchanged.
- Unread page wording. GQBCQZZKZQ94LL55's HTTP 400 is now recorded as "not read" rather than "unreachable", because the content call answers 400 both for rate limiting and for a page not in the layer (method/help-page-access.md A3). No capture exists for it.
- Seller-id route. The seat line on `offerIdentifier.sellerId` now quotes the model's `OfferIdentifier` wording and names the other files' routes as compatible, not contradictory.
- Contradictions on the list that do not touch this file's subjects (SQP, Keepa field sizes, Ads columns, title and search-term limits, latency, A+, images, Data Kiosk conversion) were left to their owning files. Cross-references in this file name files that exist; it cited neither inventory-and-fulfilment.md nor elements/vendor-and-hybrid.md.
