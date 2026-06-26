import { requireUser } from '../_lib/auth';
import { scheduleCachePurge } from '../_lib/cache';
import { error, json } from '../_lib/http';

function safeName(value) {
  return String(value || 'hero-image')
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'hero-image';
}

export async function onRequestPost(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;

  const formData = await context.request.formData();
  const file = formData.get('file');
  const area = String(formData.get('area') || 'hero').replace(/[^a-zA-Z0-9_-]+/g, '-');
  const device = String(formData.get('device') || 'desktop').replace(/[^a-zA-Z0-9_-]+/g, '-');
  const slot = String(formData.get('slot') || '1').replace(/[^0-9]+/g, '') || '1';

  if (!file || typeof file.arrayBuffer !== 'function') {
    return error('No image file was uploaded');
  }

  if (!String(file.type || '').startsWith('image/')) {
    return error('Only image files are allowed');
  }

  const key = `site/${area}/${device}/${slot}-${Date.now()}-${crypto.randomUUID()}-${safeName(file.name)}`;
  await context.env.STORE_BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  });

  scheduleCachePurge(context, 'admin-site-asset-upload');
  return json({
    key,
    url: `/api/r2?key=${encodeURIComponent(key)}`,
  }, 201);
}
