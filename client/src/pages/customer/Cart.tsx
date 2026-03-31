// ============================================================================
// CUSTOMER - CART PAGE
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, Tag, ShoppingBag } from 'lucide-react';
import { getProductById, coupons } from '../../dataStore';
import { OrderItemSkeleton } from '../../components/Skeleton';
import { toast } from 'sonner';

interface CartProps {
  cart: { productId: string; quantity: number }[];
  setCart: React.Dispatch<React.SetStateAction<{ productId: string; quantity: number }[]>>;
}

export const Cart: React.FC<CartProps> = ({ cart, setCart }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<typeof coupons[0] | null>(null);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const cartItems = cart.map(item => ({
    ...item,
    product: getProductById(item.productId)
  })).filter(item => item.product);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const product = getProductById(productId);
    if (product && newQuantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
    toast.success('Item removed from cart');
  };

  const applyCoupon = () => {
    setCouponError('');
    const coupon = coupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
    
    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }
    
    if (!coupon.isActive) {
      setCouponError('This coupon is no longer active');
      return;
    }
    
    if (new Date(coupon.expiryDate) < new Date()) {
      setCouponError('This coupon has expired');
      return;
    }
    
    if (coupon.usageCount >= (coupon.usageLimit || Infinity)) {
      setCouponError('This coupon has reached its usage limit');
      return;
    }

    setAppliedCoupon(coupon);
    toast.success(`Coupon applied: ${coupon.discountPercent}% off`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const subtotal = cartItems.reduce((sum, item) => 
    sum + (item.product?.price || 0) * item.quantity, 0
  );
  
  const discount = appliedCoupon 
    ? Math.min(
        (subtotal * appliedCoupon.discountPercent) / 100,
        appliedCoupon.maxDiscount || Infinity
      )
    : 0;
  
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-display text-warm-white mb-8">Shopping Cart</h1>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <OrderItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center px-6">
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-dark-surface flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-warm-gray" />
          </div>
          <h2 className="text-2xl font-display text-warm-white mb-4">Your cart is empty</h2>
          <p className="text-warm-gray font-body mb-8">Looks like you haven't added anything yet</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gold text-dark-base px-8 py-3 rounded-lg font-body font-semibold hover:bg-gold-light transition-colors"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-display text-warm-white mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, idx) => (
              <div
                key={item.productId}
                className="bg-dark-surface rounded-xl p-4 flex gap-4 animate-slide-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <Link to={`/product/${item.productId}`} className="w-24 h-24 flex-shrink-0">
                  <img
                    src={item.product?.images[0]}
                    alt={item.product?.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </Link>
                
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.productId}`}>
                    <h3 className="text-warm-white font-display text-lg mb-1 truncate hover:text-gold transition-colors">
                      {item.product?.name}
                    </h3>
                  </Link>
                  <p className="text-gold font-body mb-3">${item.product?.price}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-dark-base rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1.5 hover:bg-dark-elevated rounded-md transition-colors"
                      >
                        <Minus className="w-4 h-4 text-warm-white" />
                      </button>
                      <span className="w-8 text-center text-warm-white font-body">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1.5 hover:bg-dark-elevated rounded-md transition-colors"
                      >
                        <Plus className="w-4 h-4 text-warm-white" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-warm-white font-display">
                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-2 text-warm-gray hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-dark-surface rounded-xl p-6 sticky top-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-xl font-display text-warm-white mb-6">Order Summary</h2>
              
              {/* Coupon Input */}
              <div className="mb-6">
                {!appliedCoupon ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-dark-base border border-white/10 rounded-lg text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body text-sm"
                        />
                      </div>
                      <button
                        onClick={applyCoupon}
                        className="px-4 py-2.5 bg-gold text-dark-base rounded-lg font-body font-medium hover:bg-gold-light transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-400 text-sm font-body">{couponError}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-gold/10 border border-gold/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gold" />
                      <span className="text-gold font-body font-medium">{appliedCoupon.code}</span>
                      <span className="text-warm-gray text-sm font-body">(-{appliedCoupon.discountPercent}%)</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-warm-gray hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-warm-gray font-body">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-body">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-warm-gray font-body">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-warm-gray font-body">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between">
                  <span className="text-warm-white font-display text-lg">Total</span>
                  <span className="text-gold font-display text-2xl">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => toast.success('Checkout coming soon!')}
                className="w-full flex items-center justify-center gap-2 bg-gold text-dark-base py-4 rounded-lg font-body font-semibold hover:bg-gold-light transition-colors"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-warm-gray text-sm font-body mt-4">
                Free shipping on orders over $100
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
