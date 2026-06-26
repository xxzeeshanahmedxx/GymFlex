PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS community_photos (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  image_url TEXT NOT NULL,
  author_name TEXT DEFAULT 'GymFlex Customer',
  is_approved INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
