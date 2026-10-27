# A variation family

- The parent's schema is read with `parentageLevel=PARENT` and each child's with `parentageLevel=CHILD`, where the theme's attributes and `parent_sku` appear as required (P-listing-create-5; P-listing-create-16).
- The parent carries `parentage_level` `parent`, `child_parent_sku_relationship` with `child_relationship_type` `variation`, and a `variation_theme` the schema offers, and no offer, since a parent is not buyable (P-listing-create-16).
- Each child carries `parentage_level` `child`, `child_parent_sku_relationship` with `child_relationship_type` `variation` and the parent's SKU in `parent_sku`, the parent's `variation_theme`, and the theme's attributes (P-listing-create-16).
- Each child repeats the family's product facts (P-listing-create-16).
- A theme flagged `enumDeprecated` is not used for a new family (P-listing-create-16; P-variations-2).
- A child that differs from its siblings in function, generation or model gets its own detail page, not a place in the family (P-variations-4).
- A standalone listing's schema is read with `parentageLevel=NONE` (P-listing-create-5).
- A family has taken when `issues` are empty and Catalog `relationships` show the intended parent, children and theme (P-variations-10).
