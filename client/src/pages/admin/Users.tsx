// ============================================================================
// ADMIN - USERS PAGE
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Search, Filter, Ban, CheckCircle, MoreVertical, UserCheck } from 'lucide-react';
import { users, type UserRole } from '../../dataStore';
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

export const AdminUsers: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [userList, setUserList] = useState(users);
  const [banUserId, setBanUserId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = userList.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleUserStatus = (userId: string) => {
    setUserList(prev => prev.map(user => {
      if (user.id === userId) {
        const newStatus = !user.isActive;
        toast.success(`${user.name} has been ${newStatus ? 'activated' : 'banned'}`);
        return { ...user, isActive: newStatus };
      }
      return user;
    }));
    setBanUserId(null);
  };

  const getRoleBadge = (role: UserRole) => {
    const styles: Record<UserRole, string> = {
      customer: 'bg-blue-500/15 text-blue-400',
      seller: 'bg-emerald-500/15 text-emerald-400',
      admin: 'bg-purple-500/15 text-purple-400',
      delivery: 'bg-orange-500/15 text-orange-400',
      support: 'bg-pink-500/15 text-pink-400'
    };
    return styles[role] || 'bg-slate-500/15 text-slate-400';
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
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-surface border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-warm-gray" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
              className="px-4 py-3 bg-dark-surface border border-white/10 rounded-xl text-warm-white font-body focus:border-gold focus:ring-1 focus:ring-gold transition-all"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
              <option value="delivery">Delivery</option>
              <option value="support">Support</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
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
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-warm-white font-body">{user.name}</p>
                            <p className="text-warm-gray text-sm font-body">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-body capitalize ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-warm-gray font-body">
                          {new Date(user.joinedAt).toLocaleDateString()}
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
              onClick={() => banUserId && toggleUserStatus(banUserId)}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Ban User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
