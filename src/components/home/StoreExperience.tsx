import React from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Navigation, 
  Clock, 
  Train, 
  Sparkles,
  ExternalLink,
  Store
} from 'lucide-react';
import { STORE_INFO } from '../../data/storeInfo';

export const StoreExperience: React.FC = () => {
  const openGoogleMaps = () => {
    window.open(STORE_INFO.googleMapsUrl, '_blank');
  };

  const callStore = () => {
    window.location.href = `tel:${STORE_INFO.phone}`;
  };

  const chatWhatsApp = () => {
    const msg = `Hi Lush Beauty Mart Nagpur! I am planning to visit your store at Lad Square today. Can you please confirm if you are open?`;
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section id="store-section" className="py-16 sm:py-24 bg-cream-50 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-gold-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold-100 text-gold-900 text-xs font-semibold uppercase tracking-wider mb-3 border border-gold-300/60 shadow-sm">
            <Store className="w-3.5 h-3.5 text-gold-700" />
            Flagship Experience Center
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-chocolate-900 tracking-tight">
            Visit Lush Beauty Mart
          </h2>
          <p className="text-base text-chocolate-700 mt-3 max-w-2xl mx-auto leading-relaxed">
            Explore our collection in-store and discover beauty, jewellery, handbags and accessories all in one place in the heart of Nagpur.
          </p>
        </div>

        {/* Store Highlight Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Store Interior & Showcase */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-card border-2 border-white bg-chocolate-900 flex flex-col justify-end min-h-[400px] lg:min-h-[480px]">
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop"
              alt="Lush Beauty Mart Nagpur Store Interior"
              className="absolute inset-0 w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950/95 via-chocolate-950/50 to-transparent"></div>

            <div className="relative z-10 p-6 sm:p-8 space-y-3">
              <span className="px-3 py-1 rounded-full bg-gold-500 text-chocolate-950 text-xs font-bold uppercase tracking-wider inline-block">
                In-Store Shopping & Wholesale Testing
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                A True Beauty Sanctuary in Nagpur
              </h3>
              <p className="text-xs sm:text-sm text-cream-200 leading-relaxed">
                Walk through our dedicated aisles for bridal jewellery, everyday cosmetics, dermatological skincare, and designer bags. Our beauty experts will guide you to find the perfect match.
              </p>
              <div className="flex items-center gap-4 text-gold-300 text-xs font-semibold pt-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Live Product Tester Counters
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Instant Bulk Wholesale Billing
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Style Interactive Location Card */}
          <div className="lg:col-span-6 rounded-3xl bg-white border border-gold-200 shadow-card p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Header with Landmark Pills */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cream-200">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-chocolate-900">
                    Lush Beauty Mart
                  </h3>
                  <p className="text-xs text-chocolate-500 font-medium mt-0.5">
                    Gandhi Nagar, North Ambazari Road, Nagpur
                  </p>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Open Today (10:30 AM - 9:30 PM)
                </div>
              </div>

              {/* Address with Landmark Callouts */}
              <div className="space-y-3.5 text-xs sm:text-sm text-chocolate-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-gold-100 text-gold-800 flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-chocolate-950 font-bold block text-sm">
                      Store Address:
                    </strong>
                    <p className="text-chocolate-700 leading-relaxed mt-0.5">
                      Below Hotel Maitrayee, Near Lad Square,<br />
                      North Ambazari Road, Gandhi Nagar,<br />
                      Nagpur, Maharashtra – 440 010
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-800 flex-shrink-0 mt-0.5">
                    <Train className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-chocolate-950 font-bold block text-sm">
                      Metro Landmark:
                    </strong>
                    <p className="text-purple-900 font-semibold mt-0.5">
                      Directly opposite Metro Station Pillar No. 213 & 214
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800 flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-chocolate-950 font-bold block text-sm">
                      Store Timings:
                    </strong>
                    <p className="text-chocolate-700 mt-0.5">
                      Monday to Sunday: 10:30 AM – 9:30 PM (All 7 Days Open)
                    </p>
                  </div>
                </div>
              </div>

              {/* Simulated Visual Mini Map Card */}
              <div
                onClick={openGoogleMaps}
                className="relative rounded-2xl overflow-hidden border border-gold-300/80 aspect-[16/6] bg-cream-200 cursor-pointer group shadow-inner"
              >
                <div className="absolute inset-0 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:16px_16px] opacity-40 bg-cream-100"></div>
                <div className="absolute inset-0 flex items-center justify-center bg-chocolate-950/20 group-hover:bg-chocolate-950/10 transition-colors">
                  <div className="px-4 py-2 rounded-xl bg-white shadow-luxury text-chocolate-900 text-xs font-bold flex items-center gap-2 border border-gold-300 transform group-hover:scale-105 transition-transform">
                    <MapPin className="w-4 h-4 text-rose-600 fill-rose-500 animate-bounce" />
                    <span>View on Google Maps (Lad Square)</span>
                    <ExternalLink className="w-3.5 h-3.5 text-chocolate-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Call, WhatsApp, Directions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-cream-200">
              <button
                onClick={callStore}
                className="py-3 px-4 rounded-xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Phone className="w-4 h-4 text-gold-400" />
                <span>Call Store</span>
              </button>

              <button
                onClick={chatWhatsApp}
                className="py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </button>

              <button
                onClick={openGoogleMaps}
                className="py-3 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-chocolate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
