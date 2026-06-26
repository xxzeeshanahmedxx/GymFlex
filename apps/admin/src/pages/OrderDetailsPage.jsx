import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Save, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { del, get, patch } from '../lib/api';
import { downloadOrderPdf } from '../lib/orderPdf';

const statuses = ['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export function OrderDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('new');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [pdfDownloading, setPdfDownloading] = useState(false);

  const loadOrder = useCallback(async () => {
    try {
      const payload = await get(`/api/order?id=${id}`);
      setData(payload);
      setStatus(payload.order.status);
    } catch (loadError) {
      setError(loadError.message || 'Failed to load order');
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const updateStatus = async () => {
    setError('');
    setMessage('');
    try {
      await patch(`/api/order?id=${id}`, { status });
      setMessage('Order status updated.');
      await loadOrder();
    } catch (updateError) {
      setError(updateError.message || 'Failed to update status');
    }
  };

  const downloadPdf = async () => {
    if (!data) return;
    setPdfDownloading(true);
    setError('');
    try {
      await downloadOrderPdf(data);
    } catch (pdfError) {
      setError(pdfError.message || 'Failed to download PDF');
    } finally {
      setPdfDownloading(false);
    }
  };

  const deleteOrder = async () => {
    if (!window.confirm('Delete this order permanently?')) return;
    setError('');
    setMessage('');
    try {
      await del(`/api/order?id=${id}`);
      window.location.href = '/orders';
    } catch (deleteError) {
      setError(deleteError.message || 'Failed to delete order');
    }
  };

  return (
    <div className="page-stack">
      <PageHeader
        title={data ? `Order ${data.order.order_number}` : 'Order'}
        actions={
          <div className="row-actions row-actions-compact">
            {data ? (
              <button className="icon-action-link" type="button" onClick={downloadPdf} disabled={pdfDownloading} aria-label="Download PDF" title="Download PDF">
                <Download size={16} />
              </button>
            ) : null}
            <button className="icon-action-link icon-action-danger" type="button" onClick={deleteOrder} aria-label="Delete order" title="Delete order">
              <Trash2 size={16} />
            </button>
            <Link className="icon-action-link" to="/orders" aria-label="Back to orders" title="Back">
              <ArrowLeft size={16} />
            </Link>
          </div>
        }
      />

      {error ? <div className="error-box">{error}</div> : null}
      {message ? <div className="success-box">{message}</div> : null}

      {!data ? (
        <div className="panel-grid two-column">
          <section className="panel skeleton-form-card"><div className="skeleton skeleton-line medium" /><div className="skeleton skeleton-field" /><div className="skeleton skeleton-field" /><div className="skeleton skeleton-textarea" /></section>
          <section className="panel skeleton-form-card"><div className="skeleton skeleton-line short" /><div className="skeleton skeleton-field" /></section>
        </div>
      ) : (
        <div className="order-detail-layout">
          <div className="order-detail-left">
            <section className="panel line-items-panel">
              <div className="panel-header"><h2>Line items</h2></div>
              <div className="order-line-list">
                {data.items.map((item) => (
                  <article className="order-line-card" key={item.id}>
                    <div className="order-line-image-wrap">
                      {(item.variant_image_url || item.image_url) ? <img src={item.variant_image_url || item.image_url} alt={item.product_name} /> : <span className="order-item-image-placeholder" />}
                      <span className="order-line-qty">{item.quantity}</span>
                    </div>
                    <div className="order-line-main">
                      <strong>{item.product_name}</strong>
                      <span className="order-line-price">Rs. {item.unit_price}</span>
                      {item.variant_name ? <span className="order-line-variant">{item.variant_name}</span> : null}
                    </div>
                    <div className="order-line-total">
                      <span>Total</span>
                      <strong>Rs. {item.line_total}</strong>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel order-status-panel">
              <div className="panel-header"><h2>Status</h2></div>
              <div className="status-editor order-status-editor">
                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                  {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <button className="icon-action-link" type="button" onClick={updateStatus} aria-label="Save status" title="Save status"><Save size={16} /></button>
              </div>
            </section>
          </div>

          <aside className="panel order-summary-panel">
            <div className="panel-header"><h2>Order info</h2></div>
            <div className="order-summary-list">
              <div><span>Name</span><strong>{data.order.first_name} {data.order.last_name}</strong></div>
              <div><span>Phone</span><strong>{data.order.phone}</strong></div>
              <div className="order-address-line"><span>Address</span><p>{data.order.address}, <strong>{data.order.city}</strong>{data.order.state ? `, ${data.order.state}` : ''}</p></div>
              <div><span>Payment</span><strong>{data.order.payment_method}</strong></div>
              <div><span>Subtotal</span><strong>Rs. {data.order.subtotal}</strong></div>
              <div><span>Shipping</span><strong>Rs. {data.order.shipping_fee || 0}</strong></div>
              <div className="order-total-line"><span>Total</span><strong>Rs. {data.order.total}</strong></div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
