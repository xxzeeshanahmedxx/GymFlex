PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS price_alerts (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  email TEXT NOT NULL,
  target_price INTEGER NOT NULL,
  is_notified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
