import React, { useState } from 'react';
import { Sparkles, Copy, Check, Tag, ArrowRight, Gift } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { ProductCategory } from '../../types';

interface OffersSectionProps {
  onShopCategory: (category: ProductCategory | 'All') => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ onShopCategory }) => {
  const { offers } = useProducts();
  const { applyCoupon } = useCart();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-cream-100 to-cream-50 relative overflow-hidden">
      {/* Decorative Gold Rings */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full border-8 border-gold-300/20 pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full border-8 border-gold-300/20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-semibold uppercase tracking-wider mb-2 border border-rose-200">
            <Gift className="w-3.5 h-3.5 text-rose-600" />
            Exclusive Store & Online Deals
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-900 tracking-tight">
            Grab Our Best Offers
          </h2>
          <p className="text-sm text-chocolate-600 mt-2">
            Save extra with active promotional coupons for both retail purchases and Nagpur in-store shopping.
          </p>
        </div>

        {/* Offers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map(offer => (
            <div
              key={offer.id}
              className="group relative rounded-3xl overflow-hidden shadow-card hover:shadow-luxury transition-all duration-300 bg-chocolate-900 border border-gold-400/40 flex flex-col justify-between"
            >
              {/* Background Image with Dark Vignette */}
              {offer.image && (
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover opacity-25 group-hover:scale-105 group-hover:opacity-30 transition-all duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950 via-chocolate-900/90 to-chocolate-900/80"></div>
                </div>
              )}

              {/* Card Content */}
              <div className="relative z-10 p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-gold-500 text-chocolate-950 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow-sm">
                      {offer.badge}
                    </span>
                    <span className="text-[11px] text-gold-300 font-medium">
                      Min Order: ₹{offer.minOrderValue}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream-50 leading-tight mb-2">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-cream-300 leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                {/* Coupon Code Strip & Copy CTA */}
                <div className="pt-4 border-t border-chocolate-800/80 space-y-3">
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-chocolate-950/80 border border-gold-500/40">
                    <div className="flex items-center gap-2 pl-2">
                      <Tag className="w-3.5 h-3.5 text-gold-400" />
                      <span className="font-mono text-sm font-bold tracking-widest text-gold-300">
                        {offer.code}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(offer.code)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                        copiedCode === offer.code
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gold-500 hover:bg-gold-400 text-chocolate-950 shadow-sm'
                      }`}
                    >
                      {copiedCode === offer.code ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Applied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Tap to Apply</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Explore matching category link */}
                  <button
                    onClick={() => onShopCategory((offer.category as ProductCategory) || 'All')}
                    className="w-full text-center text-xs font-semibold text-gold-300 hover:text-gold-200 transition-colors flex items-center justify-center gap-1 group-hover:underline"
                  >
                    <span>Shop Eligible Products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
