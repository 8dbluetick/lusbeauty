import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Clock, 
  MessageCircle,
  CreditCard,
  ArrowUpRight
} from 'lucide-react';
import { STORE_INFO } from '../../data/storeInfo';
import { ProductCategory } from '../../types';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onSelectCategory: (category: ProductCategory) => void;
  onOpenWholesale: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  onSelectCategory,
  onOpenWholesale,
  onOpenAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-chocolate-900 text-cream-200 pt-16 pb-24 lg:pb-12 border-t-2 border-gold-600/40 relative">
      {/* Decorative Gold Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-600 via-gold-300 to-gold-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-chocolate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-cream-100 uppercase tracking-wider">Nagpur Store</h5>
              <p className="text-[11px] text-cream-400">Gandhi Nagar, Lad Square</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-cream-100 uppercase tracking-wider">Premium Quality</h5>
              <p className="text-[11px] text-cream-400">100% Guaranteed Authentic</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-cream-100 uppercase tracking-wider">Nagpur & Pan India</h5>
              <p className="text-[11px] text-cream-400">Fast doorstep delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-cream-100 uppercase tracking-wider">Open 7 Days</h5>
              <p className="text-[11px] text-cream-400">10:30 AM to 9:30 PM</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold text-cream-50 tracking-wider">
                  LUSH
                </span>
                <span className="font-serif text-2xl font-light text-gold-400 tracking-widest">
                  BEAUTY MART
                </span>
              </div>
              <p className="font-serif italic text-gold-300 text-sm mt-1">
                “Where Beauty Meets Quality”
              </p>
            </div>

            <p className="text-xs text-cream-300 leading-relaxed max-w-md">
              Nagpur’s premier retail and wholesale destination for luxury skincare, high-definition cosmetics, authentic artificial jewellery, designer handbags, and beauty accessories.
            </p>

            <div className="pt-2">
              <h5 className="text-[11px] font-bold text-gold-400 uppercase tracking-wider mb-2">
                Follow Us Online
              </h5>
              <div className="flex items-center gap-3">
                <a
                  href={`https://instagram.com/${STORE_INFO.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-chocolate-800 hover:bg-gold-600 hover:text-chocolate-950 flex items-center justify-center transition-colors text-cream-200 border border-gold-500/30"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-chocolate-800 hover:bg-gold-600 hover:text-chocolate-950 flex items-center justify-center transition-colors text-cream-200 border border-gold-500/30"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${STORE_INFO.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-chocolate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors text-cream-200 border border-gold-500/30"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-gold-300 tracking-wider uppercase border-b border-chocolate-800 pb-2">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-cream-300">
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Skincare');
                    setActiveTab('shop');
                    scrollToTop();
                  }}
                  className="hover:text-gold-400 transition-colors"
                >
                  Skincare & Serums
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Cosmetics');
                    setActiveTab('shop');
                    scrollToTop();
                  }}
                  className="hover:text-gold-400 transition-colors"
                >
                  Cosmetics & Makeup
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Artificial Jewellery');
                    setActiveTab('shop');
                    scrollToTop();
                  }}
                  className="hover:text-gold-400 transition-colors"
                >
                  Artificial Jewellery
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Handbags');
                    setActiveTab('shop');
                    scrollToTop();
                  }}
                  className="hover:text-gold-400 transition-colors"
                >
                  Handbags & Slings
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('Beauty Accessories');
                    setActiveTab('shop');
                    scrollToTop();
                  }}
                  className="hover:text-gold-400 transition-colors"
                >
                  Beauty Accessories
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('offers');
                    scrollToTop();
                  }}
                  className="hover:text-gold-400 text-rose-300 font-semibold transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-rose-400" />
                  Special Offers
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-gold-300 tracking-wider uppercase border-b border-chocolate-800 pb-2">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-cream-300">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('contact');
                    scrollToTop();
                  }}
                  className="hover:text-gold-400 transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/${STORE_INFO.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 transition-colors flex items-center gap-1"
                >
                  WhatsApp Support <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('store');
                    scrollToTop();
                  }}
                  className="hover:text-gold-400 transition-colors"
                >
                  Store Location & Directions
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenWholesale}
                  className="hover:text-gold-400 text-gold-400 font-semibold transition-colors"
                >
                  Wholesale Enquiries
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="text-chocolate-400 hover:text-cream-300 transition-colors text-[11px] pt-2 block"
                >
                  Admin Portal Login
                </button>
              </li>
            </ul>
          </div>

          {/* Nagpur Physical Address & Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-gold-300 tracking-wider uppercase border-b border-chocolate-800 pb-2">
              Nagpur Store
            </h4>
            <div className="space-y-2.5 text-xs text-cream-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-cream-100">Below Hotel Maitrayee</strong>,<br />
                  Near Lad Square,<br />
                  <span className="text-gold-400 font-medium">Metro Pillar No. 213, 214</span>,<br />
                  North Ambazari Road, Gandhi Nagar,<br />
                  Nagpur – 440 010
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a href={`tel:${STORE_INFO.phone}`} className="hover:text-gold-400 font-semibold">
                  +91 {STORE_INFO.phone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a href={`mailto:${STORE_INFO.email}`} className="hover:text-gold-400 truncate">
                  {STORE_INFO.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Badges */}
        <div className="pt-8 mt-8 border-t border-chocolate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-400 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} <strong className="text-cream-200">Lush Beauty Mart</strong> Nagpur. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-cream-400 text-[11px]">
            <span>100% Genuine Products</span>
            <span>•</span>
            <span>Nagpur In-Store Pickup</span>
            <span>•</span>
            <span>Retail & Wholesale</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
