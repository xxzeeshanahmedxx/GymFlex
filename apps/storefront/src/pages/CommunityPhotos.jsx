import { useEffect, useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';

export function CommunityPhotos() {
  usePageTitle('Community Photos');
  const [photos, setPhotos] = useState([]);
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/community-photos').then((r) => r.json()).then((data) => { if (!cancelled) setPhotos(data.photos || []); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setMsg(''); setErr('');
    try {
      const res = await fetch('/api/community-photos', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ image_url: imageUrl, email, caption }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setMsg('Photo submitted for approval!');
      setImageUrl(''); setEmail(''); setCaption('');
    } catch (error) { setErr(error.message); }
  };

  return (
    <main className="flex-grow bg-white px-4 py-14 sm:py-20">
      <section className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-pink text-center">Community</p>
        <h1 className="mt-3 font-heading text-4xl font-[850] text-gray-900 text-center">GymFlex Community Wall</h1>
        <p className="text-gray-500 text-center mt-2 mb-10">Share your fitness journey with us!</p>

        <form onSubmit={handleUpload} className="max-w-md mx-auto mb-12 p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="font-heading font-[850] text-lg text-gray-900">Submit your photo</h2>
          <label className="block text-sm font-bold text-gray-700">Image URL <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-pink" placeholder="https://..." required /></label>
          <label className="block text-sm font-bold text-gray-700">Email <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-pink" required /></label>
          <label className="block text-sm font-bold text-gray-700">Caption <input value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-pink" /></label>
          <button type="submit" className="w-full px-6 py-2.5 rounded-xl bg-brand-pink text-white text-sm font-bold uppercase tracking-widest hover:bg-brand-pink/80 transition-colors">Submit</button>
          {msg ? <p className="text-green-600 text-sm">{msg}</p> : null}
          {err ? <p className="text-red-500 text-sm">{err}</p> : null}
        </form>

        {photos.length === 0 ? (
          <p className="text-gray-400 text-center">No photos yet. Be the first to share!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <img src={photo.image_url} alt={photo.caption || 'Community photo'} className="w-full aspect-square object-cover" loading="lazy" />
                {photo.caption ? <p className="p-2 text-xs text-gray-600">{photo.caption}</p> : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}