import { cacheJson } from '../_lib/http';

const defaultHeroBanner = {
  animation: 'fade',
  animationDuration: 600,
  slideDuration: 4500,
  desktopImages: ['', '', ''],
  mobileImages: ['', '', ''],
};

const defaultHomepageSettings = {
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

export async function onRequestGet(context) {
  const row = await context.env.STORE_DB.prepare('SELECT value FROM site_settings WHERE key = ? LIMIT 1').bind('homepage').first();
  const saved = row?.value ? JSON.parse(row.value) : {};
  const homepage = {
    ...defaultHomepageSettings,
    ...saved,
    headerCollectionSlugs: Array.isArray(saved.headerCollectionSlugs) ? saved.headerCollectionSlugs : defaultHomepageSettings.headerCollectionSlugs,
    heroBanner: cleanHeroBanner({ ...defaultHeroBanner, ...(saved.heroBanner || {}) }),
    shippingFee: Math.max(0, Number(saved.shippingFee ?? defaultHomepageSettings.shippingFee)),
    freeShippingMinimum: Math.max(0, Number(saved.freeShippingMinimum ?? defaultHomepageSettings.freeShippingMinimum)),
  };
  return cacheJson({ homepage }, { maxAge: 300, sMaxAge: 86400, staleWhileRevalidate: 86400 });
}
