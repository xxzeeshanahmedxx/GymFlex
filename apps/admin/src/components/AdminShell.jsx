import { useEffect, useState } from 'react';
import { BarChart3, Bell, Camera, Database, FileSpreadsheet, FolderKanban, Gift, HelpCircle, LogOut, Mail, MessageSquare, Moon, Package, Percent, RefreshCw, ScrollText, Settings, Shield, ShoppingBag, Star, Sun, TrendingUp } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/categories', label: 'Categories', icon: FolderKanban },
  { to: '/discounts', label: 'Discounts', icon: Percent },
  { to: '/discount-analytics', label: 'Discount Analytics', icon: TrendingUp },
  { to: '/reviews', label: 'Reviews', icon: MessageSquare },
  { to: '/tiered-pricing', label: 'Tiered Pricing', icon: Star },
  { to: '/loyalty', label: 'Loyalty', icon: Gift },
  { to: '/activity-log', label: 'Activity Log', icon: ScrollText },
  { to: '/shipping-rates', label: 'Shipping Rates', icon: Database },
  { to: '/bulk-import', label: 'Import/Export', icon: FileSpreadsheet },
  { to: '/faq', label: 'FAQ', icon: HelpCircle },
  { to: '/gift-cards', label: 'Gift Cards', icon: Gift },
  { to: '/bundles', label: 'Bundles', icon: FolderKanban },
  { to: '/subscribers', label: 'Subscribers', icon: Mail },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/community-photos', label: 'Community', icon: Camera },
  { to: '/maintenance', label: 'Maintenance', icon: Shield },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function AdminShell() {
  const { logout } = useAuth();
  const location = useLocation();
  const [purging, setPurging] = useState(false);
  const [adminTheme, setAdminTheme] = useState(() => localStorage.getItem('admin_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', adminTheme === 'light' ? 'light' : 'dark');
    try { localStorage.setItem('admin_theme', adminTheme); } catch { }
  }, [adminTheme]);

  const toggleAdminTheme = () => setAdminTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const purgeCache = async () => {
    setPurging(true);
    try {
      const response = await fetch('/api/purge-cache', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Purge failed');
      }
      window.alert('Cache purged.');
    } catch (purgeError) {
      window.alert(purgeError.message || 'Cache purge failed');
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="app-shell admin-app-shell">
      <aside className="app-sidebar" aria-label="Admin navigation">
        <div className="app-sidebar-brand">
          <span className="app-brand-mark" aria-hidden="true" />
          <div>
            <strong>GymFlex</strong>
            <small>Admin panel</small>
          </div>
        </div>

        <nav className="app-sidebar-nav">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="app-sidebar-actions">
          <button type="button" className="app-utility-button" onClick={toggleAdminTheme} title="Toggle theme">
            {adminTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{adminTheme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          <button type="button" className="app-utility-button" onClick={purgeCache} disabled={purging} title="Purge cache">
            <RefreshCw size={16} className={purging ? 'spin-icon' : ''} />
            <span>Cache</span>
          </button>
          <button type="button" className="app-utility-button" onClick={logout} title="Logout">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="app-main">
        <div key={location.key} className="page-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
