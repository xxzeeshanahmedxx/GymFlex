import { Link } from 'react-router-dom';
import { Heart, House, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/useShop';

export default function BottomNav() {
  const { wishlist, cartCount, setIsCartOpen } = useShop();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d0d] border-t border-white/10 sm:hidden flex justify-around items-center h-16 px-2 pb-1 safe-area-bottom">
      <Link to="/" className="flex flex-col items-center text-white/60 hover:text-brand-pink transition-colors gap-0.5">
        <House className="w-5 h-5" />
        <span className="text-[10px] font-bold">Home</span>
      </Link>
      <Link to="/shop" className="flex flex-col items-center text-white/60 hover:text-brand-pink transition-colors gap-0.5">
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[10px] font-bold">Shop</span>
      </Link>
      <Link to="/wishlist" className="flex flex-col items-center text-white/60 hover:text-brand-pink transition-colors gap-0.5 relative">
        <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-brand-pink' : ''}`} />
        {wishlist.length > 0 ? <span className="absolute -top-0.5 right-0.5 min-w-[14px] h-3.5 flex items-center justify-center rounded-full bg-brand-pink text-black text-[8px] font-bold px-1 leading-none">{wishlist.length}</span> : null}
        <span className="text-[10px] font-bold">Wishlist</span>
      </Link>
      <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center text-white/60 hover:text-brand-pink transition-colors gap-0.5 relative">
        <ShoppingBag className="w-5 h-5" />
        {cartCount > 0 ? <span className="absolute -top-0.5 -right-1.5 min-w-[14px] h-3.5 flex items-center justify-center rounded-full bg-brand-pink text-black text-[8px] font-bold px-1 leading-none">{cartCount}</span> : null}
        <span className="text-[10px] font-bold">Cart</span>
      </button>
    </nav>
  );
}
