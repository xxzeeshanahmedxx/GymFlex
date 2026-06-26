import { error, json, readJson } from '../_lib/http';
import { requireUser } from '../_lib/auth';

export async function onRequestGet(context) {
  const auth = await requireUser(context);
  if (auth instanceof Response) return auth;

  const url = new URL(context.request.url);
  const productId = url.searchParams.get('productId');

  let sql = 'SELECT r.*, p.name AS product_name FROM reviews r JOIN products p ON p.id = r.product_id';
  const bindings = [];
  if (productId) {
    sql += ' WHERE r.product_id = ?';
    bindings.push(productId);
  }
  sql += ' ORDER BY r.created_at DESC LIMIT 200';

  const { results } = await context.env.STORE_DB.prepare(sql).bind(...bindings).all();
  return json({ reviews: results || [] });
}

export async function onRequestPatch(context) {
  const auth = await requireUser(context);
  if (auth instanceof Response) return auth;

  const body = await readJson(context.request);
  const { id, isApproved } = body || {};
  if (!id) return error('id is required');

  const existing = await context.env.STORE_DB
    .prepare('SELECT * FROM reviews WHERE id = ? LIMIT 1')
    .bind(id)
    .first();
  if (!existing) return error('Review not found', 404);

  await context.env.STORE_DB
    .prepare('UPDATE reviews SET is_approved = ? WHERE id = ?')
    .bind(isApproved ? 1 : 0, id)
    .run();

  return json({ success: true });
}

export async function onRequestDelete(context) {
  const auth = await requireUser(context);
  if (auth instanceof Response) return auth;

  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return error('id is required');

  await context.env.STORE_DB
    .prepare('DELETE FROM reviews WHERE id = ?')
    .bind(id)
    .run();

  return json({ success: true });
}
