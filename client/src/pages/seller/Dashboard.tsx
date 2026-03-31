// ============================================================================
// SELLER - DASHBOARD PAGE
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Package, ShoppingCart, TrendingDown, Plus } from 'lucide-react';
import { getProductsBySeller, getOrdersBySeller } from '../../dataStore';
import { StatusBadge } from '../../components/StatusBadge';
import { StatsCardSkeleton, TableRowSkeleton } from '../../components/Skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SellerDashboardProps {
  currentUserId: string;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ currentUserId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const sellerProducts = getProductsBySeller(currentUserId);
  const sellerOrders = getOrdersBySeller(currentUserId);
  
  const totalRevenue = sellerOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.items
      .filter(item => sellerProducts.some(p => p.id === item.productId))
      .reduce((itemSum, item) => itemSum + item.price * item.quantity, 0), 0);

  const totalOrders = sellerOrders.filter(o => o.status !== 'cancelled').length;
  const totalProducts = sellerProducts.length;
  const lowStockProducts = sellerProducts.filter(p => p.stock < 10);

  // Top products by sales
  const productSales = sellerProducts.map(product => {
    const sales = sellerOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => {
        const item = o.items.find(i => i.productId === product.id);
        return sum + (item ? item.quantity : 0);
      }, 0);
    return { ...product, sales };
  }).sort((a, b) => b.sales - a.sales).slice(0, 5);

  // Chart data
  const chartData = [
    { name: 'Mon', sales: 1200 },
    { name: 'Tue', sales: 1900 },
    { name: 'Wed', sales: 1500 },
    { name: 'Thu', sales: 2200 },
    { name: 'Fri', sales: 2800 },
    { name: 'Sat', sales: 3200 },
    { name: 'Sun', sales: 2600 },
  ];

  const recentOrders = sellerOrders.slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
          <div className="bg-dark-surface rounded-xl overflow-hidden">
            <table className="w-full">
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={5} />
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display text-warm-white">Seller Dashboard</h1>
            <p className="text-warm-gray font-body mt-1">Welcome back! Here's your store overview</p>
          </div>
          <Link
            to="/seller/products/new"
            className="flex items-center gap-2 bg-gold text-dark-base px-6 py-3 rounded-lg font-body font-semibold hover:bg-gold-light transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`$${totalRevenue.toFixed(2)}`}
            change="+12.5%"
            isPositive={true}
            icon={DollarSign}
            delay={0}
          />
          <StatCard
            title="Total Orders"
            value={totalOrders.toString()}
            change="+8.2%"
            isPositive={true}
            icon={ShoppingCart}
            delay={0.05}
          />
          <StatCard
            title="Products"
            value={totalProducts.toString()}
            change="+2"
            isPositive={true}
            icon={Package}
            delay={0.1}
          />
          <StatCard
            title="Low Stock"
            value={lowStockProducts.length.toString()}
            change="Needs attention"
            isPositive={lowStockProducts.length === 0}
            icon={TrendingDown}
            delay={0.15}
          />
        </div>

        {/* Charts & Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-dark-surface rounded-xl border border-white/5 p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display text-warm-white">Sales Overview</h2>
              <div className="flex gap-2">
                {(['7d', '30d', '90d'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-body transition-colors ${
                      timeRange === range
                        ? 'bg-gold text-dark-base'
                        : 'bg-dark-base text-warm-gray hover:text-warm-white'
                    }`}
                  >
                    {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#a8a5a0" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a8a5a0" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1b',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#f0ede6'
                    }}
                    formatter={(value: number) => [`$${value}`, 'Sales']}
                  />
                  <Bar dataKey="sales" fill="#e8c547" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-dark-surface rounded-xl border border-white/5 p-6 animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <h2 className="text-xl font-display text-warm-white mb-6">Top Products</h2>
            <div className="space-y-4">
              {productSales.map((product, idx) => (
                <div key={product.id} className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded-full bg-dark-base text-gold text-sm flex items-center justify-center font-body">
                    {idx + 1}
                  </span>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-warm-white font-body text-sm truncate">{product.name}</p>
                    <p className="text-warm-gray text-xs font-body">{product.sales} sold</p>
                  </div>
                  <span className="text-gold font-body text-sm">${(product.price * product.sales).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-dark-surface rounded-xl border border-white/5 overflow-hidden animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-display text-warm-white">Recent Orders</h2>
            <Link to="/seller/orders" className="text-gold hover:text-gold-light font-body text-sm">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Order ID</th>
                  <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Customer</th>
                  <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Items</th>
                  <th className="text-left py-4 px-6 text-warm-gray font-body text-sm">Status</th>
                  <th className="text-right py-4 px-6 text-warm-gray font-body text-sm">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <span className="text-warm-white font-body">{order.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-warm-white font-body">{order.customerName}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-warm-gray font-body">{order.items.length} items</span>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={order.status} type="order" size="sm" />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-gold font-body">
                        ${order.items
                          .filter(item => sellerProducts.some(p => p.id === item.productId))
                          .reduce((sum, item) => sum + item.price * item.quantity, 0)
                          .toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        <span className={`text-sm font-body ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
    </div>
  );
};
