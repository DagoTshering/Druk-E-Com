// ============================================================================
// ADMIN - ORDERS PAGE
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Search, Eye, Package, MapPin } from 'lucide-react';
import { orders, type OrderStatus } from '../../dataStore';
import { StatusBadge } from '../../components/StatusBadge';
import { TableRowSkeleton } from '../../components/Skeleton';

export const AdminOrders: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getOrderTimeline = (status: OrderStatus) => {
    const steps = [
      { key: 'placed', label: 'Order Placed', completed: true },
      { key: 'confirmed', label: 'Confirmed', completed: ['confirmed', 'shipped', 'delivered'].includes(status) },
      { key: 'shipped', label: 'Shipped', completed: ['shipped', 'delivered'].includes(status) },
      { key: 'delivered', label: 'Delivered', completed: status === 'delivered' }
    ];
    return steps;
  };

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display text-warm-white">All Orders</h1>
          <p className="text-warm-gray font-body mt-1">View and manage all platform orders</p>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-body text-sm transition-colors ${
                statusFilter === status
                  ? 'bg-gold text-dark-base'
                  : 'bg-dark-surface text-warm-gray hover:text-warm-white border border-white/10'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice()}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                statusFilter === status ? 'bg-dark-base/20' : 'bg-white/10'
              }`}>
                {statusCounts[status]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-dark-surface border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
          />
        </div>

        {/* Orders Table */}
        <div className="bg-dark-surface rounded-xl border border-white/5 overflow-hidden">
          {isLoading ? (
            <table className="w-full">
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={6} />
                ))}
              </tbody>
            </table>
          ) : filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Order ID</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Customer</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Date</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Items</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Status</th>
                    <th className="text-right py-4 px-6 text-warm-gray font-body text-sm">Total</th>
                    <th className="text-right py-4 px-6 text-warm-gray font-body text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, idx) => (
                    <React.Fragment key={order.id}>
                      <tr
                        className="border-b border-white/5 hover:bg-white/5 transition-colors animate-slide-up"
                        style={{ animationDelay: `${idx * 0.03}s` }}
                      >
                        <td className="py-4 px-6">
                          <span className="text-warm-white font-body font-medium">{order.id}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-warm-white font-body">{order.customerName}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-warm-gray font-body">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-warm-gray font-body">{order.items.length} items</span>
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={order.status} type="order" size="sm" />
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="text-gold font-body font-medium">${order.total.toFixed(2)}</span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 text-warm-gray" />
                          </button>
                        </td>
                      </tr>
                      
                      {/* Order Details */}
                      {selectedOrder === order.id && (
                        <tr>
                          <td colSpan={7} className="bg-dark-base p-6 animate-fade-in">
                            {/* Timeline */}
                            <div className="mb-6">
                              <h4 className="text-warm-white font-display mb-4">Order Status</h4>
                              <div className="flex items-center">
                                {getOrderTimeline(order.status).map((step, stepIdx) => (
                                  <React.Fragment key={step.key}>
                                    <div className="flex flex-col items-center">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                        step.completed ? 'bg-gold text-dark-base' : 'bg-dark-surface text-warm-gray'
                                      }`}>
                                        {step.completed ? '✓' : stepIdx + 1}
                                      </div>
                                      <span className={`text-xs mt-1 font-body ${step.completed ? 'text-gold' : 'text-warm-gray'}`}>
                                        {step.label}
                                      </span>
                                    </div>
                                    {stepIdx < 3 && (
                                      <div className={`flex-1 h-0.5 mx-2 ${
                                        step.completed && getOrderTimeline(order.status)[stepIdx + 1]?.completed
                                          ? 'bg-gold'
                                          : 'bg-dark-surface'
                                      }`} />
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>

                            {/* Items */}
                            <div className="mb-6">
                              <h4 className="text-warm-white font-display mb-4">Order Items</h4>
                              <div className="space-y-3">
                                {order.items.map((item, itemIdx) => (
                                  <div key={itemIdx} className="flex items-center gap-4 bg-dark-surface rounded-lg p-3">
                                    <img
                                      src={item.productImage}
                                      alt={item.productName}
                                      className="w-14 h-14 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                      <p className="text-warm-white font-body">{item.productName}</p>
                                      <p className="text-warm-gray text-sm font-body">Qty: {item.quantity} × ${item.price}</p>
                                    </div>
                                    <span className="text-gold font-body">${(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping & Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-warm-white font-display mb-3 flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-gold" />
                                  Shipping Address
                                </h4>
                                <div className="bg-dark-surface rounded-lg p-4 text-warm-gray font-body text-sm">
                                  <p>{order.shippingAddress.street}</p>
                                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                                  <p>{order.shippingAddress.country}</p>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-warm-white font-display mb-3">Order Summary</h4>
                                <div className="bg-dark-surface rounded-lg p-4 space-y-2 text-sm">
                                  <div className="flex justify-between text-warm-gray font-body">
                                    <span>Subtotal</span>
                                    <span>${order.subtotal.toFixed(2)}</span>
                                  </div>
                                  {order.discount > 0 && (
                                    <div className="flex justify-between text-emerald-400 font-body">
                                      <span>Discount</span>
                                      <span>-${order.discount.toFixed(2)}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between text-warm-gray font-body">
                                    <span>Shipping</span>
                                    <span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
                                  </div>
                                  <div className="flex justify-between text-warm-gray font-body">
                                    <span>Tax</span>
                                    <span>${order.tax.toFixed(2)}</span>
                                  </div>
                                  <div className="pt-2 border-t border-white/10 flex justify-between">
                                    <span className="text-warm-white font-body font-medium">Total</span>
                                    <span className="text-gold font-display">${order.total.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-base flex items-center justify-center">
                <Package className="w-6 h-6 text-warm-gray" />
              </div>
              <h3 className="text-warm-white font-display mb-2">No orders found</h3>
              <p className="text-warm-gray font-body">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
