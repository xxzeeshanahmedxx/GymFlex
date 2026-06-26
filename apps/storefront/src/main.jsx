import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import { ShopProvider } from './context/ShopContext';
import ScrollToTop from './components/ScrollToTop';
import { StoreLoadingSpinner } from './components/Skeletons';

import '@fontsource-variable/figtree';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/700.css';
import './index.css';

const ShopAll = lazy(() => import('./pages/ShopAll'));
const Category = lazy(() => import('./pages/Category'));
const Sale = lazy(() => import('./pages/Sale'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Checkout = lazy(() => import('./pages/Checkout'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const NotFound = lazy(() => import('./pages/NotFound'));
const FAQ = lazy(() => import('./pages/InfoPages').then((module) => ({ default: module.FAQ })));
const About = lazy(() => import('./pages/InfoPages').then((module) => ({ default: module.About })));
const Contact = lazy(() => import('./pages/InfoPages').then((module) => ({ default: module.Contact })));
const Terms = lazy(() => import('./pages/InfoPages').then((module) => ({ default: module.Terms })));

function RouteFallback() {
  return <StoreLoadingSpinner className="min-h-[55vh]" />;
}

function LazyRoute({ children }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

if (typeof window !== 'undefined') {
  const prefetchRoutes = () => {
    import('./pages/ShopAll');
    import('./pages/ProductDetails');
    import('./pages/Checkout');
  };
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(prefetchRoutes, { timeout: 2500 });
  } else {
    window.setTimeout(prefetchRoutes, 1800);
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <ShopProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<LazyRoute><ShopAll /></LazyRoute>} />
            <Route path="collections/:slug" element={<LazyRoute><Category /></LazyRoute>} />
            <Route path="sale" element={<LazyRoute><Sale /></LazyRoute>} />
            <Route path="product/:id" element={<LazyRoute><ProductDetails /></LazyRoute>} />
            <Route path="checkout" element={<LazyRoute><Checkout /></LazyRoute>} />
            <Route path="track-order" element={<LazyRoute><TrackOrder /></LazyRoute>} />
            <Route path="faq" element={<LazyRoute><FAQ /></LazyRoute>} />
            <Route path="about" element={<LazyRoute><About /></LazyRoute>} />
            <Route path="contact" element={<LazyRoute><Contact /></LazyRoute>} />
            <Route path="terms" element={<LazyRoute><Terms /></LazyRoute>} />
            <Route path="*" element={<LazyRoute><NotFound /></LazyRoute>} />
          </Route>
        </Routes>
      </ShopProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
