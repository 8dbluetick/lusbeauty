import React from 'react';
import { Instagram, Heart, MessageCircle, ArrowUpRight } from 'lucide-react';
import { STORE_INFO } from '../../data/storeInfo';

interface InstaPost {
  id: string;
  image: string;
  likes: number;
  comments: number;
  caption: string;
}

const INSTA_POSTS: InstaPost[] = [
  {
    id: 'post-1',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
    likes: 428,
    comments: 34,
    caption: 'Bridal Kundan perfection arriving at our Nagpur showroom ✨ #LushJewels #NagpurBrides',
  },
  {
    id: 'post-2',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop',
    likes: 512,
    comments: 48,
    caption: 'Velvet matte shades that stay fresh through every celebration 💄 #LushCosmetics',
  },
  {
    id: 'post-3',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop',
    likes: 389,
    comments: 29,
    caption: 'Structured luxury bags in warm tones for your everyday elevation 👜 #NagpurFashion',
  },
  {
    id: 'post-4',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop',
    likes: 640,
    comments: 52,
    caption: 'Pure Ayurvedic Kumkumadi glow elixir. Available in-store & for delivery 🌿',
  },
  {
    id: 'post-5',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop',
    likes: 720,
    comments: 63,
    caption: 'A glimpse of our bustling Nagpur store at Lad Square! Visit us this weekend 📍',
  },
  {
    id: 'post-6',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
    likes: 310,
    comments: 22,
    caption: 'Emerald statement rings sparkling under the store chandeliers ✨ #LushJewellery',
  },
  {
    id: 'post-7',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop',
    likes: 445,
    comments: 31,
    caption: 'Professional 12-piece rose gold makeup brushes ready for retail & salon wholesale 🪄',
  },
  {
    id: 'post-8',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=600&auto=format&fit=crop',
    likes: 580,
    comments: 44,
    caption: 'Quilted chain sling bags in blush pink — our bestselling weekend accessory 🎀',
  },
  {
    id: 'post-9',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=600&auto=format&fit=crop',
    likes: 490,
    comments: 39,
    caption: 'Customized festive luxury gift hampers packed with love in Nagpur 🎁',
  },
];

export const InstagramFeed: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-cream-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-semibold uppercase tracking-wider mb-2 border border-rose-200">
            <Instagram className="w-3.5 h-3.5 text-rose-600" />
            Social Gallery
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-900 tracking-tight">
            Follow {STORE_INFO.instagram}
          </h2>
          <p className="text-sm text-chocolate-600 mt-2">
            Discover our latest products, offers and store updates from our Nagpur showroom.
          </p>
        </div>

        {/* 3x3 Responsive Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {INSTA_POSTS.map(post => (
            <a
              key={post.id}
              href={`https://instagram.com/${STORE_INFO.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl overflow-hidden aspect-square shadow-soft border border-cream-200 bg-chocolate-900"
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-chocolate-950/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center text-white">
                <Instagram className="w-6 h-6 text-gold-400 mb-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300" />
                <div className="flex items-center gap-4 text-xs font-bold text-cream-100 mb-2">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-gold-300" />
                    {post.comments}
                  </span>
                </div>
                <p className="text-[11px] text-cream-200 line-clamp-2 leading-tight">
                  {post.caption}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Follow CTA */}
        <div className="mt-10 text-center">
          <a
            href={`https://instagram.com/${STORE_INFO.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600 hover:from-purple-800 hover:to-rose-700 text-white font-bold text-xs tracking-wider uppercase shadow-luxury hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow Us on Instagram</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
