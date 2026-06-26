import { error, json, readJson } from '../_lib/http';

export async function onRequestPost(context) {
  const body = await readJson(context.request);
  const email = String(body?.email || '').trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return error('Valid email is required');
  const existing = await context.env.STORE_DB.prepare('SELECT id FROM newsletter_subscribers WHERE email = ? LIMIT 1').bind(email).first();
  if (existing) return json({ ok: true, message: 'Already subscribed' });
  await context.env.STORE_DB.prepare('INSERT INTO newsletter_subscribers (id, email) VALUES (?, ?)').bind(crypto.randomUUID(), email).run();
  return json({ ok: true, message: 'Subscribed successfully' }, 201);
}