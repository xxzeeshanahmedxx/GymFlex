function toBoolean(value) {
  return Boolean(value);
}

export function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeCategory(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    sort_order: Number(row.sort_order || 0),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function normalizeProductRow(row) {
  if (!row) return null;
  const price = Number(row.price || 0);
  const salePrice = row.sale_price == null ? null : Number(row.sale_price);
  return {
    id: row.id,
    category_id: row.category_id,
    category_name: row.category_name,
    category_slug: row.category_slug,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    price,
    sale_price: salePrice,
    effective_price: salePrice ?? price,
    on_sale: toBoolean(row.on_sale),
    is_active: toBoolean(row.is_active),
    is_featured: toBoolean(row.is_featured),
    sort_order: Number(row.sort_order || 0),
    primary_image_url: row.primary_image_url || null,
    image_count: Number(row.image_count || 0),
    variant_count: Number(row.variant_count || 0),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function normalizeVariant(row) {
  if (!row) return null;
  return {
    id: row.id,
    product_id: row.product_id,
    type: row.type,
    name: row.name,
    image_url: row.image_url || '',
    is_active: Boolean(row.is_active ?? 1),
    sort_order: Number(row.sort_order || 0),
  };
}

export function normalizeImage(row) {
  if (!row) return null;
  return {
    id: row.id,
    product_id: row.product_id,
    r2_key: row.r2_key,
    cdn_url: row.cdn_url,
    alt_text: row.alt_text || '',
    sort_order: Number(row.sort_order || 0),
    is_primary: toBoolean(row.is_primary),
    created_at: row.created_at,
  };
}

export function normalizeOrder(row) {
  if (!row) return null;
  return {
    ...row,
    subtotal: Number(row.subtotal || 0),
    shipping_fee: Number(row.shipping_fee || 0),
    shippingFee: Number(row.shipping_fee || 0),
    total: Number(row.total || 0),
    item_count: Number(row.item_count || 0),
  };
}

export async function normalizeProductImageOrdering(db, productId) {
  const imageRows = await db
    .prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC, created_at ASC')
    .bind(productId)
    .all();

  const images = imageRows.results || [];
  if (images.length === 0) {
    return [];
  }

  const primaryImage = images.find((image) => image.is_primary) || images[0];
  const ordered = [primaryImage, ...images.filter((image) => image.id !== primaryImage.id)];

  await db.batch(
    ordered.map((image, index) =>
      db.prepare('UPDATE product_images SET is_primary = ?, sort_order = ? WHERE id = ?').bind(index === 0 ? 1 : 0, index, image.id),
    ),
  );

  return ordered.map((image, index) => ({
    ...image,
    is_primary: index === 0 ? 1 : 0,
    sort_order: index,
  }));
}

export async function loadProduct(db, id) {
  const productRow = await db
    .prepare(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug,
        (
          SELECT cdn_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC, created_at ASC LIMIT 1
        ) AS primary_image_url,
        (
          SELECT COUNT(*) FROM product_images WHERE product_id = p.id
        ) AS image_count,
        (
          SELECT COUNT(*) FROM product_variants WHERE product_id = p.id
        ) AS variant_count
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.id = ?
    `)
    .bind(id)
    .first();

  if (!productRow) return null;

  const variantsRows = await db.prepare('SELECT * FROM product_variants WHERE product_id = ? ORDER BY sort_order ASC, created_at ASC').bind(id).all();
  const imageRows = await normalizeProductImageOrdering(db, id);

  return {
    product: normalizeProductRow(productRow),
    variants: (variantsRows.results || []).map(normalizeVariant),
    images: imageRows.map(normalizeImage),
  };
}
