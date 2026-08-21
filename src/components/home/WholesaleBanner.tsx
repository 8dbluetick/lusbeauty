import React from 'react';
import { Sparkles, Building2, PackageCheck, Truck, ArrowRight, Percent } from 'lucide-react';

interface WholesaleBannerProps {
  onOpenWholesale: () => void;
}

export const WholesaleBanner: React.FC<WholesaleBannerProps> = ({ onOpenWholesale }) => {
  return (
    <section className="py-12 sm:py-16 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-chocolate-950 via-chocolate-900 to-chocolate-950 text-cream-100 p-8 sm:p-12 lg:p-14 border-2 border-gold-400/50 shadow-luxury">
          {/* Subtle Decorative Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold uppercase tracking-wider border border-gold-500/40">
                <Building2 className="w-3.5 h-3.5" />
                B2B Bulk Purchase & Salon Supply
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-cream-50 leading-tight">
                Retail & Wholesale Available
              </h2>

              <p className="text-sm sm:text-base text-cream-300 max-w-2xl leading-relaxed">
                Are you a salon owner, makeup artist, boutique retailer, or reselling entrepreneur in Vidarbha / Maharashtra? Get direct wholesale carton pricing, customized bridal bundles, and GST invoicing.
              </p>

              {/* Wholesale Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-chocolate-900/80 border border-gold-500/20">
                  <Percent className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <div>
                    <strong className="text-xs text-cream-100 font-bold block">Up to 60% Margin</strong>
                    <span className="text-[11px] text-cream-400">Competitive bulk rates</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-chocolate-900/80 border border-gold-500/20">
                  <PackageCheck className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <div>
                    <strong className="text-xs text-cream-100 font-bold block">Low Minimum MOQs</strong>
                    <span className="text-[11px] text-cream-400">Mix & match options</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-chocolate-900/80 border border-gold-500/20">
                  <Truck className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <div>
                    <strong className="text-xs text-cream-100 font-bold block">Nagpur Fast Dispatch</strong>
                    <span className="text-[11px] text-cream-400">Doorstep delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right CTA Box */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <div className="bg-cream-50 text-chocolate-950 p-6 sm:p-7 rounded-2xl border-2 border-gold-400 shadow-xl text-center space-y-4 max-w-sm w-full">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-700 block">
                  Wholesale Enquiry Portal
                </span>
                <h4 className="font-serif text-xl font-bold text-chocolate-900 leading-snug">
                  Get Instant B2B Rate Sheet
                </h4>
                <p className="text-xs text-chocolate-600">
                  Submit your business requirements or connect directly on WhatsApp with our wholesale manager.
                </p>

                <button
                  onClick={onOpenWholesale}
                  className="w-full py-3.5 px-6 rounded-xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 group border border-gold-500"
                >
                  <span>Contact Us for Wholesale</span>
                  <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
