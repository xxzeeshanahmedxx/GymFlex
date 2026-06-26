import { requireUser } from '../_lib/auth';
import { error, json, readJson } from '../_lib/http';

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const row = await context.env.STORE_DB.prepare("SELECT value FROM site_settings WHERE key = 'maintenance' LIMIT 1").first();
  const settings = row?.value ? JSON.parse(row.value) : { enabled: false, message: '' };
  return json(settings);
}

export async function onRequestPost(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;
  const body = await readJson(context.request);
  const value = JSON.stringify({ enabled: Boolean(body.enabled), message: String(body.message || 'We are currently undergoing maintenance. Please check back shortly.') });
  await context.env.STORE_DB.prepare("INSERT INTO site_settings (key, value) VALUES ('maintenance', ?) ON CONFLICT(key) DO UPDATE SET value = ?").bind(value, value).run();
  return json({ ok: true });
}