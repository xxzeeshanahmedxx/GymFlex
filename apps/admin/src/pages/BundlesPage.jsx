import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { del, get, post } from '../lib/api';

export function BundlesPage() {
  const [bundles, setBundles] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const loadBundles = useCallback(async () => {
    try { const d = await get('/api/bundles'); setBundles(d.bundles || []); } catch (err) { setError(err.message); }
  }, []);

  useEffect(() => { loadBundles(); }, [loadBundles]);

  const createBundle = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      await post('/api/bundles', { name, description, price: Number(price), product_ids: [] });
      setMessage('Bundle created.');
      setName(''); setDescription(''); setPrice('');
      await loadBundles();
    } catch (err) { setError(err.message); }
  };

  const deleteBundle = async (id) => {
    if (!window.confirm('Delete this bundle?')) return;
    try { await del(`/api/bundles?id=${id}`); setMessage('Bundle deleted.'); await loadBundles(); } catch (err) { setError(err.message); }
  };

  return (
    <div className="page-stack">
      <PageHeader title="Product Bundles" actions={<button className="icon-action-link" onClick={loadBundles}><RefreshCw size={16} /></button>} />
      {error ? <div className="error-box">{error}</div> : null}
      {message ? <div className="success-box">{message}</div> : null}
      <form onSubmit={createBundle} className="panel form-card">
        <h2 className="panel-header" style={{ margin: 0 }}>Create Bundle</h2>
        <label>Name <input value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label>Description <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} /></label>
        <label>Price <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="1" required /></label>
        <button className="button button-compact button-primary" type="submit"><Plus size={14} /> Create Bundle</button>
      </form>
      <section className="panel">
        <div className="table-wrap">
          <table className="responsive-table dense-table">
            <thead><tr><th>Name</th><th>Price</th><th>Active</th><th>Products</th><th className="icon-column" /></tr></thead>
            <tbody>
              {bundles.length === 0 ? <tr><td colSpan="5" className="empty-cell">No bundles yet.</td></tr>
                : bundles.map((b) => (
                  <tr key={b.id}>
                    <td data-label="Name"><strong>{b.name}</strong></td>
                    <td data-label="Price">Rs. {b.price}</td>
                    <td data-label="Active"><span className={`status-pill ${b.is_active ? 'status-active' : 'status-inactive'}`}>{b.is_active ? 'Yes' : 'No'}</span></td>
                    <td data-label="Products">{b.product_ids || '—'}</td>
                    <td className="icon-column actions-cell">
                      <button className="icon-action-link icon-action-danger" onClick={() => deleteBundle(b.id)}><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}