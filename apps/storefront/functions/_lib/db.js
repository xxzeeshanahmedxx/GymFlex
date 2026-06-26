export function normalizeCategory(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    sort_order: Number(row.sort_order || 0),
  };
}

export function normalizeProduct(row) {
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
    on_sale: Boolean(row.on_sale),
    is_active: Boolean(row.is_active),
    is_featured: Boolean(row.is_featured),
    sort_order: Number(row.sort_order || 0),
    primary_image_url: row.primary_image_url || null,
  };
}

export function normalizeVariant(row) {
  return {
    id: row.id,
    product_id: row.product_id,
    type: row.type,
    name: row.name,
    image_url: row.image_url || '',
    sort_order: Number(row.sort_order || 0),
  };
}

export function buildProductListQuery(filters = {}) {
  const where = ["p.is_active = 1", "p.slug NOT LIKE '%-edition'"];
  const bindings = [];

  if (filters.category) {
    where.push('c.slug = ?');
    bindings.push(filters.category);
  }

  if (filters.featured) {
    where.push('p.is_featured = 1');
  }

  if (filters.sale) {
    where.push('p.on_sale = 1');
  }

  let sql = `
    SELECT p.*, c.name AS category_name, c.slug AS category_slug,
      (
        SELECT cdn_url FROM product_images
        WHERE product_id = p.id
        ORDER BY is_primary DESC, sort_order ASC, created_at ASC
        LIMIT 1
      ) AS primary_image_url
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE ${where.join(' AND ')}
    ORDER BY p.sort_order ASC, p.created_at ASC
  `;

  if (filters.limit) {
    sql += ' LIMIT ?';
    bindings.push(filters.limit);
  }

  return { sql, bindings };
}
