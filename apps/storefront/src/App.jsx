import { lazy, Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import CompareBar from './components/CompareBar';
import ExitIntentPopup from './components/ExitIntentPopup';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import { useShop } from './context/useShop';
import { organizationSchema, websiteSchema } from './lib/schema';

const CartDrawer = lazy(() => import('./components/Drawers').then((module) => ({ default: module.CartDrawer })));

function CartDrawerMount() {
  const { isCartOpen } = useShop();
  if (!isCartOpen) return null;
  return (
    <Suspense fallback={null}>
      <CartDrawer />
    </Suspense>
  );
}

function SchemaScripts() {
  useEffect(() => {
    const org = document.createElement('script');
    org.type = 'application/ld+json';
    org.textContent = JSON.stringify(organizationSchema());
    document.head.appendChild(org);

    const site = document.createElement('script');
    site.type = 'application/ld+json';
    site.textContent = JSON.stringify(websiteSchema());
    document.head.appendChild(site);

    return () => {
      document.head.removeChild(org);
      document.head.removeChild(site);
    };
  }, []);
  return null;
}

function MaintenancePage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-32 animate-fade-in-up">
      <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-amber-500/10 text-amber-500">
        <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
      </div>
      <h1 className="text-3xl sm:text-4xl font-heading font-[850] text-white mb-4 uppercase tracking-widest">Under Maintenance</h1>
      <p className="text-gray-400 max-w-md mx-auto text-lg">We&apos;re currently undergoing scheduled maintenance. Please check back shortly!</p>
    </div>
  );
}

function App() {
  const { theme } = useShop();
  const [maintenance, setMaintenance] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/maintenance', { headers: { accept: 'application/json' } })
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setMaintenance(data); })
      .catch(() => { if (!cancelled) setMaintenance({ enabled: false }); });
    return () => { cancelled = true; };
  }, []);

  if (maintenance?.enabled) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] font-sans text-[#e5e5e5] flex flex-col overflow-x-hidden">
        <Navbar />
        <main className="flex-grow flex flex-col relative">
          <MaintenancePage />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-[#e5e5e5] flex flex-col overflow-x-hidden">
      <SchemaScripts />
      <Navbar />
      <main className="flex-grow flex flex-col relative has-bottom-nav">
        <Outlet />
      </main>
      <CartDrawerMount />
      <CompareBar />
      <ExitIntentPopup />
      <BottomNav />
      <Footer />
      <BackToTop />
    </div>
  );
}

export default App;
