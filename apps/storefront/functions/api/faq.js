import { json } from '../_lib/http';

export async function onRequestGet(context) {
  const rows = await context.env.STORE_DB.prepare("SELECT * FROM faq_items WHERE is_active = 1 ORDER BY sort_order ASC, created_at ASC").all();
  return json({ items: rows.results || [] }, { headers: { 'Cache-Control': 'public, max-age=300' } });
}