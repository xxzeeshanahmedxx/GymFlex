import { requireUser } from '../_lib/auth';
import { error, json, readJson } from '../_lib/http';

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const rows = await context.env.STORE_DB.prepare('SELECT * FROM gift_cards ORDER BY created_at DESC').all();
  return json({ cards: rows.results || [] });
}

export async function onRequestPost(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const body = await readJson(context.request);
  if (!body.balance || body.balance < 1) return error('Initial balance required');
  const id = crypto.randomUUID();
  const code = `GIFT-${Array.from({ length: 8 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('')}`;
  await context.env.STORE_DB.prepare('INSERT INTO gift_cards (id, code, initial_balance, balance, expires_at) VALUES (?, ?, ?, ?, ?)').bind(id, code, Number(body.balance), Number(body.balance), body.expires_at || null).run();
  return json({ id, code });
}

export async function onRequestPut(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return error('id required');
  const body = await readJson(context.request);
  await context.env.STORE_DB.prepare('UPDATE gift_cards SET balance = ?, is_active = ? WHERE id = ?').bind(Number(body.balance), body.is_active ? 1 : 0, id).run();
  return json({ ok: true });
}