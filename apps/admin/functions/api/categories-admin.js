import { requireUser } from '../_lib/auth';
import { normalizeCategory } from '../_lib/db';
import { json } from '../_lib/http';

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;

  const results = await context.env.STORE_DB.prepare('SELECT * FROM categories ORDER BY sort_order ASC, created_at ASC').all();
  return json({ categories: (results.results || []).map(normalizeCategory) });
}
