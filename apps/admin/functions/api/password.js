import { hashPassword, requireUser, verifyPassword } from '../_lib/auth';
import { error, json, readJson } from '../_lib/http';

export async function onRequestPost(context) {
  const user = await requireUser(context);
  if (user instanceof Response) {
    return user;
  }

  const body = await readJson(context.request);
  const currentPassword = String(body?.currentPassword || '');
  const newPassword = String(body?.newPassword || '');

  if (!currentPassword || !newPassword) {
    return error('Current and new password are required');
  }

  if (newPassword.length < 8) {
    return error('New password must be at least 8 characters long');
  }

  const stored = await context.env.STORE_DB.prepare('SELECT password_hash FROM admin_users WHERE id = ? LIMIT 1').bind(user.id).first();
  if (!stored) {
    return error('Admin user not found', 404);
  }

  const matches = await verifyPassword(currentPassword, stored.password_hash);
  if (!matches) {
    return error('Current password is incorrect', 401);
  }

  const nextHash = await hashPassword(newPassword);
  await context.env.STORE_DB.prepare('UPDATE admin_users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(nextHash, user.id).run();

  return json({ success: true });
}
