import { useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { useShop } from '../context/useShop';
import { getEffectivePrice, getProductPrimaryImage } from '../lib/product-utils';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useShop();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const imageUrl = getProductPrimaryImage(product);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#1a1a1a] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full aspect-square rounded-2xl bg-gradient-to-tr from-brand-pink to-brand-coral flex items-center justify-center relative overflow-hidden mb-4">
          {imageUrl ? <img src={imageUrl} alt={product.name} className="absolute inset-0 h-full w-full object-cover" /> : null}
          {!imageUrl ? <span className="text-white font-bold uppercase tracking-widest text-lg">{product.name?.charAt(0)}</span> : null}
        </div>

        <h3 className="text-xl font-heading font-[850] text-white mb-1">{product.name}</h3>
        <p className="text-2xl font-bold text-brand-pink mb-3">Rs. {getEffectivePrice(product)}</p>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{product.description}</p>

        {product.variants.length > 0 ? (
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              {product.variants[0]?.type || 'Option'}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => {
                const isSelected = selectedVariant?.id === variant.id;
                return (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`border-2 rounded-xl py-1.5 px-3 text-xs font-bold uppercase font-sans transition-all duration-300 ${
                      isSelected
                        ? 'border-brand-pink text-brand-pink bg-brand-pink/5'
                        : 'border-white/20 text-gray-400 bg-transparent hover:border-brand-pink/40 hover:text-brand-pink'
                    }`}
                  >
                    {variant.name}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="flex items-center gap-3 mb-4">
          <div className="inline-flex items-center border-2 border-white/20 rounded-xl bg-transparent h-10">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 h-full text-gray-400 hover:text-brand-pink transition-colors" aria-label="Decrease quantity">-</button>
            <span className="h-full flex w-8 items-center justify-center font-bold text-sm text-white">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="px-3 h-full text-gray-400 hover:text-brand-pink transition-colors" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <button
          onClick={() => { selectedVariant && addToCart(product, selectedVariant, quantity); onClose(); }}
          className="w-full bg-gradient-to-r from-brand-pink to-brand-coral text-white rounded-xl py-3 flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-sans uppercase tracking-widest gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
