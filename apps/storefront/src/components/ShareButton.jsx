import { useState } from 'react';
import { Share2 } from 'lucide-react';

export default function ShareButton({ title, text, url }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard not available
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition-colors relative"
      aria-label="Share product"
    >
      {copied ? (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2.5 py-1 rounded-md whitespace-nowrap shadow-lg">
          Link copied!
        </span>
      ) : null}
      <Share2 className="w-4 h-4" />
    </button>
  );
}
