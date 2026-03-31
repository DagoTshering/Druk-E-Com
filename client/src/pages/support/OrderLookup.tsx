// ============================================================================
// SUPPORT - ORDER LOOKUP PAGE
// ============================================================================

import React, { useState } from 'react';
import { Search, Package, User, Calendar, DollarSign, MapPin, ChevronRight, X } from 'lucide-react';
import { orders, users } from '../../dataStore';
import { StatusBadge } from '../../components/StatusBadge';

export const OrderLookup: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof orders>([]);
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setHasSearched(true);
    const results = orders.filter(order => 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getCustomerDetails = (customerId: string) => {
    return users.find(u => u.id === customerId);
  };

  return (
    <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display text-warm-white">Order Lookup</h1>
          <p className="text-warm-gray font-body mt-1">Search orders by ID or customer name</p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-12 pr-4 py-4 bg-dark-surface border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body text-lg"
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-gold text-dark-base rounded-lg font-body font-semibold hover:bg-gold-light transition-colors"
          >
            Search
          </button>
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="space-y-4">
            {searchResults.length > 0 ? (
              <>
                <p className="text-warm-gray font-body mb-4">
                  Found {searchResults.length} order{searchResults.length !== 1 ? 's' : ''}
                </p>
                {searchResults.map((order, idx) => (
                  <div
                    key={order.id}
                    className="bg-dark-surface rounded-xl border border-white/5 p-6 cursor-pointer hover:border-gold/30 transition-colors animate-slide-up"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center">
                          <Package className="w-7 h-7 text-gold" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-warm-white font-display text-lg">{order.id}</span>
                            <StatusBadge status={order.status} type="order" size="sm" />
                          </div>
                          <div className="flex items-center gap-4 text-sm text-warm-gray font-body">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {order.customerName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              {order.items.length} items
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gold font-display text-xl">${order.total.toFixed(2)}</span>
                        <ChevronRight className="w-5 h-5 text-warm-gray" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-surface flex items-center justify-center">
                  <Search className="w-6 h-6 text-warm-gray" />
                </div>
                <h3 className="text-warm-white font-display mb-2">No orders found</h3>
                <p className="text-warm-gray font-body">Try a different search term</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-dark-surface rounded-xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-dark-surface">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-display text-warm-white">{selectedOrder.id}</h2>
                  <StatusBadge status={selectedOrder.status} type="order" size="sm" />
                </div>
                <p className="text-warm-gray text-sm font-body">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-warm-gray" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Customer Info */}
              <div>
                <h3 className="text-warm-white font-display mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-gold" />
                  Customer Information
                </h3>
                <div className="bg-dark-base rounded-lg p-4">
                  {(() => {
                    const customer = getCustomerDetails(selectedOrder.customerId);
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-warm-gray text-sm font-body">Name</p>
                          <p className="text-warm-white font-body">{selectedOrder.customerName}</p>
                        </div>
                        <div>
                          <p className="text-warm-gray text-sm font-body">Email</p>
                          <p className="text-warm-white font-body">{customer?.email || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-warm-gray text-sm font-body">Phone</p>
                          <p className="text-warm-white font-body">{customer?.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-warm-gray text-sm font-body">Customer ID</p>
                          <p className="text-warm-white font-body">{selectedOrder.customerId}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-warm-white font-display mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-gold" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="bg-dark-base rounded-lg p-4 flex items-center gap-4">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-warm-white font-body">{item.productName}</p>
                        <p className="text-warm-gray text-sm font-body">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gold font-body">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-warm-gray text-sm font-body">${item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-warm-white font-display mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gold" />
                  Shipping Address
                </h3>
                <div className="bg-dark-base rounded-lg p-4">
                  <p className="text-warm-white font-body">{selectedOrder.shippingAddress.street}</p>
                  <p className="text-warm-gray font-body">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}
                  </p>
                  <p className="text-warm-gray font-body">{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-warm-white font-display mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gold" />
                  Order Summary
                </h3>
                <div className="bg-dark-base rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-warm-gray font-body">
                      <span>Subtotal</span>
                      <span>${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-body">
                        <span>Discount</span>
                        <span>-${selectedOrder.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-warm-gray font-body">
                      <span>Shipping</span>
                      <span>{selectedOrder.shipping === 0 ? 'Free' : `$${selectedOrder.shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-warm-gray font-body">
                      <span>Tax</span>
                      <span>${selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-white/10 flex justify-between">
                      <span className="text-warm-white font-display">Total</span>
                      <span className="text-gold font-display text-xl">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
