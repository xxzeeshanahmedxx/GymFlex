import { requireUser } from '../_lib/auth';
import { error } from '../_lib/http';

const contentTypes = {
  webp: 'image/webp',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
};

function keyFromUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (raw.startsWith('products/') || raw.startsWith('site/') || raw.startsWith('category-real/')) return raw;
  try {
    const url = new URL(raw, 'https://admin.local');
    if (url.pathname === '/api/r2') return url.searchParams.get('key') || '';
  } catch {}
  return '';
}

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;

  const url = new URL(context.request.url);
  const imageUrl = url.searchParams.get('url') || '';
  const key = keyFromUrl(imageUrl);
  if (!key || key.includes('..')) return error('Image URL is required', 400);

  const object = await context.env.STORE_BUCKET.get(key);
  if (!object) return error('Image not found', 404);

  const extension = key.split('.').pop()?.toLowerCase() || '';
  const headers = new Headers();
  headers.set('content-type', object.httpMetadata?.contentType || contentTypes[extension] || 'application/octet-stream');
  headers.set('cache-control', 'private, max-age=300');
  headers.set('access-control-allow-origin', '*');
  return new Response(object.body, { headers });
}
