import { cacheJson, error } from '../_lib/http';

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const productId = url.searchParams.get('productId');
  if (!productId) return error('productId is required');
  const rows = await context.env.STORE_DB.prepare('SELECT * FROM tiered_pricing WHERE product_id = ? ORDER BY min_quantity ASC').bind(productId).all();
  return cacheJson({ tiers: rows.results || [] }, { maxAge: 600, sMaxAge: 86400 });
}