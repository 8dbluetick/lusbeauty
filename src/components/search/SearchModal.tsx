import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, X, ArrowRight, Star, Sparkles, TrendingUp } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { Product, ProductCategory } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onViewCategory: (category: ProductCategory) => void;
}

const POPULAR_SEARCHES = [
  'Kundan Necklace',
  'Matte Lipstick',
  'Kumkumadi Serum',
  'Sling Bag',
  'Sunscreen SPF 50',
  'Bridal Jewellery',
  'Makeup Brushes',
  'American Diamond Ring',
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onViewCategory,
}) => {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    return products.filter(p => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchSub = p.subcategory.toLowerCase().includes(q);
      const matchTags = p.tags.some(t => t.toLowerCase().includes(q));
      return matchName || matchCategory || matchSub || matchTags;
    });
  }, [products, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6 animate-fade-in">
      <div className="fixed inset-0 bg-chocolate-950/75 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-cream-50 rounded-3xl max-w-2xl w-full shadow-2xl border-2 border-gold-300 z-10 overflow-hidden animate-slide-up">
        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 bg-white border-b border-cream-200 flex items-center gap-3">
          <SearchIcon className="w-5 h-5 text-gold-700 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search skincare, cosmetics, jewellery, handbags..."
            className="flex-1 text-sm sm:text-base text-chocolate-900 bg-transparent focus:outline-none placeholder:text-chocolate-400 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-chocolate-400 hover:text-chocolate-900"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-chocolate-800 text-xs font-semibold"
          >
            Esc
          </button>
        </div>

        {/* Results Area */}
        <div className="p-5 sm:p-6 max-h-[65vh] overflow-y-auto space-y-5">
          {searchTerm.trim() ? (
            <div>
              <div className="flex items-center justify-between text-xs text-chocolate-500 mb-3">
                <span>Matching Products ({searchResults.length})</span>
                <span className="text-[11px]">Click to view details</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p className="text-sm font-semibold text-chocolate-800">
                    No matching items found for "{searchTerm}"
                  </p>
                  <p className="text-xs text-chocolate-500">
                    Try searching for keywords like "Serum", "Lipstick", "Kundan", or "Bag".
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {searchResults.map(product => (
                    <div
                      key={product.id}
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="flex items-center gap-3.5 p-3 rounded-2xl bg-white hover:bg-gold-50/70 border border-cream-200 hover:border-gold-300 transition-all cursor-pointer group shadow-soft"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-14 h-14 rounded-xl object-cover border border-gold-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase font-bold text-gold-700">
                          {product.category} • {product.subcategory}
                        </span>
                        <h4 className="font-serif text-xs sm:text-sm font-bold text-chocolate-900 truncate group-hover:text-gold-800">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-chocolate-950">
                            ₹{product.price}
                          </span>
                          {product.mrp > product.price && (
                            <span className="text-[10px] text-chocolate-400 line-through">
                              ₹{product.mrp}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-chocolate-300 group-hover:text-gold-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Popular Search Suggestions */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-chocolate-700 mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5 text-gold-600" />
                  Popular Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map(item => (
                    <button
                      key={item}
                      onClick={() => setSearchTerm(item)}
                      className="px-3 py-1.5 rounded-full bg-white hover:bg-gold-100/70 border border-gold-200 text-xs text-chocolate-800 font-medium transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Browse Categories */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-chocolate-700 mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                  Explore Departments
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Skincare',
                    'Cosmetics',
                    'Artificial Jewellery',
                    'Handbags',
                    'Beauty Accessories',
                    'Fashion Accessories',
                  ].map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        onViewCategory(cat as ProductCategory);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-white hover:bg-gold-100 text-left text-xs font-semibold text-chocolate-900 border border-cream-200 transition-colors flex items-center justify-between"
                    >
                      <span>{cat}</span>
                      <ArrowRight className="w-3 h-3 text-gold-600" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
