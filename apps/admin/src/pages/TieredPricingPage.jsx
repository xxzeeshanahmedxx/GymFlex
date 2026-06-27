import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw, Save, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useConfirm } from '../components/ConfirmProvider';
import { del, get, post, put } from '../lib/api';

export function TieredPricingPage() {
  const confirm = useConfirm();
  const [productId, setProductId] = useState('');
  const [tiers, setTiers] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [minQty, setMinQty] = useState('');
  const [discPct, setDiscPct] = useState('');
  const [editingId, setEditingId] = useState(null);

  const loadTiers = useCallback(async () => {
    if (!productId.trim()) { setTiers([]); return; }
    try {
      const data = await get(`/api/tiered-pricing?productId=${encodeURIComponent(productId.trim())}`);
      setTiers(data.tiers || []);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, [productId]);

  const addTier = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await post('/api/tiered-pricing', { product_id: productId.trim(), min_quantity: Number(minQty), discount_percent: Number(discPct) });
      setMinQty('');
      setDiscPct('');
      setMessage('Tier added.');
      await loadTiers();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateTier = async (id) => {
    setError('');
    setMessage('');
    try {
      await put(`/api/tiered-pricing?id=${id}`, { min_quantity: Number(minQty), discount_percent: Number(discPct) });
      setEditingId(null);
      setMinQty('');
      setDiscPct('');
      setMessage('Tier updated.');
      await loadTiers();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTier = async (id) => {
    if (!(await confirm({ title: 'Delete tier?', message: 'This will permanently remove this tiered pricing rule.', confirmLabel: 'Delete' }))) return;
    try {
      await del(`/api/tiered-pricing?id=${id}`);
      setMessage('Tier deleted.');
      await loadTiers();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (tier) => {
    setEditingId(tier.id);
    setMinQty(String(tier.min_quantity));
    setDiscPct(String(tier.discount_percent));
  };

  return (
    <div className="page-stack">
      <PageHeader
        title="Tiered Pricing"
        actions={
          <button className="icon-action-link" type="button" onClick={loadTiers} aria-label="Refresh" title="Refresh">
            <RefreshCw size={16} />
          </button>
        }
      />
      {error ? <div className="error-box">{error}</div> : null}
      {message ? <div className="success-box">{message}</div> : null}

      <div className="panel">
        <label>Product ID
          <input value={productId} onChange={(e) => setProductId(e.target.value)} placeholder="Enter product ID to manage tiers" />
        </label>
        <button className="button button-compact button-primary" type="button" onClick={loadTiers} style={{ marginTop: '0.5rem' }}>Load Tiers</button>
      </div>

      {productId && (
        <form onSubmit={addTier} className="panel form-card">
          <h2 className="panel-header" style={{ margin: 0 }}>{editingId ? 'Edit Tier' : 'Add Tier'}</h2>
          <div className="field-grid two-column">
            <label>Min Quantity <input type="number" value={minQty} onChange={(e) => setMinQty(e.target.value)} min="2" required /></label>
            <label>Discount % <input type="number" value={discPct} onChange={(e) => setDiscPct(e.target.value)} min="1" max="100" required /></label>
          </div>
          {editingId ? (
            <div className="row-actions">
              <button className="button button-compact button-primary" type="button" onClick={() => updateTier(editingId)}><Save size={14} /> Update</button>
              <button className="button button-compact button-secondary" type="button" onClick={() => { setEditingId(null); setMinQty(''); setDiscPct(''); }}>Cancel</button>
            </div>
          ) : (
            <button className="button button-compact button-primary" type="submit"><Plus size={14} /> Add Tier</button>
          )}
        </form>
      )}

      {productId && (
        <section className="panel">
          <div className="panel-header"><h2>Tiers for product {productId}</h2></div>
          <div className="table-wrap">
            <table className="responsive-table">
              <thead>
                <tr>
                  <th>Min Qty</th>
                  <th>Discount %</th>
                  <th className="icon-column" />
                </tr>
              </thead>
              <tbody>
                {tiers.length === 0 ? (
                  <tr><td colSpan="3" className="empty-cell">No tiers configured.</td></tr>
                ) : tiers.map((tier) => (
                  <tr key={tier.id}>
                    <td data-label="Min Qty">{tier.min_quantity}+</td>
                    <td data-label="Discount">{tier.discount_percent}%</td>
                    <td className="icon-column actions-cell">
                      <button className="icon-action-link" type="button" onClick={() => startEdit(tier)} aria-label="Edit" title="Edit"><Save size={14} /></button>
                      <button className="icon-action-link icon-action-danger" type="button" onClick={() => deleteTier(tier.id)} aria-label="Delete" title="Delete"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}