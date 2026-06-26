import { json, error, readJson } from '../_lib/http';

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const productId = url.searchParams.get('productId');
  if (!productId) return error('productId is required');

  const { results } = await context.env.STORE_DB
    .prepare('SELECT * FROM reviews WHERE product_id = ? AND is_approved = 1 ORDER BY created_at DESC LIMIT 50')
    .bind(productId)
    .all();

  return json({ reviews: results || [] });
}

export async function onRequestPost(context) {
  const body = await readJson(context.request);
  const { productId, rating, title, body: reviewBody, authorName } = body || {};

  if (!productId) return error('productId is required');
  if (!rating || rating < 1 || rating > 5) return error('Rating must be between 1 and 5');

  const id = crypto.randomUUID();
  await context.env.STORE_DB
    .prepare('INSERT INTO reviews (id, product_id, rating, title, body, author_name, is_approved) VALUES (?, ?, ?, ?, ?, ?, 0)')
    .bind(id, productId, rating, title || '', reviewBody || '', authorName || 'Anonymous')
    .run();

  return json({ id, success: true }, 201);
}
