import { requireUser } from '../_lib/auth';
import { normalizeOrder } from '../_lib/db';
import { error, json, readJson } from '../_lib/http';

const allowedStatuses = new Set(['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']);

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

export async function onRequestPost(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;

  const body = await readJson(context.request);
  const ids = Array.isArray(body.ids) ? body.ids : [];
  const status = String(body.status || '').trim();

  if (ids.length === 0) return error('No order IDs provided');
  if (!allowedStatuses.has(status)) return error('Invalid order status');

  const statements = ids.map((orderId) =>
    context.env.STORE_DB.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(status, orderId),
  );

  await context.env.STORE_DB.batch(statements);

  return json({ ok: true, updated: ids.length });
}
