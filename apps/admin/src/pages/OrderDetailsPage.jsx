import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Save, Trash2, Truck } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { del, get, patch } from '../lib/api';
import { downloadOrderPdf } from '../lib/orderPdf';

const statuses = ['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const callStatuses = ['not_needed', 'pending', 'confirmed', 'failed'];
const itemStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export function OrderDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('new');
  const [callStatus, setCallStatus] = useState('not_needed');
  const [courierName, setCourierName] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [itemStatusesMap, setItemStatusesMap] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [pdfDownloading, setPdfDownloading] = useState(false);

  const loadOrder = useCallback(async () => {
    try {
      const payload = await get(`/api/order?id=${id}`);
      setData(payload);
      setStatus(payload.order.status);
      setCallStatus(payload.order.call_status || 'not_needed');
      setCourierName(payload.order.courier_name || '');
      setTrackingUrl(payload.order.tracking_url || '');
      setNotes(payload.order.notes || '');
      const itemMap = {};
      (payload.items || []).forEach((item) => { itemMap[item.id] = item.status || 'pending'; });
      setItemStatusesMap(itemMap);
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

  const saveOrderDetails = async () => {
    setError('');
    setMessage('');
    try {
      await patch(`/api/order?id=${id}`, { call_status: callStatus, courier_name: courierName, tracking_url: trackingUrl, notes });
      setMessage('Order details saved.');
      await loadOrder();
    } catch (saveError) {
      setError(saveError.message || 'Failed to save order details');
    }
  };

  const saveItemStatuses = async () => {
    setError('');
    setMessage('');
    try {
      const items = Object.entries(itemStatusesMap).map(([itemId, itemStatus]) => ({ id: itemId, status: itemStatus }));
      await patch(`/api/order?id=${id}`, { items });
      setMessage('Item statuses updated.');
      await loadOrder();
    } catch (itemError) {
      setError(itemError.message || 'Failed to update item statuses');
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
              <>
                <button className="icon-action-link" type="button" onClick={downloadPdf} disabled={pdfDownloading} aria-label="Download PDF" title="Download PDF">
                  <Download size={16} />
                </button>
                <button className="icon-action-link" type="button" onClick={() => window.print()} aria-label="Packing slip" title="Packing slip">
                  <Printer size={16} />
                </button>
              </>
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
                      <div className="order-line-status">
                        <span className="item-status-label">Status:</span>
                        <select
                          value={itemStatusesMap[item.id] || 'pending'}
                          onChange={(e) => setItemStatusesMap((prev) => ({ ...prev, [item.id]: e.target.value }))}
                          className="item-status-select"
                        >
                          {itemStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="order-line-total">
                      <span>Total</span>
                      <strong>Rs. {item.line_total}</strong>
                    </div>
                  </article>
                ))}
              </div>
              <div className="panel-actions">
                <button className="button button-compact" type="button" onClick={saveItemStatuses}><Save size={14} /> Save item statuses</button>
              </div>
            </section>

            <section className="panel order-status-panel">
              <div className="panel-header"><h2>Order status</h2></div>
              <div className="status-editor order-status-editor">
                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                  {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <button className="icon-action-link" type="button" onClick={updateStatus} aria-label="Save status" title="Save status"><Save size={16} /></button>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header"><h2>Delivery & tracking</h2></div>
              <div className="field-grid two-column">
                <label>
                  Call status
                  <select value={callStatus} onChange={(e) => setCallStatus(e.target.value)}>
                    {callStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <label>
                  Courier name
                  <input value={courierName} onChange={(e) => setCourierName(e.target.value)} placeholder="e.g. Leopards, TCS, Trax" />
                </label>
                <label className="full-row">
                  Tracking URL
                  <input value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} placeholder="https://..." />
                </label>
                <label className="full-row">
                  Order notes
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Customer delivery instructions" />
                </label>
              </div>
              <div className="panel-actions">
                <button className="button button-compact" type="button" onClick={saveOrderDetails}><Truck size={14} /> Save delivery details</button>
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
              {data.order.discount_amount > 0 ? <div><span>Discount</span><strong>-Rs. {data.order.discount_amount} {data.order.discount_code ? `(${data.order.discount_code})` : ''}</strong></div> : null}
              <div className="order-total-line"><span>Total</span><strong>Rs. {data.order.total}</strong></div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
