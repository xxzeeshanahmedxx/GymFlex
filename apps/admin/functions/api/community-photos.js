import { requireUser } from '../_lib/auth';
import { json, readJson } from '../_lib/http';

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const rows = await context.env.STORE_DB.prepare('SELECT * FROM community_photos ORDER BY created_at DESC').all();
  return json({ photos: rows.results || [] });
}

export async function onRequestPut(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  const body = await readJson(context.request);
  if (!id) return json({ error: 'id required' }, { status: 400 });
  await context.env.STORE_DB.prepare('UPDATE community_photos SET is_approved = ? WHERE id = ?').bind(body.is_approved ? 1 : 0, id).run();
  return json({ ok: true });
}

export async function onRequestDelete(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'id required' }, { status: 400 });
  await context.env.STORE_DB.prepare('DELETE FROM community_photos WHERE id = ?').bind(id).run();
  return json({ ok: true });
}