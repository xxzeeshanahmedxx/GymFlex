import { useCallback, useEffect, useState } from 'react';
import { Copy, Check, Gift, Share2 } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'REF-';
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

export default function ReferralPage() {
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  usePageTitle('Refer a Friend');

  useEffect(() => {
    let stored = '';
    try { stored = localStorage.getItem('gymflex_referral_code') || ''; } catch { }
    if (!stored) {
      stored = generateReferralCode();
      try { localStorage.setItem('gymflex_referral_code', stored); } catch { }
    }
    setCode(stored);
  }, []);

  const referralLink = `${window.location.origin}?ref=${code}`;

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { }
  }, [referralLink]);

  const shareLink = useCallback(async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'GymFlex Referral', text: 'Get exclusive discounts! Shop at GymFlex using my referral link:', url: referralLink }); } catch { }
    } else {
      copyLink();
    }
  }, [referralLink, copyLink]);

  return (
    <div className="flex-grow bg-white px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl animate-fade-in-up text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-brand-pink/10 text-brand-pink">
          <Gift className="h-8 w-8" />
        </div>
        <h1 className="font-heading text-4xl font-[850] uppercase tracking-widest text-gray-900 mb-3">Refer a Friend</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Share your referral link and earn discounts when your friends make their first purchase!</p>

        <div className="rounded-3xl border border-white/10 bg-[#111] p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Your Referral Code</p>
            <div className="inline-flex items-center gap-3 rounded-2xl bg-brand-pink/10 px-6 py-3 border border-brand-pink/20">
              <span className="font-heading text-2xl font-[850] tracking-widest text-brand-pink">{code}</span>
              <button onClick={copyLink} className="rounded-xl bg-brand-pink px-3 py-2 text-black text-sm font-bold transition hover:bg-brand-pink/90" title="Copy link">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-[#1a1a1a] p-4 mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Share your link</p>
            <div className="flex items-center gap-2">
              <input readOnly value={referralLink} className="flex-1 rounded-xl border border-white/20 bg-black/50 px-3 py-2.5 text-sm text-white outline-none" onClick={(e) => e.target.select()} />
              <button onClick={shareLink} className="rounded-xl bg-gradient-to-r from-brand-pink to-brand-coral px-4 py-2.5 text-sm font-bold text-black" title="Share">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="rounded-xl bg-white/5 p-4 border border-white/10">
              <p className="font-heading text-2xl font-[850] text-brand-pink mb-1">1</p>
              <p className="text-sm font-bold text-white">Share your referral link</p>
              <p className="text-xs text-gray-400 mt-1">Send it to your friends via WhatsApp, email, or social media</p>
            </div>
            <div className="rounded-xl bg-white/5 p-4 border border-white/10">
              <p className="font-heading text-2xl font-[850] text-brand-pink mb-1">2</p>
              <p className="text-sm font-bold text-white">Friend shops</p>
              <p className="text-xs text-gray-400 mt-1">They place their first order using your referral link</p>
            </div>
            <div className="rounded-xl bg-white/5 p-4 border border-white/10">
              <p className="font-heading text-2xl font-[850] text-brand-pink mb-1">3</p>
              <p className="text-sm font-bold text-white">You earn rewards</p>
              <p className="text-xs text-gray-400 mt-1">Get discount credits applied to your next order</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}