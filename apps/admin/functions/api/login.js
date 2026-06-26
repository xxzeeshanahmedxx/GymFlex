import { createSession, withSessionCookie } from '../_lib/auth';
import { error, json, readJson } from '../_lib/http';

function getPanelPassword(context) {
  return String(context.env.ADMIN_PASSWORD || '').trim();
}

export async function onRequestPost(context) {
  const body = await readJson(context.request);
  const password = String(body?.password || '');

  if (!password) return error('Password is required');

  const panelPassword = getPanelPassword(context);
  if (!panelPassword) {
    return error('Set the ADMIN_PASSWORD secret in Cloudflare Pages and redeploy.', 500);
  }

  if (password !== panelPassword) {
    return error('Password is incorrect', 401);
  }

  const user = await context.env.STORE_DB
    .prepare('SELECT id, email, name, is_active FROM admin_users WHERE is_active = 1 ORDER BY created_at ASC LIMIT 1')
    .first();

  if (!user) return error('No active account found', 404);

  const safeUser = { id: user.id, email: user.email, name: user.name };
  const sessionId = await createSession(context, safeUser);
  return withSessionCookie(json({ user: safeUser }), sessionId);
}
