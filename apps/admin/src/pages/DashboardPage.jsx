import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { get } from '../lib/api';

export function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const loadStats = useCallback(async () => {
    try { setStats(await get('/api/dashboard')); } catch (err) { setError(err.message); }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Store overview</p>
        </div>
        <div className="page-header-actions">
          <button className="icon-action-link" onClick={loadStats} aria-label="Refresh"><RefreshCw size={16} /></button>
        </div>
      </div>
      {error ? <div className="error-box">{error}</div> : null}

      {!stats ? (
        <div className="stats-grid"><div className="stat-card skeleton"><div className="skeleton skeleton-line short" /><div className="skeleton skeleton-field" /></div><div className="stat-card skeleton"><div className="skeleton skeleton-line short" /><div className="skeleton skeleton-field" /></div><div className="stat-card skeleton"><div className="skeleton skeleton-line short" /><div className="skeleton skeleton-field" /></div></div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card"><span>Active Products</span><strong>{stats.activeProducts}</strong></div>
          <div className="stat-card"><span>Total Orders</span><strong>{stats.totalOrders}</strong></div>
          <div className="stat-card"><span>Revenue</span><strong>Rs. {stats.totalRevenue}</strong></div>
          <div className="stat-card"><span>Categories</span><strong>{stats.categories}</strong></div>
          <div className="stat-card"><span>Pending Orders</span><strong>{stats.pendingOrders}</strong></div>
          <div className="stat-card"><span>Newsletter Subscribers</span><strong>{stats.subscribers}</strong></div>
        </div>
      )}
    </div>
  );
}