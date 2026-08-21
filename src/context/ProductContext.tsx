import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Offer, WholesaleInquiry, ContactMessage, Order, ProductCategory } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { INITIAL_OFFERS } from '../data/initialOffers';

interface ProductContextType {
  products: Product[];
  offers: Offer[];
  wholesaleInquiries: WholesaleInquiry[];
  contactMessages: ContactMessage[];
  orders: Order[];
  selectedCategory: ProductCategory | 'All';
  setSelectedCategory: (category: ProductCategory | 'All') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;
  addOffer: (offer: Omit<Offer, 'id'>) => void;
  updateOffer: (id: string, updated: Partial<Offer>) => void;
  deleteOffer: (id: string) => void;
  submitWholesaleInquiry: (inquiry: Omit<WholesaleInquiry, 'id' | 'submittedAt' | 'status'>) => void;
  submitContactMessage: (message: Omit<ContactMessage, 'id' | 'submittedAt'>) => void;
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'orderDate' | 'status'>) => Order;
  resetToDefaultData: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'lush_products_v1',
  OFFERS: 'lush_offers_v1',
  WHOLESALE: 'lush_wholesale_v1',
  MESSAGES: 'lush_messages_v1',
  ORDERS: 'lush_orders_v1',
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed parsing products from localStorage', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OFFERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed parsing offers from localStorage', e);
      }
    }
    return INITIAL_OFFERS;
  });

  const [wholesaleInquiries, setWholesaleInquiries] = useState<WholesaleInquiry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WHOLESALE);
    return saved ? JSON.parse(saved) : [];
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WHOLESALE, JSON.stringify(wholesaleInquiries));
  }, [wholesaleInquiries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProd,
      id: 'prod-' + Date.now(),
    };
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleProductStock = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const addOffer = (newOff: Omit<Offer, 'id'>) => {
    const offer: Offer = {
      ...newOff,
      id: 'off-' + Date.now(),
    };
    setOffers(prev => [...prev, offer]);
  };

  const updateOffer = (id: string, updated: Partial<Offer>) => {
    setOffers(prev => prev.map(o => (o.id === id ? { ...o, ...updated } : o)));
  };

  const deleteOffer = (id: string) => {
    setOffers(prev => prev.filter(o => o.id !== id));
  };

  const submitWholesaleInquiry = (inquiry: Omit<WholesaleInquiry, 'id' | 'submittedAt' | 'status'>) => {
    const newInquiry: WholesaleInquiry = {
      ...inquiry,
      id: 'ws-' + Date.now(),
      submittedAt: new Date().toISOString(),
      status: 'Pending',
    };
    setWholesaleInquiries(prev => [newInquiry, ...prev]);
  };

  const submitContactMessage = (message: Omit<ContactMessage, 'id' | 'submittedAt'>) => {
    const newMsg: ContactMessage = {
      ...message,
      id: 'msg-' + Date.now(),
      submittedAt: new Date().toISOString(),
    };
    setContactMessages(prev => [newMsg, ...prev]);
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'orderDate' | 'status'>): Order => {
    const orderNumber = 'LUSH-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderNumber,
      orderDate: new Date().toISOString(),
      status: 'Received',
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const resetToDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOffers(INITIAL_OFFERS);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(INITIAL_OFFERS));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        offers,
        wholesaleInquiries,
        contactMessages,
        orders,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        addOffer,
        updateOffer,
        deleteOffer,
        submitWholesaleInquiry,
        submitContactMessage,
        placeOrder,
        resetToDefaultData,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
