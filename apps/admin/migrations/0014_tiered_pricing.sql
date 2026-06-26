PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS tiered_pricing (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  min_quantity INTEGER NOT NULL,
  discount_percent INTEGER NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
