import { useState } from 'react';
import { FolderKanban, LogOut, Package, Percent, RefreshCw, Settings, ShoppingBag } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/products', label: 'Products', icon: Package },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/categories', label: 'Categories', icon: FolderKanban },
  { to: '/discounts', label: 'Discounts', icon: Percent },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function AdminShell() {
  const { logout } = useAuth();
  const [purging, setPurging] = useState(false);

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
        <Outlet />
      </main>
    </div>
  );
}
