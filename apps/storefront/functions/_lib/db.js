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
    video_url: row.video_url || '',
    meta_title: row.meta_title || '',
    meta_description: row.meta_description || '',
    avg_rating: row.avg_rating ? Number(row.avg_rating) : 0,
    review_count: Number(row.review_count || 0),
    sale_ends_at: row.sale_ends_at || null,
    is_preorder: Boolean(row.is_preorder),
    preorder_release_date: row.preorder_release_date || null,
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
    stock: Number(row.stock ?? 0),
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

  if (filters.bestsellers) {
    where.push('p.id IN (SELECT product_id FROM order_items GROUP BY product_id ORDER BY SUM(quantity) DESC)');
  }

  let orderBy = 'p.sort_order ASC, p.created_at ASC';
  if (filters.bestsellers) {
    orderBy = '(SELECT COALESCE(SUM(oi.quantity), 0) FROM order_items oi WHERE oi.product_id = p.id) DESC';
  }

  let sql = `
    SELECT p.*, c.name AS category_name, c.slug AS category_slug,
      (
        SELECT cdn_url FROM product_images
        WHERE product_id = p.id
        ORDER BY is_primary DESC, sort_order ASC, created_at ASC
        LIMIT 1
      ) AS primary_image_url,
      (SELECT ROUND(AVG(rating), 1) FROM reviews WHERE product_id = p.id AND is_approved = 1) AS avg_rating,
      (SELECT COUNT(*) FROM reviews WHERE product_id = p.id AND is_approved = 1) AS review_count,
      (SELECT COALESCE(SUM(oi.quantity), 0) FROM order_items oi WHERE oi.product_id = p.id) AS total_sold
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE ${where.join(' AND ')}
    ORDER BY ${orderBy}
  `;

  if (filters.limit) {
    sql += ' LIMIT ?';
    bindings.push(filters.limit);
  }

  return { sql, bindings };
}
