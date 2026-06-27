import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, Ruler, Search, ShoppingBag, X, ChevronDown, Gift, Users, HelpCircle } from 'lucide-react';
import { useShop } from '../context/useShop';
import { fetchCategories, fetchHomepageSettings } from '../lib/storefront-api';

const FitFinderModal = lazy(() => import('./FitFinderModal'));

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
      {count > 0 ? <span key={count} className="store-cart-count badge-bounce">{count}</span> : null}
    </button>
  );
}

function MobileSidebarSubnav({ icon, label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mobile-sidebar-group">
      <button type="button" onClick={() => setOpen(!open)} className="mobile-sidebar-group-btn">
        {icon}{label}
        <ChevronDown className={`ml-auto w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? <div className="mobile-sidebar-subnav">{children}</div> : null}
    </div>
  );
}

export default function Navbar() {
  const { cartCount, wishlist, setIsCartOpen } = useShop();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navigation, setNavigation] = useState(fallbackNavigation);
  const [showFitFinder, setShowFitFinder] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <nav className={`sticky top-0 z-40 w-full bg-black/95 border-b border-brand-pink/20 font-sans transition-all duration-300 backdrop-blur-xl ${scrolled ? 'shadow-2xl shadow-black/40' : 'shadow-none'}`}>
        <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16 sm:h-20 pt-1 sm:pt-2 relative gap-0 sm:gap-2">
            <div className="flex items-center justify-start sm:hidden">
              <button onClick={() => setIsMobileMenuOpen(true)} className="mobile-menu-button flex items-center justify-center min-w-[44px] min-h-[44px] text-white hover:text-brand-pink transition-colors" aria-label="Open menu">
                <Menu className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center">
              <Link to="/" className="text-lg sm:text-2xl md:text-3xl font-heading font-[850] text-white tracking-widest hover:text-brand-pink transition-colors duration-300 truncate">GYMFLEX</Link>
            </div>

            <div className="flex justify-end items-center gap-1 sm:gap-3 lg:gap-5 safe-area-right">
              <Link to="/search" className="header-action-btn" aria-label="Search">
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <Link to="/wishlist" className="header-action-btn relative hidden sm:inline-flex" aria-label="Wishlist">
                <Heart key={wishlist.length} className={`heart-pulse w-5 h-5 sm:w-6 sm:h-6 ${wishlist.length > 0 ? 'text-brand-pink' : ''}`} />
                {wishlist.length > 0 ? <span key={wishlist.length} className="badge-bounce absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-brand-pink text-black text-[9px] font-bold px-1 leading-none">{wishlist.length}</span> : null}
              </Link>
              <div className="hidden sm:inline-flex">
                <CartButton count={cartCount} onClick={() => setIsCartOpen(true)} />
              </div>
            </div>
          </div>

          <div className="hidden sm:flex justify-center space-x-8 pb-4 mt-1">
            {navigation.map((item) => <NavigationLink key={item.to} item={item} />)}
            <button onClick={() => setShowFitFinder(true)} className={`${navLinkClassName} !text-brand-pink hover:!text-brand-coral`}>
              Find My Fit
              <span className={`${underlineClassName} !bg-brand-coral`}></span>
            </button>
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
            <span className="mobile-sidebar-section-label">Shop</span>
            {navigation.map((item) => <NavigationLink key={item.to} item={item} mobile onClick={() => setIsMobileMenuOpen(false)} />)}

            <Link to="/search" className="mobile-sidebar-link" onClick={() => setIsMobileMenuOpen(false)}>
              <Search size={16} className="mr-3" />Search
            </Link>
            <span className="mobile-sidebar-section-label">More</span>
            <MobileSidebarSubnav icon={<Gift size={16} />} label="Offers">
              <Link to="/sale" className="mobile-sidebar-sublink" onClick={() => setIsMobileMenuOpen(false)}>Sale</Link>
              <Link to="/refer" className="mobile-sidebar-sublink" onClick={() => setIsMobileMenuOpen(false)}>Refer a Friend</Link>
            </MobileSidebarSubnav>
            <MobileSidebarSubnav icon={<HelpCircle size={16} />} label="Help">
              <button onClick={() => { setShowFitFinder(true); setIsMobileMenuOpen(false); }} className="mobile-sidebar-sublink">Fit Finder</button>
              <Link to="/faq" className="mobile-sidebar-sublink" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
              <Link to="/community" className="mobile-sidebar-sublink" onClick={() => setIsMobileMenuOpen(false)}>Community</Link>
            </MobileSidebarSubnav>
            <Link to="/wishlist" className="mobile-sidebar-link" onClick={() => setIsMobileMenuOpen(false)}>
              <Heart size={16} className="mr-3" />Wishlist {wishlist.length > 0 ? `(${wishlist.length})` : ''}
            </Link>
          </nav>
        </aside>
      </div>
      {showFitFinder ? <Suspense fallback={null}><FitFinderModal onClose={() => setShowFitFinder(false)} /></Suspense> : null}
    </>
  );
}
