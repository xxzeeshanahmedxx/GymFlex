import { error, json, readJson } from '../_lib/http';

export async function onRequestPost(context) {
  const body = await readJson(context.request);
  const orderNumber = String(body?.orderNumber || '').trim();
  const phone = String(body?.phone || '').replace(/\D/g, '');

  if (!orderNumber || !phone) return error('orderNumber and phone required');

  const order = await context.env.STORE_DB.prepare('SELECT id, status, created_at FROM orders WHERE order_number = ? AND phone LIKE ? LIMIT 1').bind(orderNumber, `%${phone}`).first();
  if (!order) return error('Order not found');
  if (order.status !== 'new') return error('Only new orders can be cancelled');
  const created = new Date(order.created_at + 'Z');
  if (Date.now() - created.getTime() > 3600000) return error('Orders can only be cancelled within 1 hour of placement');

  await context.env.STORE_DB.prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?").bind(order.id).run();
  return json({ ok: true, status: 'cancelled' });
}