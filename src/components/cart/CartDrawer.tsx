import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Tag, 
  Truck, 
  Sparkles,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { STORE_INFO } from '../../data/storeInfo';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    generateWhatsAppOrderUrl,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const handleWhatsAppCheckout = () => {
    const url = generateWhatsAppOrderUrl();
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-chocolate-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream-50 shadow-2xl border-l border-gold-300 flex flex-col justify-between animate-slide-up">
          {/* Top Header */}
          <div className="p-5 sm:p-6 bg-white border-b border-cream-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-chocolate-900">
                  Your Shopping Bag
                </h3>
                <p className="text-xs text-chocolate-500">
                  {cart.length} unique items ({cart.reduce((a, b) => a + b.quantity, 0)} total pcs)
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-chocolate-400 hover:text-chocolate-900 hover:bg-cream-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Incentive Banner */}
          <div className="bg-gold-50/80 px-5 py-2.5 border-b border-gold-200/60 flex items-center gap-2 text-xs text-chocolate-800">
            <Truck className="w-4 h-4 text-gold-700 flex-shrink-0" />
            {subtotal >= 499 ? (
              <span className="font-medium text-emerald-800">
                🎉 Congratulations! You have unlocked <strong>FREE Delivery in Nagpur</strong>!
              </span>
            ) : (
              <span>
                Add ₹{499 - subtotal} more to qualify for <strong>FREE Nagpur Delivery</strong>
              </span>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-cream-200 text-chocolate-400 flex items-center justify-center mx-auto text-2xl">
                  🛍️
                </div>
                <h4 className="font-serif text-lg font-bold text-chocolate-900">
                  Your shopping bag is empty
                </h4>
                <p className="text-xs text-chocolate-500 max-w-xs mx-auto">
                  Explore our luxury skincare, cosmetics, artificial jewellery and handbags collections.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onContinueShopping();
                  }}
                  className="px-6 py-2.5 rounded-full bg-chocolate-900 text-cream-50 font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-chocolate-800 transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}`}
                  className="flex gap-4 p-3.5 bg-white rounded-2xl border border-cream-200 shadow-soft"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover border border-gold-200 flex-shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif text-xs sm:text-sm font-bold text-chocolate-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-chocolate-400 hover:text-rose-600 p-0.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-gold-700 font-semibold uppercase">
                        {item.product.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-lg bg-cream-100 border border-cream-300 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded text-chocolate-700 hover:bg-white flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-xs text-chocolate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded text-chocolate-700 hover:bg-white flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-xs sm:text-sm text-chocolate-950">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Summary & Actions */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-white border-t border-cream-200 space-y-4">
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gold-50 border border-gold-300 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-gold-700" />
                      <span className="font-bold text-chocolate-900">
                        {appliedCoupon.code} applied (-₹{discountAmount})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-600 hover:text-rose-800 font-bold text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={e => {
                          setCouponInput(e.target.value);
                          setCouponError('');
                        }}
                        placeholder="Enter Promo Code (e.g. LUSH30)"
                        className="flex-1 px-3 py-2 rounded-xl bg-cream-100/70 border border-cream-300 text-xs uppercase text-chocolate-900 focus:outline-none focus:border-gold-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 text-xs font-bold uppercase transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Price Calculation Lines */}
              <div className="space-y-1.5 text-xs text-chocolate-700 pt-2 border-t border-cream-100">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-chocolate-900">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-rose-600 font-medium">
                    <span>Coupon Savings</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Nagpur Store / PAN India Shipping</span>
                  <span className="font-semibold text-chocolate-900">
                    {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-chocolate-950 pt-2 border-t border-cream-200">
                  <span>Estimated Total</span>
                  <span className="font-serif text-base">₹{totalAmount}</span>
                </div>
              </div>

              {/* Checkout CTAs */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onProceedToCheckout();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 font-bold text-xs uppercase tracking-wider shadow-luxury hover:shadow-xl transition-all flex items-center justify-center gap-2 border border-gold-500"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-gold-400" />
                </button>

                {/* 1-Click WhatsApp Quick Order */}
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <span>Order via WhatsApp (Nagpur Store)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
