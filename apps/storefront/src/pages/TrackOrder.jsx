import { useState } from 'react';
import { PackageCheck, Search } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

const inputClassName = 'w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-semibold text-gray-800 outline-none transition focus:border-brand-pink focus:bg-white';
const statusLabels = {
  new: 'Order received',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function phoneDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  usePageTitle('Track Order');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setOrder(null);
    setLoading(true);

    try {
      const params = new URLSearchParams({ orderNumber: orderNumber.trim(), phone: phoneDigits(phone) });
      const response = await fetch(`/api/track-order?${params.toString()}`, { headers: { accept: 'application/json' } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Order not found');
      setOrder(data.order);
    } catch (trackError) {
      setError(trackError.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow bg-white px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl animate-fade-in-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-brand-pink/10 text-brand-pink">
            <PackageCheck className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-4xl font-[850] uppercase tracking-widest text-gray-900">Track your order</h1>
          <p className="mt-3 text-gray-500">Enter your order number and phone number.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_20px_50px_-12px_rgba(44,35,31,0.10)] sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Order number
              <input value={orderNumber} onChange={(event) => setOrderNumber(event.target.value)} className={`${inputClassName} mt-2`} placeholder="ORD-20260620-1234" required />
            </label>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Phone
              <input value={phone} onChange={(event) => setPhone(event.target.value)} className={`${inputClassName} mt-2`} placeholder="3001234567" required />
            </label>
          </div>
          {error ? <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div> : null}
          <button type="submit" disabled={loading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-pink to-brand-coral px-5 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl disabled:opacity-60">
            <Search className="h-4 w-4" />
            {loading ? 'Checking...' : 'Track order'}
          </button>
        </form>

        {order ? (
          <section className="mt-8 rounded-3xl border border-gray-100 bg-[#fbf7ef] p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Order</p>
                <h2 className="mt-1 font-heading text-2xl font-[850] text-gray-900">{order.orderNumber}</h2>
              </div>
              <span className="rounded-full bg-brand-pink px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
                {statusLabels[order.status] || order.status}
              </span>
            </div>

            <div className="mt-6 grid gap-4 text-sm text-gray-600 sm:grid-cols-2">
              <p><strong className="text-gray-900">Name:</strong> {order.name}</p>
              <p><strong className="text-gray-900">State:</strong> {order.state || '—'}</p>
              <p><strong className="text-gray-900">City:</strong> {order.city}</p>
              <p className="sm:col-span-2"><strong className="text-gray-900">Address:</strong> {order.address}</p>
            </div>

            <div className="mt-6 divide-y divide-stone-200 rounded-2xl bg-white p-4">
              {order.items.map((item) => (
                <div key={`${item.product_name}-${item.variant_name}`} className="track-order-item flex justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="flex min-w-0 items-center gap-3">
                    {item.image_url ? <img src={item.image_url} alt={item.product_name} className="h-14 w-14 flex-none rounded-xl object-cover border border-stone-200" /> : <span className="h-14 w-14 flex-none rounded-xl bg-stone-100 border border-stone-200" />}
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900">{item.product_name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        {item.variant_image_url ? <img src={item.variant_image_url} alt={`${item.variant_name} variant`} className="h-7 w-7 rounded-lg object-cover border border-stone-200" /> : null}
                        <p className="text-xs font-bold uppercase tracking-widest text-brand-pink">{item.variant_type ? `${item.variant_type}: ` : ''}{item.variant_name || '—'} · Qty {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                  <p className="shrink-0 font-bold text-gray-900">Rs. {item.line_total}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 border-t border-stone-200 pt-5">
              <div className="flex items-center justify-between text-sm font-bold text-gray-500"><span>Subtotal</span><span>Rs. {order.subtotal}</span></div>
              <div className="flex items-center justify-between text-sm font-bold text-gray-500"><span>Shipping</span><span>Rs. {order.shippingFee || 0}</span></div>
              <div className="flex items-center justify-between">
                <span className="font-heading font-[850] uppercase tracking-widest text-gray-900">Total</span>
                <span className="text-2xl font-bold text-brand-pink">Rs. {order.total}</span>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
