import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { AdminBreadcrumbs } from '../components/AdminBreadcrumbs';
import { get } from '../lib/api';

export function AlertsPage() {
  const [tab, setTab] = useState('price');
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [p, s] = await Promise.all([get('/api/price-alerts'), get('/api/stock-alerts')]);
      setPriceAlerts(p.alerts || []);
      setStockAlerts(s.alerts || []);
    } catch (err) { setError(err.message); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const alerts = tab === 'price' ? priceAlerts : stockAlerts;

  return (
    <div className="page-stack">
      <AdminBreadcrumbs items={[{ label: 'Alerts' }]} />
      <PageHeader title="Alerts" actions={<button className="icon-action-link" onClick={load}><RefreshCw size={16} /></button>} />
      {error ? <div className="error-box">{error}</div> : null}
      <div className="panel tabs-bar" style={{ display: 'flex', gap: 8, padding: '0 0 12px', borderBottom: '1px solid var(--border)' }}>
        <button className={`button button-compact ${tab === 'price' ? 'button-primary' : 'button-secondary'}`} onClick={() => setTab('price')}>Price Alerts ({priceAlerts.length})</button>
        <button className={`button button-compact ${tab === 'stock' ? 'button-primary' : 'button-secondary'}`} onClick={() => setTab('stock')}>Stock Alerts ({stockAlerts.length})</button>
      </div>
      <section className="panel">
        <div className="table-wrap">
          <table className="responsive-table dense-table">
            <thead><tr><th>Email</th><th>{tab === 'price' ? 'Target Price' : 'Variant ID'}</th><th>Created</th></tr></thead>
            <tbody>
              {alerts.length === 0 ? <tr><td colSpan="3" className="empty-cell">No alerts.</td></tr>
                : alerts.map((a) => (
                  <tr key={a.id}>
                    <td data-label="Email">{a.email}</td>
                    <td data-label={tab === 'price' ? 'Target' : 'Variant'}>{tab === 'price' ? `Rs. ${a.target_price}` : a.variant_id}</td>
                    <td data-label="Created">{a.created_at}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}