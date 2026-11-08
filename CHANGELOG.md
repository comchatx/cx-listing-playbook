# Changelog

## 0.5.0

- cx judges when to ask you before it writes to your store, as ComChatX's decision D233 rules: no sentence of the playbook makes a step wait for your yes any more. A seller who tells cx to ask before any change has that followed.
- Each such sentence now says the fact it rested on. A preview persists nothing. A write without the preview goes live, and a put on a SKU that exists replaces its content. A family change can delete listings and unlink every child, and names its reversal path. A new report schedule silently replaces the one before it. A test on a live ASIN changes what buyers see while it runs.
- The change log keeps your words on a change where you gave any.
- The README no longer promises a yes before each write, in English or Chinese.

## 0.4.1

- The Plugins page's field names what the playbook builds on: `cx-amazon-sp-api`, required, since creating a listing reads your account there; `cx-keepa`, optional, for the Featured Offer's history and the deals and coupons an effect review weighs.

## 0.4.0

- The plugin's page now explains, in English and Chinese, what the playbook does for you and which data it uses. The notes for developers moved to `DEVELOPING.md`.
- The Try it lines read in your page's language: each template has one English sentence, and its Chinese is in `package.json`.
- Before you create a listing for a product that is not on sale yet, cx knows what Amazon has said about the three release dates (Product Site Launch Date, Offering Release Date, Merchant Release Date), and what it has not said. It reads what each date means in your store from that store's own rules, so it can ask you whether to sell now or build the listing first.
- Three habits cx can set aside when you ask: a chart is followed by a short table of its key dates and one insight; A+ is written for buyers who are deciding, and what Amazon has said about A+ text in search carries its date; a listing's text is written in each store's own language unless you ask for another, such as two languages.
- New research: `research/method/playbook-defaults.md` and positions P-listing-create-25 and 26.

## 0.3.0

- `skills/featured-offer` and its `references/` (`reads.md`, `causes.md`, `support.md`): how Amazon picks the Featured Offer, how to read whether the seller's offer holds it and why not, which causes a Listings Items write reaches and which it does not, and what the Support API reads.
- `research/method/featured-offer.md`: the facts the four angle files lacked, positions P-featured-offer-1 to 11.
- `prompts/listing-watch.md` is removed: `/listing-watch` is now the template of its own package, `@comchatx/cx-listing-watch`. `skills/listing-review/references/watch.md` stays, as the review's own.
- `package.json` gains the `comchatx` field the Plugins page reads: the card's Chinese line, its mark, section and place, and each skill's words.
- The package test loads the tarball npm would publish, and fails a copy whose `featured-offer` description is emptied.

## 0.2.0

- `skills/listing-create` and its `references/` (`request.md`, `family.md`, `answers.md`): creating a listing from the seller's data in the marketplaces the seller names, from the stores to the read-back.
- `prompts/listing-create.md`: `/listing-create <marketplaces> <your words, and where the product's data is>`.
- `research/method/listing-create.md`: the research behind it, positions P-listing-create-1 to 24; `research/README.md` gains positions R1–R10, its file row and its figures for human readers.
- A preview (`mode=VALIDATION_PREVIEW`) is sent as any read is, since it persists nothing; the open question in `research/angles/listing-content-and-health.md` and `research/README.md` is marked ruled.

## 0.1.0

- `skills/listing-review`, `skills/listing-change-log`, `skills/effect-review`, `scripts/report.sh`, `prompts/listing-review.md`, `prompts/listing-watch.md` and the research base.
