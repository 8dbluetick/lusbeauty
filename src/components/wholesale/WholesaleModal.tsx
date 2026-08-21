import React, { useState } from 'react';
import { X, Building2, Package, Sparkles, Send, MessageCircle, Phone, CheckCircle2 } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { ProductCategory } from '../../types';
import { STORE_INFO } from '../../data/storeInfo';

interface WholesaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WholesaleModal: React.FC<WholesaleModalProps> = ({ isOpen, onClose }) => {
  const { submitWholesaleInquiry } = useProducts();

  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    city: 'Nagpur',
    category: 'Multiple Categories' as ProductCategory | 'Multiple Categories',
    estimatedQuantity: '20-50 units',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitWholesaleInquiry(formData);
    setIsSubmitted(true);
  };

  const handleDirectWhatsApp = () => {
    const text = `*Namaste Lush Beauty Mart Nagpur!* 🏢\n\n*Wholesale B2B Enquiry:*\nBusiness: ${formData.businessName || 'Boutique/Salon'}\nContact Person: ${formData.name || 'Owner'}\nCity: ${formData.city}\nCategory: ${formData.category}\nEst. Quantity: ${formData.estimatedQuantity}\n\nPlease share your wholesale price catalog and discount tiers.`;
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="fixed inset-0 bg-chocolate-950/75 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-cream-50 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border-2 border-gold-400 z-10 p-6 sm:p-8 animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-chocolate-400 hover:text-chocolate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-chocolate-900">
              Wholesale Request Received!
            </h3>
            <p className="text-xs sm:text-sm text-chocolate-700 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{formData.name}</strong>. Our Nagpur wholesale manager will call or message your number <strong>{formData.phone}</strong> shortly with custom carton pricing.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleDirectWhatsApp}
                className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </button>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="px-6 py-3 rounded-xl bg-chocolate-900 text-cream-50 font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold uppercase tracking-wider mb-2 border border-gold-300">
                <Building2 className="w-3.5 h-3.5 text-gold-700" />
                B2B & Salon Supply Portal
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900">
                Wholesale & Bulk Inquiries
              </h3>
              <p className="text-xs text-chocolate-600 mt-1">
                Lush Beauty Mart supplies beauty salons, boutiques, and resellers across Maharashtra and Central India.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-chocolate-800 uppercase block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Patil"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-chocolate-800 uppercase block mb-1">
                    Business / Salon Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Glamour Unisex Salon"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-chocolate-800 uppercase block mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9119595951"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-chocolate-800 uppercase block mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Nagpur, Wardha, Amravati"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-chocolate-800 uppercase block mb-1">
                    Primary Category of Interest
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
                  >
                    <option value="Multiple Categories">All / Multiple Categories</option>
                    <option value="Artificial Jewellery">Artificial Jewellery (Kundan, AD, Jhumkas)</option>
                    <option value="Cosmetics">Cosmetics (Lipsticks, Foundations, Kajal)</option>
                    <option value="Skincare">Skincare (Serums, Sunscreens, Lotions)</option>
                    <option value="Handbags">Handbags & Sling Bags</option>
                    <option value="Beauty Accessories">Beauty Tools & Makeup Brushes</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-chocolate-800 uppercase block mb-1">
                    Estimated Order Volume
                  </label>
                  <select
                    value={formData.estimatedQuantity}
                    onChange={e => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
                  >
                    <option value="10-25 units (Sample Tier)">10 - 25 units (Sample / Small Tier)</option>
                    <option value="25-100 units (Standard Bulk)">25 - 100 units (Standard Bulk)</option>
                    <option value="100-500+ units (Master Carton)">100 - 500+ units (Master Carton Tier)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-chocolate-800 uppercase block mb-1">
                  Specific Requirements or Message
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about specific items, target pricing, or urgent delivery dates..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
                ></textarea>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3.5 px-6 rounded-xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 font-bold text-xs uppercase tracking-wider transition-all shadow-luxury border border-gold-500 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-gold-400" />
                  <span>Submit Wholesale Request</span>
                </button>

                <button
                  type="button"
                  onClick={handleDirectWhatsApp}
                  className="py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Manager</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
