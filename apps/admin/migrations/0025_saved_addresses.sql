CREATE TABLE IF NOT EXISTS saved_addresses (
  id TEXT PRIMARY KEY,
  customer_email TEXT NOT NULL,
  label TEXT DEFAULT 'Home',
  address_line1 TEXT NOT NULL,
  address_line2 TEXT DEFAULT '',
  city TEXT NOT NULL,
  phone TEXT,
  is_default INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
