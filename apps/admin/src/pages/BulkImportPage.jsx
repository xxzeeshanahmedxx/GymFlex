import { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

export function BulkImportPage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [importing, setImporting] = useState(false);

  const handleExport = () => {
    window.open('/api/product-bulk', '_blank');
  };

  const handleImport = async () => {
    if (!file) { setError('Please select a CSV file'); return; }
    setError('');
    setMessage('');
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/product-bulk', { method: 'POST', credentials: 'include', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Import failed');
      setMessage(`${data.imported} products imported successfully.`);
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="page-stack">
      <PageHeader title="Bulk Import / Export" />
      {error ? <div className="error-box">{error}</div> : null}
      {message ? <div className="success-box">{message}</div> : null}

      <div className="panel-grid two-column">
        <div className="panel form-card">
          <h2 className="panel-header" style={{ margin: 0 }}>Export Products</h2>
          <p className="store-copy">Download all products as a CSV file.</p>
          <button className="button button-primary" onClick={handleExport}><Download size={16} /> Export CSV</button>
        </div>

        <div className="panel form-card">
          <h2 className="panel-header" style={{ margin: 0 }}>Import Products</h2>
          <p className="store-copy">Upload a CSV file to bulk import products.</p>
          <label>
            CSV File
            <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
          </label>
          <button className="button button-primary" onClick={handleImport} disabled={importing || !file}>
            <Upload size={16} /> {importing ? 'Importing...' : 'Import CSV'}
          </button>
        </div>
      </div>
    </div>
  );
}