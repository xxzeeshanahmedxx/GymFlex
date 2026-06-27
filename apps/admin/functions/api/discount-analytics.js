import { requireUser } from '../_lib/auth';
import { json } from '../_lib/http';

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const db = context.env.STORE_DB;
  const [usage, topCoupons, summary] = await Promise.all([
    db.prepare("SELECT d.id, d.code, d.value AS discount_percent, d.is_active, d.expires_at, COUNT(o.id) AS usage_count, COALESCE(SUM(o.discount_amount), 0) AS total_discount FROM discount_codes d LEFT JOIN orders o ON o.discount_code = d.code GROUP BY d.id ORDER BY usage_count DESC").all(),
    db.prepare("SELECT discount_code, COUNT(*) AS count, SUM(discount_amount) AS total FROM orders WHERE discount_code IS NOT NULL AND discount_code != '' GROUP BY discount_code ORDER BY count DESC LIMIT 10").all(),
    db.prepare("SELECT COUNT(*) AS total_used, COALESCE(SUM(discount_amount), 0) AS total_saved FROM orders WHERE discount_code IS NOT NULL AND discount_code != ''").first(),
  ]);
  return json({ usage: usage.results || [], topCoupons: topCoupons.results || [], summary: summary || {} });
}