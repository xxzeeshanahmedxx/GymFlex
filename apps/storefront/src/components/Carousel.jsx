import { Children, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Carousel({
  children,
  itemWidth = 'w-[80%] sm:w-[46%] lg:w-[22.5%]',
  maxItems = 6,
  centerWhenShort = true,
  centerThreshold = 4,
}) {
  const ref = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const items = Children.toArray(children).slice(0, maxItems);
  const shouldCenterDesktop = centerWhenShort && items.length <= centerThreshold;

  const update = () => {
    const element = ref.current;
    if (!element) return;
    const hasOverflow = element.scrollWidth > element.clientWidth + 8;
    setCanLeft(hasOverflow && element.scrollLeft > 8);
    setCanRight(hasOverflow && element.scrollLeft + element.clientWidth < element.scrollWidth - 8);
  };

  useEffect(() => {
    update();
    const element = ref.current;
    if (!element) return undefined;
    element.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      element.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [items.length]);

  const move = (direction) => {
    const element = ref.current;
    if (!element) return;
    element.scrollBy({ left: direction * element.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <div className="store-carousel relative">
      <div
        ref={ref}
        className={`store-carousel-track flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar ${shouldCenterDesktop ? 'sm:justify-center' : ''}`}
      >
        {items.map((child, index) => (
          <div key={index} className={`snap-start shrink-0 ${itemWidth}`}>
            {child}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => move(-1)}
        disabled={!canLeft}
        aria-label="Previous products"
        className="hidden sm:flex absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white shadow-xl border border-gray-100 items-center justify-center text-gray-700 hover:bg-brand-pink hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => move(1)}
        disabled={!canRight}
        aria-label="Next products"
        className="hidden sm:flex absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white shadow-xl border border-gray-100 items-center justify-center text-gray-700 hover:bg-brand-pink hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
