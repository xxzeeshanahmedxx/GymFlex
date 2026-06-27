import { Link } from 'react-router-dom';
import { Heart, Star, Clock, Timer } from 'lucide-react';
import { useShop } from '../context/useShop';
import { getEffectivePrice, getProductPath, getProductPrimaryImage } from '../lib/product-utils';
import CountdownTimer from './CountdownTimer';

function getSalePrice(product) {
  const value = product?.salePrice ?? product?.sale_price;
  return value == null || value === '' ? null : Number(value);
}

function isProductOnSale(product) {
  const salePrice = getSalePrice(product);
  const price = Number(product?.price || 0);
  return Boolean((product?.onSale ?? product?.on_sale) && salePrice != null && salePrice > 0 && salePrice < price);
}

export const ProductCard = ({ product }) => {
  const imageUrl = getProductPrimaryImage(product);
  const effectivePrice = getEffectivePrice(product);
  const productPath = getProductPath(product);
  const hasRealSale = isProductOnSale(product);
  const { toggleWishlist, isInWishlist } = useShop();
  const liked = isInWishlist(product.id);

  return (
    <article className="store-product-card group flex flex-col animate-fade-in-up">
      <div className="block relative" aria-label={product.name}>
        <Link to={productPath}>
          <div className="store-product-card-image w-full aspect-[9/10] rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-2xl group-hover:-translate-y-1.5 transition-all duration-500 relative overflow-hidden">
            {product.is_preorder ? (
              <span className="absolute top-3 left-3 z-20 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Clock size={10} /> Preorder
              </span>
            ) : hasRealSale ? (
              <span className="store-sale-badge sale-badge-pulse absolute top-3 left-3 z-20 bg-white text-brand-coral text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Timer size={10} />
                {product.sale_ends_at ? <CountdownTimer endTime={product.sale_ends_at} compact /> : 'Sale'}
              </span>
            ) : null}

            <button
              type="button"
              onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
              className="prod-card-action-btn absolute top-3 right-3 z-20 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
              aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart key={liked} className={`w-[18px] h-[18px] transition-colors ${liked ? 'fill-brand-pink text-brand-pink heart-pulse' : 'text-white'}`} />
            </button>

          <div className="product-card-image-skeleton" aria-hidden="true" />
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover product-card-loaded-image"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/8 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"></div>
        </div>
        </Link>
      </div>

      <Link to={productPath} className="store-product-card-info mt-4 sm:mt-5 flex flex-1 flex-col items-center text-center px-2">
        <h3 className="store-product-card-title text-base sm:text-lg md:text-xl text-gray-900 font-heading font-[850] leading-tight uppercase tracking-wide">
          {product.name}
        </h3>

        {product.avg_rating > 0 ? (
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={12} className={star <= Math.round(product.avg_rating) ? 'fill-brand-pink text-brand-pink' : 'text-white/20'} />
              ))}
            </div>
            <span className="text-[11px] text-gray-500">({product.review_count})</span>
          </div>
        ) : null}

        <div className="store-product-card-price flex flex-wrap justify-center items-center gap-2.5 mt-auto pt-3">
          {hasRealSale ? (
            <>
              <p className="store-sale-price text-xl sm:text-2xl font-bold text-brand-coral font-sans">Rs. {effectivePrice}</p>
              <p className="store-original-price text-base sm:text-lg text-gray-400 line-through font-sans">Rs. {product.price}</p>
            </>
          ) : (
            <p className="store-regular-price text-xl sm:text-2xl font-bold text-gray-900 font-sans">Rs. {effectivePrice}</p>
          )}
        </div>
      </Link>
    </article>
  );
};
