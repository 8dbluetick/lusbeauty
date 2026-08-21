import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, MessageCircle, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { STORE_INFO } from '../../data/storeInfo';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onOpenWholesale?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const isFavorite = isInWishlist(product.id);

  // Switch image on hover if 2nd image available
  const displayImage = isHovered && product.images.length > 1
    ? product.images[1]
    : product.images[0];

  const handleWhatsAppEnquire = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = `Hi Lush Beauty Mart Nagpur! I am interested in "${product.name}" (Price: ₹${product.price}). Is this in stock at your store?`;
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div
      className="group relative bg-white rounded-2xl sm:rounded-3xl border border-cream-200 hover:border-gold-300 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-cream-50 cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.discountPercentage > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] sm:text-[11px] font-bold tracking-wider uppercase shadow-sm">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2.5 py-0.5 rounded-full bg-gold-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-0.5 rounded-full bg-chocolate-900 text-cream-100 text-[10px] font-bold tracking-wider uppercase shadow-sm">
              Just In
            </span>
          )}
        </div>

        {/* Top Right Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
              isFavorite
                ? 'bg-rose-50 text-rose-600 border border-rose-200 scale-110'
                : 'bg-white/90 text-chocolate-700 hover:text-rose-600 hover:bg-white border border-cream-200'
            }`}
            title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600' : ''}`} />
          </button>

          {/* WhatsApp Direct Product Inquire */}
          <button
            onClick={handleWhatsAppEnquire}
            className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 flex items-center justify-center transition-all duration-200 shadow-sm"
            title="Enquire on WhatsApp"
            aria-label="Enquire on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Quick View Hover Pill Overlay */}
        <div className="absolute bottom-3 left-3 right-3 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2 rounded-xl bg-white/95 backdrop-blur-md hover:bg-white text-chocolate-900 text-xs font-semibold shadow-card flex items-center justify-center gap-1.5 border border-gold-200 hover:border-gold-400 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-gold-700" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-chocolate-500">
            <span className="font-semibold uppercase tracking-wider text-gold-700 text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-900 font-bold border border-amber-200/50">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-[10px] text-chocolate-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-serif text-sm sm:text-base font-bold text-chocolate-900 line-clamp-2 hover:text-gold-700 cursor-pointer transition-colors leading-snug"
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Action Section */}
        <div className="pt-2 border-t border-cream-200/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold text-chocolate-950">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-chocolate-400 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.wholesaleAvailable && (
              <span className="text-[10px] text-gold-700 font-semibold block">
                Wholesale: ₹{product.wholesalePrice}/pc (Min {product.minWholesaleQty})
              </span>
            )}
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={() => addToCart(product, 1)}
            disabled={!product.inStock}
            className={`px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm ${
              product.inStock
                ? 'bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 hover:shadow-md active:scale-95'
                : 'bg-cream-200 text-chocolate-400 cursor-not-allowed'
            }`}
            title={product.inStock ? 'Add to Cart' : 'Out of Stock'}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">
              {product.inStock ? 'Add' : 'Sold'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
