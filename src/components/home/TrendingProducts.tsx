import React, { useState } from 'react';
import { Product, ProductCategory } from '../../types';
import { ProductCard } from '../shop/ProductCard';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';

interface TrendingProductsProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onViewAllShop: () => void;
  onOpenWholesale: () => void;
}

const TABS: Array<{ label: string; value: ProductCategory | 'All' }> = [
  { label: 'All Picks', value: 'All' },
  { label: 'Skincare', value: 'Skincare' },
  { label: 'Cosmetics', value: 'Cosmetics' },
  { label: 'Jewellery', value: 'Artificial Jewellery' },
  { label: 'Handbags', value: 'Handbags' },
  { label: 'Accessories', value: 'Beauty Accessories' },
];

export const TrendingProducts: React.FC<TrendingProductsProps> = ({
  products,
  onQuickView,
  onViewAllShop,
  onOpenWholesale,
}) => {
  const [activeTab, setActiveTab] = useState<ProductCategory | 'All'>('All');

  const filteredProducts = activeTab === 'All'
    ? products.slice(0, 8)
    : products.filter(p => p.category === activeTab).slice(0, 8);

  return (
    <section className="py-16 sm:py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-300/40">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              Most Loved in Nagpur
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-900 tracking-tight">
              Trending Now
            </h2>
            <p className="text-sm text-chocolate-600 mt-1">
              Top rated skincare, beauty essentials, luxury handbags & sparkling jewellery.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.value
                    ? 'bg-chocolate-900 text-cream-50 shadow-sm border border-chocolate-900'
                    : 'bg-white text-chocolate-700 hover:bg-cream-200 border border-cream-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onOpenWholesale={onOpenWholesale}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={onViewAllShop}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-cream-50 hover:bg-gold-50 text-chocolate-900 font-bold text-xs tracking-wider uppercase border border-gold-400/80 shadow-soft hover:shadow-luxury transition-all duration-300 transform hover:scale-105"
          >
            <span>Explore Full 200+ Products Collection</span>
            <ArrowRight className="w-4 h-4 text-gold-600" />
          </button>
        </div>
      </div>
    </section>
  );
};
