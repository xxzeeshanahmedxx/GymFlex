import { useEffect, useMemo, useState } from 'react';
import { Carousel } from './Carousel';
import { PageHero } from './PageHero';
import { ProductCard } from './ProductCard';
import { ProductGrid } from './ProductGrid';
import { SectionState } from './SectionState';
import { ProductGridSkeleton } from './Skeletons';
import { CatalogControls } from './CatalogControls';
import { filterProducts, sortProducts } from '../lib/catalog-filters';
import { useShop } from '../context/useShop';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-600 transition hover:border-brand-pink hover:text-brand-pink disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              page === currentPage
                ? 'bg-gradient-to-r from-brand-pink to-brand-coral text-white shadow'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-brand-pink hover:text-brand-pink'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-600 transition hover:border-brand-pink hover:text-brand-pink disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function CollectionPage({
  kicker,
  title,
  subtitle,
  products,
  loading = false,
  error = '',
  emptyMessage = 'No products found yet.',
  categories = [],
  showCategoryFilter = false,
  showSaleToggle = false,
  pageSize = 12,
}) {
  const { recentlyViewed } = useShop();
  const [sortBy, setSortBy] = useState('featured');
  const [category, setCategory] = useState('');
  const [saleOnly, setSaleOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(products, {
      category,
      saleOnly,
    });

    return sortProducts(filtered, sortBy);
  }, [products, category, saleOnly, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, category, saleOnly, products.length]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const hasActiveFilters = sortBy !== 'featured' || category || saleOnly;

  const resetFilters = () => {
    setSortBy('featured');
    setCategory('');
    setSaleOnly(false);
    setCurrentPage(1);
  };

  return (
    <div className="w-full flex-grow bg-white pb-10 sm:pb-20 animate-fade-in-up overflow-x-hidden">
      <PageHero kicker={kicker} title={title} subtitle={subtitle} />

      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!loading && !error ? (
          <CatalogControls
            sortBy={sortBy}
            onSortChange={setSortBy}
            category={category}
            onCategoryChange={setCategory}
            categories={categories}
            showCategoryFilter={showCategoryFilter}
            saleOnly={saleOnly}
            onSaleOnlyChange={setSaleOnly}
            showSaleToggle={showSaleToggle}
            onResetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        ) : null}

        {loading ? <ProductGridSkeleton count={8} /> : null}
        {!loading && error ? <SectionState message={error} tone="error" /> : null}
        {!loading && !error && filteredProducts.length === 0 ? <SectionState message={emptyMessage} /> : null}
        {!loading && !error && filteredProducts.length > 0 ? <ProductGrid products={paginatedProducts} /> : null}
        {!loading && !error && filteredProducts.length > 0 ? (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        ) : null}
      </div>

      {recentlyViewed.length >= 4 ? (
        <section className="reveal-section max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl text-gray-900 font-heading font-[850] capitalize tracking-wide">Recently Viewed</h2>
          </div>
          <ProductGrid products={recentlyViewed.slice(0, 4)} />
        </section>
      ) : null}
    </div>
  );
}
