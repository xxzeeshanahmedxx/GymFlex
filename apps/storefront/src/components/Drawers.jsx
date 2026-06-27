import { useNavigate } from 'react-router-dom';
import { X, Trash2 } from 'lucide-react';
import { useShop } from '../context/useShop';
import { getEffectivePrice, getProductCategoryName, getProductPrimaryImage } from '../lib/product-utils';

function DrawerShell({ isOpen, title, onClose, children, footer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-md w-full flex shadow-2xl cart-drawer-slide-in">
        <div className="w-full h-full bg-white flex flex-col">
          <div className="px-6 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="text-2xl font-heading font-[850] uppercase tracking-widest text-gray-900">{title}</h2>
            <button onClick={onClose} className="drawer-close-btn bg-white hover:bg-gray-100 rounded-full transition-colors shadow-sm" aria-label="Close drawer">
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">{children}</div>
          {footer}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return <div className="text-center text-gray-500 mt-20 font-sans font-bold uppercase tracking-widest">{message}</div>;
}

function ProductPreview({ product, label }) {
  const imageUrl = getProductPrimaryImage(product);

  return (
    <div className="w-20 h-20 bg-gradient-to-tr from-brand-pink to-brand-coral rounded-xl flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden">
      {imageUrl ? <img src={imageUrl} alt={product.name} loading="lazy" decoding="async" className="h-full w-full object-cover" /> : null}
      <span className="absolute inset-0 bg-black/10" />
      {!imageUrl ? <span className="relative text-white text-[10px] font-bold uppercase tracking-widest opacity-90 text-center px-1">{label}</span> : null}
    </div>
  );
}

function CartItem({ item, onRemove }) {
  return (
    <div className="flex space-x-4 border-b border-gray-100 pb-6 items-center group">
      <ProductPreview product={item.product} label={getProductCategoryName(item.product).split(' ')[0]} />

      <div className="flex-1 font-sans">
        <h3 className="font-heading font-[850] text-gray-900 text-lg leading-tight">{item.product.name}</h3>
        {item.variant ? <p className="text-xs text-brand-pink font-bold uppercase tracking-widest mt-1">{item.variant.type}: {item.variant.name}</p> : null}
        <div className="mt-3 flex justify-between items-center pr-4">
          <span className="text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-md font-bold">Qty: {item.quantity}</span>
          <span className="font-bold text-gray-900 text-lg">Rs. {getEffectivePrice(item.product)}</span>
        </div>
      </div>

      <button onClick={onRemove} className="text-gray-300 hover:text-brand-coral p-3 bg-gray-50 hover:bg-brand-coral/10 rounded-full transition-colors" aria-label="Remove item">
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}

export function CartDrawer() {
  const { cart, cartTotal, isCartOpen, setIsCartOpen, removeFromCart } = useShop();
  const navigate = useNavigate();

  const footer = cart.length > 0 ? (
    <div className="p-8 border-t border-gray-100 bg-gray-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between mb-8 font-bold text-xl font-sans">
        <span className="text-gray-900 uppercase tracking-widest">Total:</span>
        <span className="text-brand-pink text-2xl">Rs. {cartTotal}</span>
      </div>
      <button
        onClick={() => {
          setIsCartOpen(false);
          navigate('/checkout');
        }}
        className="w-full bg-gradient-to-r from-brand-pink to-brand-coral text-white py-5 rounded-xl font-bold uppercase tracking-widest font-sans hover:shadow-lg hover:-translate-y-1 hover:opacity-90 transition-all duration-300"
      >
        Proceed to Checkout
      </button>
    </div>
  ) : null;

  return (
    <DrawerShell isOpen={isCartOpen} title="Shopping Cart" onClose={() => setIsCartOpen(false)} footer={footer}>
      {cart.length === 0 ? <EmptyState message="Your cart is empty." /> : cart.map((item) => (
        <CartItem key={`${item.product.id}-${item.variant?.id || 'default'}`} item={item} onRemove={() => removeFromCart(item.product.id, item.variant?.id || 'default')} />
      ))}
    </DrawerShell>
  );
}
