import { Star } from 'lucide-react';

export function StarRatingDisplay({ rating, size = 16 }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rating ? 'fill-brand-pink text-brand-pink' : 'text-white/20'}
        />
      ))}
    </div>
  );
}

export function StarRatingInput({ rating, onChange }) {
  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-colors hover:scale-110"
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            size={24}
            className={star <= rating ? 'fill-brand-pink text-brand-pink' : 'text-white/30 hover:text-brand-pink/50'}
          />
        </button>
      ))}
    </div>
  );
}
