import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/useShop';
import { getEffectivePrice, getProductPath, getProductPrimaryImage } from '../lib/product-utils';

export default function CompareBar() {
  const { compareList, toggleCompare, clearCompare } = useShop();

  if (compareList.length < 2) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d0d] border-t border-brand-pink/20 shadow-2xl px-4 py-3 sm:px-6">
      <div className="max-w-[88rem] mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar">
          {compareList.map((product) => (
            <div key={product.id} className="flex items-center gap-2 shrink-0 bg-[#1a1a1a] rounded-xl px-3 py-2 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-brand-pink to-brand-coral overflow-hidden shrink-0">
                {getProductPrimaryImage(product) ? <img src={getProductPrimaryImage(product)} alt={product.name} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="min-w-0 max-w-[100px]">
                <p className="text-xs font-bold text-white truncate">{product.name}</p>
                <p className="text-[11px] text-brand-pink">Rs. {getEffectivePrice(product)}</p>
              </div>
              <button onClick={() => toggleCompare(product)} className="text-gray-500 hover:text-white transition-colors p-0.5">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button onClick={clearCompare} className="text-xs text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-widest">
            Clear all
          </button>
          <Link to="/compare" className="px-4 py-2 rounded-xl bg-brand-pink text-black text-xs font-bold uppercase tracking-widest hover:bg-brand-green-dark transition-colors whitespace-nowrap">
            Compare ({compareList.length})
          </Link>
        </div>
      </div>
    </div>
  );
}
