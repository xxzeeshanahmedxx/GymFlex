export async function onRequestGet(context) {
  const [products, categories] = await Promise.all([
    context.env.STORE_DB.prepare("SELECT slug, updated_at FROM products WHERE is_active = 1").all(),
    context.env.STORE_DB.prepare("SELECT slug, updated_at FROM categories").all(),
  ]);
  const pages = ['', '/products', '/cart', '/comparisons', '/refer'];
  const urls = pages.map((p) => `<url><loc>https://gymflex-bg2.pages.dev${p}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
  urls.push(...(products.results || []).map((p) => `<url><loc>https://gymflex-bg2.pages.dev/products/${p.slug}</loc><lastmod>${(p.updated_at || '').split(' ')[0]}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`));
  urls.push(...(categories.results || []).map((c) => `<url><loc>https://gymflex-bg2.pages.dev/products?category=${c.slug}</loc><lastmod>${(c.updated_at || '').split(' ')[0]}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`));
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' } });
}