import { error, json, readJson } from '../_lib/http';

export async function onRequestPost(context) {
  const body = await readJson(context.request);
  const email = String(body?.email || '').trim();
  const productId = String(body?.productId || '').trim();
  const targetPrice = Number(body?.targetPrice);

  if (!email || !productId || !targetPrice || targetPrice <= 0) return error('email, productId, and targetPrice required');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return error('Valid email is required');

  await context.env.STORE_DB.prepare('INSERT INTO price_alerts (id, product_id, email, target_price) VALUES (?, ?, ?, ?)').bind(crypto.randomUUID(), productId, email, targetPrice).run();
  return json({ ok: true }, 201);
}