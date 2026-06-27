import { requireUser } from '../_lib/auth';
import { scheduleCachePurge } from '../_lib/cache';
import { normalizeProductRow, slugify } from '../_lib/db';
import { error, json, readJson } from '../_lib/http';

function normalizeVariants(input = []) {
  return input
    .map((variant, index) => ({
      id: variant.id || crypto.randomUUID(),
      type: String(variant.type || 'Option').trim(),
      name: String(variant.name || '').trim(),
      image_url: String(variant.image_url || variant.imageUrl || '').trim(),
      is_active: variant.is_active !== false && variant.isActive !== false,
      sort_order: Number(variant.sort_order ?? index),
    }))
    .filter((variant) => variant.name);
}

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;

  const results = await context.env.STORE_DB.prepare(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug,
      (SELECT cdn_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC, created_at ASC LIMIT 1) AS primary_image_url,
      (SELECT COUNT(*) FROM product_images WHERE product_id = p.id) AS image_count,
      (SELECT COUNT(*) FROM product_variants WHERE product_id = p.id) AS variant_count
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.slug NOT LIKE '%-edition'
    ORDER BY p.sort_order ASC, p.created_at DESC
  `).all();

  return json({ products: (results.results || []).map(normalizeProductRow) });
}

export async function onRequestPost(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;

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

  const productId = crypto.randomUUID();
  const statements = [
    context.env.STORE_DB
      .prepare('INSERT INTO products (id, category_id, name, slug, description, price, sale_price, on_sale, is_active, is_featured, sort_order, video_url, meta_title, meta_description, is_preorder, preorder_release_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(productId, categoryId, name, slug, description, price, salePrice, onSale ? 1 : 0, isActive ? 1 : 0, isFeatured ? 1 : 0, sortOrder, videoUrl, metaTitle, metaDescription, isPreorder ? 1 : 0, preorderReleaseDate),
    ...variants.map((variant) =>
      context.env.STORE_DB
        .prepare('INSERT INTO product_variants (id, product_id, type, name, image_url, is_active, sort_order, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(variant.id, productId, variant.type, variant.name, variant.image_url, variant.is_active ? 1 : 0, variant.sort_order, variant.stock),
    ),
  ];

  try {
    await context.env.STORE_DB.batch(statements);
  } catch (dbError) {
    return error('Failed to create product. Check slug uniqueness and category.', 409, dbError.message);
  }

  scheduleCachePurge(context, 'admin-product-create');
  return json({ product: { id: productId } }, 201);
}
