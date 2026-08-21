import React, { useState, useEffect } from 'react';
import { X, Sparkles, Upload, Plus, Trash2 } from 'lucide-react';
import { Product, ProductCategory } from '../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'>, id?: string) => void;
  initialProduct?: Product | null;
}

const CATEGORIES: ProductCategory[] = [
  'Skincare',
  'Cosmetics',
  'Artificial Jewellery',
  'Handbags',
  'Beauty Accessories',
  'Fashion Accessories',
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
}) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    category: 'Skincare',
    subcategory: '',
    price: 499,
    mrp: 799,
    discountPercentage: 35,
    rating: 4.8,
    reviewCount: 20,
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=900&auto=format&fit=crop'],
    description: '',
    details: {
      origin: 'Nagpur / Certified Studio',
      skinType: '',
      material: '',
      finish: '',
      volume: '',
      dimensions: '',
    },
    inStock: true,
    stockCount: 50,
    isNewArrival: false,
    isBestSeller: false,
    isTrending: true,
    wholesaleAvailable: true,
    minWholesaleQty: 10,
    wholesalePrice: 280,
    tags: ['Nagpur', 'New'],
  });

  const [imageInput, setImageInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name,
        category: initialProduct.category,
        subcategory: initialProduct.subcategory,
        price: initialProduct.price,
        mrp: initialProduct.mrp,
        discountPercentage: initialProduct.discountPercentage,
        rating: initialProduct.rating,
        reviewCount: initialProduct.reviewCount,
        images: initialProduct.images,
        description: initialProduct.description,
        details: initialProduct.details,
        inStock: initialProduct.inStock,
        stockCount: initialProduct.stockCount,
        isNewArrival: initialProduct.isNewArrival || false,
        isBestSeller: initialProduct.isBestSeller || false,
        isTrending: initialProduct.isTrending || false,
        wholesaleAvailable: initialProduct.wholesaleAvailable || false,
        minWholesaleQty: initialProduct.minWholesaleQty || 10,
        wholesalePrice: initialProduct.wholesalePrice || Math.round(initialProduct.price * 0.6),
        tags: initialProduct.tags,
      });
    }
  }, [initialProduct]);

  if (!isOpen) return null;

  const handlePriceChange = (price: number, mrp: number) => {
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
    setFormData(prev => ({
      ...prev,
      price,
      mrp,
      discountPercentage: discount,
      wholesalePrice: prev.wholesalePrice || Math.round(price * 0.6),
    }));
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
      }));
      setImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || formData.images.length === 0) {
      alert('Please provide product name, price, and at least one image URL.');
      return;
    }
    onSave(formData, initialProduct?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="fixed inset-0 bg-chocolate-950/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-cream-50 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border-2 border-gold-400 z-10 p-6 sm:p-8 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream-200 pb-4 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-700 block">
              Inventory & Product Manager
            </span>
            <h3 className="font-serif text-2xl font-bold text-chocolate-900">
              {initialProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-chocolate-400 hover:text-chocolate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-chocolate-800 uppercase block mb-1">
                Product Title / Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Royal Kundan Choker Necklace Set"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-chocolate-800 uppercase block mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-chocolate-800 uppercase block mb-1">
                Subcategory
              </label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                placeholder="e.g. Necklaces, Lipsticks, Serums"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
              />
            </div>

            {/* Pricing Details */}
            <div>
              <label className="text-xs font-bold text-chocolate-800 uppercase block mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={formData.price}
                onChange={e => handlePriceChange(Number(e.target.value), formData.mrp)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-chocolate-800 uppercase block mb-1">
                MRP (₹) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={formData.mrp}
                onChange={e => handlePriceChange(formData.price, Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-chocolate-800 uppercase block mb-1">
                Discount Calculated (%)
              </label>
              <input
                type="text"
                disabled
                value={`${formData.discountPercentage}% OFF`}
                className="w-full px-3.5 py-2.5 rounded-xl bg-cream-200 border border-cream-300 text-xs text-chocolate-700 font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-chocolate-800 uppercase block mb-1">
                Stock Quantity (units)
              </label>
              <input
                type="number"
                value={formData.stockCount}
                onChange={e => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
              />
            </div>
          </div>

          {/* Wholesale Tier Settings */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-bold text-amber-950 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.wholesaleAvailable}
                  onChange={e => setFormData({ ...formData, wholesaleAvailable: e.target.checked })}
                  className="rounded text-amber-700 w-4 h-4 accent-amber-700"
                />
                <span>Enable B2B Wholesale Pricing for this product</span>
              </label>
            </div>

            {formData.wholesaleAvailable && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-semibold text-amber-900 block mb-1">
                    Wholesale Price / Piece (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.wholesalePrice}
                    onChange={e => setFormData({ ...formData, wholesalePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs text-chocolate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-amber-900 block mb-1">
                    Min Wholesale Quantity (MOQ)
                  </label>
                  <input
                    type="number"
                    value={formData.minWholesaleQty}
                    onChange={e => setFormData({ ...formData, minWholesaleQty: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs text-chocolate-900"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Image URLs */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-chocolate-800 uppercase block">
              Product Images (High-Res Image URLs)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageInput}
                onChange={e => setImageInput(e.target.value)}
                placeholder="Paste direct image link (e.g. Unsplash URL)"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2.5 rounded-xl bg-chocolate-900 text-cream-50 text-xs font-bold transition-colors"
              >
                Add Image
              </button>
            </div>

            {/* Thumbnail Preview Area */}
            <div className="flex flex-wrap gap-3 pt-2">
              {formData.images.map((img, i) => (
                <div key={i} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-gold-300 shadow-sm">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-chocolate-800 uppercase block mb-1">
              Description & Benefits
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the formulation, materials, look and craftsmanship..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm"
            ></textarea>
          </div>

          {/* Badges & Flags */}
          <div className="flex flex-wrap gap-4 pt-2 border-t border-cream-200 text-xs text-chocolate-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={e => setFormData({ ...formData, inStock: e.target.checked })}
                className="rounded text-gold-600 w-4 h-4 accent-gold-600"
              />
              <span>In Stock Available</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNewArrival}
                onChange={e => setFormData({ ...formData, isNewArrival: e.target.checked })}
                className="rounded text-gold-600 w-4 h-4 accent-gold-600"
              />
              <span>Mark as New Arrival ✨</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBestSeller}
                onChange={e => setFormData({ ...formData, isBestSeller: e.target.checked })}
                className="rounded text-gold-600 w-4 h-4 accent-gold-600"
              />
              <span>Mark as Best Seller 🔥</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-cream-200 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-cream-300 text-chocolate-800 text-xs font-semibold hover:bg-cream-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 font-bold text-xs uppercase tracking-wider shadow-luxury border border-gold-500"
            >
              Save & Publish Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
