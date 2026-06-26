import { requireUser } from '../_lib/auth';
import { scheduleCachePurge } from '../_lib/cache';
import { normalizeImage } from '../_lib/db';
import { error, json, readJson } from '../_lib/http';

function getProductId(request) {
  return new URL(request.url).searchParams.get('productId');
}

export async function onRequestPost(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;

  const productId = getProductId(context.request);
  if (!productId) return error('Product id is required');

  const body = await readJson(context.request);
  const imageIds = Array.isArray(body?.imageIds) ? body.imageIds.filter(Boolean) : [];
  if (imageIds.length === 0) {
    return error('Image order is required');
  }

  const existingRows = await context.env.STORE_DB
    .prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, created_at ASC')
    .bind(productId)
    .all();

  const existingImages = existingRows.results || [];
  if (existingImages.length !== imageIds.length) {
    return error('Image order does not match current product images');
  }

  const existingIds = new Set(existingImages.map((image) => image.id));
  const requestedIds = new Set(imageIds);

  if (existingIds.size !== requestedIds.size || imageIds.some((id) => !existingIds.has(id))) {
    return error('Image order contains invalid image ids');
  }

  await context.env.STORE_DB.batch(
    imageIds.map((id, index) =>
      context.env.STORE_DB
        .prepare('UPDATE product_images SET sort_order = ?, is_primary = ? WHERE id = ? AND product_id = ?')
        .bind(index, index === 0 ? 1 : 0, id, productId),
    ),
  );

  const orderedRows = await context.env.STORE_DB
    .prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, created_at ASC')
    .bind(productId)
    .all();

  scheduleCachePurge(context, 'admin-product-image-order');
  return json({ images: (orderedRows.results || []).map(normalizeImage) });
}
