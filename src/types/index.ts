export type ProductCategory = 
  | 'Skincare'
  | 'Cosmetics'
  | 'Artificial Jewellery'
  | 'Handbags'
  | 'Beauty Accessories'
  | 'Fashion Accessories';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  mrp: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  details: {
    origin?: string;
    skinType?: string;
    material?: string;
    finish?: string;
    dimensions?: string;
    volume?: string;
    closure?: string;
    guarantee?: string;
  };
  inStock: boolean;
  stockCount: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  wholesaleAvailable?: boolean;
  minWholesaleQty?: number;
  wholesalePrice?: number;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface Offer {
  id: string;
  title: string;
  badge: string;
  description: string;
  code: string;
  discountType: 'percentage' | 'fixed' | 'bogo';
  discountValue: number;
  minOrderValue: number;
  category?: ProductCategory | 'All';
  bgGradient?: string;
  image?: string;
  active: boolean;
}

export interface StoreInfo {
  name: string;
  tagline: string;
  address: {
    line1: string;
    line2: string;
    landmark: string;
    metroPillar: string;
    road: string;
    area: string;
    city: string;
    pincode: string;
  };
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  timings: string;
  googleMapsUrl: string;
}

export interface WholesaleInquiry {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  city: string;
  category: ProductCategory | 'Multiple Categories';
  estimatedQuantity: string;
  message: string;
  submittedAt: string;
  status: 'Pending' | 'Contacted' | 'Closed';
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    pincode: string;
    orderNotes?: string;
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  total: number;
  paymentMethod: 'cod' | 'upi' | 'pickup';
  orderDate: string;
  status: 'Received' | 'Preparing' | 'Out for Delivery' | 'Delivered';
}
