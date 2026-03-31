// ============================================================================
// SUPPORT - TICKETS PAGE
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, ChevronRight } from 'lucide-react';
import { tickets as initialTickets, type TicketPriority, type TicketStatus } from '../../dataStore';
import { StatusBadge } from '../../components/StatusBadge';
import { TableRowSkeleton } from '../../components/Skeleton';

interface TicketsProps {
  _currentUserId?: string;
}

export const SupportTickets: React.FC<TicketsProps> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [ticketList, setTicketList] = useState(initialTickets);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredTickets = ticketList.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const statusCounts = {
    open: ticketList.filter(t => t.status === 'open').length,
    in_progress: ticketList.filter(t => t.status === 'in_progress').length,
    resolved: ticketList.filter(t => t.status === 'resolved').length,
  };

  const selectedTicketData = ticketList.find(t => t.id === selectedTicket);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-display text-warm-white mb-8">Support Tickets</h1>
          <div className="bg-dark-surface rounded-xl overflow-hidden">
            <table className="w-full">
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={6} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display text-warm-white">Support Tickets</h1>
          <p className="text-warm-gray font-body mt-1">
            {statusCounts.open} open, {statusCounts.in_progress} in progress
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-surface border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
            />
          </div>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | 'all')}
            className="px-4 py-3 bg-dark-surface border border-white/10 rounded-xl text-warm-white font-body focus:border-gold focus:ring-1 focus:ring-gold transition-all"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'all')}
            className="px-4 py-3 bg-dark-surface border border-white/10 rounded-xl text-warm-white font-body focus:border-gold focus:ring-1 focus:ring-gold transition-all"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>

        {/* Tickets List */}
        <div className="bg-dark-surface rounded-xl border border-white/5 overflow-hidden">
          {filteredTickets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Ticket</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Customer</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Priority</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Status</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Last Update</th>
                    <th className="text-right py-4 px-6 text-warm-gray font-body text-sm"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket, idx) => (
                    <tr
                      key={ticket.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer animate-slide-up"
                      style={{ animationDelay: `${idx * 0.03}s` }}
                      onClick={() => setSelectedTicket(ticket.id)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-gold" />
                          </div>
                          <div>
                            <p className="text-warm-white font-body">{ticket.subject}</p>
                            <p className="text-warm-gray text-sm font-body">{ticket.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-warm-white font-body">{ticket.customerName}</span>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={ticket.priority} type="priority" size="sm" />
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={ticket.status} type="ticket" size="sm" />
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-warm-gray font-body text-sm">
                          {new Date(ticket.updatedAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <ChevronRight className="w-5 h-5 text-warm-gray inline" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-base flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-warm-gray" />
              </div>
              <h3 className="text-warm-white font-display mb-2">No tickets found</h3>
              <p className="text-warm-gray font-body">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicketData && (
        <TicketDetailModal
          ticket={selectedTicketData}
          onClose={() => setSelectedTicket(null)}
          onUpdate={(updatedTicket) => {
            setTicketList(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
          }}
        />
      )}
    </div>
  );
};

interface TicketDetailModalProps {
  ticket: typeof initialTickets[0];
  onClose: () => void;
  onUpdate: (ticket: typeof initialTickets[0]) => void;
}

const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticket, onClose, onUpdate }) => {
  const [reply, setReply] = useState('');
  const [localTicket, setLocalTicket] = useState(ticket);

  const handleSendReply = () => {
    if (!reply.trim()) return;

    const newMessage = {
      id: `m${Date.now()}`,
      sender: 'agent' as const,
      senderName: 'Emily Thompson',
      message: reply,
      timestamp: new Date().toISOString()
    };

    const updatedTicket = {
      ...localTicket,
      messages: [...localTicket.messages, newMessage],
      status: 'in_progress' as const,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setLocalTicket(updatedTicket);
    onUpdate(updatedTicket);
    setReply('');
  };

  const handleResolve = () => {
    const updatedTicket = {
      ...localTicket,
      status: 'resolved' as const,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setLocalTicket(updatedTicket);
    onUpdate(updatedTicket);
  };

  const handleEscalate = () => {
    const updatedTicket = {
      ...localTicket,
      status: 'escalated' as const,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setLocalTicket(updatedTicket);
    onUpdate(updatedTicket);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-dark-surface rounded-xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-display text-warm-white">{localTicket.subject}</h2>
              <StatusBadge status={localTicket.priority} type="priority" size="sm" />
              <StatusBadge status={localTicket.status} type="ticket" size="sm" />
            </div>
            <p className="text-warm-gray text-sm font-body">{localTicket.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className="text-warm-gray text-2xl">&times;</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Conversation */}
          <div className="flex-1 flex flex-col border-r border-white/5">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {localTicket.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${
                    message.sender === 'agent'
                      ? 'bg-gold text-dark-base'
                      : 'bg-dark-base text-warm-white'
                  } rounded-xl p-4`}>
                    <p className="font-body text-sm mb-1">{message.senderName}</p>
                    <p className="font-body">{message.message}</p>
                    <p className={`text-xs mt-2 ${message.sender === 'agent' ? 'text-dark-base/70' : 'text-warm-gray'}`}>
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            {localTicket.status !== 'resolved' && (
              <div className="p-4 border-t border-white/5">
                <div className="flex gap-3">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply..."
                    rows={2}
                    className="flex-1 px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body resize-none"
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={!reply.trim()}
                    className="px-6 py-3 bg-gold text-dark-base rounded-lg font-body font-semibold hover:bg-gold-light transition-colors disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-72 p-6 bg-dark-base">
            <div className="mb-6">
              <h3 className="text-warm-gray text-sm font-body mb-3">Customer</h3>
              <p className="text-warm-white font-body">{localTicket.customerName}</p>
              <p className="text-warm-gray text-sm font-body">{localTicket.customerEmail}</p>
            </div>

            {localTicket.orderId && (
              <div className="mb-6">
                <h3 className="text-warm-gray text-sm font-body mb-3">Related Order</h3>
                <p className="text-gold font-body">{localTicket.orderId}</p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-warm-gray text-sm font-body mb-3">Created</h3>
              <p className="text-warm-white font-body">{new Date(localTicket.createdAt).toLocaleDateString()}</p>
            </div>

            {localTicket.status !== 'resolved' && (
              <div className="space-y-3">
                <button
                  onClick={handleResolve}
                  className="w-full px-4 py-3 bg-emerald-500 text-white rounded-lg font-body font-semibold hover:bg-emerald-600 transition-colors"
                >
                  Mark as Resolved
                </button>
                <button
                  onClick={handleEscalate}
                  className="w-full px-4 py-3 border border-amber-500 text-amber-400 rounded-lg font-body hover:bg-amber-500/10 transition-colors"
                >
                  Escalate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
