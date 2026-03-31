// ============================================================================
// CUSTOMER - HOME / BROWSE PAGE
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Star, Filter, ChevronRight } from 'lucide-react';
import { products, categories, getProductById } from '../../dataStore';
import { ProductCardSkeleton } from '../../components/Skeleton';
import { toast } from 'sonner';

interface HomeProps {
  cart: { productId: string; quantity: number }[];
  setCart: React.Dispatch<React.SetStateAction<{ productId: string; quantity: number }[]>>;
}

export const Home: React.FC<HomeProps> = ({ cart, setCart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [featuredProducts, _setFeaturedProducts] = useState(products.filter(p => p.isFeatured));

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
    const product = getProductById(productId);
    toast.success(`${product?.name} added to cart`);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  void cartItemCount; // Used in navigation

  return (
    <div className="min-h-screen bg-dark-base">
      {/* Hero Section */}
      <section className="relative py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-warm-white mb-6">
              Discover <span className="text-gold">Luxury</span>
            </h1>
            <p className="text-lg text-warm-gray max-w-2xl mx-auto font-body">
              Curated collection of premium products from the world's finest sellers
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-dark-surface border border-white/10 rounded-xl text-warm-white placeholder:text-warm-gray/50 focus:border-gold focus:ring-1 focus:ring-gold transition-all font-body"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full border transition-all font-body text-sm ${
                selectedCategory === 'all'
                  ? 'bg-gold text-dark-base border-gold'
                  : 'bg-dark-surface text-warm-white border-white/10 hover:border-gold/50'
              }`}
            >
              All Products
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2.5 rounded-full border transition-all font-body text-sm ${
                  selectedCategory === category.id
                    ? 'bg-gold text-dark-base border-gold'
                    : 'bg-dark-surface text-warm-white border-white/10 hover:border-gold/50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {selectedCategory === 'all' && !searchQuery && (
        <section className="px-6 lg:px-12 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-display text-warm-white">Featured Products</h2>
              <Link to="/products" className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-body text-sm">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    delay={index * 0.05}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* All Products Grid */}
      <section className="px-6 lg:px-12 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-display text-warm-white">
              {searchQuery ? `Search Results (${filteredProducts.length})` : 'All Products'}
            </h2>
            <div className="flex items-center gap-2 text-warm-gray font-body text-sm">
              <Filter className="w-4 h-4" />
              <span>{filteredProducts.length} items</span>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  delay={index * 0.03}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-surface flex items-center justify-center">
                <Search className="w-8 h-8 text-warm-gray" />
              </div>
              <h3 className="text-xl font-display text-warm-white mb-2">No products found</h3>
              <p className="text-warm-gray font-body">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

interface ProductCardProps {
  product: typeof products[0];
  onAddToCart: (productId: string) => void;
  delay: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, delay }) => {
  return (
    <div
      className="group bg-dark-surface rounded-xl border border-white/5 overflow-hidden card-hover animate-slide-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        {product.originalPrice && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-gold text-dark-base text-xs font-bold rounded">
            SALE
          </span>
        )}
      </Link>
      
      <div className="p-4">
        <p className="text-xs text-gold font-body mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-warm-white font-display text-lg mb-2 line-clamp-1 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-gold fill-gold" />
            <span className="text-sm text-warm-white font-body">{product.rating}</span>
          </div>
          <span className="text-warm-gray text-sm font-body">({product.reviewCount})</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gold font-display text-xl">${product.price}</span>
            {product.originalPrice && (
              <span className="text-warm-gray line-through text-sm font-body">${product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(product.id)}
            className="p-2.5 bg-gold text-dark-base rounded-lg hover:bg-gold-light transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
