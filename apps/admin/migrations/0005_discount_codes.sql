PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS discount_codes (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'percentage' CHECK(type IN ('percentage', 'fixed')),
  value INTEGER NOT NULL,
  min_order_amount INTEGER NOT NULL DEFAULT 0,
  max_uses INTEGER DEFAULT NULL,
  used_count INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  expires_at TEXT DEFAULT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE orders ADD COLUMN discount_code TEXT DEFAULT '';
ALTER TABLE orders ADD COLUMN discount_amount INTEGER NOT NULL DEFAULT 0;

INSERT OR IGNORE INTO discount_codes (id, code, type, value, min_order_amount, max_uses, is_active)
VALUES ('welcome10', 'WELCOME10', 'percentage', 10, 1000, 100, 1);

INSERT OR IGNORE INTO discount_codes (id, code, type, value, min_order_amount, max_uses, is_active)
VALUES ('gymflex50', 'GYMFLEX50', 'fixed', 500, 2000, 50, 1);
