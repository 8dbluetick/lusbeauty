import React, { useState } from 'react';
import { ProductProvider, useProducts } from './context/ProductContext';
import { CartProvider, useCart } from './context/CartContext';
import { Announcement } from './components/common/Announcement';
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { Footer } from './components/common/Footer';
import { WhatsAppWidget } from './components/common/WhatsAppWidget';
import { ToastContainer } from './components/common/Toast';
import { HeroSection } from './components/home/HeroSection';
import { CategoryGrid } from './components/home/CategoryGrid';
import { TrendingProducts } from './components/home/TrendingProducts';
import { OffersSection } from './components/home/OffersSection';
import { NewArrivals } from './components/home/NewArrivals';
import { StoreExperience } from './components/home/StoreExperience';
import { WholesaleBanner } from './components/home/WholesaleBanner';
import { InstagramFeed } from './components/home/InstagramFeed';
import { ShopView } from './components/shop/ShopView';
import { ProductModal } from './components/product/ProductModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { OrderReceipt } from './components/cart/OrderReceipt';
import { WholesaleModal } from './components/wholesale/WholesaleModal';
import { ContactSection } from './components/contact/ContactSection';
import { SearchModal } from './components/search/SearchModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Product, ProductCategory, Order } from './types';

const MainApp: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory } = useProducts();
  const { addToCart, setIsCartOpen } = useCart();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isWholesaleOpen, setIsWholesaleOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const handleSelectCategory = (category: ProductCategory) => {
    setSelectedCategory(category);
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuyNow = (product: Product, quantity: number) => {
    addToCart(product, quantity);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setIsCheckoutOpen(false);
    setConfirmedOrder(order);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-chocolate-800">
      {/* Top Bar with Nagpur Store Callout */}
      <Announcement onOpenWholesale={() => setIsWholesaleOpen(true)} />

      {/* Sticky Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWholesale={() => setIsWholesaleOpen(true)}
        onOpenAdmin={() => setActiveTab('admin')}
      />

      {/* Page Content depending on active tab */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <div className="animate-fade-in">
            <HeroSection
              onShopClick={() => {
                setActiveTab('shop');
                setSelectedCategory('All');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOffersClick={() => {
                const el = document.getElementById('offers-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onStoreClick={() => {
                const el = document.getElementById('store-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <CategoryGrid onSelectCategory={handleSelectCategory} />

            <TrendingProducts
              products={products}
              onQuickView={prod => setQuickViewProduct(prod)}
              onViewAllShop={() => {
                setActiveTab('shop');
                setSelectedCategory('All');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenWholesale={() => setIsWholesaleOpen(true)}
            />

            <div id="offers-section">
              <OffersSection
                onShopCategory={cat => {
                  setSelectedCategory(cat);
                  setActiveTab('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>

            <NewArrivals
              products={products}
              onQuickView={prod => setQuickViewProduct(prod)}
              onViewAllShop={() => {
                setActiveTab('shop');
                setSelectedCategory('All');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <StoreExperience />

            <WholesaleBanner onOpenWholesale={() => setIsWholesaleOpen(true)} />

            <InstagramFeed />
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="animate-fade-in">
            <ShopView
              products={products}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onQuickView={prod => setQuickViewProduct(prod)}
              onOpenWholesale={() => setIsWholesaleOpen(true)}
            />
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="animate-fade-in py-8">
            <OffersSection
              onShopCategory={cat => {
                setSelectedCategory(cat);
                setActiveTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <TrendingProducts
              products={products}
              onQuickView={prod => setQuickViewProduct(prod)}
              onViewAllShop={() => {
                setActiveTab('shop');
                setSelectedCategory('All');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenWholesale={() => setIsWholesaleOpen(true)}
            />
          </div>
        )}

        {activeTab === 'store' && (
          <div className="animate-fade-in py-8">
            <StoreExperience />
            <ContactSection />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="animate-fade-in py-8">
            <ContactSection />
            <StoreExperience />
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="animate-fade-in">
            <AdminDashboard onClose={() => setActiveTab('home')} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onSelectCategory={handleSelectCategory}
        onOpenWholesale={() => setIsWholesaleOpen(true)}
        onOpenAdmin={() => setActiveTab('admin')}
      />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdmin={() => setActiveTab('admin')}
      />

      {/* Floating Interactive WhatsApp Widget */}
      <WhatsAppWidget />

      {/* Global Toast Container */}
      <ToastContainer />

      {/* Product Quick View & Details Modal */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onBuyNow={handleBuyNow}
        onOpenWholesale={() => setIsWholesaleOpen(true)}
      />

      {/* Slide-out Shopping Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onContinueShopping={() => setActiveTab('shop')}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Confirmation Receipt Modal */}
      <OrderReceipt
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onContinueShopping={() => setActiveTab('shop')}
      />

      {/* Wholesale Inquiry Modal */}
      <WholesaleModal
        isOpen={isWholesaleOpen}
        onClose={() => setIsWholesaleOpen(false)}
      />

      {/* Real-time Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={prod => setQuickViewProduct(prod)}
        onViewCategory={cat => handleSelectCategory(cat)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ProductProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </ProductProvider>
  );
};

export default App;
