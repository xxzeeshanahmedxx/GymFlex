import { requireUser } from '../_lib/auth';
import { purgeEverything } from '../_lib/cache';
import { error, json } from '../_lib/http';

export async function onRequestPost(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;

  const result = await purgeEverything(context, 'manual-admin-button');
  if (!result.ok) {
    return error('Cloudflare cache purge failed', 502, result);
  }

  return json({ success: true, purge: result });
}
