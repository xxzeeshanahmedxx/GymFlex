import { normalizeProduct, buildProductListQuery } from '../_lib/db';
import { cacheJson, error } from '../_lib/http';

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const q = (url.searchParams.get('q') || '').trim();
  if (!q) return error('Search query is required');

  const like = `%${q}%`;
  const limit = Math.min(Number(url.searchParams.get('limit')) || 20, 50);

  const { results } = await context.env.STORE_DB.prepare(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug,
      (
        SELECT cdn_url FROM product_images
        WHERE product_id = p.id
        ORDER BY is_primary DESC, sort_order ASC, created_at ASC
        LIMIT 1
      ) AS primary_image_url
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.is_active = 1 AND p.slug NOT LIKE '%-edition'
      AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)
    ORDER BY p.sort_order ASC, p.created_at DESC
    LIMIT ?
  `).bind(like, like, like, limit).all();

  return cacheJson({ products: (results || []).map(normalizeProduct), query: q }, { maxAge: 60, sMaxAge: 3600 });
}
