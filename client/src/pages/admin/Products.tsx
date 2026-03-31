// ============================================================================
// ADMIN - PRODUCTS PAGE (MODERATION)
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Flag, Eye, MoreVertical } from 'lucide-react';
import { products } from '../../dataStore';
import { TableRowSkeleton } from '../../components/Skeleton';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

export const AdminProducts: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'flagged'>('all');
  const [productList, setProductList] = useState(products);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = productList.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && product.isActive) ||
                         (statusFilter === 'inactive' && !product.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (productId: string) => {
    setProductList(prev => prev.map(p => {
      if (p.id === productId) {
        toast.success('Product approved');
        return { ...p, isActive: true };
      }
      return p;
    }));
  };

  const handleReject = (productId: string) => {
    setProductList(prev => prev.map(p => {
      if (p.id === productId) {
        toast.success('Product rejected');
        return { ...p, isActive: false };
      }
      return p;
    }));
  };

  const handleFlag = (_productId: string) => {
    toast.success('Product flagged for review');
  };

  const statusCounts = {
    all: productList.length,
    active: productList.filter(p => p.isActive).length,
    inactive: productList.filter(p => !p.isActive).length,
    flagged: 0, // Would be tracked separately in real app
  };

  return (
    <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display text-warm-white">Product Moderation</h1>
          <p className="text-warm-gray font-body mt-1">Review and moderate platform products</p>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'active', 'inactive', 'flagged'] as const).map(status => (
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
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-dark-surface border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
          />
        </div>

        {/* Products Table */}
        <div className="bg-dark-surface rounded-xl border border-white/5 overflow-hidden">
          {isLoading ? (
            <table className="w-full">
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={7} />
                ))}
              </tbody>
            </table>
          ) : filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Product</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Category</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Seller</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Price</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Stock</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Status</th>
                    <th className="text-right py-4 px-6 text-warm-gray font-body text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, idx) => (
                    <tr
                      key={product.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors animate-slide-up"
                      style={{ animationDelay: `${idx * 0.03}s` }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="text-warm-white font-body">{product.name}</p>
                            <p className="text-warm-gray text-sm font-body">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-warm-gray font-body">{product.category}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-warm-gray font-body">{product.sellerId}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-gold font-body">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-warm-gray line-through text-sm">${product.originalPrice}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-body ${
                          product.stock > 10
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : product.stock > 0
                              ? 'bg-amber-500/15 text-amber-400'
                              : 'bg-red-500/15 text-red-400'
                        }`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-body ${
                          product.isActive
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-slate-500/15 text-slate-400'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!product.isActive && (
                            <button
                              onClick={() => handleApprove(product.id)}
                              className="p-2 bg-emerald-500/15 text-emerald-400 rounded-lg hover:bg-emerald-500/25 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {product.isActive && (
                            <button
                              onClick={() => handleReject(product.id)}
                              className="p-2 bg-red-500/15 text-red-400 rounded-lg hover:bg-red-500/25 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleFlag(product.id)}
                            className="p-2 bg-amber-500/15 text-amber-400 rounded-lg hover:bg-amber-500/25 transition-colors"
                            title="Flag"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4 text-warm-gray" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-dark-surface border-white/10">
                              <DropdownMenuItem className="text-warm-white hover:bg-white/5 cursor-pointer">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                <Search className="w-6 h-6 text-warm-gray" />
              </div>
              <h3 className="text-warm-white font-display mb-2">No products found</h3>
              <p className="text-warm-gray font-body">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
