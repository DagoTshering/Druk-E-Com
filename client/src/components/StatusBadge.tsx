// ============================================================================
// STATUS BADGE
// ============================================================================
// Consistent status badge component for orders, tickets, deliveries
// ============================================================================

import React from 'react';
import type { OrderStatus, DeliveryStatus, TicketPriority, TicketStatus } from '../dataStore';

interface StatusBadgeProps {
  status: OrderStatus | DeliveryStatus | TicketPriority | TicketStatus | string;
  type: 'order' | 'delivery' | 'priority' | 'ticket';
  size?: 'sm' | 'md' | 'lg';
}

const orderStatusStyles: Record<OrderStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  confirmed: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  shipped: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  delivered: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/25'
};

const deliveryStatusStyles: Record<DeliveryStatus, string> = {
  assigned: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
  picked_up: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  in_transit: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  delivered: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
};

const priorityStyles: Record<TicketPriority, string> = {
  low: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
  medium: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  high: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
  urgent: 'bg-red-500/15 text-red-400 border-red-500/25'
};

const ticketStatusStyles: Record<TicketStatus, string> = {
  open: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  in_progress: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  resolved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  escalated: 'bg-red-500/15 text-red-400 border-red-500/25'
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base'
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type, size = 'md' }) => {
  let styleClass = '';
  
  switch (type) {
    case 'order':
      styleClass = orderStatusStyles[status as OrderStatus] || orderStatusStyles.pending;
      break;
    case 'delivery':
      styleClass = deliveryStatusStyles[status as DeliveryStatus] || deliveryStatusStyles.assigned;
      break;
    case 'priority':
      styleClass = priorityStyles[status as TicketPriority] || priorityStyles.low;
      break;
    case 'ticket':
      styleClass = ticketStatusStyles[status as TicketStatus] || ticketStatusStyles.open;
      break;
    default:
      styleClass = 'bg-slate-500/15 text-slate-400 border-slate-500/25';
  }

  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium capitalize ${styleClass} ${sizeStyles[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styleClass.split(' ')[0].replace('/15', '')}`} />
      {displayStatus}
    </span>
  );
};
