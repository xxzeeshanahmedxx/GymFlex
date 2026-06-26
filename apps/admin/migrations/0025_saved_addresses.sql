PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS saved_addresses (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  label TEXT DEFAULT 'Home',
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
