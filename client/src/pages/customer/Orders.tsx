// ============================================================================
// CUSTOMER - ORDERS PAGE
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { orders as allOrders, type OrderStatus } from '../../dataStore';
import { StatusBadge } from '../../components/StatusBadge';
import { TableRowSkeleton } from '../../components/Skeleton';

interface OrdersProps {
  currentUserId: string;
}

export const Orders: React.FC<OrdersProps> = ({ currentUserId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const customerOrders = allOrders.filter(order => order.customerId === currentUserId);

  const getOrderTimeline = (status: OrderStatus) => {
    const steps = [
      { key: 'placed', label: 'Order Placed', completed: true },
      { key: 'confirmed', label: 'Confirmed', completed: ['confirmed', 'shipped', 'delivered'].includes(status) },
      { key: 'shipped', label: 'Shipped', completed: ['shipped', 'delivered'].includes(status) },
      { key: 'delivered', label: 'Delivered', completed: status === 'delivered' }
    ];
    return steps;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-display text-warm-white mb-8">My Orders</h1>
          <div className="bg-dark-surface rounded-xl overflow-hidden">
            <table className="w-full">
              <tbody>
                {Array.from({ length: 4 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={4} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (customerOrders.length === 0) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center px-6">
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-dark-surface flex items-center justify-center">
            <Package className="w-10 h-10 text-warm-gray" />
          </div>
          <h2 className="text-2xl font-display text-warm-white mb-4">No orders yet</h2>
          <p className="text-warm-gray font-body mb-8">Start shopping to see your orders here</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gold text-dark-base px-8 py-3 rounded-lg font-body font-semibold hover:bg-gold-light transition-colors"
          >
            Browse Products
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-display text-warm-white mb-8">My Orders</h1>

        <div className="space-y-4">
          {customerOrders.map((order, idx) => (
            <div
              key={order.id}
              className="bg-dark-surface rounded-xl border border-white/5 overflow-hidden animate-slide-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {/* Order Header */}
              <div
                className="p-6 cursor-pointer"
                onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-dark-base rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-gold" />
                    </div>
                    <div>
                      <p className="text-warm-white font-display text-lg">{order.id}</p>
                      <div className="flex items-center gap-4 text-sm text-warm-gray font-body mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span>{order.items.length} items</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <StatusBadge status={order.status} type="order" />
                    <span className="text-gold font-display text-xl">${order.total.toFixed(2)}</span>
                    <ChevronRight className={`w-5 h-5 text-warm-gray transition-transform ${selectedOrder === order.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </div>

              {/* Order Details */}
              {selectedOrder === order.id && (
                <div className="border-t border-white/5 p-6 animate-fade-in">
                  {/* Timeline */}
                  <div className="mb-8">
                    <h3 className="text-warm-white font-display mb-4">Order Status</h3>
                    <div className="flex items-center">
                      {getOrderTimeline(order.status).map((step, stepIdx) => (
                        <React.Fragment key={step.key}>
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              step.completed ? 'bg-gold text-dark-base' : 'bg-dark-base text-warm-gray'
                            }`}>
                              {step.completed ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <span className="text-sm">{stepIdx + 1}</span>
                              )}
                            </div>
                            <span className={`text-xs mt-2 font-body ${step.completed ? 'text-gold' : 'text-warm-gray'}`}>
                              {step.label}
                            </span>
                          </div>
                          {stepIdx < 3 && (
                            <div className={`flex-1 h-0.5 mx-2 ${
                              step.completed && getOrderTimeline(order.status)[stepIdx + 1]?.completed
                                ? 'bg-gold'
                                : 'bg-dark-base'
                            }`} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-6">
                    <h3 className="text-warm-white font-display mb-4">Items</h3>
                    <div className="space-y-3">
                      {order.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-4 bg-dark-base rounded-lg p-3">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="text-warm-white font-body">{item.productName}</p>
                            <p className="text-warm-gray text-sm font-body">Qty: {item.quantity}</p>
                          </div>
                          <span className="text-gold font-body">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6">
                    <h3 className="text-warm-white font-display mb-3">Shipping Address</h3>
                    <div className="flex items-start gap-2 text-warm-gray font-body">
                      <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p>{order.shippingAddress.street}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-dark-base rounded-lg p-4">
                    <div className="space-y-2 text-sm">
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
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
