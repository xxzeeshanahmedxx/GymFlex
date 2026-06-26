import { normalizeCategory } from '../_lib/db';
import { cacheJson } from '../_lib/http';

export async function onRequestGet(context) {
  const rows = await context.env.STORE_DB.prepare('SELECT * FROM categories ORDER BY sort_order ASC, created_at ASC').all();
  return cacheJson({ categories: (rows.results || []).map(normalizeCategory) }, { maxAge: 600, sMaxAge: 86400, staleWhileRevalidate: 86400 });
}
