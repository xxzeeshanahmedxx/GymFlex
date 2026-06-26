import { requireUser } from '../_lib/auth';
import { json } from '../_lib/http';

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const rows = await context.env.STORE_DB.prepare('SELECT * FROM stock_alerts ORDER BY created_at DESC').all();
  return json({ alerts: rows.results || [] });
}