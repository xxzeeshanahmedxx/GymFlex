import { error, json } from '../_lib/http';

function clean(value) {
  return String(value || '').trim();
}

function phoneDigits(value) {
  return clean(value).replace(/\D/g, '');
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const orderNumber = clean(url.searchParams.get('orderNumber')).toUpperCase();
  const phone = phoneDigits(url.searchParams.get('phone'));

  if (!orderNumber || phone.length < 10) {
    return error('Order number and phone are required.');
  }

  const order = await context.env.STORE_DB
    .prepare(`
      SELECT id, order_number, first_name, last_name, address, state, city, phone, status, subtotal, shipping_fee, total, currency, created_at
      FROM orders
      WHERE upper(order_number) = ?
      LIMIT 1
    `)
    .bind(orderNumber)
    .first();

  if (!order || !phoneDigits(order.phone).endsWith(phone.slice(-10))) {
    return error('Order not found. Check the order number and phone.', 404);
  }

  const items = await context.env.STORE_DB
    .prepare(`
      SELECT
        oi.product_name,
        oi.variant_type,
        oi.variant_name,
        oi.unit_price,
        oi.quantity,
        oi.line_total,
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
      ORDER BY oi.rowid ASC
    `)
    .bind(order.id)
    .all();

  return json({
    order: {
      orderNumber: order.order_number,
      name: `${order.first_name} ${order.last_name}`.trim(),
      state: order.state || '',
      city: order.city,
      address: order.address,
      phone: order.phone,
      status: order.status,
      subtotal: Number(order.subtotal || 0),
      shippingFee: Number(order.shipping_fee || 0),
      shipping_fee: Number(order.shipping_fee || 0),
      total: Number(order.total || 0),
      currency: order.currency || 'PKR',
      createdAt: order.created_at,
      items: items.results || [],
    },
  });
}
