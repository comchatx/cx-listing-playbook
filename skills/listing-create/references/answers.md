# What Amazon answers to a creation

## Identity and catalog

- `4005007` is an identifier not registered for the brand given; it is answered with proof of affiliation such as a GS1 certificate or licence (P-listing-create-9).
- `4005008` is an identifier restricted or not registered in GS1 (P-listing-create-9).
- `100980` is a barcode already on another ASIN, looked up through the Catalog Items API (P-listing-create-9).
- `4005013` is an item already in the seller's catalog under another SKU (P-listing-create-8).
- `90225` and `90188` are an identifier of the wrong length or checksum: 12 for UPC, 13 for EAN, 14 for GTIN (P-listing-create-9).
- An approval requirement on a new item shows as a `QUALIFICATION_REQUIRED` issue on the preview or the write (P-listing-create-22).
- `4005011` is a value that conflicts with another catalog item: the submitted value is changed to the catalog's, or Amazon is contacted to change the catalog's (P-listing-create-24).
- `4005033` is a value that cannot be edited: it is reverted to the original and resubmitted, and a support case disputes an original that is wrong (P-listing-create-24).
- `101165` is SKU, external ID and ASIN matching several products: they are made unique and resubmitted, and support resolves a duplicate in Amazon's catalog (P-listing-create-24).

## Sandbox

- The static sandbox answers a put by pattern: an empty body `ACCEPTED`, SKU `VALIDATION_VALID` `VALID`, SKU `VALIDATION_INVALID` `INVALID` with a canned `90220`, and `BadSKU` 400 (P-listing-create-20).
- Its product type search answers one product type, and its schema link is a placeholder, not a schema (P-listing-create-20).
