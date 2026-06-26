import { error, json, readJson } from '../_lib/http';

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const phone = String(url.searchParams.get('phone') || '');
  if (!phone) return error('phone required');
  const rows = await context.env.STORE_DB.prepare('SELECT * FROM saved_addresses WHERE customer_email = ? ORDER BY is_default DESC, created_at DESC').bind(phone).all();
  return json({ addresses: rows.results || [] });
}

export async function onRequestPost(context) {
  const body = await readJson(context.request);
  const { customer_email, label, address_line1, address_line2, city, phone } = body || {};
  if (!customer_email || !address_line1 || !city || !phone) return error('customer_email, address_line1, city, phone required');
  const id = crypto.randomUUID();
  await context.env.STORE_DB.prepare('INSERT INTO saved_addresses (id, customer_email, label, address_line1, address_line2, city, phone) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, customer_email, label || 'Home', address_line1, address_line2 || '', city, phone).run();
  return json({ id }, 201);
}

export async function onRequestDelete(context) {
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return error('id required');
  await context.env.STORE_DB.prepare('DELETE FROM saved_addresses WHERE id = ?').bind(id).run();
  return json({ ok: true });
}