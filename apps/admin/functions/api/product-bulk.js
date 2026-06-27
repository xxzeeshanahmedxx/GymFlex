import { requireUser } from '../_lib/auth';
import { slugify } from '../_lib/db';
import { error, json } from '../_lib/http';

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;

  const rows = await context.env.STORE_DB.prepare(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON c.id = p.category_id
    ORDER BY p.created_at ASC
  `).all();

  const products = (rows.results || []).map((p) => ({
    name: p.name,
    slug: p.slug,
    category: p.category_name,
    price: p.price,
    sale_price: p.sale_price || '',
    on_sale: p.on_sale ? 'yes' : 'no',
    is_active: p.is_active ? 'yes' : 'no',
    is_featured: p.is_featured ? 'yes' : 'no',
    description: p.description || '',
  }));

  if (products.length === 0) return error('No products found');

  const headers = Object.keys(products[0]);
  const csvRows = [headers.join(',')];
  for (const product of products) {
    csvRows.push(headers.map((h) => `"${String(product[h] || '').replace(/"/g, '""')}"`).join(','));
  }

  return new Response(csvRows.join('\n'), {
    headers: {
      'content-type': 'text/csv',
      'content-disposition': 'attachment; filename="gymflex-products.csv"',
    },
  });
}

export async function onRequestPost(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;

  const formData = await context.request.formData();
  const file = formData.get('file');
  if (!file) return error('CSV file is required');

  const text = await file.text();
  const lines = text.split('\n').filter(Boolean);
  if (lines.length < 2) return error('CSV must have a header row and at least one data row');

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const categories = await context.env.STORE_DB.prepare('SELECT id, name FROM categories').all();
  const categoryMap = {};
  (categories.results || []).forEach((c) => { categoryMap[c.name.toLowerCase().trim()] = c.id; });

  const statements = [];
  let imported = 0;

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    const row = {};
    headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
    if (!row.name) continue;

    const categoryId = categoryMap[(row.category || '').toLowerCase().trim()];
    if (!categoryId) continue;

    const id = crypto.randomUUID();
    statements.push(
      context.env.STORE_DB.prepare(
        'INSERT INTO products (id, category_id, name, slug, description, price, sale_price, on_sale, is_active, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ).bind(
        id, categoryId, row.name, slugify(row.name) + '-' + Date.now(),
        row.description || '', Number(row.price || 0),
        row.sale_price ? Number(row.sale_price) : null,
        row.on_sale === 'yes' ? 1 : 0,
        row.is_active !== 'no' ? 1 : 0,
        row.is_featured === 'yes' ? 1 : 0,
      ),
    );
    imported++;
  }

  if (statements.length > 0) {
    await context.env.STORE_DB.batch(statements);
  }

  return json({ ok: true, imported });
}