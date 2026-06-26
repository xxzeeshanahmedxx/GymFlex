import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const outputPath = path.resolve('migrations/0002_seed_catalog.sql');
const sql = `-- Optional seed file for template stores.
-- Replace this with categories/products for the new brand.
INSERT INTO categories (id, name, slug, description, sort_order) VALUES
('collection-one', 'Collection One', 'collection-one', 'Replace with first category.', 0),
('collection-two', 'Collection Two', 'collection-two', 'Replace with second category.', 1),
('collection-three', 'Collection Three', 'collection-three', 'Replace with third category.', 2)
ON CONFLICT(id) DO NOTHING;\n`;
mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, sql);
console.log(`Wrote ${outputPath}`);
