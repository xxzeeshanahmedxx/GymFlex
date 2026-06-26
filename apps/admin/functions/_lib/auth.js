import { error } from './http';

const encoder = new TextEncoder();
const SESSION_COOKIE = 'bb_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const SESSION_PREFIX = 'admin-session:';

function toBase64(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function fromBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export function parseCookies(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  return cookieHeader.split(';').reduce((accumulator, pair) => {
    const [key, ...rest] = pair.trim().split('=');
    if (!key) return accumulator;
    accumulator[key] = decodeURIComponent(rest.join('='));
    return accumulator;
  }, {});
}

function sessionCookie(value, maxAge = SESSION_TTL_SECONDS) {
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function hashPassword(password, saltBase64 = null) {
  const iterations = 100000;
  const salt = saltBase64 ? fromBase64(saltBase64) : crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    256,
  );

  return `pbkdf2$${iterations}$${toBase64(salt)}$${toBase64(hash)}`;
}

export async function verifyPassword(password, storedHash) {
  const [algorithm, iterations, salt, expectedHash] = String(storedHash || '').split('$');
  if (algorithm !== 'pbkdf2' || !iterations || !salt || !expectedHash) {
    return false;
  }

  const computedHash = await hashPassword(password, salt);
  return computedHash === storedHash;
}

export async function createSession(context, user) {
  const sessionId = crypto.randomUUID();
  await context.env.STORE_KV.put(
    `${SESSION_PREFIX}${sessionId}`,
    JSON.stringify({ id: user.id, email: user.email, name: user.name }),
    { expirationTtl: SESSION_TTL_SECONDS },
  );
  return sessionId;
}

export async function getSession(context) {
  const cookies = parseCookies(context.request);
  const sessionId = cookies[SESSION_COOKIE];
  if (!sessionId) return null;

  const sessionValue = await context.env.STORE_KV.get(`${SESSION_PREFIX}${sessionId}`);
  if (!sessionValue) return null;

  try {
    return { sessionId, user: JSON.parse(sessionValue) };
  } catch {
    return null;
  }
}

export async function destroySession(context) {
  const cookies = parseCookies(context.request);
  const sessionId = cookies[SESSION_COOKIE];
  if (sessionId) {
    await context.env.STORE_KV.delete(`${SESSION_PREFIX}${sessionId}`);
  }
}

export async function requireUser(context) {
  const session = await getSession(context);
  if (!session?.user) {
    return error('Authentication required', 401);
  }
  return session.user;
}

export function withSessionCookie(response, sessionId) {
  const headers = new Headers(response.headers);
  headers.set('set-cookie', sessionCookie(sessionId));
  return new Response(response.body, { status: response.status, headers });
}

export function withClearedSessionCookie(response) {
  const headers = new Headers(response.headers);
  headers.set('set-cookie', clearSessionCookie());
  return new Response(response.body, { status: response.status, headers });
}
