import { requireUser } from '../_lib/auth';
import { slugify } from '../_lib/db';
import { error, json, readJson } from '../_lib/http';

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const rows = await context.env.STORE_DB.prepare('SELECT b.*, GROUP_CONCAT(bi.product_id) AS product_ids FROM bundles b LEFT JOIN bundle_items bi ON bi.bundle_id = b.id GROUP BY b.id ORDER BY b.created_at DESC').all();
  return json({ bundles: rows.results || [] });
}

export async function onRequestPost(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const body = await readJson(context.request);
  if (!body.name || !body.price) return error('name and price required');
  const id = crypto.randomUUID();
  await context.env.STORE_DB.prepare('INSERT INTO bundles (id, name, slug, description, price) VALUES (?, ?, ?, ?, ?)').bind(id, body.name, slugify(body.name) + '-' + Date.now(), body.description || '', Number(body.price)).run();
  if (Array.isArray(body.product_ids)) {
    const statements = body.product_ids.map((pid) => context.env.STORE_DB.prepare('INSERT INTO bundle_items (id, bundle_id, product_id) VALUES (?, ?, ?)').bind(crypto.randomUUID(), id, pid));
    if (statements.length > 0) await context.env.STORE_DB.batch(statements);
  }
  return json({ id });
}

export async function onRequestDelete(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return error('id required');
  await context.env.STORE_DB.batch([
    context.env.STORE_DB.prepare('DELETE FROM bundle_items WHERE bundle_id = ?').bind(id),
    context.env.STORE_DB.prepare('DELETE FROM bundles WHERE id = ?').bind(id),
  ]);
  return json({ ok: true });
}