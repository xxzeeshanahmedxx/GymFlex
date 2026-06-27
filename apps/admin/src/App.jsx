import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminShell } from './components/AdminShell';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ConfirmProvider } from './components/ConfirmProvider';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { DiscountsPage } from './pages/DiscountsPage';
import { DiscountAnalyticsPage } from './pages/DiscountAnalyticsPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { LoyaltyPage } from './pages/LoyaltyPage';
import { TieredPricingPage } from './pages/TieredPricingPage';
import { ActivityLogPage } from './pages/ActivityLogPage';
import { ShippingRatesPage } from './pages/ShippingRatesPage';
import { BulkImportPage } from './pages/BulkImportPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { FaqPage } from './pages/FaqPage';
import { GiftCardsPage } from './pages/GiftCardsPage';
import { BundlesPage } from './pages/BundlesPage';
import { DashboardPage } from './pages/DashboardPage';
import { CommunityPhotosPage } from './pages/CommunityPhotosPage';

const ProductEditorPage = lazy(() => import('./pages/ProductEditorPage').then((module) => ({ default: module.ProductEditorPage })));
const OrdersPage = lazy(() => import('./pages/OrdersPage').then((module) => ({ default: module.OrdersPage })));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage').then((module) => ({ default: module.OrderDetailsPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage })));

function PageFallback() {
  return (
    <div className="page-stack">
      <section className="page-header"><div><h1 className="page-title">Loading</h1></div></section>
      <section className="panel skeleton-form-card"><div className="skeleton skeleton-field" /><div className="skeleton skeleton-field" /><div className="skeleton skeleton-textarea" /></section>
    </div>
  );
}

function LazyPage({ children }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>;
}

export default function App() {
  return (
    <ConfirmProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><AdminShell /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="products/new" element={<LazyPage><ProductEditorPage /></LazyPage>} />
          <Route path="products/:id" element={<LazyPage><ProductEditorPage /></LazyPage>} />
          <Route path="orders" element={<LazyPage><OrdersPage /></LazyPage>} />
          <Route path="orders/:id" element={<LazyPage><OrderDetailsPage /></LazyPage>} />
          <Route path="discounts" element={<LazyPage><DiscountsPage /></LazyPage>} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="discount-analytics" element={<LazyPage><DiscountAnalyticsPage /></LazyPage>} />
          <Route path="loyalty" element={<LazyPage><LoyaltyPage /></LazyPage>} />
          <Route path="tiered-pricing" element={<LazyPage><TieredPricingPage /></LazyPage>} />
          <Route path="activity-log" element={<LazyPage><ActivityLogPage /></LazyPage>} />
          <Route path="shipping-rates" element={<LazyPage><ShippingRatesPage /></LazyPage>} />
          <Route path="bulk-import" element={<LazyPage><BulkImportPage /></LazyPage>} />
          <Route path="maintenance" element={<LazyPage><MaintenancePage /></LazyPage>} />
          <Route path="dashboard" element={<LazyPage><DashboardPage /></LazyPage>} />
          <Route path="faq" element={<LazyPage><FaqPage /></LazyPage>} />
          <Route path="gift-cards" element={<LazyPage><GiftCardsPage /></LazyPage>} />
          <Route path="bundles" element={<LazyPage><BundlesPage /></LazyPage>} />
          <Route path="community-photos" element={<LazyPage><CommunityPhotosPage /></LazyPage>} />
          <Route path="settings" element={<LazyPage><SettingsPage /></LazyPage>} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ConfirmProvider>
  );
}
