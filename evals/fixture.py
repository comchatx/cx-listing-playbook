"""A synthetic seller's tree for the skill-creator runs: no real seller, no Amazon call.

Today in the fixture is 2026-10-14. Marketplace ATVPDKIKX0DER. ASINs B0FIXTURE1..7 are the seller's; B0COMPET01/02 are competitors.
"""
import json, os, sys, shutil

root = sys.argv[1]
T = os.path.join(root, "tenant")
shutil.rmtree(T, ignore_errors=True)
M = "ATVPDKIKX0DER"
SELLER = "A1FIXTURESELLER"


def put(rel, data):
    path = os.path.join(T, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(data if isinstance(data, str) else json.dumps(data, indent=2))


def listing(asin, sku, title, bullets, keywords, status=("BUYABLE", "DISCOVERABLE"), issues=(), ptype="BLANKET"):
    return {
        "sku": sku,
        "summaries": [{"marketplaceId": M, "asin": asin, "productType": ptype, "conditionType": "new_new", "status": list(status),
                       "itemName": title, "createdDate": "2025-03-02T10:11:12Z", "lastUpdatedDate": "2026-10-01T08:00:00Z"}],
        "attributes": {
            "item_name": [{"value": title, "language_tag": "en_US", "marketplace_id": M}],
            "bullet_point": [{"value": b, "language_tag": "en_US", "marketplace_id": M} for b in bullets],
            "generic_keyword": [{"value": keywords, "language_tag": "en_US", "marketplace_id": M}],
            "brand": [{"value": "Hearthly", "language_tag": "en_US", "marketplace_id": M}],
        },
        "issues": list(issues),
        "offers": [{"marketplaceId": M, "offerType": "B2C", "price": {"currencyCode": "USD", "amount": "29.99"}}],
    }


def catalog(asin, title, rank):
    return {"asin": asin,
            "summaries": [{"marketplaceId": M, "brand": "Hearthly", "itemName": title, "browseClassification": {"displayName": "Throw Blankets", "classificationId": "1063278"}}],
            "salesRanks": [{"marketplaceId": M, "classificationRanks": [{"classificationId": "1063278", "title": "Throw Blankets", "rank": rank}]}]}


def offers(asin, we_win, other_price):
    ours = {"SellerId": SELLER, "MyOffer": True, "IsBuyBoxWinner": we_win, "IsFulfilledByAmazon": True, "ListingPrice": {"CurrencyCode": "USD", "Amount": 29.99}, "SubCondition": "new"}
    other = {"SellerId": "A2OTHERSELLER9", "MyOffer": False, "IsBuyBoxWinner": not we_win, "IsFulfilledByAmazon": True, "ListingPrice": {"CurrencyCode": "USD", "Amount": other_price}, "SubCondition": "new"}
    return {"payload": {"ASIN": asin, "marketplaceId": M, "status": "Success", "ItemCondition": "New",
                        "Summary": {"TotalOfferCount": 2, "NumberOfOffers": [{"condition": "new", "fulfillmentChannel": "Amazon", "OfferCount": 2}],
                                    "BuyBoxPrices": [{"condition": "New", "ListingPrice": {"CurrencyCode": "USD", "Amount": 29.99 if we_win else other_price}}]},
                        "Offers": [ours, other]}}


TITLE1 = "Hearthly Fleece Throw Blanket 50x60 Inch, Soft Lightweight Plush Blanket for Couch Sofa Bed and Travel, Machine Washable, Grey"
B1 = ["SOFT AND WARM: 280 GSM microfleece that stays soft wash after wash.",
      "THROW SIZE: 50 x 60 inches covers one adult on a couch or in a chair.",
      "MACHINE WASHABLE: cold wash, tumble dry low; no shedding or pilling.",
      "LIGHTWEIGHT: folds small for travel, picnics and the car.",
      "GIFT READY: arrives folded in a reusable cotton bag."]
KW = "fleece throw blanket couch grey plush soft warm lightweight travel blanket sofa"

# B0FIXTURE1 — the Featured Offer moved to another seller in the latest week; the Catalog shows a shorter title than submitted.
put(f"raw/amazon-sp-api/getListingsItem-HL-FLEECE-GRY-2026-10-14.json", listing("B0FIXTURE1", "HL-FLEECE-GRY", TITLE1, B1, KW))
put(f"raw/amazon-sp-api/getCatalogItem-B0FIXTURE1-2026-10-14.json", catalog("B0FIXTURE1", "Hearthly Fleece Throw Blanket 50x60 Inch, Grey", 4120))
put(f"raw/amazon-sp-api/getItemOffers-B0FIXTURE1-2026-09-28.json", offers("B0FIXTURE1", True, 31.49))
put(f"raw/amazon-sp-api/getItemOffers-B0FIXTURE1-2026-10-14.json", offers("B0FIXTURE1", False, 27.49))

# The product-type schema, trimmed to the attributes the runs touch. Fixture limits only.
put("raw/amazon-sp-api/getDefinitionsProductType-BLANKET-ATVPDKIKX0DER-2026-10-14.json", {
    "productType": "BLANKET", "productTypeVersion": {"version": "U1.0-FIXTURE", "latest": True},
    "schema": {"properties": {
        "item_name": {"items": {"properties": {"value": {"type": "string", "maxLength": 150, "minLength": 1}}}},
        "title_differentiation": {"items": {"properties": {"value": {"type": "string", "maxLength": 75}}}},
        "bullet_point": {"maxItems": 5, "items": {"properties": {"value": {"type": "string", "maxLength": 300}}}},
        "generic_keyword": {"items": {"properties": {"value": {"type": "string", "maxUtf8ByteLength": 250}}}}}},
    "requirements": "LISTING", "requirementsEnforced": "ENFORCED"})


def sat(asin_rows, start, end):
    return {"reportSpecification": {"reportType": "GET_SALES_AND_TRAFFIC_REPORT", "dataStartTime": start, "dataEndTime": end, "marketplaceIds": [M],
                                    "reportOptions": {"asinGranularity": "CHILD", "dateGranularity": "WEEK"}},
            "salesAndTrafficByAsin": [{"parentAsin": a, "childAsin": a,
                                       "salesByAsin": {"unitsOrdered": u, "orderedProductSales": {"amount": round(u * 29.99, 2), "currencyCode": "USD"}, "totalOrderItems": u},
                                       "trafficByAsin": {"sessions": s, "pageViews": round(s * 1.3), "buyBoxPercentage": bb, "unitSessionPercentage": round(100 * u / s, 2)}}
                                      for a, s, u, bb in asin_rows]}


# Sales and Traffic by week, child granularity, as report.sh lands it.
weeks = [("2026-08-30", "2026-09-05"), ("2026-09-06", "2026-09-12"), ("2026-09-13", "2026-09-19"), ("2026-09-20", "2026-09-26"),
         ("2026-09-27", "2026-10-03"), ("2026-10-04", "2026-10-10")]
rows = {
    # asin: [(sessions, units, buyBox%) per week]
    "B0FIXTURE1": [(2100, 210, 97.0), (2050, 207, 96.5), (2120, 214, 97.2), (2080, 209, 96.8), (2060, 205, 96.0), (2010, 118, 41.5)],
    "B0FIXTURE2": [(1500, 120, 98.0), (1480, 118, 98.0), (1520, 121, 97.5), (1490, 119, 98.1), (1650, 137, 98.0), (2900, 290, 97.9)],
    "B0FIXTURE5": [(5200, 520, 99.0), (5150, 517, 99.1), (5300, 583, 99.0), (5250, 578, 98.8), (5180, 570, 99.0), (5900, 650, 99.0)],
    "B0FIXTURE6": [(4100, 369, 99.0), (4080, 367, 99.2), (4120, 408, 99.0), (4060, 402, 99.1), (4090, 405, 98.9), (4700, 470, 99.0)],
}
for i, (s, e) in enumerate(weeks):
    doc = sat([(a, *rows[a][i]) for a in rows], f"{s}T00:00:00Z", f"{e}T23:59:59Z")
    d = f"reports/GET_SALES_AND_TRAFFIC_REPORT/{M}_{s}T00-00-00Z_{e}T23-59-59Z_fixture{i}"
    put(f"{d}/report.json", doc)
    put(f"{d}/receipt.json", {"reportId": f"9000{i}", "processingStatus": "DONE", "document": "report.json", "source": "createReport",
                              "ask": {"reportType": "GET_SALES_AND_TRAFFIC_REPORT", "marketplaceIds": [M], "dataStartTime": f"{s}T00:00:00Z", "dataEndTime": f"{e}T23:59:59Z",
                                      "reportOptions": {"asinGranularity": "CHILD", "dateGranularity": "WEEK"}}})


def sqp_row(asin, s, e, query, vol, tot_imp, imp, tot_clk, clk, tot_pur, pur):
    return {"startDate": s, "endDate": e, "asin": asin,
            "searchQueryData": {"searchQuery": query, "searchQueryScore": 1, "searchQueryVolume": vol},
            "impressionData": {"totalQueryImpressionCount": tot_imp, "asinImpressionCount": imp, "asinImpressionShare": round(imp / tot_imp, 4)},
            "clickData": {"totalClickCount": tot_clk, "asinClickCount": clk, "asinClickShare": round(clk / tot_clk, 4)},
            "purchaseData": {"totalPurchaseCount": tot_pur, "asinPurchaseCount": pur, "asinPurchaseShare": round(pur / tot_pur, 4)}}


# Search Query Performance, ASIN view, one document per week (Sunday to Saturday).
sqp = {
    # (asin, query): per week (volume, totalImpr, asinImpr, totalClicks, asinClicks, totalPurch, asinPurch)
    ("B0FIXTURE1", "fleece throw blanket"): [(41000, 820000, 24600, 30000, 900, 3100, 95)] * 5 + [(40500, 810000, 24300, 29800, 880, 3050, 52)],
    ("B0FIXTURE2", "grey throw blanket"): [(18000, 360000, 7200, 12000, 240, 1300, 26), (17800, 356000, 7120, 11900, 236, 1290, 26),
                                           (18100, 362000, 7240, 12100, 243, 1310, 26), (18000, 360000, 8600, 12000, 280, 1300, 30),
                                           (21000, 420000, 10500, 14000, 350, 1500, 37), (39000, 780000, 21800, 26000, 720, 2900, 80)],
    ("B0FIXTURE2", "plush throw blanket for couch"): [(9000, 180000, 2700, 6000, 90, 700, 10)] * 3 + [(9100, 182000, 3300, 6050, 110, 705, 12),
                                           (10500, 210000, 4200, 7000, 140, 800, 16), (19500, 390000, 8600, 13000, 290, 1500, 33)],
    ("B0FIXTURE4", "sherpa blanket queen"): [(21500, 430000, 6450, 14700, 221, 1570, 23), (22000, 440000, 6600, 15000, 225, 1600, 24), (22400, 448000, 6800, 15300, 232, 1630, 25),
                                             (22900, 458000, 6950, 15600, 236, 1660, 25), (26000, 520000, 7700, 17700, 262, 1890, 28), (41000, 820000, 11900, 27900, 405, 2980, 43)],
    ("B0FIXTURE4", "warm sherpa blanket"): [(7800, 156000, 3100, 5100, 101, 550, 11), (8000, 160000, 3200, 5200, 104, 560, 11), (8200, 164000, 3300, 5300, 107, 575, 11),
                                            (8400, 168000, 3350, 5450, 110, 590, 12), (9600, 192000, 3800, 6200, 124, 670, 13), (15500, 310000, 6000, 10100, 200, 1090, 21)],
}
for i, (s, e) in enumerate(weeks):
    doc = {"reportSpecification": {"reportType": "GET_BRAND_ANALYTICS_SEARCH_QUERY_PERFORMANCE_REPORT", "reportOptions": {"reportPeriod": "WEEK"},
                                   "dataStartTime": s, "dataEndTime": e, "marketplaceIds": [M]},
           "dataByAsin": [sqp_row(a, s, e, q, *v[i]) for (a, q), v in sqp.items()]}
    d = f"reports/GET_BRAND_ANALYTICS_SEARCH_QUERY_PERFORMANCE_REPORT/{M}_{s}_{e}_fixture{i}"
    put(f"{d}/report.json", doc)
    put(f"{d}/receipt.json", {"reportId": f"9100{i}", "processingStatus": "DONE", "document": "report.json", "source": "createReport",
                              "ask": {"reportType": "GET_BRAND_ANALYTICS_SEARCH_QUERY_PERFORMANCE_REPORT", "marketplaceIds": [M], "dataStartTime": s, "dataEndTime": e,
                                      "reportOptions": {"reportPeriod": "WEEK", "asin": "B0FIXTURE1 B0FIXTURE2 B0FIXTURE4"}}})

# Competitor control set for B0FIXTURE2, frozen 2026-09-19, and the seller's own note of Amazon's announced event dates.
put("listings/B0FIXTURE2/control-set-2026-09-19.md", "# Control set for B0FIXTURE2, frozen 2026-09-19\n\n- B0COMPET01 (same query set, same price band)\n- B0COMPET02 (same query set, same price band)\n- Seller's untouched ASIN: none in this category\n")
put("notes/amazon-events.md", "# Amazon events the seller noted\n\n- Prime Big Deal Days (US): Amazon announced 2026-10-06 and 2026-10-07, early deals from 2026-09-30. Source: the seller's copy of Amazon's announcement, saved 2026-09-15.\n")

# B0FIXTURE2 — a title change whose observation window has ended and overlaps the announced event.
put("listings/B0FIXTURE2/changes/2026-09-20-title.md", """# 2026-09-20 — title: lead with "Grey Throw Blanket"

- **Before.** item_name "Hearthly Plush Fleece Blanket 50x60, Grey" (getListingsItem 2026-09-19, raw/amazon-sp-api/getListingsItem-HL-PLUSH-GRY-2026-09-19.json). Offers: 1, this seller holds the Featured Offer.
- **After.** item_name "Hearthly Grey Throw Blanket for Couch, Plush Fleece 50x60 Inch" — submitted; getCatalogItem showed the same name on 2026-09-21.
- **Expected.** Stage: exposure. Metric: asinImpressionShare on the two words bet on, from the weekly Search Query Performance documents under reports/GET_BRAND_ANALYTICS_SEARCH_QUERY_PERFORMANCE_REPORT/. Orders: unitsOrdered from the weekly Sales and Traffic documents. Direction: up. Range: +10% to +30% relative, if price and the Featured Offer hold. Smallest move that counts: +8% relative. Lag: from the first whole week after the change shows.
- **Words bet on.** "grey throw blanket" (baseline share 0.0200), "plush throw blanket for couch" (baseline share 0.0150). Neither had paid search-term rows in the baseline.
- **Windows.** Baseline 2026-09-06 to 2026-09-19. Observation 2026-09-27 to 2026-10-10 (window ends 2026-10-10).
- **Control set.** listings/B0FIXTURE2/control-set-2026-09-19.md.
- **Seller's decision.** "改吧，标题按这个来。广告先不动。" (2026-09-20)
- **Cannot tell leads to.** Extend the observation once, by two weeks.
- **Request.** PATCH https://sellingpartnerapi-na.amazon.com/listings/2021-08-01/items/A1FIXTURESELLER/HL-PLUSH-GRY?marketplaceIds=ATVPDKIKX0DER, body: replace /attributes/item_name.
- **Receipt.** submissionId 5f1e-fixture-0920, status ACCEPTED, issues none.
""")

# B0FIXTURE3 — an image change whose window has not ended.
put("listings/B0FIXTURE3/changes/2026-10-05-main-image.md", """# 2026-10-05 — main image: lifestyle shot replaced by white-background product shot

- **Expected.** Stage: click-through. Metric: asinClickShare on "waffle knit throw", weekly Search Query Performance. Range: +5% to +15% relative. Smallest move: +5%.
- **Windows.** Baseline 2026-09-13 to 2026-10-03. Observation 2026-10-11 to 2026-10-31 (window ends 2026-10-31).
- **Seller's decision.** "换主图吧" (2026-10-05)
- **Cannot tell leads to.** Revert.
- **Receipt.** submissionId 77aa-fixture-1005, status ACCEPTED, issues none.
""")

# B0FIXTURE5 — a bullet change judged on conversion; the seller's untouched B0FIXTURE6 is the control.
put("listings/B0FIXTURE5/changes/2026-09-12-bullets.md", """# 2026-09-12 — bullets: sizing and care first

- **Expected.** Stage: conversion. Metric: unitSessionPercentage from the weekly Sales and Traffic documents (child). Orders: unitsOrdered, same file. Direction: up. Range: +5% to +15% relative. Smallest move that counts: +5% relative.
- **Windows.** Baseline 2026-08-30 to 2026-09-12 (weeks of 2026-08-30 and 2026-09-06). Observation 2026-09-13 to 2026-09-26 (window ends 2026-09-26).
- **Control set.** The seller's untouched ASIN B0FIXTURE6 (same category, no change since July).
- **Seller's decision.** "就按这个版本改" (2026-09-12)
- **Cannot tell leads to.** Keep.
- **Receipt.** submissionId 31bc-fixture-0912, status ACCEPTED, issues none; getCatalogItem showed the new bullets on 2026-09-12.
""")

# B0FIXTURE4 — current bullets, for a change about to be made.
put("raw/amazon-sp-api/getListingsItem-HL-SHERPA-Q-2026-10-14.json", listing(
    "B0FIXTURE4", "HL-SHERPA-Q",
    "Hearthly Sherpa Fleece Blanket Queen Size 90x90, Reversible Warm Bed Blanket, Navy",
    ["DOUBLE-SIDED: sherpa on one side, flannel fleece on the other.", "QUEEN SIZE: 90 x 90 inches.", "WARM NOT HEAVY: 2.9 lb.",
     "EASY CARE: machine wash cold.", "GIFT: a box with a ribbon."], "sherpa queen blanket navy reversible warm winter bed", ptype="BLANKET"))
put("raw/amazon-sp-api/getItemOffers-B0FIXTURE4-2026-10-14.json", offers("B0FIXTURE4", True, 49.99))
put("raw/amazon-sp-api/getCatalogItem-B0FIXTURE4-2026-10-14.json", catalog("B0FIXTURE4", "Hearthly Sherpa Fleece Blanket Queen Size 90x90, Reversible Warm Bed Blanket, Navy", 9800))

# B0FIXTURE7 — the listing as read this morning: the submitted search terms not yet applied.
put("raw/amazon-sp-api/getListingsItem-HL-WAFFLE-OAT-2026-10-14.json", listing(
    "B0FIXTURE7", "HL-WAFFLE-OAT", "Hearthly Waffle Knit Throw Blanket 50x60, Cotton, Oatmeal",
    ["100% COTTON waffle weave.", "50 x 60 inches.", "BREATHABLE for summer.", "MACHINE WASHABLE.", "OATMEAL colour."],
    "waffle blanket throw cotton waffle knit throw blanket couch"))

# B0FIXTURE7 — a change logged before the write, its receipt still pending.
put("listings/B0FIXTURE7/changes/2026-10-13-search-terms.md", """# 2026-10-13 — search terms: replace duplicates of the title with new words

- **Before.** generic_keyword "waffle blanket throw cotton waffle knit throw blanket couch" (getListingsItem 2026-10-13).
- **After.** generic_keyword "honeycomb knit bed spread summer lightweight coverlet beige oatmeal"
- **Expected.** Stage: exposure. Metric: asinImpressionShare on "honeycomb blanket" and "summer coverlet", weekly Search Query Performance. Range: +5% to +20% relative. Smallest move: +5%.
- **Words bet on.** "honeycomb blanket", "summer coverlet".
- **Windows.** Baseline 2026-09-27 to 2026-10-10. Observation: opens when the change shows; four whole weeks.
- **Seller's decision.** "可以，换掉。" (2026-10-13)
- **Cannot tell leads to.** Keep.
- **Request.** PATCH https://sellingpartnerapi-na.amazon.com/listings/2021-08-01/items/A1FIXTURESELLER/HL-WAFFLE-OAT?marketplaceIds=ATVPDKIKX0DER with body {"productType":"BLANKET","patches":[{"op":"replace","path":"/attributes/generic_keyword","value":[{"value":"honeycomb knit bed spread summer lightweight coverlet beige oatmeal","language_tag":"en_US","marketplace_id":"ATVPDKIKX0DER"}]}]}
- **Receipt.** pending.
""")
print(T)
