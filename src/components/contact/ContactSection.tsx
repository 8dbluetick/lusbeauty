import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { STORE_INFO } from '../../data/storeInfo';
import { useProducts } from '../../context/ProductContext';

export const ContactSection: React.FC = () => {
  const { submitContactMessage } = useProducts();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Enquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContactMessage(formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', email: '', subject: 'General Enquiry', message: '' });
    }, 4000);
  };

  const callStore = () => {
    window.location.href = `tel:${STORE_INFO.phone}`;
  };

  const chatWhatsApp = () => {
    const msg = `Hi Lush Beauty Mart Nagpur! I am contacting you from your website.`;
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section id="contact-section" className="py-16 sm:py-24 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold-100 text-gold-900 text-xs font-semibold uppercase tracking-wider mb-2 border border-gold-300">
            <Mail className="w-3.5 h-3.5 text-gold-700" />
            Connect With Our Team
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-900 tracking-tight">
            Contact Lush Beauty Mart
          </h2>
          <p className="text-sm text-chocolate-600 mt-2">
            Have questions about a product, bridal jewellery sets, or store availability in Nagpur? We’re always here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Store Details & Fast Action Buttons */}
          <div className="lg:col-span-5 bg-chocolate-900 text-cream-100 rounded-3xl p-6 sm:p-8 space-y-6 shadow-luxury border border-gold-500/40">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-gold-400 uppercase block">
                Nagpur Flagship Store
              </span>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">
                Lush Beauty Mart
              </h3>
              <p className="text-xs text-cream-300 mt-1">
                “Where Beauty Meets Quality”
              </p>
            </div>

            <div className="space-y-4 text-xs text-cream-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-cream-100 block">Address:</strong>
                  Below Hotel Maitrayee, Near Lad Square,<br />
                  <span className="text-gold-300 font-semibold">Metro Pillar No. 213, 214</span>,<br />
                  North Ambazari Road, Gandhi Nagar,<br />
                  Nagpur – 440 010
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <div>
                  <strong className="text-cream-100 block">Direct Store Call:</strong>
                  <a href={`tel:${STORE_INFO.phone}`} className="hover:text-gold-300 font-bold text-sm text-gold-200">
                    +91 {STORE_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <div>
                  <strong className="text-cream-100 block">Working Hours:</strong>
                  <span>{STORE_INFO.timings}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Contact Buttons */}
            <div className="pt-4 border-t border-chocolate-800 space-y-3">
              <button
                onClick={callStore}
                className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-chocolate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call Store (9119595951)</span>
              </button>

              <button
                onClick={chatWhatsApp}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </button>
            </div>
          </div>

          {/* Right Column: Premium Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-gold-200">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-chocolate-900">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-chocolate-600 max-w-sm mx-auto">
                  Thank you for reaching out. Our customer care executive will connect with you promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-chocolate-800 uppercase block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sneha Deshmukh"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-chocolate-800 uppercase block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9823456789"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-chocolate-800 uppercase block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. sneha@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-chocolate-800 uppercase block mb-1">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
                    >
                      <option value="General Enquiry">General Enquiry / Store Info</option>
                      <option value="Product Availability">Product Stock Availability</option>
                      <option value="Bridal Jewellery Booking">Bridal Jewellery Consultation</option>
                      <option value="Wholesale Inquiry">Wholesale / B2B Bulk Order</option>
                      <option value="Order Tracking">Existing Order Status</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-chocolate-800 uppercase block mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we help you today? Write your query here..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 px-6 rounded-xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 font-bold text-xs uppercase tracking-wider shadow-luxury transition-all flex items-center justify-center gap-2 border border-gold-500"
                  >
                    <Send className="w-4 h-4 text-gold-400" />
                    <span>Send Enquiry</span>
                  </button>

                  <button
                    type="button"
                    onClick={callStore}
                    className="py-3.5 px-6 rounded-xl bg-cream-100 hover:bg-cream-200 text-chocolate-900 font-bold text-xs uppercase tracking-wider transition-colors border border-gold-300 flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-gold-700" />
                    <span>Call Store</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
