import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, ShoppingBag, X } from 'lucide-react';
import { useShop } from '../context/useShop';
import { fetchCategories, fetchHomepageSettings } from '../lib/storefront-api';

const fallbackNavigation = [
  { label: 'Shop All', to: '/shop' },
  { label: "Men's", to: '/collections/mens' },
  { label: 'Sale', to: '/sale', highlight: true },
];

const navLinkClassName = 'relative text-white text-sm font-bold tracking-widest uppercase hover:text-brand-pink transition-colors py-2 group block w-full text-center sm:inline-block sm:w-auto sm:text-left';
const underlineClassName = 'absolute bottom-0 left-0 w-full h-[2px] bg-brand-pink transform scale-x-0 origin-bottom-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-bottom-left';

function buildNavigation(categories, settings) {
  const slugs = Array.isArray(settings?.headerCollectionSlugs) ? settings.headerCollectionSlugs.filter(Boolean) : [];
  const categoryLinks = slugs
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter(Boolean)
    .map((category) => ({ label: category.name, to: `/collections/${category.slug}` }));
  if (categoryLinks.length === 0) return fallbackNavigation;
  return [{ label: 'Shop All', to: '/shop' }, ...categoryLinks, { label: 'Sale', to: '/sale', highlight: true }];
}

function NavigationLink({ item, onClick, mobile = false }) {
  const className = item.highlight ? `${navLinkClassName} !text-brand-pink hover:!text-brand-coral` : navLinkClassName;
  return (
    <Link onClick={onClick} to={item.to} className={mobile ? 'mobile-sidebar-link' : className}>
      {item.label}
      {!mobile ? <span className={item.highlight ? `${underlineClassName} !bg-brand-coral` : underlineClassName}></span> : null}
    </Link>
  );
}

function CartButton({ count, onClick }) {
  return (
    <button onClick={onClick} className="store-cart-button text-white relative transition-colors duration-300 hover:text-brand-pink" aria-label="Open cart">
      <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
      {count > 0 ? <span className="store-cart-count">{count}</span> : null}
    </button>
  );
}

export default function Navbar() {
  const { cartCount, wishlist, setIsCartOpen } = useShop();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navigation, setNavigation] = useState(fallbackNavigation);

  useEffect(() => {
    let cancelled = false;
    async function loadNavigation() {
      try {
        const [categories, settings] = await Promise.all([fetchCategories(), fetchHomepageSettings()]);
        if (!cancelled) setNavigation(buildNavigation(categories, settings));
      } catch {
        if (!cancelled) setNavigation(fallbackNavigation);
      }
    }
    loadNavigation();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-black/95 border-b border-brand-pink/20 shadow-sm font-sans transition-colors duration-300 backdrop-blur-xl">
        <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20 pt-1 sm:pt-2 relative">
            <div className="w-1/4 sm:w-1/3 flex items-center justify-start sm:hidden">
              <button onClick={() => setIsMobileMenuOpen(true)} className="mobile-menu-button p-2 text-white hover:text-brand-pink transition-colors" aria-label="Open menu">
                <Menu className="w-6 h-6" />
              </button>
            </div>

            <div className="hidden sm:block sm:w-1/3"></div>

            <div className="w-2/4 sm:w-1/3 flex justify-center">
              <Link to="/" className="text-2xl sm:text-3xl md:text-4xl font-heading font-[850] text-white tracking-widest hover:text-brand-pink transition-colors duration-300 text-center whitespace-nowrap">GYMFLEX</Link>
            </div>

            <div className="w-1/4 sm:w-1/3 flex justify-end items-center space-x-3 sm:space-x-6 pr-0 sm:pr-8">
              <Link to="/wishlist" className="text-white hover:text-brand-pink transition-colors relative" aria-label="Wishlist">
                <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${wishlist.length > 0 ? 'text-brand-pink' : ''}`} />
                {wishlist.length > 0 ? <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-brand-pink text-black text-[9px] font-bold px-1 leading-none">{wishlist.length}</span> : null}
              </Link>
              <CartButton count={cartCount} onClick={() => setIsCartOpen(true)} />
            </div>
          </div>

          <div className="hidden sm:flex justify-center space-x-8 pb-4 mt-1">
            {navigation.map((item) => <NavigationLink key={item.to} item={item} />)}
          </div>
        </div>
      </nav>

      <div className={`mobile-sidebar-layer ${isMobileMenuOpen ? 'open' : ''}`} aria-hidden={!isMobileMenuOpen}>
        <button className="mobile-sidebar-backdrop" type="button" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" />
        <aside className="mobile-sidebar-panel" aria-label="Mobile navigation">
          <div className="mobile-sidebar-head">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>GymFlex</Link>
            <button type="button" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu"><X size={20} /></button>
          </div>
          <nav className="mobile-sidebar-nav">
            {navigation.map((item) => <NavigationLink key={item.to} item={item} mobile onClick={() => setIsMobileMenuOpen(false)} />)}
          </nav>
        </aside>
      </div>
    </>
  );
}
