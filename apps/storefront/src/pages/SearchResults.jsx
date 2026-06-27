import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { SectionState } from '../components/SectionState';
import { StoreLoadingSpinner } from '../components/Skeletons';
import { usePageTitle } from '../hooks/usePageTitle';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  usePageTitle(query ? `Search: ${query}` : 'Search');

  useEffect(() => {
    setInputValue(query);
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError('');

    fetch(`/api/search?q=${encodeURIComponent(query)}&limit=20`, { headers: { accept: 'application/json' } })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setProducts(data.products || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Search failed');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      setSearchParams({ q: trimmed });
    }
  };

  const clearSearch = () => {
    setInputValue('');
    setSearchParams({});
  };

  return (
    <div className="flex-grow w-full bg-[#0a0a0a] min-h-screen">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-[850] text-white mb-6">Search Products</h1>

          <form onSubmit={handleSubmit} className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search products..."
              autoComplete="off"
              className="form-input w-full rounded-2xl border border-white/20 bg-[#1a1a1a] pl-12 pr-12 py-3.5 text-white outline-none transition focus:border-brand-pink focus:bg-[#222]"
            />
            {inputValue ? (
              <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </form>
        </div>

        {loading ? <StoreLoadingSpinner className="min-h-[30vh]" /> : null}

        {error ? (
          <SectionState message={error} tone="error" />
        ) : null}

        {!loading && !error && query && products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No results found for "{query}"</p>
            <p className="text-gray-500 mt-2">Try a different search term.</p>
          </div>
        ) : null}

        {!loading && !error && products.length > 0 ? (
          <>
            <p className="text-sm text-gray-400 mb-6">{products.length} result{products.length !== 1 ? 's' : ''} for "{query}"</p>
            <div className="store-product-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : null}

        {!query ? (
          <div className="text-center py-16">
            <p className="text-gray-400">Enter a search term to find products.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
