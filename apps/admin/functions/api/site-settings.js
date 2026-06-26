import { requireUser } from '../_lib/auth';
import { scheduleCachePurge } from '../_lib/cache';
import { error, json, readJson } from '../_lib/http';

const defaultHeroBanner = {
  animation: 'fade',
  animationDuration: 600,
  slideDuration: 4500,
  desktopImages: ['', '', ''],
  mobileImages: ['', '', ''],
};

const defaultHomepageSettings = {
  heroTitle: 'GymFlex',
  heroAccent: 'for your next brand',
  heroSubtitle: 'Discover our exclusive collection of luxury collection-one, professional makeup boxes, and elegant organizers.',
  heroButtonText: 'Shop The Collection',
  heroButtonLink: '/shop',
  featuredProductId: 'h4',
  featuredEyebrow: 'Featured',
  featuredTitle: 'Featured Products',
  collectionKicker: 'COLLECTION',
  recentTitle: 'Recently Viewed',
  headerCollectionSlugs: ['collection-one', 'collection-two', 'collection-three'],
  heroBanner: defaultHeroBanner,
  shippingFee: 250,
  freeShippingMinimum: 0,
};

function cleanSlugs(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || '').trim()).filter(Boolean);
  }
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanImageSlots(value) {
  const slots = Array.isArray(value) ? value : [];
  return [0, 1, 2].map((index) => String(slots[index] || '').trim());
}

function cleanHeroBanner(value = {}) {
  const animation = ['fade', 'slide', 'zoom', 'none'].includes(value.animation) ? value.animation : defaultHeroBanner.animation;
  const animationDuration = Math.min(3000, Math.max(0, Number(value.animationDuration || defaultHeroBanner.animationDuration)));
  const slideDuration = Math.min(20000, Math.max(1000, Number(value.slideDuration || defaultHeroBanner.slideDuration)));

  return {
    animation,
    animationDuration,
    slideDuration,
    desktopImages: cleanImageSlots(value.desktopImages),
    mobileImages: cleanImageSlots(value.mobileImages),
  };
}


function extractHeroR2Key(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (raw.startsWith('site/hero/')) return raw;

  try {
    const url = new URL(raw, 'https://admin.local');
    if (url.pathname === '/api/r2') {
      return url.searchParams.get('key') || '';
    }
    if (url.hostname === 'cdn.gymflex.com') {
      return url.pathname.replace(/^\/+/, '');
    }
  } catch {}

  return '';
}

function heroKeys(heroBanner = {}) {
  return [...(heroBanner.desktopImages || []), ...(heroBanner.mobileImages || [])]
    .map(extractHeroR2Key)
    .filter((key) => key.startsWith('site/hero/'));
}

async function deleteRemovedHeroAssets(context, previousHero, nextHero) {
  const bucket = context.env.STORE_BUCKET;
  if (!bucket) return;

  const nextKeys = new Set(heroKeys(nextHero));
  const removedKeys = [...new Set(heroKeys(previousHero))].filter((key) => !nextKeys.has(key));
  if (removedKeys.length === 0) return;

  await Promise.all(removedKeys.map((key) => bucket.delete(key).catch(() => null)));
}

function scheduleHeroAssetCleanup(context, previousHero, nextHero) {
  const task = deleteRemovedHeroAssets(context, previousHero, nextHero);
  if (typeof context.waitUntil === 'function') context.waitUntil(task);
  return task;
}

function mergeHomepage(row) {
  const saved = row?.value ? JSON.parse(row.value) : {};
  return {
    ...defaultHomepageSettings,
    ...saved,
    headerCollectionSlugs: Array.isArray(saved.headerCollectionSlugs) ? saved.headerCollectionSlugs : defaultHomepageSettings.headerCollectionSlugs,
    heroBanner: cleanHeroBanner({ ...defaultHeroBanner, ...(saved.heroBanner || {}) }),
    shippingFee: Math.max(0, Number(saved.shippingFee ?? defaultHomepageSettings.shippingFee)),
    freeShippingMinimum: Math.max(0, Number(saved.freeShippingMinimum ?? defaultHomepageSettings.freeShippingMinimum)),
  };
}

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;

  const row = await context.env.STORE_DB.prepare('SELECT value FROM site_settings WHERE key = ? LIMIT 1').bind('homepage').first();
  return json({ homepage: mergeHomepage(row) });
}

export async function onRequestPut(context) {
  const user = await requireUser(context);
  if (user instanceof Response) return user;

  const body = await readJson(context.request);
  const previousRow = await context.env.STORE_DB.prepare('SELECT value FROM site_settings WHERE key = ? LIMIT 1').bind('homepage').first();
  const previousHomepage = mergeHomepage(previousRow);
  const homepage = {
    heroTitle: String(body?.homepage?.heroTitle || defaultHomepageSettings.heroTitle).trim(),
    heroAccent: String(body?.homepage?.heroAccent || defaultHomepageSettings.heroAccent).trim(),
    heroSubtitle: String(body?.homepage?.heroSubtitle || defaultHomepageSettings.heroSubtitle).trim(),
    heroButtonText: String(body?.homepage?.heroButtonText || defaultHomepageSettings.heroButtonText).trim(),
    heroButtonLink: String(body?.homepage?.heroButtonLink || defaultHomepageSettings.heroButtonLink).trim(),
    featuredProductId: String(body?.homepage?.featuredProductId || defaultHomepageSettings.featuredProductId).trim(),
    featuredEyebrow: String(body?.homepage?.featuredEyebrow || defaultHomepageSettings.featuredEyebrow).trim(),
    featuredTitle: String(body?.homepage?.featuredTitle || defaultHomepageSettings.featuredTitle).trim(),
    collectionKicker: String(body?.homepage?.collectionKicker || defaultHomepageSettings.collectionKicker).trim(),
    recentTitle: String(body?.homepage?.recentTitle || defaultHomepageSettings.recentTitle).trim(),
    headerCollectionSlugs: cleanSlugs(body?.homepage?.headerCollectionSlugs || defaultHomepageSettings.headerCollectionSlugs),
    heroBanner: cleanHeroBanner(body?.homepage?.heroBanner || defaultHeroBanner),
    shippingFee: Math.max(0, Number(body?.homepage?.shippingFee ?? defaultHomepageSettings.shippingFee)),
    freeShippingMinimum: Math.max(0, Number(body?.homepage?.freeShippingMinimum ?? defaultHomepageSettings.freeShippingMinimum)),
  };

  if (!homepage.heroTitle || !homepage.heroButtonText || !homepage.heroButtonLink) {
    return error('Homepage title and button fields are required');
  }

  await context.env.STORE_DB.prepare(
    'INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP'
  ).bind('homepage', JSON.stringify(homepage)).run();

  scheduleHeroAssetCleanup(context, previousHomepage.heroBanner, homepage.heroBanner);
  scheduleCachePurge(context, 'admin-site-settings-update');
  return json({ homepage });
}
