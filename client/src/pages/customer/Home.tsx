// ============================================================================
// CUSTOMER - HOME / BROWSE PAGE
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Star, Filter, ChevronRight, ChevronLeft } from 'lucide-react';
import { productsApi, type Product, type Category } from '../../apis/productsApi';
import { ProductCardSkeleton } from '../../components/Skeleton';
import { toast } from 'sonner';

interface HomeProps {
  cart: { productId: string; quantity: number }[];
  setCart: React.Dispatch<React.SetStateAction<{ productId: string; quantity: number }[]>>;
}

const PRODUCTS_PER_PAGE = 8;

export const Home: React.FC<HomeProps> = ({ cart, setCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchCategories = useCallback(async () => {
    try {
      const data: any = await productsApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  const fetchProducts = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number | undefined> = {
        page,
        limit: PRODUCTS_PER_PAGE,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (selectedCategory !== 'all') {
        const category = categories.find(c => c.id === selectedCategory);
        if (category) {
          params.category = category.slug;
        }
      }

      const data: any = await productsApi.getProducts(params);
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotalProducts(data.total);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, categories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (categories.length > 0) {
      fetchProducts(1);
    }
  }, [categories, fetchProducts]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts(1);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    fetchProducts(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchProducts(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
    const product = products.find(p => p.id === productId);
    toast.success(`${product?.name} added to cart`);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  void cartItemCount;

  const featuredProducts = products.filter(p => p.isFeatured);

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
              onClick={() => handleCategoryChange('all')}
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
                onClick={() => handleCategoryChange(category.id)}
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
                {featuredProducts.slice(0, 4).map((product, index) => (
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
              {searchQuery ? `Search Results (${totalProducts})` : 'All Products'}
            </h2>
            <div className="flex items-center gap-2 text-warm-gray font-body text-sm">
              <Filter className="w-4 h-4" />
              <span>{totalProducts} items</span>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    delay={index * 0.03}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-white/10 text-warm-gray hover:text-warm-white hover:border-gold/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg font-body text-sm transition-colors ${
                            currentPage === pageNum
                              ? 'bg-gold text-dark-base'
                              : 'border border-white/10 text-warm-gray hover:text-warm-white hover:border-gold/50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-white/10 text-warm-gray hover:text-warm-white hover:border-gold/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
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
  product: Product;
  onAddToCart: (productId: string) => void;
  delay: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, delay }) => {
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const originalPrice = product.originalPrice
    ? (typeof product.originalPrice === 'string' ? parseFloat(product.originalPrice) : product.originalPrice)
    : null;
  const rating = typeof product.rating === 'string' ? parseFloat(product.rating) : product.rating;

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
        {originalPrice && (
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
            <span className="text-sm text-warm-white font-body">{rating.toFixed(1)}</span>
          </div>
          <span className="text-warm-gray text-sm font-body">({product.reviewCount})</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gold font-display text-xl">${price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-warm-gray line-through text-sm font-body">${originalPrice.toFixed(2)}</span>
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