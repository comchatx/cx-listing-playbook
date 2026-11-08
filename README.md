This playbook teaches cx how to work on your Amazon listings: creating new ones, seeing how each one is doing and why, proposing changes, and judging afterwards whether a change worked.

With it, cx:

- Creates listings in the stores you name, from your own words and your product's data. It reads each one back until buyers can find it and buy it.
- Reviews a listing at each step from search to purchase, says what has changed since it last looked, and reads what Amazon itself reports about the listing.
- Proposes a change with its reasons and the figures behind them.
- Keeps a record of every change: before and after, what was expected, and Amazon's receipt.
- Tells you, once enough time has passed, whether a change worked, did not, or cannot be told yet.
- Explains the Buy Box: whether your offer holds it, why not, and which causes you can fix in your store.

To have cx keep watching a listing for you, also install cx-listing-watch.

## Try it

- `/listing-create US,DE new product, data in /tenant/products/new-router/, shipped by FBA`
- `/listing-review <ASIN>`

## What it uses

- **Amazon SP-API:** your Amazon seller account, connected on the Amazon SP-API plugin. cx reads your listings, offers and reports there, and changes your listings there.
- **Keepa,** where you have it: price and rank history, and your competitors' listings.

Each is its own plugin, and its page gives its price.

## Where cx keeps things

- One file per change to a listing, in `/tenant/listings/<ASIN>/changes/`.
- Amazon's reports as they came, in `/tenant/reports/`.

Every fact this playbook gives cx names its source; the sources are in [`research/`](research/README.md).
