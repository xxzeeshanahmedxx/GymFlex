import { destroySession, withClearedSessionCookie } from '../_lib/auth';
import { json } from '../_lib/http';

export async function onRequestPost(context) {
  await destroySession(context);
  return withClearedSessionCookie(json({ success: true }));
}
