// ============================================================================
// CUSTOMER - PRODUCT DETAIL PAGE
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Minus, Plus, Check } from 'lucide-react';
import { products, reviews, getReviewsByProduct, getRelatedProducts, getProductById } from '../../dataStore';
import { Skeleton } from '../../components/Skeleton';
import { toast } from 'sonner';

interface ProductDetailProps {
  _cart?: { productId: string; quantity: number }[];
  setCart: React.Dispatch<React.SetStateAction<{ productId: string; quantity: number }[]>>;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ setCart }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<typeof products[0] | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [productReviews, setProductReviews] = useState<typeof reviews>([]);
  const [relatedProducts, setRelatedProducts] = useState<typeof products>([]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const found = getProductById(id || '');
      if (found) {
        setProduct(found);
        setProductReviews(getReviewsByProduct(id || ''));
        setRelatedProducts(getRelatedProducts(id || '', 4));
      }
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product.id, quantity }];
    });
    toast.success(`${quantity} × ${product.name} added to cart`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display text-warm-white mb-4">Product not found</h2>
          <Link to="/" className="text-gold hover:text-gold-light font-body">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-base py-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-warm-gray hover:text-gold transition-colors font-body mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4 animate-fade-in">
            <div className="aspect-square rounded-2xl overflow-hidden bg-dark-surface">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-gold' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <p className="text-gold font-body text-sm mb-2">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-display text-warm-white mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-gold fill-gold" />
                <span className="text-warm-white font-body">{product.rating}</span>
              </div>
              <span className="text-warm-gray font-body">({product.reviewCount} reviews)</span>
              <span className={`px-3 py-1 rounded-full text-xs font-body ${
                product.stock > 10 
                  ? 'bg-emerald-500/15 text-emerald-400' 
                  : product.stock > 0 
                    ? 'bg-amber-500/15 text-amber-400' 
                    : 'bg-red-500/15 text-red-400'
              }`}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-display text-gold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-warm-gray line-through font-body">${product.originalPrice}</span>
              )}
            </div>

            <p className="text-warm-gray font-body leading-relaxed mb-8">{product.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-dark-surface text-warm-gray text-sm rounded-full font-body">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-3 bg-dark-surface rounded-lg p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-dark-elevated rounded-md transition-colors"
                >
                  <Minus className="w-4 h-4 text-warm-white" />
                </button>
                <span className="w-8 text-center text-warm-white font-body">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 hover:bg-dark-elevated rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4 text-warm-white" />
                </button>
              </div>
              
              <button
                onClick={addToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-3 bg-gold text-dark-base py-3.5 px-8 rounded-lg font-body font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>

            {/* Features */}
            <div className="flex items-center gap-6 text-sm text-warm-gray font-body">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-gold" />
                Free shipping over $100
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-gold" />
                30-day returns
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-display text-warm-white mb-8">Customer Reviews</h2>
          {productReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {productReviews.map((review, idx) => (
                <div
                  key={review.id}
                  className="bg-dark-surface rounded-xl p-6 border border-white/5 animate-slide-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-warm-white font-body font-medium">{review.userName}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < review.rating ? 'text-gold fill-gold' : 'text-warm-gray'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-warm-gray font-body">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-dark-surface rounded-xl">
              <p className="text-warm-gray font-body">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-display text-warm-white mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related, idx) => (
                <Link
                  key={related.id}
                  to={`/product/${related.id}`}
                  className="group bg-dark-surface rounded-xl overflow-hidden border border-white/5 card-hover animate-slide-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={related.images[0]}
                      alt={related.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-gold text-xs font-body mb-1">{related.category}</p>
                    <h3 className="text-warm-white font-display text-lg mb-2 line-clamp-1">{related.name}</h3>
                    <span className="text-gold font-display">${related.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
