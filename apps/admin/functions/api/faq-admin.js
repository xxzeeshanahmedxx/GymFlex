import { requireUser } from '../_lib/auth';
import { error, json, readJson } from '../_lib/http';

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const rows = await context.env.STORE_DB.prepare('SELECT * FROM faq_items ORDER BY sort_order ASC, created_at ASC').all();
  return json({ items: rows.results || [] });
}

export async function onRequestPost(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const body = await readJson(context.request);
  if (!body.question || !body.answer) return error('question and answer required');
  const id = crypto.randomUUID();
  await context.env.STORE_DB.prepare('INSERT INTO faq_items (id, category, question, answer, sort_order) VALUES (?, ?, ?, ?, ?)').bind(id, body.category || 'General', body.question, body.answer, Number(body.sort_order || 0)).run();
  return json({ id });
}

export async function onRequestPut(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return error('id required');
  const body = await readJson(context.request);
  await context.env.STORE_DB.prepare('UPDATE faq_items SET category = ?, question = ?, answer = ?, sort_order = ?, is_active = ? WHERE id = ?').bind(body.category || 'General', body.question, body.answer, Number(body.sort_order || 0), body.is_active != null ? (body.is_active ? 1 : 0) : 1, id).run();
  return json({ ok: true });
}

export async function onRequestDelete(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return error('id required');
  await context.env.STORE_DB.prepare('DELETE FROM faq_items WHERE id = ?').bind(id).run();
  return json({ ok: true });
}