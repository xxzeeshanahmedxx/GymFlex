# AI Agent Operating Guide for ZERO_TEMPLATE

You are working on a reusable Cloudflare ecommerce system.

The user wants this to be a base for AI agents. Your job is to behave like a careful senior builder, not a random code generator.

---

## Core mission

Turn this template into a real store for a new brand without leaving template clues and without breaking the ecommerce/admin system.

---

## Personality / behavior rules

- Be direct.
- Do the work, do not only plan.
- Ask only necessary questions.
- If intent is clear, implement.
- Verify live URLs after deploy.
- Do not say fixed unless verified.
- Keep UI clean and premium.
- Mobile-first.
- Do not make things uglier to solve a bug.
- Do not use all caps everywhere.
- Do not leave generic AI copy.
- Do not make random new pages/systems unless needed.

---

## First questions to ask for a new store

Ask these if not provided:

1. Store name
2. Niche/product type
3. Categories
4. Brand style/colors
5. Products count
6. Admin password
7. Custom domain or pages.dev only
8. Payment/order style: COD, WhatsApp, gateway, manual checkout
9. Product images available or need placeholders

Do not ask 20 questions at once.

---

## Build order for a new store

1. Rebrand copy and UI.
2. Create Cloudflare resources.
3. Update wrangler bindings.
4. Run D1 migrations.
5. Seed categories/products/settings.
6. Upload images to R2.
7. Set admin secret.
8. Build storefront/admin.
9. Deploy storefront/admin.
10. Verify live.
11. Commit and report exact details.

---

## Cloudflare resource naming

Use store slug consistently.

Example store slug:

```txt
urbanwear
```

Resources:

```txt
urbanwear_d1
urbanwear_kv
urbanwear-r2
urbanwear
urbanwear-admin
```

Bindings in code stay generic:

```txt
STORE_DB
STORE_KV
STORE_BUCKET
```

Only `wrangler.toml` resource IDs/names change.

---

## Rebranding checklist

Search and replace these areas:

```txt
index.html meta tags
Navbar brand
Footer brand
Info pages
Policy pages
Contact page
PDF brand name
Admin shell title
Login page title
Homepage default settings
Header collection slugs
Seed categories/products
README if creating client repo
```

Run grep for old names before final.

---

## Database notes

Important tables include:

```txt
categories
products
product_images
product_variants
orders
order_items
site_settings
admin_users
```

Use `site_settings` key `homepage` for homepage controls.

Hero/banner settings live inside homepage settings:

```json
heroBanner: {
  animation,
  animationDuration,
  slideDuration,
  desktopImages: [],
  mobileImages: []
}
```

---

## Image rules

R2 keys should be organized:

```txt
products/<product-id>/<timestamp>-filename.webp
site/hero/desktop/<slot>-...
site/hero/mobile/<slot>-...
```

Use unique keys.

For pages.dev stores, store URLs as:

```txt
/api/r2?key=<encoded-key>
```

---

## Admin image preview bug to avoid

If an image URL already has query params, cache-bust using `&v=`.

Use helper:

```js
function withCacheBust(url, value) {
  if (!url) return '';
  const separator = String(url).includes('?') ? '&' : '?';
  return `${url}${separator}v=${encodeURIComponent(value)}`;
}
```

---

## Hero/banner performance rules

Use skeleton behind image, not over image.

Do not use React state to hide image until `onLoad` unless necessary.

Good:

```txt
skeleton z-index 0
image z-index 2
image opacity 1
```

Bad:

```txt
image opacity 0 until state flips
spinner overlay blocking image
fallback SVG flashing before real banner
```

---

## Product price rules

Sale display should check both normalized and raw API fields:

```txt
onSale OR on_sale
salePrice OR sale_price
sale price < price
```

Only then show:

```txt
sale price + original price strikethrough
```

Otherwise show regular price only.

---

## Order rules

Order item image preference:

```txt
variant image first
product image fallback
one image only
```

Do not show duplicate product + variant thumbnails unless user asks.

Order deletion:

```txt
delete order_items first
then delete order
```

Product deletion:

```txt
if product exists in order_items, block deletion
say mark inactive instead
```

---

## PDF rules

PDF should be compact and not huge.

Rules:

- compress PDF
- use brand font if possible
- use store name in header
- do not insert full images
- proxy image if needed
- resize image to small thumbnail canvas
- convert to compressed JPEG
- then `addImage`

Do not make 9MB PDFs.

---

## Mobile UI rules

- Footer must be compact.
- Buttons should not become awkward full-width unless appropriate.
- Product cards should not be oversized.
- Cart drawer should fit mobile.
- Checkout inputs should be usable with 44px touch targets.
- Header menu should be obvious.

---

## Common failure points

1. Cloudflare root directory wrong.
2. Binding names do not match `wrangler.toml`.
3. D1 not migrated.
4. Admin password secret missing.
5. `/api/r2` missing in storefront or admin.
6. Cache bust uses `?v=` after `?key=`.
7. Storefront API still returns hardcoded settings instead of D1 settings.
8. Hero fallback SVG flashes before uploaded banner.
9. Product images uploaded locally instead of remote R2.
10. Saying fixed without checking live.

---

## Verification commands / checks

Build:

```bash
npm run build:storefront
npm run build:admin
```

Check old brand clues:

```bash
grep -R "OLD_BRAND_NAME" -n . --exclude-dir=node_modules --exclude-dir=dist
```

Check live API:

```bash
curl https://your-store.pages.dev/api/homepage
curl https://your-store.pages.dev/api/product-catalog?limit=2
```

Check image:

```bash
curl -L "https://your-store.pages.dev/api/r2?key=<key>" -o /tmp/img.webp
file /tmp/img.webp
```

---

## Deployment reporting

Final answer must include:

```txt
Live URLs
Deployment IDs
Commit hash
What was verified
Any known limitation
```

If something failed, say honestly what failed and what is needed.

---

## Private template ZIP workflow

If the template is private, use Option B:

1. Download ZIP through GitHub API using a token that can read this template.
2. Extract into a new project folder.
3. Remove `.git` if present.
4. Initialize a fresh repo for the new store.
5. Push to the store/client repo.
6. Create fresh Cloudflare resources.

Detailed steps are in:

```txt
docs/OPTION_B_DOWNLOAD_WORKFLOW.md
```

Prompt templates are in:

```txt
docs/PROMPTS.md
```

Do not mention or depend on any previous client/project. Treat this as a neutral base.
