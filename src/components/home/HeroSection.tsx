import React from 'react';
import { ArrowRight, Sparkles, MapPin, ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';
import { STORE_INFO } from '../../data/storeInfo';

interface HeroSectionProps {
  onShopClick: () => void;
  onOffersClick: () => void;
  onStoreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopClick,
  onOffersClick,
  onStoreClick,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-beige-50 pt-8 pb-16 lg:pt-12 lg:pb-24">
      {/* Decorative luxury background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-200/30 rounded-full blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-beige-200/40 rounded-full blur-2xl pointer-events-none -z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Nagpur Physical Store Callout Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-50/90 border border-gold-400/50 shadow-soft text-chocolate-800 text-xs font-semibold backdrop-blur-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-600"></span>
              </span>
              <MapPin className="w-3.5 h-3.5 text-gold-600" />
              <span>Nagpur Premier Store • Gandhi Nagar (Near Lad Sq.)</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-chocolate-900 leading-[1.15] tracking-tight">
              Beauty, Style & <br />
              <span className="font-serif italic font-normal text-gold-600 bg-gradient-to-r from-gold-600 via-gold-500 to-amber-700 bg-clip-text text-transparent">
                Everything You Love.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-chocolate-700 max-w-xl font-normal leading-relaxed mx-auto lg:mx-0">
              Discover skincare, cosmetics, jewellery, handbags and accessories — all under one roof at Nagpur’s trusted beauty & fashion landmark.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onShopClick}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 font-semibold text-sm tracking-wide shadow-luxury hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group border border-gold-500/40"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOffersClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-cream-50 hover:bg-gold-50 text-chocolate-900 font-semibold text-sm tracking-wide border border-gold-400/60 shadow-soft hover:border-gold-500 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-gold-600" />
                <span>View Offers</span>
              </button>

              <button
                onClick={onStoreClick}
                className="w-full sm:w-auto px-5 py-3.5 text-chocolate-700 hover:text-gold-700 font-medium text-xs tracking-wide transition-colors flex items-center justify-center gap-1.5 underline underline-offset-4"
              >
                <MapPin className="w-3.5 h-3.5 text-gold-600" />
                <span>Visit Store</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 grid grid-cols-3 gap-3 border-t border-gold-200/60 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-600 flex-shrink-0" />
                <span className="text-[11px] font-medium text-chocolate-800 leading-tight">
                  100% Genuine Brands
                </span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-gold-600 flex-shrink-0" />
                <span className="text-[11px] font-medium text-chocolate-800 leading-tight">
                  Retail & Wholesale
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-600 flex-shrink-0" />
                <span className="text-[11px] font-medium text-chocolate-800 leading-tight">
                  Pillar 213-214 Metro
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Lifestyle Product Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Lifestyle Hero Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 aspect-[4/5] group">
                <img
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop"
                  alt="Lush Beauty Mart Collection - Cosmetics, Jewellery & Handbags"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950/80 via-transparent to-transparent"></div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-gold-200 shadow-luxury">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gold-700">
                        Nagpur Flagship Store
                      </p>
                      <h4 className="font-serif text-sm sm:text-base font-bold text-chocolate-900">
                        Skincare • Makeup • Jewellery • Bags
                      </h4>
                      <p className="text-[11px] text-chocolate-600">
                        Retail & Wholesale Available Daily
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gold-500 text-chocolate-950 flex items-center justify-center font-serif font-bold text-sm shadow-md flex-shrink-0 ml-2">
                      ✨
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Miniature Highlights */}
              <div className="absolute -top-4 -left-4 sm:-left-6 p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-card border border-gold-200 hidden sm:flex items-center gap-3 animate-pulse-subtle">
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200&auto=format&fit=crop"
                  alt="Kundan Jewellery"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gold-600 block">
                    Festive Jewellery
                  </span>
                  <p className="text-xs font-bold text-chocolate-900">Kundan & AD Sets</p>
                  <span className="text-[10px] text-emerald-700 font-semibold">In Store & Online</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 sm:-right-6 p-3 rounded-2xl bg-chocolate-900 text-cream-100 shadow-luxury border border-gold-500/40 hidden sm:flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=200&auto=format&fit=crop"
                  alt="Luxury Handbag"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gold-400 block">
                    Trending Handbags
                  </span>
                  <p className="text-xs font-bold text-cream-50">Sling & Tote Bags</p>
                  <span className="text-[10px] text-gold-300 font-medium">Flat 30% OFF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
