import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bell, ChevronRight, Clock, RotateCcw, ShieldCheck, ShoppingCart, Sparkles, Truck } from 'lucide-react';
import { Carousel } from '../components/Carousel';
import { ProductCard } from '../components/ProductCard';
import { SectionState } from '../components/SectionState';
import { ProductDetailsSkeleton } from '../components/Skeletons';
import ShareButton from '../components/ShareButton';
import SizeGuideModal from '../components/SizeGuideModal';
import { StarRatingDisplay, StarRatingInput } from '../components/StarRating';
import CountdownTimer from '../components/CountdownTimer';
import TryOnModal from '../components/TryOnModal';
import { useShop } from '../context/useShop';
import { usePageTitle } from '../hooks/usePageTitle';
import { fetchCatalog, fetchProductById } from '../lib/storefront-api';
import { getEffectivePrice, getProductCategoryName, getProductCategorySlug, getProductPrimaryImage } from '../lib/product-utils';
import { productSchema } from '../lib/schema';

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
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const imgRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <div
        ref={imgRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        className="w-full max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-brand-pink to-brand-coral flex flex-col items-center justify-center relative animate-fade-in-up shadow-[0_25px_50px_-12px_rgba(44,35,31,0.22)] overflow-hidden group cursor-crosshair"
      >
        <div className="product-card-image-skeleton" aria-hidden="true" />
        {imageUrl ? (
          <>
            <img src={imageUrl} alt={product.name} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover product-card-loaded-image" />
            {showZoom && imageUrl ? (
              <div
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: '200%',
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
              />
            ) : null}
          </>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>

        {product.onSale ? (
          <span className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-white text-brand-coral text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-md uppercase tracking-widest shadow-lg z-30">
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
                className={`relative w-[72px] sm:w-[78px] aspect-square overflow-hidden rounded-2xl border-2 transition-all duration-200 ${isSelected ? 'border-brand-pink shadow-md ring-1 ring-brand-pink/30 scale-105' : 'border-gray-200 hover:border-brand-pink/40'}`}
              >
                <img src={thumbnailUrl} alt={image.altText || image.alt_text || product.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                {isSelected ? <span className="absolute bottom-1 right-1 w-4 h-4 bg-brand-pink rounded-full flex items-center justify-center shadow-sm"><span className="text-black text-[8px] font-bold">&#10003;</span></span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function BulkPricingTable({ product }) {
  const [tiers, setTiers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/tiered-pricing?productId=${product.id}`, { headers: { accept: 'application/json' } })
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setTiers(data.tiers || []); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [product.id]);

  if (tiers.length === 0) return null;

  return (
    <div className="mt-6 pt-4 border-t border-white/10">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Bulk Pricing</p>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5">
              <th className="px-3 py-2 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Quantity</th>
              <th className="px-3 py-2 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Discount</th>
              <th className="px-3 py-2 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Unit Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tiers.map((tier) => {
              const basePrice = getEffectivePrice(product);
              const discountedPrice = Math.round(basePrice * (1 - tier.discount_percent / 100));
              return (
                <tr key={tier.id} className="hover:bg-white/5">
                  <td className="px-3 py-2 text-white font-bold">{tier.min_quantity}+</td>
                  <td className="px-3 py-2 text-brand-pink font-bold">{tier.discount_percent}% off</td>
                  <td className="px-3 py-2 text-right text-white font-bold">Rs. {discountedPrice}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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

function ReviewsSection({ product }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/reviews?productId=${product.id}`, { headers: { accept: 'application/json' } })
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setReviews(data.reviews || []); })
      .catch(() => { if (!cancelled) setReviews([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [product.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    if (!formTitle.trim() && !formBody.trim()) {
      setSubmitError('Please provide a title or review text.');
      setSubmitting(false);
      return;
    }
    if (formTitle.trim() && formTitle.trim().length < 3) {
      setSubmitError('Title must be at least 3 characters.');
      setSubmitting(false);
      return;
    }
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ productId: product.id, rating: formRating, title: formTitle, body: formBody, authorName: formAuthor || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');
      setSubmitSuccess(true);
      setFormTitle('');
      setFormBody('');
      setFormAuthor('');
      setShowForm(false);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = product.avg_rating || 0;
  const reviewCount = product.review_count || reviews.length;

  return (
    <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full border-t border-white/10 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-heading font-[850] text-white">Reviews</h2>
          {reviewCount > 0 ? (
            <div className="flex items-center gap-2 mt-1">
              <StarRatingDisplay rating={Math.round(avgRating)} />
              <span className="text-sm text-gray-400">{avgRating} · {reviewCount} review{reviewCount !== 1 ? 's' : ''}</span>
            </div>
          ) : null}
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-xl bg-brand-pink text-black text-sm font-bold uppercase tracking-widest hover:bg-brand-green-dark transition-colors">
          {showForm ? 'Cancel' : 'Write a review'}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 space-y-4">
          <div>
            <p className="text-sm font-bold text-gray-400 mb-2">Your rating</p>
            <StarRatingInput rating={formRating} onChange={setFormRating} />
          </div>
          <label className="text-sm font-bold text-gray-400">
            Title (optional)
            <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full mt-1 rounded-xl border border-white/20 bg-[#111] px-4 py-2.5 text-white outline-none focus:border-brand-pink" placeholder="Great product!" />
          </label>
          <label className="text-sm font-bold text-gray-400">
            Review (optional)
            <textarea value={formBody} onChange={(e) => setFormBody(e.target.value)} rows="3" className="w-full mt-1 rounded-xl border border-white/20 bg-[#111] px-4 py-2.5 text-white outline-none focus:border-brand-pink" placeholder="Share your experience..." />
          </label>
          <label className="text-sm font-bold text-gray-400">
            Your name (optional)
            <input value={formAuthor} onChange={(e) => setFormAuthor(e.target.value)} className="w-full mt-1 rounded-xl border border-white/20 bg-[#111] px-4 py-2.5 text-white outline-none focus:border-brand-pink" placeholder="Anonymous" />
          </label>
          {submitError ? <div className="text-red-400 text-sm">{submitError}</div> : null}
          {submitSuccess ? <div className="text-green-400 text-sm">Review submitted! It will appear after approval.</div> : null}
          <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-xl bg-brand-pink text-black text-sm font-bold uppercase tracking-widest hover:bg-brand-green-dark transition-colors disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit review'}
          </button>
        </form>
      ) : null}

      {loading ? <div className="text-gray-400 text-sm">Loading reviews...</div> : null}

      {!loading && reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first!</p>
      ) : null}

      {!loading && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StarRatingDisplay rating={review.rating} size={14} />
                  <span className="font-bold text-white text-sm">{review.author_name}</span>
                </div>
                <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              {review.title ? <h4 className="font-bold text-white mb-1">{review.title}</h4> : null}
              {review.body ? <p className="text-sm text-gray-400">{review.body}</p> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MobileAddToCart({ isOutOfStock, selectedVariant, quantity, product }) {
  const { addToCart } = useShop();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 500;
      setVisible(scrollY > threshold);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 sm:hidden ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="flex items-center gap-3 max-w-md mx-auto">
        <QuantitySelector quantity={quantity} onDecrease={() => {}} onIncrease={() => {}} />
        <button
          onClick={() => !isOutOfStock && selectedVariant && addToCart(product, selectedVariant, quantity)}
          disabled={isOutOfStock}
          className="flex-1 h-11 rounded-xl bg-gradient-to-r from-brand-pink to-brand-coral text-white text-sm font-bold uppercase tracking-widest disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4 inline mr-2" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

function ProductDetailsContent({ product, relatedProducts = [] }) {
  const { addToCart, recentlyViewed, addRecentlyViewed } = useShop();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] ?? null);
  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);

  const selectedStock = selectedVariant?.stock ?? 0;
  const isOutOfStock = selectedStock === 0;

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

            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl tracking-tight text-gray-900 font-heading font-[850] mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 shrink-0">
                <ShareButton title={product.name} text={product.description} />
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 mb-2">
              <PriceBlock product={product} />
            </div>

            {product.on_sale && product.sale_ends_at ? (
              <div className="mb-6">
                <CountdownTimer endTime={product.sale_ends_at} />
              </div>
            ) : null}

            <p className="mb-8 text-base sm:text-lg text-gray-600 font-sans leading-relaxed">
              {product.description}
            </p>

            {product.avg_rating > 0 ? (
              <div className="flex items-center gap-2 mb-4">
                <StarRatingDisplay rating={Math.round(product.avg_rating)} />
                <span className="text-sm text-gray-400">{product.avg_rating} ({product.review_count})</span>
              </div>
            ) : null}

            {product.video_url ? (
              <div className="mb-6 aspect-video rounded-2xl overflow-hidden">
                <iframe src={product.video_url} title="Product video" className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
              </div>
            ) : null}

            {product.variants.length > 0 ? (
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  {product.variants[0]?.type || 'Option'}
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    const isColorType = (product.variants[0]?.type || '').toLowerCase() === 'color';

                    if (isColorType) {
                      const colorHex = variant.name.toLowerCase().replace(/\s+/g, '');
                      const colorMap = { black:'#0d0d0d', white:'#ffffff', red:'#ef4444', blue:'#3b82f6', green:'#22c55e', yellow:'#eab308', pink:'#ec4899', purple:'#a855f7', orange:'#f97316', brown:'#92400e', gray:'#6b7280', grey:'#6b7280', navy:'#1e3a5f', teal:'#14b8a6', coral:'#f97316', beige:'#f5f5dc', cream:'#fef3c7', khaki:'#b9a384', olive:'#808000', maroon:'#800000', burgundy:'#800020', charcoal:'#36454f', silver:'#c0c0c0', gold:'#ffd700', bronze:'#cd7f32', turquoise:'#40e0d0', indigo:'#4b0082', violet:'#8b5cf6', rose:'#f43f5e', mint:'#98fb98', lavender:'#e6e6fa', tan:'#d2b48c' };
                      const bg = colorMap[colorHex] || colorHex;

                      return (
                        <button
                          key={variant.id}
                          onClick={() => {
                            setSelectedVariant(variant);
                            const nextImage = imageForVariant(product, variant);
                            if (nextImage) setSelectedImage(nextImage);
                          }}
                          className={`relative rounded-full transition-all duration-200 ${
                            isSelected ? 'ring-2 ring-brand-pink ring-offset-2 scale-110' : 'hover:scale-110'
                          }`}
                          title={variant.name}
                        >
                          <span className="block w-9 h-9 rounded-full border border-white/20" style={{ background: bg }} />
                          {isSelected ? <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color: bg === '#ffffff' || bg === '#f5f5dc' || bg === '#fef3c7' || bg === '#e6e6fa' || bg === '#c0c0c0' || bg === '#ffd700' || bg === '#98fb98' || bg === '#d2b48c' ? '#0d0d0d' : '#ffffff' }}>&#10003;</span> : null}
                        </button>
                      );
                    }

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

            <div className="flex flex-wrap gap-4 mb-4">
              <button onClick={() => setShowSizeGuide(true)} className="text-xs text-brand-pink hover:underline font-bold uppercase tracking-widest">Size Guide</button>
              <button onClick={() => setShowTryOn(true)} className="text-xs text-amber-400 hover:underline font-bold uppercase tracking-widest inline-flex items-center gap-1"><Sparkles size={12} /> Virtual Try-On</button>
            </div>

            {isOutOfStock ? (
              <p className="text-red-400 font-bold text-sm mb-2">Out of Stock</p>
            ) : selectedStock > 0 && selectedStock <= 5 ? (
              <p className="text-amber-400 font-bold text-sm mb-2">Only {selectedStock} left</p>
            ) : null}

            {product.is_preorder && product.preorder_release_date ? (
              <p className="flex items-center gap-1.5 text-amber-400 font-bold text-sm mb-2">
                <Clock size={14} /> Preorder — Releases {new Date(product.preorder_release_date).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3 mb-4">
              {selectedVariant ? (
                <button type="button" onClick={() => { const email = prompt('Enter your email to be notified when back in stock:'); if (email) fetch('/api/stock-alert', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, variantId: selectedVariant.id }) }).then(() => alert('Stock alert set!')).catch(() => alert('Failed')); }} className="text-xs text-amber-400 hover:underline inline-flex items-center gap-1 font-bold uppercase tracking-widest">
                  <Bell size={12} /> Notify when in stock
                </button>
              ) : null}
              <button type="button" onClick={() => { const email = prompt('Enter your email for a price alert:'); if (email) fetch('/api/price-alert', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, productId: product.id, targetPrice: Number(getEffectivePrice(product)) }) }).then(() => alert('Price alert set!')).catch(() => alert('Failed')); }} className="text-xs text-brand-pink hover:underline inline-flex items-center gap-1 font-bold uppercase tracking-widest">
                <Bell size={12} /> Price Alert
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto,auto] sm:items-center">
              <QuantitySelector
                quantity={quantity}
                onDecrease={() => setQuantity((currentValue) => Math.max(1, currentValue - 1))}
                onIncrease={() => setQuantity((currentValue) => currentValue + 1)}
              />

              <button
                onClick={() => !isOutOfStock && selectedVariant && addToCart(product, selectedVariant, quantity)}
                disabled={isOutOfStock}
                className="add-to-cart-button h-[52px] w-full sm:w-64 bg-gradient-to-r from-brand-pink to-brand-coral text-white rounded-xl flex items-center justify-center text-sm sm:text-base font-bold transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 font-sans uppercase tracking-widest px-5 sm:px-7 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500 font-sans flex items-center gap-1.5">
              <Truck size={12} /> Est. delivery: 3–5 business days
            </div>

            <MobileAddToCart isOutOfStock={isOutOfStock} selectedVariant={selectedVariant} quantity={quantity} product={product} />

            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-gray-600 font-sans">
              <TrustItem icon={Truck} text="Ships across Pakistan" />
              <TrustItem icon={ShieldCheck} text="Cash on Delivery" />
              <TrustItem icon={RotateCcw} text="30-day returns" />
            </div>

            <BulkPricingTable product={product} />
          </div>
        </div>
      </div>

      {product.lookProducts?.length > 0 ? (
        <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full border-t border-white/10">
          <h2 className="text-2xl font-heading font-[850] text-white mb-6 text-center">Complete the Look</h2>
          <Carousel maxItems={4} centerThreshold={4}>
            {product.lookProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </Carousel>
        </div>
      ) : null}

      {showSizeGuide ? <SizeGuideModal category={product.categorySlug} onClose={() => setShowSizeGuide(false)} /> : null}
      {showTryOn ? <TryOnModal product={product} onClose={() => setShowTryOn(false)} /> : null}

      <ReviewsSection product={product} />

      {(recentlyViewedProducts.length >= 2) || relatedProducts.length > 0 ? (
        <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-fade-in-up border-t border-gray-100 mt-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl text-gray-900 font-heading font-[850] capitalize tracking-wide">
              {recentlyViewedProducts.length >= 2 ? 'Recently Viewed' : 'You may also like'}
            </h2>
          </div>
          <Carousel maxItems={8} centerThreshold={4}>
            {(recentlyViewedProducts.length >= 2 ? recentlyViewedProducts.slice(0, 8) : relatedProducts.slice(0, 8)).map((item) => (
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

  usePageTitle(product ? (product.meta_title || product.name) : 'Product', product?.meta_description || product?.description);

  useEffect(() => {
    if (!product) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(productSchema(product));
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [product]);

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
