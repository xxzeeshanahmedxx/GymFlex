import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { AdminBreadcrumbs } from '../components/AdminBreadcrumbs';
import { useConfirm } from '../components/ConfirmProvider';
import { del, get, put } from '../lib/api';

export function CommunityPhotosPage() {
  const confirm = useConfirm();
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState('');

  const load = useCallback(async () => {
    try { const d = await get('/api/community-photos'); setPhotos(d.photos || []); } catch (err) { setError(err.message); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleApproval = async (id, current) => {
    if (saving) return;
    setSaving(id);
    try { await put(`/api/community-photos?id=${id}`, { is_approved: !current }); setMessage('Updated.'); await load(); } catch (err) { setError(err.message); }
    finally { setSaving(''); }
  };

  const deletePhoto = async (id) => {
    if (saving) return;
    if (!(await confirm({ title: 'Delete photo?', message: 'This will permanently remove this community photo.', confirmLabel: 'Delete' }))) return;
    setSaving(id);
    try { await del(`/api/community-photos?id=${id}`); setMessage('Deleted.'); await load(); } catch (err) { setError(err.message); }
    finally { setSaving(''); }
  };

  return (
    <div className="page-stack">
      <AdminBreadcrumbs items={[{ label: 'Community Photos' }]} />
      <PageHeader title="Community Photos" actions={<button className="icon-action-link" onClick={load}><RefreshCw size={16} /></button>} />
      {error ? <div className="error-box">{error}</div> : null}
      {message ? <div className="success-box">{message}</div> : null}
      <section className="panel">
        <div className="table-wrap">
          <table className="responsive-table dense-table">
            <thead><tr><th>Image</th><th>Author</th><th>Approved</th><th>Created</th><th className="icon-column" /></tr></thead>
            <tbody>
              {photos.length === 0 ? <tr><td colSpan="5" className="empty-cell">No photos.</td></tr>
                : photos.map((p) => (
                  <tr key={p.id}>
                    <td data-label="Image"><img src={p.image_url} alt="" className="w-12 h-12 object-cover rounded" /></td>
                    <td data-label="Author">{p.author_name || '—'}</td>
                    <td data-label="Approved">
                      <button className={`button button-compact ${p.is_approved ? 'button-primary' : 'button-secondary'}`} onClick={() => toggleApproval(p.id, p.is_approved)} disabled={saving === p.id}>
                        {p.is_approved ? 'Approved' : 'Pending'}
                      </button>
                    </td>
                    <td data-label="Created">{p.created_at}</td>
                    <td className="icon-column actions-cell">
                      <button className="icon-action-link icon-action-danger" onClick={() => deletePhoto(p.id)} disabled={saving === p.id}><Trash2 size={14} /></button>
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