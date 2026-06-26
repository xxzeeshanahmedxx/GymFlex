import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CollectionPage } from '../components/CollectionPage';
import { usePageTitle } from '../hooks/usePageTitle';
import { fetchCatalog, fetchCategories } from '../lib/storefront-api';

export default function Category() {
  const { slug } = useParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const category = useMemo(
    () => categories.find((item) => item.slug === slug),
    [categories, slug],
  );

  usePageTitle(category ? category.name : 'Collection');

  useEffect(() => {
    let cancelled = false;

    async function loadCategoryPage() {
      try {
        const nextCategories = await fetchCategories();
        if (cancelled) {
          return;
        }

        setCategories(nextCategories);

        const matchedCategory = nextCategories.find((item) => item.slug === slug);
        if (!matchedCategory) {
          setProducts([]);
          return;
        }

        const nextProducts = await fetchCatalog({ category: slug });
        if (!cancelled) {
          setProducts(nextProducts);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || 'Failed to load collection.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCategoryPage();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!loading && !error && !category) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-32 animate-fade-in-up">
        <h1 className="text-3xl font-heading font-[850] text-gray-900 mb-3 uppercase tracking-widest">Category not found</h1>
        <Link to="/shop" className="text-brand-pink font-bold uppercase tracking-widest hover:text-brand-coral transition-colors">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <CollectionPage
      kicker="Collection"
      title={category?.name || 'Collection'}
      subtitle={category?.description || ''}
      products={products}
      loading={loading}
      error={error}
      emptyMessage="No products are available in this collection right now."
    />
  );
}
