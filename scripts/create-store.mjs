#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, '').split('=');
  return [key, rest.join('=') || true];
}));

const storeName = String(args.name || '').trim();
const storeSlug = String(args.slug || storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')).trim();

if (!storeName || !storeSlug) {
  console.error('Usage: node scripts/create-store.mjs --name="Brand Name" --slug=brand-slug');
  process.exit(1);
}

const replacements = new Map([
  ['GymFlex', storeName],
  ['GYMFLEX', storeName.toUpperCase()],
  ['gymflex', storeSlug],
  ['gymflex_d1', `${storeSlug.replace(/-/g, '_')}_d1`],
  ['gymflex-r2', `${storeSlug}-r2`],
  ['gymflex-admin', `${storeSlug}-admin`],
]);

const textExtensions = new Set(['.js', '.jsx', '.json', '.toml', '.md', '.html', '.css', '.mjs', '.sql', '.txt', '.example', '.yml']);

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (['.git', 'node_modules', 'dist', '.wrangler'].includes(entry)) continue;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else {
      const ext = path.includes('.env.example') ? '.example' : path.slice(path.lastIndexOf('.'));
      if (!textExtensions.has(ext)) continue;
      let content = readFileSync(path, 'utf8');
      for (const [from, to] of replacements) content = content.split(from).join(to);
      writeFileSync(path, content);
    }
  }
}

walk(process.cwd());
console.log(`Prepared template for ${storeName} (${storeSlug}).`);
console.log('Next: update wrangler.toml IDs, create Cloudflare resources, seed D1, upload images, and deploy.');
