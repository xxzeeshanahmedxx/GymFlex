import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const orderId = 'test-order-1';
const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-TEST`;

const sql = `-- Test order for verifying admin, track-order, and PDFs.
-- Run only on development/test stores.

INSERT INTO orders (id, order_number, first_name, last_name, address, state, city, phone, country, payment_method, status, subtotal, shipping_fee, total, currency, notes)
VALUES ('${orderId}', '${orderNumber}', 'Test', 'Customer', 'Test address line', 'Punjab', 'Lahore', '+92 300 0000000', 'Pakistan', 'COD', 'new', 2500, 250, 2750, 'PKR', 'Test order')
ON CONFLICT(id) DO NOTHING;

INSERT INTO order_items (id, order_id, product_id, product_name, variant_id, variant_type, variant_name, unit_price, quantity, line_total)
VALUES ('test-order-item-1', '${orderId}', 'sample-product-1', 'Sample Product One', 'sample-variant-1', 'Option', 'Default', 2500, 1, 2500)
ON CONFLICT(id) DO NOTHING;
`;

const outputPath = path.resolve('migrations/0005_test_order.sql');
mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, sql);
console.log(`Wrote ${outputPath}`);
console.log(`Track with order number ${orderNumber} and phone 3000000000`);
