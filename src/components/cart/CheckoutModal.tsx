import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Truck, 
  Store, 
  CreditCard, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { Order } from '../../types';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { cart, subtotal, discountAmount, shippingFee, totalAmount, appliedCoupon, clearCart } = useCart();
  const { placeOrder } = useProducts();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Nagpur',
    pincode: '440010',
    orderNotes: '',
    deliveryType: 'doorstep' as 'doorstep' | 'pickup',
    paymentMethod: 'cod' as 'cod' | 'upi' | 'pickup',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill in your name, phone number, and delivery address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder({
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || 'customer@lushbeautymart.in',
          address: formData.deliveryType === 'pickup'
            ? 'Store Pickup: Lush Beauty Mart, Below Hotel Maitrayee, Lad Square, Nagpur'
            : formData.address,
          city: formData.city,
          pincode: formData.pincode,
          orderNotes: formData.orderNotes,
        },
        items: cart,
        subtotal,
        discount: discountAmount,
        couponCode: appliedCoupon?.code,
        shipping: formData.deliveryType === 'pickup' ? 0 : shippingFee,
        total: formData.deliveryType === 'pickup' ? Math.max(0, subtotal - discountAmount) : totalAmount,
        paymentMethod: formData.paymentMethod,
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C5A880', '#291811', '#B38E5D', '#E7D5B8'],
        });
      } catch (err) {}

      setIsSubmitting(false);
      clearCart();
      onOrderSuccess(order);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="fixed inset-0 bg-chocolate-950/75 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-cream-50 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border-2 border-gold-300 z-10 animate-slide-up">
        {/* Header */}
        <div className="p-6 bg-white border-b border-cream-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-700 block">
              Secure Store Checkout
            </span>
            <h3 className="font-serif text-2xl font-bold text-chocolate-900">
              Complete Your Order
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-chocolate-400 hover:text-chocolate-900 hover:bg-cream-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Step 1: Delivery Mode (Doorstep vs In-Store Pickup in Nagpur) */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-chocolate-900 block">
              1. Choose Fulfilment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setFormData({ ...formData, deliveryType: 'doorstep' })}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.deliveryType === 'doorstep'
                    ? 'border-gold-600 bg-gold-50/80 shadow-sm'
                    : 'border-cream-200 bg-white hover:border-cream-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gold-100 text-gold-800">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-chocolate-900">Doorstep Delivery</h5>
                    <p className="text-[11px] text-chocolate-600">
                      Nagpur Same-Day / PAN-India Express
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setFormData({ ...formData, deliveryType: 'pickup' })}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.deliveryType === 'pickup'
                    ? 'border-gold-600 bg-gold-50/80 shadow-sm'
                    : 'border-cream-200 bg-white hover:border-cream-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gold-100 text-gold-800">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-chocolate-900">In-Store Pickup (Free)</h5>
                    <p className="text-[11px] text-chocolate-600">
                      Collect at Lad Sq., Nagpur store
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Contact & Address Information */}
          <div className="space-y-4 pt-2 border-t border-cream-200">
            <label className="text-xs font-bold uppercase tracking-wider text-chocolate-900 block">
              2. Customer & Address Details
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-chocolate-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pooja Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-chocolate-700 block mb-1">
                  Phone Number / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-chocolate-700 block mb-1">
                  Email Address (for invoice copy)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. pooja@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
                />
              </div>

              {formData.deliveryType === 'doorstep' && (
                <>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-chocolate-700 block mb-1">
                      Delivery Street Address & Landmarks *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Flat / House No., Apartment, Colony, Landmark"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
                    ></textarea>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-chocolate-700 block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-chocolate-700 block mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Step 3: Payment Options */}
          <div className="space-y-3 pt-2 border-t border-cream-200">
            <label className="text-xs font-bold uppercase tracking-wider text-chocolate-900 block">
              3. Select Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer flex flex-col justify-between text-xs transition-all ${
                  formData.paymentMethod === 'cod'
                    ? 'border-gold-600 bg-gold-50/80 font-bold'
                    : 'border-cream-200 bg-white'
                }`}
              >
                <span className="text-chocolate-900 block">💵 Cash on Delivery</span>
                <span className="text-[10px] text-chocolate-500 mt-1">Pay when item arrives</span>
              </label>

              <label
                onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer flex flex-col justify-between text-xs transition-all ${
                  formData.paymentMethod === 'upi'
                    ? 'border-gold-600 bg-gold-50/80 font-bold'
                    : 'border-cream-200 bg-white'
                }`}
              >
                <span className="text-chocolate-900 block">📱 UPI / QR Code</span>
                <span className="text-[10px] text-chocolate-500 mt-1">GPay, PhonePe, Paytm</span>
              </label>

              <label
                onClick={() => setFormData({ ...formData, paymentMethod: 'pickup' })}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer flex flex-col justify-between text-xs transition-all ${
                  formData.paymentMethod === 'pickup'
                    ? 'border-gold-600 bg-gold-50/80 font-bold'
                    : 'border-cream-200 bg-white'
                }`}
              >
                <span className="text-chocolate-900 block">🏪 Pay at Store</span>
                <span className="text-[10px] text-chocolate-500 mt-1">During counter pickup</span>
              </label>
            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="p-4 rounded-2xl bg-white border border-gold-200 shadow-soft space-y-2 text-xs">
            <div className="flex justify-between text-chocolate-600">
              <span>Items Total ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
              <span className="font-semibold text-chocolate-900">₹{subtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Discount ({appliedCoupon?.code})</span>
                <span className="font-semibold">-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-chocolate-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-chocolate-900">
                {formData.deliveryType === 'pickup' || shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-chocolate-950 pt-2 border-t border-cream-200">
              <span>Total Payable</span>
              <span className="font-serif text-lg text-gold-700">
                ₹{formData.deliveryType === 'pickup' ? Math.max(0, subtotal - discountAmount) : totalAmount}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 font-bold text-xs uppercase tracking-wider shadow-luxury hover:shadow-xl transition-all flex items-center justify-center gap-2 border border-gold-500"
          >
            {isSubmitting ? (
              <span>Confirming Your Order...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>Confirm & Place Order</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
