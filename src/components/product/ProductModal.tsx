import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  ShoppingBag, 
  Share2, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  MessageCircle, 
  Plus, 
  Minus, 
  Check,
  Building2
} from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { STORE_INFO } from '../../data/storeInfo';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onOpenWholesale: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onBuyNow,
  onOpenWholesale,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!product) return null;

  const isFav = isInWishlist(product.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.name} | Lush Beauty Mart Nagpur`,
        text: `Check out ${product.name} at Lush Beauty Mart Nagpur for ₹${product.price}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleWhatsAppInquire = () => {
    const msg = `Namaste Lush Beauty Mart Nagpur! 🌸\n\nI want to inquire about:\n*${product.name}*\nPrice: ₹${product.price} (MRP: ₹${product.mrp})\nCategory: ${product.category}\n\nIs this available in your store at Lad Square? Can I get delivery in Nagpur?`;
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-chocolate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-cream-50 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border-2 border-gold-300 z-10 animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-chocolate-800 flex items-center justify-center shadow-md border border-cream-200 transition-all hover:scale-105"
          aria-label="Close product modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 p-6 sm:p-8">
          {/* Left Gallery (Thumbnails + Main Image) */}
          <div className="md:col-span-6 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gold-200 shadow-soft group">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Discount Tag */}
              {product.discountPercentage > 0 && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-extrabold uppercase shadow-sm">
                  {product.discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-gold-600 shadow-md scale-105'
                        : 'border-cream-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Details */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              {/* Category & Tags */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold uppercase tracking-wider text-gold-700 bg-gold-100/80 px-2.5 py-0.5 rounded-full border border-gold-300/60">
                  {product.category} • {product.subcategory}
                </span>
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-900 font-bold border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{product.rating}</span>
                  <span className="text-chocolate-400 font-normal">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Product Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900 leading-tight">
                {product.name}
              </h2>

              {/* Price & Savings */}
              <div className="p-4 rounded-2xl bg-white border border-gold-200/80 shadow-soft space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold text-chocolate-950">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.mrp > product.price && (
                    <span className="text-sm text-chocolate-400 line-through">
                      MRP: ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discountPercentage > 0 && (
                    <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Save ₹{product.mrp - product.price} ({product.discountPercentage}% OFF)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-chocolate-500">
                  Inclusive of all taxes. Free delivery in Nagpur on orders above ₹499.
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-chocolate-700 leading-relaxed">
                {product.description}
              </p>

              {/* Product Specifications Table / Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-cream-100/70 p-3.5 rounded-2xl border border-cream-200">
                {product.details.skinType && (
                  <div>
                    <span className="text-chocolate-500 text-[10px] uppercase font-bold block">Skin Type</span>
                    <span className="text-chocolate-900 font-medium">{product.details.skinType}</span>
                  </div>
                )}
                {product.details.material && (
                  <div>
                    <span className="text-chocolate-500 text-[10px] uppercase font-bold block">Material</span>
                    <span className="text-chocolate-900 font-medium">{product.details.material}</span>
                  </div>
                )}
                {product.details.finish && (
                  <div>
                    <span className="text-chocolate-500 text-[10px] uppercase font-bold block">Finish / Texture</span>
                    <span className="text-chocolate-900 font-medium">{product.details.finish}</span>
                  </div>
                )}
                {product.details.volume && (
                  <div>
                    <span className="text-chocolate-500 text-[10px] uppercase font-bold block">Net Volume</span>
                    <span className="text-chocolate-900 font-medium">{product.details.volume}</span>
                  </div>
                )}
                {product.details.dimensions && (
                  <div>
                    <span className="text-chocolate-500 text-[10px] uppercase font-bold block">Dimensions</span>
                    <span className="text-chocolate-900 font-medium">{product.details.dimensions}</span>
                  </div>
                )}
                {product.details.origin && (
                  <div>
                    <span className="text-chocolate-500 text-[10px] uppercase font-bold block">Store Origin</span>
                    <span className="text-chocolate-900 font-medium">{product.details.origin}</span>
                  </div>
                )}
              </div>

              {/* Wholesale Callout on Product */}
              {product.wholesaleAvailable && (
                <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-700" />
                    <div>
                      <strong className="text-amber-950 font-bold block">
                        Wholesale Rate: ₹{product.wholesalePrice}/pc
                      </strong>
                      <span className="text-[11px] text-amber-800">
                        Minimum order quantity: {product.minWholesaleQty} units
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenWholesale();
                    }}
                    className="px-3 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] whitespace-nowrap transition-colors"
                  >
                    Wholesale Order
                  </button>
                </div>
              )}
            </div>

            {/* Quantity Selector & Action CTAs */}
            <div className="space-y-3 pt-3 border-t border-cream-200">
              {/* Quantity row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-chocolate-800 uppercase tracking-wider">
                    Quantity:
                  </span>
                  <div className="flex items-center rounded-xl bg-white border border-gold-300 p-1 shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-lg text-chocolate-700 hover:bg-cream-100 flex items-center justify-center"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-xs text-chocolate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 rounded-lg text-chocolate-700 hover:bg-cream-100 flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isFav
                        ? 'bg-rose-50 border-rose-300 text-rose-600'
                        : 'bg-white border-cream-300 text-chocolate-700 hover:text-rose-600'
                    }`}
                    title={isFav ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-600' : ''}`} />
                  </button>

                  {/* Share */}
                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-xl bg-white border border-cream-300 text-chocolate-700 hover:text-gold-700 transition-all relative"
                    title="Share product"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    addToCart(product, quantity);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-cream-100 hover:bg-cream-200 text-chocolate-900 font-bold text-xs uppercase tracking-wider border border-gold-400 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-gold-700" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => {
                    onBuyNow(product, quantity);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 font-bold text-xs uppercase tracking-wider shadow-luxury transition-all flex items-center justify-center gap-2 border border-gold-500"
                >
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Direct WhatsApp Enquiry Button */}
              <button
                onClick={handleWhatsAppInquire}
                className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>Enquire Product on WhatsApp (9119595951)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
