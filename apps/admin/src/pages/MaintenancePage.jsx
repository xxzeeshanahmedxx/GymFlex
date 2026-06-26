import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Save } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { get, post } from '../lib/api';

export function MaintenancePage() {
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadSettings = useCallback(async () => {
    try {
      const data = await get('/api/maintenance');
      setEnabled(data.enabled || false);
      setMessage(data.message || '');
    } catch (err) { setError(err.message); }
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const handleSave = async () => {
    setError('');
    setSuccess('');
    try {
      await post('/api/maintenance', { enabled, message });
      setSuccess('Maintenance settings saved.');
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="page-stack">
      <PageHeader
        title="Maintenance Mode"
        actions={<button className="icon-action-link" onClick={loadSettings} aria-label="Refresh"><RefreshCw size={16} /></button>}
      />
      {error ? <div className="error-box">{error}</div> : null}
      {success ? <div className="success-box">{success}</div> : null}

      <div className="panel form-card">
        <label className="checkbox-label" style={{ fontSize: '1rem', fontWeight: 700 }}>
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          Enable maintenance mode
        </label>
        {enabled ? (
          <label>
            Maintenance message
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="We are currently undergoing maintenance..." />
          </label>
        ) : null}
        <button className="button button-compact button-primary" onClick={handleSave}><Save size={14} /> Save</button>
      </div>

      {enabled ? (
        <div className="notice-box">
          <strong>Maintenance mode is ON.</strong> The storefront will display the maintenance message instead of the normal site.
        </div>
      ) : null}
    </div>
  );
}