# Setup Checklist

## Before coding

- [ ] Choose store name
- [ ] Choose store slug
- [ ] Choose categories
- [ ] Collect product data
- [ ] Collect product images
- [ ] Decide pages.dev or custom domain

## Cloudflare

- [ ] Create D1 database
- [ ] Create KV namespace
- [ ] Create R2 bucket
- [ ] Create storefront Pages project
- [ ] Create admin Pages project
- [ ] Add D1/KV/R2 bindings to both projects
- [ ] Set `ADMIN_PASSWORD` secret on admin project

## Code

- [ ] Run `node scripts/create-store.mjs --name="Brand" --slug=brand`
- [ ] Update both `wrangler.toml` files
- [ ] Replace policy/contact/about content
- [ ] Replace theme colors/fonts
- [ ] Replace sample categories/products
- [ ] Replace PDF brand if needed

## Database

- [ ] Run schema migration
- [ ] Run site settings migration
- [ ] Seed categories/products
- [ ] Create admin user if needed

## Verify

- [ ] Storefront build passes
- [ ] Admin build passes
- [ ] Storefront deploy succeeds
- [ ] Admin deploy succeeds
- [ ] Storefront URL loads
- [ ] Admin login works
- [ ] Product images load
- [ ] Checkout creates order
- [ ] Track order works
- [ ] PDF download works and is lightweight
- [ ] No placeholder/client clues remain
