import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useShop } from '../context/useShop';
import { ProductCard } from '../components/ProductCard';
import { usePageTitle } from '../hooks/usePageTitle';

export default function WishlistPage() {
  const { wishlist } = useShop();
  usePageTitle('Wishlist');

  return (
    <main className="flex-grow px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-[96rem]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-heading font-[850] text-white uppercase tracking-widest">Your Wishlist</h1>
          <p className="mt-2 text-gray-400">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="mx-auto w-16 h-16 text-gray-600 mb-4" />
            <h2 className="text-xl font-heading font-[850] text-gray-400 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save items you love by tapping the heart icon.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-pink to-brand-coral px-6 py-3 text-sm font-bold uppercase tracking-widest text-black shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="store-product-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
