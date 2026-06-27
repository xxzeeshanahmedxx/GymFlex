import { json, readJson, error } from '../_lib/http';

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const approved = url.searchParams.get('approved') !== '0';
  const rows = await context.env.STORE_DB.prepare(
    approved
      ? "SELECT * FROM community_photos WHERE is_approved = 1 ORDER BY created_at DESC"
      : "SELECT * FROM community_photos ORDER BY created_at DESC"
  ).all();
  return json({ photos: rows.results || [] });
}

export async function onRequestPost(context) {
  const body = await readJson(context.request);
  if (!body.image_url || !body.email) return error('image_url and email required');
  const id = crypto.randomUUID();
  await context.env.STORE_DB.prepare('INSERT INTO community_photos (id, image_url, author_name) VALUES (?, ?, ?)').bind(id, body.image_url, body.email).run();
  return json({ id }, 201);
}