const DEFAULT_ZONE_ID = '0f1dd58297e6a96671cfc9bb3969b553';

function getConfig(env) {
  return {
    zoneId: env.CLOUDFLARE_ZONE_ID || env.CF_ZONE_ID || DEFAULT_ZONE_ID,
    token: env.CLOUDFLARE_CACHE_PURGE_TOKEN || env.CLOUDFLARE_API_TOKEN || env.CF_API_TOKEN,
  };
}

export async function purgeEverything(context, reason = 'admin-change') {
  const { zoneId, token } = getConfig(context.env || {});
  if (!zoneId || !token) {
    return { ok: false, skipped: true, reason: 'Missing Cloudflare purge credentials' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ purge_everything: true }),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => null);
    return { ok: response.ok && data?.success !== false, status: response.status, reason, data };
  } finally {
    clearTimeout(timeout);
  }
}

export function scheduleCachePurge(context, reason) {
  const task = purgeEverything(context, reason).catch((purgeError) => ({
    ok: false,
    reason,
    error: purgeError.message,
  }));

  if (typeof context.waitUntil === 'function') {
    context.waitUntil(task);
  }

  return task;
}
