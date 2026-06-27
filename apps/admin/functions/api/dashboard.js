import { requireUser } from '../_lib/auth';
import { json } from '../_lib/http';

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const db = context.env.STORE_DB;

  const [productCount, orderCount, revenue, categoryCount, pendingOrders] = await Promise.all([
    db.prepare('SELECT COUNT(*) AS count FROM products WHERE is_active = 1').first(),
    db.prepare('SELECT COUNT(*) AS count FROM orders').first(),
    db.prepare('SELECT COALESCE(SUM(total), 0) AS total FROM orders').first(),
    db.prepare('SELECT COUNT(*) AS count FROM categories').first(),
    db.prepare('SELECT COUNT(*) AS count FROM orders WHERE status IN (\'new\', \'confirmed\', \'processing\')').first(),
  ]);

  return json({
    activeProducts: productCount?.count || 0,
    totalOrders: orderCount?.count || 0,
    totalRevenue: revenue?.total || 0,
    categories: categoryCount?.count || 0,
    pendingOrders: pendingOrders?.count || 0,
  });
}