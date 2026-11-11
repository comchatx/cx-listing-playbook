# Changelog

## 0.5.3

- The plugin's name is the one signed on 2026-11-11, "Amazon Listing Playbook", in `comchatx.name`.
- The Chinese line of the `listing-create` template is the signed words, 「在指定站点，按你的描述和产品资料创建 listing。」, with no slash command and no `/tenant/` path. It said 「用你自己的话和产品资料，在你指定的站点创建亚马逊 listing，例如 /listing-create US,DE 新品上架，数据在 /tenant/products/new-router/，FBA 发货。」.
- The README's sentence "Each is its own plugin, and its page gives its price." and its Chinese, 「两者各是一个插件，价格见各自的页面。」, are gone.

## 0.5.2

- The card line leads with the job: "Finds why a listing won't sell, then judges if each fix worked." in English, as npm's `description`, and 「找出 listing 卖不动的原因，改后判断是否见效。」 in Chinese, as `comchatx.about`. They said "Lets cx create and review listings, and judge changes." and 「让 cx 创建和检查 listing、分析 Buy Box，记录并评估每次修改。」.
- The README, in English and Chinese, opens on finding why a listing isn't selling and judging the change afterwards, then gives three questions to ask. Its own 「试一试」 / "Try it", whose prompts the Plugins page already shows, and "Where cx keeps things", which spoke to a developer, are gone; the research stays in the package, under `research/`.

## 0.5.1

- The package's `description`, which the Plugins page draws as the English card line, speaks to a seller: "Lets cx create and review listings, and judge changes." It said "A pi package for the work on an Amazon listing: how it performs and why, a log of each change, and how to judge one."

## 0.5.0

- cx judges when to ask you before it writes to your store, as ComChatX's decision D233 rules: no sentence of the playbook makes a step wait for your yes any more. A seller who tells cx to ask before any change has that followed.
- Each such sentence now says the fact it rested on. A preview persists nothing. A write without the preview is a real submission: Amazon checks and processes it and may refuse it, and only a later read-back shows whether buyers can find and buy the listing. A put on a SKU that exists replaces its content. A family change can delete listings and unlink every child, and names its reversal path. A new report schedule silently replaces the one before it. A description test changes the ASIN's description while it runs, and a search-terms test changes hidden data and where the ASIN can appear in search, with indexing not guaranteed.
- The change log keeps your words on a change where you gave any.
- Two open research questions on variation families no longer name a seller-approved SKU or parent as where their preview runs: a sandbox or a live one serves, since a preview persists nothing. One research question on prices no longer waits for anyone's word before its preview, for the same reason.
- Amazon's `similarItems` are candidates for the competitor set, and cx confirms what each is before tracking it, where the set used to hold only the candidates the seller had confirmed.
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
