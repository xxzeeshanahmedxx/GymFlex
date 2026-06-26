import { useState } from 'react';
import { Link } from 'react-router-dom';
import { footerSections } from '../data/navigation';

export default function Footer() {
  const [nEmail, setNEmail] = useState('');
  const [nStatus, setNStatus] = useState('');
  const [nLoading, setNLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setNLoading(true);
    setNStatus('');
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: nEmail }) });
      const data = await res.json();
      if (!res.ok) { setNStatus(data.error || 'Failed'); } else { setNStatus('Subscribed!'); setNEmail(''); }
    } catch { setNStatus('Network error'); }
    setNLoading(false);
  };

  return (
    <footer className="font-sans mt-auto bg-[#0d0d0d] text-gray-300 border-t border-brand-pink/20">
      <div className="h-1 w-full bg-gradient-to-r from-brand-pink to-brand-coral"></div>

      <div className="pt-8 pb-5 sm:pt-14 sm:pb-8">
        <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 sm:gap-10 mb-6 sm:mb-10">
            <div>
              <Link to="/" className="text-xl sm:text-2xl font-heading font-[850] tracking-widest text-white mb-2 sm:mb-4 block hover:text-brand-pink transition-colors">GYMFLEX</Link>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3">
                Premium gym wear engineered for performance. Train harder, look better.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input type="email" value={nEmail} onChange={(e) => setNEmail(e.target.value)} placeholder="Your email" required className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink" />
                <button type="submit" disabled={nLoading} className="bg-brand-pink hover:bg-brand-pink/80 text-black text-xs font-bold px-3 py-1.5 rounded transition-colors whitespace-nowrap">{nLoading ? '...' : 'Subscribe'}</button>
              </form>
              {nStatus ? <p className="text-[11px] mt-1 text-brand-coral">{nStatus}</p> : null}
            </div>

            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-heading font-[850] text-sm sm:text-lg mb-2 sm:mb-4 tracking-wider uppercase text-white">
                  {section.title}
                </h3>
                <ul className="space-y-1.5 sm:space-y-3">
                  {section.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="text-gray-400 hover:text-brand-pink transition-colors text-xs sm:text-sm">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-brand-pink/20 pt-4 sm:pt-6 text-center md:flex md:justify-between md:text-left">
            <p className="text-gray-500 text-xs sm:text-sm">&copy; {new Date().getFullYear()} GymFlex. All rights reserved.</p>
            <p className="text-gray-600 text-[11px] sm:text-xs mt-1 sm:mt-2 md:mt-0">Shipping across Pakistan · Prices in PKR · Cash on Delivery</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
