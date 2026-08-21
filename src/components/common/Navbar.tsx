import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Layers,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { ProductCategory } from '../../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenWholesale: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenWholesale,
  onOpenAdmin,
}) => {
  const { cartCount, wishlistCount, setIsCartOpen, setIsWishlistOpen } = useCart();
  const { setSelectedCategory } = useProducts();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tab: string, category?: ProductCategory | 'All') => {
    setActiveTab(tab);
    if (category) {
      setSelectedCategory(category);
    }
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-cream-50/95 backdrop-blur-md shadow-card py-2.5 border-b border-gold-200/60'
          : 'bg-cream-100 py-4 border-b border-cream-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Hamburger Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-chocolate-800 hover:text-gold-600 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo / Wordmark */}
          <div className="flex flex-col items-center lg:items-start cursor-pointer" onClick={() => handleNavClick('home', 'All')}>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-chocolate-900 leading-none">
                LUSH
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-light tracking-widest text-gold-600 leading-none">
                BEAUTY MART
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] tracking-[0.25em] uppercase text-chocolate-400 font-semibold">
                Where Beauty Meets Quality
              </span>
              <span className="hidden sm:inline-block text-[9px] text-gold-600 bg-gold-50 px-1.5 py-0.2 rounded border border-gold-300/50">
                Nagpur
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => handleNavClick('home', 'All')}
              className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors rounded-md ${
                activeTab === 'home'
                  ? 'text-gold-700 bg-gold-100/70'
                  : 'text-chocolate-800 hover:text-gold-600 hover:bg-cream-200/50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('shop', 'All')}
              className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors rounded-md ${
                activeTab === 'shop'
                  ? 'text-gold-700 bg-gold-100/70'
                  : 'text-chocolate-800 hover:text-gold-600 hover:bg-cream-200/50'
              }`}
            >
              Shop
            </button>

            {/* Direct Category Links */}
            <button
              onClick={() => handleNavClick('shop', 'Skincare')}
              className="px-2.5 py-1.5 text-xs font-medium tracking-wide text-chocolate-700 hover:text-gold-600 transition-colors"
            >
              Skincare
            </button>

            <button
              onClick={() => handleNavClick('shop', 'Cosmetics')}
              className="px-2.5 py-1.5 text-xs font-medium tracking-wide text-chocolate-700 hover:text-gold-600 transition-colors"
            >
              Cosmetics
            </button>

            <button
              onClick={() => handleNavClick('shop', 'Artificial Jewellery')}
              className="px-2.5 py-1.5 text-xs font-medium tracking-wide text-chocolate-700 hover:text-gold-600 transition-colors"
            >
              Jewellery
            </button>

            <button
              onClick={() => handleNavClick('shop', 'Handbags')}
              className="px-2.5 py-1.5 text-xs font-medium tracking-wide text-chocolate-700 hover:text-gold-600 transition-colors"
            >
              Handbags
            </button>

            <button
              onClick={() => handleNavClick('shop', 'Beauty Accessories')}
              className="px-2.5 py-1.5 text-xs font-medium tracking-wide text-chocolate-700 hover:text-gold-600 transition-colors"
            >
              Accessories
            </button>

            <button
              onClick={() => handleNavClick('offers')}
              className="px-2.5 py-1.5 text-xs font-semibold text-rose-800 hover:text-rose-900 bg-rose-50 px-2 rounded border border-rose-200 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-rose-500" />
              Offers
            </button>

            <button
              onClick={() => handleNavClick('store')}
              className="px-2.5 py-1.5 text-xs font-medium tracking-wide text-chocolate-700 hover:text-gold-600 transition-colors"
            >
              Store Location
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className="px-2.5 py-1.5 text-xs font-medium tracking-wide text-chocolate-700 hover:text-gold-600 transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-chocolate-800 hover:text-gold-600 hover:bg-cream-200/70 rounded-full transition-colors relative"
              title="Search products"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 text-chocolate-800 hover:text-gold-600 hover:bg-cream-200/70 rounded-full transition-colors relative"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-in">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-chocolate-800 hover:text-gold-600 hover:bg-cream-200/70 rounded-full transition-colors relative flex items-center gap-1.5"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-gold-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fade-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account / Admin Portal */}
            <button
              onClick={onOpenAdmin}
              className="p-2 text-chocolate-800 hover:text-gold-600 hover:bg-cream-200/70 rounded-full transition-colors"
              title="Admin Portal & Product Manager"
              aria-label="Admin Portal"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-cream-200 animate-slide-up pb-2">
            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              <button
                onClick={() => handleNavClick('home', 'All')}
                className="text-left px-3 py-2 rounded-lg hover:bg-cream-200 text-chocolate-900"
              >
                🏠 Home
              </button>
              <button
                onClick={() => handleNavClick('shop', 'All')}
                className="text-left px-3 py-2 rounded-lg hover:bg-cream-200 text-chocolate-900"
              >
                🛍️ All Shop
              </button>
              <button
                onClick={() => handleNavClick('shop', 'Skincare')}
                className="text-left px-3 py-2 rounded-lg hover:bg-cream-200 text-chocolate-800"
              >
                ✨ Skincare
              </button>
              <button
                onClick={() => handleNavClick('shop', 'Cosmetics')}
                className="text-left px-3 py-2 rounded-lg hover:bg-cream-200 text-chocolate-800"
              >
                💄 Cosmetics
              </button>
              <button
                onClick={() => handleNavClick('shop', 'Artificial Jewellery')}
                className="text-left px-3 py-2 rounded-lg hover:bg-cream-200 text-chocolate-800"
              >
                💎 Jewellery
              </button>
              <button
                onClick={() => handleNavClick('shop', 'Handbags')}
                className="text-left px-3 py-2 rounded-lg hover:bg-cream-200 text-chocolate-800"
              >
                👜 Handbags
              </button>
              <button
                onClick={() => handleNavClick('shop', 'Beauty Accessories')}
                className="text-left px-3 py-2 rounded-lg hover:bg-cream-200 text-chocolate-800"
              >
                🪄 Accessories
              </button>
              <button
                onClick={() => handleNavClick('offers')}
                className="text-left px-3 py-2 rounded-lg bg-rose-50 text-rose-800 font-semibold"
              >
                🎉 Grab Offers
              </button>
              <button
                onClick={() => handleNavClick('store')}
                className="text-left px-3 py-2 rounded-lg hover:bg-cream-200 text-chocolate-800"
              >
                📍 Nagpur Store
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="text-left px-3 py-2 rounded-lg hover:bg-cream-200 text-chocolate-800"
              >
                📞 Contact Us
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-cream-200/80 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWholesale();
                }}
                className="flex-1 bg-gold-600 hover:bg-gold-700 text-white text-xs font-bold py-2 rounded-lg shadow-sm text-center"
              >
                Wholesale Enquiry
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex-1 bg-chocolate-800 hover:bg-chocolate-900 text-cream-100 text-xs font-medium py-2 rounded-lg text-center"
              >
                Store Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
