import React from 'react';
import { CheckCircle2, Printer, MessageCircle, MapPin, Store, ArrowRight, X } from 'lucide-react';
import { Order } from '../../types';
import { STORE_INFO } from '../../data/storeInfo';

interface OrderReceiptProps {
  order: Order | null;
  onClose: () => void;
  onContinueShopping: () => void;
}

export const OrderReceipt: React.FC<OrderReceiptProps> = ({
  order,
  onClose,
  onContinueShopping,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppConfirm = () => {
    const itemsSummary = order.items
      .map(i => `${i.product.name} (x${i.quantity})`)
      .join(', ');
    const msg = `*Namaste Lush Beauty Mart!* ✨\n\nI just placed order *#${order.orderNumber}* on your website for *₹${order.total}*.\nItems: ${itemsSummary}\nName: ${order.customer.name}\nPhone: ${order.customer.phone}\nPayment: ${order.paymentMethod.toUpperCase()}\n\nPlease verify and let me know when it is ready!`;
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-fade-in print:p-0">
      <div className="fixed inset-0 bg-chocolate-950/80 backdrop-blur-sm print:hidden" onClick={onClose}></div>

      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border-2 border-gold-400 z-10 p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:max-h-none print:m-0">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-cream-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 block">
                Order Placed Successfully!
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-chocolate-900">
                Order #{order.orderNumber}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-chocolate-400 hover:text-chocolate-900 print:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store & Customer Info Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-cream-50 border border-gold-200 text-xs">
          <div>
            <strong className="text-chocolate-900 font-bold block mb-1">
              Store Fulfilment:
            </strong>
            <p className="text-chocolate-700 leading-relaxed">
              <strong>Lush Beauty Mart Nagpur</strong><br />
              Below Hotel Maitrayee, Near Lad Square,<br />
              Metro Pillar No. 213-214, Gandhi Nagar<br />
              📞 {STORE_INFO.phone}
            </p>
          </div>

          <div>
            <strong className="text-chocolate-900 font-bold block mb-1">
              Customer & Delivery:
            </strong>
            <p className="text-chocolate-700 leading-relaxed">
              <strong>{order.customer.name}</strong> ({order.customer.phone})<br />
              {order.customer.address}<br />
              {order.customer.city} - {order.customer.pincode}<br />
              Payment: <strong className="uppercase">{order.paymentMethod}</strong>
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="space-y-3">
          <h4 className="font-serif text-sm font-bold text-chocolate-900 uppercase tracking-wider">
            Ordered Items
          </h4>
          <div className="border border-cream-200 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-cream-100 text-chocolate-900 font-bold border-b border-cream-200">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-medium text-chocolate-900">
                      {item.product.name}
                      <span className="block text-[10px] text-chocolate-400">
                        {item.product.category}
                      </span>
                    </td>
                    <td className="p-3 text-center text-chocolate-800">{item.quantity}</td>
                    <td className="p-3 text-right text-chocolate-800">₹{item.product.price}</td>
                    <td className="p-3 text-right font-bold text-chocolate-950">
                      ₹{item.product.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-1.5 text-xs text-chocolate-700 border-t border-cream-200 pt-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-chocolate-900">₹{order.subtotal}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-rose-600 font-medium">
              <span>Coupon Savings {order.couponCode ? `(${order.couponCode})` : ''}</span>
              <span>-₹{order.discount}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span className="font-semibold text-chocolate-900">
              {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
            </span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-chocolate-950 pt-2 border-t border-cream-200">
            <span>Grand Total Paid / Due</span>
            <span className="font-serif text-lg text-gold-700">₹{order.total}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 print:hidden">
          <button
            onClick={handleWhatsAppConfirm}
            className="py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send to Store WhatsApp</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-3 px-4 rounded-xl bg-white hover:bg-cream-100 text-chocolate-900 border border-gold-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4 text-gold-700" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onContinueShopping();
            }}
            className="py-3 px-4 rounded-xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
