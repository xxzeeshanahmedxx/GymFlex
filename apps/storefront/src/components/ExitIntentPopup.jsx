import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const STORAGE_KEY = 'gymflex_exit_popup_shown';

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { }
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch { return; }

    let timeout = null;
    const handleMouseLeave = (e) => {
      if (e.clientY > 0) return;
      if (timeout) return;
      timeout = setTimeout(() => {
        setVisible(true);
      }, 300);
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="exit-intent-overlay" onClick={dismiss}>
      <div className="exit-intent-modal" onClick={(e) => e.stopPropagation()}>
        <button className="exit-intent-close" onClick={dismiss} aria-label="Close"><X size={20} /></button>
        <div className="exit-intent-content">
          <span className="exit-intent-badge">SPECIAL OFFER</span>
          <h2 className="exit-intent-title">Wait! Don&apos;t miss out</h2>
          <p className="exit-intent-text">Get exclusive discounts on your first order. Shop our latest collection today!</p>
          <Link to="/sale" className="exit-intent-cta" onClick={dismiss}>
            Shop Sale Now
          </Link>
          <p className="exit-intent-small">Limited time offer · No code needed</p>
        </div>
      </div>
    </div>
  );
}