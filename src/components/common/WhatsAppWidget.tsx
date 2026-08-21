import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, Store, Package } from 'lucide-react';
import { STORE_INFO } from '../../data/storeInfo';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickPrompts = [
    {
      label: 'Store Location & Timings',
      icon: Store,
      text: 'Hi Lush Beauty Mart! I want to visit your store at Lad Square, Nagpur. Can you share the exact location and timings?',
    },
    {
      label: 'Wholesale B2B Bulk Enquiry',
      icon: Package,
      text: 'Hi! I am interested in wholesale/bulk purchases of cosmetics and artificial jewellery. Please share your wholesale catalogue and price list.',
    },
    {
      label: 'Product Availability & Offers',
      icon: Sparkles,
      text: 'Hi Lush Beauty Mart! I would like to know more about your current store offers and product availability.',
    },
  ];

  const handleSend = (textToSend: string) => {
    const url = `https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 sm:left-6 z-50">
      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-cream-50 rounded-2xl shadow-luxury border border-gold-300/80 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-cream-100 text-emerald-900 font-serif font-bold flex items-center justify-center text-lg border border-gold-400">
                  L
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-emerald-900 rounded-full"></span>
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight">Lush Beauty Mart</h4>
                <p className="text-[11px] text-emerald-200">Nagpur Store • Online (Replies in mins)</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-200 hover:text-white p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-cream-100/60 max-h-80 overflow-y-auto">
            <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm border border-cream-200 text-xs text-chocolate-800 leading-relaxed">
              <p className="font-medium text-chocolate-900 mb-1">
                Namaste! 🙏 Welcome to Lush Beauty Mart Nagpur.
              </p>
              <p className="text-chocolate-600">
                How can we assist you today? Choose a quick question or type below to chat with our team:
              </p>
            </div>

            {/* Quick Templates */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-bold text-chocolate-500 uppercase tracking-wider px-1">
                Quick Options
              </p>
              {quickPrompts.map((prompt, i) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt.text)}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-gold-50 border border-gold-200/60 hover:border-gold-400 text-xs text-chocolate-800 flex items-center gap-2.5 transition-all group"
                  >
                    <div className="p-1.5 rounded-lg bg-cream-100 text-gold-700 group-hover:bg-gold-200/50">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium text-[11px] text-chocolate-700">{prompt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white border-t border-cream-200 flex items-center gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={e => setCustomMsg(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && customMsg.trim()) {
                  handleSend(customMsg);
                  setCustomMsg('');
                }
              }}
              placeholder="Type your message..."
              className="flex-1 text-xs px-3 py-2 rounded-lg bg-cream-100/60 border border-cream-300 focus:outline-none focus:border-gold-500 text-chocolate-900"
            />
            <button
              onClick={() => {
                if (customMsg.trim()) {
                  handleSend(customMsg);
                  setCustomMsg('');
                }
              }}
              className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white px-4 py-3 rounded-full shadow-luxury hover:shadow-xl transition-all duration-300 transform hover:scale-105 group border border-emerald-400/40"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-bold tracking-wide hidden sm:inline">
          Chat with Nagpur Store
        </span>
      </button>
    </div>
  );
};
