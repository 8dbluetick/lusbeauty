import React, { useState } from 'react';
import { MapPin, Phone, Sparkles, X, Truck, ShieldCheck } from 'lucide-react';
import { STORE_INFO } from '../../data/storeInfo';

interface AnnouncementProps {
  onOpenWholesale: () => void;
}

export const Announcement: React.FC<AnnouncementProps> = ({ onOpenWholesale }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside aria-label="Store Announcement" className="bg-chocolate-900 text-cream-100 text-xs py-2 px-4 border-b border-gold-600/30 relative z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
        {/* Left: Physical Store Landmark in Nagpur */}
        <div className="flex items-center gap-2 justify-center md:justify-start">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-medium text-[11px] border border-gold-500/30">
            <MapPin className="w-3 h-3 text-gold-400" />
            Nagpur Store
          </span>
          <span className="text-cream-200 hidden sm:inline">
            Near Lad Sq., Metro Pillar 213-214, North Ambazari Rd
          </span>
          <a
            href={`tel:${STORE_INFO.phone}`}
            className="text-gold-300 hover:text-gold-200 font-semibold inline-flex items-center gap-1 underline underline-offset-2 ml-1"
          >
            <Phone className="w-2.5 h-2.5" />
            {STORE_INFO.phone}
          </a>
        </div>

        {/* Center: Promo & Perks */}
        <div className="flex items-center gap-4 text-cream-300 text-[11px] sm:text-xs">
          <span className="inline-flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-gold-400" />
            Free Nagpur Delivery on ₹499+
          </span>
          <span className="hidden lg:inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            100% Authentic Quality
          </span>
        </div>

        {/* Right: B2B Wholesale Quote CTA & Dismiss */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenWholesale}
            className="inline-flex items-center gap-1 bg-gold-500 hover:bg-gold-400 text-chocolate-950 font-bold px-2.5 py-0.5 rounded text-[11px] transition-all transform hover:scale-105 shadow-sm"
          >
            <Sparkles className="w-3 h-3" />
            Wholesale Pricing
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-cream-400 hover:text-cream-100 p-0.5 ml-1 transition-colors"
            title="Dismiss top banner"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
