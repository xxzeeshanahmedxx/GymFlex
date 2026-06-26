import { requireUser } from '../_lib/auth';
import { error, json, readJson } from '../_lib/http';

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const rows = await context.env.STORE_DB.prepare('SELECT * FROM shipping_rates ORDER BY city ASC').all();
  return json({ rates: rows.results || [] });
}

export async function onRequestPost(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const body = await readJson(context.request);
  if (!body.city || body.fee == null) return error('city and fee required');
  const id = crypto.randomUUID();
  await context.env.STORE_DB.prepare('INSERT INTO shipping_rates (id, city, fee, estimated_days) VALUES (?, ?, ?, ?)').bind(id, body.city, Number(body.fee), body.estimated_days || '3-5').run();
  return json({ id });
}

export async function onRequestPut(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return error('id required');
  const body = await readJson(context.request);
  await context.env.STORE_DB.prepare('UPDATE shipping_rates SET city = ?, fee = ?, estimated_days = ? WHERE id = ?').bind(body.city, Number(body.fee), body.estimated_days || '3-5', id).run();
  return json({ ok: true });
}

export async function onRequestDelete(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return error('id required');
  await context.env.STORE_DB.prepare('DELETE FROM shipping_rates WHERE id = ?').bind(id).run();
  return json({ ok: true });
}