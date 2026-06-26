# GymFlex — Feature Implementation Plan

**57 features across 9 phases** — Total estimated ~8-12 weeks of work.

---

## Conventions & Patterns

| Aspect | Standard |
|---|---|
| Admin API auth | `const user = await requireUser(context); if (user instanceof Response) return user;` |
| Admin frontend API | `get()`, `post()`, `put()`, `patch()`, `del()` from `../lib/api` |
| Admin confirm dialogs | `useConfirm()` from `ConfirmProvider` — returns a promise |
| Admin CSS form | `<label>text<input/></label>` inside `.field-grid` or `.panel-grid` |
| Admin CSS buttons | `.button.button-primary`, `.button-secondary`, `.button-danger` |
| Admin CSS icon actions | `.icon-action-link` (+ `.icon-action-danger` for delete) |
| Admin CSS table | `dense-table responsive-table` with `data-label` attrs on mobile |
| Admin CSS panel layout | `.page-stack` > `.page-header` + `.panel` / `.panel-grid.two-column` |
| Storefront API imports | `json/cacheJson/error/readJson` from `_lib/http` |
| Storefront data fetch | `useEffect` + `cancelled` boolean flag pattern |
| Storefront page title | `usePageTitle('Title')` hook |
| DB migration command | `npx wrangler d1 execute gymflex_d1 --remote --command "SQL"` (run from `apps/storefront/`) |
| R2 image key pattern | `products/<productId>/<filename>` |

---

## Phase 0 — Quick Wins (pure frontend, no DB)

### Feature 2: Product Quick View
**Files to create:**
- `apps/storefront/src/components/QuickViewModal.jsx`

**Files to modify:**
- `apps/storefront/src/components/ProductCard.jsx` — add QuickViewModal, quick view button overlay

**Details:**
- Modal with product image, name, price, variant picker, quantity +/- , add-to-cart
- Triggered by "Quick View" button on product card image hover
- Uses existing `useShop.addToCart`, `getProductPrimaryImage`, `getEffectivePrice`
- Classes: `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm`
- Inner panel: `bg-[#1a1a1a] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6`
- Close on backdrop click + X button

### Feature 6: Recently Viewed Carousel on Product Page
**Files to modify:**
- `apps/storefront/src/context/ShopContext.jsx` — change max from 4 to 8
- `apps/storefront/src/pages/ProductDetails.jsx` — add carousel section

**Details:**
- Filter out current product from recentlyViewed
- Only render if 2+ items
- Use `ProductCard` in horizontal scroll carousel (`.store-carousel` structure)
- Heading: "Recently Viewed"

### Feature 16: Social Share
**Files to create:**
- `apps/storefront/src/components/ShareButton.jsx`

**Files to modify:**
- `apps/storefront/src/pages/ProductDetails.jsx` — add share button

**Details:**
- Mobile: `navigator.share({ title, text, url })`
- Desktop fallback: `navigator.clipboard.writeText(url)` + brief "Link copied!" indicator
- Icon: `Share2` from lucide-react
- Button: `rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition-colors`

### Feature 25: Dark/Light Mode Toggle
**Files to modify:**
- `apps/storefront/src/context/ShopContext.jsx` — add `theme`, `toggleTheme` via useLocalStorageState('theme', 'dark')
- `apps/storefront/src/components/Navbar.jsx` — add Sun/Moon toggle button
- `apps/storefront/src/App.jsx` — sync `data-theme` attribute on `<html>`
- `apps/storefront/src/index.css` — add `[data-theme="light"]` overrides

**CSS light overrides:**
- Body: `background: #ffffff`, `color: #1a1a1a`
- Nav: `background: rgba(255,255,255,0.96)`
- Footer: `background: #f5f5f5`
- Cards/panels: `background: #ffffff`, `border-color: #e5e5e5`
- Text overrides: lighten all text-gray classes

### Feature 40: Print Order Receipt
**Files to modify:**
- `apps/storefront/src/pages/TrackOrder.jsx` — add Print button
- `apps/storefront/src/index.css` — add `@media print` rules

**Details:**
- Printer icon button next to order number
- `window.print()` on click
- `@media print`: hide nav, footer, sidebar, action buttons; white bg, black text

### Feature 41: Lazy Loading Image Placeholder (Blur-up)
**Files to modify:**
- `apps/storefront/src/index.css` — add blur effect on unloaded images

**CSS:**
```css
.product-card-loaded-image:not(.is-loaded) {
  filter: blur(10px);
  transform: scale(1.05);
}
.product-card-loaded-image.is-loaded {
  filter: blur(0);
  transform: scale(1);
  transition: filter 0.3s ease, transform 0.3s ease;
}
```

### Feature 51: Schema.org JSON-LD
**Files to create:**
- `apps/storefront/src/lib/schema.js`

**Files to modify:**
- `apps/storefront/src/App.jsx` — add Organization + WebSite schema
- `apps/storefront/src/pages/ProductDetails.jsx` — add Product schema

**Schemas:**
- Organization: name, url, logo
- WebSite: name, url, SearchAction (potentialAction)
- Product: name, description, sku, image, offers (priceCurrency, price, availability)

### Feature 62: Bottom Navigation on Mobile
**Files to create:**
- `apps/storefront/src/components/BottomNav.jsx`

**Files to modify:**
- `apps/storefront/src/App.jsx` — render BottomNav
- `apps/storefront/src/index.css` — add `.has-bottom-nav { padding-bottom: 4rem; }`

**Details:**
- Fixed bottom: `fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d0d] border-t border-white/10 sm:hidden`
- 4 items: Home (House), Shop (ShoppingBag), Wishlist (Heart + count), Cart (ShoppingBag + count, opens drawer)
- Each is `<Link>` except Cart which uses `setIsCartOpen(true)`

---

## Phase 1 — Product Features (DB + API + Frontend)

### Feature 1: Reviews & Ratings
**DB migration:** `0006_reviews.sql`
```sql
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  title TEXT DEFAULT '',
  body TEXT DEFAULT '',
  author_name TEXT NOT NULL DEFAULT 'Anonymous',
  is_approved INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id, is_approved);
```

**Files to create:**
- `apps/storefront/functions/api/reviews.js` — GET (list approved) + POST (create)
- `apps/storefront/src/components/StarRating.jsx` — display + input modes
- `apps/admin/functions/api/reviews-admin.js` — GET (all), PATCH (approve), DELETE
- `apps/admin/src/pages/ReviewsPage.jsx` — admin CRUD table

**Files to modify:**
- `apps/storefront/src/pages/ProductDetails.jsx` — add reviews section + star avg
- `apps/storefront/src/components/ProductCard.jsx` — show avg rating stars
- `apps/admin/src/App.jsx` — add /reviews route
- `apps/admin/src/components/AdminShell.jsx` — add Reviews nav link

### Feature 4: Stock / Inventory
**DB migration:** `0007_stock.sql`
```sql
ALTER TABLE product_variants ADD COLUMN stock INTEGER NOT NULL DEFAULT 0;
```

**Files to modify:**
- `apps/admin/src/pages/ProductEditorPage.jsx` — add Stock input per variant row
- `apps/storefront/functions/api/product.js` — ensure `stock` returned in variants
- `apps/storefront/src/pages/ProductDetails.jsx` — show stock status ("Only X left", "Out of Stock"), disable add-to-cart when stock=0

### Feature 5: Product Search
**Files to create:**
- `apps/storefront/functions/api/search.js` — GET `?q=...` → products matching name/description/category
- `apps/storefront/src/pages/SearchResults.jsx` — results page

**Files to modify:**
- `apps/storefront/src/components/Navbar.jsx` — search icon that expands to input
- `apps/storefront/src/main.jsx` — add `/search` route

**SQL pattern:**
```sql
SELECT p.*, c.name as category_name, c.slug as category_slug,
  (SELECT cdn_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC, created_at ASC LIMIT 1) as primary_image_url
FROM products p JOIN categories c ON c.id = p.category_id
WHERE p.is_active = 1 AND p.slug NOT LIKE '%-edition'
  AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)
ORDER BY p.sort_order ASC, p.created_at DESC LIMIT ?
```

### Feature 31: Product Videos
**DB migration:** `0008_video.sql`
```sql
ALTER TABLE products ADD COLUMN video_url TEXT DEFAULT '';
```

**Files to modify:**
- `apps/admin/src/pages/ProductEditorPage.jsx` — add Video URL input
- `apps/storefront/functions/api/product.js` — return `video_url`
- `apps/storefront/src/pages/ProductDetails.jsx` — if video_url, embed YouTube/MP4 player

### Feature 50: SEO Meta Tags per Product
**DB migration:** `0009_seo.sql`
```sql
ALTER TABLE products ADD COLUMN meta_title TEXT DEFAULT '';
ALTER TABLE products ADD COLUMN meta_description TEXT DEFAULT '';
```

**Files to modify:**
- `apps/admin/src/pages/ProductEditorPage.jsx` — add meta_title + meta_description inputs
- `apps/storefront/functions/api/product.js` — return meta_title/meta_description
- `apps/storefront/src/pages/ProductDetails.jsx` — pass to `usePageTitle` when available

---

## Phase 2 — Catalog & Discovery

### Feature 3: Size Guide
**Files to create:**
- `apps/storefront/src/components/SizeGuideModal.jsx` — modal with measurements table

**Files to modify:**
- `apps/storefront/src/pages/ProductDetails.jsx` — add "Size Guide" link button
- `apps/admin/src/pages/SettingsPage.jsx` — add size guide JSON editor (optional)

**Data:** Static by category or admin-editable JSON in site_settings

### Feature 7: Advanced Filtering / Sort
**Files to modify:**
- `apps/storefront/functions/api/product-catalog.js` — add `minPrice`, `maxPrice`, `sortBy` params
- `apps/storefront/src/components/CatalogControls.jsx` — price range inputs, on-sale toggle, more sort options
- `apps/storefront/src/pages/ShopAll.jsx` + `Sale.jsx` — pass filter state

**Sort options:** `price-asc`, `price-desc`, `name-asc`, `name-desc`, `newest`
**SQL additions:** `AND p.price >= ? AND p.price <= ?` + `ORDER BY ...`

### Feature 33: Product Comparison
**Files to create:**
- `apps/storefront/src/components/CompareBar.jsx` — bottom bar with selected products

**Files to modify:**
- `apps/storefront/src/context/ShopContext.jsx` — add `compareList`, `toggleCompare`, `clearCompare` (localStorage)
- `apps/storefront/src/components/ProductCard.jsx` — add compare checkbox
- `apps/storefront/src/App.jsx` — render CompareBar

**Details:** Max 4 products, stored in localStorage, side-by-side comparison table

### Feature 59: Complete the Look
**DB migration:** `0010_look_products.sql`
```sql
CREATE TABLE IF NOT EXISTS look_products (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  linked_product_id TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (linked_product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

**Files to modify:**
- `apps/storefront/functions/api/product.js` — fetch + return `lookProducts`
- `apps/storefront/src/pages/ProductDetails.jsx` — show "Complete the Look" carousel
- `apps/admin/src/pages/ProductEditorPage.jsx` — multi-select for linked products

### Feature 60: Fit Finder Quiz
**Files to create:**
- `apps/storefront/src/components/FitFinderModal.jsx` — 3-step quiz modal

**Files to modify:**
- `apps/storefront/src/components/Navbar.jsx` — "Find My Fit" button

**Details:** 3 questions → rule engine → recommended products. Store results in localStorage.

---

## Phase 3 — Order Management

### Feature 11: Order Notes
**Files to modify:**
- `apps/storefront/src/pages/Checkout.jsx` — add "Order Notes" textarea
- `apps/storefront/functions/api/orders.js` — include `notes` in INSERT and response
- `apps/admin/src/pages/OrderDetailsPage.jsx` — display + edit notes

### Feature 26: COD Confirmation Call
**DB migration:** `0011_call_status.sql`
```sql
ALTER TABLE orders ADD COLUMN call_status TEXT NOT NULL DEFAULT 'not_needed';
```

**Files to modify:**
- `apps/admin/src/pages/OrderDetailsPage.jsx` — add Call Status dropdown
- `apps/admin/functions/api/order.js` — accept `call_status` in PATCH

### Feature 27: Partial Fulfillment
**DB migration:** `0012_item_status.sql`
```sql
ALTER TABLE order_items ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';
```

**Files to modify:**
- `apps/admin/src/pages/OrderDetailsPage.jsx` — per-item status dropdown
- `apps/admin/functions/api/order.js` — accept item status updates
- `apps/storefront/src/pages/TrackOrder.jsx` — show per-item status

### Feature 28: Bulk Order Status Update
**Files to create:**
- `apps/admin/functions/api/orders-bulk.js` — PATCH `{ ids: [], status }`

**Files to modify:**
- `apps/admin/src/pages/OrdersPage.jsx` — add checkboxes + bulk action dropdown

### Feature 29: Delivery Partner Stub
**DB migration:** `0013_tracking.sql`
```sql
ALTER TABLE orders ADD COLUMN courier_name TEXT DEFAULT '';
ALTER TABLE orders ADD COLUMN tracking_url TEXT DEFAULT '';
```

**Files to modify:**
- `apps/admin/src/pages/OrderDetailsPage.jsx` — Courier Name + Tracking URL fields
- `apps/admin/functions/api/order.js` — accept in PATCH
- `apps/storefront/src/pages/TrackOrder.jsx` — show tracking link

### Feature 30: Order Notes (Customer → Admin)
Same as Feature 11 — the `notes` column already exists in DB, just need frontend UI.

---

## Phase 4 — Marketing & Promotions

### Feature 8: Trending / Best Sellers
**Files to create:**
- `apps/storefront/functions/api/best-sellers.js` — GET, returns products ordered by order count

**Files to modify:**
- `apps/storefront/src/pages/Home.jsx` — add "Best Sellers" carousel section

### Feature 17: Referral Program
**Files to modify:**
- `apps/storefront/functions/api/validate-discount.js` — handle referral codes
- `apps/storefront/src/pages/Checkout.jsx` — auto-apply referral discount from cookie
- `apps/admin/src/pages/DiscountsPage.jsx` — add referral toggle

**Details:** `/ref/CODE` route → cookie → checkout auto-apply

### Feature 18: Flash Sale Timer
**Files to modify:**
- `apps/admin/src/pages/SettingsPage.jsx` — add flashSaleEndsAt + flashSaleText fields
- `apps/storefront/src/components/Navbar.jsx` — countdown banner below nav

**Frontend:** Countdown timer (days:hrs:mins:secs), auto-hide when expired

### Feature 35: Bulk / Tiered Pricing
**DB migration:** `0014_tiered_pricing.sql`
```sql
CREATE TABLE IF NOT EXISTS tiered_pricing (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  min_quantity INTEGER NOT NULL,
  discount_percent INTEGER NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

**Files to modify:**
- `apps/storefront/functions/api/product.js` — return `tieredPricing`
- `apps/storefront/src/pages/ProductDetails.jsx` — show tier table, apply discount in cart
- `apps/admin/src/pages/ProductEditorPage.jsx` — tier management UI

### Feature 47: Exit-Intent Popup
**Files to create:**
- `apps/storefront/src/components/ExitIntentPopup.jsx`

**Files to modify:**
- `apps/storefront/src/App.jsx` — render exit intent popup

**Details:** Track mouseleave, sessionStorage flag, show "10% off" + email capture

### Feature 48: Customer Loyalty Points
**DB migration:** `0015_loyalty.sql`
```sql
CREATE TABLE IF NOT EXISTS loyalty_points (
  phone TEXT PRIMARY KEY,
  points INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  order_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Files to create:**
- `apps/storefront/functions/api/loyalty.js` — GET balance, POST redeem

**Files to modify:**
- `apps/storefront/functions/api/orders.js` — award points on order
- `apps/storefront/src/pages/Checkout.jsx` — "Use Points" option
- `apps/admin/src/pages/LoyaltyPage.jsx` — admin lookup/adjust

### Feature 52: Bank Transfer / JazzCash / EasyPaisa
**Files to modify:**
- `apps/admin/src/pages/SettingsPage.jsx` — payment method checkboxes + bank details
- `apps/storefront/src/pages/Checkout.jsx` — radio buttons, show payment instructions
- `apps/storefront/functions/api/orders.js` — store payment_method on order

---

## Phase 5 — Admin Tools

### Feature 20: Bulk Product Import/Export
**Files to create:**
- `apps/admin/functions/api/products-admin/export.js` — CSV download
- `apps/admin/functions/api/products-admin/import.js` — CSV upload + parse

**Files to modify:**
- `apps/admin/src/pages/ProductsPage.jsx` — Import/Export buttons

### Feature 42: Product Duplicate
**Files to modify:**
- `apps/admin/functions/api/product.js` — add duplicate endpoint
- `apps/admin/src/pages/ProductEditorPage.jsx` — "Duplicate" button

### Feature 43: Quick Status Bar
**Files to create:**
- `apps/admin/src/pages/DashboardPage.jsx`

**Files to modify:**
- `apps/admin/src/App.jsx` — set as default index route

**Details:** Stat cards: Pending Orders, Total Products, Today's Orders, Low Stock Items

### Feature 44: Activity Log
**DB migration:** `0016_activity_log.sql`
```sql
CREATE TABLE IF NOT EXISTS activity_log (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  admin_id TEXT,
  details TEXT DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Files to create:**
- `apps/admin/functions/api/activity.js` — GET (list)
- `apps/admin/src/pages/ActivityPage.jsx` — filtered table

**Files to modify:**
- `apps/admin/functions/_lib/db.js` — add `logActivity()` helper
- Existing admin API handlers — call logActivity on mutations

### Feature 55: Courier Shipping Calculator
**DB migration:** `0017_shipping_rates.sql`
```sql
CREATE TABLE IF NOT EXISTS shipping_rates (
  id TEXT PRIMARY KEY,
  city TEXT NOT NULL UNIQUE,
  fee INTEGER NOT NULL,
  estimated_days TEXT DEFAULT '3-5'
);
```

**Files to create:**
- `apps/storefront/functions/api/shipping-rate.js` — GET `?city=...`
- `apps/admin/src/pages/ShippingRatesPage.jsx`

**Files to modify:**
- `apps/storefront/src/pages/Checkout.jsx` — fetch rate on city blur, update fee

### Feature 56: Site Maintenance Mode
**Files to create:**
- `apps/storefront/functions/_middleware.js` — check maintenance flag, return HTML page

**Files to modify:**
- `apps/admin/src/pages/SettingsPage.jsx` — maintenance toggle

---

## Phase 6 — Customer-Facing Features

### Feature 13: Newsletter Signup
**DB migration:** `0018_newsletter.sql`
```sql
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Files to create:**
- `apps/storefront/functions/api/newsletter.js` — POST subscribe
- `apps/admin/src/pages/NewsletterPage.jsx` — subscriber list + export

**Files to modify:**
- `apps/storefront/src/components/Footer.jsx` — email input + subscribe button

### Feature 14: Price Drop Alert
**DB migration:** `0019_price_alerts.sql`
```sql
CREATE TABLE IF NOT EXISTS price_alerts (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  email TEXT NOT NULL,
  target_price INTEGER NOT NULL,
  is_notified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Files to create:**
- `apps/storefront/functions/api/price-alert.js` — POST create alert
- `apps/admin/src/pages/PriceAlertsPage.jsx` — view alerts

**Files to modify:**
- `apps/storefront/src/pages/ProductDetails.jsx` — "Notify me when price drops" button

### Feature 15: Back-in-Stock Notification
**DB migration:** `0020_stock_alerts.sql`
```sql
CREATE TABLE IF NOT EXISTS stock_alerts (
  id TEXT PRIMARY KEY,
  variant_id TEXT NOT NULL,
  email TEXT NOT NULL,
  is_notified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Files to create:**
- `apps/storefront/functions/api/stock-alert.js` — POST create
- `apps/admin/src/pages/StockAlertsPage.jsx` — view alerts

**Files to modify:**
- `apps/storefront/src/pages/ProductDetails.jsx` — "Email when back in stock" button (when stock=0)

### Feature 23: FAQ with Categories
**DB migration:** `0021_faq.sql`
```sql
CREATE TABLE IF NOT EXISTS faq_items (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'General',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Files to create:**
- `apps/storefront/functions/api/faq.js` — GET active FAQ items
- `apps/admin/functions/api/faq-admin.js` — CRUD
- `apps/admin/src/pages/FaqPage.jsx` — FAQ management

**Files to modify:**
- `apps/storefront/src/pages/InfoPages.jsx` — add FAQ component with accordion + categories
- `apps/storefront/src/main.jsx` — ensure `/faq` route exists
- `apps/admin/src/App.jsx` — add /faq route
- `apps/admin/src/components/AdminShell.jsx` — add FAQ nav link

### Feature 37: Preorder / Coming Soon
**DB migration:** `0022_preorder.sql`
```sql
ALTER TABLE products ADD COLUMN is_preorder INTEGER NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN preorder_release_date TEXT DEFAULT NULL;
```

**Files to modify:**
- `apps/admin/src/pages/ProductEditorPage.jsx` — add Preorder toggle + release date
- `apps/storefront/functions/api/product-catalog.js` + `product.js` — return preorder flags
- `apps/storefront/src/components/ProductCard.jsx` — "Coming Soon" badge
- `apps/storefront/src/pages/ProductDetails.jsx` — "Preorder Now" button + release date

### Feature 38: Order Cancellation from Track Order
**Files to create:**
- `apps/storefront/functions/api/cancel-order.js` — POST `{ orderNumber, phone }`

**Files to modify:**
- `apps/storefront/src/pages/TrackOrder.jsx` — "Cancel Order" button (only if status='new' and <1hr old)

### Feature 39: COD Slider
**Files to modify:**
- `apps/storefront/src/pages/Checkout.jsx` — show estimated change amount

**Details:** "Please have approximately Rs. {amount} ready" — `Math.ceil(total / 100) * 100`

### Feature 61: Community Wall
**DB migration:** `0023_community_photos.sql`
```sql
CREATE TABLE IF NOT EXISTS community_photos (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  image_url TEXT NOT NULL,
  author_name TEXT DEFAULT 'GymFlex Customer',
  is_approved INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Files to create:**
- `apps/storefront/functions/api/community-photos.js` — GET approved
- `apps/admin/functions/api/community-photos.js` — CRUD + approve
- `apps/admin/src/pages/CommunityPhotosPage.jsx` — grid with approve/reject

**Files to modify:**
- `apps/storefront/src/pages/Home.jsx` — add community photos carousel

---

## Phase 7 — Admin UX

### Feature 9: Gift Cards
**DB migration:** `0024_gift_cards.sql`
```sql
CREATE TABLE IF NOT EXISTS gift_cards (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  initial_balance INTEGER NOT NULL,
  balance INTEGER NOT NULL,
  expires_at TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS gift_card_transactions (
  id TEXT PRIMARY KEY,
  gift_card_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  order_id TEXT,
  type TEXT NOT NULL CHECK(type IN ('redeem', 'topup')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Files to create:**
- `apps/storefront/functions/api/validate-gift-card.js` — GET validate, POST redeem
- `apps/admin/functions/api/gift-cards-admin.js` — CRUD
- `apps/admin/src/pages/GiftCardsPage.jsx`

**Files to modify:**
- `apps/storefront/src/pages/Checkout.jsx` — "Redeem Gift Card" input (same pattern as discount code)
- `apps/storefront/functions/api/orders.js` — handle gift card discount

### Feature 10: Multiple Addresses
**DB migration:** `0025_saved_addresses.sql`
```sql
CREATE TABLE IF NOT EXISTS saved_addresses (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  label TEXT DEFAULT 'Home',
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Files to create:**
- `apps/storefront/functions/api/addresses.js` — GET `?phone=...`, POST save, DELETE

**Files to modify:**
- `apps/storefront/src/pages/Checkout.jsx` — load saved addresses on phone blur, "Save this address" checkbox

### Feature 12: Estimated Delivery Date
Uses `shipping_rates.estimated_days` from Feature 55.

**Files to modify:**
- `apps/storefront/src/pages/ProductDetails.jsx` — show estimated delivery
- `apps/storefront/src/pages/Checkout.jsx` — show delivery range

### Feature 22: Discount Analytics
**Files to modify:**
- `apps/admin/src/pages/DiscountsPage.jsx` — add stats columns per code (times used, total discount, avg order value)

### Feature 32: Bundle / Combo Deals
**DB migration:** `0026_bundles.sql`
```sql
CREATE TABLE IF NOT EXISTS bundles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  price INTEGER NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS bundle_items (
  id TEXT PRIMARY KEY,
  bundle_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (bundle_id) REFERENCES bundles(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

**Files to create:**
- `apps/storefront/functions/api/bundles.js` — GET active bundles
- `apps/admin/functions/api/bundles-admin.js` — CRUD
- `apps/admin/src/pages/BundlesPage.jsx`
- `apps/storefront/src/components/BundleCard.jsx`

**Files to modify:**
- `apps/storefront/src/pages/Home.jsx` — bundles section

### Feature 46: Order Print Packing Slip
**Files to modify:**
- `apps/admin/src/pages/OrderDetailsPage.jsx` — "Packing Slip" button + `@media print` layout
- `apps/admin/src/index.css` — print styles

---

## Phase 8 — Dashboard & Infrastructure

### Feature 19: Sales Dashboard
**Files to create:**
- `apps/admin/src/pages/DashboardPage.jsx` — stat cards + recent orders + low stock + simple chart (Canvas API)

**Files to modify:**
- `apps/admin/src/App.jsx` — set Dashboard as default route
- `apps/admin/functions/api/dashboard.js` — aggregate stats endpoint

### Feature 34: Virtual Try-On Stub
**Files to create:**
- `apps/storefront/src/components/TryOnModal.jsx`

**Files to modify:**
- `apps/storefront/src/pages/ProductDetails.jsx` — "Try On" button

**Details:** Modal with "Coming Soon" message + photo upload placeholder

### Feature 45: Dark Mode for Admin Panel
**Files to modify:**
- `apps/admin/src/index.css` — add `[data-theme="light"]` overrides
- `apps/admin/src/components/AdminShell.jsx` — Sun/Moon toggle, localStorage preference

### Feature 54: Tax / GST Calculation
**DB migration:** `0027_tax.sql`
```sql
ALTER TABLE orders ADD COLUMN tax_amount INTEGER NOT NULL DEFAULT 0;
```

**Files to modify:**
- `apps/admin/src/pages/SettingsPage.jsx` — add `taxRate` field
- `apps/storefront/functions/api/orders.js` — calculate tax, store in DB
- `apps/storefront/src/pages/Checkout.jsx` — show "GST (X%)" line item

### Feature 57: Sitemap.xml Generator
**Files to create:**
- `apps/storefront/functions/api/sitemap.xml.js` — generate XML

**Details:** Lists all products + categories + static pages with priorities. Cache for 24h.

---

## Execution Order

```
Phase 0: Quick Wins (parallelizable)
     │
     ▼
Phase 1: Product Features (Reviews → Stock → Search → Video → SEO)
     │
     ▼
Phase 2: Catalog & Discovery (Size Guide → Filters → Compare → Look → Fit Quiz)
     │
     ▼
Phase 3: Order Management (Notes → COD Call → Partial Fulfill → Bulk → Tracking)
     │
     ▼
Phase 4: Marketing (Best Sellers → Referrals → Flash Sale → Tiered Price → Exit Popup → Loyalty → Payments)
     │
     ▼
Phase 5: Admin Tools (Import/Export → Duplicate → Status Bar → Activity Log → Shipping Rates → Maintenance)
     │
     ▼
Phase 6: Customer Features (Newsletter → Alerts → FAQ → Preorder → Cancel → COD Slider → Community)
     │
     ▼
Phase 7: Admin UX (Gift Cards → Addresses → Delivery Estimate → Discount Analytics → Bundles → Packing Slip)
     │
     ▼
Phase 8: Dashboard & Infra (Dashboard → Try-On Stub → Admin Dark Mode → Tax → Sitemap)
```
