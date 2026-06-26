import { requireUser } from '../_lib/auth';
import { error, json, readJson } from '../_lib/http';

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const rows = await context.env.STORE_DB.prepare('SELECT * FROM loyalty_points ORDER BY updated_at DESC').all();
  return json({ points: rows.results || [] });
}

export async function onRequestPost(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const body = await readJson(context.request);
  if (!body.phone || body.points == null) return error('phone and points required');
  const existing = await context.env.STORE_DB.prepare('SELECT * FROM loyalty_points WHERE phone = ? LIMIT 1').bind(body.phone).first();
  if (existing) {
    await context.env.STORE_DB.prepare('UPDATE loyalty_points SET points = points + ?, updated_at = CURRENT_TIMESTAMP WHERE phone = ?').bind(Number(body.points), body.phone).run();
  } else {
    await context.env.STORE_DB.prepare('INSERT INTO loyalty_points (phone, points) VALUES (?, ?)').bind(body.phone, Number(body.points)).run();
  }
  if (body.reason) {
    await context.env.STORE_DB.prepare('INSERT INTO loyalty_transactions (id, phone, points, reason) VALUES (?, ?, ?, ?)').bind(crypto.randomUUID(), body.phone, Number(body.points), body.reason).run();
  }
  return json({ ok: true });
}