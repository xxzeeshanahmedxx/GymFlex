import { error, json, readJson } from '../_lib/http';

export async function onRequestPost(context) {
  const body = await readJson(context.request);
  const email = String(body?.email || '').trim();
  const variantId = String(body?.variantId || '').trim();

  if (!email || !variantId) return error('email and variantId required');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return error('Valid email is required');

  await context.env.STORE_DB.prepare('INSERT INTO stock_alerts (id, variant_id, email) VALUES (?, ?, ?)').bind(crypto.randomUUID(), variantId, email).run();
  return json({ ok: true }, 201);
}