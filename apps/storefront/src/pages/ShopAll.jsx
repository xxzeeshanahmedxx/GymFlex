import { useEffect, useState } from 'react';
import { CollectionPage } from '../components/CollectionPage';
import { usePageTitle } from '../hooks/usePageTitle';
import { fetchCatalog } from '../lib/storefront-api';

export default function ShopAll() {
  usePageTitle('Shop All');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const nextProducts = await fetchCatalog();
        if (!cancelled) {
          setProducts(nextProducts);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || 'Failed to load products.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <CollectionPage
      title="SHOP ALL"
      subtitle="Explore our complete collection of premium accessories and organizers."
      products={products}
      loading={loading}
      error={error}
      emptyMessage="No products are available right now."
    />
  );
}
