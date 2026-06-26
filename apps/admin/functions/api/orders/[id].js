import { requireUser } from '../../_lib/auth';
import { normalizeOrder } from '../../_lib/db';
import { error, json, readJson } from '../../_lib/http';

const allowedStatuses = new Set(['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']);

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;

  const order = await context.env.STORE_DB.prepare('SELECT * FROM orders WHERE id = ? LIMIT 1').bind(context.params.id).first();
  if (!order) return error('Order not found', 404);
  const items = await context.env.STORE_DB.prepare('SELECT * FROM order_items WHERE order_id = ? ORDER BY created_at ASC').bind(context.params.id).all();

  return json({ order: normalizeOrder(order), items: items.results || [] });
}

export async function onRequestPatch(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;

  const body = await readJson(context.request);
  const status = String(body?.status || '').trim();
  if (!allowedStatuses.has(status)) {
    return error('Invalid order status');
  }

  const result = await context.env.STORE_DB.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(status, context.params.id).run();
  if (!result.meta.changes) return error('Order not found', 404);

  const order = await context.env.STORE_DB.prepare('SELECT * FROM orders WHERE id = ? LIMIT 1').bind(context.params.id).first();
  return json({ order: normalizeOrder(order) });
}
