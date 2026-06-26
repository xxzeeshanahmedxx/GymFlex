import { requireUser } from '../_lib/auth';
import { error, json, readJson } from '../_lib/http';

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const url = new URL(context.request.url);
  const productId = url.searchParams.get('productId');
  if (!productId) return error('productId is required');
  const rows = await context.env.STORE_DB.prepare('SELECT * FROM tiered_pricing WHERE product_id = ? ORDER BY min_quantity ASC').bind(productId).all();
  return json({ tiers: rows.results || [] });
}

export async function onRequestPost(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const body = await readJson(context.request);
  if (!body.product_id || !body.min_quantity || body.discount_percent == null) return error('product_id, min_quantity, discount_percent required');
  const id = crypto.randomUUID();
  await context.env.STORE_DB.prepare('INSERT INTO tiered_pricing (id, product_id, min_quantity, discount_percent) VALUES (?, ?, ?, ?)').bind(id, body.product_id, Number(body.min_quantity), Number(body.discount_percent)).run();
  return json({ id });
}

export async function onRequestPut(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return error('id is required');
  const body = await readJson(context.request);
  await context.env.STORE_DB.prepare('UPDATE tiered_pricing SET min_quantity = ?, discount_percent = ? WHERE id = ?').bind(Number(body.min_quantity), Number(body.discount_percent), id).run();
  return json({ ok: true });
}

export async function onRequestDelete(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return error('id is required');
  await context.env.STORE_DB.prepare('DELETE FROM tiered_pricing WHERE id = ?').bind(id).run();
  return json({ ok: true });
}