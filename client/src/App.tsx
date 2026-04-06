// ============================================================================
// LUXEMARKET - MAIN APP (RESPONSIVE WITH AUTH)
// ============================================================================

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useSelector } from 'react-redux';
import { RoleProvider, useRole } from './context/RoleContext';
import { RoleSwitcher } from './components/RoleSwitcher';
import { store } from './redux/store';
import { resetUser } from './redux/user/userSlice';
import { sellerApi, type SellerProfile } from './apis/sellerApi';

// Customer Pages
import { Home } from './pages/customer/Home';
import { ProductDetail } from './pages/customer/ProductDetail';
import { Cart } from './pages/customer/Cart';
import { Orders as CustomerOrders } from './pages/customer/Orders';
import { Profile } from './pages/customer/Profile';
import { Auth } from './pages/customer/Auth';

// Seller Pages
import { SellerDashboard } from './pages/seller/Dashboard';
import { MyListings } from './pages/seller/MyListings';
import { ProductForm } from './pages/seller/ProductForm';
import { SellerPayouts } from './pages/seller/Payouts';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminUsers } from './pages/admin/Users';
import { AdminOrders } from './pages/admin/Orders';
import { AdminProducts } from './pages/admin/Products';
import { AdminCategories } from './pages/admin/Categories';
import { AdminCoupons } from './pages/admin/Coupons';

// Delivery Pages
import { DeliveryQueue } from './pages/delivery/Queue';

// Support Pages
import { SupportTickets } from './pages/support/Tickets';
import { OrderLookup } from './pages/support/OrderLookup';

// Icons
import {
  Home as HomeIcon,
  ShoppingBag,
  Package,
  User,
  LayoutDashboard,
  Store,
  List,
  DollarSign,
  Users,
  ShoppingCart,
  Grid,
  Tag,
  Truck,
  MessageSquare,
  Search,
  LogOut,
  Menu,
  X,
  LogIn
} from 'lucide-react';

export const navigateRef: { current: ((path: string) => void) | null } = { current: null };
export const navigateTo = (path: string) => navigateRef.current?.(path);

// ============================================================================
// AUTH CONTEXT
// ============================================================================

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'seller' | 'admin' | 'delivery' | 'support';
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (userType: 'customer' | 'seller', userData: AuthUser) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// ============================================================================
// CUSTOMER NAVIGATION (MOBILE RESPONSIVE WITH AUTH)
// ============================================================================

interface CustomerNavProps {
  cartCount: number;
  onLogout: () => void;
}

const CustomerNav: React.FC<CustomerNavProps> = ({ cartCount, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const user = useSelector((state: any) => state.users.user);
  const isAuthenticated = useSelector((state: any) => state.users.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated && !sellerProfile) {
      sellerApi.getProfile()
        .then((res: any) => setSellerProfile(res))
        .catch(() => setSellerProfile(null));
    }
  }, [isAuthenticated, sellerProfile]);

  const handleSellerDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (sellerProfile?.status === 'approved') {
      navigate('/seller');
    } else {
      setShowStatusDialog(true);
    }
  };

  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/cart', label: 'Cart', icon: ShoppingCart, badge: cartCount },
    ...(isAuthenticated ? [
      { path: '/orders', label: 'Orders', icon: Package },
      { path: '/profile', label: 'Profile', icon: User },
    ] : []),
  ];

  return (
    <>
      {/* Status Dialog */}
      {showStatusDialog && sellerProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-dark-surface border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
            {sellerProfile.status === 'pending' ? (
              <>
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⏳</span>
                </div>
                <h3 className="text-xl font-display text-warm-white mb-2">Pending Approval</h3>
                <p className="text-warm-gray font-body mb-6">
                  We are reviewing your application.<br />
                  You will be notified once approved.
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">❌</span>
                </div>
                <h3 className="text-xl font-display text-warm-white mb-2">Application Rejected</h3>
                <p className="text-warm-gray font-body mb-6">
                  {sellerProfile.rejectionReason || 'Your seller application was rejected.'}
                </p>
              </>
            )}
            <button
              onClick={() => setShowStatusDialog(false)}
              className="px-6 py-3 bg-gold text-dark-base rounded-xl font-body font-medium hover:bg-gold-light transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <nav className="fixed top-0 left-0 right-0 z-40 bg-dark-base/95 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-display text-gold">Druk</span>
              <span className="text-xl sm:text-2xl font-display text-warm-white">E Com</span>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden sm:flex items-center gap-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-lg font-body text-sm transition-colors flex items-center gap-2 ${
                    location.pathname === item.path
                      ? 'bg-gold/10 text-gold'
                      : 'text-warm-gray hover:text-warm-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-dark-base text-xs font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}

              {/* Seller Dashboard Tab */}
              {sellerProfile && (
                <button
                  onClick={handleSellerDashboardClick}
                  className={`relative px-4 py-2 rounded-lg font-body text-sm transition-colors flex items-center gap-2 ${
                    location.pathname === '/seller'
                      ? 'bg-gold/10 text-gold'
                      : 'text-warm-gray hover:text-warm-white hover:bg-white/5'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Seller Dashboard</span>
                  {sellerProfile.status === 'pending' && (
                    <span className="w-2 h-2 bg-yellow-500 rounded-full" title="Pending Approval" />
                  )}
                </button>
              )}
              
              {/* Auth Buttons */}
              {!isAuthenticated ? (
                <Link
                  to="/auth"
                  className="ml-2 px-4 py-2 bg-gold text-dark-base rounded-lg font-body text-sm font-medium hover:bg-gold-light transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              ) : (
                <div className="flex items-center gap-3 ml-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover border border-gold"
                    />
                    <span className="text-warm-white font-body text-sm hidden md:inline">{user?.name?.split(' ')[0]}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 text-warm-gray hover:text-red-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-warm-gray hover:text-warm-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-dark-surface border-t border-white/5 animate-slide-up">
            <div className="px-4 py-3 space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm transition-colors ${
                    location.pathname === item.path
                      ? 'bg-gold/10 text-gold'
                      : 'text-warm-gray hover:text-warm-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto px-2 py-0.5 bg-gold text-dark-base text-xs font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}

              {/* Seller Dashboard Tab - Mobile */}
              {sellerProfile && (
                <button
                  onClick={() => {
                    handleSellerDashboardClick({ preventDefault: () => {} } as React.MouseEvent);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm transition-colors ${
                    location.pathname === '/seller'
                      ? 'bg-gold/10 text-gold'
                      : 'text-warm-gray hover:text-warm-white hover:bg-white/5'
                  }`}
                >
                  <Store className="w-5 h-5" />
                  <span>Seller Dashboard</span>
                  {sellerProfile.status === 'pending' && (
                    <span className="ml-auto w-2 h-2 bg-yellow-500 rounded-full" />
                  )}
                </button>
              )}
              
              {/* Mobile Auth */}
              {!isAuthenticated ? (
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm bg-gold text-dark-base"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login / Register</span>
                </Link>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 border-t border-white/5 mt-2">
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'}
                      alt={user?.name}
                      className="w-10 h-10 rounded-full object-cover border border-gold"
                    />
                    <div>
                      <p className="text-warm-white font-body">{user?.name}</p>
                      <p className="text-warm-gray text-sm font-body">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

// ============================================================================
// DASHBOARD SIDEBAR (RESPONSIVE - Mobile Drawer)
// ============================================================================

interface SidebarProps {
  role: 'seller' | 'admin' | 'delivery' | 'support';
  onLogout: () => void;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ role, onLogout }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector((state: any) => state.users.user);

  const getNavItems = () => {
    switch (role) {
      case 'seller':
        return [
          { path: '/seller', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/seller/listings', label: 'My Listings', icon: List },
          { path: '/seller/products/new', label: 'Add Product', icon: Store },
          { path: '/seller/payouts', label: 'Payouts', icon: DollarSign },
        ];
      case 'admin':
        return [
          { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/admin/users', label: 'Users', icon: Users },
          { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
          { path: '/admin/products', label: 'Products', icon: Package },
          { path: '/admin/categories', label: 'Categories', icon: Grid },
          { path: '/admin/coupons', label: 'Coupons', icon: Tag },
        ];
      case 'delivery':
        return [
          { path: '/delivery', label: 'My Queue', icon: Truck },
        ];
      case 'support':
        return [
          { path: '/support', label: 'Tickets', icon: MessageSquare },
          { path: '/support/lookup', label: 'Order Lookup', icon: Search },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  const roleColors = {
    seller: 'text-emerald-400',
    admin: 'text-purple-400',
    delivery: 'text-orange-400',
    support: 'text-pink-400'
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-dark-surface border-r border-white/5 z-40 flex-col">
        <div className="p-6 flex-1 overflow-y-auto">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <span className="text-xl font-display text-gold">Druk</span>
            <span className="text-xl font-display text-warm-white">E Com</span>
          </Link>

          {/* User Info */}
          {user && (
            <div className="mb-6 p-4 bg-dark-base rounded-xl">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-gold"
                />
                <div className="overflow-hidden">
                  <p className="text-warm-white font-body text-sm truncate">{user.name}</p>
                  <p className={`text-xs font-body ${roleColors[role]}`}>{role}</p>
                </div>
              </div>
            </div>
          )}

          <nav className="space-y-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm transition-colors ${
                  location.pathname === item.path
                    ? 'bg-gold text-dark-base'
                    : 'text-warm-gray hover:text-warm-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-dark-base/95 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-display text-gold">Druk</span>
            <span className="text-xl font-display text-warm-white">E Com</span>
          </Link>
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-gold"
                />
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-warm-gray hover:text-warm-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed top-16 left-0 right-0 bottom-0 bg-dark-surface z-50 animate-slide-up">
            <div className="p-4 space-y-1 overflow-y-auto h-full pb-20">
              {/* User Info in Mobile Menu */}
              {user && (
                <div className="p-4 bg-dark-base rounded-xl mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border border-gold"
                    />
                    <div>
                      <p className="text-warm-white font-body">{user.name}</p>
                      <p className={`text-sm font-body ${roleColors[role]}`}>{role}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className={`text-xs font-body uppercase tracking-wider mb-4 px-4 py-2 ${roleColors[role]}`}>
                {role} Portal
              </div>
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm transition-colors ${
                    location.pathname === item.path
                      ? 'bg-gold text-dark-base'
                      : 'text-warm-gray hover:text-warm-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-white/5 mt-4 pt-4">
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// ============================================================================
// MAIN APP CONTENT
// ============================================================================

const AppContent: React.FC = () => {
  const { currentRole, setRole } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([
    { productId: 'p2', quantity: 1 },
    { productId: 'p7', quantity: 2 }
  ]);
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogin = (userType: 'customer' | 'seller', userData: AuthUser) => {
    setIsAuthenticated(true);
    setUser(userData);
    setRole(userType);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    store.dispatch(resetUser());
    setIsAuthenticated(false);
    setUser(null);
    setRole('customer');
  };

  // Current user ID (simulated - would come from auth in real app)
  const currentUserId = user?.id || (currentRole === 'customer' ? 'u1' : 
                        currentRole === 'seller' ? 'u3' :
                        currentRole === 'admin' ? 'u5' :
                        currentRole === 'delivery' ? 'u6' :
                        currentRole === 'support' ? 'u7' : 'u1');

  const isDashboardRole = currentRole === 'seller' || currentRole === 'admin' || currentRole === 'delivery' || currentRole === 'support';

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login: handleLogin, logout: handleLogout }}>
      <div className="min-h-screen bg-dark-base">
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#1a1a1b',
              color: '#f0ede6',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />

        {/* Role-based Navigation */}
        {currentRole === 'customer' && (
          <CustomerNav 
            cartCount={cartItemCount} 
            onLogout={handleLogout}
          />
        )}
        {isDashboardRole && (
          <DashboardSidebar 
            role={currentRole} 
            onLogout={handleLogout}
          />
        )}

        {/* Main Content - Responsive padding */}
        <main className={`
          min-h-screen
          ${currentRole === 'customer' ? 'pt-16' : 'lg:pl-64 pt-16 lg:pt-0'}
        `}>
          <Routes>
            {/* Customer Routes */}
            {currentRole === 'customer' && (
              <>
                <Route path="/" element={<Home cart={cart} setCart={setCart} />} />
                <Route path="/product/:id" element={<ProductDetail _cart={cart} setCart={setCart} />} />
                <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
                <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
                <Route 
                  path="/orders" 
                  element={isAuthenticated ? <CustomerOrders currentUserId={currentUserId} /> : <Navigate to="/auth" />} 
                />
                <Route 
                  path="/profile" 
                  element={isAuthenticated ? <Profile currentUserId={currentUserId} /> : <Navigate to="/auth" />} 
                />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}

            {/* Seller Routes */}
            {currentRole === 'seller' && (
              <>
                <Route path="/seller" element={<SellerDashboard currentUserId={currentUserId} />} />
                <Route path="/seller/listings" element={<MyListings currentUserId={currentUserId} />} />
                <Route path="/seller/products/new" element={<ProductForm />} />
                <Route path="/seller/payouts" element={<SellerPayouts currentUserId={currentUserId} />} />
                <Route path="*" element={<Navigate to="/seller" />} />
              </>
            )}

            {/* Admin Routes */}
            {currentRole === 'admin' && (
              <>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/coupons" element={<AdminCoupons />} />
                <Route path="*" element={<Navigate to="/admin" />} />
              </>
            )}

            {/* Delivery Routes */}
            {currentRole === 'delivery' && (
              <>
                <Route path="/delivery" element={<DeliveryQueue currentUserId={currentUserId} />} />
                <Route path="*" element={<Navigate to="/delivery" />} />
              </>
            )}

            {/* Support Routes */}
            {currentRole === 'support' && (
              <>
                <Route path="/support" element={<SupportTickets _currentUserId={currentUserId} />} />
                <Route path="/support/lookup" element={<OrderLookup />} />
                <Route path="*" element={<Navigate to="/support" />} />
            </>
            )}
          </Routes>
        </main>

        {/* Role Switcher - Only show for demo purposes */}
        <RoleSwitcher />
      </div>
    </AuthContext.Provider>
  );
};

// ============================================================================
// ROOT APP
// ============================================================================

function App() {
  return (
    <BrowserRouter>
      <RoleProvider>
        <AppContent />
      </RoleProvider>
    </BrowserRouter>
  );
}

export default App;
