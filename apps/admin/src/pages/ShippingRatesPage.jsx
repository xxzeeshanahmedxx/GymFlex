import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw, Save, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { del, get, post, put } from '../lib/api';

export function ShippingRatesPage() {
  const [rates, setRates] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [city, setCity] = useState('');
  const [fee, setFee] = useState('');
  const [days, setDays] = useState('3-5');
  const [editingId, setEditingId] = useState(null);

  const loadRates = useCallback(async () => {
    try {
      const data = await get('/api/shipping-rates');
      setRates(data.rates || []);
    } catch (err) { setError(err.message); }
  }, []);

  useEffect(() => { loadRates(); }, [loadRates]);

  const resetForm = () => { setCity(''); setFee(''); setDays('3-5'); setEditingId(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      if (editingId) {
        await put(`/api/shipping-rates?id=${editingId}`, { city: city.trim(), fee: Number(fee), estimated_days: days });
      } else {
        await post('/api/shipping-rates', { city: city.trim(), fee: Number(fee), estimated_days: days });
      }
      setMessage(editingId ? 'Rate updated.' : 'Rate added.');
      resetForm();
      await loadRates();
    } catch (err) { setError(err.message); }
  };

  const startEdit = (rate) => {
    setEditingId(rate.id);
    setCity(rate.city);
    setFee(String(rate.fee));
    setDays(rate.estimated_days || '3-5');
  };

  const deleteRate = async (id) => {
    if (!window.confirm('Delete this shipping rate?')) return;
    try {
      await del(`/api/shipping-rates?id=${id}`);
      setMessage('Rate deleted.');
      await loadRates();
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="page-stack">
      <PageHeader
        title="Shipping Rates"
        actions={<button className="icon-action-link" type="button" onClick={loadRates} aria-label="Refresh" title="Refresh"><RefreshCw size={16} /></button>}
      />
      {error ? <div className="error-box">{error}</div> : null}
      {message ? <div className="success-box">{message}</div> : null}

      <form onSubmit={handleSave} className="panel form-card">
        <h2 className="panel-header" style={{ margin: 0 }}>{editingId ? 'Edit Rate' : 'Add Rate'}</h2>
        <div className="field-grid two-column">
          <label>City <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Karachi" required /></label>
          <label>Fee (Rs.) <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} min="0" required /></label>
          <label>Est. Delivery <input value={days} onChange={(e) => setDays(e.target.value)} placeholder="3-5" /></label>
        </div>
        {editingId ? (
          <div className="row-actions">
            <button className="button button-compact button-primary" type="submit"><Save size={14} /> Update</button>
            <button className="button button-compact button-secondary" type="button" onClick={resetForm}>Cancel</button>
          </div>
        ) : (
          <button className="button button-compact button-primary" type="submit"><Plus size={14} /> Add Rate</button>
        )}
      </form>

      <section className="panel">
        <div className="table-wrap">
          <table className="responsive-table dense-table">
            <thead>
              <tr><th>City</th><th>Fee</th><th>Est. Days</th><th className="icon-column" /></tr>
            </thead>
            <tbody>
              {rates.length === 0 ? (
                <tr><td colSpan="4" className="empty-cell">No shipping rates configured.</td></tr>
              ) : rates.map((rate) => (
                <tr key={rate.id}>
                  <td data-label="City"><strong>{rate.city}</strong></td>
                  <td data-label="Fee">Rs. {rate.fee}</td>
                  <td data-label="Days">{rate.estimated_days}</td>
                  <td className="icon-column actions-cell">
                    <button className="icon-action-link" onClick={() => startEdit(rate)} aria-label="Edit"><Save size={14} /></button>
                    <button className="icon-action-link icon-action-danger" onClick={() => deleteRate(rate.id)} aria-label="Delete"><Trash2 size={14} /></button>
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