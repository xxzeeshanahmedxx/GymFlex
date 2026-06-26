import { requireUser } from '../_lib/auth';
import { slugify } from '../_lib/db';
import { error, json, readJson } from '../_lib/http';

export async function onRequestPost(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const body = await readJson(context.request);
  const sourceId = body?.id;
  if (!sourceId) return error('Product id is required');

  const source = await context.env.STORE_DB.prepare('SELECT * FROM products WHERE id = ? LIMIT 1').bind(sourceId).first();
  if (!source) return error('Source product not found', 404);

  const newId = crypto.randomUUID();
  const newSlug = `${slugify(source.name)}-copy-${Date.now()}`;

  await context.env.STORE_DB.prepare(`
    INSERT INTO products (id, category_id, name, slug, description, price, sale_price, on_sale, is_active, is_featured, sort_order, video_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?)
  `).bind(newId, source.category_id, `${source.name} (Copy)`, newSlug, source.description || '', source.price, source.sale_price, source.on_sale ? 1 : 0, source.video_url || '').run();

  const variants = await context.env.STORE_DB.prepare('SELECT * FROM product_variants WHERE product_id = ?').bind(sourceId).all();
  const variantStatements = (variants.results || []).map((v) =>
    context.env.STORE_DB.prepare('INSERT INTO product_variants (id, product_id, type, name, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)').bind(crypto.randomUUID(), newId, v.type, v.name, v.image_url || '', v.sort_order || 0),
  );

  const images = await context.env.STORE_DB.prepare('SELECT * FROM product_images WHERE product_id = ?').bind(sourceId).all();
  const imageStatements = (images.results || []).map((img) =>
    context.env.STORE_DB.prepare('INSERT INTO product_images (id, product_id, r2_key, cdn_url, alt_text, sort_order, is_primary) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(crypto.randomUUID(), newId, img.r2_key, img.cdn_url, img.alt_text || '', img.sort_order || 0, img.is_primary || 0),
  );

  await context.env.STORE_DB.batch([...variantStatements, ...imageStatements]);
  return json({ id: newId, slug: newSlug });
}