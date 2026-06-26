import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, RotateCcw, ShieldCheck, ShoppingCart, Truck } from 'lucide-react';
import { Carousel } from '../components/Carousel';
import { ProductCard } from '../components/ProductCard';
import { SectionState } from '../components/SectionState';
import { ProductDetailsSkeleton } from '../components/Skeletons';
import { useShop } from '../context/useShop';
import { usePageTitle } from '../hooks/usePageTitle';
import { fetchCatalog, fetchProductById } from '../lib/storefront-api';
import { getEffectivePrice, getProductCategoryName, getProductCategorySlug, getProductPrimaryImage } from '../lib/product-utils';

function Breadcrumbs({ product }) {
  const categorySlug = getProductCategorySlug(product);

  return (
    <nav className="flex items-center text-xs sm:text-sm font-sans text-gray-400 mb-8 flex-wrap" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-brand-pink transition-colors">Home</Link>
      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1" />
      <Link to={`/collections/${categorySlug}`} className="hover:text-brand-pink transition-colors capitalize">
        {categorySlug.replace(/-/g, ' ')}
      </Link>
      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1" />
      <span className="text-gray-700 font-bold truncate">{product.name}</span>
    </nav>
  );
}

function ProductVisual({ product, selectedImage, onSelectImage }) {
  const imageUrl = selectedImage?.cdnUrl || selectedImage?.cdn_url || getProductPrimaryImage(product);
  const galleryImages = product.images || [];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-brand-pink to-brand-coral flex flex-col items-center justify-center relative animate-fade-in-up shadow-[0_25px_50px_-12px_rgba(44,35,31,0.22)] overflow-hidden group">
        <div className="product-card-image-skeleton" aria-hidden="true" />
        {imageUrl ? <img src={imageUrl} alt={product.name} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover product-card-loaded-image" /> : null}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {product.onSale ? (
          <span className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-white text-brand-coral text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-md uppercase tracking-widest shadow-lg z-10">
            Sale
          </span>
        ) : null}

        {!imageUrl ? (
          <span className="text-white font-heading font-[850] text-xl sm:text-2xl opacity-80 uppercase tracking-widest text-center px-6">
            {getProductCategoryName(product).split(' ')[0]}
          </span>
        ) : null}
      </div>

      {galleryImages.length > 1 ? (
        <div className="mt-4 relative z-10 flex flex-wrap justify-center gap-3 w-full max-w-md">
          {galleryImages.map((image) => {
            const thumbnailUrl = image.cdnUrl || image.cdn_url;
            const isSelected = (selectedImage?.id || '') === image.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => onSelectImage(image)}
                className={`w-[72px] sm:w-[78px] aspect-square overflow-hidden rounded-2xl border-2 transition ${isSelected ? 'border-brand-pink shadow-md' : 'border-gray-200 hover:border-brand-pink/40'}`}
              >
                <img src={thumbnailUrl} alt={image.altText || image.alt_text || product.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function PriceBlock({ product }) {
  const effectivePrice = getEffectivePrice(product);
  const salePrice = product?.salePrice ?? product?.sale_price;
  const hasRealSale = Boolean((product?.onSale ?? product?.on_sale) && salePrice != null && Number(salePrice) > 0 && Number(salePrice) < Number(product.price || 0));

  if (!hasRealSale) {
    return <p className="text-3xl sm:text-4xl text-gray-900 font-sans font-bold">Rs. {effectivePrice}</p>;
  }

  return (
    <>
      <p className="store-sale-price text-3xl sm:text-4xl text-brand-coral font-sans font-bold">Rs. {effectivePrice}</p>
      <p className="store-original-price text-xl sm:text-2xl text-gray-400 line-through font-sans">Rs. {product.price}</p>
    </>
  );
}

function QuantitySelector({ quantity, onDecrease, onIncrease }) {
  return (
    <div className="inline-flex w-fit items-center justify-center border-2 border-gray-200 rounded-xl font-sans bg-white h-11 sm:h-12">
      <button onClick={onDecrease} className="px-3 sm:px-4 h-full text-gray-600 hover:bg-brand-pink/5 hover:text-brand-pink transition-colors rounded-l-xl" aria-label="Decrease quantity">
        -
      </button>
      <span className="h-full flex w-10 sm:w-12 items-center justify-center font-bold text-base text-center">{quantity}</span>
      <button onClick={onIncrease} className="px-3 sm:px-4 h-full text-gray-600 hover:bg-brand-pink/5 hover:text-brand-pink transition-colors rounded-r-xl" aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}


function imageForVariant(product, variant) {
  const imageUrl = variant?.imageUrl || variant?.image_url || '';
  if (!imageUrl) return null;
  return product.images?.find((image) => (image.cdnUrl || image.cdn_url) === imageUrl) || {
    id: `variant-${variant.id}`,
    cdnUrl: imageUrl,
    cdn_url: imageUrl,
    altText: variant.name,
    alt_text: variant.name,
  };
}

function TrustItem({ icon: Icon, text }) {
  return (
    <p className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-brand-pink shrink-0" />
      {text}
    </p>
  );
}

function ProductDetailsContent({ product, relatedProducts = [] }) {
  const { addToCart, recentlyViewed, addRecentlyViewed } = useShop();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] ?? null);
  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const firstVariant = product.variants[0] ?? null;
    setSelectedVariant(firstVariant);
    setSelectedImage(imageForVariant(product, firstVariant) || product.images?.find((image) => image.isPrimary || image.is_primary) || product.images?.[0] || null);
    setQuantity(1);
    addRecentlyViewed(product);
  }, [product, addRecentlyViewed]);

  const recentlyViewedProducts = recentlyViewed.filter((item) => item.id !== product.id);
  return (
    <div className="flex-grow w-full bg-white pb-10">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Breadcrumbs product={product} />

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16 items-start">
          <div className="w-full flex justify-center mb-8 lg:mb-0">
            <ProductVisual product={product} selectedImage={selectedImage} onSelectImage={setSelectedImage} />
          </div>

          <div className="text-left animate-fade-in-up flex flex-col" style={{ animationDelay: '0.15s' }}>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-pink block mb-2">
              {getProductCategoryName(product)}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl tracking-tight text-gray-900 font-heading font-[850] mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 sm:gap-4 mb-6">
              <PriceBlock product={product} />
            </div>

            <p className="mb-8 text-base sm:text-lg text-gray-600 font-sans leading-relaxed">
              {product.description}
            </p>

            {product.variants.length > 0 ? (
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  {product.variants[0]?.type || 'Option'}
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;

                    return (
                      <button
                        key={variant.id}
                        onClick={() => {
                          setSelectedVariant(variant);
                          const nextImage = imageForVariant(product, variant);
                          if (nextImage) setSelectedImage(nextImage);
                        }}
                        className={`border-2 rounded-xl py-2 px-4 sm:px-5 flex items-center justify-center text-xs sm:text-sm font-bold uppercase font-sans transition-all duration-300 ${
                          isSelected
                            ? 'border-brand-pink text-brand-pink bg-brand-pink/5 shadow-sm'
                            : 'border-gray-200 text-gray-600 bg-white hover:border-brand-pink/40 hover:text-brand-pink hover:bg-brand-pink/5'
                        }`}
                      >
                        {variant.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto,auto] sm:items-center">
              <QuantitySelector
                quantity={quantity}
                onDecrease={() => setQuantity((currentValue) => Math.max(1, currentValue - 1))}
                onIncrease={() => setQuantity((currentValue) => currentValue + 1)}
              />

              <button
                onClick={() => selectedVariant && addToCart(product, selectedVariant, quantity)}
                className="add-to-cart-button h-[52px] w-full sm:w-64 bg-gradient-to-r from-brand-pink to-brand-coral text-white rounded-xl flex items-center justify-center text-sm sm:text-base font-bold transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 font-sans uppercase tracking-widest px-5 sm:px-7"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                Add to Cart
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-gray-600 font-sans">
              <TrustItem icon={Truck} text="Ships across Pakistan" />
              <TrustItem icon={ShieldCheck} text="Cash on Delivery" />
              <TrustItem icon={RotateCcw} text="30-day returns" />
            </div>
          </div>
        </div>
      </div>

      {(recentlyViewed.length >= 4 && recentlyViewedProducts.length > 0) || relatedProducts.length > 0 ? (
        <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-fade-in-up border-t border-gray-100 mt-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl text-gray-900 font-heading font-[850] capitalize tracking-wide">
              {recentlyViewed.length >= 4 && recentlyViewedProducts.length > 0 ? 'Recently Viewed' : 'You may also like'}
            </h2>
          </div>
          <Carousel maxItems={4} centerThreshold={4}>
            {(recentlyViewed.length >= 4 && recentlyViewedProducts.length > 0 ? recentlyViewedProducts : relatedProducts).slice(0, 4).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </Carousel>
        </div>
      ) : null}
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);

  usePageTitle(product ? product.name : 'Product', product?.description);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      try {
        const nextProduct = await fetchProductById(id);
        const categorySlug = getProductCategorySlug(nextProduct);
        const related = categorySlug ? await fetchCatalog({ category: categorySlug, limit: 5 }) : [];
        if (!cancelled) {
          setProduct(nextProduct);
          setRelatedProducts(related.filter((item) => item.id !== nextProduct.id).slice(0, 4));
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || 'Failed to load product.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-32 animate-fade-in-up">
        <h1 className="text-3xl font-heading font-[850] text-gray-900 mb-3 uppercase tracking-widest">Product not found</h1>
        <p className="text-gray-500 mb-8">{error || "We couldn't find the item you were looking for."}</p>
        <Link to="/shop" className="px-8 py-4 bg-gradient-to-r from-brand-pink to-brand-coral text-white font-bold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          Back to Shop
        </Link>
      </div>
    );
  }

  return <ProductDetailsContent key={product.id} product={product} relatedProducts={relatedProducts} />;
}
