# ZERO_TEMPLATE — AI Agent Cloudflare Ecommerce Template

A clean, production-ready ecommerce starter for creating fast online stores with AI agents.

This template is intentionally generic. It contains no client brand, no old store name, and no client-specific content. It is meant to be cloned for a new store, rebranded, connected to new Cloudflare resources, and deployed.

---

## What this repo is

```txt
ZERO_TEMPLATE/
  apps/
    storefront/   Customer-facing ecommerce website
    admin/        Admin dashboard for store owner
  docs/
    AGENT_GUIDE.md
```

There is no edit panel in this template. Add one only if the client specifically needs it.

---

## Stack

- React
- Vite
- Cloudflare Pages
- Cloudflare Pages Functions
- Cloudflare D1
- Cloudflare R2
- Cloudflare KV
- jsPDF
- Poppins / Figtree fonts

---

## Storefront features

- Homepage with admin-controlled hero banner
- Fixed desktop/mobile hero ratios
- Skeleton loading that does not block image paint
- Product cards
- Sale carousel
- Featured products
- Collection/category pages
- Product detail page
- Product image gallery
- Optional variants
- Variant-specific image selection
- Cart drawer
- Checkout
- Cash on delivery/manual order flow
- Track order page
- Recently viewed products
- Product/catalog APIs
- R2 image serving through `/api/r2?key=...`

---

## Admin features

- Secret-based admin login
- Product CRUD
- Category CRUD
- Image uploads to R2
- Product image ordering
- Primary product image
- Optional product variants
- Variant image assignment
- Orders list
- Order detail page
- Product/variant image on orders
- Order status update
- Delete order
- Delete product if not used in orders
- Site settings
- Hero/banner manager
- Shipping settings
- Cache purge helper
- Single order PDF
- Bulk filtered order PDF
- Product thumbnails in PDFs

---

## Required Cloudflare resources per store

For every new store, create fresh resources. Do not reuse another client’s resources.

Example naming:

```txt
D1 database:      brandname_d1
KV namespace:     brandname_kv
R2 bucket:        brandname-r2
Pages storefront: brandname
Pages admin:      brandname-admin
```

---

## Binding names used in code

The template code uses generic binding names:

```txt
STORE_DB
STORE_KV
STORE_BUCKET
```

These names must stay consistent in both apps.

Update both:

```txt
apps/storefront/wrangler.toml
apps/admin/wrangler.toml
```

Example:

```toml
[[d1_databases]]
binding = "STORE_DB"
database_name = "brandname_d1"
database_id = "real-d1-id"

[[kv_namespaces]]
binding = "STORE_KV"
id = "real-kv-id"

[[r2_buckets]]
binding = "STORE_BUCKET"
bucket_name = "brandname-r2"
```

---

## Required Pages secrets

Admin Pages project:

```txt
ADMIN_PASSWORD=<secure password>
```

Optional for cache purge when using a custom domain:

```txt
CLOUDFLARE_ZONE_ID=<zone id>
CLOUDFLARE_CACHE_PURGE_TOKEN=<token>
```

Never hardcode real passwords or tokens.

---

## Database setup

Run schema migrations from the admin app:

```bash
cd apps/admin
npx wrangler d1 execute <your-d1-name> --remote --file=./migrations/0001_initial_schema.sql
npx wrangler d1 execute <your-d1-name> --remote --file=./migrations/0004_site_settings.sql
```

Optional starter categories:

```bash
npx wrangler d1 execute <your-d1-name> --remote --file=./migrations/0002_seed_catalog.sql
```

Create admin user SQL if needed:

```bash
ADMIN_EMAIL=admin@example.com ADMIN_NAME=Admin ADMIN_PASSWORD='ChangeThisPassword' node scripts/bootstrap-admin.mjs
npx wrangler d1 execute <your-d1-name> --remote --file=./migrations/0003_bootstrap_admin.sql
```

The login endpoint primarily uses the `ADMIN_PASSWORD` Pages secret.

---

## Build locally

From repo root:

```bash
npm run build:storefront
npm run build:admin
npm run build:all
```

Per app:

```bash
cd apps/storefront
npm install
npm run build

cd apps/admin
npm install
npm run build
```

---

## Deploy manually

Storefront:

```bash
cd apps/storefront
npx wrangler pages deploy dist --project-name <storefront-pages-project> --branch main
```

Admin:

```bash
cd apps/admin
npx wrangler pages deploy dist --project-name <admin-pages-project> --branch main
```

---

## Cloudflare Pages Git settings

If connecting directly to GitHub:

### Storefront project

```txt
Root directory: apps/storefront
Build command: npm run build
Output directory: dist
```

### Admin project

```txt
Root directory: apps/admin
Build command: npm run build
Output directory: dist
```

If Cloudflare complains about `npm ci`, make sure the relevant root has a `package-lock.json`.

---

## R2 image strategy

This template uses `/api/r2?key=...` so the store works on `pages.dev` without custom CDN.

Admin upload APIs should save URLs like:

```txt
/api/r2?key=<encoded-r2-key>
```

Important cache-bust rule:

```txt
If URL already has ?key=, append &v=...
Do not append ?v=...
```

Correct:

```txt
/api/r2?key=products%2Fabc.webp&v=123
```

Wrong:

```txt
/api/r2?key=products%2Fabc.webp?v=123
```

---

## Hero/banner rules

Preferred current behavior:

```txt
Desktop frame: 1576 × 672 ratio
Mobile frame: 1024 × 1024 ratio
```

Rules:

- no fallback brand image
- no old SVG hero image
- no visible alt text
- skeleton behind image only
- skeleton must not block image paint
- image should appear as soon as browser can paint it

Do not hide the image behind React `imageLoaded` state unless absolutely necessary.

---

## Product card rules

- Skeleton should sit behind image.
- Product image must be visible as soon as browser paints it.
- Do not use bright gradient placeholders.
- Only show strikethrough original price if product has a real sale:

```txt
onSale/on_sale is true
salePrice/sale_price exists
salePrice < price
```

Non-sale products must never show a strikethrough price.

---

## PDF rules

PDFs should be:

- compact
- readable
- branded for the new store
- not huge
- generated only when user clicks PDF button

Current optimized rules:

- use compressed PDF output
- use only necessary font payload
- convert item images to small JPEG thumbnails before adding to PDF
- keep thumbnails around 96px max before inserting
- use variant image first, product image fallback

Do not insert full-size PNGs into PDFs. That makes PDFs huge.

---

## Performance principles

This template is fast because:

- Cloudflare Pages serves static assets globally
- Pages Functions serve APIs close to users
- D1 stores catalog/order data
- R2 stores images
- code is Vite-built
- route components are lazy-loaded
- cart drawer is lazy-loaded
- skeletons improve perceived loading without blocking images
- no WordPress/plugin overhead
- catalog APIs can be cached where safe

Do not add heavy client libraries unless needed.

---

## What AI agents must replace for a new store

At minimum:

- store brand name
- logo text
- meta title/description
- categories
- product names/descriptions/prices
- policy pages
- contact details
- homepage copy
- colors/theme
- product images
- hero/banner images
- admin title
- PDF brand name
- `wrangler.toml` resource IDs
- Pages project names

---

## Do not do these things

- Do not reuse another client’s D1/R2/KV.
- Do not leave placeholder content in final client store.
- Do not hardcode passwords.
- Do not commit tokens.
- Do not delete product rows that exist in orders.
- Do not claim something is fixed without testing live.
- Do not deploy from the wrong directory.
- Do not point Cloudflare Pages to repo root unless that is intended.
- Do not merge storefront and admin into one app unless explicitly requested.

---

## Verification checklist

Before final response, verify:

```txt
[ ] npm build passed for storefront
[ ] npm build passed for admin
[ ] storefront deployed
[ ] admin deployed
[ ] live storefront URL loads
[ ] live admin URL loads
[ ] live HTML has expected asset filenames
[ ] homepage API returns data
[ ] product catalog API returns products
[ ] product image GET works
[ ] admin login works
[ ] admin product images show
[ ] checkout creates order
[ ] track order finds order
[ ] order detail shows images
[ ] PDF download works and is not huge
[ ] no old template/placeholder/client clues remain
```

---

## Final response format for agents

Keep final report concise:

```txt
Done.

Live:
- storefront URL
- admin URL

Verified:
- build passed
- live URL loads
- admin login works
- images load
- checkout/order tested

Deployment:
- id

Commit:
- hash
```

Do not over-explain unless user asks.

---

## Extra helper files

```txt
.env.example                         Environment variable template
SETUP_CHECKLIST.md                   Step-by-step setup checklist
scripts/create-store.mjs             Quick brand/project rename helper
apps/admin/scripts/create-test-order.mjs  Generates SQL for a test order
docs/THEME_GUIDE.md                  Styling/theme instructions
docs/GITHUB_ACTIONS_TEMPLATE.yml     Optional workflow template
apps/storefront/public/placeholders  Neutral placeholder SVGs
```

---

## Recommended agent workflow: private ZIP download

For client work, the safest flow is to let the agent download this template as a ZIP, extract it into a new folder, remove git history, and push it as a new store repo.

Use:

```txt
docs/OPTION_B_DOWNLOAD_WORKFLOW.md
```

This avoids connecting client projects directly to the template repo and keeps each store independent.

Useful prompts are in:

```txt
docs/PROMPTS.md
```
