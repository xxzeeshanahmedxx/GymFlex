import { requireUser } from '../_lib/auth';
import { scheduleCachePurge } from '../_lib/cache';
import { normalizeCategory, slugify } from '../_lib/db';
import { error, json, noContent, readJson } from '../_lib/http';

function getId(request) {
  return new URL(request.url).searchParams.get('id');
}

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const id = getId(context.request);
  if (!id) return error('Category id is required');
  const row = await context.env.STORE_DB.prepare('SELECT * FROM categories WHERE id = ? LIMIT 1').bind(id).first();
  if (!row) return error('Category not found', 404);
  return json({ category: normalizeCategory(row) });
}

export async function onRequestPost(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const body = await readJson(context.request);
  const name = String(body?.name || '').trim();
  const slug = slugify(body?.slug || name);
  const description = String(body?.description || '').trim();
  const sortOrder = Number(body?.sort_order || 0);
  if (!name || !slug) return error('Name and slug are required');
  const id = crypto.randomUUID();
  try {
    await context.env.STORE_DB.prepare('INSERT INTO categories (id, name, slug, description, sort_order) VALUES (?, ?, ?, ?, ?)').bind(id, name, slug, description, sortOrder).run();
  } catch (dbError) {
    return error('Category slug or name already exists', 409, dbError.message);
  }
  scheduleCachePurge(context, 'admin-category-create');
  return json({ category: { id, name, slug, description, sort_order: sortOrder } }, 201);
}

export async function onRequestPut(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const id = getId(context.request);
  if (!id) return error('Category id is required');
  const body = await readJson(context.request);
  const name = String(body?.name || '').trim();
  const slug = slugify(body?.slug || name);
  const description = String(body?.description || '').trim();
  const sortOrder = Number(body?.sort_order || 0);
  if (!name || !slug) return error('Name and slug are required');
  try {
    const result = await context.env.STORE_DB.prepare('UPDATE categories SET name = ?, slug = ?, description = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(name, slug, description, sortOrder, id).run();
    if (!result.meta.changes) return error('Category not found', 404);
  } catch (dbError) {
    return error('Category slug or name already exists', 409, dbError.message);
  }
  scheduleCachePurge(context, 'admin-category-update');
  return json({ category: { id, name, slug, description, sort_order: sortOrder } });
}

export async function onRequestDelete(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const id = getId(context.request);
  if (!id) return error('Category id is required');
  const linkedProducts = await context.env.STORE_DB.prepare('SELECT COUNT(*) AS total FROM products WHERE category_id = ?').bind(id).first();
  if (Number(linkedProducts?.total || 0) > 0) return error('Cannot delete a category that still has products');
  const result = await context.env.STORE_DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
  if (!result.meta.changes) return error('Category not found', 404);
  scheduleCachePurge(context, 'admin-category-delete');
  return noContent();
}
