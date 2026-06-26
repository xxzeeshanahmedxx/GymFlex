import { json } from '../_lib/http';

export async function onRequestGet(context) {
  const row = await context.env.STORE_DB.prepare("SELECT value FROM site_settings WHERE key = 'maintenance' LIMIT 1").first();
  if (!row?.value) return json({ enabled: false });
  try {
    return json(JSON.parse(row.value));
  } catch {
    return json({ enabled: false });
  }
}