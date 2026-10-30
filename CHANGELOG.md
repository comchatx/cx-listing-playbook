# Changelog

## 0.3.0 (unreleased)

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
