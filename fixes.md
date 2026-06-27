# GymFlex Fix Plan

> Comprehensive plan to fix all logic errors, bugs, and edge cases across the GymFlex codebase.

---

## Phase 0: Critical API/Backend Bugs (will crash or corrupt data)

### 0.1 Fix missing import in `tiered-pricing.js`
- **File:** `apps/storefront/functions/api/tiered-pricing.js:7`
- **Fix:** Add `import { error } from '../_lib/http';` (missing `error` function causes `ReferenceError`)
- **Risk:** None — trivial import addition

### 0.2 Fix discount-analytics table/column names
- **File:** `apps/admin/functions/api/discount-analytics.js:9`
- **Fix:** Change `FROM discounts d` → `FROM discount_codes d` and `d.discount_percent` → `d.value`
- **Risk:** None — query currently always fails, this makes it work

### 0.3 Fix product-duplicate r2_key UNIQUE violation
- **File:** `apps/admin/functions/api/product-duplicate.js:28-31`
- **Fix:** When duplicating product images, generate new UUIDs for `r2_key` instead of copying verbatim. Since images are stored in R2, the duplicate will reference the same R2 object (which is fine as long as the original isn't deleted). Store the new UUID as `r2_key`.
- **Alternative:** Remove the UNIQUE constraint on `r2_key` via migration (simpler, but less safe)
- **Risk:** Low — images share R2 objects

### 0.4 Fix community-photos INSERT column mismatch
- **File:** `apps/storefront/functions/api/community-photos.js:18`
- **Fix:** Change SQL to `INSERT INTO community_photos (id, image_url, author_name) VALUES (?, ?, ?)`, bind `body.email` as `author_name`, remove `email` and `caption` bindings
- **Risk:** None — endpoint currently always fails

### 0.5 Fix admin bootstrap password hash
- **File:** `apps/admin/migrations/0003_bootstrap_admin.sql:2`
- **Fix:** Re-generate hash using the app's `hashPassword()` function (results in `pbkdf2$100000$...$...` format instead of `pbkdf2_sha256$...$...`)
- **Note:** This means the bootstrap password for new deployments changes — document the new password
- **Risk:** Medium — breaks existing admin accounts, requires re-seeding for existing deployments

### 0.6 Fix order creation rollback (discount/gift-card side effects)
- **File:** `apps/storefront/functions/api/orders.js:130-146,170`
- **Fix:** Move discount `used_count` increment and gift card balance decrement AFTER the `batch()` insert of order + items. If batch fails, the discount/gift-card are untouched.
- **Risk:** Low — reordering existing logic

### 0.7 Fix product-bulk empty list crash
- **File:** `apps/admin/functions/api/product-bulk.js:28`
- **Fix:** Add `if (products.length === 0) return error('No products found');` before `Object.keys(products[0])`
- **Risk:** None

---

## Phase 1: Critical Frontend Bugs (React crashes, broken UX)

### 1.1 Fix Checkout.jsx `useState` after early return
- **File:** `apps/storefront/src/pages/Checkout.jsx:280`
- **Fix:** Move `const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);` BEFORE the early return blocks (lines 272, 276)
- **Risk:** None — pure reorder, no logic change

### 1.2 Fix mobile sticky bar QuantitySelector no-ops
- **File:** `apps/storefront/src/pages/ProductDetails.jsx:360`
- **Fix:** Replace `onDecrease={() => {}}` with `onDecrease={() => setQuantity(q => Math.max(1, q - 1))}` and `onIncrease={() => {}}` with `onIncrease={() => setQuantity(q => q + 1)}`
- **Risk:** None

### 1.3 Fix CountdownTimer memory leak
- **File:** `apps/storefront/src/components/CountdownTimer.jsx:19-29`
- **Fix:** Check `remaining.total <= 0` BEFORE setting the interval. Return early from the effect (or clear interval synchronously) if already expired. Also reverse the `tick()` call order: set interval first, then call `tick()`.
- **Risk:** None

### 1.4 Fix FitFinderModal dead-end state
- **File:** `apps/storefront/src/components/FitFinderModal.jsx:54-57,67-68`
- **Fix:** Add a "No recommendations found" fallback UI when `result` is `null` after the last question. Add a reset button to start over.
- **Risk:** None

### 1.5 Fix TryOnModal memory leak
- **File:** `apps/storefront/src/components/TryOnModal.jsx:12,32`
- **Fix:** Store the object URL in state/ref. Call `URL.revokeObjectURL(preview)` in both the remove handler and a `useEffect` cleanup.
- **Risk:** None

---

## Phase 2: CSS Rendering Bugs

### 2.1 Fix App.css undefined CSS variables
- **File:** `apps/admin/src/App.css`
- **Fix:** Define `--accent`, `--accent-bg`, `--accent-border`, `--text-h`, `--social-bg`, `--shadow` in `:root` in either `App.css` or `index.css`, or replace them with hardcoded values. Since this file is from the Vite template and likely unused, consider removing the file entirely or replacing with empty content.
- **Action:** Verify if App.css is imported anywhere. If not, remove the import. If so, define the variables.

### 2.2 Fix PostCSS nesting in App.css
- **File:** `apps/admin/src/App.css` (lines using `&:hover`, nested `@media`)
- **Fix:** Either ensure the build pipeline includes `postcss-nested`, or rewrite as flat CSS. Most of this file appears to be unused template boilerplate.
- **Action:** Remove unused styles or add PostCSS config.

### 2.3 Add button cursor pointer in storefront
- **File:** `apps/storefront/src/index.css`
- **Fix:** Add `button:not(:disabled) { cursor: pointer; }` globally. Also add `cursor: pointer` to `.header-action-btn`, `.store-cart-button`, `.store-quick-add-button`, `.newsletter-sub-btn`, `.checkout-summary-toggle`.
- **Risk:** None

### 2.4 Add `-webkit-backdrop-filter` vendor prefix
- **Files:** Both `apps/storefront/src/index.css:1495`, `apps/admin/src/index.css:59,264,1660,2554`
- **Fix:** Add `-webkit-backdrop-filter` alongside every `backdrop-filter` declaration
- **Risk:** None

### 2.5 Add `constant()` fallback for `env(safe-area-inset-*)`
- **File:** `apps/storefront/src/index.css` (lines 253, 499, 508, 619, 622, 625, 1423)
- **Fix:** Add `constant()` before `env()` for each safe-area usage
- **Risk:** None

### 2.6 Add `-webkit-tap-highlight-color`
- **Files:** Both `index.css` files
- **Fix:** Add `html { -webkit-tap-highlight-color: transparent; }` (or a dark-themed color)
- **Risk:** None

---

## Phase 3: High-Severity API Issues

### 3.1 Fix sitemap.xml query
- **File:** `apps/storefront/functions/api/sitemap.xml.js:4`
- **Fix:** Remove `WHERE is_active = 1` (column doesn't exist on `categories`)
- **Risk:** None

### 3.2 Normalize storefront product images
- **File:** `apps/storefront/functions/api/product.js:46`
- **Fix:** Add `.map(normalizeImage)` to images results (import from `../_lib/db`)
- **Risk:** None

### 3.3 Fix admin product update variant handling
- **File:** `apps/admin/functions/api/product.js:65-75`
- **Fix:** Use upsert logic instead of delete+reinsert: for each variant, if it has an existing `id`, UPDATE it; if new, INSERT it; then DELETE any variants not in the payload
- **Risk:** Medium — changes variant update behavior

### 3.4 Fix product-image delete order (R2 before DB)
- **File:** `apps/admin/functions/api/product-image.js:53-54`
- **Fix:** Swap order: delete DB record first, then delete from R2. Wrap in try/catch to re-upload R2 if DB delete fails.
- **Risk:** Low

### 3.5 Fix price validation in products-admin
- **File:** `apps/admin/functions/api/products-admin.js:46` (and `product.js:45`)
- **Fix:** Replace `|| 0` with explicit `isNaN` check that returns validation error
- **Risk:** None

### 3.6 Fix "newest" sort to use `createdAt`
- **File:** `apps/storefront/src/lib/catalog-filters.js:32`
- **Fix:** Add `createdAt` to normalized product schema, sort by it for `'newest'` instead of `sortOrder`
- **Risk:** Low — requires schema change

### 3.7 Add rate limiting to discount validation
- **File:** `apps/storefront/functions/api/validate-discount.js`
- **Fix:** Use KV-based rate limiting (e.g., `context.env.STORE_KV`) — max 10 requests/IP/minute
- **Risk:** Low — new functionality

### 3.8 Add fetch timeout to client API utilities
- **Files:** `apps/admin/src/lib/api.js:9`, `apps/storefront/src/lib/storefront-api.js:4`
- **Fix:** Add `AbortSignal.timeout(15000)` to all `fetch()` calls
- **Risk:** None

---

## Phase 4: High-Severity Admin Frontend Issues

### 4.1 Add unmount cleanup to all async components
- **Files:** ~20 admin pages
- **Fix:** Add `let cancelled = false` pattern or `AbortController` to all `useEffect` data fetches. Clean up in the effect return.
- **Pattern:**
  ```js
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then(r => r.json())
      .then(data => { if (!cancelled) setData(data); })
      .catch(err => { if (!cancelled) setError(err); });
    return () => { cancelled = true; controller.abort(); };
  }, []);
  ```

### 4.2 Convert DiscountsPage/BulkImportPage to use API helper
- **Files:** `apps/admin/src/pages/DiscountsPage.jsx`, `apps/admin/src/pages/BulkImportPage.jsx`
- **Fix:** Replace raw `fetch` with `get`, `post`, `put`, `del` from `../lib/api`
- **Fix:** Replace `window.alert` with `setError` state + error box rendering
- **Fix:** DiscountsPage pointless ternary: remove duplicate URL, use single endpoint

### 4.3 Fix OrderDetailsPage navigation
- **File:** `apps/admin/src/pages/OrderDetailsPage.jsx:104`
- **Fix:** Replace `window.location.href = '/orders'` with `navigate('/orders')`
- **Risk:** None

### 4.4 Add null guards to ProductsPage / DiscountAnalyticsPage
- **Files:** `apps/admin/src/pages/ProductsPage.jsx:70`, `DiscountAnalyticsPage.jsx:27,35`
- **Fix:** Add `data.products || []` and `data.usage || []` before `.map()`/`.filter()`
- **Risk:** None

### 4.5 Fix AlertsPage Promise.all
- **File:** `apps/admin/src/pages/AlertsPage.jsx:15`
- **Fix:** Use `Promise.allSettled` instead of `Promise.all`, or wrap each in try/catch individually
- **Risk:** None

### 4.6 Fix DashboardPage skeleton + error simultaneous display
- **File:** `apps/admin/src/pages/DashboardPage.jsx`
- **Fix:** Only show skeleton when `loading && !error`, only show error when `error && !loading`
- **Risk:** None

---

## Phase 5: Medium-Severity Fixes

### 5.1 Fix phone format mismatch (checkout vs track-order)
- **Files:** `Checkout.jsx:76`, `TrackOrder.jsx:36`
- **Fix:** Normalize phone consistently — use digits-only (`\D` stripped) in both places

### 5.2 Add product variant price support
- **File:** `ProductDetails.jsx:160-174,419`
- **Fix:** Show `getEffectivePrice(selectedVariant || product)` instead of `getEffectivePrice(product)`

### 5.3 Fix PriceBlock in Checkout for variant pricing
- **File:** `Checkout.jsx:109`
- **Fix:** Use variant-specific price instead of `getEffectivePrice(item.product)`

### 5.4 Fix Homepage empty heroBanner fallback
- **File:** `Home.jsx:41-50`
- **Fix:** Add `Object.keys(heroBanner).length === 0` check or check `heroBanner?.desktopImages?.length`

### 5.5 Fix structured data script duplicate
- **File:** `ProductDetails.jsx:606-613`
- **Fix:** Use `document.getElementById('product-schema')` + `replaceWith` or update `textContent` instead of creating new `<script>` elements

### 5.6 Add loading/disabled state to community-photos upload
- **File:** `CommunityPhotos.jsx:19-29`
- **Fix:** Add `submitting` state, disable button during upload, show spinner

### 5.7 Add error states for silent fetch failures
- **Files:** `CommunityPhotos.jsx:15`, `InfoPages.jsx:59`, `ProductDetails.jsx:229-230`
- **Fix:** Add error state variable, display error message instead of misleading empty state

### 5.8 Add client-side validation to forms
- **File:** `TrackOrder.jsx:62,66`, `CommunityPhotos.jsx:40-41`
- **Fix:** Add JavaScript validation for phone (10+ digits), email format, URL format

### 5.9 Fix localStorage.setItem not wrapped in try/catch
- **File:** `ReferralPage.jsx:23`
- **Fix:** Wrap in try/catch

### 5.10 Add `saving` state to prevent double-submit
- **Files:** `CategoriesPage.jsx`, `OrdersPage.jsx`, `ReviewsPage.jsx`, `CommunityPhotosPage.jsx`
- **Fix:** Add `saving` boolean, disable submit button during save

### 5.11 Fix CategoriesPage server-field injection
- **File:** `CategoriesPage.jsx:125`
- **Fix:** Extract only form fields: `{ id, name, slug, description, sort_order }` instead of spreading entire category object

### 5.12 Fix FaqPage drag handler bounds
- **File:** `FaqPage.jsx:53-61`
- **Fix:** Clamp drag indices: `Math.max(0, Math.min(dragItem.current, items.length - 1))`

### 5.13 Fix LoyaltyPage phone key
- **File:** `LoyaltyPage.jsx:79`
- **Fix:** Use `p.id` instead of `p.phone` as React key

### 5.14 Fix ReviewsPage camelCase inconsistency
- **File:** `ReviewsPage.jsx:35`
- **Fix:** Send `is_approved` (snake_case) instead of `isApproved` in API payload

### 5.15 Add pagination to ActivityLogPage
- **File:** `ActivityLogPage.jsx`
- **Fix:** Add client-side pagination (similar to ProductsPage pattern)

---

## Phase 6: CSS Polish

### 6.1 Consolidate storefront `@media (max-width: 640px)` blocks
- **File:** `apps/storefront/src/index.css`
- **Fix:** Merge 15+ separate `640px` media query blocks into one organized section
- **Risk:** Medium — requires careful ordering to avoid regression

### 6.2 Add missing device breakpoints
- **Files:** Both CSS files
- **Fix:** Add `320px`, `375px`, `414px`, `768px` breakpoints where needed
- **Risk:** Low

### 6.3 Clean up admin `!important` declarations
- **File:** `apps/admin/src/index.css`
- **Fix:** Not a full rewrite — start by removing `!important` from the earliest iteration where a later iteration already provides the value without `!important`
- **Risk:** High — touch carefully

### 6.4 Remove dead code in admin CSS (lines 1773-1780)
- **File:** `apps/admin/src/index.css`
- **Fix:** Remove `#root { display: none !important; }` block that is immediately overridden
- **Risk:** None

### 6.5 Add print styles to admin
- **File:** `apps/admin/src/index.css`
- **Fix:** Add `@media print` block for order details, invoices
- **Risk:** None

### 6.6 Fix `reveal-section` `opacity: 0` fallback for non-supporting browsers
- **File:** `apps/storefront/src/index.css:853-857`
- **Fix:** Use `@supports (animation-timeline: view())` or set `opacity: 1` as fallback with `animation-fill-mode: forwards` ensuring it eventually becomes visible
- **Risk:** Low

---

## Execution Order Summary

| Phase | Area | Files | Complexity | Risk |
|-------|------|-------|-----------|------|
| **0** | Critical API bugs | 7 functions | Easy | Low |
| **1** | Critical frontend bugs | 5 components/pages | Easy | Low |
| **2** | CSS rendering bugs | 3 CSS files | Easy | Low |
| **3** | High-severity API | 8 functions | Medium | Low-Med |
| **4** | High admin frontend | 10+ pages | Medium | Low-Med |
| **5** | Medium fixes | 15+ files | Medium | Low |
| **6** | CSS polish | 2 CSS files | Hard | Medium |

---

## File Index (absolute paths)

### Critical API Bugs
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\storefront\functions\api\tiered-pricing.js`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\functions\api\discount-analytics.js`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\functions\api\product-duplicate.js`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\storefront\functions\api\community-photos.js`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\migrations\0003_bootstrap_admin.sql`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\storefront\functions\api\orders.js`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\functions\api\product-bulk.js`

### Critical Frontend Bugs
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\storefront\src\pages\Checkout.jsx`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\storefront\src\pages\ProductDetails.jsx`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\storefront\src\components\CountdownTimer.jsx`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\storefront\src\components\FitFinderModal.jsx`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\storefront\src\components\TryOnModal.jsx`

### CSS
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\storefront\src\index.css`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\src\index.css`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\src\App.css`

### High-Severity API
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\storefront\functions\api\sitemap.xml.js`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\storefront\functions\api\product.js`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\functions\api\product.js`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\functions\api\product-image.js`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\functions\api\products-admin.js`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\storefront\src\lib\catalog-filters.js`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\storefront\functions\api\validate-discount.js`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\src\lib\api.js`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\storefront\src\lib\storefront-api.js`

### Admin Frontend
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\src\pages\ProductsPage.jsx`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\src\pages\ProductEditorPage.jsx`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\src\pages\OrdersPage.jsx`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\src\pages\OrderDetailsPage.jsx`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\src\pages\CategoriesPage.jsx`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\src\pages\DiscountsPage.jsx`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\src\pages\DiscountAnalyticsPage.jsx`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\src\pages\AlertsPage.jsx`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\src\pages\DashboardPage.jsx`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\src\pages\BulkImportPage.jsx`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\src\pages\ReviewsPage.jsx`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\src\pages\FaqPage.jsx`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\src\pages\LoyaltyPage.jsx`
- `C:\Users\Zeeshan Ahmed\ZERO_TEMPLATE\apps\admin\src\pages\ActivityLogPage.jsx`
