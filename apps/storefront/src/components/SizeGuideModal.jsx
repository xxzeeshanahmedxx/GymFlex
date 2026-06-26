import { X } from 'lucide-react';

const sizeCharts = {
  default: {
    title: 'Size Guide',
    rows: [
      { size: 'XS', chest: '34"', waist: '28"', hips: '34"' },
      { size: 'S', chest: '36"', waist: '30"', hips: '36"' },
      { size: 'M', chest: '38"', waist: '32"', hips: '38"' },
      { size: 'L', chest: '40"', waist: '34"', hips: '40"' },
      { size: 'XL', chest: '42"', waist: '36"', hips: '42"' },
      { size: '2XL', chest: '44"', waist: '38"', hips: '44"' },
    ],
  },
};

export default function SizeGuideModal({ category, onClose }) {
  const chart = sizeCharts[category] || sizeCharts.default;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#1a1a1a] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-heading font-[850] text-white">{chart.title}</h3>
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2 pr-4 text-sm font-bold text-brand-pink uppercase tracking-widest">Size</th>
                <th className="py-2 pr-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Chest</th>
                <th className="py-2 pr-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Waist</th>
                <th className="py-2 text-sm font-bold text-gray-400 uppercase tracking-widest">Hips</th>
              </tr>
            </thead>
            <tbody>
              {chart.rows.map((row) => (
                <tr key={row.size} className="border-b border-white/5">
                  <td className="py-3 pr-4 font-bold text-white">{row.size}</td>
                  <td className="py-3 pr-4 text-gray-400">{row.chest}</td>
                  <td className="py-3 pr-4 text-gray-400">{row.waist}</td>
                  <td className="py-3 text-gray-400">{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-gray-500">Measurements are in inches. If between sizes, size up for a relaxed fit.</p>
      </div>
    </div>
  );
}
