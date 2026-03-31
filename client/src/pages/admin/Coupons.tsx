// ============================================================================
// ADMIN - COUPONS PAGE
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, Percent, Copy } from 'lucide-react';
import { coupons as initialCoupons } from '../../dataStore';
import { TableRowSkeleton } from '../../components/Skeleton';
import { toast } from 'sonner';

export const AdminCoupons: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [couponList, setCouponList] = useState(initialCoupons);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<typeof initialCoupons[0] | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discountPercent: '',
    maxDiscount: '',
    minOrderAmount: '',
    usageLimit: '',
    expiryDate: '',
    description: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredCoupons = couponList.filter(coupon =>
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (!formData.code.trim() || !formData.discountPercent) {
      toast.error('Code and discount are required');
      return;
    }

    if (editingCoupon) {
      setCouponList(prev => prev.map(c =>
        c.id === editingCoupon.id
          ? {
              ...c,
              code: formData.code.toUpperCase(),
              discountPercent: parseInt(formData.discountPercent),
              maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
              minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : undefined,
              usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
              expiryDate: formData.expiryDate,
              description: formData.description
            }
          : c
      ));
      toast.success('Coupon updated');
    } else {
      const newCoupon = {
        id: `c${Date.now()}`,
        code: formData.code.toUpperCase(),
        discountPercent: parseInt(formData.discountPercent),
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : undefined,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        usageCount: 0,
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: formData.expiryDate,
        isActive: true,
        description: formData.description
      };
      setCouponList(prev => [...prev, newCoupon]);
      toast.success('Coupon created');
    }

    setShowAddModal(false);
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountPercent: '',
      maxDiscount: '',
      minOrderAmount: '',
      usageLimit: '',
      expiryDate: '',
      description: ''
    });
  };

  const handleDelete = (couponId: string) => {
    setCouponList(prev => prev.filter(c => c.id !== couponId));
    toast.success('Coupon deleted');
  };

  const handleEdit = (coupon: typeof initialCoupons[0]) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountPercent: coupon.discountPercent.toString(),
      maxDiscount: coupon.maxDiscount?.toString() || '',
      minOrderAmount: coupon.minOrderAmount?.toString() || '',
      usageLimit: coupon.usageLimit?.toString() || '',
      expiryDate: coupon.expiryDate,
      description: coupon.description
    });
    setShowAddModal(true);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display text-warm-white">Coupons</h1>
            <p className="text-warm-gray font-body mt-1">Manage discount coupons</p>
          </div>
          <button
            onClick={() => {
              setEditingCoupon(null);
              setFormData({
                code: '',
                discountPercent: '',
                maxDiscount: '',
                minOrderAmount: '',
                usageLimit: '',
                expiryDate: '',
                description: ''
              });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 bg-gold text-dark-base px-6 py-3 rounded-lg font-body font-semibold hover:bg-gold-light transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Coupon
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
          <input
            type="text"
            placeholder="Search coupons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-dark-surface border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
          />
        </div>

        {/* Coupons Table */}
        <div className="bg-dark-surface rounded-xl border border-white/5 overflow-hidden">
          {isLoading ? (
            <table className="w-full">
              <tbody>
                {Array.from({ length: 4 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={7} />
                ))}
              </tbody>
            </table>
          ) : filteredCoupons.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Code</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Discount</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Usage</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Expiry</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Status</th>
                    <th className="text-right py-4 px-6 text-warm-gray font-body text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoupons.map((coupon, idx) => (
                    <tr
                      key={coupon.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors animate-slide-up"
                      style={{ animationDelay: `${idx * 0.03}s` }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1.5 bg-gold/10 text-gold rounded-lg font-body font-medium">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => copyCode(coupon.code)}
                            className="p-1.5 hover:bg-white/5 rounded transition-colors"
                          >
                            <Copy className="w-4 h-4 text-warm-gray" />
                          </button>
                        </div>
                        <p className="text-warm-gray text-sm font-body mt-1">{coupon.description}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4 text-gold" />
                          <span className="text-warm-white font-body">{coupon.discountPercent}% off</span>
                        </div>
                        {coupon.maxDiscount && (
                          <p className="text-warm-gray text-sm font-body">Max ${coupon.maxDiscount}</p>
                        )}
                        {coupon.minOrderAmount && (
                          <p className="text-warm-gray text-sm font-body">Min order ${coupon.minOrderAmount}</p>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-warm-white font-body">{coupon.usageCount}</span>
                        {coupon.usageLimit && (
                          <span className="text-warm-gray text-sm font-body"> / {coupon.usageLimit}</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-warm-gray" />
                          <span className={`font-body ${isExpired(coupon.expiryDate) ? 'text-red-400' : 'text-warm-gray'}`}>
                            {new Date(coupon.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-body ${
                          coupon.isActive && !isExpired(coupon.expiryDate)
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-slate-500/15 text-slate-400'
                        }`}>
                          {coupon.isActive && !isExpired(coupon.expiryDate) ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(coupon)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-warm-gray" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-base flex items-center justify-center">
                <Percent className="w-6 h-6 text-warm-gray" />
              </div>
              <h3 className="text-warm-white font-display mb-2">No coupons found</h3>
              <p className="text-warm-gray font-body">Create your first coupon to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-dark-surface rounded-xl border border-white/10 p-6 w-full max-w-lg animate-scale-in max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-display text-warm-white mb-6">
              {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
            </h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-warm-gray text-sm font-body mb-2">Coupon Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., SUMMER20"
                  className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-warm-gray text-sm font-body mb-2">Discount % *</label>
                  <input
                    type="number"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                    placeholder="20"
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                  />
                </div>
                <div>
                  <label className="block text-warm-gray text-sm font-body mb-2">Max Discount</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    placeholder="50"
                    className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-warm-gray text-sm font-body mb-2">Min Order Amount</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    placeholder="100"
                    className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                  />
                </div>
                <div>
                  <label className="block text-warm-gray text-sm font-body mb-2">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="100"
                    className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                  />
                </div>
              </div>

              <div>
                <label className="block text-warm-gray text-sm font-body mb-2">Expiry Date *</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                />
              </div>

              <div>
                <label className="block text-warm-gray text-sm font-body mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Coupon description..."
                  rows={2}
                  className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 border border-white/20 text-warm-white rounded-lg font-body hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-gold text-dark-base rounded-lg font-body font-semibold hover:bg-gold-light transition-colors"
              >
                {editingCoupon ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
