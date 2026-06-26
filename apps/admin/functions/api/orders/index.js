import { requireUser } from '../../_lib/auth';
import { normalizeOrder } from '../../_lib/db';
import { json } from '../../_lib/http';

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;

  const rows = await context.env.STORE_DB.prepare(`
    SELECT o.*, (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS item_count
    FROM orders o
    ORDER BY o.created_at DESC
  `).all();

  return json({ orders: (rows.results || []).map(normalizeOrder) });
}
