import { requireUser } from '../_lib/auth';
import { json } from '../_lib/http';
import { normalizeProductRow, normalizeOrder } from '../_lib/db';

const orderStatuses = ['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
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
};

export async function onRequestGet(context) {
  const user = await requireUser(context);
  if (user instanceof Response) {
    return user;
  }

  const db = context.env.STORE_DB;
  const [
    productCount,
    activeProductCount,
    featuredProductCount,
    categoryCount,
    imageCount,
    orderCount,
    recentOrders,
    featuredProducts,
    homepageSetting,
    orderStatusRows,
  ] = await Promise.all([
    db.prepare('SELECT COUNT(*) AS total FROM products').first(),
    db.prepare('SELECT COUNT(*) AS total FROM products WHERE is_active = 1').first(),
    db.prepare('SELECT COUNT(*) AS total FROM products WHERE is_featured = 1').first(),
    db.prepare('SELECT COUNT(*) AS total FROM categories').first(),
    db.prepare('SELECT COUNT(*) AS total FROM product_images').first(),
    db.prepare('SELECT COUNT(*) AS total FROM orders').first(),
    db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5').all(),
    db.prepare(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug,
        (SELECT cdn_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) AS primary_image_url,
        (SELECT COUNT(*) FROM product_images WHERE product_id = p.id) AS image_count,
        (SELECT COUNT(*) FROM product_variants WHERE product_id = p.id) AS variant_count
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.is_featured = 1
      ORDER BY p.sort_order ASC, p.created_at DESC
      LIMIT 5
    `).all(),
    db.prepare('SELECT value, updated_at FROM site_settings WHERE key = ? LIMIT 1').bind('homepage').first(),
    db.prepare('SELECT status, COUNT(*) AS total FROM orders GROUP BY status').all(),
  ]);

  const statusCounts = Object.fromEntries(orderStatuses.map((status) => [status, 0]));
  for (const row of orderStatusRows.results || []) {
    statusCounts[row.status] = Number(row.total || 0);
  }

  const homepageSettings = homepageSetting?.value
    ? { ...defaultHomepageSettings, ...JSON.parse(homepageSetting.value) }
    : defaultHomepageSettings;

  return json({
    counts: {
      products: Number(productCount?.total || 0),
      activeProducts: Number(activeProductCount?.total || 0),
      featuredProducts: Number(featuredProductCount?.total || 0),
      categories: Number(categoryCount?.total || 0),
      images: Number(imageCount?.total || 0),
      orders: Number(orderCount?.total || 0),
    },
    orderStatusCounts: statusCounts,
    recentOrders: (recentOrders.results || []).map(normalizeOrder),
    featuredProducts: (featuredProducts.results || []).map(normalizeProductRow),
    homepageSettings,
    homepageSettingsUpdatedAt: homepageSetting?.updated_at || null,
  });
}
