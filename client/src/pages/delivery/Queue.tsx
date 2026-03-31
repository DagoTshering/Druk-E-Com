// ============================================================================
// DELIVERY - MY QUEUE PAGE
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Package, MapPin, Phone, Clock, ChevronRight, Navigation } from 'lucide-react';
import { deliveries, getDeliveriesByAgent, type DeliveryStatus } from '../../dataStore';
import { StatusBadge } from '../../components/StatusBadge';
import { CardSkeleton } from '../../components/Skeleton';
import { toast } from 'sonner';

interface DeliveryQueueProps {
  currentUserId: string;
}

export const DeliveryQueue: React.FC<DeliveryQueueProps> = ({ currentUserId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [deliveryList, setDeliveryList] = useState<typeof deliveries>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDeliveryList(getDeliveriesByAgent(currentUserId));
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [currentUserId]);

  const updateStatus = (deliveryId: string, newStatus: DeliveryStatus) => {
    setDeliveryList(prev => prev.map(d => {
      if (d.id === deliveryId) {
        toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
        return { ...d, status: newStatus };
      }
      return d;
    }));
  };

  const activeDeliveries = deliveryList.filter(d => d.status !== 'delivered');
  const completedDeliveries = deliveryList.filter(d => d.status === 'delivered');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-display text-warm-white mb-8">My Delivery Queue</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display text-warm-white">My Delivery Queue</h1>
          <p className="text-warm-gray font-body mt-1">
            {activeDeliveries.length} active deliveries, {completedDeliveries.length} completed today
          </p>
        </div>

        {/* Active Deliveries */}
        {activeDeliveries.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-display text-warm-white mb-4">Active Deliveries</h2>
            <div className="space-y-4">
              {activeDeliveries.map((delivery, idx) => (
                <div
                  key={delivery.id}
                  className="bg-dark-surface rounded-xl border border-white/5 overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => setSelectedDelivery(selectedDelivery === delivery.id ? null : delivery.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-gold" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-warm-white font-display">{delivery.orderId}</span>
                            <StatusBadge status={delivery.status} type="delivery" size="sm" />
                          </div>
                          <div className="flex items-center gap-4 text-sm text-warm-gray font-body">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {delivery.deliveryAddress.split(',')[0]}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Est. {new Date(delivery.estimatedDelivery).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-warm-gray transition-transform ${selectedDelivery === delivery.id ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {selectedDelivery === delivery.id && (
                    <div className="border-t border-white/5 p-6 animate-fade-in">
                      {/* Customer Info */}
                      <div className="mb-6">
                        <h3 className="text-warm-white font-display mb-3">Customer</h3>
                        <div className="bg-dark-base rounded-lg p-4">
                          <p className="text-warm-white font-body">{delivery.customerName}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Phone className="w-4 h-4 text-gold" />
                            <a href={`tel:${delivery.customerPhone}`} className="text-gold font-body hover:underline">
                              {delivery.customerPhone}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Addresses */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <h3 className="text-warm-white font-display mb-3 flex items-center gap-2">
                            <Navigation className="w-4 h-4 text-gold" />
                            Pickup From
                          </h3>
                          <div className="bg-dark-base rounded-lg p-4 text-warm-gray font-body text-sm">
                            {delivery.pickupAddress}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-warm-white font-display mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gold" />
                            Deliver To
                          </h3>
                          <div className="bg-dark-base rounded-lg p-4 text-warm-gray font-body text-sm">
                            {delivery.deliveryAddress}
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {delivery.notes && (
                        <div className="mb-6">
                          <h3 className="text-warm-white font-display mb-3">Delivery Notes</h3>
                          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                            <p className="text-amber-400 font-body text-sm">{delivery.notes}</p>
                          </div>
                        </div>
                      )}

                      {/* Status Actions */}
                      <div className="flex flex-wrap gap-3">
                        {delivery.status === 'assigned' && (
                          <button
                            onClick={() => updateStatus(delivery.id, 'picked_up')}
                            className="px-6 py-3 bg-gold text-dark-base rounded-lg font-body font-semibold hover:bg-gold-light transition-colors"
                          >
                            Mark as Picked Up
                          </button>
                        )}
                        {delivery.status === 'picked_up' && (
                          <button
                            onClick={() => updateStatus(delivery.id, 'in_transit')}
                            className="px-6 py-3 bg-gold text-dark-base rounded-lg font-body font-semibold hover:bg-gold-light transition-colors"
                          >
                            Mark as In Transit
                          </button>
                        )}
                        {delivery.status === 'in_transit' && (
                          <button
                            onClick={() => updateStatus(delivery.id, 'delivered')}
                            className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-body font-semibold hover:bg-emerald-600 transition-colors"
                          >
                            Mark as Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Deliveries */}
        {completedDeliveries.length > 0 && (
          <div>
            <h2 className="text-xl font-display text-warm-white mb-4">Completed Today</h2>
            <div className="space-y-4">
              {completedDeliveries.map((delivery, idx) => (
                <div
                  key={delivery.id}
                  className="bg-dark-surface rounded-xl border border-white/5 p-6 opacity-75 animate-slide-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-warm-white font-body">{delivery.orderId}</span>
                          <StatusBadge status={delivery.status} type="delivery" size="sm" />
                        </div>
                        <p className="text-warm-gray text-sm font-body">{delivery.customerName}</p>
                      </div>
                    </div>
                    <span className="text-warm-gray text-sm font-body">
                      Delivered {delivery.actualDelivery && new Date(delivery.actualDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {deliveryList.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-surface flex items-center justify-center">
              <Package className="w-8 h-8 text-warm-gray" />
            </div>
            <h2 className="text-2xl font-display text-warm-white mb-4">No deliveries assigned</h2>
            <p className="text-warm-gray font-body">Check back later for new delivery assignments</p>
          </div>
        )}
      </div>
    </div>
  );
};
