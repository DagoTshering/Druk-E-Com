// ============================================================================
// CUSTOMER - AUTHENTICATION PAGE (Login/Register)
// ============================================================================
// Similar to Flipkart - supports both Customer and Seller auth
// ============================================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Store, Eye, EyeOff, Mail, Lock, Phone, Building2, MapPin, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AuthProps {
  onLogin: (userType: 'customer' | 'seller', userData: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [userType, setUserType] = useState<'customer' | 'seller'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Customer registration state
  const [customerReg, setCustomerReg] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Seller registration state
  const [sellerReg, setSellerReg] = useState({
    businessName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessAddress: '',
    gstNumber: '',
    businessType: 'individual'
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo credentials check
    if (loginData.email && loginData.password) {
      const demoUser = {
        id: userType === 'customer' ? 'u1' : 'u3',
        name: userType === 'customer' ? 'Alexandra Chen' : 'Sophia Williams',
        email: loginData.email,
        role: userType,
        avatar: userType === 'customer' 
          ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
          : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
      };

      onLogin(userType, demoUser);
      toast.success(`Welcome back, ${demoUser.name}!`);
      navigate(userType === 'seller' ? '/seller' : '/');
    } else {
      toast.error('Please enter valid credentials');
    }

    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate passwords match
    const regData = userType === 'customer' ? customerReg : sellerReg;
    if (regData.password !== regData.confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('Account created successfully! Please login.');
    setActiveTab('login');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-base">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-dark-base/95 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-display text-gold">Druk</span>
              <span className="text-xl sm:text-2xl font-display text-warm-white">E Com</span>
            </Link>
            <Link to="/" className="flex items-center gap-2 text-warm-gray hover:text-gold transition-colors font-body text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Info */}
          <div className="hidden lg:flex flex-col justify-center">
            <h1 className="text-4xl font-display text-warm-white mb-4">
              Welcome to <span className="text-gold">Druk E Com</span>
            </h1>
            <p className="text-warm-gray font-body text-lg mb-8">
              {activeTab === 'login' 
                ? 'Sign in to access your account, track orders, and manage your shopping experience.'
                : 'Join our premium marketplace. Shop luxury products or start selling to millions of customers.'}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-warm-white font-body font-medium">Premium Products</p>
                  <p className="text-warm-gray text-sm font-body">Curated selection from top sellers</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-warm-white font-body font-medium">Secure Payments</p>
                  <p className="text-warm-gray text-sm font-body">100% secure checkout process</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-warm-white font-body font-medium">Fast Delivery</p>
                  <p className="text-warm-gray text-sm font-body">Quick and reliable shipping</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="bg-dark-surface rounded-2xl border border-white/5 p-6 sm:p-8">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3 px-4 rounded-xl font-body font-medium transition-all ${
                  activeTab === 'login'
                    ? 'bg-gold text-dark-base'
                    : 'bg-dark-base text-warm-gray hover:text-warm-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-3 px-4 rounded-xl font-body font-medium transition-all ${
                  activeTab === 'register'
                    ? 'bg-gold text-dark-base'
                    : 'bg-dark-base text-warm-gray hover:text-warm-white'
                }`}
              >
                Register
              </button>
            </div>

            {/* User Type Selector (only for login) */}
            {activeTab === 'login' && (
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setUserType('customer')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-body transition-all ${
                    userType === 'customer'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-dark-base text-warm-gray border border-white/10 hover:border-white/20'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Customer
                </button>
                <button
                  onClick={() => setUserType('seller')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-body transition-all ${
                    userType === 'seller'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-dark-base text-warm-gray border border-white/10 hover:border-white/20'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  Seller
                </button>
              </div>
            )}

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-warm-gray text-sm font-body mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-3.5 bg-dark-base border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-warm-gray text-sm font-body mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-12 py-3.5 bg-dark-base border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray hover:text-warm-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-dark-base text-gold focus:ring-gold" />
                    <span className="text-warm-gray text-sm font-body">Remember me</span>
                  </label>
                  <button type="button" className="text-gold text-sm font-body hover:underline">
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gold text-dark-base rounded-xl font-body font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : `Sign in as ${userType === 'customer' ? 'Customer' : 'Seller'}`}
                </button>

                <p className="text-center text-warm-gray text-sm font-body">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-gold hover:underline"
                  >
                    Register here
                  </button>
                </p>
              </form>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <>
                {/* Registration Type Selector */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setUserType('customer')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-body transition-all ${
                      userType === 'customer'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-dark-base text-warm-gray border border-white/10 hover:border-white/20'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    As Customer
                  </button>
                  <button
                    onClick={() => setUserType('seller')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-body transition-all ${
                      userType === 'seller'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-dark-base text-warm-gray border border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    As Seller
                  </button>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  {userType === 'customer' ? (
                    // Customer Registration Fields
                    <>
                      <div>
                        <label className="block text-warm-gray text-sm font-body mb-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                          <input
                            type="text"
                            value={customerReg.name}
                            onChange={(e) => setCustomerReg({ ...customerReg, name: e.target.value })}
                            placeholder="Enter your full name"
                            className="w-full pl-12 pr-4 py-3.5 bg-dark-base border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-warm-gray text-sm font-body mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                          <input
                            type="email"
                            value={customerReg.email}
                            onChange={(e) => setCustomerReg({ ...customerReg, email: e.target.value })}
                            placeholder="Enter your email"
                            className="w-full pl-12 pr-4 py-3.5 bg-dark-base border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-warm-gray text-sm font-body mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                          <input
                            type="tel"
                            value={customerReg.phone}
                            onChange={(e) => setCustomerReg({ ...customerReg, phone: e.target.value })}
                            placeholder="Enter your phone number"
                            className="w-full pl-12 pr-4 py-3.5 bg-dark-base border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-warm-gray text-sm font-body mb-2">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={customerReg.password}
                            onChange={(e) => setCustomerReg({ ...customerReg, password: e.target.value })}
                            placeholder="Create a password"
                            className="w-full pl-12 pr-12 py-3.5 bg-dark-base border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray hover:text-warm-white"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-warm-gray text-sm font-body mb-2">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                          <input
                            type="password"
                            value={customerReg.confirmPassword}
                            onChange={(e) => setCustomerReg({ ...customerReg, confirmPassword: e.target.value })}
                            placeholder="Confirm your password"
                            className="w-full pl-12 pr-4 py-3.5 bg-dark-base border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                            required
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    // Seller Registration Fields
                    <>
                      <div>
                        <label className="block text-warm-gray text-sm font-body mb-2">Business Name</label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                          <input
                            type="text"
                            value={sellerReg.businessName}
                            onChange={(e) => setSellerReg({ ...sellerReg, businessName: e.target.value })}
                            placeholder="Enter your business name"
                            className="w-full pl-12 pr-4 py-3.5 bg-dark-base border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-warm-gray text-sm font-body mb-2">Business Type</label>
                        <select
                          value={sellerReg.businessType}
                          onChange={(e) => setSellerReg({ ...sellerReg, businessType: e.target.value })}
                          className="w-full px-4 py-3.5 bg-dark-base border border-white/10 rounded-xl text-warm-white focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body appearance-none"
                        >
                          <option value="individual">Individual / Proprietor</option>
                          <option value="partnership">Partnership</option>
                          <option value="llc">LLC / Private Limited</option>
                          <option value="corporation">Corporation</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-warm-gray text-sm font-body mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                          <input
                            type="email"
                            value={sellerReg.email}
                            onChange={(e) => setSellerReg({ ...sellerReg, email: e.target.value })}
                            placeholder="Enter business email"
                            className="w-full pl-12 pr-4 py-3.5 bg-dark-base border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-warm-gray text-sm font-body mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                          <input
                            type="tel"
                            value={sellerReg.phone}
                            onChange={(e) => setSellerReg({ ...sellerReg, phone: e.target.value })}
                            placeholder="Enter business phone"
                            className="w-full pl-12 pr-4 py-3.5 bg-dark-base border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-warm-gray text-sm font-body mb-2">Business Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                          <input
                            type="text"
                            value={sellerReg.businessAddress}
                            onChange={(e) => setSellerReg({ ...sellerReg, businessAddress: e.target.value })}
                            placeholder="Enter business address"
                            className="w-full pl-12 pr-4 py-3.5 bg-dark-base border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-warm-gray text-sm font-body mb-2">GST Number (Optional)</label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                          <input
                            type="text"
                            value={sellerReg.gstNumber}
                            onChange={(e) => setSellerReg({ ...sellerReg, gstNumber: e.target.value })}
                            placeholder="Enter GST number"
                            className="w-full pl-12 pr-4 py-3.5 bg-dark-base border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-warm-gray text-sm font-body mb-2">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={sellerReg.password}
                            onChange={(e) => setSellerReg({ ...sellerReg, password: e.target.value })}
                            placeholder="Create a password"
                            className="w-full pl-12 pr-12 py-3.5 bg-dark-base border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray hover:text-warm-white"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-warm-gray text-sm font-body mb-2">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                          <input
                            type="password"
                            value={sellerReg.confirmPassword}
                            onChange={(e) => setSellerReg({ ...sellerReg, confirmPassword: e.target.value })}
                            placeholder="Confirm your password"
                            className="w-full pl-12 pr-4 py-3.5 bg-dark-base border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex items-start gap-2">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 mt-1 rounded border-white/20 bg-dark-base text-gold focus:ring-gold"
                      required
                    />
                    <span className="text-warm-gray text-sm font-body">
                      I agree to the{' '}
                      <Link to="/" className="text-gold hover:underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/" className="text-gold hover:underline">Privacy Policy</Link>
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-gold text-dark-base rounded-xl font-body font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creating account...' : `Register as ${userType === 'customer' ? 'Customer' : 'Seller'}`}
                  </button>

                  <p className="text-center text-warm-gray text-sm font-body">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-gold hover:underline"
                    >
                      Login here
                    </button>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
