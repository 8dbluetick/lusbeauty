import React from 'react';
import { useCart } from '../../context/CartContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-luxury border backdrop-blur-md transition-all duration-300 transform animate-slide-up ${
            toast.type === 'success'
              ? 'bg-cream-50/95 border-gold-400/50 text-chocolate-900'
              : toast.type === 'error'
              ? 'bg-rose-50/95 border-rose-300 text-rose-900'
              : 'bg-chocolate-900/95 border-gold-500/30 text-cream-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-gold-600 flex-shrink-0" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            {toast.type === 'info' && (
              <Info className="w-5 h-5 text-gold-400 flex-shrink-0" />
            )}
            <p className="text-xs sm:text-sm font-medium leading-tight">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 text-chocolate-400 hover:text-chocolate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
