import { normalizeApiProduct } from './product-utils';

async function fetchJson(path) {
  const response = await fetch(path);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export async function fetchCategories() {
  const data = await fetchJson('/api/categories');
  return data.categories || [];
}

export async function fetchCatalog(options = {}) {
  const searchParams = new URLSearchParams();

  if (options.category) {
    searchParams.set('category', options.category);
  }

  if (options.featured) {
    searchParams.set('featured', '1');
  }

  if (options.sale) {
    searchParams.set('sale', '1');
  }

  if (options.limit) {
    searchParams.set('limit', String(options.limit));
  }

  const query = searchParams.toString();
  const data = await fetchJson(`/api/product-catalog${query ? `?${query}` : ''}`);
  return (data.products || []).map((product) => normalizeApiProduct(product));
}

export async function fetchProductById(id) {
  const data = await fetchJson(`/api/product?id=${encodeURIComponent(id)}`);
  return normalizeApiProduct(data.product, data.variants || [], data.images || [], data.lookProducts || []);
}

export async function fetchHomepageSettings() {
  const data = await fetchJson('/api/site-settings');
  return data.homepage;
}

export async function fetchHomepageBundle() {
  return fetchJson('/api/homepage');
}
