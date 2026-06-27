import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { AdminBreadcrumbs } from '../components/AdminBreadcrumbs';
import { get, post } from '../lib/api';

export function LoyaltyPage() {
  const [points, setPoints] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [pointsToAdd, setPointsToAdd] = useState('');
  const [reason, setReason] = useState('');

  const loadPoints = useCallback(async () => {
    try {
      const data = await get('/api/loyalty');
      setPoints(data.points || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => { loadPoints(); }, [loadPoints]);

  const addPoints = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await post('/api/loyalty', { phone: phone.trim(), points: Number(pointsToAdd), reason: reason.trim() || 'Manual adjustment' });
      setMessage('Points updated.');
      setPhone('');
      setPointsToAdd('');
      setReason('');
      await loadPoints();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-stack">
      <AdminBreadcrumbs items={[{ label: 'Loyalty' }]} />
      <PageHeader
        title="Loyalty Points"
        actions={
          <button className="icon-action-link" type="button" onClick={loadPoints} aria-label="Refresh" title="Refresh">
            <RefreshCw size={16} />
          </button>
        }
      />
      {error ? <div className="error-box">{error}</div> : null}
      {message ? <div className="success-box">{message}</div> : null}

      <form onSubmit={addPoints} className="panel form-card">
        <h2 className="panel-header" style={{ margin: 0 }}>Add / Adjust Points</h2>
        <label>Phone number <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03001234567" required /></label>
        <label>Points <input type="number" value={pointsToAdd} onChange={(e) => setPointsToAdd(e.target.value)} placeholder="e.g. 100 (use negative to deduct)" required /></label>
        <label>Reason <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. New signup bonus" /></label>
        <button className="button button-primary" type="submit"><Plus size={16} /> Update Points</button>
      </form>

      <section className="panel">
        <div className="panel-header"><h2>All Points</h2></div>
        <div className="table-wrap">
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Phone</th>
                <th>Points</th>
                <th>Last updated</th>
              </tr>
            </thead>
            <tbody>
              {points.length === 0 ? (
                <tr><td colSpan="3" className="empty-cell">No loyalty points yet.</td></tr>
              ) : points.map((p) => (
                <tr key={p.phone}>
                  <td data-label="Phone">{p.phone}</td>
                  <td data-label="Points"><strong>{p.points}</strong></td>
                  <td data-label="Updated">{p.updated_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}