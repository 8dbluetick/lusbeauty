import React, { useRef } from 'react';
import { Product } from '../../types';
import { ProductCard } from '../shop/ProductCard';
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface NewArrivalsProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onViewAllShop: () => void;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({
  products,
  onQuickView,
  onViewAllShop,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const newProducts = products.filter(p => p.isNewArrival || p.isTrending);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-cream-100/70 border-y border-gold-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Carousel Navigation Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-200/70 text-chocolate-900 text-xs font-semibold uppercase tracking-wider mb-2 border border-gold-400/40">
              <Sparkles className="w-3.5 h-3.5 text-gold-700" />
              Fresh Unboxings This Week
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-900 tracking-tight">
              Just Arrived ✨
            </h2>
            <p className="text-sm text-chocolate-600 mt-1">
              Be the first to explore our newest designer handbags, bridal jewellery, and skincare launches.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleScroll('left')}
              className="w-10 h-10 rounded-full bg-white hover:bg-gold-50 border border-gold-300/80 text-chocolate-800 flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95"
              aria-label="Previous items"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-10 h-10 rounded-full bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 flex items-center justify-center shadow-md hover:shadow-lg transition-all active:scale-95 border border-gold-500/30"
              aria-label="Next items"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {newProducts.map(product => (
            <div
              key={product.id}
              className="w-64 sm:w-72 lg:w-80 flex-shrink-0 snap-start"
            >
              <ProductCard product={product} onQuickView={onQuickView} />
            </div>
          ))}
        </div>

        {/* Bottom Explore Link */}
        <div className="text-center mt-6">
          <button
            onClick={onViewAllShop}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-chocolate-900 hover:text-gold-700 underline underline-offset-8 transition-colors"
          >
            <span>Explore All New Arrivals In Store</span>
            <ArrowRight className="w-4 h-4 text-gold-600" />
          </button>
        </div>
      </div>
    </section>
  );
};
