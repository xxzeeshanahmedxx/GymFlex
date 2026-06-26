PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS look_products (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  linked_product_id TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (linked_product_id) REFERENCES products(id) ON DELETE CASCADE
);
