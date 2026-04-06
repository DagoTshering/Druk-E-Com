// ============================================================================
// ADMIN - USERS PAGE
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Ban, CheckCircle, MoreVertical, UserCheck, Clock } from 'lucide-react';
import { adminApi, type User, type PendingSeller } from '../../apis/adminApi';
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

type RoleFilter = 'all' | 'seller' | 'admin' | 'delivery' | 'support' | 'pending_seller';

export const AdminUsers: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [pendingSellers, setPendingSellers] = useState<PendingSeller[]>([]);
  const [banUserId, setBanUserId] = useState<string | null>(null);
  const [rejectingSeller, setRejectingSeller] = useState<{ userId: string; userName: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const data: any = await adminApi.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    }
  }, []);

  const fetchPendingSellers = useCallback(async () => {
    try {
      const data: any = await adminApi.getPendingSellers();
      setPendingSellers(data);
    } catch (error) {
      console.error('Failed to fetch pending sellers:', error);
      toast.error('Failed to load pending sellers');
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchUsers(), fetchPendingSellers()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchUsers, fetchPendingSellers]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  const filteredPendingSellers = pendingSellers.filter(seller => {
    const matchesSearch = seller.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         seller.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         seller.userEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleApprove = async (userId: string) => {
    try {
      await adminApi.approveSeller(userId);
      toast.success('Seller approved successfully');
      await fetchPendingSellers();
    } catch (error) {
      toast.error('Failed to approve seller');
    }
  };

  const handleReject = async () => {
    if (!rejectingSeller || !rejectReason.trim()) return;
    setIsRejecting(true);
    try {
      await adminApi.rejectSeller(rejectingSeller.userId, rejectReason);
      toast.success('Seller application rejected');
      setRejectingSeller(null);
      setRejectReason('');
      await fetchPendingSellers();
    } catch (error) {
      toast.error('Failed to reject seller');
    } finally {
      setIsRejecting(false);
    }
  };

  const toggleUserStatus = () => {
    toast.success(`User status updated`);
    setBanUserId(null);
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      customer: 'bg-blue-500/15 text-blue-400',
      seller: 'bg-emerald-500/15 text-emerald-400',
      admin: 'bg-purple-500/15 text-purple-400',
      delivery: 'bg-orange-500/15 text-orange-400',
      support: 'bg-pink-500/15 text-pink-400'
    };
    return styles[role] || 'bg-slate-500/15 text-slate-400';
  };

  const getBusinessTypeBadge = (type: string | null) => {
    if (!type) return null;
    const styles: Record<string, string> = {
      individual: 'bg-gray-500/15 text-gray-400',
      partnership: 'bg-blue-500/15 text-blue-400',
      llc: 'bg-emerald-500/15 text-emerald-400',
      corporation: 'bg-purple-500/15 text-purple-400'
    };
    return styles[type] || 'bg-slate-500/15 text-slate-400';
  };

  return (
    <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display text-warm-white">Users</h1>
          <p className="text-warm-gray font-body mt-1">Manage platform users and their permissions</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
            <input
              type="text"
              placeholder={roleFilter === 'pending_seller' ? "Search pending sellers..." : "Search users..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-surface border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-warm-gray" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
              className="px-4 py-3 bg-dark-surface border border-white/10 rounded-xl text-warm-white font-body focus:border-gold focus:ring-1 focus:ring-gold transition-all"
            >
              <option value="all">All Roles</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
              <option value="delivery">Delivery</option>
              <option value="support">Support</option>
              <option value="pending_seller">Pending Seller</option>
            </select>
          </div>
        </div>

        {/* Pending Sellers Section */}
        {roleFilter === 'pending_seller' ? (
          <div className="bg-dark-surface rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <h2 className="text-lg font-display text-warm-white">Pending Seller Applications</h2>
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-body rounded-full">
                  {pendingSellers.length}
                </span>
              </div>
            </div>
            {isLoading ? (
              <table className="w-full">
                <tbody>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <TableRowSkeleton key={i} columns={6} />
                  ))}
                </tbody>
              </table>
            ) : filteredPendingSellers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">User</th>
                      <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Business</th>
                      <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Business Type</th>
                      <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Applied</th>
                      <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Status</th>
                      <th className="text-right py-4 px-6 text-warm-gray font-body text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPendingSellers.map((seller, idx) => (
                      <tr
                        key={seller.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors animate-slide-up"
                        style={{ animationDelay: `${idx * 0.03}s` }}
                      >
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-warm-white font-body">{seller.userName || 'N/A'}</p>
                            <p className="text-warm-gray text-sm font-body">{seller.userEmail || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-warm-white font-body">{seller.businessName}</p>
                          <p className="text-warm-gray text-sm font-body">{seller.phone || 'No phone'}</p>
                        </td>
                        <td className="py-4 px-6">
                          {seller.businessType && (
                            <span className={`px-3 py-1 rounded-full text-xs font-body capitalize ${getBusinessTypeBadge(seller.businessType)}`}>
                              {seller.businessType}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-warm-gray font-body">
                            {new Date(seller.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body bg-yellow-500/15 text-yellow-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                            Pending
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(seller.userId)}
                              className="px-3 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg font-body text-sm transition-colors flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectingSeller({ userId: seller.userId, userName: seller.userName || seller.businessName })}
                              className="px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg font-body text-sm transition-colors"
                            >
                              Reject
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
                  <Clock className="w-6 h-6 text-warm-gray" />
                </div>
                <h3 className="text-warm-white font-display mb-2">No pending sellers</h3>
                <p className="text-warm-gray font-body">All seller applications have been processed</p>
              </div>
            )}
          </div>
        ) : (
          /* Regular Users Table */
          <div className="bg-dark-surface rounded-xl border border-white/5 overflow-hidden">
            {isLoading ? (
              <table className="w-full">
                <tbody>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <TableRowSkeleton key={i} columns={6} />
                  ))}
                </tbody>
              </table>
            ) : filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">User</th>
                      <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Role</th>
                      <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Joined</th>
                      <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Status</th>
                      <th className="text-right py-4 px-6 text-warm-gray font-body text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, idx) => (
                      <tr
                        key={user.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors animate-slide-up"
                        style={{ animationDelay: `${idx * 0.03}s` }}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                              <span className="text-gold font-body text-sm">{user.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="text-warm-white font-body">{user.name}</p>
                              <p className="text-warm-gray text-sm font-body">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map(role => (
                              <span
                                key={role}
                                className={`px-3 py-1 rounded-full text-xs font-body capitalize ${getRoleBadge(role)}`}
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-warm-gray font-body">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body ${
                            user.isActive
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-red-500/15 text-red-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            {user.isActive ? 'Active' : 'Banned'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4 text-warm-gray" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-dark-surface border-white/10">
                              <DropdownMenuItem className="text-warm-white hover:bg-white/5 cursor-pointer">
                                <UserCheck className="w-4 h-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className={user.isActive ? 'text-red-400 hover:bg-white/5 cursor-pointer' : 'text-emerald-400 hover:bg-white/5 cursor-pointer'}
                                onClick={() => user.isActive && setBanUserId(user.id)}
                              >
                                {user.isActive ? (
                                  <>
                                    <Ban className="w-4 h-4 mr-2" />
                                    Ban User
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Activate User
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                <h3 className="text-warm-white font-display mb-2">No users found</h3>
                <p className="text-warm-gray font-body">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ban Confirmation */}
      <AlertDialog open={!!banUserId} onOpenChange={() => setBanUserId(null)}>
        <AlertDialogContent className="bg-dark-surface border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-warm-white font-display">Ban User</AlertDialogTitle>
            <AlertDialogDescription className="text-warm-gray font-body">
              Are you sure you want to ban this user? They will no longer be able to access the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 text-warm-white hover:bg-white/5">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => banUserId && toggleUserStatus()}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Ban User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Seller Dialog */}
      <AlertDialog open={!!rejectingSeller} onOpenChange={() => { setRejectingSeller(null); setRejectReason(''); }}>
        <AlertDialogContent className="bg-dark-surface border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-warm-white font-display">Reject Seller Application</AlertDialogTitle>
            <AlertDialogDescription className="text-warm-gray font-body">
              You are about to reject the seller application for <strong className="text-warm-white">{rejectingSeller?.userName}</strong>.
              Please provide a reason for rejection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label className="block text-warm-gray text-sm font-body mb-2">Rejection Reason (Required)</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter the reason for rejection..."
              rows={3}
              className="w-full px-4 py-3 bg-dark-base border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body resize-none"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-transparent border-white/20 text-warm-white hover:bg-white/5"
              onClick={() => { setRejectingSeller(null); setRejectReason(''); }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReject}
              disabled={!rejectReason.trim() || isRejecting}
              className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
            >
              {isRejecting ? 'Rejecting...' : 'Reject Seller'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};