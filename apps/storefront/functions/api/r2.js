import { error } from '../_lib/http';

const contentTypes = {
  svg: 'image/svg+xml; charset=utf-8',
  webp: 'image/webp',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
};

export async function onRequestGet(context) {
  const key = new URL(context.request.url).searchParams.get('key');
  if (!key || key.includes('..')) return error('Asset key is required', 400);

  const object = await context.env.STORE_BUCKET.get(key);
  if (!object) return error('Asset not found', 404);

  const extension = key.split('.').pop()?.toLowerCase() || '';
  const headers = new Headers();
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  headers.set('content-type', object.httpMetadata?.contentType || contentTypes[extension] || 'application/octet-stream');
  headers.set('etag', object.httpEtag);
  return new Response(object.body, { headers });
}
