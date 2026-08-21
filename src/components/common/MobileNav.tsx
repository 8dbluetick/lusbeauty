import React from 'react';
import { Home, LayoutGrid, Search, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenAdmin,
}) => {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream-50/95 backdrop-blur-lg border-t border-gold-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] py-2 px-3">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'home' ? 'text-gold-700 font-bold' : 'text-chocolate-600 hover:text-gold-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* Categories / Shop */}
        <button
          onClick={() => {
            setActiveTab('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'shop' ? 'text-gold-700 font-bold' : 'text-chocolate-600 hover:text-gold-600'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Categories</span>
        </button>

        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center gap-1 text-chocolate-600 hover:text-gold-600 transition-colors"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Search</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-1 text-chocolate-600 hover:text-gold-600 transition-colors relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-gold-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Cart</span>
        </button>

        {/* Account / Admin */}
        <button
          onClick={onOpenAdmin}
          className="flex flex-col items-center gap-1 text-chocolate-600 hover:text-gold-600 transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Account</span>
        </button>
      </div>
    </div>
  );
};
