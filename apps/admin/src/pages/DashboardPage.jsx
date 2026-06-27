import { useCallback, useEffect, useState } from 'react';
import { DollarSign, FolderKanban, Mail, Package, RefreshCw, ShoppingBag, Clock } from 'lucide-react';
import { get } from '../lib/api';

const statConfig = [
  { key: 'activeProducts', label: 'Active Products', icon: Package, color: '#3b82f6' },
  { key: 'totalOrders', label: 'Total Orders', icon: ShoppingBag, color: '#22c55e' },
  { key: 'totalRevenue', label: 'Revenue', icon: DollarSign, color: '#f59e0b', prefix: 'Rs. ' },
  { key: 'categories', label: 'Categories', icon: FolderKanban, color: '#a855f7' },
  { key: 'pendingOrders', label: 'Pending Orders', icon: Clock, color: '#ef4444' },
  { key: 'subscribers', label: 'Newsletter Subscribers', icon: Mail, color: '#ec4899' },
];

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

      {error ? null : !stats ? (
        <div className="stats-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="stat-card stat-card-skeleton"><div className="skeleton skeleton-line short" /><div className="skeleton skeleton-field" /></div>
          ))}
        </div>
      ) : (
        <div className="stats-grid">
          {statConfig.map(({ key, label, icon: Icon, color, prefix }) => (
            <div key={key} className="stat-card">
              <div className="stat-card-icon-wrap" style={{ background: `${color}18`, color }}>
                <Icon size={18} />
              </div>
              <span>{label}</span>
              <strong>{prefix || ''}{stats[key]}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}