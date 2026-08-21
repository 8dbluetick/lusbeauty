import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, WishlistItem, Offer } from '../types';
import { useProducts } from './ProductContext';
import { STORE_INFO } from '../data/storeInfo';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  appliedCoupon: Offer | null;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartCount: number;
  wishlistCount: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  generateWhatsAppOrderUrl: (customerNotes?: string) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CART: 'lush_cart_v1',
  WISHLIST: 'lush_wishlist_v1',
  COUPON: 'lush_applied_coupon_v1',
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { offers } = useProducts();
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Offer | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPON);
    return saved ? JSON.parse(saved) : null;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPON, JSON.stringify(appliedCoupon));
  }, [appliedCoupon]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = 'toast-' + Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedVariant === variant);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.selectedVariant === variant
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedVariant: variant }];
    });
    showToast(`Added "${product.name.slice(0, 30)}..." to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some(item => item.product.id === product.id);
    if (exists) {
      setWishlist(prev => prev.filter(item => item.product.id !== product.id));
      showToast(`Removed from Wishlist`, 'info');
    } else {
      setWishlist(prev => [{ product, addedAt: new Date().toISOString() }, ...prev]);
      showToast(`Added to Wishlist! ❤️`);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.product.id === productId);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Discount Calculation
  let discountAmount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountType === 'percentage') {
      // Check category match if specific
      if (appliedCoupon.category && appliedCoupon.category !== 'All') {
        const eligibleSubtotal = cart
          .filter(item => item.product.category === appliedCoupon.category)
          .reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        discountAmount = Math.round((eligibleSubtotal * appliedCoupon.discountValue) / 100);
      } else {
        discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      }
    } else if (appliedCoupon.discountType === 'fixed') {
      discountAmount = appliedCoupon.discountValue;
    } else if (appliedCoupon.discountType === 'bogo') {
      // Half price on second item or 25% overall
      discountAmount = Math.round(subtotal * 0.25);
    }
  }

  const shippingFee = subtotal === 0 ? 0 : subtotal > 499 ? 0 : 50;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = offers.find(o => o.code.toUpperCase() === cleanCode && o.active);

    if (!found) {
      return { success: false, message: 'Invalid coupon code.' };
    }

    if (subtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Min order value for ${found.code} is ₹${found.minOrderValue}. Add items worth ₹${found.minOrderValue - subtotal} more.`,
      };
    }

    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied! Saved discount.`, 'success');
    return { success: true, message: `Coupon applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const generateWhatsAppOrderUrl = (customerNotes?: string) => {
    if (cart.length === 0) return `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent('Hi Lush Beauty Mart! I want to inquire about your products.')}`;

    const itemsText = cart
      .map((item, idx) => `${idx + 1}. *${item.product.name}* (Qty: ${item.quantity}) - ₹${item.product.price * item.quantity}`)
      .join('\n');

    const message = `*Namaste Lush Beauty Mart Nagpur!* 🛍️\n\nI would like to place an order:\n\n${itemsText}\n\n*Subtotal:* ₹${subtotal}\n*Discount:* -₹${discountAmount} ${appliedCoupon ? `(${appliedCoupon.code})` : ''}\n*Delivery:* ₹${shippingFee === 0 ? 'FREE' : '₹50'}\n*Total Amount:* *₹${totalAmount}*\n\n${customerNotes ? `*Note:* ${customerNotes}\n` : ''}Please confirm availability and store pickup/delivery details. Thank you!`;

    return `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        appliedCoupon,
        toasts,
        showToast,
        removeToast,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        cartCount,
        wishlistCount,
        subtotal,
        discountAmount,
        shippingFee,
        totalAmount,
        generateWhatsAppOrderUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
