export function ProductCardSkeleton() {
  return (
    <article className="skeleton-product-card" aria-hidden="true">
      <div className="skeleton skeleton-product-image" />
      <div className="skeleton skeleton-product-title" />
      <div className="skeleton skeleton-product-price" />
    </article>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="store-product-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-12" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => <ProductCardSkeleton key={index} />)}
    </div>
  );
}

export function HeroSkeleton() {
  return <div className="skeleton skeleton-hero" aria-hidden="true" />;
}

export function ProductDetailsSkeleton() {
  return (
    <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full" aria-hidden="true">
      <div className="product-detail-skeleton-grid">
        <div className="skeleton skeleton-product-detail-image" />
        <div className="skeleton-detail-stack">
          <div className="skeleton skeleton-line short" />
          <div className="skeleton skeleton-line title" />
          <div className="skeleton skeleton-line medium" />
          <div className="skeleton skeleton-copy" />
          <div className="skeleton skeleton-button" />
        </div>
      </div>
    </div>
  );
}

export function StoreLoadingSpinner({ className = '' }) {
  return (
    <div className={`store-loading-spinner-wrap ${className}`} role="status" aria-label="Loading">
      <div className="store-loading-spinner" />
    </div>
  );
}
