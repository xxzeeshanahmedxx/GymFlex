import { ProductCard } from './ProductCard';

export function ProductGrid({ products }) {
  return (
    <div className="store-product-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-12">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
