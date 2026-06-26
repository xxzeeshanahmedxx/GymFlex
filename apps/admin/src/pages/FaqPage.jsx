import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw, Save, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { del, get, post, put } from '../lib/api';

export function FaqPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [sortOrder, setSortOrder] = useState('0');
  const [editingId, setEditingId] = useState(null);

  const loadItems = useCallback(async () => {
    try { const d = await get('/api/faq-admin'); setItems(d.items || []); } catch (err) { setError(err.message); }
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  const resetForm = () => { setQuestion(''); setAnswer(''); setCategory('General'); setSortOrder('0'); setEditingId(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      const payload = { question, answer, category, sort_order: Number(sortOrder), is_active: true };
      if (editingId) { await put(`/api/faq-admin?id=${editingId}`, payload); setMessage('FAQ updated.'); }
      else { await post('/api/faq-admin', payload); setMessage('FAQ added.'); }
      resetForm(); await loadItems();
    } catch (err) { setError(err.message); }
  };

  const startEdit = (item) => {
    setEditingId(item.id); setQuestion(item.question); setAnswer(item.answer); setCategory(item.category); setSortOrder(String(item.sort_order || 0));
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try { await del(`/api/faq-admin?id=${id}`); setMessage('FAQ deleted.'); await loadItems(); } catch (err) { setError(err.message); }
  };

  return (
    <div className="page-stack">
      <PageHeader title="FAQ Manager" actions={<button className="icon-action-link" onClick={loadItems}><RefreshCw size={16} /></button>} />
      {error ? <div className="error-box">{error}</div> : null}
      {message ? <div className="success-box">{message}</div> : null}
      <form onSubmit={handleSave} className="panel form-card">
        <h2 className="panel-header" style={{ margin: 0 }}>{editingId ? 'Edit FAQ' : 'Add FAQ'}</h2>
        <div className="field-grid two-column">
          <label>Category <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="General" /></label>
          <label>Sort Order <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} /></label>
        </div>
        <label>Question <input value={question} onChange={(e) => setQuestion(e.target.value)} required /></label>
        <label>Answer <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} required /></label>
        {editingId ? (
          <div className="row-actions">
            <button className="button button-compact button-primary" type="submit"><Save size={14} /> Update</button>
            <button className="button button-compact button-secondary" type="button" onClick={resetForm}>Cancel</button>
          </div>
        ) : <button className="button button-compact button-primary" type="submit"><Plus size={14} /> Add FAQ</button>}
      </form>
      <section className="panel">
        <div className="table-wrap">
          <table className="responsive-table dense-table">
            <thead><tr><th>Q</th><th>Answer</th><th>Category</th><th className="icon-column" /></tr></thead>
            <tbody>
              {items.length === 0 ? <tr><td colSpan="4" className="empty-cell">No FAQs yet.</td></tr>
                : items.map((item) => (
                  <tr key={item.id}>
                    <td data-label="Question"><strong>{item.question}</strong></td>
                    <td data-label="Answer" style={{ maxWidth: 300 }}>{item.answer}</td>
                    <td data-label="Category"><span className="status-pill">{item.category}</span></td>
                    <td className="icon-column actions-cell">
                      <button className="icon-action-link" onClick={() => startEdit(item)}><Save size={14} /></button>
                      <button className="icon-action-link icon-action-danger" onClick={() => deleteItem(item.id)}><Trash2 size={14} /></button>
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