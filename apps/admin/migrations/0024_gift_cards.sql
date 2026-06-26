PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS gift_cards (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  initial_balance INTEGER NOT NULL,
  balance INTEGER NOT NULL,
  expires_at TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gift_card_transactions (
  id TEXT PRIMARY KEY,
  gift_card_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  order_id TEXT,
  type TEXT NOT NULL CHECK(type IN ('redeem', 'topup')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
