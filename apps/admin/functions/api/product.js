import { requireUser } from '../_lib/auth';
import { scheduleCachePurge } from '../_lib/cache';
import { loadProduct, slugify } from '../_lib/db';
import { error, json, noContent, readJson } from '../_lib/http';

function normalizeVariants(input = []) {
  return input
    .map((variant, index) => ({
      id: variant.id || crypto.randomUUID(),
      type: String(variant.type || 'Option').trim(),
      name: String(variant.name || '').trim(),
      image_url: String(variant.image_url || variant.imageUrl || '').trim(),
      is_active: variant.is_active !== false && variant.isActive !== false,
      sort_order: Number(variant.sort_order ?? index),
      stock: variant.stock == null ? 0 : Number(variant.stock),
    }))
    .filter((variant) => variant.name);
}

function getId(request) {
  return new URL(request.url).searchParams.get('id');
}

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const id = getId(context.request);
  if (!id) return error('Product id is required');
  const payload = await loadProduct(context.env.STORE_DB, id);
  if (!payload) return error('Product not found', 404);
  return json(payload);
}

export async function onRequestPut(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const id = getId(context.request);
  if (!id) return error('Product id is required');

  const body = await readJson(context.request);
  const name = String(body?.name || '').trim();
  const slug = slugify(body?.slug || name);
  const categoryId = String(body?.category_id || '').trim();
  const description = String(body?.description || '').trim();
  const price = body?.price == null ? 0 : Number(body.price);
  const salePrice = body?.sale_price == null || body?.sale_price === '' ? null : Number(body.sale_price);
  const onSale = Boolean(body?.on_sale && salePrice != null);
  const isActive = body?.is_active !== false;
  const isFeatured = Boolean(body?.is_featured);
  const sortOrder = Number(body?.sort_order || 0);
  const videoUrl = String(body?.video_url || '').trim();
  const metaTitle = String(body?.meta_title || '').trim();
  const metaDescription = String(body?.meta_description || '').trim();
  const isPreorder = Boolean(body?.is_preorder);
  const preorderReleaseDate = String(body?.preorder_release_date || '').trim() || null;
  const variants = normalizeVariants(body?.variants || []);

  if (!name || !slug || !categoryId || !Number.isFinite(price)) {
    return error('Name, slug, category, and price are required');
  }

  const existing = await context.env.STORE_DB.prepare('SELECT id FROM products WHERE id = ? LIMIT 1').bind(id).first();
  if (!existing) return error('Product not found', 404);

  // Upsert variants: update existing, insert new, delete removed
  const existingVariants = await context.env.STORE_DB.prepare('SELECT id FROM product_variants WHERE product_id = ?').bind(id).all();
  const existingIds = new Set((existingVariants.results || []).map((v) => v.id));
  const incomingIds = new Set(variants.map((v) => v.id).filter(Boolean));
  const toDelete = [...existingIds].filter((eid) => !incomingIds.has(eid));

  const statements = [
    context.env.STORE_DB
      .prepare('UPDATE products SET category_id = ?, name = ?, slug = ?, description = ?, price = ?, sale_price = ?, on_sale = ?, is_active = ?, is_featured = ?, sort_order = ?, video_url = ?, meta_title = ?, meta_description = ?, is_preorder = ?, preorder_release_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(categoryId, name, slug, description, price, salePrice, onSale ? 1 : 0, isActive ? 1 : 0, isFeatured ? 1 : 0, sortOrder, videoUrl, metaTitle, metaDescription, isPreorder ? 1 : 0, preorderReleaseDate, id),
    ...(toDelete.length > 0 ? [context.env.STORE_DB.prepare(`DELETE FROM product_variants WHERE id IN (${toDelete.map(() => '?').join(',')}) AND product_id = ?`).bind(...toDelete, id)] : []),
    ...variants.map((variant) => {
      if (incomingIds.has(variant.id)) {
        return context.env.STORE_DB
          .prepare('UPDATE product_variants SET type = ?, name = ?, image_url = ?, is_active = ?, sort_order = ?, stock = ? WHERE id = ? AND product_id = ?')
          .bind(variant.type, variant.name, variant.image_url, variant.is_active ? 1 : 0, variant.sort_order, variant.stock, variant.id, id);
      }
      return context.env.STORE_DB
        .prepare('INSERT INTO product_variants (id, product_id, type, name, image_url, is_active, sort_order, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(variant.id, id, variant.type, variant.name, variant.image_url, variant.is_active ? 1 : 0, variant.sort_order, variant.stock);
    }),
  ];

  try {
    await context.env.STORE_DB.batch(statements);
  } catch (dbError) {
    return error('Failed to update product', 409, dbError.message);
  }

  scheduleCachePurge(context, 'admin-product-update');
  return json(await loadProduct(context.env.STORE_DB, id));
}

export async function onRequestDelete(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const id = getId(context.request);
  if (!id) return error('Product id is required');

  const orderUsage = await context.env.STORE_DB.prepare('SELECT COUNT(*) AS total FROM order_items WHERE product_id = ?').bind(id).first();
  if (Number(orderUsage?.total || 0) > 0) {
    return error('Cannot delete a product that exists in orders. Mark it inactive instead.');
  }

  const images = await context.env.STORE_DB.prepare('SELECT r2_key FROM product_images WHERE product_id = ?').bind(id).all();
  await Promise.all((images.results || []).map((image) => context.env.STORE_BUCKET.delete(image.r2_key)));

  const result = await context.env.STORE_DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
  if (!result.meta.changes) return error('Product not found', 404);
  scheduleCachePurge(context, 'admin-product-delete');
  return noContent();
}
