import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Carousel } from '../components/Carousel';
import { SectionState } from '../components/SectionState';
import { ProductGridSkeleton } from '../components/Skeletons';
import { useShop } from '../context/useShop';
import { usePageTitle } from '../hooks/usePageTitle';
import { fetchHomepageBundle } from '../lib/storefront-api';
import { getEffectivePrice, getProductPath, getProductPrimaryImage } from '../lib/product-utils';

function SectionHeading({ eyebrow, title }) {
  return (
    <div className="home-section-heading text-center mb-8">
      {eyebrow ? <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-pink block mb-1">{eyebrow}</span> : null}
      <h2 className="text-3xl sm:text-5xl md:text-6xl text-gray-900 font-heading font-[850] capitalize tracking-wide">{title}</h2>
    </div>
  );
}

const sectionWidthClassName = 'max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8';
const staticHeroBanner = globalThis.__STORE_TEMPLATE_HERO__ || {
  animation: 'fade',
  animationDuration: 100,
  slideDuration: 5000,
  desktopImages: ['', '', ''],
  mobileImages: ['', '', ''],
};
const defaultHomepage = {
  heroButtonText: 'Shop All Collection',
  heroButtonLink: '/shop',
  featuredProductId: 'h4',
  featuredEyebrow: 'Our Top Picks',
  featuredTitle: 'Featured & Bestsellers',
  collectionKicker: 'COLLECTION',
  recentTitle: 'Recently Viewed',
  heroBanner: staticHeroBanner,
};

function getHeroSlots(homepage) {
  const heroBanner = homepage.heroBanner || defaultHomepage.heroBanner;
  const desktopImages = (Array.isArray(heroBanner.desktopImages) ? heroBanner.desktopImages : []).filter(Boolean);
  const mobileImages = (Array.isArray(heroBanner.mobileImages) ? heroBanner.mobileImages : []).filter(Boolean);
  const count = Math.max(desktopImages.length, mobileImages.length);

  return Array.from({ length: count }, (_, index) => ({
    desktop: desktopImages[index] || desktopImages[0] || mobileImages[index] || mobileImages[0],
    mobile: mobileImages[index] || mobileImages[0] || desktopImages[index] || desktopImages[0],
  })).filter((item) => item.desktop || item.mobile);
}

function HeroImageBanner({ homepage }) {
  const slides = useMemo(() => getHeroSlots(homepage), [homepage]);
  const heroBanner = homepage.heroBanner || defaultHomepage.heroBanner;
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = slides[activeIndex] || slides[0] || {};
  const imageKey = `${activeIndex}-${slide.desktop || ''}-${slide.mobile || ''}`;

  useEffect(() => { setActiveIndex(0); }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, Number(heroBanner.slideDuration || 4500));
    return () => window.clearInterval(interval);
  }, [heroBanner.slideDuration, slides.length]);

  if (slides.length === 0) {
    return (
      <section className="hero-banner-section">
        <div className="hero-banner-frame">
          <div className="hero-banner-skeleton" aria-hidden="true" />
        </div>
      </section>
    );
  }

  const animation = heroBanner.animation || 'fade';
  const animationDuration = Number(heroBanner.animationDuration || 600);

  return (
    <section className="hero-banner-section">
      <Link to={homepage.heroButtonLink || '/shop'} className="hero-banner-frame" aria-label={homepage.heroButtonText || 'Shop collection'}>
        <div className="hero-banner-skeleton" aria-hidden="true" />
        <picture className="hero-banner-picture">
          {slide.mobile ? <source media="(max-width: 639px)" srcSet={slide.mobile} /> : null}
          <img
            key={imageKey}
            src={slide.desktop || slide.mobile}
            alt=""
            fetchPriority="high"
            decoding="async"
            className={`hero-banner-image hero-animation-${animation}`}
            style={{ '--hero-animation-duration': `${animationDuration}ms` }}
          />
        </picture>
      </Link>
    </section>
  );
}

function CollectionSection({ category, products, index, collectionKicker }) {
  return (
    <div className="reveal-section w-full py-10 sm:py-12 border-b border-gray-200 animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className={sectionWidthClassName}>
        <div className="home-collection-heading flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 border-b border-gray-100 pb-3 gap-2">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">{collectionKicker}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-gray-900 font-heading font-[850] capitalize tracking-wide">{category.name}</h2>
          </div>
        </div>

        {products.length > 0 ? (
          <>
            <Carousel maxItems={6} centerThreshold={4} itemWidth="home-carousel-item w-[58%] sm:w-[46%] lg:w-[22.5%]">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </Carousel>
            <div className="store-view-all-row">
              <Link to={`/collections/${category.slug}`} className="store-view-all-link">
                View all <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
              </Link>
            </div>
          </>
        ) : <SectionState message="No products in this collection yet." />}
      </div>
    </div>
  );
}

export default function Home() {
  usePageTitle();

  const { recentlyViewed } = useShop();
  const [homepage, setHomepage] = useState(defaultHomepage);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [collectionProducts, setCollectionProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const featuredProduct = useMemo(() => {
    const configured = featuredProducts.find((product) => product.id === homepage.featuredProductId);
    return configured || featuredProducts.find((product) => getProductPrimaryImage(product)) || featuredProducts[0] || null;
  }, [featuredProducts, homepage.featuredProductId]);
  const featuredProductImage = getProductPrimaryImage(featuredProduct);

  useEffect(() => {
    let cancelled = false;

    async function loadHomePage() {
      try {
        const data = await fetchHomepageBundle();
        if (cancelled) return;

        setHomepage({ ...defaultHomepage, ...(data.homepage || {}) });
        setCategories(data.categories || []);
        setFeaturedProducts(data.featuredProducts || []);
        setSaleProducts(data.saleProducts || []);
        setBestsellerProducts(data.bestsellerProducts || []);
        setCollectionProducts(data.collectionProducts || {});
      } catch (loadError) {
        if (!cancelled) setError(loadError.message || 'Failed to load the storefront.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const scheduleLoad = () => loadHomePage();
    let idleId = null;
    let timeoutId = null;
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(scheduleLoad, { timeout: 900 });
    } else {
      timeoutId = window.setTimeout(scheduleLoad, 120);
    }
    return () => {
      cancelled = true;
      if (idleId != null && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      if (timeoutId != null) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="home-storefront flex flex-col min-h-screen bg-white">
      <HeroImageBanner homepage={homepage} />

      <div className="reveal-section w-full py-10 sm:py-12 border-b border-gray-200">
        <div className={sectionWidthClassName}>
          <SectionHeading eyebrow={homepage.featuredEyebrow} title={homepage.featuredTitle} />
          {loading ? <ProductGridSkeleton count={4} /> : null}
          {!loading && error ? <SectionState message={error} tone="error" /> : null}
          {!loading && !error && featuredProducts.length > 0 ? (
            <Carousel maxItems={4} centerThreshold={4} itemWidth="home-carousel-item w-[58%] sm:w-[46%] lg:w-[22.5%]">
              {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </Carousel>
          ) : null}
          {!loading && !error && featuredProducts.length === 0 ? <SectionState message="Featured products will appear here soon." /> : null}
        </div>
      </div>

      {!loading && !error && bestsellerProducts.length > 0 ? (
        <div className={`${sectionWidthClassName} reveal-section py-10 sm:py-12 w-full animate-fade-in-up border-b border-gray-200`}>
          <SectionHeading eyebrow="Trending now" title="Best Sellers" />
          <Carousel maxItems={6} centerThreshold={4} itemWidth="home-carousel-item w-[58%] sm:w-[46%] lg:w-[22.5%]">
            {bestsellerProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </Carousel>
        </div>
      ) : null}

      {!loading && !error ? categories.map((category, index) => (
        <CollectionSection
          key={category.slug}
          category={category}
          index={index}
          products={collectionProducts[category.slug] || []}
          collectionKicker={homepage.collectionKicker}
        />
      )) : null}

      {featuredProduct ? (
        <div className="reveal-section relative bg-brand-pink/40 py-12 sm:py-16 overflow-hidden border-b border-brand-pink/20">
          <div className={sectionWidthClassName}>
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
              <div className="relative z-10 mb-8 lg:mb-0 animate-fade-in-up">
                <Link to={getProductPath(featuredProduct)} className="featured-product-image-card block w-full max-w-sm mx-auto aspect-square rounded-2xl bg-gradient-to-tr from-brand-pink to-brand-coral shadow-xl overflow-hidden relative group">
                  <span className="featured-product-image-label">Featured Product</span>
                  {featuredProductImage ? <img src={featuredProductImage} alt={featuredProduct.name} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" /> : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"></div>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                  {!featuredProductImage ? <span className="relative z-10 h-full flex items-center justify-center text-white font-heading font-[850] text-2xl sm:text-3xl tracking-widest uppercase animate-float drop-shadow-md">Bestseller</span> : null}
                </Link>
              </div>
              <div className="relative z-10 text-center sm:text-left animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                <h2 className="featured-product-title text-3xl sm:text-4xl md:text-5xl font-heading font-[850] text-white mb-4 leading-tight">{featuredProduct.name}</h2>
                <p className="featured-product-desc text-sm sm:text-lg text-white font-sans mb-6 leading-relaxed max-w-lg mx-auto sm:mx-0">{featuredProduct.description}</p>
                <Link to={getProductPath(featuredProduct)} className="featured-product-cta inline-flex w-full sm:w-auto justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-brand-pink to-brand-coral text-white text-sm sm:text-base font-bold uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center">
                  Only Rs. {getEffectivePrice(featuredProduct)}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {!loading && !error && saleProducts.length > 0 ? (
        <div className={`${sectionWidthClassName} reveal-section py-10 sm:py-12 w-full animate-fade-in-up border-b border-gray-200`}>
          <SectionHeading eyebrow="Limited deals" title="On Sale" />
          <Carousel maxItems={6} centerThreshold={4} itemWidth="home-carousel-item w-[58%] sm:w-[46%] lg:w-[22.5%]">
            {saleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </Carousel>
          <div className="store-view-all-row">
            <Link to="/sale" className="store-view-all-link">
              View all deals <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
            </Link>
          </div>
        </div>
      ) : null}

      {recentlyViewed.length >= 4 ? (
        <div className={`${sectionWidthClassName} reveal-section py-10 sm:py-12 w-full animate-fade-in-up border-b border-gray-200`}>
          <SectionHeading title={homepage.recentTitle} />
          <Carousel maxItems={4} centerThreshold={4}>
            {recentlyViewed.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}
          </Carousel>
        </div>
      ) : null}
    </div>
  );
}
