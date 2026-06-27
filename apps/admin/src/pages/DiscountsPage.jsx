import { useCallback, useEffect, useState } from 'react';
import { useConfirm } from '../components/ConfirmProvider';
import { Percent, Plus, Trash2 } from 'lucide-react';
import { AdminBreadcrumbs } from '../components/AdminBreadcrumbs';

const emptyForm = { code: '', type: 'percentage', value: '', minOrderAmount: '0', maxUses: '', expiresAt: '', isActive: true };

function normalizeDiscount(row) {
  return {
    id: row.id,
    code: row.code,
    type: row.type,
    value: row.value,
    minOrderAmount: row.minOrderAmount ?? row.min_order_amount ?? 0,
    maxUses: row.maxUses ?? row.max_uses ?? null,
    usedCount: row.usedCount ?? row.used_count ?? 0,
    isActive: 'isActive' in row ? row.isActive : Boolean(row.is_active),
    expiresAt: row.expiresAt ?? row.expires_at ?? null,
    createdAt: row.createdAt ?? row.created_at,
    updatedAt: row.updatedAt ?? row.updated_at,
  };
}

export function DiscountsPage() {
  const confirm = useConfirm();
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchDiscounts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/discounts-admin', { credentials: 'include' });
      const data = await response.json();
      setDiscounts(Array.isArray(data) ? data.map(normalizeDiscount) : []);
    } catch {
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDiscounts(); }, [fetchDiscounts]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minOrderAmount: Number(form.minOrderAmount || 0),
        maxUses: form.maxUses === '' ? null : Number(form.maxUses),
        isActive: form.isActive,
        expiresAt: form.expiresAt || null,
      };

      const url = editingId ? '/api/discounts-admin' : '/api/discounts-admin';
      const method = editingId ? 'PUT' : 'POST';

      if (editingId) payload.id = editingId;

      const response = await fetch(url, { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload), credentials: 'include' });
      if (!response.ok) throw new Error('Failed to save');
      setForm(emptyForm);
      setEditingId(null);
      await fetchDiscounts();
    } catch {
      window.alert('Failed to save discount code.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (discount) => {
    setForm({
      code: discount.code,
      type: discount.type,
      value: String(discount.value),
      minOrderAmount: String(discount.minOrderAmount),
      maxUses: discount.maxUses == null ? '' : String(discount.maxUses),
      expiresAt: discount.expiresAt || '',
      isActive: discount.isActive,
    });
    setEditingId(discount.id);
  };

  const handleDelete = async (discount) => {
    const confirmed = await confirm({ message: `Delete code "${discount.code}"?`, confirmLabel: 'Delete', variant: 'danger' });
    if (!confirmed) return;
    try {
      const response = await fetch(`/api/discounts-admin?id=${discount.id}`, { method: 'DELETE', credentials: 'include' });
      if (!response.ok) throw new Error('Failed to delete');
      await fetchDiscounts();
    } catch {
      window.alert('Failed to delete discount code.');
    }
  };

  return (
    <div className="page-stack">
      <AdminBreadcrumbs items={[{ label: 'Discounts' }]} />
      <section className="page-header">
        <div>
          <h1 className="page-title">Discount Codes</h1>
          <p className="page-subtitle">Manage promotional discount codes</p>
        </div>
      </section>

      <section className="panel">
        <h2 className="text-lg font-bold mb-4">{editingId ? 'Edit' : 'New'} Discount Code</h2>
        <form onSubmit={handleSave} className="form-grid">
          <div className="field">
            <label className="field-label">Code</label>
            <input className="field-input" type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SUMMER20" required />
          </div>

          <div className="field">
            <label className="field-label">Type</label>
            <select className="field-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (Rs.)</option>
            </select>
          </div>

          <div className="field">
            <label className="field-label">Value</label>
            <input className="field-input" type="number" min="1" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder={form.type === 'percentage' ? '10' : '500'} required />
            <span className="field-hint">{form.type === 'percentage' ? 'Percentage off (e.g. 10 = 10%)' : 'Fixed amount off in PKR'}</span>
          </div>

          <div className="field">
            <label className="field-label">Min Order Amount (Rs.)</label>
            <input className="field-input" type="number" min="0" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} placeholder="0" />
          </div>

          <div className="field">
            <label className="field-label">Max Uses</label>
            <input className="field-input" type="number" min="1" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder="Unlimited" />
          </div>

          <div className="field">
            <label className="field-label">Expires At</label>
            <input className="field-input" type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
          </div>

          <div className="field">
            <label className="field-label">Active</label>
            <label className="switch">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              <span className="switch-slider"></span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving || !form.code || !form.value}>
              {saving ? 'Saving...' : editingId ? 'Update Code' : 'Create Code'}
            </button>
            {editingId ? <button type="button" className="btn btn-ghost" onClick={() => { setForm(emptyForm); setEditingId(null); }}>Cancel</button> : null}
          </div>
        </form>
      </section>

      <section className="panel !p-0">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Min Order</th>
                <th>Uses</th>
                <th>Expires</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-8 text-gray-400">Loading...</td></tr>
              ) : discounts.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-8 text-gray-400">No discount codes yet</td></tr>
              ) : discounts.map((d) => (
                <tr key={d.id}>
                  <td className="font-mono font-bold uppercase">{d.code}</td>
                  <td><span className="badge badge-outline">{d.type === 'percentage' ? '%' : 'Rs.'}</span></td>
                  <td className="font-bold">{d.type === 'percentage' ? `${d.value}%` : `Rs. ${d.value}`}</td>
                  <td>{d.minOrderAmount > 0 ? `Rs. ${d.minOrderAmount}` : '—'}</td>
                  <td>{d.maxUses != null ? `${d.usedCount}/${d.maxUses}` : `${d.usedCount}/∞`}</td>
                  <td>{d.expiresAt ? new Date(d.expiresAt).toLocaleDateString() : '—'}</td>
                  <td><span className={`status-dot ${d.isActive ? 'active' : 'inactive'}`}>{d.isActive ? 'Yes' : 'No'}</span></td>
                  <td>
                    <div className="flex gap-1.5">
                      <button type="button" className="btn-icon" onClick={() => handleEdit(d)} title="Edit" aria-label="Edit"><Percent size={15} /></button>
                      <button type="button" className="btn-icon btn-icon-danger" onClick={() => handleDelete(d)} title="Delete" aria-label="Delete"><Trash2 size={15} /></button>
                    </div>
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
