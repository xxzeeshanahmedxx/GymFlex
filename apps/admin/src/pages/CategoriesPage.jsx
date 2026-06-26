import { useEffect, useState } from 'react';
import { Check, PencilLine, Plus, Trash2, X } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useConfirm } from '../components/ConfirmProvider';
import { del, get, post, put } from '../lib/api';

const initialForm = { id: null, name: '', slug: '', description: '', sort_order: 0 };

export function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const confirm = useConfirm();

  const loadCategories = async () => {
    try {
      const data = await get('/api/categories-admin');
      setCategories(data.categories);
    } catch (loadError) {
      setError(loadError.message || 'Failed to load categories');
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      const payload = { ...form, sort_order: Number(form.sort_order) };
      if (form.id) {
        await put(`/api/category?id=${form.id}`, payload);
        setMessage('Category updated.');
      } else {
        await post('/api/category', payload);
        setMessage('Category created.');
      }
      setForm(initialForm);
      await loadCategories();
    } catch (submitError) {
      setError(submitError.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({ title: 'Delete category?', message: 'Products linked to it must be moved first.', confirmLabel: 'Delete' });
    if (!ok) return;
    try {
      await del(`/api/category?id=${id}`);
      await loadCategories();
    } catch (deleteError) {
      setError(deleteError.message || 'Failed to delete category');
    }
  };

  return (
    <div className="page-stack">
      <PageHeader title="Categories" />
      {error ? <div className="error-box">{error}</div> : null}
      {message ? <div className="success-box">{message}</div> : null}

      <div className="panel-grid two-column">
        <section className="panel">
          <div className="panel-header"><h2>{form.id ? 'Edit category' : 'New category'}</h2></div>
          <form className="form-card" onSubmit={handleSubmit}>
            <label>
              Name
              <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
            </label>
            <label>
              Slug
              <input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} required />
            </label>
            <label>
              Description
              <textarea rows="4" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            </label>
            <label>
              Sort
              <input type="number" value={form.sort_order} onChange={(event) => setForm((current) => ({ ...current, sort_order: event.target.value }))} />
            </label>
            <div className="row-actions">
              <button className="button button-primary" type="submit">
                {form.id ? <Check size={16} /> : <Plus size={16} />}
                {form.id ? 'Update' : 'Create'}
              </button>
              {form.id ? (
                <button className="icon-action-link" type="button" onClick={() => setForm(initialForm)} aria-label="Cancel" title="Cancel">
                  <X size={16} />
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="panel-header"><h2>Current categories</h2></div>
          <div className="table-wrap">
            <table className="responsive-table categories-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Sort</th>
                  <th className="icon-column" />
                  <th className="icon-column" />
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan="5" className="empty-cell">No categories yet.</td></tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id}>
                      <td data-label="Name"><strong>{category.name}</strong></td>
                      <td data-label="Slug">{category.slug}</td>
                      <td data-label="Sort">{category.sort_order}</td>
                      <td className="icon-column actions-cell" data-label="Edit">
                        <button className="icon-action-link" type="button" onClick={() => setForm(category)} aria-label={`Edit ${category.name}`} title="Edit">
                          <PencilLine size={16} />
                        </button>
                      </td>
                      <td className="icon-column actions-cell" data-label="Delete">
                        <button className="icon-action-link icon-action-danger" type="button" onClick={() => handleDelete(category.id)} aria-label={`Delete ${category.name}`} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
