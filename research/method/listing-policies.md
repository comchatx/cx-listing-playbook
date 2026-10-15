# Listing policies: what a listing may not say or do

Read 2026-10-14 by the research seat. Tags: [official] Amazon's own page or document; [opinion] a named practitioner; [research] published research; [seat] the seat's own reasoning, never a skill position.

How the Seller Central help pages were read: each `sellercentral.amazon.com/help/hub/reference/external/<id>` page is a JavaScript shell; its body was read through the help hub's own content call (`POST /help/hub/mons-api/GetHelpTopic`, layer `external`, locale `en-US`), the same call the page makes in a browser. The URL recorded is the page's public URL. Where a page's text was also saved on 2026-10-14 as the office's capture folder (outside this repository)<page id>-v<version>.txt` (see `research/method/help-page-access.md`), the quotes in sections A–L were re-matched against that capture at reconciliation, and the version is given in *Pages read*: Product detail page rules G200390640 v21, Misleading and prohibited claims G202024200 v11, Product title requirements and guidelines GYTR6SYGFA5E3EQC v21, Product bullet point requirements GX5L8BF8GLMML6CX v11 (revision 8), Use search terms effectively G23501 v14, Product image guide G1881 v28, Suppressed listings G200898440 v13. Those pages were read on 2026-10-14; a file that calls them unreachable or behind sign-in is out of date. Whether the content call may be used as a standing route is the office's ruling (`research/method/help-page-access.md`, open question 1); no further help page was fetched through it at reconciliation. SP-API developer pages were read in their `.md` form at `developer-docs.amazon/sp-api/docs/<page>.md` (the `developer-docs.amazon.com` host redirects there). Model files were read from the `main` branch of `amzn/selling-partner-api-models`. The web-search budget for this session ran out after two searches; everything after that was reached by known URL, by links inside Amazon's own pages, or through the OpenAlex and Crossref indexes for papers.

## What this covers

**Funnel stage: none directly; it is a gate across all three.** A policy breach does not lower a click-through rate the way a weak image does. It takes the listing out of the funnel, wholly or in part, and Amazon decides how:

- **Exposure.** A listing can be suppressed from search (`SEARCH_SUPPRESSED`), and search terms that break the rules can be dropped ("Your search terms can also be eliminated, if you have used prohibited search terms").
- **Click-through.** A title that breaks the rules "might be automatically corrected or it might not appear in our search results" (title page). Amazon's seller announcements say that since 2026-07-27 a title still over the length limit is "updated to the AI recommendation gradually", with listings staying "active, editable, and searchable". The two Amazon sources differ on the search outcome (I3); what happened to a given listing is read at run time.
- **Conversion and buyability.** Prohibited bullet content "may be removed or updated". A listing can be made non-buyable (`LISTING_SUPPRESSED`) or the catalog item removed (`CATALOG_ITEM_REMOVED`).
- **The account.** The effects go past the listing to the account: Account Health Rating points, repeat-violation thresholds, deactivation.

**Skills it feeds.**

- `listing-review`: the signals that a listing has a policy problem, and where Amazon states them:
  - Listings Items `issues` with their `enforcements`.
  - The Suppressed Listings report.
  - The Account Health report's violation counts.
  - The Listings Restrictions answer.

  It also gives the families of wording that draw enforcement, so cx can see a risk in a draft or in a competitor's copy. The roadmap's rule holds: these are signals, not a checklist cx must walk.
- `references/writing.md`: the policy pages a writer cites when flagging a draft, alongside its three schema facts. Some content rules are enforced by the schema and validation, not only by policy text (see L3).
- `listing-change-log`: a change that adds or removes a claim is a compliance change. Amazon also forbids repeatedly adding and removing prohibited claims (G2), so the log is also the record that protects the seller.
- `effect-review`: suppression, attribute suppression, an Amazon title rewrite or a dropped search-terms field during an observation window are confounders. They can explain a drop before any "market" story.

**Why a senior operator cares.**

- The costliest listing mistakes are policy mistakes, not copy mistakes. Amazon rates "Manipulating search results or sales rankings" as a *critical* violation: "Any single violation with this severity immediately qualifies your account for deactivation".
- Repeat violations of one policy within 180 days can deactivate an account. Amazon's FAQ puts the maximum at "five for infringement-related policies and two for restricted products policies".
- Amazon calls dodging detection "evasive behavior", which "does not have a path to reinstatement" without proof of compliance.
- An AI that writes copy from memory of what sells will reach for exactly the words these pages forbid: "best seller", "#1", "eco-friendly", "antibacterial", "FDA approved", a competitor's brand in the search terms. That is why this file exists.
- (Gap fill.) Two more gates sit beside Amazon's listing policies:
  - **Regulators.** The FTC, FDA, CPSC, California and the EU bind the same copy whether or not Amazon enforces anything. Their penalties reach the brand and, in the FTC's cases read here, its owner personally (section M).
  - **Amazon Ads moderation.** It rejects some claims the detail page tolerates and requires ad claims to match the detail page (section O).
  - **Category and brand gating.** It decides whether a listing, an offer or a product-type change is possible at all (section N).

## Amazon's own rules and guidance

Each item is marked RULE (enforced: policy with stated consequences, schema/validation, suppression) or GUIDANCE (recommendation, best practice). Figures are for human readers; where Amazon keeps a figure at run time, that is said.

### A. Where the rules live

- **A1. RULE — the binding set is Amazon's program policies, and the account-health subset is listed separately.** "Policies included in Account Health Rating" lists the policies whose violations count toward the AHR. Those relevant to listings are:
  - Amazon Anti-Counterfeiting policy
  - Amazon Brand Name policy
  - Amazon Intellectual Property policy
  - ASIN Creation policy
  - Customer Product Reviews Policies
  - Product detail page rules
  - Restricted Products policy
  - Selling policies and seller code of conduct
  - (among others)

  The page adds: "not all of Amazon's policies are currently included in AHR", and detection uses "a combination of advanced machine learning techniques and automation and expert human review". [official] (Policies included in Account Health Rating, https://sellercentral.amazon.com/help/hub/reference/external/GQ5DSES264XVXNX7, read 2026-10-14)
- **A2. GUIDANCE that is stale — the style-guide PDFs.**
  - "Product detail page rules" tells sellers to "Comply with the relevant style guide" and links the *Amazon Services Quick Start Style Guide*. The PDF it links was created 2015-08-20.
  - "Product page style guides" links a 2018 edition (© 2018, Amazon Commercial Services Pty Ltd).
  - Both PDFs say titles should "Keep it under 200 characters", and both say bullets should "Spell out measurements, such as quart, inch, or feet" and "Write all numbers as numerals".
  - The current help pages say otherwise: "Titles must not exceed 75 characters, including spaces" (title page, GYTR6SYGFA5E3EQC v21; Product detail page rules G200390640 v21 says the same), and bullets should "Write numbers one to nine in full" and "Include a space between digit and unit" (bullet page, GX5L8BF8GLMML6CX v11).
  - Amazon's own pages carry several title-length figures at once: "under 200" (the 2015 and 2018 PDFs), 75 (title page, Product detail page rules, the 2026 seller announcements in I3), and "less than 80 characters for apparel, shoes, and luggage categories and 130 characters for all other categories" (Suppressed listings, G200898440 v13, K5). This file does not pick one. The limit a product type enforces is read at run time from `getDefinitionsProductType` (`item_name`, and `title_differentiation` where present); `research/elements/title.md` owns how the schema, the "Submit modular titles" guide and the policy pages relate.
  - For the style rules no schema keeps (numbers in words or numerals), the PDFs are dated 2015 and 2018 and the help pages are live revisions; when cx flags against one, it names the page it used and that the other differs. [official] (Product detail page rules, https://sellercentral.amazon.com/help/hub/reference/external/G200390640; Product page style guides, https://sellercentral.amazon.com/help/hub/reference/external/G200270100; Amazon Services Quick Start Style Guide PDFs 2015 and 2018; Product bullet point requirements, https://sellercentral.amazon.com/help/hub/reference/external/GX5L8BF8GLMML6CX; all read 2026-10-14)
- **A3. The category style guides** are PDFs downloadable from the templates page ("Download the style guide for your category ... on the Inventory file templates, style guides, and browse tree guides (BTG) page"). The text of "Bulk listing templates" (G1641), as served, contains no style-guide text or link. No category style guide was read in this session. [official] (Product page style guides; Bulk listing templates, https://sellercentral.amazon.com/help/hub/reference/external/G1641, read 2026-10-14)

### B. Detail-page content rules (titles, descriptions, bullets, images)

- **B1. RULE — banned content.** "None of the following are allowed in product detail page titles, descriptions, bullet points, or images":
  - "Pornographic, obscene, or offensive content".
  - "Phone numbers, addresses, email addresses, or website URLs".
  - "Details of availability, price, or condition".
  - "Links to other websites for placing orders, or alternative shipping offers, such as free shipping".
  - BMVD spoilers.
  - "Reviews, quotes, or testimonials".
  - "Requests for positive customer reviews".
  - "Adverts, promotional material, or watermarks on images, photos, or videos".
  - "Time-sensitive information".
  - "Brand-specific information, such as a brand's intellectual property, on a 'generic' product listing".
  - "Restricted phrases such as 'FSA/HSA eligible'".

  The same page bans HTML, JavaScript and other code ("As a special case, you can use line breaks </br> in the description"). It also bans all-caps throughout an attribute and "emojis, emoticons, or symbols at the beginning of each word". [official] (Product detail page rules, G200390640, read 2026-10-14)
- **B2. RULE — accuracy.**
  - "Product information must be accurate and trustworthy, and not mislead customers about the products' qualities or characteristics".
  - "Ensure that the product detail page outlines any additional items that are essential to the function of the product".
  - "All products must be accurately categorized".
  - Breaking these "may result in your selling privileges being temporarily or permanently removed". [official] (Product detail page rules)
- **B3. RULE — no cross-promotion.** "You must not use product detail pages to cross-merchandise or cross-promote a product." The bullet page adds, as a writing guideline: "Do not divert or refer to other products not included under the ASIN. Do not compare your product to competitor brands." [official] (Product detail page rules; Product bullet point requirements)
- **B4. RULE (images) — no Amazon marks or badges.**
  - No "Amazon logos or trademarks ... This includes ... 'Amazon,' 'Prime,' 'Alexa'".
  - No "badges used on Amazon ... 'Amazon's Choice,' 'Premium Choice,' ... 'Best seller,' or 'Top seller'".
  - No "images of customer reviews, five-star imagery, claims (for example, free shipping)".
  - Images that fail "cannot be uploaded to our system or may be removed from search". [official] (Product image guide, https://sellercentral.amazon.com/help/hub/reference/external/G1881, read 2026-10-14)

### C. Claims

- **C1. RULE — the claims policy.** The page is now titled "Misleading and prohibited claims"; other pages still link to it as "Prohibited product claims".
  - Scope: claims are "statements, either explicit or implied, about a product's feature, performance or benefits". The policy "applies to claims on all product detail pages, including images, descriptions, packaging and marketing materials, across all categories".
  - "Claims that are prohibited and found to be misleading may lead to enforcement actions, including product removal, listing restrictions, and account penalties."

  The four guidelines:
  - (1) Comply with applicable requirements. The example of a false claim is "'FDA Approved' or 'CE Certified'".
  - (2) Accuracy and verifiability: performance, composition, ingredients or origin "must be backed by verifiable evidence and documentation". Examples: "lasts 10 years", "100% organic", "Made in Italy" when only assembled there.
  - (3) "Refrain from unqualified superlatives": "''best'', ''100% pure'', or ''guaranteed'' should only be used when supported by verifiable and objective proof".
  - (4) No deceptive or ambiguous marketing, "including misleading pricing discounts or environmental claims".

  The list "is not exhaustive. Additional claim types may be identified and enforced as necessary." [official] (Misleading and prohibited claims, https://sellercentral.amazon.com/help/hub/reference/external/G202024200, read 2026-10-14)
- **C2. RULE — disease claims.**
  - "Amazon prohibits the sale of products that imply or claim to diagnose, cure, mitigate, treat, or prevent diseases in humans or animals without approval by the Food and Drug Administration (FDA)."
  - The page lists diseases products "cannot claim to cure, mitigate, treat, or prevent". The list includes Anti-Bacterial, Anti-Fungal, Anti-Microbial, Coronavirus/COVID-19, Depression, Diabetes, Flu, Obesity and others, as well as "Nano silver".
  - Note that "Anti-Bacterial" sits in a *disease* list here and is a *pesticide* claim in C4: one word, two policies. [official] (Misleading and prohibited claims)
- **C3. RULE + GUIDANCE — environmental claims.**
  - Rule: environmental claims "must be truthful and not misleading, and they should be supported by evidence" (claims page). "Environmental claims must follow FTC marketing guidelines ... The FTC identifies terms like 'environmentally-friendly' 'eco-friendly', and 'green' as potentially problematic" (General Listing Restrictions).
  - Rule in bullets: "eco-friendly," "environmentally friendly," "ecologically friendly," "anti-microbial," "anti-bacterial," "made from bamboo," "contains bamboo," "made from soy," "contains soy" are listed as "Prohibited claims", and "Bullet points that contain the following information may be removed or updated".
  - Why "bamboo" and "soy" sit in that list (added by the verifier): for textiles, "you may not refer to your textile product as 'bamboo' or 'soy' unless appropriately qualified by their respective generic names, rayon or viscose for bamboo and azlon for soy (e.g., rayon derived from bamboo...)". [official] (Listing restrictions that require statements or disclosures, G201707090, read 2026-10-14)
  - Guidance from the Green Guides highlights: "Avoid broad, general claims regarding a product's environmental benefits or qualities (ex., avoid 'eco-friendly' or 'environmentally friendly' or 'green')"; claims "should be specific" ("made from 20% recycled materials").
  - California rule: plastic products sold into California "may not be labeled as biodegradable, degradable, or decomposable", and "Amazon will restrict the sale" of those so labeled.
  - [official] (Misleading and prohibited claims; General Listing Restrictions, https://sellercentral.amazon.com/help/hub/reference/external/G201707070; Product bullet point requirements; Environmental Marketing Guidelines, https://sellercentral.amazon.com/help/hub/reference/external/G201893650; all read 2026-10-14)
  - An inconsistency on Amazon's own pages: "Use search terms effectively" gives, as its "Example of effective search terms", a string that contains "eco friendly". [official] (Use search terms effectively, https://sellercentral.amazon.com/help/hub/reference/external/G23501, read 2026-10-14)
- **C4. RULE — pesticide claims.**
  - "A product can be classified by the EPA as a pesticide if the product claims, states, or implies, even indirectly, that it can or should be used to prevent, destroy, repel, mitigate ... any kind of pest". Pests include "insects, mold, bacteria, mites, mildew, and animals". "For US listings, this could appear anywhere in the detail page text, on an image, or both."
  - Common claims: "Prevents, blocks, removes, neutralizes, or controls bacteria", "Sanitizes, disinfects, or sterilizes", "Resists mildew", "Removes or prevents mold".
  - Examples: "A mattress that claims to be antibacterial", "Socks or shoes that claim antimicrobial properties", "A pillow case that claims to be resistant to dust mites".
  - Requirements: such listings require EPA registration or establishment numbers or an exemption, approval to sell, US residency, a training course, and "All listings of pesticides, pesticide devices, or products that make pesticidal claims require you to input a Pesticides marking attribute".
  - Misbranding: pesticide "claims regarding the safety of the pesticide or its ingredients, such as 'safe,' 'non-poisonous,' 'non-injurious,' 'harmless,' 'non-toxic,' or 'all natural'" are prohibited.
  - The narrow exclusion for treated articles covers products that do not "make any public health claims or pesticide claims beyond preservation of the article itself".
  - The consequence for a writer: adding "antibacterial" to a towel's bullets can turn a non-regulated listing into a pesticide listing that needs EPA data and approval. [official] (Pest control products and pesticides, https://sellercentral.amazon.com/help/hub/reference/external/G202115120; General Listing Restrictions, "Pesticides, and Antimicrobial, Antifungal, Antibacterial or Pesticide Claims"; read 2026-10-14)
- **C5. RULE — FDA wording.**
  - "Products that claim to be 'FDA Cleared,' 'FDA approved' or products that include the FDA logo in associated images need to meet additional requirements" (Restricted products).
  - The FDA logo is a flat ban on the three regulated-product pages: listing attributes and images "must not: Include the FDA logo" (Medical devices and accessories; Drugs and drug paraphernalia; Dietary supplements). Unlike the "FDA approved" wording, no approval exception is given for the logo there.
  - Medical devices: may not "Claim 'FDA approved' or 'FDA cleared' unless the product has official FDA approval or clearance".
  - Drugs: "Over-the-counter monograph drugs cannot use this claim because they do not undergo premarket approval by FDA".
  - Dietary supplements: may not "Claim 'FDA approved' unless the product has official FDA approval" or "Make disease claims or implied disease claims, unless the FDA approved the statement". The supplement page also names structure/function examples ("Supports immune health"), and Non-GMO claims need documentation.
  - [official] (Restricted products, https://sellercentral.amazon.com/help/hub/reference/external/G200164330; Medical devices and accessories, …/G200164650; Drugs and drug paraphernalia, …/G200164490; Dietary supplements, …/G55N3JF2WQS7RVNE; read 2026-10-14)
- **C6. RULE — origin, guarantees, materials, specifications.**
  - "Made in USA" claims "must meet additional requirements" (FTC standard; attestation PDF).
  - "If you use phrases like 'satisfaction guaranteed' or 'money-back guarantee' on Amazon, you have to be ready to give full refunds for any reason." Bullets separately list guarantee wording ("Full refund," "If not satisfied, send it back") as prohibited content.
  - Claims that need proof "include ... made of a particular material, such as cashmere, bamboo or leather", "100% all-natural or has organic ingredients", "stated thread count", "stated storage capacity of solid-state hard drives". "You must provide Amazon with documents to support any claim you include in a listing when asked."
  - [official] (Misleading and prohibited claims; General Listing Restrictions; Product bullet point requirements)
- **C7. RULE — category-specific statements are sometimes required, not forbidden.** "Listing restrictions that require statements or disclosures" requires some content: California Proposition 65 notice, CPSIA choking-hazard statements, Energy Labeling Rule labels, textile fibre/origin disclosures. A good listing in those categories *must* say these things. [official] (Listing restrictions that require statements or disclosures, https://sellercentral.amazon.com/help/hub/reference/external/G201707090, read 2026-10-14)

### D. Sales rank, "best seller", "#1"

- **D1. RULE.** The code of conduct lists among unfair activities: "Manipulating sales rank ... or making claims about sales rank in product titles or descriptions". [official] (Selling policies and seller code of conduct, https://sellercentral.amazon.com/help/hub/reference/external/G1801, read 2026-10-14)
- **D2. RULE / GUIDANCE in the field pages.**
  - Titles: "Subjective commentary examples are 'Hot Item' or 'Best seller'". The non-compliant example is "…HOT ITEM … - BEST SELLER!!!", and "Brother Printer★…★BEST SELLER★" is the special-character counter-example.
  - Search terms: subjective words are "Prohibited", with examples "amazing, best, cheap, cheapest, effective, fastest, good deal, least, most, popular, trending".
  - Images: the "Best seller"/"Top seller" badge ban (B4).
  - [official] (Product title requirements and guidelines, https://sellercentral.amazon.com/help/hub/reference/external/GYTR6SYGFA5E3EQC; Use search terms effectively; Product image guide)

### E. Search manipulation and keyword stuffing

- **E1. RULE.** Unfair activities include "Artificially inflating web traffic (using bots or paying for clicks, for example)" and "Attempting to influence search results by inflating search ranking through keyword manipulation or incentivizing customers' searches to appear as organic behavior". [official] (Selling policies and seller code of conduct)
- **E2. RULE — severity.** The AHR FAQ's *Critical* row includes "Manipulating search results or sales rankings" and "Solicitation of product reviews or inclusion of non-compliant inserts". "Listings that provide links that prompt users to visit external websites" is *Medium*. [official] (Account health rating — the FAQ-format page, https://sellercentral.amazon.com/help/hub/reference/external/GR786P4BPEVKTBAG, read 2026-10-14)
- **E3. RULE — field-level anti-stuffing.**
  - Titles "must not contain the same word more than twice", and "brand names are also subject to the two-instance limit".
  - Search terms prohibited words: "Your brand or other brand names", "ASINs", "Profanity", "Temporary statements", "Subjective claims", "Offensive terms". "Violating the rules below may result in your ASIN being suppressed and may put the health of your selling account at risk."
  - Search-terms GUIDANCE: "Avoid repetitions", lowercase, no punctuation.
  - Search-terms length (for human readers; the figure is the schema's). The live US "Use search terms effectively" (G23501 v14) says only "Maintain the text length limit of search terms" and gives no byte figure. "Optimize your product discoverability" (G10471 v13) says "less than 250 bytes"; "Keyword attributes explained" (GF2C2L6RCFZGWBXC v4) lists `generic_keywords` at "249" in its table and states the over-limit rule: "If it exceeds the limit, the attribute is completely ignored by Amazon Search." The pages differ on the figure (249 against "less than 250") and `research/elements/search-terms.md` records schema values that differ again by marketplace. The binding limit for a SKU is the `generic_keyword` byte limit in `getDefinitionsProductType`; the "completely ignored" consequence is Amazon's own words, not only a practitioner's.
  - The page id: the live page is G23501. The id G201047930, which `research/elements/search-terms.md` takes from SellerSprite as the live page, is served by the help hub as no topic (`research/method/help-page-access.md`, A3); this file keeps G23501.
  - [official] (Product title requirements and guidelines, GYTR6SYGFA5E3EQC v21; Use search terms effectively, G23501 v14; Optimize your product discoverability, https://sellercentral.amazon.com/help/hub/reference/external/G10471, v13; Keyword attributes explained, https://sellercentral.amazon.com/help/hub/reference/external/GF2C2L6RCFZGWBXC, v4; the last two read from the 2026-10-14 captures under the office's capture folder (outside this repository))

### F. Brands, trademarks, competitors, compatibility

- **F1. RULE — brand name.**
  - "The brand value must match the name of the brand on the product". It cannot be "an ASIN's SKU, a description of the ASIN, or any other name that isn't reflected on the branded products or packaging".
  - "The misrepresentation of an ASIN's brand is prohibited."
  - Error codes 5664/5665/5668 (unapproved brand), 5461 (not approved to create for the brand), 5885–5887 (generic ASIN), 5995 (not approved to update brand). [official] (Amazon Brand Name policy, https://sellercentral.amazon.com/help/hub/reference/external/G2N3GKE5SGSHWYRZ, read 2026-10-14)
- **F2. RULE — generic products.** "Using another brand's intellectual property in your generic product listing, or listing a branded product as generic, are violations of our listing policies." A "generic" brand value can never be changed. [official] (Amazon generic product policy, https://sellercentral.amazon.com/help/hub/reference/external/G84H3T69ZX762NWT, read 2026-10-14)
- **F3. RULE — compatibility statements are allowed, in a fixed shape.**
  - A seller may use another's trademark "When making truthful statements that a product is compatible with a trademarked product ... You cannot use a logo to indicate compatibility, only the brand name. Any statement you make about compatibility must be true."
  - In the title: "If you do not apply this format to your product title, your listing may be removed as potentially trademark infringing". The format is:
    - "[Your Product's Brand Name] + [Product Name] + 'for'/'compatible with'/'fits'/'intended for' + [Brand of Main Product] + [Main Product Name]".
    - For generics: "'Generic' + [Product Name] + 'for'/'compatible with'/'fits'/'intended for' + …".
    - For customizable products the page gives a third format: "Customized"/"Personalized" + [Product Name] + "created using"/"personalized from"/"made with" + [Brand of Main Product] + [Main Product Name].
  - The same terms are to be used "in the bullet point and product description as well".
  - The test question Amazon gives: "Did I use a brand name or trademark in a non-confusing and truthful manner to describe compatibility (generally allowed) instead of similarity (not allowed)?"
  - [official] (Intellectual property policy for sellers - trademarks, https://sellercentral.amazon.com/help/hub/reference/external/GZUQ6GBBXQVHQKF2, read 2026-10-14)
  - From the rights-owner side: "We do not enforce notices seeking to remove true statements indicating compatibility with trademarked products." [official] (Intellectual property for Rights Owners and Registered Agents, https://sellercentral.amazon.com/help/hub/reference/external/GU5SQCEKADDAQRLZ, read 2026-10-14)
- **F4. RULE — comparative claims, on the trademark page.**
  - Comparisons "must be truthful and not misleading", "substantiated on a reasonable basis", "must use language that clearly indicates a comparison is being made (for example, ''compare to''), and on what basis".
  - They "may use word marks but should avoid logo use, and should not present the comparison product more prominently than the product offered for sale".
  - This sits beside the bullet page's GUIDANCE "Do not compare your product to competitor brands" (B3). The two pages differ in strictness; the bullet page is the narrower one for bullets. [official] (Intellectual property policy for sellers - trademarks; Product bullet point requirements)
- **F5. RULE — IP enforcement reaches the account.** "Even if a seller is infringing IP without knowledge, we will still take action". "Amazon terminates the accounts of repeat infringers in appropriate circumstances." [official] (Intellectual Property Policy, https://sellercentral.amazon.com/help/hub/reference/external/G201361070, read 2026-10-14)

### G. ASIN creation, variations, and what an edit may do

- **G1. RULE — edits must stay the same product.**
  - "You may only update detail pages to better or more accurately describe the product as originally listed."
  - "You must not use an existing listing for a new version of a product. This includes changes in color, size, material, features, and product name."
  - "Never modify the trademark information on an existing ASIN." [official] (Product detail page rules)
- **G2. RULE — no claim cycling, no evasion.**
  - "You may not update detail pages to repeatedly add and remove prohibited claims".
  - "Listing products on Amazon in a manner to avoid detection is considered evasive behavior. Evasive behavior does not have a path to reinstatement unless you provide valid proof of your adherence to all applicable laws and Amazon policies."
  - Purposefully inaccurate or miscategorized listings "to circumvent" restrictions risk "immediate termination of selling privileges". [official] (Product detail page rules; Restricted products)
- **G3. RULE — variations and ASIN creation.**
  - Prohibited: "Changing the product's detail page (parent or child) to become fundamentally different from the original product listed".
  - Prohibited: "adding products that are newer versions or models of the parent ASIN".
  - Prohibited: "Adding multi-pack variations that aren't manufacturer-created".
  - The reviews policy separately forbids creating "a variation relationship between products with the aim of manipulating reviews". ASIN creation is also limited weekly; the page states "a weekly creation limit of 2,000 ASINs". [official] (ASIN creation policy, https://sellercentral.amazon.com/help/hub/reference/external/G201844590; Customer product reviews policies, https://sellercentral.amazon.com/help/hub/reference/external/GYRKB5RU3FS5TURN; read 2026-10-14)

### H. Reviews

- **H1. RULE.**
  - The policy forbids:
    - incentives for reviews;
    - asking for positive reviews only;
    - "Solicit reviews only from customers who had a positive experience";
    - reviewing one's own or a competitor's product;
    - diverting negative reviews.
  - "Amazon has a zero-tolerance policy towards any customer reviews violations". Consequences include "Permanent delisting of the product" and "removal of all the product's reviews".
  - Listing copy is in scope through B1: no reviews, quotes, testimonials or review requests on the page. [official] (Customer product reviews policies; Selling policies and seller code of conduct; Product detail page rules)

### I. Text style rules (cross-reference)

- **I1. RULE — titles.** The full title rules are in `research/elements/title.md`. In brief:
  - The current page bars "!, $, ?, _, {, }, ^, ¬, ¦".
  - It allows ~ # < > * "only in specific contexts".
  - "Decorative usage of special characters is not allowed".
  - No promotional phrases ("free shipping").
  - Brand-name characters go "in the 'Brand name' field. Special characters in the brand field are exempt from title requirements".

  The Amazon staff post opening the January 2025 "Ask Amazon" thread (by Jameson_Amazon; the page shows only a relative date) had said the characters "are not allowed, unless they are part of the brand name". The 2026 page no longer states an exemption for the title text itself; it tells sellers to enter such brand names in the "Brand name" field, where special characters "are exempt from title requirements". Whether that is a narrowing in enforcement is the seat's reading, not Amazon's word (open question 8). [official] (Product title requirements and guidelines; "[Now Closed] Ask Amazon - GET ANSWERS on New Product Title Policy on January 8th", https://sellercentral.amazon.com/seller-forums/discussions/t/3c9f0b3c-4594-4efc-a05f-0f8d371fa466, effective date stated there "January 21, 2025", read 2026-10-14)
- **I2. RULE — bullets.** Prohibited:
  - special characters "™, ®, €, …, †, ‡, o, ¢, £, ¥, ©, ±, ~, â";
  - emojis;
  - placeholder text;
  - ASINs;
  - the prohibited claims (C3);
  - guarantee information;
  - external information;
  - repetitive content;
  - all caps;
  - abbreviations;
  - content for dedicated fields.

  "Bullet point character limits vary by product type." Full detail is in `research/elements/bullet-points.md`. [official] (Product bullet point requirements)
- **I3. Since 2026-07-27, over-length titles move to Amazon's AI recommendation; Amazon's sources differ on what else happens to a non-compliant title.** "After July 27, any titles still over 75 characters will be updated to the AI recommendation gradually. Your listings stay active throughout this process, and you can make changes to your titles and Item Highlights at any time." Brand owners "will have 14 days before implementation to review, modify, and approve AI-generated recommendations for titles and Item Highlights in Review Listings Changes." The same post gives the companion field's limit: "Item Highlights provides an additional 125 characters", and "This content is searchable and visible with titles in search results and on product detail pages." [official] (Updates to improve your product titles begin on July 27, https://sellercentral.amazon.com/seller-forums/discussions/t/145b6d0f-999c-4555-896c-c694bda2e470, News_Amazon; the page shows "Jun 10, 2026" as its latest moderator revision and no original posting date; read 2026-10-14, re-read in the gap fill the same day)
  - The follow-up post by News_Amazon, "Answers to your product title update questions" (opened at reconciliation; it shows no posting date, only a relative "updated by moderator" line; `research/elements/title.md` records its thread record as created 2026-07-29), says: "On July 27, 2026, we began making recommendations, using your existing product titles, on non-compliant listings." "These changes will take place throughout 2026", and listings "will remain active, editable, and searchable, even if they haven't been updated yet." The words "non-compliant listings" are in this follow-up, not in the July 27 post above; both are News_Amazon's.
  - Both posts cover titles nobody updated: a title "still over 75 characters" is in scope. A file that says Amazon does not change titles nobody updated is wrong for that case.
  - Amazon's sources disagree on the outcome for a non-compliant title, and this file does not pick one:
    - The posts: over-length titles are rewritten "gradually", and listings stay "active, editable, and searchable".
    - The title page (GYTR6SYGFA5E3EQC v21): if an already-listed title "doesn't comply with these requirements or contains inaccurate information, the title might be automatically corrected or it might not appear in our search results". Its troubleshooting table also has a "Title suppression" row and a "Title blocked due to policy violations" row. The page does not limit these to the non-length rules.
    - The developer guide "Submit modular titles", as recorded in `research/elements/title.md` (not re-read here): "This change does not affect your current listings unless you submit an update."
    - So "rewrite, not takedown" is the announced route for over-length titles only, and not a promise even there. What happened to a given listing is read at run time: `getListingsItem` `issues` (`enforcements.actions`, e.g. `SEARCH_SUPPRESSED`) and `summaries.status`, and the catalog value from `getCatalogItem` against the submitted `attributes`. Whether the rollout is still running is read from Amazon's latest announcement.
  - The 125-character Item Highlights figure appears on the July 27 post, the follow-up ("Item highlights (125 characters)"), the title page v21 ("Item highlights provide an additional 125 characters") and Product detail page rules G200390640 v21 ("a character limit of 125 characters (including spaces)"). These pages agree today, but the figure is one Amazon sets by announcement and keeps in the schema: the binding limit for a product type is `title_differentiation` in `getDefinitionsProductType`.
  - [official] (Answers to your product title update questions, News_Amazon, https://sellercentral.amazon.com/seller-forums/discussions/t/302aaac6-6f2b-4d86-bcd2-36fe24f0e6cd, read 2026-10-14; Product title requirements and guidelines, GYTR6SYGFA5E3EQC v21; Product detail page rules, G200390640 v21)

### J. Offensive and controversial content; restricted products

- **J1. RULE.** Prohibited: products and listings that "promote, incite, or glorify hatred, violence, or intolerance toward protected groups". Products tied to human tragedies are prohibited unless commemorative, historical or academic. Products "intended for use by children that contain adult content, profanity, or sexual references" are prohibited. "Amazon may remove any listing at any time at its sole discretion." [official] (Offensive and controversial materials, https://sellercentral.amazon.com/help/hub/reference/external/G200164670, read 2026-10-14)
- **J2. RULE — restricted products and approval.**
  - "Certain categories require you to obtain pre-approval from Amazon before listing".
  - "Listing a restricted product, even unintentionally, may result in enforcement action, including listing removal, account suspension, or loss of selling privileges."
  - The "Product compliance" link now lands on a page titled "Safety, compliance, and product restrictions".
  - "Product categories with enhanced safety listing compliance requirements" says "Amazon notifies you in Account Health if your products must meet these requirements" and "This list changes as Amazon adds new categories". [official] (Restricted products; Safety, compliance, and product restrictions, https://sellercentral.amazon.com/help/hub/reference/external/GXMGGPL6LC4CVXHT; Product categories with enhanced safety listing compliance requirements, https://sellercentral.amazon.com/help/hub/reference/external/GUQ848NB5HZ6M6A4; Category, product, and listing restrictions, https://sellercentral.amazon.com/help/hub/reference/external/G200301050; read 2026-10-14)
- **J3. Climate Pledge Friendly is a certification badge, not a claim.**
  - The seller hub says the program "collaborates with trusted third-party certifications and creates its own certifications". Shoppers "Look for the leaf icon and the sustainability features label". It links to a Seller Central "Get started" page (`sellercentral.amazon.com/sustainability/program/cpf`), which needs sign-in and was not read.
  - The launch article said the label signifies "one or more of 19 different sustainability certifications", including Amazon's own "Compact by Design". That count is at launch; it is history, not a current figure.
  - [official] (Sustainability Solutions Hub | Sell on Amazon, https://sell.amazon.com/programs/sustainability; Amazon launches "Climate Pledge Friendly" program, https://www.aboutamazon.com/news/sustainability/amazon-launches-climate-pledge-friendly-program, no date shown; read 2026-10-14)

### K. Enforcement map: suppression vs account health

- **K1. Listing-level enforcement (the SP-API's own words).** The Listings Items model's `Issue` carries:
  - `severity`: `ERROR` ("preventing the submission from processing"), `WARNING`, `INFO`.
  - `categories`: `INVALID_ATTRIBUTE`, `MISSING_ATTRIBUTE`, `INVALID_IMAGE`, `MISSING_IMAGE`, `INVALID_PRICE`, `MISSING_PRICE`, `DUPLICATE`, `QUALIFICATION_REQUIRED`, `PRODUCT`, `LISTING`.
  - `enforcements.actions[].action`:
    - `LISTING_SUPPRESSED`: "takes down the current listing item's buyability".
    - `ATTRIBUTE_SUPPRESSED`: "An attribute's value on the listing item is invalid, which causes it to be rejected".
    - `CATALOG_ITEM_REMOVED`: "all offers against it ... are non-buyable".
    - `SEARCH_SUPPRESSED`: "the catalog item is hidden from search results".
  - `enforcements.exemption.status`: `EXEMPT`, `EXEMPT_UNTIL_EXPIRY_DATE` (with `expiryDate`), `NOT_EXEMPT` ("Amazon has already taken the specified enforcement actions").
  - The listing summary's `status` is `BUYABLE` / `DISCOVERABLE`.
  - [official] (listingsItems_2021-08-01.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-items-api-model/listingsItems_2021-08-01.json, read 2026-10-14)
- **K2. Synchronous vs asynchronous.** "Accepted does not mean the process is complete ... any of these processes can generate issues that return asynchronously." Issues are read with `getListingsItem` / `searchListingsItems` and `includedData=issues`, or arrive as the `LISTINGS_ITEM_ISSUES_CHANGE` notification, whose payload carries `Severities` and `EnforcementActions`. [official] (Manage Listings Issues, https://developer-docs.amazon.com/sp-api/docs/manage-listings-issues, page updatedAt 2026-09-09, read 2026-10-14)
- **K3. Account-level enforcement — AHR.** For human readers; the score lives on the Account Health page:
  - The scale runs 0–1,000. New sellers start at 200.
  - "Healthy" is 200–1,000, "At Risk" 100–199, "Unhealthy" 99 or lower.
  - The evaluation window is 180 days.
  - Point values "typically range from two to eight". Critical violations set the score to zero, with "a three-day grace period".
  - Sellers "gain four points for every 200 successful orders".
  - Repeat-violation caps per policy in 180 days: "five for infringement-related policies and two for restricted products policies".
  - Closing or deleting a listing does not remove a violation ("Listings aren't removed from the Account Health page if you change the listing status").
  - [official] (Account Health Rating program policy, https://sellercentral.amazon.com/help/hub/reference/external/G200205250; Account health rating (FAQ-format page), GR786P4BPEVKTBAG; read 2026-10-14)
- **K4. The account-health categories as Amazon's report names them.** The Seller Performance Report (`GET_V2_SELLER_PERFORMANCE_REPORT`, "Contains the individual performance metrics data from the Seller Central Account Health dashboard", role Selling Partner Insights, "can only be requested") lists these per-store metrics:
  - `accountHealthRating` (with `ahrStatus`, `ahrScore` on the doc page)
  - `listingPolicyViolations`
  - `productAuthenticityCustomerComplaints`
  - `productConditionCustomerComplaints`
  - `productSafetyCustomerComplaints`
  - `receivedIntellectualPropertyComplaints`
  - `restrictedProductPolicyViolations`
  - `suspectedIntellectualPropertyViolations`
  - `foodAndProductSafetyIssues`
  - `customerProductReviewsPolicyViolations`
  - `otherPolicyViolations`
  - `documentRequests`
  - `policyViolationWarnings`

  Each violation metric has a `defectsCount`, `status`, `targetValue` and `targetCondition`. The published JSON schema `accountHealthReport-2020-11-18.json` on `main` lacks `customerProductReviewsPolicyViolations`, `policyViolationWarnings` and `ahrScore`, and its `accountHealthRatingStatus` enum is `GREAT`/`WARNED`; the doc page and the schema differ. [official] (Performance Reports, https://developer-docs.amazon.com/sp-api/docs/report-type-values-performance, read 2026-10-14; accountHealthReport-2020-11-18.json, https://github.com/amzn/selling-partner-api-models/blob/main/schemas/reports/accountHealthReport-2020-11-18.json, read 2026-10-14)
- **K5. Suppressed listings.**
  - The Suppressed Listings Report (`GET_MERCHANTS_LISTINGS_FYP_REPORT`, role Product Listing) "Contains suppressed listings, the reason each listing is suppressed, and instructions for removing each suppression". Its columns are Status, Reason, SKU, ASIN, Product name, Condition, Status Change Date, Issue Description.
  - The "Suppressed listings" help page says Amazon "will hide (or suppress) from search and browse non-media listings that do not meet certain standards". It names missing images, category, titles, price per unit and category-specific child attributes, such as Shoes without department, size and color.
  - That page (v13, live on 2026-10-14) gives "less than 80 characters for apparel, shoes, and luggage categories and 130 characters for all other categories". The title page (GYTR6SYGFA5E3EQC v21) and Product detail page rules (G200390640 v21), also live, give 75. Two live Amazon pages disagree; this file names both and does not choose. The limit that binds a product type is read at run time from `getDefinitionsProductType` (A2), and whether a given listing is suppressed is read from its `issues` and the Suppressed Listings report, not inferred from either figure.
  - [official] (Inventory Reports, https://developer-docs.amazon.com/sp-api/docs/report-type-values-inventory, read 2026-10-14; Suppressed listings, https://sellercentral.amazon.com/help/hub/reference/external/G200898440, read 2026-10-14)
- **K6. Listing-privilege consequences.** "Violations of Amazon's listing policies may result in actions such as: Cancellation of listings; Limits on listing privileges; Suspension of listing privileges; Removal of listing privileges." [official] (Listing restrictions, https://sellercentral.amazon.com/help/hub/reference/external/G200832300, read 2026-10-14)
- **K7. May this seller list this ASIN at all?** `getListingsRestrictions` "Returns listing restrictions for an item in the Amazon Catalog". Reasons are `APPROVAL_REQUIRED`, `ASIN_NOT_FOUND` or `NOT_ELIGIBLE`, with "path forward links". "If there are no restrictions ... the list of restrictions in the response will be empty." [official] (listingsRestrictions_2021-08-01.json; Get listings restrictions for an item in the catalog, https://developer-docs.amazon.com/sp-api/docs/get-listings-restrictions; Listings Restrictions API, https://developer-docs.amazon.com/sp-api/docs/listings-restrictions-api; read 2026-10-14)

### L. Policy enforced by the schema and validation, not only by text

- **L1.** "Listings data submitted to the Listings Items API must conform to the JSON Schema format provided by the Selling Partner API for Product Type Definitions ... Verify required and conditionally required attributes, as dynamic conditions may change requirements based on other attribute values." [official] (Manage Listings Issues)
- **L2.** `VALIDATION_PREVIEW` "Indicates the submitted data should be validated without persisting to the selling partner's catalog". It "has lower rate limits and is intended for testing a small number of listings. It is not designed for production workflows." [official] (patchListingsItem parameter in listingsItems_2021-08-01.json; Manage Listings Issues)
- **L3.** The validation-preview code map includes content rules: "No URLs rule violated" (90001132 → 90196), "Illegal markup" (90006958 → 100339), "Max length rule violated" (90004145 → 90225), "Generic ASIN merchant not authorized" (100334 → 5886), "Merchant not authorized to update" (5461 → 5995). The B1 bans on URLs and code are therefore checked by machine, not left to text alone. [official] (Manage Listings Issues)

*Sections M–Q were added by the gap fill of 2026-10-14. In it, Seller Central help pages were not read through the help hub's content call; that call was refused by this session's permission system. A help page cited in M–Q was therefore either reached by a public route or is marked unread. Regulators' own texts are tagged **[official — regulator]**: the regulator's published words (statute, regulation, Federal Register, agency page). For a skill they weigh as [official] does, but they are not Amazon's.*

### M. Regulators' rules that bind listing copy whatever Amazon enforces

**M1. FTC Rule on the Use of Consumer Reviews and Testimonials, 16 CFR Part 465.** RULE (federal regulation).
- Status. "This rule is effective October 21, 2024." [official — regulator] (Trade Regulation Rule on the Use of Consumer Reviews and Testimonials; Final Rule, 89 FR 68034, Federal Register, 2024-08-22, https://www.govinfo.gov/content/pkg/FR-2024-08-22/html/2024-18519.htm, read 2026-10-14)
  - Announced 2024-08-14 under the title "Federal Trade Commission Announces Final Rule Banning Fake Reviews and Testimonials". The rule lets the FTC "seek civil penalties against knowing violators". [official — regulator] (FTC press release, https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials, read 2026-10-14)
- Scope words. "Consumer testimonial means an advertising or promotional message ... that consumers are likely to believe reflects the opinions, beliefs, or experiences of a consumer". "consumer reviews include consumer ratings regardless of whether they include any text or narrative". [official — regulator] (16 CFR § 465.1, https://www.law.cornell.edu/cfr/text/16/465.1, read 2026-10-14)
- **Fake or false reviews and testimonials (§ 465.2).**
  - A business may not "write, create, or sell" a review or testimonial that materially misrepresents "That the reviewer or testimonialist exists", that they used the product, or "The reviewer's or testimonialist's experience".
  - It may not purchase a review, or "disseminate or cause the dissemination of a consumer testimonial or celebrity testimonial", that it "knew or should have known" was false in those ways.
  - It may not procure such a review from "its officers, managers, employees, or agents, or any of their immediate relatives, for posting on a third-party platform".
  - Exempt: reviews that "resulted from a business making generalized solicitations to purchasers".
  - [official — regulator] (16 CFR § 465.2, https://www.law.cornell.edu/cfr/text/16/465.2, read 2026-10-14)
  - What "generalized" means, in the Commission's own explanation: "solicitations made only to customers whom the business believes to be happy customers would not be ``generalized solicitations''". [official — regulator] (Federal Register final rule, above)
- **Buying reviews (§ 465.4).** A business may not "provide compensation or other incentives in exchange for, or conditioned expressly or by implication on, the writing or creation of consumer reviews expressing a particular sentiment, whether positive or negative". "Purchase a consumer review" covers "money, gift certificates, products, services, discounts, coupons, contest entries, or another review". [official — regulator] (16 CFR § 465.4 and § 465.1(m), https://www.law.cornell.edu/cfr/text/16/465.4, read 2026-10-14)
- **Insider reviews and testimonials (§ 465.5).**
  - An officer or manager may not write a review or testimonial about the business "that fails to have a clear and conspicuous disclosure of the officer's or manager's material relationship to the business".
  - A business may not disseminate a testimonial by "its officers, managers, employees, or agents" without that disclosure when "the business knew or should have known the testimonialist's relationship".
  - "Clear and conspicuous" in an online medium means the disclosure "must be unavoidable"; it is not so "if a consumer must take any action, such as clicking on a hyperlink or hovering over an icon, to see it" (§ 465.1(c)(4)).
  - [official — regulator] (16 CFR § 465.5, https://www.law.cornell.edu/cfr/text/16/465.5, read 2026-10-14; § 465.1)
- **Review suppression (§ 465.7).** Anyone is barred from "an unfounded or groundless legal threat, a physical threat, intimidation, or a public false accusation" made to prevent a review or to "Cause a review or any portion thereof to be removed". A business may not misrepresent that the reviews it displays "represent most or all the reviews submitted" while suppressing reviews "based upon their ratings or their negative sentiment". [official — regulator] (16 CFR § 465.7, https://www.law.cornell.edu/cfr/text/16/465.7, read 2026-10-14)
- **How this meets listing copy.** Amazon already bans "Reviews, quotes, or testimonials" in titles, descriptions, bullets and images (B1). The FTC rule adds legal exposure for the brand when a testimonial is fabricated, comes from an insider without disclosure, or was paid for by sentiment, wherever it appears: A+ content, brand store, video, packaging shown in images, ads. Amazon's B1 ban and the FTC rule overlap but are not the same test.
- **Enforcement since.** On 2025-12-22 the FTC warned ten companies. The letters warn of a federal lawsuit and "civil penalties of up to $53,088 per violation", and "are not formal determinations that the recipients have violated the Consumer Review Rule". [official — regulator] (FTC Warns 10 Companies About Possible Violations of the Agency's New Consumer Review Rule, https://www.ftc.gov/news-events/news/press-releases/2025/12/ftc-warns-10-companies-about-possible-violations-agencys-new-consumer-review-rule, read 2026-10-14)
- **An Amazon-seller precedent (before the rule).** In 2019 the FTC sued an Amazon supplement seller and its owner for buying Amazon reviews. The owner told the review website's operator that "his product needed to have an average rating of 4.3 out of 5 stars", and the defendants' page claimed "Literally BLOCKS FAT From Forming." The order:
  - "a judgment of $12.8 million, which will be suspended upon payment of $50,000 to the Commission";
  - a duty "to notify Amazon, Inc. that they purchased Amazon reviews";
  - a prohibition on "weight-loss, appetite-suppression, fat-blocking, or disease-treatment claims" (the conditions under which such claims may be made were not read in full).

  [official — regulator] (FTC Brings First Case Challenging Fake Paid Reviews on an Independent Retail Website, 2019-02-26, https://www.ftc.gov/news-events/news/press-releases/2019/02/ftc-brings-first-case-challenging-fake-paid-reviews-independent-retail-website, read 2026-10-14)

**M2. FTC Made in USA Labeling Rule, 16 CFR Part 323.** RULE (federal regulation). Amazon's "Made in USA" requirement (C6) rests on this.
- The standard: it is unfair or deceptive "to label any product as Made in the United States unless the final assembly or processing of the product occurs in the United States, all significant processing that goes into the product occurs in the United States, and all or virtually all ingredients or components of the product are made and sourced in the United States." [official — regulator] (16 CFR § 323.2, https://www.law.cornell.edu/cfr/text/16/323.2, read 2026-10-14)
- What counts as the claim: "any unqualified representation, express or implied, that a product ... is of U.S. origin, including ... 'made,' 'manufactured,' 'built,' 'produced,' 'created,' or 'crafted' in the United States or in America". [official — regulator] (16 CFR § 323.1(a), read 2026-10-14)
- Mail order covers online: "mail order promotional material" includes materials "disseminated in print or by electronic means" that solicit purchase "without examining the actual product" (§ 323.1(b)). A seal, mark, tag or stamp in such material must comply (§ 323.3). [official — regulator] (16 CFR §§ 323.1, 323.3, read 2026-10-14)
  - [seat] An Amazon detail page fits that definition. A flag badge in an image is a "seal, mark, tag, or stamp".
- FTC business guidance:
  - The standard covers "marketing through digital or electronic mechanisms, such as Internet, email, or social media".
  - Qualified claims ("60% U.S. content", "Made in USA of U.S. and imported parts") are the route when the product is not all or virtually all U.S.-made.
  - "Assembled in USA" requires substantial U.S. assembly; "a simple 'screwdriver' assembly in the U.S. of foreign components" usually does not qualify.
  - "Marketers are now subject to civil penalties if they use an unqualified Made in USA label".
  - [official — regulator] (Complying with the Made in USA Standard, https://www.ftc.gov/business-guidance/resources/complying-made-usa-standard, page dated July 2024, read 2026-10-14)
- Amazon is on notice. On 2025-07-08 the FTC's Bureau of Consumer Protection wrote to Amazon. Third-party sellers had made "unqualified United States origin claims on product listings, packaging, and labeling, such as by claiming that their products are 'Made in the USA' or '100% USA Made,' even though the third-party seller is based outside the United States or the product listing describes the item as 'imported.'" The letter asks that Amazon "monitor, identify, and take corrective action against third-party sellers". It "does not reflect any assessment as to whether Amazon has engaged in conduct violative". [official — regulator] (FTC letter to Amazon.com, Inc., "Misleading Made in USA Representations by Third-Party Sellers", 2025-07-08, https://www.ftc.gov/system/files/ftc_gov/pdf/amazon-musa-letter.pdf; Federal Trade Commission Warns Companies to Comply with "Made in USA" Requirements, https://www.ftc.gov/news-events/news/press-releases/2025/07/federal-trade-commission-warns-companies-comply-made-usa-requirements; both read 2026-10-14)
  - Besides the "imported" case, the letter's footnoted examples include a listing with "conflicting statements" that the product's country of origin is both the USA and another country. Such a conflict is visible in the listing's own data. (Its examples name real sellers and listings; none is copied here.)
- The first penalty case under the rule (2022) was brought against the company "and its owner, Steven Tartaglia". The civil penalty was "equal to three times Lithionics' profits attributable to the illegal activity". The claims "appeared on the company website, on its social media accounts, and in mail order catalogs", including "photographs of products bearing this label". [official — regulator] (FTC Enforces New Made in USA Rule against Lithionics and Owner Steven Tartaglia ..., 2022-04-13, https://www.ftc.gov/news-events/news/press-releases/2022/04/ftc-enforces-new-made-usa-rule-against-lithionics-owner-steven-tartaglia-falsely-labeling-foreign, read 2026-10-14)

**M3. Recyclability and "chasing arrows".**
- **Federal guidance (FTC Green Guides, 16 CFR § 260.12).** GUIDANCE in form, enforced through FTC Act § 5.
  - "It is deceptive to misrepresent, directly or by implication, that a product or package is recyclable."
  - Unqualified claims are possible "When recycling facilities are available to a substantial majority of consumers or communities where the item is sold"; "'substantial majority' ... means at least 60 percent". Below that, "marketers should qualify all recyclable claims".
  - "If any component significantly limits the ability to recycle the item, any recyclable claim would be deceptive."
  - A symbol is a claim. In the Guides' example of a resin code (the number inside triangular arrows) placed prominently on a front label, "This conspicuous use of the RIC constitutes a recyclable claim."
  - [official — regulator] (16 CFR § 260.12 Recyclable claims, https://www.law.cornell.edu/cfr/text/16/260.12, read 2026-10-14)
  - Substantiation: claims need "a reasonable basis", which "often requires competent and reliable scientific evidence". [official — regulator] (16 CFR § 260.2, read 2026-10-14)
- **California SB 343.** RULE (state statute), with its enforcement under court order.
  - The law "prohibits use of the chasing arrows or any other indicator of recyclability on products and packaging unless certain criteria are met". It "outlaws manufacturers and others from selling products or packaging labeled as recyclable unless the items are regularly collected and processed for recycling in the state."
  - Compliance date October 4, 2026, "18 months after publication of the Final Findings Report". The restrictions "apply to products and packaging manufactured after October 4, 2026", "regardless of when they are sold".
  - Litigation: "On July 14, 2026, the federal court in California League of Food Producers v. Bonta (No. 3:26-CV-01675, California Southern District Court) issued a preliminary injunction." "The injunction only blocks enforcement of SB 343." It does not stop CalRecycle's study updates "in 2027 and every 5 years thereafter".
  - [official — regulator] (SB 343: Accurate Recycling Labels, CalRecycle, https://calrecycle.ca.gov/wcs/recyclinglabels/, read 2026-10-14; no page date shown, latest dated item 2026-06-24)
  - Whether SB 343 reaches the words of an online listing, and not only labels and packaging, was not read in the statute (open question 13). The CalRecycle page speaks of "products and packaging".
- Amazon's own pages read in this file treat environmental claims under the FTC Green Guides (C3). This file holds no Amazon page that names SB 343 or recyclability claims specifically.
- Other states' recyclability rules were not researched (open question 14).

**M4. Health claims: the FTC's substantiation bar.** GUIDANCE (agency compliance guidance on FTC Act § 5).
- Health claims need "competent and reliable scientific evidence". That generally means "randomized, controlled human clinical testing".
- Testimonials are not proof: "It's not enough that a testimonial represents the honest opinion or experience of an endorser". Anecdotal evidence is "never sufficient to substantiate claims about the effects of a health product".
- Advertising includes content "on the internet and in other digital content".
- [official — regulator] (Health Products Compliance Guidance, https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance, no date shown in the read portion, read 2026-10-14; the page's last 28,000 characters were not read)
- This is the regulator's version of Amazon's "verifiable evidence" rule (C1(2)). Under it, a customer review can never be the proof behind a health claim.

**M5. Penalties that reach the brand, not the listing.**
- FTC civil penalty ceiling. It rose "from $51,744 to $53,088" in 2025. [official — regulator] (FTC Publishes Inflation-Adjusted Civil Penalty Amounts for 2025, 2025-02-11, https://www.ftc.gov/news-events/news/press-releases/2025/02/ftc-publishes-inflation-adjusted-civil-penalty-amounts-2025, read 2026-10-14)
  - For 2026, "the Federal Trade Commission ('FTC')'s civil penalty amounts will remain unchanged during 2026. The FTC will continue to apply the 2025 civil penalty levels." The reason: OMB memorandum M-26-11 cancelled the adjustment because October 2025 CPI-U data were not produced. [official — regulator] (Civil Penalty Inflation Adjustments, 91 FR 58446, 2026-09-15, https://www.govinfo.gov/content/pkg/FR-2026-09-15/html/2026-18853.htm, read 2026-10-14)
  - The figure is per violation and is adjusted by notice. A skill names the rule, not the number.
- Made in USA: the 2021 rule announcement gave "civil penalties of up to $43,280 per violation of the rule" (the then-current level). [official — regulator] (FTC Issues Rule to Deter Rampant Made in USA Fraud, 2021-07-01, https://www.ftc.gov/news-events/news/press-releases/2021/07/ftc-issues-rule-deter-rampant-made-usa-fraud, read 2026-10-14)
  - Owners were named personally in both FTC cases read here (M1, M2).
- EU: Member States set penalties for GPSR breaches by "economic operators and providers of online marketplaces"; they "shall be effective, proportionate and dissuasive". [official — regulator] (Regulation (EU) 2023/988, Article 44, read 2026-10-14; see Q1)
- Amazon's own layer stays separate: a regulator's case can exist with no Amazon enforcement, and an Amazon enforcement says nothing about legality.
- [seat] Hence a flag carries two sources when both exist: the Amazon page and the regulator's text.

### N. Category, brand and product gating; the Request approval path

- **N1. RULE — the restriction reasons, in the model's own words.** `getListingsRestrictions` "Returns listing restrictions for an item in the Amazon Catalog." Each `Reason` has a `message`, a `reasonCode` and optional `links`. The `reasonCode` values:
  - `APPROVAL_REQUIRED`: "Approval is required to create a listing for the specified ASIN. A path forward link will be provided that may allow Selling Partners to remove the restriction."
  - `ASIN_NOT_FOUND`: "The specified ASIN does not exist in the requested marketplace."
  - `NOT_ELIGIBLE`: "Not eligible to create a listing for the specified ASIN. No path forward link will be provided to remove the restriction."

  Each `Link` carries `resource` (URI), `verb` (only `GET`), `title` and `type`. The model's example is a link titled "Request Approval via Seller Central." pointing to `https://sellercentral.amazon.com/hz/approvalrequest/restrictions/approve?asin=<ASIN>`, under the message "You cannot list the product in this condition." [official] (listingsRestrictions_2021-08-01.json, https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-restrictions-api-model/listingsRestrictions_2021-08-01.json, re-read 2026-10-14)
- **N2. RULE — the call's parameters.**
  - Required: `asin`, `sellerId`, `marketplaceIds`.
  - Optional: `conditionType` (13 values, `new_new` to `club_club`) and `reasonLocale`.
  - Optional `productType`: "The product type of the item. When provided with the brand name, the API evaluates GTIN exemption restrictions in addition to brand restrictions for the specified product type."
    - Neither the model nor the reference page carries a brand parameter, so what "the brand name" refers to is unclear (open question 10).
  - Each marketplace in `marketplaceIds` "counts as a separate request against the rate limit".
  - "If there are no restrictions for the specified `conditionType` (when provided) in the specified Amazon store, the list of restrictions in the response will be empty."
  - Role: Product Listing; regions NA, EU, FE. The rate figures are the model's and door.md's, not this file's.
  - [official] (listingsRestrictions_2021-08-01.json; getListingsRestrictions reference, https://developer-docs.amazon/sp-api/reference/getlistingsrestrictions.md; Get listings restrictions for an item in the catalog, https://developer-docs.amazon/sp-api/docs/get-listings-restrictions.md, updatedAt 2026-09-30; Listings Restrictions API, https://developer-docs.amazon/sp-api/docs/listings-restrictions-api.md, updatedAt 2026-09-29; all read 2026-10-14)
- **N3. GUIDANCE — where the check sits in Amazon's own workflow.** For an item already in the catalog, Amazon's sequence is: `searchCatalogItems`, then `getListingsRestrictions` "to retrieve any eligibility requirements that must be met before listing an item in the applicable condition", then `getDefinitionsProductType`, then `putListingsItem`. When approval is required, "use the links array in the response to direct the selling partner to the provided URL, where they can follow the instructions to apply for approval." [official] (Building Listings Management Workflows guide, https://developer-docs.amazon/sp-api/docs/building-listings-management-workflows-guide.md, updatedAt 2026-09-24; Get listings restrictions for an item in the catalog; both read 2026-10-14)
- **N4. RULE — the same gate shows up as a listing issue.** The Listings Items `Issue` category `QUALIFICATION_REQUIRED` means "Approval or qualification is required to list the product." [official] (listingsItems_2021-08-01.json, re-read 2026-10-14)
  - [seat] A submission that moves an existing SKU into a product type or category the seller is not approved for would be expected to return this category. Amazon's pages read here do not say so in terms (open question 15).
- **N5. RULE — approval is at several levels, and not always open.** An Amazon staff reply on the Canadian Seller Forums:
  - "For certain products, brands, categories, and sub-categories, we require sellers to obtain approval before listing products."
  - "However, we may not accept applications for every product we place selling restrictions on."
  - "Ultimately, the decision is made by the review team when you submit an application."
  - The post is dated only "3 years ago". [official] ("Becoming Ungated", Steve_Amazon, https://sellercentral.amazon.ca/seller-forums/discussions/t/b3764b24-1d0e-410f-9a42-b1eab7a21ab1, read 2026-10-14)
  - Amazon's public selling FAQ: "some require approval from Amazon, and some can't be sold by third-party sellers". It links "request approval" to the help page with item id 200333160 (the "Categories and products that require approval" page). [official] (Frequently Asked Questions (FAQ) | Sell on Amazon, https://sell.amazon.com/learn/faq, read 2026-10-14)
  - That help page itself was not read in this pass (open question 9).
- **N6. Timelines.** No Amazon page read in this pass gives a decision time for an approval request.
  - `research/angles/account-health.md` records Amazon's "Please expect a reply to your appeal within two days" for account deactivation or listing removal (G200370560), and other clocks. That page was not re-read here.

### O. Amazon Ads creative acceptance: where the same claims are rejected

- **O1. RULE — ad claims must match the detail page.**
  - "Advertising claims have to be the same ones as on your product detail page. Claims on the product detail page, in the headline, and/or on the product packaging will also require proof and substantiation."
  - Ads must "Accurately reflect the content of your product detail page".
  - "Promotional copy in an ad must also be on the product detail page, for example lightning deals, and valid for the length of the campaign."
  - [official] (A complete guide to Sponsored Brands and display ads moderation | Amazon Ads, https://advertising.amazon.com/library/guides/sponsored-brands-display-ads-moderation, no date shown, read 2026-10-14)
- **O2. RULE — what ads reject that a detail page may carry.**
  - Superiority: "Superiority claims (the best, the most, the biggest, the tastiest, better than, etc.) will be rejected unless they can be substantiated."
  - Competitors: "Don't use superiority claims (the best, the biggest, better than) or mention competitors by name." The detail page allows a substantiated comparison against a named brand outside bullets (F4); ads do not.
  - Pricing: "Superlatives like 'Huge savings' or 'Gigantic discounts' are not permitted. Neither are mentions of specific pricing, like 'Save 50%' or '$20 off.'"
  - Deals: "You can only use the words 'Deal' or 'Deals' in your ads if your products have an Amazon deal ... live for the duration of your campaign."
  - Video "Definite don'ts" include "Customer reviews, including star ratings, even if these reviews are on Amazon" and "Amazon branding elements, trademarks, products, or references to Amazon products or services".
  - [official] (A complete guide to Sponsored Brands and display ads moderation)
- **O3. RULE — the machine-checked rejection codes.** The Ads API's unified pre-moderation lists, for Sponsored Brands, among others:
  - `UNSUBSTANTIATED_CLAIM_VIOLATION`, "All claims in ads must be accurate and substantiated on the product packaging or the product detail page."
  - `LISTING_PRICES`, "Numeric pricing, deals, or savings such as "$4.99" or "Save 50%" are not allowed."
  - `AMAZON_SPECIFIC_TERM`, "Amazon products or services cannot be referenced."
  - `SPONSOR_NAME_MISMATCH`, "Brand name must match your registered brand name, or the name of a brand that you own or can legitimately represent."
  - `CAP_WORDS`, "All CAPS, CaMeL case, and random capitalization are not allowed."
  - `CUSTOM_IMAGE_TEXT`, "Additional text within a custom image such as overlayed or background text is not allowed."

  Sponsored Display adds `TIME_SENSITIVE_EVENT`, "Time-sensitive promotions are prohibited unless communicated dynamically." "Components that get an `APPROVED` status in pre-moderation are not guaranteed to be approved in moderation." [official] (Get started with unified pre-moderation, Amazon Ads API docs, https://advertising.amazon.com/API/docs/en-us/guides/moderation/pre-moderation, read as markdown from the docs site's content host https://d3a0d0y2hgofx6.cloudfront.net/en-us/guides/moderation/pre-moderation.md, 2026-10-14)
  - The pre-moderation endpoint is on the Ads API host. It is not reachable through this package's doors and is named here only for its words.
- **O4. RULE — rejection, timing, account consequence.**
  - "If your ad is rejected, you'll receive an email explaining the reason so you can revise it and resubmit it."
  - "Submit your ads at least one week in advance of your launch date". "Review of translated campaigns usually takes up to 72 hours."
  - "Amazon may suspend or terminate your ad account(s) for severe or repeated Ad Policy violations."
  - [official] (A complete guide to Sponsored Brands and display ads moderation)
- **O5. Not read.** The policy pages themselves ("Amazon Ads Guidelines and Acceptance Policies", `advertising.amazon.com/resources/ad-policy/...`, including "2.0 Advertising Copy") are served as a JavaScript shell to both fetch routes. Their text, including the full "claims and substantiation" list, was not read (open question 11).

### P. Prices, strike-throughs and "was" prices in copy

- **P1. RULE (Amazon).** Price, availability and condition are banned from titles, descriptions, bullets and images (B1). The claims policy names "misleading pricing discounts" among deceptive marketing (C1(4)). The listing is not where a saving is stated.
- **P2. How Amazon shows a saving instead.** "Amazon deal savings are based on validated reference prices"; "The Typical or 'Was' Price is the median price paid on Amazon in the last 90 days". List prices are submitted by sellers, manufacturers and suppliers, and "Amazon validates them for customers." [official] (Amazon's approach to offering genuine deals to customers, https://www.aboutamazon.com/news/retail/how-amazon-offers-genuine-deals-to-customers, no date shown, read 2026-10-14)
  - The validation windows and the 2026 Typical Price change are owned by `research/angles/price-position.md`. The customer-facing strike-through page (https://www.amazon.com/gp/help/customer/display.html?nodeId=GQ6B6RH72AX8D2TD) answered HTTP 503 to the fetcher in this pass.
- **P3. The regulator's test for a former price.** GUIDANCE (FTC Guides Against Deceptive Pricing).
  - A former price is legitimate only "If the former price is the actual, bona fide price at which the article was offered to the public on a regular basis for a reasonably substantial period of time".
  - An "artificial, inflated price ... established for the purpose of enabling the subsequent offer of a large reduction" makes the bargain "a false one".
  - Advertisers should "scrupulously avoid any implication that a former price is a selling, not an asking price (for example, by use of such language as, 'Formerly sold at $______'), unless substantial sales at that price were actually made."
  - [official — regulator] (16 CFR § 233.1 Former price comparisons, https://www.law.cornell.edu/cfr/text/16/233.1, read 2026-10-14)
- **P4. Ads.** Specific prices and savings are rejected in ad copy (O2, O3 `LISTING_PRICES`). Deal wording needs a live Amazon deal.
- Amazon's Fair Pricing policy (G5TUVJKZHUVMN77V) is cited by `research/angles/price-position.md`. It was not re-read here.

### Q. Category claim regimes (outside the US store and inside it)

- **Q1. EU General Product Safety Regulation, Regulation (EU) 2023/988.** RULE (EU regulation).
  - It "shall apply from 13 December 2024".
  - Article 19, distance sales: "the offer of those products shall clearly and visibly indicate at least" the following:
    - the manufacturer's "name, registered trade name or registered trade mark ... as well as the postal and electronic address at which they can be contacted";
    - for a manufacturer outside the Union, the name, postal and electronic address of the "responsible person";
    - "information allowing the identification of the product, including a picture of it, its type and any other product identifier";
    - "any warning or safety information to be affixed to the product or to the packaging ... in a language which can be easily understood by consumers, as determined by the Member State".
  - Penalties are set by Member States (Article 44; M5).
  - [official — regulator] (Regulation (EU) 2023/988, Official Journal text served by the Publications Office, http://publications.europa.eu/resource/celex/32023R0988, read 2026-10-14; EUR-Lex itself answered with an empty HTTP 202 challenge)
- **Q2. RULE (Amazon) — how Amazon takes the GPSR data: dedicated attributes and Account Health, not copy.**
  - Sellers of non-food products in the ES, FR, BE, NL, DE, IT, SE and PL stores had to prove compliance "by December 13, 2024". The proof consists of: "EU Responsible Person", "Manufacturer contact", and "Warning and safety PDFs or images (or acknowledgement that this isn't required)".
  - "After December 13, if we become aware of non-compliant offers, such as those with invalid information or expired contracts, we will deactivate them."
  - The attributes:
    - `gpsr_manufacturer_reference.gpsr_manufacturer_email_address` ("Manufacturer's email (ASIN level)");
    - `dsa_responsible_party_address` ("Responsible party's email (SKU level)");
    - `gpsr_safety_attestation` ("True if product is exempt from safety attestation");
    - `compliance_media`, whose `content_type` includes `safety_information`, `user_manual` and `instructions_for_use`.
  - Read the schema: "Use the `getDefinitionsProductType` operation to retrieve JSON schemas with these attributes for GPSR-relevant categories."
  - The contact details must be entered in Seller Central first.
  - [official] (Sellers can prove their GPSR compliance on their Account Health page, https://developer-docs.amazon/sp-api/changelog/sellers-can-prove-their-gpsr-compliance-on-their-account-health-page; Update: Support for GPSR compliance in Listings Items API and JSON Listings Feeds, https://developer-docs.amazon/sp-api/changelog/developers-can-use-attributes-in-their-programmatic-listings-submissions-to-comply-with-gpsr; both read 2026-10-14)
  - The Seller Central GPSR pages they link (GQAYBJPNAZ2LMDDT, G8AECGHY2KLD88D7 on sellercentral.amazon.de) were not read.
  - [seat] Amazon bans contact details in titles, bullets, descriptions and images (B1), and lists "content for dedicated fields" among prohibited bullet content (I2). Read together with Q2, GPSR's manufacturer and responsible-person addresses belong in those attributes, not in copy.
- **Q3. CE and UKCA are declarations, not certifications.** "UKCA and CE markings demonstrate that the manufacturer believes that their product meets the relevant product requirements." Great Britain "continues to recognise the CE marking, alongside or in place of the UKCA marking", under The Product Safety and Metrology (Amendment) Regulations 2024. [official — regulator] (Placing UKCA or CE marked products on the market in Great Britain, GOV.UK, first published 2026-03-31, updated 2026-08-21, https://www.gov.uk/guidance/placing-ukca-or-ce-marked-products-on-the-market-in-great-britain, read through the GOV.UK content API 2026-10-14)
  - Amazon's claims page gives "'CE Certified'" as its example of a false claim (C1(1)). The marking is the manufacturer's declaration. "CE certified" in copy misstates what the mark is.
- **Q4. Cosmetics (US): MoCRA, and the cosmetic/drug line.**
  - MoCRA requires a "Responsible Person" (the name on the label) to:
    - "list each marketed cosmetic product with FDA, including product ingredients, and provide any updates annually";
    - "ensure and maintain records supporting adequate safety substantiation";
    - report serious adverse events "within 15 business days".
  - Facilities "must register ... and renew their registration every two years".
  - Small-business exemptions do not cover products for the eye area, injected, for internal use, or meant to alter appearance for over 24 hours.
  - [official — regulator] (Modernization of Cosmetics Regulation Act of 2022 (MoCRA), FDA, https://www.fda.gov/cosmetics/cosmetics-laws-regulations/modernization-cosmetics-regulation-act-2022-mocra, content current as of 2026-08-10, read 2026-10-14)
  - The copy rule is the cosmetic/drug line. Intended use is established by "Claims stated on the product labeling, in advertising, on the Internet, or in other promotional materials". Claims that products "will restore hair growth, reduce cellulite, treat varicose veins, increase or decrease the production of melanin (pigment) in the skin, or regenerate cells" make the product a drug. [official — regulator] (Is It a Cosmetic, a Drug, or Both? (Or Is It Soap?), FDA, https://www.fda.gov/cosmetics/cosmetics-laws-regulations/it-cosmetic-drug-or-both-or-it-soap, content current as of 2024-09-11, read 2026-10-14)
  - Amazon's own MoCRA or beauty-approval page was not found or read in this pass (open question 12).
- **Q5. CBD and hemp (US).**
  - "FDA has concluded that THC and CBD products are excluded from the dietary supplement definition".
  - It is prohibited "to introduce or deliver for introduction into interstate commerce any food ... to which has been added" such a substance.
  - "any product intended to have a therapeutic or medical use ... is a drug".
  - A cosmetic claim to "affect the structure or function of the body" makes it "a drug, or possibly both".
  - [official — regulator] (FDA Regulation of Cannabis and Cannabis-Derived Products, Including Cannabidiol (CBD), https://www.fda.gov/news-events/public-health-focus/fda-regulation-cannabis-and-cannabis-derived-products-including-cannabidiol-cbd, content current as of 2024-07-16, read 2026-10-14)
  - Amazon's own CBD rule was not read in this pass. The drugs page (G200164490) the first pass read is recorded without a CBD line (open question 12).
- **Q6. Children's products (US): the Children's Product Certificate.**
  - Section 14 of the CPSA requires a "written Children's Product Certificate (CPC)" from domestic manufacturers and importers. It must be "based on test results from a third-party, CPSC-accepted laboratory", carry seven required elements, and be in English.
  - "Beginning July 8, 2026, importers of most regulated consumer products will be required to electronically file" certificates with CBP.
  - [official — regulator] (Children's Product Certificate | CPSC.gov, https://www.cpsc.gov/Business--Manufacturing/Testing-Certification/Childrens-Product-Certificate-CPC, no date shown, read 2026-10-14)
  - The copy side Amazon states is the required CPSIA choking-hazard statements (C7).
  - Amazon's own children's-products document page (cited by a practitioner as G5SB2HLMUYFK4MXC) was not read (open question 12).

## What practitioners add

- **Fecoms (Faith eCommerce Services), "Amazon Listing Character Limits & Rules: The 2026 Compliance Cheat Sheet", 2026-07-09, no byline; a pull quote from Suresh Kumar.** [opinion]
  - Supplement copy terms "cures," "treats," "prevents" are flagged. Cosmetics "FDA approved" is prohibited. Backend terms carry "no competitor brand names" and no subjective words.
  - Title special characters "are prohibited unless they're part of your registered brand name". That repeats the 2025 wording; Amazon's current title page instead points such brand names to the Brand field (I1).
  - Its "roughly 1 in 5" audit finding is its own. It presents numbers as Amazon policy without links.
- **AMALYZE, "A+ moderation — rejection reasons, rebuild discipline, queue control", no date shown (© 2026).** [opinion]
  - "The eight rejection reasons that recur": unsubstantiated superlatives (its examples include "#1" and "best-selling"), third-party trademarks and retailer logos, off-platform references (URLs, QR codes, contact details), promotional pricing and time-limited claims, review or rating quotations, hero-image overlay text that duplicates the title, lifestyle images without the product, and comparison-chart cells with marketing copy.
  - Practice: "Freeze the A+ stack 30 days before the peak event."
  - Its seasonal moderation timelines are its own estimates. It consistently reflects Amazon's B1, C1 and D rules.
- **eComEngine — Becky Trowbridge, "Amazon Suppressed Listings and Other Profitability Issues", 2023-04-04, updated 2025-02-21.** [opinion]
  - Common suppression causes: images, incomplete description, no category, title too long, duplicate listings, restricted product.
  - It separates *suppressed* (hidden from search, fixable) from *inactive* (not buyable; policy violations among the causes).
  - It does not treat prohibited keywords or claims as suppression causes, which leaves a gap Amazon's own pages fill (C3 bullets "removed or updated"; E3 search terms "suppressed").
- **eComEngine — Kristen Hicks, "Amazon Restricted Products: What Sellers Should Know", 2022-03-22, updated 2024-06-07.** [opinion] Remove restricted listings completely rather than marking them out of stock. Use legal counsel to track changes in law.
- **My Amazon Guy — Ken Zhou, "Mastering Amazon Backend Keywords…", 2025-02-11.** [opinion]
  - Competitor brand names in backend terms can lead to "listing suppression or suspension".
  - "Terms like 'best', '#1 seller', and 'top-rated' are not allowed in backend keywords".
  - "If you exceed the 250-byte limit, Amazon may ignore all backend search terms for that listing". The page cites no source and hedges. Amazon's own page states the rule unhedged: "If it exceeds the limit, the attribute is completely ignored by Amazon Search" (Keyword attributes explained, GF2C2L6RCFZGWBXC v4, read from the 2026-10-14 capture; E3). The practitioner line echoes Amazon; the source for the rule is Amazon's page, and the byte figure is the schema's.
  - Its suppression claim matches Amazon's own words (E3); its suspension claim goes past them ("may put the health of your selling account at risk").
- **My Amazon Guy — Steven Pope, "2025 Amazon Product Title Requirements Sellers Need To Meet", 2025-01-08.** [opinion] Reports the 2025 rules with the brand-name exception. Advises to "Avoid overusing irrelevant terms or brand names". Says brand owners get suggestions and 14 days before titles are "automatically updated", with listings staying active.
- **Jungle Scout — Brian Connolly, "Amazon Restricted Categories: Your Guide to Getting Ungated", 2025-03-03.** [opinion] "Amazon doesn't have a singular definition of what constitutes a restricted product". Reads FTC guidance because sellers are responsible for non-deceptive statements. Other sellers he cites call Fine Jewelry the strictest category.
- **Riverbend Consulting, "How To Prepare For Amazon Trademark Infringement", updated 2024-08-01.** [opinion]
  - Under "keyword abuse" it gives "Dyson" used as a keyword on a hot air brush that is not authentic; separately, under unauthorized use of brand names or logos, "Apple" in the title of a product not affiliated with Apple.
  - "Amazon bots continuously scan listings for misuse". Appeals go through the Account Health dashboard.
  - Does not address the compatibility format; Amazon's trademark page does (F3).
- **Where practitioners disagree with Amazon, or with each other.**
  - (1) My Amazon Guy (January 2025) and Fecoms (July 2026) state the brand-name exception for title special characters. Amazon's current title page does not state it for the title text; it points such brand names to the Brand field.
  - (2) Several practitioner bullet guides recommend ALL-CAPS headers, which Amazon's bullet page lists as prohibited. This is recorded in `research/elements/bullet-points.md`, not re-read here.
  - (3) My Amazon Guy treats competitor brands in search terms as suspension-grade. Amazon says suppression "and may put the health of your selling account at risk".
  - No practitioner read here addressed the compatibility title format or the "evasive behavior" clause.
- **(Gap fill.) Nixon Peabody — Alison B. Torbitt, Danielle O. Griffin, Kelly Sprague, "California's SB 343 restricts common recyclability claims on products and packaging", 2026-04-06.** [opinion] (law-firm alert, https://www.nixonpeabody.com/insights/alerts/2026/04/06/californias-sb-343-restricts-common-recyclability-claims-on-products-and-packaging, read 2026-10-14)
  - Scope: SB 343 reaches the chasing arrows, "any other symbol indicating recyclability, or any statement indicating recyclability or directing consumers to recycle, on products and packaging".
  - The criteria include collection "by recycling programs serving at least 60 percent of California's population".
  - "SB 343's restrictions apply based on the date of manufacture, not the date of sale."
  - Penalties as the firm reads them:
    - misdemeanours under B&P §§ 17580/17580.5 "punishable by up to six months' imprisonment, a fine of up to $2,500, or both";
    - civil penalties under PRC § 42358 "of $500 for the first violation, $1,000 for the second violation, and $2,000 for the third and any subsequent violation";
    - the Unfair Competition Law "permits civil penalties of up to $2,500 per violation and may be invoked by public prosecutors or private parties". The firm reads that as "making Prop 65-like bounty hunters a likely reality".
  - Litigation: written before the injunction. It expects any injunction "would likely protect only the plaintiff associations and their members, not the broader industry". CalRecycle's later page does not say whom its injunction covers (open question 13).
  - The alert does not mention online listings.
- **(Gap fill.) Morgan Lewis — Caitlin Zeytoonian and co-authors, "FTC Issues Final Rule on Consumer Reviews and Testimonials", 2024-08-26.** [opinion] (https://www.morganlewis.com/pubs/2024/08/ftc-issues-final-rule-on-consumer-reviews-and-testimonials, read 2026-10-14)
  - "unlike the Endorsement Guides, which are not themselves independently enforceable", violation of the rule "entitles the FTC to seek significant penalties (in the amount of up to $51,744 per violation)". That was the 2024 level; M5 has the 2025 level that still applies.
  - Review suppression is barred "except in limited circumstances", such as trade secrets or defamatory, harassing or obscene content.
- **(Gap fill.) Pattern — Matt Checketts, "MoCRA for Beauty Brands Selling on Amazon: 2026 Renewals, and How to Stay Compliant Across Your Catalog", 2026-09-28.** [opinion] (https://www.pattern.com/blog/mocra-for-beauty-brands-selling-on-amazon, read 2026-10-14)
  - "Amazon asks beauty sellers in many subcategories to provide evidence of compliance before listing or maintaining a product". Examples: "FDA registration details or an FEI number, a GMP certificate from the manufacturing facility, and a Certificate of Analysis". These are its words, not Amazon's page.
  - "Review your Amazon title, bullet points, and A+ content for language that crosses from cosmetic to drug territory. 'Reduces acne' is a drug claim. 'Cleanses skin' is not." This matches the FDA's intended-use test (Q4).
  - "The most common failure is a mismatch: the documents on file don't match the live listing."
  - If a manufacturer's registration lapses, "your products become noncompliant, which puts your Amazon listings at direct risk".
- **(Gap fill.) Compliancegate — Yvette Shen, "Amazon Toys & Children's Products Requirements Guide for Sellers", posted 2022-09-27, updated 2025-08-26.** [opinion] (https://compliancegate.com/amazon-toys-children-products-requirements, read 2026-10-14)
  - Amazon's children's-product rules cover products for "children of a maximum of 12 years of age".
  - Amazon asks for documents including "A CPSIA Tracking Label and relevant warning labels for the ASINs you are applying to sell".
  - "Sellers must add applicable hazard warnings to their product listing (on the product detail page), and to the product label, when necessary."
  - "Failing to provide the required compliance documents can result in your product listing being suspended."
  - It cites an Amazon help page this pass did not open.
- **(Gap fill.) Jungle Scout — Brian Connolly, "Amazon restricted categories" article, 2025-03-03.** [opinion] (https://www.junglescout.com/resources/articles/amazon-restricted-categories/, read 2026-10-14)
  - The seller-side path to request approval: find the item under Add Products, "click on 'Show limitations' to the left of the product info", then either "click the 'Request Approval' button to begin the application process, or you'll receive a notification saying you are not approved and that applications aren't being accepted."
  - For one category it lists "A minimum of 3 invoices or purchase orders from your largest inventory source(s)".
  - It gives no decision time.
  - Its screens are not Amazon's text, and the menu path may have moved since.
- **Not reached.** No seller-authored Seller Forums thread on claim flags (e.g., "antimicrobial" pesticide flags) could be found without search. Marketplace Pulse's current article index showed no piece on listing policy.

## Published research

- **He, Hollenbeck, Proserpio, "The Market for Fake Reviews", *Marketing Science* 41(5):896–921, 2022** (DOI 10.1287/mksc.2022.1353; venue, volume, issue and pages confirmed in Crossref). The abstract was read from the working-paper page on MPRA (paper 105507, deposited 2021; https://mpra.ub.uni-muenchen.de/105507); the published version's abstract was not read. [research]
  - Finding (narrow, working-paper wording): "Soliciting fake reviews on Facebook leads to a significant increase in average rating and sales rank, but the effect disappears after roughly one month." "After firms stop buying fake reviews their average ratings fall significantly and the share of one-star reviews increases". "We also observe that Amazon deletes large numbers of reviews".
  - Transfer: this is about review manipulation, not listing text. It matters to `effect-review` in two ways. A competitor's sudden review and rank jump may not last. Its reversal is a confounder for the seller's own "effect".
- **Gandhi, Hollenbeck, Li, "Misinformation and Mistrust: The Equilibrium Effects of Fake Reviews on Amazon.com", NBER Working Paper w34161, 2025** (DOI 10.3386/w34161; abstract via OpenAlex). [research]
  - Finding: in counterfactual simulations, "fake reviews reduce consumer welfare, shift sales from honest to dishonest sellers, and ultimately harm the platform".
  - Transfer: explains Amazon's zero-tolerance stance (H1); says nothing about listing copy.
- **Hyungsoo Lim, "How Platform Certification Shapes Conscious Online Consumption: Evidence from Amazon Climate Pledge Program", *Journal of the Association for Information Systems*, 2025** (abstract via OpenAlex; no DOI shown). [research]
  - Finding: on beauty products, a difference-in-differences comparison found "Amazon's certification positively influences sales", with larger gains for products with more reviews and for small businesses.
  - Transfer: limited to one category and to the *badge*. It supports the route of the certification (J3) over the unqualified claim "eco-friendly" (C3). It says nothing about the effect of claim text.
- **Found but not read (abstract unavailable in the index; no finding is claimed):** Chu, Long, Zhang, "Can Firms Do Well by Doing Environmental Good? Cost-Benefit Analyses of Amazon's Climate Pledge Friendly Program", SSRN 2025; Etumnu, "Does the Climate Pledge Command a Price Premium? Evidence from Amazon", SSRN 2022; Feng, Liu, Zhang, Srinivasan, "Sustainability and Competition on Amazon", SSRN 2024.
- No peer-reviewed study was found on the sales effect of prohibited claims or keyword stuffing on Amazon listings. The search ran on OpenAlex only.
- (Gap fill.) No published research was read for sections M–Q. The gap fill searched the web for regulators' and Amazon's texts, not the research indexes. No study is claimed on regulator rules, Ads moderation, gating or GPSR.

## Stable enough for a skill

- Amazon forbids, in titles, descriptions, bullets and images: contact details and URLs, price/availability/condition, alternative shipping offers, reviews and testimonials, review requests, promotional material, time-sensitive information, brand IP on a generic listing, and restricted phrases. (Product detail page rules)
- Any claim about performance, composition, ingredients, origin, health, safety, environment or certification needs verifiable proof the seller can hand to Amazon on request. Unqualified superlatives are not allowed without it. (Misleading and prohibited claims; General Listing Restrictions)
- A claim that a product prevents, kills, repels or mitigates any pest, including bacteria, mold, mildew and dust mites, can make it a pesticide under EPA rules, anywhere in the text or images. Such listings need EPA data and approval. (Pest control products and pesticides)
- "FDA approved" and "FDA cleared" are allowed only when the FDA actually approved or cleared the product. The FDA logo must not appear in listing attributes or images of medical devices, drugs or dietary supplements. Disease claims (to diagnose, cure, mitigate, treat or prevent disease) need FDA approval of the product or, for supplements, of the statement. (Restricted products; Medical devices and accessories; Drugs and drug paraphernalia; Dietary supplements; Misleading and prohibited claims)
- Broad environmental words ("eco-friendly", "green") are flagged by Amazon. A specific, qualified claim or a recognised certification is the path Amazon describes. (Environmental Marketing Guidelines; Product bullet point requirements; Sustainability Solutions Hub)
- Claims about sales rank ("best seller", "#1") in titles or descriptions are a code-of-conduct breach. Amazon badges may not be imitated in images. (Selling policies and seller code of conduct; Product title requirements and guidelines; Product image guide)
- Keyword manipulation to inflate search ranking is prohibited, and manipulating search results or sales rankings is a critical account-health violation. (Selling policies and seller code of conduct; Account health rating)
- Search terms may not contain any brand name (the seller's own or another's), ASINs, temporary words, subjective claims or offensive terms. Breaking this can get the ASIN suppressed. (Use search terms effectively)
- Another brand's name may be used for a truthful compatibility statement, in Amazon's "for / compatible with / fits / intended for" form, as a word mark and never a logo; similarity claims are not allowed. (A substantiated comparison is a separate case, next line.) (Intellectual property policy for sellers - trademarks)
- Comparative claims against a named brand must be substantiated, say "compare to" and on what basis, and not feature the other product more prominently. Bullets should not compare to competitor brands at all. (Intellectual property policy for sellers - trademarks; Product bullet point requirements)
- An edit may only describe the same product better. A new version, a changed brand, or a fundamentally different product needs a new ASIN. (Product detail page rules; ASIN creation policy; Amazon generic product policy)
- Repeatedly adding and removing a prohibited claim, or wording a listing to avoid detection, is evasive behaviour, and Amazon says it has no path to reinstatement without proof of compliance. (Product detail page rules)
- Enforcement has two layers. A listing layer (issues and enforcement actions: search-suppressed, listing-suppressed, attribute-suppressed, catalog item removed; rewrite or removal of content) and an account layer (violations counted on the Account Health page). Closing a listing does not erase an account-layer violation. (listingsItems_2021-08-01.json; Account health rating)
- An "accepted" submission is not a clean listing: issues can arrive asynchronously after acceptance. (Manage Listings Issues)
- Some categories require statements: Prop 65 notices, CPSIA choking-hazard text, energy labels, textile disclosures. A missing required statement is a policy gap, just as an added forbidden one is. (Listing restrictions that require statements or disclosures)
- (Gap fill.) Regulators bind listing copy independently of Amazon. The FTC review rule bars fake, bought-by-sentiment and undisclosed insider reviews and testimonials, and review suppression. A request for reviews sent only to customers believed happy is not a "generalized solicitation". (16 CFR Part 465; Federal Register final rule, 2024)
- (Gap fill.) An unqualified "Made in USA" claim, in words or as a flag mark, requires final assembly and all significant processing in the US and "all or virtually all" US content. Otherwise the claim must be qualified. Online listings count as mail-order promotional material. (16 CFR Part 323; Complying with the Made in USA Standard)
- (Gap fill.) An unqualified "recyclable" claim needs recycling access for a substantial majority of buyers. Otherwise it is qualified or dropped. In California the chasing arrows carry a separate statutory test (enforcement enjoined as of the last read; open question 13). (16 CFR § 260.12; SB 343: Accurate Recycling Labels)
- (Gap fill.) A cosmetic becomes a drug by what its copy claims (the FDA's examples: hair regrowth, cellulite, varicose veins, melanin, cell regeneration; a practitioner adds "Reduces acne"). A CBD product cannot be sold as a dietary supplement or food in interstate commerce under the FDA's position, and a therapeutic claim makes it a drug. (Is It a Cosmetic, a Drug, or Both?; FDA Regulation of Cannabis ...)
- (Gap fill.) CE and UKCA marks are the manufacturer's declaration, so "CE certified" misstates them. EU distance-sale offers must show the manufacturer, the EU responsible person, product identification and warnings. Amazon takes these through dedicated attributes and deactivates non-compliant offers. (Regulation (EU) 2023/988 Art. 19; Placing UKCA or CE marked products ...; Sellers can prove their GPSR compliance ...)
- (Gap fill.) Every ad claim must also be on the detail page and substantiated. Ads reject specific prices and savings, unsubstantiated superiority, named competitors, Amazon references, and (in video) customer reviews and star ratings. (A complete guide to Sponsored Brands and display ads moderation; Get started with unified pre-moderation)
- (Gap fill.) Savings are shown by Amazon from validated reference prices, not by text in the listing. A stated former price is lawful only if the product was really offered at it for a reasonably substantial period. (Amazon's approach to offering genuine deals to customers; 16 CFR § 233.1)
- (Gap fill.) Listing restrictions come in three kinds: approval required (with a link to apply), ASIN not found in the store, and not eligible (no path). (listingsRestrictions_2021-08-01.json)

## What cx must read at run time

- **Is the listing being enforced against now?** `getListingsItem` with `includedData=issues` (plus `summaries` for `status` `BUYABLE`/`DISCOVERABLE`). Read each issue's `severity`, `categories`, `attributeNames`, `enforcements.actions[].action` and `enforcements.exemption.status`/`expiryDate`. For many SKUs: `searchListingsItems` with `includedData=issues` and `withIssueSeverity`. (Listings Items API v2021-08-01)
- **What Amazon displays versus what was submitted.** Catalog Items `getCatalogItem` reconciled attributes against the Listings `attributes`, to see a rewrite or removal of content. (See `research/elements/title.md` for the title case.)
- **What the schema enforces for this product type.** `getDefinitionsProductType` for the SKU's product type: required and conditional attributes (`allOf`), lengths and byte limits, enumerations, compliance attributes such as a pesticide marking. Never state those limits from memory. (Product Type Definitions API; Manage Listings Issues)
- **Would this draft be rejected?** `patchListingsItem` / `putListingsItem` with `mode=VALIDATION_PREVIEW`. Amazon intends it for a small number of listings, not production volume. Read its `status` and `issues`. (Manage Listings Issues)
- **May the seller list or offer this ASIN at all?** `getListingsRestrictions` (`reasonCode`, links). (Listings Restrictions API)
- **Which listings are suppressed and why, store-wide.** The Suppressed Listings report, `GET_MERCHANTS_LISTINGS_FYP_REPORT`. Report options, waits and the create/poll/download sequence are door.md's (Reports API `createReport`, `getReport`, `getReportDocument`).
- **Does the account carry listing, restricted-product, IP or review violations?** The Seller Performance Report, `GET_V2_SELLER_PERFORMANCE_REPORT` (role Selling Partner Insights; request only). Its `listingPolicyViolations`, `restrictedProductPolicyViolations`, `receivedIntellectualPropertyComplaints`, `suspectedIntellectualPropertyViolations`, `customerProductReviewsPolicyViolations`, `policyViolationWarnings` and `accountHealthRating` are the account-layer signals. Names and waits are door.md's; read the delivered document, since the doc page and the published schema differ.
- **Change events.** The `LISTINGS_ITEM_ISSUES_CHANGE` notification, where a subscription exists (Notifications API). Whether the box can receive notifications is outside this file.
- **The policy pages themselves.** They change by revision with no API: Product detail page rules (G200390640), Misleading and prohibited claims (G202024200), Selling policies and seller code of conduct (G1801), Intellectual property policy for sellers - trademarks (GZUQ6GBBXQVHQKF2), Use search terms effectively (G23501), Pest control products and pesticides (G202115120). A skill names them; cx reads the current text when it must justify a flag to the seller. The 2026-10-14 text of several of them is saved under the office's capture folder (outside this repository) with its version, so a later read can tell whether the page changed; the route cx may use to read them is the office's ruling (`research/method/help-page-access.md`).
- **Figures Amazon keeps in the schema or changes by announcement.** Title length (`item_name`), Item Highlights (`title_differentiation`), bullet length and the search-terms byte limit (`generic_keyword`) are read from `getDefinitionsProductType` for the SKU's product type and marketplace, never from this file. Amazon's help pages disagree with each other on some of them (A2, E3, K5); cx names the disagreement when it matters to a flag.
- **Has Amazon rewritten or hidden a title?** `getListingsItem` (`attributes`, `issues`, `summaries`) against `getCatalogItem`, and whether Amazon's title rollout is still running, from Amazon's latest announcement (I3).
- **Competitor copy (Keepa).** Keepa's product object carries competitors' title and feature text. The keepa skill's `references/product-file.md` owns the field names. Keepa says nothing about Amazon's enforcement on another seller's listing. A competitor's prohibited claim is no reason to copy it, and its survival proves nothing about the rule.
- **(Gap fill.) Gating before a move.**
  - Before proposing an offer on a new ASIN, a condition change, or a product-type or category change, read `getListingsRestrictions` per ASIN, `conditionType` and marketplace. Report `APPROVAL_REQUIRED` with Amazon's `links[].resource`, and `NOT_ELIGIBLE` as having no path.
  - After a submission, read `issues` for the `QUALIFICATION_REQUIRED` category. (listingsRestrictions_2021-08-01.json; listingsItems_2021-08-01.json)
- **(Gap fill.) Origin in the data versus origin in the copy.** The listing's origin attribute (named in the product-type schema, read from it, not from memory) against any "Made in USA"/"USA" word or flag in copy and images. The FTC's 2025 letter singles out listings whose copy says USA while the listing says "imported". (FTC letter to Amazon.com, Inc., 2025-07-08)
- **(Gap fill.) EU GPSR attributes.** For EU-store SKUs, `getDefinitionsProductType` shows which GPSR attributes the product type carries. `getListingsItem` (attributes, issues) shows whether they are filled. The Account Health GPSR status sits behind sign-in and has no read route known to this file. (Update: Support for GPSR compliance in Listings Items API and JSON Listings Feeds)
- **(Gap fill.) Ad moderation.** Pre-moderation and ad moderation status live on the Amazon Ads API, which is not one of this package's doors. Until it is, cx can only check ad copy against the rules in O. It cannot read a rejection.
- **(Gap fill.) Regulator texts.** The FTC penalty level (adjusted by notice), the SB 343 injunction and the CPSC eFiling dates change by publication. A skill names the rule and the page. cx re-reads the page before quoting a figure or a status.

## Pages read

| Page name | URL | Date read | What it gave |
|---|---|---|---|
| Product detail page rules | https://sellercentral.amazon.com/help/hub/reference/external/G200390640 | 2026-10-14 | v21 r1 (capture capture `G200390640-v21`); banned content; accuracy; editing limits; evasive behaviour; trademark on ASIN; brand-registry contributions; 75-character titles and 125-character item highlights |
| Misleading and prohibited claims | https://sellercentral.amazon.com/help/hub/reference/external/G202024200 | 2026-10-14 | v11 (capture capture `G202024200-v11`); claim definition; four guidelines; disease list; environmental, pesticide, FDA, Made in USA; enforcement |
| General Listing Restrictions | https://sellercentral.amazon.com/help/hub/reference/external/G201707070 | 2026-10-14 | Claims needing proof; environmental; guarantees; FIFRA; medical device claims; testimonials |
| Listing restrictions that require statements or disclosures | https://sellercentral.amazon.com/help/hub/reference/external/G201707090 | 2026-10-14 | Prop 65, CPSIA, energy labels, textile, OTC/supplement claim limits |
| Environmental Marketing Guidelines | https://sellercentral.amazon.com/help/hub/reference/external/G201893650 | 2026-10-14 | Green Guides highlights; California plastics rule |
| Pest control products and pesticides | https://sellercentral.amazon.com/help/hub/reference/external/G202115120 | 2026-10-14 | Pesticide claim definition, examples, misbranding words, exemptions, marking attribute |
| Restricted products | https://sellercentral.amazon.com/help/hub/reference/external/G200164330 | 2026-10-14 | FDA wording; circumvention; pre-approval |
| Restricted Products FAQ | https://sellercentral.amazon.com/help/hub/reference/external/GCYAVS22E6CQKV2B | 2026-10-14 | Fetched; not used beyond context |
| Medical devices and accessories | https://sellercentral.amazon.com/help/hub/reference/external/G200164650 | 2026-10-14 | "FDA approved/cleared" and disease-claim limits |
| Drugs and drug paraphernalia | https://sellercentral.amazon.com/help/hub/reference/external/G200164490 | 2026-10-14 | OTC monograph cannot claim FDA approval; labeling limits |
| Dietary supplements | https://sellercentral.amazon.com/help/hub/reference/external/G55N3JF2WQS7RVNE | 2026-10-14 | Structure/function examples; disease and FDA claims; Non-GMO proof |
| Category, product, and listing restrictions | https://sellercentral.amazon.com/help/hub/reference/external/G200301050 | 2026-10-14 | Index of compliance and listing-requirement pages |
| Listing restrictions | https://sellercentral.amazon.com/help/hub/reference/external/G200832300 | 2026-10-14 | Consequences of listing-policy violations |
| Safety, compliance, and product restrictions | https://sellercentral.amazon.com/help/hub/reference/external/GXMGGPL6LC4CVXHT | 2026-10-14 | The "Product compliance" link's current page; enforcement |
| Product categories with enhanced safety listing compliance requirements | https://sellercentral.amazon.com/help/hub/reference/external/GUQ848NB5HZ6M6A4 | 2026-10-14 | Notified via Account Health; list changes |
| Product safety listing restrictions | https://sellercentral.amazon.com/help/hub/reference/external/GRLKLZ6WQ9R259LC | 2026-10-14 | Products prohibited for safety; appeal path |
| Categories and products that require approval | https://sellercentral.amazon.com/help/hub/reference/external/G200333160 | 2026-10-14 | Fetched by the first pass through the content call; no claim drawn from it, and no capture was saved (the gap fill could not re-read it; open question 9) |
| Offensive and controversial materials | https://sellercentral.amazon.com/help/hub/reference/external/G200164670 | 2026-10-14 | Hatred/violence, tragedies, children; sole discretion |
| Selling policies and seller code of conduct | https://sellercentral.amazon.com/help/hub/reference/external/G1801 | 2026-10-14 | Sales-rank claims; keyword manipulation; reviews; circumvention |
| Prohibited seller activities and actions policy | https://sellercentral.amazon.com/help/hub/reference/external/G200386250 | 2026-10-14 | Now a stub pointing to G1801 |
| Customer product reviews policies | https://sellercentral.amazon.com/help/hub/reference/external/GYRKB5RU3FS5TURN | 2026-10-14 | Violations list; variation abuse; zero tolerance |
| Amazon Brand Name policy | https://sellercentral.amazon.com/help/hub/reference/external/G2N3GKE5SGSHWYRZ | 2026-10-14 | Brand value rule; error codes |
| Amazon generic product policy | https://sellercentral.amazon.com/help/hub/reference/external/G84H3T69ZX762NWT | 2026-10-14 | Generic brand cannot change; IP on generic |
| Intellectual Property Policy | https://sellercentral.amazon.com/help/hub/reference/external/G201361070 | 2026-10-14 | Enforcement without knowledge; repeat infringers |
| Intellectual property policy for sellers - trademarks | https://sellercentral.amazon.com/help/hub/reference/external/GZUQ6GBBXQVHQKF2 | 2026-10-14 | Compatibility title formats; comparative claims; compatibility vs similarity |
| Intellectual property for Rights Owners and Registered Agents | https://sellercentral.amazon.com/help/hub/reference/external/GU5SQCEKADDAQRLZ | 2026-10-14 | Compatibility notices not enforced |
| ASIN creation policy | https://sellercentral.amazon.com/help/hub/reference/external/G201844590 | 2026-10-14 | Variation misuse; weekly creation limit |
| Product bundling policy | https://sellercentral.amazon.com/help/hub/reference/external/G200442350 | 2026-10-14 | Fetched; context only |
| Account Health Rating program policy | https://sellercentral.amazon.com/help/hub/reference/external/G200205250 | 2026-10-14 | Scale, bands, severity, repeats |
| Account health rating | https://sellercentral.amazon.com/help/hub/reference/external/GR786P4BPEVKTBAG | 2026-10-14 | Page title is exactly "Account health rating" (FAQ format; this file calls it "the AHR FAQ"). Severity examples; points; repeat caps; grace period; removal rules |
| Policies included in Account Health Rating | https://sellercentral.amazon.com/help/hub/reference/external/GQ5DSES264XVXNX7 | 2026-10-14 | Policy list; ML plus human review |
| Program Policies | https://sellercentral.amazon.com/help/hub/reference/external/G521 | 2026-10-14 | Fetched; index |
| Product title requirements and guidelines | https://sellercentral.amazon.com/help/hub/reference/external/GYTR6SYGFA5E3EQC | 2026-10-14 | v21 r2 (capture capture `GYTR6SYGFA5E3EQC-v21`); 75 characters; special characters, repetition, subjective commentary; auto-correction or not shown in search; title suppression row; 125-character item highlights |
| Product bullet point requirements | https://sellercentral.amazon.com/help/hub/reference/external/GX5L8BF8GLMML6CX | 2026-10-14 | v11 r8 (capture capture `GX5L8BF8GLMML6CX-v11`); prohibited content table; no competitor comparison |
| Use search terms effectively | https://sellercentral.amazon.com/help/hub/reference/external/G23501 | 2026-10-14 | v14 r0 (capture capture `G23501-v14`); prohibited search terms; suppression; "eco friendly" in example; no byte figure; the live page (G201047930 is served as no topic) |
| Product image guide | https://sellercentral.amazon.com/help/hub/reference/external/G1881 | 2026-10-14 | v28 r9 (capture capture `G1881-v28`); no badges, Amazon marks, review imagery |
| Suppressed listings | https://sellercentral.amazon.com/help/hub/reference/external/G200898440 | 2026-10-14 | v13 r0 (capture capture `G200898440-v13`); suppression standards; 80/130 length figures that differ from the title page |
| Product page style guides | https://sellercentral.amazon.com/help/hub/reference/external/G200270100 | 2026-10-14 | Links to the 2018 Quick Start guide; category PDFs |
| Bulk listing templates | https://sellercentral.amazon.com/help/hub/reference/external/G1641 | 2026-10-14 | No style-guide text in served content |
| Amazon Services Quick Start Style Guide (2015 PDF) | https://images-na.ssl-images-amazon.com/images/G/01/Lite_Inventory_Templates/Selling_on_Amazon_Quick_Start_Style_Guide.pdf | 2026-10-14 | Created 2015-08-20; "under 200" title figure that differs from the current title page; "Best Seller" banned |
| Amazon Services Quick Start Style Guide (2018 PDF) | https://m.media-amazon.com/images/G/01/rainier/help/Selling_on_Amazon_Quick_Start_Style_Guide_2018.pdf | 2026-10-14 | Same content, 2018; conflicts with current bullet page |
| [Now Closed] Ask Amazon - GET ANSWERS on New Product Title Policy on January 8th | https://sellercentral.amazon.com/seller-forums/discussions/t/3c9f0b3c-4594-4efc-a05f-0f8d371fa466 | 2026-10-14 | 2025 rules; brand-name exception; effective 2025-01-21; collapsed replies not visible |
| Updates to improve your product titles begin on July 27 | https://sellercentral.amazon.com/seller-forums/discussions/t/145b6d0f-999c-4555-896c-c694bda2e470 | 2026-10-14 | AI rewrite; 14-day review; listings stay active |
| (Reconciliation) Answers to your product title update questions (News_Amazon) | https://sellercentral.amazon.com/seller-forums/discussions/t/302aaac6-6f2b-4d86-bcd2-36fe24f0e6cd | 2026-10-14 | Recommendations "on non-compliant listings" from 2026-07-27, "throughout 2026"; listings "active, editable, and searchable"; 75 + 125 split |
| (Reconciliation) Optimize your product discoverability | https://sellercentral.amazon.com/help/hub/reference/external/G10471 | 2026-10-14 | v13 r1, read from the capture capture `G10471-v13`; "less than 250 bytes"; prohibited terms eliminated |
| (Reconciliation) Keyword attributes explained | https://sellercentral.amazon.com/help/hub/reference/external/GF2C2L6RCFZGWBXC | 2026-10-14 | v4 r1, read from the capture capture `GF2C2L6RCFZGWBXC-v4`; `generic_keywords` "249"; "completely ignored" over the limit |
| Sustainability Solutions Hub \| Sell on Amazon | https://sell.amazon.com/programs/sustainability | 2026-10-14 | CPF uses certifications; leaf icon |
| Climate Pledge Friendly seller page | https://sellercentral.amazon.com/sustainability/program/cpf | 2026-10-14 | unreachable: sign-in wall (link found on the hub page) |
| Climate Pledge Friendly customer page | https://www.amazon.com/b?node=21221607011 | 2026-10-14 | unreachable: HTTP 503 to the fetcher |
| Amazon launches "Climate Pledge Friendly" program | https://www.aboutamazon.com/news/sustainability/amazon-launches-climate-pledge-friendly-program | 2026-10-14 | 19 certifications at launch; Compact by Design; no date shown |
| Manage Listings Issues | https://developer-docs.amazon.com/sp-api/docs/manage-listings-issues | 2026-10-14 | Sync/async issues; schema pre-validation; preview purpose; code map; notification |
| Listings Items API Issues Troubleshooting | https://developer-docs.amazon.com/sp-api/docs/listings-items-api-issues-troubleshooting | 2026-10-14 | Brand/GTIN/luxury issues; little policy text |
| Listings Restrictions API | https://developer-docs.amazon.com/sp-api/docs/listings-restrictions-api | 2026-10-14 | Purpose; role Product Listing |
| Get listings restrictions for an item in the catalog | https://developer-docs.amazon.com/sp-api/docs/get-listings-restrictions | 2026-10-14 | Empty list means none; approval links |
| Inventory Reports | https://developer-docs.amazon.com/sp-api/docs/report-type-values-inventory | 2026-10-14 | Suppressed Listings Report and columns |
| Performance Reports | https://developer-docs.amazon.com/sp-api/docs/report-type-values-performance | 2026-10-14 | Seller Performance Report and its violation metrics |
| SP-API llms.txt index | https://developer-docs.amazon/sp-api/llms.txt | 2026-10-14 | Page discovery |
| listingsItems_2021-08-01.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-items-api-model/listingsItems_2021-08-01.json | 2026-10-14 | Issue, enforcement, exemption, status; preview mode |
| listingsRestrictions_2021-08-01.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-restrictions-api-model/listingsRestrictions_2021-08-01.json | 2026-10-14 | Reason codes; rate |
| accountHealthReport-2020-11-18.json | https://github.com/amzn/selling-partner-api-models/blob/main/schemas/reports/accountHealthReport-2020-11-18.json | 2026-10-14 | Metric names; differs from doc page |
| Fecoms, Amazon Listing Character Limits & Rules: The 2026 Compliance Cheat Sheet | https://fecoms.com/blog/amazon/amazon-listing-character-limits-rules-the-2026-compliance-cheat-sheet | 2026-10-14 | [opinion] flagged terms; 2025 brand exception repeated |
| AMALYZE, A+ moderation | https://amalyze.com/resources/guides/listing/amazon-listing-aplus-moderation-playbook | 2026-10-14 | [opinion] A+ rejection patterns |
| eComEngine, Amazon Suppressed Listings and Other Profitability Issues | https://www.ecomengine.com/blog/amazon-suppressed-listings | 2026-10-14 | [opinion] suppressed vs inactive |
| eComEngine, Amazon Restricted Products: What Sellers Should Know | https://www.ecomengine.com/blog/amazon-restricted-products | 2026-10-14 | [opinion] restricted-product practice |
| My Amazon Guy, Mastering Amazon Backend Keywords | https://myamazonguy.com/seo/amazon-backend-keywords/ | 2026-10-14 | [opinion] competitor brands; subjective terms |
| My Amazon Guy, 2025 Amazon Product Title Requirements | https://myamazonguy.com/news/2025-amazon-product-title-requirements/ | 2026-10-14 | [opinion] 2025 rules, brand exception |
| Jungle Scout, Amazon Restricted Categories | https://www.junglescout.com/resources/articles/amazon-restricted-categories/ | 2026-10-14 | [opinion] restricted vs gated |
| Riverbend Consulting, How To Prepare For Amazon Trademark Infringement | https://riverbendconsulting.com/blog/amazon-trademark-infringement/ | 2026-10-14 | [opinion] keyword abuse examples |
| Marketplace Pulse articles index and feed | https://www.marketplacepulse.com/articles | 2026-10-14 | No listing-policy article in the current index |
| OpenAlex records: He et al. 2020/2022; Gandhi et al. 2025; Lim 2025; Chu et al. 2025; Etumnu 2022; Feng et al. 2024 | https://api.openalex.org | 2026-10-14 | Abstracts for Gandhi et al. and Lim; on re-check the He et al. SSRN record carries no abstract (its abstract came from MPRA, next rows); none for the last three, whose titles and authors the index confirms |
| Crossref record, The Market for Fake Reviews | https://api.crossref.org/works/10.1287/mksc.2022.1353 | 2026-10-14 | Venue, volume, pages |
| MPRA, The Market for Fake Reviews (paper 105507) | https://mpra.ub.uni-muenchen.de/105507 | 2026-10-14 | Working-paper abstract (verifier's read): "Soliciting fake reviews on Facebook…", one-star share, Amazon deletions |
| Crossref record, Misinformation and Mistrust | https://api.crossref.org/works/10.3386/w34161 | 2026-10-14 | NBER, authors, August 2025 (verifier's read) |
| SSRN abstract page, The Market for Fake Reviews | https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3664992 | 2026-10-14 | unreachable: HTTP 403 to the fetcher (verifier) |
| Help pages GEPS9NVRG9WSNP4Z, G7DWNVZC4BWY7R5T, GGGKKCTPTVTF95E5, G201722410 | https://sellercentral.amazon.com/help/hub/reference/external/<id> | 2026-10-14 | unreachable: the help hub content call answered HTTP 400; titles not known |
| Help pages G201929730, GUH6FA4XSJ2LZFLY | https://sellercentral.amazon.com/help/hub/reference/external/<id> | 2026-10-14 | unreachable: the content call returned an empty body |
| Seller Central Account Health dashboard | (not opened) | 2026-10-14 | unreachable: behind sign-in, not attempted; its category labels were not read |
| (Gap fill) Federal Trade Commission Announces Final Rule Banning Fake Reviews and Testimonials | https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials | 2026-10-14 | Practices covered; civil penalties against knowing violators |
| (Gap fill) Trade Regulation Rule on the Use of Consumer Reviews and Testimonials; Final Rule (89 FR 68034) | https://www.govinfo.gov/content/pkg/FR-2024-08-22/html/2024-18519.htm | 2026-10-14 | Effective date; "generalized solicitations" explanation; Amazon's comment on the record |
| (Gap fill) 16 CFR Part 465 (§§ 465.1, 465.2, 465.4, 465.5, 465.7), LII | https://www.law.cornell.edu/cfr/text/16/part-465 | 2026-10-14 | Rule text: definitions, fake reviews, buying reviews, insider reviews, suppression |
| (Gap fill) FTC Warns 10 Companies About Possible Violations of the Agency's New Consumer Review Rule | https://www.ftc.gov/news-events/news/press-releases/2025/12/ftc-warns-10-companies-about-possible-violations-agencys-new-consumer-review-rule | 2026-10-14 | 2025-12-22 warning letters; $53,088 per violation |
| (Gap fill) FTC warning-letter template (2025) | https://www.ftc.gov/system/files/ftc_gov/pdf/2025-Fake-Review-Warning-Template.pdf | 2026-10-14 | unreachable: served an HTML page, not the PDF; nothing drawn from it |
| (Gap fill) FTC Brings First Case Challenging Fake Paid Reviews on an Independent Retail Website | https://www.ftc.gov/news-events/news/press-releases/2019/02/ftc-brings-first-case-challenging-fake-paid-reviews-independent-retail-website | 2026-10-14 | Amazon-seller review-buying case; order terms |
| (Gap fill) 16 CFR Part 323 (§§ 323.1–323.5), LII | https://www.law.cornell.edu/cfr/text/16/part-323 | 2026-10-14 | Made in USA rule text; mail-order covers electronic |
| (Gap fill) Complying with the Made in USA Standard | https://www.ftc.gov/business-guidance/resources/complying-made-usa-standard | 2026-10-14 | Qualified claims; "Assembled in USA"; online marketing covered |
| (Gap fill) FTC Issues Rule to Deter Rampant Made in USA Fraud | https://www.ftc.gov/news-events/news/press-releases/2021/07/ftc-issues-rule-deter-rampant-made-usa-fraud | 2026-10-14 | Rule codifies policy; 2021 penalty level |
| (Gap fill) Federal Trade Commission Warns Companies to Comply with "Made in USA" Requirements | https://www.ftc.gov/news-events/news/press-releases/2025/07/federal-trade-commission-warns-companies-comply-made-usa-requirements | 2026-10-14 | Letters to marketplaces naming third-party sellers |
| (Gap fill) FTC letter to Amazon.com, Inc., "Misleading Made in USA Representations by Third-Party Sellers" | https://www.ftc.gov/system/files/ftc_gov/pdf/amazon-musa-letter.pdf (index: https://www.ftc.gov/legal-library/browse/warning-letters/amazoncom-inc) | 2026-10-14 | The letter's text; its footnoted listings were not copied |
| (Gap fill) FTC Enforces New Made in USA Rule against Lithionics and Owner Steven Tartaglia ... | https://www.ftc.gov/news-events/news/press-releases/2022/04/ftc-enforces-new-made-usa-rule-against-lithionics-owner-steven-tartaglia-falsely-labeling-foreign | 2026-10-14 | First penalty under the rule; owner named |
| (Gap fill) FTC Publishes Inflation-Adjusted Civil Penalty Amounts for 2025 | https://www.ftc.gov/news-events/news/press-releases/2025/02/ftc-publishes-inflation-adjusted-civil-penalty-amounts-2025 | 2026-10-14 | $51,744 → $53,088 |
| (Gap fill) Civil Penalty Inflation Adjustments (91 FR 58446) | https://www.govinfo.gov/content/pkg/FR-2026-09-15/html/2026-18853.htm | 2026-10-14 | 2025 levels kept for 2026 |
| (Gap fill) Health Products Compliance Guidance | https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance | 2026-10-14 | Substantiation standard; testimonials are not proof (last ~28,000 characters not read) |
| (Gap fill) 16 CFR § 260.12 Recyclable claims and § 260.2, LII | https://www.law.cornell.edu/cfr/text/16/260.12 | 2026-10-14 | 60 percent "substantial majority"; qualification |
| (Gap fill) SB 343: Accurate Recycling Labels (CalRecycle) | https://calrecycle.ca.gov/wcs/recyclinglabels/ | 2026-10-14 | Compliance date; manufacture-date rule; 2026-07-14 injunction (read through the fetch tool; curl answered HTTP 403) |
| (Gap fill) 16 CFR § 233.1 Former price comparisons, LII | https://www.law.cornell.edu/cfr/text/16/233.1 | 2026-10-14 | Bona fide former price test |
| (Gap fill) Amazon's approach to offering genuine deals to customers | https://www.aboutamazon.com/news/retail/how-amazon-offers-genuine-deals-to-customers | 2026-10-14 | Validated reference prices; Typical/"Was" Price |
| (Gap fill) Amazon customer help page on reference prices | https://www.amazon.com/gp/help/customer/display.html?nodeId=GQ6B6RH72AX8D2TD | 2026-10-14 | unreachable: HTTP 503 |
| (Gap fill) listingsRestrictions_2021-08-01.json | https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-restrictions-api-model/listingsRestrictions_2021-08-01.json | 2026-10-14 | reasonCode descriptions; Link shape; productType description; example link |
| (Gap fill) listingsItems_2021-08-01.json (Issue categories) | https://github.com/amzn/selling-partner-api-models/blob/main/models/listings-items-api-model/listingsItems_2021-08-01.json | 2026-10-14 | `QUALIFICATION_REQUIRED` |
| (Gap fill) Listings Restrictions API; Get listings restrictions for an item in the catalog; getListingsRestrictions reference | https://developer-docs.amazon/sp-api/docs/listings-restrictions-api.md ; https://developer-docs.amazon/sp-api/docs/get-listings-restrictions.md ; https://developer-docs.amazon/sp-api/reference/getlistingsrestrictions.md | 2026-10-14 | Empty-list meaning; links usage; per-marketplace rate counting |
| (Gap fill) Building Listings Management Workflows guide | https://developer-docs.amazon/sp-api/docs/building-listings-management-workflows-guide.md | 2026-10-14 | Restrictions check before the schema read |
| (Gap fill) SP-API release notes | https://developer-docs.amazon/sp-api/docs/sp-api-release-notes.md | 2026-10-14 | No Listings Restrictions change in the 2026-05-27 entry |
| (Gap fill) Frequently Asked Questions (FAQ) \| Sell on Amazon | https://sell.amazon.com/learn/faq | 2026-10-14 | Approval categories; link to G200333160 |
| (Gap fill) How to sell jewelry online; Prepare to sell during verification (sell.amazon.com) | https://sell.amazon.com/sell/jewelry ; https://sell.amazon.com/learn/prepare-to-sell | 2026-10-14 | Fine jewellery needs approval; nothing else drawn |
| (Gap fill) "Becoming Ungated" (Seller Forums, Canada) | https://sellercentral.amazon.ca/seller-forums/discussions/t/b3764b24-1d0e-410f-9a42-b1eab7a21ab1 | 2026-10-14 | Staff reply on approval levels and closed applications |
| (Gap fill) Updates to improve your product titles begin on July 27 (re-read) | https://sellercentral.amazon.com/seller-forums/discussions/t/145b6d0f-999c-4555-896c-c694bda2e470 | 2026-10-14 | Full I3 sentences; Item Highlights 125 characters |
| (Gap fill) Categories and products that require approval (G200333160) | https://sellercentral.amazon.com/help/hub/reference/external/G200333160 | 2026-10-14 | unreachable in the gap fill: the fetch tool got a script shell; the help hub content call was refused by this session's permission system |
| (Gap fill) A complete guide to Sponsored Brands and display ads moderation \| Amazon Ads | https://advertising.amazon.com/library/guides/sponsored-brands-display-ads-moderation | 2026-10-14 | Claims match the page; superiority, pricing, deals, video rules; rejection email; account consequence |
| (Gap fill) Get started with unified pre-moderation (Amazon Ads API docs) | https://advertising.amazon.com/API/docs/en-us/guides/moderation/pre-moderation (markdown: https://d3a0d0y2hgofx6.cloudfront.net/en-us/guides/moderation/pre-moderation.md) | 2026-10-14 | Rejection codes and descriptions |
| (Gap fill) Amazon Ads Guidelines and Acceptance Policies (creative acceptance; sponsored ads policies; advertising copy) | https://advertising.amazon.com/resources/ad-policy/creative-acceptance | 2026-10-14 | unreachable: script shell to both fetch routes; /resources/ad-policy answered 404 |
| (Gap fill) Regulation (EU) 2023/988 (GPSR) | http://publications.europa.eu/resource/celex/32023R0988 | 2026-10-14 | Art. 19, 44, 52 text (EUR-Lex answered an empty HTTP 202) |
| (Gap fill) Product safety (European Commission) | https://commission.europa.eu/topics/business-and-industry/product-safety_en | 2026-10-14 | Context only; nothing drawn |
| (Gap fill) Update: Support for GPSR compliance in Listings Items API and JSON Listings Feeds | https://developer-docs.amazon/sp-api/changelog/developers-can-use-attributes-in-their-programmatic-listings-submissions-to-comply-with-gpsr | 2026-10-14 | GPSR attribute names; stores; deadline |
| (Gap fill) Sellers can prove their GPSR compliance on their Account Health page | https://developer-docs.amazon/sp-api/changelog/sellers-can-prove-their-gpsr-compliance-on-their-account-health-page | 2026-10-14 | Required items; deactivation |
| (Gap fill) Seller Central GPSR pages GQAYBJPNAZ2LMDDT, G8AECGHY2KLD88D7 | sellercentral.amazon.de help pages | 2026-10-14 | not opened: same route problem as G200333160 |
| (Gap fill) Placing UKCA or CE marked products on the market in Great Britain (GOV.UK) | https://www.gov.uk/guidance/placing-ukca-or-ce-marked-products-on-the-market-in-great-britain | 2026-10-14 | Marks are the manufacturer's declaration; CE recognised in GB |
| (Gap fill) Modernization of Cosmetics Regulation Act of 2022 (MoCRA) (FDA) | https://www.fda.gov/cosmetics/cosmetics-laws-regulations/modernization-cosmetics-regulation-act-2022-mocra | 2026-10-14 | Responsible Person duties |
| (Gap fill) Is It a Cosmetic, a Drug, or Both? (Or Is It Soap?) (FDA) | https://www.fda.gov/cosmetics/cosmetics-laws-regulations/it-cosmetic-drug-or-both-or-it-soap | 2026-10-14 | Intended use set by claims, including online |
| (Gap fill) FDA Regulation of Cannabis and Cannabis-Derived Products, Including Cannabidiol (CBD) | https://www.fda.gov/news-events/public-health-focus/fda-regulation-cannabis-and-cannabis-derived-products-including-cannabidiol-cbd | 2026-10-14 | CBD not a supplement; therapeutic claims make a drug |
| (Gap fill) Children's Product Certificate \| CPSC.gov | https://www.cpsc.gov/Business--Manufacturing/Testing-Certification/Childrens-Product-Certificate-CPC | 2026-10-14 | CPC duties; 2026-07-08 eFiling (read through the fetch tool; curl answered HTTP 403) |
| (Gap fill) Nixon Peabody SB 343 alert | https://www.nixonpeabody.com/insights/alerts/2026/04/06/californias-sb-343-restricts-common-recyclability-claims-on-products-and-packaging | 2026-10-14 | [opinion] scope, penalties |
| (Gap fill) Morgan Lewis on the review rule | https://www.morganlewis.com/pubs/2024/08/ftc-issues-final-rule-on-consumer-reviews-and-testimonials | 2026-10-14 | [opinion] enforceability; suppression exceptions |
| (Gap fill) Pattern on MoCRA for Amazon | https://www.pattern.com/blog/mocra-for-beauty-brands-selling-on-amazon | 2026-10-14 | [opinion] Amazon document asks; cosmetic/drug copy |
| (Gap fill) Compliancegate on toys and children's products | https://compliancegate.com/amazon-toys-children-products-requirements | 2026-10-14 | [opinion] documents; listing hazard warnings |
| (Gap fill) Jungle Scout on restricted categories | https://www.junglescout.com/resources/articles/amazon-restricted-categories/ | 2026-10-14 | [opinion] Request approval path |
| (Gap fill) Amazon CBD policy page | (not found) | 2026-10-14 | a web search returned only secondary and 2019 sources; no Amazon page opened |

## Open questions

1. **The Account Health page's own labels.** Does the dashboard show "Listing Policy Violations", "Restricted Product Policy Violations" and "Intellectual Property complaints" as the lead names them? Amazon's report names are `listingPolicyViolations`, `restrictedProductPolicyViolations`, `receivedIntellectualPropertyComplaints` and `suspectedIntellectualPropertyViolations`. *Settles it:* a signed-in look at Account Health, or the first real `GET_V2_SELLER_PERFORMANCE_REPORT` document.
2. **Which `issues` codes correspond to which policy.** For example, does a prohibited bullet claim surface as an `issue` with `ATTRIBUTE_SUPPRESSED`, or does Amazon silently rewrite? *Settles it:* `getListingsItem includedData=issues` on a real listing that carries a known flag, and the Suppressed Listings report's `Reason` text.
3. **Does `VALIDATION_PREVIEW` catch claim words** ("antibacterial", "eco-friendly", "best seller")? Or only schema rules such as URLs, markup and length? *Settles it:* one preview on a sandbox-safe body (the office's word needed before any production preview).
4. **The category style guides' current text.** None was read. *Settles it:* the PDFs from the templates page (signed in), compared with the current help pages.
5. **Climate Pledge Friendly's current certification route and count.** *Settles it:* the signed-in `sustainability/program/cpf` page.
6. **The schema and doc divergence** on the Seller Performance Report (`ahrScore`, review and warning metrics). *Settles it:* the first delivered report document.
7. **Seller-forum experience of claim flags.** False positives on "antimicrobial" and similar, and how fast suppression lifts after an edit. *Settles it:* a search-enabled pass over Seller Forums threads by sellers.
8. **Whether the 2025 brand-name exception for title special characters still holds in enforcement.** The 2026 page moves it to the Brand field. *Settles it:* a preview or a real edit on a brand whose name carries a barred character.
9. **(Gap fill) Amazon's own Request approval page and its clock.** "Categories and products that require approval" (G200333160) was fetched by the first pass with nothing drawn from it, and was not read in the gap fill; no capture of it is under the office's capture folder (outside this repository) The fetch tool got a script shell, and the help hub's content call was refused by this session's permission system. So Amazon's own steps, documents and decision time for approval requests are unread. No Amazon page read gives a decision time. *Settles it:* G200333160 read by a seat whose route to the help hub is allowed, or a signed-in browser read.
10. **(Gap fill) What "the brand name" is in `getListingsRestrictions`.** The `productType` parameter says that "When provided with the brand name" the API also evaluates GTIN-exemption restrictions. Neither the model nor the reference page has a brand parameter. *Settles it:* the API's next model revision or a release note. Calling the API is out of scope for research.
11. **(Gap fill) The text of the Amazon Ads policy pages.** "Amazon Ads Guidelines and Acceptance Policies" (creative acceptance, sponsored ads policies, advertising copy) returned a script shell to both fetch routes. The full claims list and the restricted-category ad rules are unread. *Settles it:* a browser read through `pi-web-access`.
12. **(Gap fill) Amazon's own category pages for cosmetics, CBD/hemp and children's products, and its EU GPSR pages.** No Amazon page on MoCRA or beauty approval, on CBD, or on children's product documents (cited by a practitioner as G5SB2HLMUYFK4MXC) was read. Nor were the Seller Central GPSR pages (GQAYBJPNAZ2LMDDT, G8AECGHY2KLD88D7). Sections Q4–Q6 rest on the regulators' pages and on practitioners. *Settles it:* those help pages, read by an allowed route.
13. **(Gap fill) SB 343 and online listings, and the injunction's reach.** Does SB 343 reach recyclability words on an online detail page, or only labels and packaging? Is the 2026-07-14 preliminary injunction still in force, and does it cover only the plaintiffs' members? CalRecycle's page does not say whom the injunction covers. A law firm writing before the injunction expected any injunction to cover only members. *Settles it:* the statute's text (PRC § 42355.51; B&P § 17580.5) and the court's order.
14. **(Gap fill) Other US states' recyclability and chasing-arrows rules.** Not researched beyond California. *Settles it:* the states' own statutes or agency pages.
15. **(Gap fill) What a product-type or category change does when the seller is not approved.** The model has `QUALIFICATION_REQUIRED` as an issue category. Whether a product-type change on an existing SKU returns it, or something else, is not stated in the pages read. *Settles it:* a `VALIDATION_PREVIEW` on such a change (the office's word needed first).
16. **(Gap fill) Appeal and reinstatement timelines.** The gap fill read no Amazon page on how long a listing appeal, a restricted-product appeal or an approval request takes. `research/angles/account-health.md` holds the figures recorded so far. Ads gave only "usually takes up to 72 hours" for translated campaigns and "at least one week in advance" for submissions. *Settles it:* G200370560 and the restricted-products appeal page, re-read by an allowed route.
17. **(Gap fill) Has the FTC review rule been amended or challenged since 2024?** Not checked beyond the December 2025 warning letters. A web search listed an October 2026 FTC complaint citing the rule, but it was not opened. *Settles it:* the FTC's rule page and the Federal Register.

## Positions

1. **P-listing-policies-1.** cx treats Amazon's policy pages and the product-type schema as the authority on what a listing may say, names the page when it flags a word, and treats the 2015/2018 style-guide PDFs as superseded where a current help page differs. Sources: Product detail page rules; Product page style guides; Amazon Services Quick Start Style Guide (2015, 2018); Product bullet point requirements; Manage Listings Issues.
2. **P-listing-policies-2.** cx flags any draft or existing claim about performance, composition, origin, health, safety, environment, certification, award or survey as a compliance change that needs the seller's proof, never as a search or conversion improvement. Sources: Misleading and prohibited claims; General Listing Restrictions; Product bullet point requirements.
3. **P-listing-policies-3.** cx flags wording that says or implies a product kills, prevents, repels or resists bacteria, mold, mildew, mites or other pests as a possible pesticide claim needing EPA registration and approval, wherever it appears. Sources: Pest control products and pesticides; General Listing Restrictions; Misleading and prohibited claims.
4. **P-listing-policies-4.** cx never writes "FDA approved", "FDA cleared" or a disease claim unless the seller shows the FDA approval or clearance, and never proposes the FDA logo in a listing's images or attributes for a medical device, drug or dietary supplement. Sources: Restricted products; Medical devices and accessories; Drugs and drug paraphernalia; Dietary supplements; Misleading and prohibited claims.
5. **P-listing-policies-5.** cx does not write broad environmental words ("eco-friendly", "green", "environmentally friendly"). Where the seller has proof it offers a specific, qualified claim, and it points to certification as the route to a sustainability badge. Sources: Environmental Marketing Guidelines; General Listing Restrictions; Product bullet point requirements; Sustainability Solutions Hub.
6. **P-listing-policies-6.** cx never puts sales-rank or subjective commentary ("best seller", "#1", "hot item", "top rated") in titles, descriptions, search terms or image text, and never imitates an Amazon badge. Sources: Selling policies and seller code of conduct; Product title requirements and guidelines; Use search terms effectively; Product image guide.
7. **P-listing-policies-7.** cx keeps every brand name, the seller's own included, out of search terms. It uses another brand's name only for a truthful compatibility statement in Amazon's "for / compatible with / fits / intended for" form (or, outside bullets, a substantiated comparison under P-listing-policies-8), as a word and never a logo. Sources: Use search terms effectively; Intellectual property policy for sellers - trademarks; Intellectual property for Rights Owners and Registered Agents.
8. **P-listing-policies-8.** cx does not name competitor brands in bullets. Anywhere else, a comparison against a named brand is proposed only with substantiation, "compare to" wording and its basis stated. Sources: Product bullet point requirements; Intellectual property policy for sellers - trademarks.
9. **P-listing-policies-9.** cx treats keyword repetition and stuffing as a policy risk (keyword manipulation; title repetition limit), not only as wasted space. Sources: Selling policies and seller code of conduct; Account health rating; Product title requirements and guidelines; Use search terms effectively.
10. **P-listing-policies-10.** cx proposes only edits that describe the same product better. A change of version, brand or product identity is flagged as needing a new ASIN, not a listing edit. Sources: Product detail page rules; ASIN creation policy; Amazon generic product policy; Amazon Brand Name policy.
11. **P-listing-policies-11.** cx never proposes re-adding a claim Amazon removed, cycling a claim on and off, or obfuscated spellings or image text to get past a flag. Sources: Product detail page rules; Restricted products.
12. **P-listing-policies-12.** Before judging a listing's copy or effect, cx reads the listing's `issues` with their `enforcements` and `status`, and reports any suppression, attribute suppression or exemption expiry date first. Sources: listingsItems_2021-08-01.json; Manage Listings Issues.
13. **P-listing-policies-13.** cx treats an accepted submission as unverified until a later `issues` read shows no new issue, because Amazon raises issues asynchronously after acceptance. Sources: Manage Listings Issues.
14. **P-listing-policies-14.** For a store-wide policy view, cx uses the Suppressed Listings report for listing-level suppression and the Seller Performance Report for account-level violation counts, and keeps the two layers apart when reporting to the seller. Sources: Inventory Reports; Performance Reports; Account health rating.
15. **P-listing-policies-15.** In `effect-review`, a suppression, attribute suppression, Amazon rewrite or dropped search-terms field inside the observation window is named as a confounder before any market explanation. Sources: listingsItems_2021-08-01.json; Product title requirements and guidelines; Use search terms effectively; Updates to improve your product titles begin on July 27; Answers to your product title update questions.
16. **P-listing-policies-16.** In `listing-change-log`, a change that adds or removes a claim records the claim, the proof the seller named, and the policy page that governs it. Sources: Misleading and prohibited claims; General Listing Restrictions; Product detail page rules.
17. **P-listing-policies-17.** For categories with required statements (Prop 65, CPSIA choking hazards, energy labels, textile disclosures), cx checks for the required statement's presence as well as for forbidden words. Sources: Listing restrictions that require statements or disclosures.
18. **P-listing-policies-18.** Before proposing a listing or offer on an ASIN the seller has not sold, cx reads `getListingsRestrictions` and reports any approval requirement with Amazon's link. Sources: Listings Restrictions API; Get listings restrictions for an item in the catalog; listingsRestrictions_2021-08-01.json.
19. **P-listing-policies-19.** A competitor's live listing carrying a prohibited claim is not evidence the claim is allowed, and cx does not copy it. Sources: Misleading and prohibited claims ("Additional claim types may be identified and enforced as necessary"); Policies included in Account Health Rating (detection by machine learning and human review).
20. **P-listing-policies-20.** cx never proposes a review request sent only to customers believed to be satisfied, an incentive tied to a review's sentiment, or a review or testimonial by the seller's officers, managers, employees, agents or their relatives without a clear and conspicuous disclosure. It never proposes threatening or pressuring a reviewer. Sources: 16 CFR Part 465 (§§ 465.2, 465.4, 465.5, 465.7); Trade Regulation Rule on the Use of Consumer Reviews and Testimonials; Final Rule (89 FR 68034).
21. **P-listing-policies-21.** cx flags any "Made in USA", "USA made" or U.S.-flag origin claim in copy or images as needing the seller's proof that the product is all or virtually all made in the US. It offers the qualified forms ("Made in USA of U.S. and imported parts", "Assembled in USA" where the assembly is substantial) when that proof is missing, and flags any conflict between that claim and the listing's own country-of-origin data. Sources: 16 CFR Part 323; Complying with the Made in USA Standard; FTC letter to Amazon.com, Inc. (2025-07-08); Misleading and prohibited claims.
22. **P-listing-policies-22.** cx flags "recyclable", "please recycle" and recycling symbols in copy and images as a claim that needs the seller's proof of recycling access. It names the FTC Green Guides, and California SB 343 for products sold there, with the injunction status as last read. Sources: 16 CFR § 260.12; SB 343: Accurate Recycling Labels (CalRecycle).
23. **P-listing-policies-23.** For cosmetics, cx does not write claims that a product treats, prevents or changes the body's structure or function (the FDA's examples include hair regrowth, cellulite, varicose veins, melanin and cell regeneration). It flags such wording as making the product a drug, and for CBD or hemp products it writes no therapeutic, dietary-supplement or food claim. Sources: Is It a Cosmetic, a Drug, or Both? (Or Is It Soap?); FDA Regulation of Cannabis and Cannabis-Derived Products, Including Cannabidiol (CBD); Modernization of Cosmetics Regulation Act of 2022 (MoCRA).
24. **P-listing-policies-24.** cx never writes "CE certified" or "UKCA certified". For EU-store listings it checks that the GPSR attributes the product type carries (manufacturer, responsible person, safety documents) are filled, and it does not put that contact data into the copy. Sources: Placing UKCA or CE marked products on the market in Great Britain; Regulation (EU) 2023/988 Art. 19; Update: Support for GPSR compliance in Listings Items API and JSON Listings Feeds; Sellers can prove their GPSR compliance on their Account Health page; Misleading and prohibited claims.
25. **P-listing-policies-25.** cx treats a change to a detail-page claim as a change to what the brand's ads may say. In proposed ad copy it uses only claims present and substantiated on the detail page, and no specific prices or savings, superiority claims, competitor names, Amazon references, or (in video) customer reviews or star ratings. Sources: A complete guide to Sponsored Brands and display ads moderation; Get started with unified pre-moderation.
26. **P-listing-policies-26.** cx never writes a former price, "was" price, percentage-off or savings text in listing copy. It points the seller to Amazon's reference-price mechanisms and their validation rules instead. Sources: Product detail page rules; Misleading and prohibited claims; Amazon's approach to offering genuine deals to customers; 16 CFR § 233.1.
27. **P-listing-policies-27.** Before proposing an offer on a new ASIN, a condition change, or a product-type or category change, cx reads `getListingsRestrictions` for that ASIN, condition and marketplace. It reports `APPROVAL_REQUIRED` with Amazon's link and says plainly that `NOT_ELIGIBLE` has no path forward. An empty list for the condition means no restriction was returned. Sources: listingsRestrictions_2021-08-01.json; Get listings restrictions for an item in the catalog; Building Listings Management Workflows guide.
28. **P-listing-policies-28.** When cx flags a claim, it names the Amazon page and, where one exists, the regulator's rule, and says that legal exposure for the brand (FTC civil penalties per violation, with owners named personally in the cases read) does not depend on whether Amazon enforces. Sources: FTC Publishes Inflation-Adjusted Civil Penalty Amounts for 2025; Civil Penalty Inflation Adjustments (91 FR 58446); FTC Enforces New Made in USA Rule against Lithionics ...; FTC Brings First Case Challenging Fake Paid Reviews on an Independent Retail Website.
29. **P-listing-policies-29.** cx never uses a testimonial or a customer review as the proof behind a health claim. Sources: Health Products Compliance Guidance; Misleading and prohibited claims.

**The seat's own (not for a skill)**

- [seat] Policy enforcement looks asymmetric in time. Text rewrites and suppressions arrive within days, while account-health violations can surface later and stay for 180 days. A change log that keeps the exact text submitted, with its date, is the seller's best defence in an appeal. No Amazon page read says this about appeals.
- [seat] A model trained on years of listing copy is biased toward exactly the phrases Amazon now forbids: ALL-CAPS headers, "eco-friendly", "best seller", competitor brands in backend terms. A writing skill should expect to have to pull against that habit. Unverified beyond the practitioner examples in `research/elements/bullet-points.md`.
- [seat] The help hub's `GetHelpTopic` route is undocumented. If cx ever reads policy text live, a browser read through `pi-web-access` is the safer route than calling that endpoint. Whether the call may be used at all as a standing route is for the office to rule (`research/method/help-page-access.md`, open question 1).
- [seat] (Gap fill.) The FTC's 2025 letter to Amazon picks out a cheap machine check: copy that says USA while the listing's origin data says otherwise. That conflict lives in the seller's own data, needs no market read, and is the kind of contradiction Amazon was asked to "monitor, identify, and take corrective action" on.
- [seat] (Gap fill.) Ads moderation is stricter than the detail page in three places: competitor names, superiority claims, and any price or savings words. A listing claim that survives on the page can still sink every Sponsored Brands creative that repeats it. cx's copy advice therefore touches ads even though the Ads API is not one of its doors.
- [seat] (Gap fill.) Regulators' figures (penalty levels, eFiling dates, compliance dates) move by notice and by court order, as the 2026 freeze and the SB 343 injunction show. A skill should carry the rule and the page, never the figure.
- [seat] Neither run report (2026-10-13 day 1, 2026-10-14 day 2) showed cx meeting a policy issue. Its proposal on day 2 was drafted without a schema read, so whether its draft would have passed is unknown. These runs give no evidence on claim-word behaviour.

## Verification

Verified 2026-10-14 by an adversarial verifier seat, against the sources themselves, not the author's notes.

**Method.** All 35 cited Seller Central help pages were re-read through the help hub's content call (same route as the author; every page title matched the name the file gives, except the one noted below). Every quoted phrase in sections A–L was matched by script against the page text; each miss was checked by hand. The two style-guide PDFs were downloaded and their metadata and text read. The five SP-API developer pages were read in `.md` form; `listingsItems_2021-08-01.json`, `listingsRestrictions_2021-08-01.json` and `accountHealthReport-2020-11-18.json` were read from `main` (enums, enforcement action texts, exemption statuses, `VALIDATION_PREVIEW` description, `withIssueSeverity`, restriction reason codes, schema metric names, `GREAT`/`WARNED`). Both Seller Forums posts, the Sustainability hub and the aboutamazon article were opened. All eight practitioner pages were opened. The six papers were checked in Crossref/OpenAlex, and He et al.'s abstract on MPRA. No Amazon API or Keepa API host was called. No seller data appears in the file (the brand names in examples are Amazon's own examples).

**Claims checked:** about 150 (roughly 115 official quotes, figures, enum values and page names; 25 practitioner attributions; 10 research facts).

**Confirmed without change (selection):** AHR scale, bands, start score 200, 180-day window, "two to eight", three-day grace, four points per 200 orders, repeat caps five/two; the Critical and Medium severity examples; the code-of-conduct sales-rank and keyword-manipulation clauses; the title page (75 characters, barred characters, two-instance rule, "Hot Item"/"Best seller"); the bullet page (prohibited table; version 11, revision 8); search-terms prohibited words and the "eco friendly" example string; the pesticide page throughout; disease list; environmental pages and the California plastics rule; the compatibility title formats; brand error codes; generic brand lock; 2,000-ASIN weekly limit; the image guide's badge and Amazon-mark bans (they sit under "Requirements for all product images"); all SP-API enum values and descriptions; the Suppressed Listings report's columns and role; the Seller Performance Report's role, "can only be requested" and its doc/schema gap; the validation-preview code map (Amazon frames it as "current error code" → "new error code"); the "Product compliance" link on G200301050 does point to GXMGGPL6LC4CVXHT; 2015 PDF created 2015-08-20, 2018 PDF "© 2018, Amazon Commercial Services Pty Ltd"; 2026-07-27 title rewrite post and the 2025 Ask Amazon thread with "January 21, 2025".

**Corrections (was → now):**
1. A2: "the 2018 one says bullets should 'Spell out measurements' and 'Write all numbers as numerals'" → both PDFs say it (the 2015 PDF has the same lines).
2. C5 and "Stable enough": "FDA logo allowed only when the FDA approved or cleared the product" → the device, drug and supplement pages list "Include the FDA logo" as a flat must-not, with no approval exception; disease claims "allowed only for FDA-approved drugs" → need FDA approval of the product or, for supplements, of the statement. P-listing-policies-4 rewritten to match.
3. C5 supplements: quote truncated to "disease claims or implied disease claims" → full clause including "unless the FDA approved the statement".
4. I1: "The 2026 page moves that exemption to the Brand field, which is a narrowing" (stated as Amazon's fact) → the page points such brand names to the Brand field; "narrowing" is marked as the seat's reading. The 2025 post is now attributed as the staff post opening the Ask Amazon thread (Jameson_Amazon), not an undated "announcement".
5. I3: post "dated 'Jun 10, 2026'" → that is the latest moderator revision shown; no original posting date is shown.
6. Page name: "Account health rating [FAQ]" / "(FAQ)" → the page's title is exactly "Account health rating" (FAQ-format page).
7. Fecoms: quoted "unless they are part of a registered brand name" → the page's words are "are prohibited unless they're part of your registered brand name"; "narrower than Amazon's page" → "Amazon's page instead points such names to the Brand field".
8. AMALYZE: quoted "Unsubstantiated superlatives, including '#1' and 'best-selling'" is not on the page → paraphrased with the page's heading "The eight rejection reasons that recur", all eight reasons listed; "freeze about 30 days" → the page's words "Freeze the A+ stack 30 days before the peak event."
9. Riverbend: "Apple" in a title was filed under "keyword abuse" → the page puts it under unauthorized use of brand names or logos; only the "Dyson" keyword example is under keyword abuse.
10. He, Hollenbeck, Proserpio: quoted "Buying fake reviews on Facebook leads to…" (attributed to an SSRN abstract via OpenAlex, which today carries no abstract) → MPRA working-paper wording "Soliciting fake reviews on Facebook leads to…", one-star clause without the second "significantly", "We also observe that Amazon deletes large numbers of reviews"; source changed to the MPRA page.
11. "Stable enough": "Another brand's name may be used only for a truthful compatibility statement" contradicted the next line (comparisons allowed) → reworded; P-listing-policies-7 now defers to P-listing-policies-8 for comparisons outside bullets.
12. Added (verified): the trademark page's third title format for customizable products; the textile rule that explains why "bamboo"/"soy" are prohibited bullet claims.
13. Pages read: added the MPRA page, the NBER Crossref record and the SSRN page (unreachable: HTTP 403); corrected the OpenAlex row.

**Still unverified:**
- The Restricted Products FAQ (GCYAVS22E6CQKV2B), Categories and products that require approval (G200333160), Product bundling policy, Program Policies (G521), Listings Items API Issues Troubleshooting and the llms.txt index were not re-read; the file draws no claim from them beyond "fetched".
- Lim (JAIS 2025): the abstract matches; no DOI or volume was found, so the venue rests on OpenAlex alone.
- The published He et al. (2022) abstract wording; only the working paper was read.
- eComEngine's suppressed-listings article "does not treat prohibited keywords or claims as suppression causes" is a claim of absence; the verifier confirmed the six causes listed, not the absence.
- The Seller Central Account Health dashboard's category labels (behind sign-in), the Climate Pledge Friendly seller page (sign-in), and the category style-guide PDFs, as the author already recorded.

**What a senior Amazon operations lead would expect here and does not find (not researched now):**
- Brand Registry levers on content: Brand Registry contribution weighting (the Product detail page rules page has it; this file does not use it), "Report a Violation", and how a brand owner contests an Amazon rewrite or a hijacked detail page.
- A+ Content / Premium A+ / Brand Story and Brand Store content policies (Amazon's own A+ guidelines and rejection reasons); only a practitioner page covers A+ here.
- Video and image text policies beyond the main-image rules (shoppable video guide, image-overlay text).
- Item highlights (since reconciliation covered in I3: the figure is on four Amazon pages, the binding limit is the schema's `title_differentiation`) and the GTIN and product-ID rules from the Product detail page rules page; Amazon-generated content ("AI recommendations") and Review listing changes as the place a brand accepts or rejects them.
- The Amazon Ads policy side: Sponsored Brands/Display creative acceptance policies, which reject the same claims in ad copy and are where many sellers first meet the claim rules.
- Category-specific claim regimes not covered: cosmetics (MoCRA), CBD/hemp, children's products certificates (CPC), EU/UK (GPSR, CE/UKCA) for sellers outside the US store.
- Appeals mechanics: Plan of Action, "Fix your products"/"Listing with issues" queues, and how long suppressions take to lift.
- Pricing-integrity and "was price"/strike-through rules (Fair Pricing policy is in the AHR list, discounts named in the claims page) as they touch listing copy.
- Variation-theme abuse and review-merging detection as practised (sellers' forum evidence), beyond the policy text.

Gap fill 2026-10-14: 11 gaps filled, 2 left open
- Filled: the FTC review and testimonial rule (16 CFR Part 465): fake reviews, sentiment-conditioned incentives, insider reviews, review suppression, the "generalized solicitation" limit, warning letters (M1).
- Filled: the FTC Made in USA Labeling Rule (16 CFR Part 323), the FTC's 2025 letter to Amazon on third-party sellers, and the first penalty case (M2).
- Filled: penalties that reach the brand: FTC per-violation ceiling (2025 level kept for 2026), owners named personally, EU Member-State penalties (M5).
- Filled: `getListingsRestrictions` reasons, links, parameters and its place in Amazon's workflow; `QUALIFICATION_REQUIRED` (N1–N4).
- Filled, partly: the Request approval path (the API's approval link, an Amazon staff forum reply, a practitioner's screen path). Amazon's own help page and its clock are open question 9.
- Filled, regulator side: MoCRA and the cosmetic/drug line (Q4). Amazon's own beauty pages are open question 12.
- Filled, regulator side: CBD/hemp (Q5). Amazon's own CBD rule is open question 12.
- Filled: the CPSC Children's Product Certificate and 2026 eFiling (Q6), with a practitioner on Amazon's document asks.
- Filled: EU GPSR Art. 19, Amazon's GPSR attributes and deactivation, and UKCA/CE as declarations (Q1–Q3).
- Filled: Sponsored Brands / Display creative moderation: claims must match the detail page; prices, superiority, competitors, reviews in video; pre-moderation codes (O1–O4). The policy pages' own text is open question 11.
- Filled: strike-through and "was" price: Amazon's validated reference prices and the FTC former-price guide (P1–P4).
- Left open: US states' recyclability and chasing-arrows rules beyond California (open question 14). The federal Green Guides and California SB 343 with its 2026-07-14 injunction were added (M3), and SB 343's reach to online listings is open question 13.
- Left open: appeal timelines (open question 16). No Amazon page on appeal or approval clocks was read in the gap fill.
- Also: I3 reconciled with the title page's general consequence (a rewrite for over-length titles; correction or search suppression remains the stated consequence for other title breaches). The July 27 post was re-read: it has no "non-compliant listings" wording, and it does cover titles nobody updated if they are over 75 characters.

Gap-fill re-check (same day, by the gap filler, against the sources, not notes):
- 86 quoted phrases in M–Q, N and the new positions were matched by script against the saved page texts (LII CFR sections, both Federal Register notices, the FTC letter PDF, the GPSR regulation, the SP-API models and docs, the Ads guides, FDA and GOV.UK pages): all matched.
- The quotes from pages that the shell could not fetch (FTC guidance and press releases, CalRecycle, CPSC, aboutamazon, the Seller Forums posts) were re-confirmed through the fetch tool. Practitioner quotes were matched against downloaded page text.
- Corrections made in the re-check: the 2019 review case was re-worded to the FTC's own phrases (the 4.3-star request, the judgment, the Amazon notice, the claim ban, whose conditions were not read in full). The Lithionics bullet now says where the claims appeared as the FTC says it (website, social media, mail order catalogs, product photographs), not "labels shown in online photos". The "screwdriver" quote was restored to the page's full phrase. A Morgan Lewis quote about representative reviews could not be found on the page and was not used. "Reduces acne" is attributed to the practitioner, not the FDA.
- Not re-verified by the gap filler: anything sourced to Seller Central help pages (the content route was refused to this session). The original A–L text was not re-checked, beyond the I3 post and the 250-byte note.

Reconciled 2026-10-14 (against the contradictions list of three critics; sources re-opened, not notes):
- Help-page reachability: the header now names the 2026-10-14 captures under the office's capture folder (outside this repository) for the seven Seller Central pages this file quotes most (G200390640 v21, G202024200 v11, GYTR6SYGFA5E3EQC v21, GX5L8BF8GLMML6CX v11 r8, G23501 v14, G1881 v28, G200898440 v13), and their *Pages read* rows carry the version and capture name. The quotes in B1, B3, B4, C3, D2, E3, I2, I3 and K5 were re-matched against those captures: all found. Files that call these pages unreachable or behind sign-in (images-and-video.md, listing-writes.md, description.md, search-terms.md) are the out-of-date ones; this file was right. G200333160 has no capture; its two rows and open question 9 now say the first pass fetched it with nothing drawn and the gap fill could not re-read it. No help page was fetched through the content call at reconciliation.
- Bullet page "revision 8" → version 11, revision 8 (the capture's header), in the header, *Pages read* and the verifier's note.
- I3 and "What this covers": "rewrite, not takedown" was stronger than Amazon's pages. Now I3 sets the posts' "active, editable, and searchable" beside the title page v21's "might be automatically corrected or it might not appear in our search results" and its "Title suppression" and "Title blocked" rows, and the developer guide's "does not affect your current listings unless you submit an update" (as recorded in title.md). It names all three and says the outcome for a listing is read at run time from `issues`, `summaries` and `getCatalogItem`.
- I3 "non-compliant listings": the earlier note was right only for the July 27 post. The words are in News_Amazon's follow-up "Answers to your product title update questions" (302aaac6…), opened at reconciliation and quoted. title.md, competitor-set.md and listing-writes.md quote that follow-up correctly. The point that a title nobody updated is in scope when over 75 characters stands.
- Item Highlights 125: now cited to the four Amazon pages that carry it (both posts, the title page v21, G200390640 v21). The binding limit is `title_differentiation` in `getDefinitionsProductType`. The verifier's "would expect" line was updated to match.
- Title length: A2 and K5 no longer call one Amazon page stale by preference. They name the figures as they stand: 200 (the 2015/2018 PDFs), 75 (title page, G200390640, the posts), 80/130 (Suppressed listings v13, live). The binding limit is the product type's schema, read at run time; title.md owns how the schema and the modular-title guide relate.
- Search terms: E3 now carries Amazon's own over-limit rule ("completely ignored", Keyword attributes explained GF2C2L6RCFZGWBXC v4) and the 249 / "less than 250" difference between it and G10471 v13. The binding byte limit is `generic_keyword` in `getDefinitionsProductType`. The My Amazon Guy note no longer stands in for Amazon's rule. Both pages were read from their captures and added to *Pages read*.
- Page id: E3 and the G23501 row state that G23501 is the live page and G201047930 is served as no topic (help-page-access.md A3). search-terms.md is the file to correct.
- Run time: two items added, for schema-kept figures and for whether Amazon rewrote or hid a title. The policy-pages item now points to the captures and to the office's ruling on the route. The [seat] line on the content call now points to the same ruling.
- P-listing-policies-15 adds the follow-up post to its sources. No "Stable enough" line or position states a schema-kept or announced figure; none needed a change on that count.
- Cross-references checked: every file this one names exists (`research/elements/title.md`, `research/elements/bullet-points.md`, `research/elements/search-terms.md`, `research/angles/account-health.md`, `research/angles/price-position.md`, `research/method/help-page-access.md`). It names neither of the merged files.
