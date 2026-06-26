import { buildProductListQuery, normalizeCategory, normalizeProduct } from '../_lib/db';
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
  return {
    animation,
    animationDuration: Math.min(3000, Math.max(0, Number(value.animationDuration || defaultHeroBanner.animationDuration))),
    slideDuration: Math.min(20000, Math.max(1000, Number(value.slideDuration || defaultHeroBanner.slideDuration))),
    desktopImages: cleanImageSlots(value.desktopImages),
    mobileImages: cleanImageSlots(value.mobileImages),
  };
}

async function loadHomepageSettings(db) {
  const row = await db.prepare('SELECT value FROM site_settings WHERE key = ? LIMIT 1').bind('homepage').first();
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

async function loadProducts(db, filters) {
  const { sql, bindings } = buildProductListQuery(filters);
  const rows = await db.prepare(sql).bind(...bindings).all();
  return (rows.results || []).map(normalizeProduct);
}

export async function onRequestGet(context) {
  const db = context.env.STORE_DB;
  const [homepage, categoryRows, featuredProducts, saleProducts, bestsellerProducts] = await Promise.all([
    loadHomepageSettings(db),
    db.prepare('SELECT * FROM categories ORDER BY sort_order ASC, created_at ASC').all(),
    loadProducts(db, { featured: true, limit: 4 }),
    loadProducts(db, { sale: true, limit: 8 }),
    loadProducts(db, { bestsellers: true, limit: 8 }),
  ]);

  const categories = (categoryRows.results || []).map(normalizeCategory);
  const collectionEntries = await Promise.all(
    categories.map(async (category) => [category.slug, await loadProducts(db, { category: category.slug, limit: 6 })]),
  );

  return cacheJson({
    homepage,
    categories,
    featuredProducts,
    saleProducts,
    bestsellerProducts,
    collectionProducts: Object.fromEntries(collectionEntries),
  }, {
    maxAge: 300,
    sMaxAge: 86400,
    staleWhileRevalidate: 86400,
    cacheTag: 'homepage,catalog,categories,products',
  });
}
