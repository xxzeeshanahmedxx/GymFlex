import { requireUser } from '../_lib/auth';
import { scheduleCachePurge } from '../_lib/cache';
import { normalizeImage, normalizeProductImageOrdering } from '../_lib/db';
import { error, json } from '../_lib/http';

function getProductId(request) {
  return new URL(request.url).searchParams.get('productId');
}

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const productId = getProductId(context.request);
  if (!productId) return error('Product id is required');
  const rows = await context.env.STORE_DB.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC, created_at ASC').bind(productId).all();
  return json({ images: (rows.results || []).map(normalizeImage) });
}

export async function onRequestPost(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const productId = getProductId(context.request);
  if (!productId) return error('Product id is required');

  const product = await context.env.STORE_DB.prepare('SELECT id, name FROM products WHERE id = ? LIMIT 1').bind(productId).first();
  if (!product) return error('Product not found', 404);

  const formData = await context.request.formData();
  const files = formData.getAll('files').filter((file) => file && typeof file.arrayBuffer === 'function');
  if (!files.length) return error('No image files were uploaded');

  const currentPrimary = await context.env.STORE_DB.prepare('SELECT id FROM product_images WHERE product_id = ? AND is_primary = 1 LIMIT 1').bind(productId).first();
  let nextSortOrder = Number((await context.env.STORE_DB.prepare('SELECT COALESCE(MAX(sort_order), -1) AS max_sort FROM product_images WHERE product_id = ?').bind(productId).first())?.max_sort || -1) + 1;

  const imagePayload = [];
  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const imageId = crypto.randomUUID();
    const safeName = String(file.name || `image-${index + 1}`).replace(/[^a-zA-Z0-9._-]+/g, '-');
    const key = `products/${productId}/${Date.now()}-${safeName}`;
    await context.env.STORE_BUCKET.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type || 'application/octet-stream' },
    });

    const isPrimary = !currentPrimary && index === 0 ? 1 : 0;
    const cdnUrl = `/api/r2?key=${encodeURIComponent(key)}`;

    await context.env.STORE_DB.prepare('INSERT INTO product_images (id, product_id, r2_key, cdn_url, alt_text, sort_order, is_primary) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(imageId, productId, key, cdnUrl, product.name, nextSortOrder, isPrimary).run();
    imagePayload.push({ id: imageId, product_id: productId, r2_key: key, cdn_url: cdnUrl, alt_text: product.name, sort_order: nextSortOrder, is_primary: Boolean(isPrimary) });
    nextSortOrder += 1;
  }

  await normalizeProductImageOrdering(context.env.STORE_DB, productId);
  const normalizedRows = await context.env.STORE_DB.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC, created_at ASC').bind(productId).all();
  scheduleCachePurge(context, 'admin-product-images-upload');
  return json({ images: (normalizedRows.results || []).map(normalizeImage) }, 201);
}
