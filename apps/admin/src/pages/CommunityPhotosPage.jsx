import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { del, get, put } from '../lib/api';

export function CommunityPhotosPage() {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    try { const d = await get('/api/community-photos'); setPhotos(d.photos || []); } catch (err) { setError(err.message); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleApproval = async (id, current) => {
    try { await put(`/api/community-photos?id=${id}`, { is_approved: !current }); setMessage('Updated.'); await load(); } catch (err) { setError(err.message); }
  };

  const deletePhoto = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try { await del(`/api/community-photos?id=${id}`); setMessage('Deleted.'); await load(); } catch (err) { setError(err.message); }
  };

  return (
    <div className="page-stack">
      <PageHeader title="Community Photos" actions={<button className="icon-action-link" onClick={load}><RefreshCw size={16} /></button>} />
      {error ? <div className="error-box">{error}</div> : null}
      {message ? <div className="success-box">{message}</div> : null}
      <section className="panel">
        <div className="table-wrap">
          <table className="responsive-table dense-table">
            <thead><tr><th>Image</th><th>Email</th><th>Caption</th><th>Approved</th><th>Created</th><th className="icon-column" /></tr></thead>
            <tbody>
              {photos.length === 0 ? <tr><td colSpan="6" className="empty-cell">No photos.</td></tr>
                : photos.map((p) => (
                  <tr key={p.id}>
                    <td data-label="Image"><img src={p.image_url} alt="" className="w-12 h-12 object-cover rounded" /></td>
                    <td data-label="Email">{p.email}</td>
                    <td data-label="Caption" style={{ maxWidth: 200 }}>{p.caption || '—'}</td>
                    <td data-label="Approved">
                      <button className={`button button-compact ${p.is_approved ? 'button-primary' : 'button-secondary'}`} onClick={() => toggleApproval(p.id, p.is_approved)}>
                        {p.is_approved ? 'Approved' : 'Pending'}
                      </button>
                    </td>
                    <td data-label="Created">{p.created_at}</td>
                    <td className="icon-column actions-cell">
                      <button className="icon-action-link icon-action-danger" onClick={() => deletePhoto(p.id)}><Trash2 size={14} /></button>
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