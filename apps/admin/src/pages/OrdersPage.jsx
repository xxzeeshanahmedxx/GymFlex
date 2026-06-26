import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Download, Eye, FilterX } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { get, post } from '../lib/api';
import { downloadBulkOrdersPdf } from '../lib/orderPdf';

const statuses = ['all', 'new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const bulkStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [error, setError] = useState('');
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState('confirmed');
  const [bulkUpdating, setBulkUpdating] = useState(false);

  useEffect(() => {
    get('/api/orders-admin')
      .then((data) => setOrders(data.orders))
      .catch((ordersError) => setError(ordersError.message || 'Failed to load orders'));
  }, []);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesQuery = !normalizedQuery || [
        order.order_number,
        order.first_name,
        order.last_name,
        order.city,
        order.phone,
      ].some((value) => String(value || '').toLowerCase().includes(normalizedQuery));

      const matchesStatus = status === 'all' || order.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [orders, query, status]);

  const hasActiveFilters = query.trim() || status !== 'all';

  const toggleSelect = useCallback((orderId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map((o) => o.id)));
    }
  }, [filteredOrders, selectedIds]);

  const applyBulkStatus = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setBulkUpdating(true);
    setError('');
    try {
      await post('/api/orders-admin', { ids, status: bulkStatus });
      setSelectedIds(new Set());
      const data = await get('/api/orders-admin');
      setOrders(data.orders);
    } catch (bulkError) {
      setError(bulkError.message || 'Bulk update failed');
    } finally {
      setBulkUpdating(false);
    }
  };

  const downloadFilteredPdf = async () => {
    if (filteredOrders.length === 0) return;
    setBulkDownloading(true);
    setError('');
    try {
      const payloads = [];
      for (const order of filteredOrders) {
        payloads.push(await get(`/api/order?id=${order.id}`));
      }
      await downloadBulkOrdersPdf(payloads, status === 'all' ? 'filtered-orders' : status);
    } catch (pdfError) {
      setError(pdfError.message || 'Failed to generate PDF');
    } finally {
      setBulkDownloading(false);
    }
  };

  return (
    <div className="page-stack">
      <PageHeader title="Orders" />
      {error ? <div className="error-box">{error}</div> : null}

      <div className="toolbar orders-toolbar">
        <div className="orders-toolbar-fields">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders" />
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {statuses.map((item) => <option key={item} value={item}>{item === 'all' ? 'All statuses' : item}</option>)}
          </select>
        </div>
        <div className="orders-toolbar-actions">
          <div className="toolbar-count">{filteredOrders.length}</div>
          {hasActiveFilters ? (
            <button className="icon-action-link" type="button" onClick={() => { setQuery(''); setStatus('all'); }} aria-label="Clear filters" title="Clear filters">
              <FilterX size={16} />
            </button>
          ) : null}
          <button className="icon-action-link" type="button" onClick={downloadFilteredPdf} disabled={bulkDownloading || filteredOrders.length === 0} aria-label="Download filtered PDF" title="Bulk PDF">
            <Download size={16} />
          </button>
        </div>
      </div>

      {selectedIds.size > 0 ? (
        <div className="toolbar orders-toolbar bulk-toolbar">
          <div className="orders-toolbar-fields">
            <span className="toolbar-count">{selectedIds.size} selected</span>
            <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}>
              {bulkStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="button button-compact" type="button" onClick={applyBulkStatus} disabled={bulkUpdating}>
              {bulkUpdating ? 'Updating...' : `Set ${bulkStatus}`}
            </button>
            <button className="button button-compact button-secondary" type="button" onClick={() => setSelectedIds(new Set())}>
              Clear
            </button>
          </div>
        </div>
      ) : null}

      <section className="panel">
        <div className="table-wrap">
          <table className="responsive-table order-table">
            <thead>
              <tr>
                <th className="icon-column">
                  <label className="checkbox-label" title="Select all">
                    <input type="checkbox" checked={filteredOrders.length > 0 && selectedIds.size === filteredOrders.length} onChange={toggleSelectAll} />
                    {selectedIds.size > 0 ? <Check size={12} /> : null}
                  </label>
                </th>
                <th>Order</th>
                <th>Customer</th>
                <th>City</th>
                <th>Status</th>
                <th>Total</th>
                <th>Items</th>
                <th className="icon-column" />
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan="8" className="empty-cell">No orders found.</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className={selectedIds.has(order.id) ? 'row-selected' : ''}>
                    <td className="icon-column" data-label="">
                      <label className="checkbox-label">
                        <input type="checkbox" checked={selectedIds.has(order.id)} onChange={() => toggleSelect(order.id)} />
                      </label>
                    </td>
                    <td data-label="Order">{order.order_number}</td>
                    <td data-label="Customer"><strong>{order.first_name} {order.last_name}</strong><div className="table-subtext">{order.phone}</div></td>
                    <td data-label="City">{order.city}</td>
                    <td data-label="Status"><span className={`status-pill status-${order.status}`}>{order.status}</span></td>
                    <td data-label="Total">Rs. {order.total}</td>
                    <td data-label="Items">{order.item_count}</td>
                    <td className="icon-column actions-cell" data-label="View">
                      <Link className="icon-action-link" to={`/orders/${order.id}`} aria-label={`View ${order.order_number}`} title="View">
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
