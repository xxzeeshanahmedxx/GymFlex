import { useState } from 'react';
import { Camera, Sparkles, X } from 'lucide-react';

export default function TryOnModal({ product, onClose }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-3xl bg-[#111] border border-white/10 p-6 shadow-2xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"><X size={20} /></button>

        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-brand-pink" size={22} />
          <h2 className="text-xl font-heading font-[850] text-white uppercase tracking-widest">Virtual Try-On</h2>
        </div>

        <p className="text-gray-400 text-sm mb-4">Upload a photo of yourself and see how &ldquo;{product.name}&rdquo; would look on you!</p>

        <div className="rounded-2xl border-2 border-dashed border-white/20 bg-black/40 p-8 text-center mb-4">
          {preview ? (
            <div className="relative">
              <img src={preview} alt="Your photo" className="max-h-64 mx-auto rounded-xl object-cover" />
              <button onClick={() => { setFile(null); setPreview(null); }} className="mt-3 text-xs text-brand-pink hover:underline font-bold uppercase tracking-widest">Remove</button>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center gap-2">
              <Camera size={32} className="text-gray-500" />
              <span className="text-sm text-gray-400 font-bold uppercase tracking-widest">Upload your photo</span>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
          )}
        </div>

        <div className="rounded-xl bg-amber-500/10 px-4 py-3 text-xs text-amber-400 font-semibold text-center">
          Coming soon! Our AI-powered try-on is being trained. For now, uploading helps us improve.
        </div>
      </div>
    </div>
  );
}