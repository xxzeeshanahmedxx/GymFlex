import { error, json, readJson } from '../_lib/http';
import { requireUser } from '../_lib/auth';

export async function onRequestGet(context) {
  const auth = await requireUser(context);
  if (auth instanceof Response) return auth;

  const { results } = await context.env.STORE_DB
    .prepare('SELECT * FROM discount_codes ORDER BY created_at DESC')
    .all();

  return json(results.map((row) => ({
    id: row.id,
    code: row.code,
    type: row.type,
    value: row.value,
    minOrderAmount: row.min_order_amount,
    maxUses: row.max_uses,
    usedCount: row.used_count,
    isActive: Boolean(row.is_active),
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  })));
}

export async function onRequestPost(context) {
  const auth = await requireUser(context);
  if (auth instanceof Response) return auth;

  const body = await readJson(context.request);
  const code = (body.code || '').trim().toUpperCase();
  const type = body.type === 'fixed' ? 'fixed' : 'percentage';
  const value = Math.max(1, Number(body.value) || 0);
  const minOrderAmount = Math.max(0, Number(body.minOrderAmount) || 0);
  const maxUses = body.maxUses == null || body.maxUses === '' ? null : Math.max(1, Number(body.maxUses));
  const isActive = body.isActive !== false ? 1 : 0;
  const expiresAt = body.expiresAt || null;

  if (!code) return error('Code is required.', 400);
  if (value < 1) return error('Value must be at least 1.', 400);

  const id = crypto.randomUUID();

  await context.env.STORE_DB
    .prepare('INSERT INTO discount_codes (id, code, type, value, min_order_amount, max_uses, is_active, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, code, type, value, minOrderAmount, maxUses, isActive, expiresAt)
    .run();

  return json({ id, code, type, value, minOrderAmount, maxUses, isActive: Boolean(isActive), expiresAt }, 201);
}

export async function onRequestPut(context) {
  const auth = await requireUser(context);
  if (auth instanceof Response) return auth;

  const body = await readJson(context.request);
  const id = body.id;
  if (!id) return error('ID is required.', 400);

  const existing = await context.env.STORE_DB
    .prepare('SELECT * FROM discount_codes WHERE id = ? LIMIT 1')
    .bind(id)
    .first();

  if (!existing) return error('Discount code not found.', 404);

  const code = (body.code || existing.code).trim().toUpperCase();
  const type = body.type || existing.type;
  const value = body.value != null ? Math.max(1, Number(body.value)) : existing.value;
  const minOrderAmount = body.minOrderAmount != null ? Math.max(0, Number(body.minOrderAmount)) : existing.min_order_amount;
  const maxUses = body.maxUses === undefined || body.maxUses === '' ? existing.max_uses : Math.max(1, Number(body.maxUses));
  const isActive = body.isActive !== undefined ? (body.isActive ? 1 : 0) : existing.is_active;
  const expiresAt = body.expiresAt !== undefined ? body.expiresAt : existing.expires_at;

  await context.env.STORE_DB
    .prepare("UPDATE discount_codes SET code = ?, type = ?, value = ?, min_order_amount = ?, max_uses = ?, is_active = ?, expires_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(code, type, value, minOrderAmount, maxUses, isActive, expiresAt, id)
    .run();

  return json({ success: true });
}

export async function onRequestDelete(context) {
  const auth = await requireUser(context);
  if (auth instanceof Response) return auth;

  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return error('ID is required.', 400);

  const existing = await context.env.STORE_DB
    .prepare('SELECT * FROM discount_codes WHERE id = ? LIMIT 1')
    .bind(id)
    .first();

  if (!existing) return error('Discount code not found.', 404);

  await context.env.STORE_DB
    .prepare('DELETE FROM discount_codes WHERE id = ?')
    .bind(id)
    .run();

  return json({ success: true });
}
