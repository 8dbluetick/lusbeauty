import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../../types';
import { ProductCard } from './ProductCard';
import { 
  Filter, 
  SlidersHorizontal, 
  ArrowUpDown, 
  X, 
  Sparkles, 
  Check,
  Search as SearchIcon,
  RotateCcw
} from 'lucide-react';

interface ShopViewProps {
  products: Product[];
  selectedCategory: ProductCategory | 'All';
  setSelectedCategory: (cat: ProductCategory | 'All') => void;
  onQuickView: (product: Product) => void;
  onOpenWholesale: () => void;
}

const CATEGORIES: Array<ProductCategory | 'All'> = [
  'All',
  'Skincare',
  'Cosmetics',
  'Artificial Jewellery',
  'Handbags',
  'Beauty Accessories',
  'Fashion Accessories',
];

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  selectedCategory,
  setSelectedCategory,
  onQuickView,
  onOpenWholesale,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(3000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyWholesale, setOnlyWholesale] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Extract available subcategories for active category
  const availableSubcategories = useMemo(() => {
    const relevantProducts = selectedCategory === 'All'
      ? products
      : products.filter(p => p.category === selectedCategory);
    const subcats = Array.from(new Set(relevantProducts.map(p => p.subcategory)));
    return ['All', ...subcats];
  }, [products, selectedCategory]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        // Category filter
        if (selectedCategory !== 'All' && product.category !== selectedCategory) {
          return false;
        }
        // Subcategory filter
        if (selectedSubcategory !== 'All' && product.subcategory !== selectedSubcategory) {
          return false;
        }
        // Price filter
        if (product.price > priceRange) {
          return false;
        }
        // Stock filter
        if (onlyInStock && !product.inStock) {
          return false;
        }
        // Wholesale filter
        if (onlyWholesale && !product.wholesaleAvailable) {
          return false;
        }
        // Search text
        if (searchFilter.trim()) {
          const q = searchFilter.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchTags = product.tags.some(t => t.toLowerCase().includes(q));
          const matchSub = product.subcategory.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchTags && !matchSub) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') return b.discountPercentage - a.discountPercentage;
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
  }, [products, selectedCategory, selectedSubcategory, priceRange, onlyInStock, onlyWholesale, searchFilter, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setPriceRange(3000);
    setOnlyInStock(false);
    setOnlyWholesale(false);
    setSearchFilter('');
    setSortBy('featured');
  };

  return (
    <div className="py-8 sm:py-12 bg-cream-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 border-b border-gold-200/80 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-700 block">
                Lush Beauty Mart Nagpur • Product Catalog
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-900 mt-1">
                {selectedCategory === 'All' ? 'Complete Collection' : selectedCategory}
              </h1>
              <p className="text-xs sm:text-sm text-chocolate-600 mt-1">
                Showing {filteredProducts.length} items available in-store and online
              </p>
            </div>

            {/* Quick Search in Shop */}
            <div className="relative w-full md:w-80">
              <SearchIcon className="w-4 h-4 text-chocolate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Search within products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-gold-300/80 text-xs text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-soft"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-chocolate-400 hover:text-chocolate-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gold-200/80 shadow-soft space-y-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-gold-700" />
                  <h3 className="font-serif text-base font-bold text-chocolate-900">Filters</h3>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-chocolate-500 hover:text-gold-700 flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-800 block">
                  Category
                </label>
                <div className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedSubcategory('All');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedCategory === cat
                          ? 'bg-gold-100/90 text-gold-900 font-bold border border-gold-300/60'
                          : 'text-chocolate-700 hover:bg-cream-100'
                      }`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-gold-700" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories (if applicable) */}
              {availableSubcategories.length > 2 && (
                <div className="space-y-2 pt-2 border-t border-cream-200">
                  <label className="text-xs font-bold uppercase tracking-wider text-chocolate-800 block">
                    Subcategory
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableSubcategories.map(sub => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubcategory(sub)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                          selectedSubcategory === sub
                            ? 'bg-chocolate-900 text-cream-50 font-bold'
                            : 'bg-cream-100 text-chocolate-700 hover:bg-cream-200'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range Slider */}
              <div className="space-y-2 pt-2 border-t border-cream-200">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="uppercase tracking-wider text-chocolate-800">Max Price</span>
                  <span className="text-gold-700">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={3500}
                  step={50}
                  value={priceRange}
                  onChange={e => setPriceRange(Number(e.target.value))}
                  className="w-full accent-gold-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-chocolate-400">
                  <span>₹200</span>
                  <span>₹3,500+</span>
                </div>
              </div>

              {/* Quick Toggles */}
              <div className="space-y-3 pt-2 border-t border-cream-200 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-chocolate-800">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={e => setOnlyInStock(e.target.checked)}
                    className="rounded text-gold-600 focus:ring-gold-500 w-4 h-4 accent-gold-600"
                  />
                  <span>In Stock Items Only</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-chocolate-800">
                  <input
                    type="checkbox"
                    checked={onlyWholesale}
                    onChange={e => setOnlyWholesale(e.target.checked)}
                    className="rounded text-gold-600 focus:ring-gold-500 w-4 h-4 accent-gold-600"
                  />
                  <span className="flex items-center gap-1">
                    <span>Wholesale Rates Available</span>
                    <Sparkles className="w-3 h-3 text-gold-600" />
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Product Catalog Section */}
          <main className="lg:col-span-9 space-y-6">
            {/* Top Toolbar: Mobile Filter Button + Sort Selector */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gold-200/60 shadow-soft flex items-center justify-between gap-3">
              {/* Mobile Filter Trigger */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cream-100 text-chocolate-900 text-xs font-bold border border-gold-200"
              >
                <Filter className="w-4 h-4 text-gold-700" />
                <span>Filters</span>
              </button>

              {/* Active Badges Summary */}
              <div className="hidden sm:flex items-center gap-2 overflow-x-auto text-xs text-chocolate-600">
                <span className="font-semibold text-chocolate-900">Active:</span>
                <span className="px-2 py-0.5 rounded-md bg-cream-100 text-chocolate-800 border border-cream-300">
                  {selectedCategory}
                </span>
                {selectedSubcategory !== 'All' && (
                  <span className="px-2 py-0.5 rounded-md bg-cream-100 text-chocolate-800 border border-cream-300">
                    {selectedSubcategory}
                  </span>
                )}
                {priceRange < 3000 && (
                  <span className="px-2 py-0.5 rounded-md bg-cream-100 text-chocolate-800 border border-cream-300">
                    Under ₹{priceRange}
                  </span>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-chocolate-500 hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="bg-cream-50 border border-gold-300/80 rounded-xl px-3 py-1.5 text-xs font-semibold text-chocolate-900 focus:outline-none focus:border-gold-500 shadow-sm cursor-pointer"
                >
                  <option value="featured">✨ Best Sellers & Featured</option>
                  <option value="price-asc">💵 Price: Low to High</option>
                  <option value="price-desc">💎 Price: High to Low</option>
                  <option value="rating">⭐ Highest Rated</option>
                  <option value="discount">🔥 Biggest Discount</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gold-200 shadow-soft space-y-4">
                <div className="w-16 h-16 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center mx-auto text-2xl">
                  🔍
                </div>
                <h3 className="font-serif text-xl font-bold text-chocolate-900">
                  No products matched your criteria
                </h3>
                <p className="text-xs text-chocolate-600 max-w-sm mx-auto">
                  Try adjusting your price filter, search terms, or resetting your category selections.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-full bg-chocolate-900 text-cream-50 text-xs font-bold uppercase tracking-wider"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                    onOpenWholesale={onOpenWholesale}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-over Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-chocolate-950/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          ></div>
          <div className="relative ml-auto w-full max-w-xs bg-cream-50 h-full p-6 shadow-2xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gold-700" />
                <h3 className="font-serif text-lg font-bold text-chocolate-900">Filters</h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-chocolate-500 hover:text-chocolate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-800 block">
                Category
              </label>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedSubcategory('All');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-gold-100 text-gold-900 font-bold border border-gold-300'
                        : 'text-chocolate-700 hover:bg-cream-100'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-gold-700" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Price Slider */}
            <div className="space-y-2 pt-2 border-t border-cream-200">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="uppercase tracking-wider text-chocolate-800">Max Price</span>
                <span className="text-gold-700">₹{priceRange}</span>
              </div>
              <input
                type="range"
                min={200}
                max={3500}
                step={50}
                value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                className="w-full accent-gold-600"
              />
            </div>

            {/* Mobile Action Buttons */}
            <div className="pt-6 border-t border-cream-200 flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 rounded-xl border border-chocolate-300 text-chocolate-800 text-xs font-semibold"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-chocolate-900 text-cream-50 text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
