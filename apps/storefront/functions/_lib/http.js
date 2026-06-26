export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...headers,
    },
  });
}

export function cacheJson(data, { maxAge = 300, sMaxAge = 3600, staleWhileRevalidate = 86400, cacheTag = '' } = {}) {
  const headers = {
    'cache-control': `public, max-age=${maxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
  };
  if (cacheTag) headers['cache-tag'] = cacheTag;
  return json(data, 200, headers);
}

export function error(message, status = 400, details = null) {
  return json({ error: message, details }, status);
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
