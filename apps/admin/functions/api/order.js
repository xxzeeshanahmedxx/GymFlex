import { requireUser } from '../_lib/auth';
import { scheduleCachePurge } from '../_lib/cache';
import { normalizeOrder } from '../_lib/db';
import { error, json, readJson } from '../_lib/http';

const allowedStatuses = new Set(['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']);
const allowedCallStatuses = new Set(['not_needed', 'pending', 'confirmed', 'failed']);
const allowedItemStatuses = new Set(['pending', 'processing', 'shipped', 'delivered', 'cancelled']);

function getId(request) {
  return new URL(request.url).searchParams.get('id');
}

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const id = getId(context.request);
  if (!id) return error('Order id is required');

  const order = await context.env.STORE_DB.prepare('SELECT * FROM orders WHERE id = ? LIMIT 1').bind(id).first();
  if (!order) return error('Order not found', 404);
  const items = await context.env.STORE_DB.prepare(`
    SELECT
      oi.*,
      COALESCE(NULLIF(pv.image_url, ''), primary_image.cdn_url, any_image.cdn_url, '') AS image_url,
      COALESCE(NULLIF(pv.image_url, ''), '') AS variant_image_url,
      COALESCE(primary_image.cdn_url, any_image.cdn_url, '') AS product_image_url
    FROM order_items oi
    LEFT JOIN product_variants pv ON pv.id = oi.variant_id
    LEFT JOIN product_images primary_image ON primary_image.product_id = oi.product_id AND primary_image.is_primary = 1
    LEFT JOIN product_images any_image ON any_image.id = (
      SELECT pi.id FROM product_images pi WHERE pi.product_id = oi.product_id ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.created_at ASC LIMIT 1
    )
    WHERE oi.order_id = ?
    ORDER BY oi.created_at ASC
  `).bind(id).all();

  return json({ order: normalizeOrder(order), items: items.results || [] });
}

export async function onRequestPatch(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const id = getId(context.request);
  if (!id) return error('Order id is required');

  const body = await readJson(context.request);
  const sets = [];
  const values = [];

  if (body.status) {
    const status = String(body.status).trim();
    if (!allowedStatuses.has(status)) return error('Invalid order status');
    sets.push('status = ?');
    values.push(status);
  }
  if (body.call_status) {
    const callStatus = String(body.call_status).trim();
    if (!allowedCallStatuses.has(callStatus)) return error('Invalid call status');
    sets.push('call_status = ?');
    values.push(callStatus);
  }
  if (body.courier_name !== undefined) {
    sets.push('courier_name = ?');
    values.push(String(body.courier_name || ''));
  }
  if (body.tracking_url !== undefined) {
    sets.push('tracking_url = ?');
    values.push(String(body.tracking_url || ''));
  }
  if (body.notes !== undefined) {
    sets.push('notes = ?');
    values.push(String(body.notes || ''));
  }

  let order = null;
  if (sets.length > 0) {
    sets.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    const result = await context.env.STORE_DB.prepare(`UPDATE orders SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();
    if (!result.meta.changes) return error('Order not found', 404);
    order = await context.env.STORE_DB.prepare('SELECT * FROM orders WHERE id = ? LIMIT 1').bind(id).first();
  }

  if (Array.isArray(body.items)) {
    const statements = [];
    for (const item of body.items) {
      const itemStatus = String(item.status || '').trim();
      if (!item.id || !allowedItemStatuses.has(itemStatus)) continue;
      statements.push(
        context.env.STORE_DB.prepare('UPDATE order_items SET status = ? WHERE id = ? AND order_id = ?').bind(itemStatus, item.id, id),
      );
    }
    if (statements.length > 0) {
      await context.env.STORE_DB.batch(statements);
    }
  }

  if (!order) {
    order = await context.env.STORE_DB.prepare('SELECT * FROM orders WHERE id = ? LIMIT 1').bind(id).first();
  }

  const items = await context.env.STORE_DB.prepare(`
    SELECT
      oi.*,
      COALESCE(NULLIF(pv.image_url, ''), primary_image.cdn_url, any_image.cdn_url, '') AS image_url,
      COALESCE(NULLIF(pv.image_url, ''), '') AS variant_image_url,
      COALESCE(primary_image.cdn_url, any_image.cdn_url, '') AS product_image_url
    FROM order_items oi
    LEFT JOIN product_variants pv ON pv.id = oi.variant_id
    LEFT JOIN product_images primary_image ON primary_image.product_id = oi.product_id AND primary_image.is_primary = 1
    LEFT JOIN product_images any_image ON any_image.id = (
      SELECT pi.id FROM product_images pi WHERE pi.product_id = oi.product_id ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.created_at ASC LIMIT 1
    )
    WHERE oi.order_id = ?
    ORDER BY oi.created_at ASC
  `).bind(id).all();

  scheduleCachePurge(context, 'admin-order-update');
  return json({ order: normalizeOrder(order), items: items.results || [] });
}


export async function onRequestDelete(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const id = getId(context.request);
  if (!id) return error('Order id is required');

  const existing = await context.env.STORE_DB.prepare('SELECT id FROM orders WHERE id = ? LIMIT 1').bind(id).first();
  if (!existing) return error('Order not found', 404);

  await context.env.STORE_DB.batch([
    context.env.STORE_DB.prepare('DELETE FROM order_items WHERE order_id = ?').bind(id),
    context.env.STORE_DB.prepare('DELETE FROM orders WHERE id = ?').bind(id),
  ]);

  scheduleCachePurge(context, 'order-delete');
  return json({ ok: true });
}
