import { error, json } from '../_lib/http';

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const code = (url.searchParams.get('code') || '').trim().toUpperCase();
  const subtotal = Math.max(0, Number(url.searchParams.get('subtotal') || 0));

  if (!code) {
    return error('Discount code is required.', 400);
  }

  const row = await context.env.STORE_DB
    .prepare('SELECT * FROM discount_codes WHERE code = ? LIMIT 1')
    .bind(code)
    .first();

  if (!row) {
    return json({ valid: false, error: 'Invalid discount code.' });
  }

  if (!row.is_active) {
    return json({ valid: false, error: 'This discount code is no longer active.' });
  }

  if (row.expires_at && new Date(row.expires_at) < new Date()) {
    return json({ valid: false, error: 'This discount code has expired.' });
  }

  if (row.max_uses != null && row.used_count >= row.max_uses) {
    return json({ valid: false, error: 'This discount code has reached its usage limit.' });
  }

  if (subtotal < row.min_order_amount) {
    return json({ valid: false, error: `Minimum order amount of Rs. ${row.min_order_amount.toLocaleString()} required for this code.` });
  }

  let discountAmount = 0;
  if (row.type === 'percentage') {
    discountAmount = Math.round(subtotal * (row.value / 100));
  } else {
    discountAmount = Math.min(row.value, subtotal);
  }

  return json({
    valid: true,
    code: row.code,
    type: row.type,
    value: row.value,
    discountAmount,
    minOrderAmount: row.min_order_amount,
  });
}
