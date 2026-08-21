import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCategory } from '../../types';

interface CategoryGridProps {
  onSelectCategory: (category: ProductCategory) => void;
}

interface CategoryCardItem {
  id: ProductCategory;
  title: string;
  subtitle: string;
  itemCount: string;
  image: string;
  accent: string;
}

const CATEGORIES: CategoryCardItem[] = [
  {
    id: 'Skincare',
    title: 'Skincare',
    subtitle: 'Serums, Sunscreens, Moisturizers & Cleansers',
    itemCount: '40+ Essentials',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
    accent: 'from-amber-950/80 via-chocolate-900/40 to-transparent',
  },
  {
    id: 'Cosmetics',
    title: 'Cosmetics',
    subtitle: 'Lipsticks, Foundations, Kajal, Eyeliners & Mascaras',
    itemCount: '60+ Shades',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop',
    accent: 'from-rose-950/80 via-chocolate-900/40 to-transparent',
  },
  {
    id: 'Artificial Jewellery',
    title: 'Artificial Jewellery',
    subtitle: 'Kundan Sets, AD Rings, Jhumkas, Bangles & Tikka',
    itemCount: '80+ Designs',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    accent: 'from-stone-950/80 via-chocolate-900/40 to-transparent',
  },
  {
    id: 'Handbags',
    title: 'Handbags & Slings',
    subtitle: 'Structured Totes, Quilted Slings & Baguette Bags',
    itemCount: '35+ Styles',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    accent: 'from-amber-950/80 via-chocolate-900/40 to-transparent',
  },
  {
    id: 'Beauty Accessories',
    title: 'Beauty Accessories',
    subtitle: 'Pro Makeup Brushes, Jade Rollers & Blenders',
    itemCount: '30+ Tools',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop',
    accent: 'from-stone-900/80 via-chocolate-900/40 to-transparent',
  },
  {
    id: 'Fashion Accessories',
    title: 'Fashion Accessories',
    subtitle: 'Embellished Headbands, Saree Brooches & Gift Hampers',
    itemCount: '25+ Items',
    image: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?q=80&w=800&auto=format&fit=crop',
    accent: 'from-chocolate-950/80 via-chocolate-900/40 to-transparent',
  },
];

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-16 sm:py-20 bg-cream-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-semibold uppercase tracking-wider mb-2 border border-gold-300/40">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            Curated Collections
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-900 tracking-tight">
            Shop By Category
          </h2>
          <p className="text-sm text-chocolate-600 mt-2">
            Explore our handpicked categories in-store in Nagpur or browse and order online.
          </p>
        </div>

        {/* Categories Grid (2 cols on mobile, 3 cols on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CATEGORIES.map(category => (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="group relative rounded-3xl overflow-hidden shadow-soft hover:shadow-luxury transition-all duration-500 cursor-pointer bg-white border border-gold-200/60 flex flex-col justify-end aspect-[4/5] sm:aspect-[3/4]"
            >
              {/* Product Image */}
              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 group-hover:brightness-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Dynamic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950/90 via-chocolate-900/40 to-transparent transition-opacity group-hover:opacity-90"></div>

              {/* Top Item Count Tag */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-chocolate-900 border border-gold-200/80 shadow-sm">
                {category.itemCount}
              </div>

              {/* Category Details at Bottom */}
              <div className="relative z-10 p-6 sm:p-7 space-y-2 transform group-hover:-translate-y-1 transition-transform duration-300">
                <span className="text-[10px] font-bold tracking-widest text-gold-300 uppercase block">
                  Lush Collection
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {category.title}
                </h3>
                <p className="text-xs text-cream-200 line-clamp-1 opacity-90 group-hover:opacity-100">
                  {category.subtitle}
                </p>

                {/* Explore CTA */}
                <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-gold-300 group-hover:text-gold-200">
                  <span>Explore Collection</span>
                  <div className="w-6 h-6 rounded-full bg-gold-500/20 group-hover:bg-gold-500 text-gold-300 group-hover:text-chocolate-950 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
