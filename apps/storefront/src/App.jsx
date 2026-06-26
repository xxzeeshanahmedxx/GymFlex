import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import { useShop } from './context/useShop';

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

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-grow flex flex-col relative">
        <Outlet />
      </main>
      <CartDrawerMount />
      <Footer />
      <BackToTop />
    </div>
  );
}

export default App;
