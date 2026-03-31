// ============================================================================
// SELLER - PAYOUTS PAGE
// ============================================================================

import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowDownLeft, ArrowUpRight, Calendar, Wallet } from 'lucide-react';
import { payouts, getProductsBySeller, getOrdersBySeller } from '../../dataStore';
import { StatsCardSkeleton, TableRowSkeleton } from '../../components/Skeleton';
import { toast } from 'sonner';

interface PayoutsProps {
  currentUserId: string;
}

export const SellerPayouts: React.FC<PayoutsProps> = ({ currentUserId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const sellerProducts = getProductsBySeller(currentUserId);
  const sellerOrders = getOrdersBySeller(currentUserId);
  const sellerPayouts = payouts.filter(p => p.sellerId === currentUserId);

  // Calculate earnings
  const totalEarnings = sellerOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.items
      .filter(item => sellerProducts.some(p => p.id === item.productId))
      .reduce((itemSum, item) => itemSum + item.price * item.quantity, 0), 0);

  const totalPayouts = sellerPayouts
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayouts = sellerPayouts
    .filter(p => p.status === 'pending' || p.status === 'processing')
    .reduce((sum, p) => sum + p.amount, 0);

  const availableBalance = totalEarnings - totalPayouts - pendingPayouts;

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount <= 0 || amount > availableBalance) {
      toast.error('Invalid withdrawal amount');
      return;
    }
    toast.success(`Withdrawal request for $${amount.toFixed(2)} submitted`);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-display text-warm-white mb-8">Payouts</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
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

  return (
    <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display text-warm-white">Payouts</h1>
            <p className="text-warm-gray font-body mt-1">Manage your earnings and withdrawals</p>
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={availableBalance <= 0}
            className="flex items-center gap-2 bg-gold text-dark-base px-6 py-3 rounded-lg font-body font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowUpRight className="w-4 h-4" />
            Withdraw
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-surface rounded-xl border border-white/5 p-6 animate-slide-up">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-warm-gray font-body text-sm mb-1">Available Balance</p>
                <p className="text-3xl font-display text-gold">${availableBalance.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-gold" />
              </div>
            </div>
            <p className="text-emerald-400 text-sm font-body">Ready to withdraw</p>
          </div>

          <div className="bg-dark-surface rounded-xl border border-white/5 p-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-warm-gray font-body text-sm mb-1">Total Earnings</p>
                <p className="text-3xl font-display text-warm-white">${totalEarnings.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-warm-gray text-sm font-body">Lifetime earnings</p>
          </div>

          <div className="bg-dark-surface rounded-xl border border-white/5 p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-warm-gray font-body text-sm mb-1">Pending</p>
                <p className="text-3xl font-display text-warm-white">${pendingPayouts.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <p className="text-warm-gray text-sm font-body">Processing withdrawals</p>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-dark-surface rounded-xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-xl font-display text-warm-white">Payout History</h2>
          </div>
          
          {sellerPayouts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Payout ID</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Date</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Method</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Status</th>
                    <th className="text-right py-4 px-6 text-warm-gray font-body text-sm">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerPayouts.map((payout, idx) => (
                    <tr
                      key={payout.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors animate-slide-up"
                      style={{ animationDelay: `${idx * 0.03}s` }}
                    >
                      <td className="py-4 px-6">
                        <span className="text-warm-white font-body">{payout.id}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-warm-gray font-body">
                          {new Date(payout.requestedAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-warm-gray font-body capitalize">
                          {payout.method.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-body ${
                          payout.status === 'completed'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : payout.status === 'processing'
                              ? 'bg-blue-500/15 text-blue-400'
                              : 'bg-amber-500/15 text-amber-400'
                        }`}>
                          {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-gold font-body font-medium">${payout.amount.toFixed(2)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-base flex items-center justify-center">
                <ArrowDownLeft className="w-6 h-6 text-warm-gray" />
              </div>
              <h3 className="text-warm-white font-display mb-2">No payouts yet</h3>
              <p className="text-warm-gray font-body">Your payout history will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-dark-surface rounded-xl border border-white/10 p-6 w-full max-w-md animate-scale-in">
            <h2 className="text-xl font-display text-warm-white mb-4">Withdraw Funds</h2>
            <p className="text-warm-gray font-body mb-6">
              Available balance: <span className="text-gold font-medium">${availableBalance.toFixed(2)}</span>
            </p>
            
            <div className="mb-6">
              <label className="block text-warm-gray text-sm font-body mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray">$</span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  max={availableBalance}
                  className="w-full pl-10 pr-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-4 py-3 border border-white/20 text-warm-white rounded-lg font-body hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > availableBalance}
                className="flex-1 px-4 py-3 bg-gold text-dark-base rounded-lg font-body font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
