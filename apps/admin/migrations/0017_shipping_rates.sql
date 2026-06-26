PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS shipping_rates (
  id TEXT PRIMARY KEY,
  city TEXT NOT NULL UNIQUE,
  fee INTEGER NOT NULL,
  estimated_days TEXT DEFAULT '3-5'
);
