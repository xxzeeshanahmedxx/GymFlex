import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { get } from '../lib/api';

export function DiscountAnalyticsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try { setData(await get('/api/discount-analytics')); } catch (err) { setError(err.message); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="page-stack">
      <PageHeader title="Discount Analytics" actions={<button className="icon-action-link" onClick={load}><RefreshCw size={16} /></button>} />
      {error ? <div className="error-box">{error}</div> : null}
      {data ? (
        <>
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="stat-card"><span>Coupons Used</span><strong>{data.summary.total_used}</strong></div>
            <div className="stat-card"><span>Total Discounted</span><strong>Rs. {data.summary.total_saved}</strong></div>
            <div className="stat-card"><span>Active Coupons</span><strong>{data.usage.filter((d) => d.is_active).length}</strong></div>
          </div>
          <section className="panel">
            <h2 className="panel-header">All Coupons</h2>
            <div className="table-wrap">
              <table className="responsive-table dense-table">
                <thead><tr><th>Code</th><th>Discount</th><th>Used</th><th>Total Discounted</th><th>Active</th><th>Expires</th></tr></thead>
                <tbody>
                  {data.usage.map((d) => (
                    <tr key={d.id}>
                      <td data-label="Code"><strong>{d.code}</strong></td>
                      <td data-label="Discount">{d.discount_percent}%</td>
                      <td data-label="Used">{d.usage_count}</td>
                      <td data-label="Total">Rs. {d.total_discount}</td>
                      <td data-label="Active"><span className={`status-pill ${d.is_active ? 'status-active' : 'status-inactive'}`}>{d.is_active ? 'Active' : 'Inactive'}</span></td>
                      <td data-label="Expires">{d.expires_at || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : <div className="panel"><div className="skeleton skeleton-field" /><div className="skeleton skeleton-field" /></div>}
    </div>
  );
}