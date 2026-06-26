import { error, json, readJson } from '../_lib/http';

const DEFAULT_SHIPPING_FEE = 250;

function generateOrderNumber() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${y}${m}${d}-${random}`;
}


async function getShippingSettings(db) {
  const row = await db.prepare('SELECT value FROM site_settings WHERE key = ? LIMIT 1').bind('homepage').first();
  let saved = {};
  try { saved = row?.value ? JSON.parse(row.value) : {}; } catch { saved = {}; }
  return {
    shippingFee: Math.max(0, Number(saved.shippingFee ?? DEFAULT_SHIPPING_FEE)),
    freeShippingMinimum: Math.max(0, Number(saved.freeShippingMinimum ?? 0)),
  };
}

function cleanString(value) {
  return String(value || '').trim();
}

export async function onRequestPost(context) {
  const body = await readJson(context.request);
  const customer = body?.customer || {};
  const cartItems = Array.isArray(body?.items) ? body.items : [];
  const discountCode = cleanString(body?.discountCode || '').toUpperCase();

  const firstName = cleanString(customer.firstName);
  const lastName = cleanString(customer.lastName);
  const address = cleanString(customer.address);
  const state = cleanString(customer.state);
  const city = cleanString(customer.city);
  const phone = cleanString(customer.phone);
  const country = cleanString(customer.country || 'Pakistan');
  const paymentMethod = cleanString(customer.paymentMethod || 'COD');

  if (!firstName || !lastName || !address || !state || !city || !phone) {
    return error('Please complete all checkout fields.');
  }

  if (cartItems.length === 0) {
    return error('Your cart is empty.');
  }

  const requestedItems = cartItems.map((item) => ({
    productId: cleanString(item.productId),
    variantId: item.variantId == null ? '' : cleanString(item.variantId),
    quantity: Math.max(1, Number(item.quantity || 1)),
  }));

  const lookups = await context.env.STORE_DB.batch(
    requestedItems.map((item) =>
      context.env.STORE_DB
        .prepare(`
          SELECT p.id AS product_id, p.name AS product_name, p.price, p.sale_price, p.on_sale,
            v.id AS variant_id, v.type AS variant_type, v.name AS variant_name
          FROM products p
          LEFT JOIN product_variants v ON v.id = ? AND v.product_id = p.id AND COALESCE(v.is_active, 1) = 1
          WHERE p.id = ? AND p.is_active = 1
          LIMIT 1
        `)
        .bind(item.variantId, item.productId),
    ),
  );

  const items = [];
  let subtotal = 0;

  requestedItems.forEach((item, index) => {
    const match = lookups[index].results?.[0];
    if (!match || !match.product_id || (item.variantId && !match.variant_id)) {
      return;
    }

    const unitPrice = match.sale_price != null && match.on_sale ? Number(match.sale_price) : Number(match.price);
    const lineTotal = unitPrice * item.quantity;
    subtotal += lineTotal;

    items.push({
      id: crypto.randomUUID(),
      product_id: match.product_id,
      product_name: match.product_name,
      variant_id: match.variant_id || null,
      variant_type: match.variant_type || '',
      variant_name: match.variant_name || '',
      unit_price: unitPrice,
      quantity: item.quantity,
      line_total: lineTotal,
    });
  });

  if (items.length !== requestedItems.length) {
    return error('Some products in your cart are no longer available. Please review your cart and try again.', 409);
  }

  const orderId = crypto.randomUUID();
  const orderNumber = generateOrderNumber();
  const shippingSettings = await getShippingSettings(context.env.STORE_DB);
  const shippingFee = subtotal > 0 && (!shippingSettings.freeShippingMinimum || subtotal < shippingSettings.freeShippingMinimum) ? shippingSettings.shippingFee : 0;

  let discountAmount = 0;
  let appliedDiscountCode = '';

  if (discountCode) {
    const discountRow = await context.env.STORE_DB
      .prepare('SELECT * FROM discount_codes WHERE code = ? AND is_active = 1 AND (max_uses IS NULL OR used_count < max_uses) AND (expires_at IS NULL OR expires_at >= CURRENT_TIMESTAMP) LIMIT 1')
      .bind(discountCode)
      .first();

    if (discountRow && subtotal >= discountRow.min_order_amount) {
      appliedDiscountCode = discountCode;
      if (discountRow.type === 'percentage') {
        discountAmount = Math.round(subtotal * (discountRow.value / 100));
      } else {
        discountAmount = Math.min(discountRow.value, subtotal);
      }

      await context.env.STORE_DB
        .prepare('UPDATE discount_codes SET used_count = used_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .bind(discountRow.id)
        .run();
    }
  }

  const total = Math.max(0, subtotal + shippingFee - discountAmount);

  const statements = [
    context.env.STORE_DB
      .prepare('INSERT INTO orders (id, order_number, first_name, last_name, address, state, city, phone, country, payment_method, status, subtotal, shipping_fee, total, currency, discount_code, discount_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(orderId, orderNumber, firstName, lastName, address, state, city, phone, country, paymentMethod, 'new', subtotal, shippingFee, total, 'PKR', appliedDiscountCode, discountAmount),
    ...items.map((item) =>
      context.env.STORE_DB
        .prepare('INSERT INTO order_items (id, order_id, product_id, product_name, variant_id, variant_type, variant_name, unit_price, quantity, line_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(item.id, orderId, item.product_id, item.product_name, item.variant_id, item.variant_type, item.variant_name, item.unit_price, item.quantity, item.line_total),
    ),
  ];

  await context.env.STORE_DB.batch(statements);

  return json({
    success: true,
    order: {
      id: orderId,
      orderNumber,
      subtotal,
      shippingFee,
      discountAmount,
      discountCode: appliedDiscountCode,
      total,
      status: 'new',
    },
  }, 201);
}
