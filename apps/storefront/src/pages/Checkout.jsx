import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/useShop';
import { getEffectivePrice } from '../lib/product-utils';
import { usePageTitle } from '../hooks/usePageTitle';
import { Copy, Check } from 'lucide-react';
import { fetchHomepageSettings } from '../lib/storefront-api';

const DEFAULT_SHIPPING_FEE = 250;

const states = ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Islamabad Capital Territory', 'Gilgit-Baltistan', 'Azad Kashmir'];

const inputClassName =
  'block w-full rounded-2xl border border-white/20 bg-[#1a1a1a] px-4 py-3.5 text-base font-semibold text-white placeholder:text-gray-500 outline-none transition focus:border-brand-pink focus:bg-[#222]';
const labelClassName = 'block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2';

function EmptyCartState({ onContinueShopping }) {
  return (
    <div className="max-w-[88rem] mx-auto px-4 py-32 text-center animate-fade-in-up flex-grow">
      <h2 className="text-3xl font-heading font-[850] mb-6 text-gray-900">Your cart is empty</h2>
      <button onClick={onContinueShopping} className="text-brand-pink font-bold hover:text-brand-coral uppercase tracking-widest transition-colors">
        Continue Shopping
      </button>
    </div>
  );
}

function OrderConfirmedState({ orderNumber }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const copyOrderNumber = async () => {
    if (!orderNumber) return;
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center font-sans animate-fade-in-up flex-grow">
      <div className="bg-gradient-to-tr from-green-400 to-green-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8 shadow-xl">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      </div>
      <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4 font-heading font-[850] uppercase tracking-widest">Order Confirmed</h2>
      {orderNumber ? (
        <div className="order-number-copy mx-auto mb-8">
          <span>Order #{orderNumber}</span>
          <button type="button" onClick={copyOrderNumber} aria-label="Copy order number" title="Copy order number">
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      ) : null}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/track-order" className="rounded-xl bg-gradient-to-r from-brand-pink to-brand-coral px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg">
          Track order
        </Link>
        <Link to="/shop" className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold uppercase tracking-widest text-gray-700">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

function normalizePhone(value) {
  const cleaned = String(value || '').trim();
  if (!cleaned) return cleaned;
  if (cleaned.startsWith('+')) return cleaned;
  return `+92 ${cleaned}`;
}

function splitName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '-',
  };
}

function validateCheckoutForm({ fullName, address, state, city, phone, cart }) {
  if (String(fullName || '').trim().length < 2) return 'Please enter your name.';
  if (String(address || '').trim().length < 8) return 'Please enter a complete delivery address.';
  if (!state) return 'Please select a state.';
  if (String(city || '').trim().length < 2) return 'Please enter your city.';
  if (String(phone || '').replace(/\D/g, '').length < 10) return 'Please enter a valid phone number.';
  if (!Array.isArray(cart) || cart.length === 0) return 'Your cart is empty.';
  if (cart.some((item) => !item?.product?.id || item.quantity < 1)) return 'Please review your cart.';
  return '';
}

function OrderItems({ cart, subtotal, shippingFee, total }) {
  return (
    <div className="divide-y divide-gray-100">
      {cart.map((item) => (
        <div key={`${item.product.id}-${item.variant?.id || 'default'}`} className="flex items-start justify-between gap-4 py-4">
          <div>
            <h3 className="font-heading font-[850] text-gray-900">{item.product.name}</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-brand-pink">
              {item.variant ? `${item.variant.type}: ${item.variant.name}` : 'Standard'} <span className="text-gray-400 ml-2">Qty {item.quantity}</span>
            </p>
          </div>
          <p className="font-bold text-gray-900 whitespace-nowrap">Rs. {getEffectivePrice(item.product) * item.quantity}</p>
        </div>
      ))}
    </div>
  );
}

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useShop();
  const [shippingSettings, setShippingSettings] = useState({ shippingFee: DEFAULT_SHIPPING_FEE, freeShippingMinimum: 0 });
  const shippingFee = cart.length > 0 && (!shippingSettings.freeShippingMinimum || cartTotal < shippingSettings.freeShippingMinimum) ? shippingSettings.shippingFee : 0;
  const orderTotal = cartTotal + shippingFee;
  const navigate = useNavigate();
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  usePageTitle('Checkout');

  useEffect(() => {
    let cancelled = false;
    fetchHomepageSettings()
      .then((settings) => {
        if (!cancelled) {
          setShippingSettings({
            shippingFee: Math.max(0, Number(settings?.shippingFee ?? DEFAULT_SHIPPING_FEE)),
            freeShippingMinimum: Math.max(0, Number(settings?.freeShippingMinimum ?? 0)),
          });
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const fullName = formData.get('full-name');
    const nameParts = splitName(fullName);
    const customer = {
      ...nameParts,
      address: formData.get('address'),
      state: formData.get('state'),
      city: formData.get('city'),
      phone: normalizePhone(formData.get('phone')),
      country: 'Pakistan',
      paymentMethod: 'COD',
    };

    const validationError = validateCheckoutForm({ fullName, ...customer, cart });
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    const payload = {
      customer,
      items: cart.map((item) => ({
        productId: item.product.id,
        variantId: item.variant?.id || null,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to place order');

      setSubmittedOrder(data.order);
      clearCart();
    } catch (submitError) {
      setError(submitError.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !submittedOrder) {
    return <EmptyCartState onContinueShopping={() => navigate('/shop')} />;
  }

  if (submittedOrder) {
    return <OrderConfirmedState orderNumber={submittedOrder.orderNumber} />;
  }

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 font-sans animate-fade-in-up flex-grow">
      <div className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl text-gray-900 font-heading font-[850] tracking-widest uppercase mb-3">Checkout</h1>
        <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Cash on delivery · Pakistan only</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr] lg:items-start">
        <section className="rounded-3xl border border-white/10 bg-[#111] p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] sm:p-8">
          <h2 className="text-xl font-heading font-[850] text-white mb-6 uppercase tracking-wider">Delivery details</h2>

          <div className="grid grid-cols-1 gap-5 rounded-3xl border border-white/10 bg-black/50 p-4 sm:p-5">
            <div>
              <label htmlFor="full-name" className={labelClassName}>Name</label>
              <input id="full-name" name="full-name" className={inputClassName} type="text" minLength={2} required autoComplete="name" />
            </div>

            <div>
              <label htmlFor="phone" className={labelClassName}>Phone</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-gray-500 font-bold">+92</span>
                <input id="phone" name="phone" className={`${inputClassName} pl-14`} type="tel" placeholder="300 1234567" minLength={10} required autoComplete="tel" />
              </div>
            </div>

            <div>
              <label htmlFor="state" className={labelClassName}>State</label>
              <select id="state" name="state" required className={inputClassName}>
                <option value="">Select state</option>
                {states.map((state) => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="city" className={labelClassName}>City</label>
              <input id="city" name="city" className={inputClassName} type="text" placeholder="Type your city" minLength={2} required autoComplete="address-level2" />
            </div>

            <div>
              <label htmlFor="address" className={labelClassName}>Address</label>
              <textarea id="address" name="address" rows="4" minLength={8} required className={inputClassName} />
            </div>
          </div>

          {error ? <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div> : null}
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#111] p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] sm:p-8 lg:sticky lg:top-28">
          <h2 className="text-xl font-heading font-[850] text-white mb-4 uppercase tracking-wider">Your order</h2>
          <OrderItems cart={cart} subtotal={cartTotal} shippingFee={shippingFee} total={orderTotal} />
          <div className="mt-5 border-t border-gray-100 pt-5 grid gap-3">
            <div className="flex items-center justify-between text-sm font-bold text-gray-500">
              <span>Subtotal</span>
              <span>Rs. {cartTotal}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-gray-500">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? 'Free' : `Rs. ${shippingFee}`}</span>
            </div>
            {shippingSettings.freeShippingMinimum > 0 && cartTotal < shippingSettings.freeShippingMinimum ? (
              <p className="text-xs font-semibold text-gray-400">Free shipping over Rs. {shippingSettings.freeShippingMinimum}</p>
            ) : null}
            <div className="flex items-center justify-between">
              <span className="text-lg font-heading font-[850] uppercase tracking-widest text-gray-900">Total</span>
              <span className="text-2xl font-bold text-brand-pink">Rs. {orderTotal}</span>
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="mt-6 w-full rounded-xl bg-gradient-to-r from-brand-pink to-brand-coral px-4 py-4 text-base font-bold uppercase tracking-widest text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0">
            {isSubmitting ? 'Placing...' : 'Place order'}
          </button>
        </section>
      </form>
    </div>
  );
}
