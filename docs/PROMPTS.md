# Prompts for AI Agents

These prompts are designed for agents that do not know any previous client/project history. Use the template as a neutral base only.

---

## Prompt 1 — Start a new store from private ZIP template

```txt
You are building a new ecommerce store from a private template repo.

Do not assume any existing client resources.
Do not reuse any old D1, KV, R2, Pages project, repo, domain, or content.
Do not look for previous store/project names.
Use only ZERO_TEMPLATE as the base.

First read:
- README.md
- docs/AGENT_GUIDE.md
- SETUP_CHECKLIST.md
- docs/OPTION_B_DOWNLOAD_WORKFLOW.md

Then ask me only the required setup questions:
1. Store name
2. Store slug
3. Product niche
4. Categories
5. Product count
6. Product images available or placeholders
7. Brand style/colors/fonts
8. Admin password
9. pages.dev or custom domain
10. Order method: COD, WhatsApp, gateway, or manual checkout
11. Shipping fee/free shipping rule
12. Who owns GitHub/Cloudflare resources: me or client

After I answer:
- download the private ZERO_TEMPLATE zip using my template token
- extract it into a new folder
- remove any old git state
- create a new GitHub repo for this store
- run scripts/create-store.mjs
- update brand/content/policies/theme
- create fresh Cloudflare D1/KV/R2 resources
- update wrangler.toml in storefront and admin
- run migrations
- seed categories/products
- upload images to R2
- set ADMIN_PASSWORD secret
- deploy storefront and admin
- verify live URLs and APIs
- test admin login
- test product images
- test checkout/order flow
- test track order
- test order PDF
- commit and push

Do not say done unless live verification passes.
If anything fails, say exactly what failed and what is needed.
```

---

## Prompt 2 — Rebrand an extracted template

```txt
This folder is a freshly extracted copy of ZERO_TEMPLATE.

Your job is to turn it into a real branded store.

Rules:
- Replace all placeholder store names and content.
- Replace categories/products/policies/contact details.
- Update PDF brand name.
- Update admin title/login branding.
- Keep binding names as STORE_DB, STORE_KV, STORE_BUCKET in code.
- Only update real resource IDs/names in wrangler.toml.
- Keep storefront and admin as separate apps.
- Do not add an edit panel unless asked.
- Keep image skeletons non-blocking.
- Keep PDF images compressed.
- Keep mobile footer/buttons compact.

Build and verify both apps before final response.
```

---

## Prompt 3 — Cloudflare setup and deploy

```txt
Create a fresh Cloudflare setup for this store.

Use these names:
- D1: <store_slug>_d1
- KV: <store_slug>_kv
- R2: <store_slug>-r2
- Pages storefront: <store_slug>
- Pages admin: <store_slug>-admin

Then:
- update apps/storefront/wrangler.toml
- update apps/admin/wrangler.toml
- run D1 migrations
- set ADMIN_PASSWORD on admin Pages project
- deploy storefront
- deploy admin
- verify live storefront URL
- verify live admin URL
- verify /api/homepage
- verify /api/product-catalog?limit=2
- verify /api/r2 image GET if images exist
- verify admin login
```

---

## Prompt 4 — Final verification

```txt
Verify this store is ready.

Check:
- Git status is clean
- storefront build passed
- admin build passed
- storefront live URL returns HTTP 200
- admin live URL returns HTTP 200
- /api/homepage returns JSON
- /api/product-catalog?limit=2 returns JSON
- product images load through GET
- admin login works
- checkout creates order
- track order finds order
- order detail shows images
- PDF downloads and is not huge
- no placeholder content remains
- no old project/client clues remain

Return a short report with URLs, deployment IDs, commit hash, and any issues.
```
