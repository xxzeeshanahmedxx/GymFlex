PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Later schema additions used by the template.
ALTER TABLE orders ADD COLUMN state TEXT DEFAULT '';
ALTER TABLE orders ADD COLUMN shipping_fee INTEGER NOT NULL DEFAULT 0;
ALTER TABLE product_variants ADD COLUMN image_url TEXT DEFAULT '';

INSERT OR IGNORE INTO site_settings (key, value)
VALUES (
  'homepage',
  '{
    "heroButtonText": "Shop GymFlex",
    "heroButtonLink": "/shop",
    "featuredProductId": "gymflex-dri-fit-tee",
    "featuredEyebrow": "New Arrivals",
    "featuredTitle": "Featured Products",
    "collectionKicker": "Men''s",
    "recentTitle": "Recently Viewed",
    "headerCollectionSlugs": ["mens"],
    "heroBanner": {
      "animation": "fade",
      "animationDuration": 100,
      "slideDuration": 5000,
      "desktopImages": ["", "", ""],
      "mobileImages": ["", "", ""]
    },
    "shippingFee": 0,
    "freeShippingMinimum": 1000
  }'
);
