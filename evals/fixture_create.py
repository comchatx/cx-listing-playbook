"""The listing-create cases' additions to the synthetic seller's tree: no real seller, no Amazon reply.

Run: python3 -I evals/fixture_create.py <dir>. It writes the 10-14 tree with evals/fixture.py first, then adds:
- the seller's stores (US and DE participating);
- three products under tenant/products/: a new kettle (no catalog match, a required wattage missing from the data),
  a blanket already on Amazon as B0FIXTURE1 that the seller now wants to sell in DE (offer-only), and a two-colour
  cushion-cover family whose images are only local files;
- the replies cx's stand-in answers with: catalog searches by identifier, product type search, definitions with
  their schema documents under tenant/raw/documents/, restrictions, and validation-preview answers.
"""
import json, os, runpy, sys

here = os.path.dirname(os.path.abspath(__file__))
sys.argv = [os.path.join(here, "fixture.py"), sys.argv[1]]
runpy.run_path(os.path.join(here, "fixture.py"), run_name="__main__")
T = os.path.join(sys.argv[1], "tenant")
STUB = os.path.join(sys.argv[1], "stub-replies")
US, DE = "ATVPDKIKX0DER", "A1PA6795UKMFR9"
R = "raw/amazon-sp-api"


def put(rel, data):
    # Amazon's replies for these cases are the stand-in's, kept beside the tree where the run does not look;
    # the seller's files and the documents already fetched are in the tree.
    path = os.path.join(STUB, rel[len(R) + 1:]) if rel.startswith(R + "/") else os.path.join(T, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(data if isinstance(data, str) else json.dumps(data, indent=2, ensure_ascii=False))


# The stores.
put(f"{R}/getMarketplaceParticipations-2026-10-14.json", {"payload": [
    {"marketplace": {"id": US, "countryCode": "US", "name": "Amazon.com", "defaultCurrencyCode": "USD", "defaultLanguageCode": "en_US", "domainName": "www.amazon.com"},
     "participation": {"isParticipating": True, "hasSuspendedListings": False}, "storeName": "Hearthly Home"},
    {"marketplace": {"id": DE, "countryCode": "DE", "name": "Amazon.de", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "de_DE", "domainName": "www.amazon.de"},
     "participation": {"isParticipating": True, "hasSuspendedListings": False}, "storeName": "Hearthly Home"}]})

# Product type search: one answer for any query, as a search returns several.
put(f"{R}/searchDefinitionsProductTypes-2026-10-14.json", {"productTypes": [
    {"name": "KETTLE", "displayName": "Kettle", "marketplaceIds": [US, DE]},
    {"name": "PILLOW", "displayName": "Pillow", "marketplaceIds": [US, DE]},
    {"name": "BLANKET", "displayName": "Blanket", "marketplaceIds": [US, DE]}], "productTypeVersion": "U1"})


def definition(ptype, market, requirements, doc):
    return {"productType": ptype, "displayName": ptype.title(), "marketplaceIds": [market], "requirements": requirements,
            "requirementsEnforced": "ENFORCED", "locale": "en_US", "productTypeVersion": {"version": "U1", "latest": True},
            "schema": {"link": {"resource": f"https://selling-partner-definitions-prod-iad.s3.amazonaws.com/schema/{doc}", "verb": "GET"}, "checksum": "c0ffee" + ptype},
            "metaSchema": {"link": {"resource": "https://selling-partner-definitions-prod-iad.s3.amazonaws.com/metaschema/v1.json", "verb": "GET"}, "checksum": "meta"},
            "propertyGroups": {}}


def text(maxlen, tags):
    return {"type": "array", "items": {"type": "object", "required": ["value", "language_tag"], "properties": {
        "value": {"type": "string", "maxLength": maxlen}, "language_tag": {"enum": tags}, "marketplace_id": {"type": "string"}}}}


def enum(values):
    return {"type": "array", "items": {"type": "object", "required": ["value"], "properties": {"value": {"enum": values}, "marketplace_id": {"type": "string"}}}}


ident = {"type": "array", "items": {"type": "object", "required": ["type", "value"], "properties": {
    "type": {"enum": ["upc", "ean", "gtin"]}, "value": {"type": "string"}, "marketplace_id": {"type": "string"}}}}
image = {"type": "array", "items": {"type": "object", "required": ["media_location"], "properties": {
    "media_location": {"type": "string", "format": "uri"}, "marketplace_id": {"type": "string"}}}}
offer = {"type": "array", "items": {"type": "object", "required": ["currency", "our_price"], "properties": {
    "audience": {"enum": ["ALL", "B2B"]}, "currency": {"type": "string"}, "marketplace_id": {"type": "string"},
    "our_price": {"type": "array", "items": {"type": "object", "properties": {"schedule": {"type": "array", "items": {"type": "object", "properties": {"value_with_tax": {"type": "number"}}}}}}}}}}


def fulfil(codes):
    return {"type": "array", "items": {"type": "object", "required": ["fulfillment_channel_code"], "properties": {
        "fulfillment_channel_code": {"enum": codes}, "quantity": {"type": "integer"}, "lead_time_to_ship_max_days": {"type": "integer"}}}}


# 1. The kettle: new item, US. The schema requires wattage; the seller's data has none.
put(f"{R}/getDefinitionsProductType-KETTLE-2026-10-14.json", definition("KETTLE", US, "LISTING", "amzn1.ptd.KETTLE.ATVPDKIKX0DER.json"))
put("raw/documents/amzn1.ptd.KETTLE.ATVPDKIKX0DER.json", {
    "$schema": "https://schemas.amazon.com/selling-partners/definitions/product-types/meta-schema/v1", "type": "object",
    "required": ["condition_type", "item_name", "brand", "externally_assigned_product_identifier", "bullet_point", "wattage",
                 "supplier_declared_dg_hz_regulation", "batteries_required", "main_product_image_locator"],
    "properties": {
        "condition_type": enum(["new_new", "used_like_new"]), "item_name": text(200, ["en_US"]), "brand": text(100, ["en_US"]),
        "bullet_point": text(500, ["en_US"]), "product_description": text(2000, ["en_US"]),
        "externally_assigned_product_identifier": ident,
        "wattage": {"type": "array", "items": {"type": "object", "required": ["value", "unit"], "properties": {"value": {"type": "number"}, "unit": {"enum": ["watts"]}}}},
        "capacity": {"type": "array", "items": {"type": "object", "properties": {"value": {"type": "number"}, "unit": {"enum": ["liters", "milliliters"]}}}},
        "supplier_declared_dg_hz_regulation": enum(["not_applicable", "ghs", "storage", "transportation", "waste", "other", "unknown"]),
        "batteries_required": {"type": "array", "items": {"type": "object", "properties": {"value": {"type": "boolean"}}}},
        "main_product_image_locator": image, "other_product_image_locator_1": image, "other_product_image_locator_2": image,
        "purchasable_offer": offer, "fulfillment_availability": fulfil(["DEFAULT"]),
        "merchant_shipping_group": enum(["legacy-template-id", "a1b2c3d4-two-day"])},
    "$defs": {"language_tag": {"enum": ["en_US"]}}})
put(f"{R}/searchCatalogItems-012345678905-2026-10-14.json", {"numberOfResults": 0, "items": []})
put(f"{R}/putListingsItem-preview-HL-KETTLE-BLK.json", {"sku": "HL-KETTLE-BLK", "status": "INVALID", "submissionId": "f1d0c0de0000preview", "issues": [
    {"code": "90220", "message": "'wattage' is required but not supplied.", "severity": "ERROR", "attributeNames": ["wattage"], "categories": ["MISSING_ATTRIBUTE", "LISTING"]}], "identifiers": []})
put(f"{R}/putListingsItem-preview-HL-KETTLE-BLK-if-wattage.json", {"sku": "HL-KETTLE-BLK", "status": "VALID", "submissionId": "f1d0c0de0001preview", "issues": [], "identifiers": []})
put("products/ember-kettle/product.md", """# Hearthly Gooseneck Electric Kettle, Matte Black

- SKU: HL-KETTLE-BLK
- UPC: 012345678905 (bought from GS1 US, company prefix 0123456)
- Brand: Hearthly (our own brand, enrolled in Brand Registry under this account)
- Capacity: 0.9 L
- Material: stainless steel body, matte black finish
- Plug: US 120 V
- Batteries: none. Not hazardous.
- Condition: new

## Title
Hearthly Gooseneck Electric Kettle 0.9L, Matte Black Pour-Over Kettle with Temperature Hold

## Bullets
1. Gooseneck spout for a slow, even pour-over stream
2. Holds your set temperature for 60 minutes
3. 0.9 L stainless steel body, BPA-free
4. Auto shut-off and boil-dry protection
5. Matte black finish that resists fingerprints

## Description
A pour-over kettle for coffee and tea at home.

## Price and stock
- 39.99 USD
- We ship it ourselves from our warehouse: 50 units, ships within 2 days (our shipping template is the two-day one)

## Images
- Main: https://cdn.hearthly.example/kettle/main.jpg
- Side: https://cdn.hearthly.example/kettle/side.jpg
""")

# 2. The blanket in DE: it exists as B0FIXTURE1, so this is an offer on that ASIN.
put(f"{R}/searchCatalogItems-4006381333931-2026-10-14.json", {"numberOfResults": 1, "items": [{"asin": "B0FIXTURE1",
    "summaries": [{"marketplaceId": DE, "brand": "Hearthly", "itemName": "Hearthly Kuscheldecke Fleece 127x152 cm, Grau", "itemClassification": "BASE_PRODUCT"}],
    "productTypes": [{"marketplaceId": DE, "productType": "BLANKET"}], "identifiers": [{"marketplaceId": DE, "identifiers": [{"identifierType": "EAN", "identifier": "4006381333931"}]}]}]})
put(f"{R}/getListingsRestrictions-B0FIXTURE1-2026-10-14.json", {"restrictions": []})
put(f"{R}/getDefinitionsProductType-PRODUCT-2026-10-14.json", definition("PRODUCT", DE, "LISTING_OFFER_ONLY", "amzn1.ptd.PRODUCT.A1PA6795UKMFR9.json"))
put("raw/documents/amzn1.ptd.PRODUCT.A1PA6795UKMFR9.json", {
    "$schema": "https://schemas.amazon.com/selling-partners/definitions/product-types/meta-schema/v1", "type": "object",
    "required": ["condition_type", "merchant_suggested_asin"],
    "properties": {"condition_type": enum(["new_new"]), "merchant_suggested_asin": {"type": "array", "items": {"type": "object", "properties": {"value": {"type": "string"}}}},
                   "purchasable_offer": offer, "fulfillment_availability": fulfil(["DEFAULT", "AMAZON_EU"])},
    "$defs": {"language_tag": {"enum": ["de_DE", "en_GB"]}}})
put(f"{R}/putListingsItem-preview-HL-FLEECE-GRY-DE.json", {"sku": "HL-FLEECE-GRY-DE", "status": "INVALID", "submissionId": "f1d0c0de0002preview", "issues": [
    {"code": "90220", "message": "'merchant_suggested_asin' is required but not supplied.", "severity": "ERROR", "attributeNames": ["merchant_suggested_asin"], "categories": ["MISSING_ATTRIBUTE", "LISTING"]}], "identifiers": []})
put(f"{R}/putListingsItem-preview-HL-FLEECE-GRY-DE-if-B0FIXTURE1.json", {"sku": "HL-FLEECE-GRY-DE", "status": "VALID", "submissionId": "f1d0c0de0003preview", "issues": [],
    "identifiers": [{"marketplaceId": DE, "asin": "B0FIXTURE1"}]})
put("products/fleece-de/product.md", """# Fleece throw for Germany

- The same grey fleece throw we sell in the US (SKU HL-FLEECE-GRY there)
- EAN: 4006381333931
- New SKU for Germany: HL-FLEECE-GRY-DE
- Price in Germany: 34,99 EUR
- Fulfilment: FBA (we send stock to Amazon's EU warehouses)
""")

# 3. The cushion-cover family: two colours, images only on our disk.
put(f"{R}/getDefinitionsProductType-PILLOW-2026-10-14.json", definition("PILLOW", US, "LISTING", "amzn1.ptd.PILLOW.ATVPDKIKX0DER.json"))
put("raw/documents/amzn1.ptd.PILLOW.ATVPDKIKX0DER.json", {
    "$schema": "https://schemas.amazon.com/selling-partners/definitions/product-types/meta-schema/v1", "type": "object",
    "required": ["condition_type", "item_name", "brand", "parentage_level"],
    "properties": {
        "condition_type": enum(["new_new"]), "item_name": text(200, ["en_US"]), "brand": text(100, ["en_US"]),
        "bullet_point": text(500, ["en_US"]), "externally_assigned_product_identifier": ident, "color": text(50, ["en_US"]),
        "size": text(50, ["en_US"]), "material": text(50, ["en_US"]),
        "parentage_level": enum(["parent", "child"]),
        "child_parent_sku_relationship": {"type": "array", "items": {"type": "object", "properties": {"child_relationship_type": {"enum": ["variation"]}, "parent_sku": {"type": "string"}}}},
        "variation_theme": {"type": "array", "items": {"type": "object", "properties": {"name": {"enum": ["COLOR", "SIZE", "SIZE/COLOR", "COLOR_NAME"]}}}},
        "main_product_image_locator": image, "other_product_image_locator_1": image,
        "purchasable_offer": offer, "fulfillment_availability": fulfil(["DEFAULT"])},
    "allOf": [{"if": {"properties": {"parentage_level": {"contains": {"properties": {"value": {"const": "child"}}}}}},
               "then": {"required": ["child_parent_sku_relationship", "variation_theme", "color", "externally_assigned_product_identifier", "main_product_image_locator", "purchasable_offer", "fulfillment_availability"]}},
              {"if": {"properties": {"parentage_level": {"contains": {"properties": {"value": {"const": "parent"}}}}}},
               "then": {"required": ["child_parent_sku_relationship", "variation_theme"]}}],
    "$lifecycle": {"variation_theme": {"enumDeprecated": ["COLOR_NAME"]}},
    "$defs": {"language_tag": {"enum": ["en_US"]}}})
for sku in ("HL-LINEN-PARENT", "HL-LINEN-CRM", "HL-LINEN-SGE"):
    put(f"{R}/putListingsItem-preview-{sku}.json", {"sku": sku, "status": "VALID", "submissionId": f"f1d0c0de{sku}", "issues": [], "identifiers": []})
put(f"{R}/searchCatalogItems-012345678912-2026-10-14.json", {"numberOfResults": 0, "items": []})
put(f"{R}/searchCatalogItems-012345678929-2026-10-14.json", {"numberOfResults": 0, "items": []})
put("products/linen-cushion/product.md", """# Hearthly Washed Linen Cushion Cover 18x18 in — two colours

One product in two colours; we want them grouped on one page so shoppers pick the colour.

- Brand: Hearthly (ours, Brand Registry)
- Size: 18 x 18 inches; material: 100% washed linen; hidden zipper
- Parent SKU: HL-LINEN-PARENT
- Cream: SKU HL-LINEN-CRM, UPC 012345678912
- Sage: SKU HL-LINEN-SGE, UPC 012345678929
- Price: 24.99 USD each; we ship ourselves, 80 of each colour
- Title: Hearthly Washed Linen Cushion Cover 18x18 Inch, Soft Throw Pillow Case with Hidden Zipper

## Bullets
1. 100% washed linen, soft from the first use
2. Hidden zipper for a clean edge
3. Fits an 18 x 18 inch insert (insert not included)

## Images
The photos are in images/ next to this file: cream-main.jpg, sage-main.jpg, both-lifestyle.jpg.
""")
for name in ("cream-main.jpg", "sage-main.jpg", "both-lifestyle.jpg"):
    put(f"products/linen-cushion/images/{name}", "not a real image: a placeholder for the run\n")
# 4. The mug set: put yesterday, ACCEPTED; today no summary and a barcode that belongs to another product.
put("products/stoneware-mugs/product.md", """# Hearthly Stoneware Mug Set of 4, 12 oz

- SKU: HL-MUG-SET
- UPC: 012345678936
- Brand: Hearthly (ours, Brand Registry)
- Price: 32.99 USD; we ship ourselves, 40 sets
""")
put("products/stoneware-mugs/submitted.md", """# Submitted

- 2026-10-13 16:02 UTC: putListingsItem HL-MUG-SET, US, productType DRINKING_CUP
- Amazon answered: status ACCEPTED, submissionId 7c1e2f00a1b2c3d4e5f6, issues []
""")
put(f"{R}/getListingsItem-HL-MUG-SET-2026-10-14.json", {"sku": "HL-MUG-SET", "summaries": [], "attributes": {
    "item_name": [{"value": "Hearthly Stoneware Mug Set of 4, 12 oz", "language_tag": "en_US", "marketplace_id": US}],
    "externally_assigned_product_identifier": [{"type": "upc", "value": "012345678936", "marketplace_id": US}]},
    "issues": [{"code": "100980", "message": "Your barcode is already associated with another product ASIN, which appears to be different from the product you are trying to list.",
                "severity": "ERROR", "attributeNames": ["externally_assigned_product_identifier"], "categories": ["PRODUCT"]}],
    "offers": [], "fulfillmentAvailability": []})
put(f"{R}/searchCatalogItems-012345678936-2026-10-14.json", {"numberOfResults": 1, "items": [{"asin": "B0OTHER001",
    "summaries": [{"marketplaceId": US, "brand": "Kilnworks", "itemName": "Kilnworks Speckled Ceramic Mugs, Set of 6, 16 oz"}],
    "productTypes": [{"marketplaceId": US, "productType": "DRINKING_CUP"}]}]})
print(T)
