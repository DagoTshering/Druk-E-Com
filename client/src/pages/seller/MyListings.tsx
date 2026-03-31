// ============================================================================
// SELLER - MY LISTINGS PAGE
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, MoreVertical } from 'lucide-react';
import { products, getProductsBySeller } from '../../dataStore';
import { TableRowSkeleton } from '../../components/Skeleton';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';

interface MyListingsProps {
  currentUserId: string;
}

export const MyListings: React.FC<MyListingsProps> = ({ currentUserId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [sellerProducts, setSellerProducts] = useState<typeof products>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSellerProducts(getProductsBySeller(currentUserId));
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [currentUserId]);

  const filteredProducts = sellerProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteProductId) {
      setSellerProducts(prev => prev.filter(p => p.id !== deleteProductId));
      toast.success('Product deleted successfully');
      setDeleteProductId(null);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', class: 'bg-red-500/15 text-red-400' };
    if (stock < 10) return { label: 'Low Stock', class: 'bg-amber-500/15 text-amber-400' };
    return { label: 'In Stock', class: 'bg-emerald-500/15 text-emerald-400' };
  };

  return (
    <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display text-warm-white">My Listings</h1>
            <p className="text-warm-gray font-body mt-1">Manage your products and inventory</p>
          </div>
          <Link
            to="/seller/products/new"
            className="flex items-center gap-2 bg-gold text-dark-base px-6 py-3 rounded-lg font-body font-semibold hover:bg-gold-light transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-surface border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-dark-surface rounded-xl border border-white/5 overflow-hidden">
          {isLoading ? (
            <table className="w-full">
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={6} />
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
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Price</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Stock</th>
                    <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Status</th>
                    <th className="text-right py-4 px-6 text-warm-gray font-body text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, idx) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
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
                          <div className="flex items-center gap-2">
                            <span className="text-gold font-body">${product.price}</span>
                            {product.originalPrice && (
                              <span className="text-warm-gray line-through text-sm">${product.originalPrice}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-body ${stockStatus.class}`}>
                            {product.stock} - {stockStatus.label}
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
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4 text-warm-gray" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-dark-surface border-white/10">
                              <DropdownMenuItem className="text-warm-white hover:bg-white/5 cursor-pointer">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-warm-white hover:bg-white/5 cursor-pointer">
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-400 hover:bg-white/5 cursor-pointer"
                                onClick={() => setDeleteProductId(product.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-base flex items-center justify-center">
                <Search className="w-6 h-6 text-warm-gray" />
              </div>
              <h3 className="text-warm-white font-display mb-2">No products found</h3>
              <p className="text-warm-gray font-body mb-6">Try adjusting your search or add a new product</p>
              <Link
                to="/seller/products/new"
                className="inline-flex items-center gap-2 bg-gold text-dark-base px-6 py-3 rounded-lg font-body font-semibold hover:bg-gold-light transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent className="bg-dark-surface border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-warm-white font-display">Delete Product</AlertDialogTitle>
            <AlertDialogDescription className="text-warm-gray font-body">
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 text-warm-white hover:bg-white/5">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
