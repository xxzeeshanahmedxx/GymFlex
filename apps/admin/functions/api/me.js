import { getSession } from '../_lib/auth';
import { error, json } from '../_lib/http';

export async function onRequestGet(context) {
  const session = await getSession(context);
  if (!session?.user) {
    return error('Not authenticated', 401);
  }
  return json({ user: session.user });
}
