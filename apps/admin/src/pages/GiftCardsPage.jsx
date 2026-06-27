import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { AdminBreadcrumbs } from '../components/AdminBreadcrumbs';
import { get, post } from '../lib/api';

export function GiftCardsPage() {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [newCode, setNewCode] = useState('');

  const loadCards = useCallback(async () => {
    try { const d = await get('/api/gift-cards'); setCards(d.cards || []); } catch (err) { setError(err.message); }
  }, []);

  useEffect(() => { loadCards(); }, [loadCards]);

  const createCard = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      const result = await post('/api/gift-cards', { balance: Number(balance), expires_at: expiresAt || null });
      setNewCode(result.code);
      setMessage(`Gift card created! Code: ${result.code}`);
      setBalance('');
      setExpiresAt('');
      await loadCards();
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="page-stack">
      <AdminBreadcrumbs items={[{ label: 'Gift Cards' }]} />
      <PageHeader title="Gift Cards" actions={<button className="icon-action-link" onClick={loadCards}><RefreshCw size={16} /></button>} />
      {error ? <div className="error-box">{error}</div> : null}
      {message ? <div className="success-box">{message}</div> : null}
      <form onSubmit={createCard} className="panel form-card">
        <h2 className="panel-header" style={{ margin: 0 }}>Create Gift Card</h2>
        <div className="field-grid two-column">
          <label>Initial Balance (Rs.) <input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} min="1" required /></label>
          <label>Expires At <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} /></label>
        </div>
        <button className="button button-compact button-primary" type="submit"><Plus size={14} /> Create Card</button>
      </form>
      <section className="panel">
        <div className="table-wrap">
          <table className="responsive-table dense-table">
            <thead><tr><th>Code</th><th>Balance</th><th>Initial</th><th>Active</th><th>Expires</th><th>Created</th></tr></thead>
            <tbody>
              {cards.length === 0 ? <tr><td colSpan="6" className="empty-cell">No gift cards yet.</td></tr>
                : cards.map((c) => (
                  <tr key={c.id}>
                    <td data-label="Code"><strong>{c.code}</strong></td>
                    <td data-label="Balance">Rs. {c.balance}</td>
                    <td data-label="Initial">Rs. {c.initial_balance}</td>
                    <td data-label="Active"><span className={`status-pill ${c.is_active ? 'status-active' : 'status-inactive'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td data-label="Expires">{c.expires_at || '—'}</td>
                    <td data-label="Created">{c.created_at}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}