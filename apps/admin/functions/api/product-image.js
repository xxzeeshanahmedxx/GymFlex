import { requireUser } from '../_lib/auth';
import { scheduleCachePurge } from '../_lib/cache';
import { normalizeProductImageOrdering } from '../_lib/db';
import { error, json, noContent, readJson } from '../_lib/http';

function getIds(request) {
  const url = new URL(request.url);
  return {
    productId: url.searchParams.get('productId'),
    imageId: url.searchParams.get('imageId'),
  };
}

export async function onRequestPatch(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const { productId, imageId } = getIds(context.request);
  if (!productId || !imageId) return error('Product id and image id are required');

  const body = await readJson(context.request);
  const image = await context.env.STORE_DB.prepare('SELECT * FROM product_images WHERE id = ? AND product_id = ? LIMIT 1').bind(imageId, productId).first();
  if (!image) return error('Image not found', 404);

  const nextAltText = body?.alt_text != null ? String(body.alt_text).trim() : image.alt_text;
  const nextSortOrder = body?.sort_order != null ? Number(body.sort_order) : Number(image.sort_order || 0);

  if (body?.is_primary) {
    await context.env.STORE_DB.batch([
      context.env.STORE_DB.prepare('UPDATE product_images SET is_primary = 0 WHERE product_id = ?').bind(productId),
      context.env.STORE_DB.prepare('UPDATE product_images SET alt_text = ?, sort_order = ?, is_primary = 1 WHERE id = ?').bind(nextAltText, nextSortOrder, imageId),
    ]);
  } else {
    await context.env.STORE_DB.prepare(
      'UPDATE product_images SET alt_text = ?, sort_order = ? WHERE id = ?'
    ).bind(nextAltText, nextSortOrder, imageId).run();
  }

  await normalizeProductImageOrdering(context.env.STORE_DB, productId);
  const updated = await context.env.STORE_DB.prepare('SELECT * FROM product_images WHERE id = ?').bind(imageId).first();
  scheduleCachePurge(context, 'admin-product-image-update');
  return json({ image: updated });
}

export async function onRequestDelete(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const { productId, imageId } = getIds(context.request);
  if (!productId || !imageId) return error('Product id and image id are required');

  const image = await context.env.STORE_DB.prepare('SELECT * FROM product_images WHERE id = ? AND product_id = ? LIMIT 1').bind(imageId, productId).first();
  if (!image) return error('Image not found', 404);

  await context.env.STORE_DB.prepare('DELETE FROM product_images WHERE id = ?').bind(imageId).run();
  try { await context.env.STORE_BUCKET.delete(image.r2_key); } catch { /* orphan-safe: DB record already gone */ }

  await normalizeProductImageOrdering(context.env.STORE_DB, productId);

  scheduleCachePurge(context, 'admin-product-image-delete');
  return noContent();
}
