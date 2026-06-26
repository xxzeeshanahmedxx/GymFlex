import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { get } from '../lib/api';

export function ActivityLogPage() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');

  const loadLog = useCallback(async () => {
    try {
      const data = await get('/api/activity-log');
      setEntries(data.entries || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => { loadLog(); }, [loadLog]);

  return (
    <div className="page-stack">
      <PageHeader
        title="Activity Log"
        actions={
          <button className="icon-action-link" type="button" onClick={loadLog} aria-label="Refresh" title="Refresh">
            <RefreshCw size={16} />
          </button>
        }
      />
      {error ? <div className="error-box">{error}</div> : null}

      <section className="panel">
        <div className="table-wrap">
          <table className="responsive-table dense-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>Entity</th>
                <th>ID</th>
                <th>Admin</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr><td colSpan="6" className="empty-cell">No activity recorded yet.</td></tr>
              ) : entries.map((entry) => (
                <tr key={entry.id}>
                  <td data-label="Time">{entry.created_at}</td>
                  <td data-label="Action"><span className="status-pill">{entry.action}</span></td>
                  <td data-label="Entity">{entry.entity_type}</td>
                  <td data-label="ID">{entry.entity_id || '-'}</td>
                  <td data-label="Admin">{entry.admin_id || '-'}</td>
                  <td data-label="Details" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}