import { useEffect, useState } from 'react';
import { CollectionPage } from '../components/CollectionPage';
import { usePageTitle } from '../hooks/usePageTitle';
import { fetchCatalog, fetchCategories } from '../lib/storefront-api';

export default function Sale() {
  usePageTitle('Sale');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const [nextProducts, nextCategories] = await Promise.all([
          fetchCatalog({ sale: true }),
          fetchCategories(),
        ]);
        if (!cancelled) {
          setProducts(nextProducts);
          setCategories(nextCategories);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || 'Failed to load sale products.');
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
      title="SALE"
      subtitle="Exclusive discounts on our finest pieces. Limited time only."
      products={products}
      categories={categories}
      showCategoryFilter
      loading={loading}
      error={error}
      emptyMessage="No sale products are available right now."
    />
  );
}
