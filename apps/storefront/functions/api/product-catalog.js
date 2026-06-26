import { buildProductListQuery, normalizeProduct } from '../_lib/db';
import { cacheJson } from '../_lib/http';

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const category = url.searchParams.get('category');
  const featured = url.searchParams.get('featured') === '1';
  const sale = url.searchParams.get('sale') === '1';
  const limitValue = url.searchParams.get('limit');
  const limit = limitValue ? Number(limitValue) : null;

  const { sql, bindings } = buildProductListQuery({ category, featured, sale, limit });
  const rows = await context.env.STORE_DB.prepare(sql).bind(...bindings).all();

  return cacheJson({ products: (rows.results || []).map(normalizeProduct) }, { maxAge: 300, sMaxAge: 86400, staleWhileRevalidate: 86400 });
}
