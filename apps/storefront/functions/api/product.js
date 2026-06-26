import { normalizeProduct, normalizeVariant } from '../_lib/db';
import { cacheJson, error } from '../_lib/http';

export async function onRequestGet(context) {
  const idOrSlug = new URL(context.request.url).searchParams.get('id');
  if (!idOrSlug) {
    return error('Product id is required');
  }

  const row = await context.env.STORE_DB.prepare(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug,
      (
        SELECT cdn_url FROM product_images
        WHERE product_id = p.id
        ORDER BY is_primary DESC, sort_order ASC, created_at ASC
        LIMIT 1
      ) AS primary_image_url
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE (p.id = ? OR p.slug = ?) AND p.is_active = 1 AND p.slug NOT LIKE '%-edition'
    LIMIT 1
  `).bind(idOrSlug, idOrSlug).first();

  if (!row) {
    return error('Product not found', 404);
  }

  const variants = await context.env.STORE_DB.prepare('SELECT * FROM product_variants WHERE product_id = ? AND COALESCE(is_active, 1) = 1 ORDER BY sort_order ASC, created_at ASC').bind(row.id).all();
  const images = await context.env.STORE_DB.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC, created_at ASC').bind(row.id).all();

  return cacheJson({
    product: normalizeProduct(row),
    variants: (variants.results || []).map(normalizeVariant),
    images: images.results || [],
  }, { maxAge: 300, sMaxAge: 86400, staleWhileRevalidate: 86400 });
}
