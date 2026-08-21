import React, { useState } from 'react';
import { 
  Package, 
  Sparkles, 
  ShoppingBag, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Tag, 
  RotateCcw, 
  ExternalLink,
  Store,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { Product, Offer } from '../../types';
import { ProductFormModal } from './ProductFormModal';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const {
    products,
    offers,
    wholesaleInquiries,
    contactMessages,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    addOffer,
    deleteOffer,
    resetToDefaultData,
  } = useProducts();

  const [activeTab, setActiveTab] = useState<'products' | 'offers' | 'orders' | 'wholesale'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  // New Offer Form State
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferCode, setNewOfferCode] = useState('');
  const [newOfferDiscount, setNewOfferDiscount] = useState(20);
  const [newOfferMinOrder, setNewOfferMinOrder] = useState(599);

  const handleSaveProduct = (productData: Omit<Product, 'id'>, id?: string) => {
    if (id) {
      updateProduct(id, productData);
    } else {
      addProduct(productData);
    }
    setEditingProduct(null);
  };

  const handleAddOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferTitle || !newOfferCode) return;
    addOffer({
      title: newOfferTitle,
      badge: 'SPECIAL DEAL',
      description: `Get ${newOfferDiscount}% discount on eligible items with code ${newOfferCode.toUpperCase()}.`,
      code: newOfferCode.toUpperCase(),
      discountType: 'percentage',
      discountValue: newOfferDiscount,
      minOrderValue: newOfferMinOrder,
      category: 'All',
      active: true,
    });
    setNewOfferTitle('');
    setNewOfferCode('');
  };

  return (
    <div className="py-8 sm:py-12 bg-cream-100/60 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Bar */}
        <div className="bg-white p-6 rounded-3xl border border-gold-300 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-chocolate-900 text-gold-400 flex items-center justify-center font-bold text-xl border border-gold-500/50">
              L
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-700 block">
                Nagpur Store Management Suite
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900">
                Lush Beauty Mart • Store Admin
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm('Reset store catalogue back to initial default database?')) {
                  resetToDefaultData();
                }
              }}
              className="px-4 py-2.5 rounded-xl border border-cream-300 hover:bg-cream-100 text-chocolate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Seed</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              Return to Storefront
            </button>
          </div>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gold-200 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-xs text-chocolate-500 font-semibold block">Total Products</span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900">
                {products.length}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-800 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gold-200 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-xs text-chocolate-500 font-semibold block">Active Offers</span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900">
                {offers.length}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gold-200 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-xs text-chocolate-500 font-semibold block">Customer Orders</span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900">
                {orders.length}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gold-200 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-xs text-chocolate-500 font-semibold block">Wholesale Leads</span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900">
                {wholesaleInquiries.length}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gold-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-chocolate-900 text-cream-50 shadow-sm'
                : 'bg-white text-chocolate-700 hover:bg-cream-100'
            }`}
          >
            📦 Products & Stock ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'offers'
                ? 'bg-chocolate-900 text-cream-50 shadow-sm'
                : 'bg-white text-chocolate-700 hover:bg-cream-100'
            }`}
          >
            🎟️ Offers & Promo Codes ({offers.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-chocolate-900 text-cream-50 shadow-sm'
                : 'bg-white text-chocolate-700 hover:bg-cream-100'
            }`}
          >
            🛍️ Orders Received ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('wholesale')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'wholesale'
                ? 'bg-chocolate-900 text-cream-50 shadow-sm'
                : 'bg-white text-chocolate-700 hover:bg-cream-100'
            }`}
          >
            🏢 B2B Wholesale Requests ({wholesaleInquiries.length})
          </button>
        </div>

        {/* Tab 1: Products Management */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-chocolate-900">
                  Store Product Inventory
                </h3>
                <p className="text-xs text-chocolate-600">
                  Manage pricing, stock status, categories, badges and images.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductFormOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-3xl border border-gold-200 shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-100 text-chocolate-900 font-bold border-b border-cream-200">
                    <tr>
                      <th className="p-4">Item</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price / MRP</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Badges</th>
                      <th className="p-4">Wholesale</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100">
                    {products.map(prod => (
                      <tr key={prod.id} className="hover:bg-cream-50/60 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.images[0]}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover border border-gold-200 flex-shrink-0"
                            />
                            <div>
                              <strong className="text-chocolate-950 font-bold block">
                                {prod.name}
                              </strong>
                              <span className="text-[11px] text-chocolate-500">
                                {prod.subcategory}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-chocolate-800">
                          {prod.category}
                        </td>
                        <td className="p-4">
                          <div>
                            <strong className="text-chocolate-900 block font-bold">
                              ₹{prod.price}
                            </strong>
                            <span className="text-chocolate-400 line-through text-[11px]">
                              ₹{prod.mrp}
                            </span>
                            <span className="text-[10px] text-rose-600 font-bold ml-1">
                              ({prod.discountPercentage}% off)
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleProductStock(prod.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                              prod.inStock
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                          >
                            {prod.inStock ? '● In Stock' : '✕ Out of Stock'}
                          </button>
                        </td>
                        <td className="p-4 space-x-1">
                          {prod.isBestSeller && (
                            <span className="px-2 py-0.5 rounded bg-gold-100 text-gold-900 font-bold text-[10px]">
                              BestSeller
                            </span>
                          )}
                          {prod.isNewArrival && (
                            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold text-[10px]">
                              New
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-chocolate-700">
                          {prod.wholesaleAvailable ? (
                            <span className="text-emerald-800 font-medium">
                              ₹{prod.wholesalePrice} (Min {prod.minWholesaleQty})
                            </span>
                          ) : (
                            <span className="text-chocolate-400">Retail Only</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(prod);
                                setIsProductFormOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-chocolate-600 hover:text-gold-700 hover:bg-cream-100"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${prod.name}?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-chocolate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Offers & Promo Codes */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left Column: Create Offer Form */}
              <div className="bg-white p-6 rounded-3xl border border-gold-200 shadow-soft space-y-4">
                <h3 className="font-serif text-lg font-bold text-chocolate-900">
                  Create Promotional Offer
                </h3>
                <form onSubmit={handleAddOfferSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-chocolate-800 uppercase block mb-1">
                      Offer Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newOfferTitle}
                      onChange={e => setNewOfferTitle(e.target.value)}
                      placeholder="e.g. Nagpur Festive Flash Sale"
                      className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-chocolate-800 uppercase block mb-1">
                      Coupon Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={newOfferCode}
                      onChange={e => setNewOfferCode(e.target.value)}
                      placeholder="e.g. FESTIVE20"
                      className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 uppercase font-mono font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-chocolate-800 uppercase block mb-1">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        value={newOfferDiscount}
                        onChange={e => setNewOfferDiscount(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-chocolate-800 uppercase block mb-1">
                        Min Order (₹)
                      </label>
                      <input
                        type="number"
                        value={newOfferMinOrder}
                        onChange={e => setNewOfferMinOrder(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-chocolate-900 text-cream-50 font-bold text-xs uppercase tracking-wider shadow-sm"
                  >
                    Add Offer & Activate
                  </button>
                </form>
              </div>

              {/* Right Column: Active Offers List */}
              <div className="lg:col-span-2 space-y-3">
                <h3 className="font-serif text-lg font-bold text-chocolate-900">
                  Active Homepage & Cart Promo Codes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {offers.map(offer => (
                    <div
                      key={offer.id}
                      className="p-5 rounded-2xl bg-white border border-gold-300 shadow-soft flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="px-2 py-0.5 rounded-full bg-gold-100 text-gold-900 text-[10px] font-bold">
                            {offer.badge}
                          </span>
                          <h4 className="font-serif text-sm font-bold text-chocolate-900 mt-1">
                            {offer.title}
                          </h4>
                          <p className="text-[11px] text-chocolate-600 mt-0.5">
                            {offer.description}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteOffer(offer.id)}
                          className="text-chocolate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-2.5 rounded-xl bg-cream-100 flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-gold-800">
                          {offer.code}
                        </span>
                        <span className="text-[11px] text-chocolate-600">
                          Min ₹{offer.minOrderValue}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Customer Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-chocolate-900">
              Customer Orders Received
            </h3>
            {orders.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center border border-gold-200">
                <p className="text-xs text-chocolate-600">
                  No orders placed yet. Add items to your bag and test checkout!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div
                    key={order.id}
                    className="p-6 rounded-3xl bg-white border border-gold-200 shadow-soft space-y-3 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cream-200 pb-3">
                      <div>
                        <strong className="text-sm font-bold text-chocolate-950">
                          Order #{order.orderNumber}
                        </strong>
                        <span className="text-chocolate-500 ml-2">
                          {new Date(order.orderDate).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                          {order.status}
                        </span>
                        <span className="font-bold text-sm text-gold-700">
                          ₹{order.total}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-chocolate-700">
                      <p>
                        <strong>Customer:</strong> {order.customer.name} (📞 {order.customer.phone})
                      </p>
                      <p>
                        <strong>Address:</strong> {order.customer.address}, {order.customer.city}
                      </p>
                    </div>

                    <div className="bg-cream-50 p-3 rounded-xl">
                      <strong>Items ({order.items.length}):</strong>{' '}
                      {order.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: B2B Wholesale Leads */}
        {activeTab === 'wholesale' && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-chocolate-900">
              Wholesale & Salon Supply Requests
            </h3>
            {wholesaleInquiries.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center border border-gold-200">
                <p className="text-xs text-chocolate-600">
                  No wholesale inquiries logged yet. Customers can submit enquiries from the Wholesale Portal.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {wholesaleInquiries.map(inq => (
                  <div
                    key={inq.id}
                    className="p-6 rounded-3xl bg-white border border-amber-200 shadow-soft space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                      <div>
                        <strong className="text-sm font-bold text-chocolate-950">
                          {inq.businessName}
                        </strong>
                        <span className="text-chocolate-500 ml-2">Contact: {inq.name}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                        {inq.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-chocolate-700">
                      <p><strong>Phone:</strong> {inq.phone}</p>
                      <p><strong>City:</strong> {inq.city}</p>
                      <p><strong>Category:</strong> {inq.category}</p>
                    </div>

                    {inq.message && (
                      <p className="bg-cream-50 p-3 rounded-xl text-chocolate-800">
                        "{inq.message}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Add / Edit Modal */}
      <ProductFormModal
        isOpen={isProductFormOpen}
        onClose={() => setIsProductFormOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />
    </div>
  );
};
