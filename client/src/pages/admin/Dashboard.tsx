// ============================================================================
// ADMIN - DASHBOARD PAGE
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, DollarSign, Store, Activity, UserPlus, Package } from 'lucide-react';
import { users, orders, products } from '../../dataStore';
import { StatsCardSkeleton } from '../../components/Skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Platform stats
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const totalProducts = products.length;
  void totalProducts; // Used in stats
  const totalSellers = users.filter(u => u.role === 'seller').length;
  
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const newUsersThisWeek = 3; // Simulated

  // Activity feed
  const activities = [
    { id: 1, type: 'order', message: 'New order received: ORD-2024-009', time: '2 minutes ago', icon: ShoppingBag },
    { id: 2, type: 'user', message: 'New user registered: Sarah Miller', time: '15 minutes ago', icon: UserPlus },
    { id: 3, type: 'product', message: 'New product added: Vintage Leather Bag', time: '1 hour ago', icon: Package },
    { id: 4, type: 'order', message: 'Order ORD-2024-005 delivered', time: '2 hours ago', icon: ShoppingBag },
    { id: 5, type: 'user', message: 'Seller David Park verified', time: '3 hours ago', icon: Store },
  ];

  // Chart data
  const revenueData = [
    { name: 'Jan', revenue: 12500 },
    { name: 'Feb', revenue: 18200 },
    { name: 'Mar', revenue: 15800 },
    { name: 'Apr', revenue: 22400 },
    { name: 'May', revenue: 28900 },
    { name: 'Jun', revenue: 32100 },
  ];

  const ordersData = [
    { name: 'Mon', orders: 45 },
    { name: 'Tue', orders: 52 },
    { name: 'Wed', orders: 38 },
    { name: 'Thu', orders: 65 },
    { name: 'Fri', orders: 78 },
    { name: 'Sat', orders: 92 },
    { name: 'Sun', orders: 58 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-display text-warm-white mb-8">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display text-warm-white">Admin Dashboard</h1>
          <p className="text-warm-gray font-body mt-1">Platform overview and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={totalUsers.toString()}
            change={`+${newUsersThisWeek} this week`}
            isPositive={true}
            icon={Users}
            delay={0}
          />
          <StatCard
            title="Total Orders"
            value={totalOrders.toString()}
            change={`${pendingOrders} pending`}
            isPositive={pendingOrders < 5}
            icon={ShoppingBag}
            delay={0.05}
          />
          <StatCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            change="+18.2%"
            isPositive={true}
            icon={DollarSign}
            delay={0.1}
          />
          <StatCard
            title="Active Sellers"
            value={totalSellers.toString()}
            change="+1 this month"
            isPositive={true}
            icon={Store}
            delay={0.15}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-dark-surface rounded-xl border border-white/5 p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display text-warm-white">Revenue Overview</h2>
              <select className="px-3 py-1.5 bg-dark-base border border-white/10 rounded-lg text-warm-white text-sm font-body">
                <option>Last 6 Months</option>
                <option>Last Year</option>
                <option>All Time</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e8c547" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#e8c547" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#a8a5a0" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a8a5a0" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1b',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#f0ede6'
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#e8c547" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-dark-surface rounded-xl border border-white/5 p-6 animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <h2 className="text-xl font-display text-warm-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gold" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <activity.icon className="w-4 h-4 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-warm-white font-body text-sm">{activity.message}</p>
                    <p className="text-warm-gray text-xs font-body">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-dark-surface rounded-xl border border-white/5 p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display text-warm-white">Orders This Week</h2>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#a8a5a0" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a8a5a0" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#f0ede6'
                  }}
                  formatter={(value: number) => [value, 'Orders']}
                />
                <Line type="monotone" dataKey="orders" stroke="#e8c547" strokeWidth={2} dot={{ fill: '#e8c547' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, icon: Icon, delay }) => {
  return (
    <div
      className="bg-dark-surface rounded-xl border border-white/5 p-6 animate-slide-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-warm-gray font-body text-sm mb-1">{title}</p>
          <p className="text-2xl font-display text-warm-white">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gold" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-body ${isPositive ? 'text-emerald-400' : 'text-amber-400'}`}>
          {change}
        </span>
      </div>
    </div>
  );
};
