import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useShop } from '../context/useShop';
import { usePageTitle } from '../hooks/usePageTitle';
import { getEffectivePrice, getProductPrimaryImage } from '../lib/product-utils';

export default function ComparePage() {
  const { compareList, toggleCompare } = useShop();
  usePageTitle('Compare Products');

  if (compareList.length < 2) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-32">
        <h1 className="text-3xl font-heading font-[850] text-white mb-3 uppercase tracking-widest">Compare Products</h1>
        <p className="text-gray-400 mb-8">Add at least 2 products to compare.</p>
        <Link to="/shop" className="px-8 py-4 bg-gradient-to-r from-brand-pink to-brand-coral text-black font-bold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          Browse Products
        </Link>
      </div>
    );
  }

  const attributes = [
    { label: 'Price', getValue: (p) => `Rs. ${getEffectivePrice(p)}` },
    { label: 'Category', getValue: (p) => p.category || '—' },
    { label: 'Description', getValue: (p) => p.description || '—' },
  ];

  return (
    <div className="flex-grow w-full bg-[#0a0a0a] min-h-screen">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-pink transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>

        <h1 className="text-3xl font-heading font-[850] text-white mb-8 uppercase tracking-widest">Compare Products</h1>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="w-32 pb-4 pr-4" />
                {compareList.map((product) => (
                  <th key={product.id} className="pb-4 pr-4 last:pr-0">
                    <div className="text-center">
                      <button onClick={() => toggleCompare(product)} className="text-xs text-gray-500 hover:text-red-400 transition-colors mb-2 block mx-auto">Remove</button>
                      <div className="w-24 h-24 mx-auto rounded-xl bg-gradient-to-tr from-brand-pink to-brand-coral overflow-hidden mb-2">
                        {getProductPrimaryImage(product) ? <img src={getProductPrimaryImage(product)} alt={product.name} className="h-full w-full object-cover" /> : null}
                      </div>
                      <Link to={`/product/${product.slug || product.id}`} className="text-sm font-bold text-white hover:text-brand-pink transition-colors block">
                        {product.name}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attributes.map((attr) => (
                <tr key={attr.label} className="border-t border-white/10">
                  <td className="py-3 pr-4 text-sm font-bold text-gray-400 uppercase tracking-widest">{attr.label}</td>
                  {compareList.map((product) => (
                    <td key={product.id} className="py-3 pr-4 last:pr-0 text-sm text-gray-300">
                      {attr.getValue(product)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
