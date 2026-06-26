import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { get } from '../lib/api';

export function SubscribersPage() {
  const [subs, setSubs] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try { const d = await get('/api/subscribers'); setSubs(d.subscribers || []); } catch (err) { setError(err.message); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="page-stack">
      <PageHeader title="Newsletter Subscribers" actions={<button className="icon-action-link" onClick={load}><RefreshCw size={16} /></button>} />
      {error ? <div className="error-box">{error}</div> : null}
      <section className="panel">
        <div className="table-wrap">
          <table className="responsive-table dense-table">
            <thead><tr><th>Email</th><th>Subscribed</th></tr></thead>
            <tbody>
              {subs.length === 0 ? <tr><td colSpan="2" className="empty-cell">No subscribers yet.</td></tr>
                : subs.map((s) => (
                  <tr key={s.id}><td data-label="Email">{s.email}</td><td data-label="Date">{s.created_at}</td></tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}