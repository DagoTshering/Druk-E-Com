// ============================================================================
// LUXEMARKET - DATA STORE
// ============================================================================
// All dummy data for the multi-role e-commerce application
// ============================================================================

export type UserRole = 'customer' | 'seller' | 'admin' | 'delivery' | 'support';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type DeliveryStatus = 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'escalated';

// ============================================================================
// USERS
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  isActive: boolean;
  joinedAt: string;
  phone?: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export const users: User[] = [
  {
    id: 'u1',
    name: 'Alexandra Chen',
    email: 'alex.chen@email.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    role: 'customer',
    isActive: true,
    joinedAt: '2024-01-15',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Maple Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'USA'
    }
  },
  {
    id: 'u2',
    name: 'Marcus Johnson',
    email: 'marcus.j@email.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    role: 'customer',
    isActive: true,
    joinedAt: '2024-02-20',
    phone: '+1 (555) 234-5678',
    address: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'USA'
    }
  },
  {
    id: 'u3',
    name: 'Sophia Williams',
    email: 'sophia.w@luxeboutique.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    role: 'seller',
    isActive: true,
    joinedAt: '2023-11-10',
    phone: '+1 (555) 345-6789'
  },
  {
    id: 'u4',
    name: 'David Park',
    email: 'david.p@techgear.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    role: 'seller',
    isActive: true,
    joinedAt: '2023-12-05',
    phone: '+1 (555) 456-7890'
  },
  {
    id: 'u5',
    name: 'Admin User',
    email: 'admin@druke.com',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop',
    role: 'admin',
    isActive: true,
    joinedAt: '2023-01-01',
    phone: '+1 (555) 000-0000'
  },
  {
    id: 'u6',
    name: 'James Rodriguez',
    email: 'james.r@delivery.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    role: 'delivery',
    isActive: true,
    joinedAt: '2024-01-20',
    phone: '+1 (555) 567-8901'
  },
  {
    id: 'u7',
    name: 'Emily Thompson',
    email: 'emily.t@support.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    role: 'support',
    isActive: true,
    joinedAt: '2024-02-01',
    phone: '+1 (555) 678-9012'
  }
];

// ============================================================================
// CATEGORIES
// ============================================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    id: 'cat1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and tech accessories',
    image: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=400&h=300&fit=crop',
    productCount: 4
  },
  {
    id: 'cat2',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Premium fashion and apparel',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
    productCount: 3
  },
  {
    id: 'cat3',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Elegant home essentials',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop',
    productCount: 3
  },
  {
    id: 'cat4',
    name: 'Books',
    slug: 'books',
    description: 'Curated collection of bestsellers',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop',
    productCount: 2
  }
];

// ============================================================================
// PRODUCTS
// ============================================================================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  categoryId: string;
  sellerId: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  tags: string[];
}

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Premium over-ear headphones with industry-leading noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for travel, work, or immersive listening.',
    price: 349.99,
    originalPrice: 399.99,
    category: 'Electronics',
    categoryId: 'cat1',
    sellerId: 'u4',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop'
    ],
    stock: 25,
    rating: 4.8,
    reviewCount: 128,
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-10',
    tags: ['wireless', 'audio', 'premium']
  },
  {
    id: 'p2',
    name: 'Minimalist Smart Watch',
    description: 'Elegant smartwatch with health tracking, notifications, and 7-day battery life. Features a stunning AMOLED display and premium aluminum finish.',
    price: 299.99,
    category: 'Electronics',
    categoryId: 'cat1',
    sellerId: 'u4',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop'
    ],
    stock: 18,
    rating: 4.6,
    reviewCount: 89,
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-15',
    tags: ['smartwatch', 'fitness', 'tech']
  },
  {
    id: 'p3',
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof speaker with 360-degree sound, 20-hour playtime, and deep bass. Perfect for outdoor adventures and pool parties.',
    price: 129.99,
    originalPrice: 159.99,
    category: 'Electronics',
    categoryId: 'cat1',
    sellerId: 'u4',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop'
    ],
    stock: 42,
    rating: 4.5,
    reviewCount: 215,
    isActive: true,
    isFeatured: false,
    createdAt: '2024-02-01',
    tags: ['speaker', 'bluetooth', 'outdoor']
  },
  {
    id: 'p4',
    name: '4K Webcam Pro',
    description: 'Professional-grade webcam with 4K resolution, auto-focus, and noise-reducing microphones. Ideal for streaming and video conferencing.',
    price: 199.99,
    category: 'Electronics',
    categoryId: 'cat1',
    sellerId: 'u4',
    images: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop'
    ],
    stock: 15,
    rating: 4.7,
    reviewCount: 67,
    isActive: true,
    isFeatured: false,
    createdAt: '2024-02-10',
    tags: ['webcam', 'streaming', 'work-from-home']
  },
  {
    id: 'p5',
    name: 'Cashmere Blend Sweater',
    description: 'Luxuriously soft cashmere blend sweater in a timeless design. Features ribbed cuffs and hem for a perfect fit.',
    price: 189.99,
    originalPrice: 249.99,
    category: 'Clothing',
    categoryId: 'cat2',
    sellerId: 'u3',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop'
    ],
    stock: 30,
    rating: 4.9,
    reviewCount: 156,
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-05',
    tags: ['cashmere', 'sweater', 'winter']
  },
  {
    id: 'p6',
    name: 'Italian Leather Jacket',
    description: 'Handcrafted genuine leather jacket with premium hardware. A statement piece that ages beautifully over time.',
    price: 599.99,
    category: 'Clothing',
    categoryId: 'cat2',
    sellerId: 'u3',
    images: [
      'https://images.unsplash.com/photo-1551028919-ac76c9028d1e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=600&h=600&fit=crop'
    ],
    stock: 12,
    rating: 4.8,
    reviewCount: 43,
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-20',
    tags: ['leather', 'jacket', 'premium']
  },
  {
    id: 'p7',
    name: 'Designer Silk Scarf',
    description: 'Elegant silk scarf with exclusive hand-drawn print. Perfect for adding a touch of sophistication to any outfit.',
    price: 129.99,
    category: 'Clothing',
    categoryId: 'cat2',
    sellerId: 'u3',
    images: [
      'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa33?w=600&h=600&fit=crop'
    ],
    stock: 50,
    rating: 4.6,
    reviewCount: 78,
    isActive: true,
    isFeatured: false,
    createdAt: '2024-02-15',
    tags: ['silk', 'accessory', 'fashion']
  },
  {
    id: 'p8',
    name: 'Ceramic Coffee Pour-Over Set',
    description: 'Artisanal ceramic pour-over coffee set including dripper, carafe, and filters. Brew the perfect cup every time.',
    price: 89.99,
    category: 'Home & Kitchen',
    categoryId: 'cat3',
    sellerId: 'u3',
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop'
    ],
    stock: 35,
    rating: 4.7,
    reviewCount: 112,
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-25',
    tags: ['coffee', 'kitchen', 'ceramic']
  },
  {
    id: 'p9',
    name: 'Scented Candle Collection',
    description: 'Set of 3 hand-poured soy candles in elegant glass vessels. Features notes of sandalwood, vanilla, and cedar.',
    price: 69.99,
    originalPrice: 89.99,
    category: 'Home & Kitchen',
    categoryId: 'cat3',
    sellerId: 'u3',
    images: [
      'https://images.unsplash.com/photo-1602607688655-1c2a471a7e3a?w=600&h=600&fit=crop'
    ],
    stock: 60,
    rating: 4.8,
    reviewCount: 203,
    isActive: true,
    isFeatured: false,
    createdAt: '2024-02-05',
    tags: ['candles', 'home', 'fragrance']
  },
  {
    id: 'p10',
    name: 'Marble Cutting Board',
    description: 'Elegant white marble cutting board with gold accents. Perfect for serving cheese or as a decorative piece.',
    price: 79.99,
    category: 'Home & Kitchen',
    categoryId: 'cat3',
    sellerId: 'u3',
    images: [
      'https://images.unsplash.com/photo-1615486511484-92e172cc416d?w=600&h=600&fit=crop'
    ],
    stock: 22,
    rating: 4.5,
    reviewCount: 56,
    isActive: true,
    isFeatured: false,
    createdAt: '2024-02-20',
    tags: ['marble', 'kitchen', 'serving']
  },
  {
    id: 'p11',
    name: 'The Art of Minimalism',
    description: 'A comprehensive guide to minimalist living. Learn to declutter your space and mind for a more fulfilling life.',
    price: 24.99,
    category: 'Books',
    categoryId: 'cat4',
    sellerId: 'u4',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop'
    ],
    stock: 100,
    rating: 4.6,
    reviewCount: 312,
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-08',
    tags: ['minimalism', 'self-help', 'lifestyle']
  },
  {
    id: 'p12',
    name: 'Culinary Masterclass',
    description: 'Learn the secrets of world-renowned chefs. Includes 50 recipes and step-by-step techniques for home cooks.',
    price: 39.99,
    originalPrice: 49.99,
    category: 'Books',
    categoryId: 'cat4',
    sellerId: 'u4',
    images: [
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&h=600&fit=crop'
    ],
    stock: 75,
    rating: 4.9,
    reviewCount: 178,
    isActive: true,
    isFeatured: false,
    createdAt: '2024-01-30',
    tags: ['cooking', 'recipes', 'culinary']
  }
];

// ============================================================================
// REVIEWS
// ============================================================================

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const reviews: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    userId: 'u1',
    userName: 'Alexandra Chen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rating: 5,
    comment: 'Absolutely incredible sound quality! The noise cancellation is top-notch. Best headphones I\'ve ever owned.',
    createdAt: '2024-02-15'
  },
  {
    id: 'r2',
    productId: 'p1',
    userId: 'u2',
    userName: 'Marcus Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 4,
    comment: 'Great headphones, comfortable for long listening sessions. Battery life is impressive.',
    createdAt: '2024-02-20'
  },
  {
    id: 'r3',
    productId: 'p5',
    userId: 'u1',
    userName: 'Alexandra Chen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rating: 5,
    comment: 'So soft and luxurious! The quality is exceptional. Will definitely buy more colors.',
    createdAt: '2024-02-10'
  },
  {
    id: 'r4',
    productId: 'p8',
    userId: 'u2',
    userName: 'Marcus Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 5,
    comment: 'Makes the perfect cup of coffee every morning. Beautiful design too!',
    createdAt: '2024-02-25'
  }
];

// ============================================================================
// ORDERS
// ============================================================================

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
  deliveryId?: string;
}

export const orders: Order[] = [
  {
    id: 'ORD-2024-001',
    customerId: 'u1',
    customerName: 'Alexandra Chen',
    items: [
      { productId: 'p1', productName: 'Wireless Noise-Canceling Headphones', productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop', quantity: 1, price: 349.99 },
      { productId: 'p5', productName: 'Cashmere Blend Sweater', productImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&h=100&fit=crop', quantity: 1, price: 189.99 }
    ],
    subtotal: 539.98,
    tax: 43.20,
    shipping: 0,
    discount: 20,
    total: 563.18,
    status: 'delivered',
    shippingAddress: {
      street: '123 Maple Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'USA'
    },
    createdAt: '2024-03-01',
    updatedAt: '2024-03-05',
    deliveryId: 'd1'
  },
  {
    id: 'ORD-2024-002',
    customerId: 'u2',
    customerName: 'Marcus Johnson',
    items: [
      { productId: 'p2', productName: 'Minimalist Smart Watch', productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop', quantity: 1, price: 299.99 }
    ],
    subtotal: 299.99,
    tax: 24.00,
    shipping: 15,
    discount: 0,
    total: 338.99,
    status: 'shipped',
    shippingAddress: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'USA'
    },
    createdAt: '2024-03-05',
    updatedAt: '2024-03-07',
    deliveryId: 'd2'
  },
  {
    id: 'ORD-2024-003',
    customerId: 'u1',
    customerName: 'Alexandra Chen',
    items: [
      { productId: 'p8', productName: 'Ceramic Coffee Pour-Over Set', productImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&h=100&fit=crop', quantity: 1, price: 89.99 },
      { productId: 'p9', productName: 'Scented Candle Collection', productImage: 'https://images.unsplash.com/photo-1602607688655-1c2a471a7e3a?w=100&h=100&fit=crop', quantity: 2, price: 69.99 }
    ],
    subtotal: 229.97,
    tax: 18.40,
    shipping: 0,
    discount: 10,
    total: 238.37,
    status: 'confirmed',
    shippingAddress: {
      street: '123 Maple Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'USA'
    },
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10'
  },
  {
    id: 'ORD-2024-004',
    customerId: 'u2',
    customerName: 'Marcus Johnson',
    items: [
      { productId: 'p6', productName: 'Italian Leather Jacket', productImage: 'https://images.unsplash.com/photo-1551028919-ac76c9028d1e?w=100&h=100&fit=crop', quantity: 1, price: 599.99 },
      { productId: 'p11', productName: 'The Art of Minimalism', productImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=100&fit=crop', quantity: 1, price: 24.99 }
    ],
    subtotal: 624.98,
    tax: 50.00,
    shipping: 0,
    discount: 0,
    total: 674.98,
    status: 'pending',
    shippingAddress: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'USA'
    },
    createdAt: '2024-03-12',
    updatedAt: '2024-03-12'
  },
  {
    id: 'ORD-2024-005',
    customerId: 'u1',
    customerName: 'Alexandra Chen',
    items: [
      { productId: 'p3', productName: 'Portable Bluetooth Speaker', productImage: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop', quantity: 1, price: 129.99 }
    ],
    subtotal: 129.99,
    tax: 10.40,
    shipping: 10,
    discount: 0,
    total: 150.39,
    status: 'delivered',
    shippingAddress: {
      street: '123 Maple Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'USA'
    },
    createdAt: '2024-02-20',
    updatedAt: '2024-02-24',
    deliveryId: 'd3'
  },
  {
    id: 'ORD-2024-006',
    customerId: 'u2',
    customerName: 'Marcus Johnson',
    items: [
      { productId: 'p12', productName: 'Culinary Masterclass', productImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=100&h=100&fit=crop', quantity: 1, price: 39.99 },
      { productId: 'p7', productName: 'Designer Silk Scarf', productImage: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa33?w=100&h=100&fit=crop', quantity: 1, price: 129.99 }
    ],
    subtotal: 169.98,
    tax: 13.60,
    shipping: 0,
    discount: 15,
    total: 168.58,
    status: 'cancelled',
    shippingAddress: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'USA'
    },
    createdAt: '2024-02-15',
    updatedAt: '2024-02-16'
  },
  {
    id: 'ORD-2024-007',
    customerId: 'u1',
    customerName: 'Alexandra Chen',
    items: [
      { productId: 'p10', productName: 'Marble Cutting Board', productImage: 'https://images.unsplash.com/photo-1615486511484-92e172cc416d?w=100&h=100&fit=crop', quantity: 1, price: 79.99 }
    ],
    subtotal: 79.99,
    tax: 6.40,
    shipping: 10,
    discount: 0,
    total: 96.39,
    status: 'shipped',
    shippingAddress: {
      street: '123 Maple Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'USA'
    },
    createdAt: '2024-03-08',
    updatedAt: '2024-03-09',
    deliveryId: 'd4'
  },
  {
    id: 'ORD-2024-008',
    customerId: 'u2',
    customerName: 'Marcus Johnson',
    items: [
      { productId: 'p4', productName: '4K Webcam Pro', productImage: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&h=100&fit=crop', quantity: 1, price: 199.99 }
    ],
    subtotal: 199.99,
    tax: 16.00,
    shipping: 0,
    discount: 0,
    total: 215.99,
    status: 'confirmed',
    shippingAddress: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'USA'
    },
    createdAt: '2024-03-11',
    updatedAt: '2024-03-11'
  }
];

// ============================================================================
// DELIVERIES
// ============================================================================

export interface Delivery {
  id: string;
  orderId: string;
  deliveryAgentId: string;
  deliveryAgentName: string;
  status: DeliveryStatus;
  pickupAddress: string;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  notes: string;
}

export const deliveries: Delivery[] = [
  {
    id: 'd1',
    orderId: 'ORD-2024-001',
    deliveryAgentId: 'u6',
    deliveryAgentName: 'James Rodriguez',
    status: 'delivered',
    pickupAddress: 'Druk E Com Warehouse, 1000 Commerce St, San Francisco, CA',
    deliveryAddress: '123 Maple Street, San Francisco, CA 94102',
    customerName: 'Alexandra Chen',
    customerPhone: '+1 (555) 123-4567',
    estimatedDelivery: '2024-03-05',
    actualDelivery: '2024-03-05',
    notes: 'Left at front door as requested'
  },
  {
    id: 'd2',
    orderId: 'ORD-2024-002',
    deliveryAgentId: 'u6',
    deliveryAgentName: 'James Rodriguez',
    status: 'in_transit',
    pickupAddress: 'Druk E Com Warehouse, 1000 Commerce St, San Francisco, CA',
    deliveryAddress: '456 Oak Avenue, Los Angeles, CA 90001',
    customerName: 'Marcus Johnson',
    customerPhone: '+1 (555) 234-5678',
    estimatedDelivery: '2024-03-09',
    notes: 'Express delivery'
  },
  {
    id: 'd3',
    orderId: 'ORD-2024-005',
    deliveryAgentId: 'u6',
    deliveryAgentName: 'James Rodriguez',
    status: 'delivered',
    pickupAddress: 'Druk E Com Warehouse, 1000 Commerce St, San Francisco, CA',
    deliveryAddress: '123 Maple Street, San Francisco, CA 94102',
    customerName: 'Alexandra Chen',
    customerPhone: '+1 (555) 123-4567',
    estimatedDelivery: '2024-02-24',
    actualDelivery: '2024-02-24',
    notes: 'Delivered to reception'
  },
  {
    id: 'd4',
    orderId: 'ORD-2024-007',
    deliveryAgentId: 'u6',
    deliveryAgentName: 'James Rodriguez',
    status: 'picked_up',
    pickupAddress: 'Druk E Com Warehouse, 1000 Commerce St, San Francisco, CA',
    deliveryAddress: '123 Maple Street, San Francisco, CA 94102',
    customerName: 'Alexandra Chen',
    customerPhone: '+1 (555) 123-4567',
    estimatedDelivery: '2024-03-12',
    notes: 'Fragile item - handle with care'
  }
];

// ============================================================================
// SUPPORT TICKETS
// ============================================================================

export interface TicketMessage {
  id: string;
  sender: 'customer' | 'agent';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo?: string;
  orderId?: string;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export const tickets: Ticket[] = [
  {
    id: 'TKT-001',
    customerId: 'u1',
    customerName: 'Alexandra Chen',
    customerEmail: 'alex.chen@email.com',
    subject: 'Order not received yet',
    description: 'My order ORD-2024-007 was supposed to arrive yesterday but I haven\'t received it yet.',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'u7',
    orderId: 'ORD-2024-007',
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        senderName: 'Alexandra Chen',
        message: 'My order ORD-2024-007 was supposed to arrive yesterday but I haven\'t received it yet. Can you please check the status?',
        timestamp: '2024-03-13T09:30:00Z'
      },
      {
        id: 'm2',
        sender: 'agent',
        senderName: 'Emily Thompson',
        message: 'Hi Alexandra, I apologize for the delay. I\'m checking with our delivery partner right now and will get back to you within the hour.',
        timestamp: '2024-03-13T09:45:00Z'
      }
    ],
    createdAt: '2024-03-13',
    updatedAt: '2024-03-13'
  },
  {
    id: 'TKT-002',
    customerId: 'u2',
    customerName: 'Marcus Johnson',
    customerEmail: 'marcus.j@email.com',
    subject: 'Product defect - request refund',
    description: 'The smart watch I received has a cracked screen. I would like a refund.',
    priority: 'urgent',
    status: 'open',
    assignedTo: 'u7',
    orderId: 'ORD-2024-002',
    messages: [
      {
        id: 'm3',
        sender: 'customer',
        senderName: 'Marcus Johnson',
        message: 'I just received my Minimalist Smart Watch but the screen is cracked. This is unacceptable for a $300 product. I want a full refund.',
        timestamp: '2024-03-08T14:20:00Z'
      }
    ],
    createdAt: '2024-03-08',
    updatedAt: '2024-03-08'
  },
  {
    id: 'TKT-003',
    customerId: 'u1',
    customerName: 'Alexandra Chen',
    customerEmail: 'alex.chen@email.com',
    subject: 'Question about product care',
    description: 'How should I care for my cashmere sweater?',
    priority: 'low',
    status: 'resolved',
    assignedTo: 'u7',
    messages: [
      {
        id: 'm4',
        sender: 'customer',
        senderName: 'Alexandra Chen',
        message: 'I recently purchased the Cashmere Blend Sweater and I want to make sure I care for it properly. Any tips?',
        timestamp: '2024-02-12T11:00:00Z'
      },
      {
        id: 'm5',
        sender: 'agent',
        senderName: 'Emily Thompson',
        message: 'Hi Alexandra! For cashmere, we recommend hand washing in cold water with a gentle detergent, or dry cleaning. Lay flat to dry and store folded rather than hung. Enjoy your beautiful sweater!',
        timestamp: '2024-02-12T11:30:00Z'
      },
      {
        id: 'm6',
        sender: 'customer',
        senderName: 'Alexandra Chen',
        message: 'Thank you so much for the helpful tips!',
        timestamp: '2024-02-12T12:00:00Z'
      }
    ],
    createdAt: '2024-02-12',
    updatedAt: '2024-02-12'
  }
];

// ============================================================================
// COUPONS
// ============================================================================

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  usageLimit?: number;
  usageCount: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
  description: string;
}

export const coupons: Coupon[] = [
  {
    id: 'c1',
    code: 'WELCOME20',
    discountPercent: 20,
    maxDiscount: 50,
    minOrderAmount: 100,
    usageLimit: 1000,
    usageCount: 342,
    startDate: '2024-01-01',
    expiryDate: '2024-12-31',
    isActive: true,
    description: '20% off your first order'
  },
  {
    id: 'c2',
    code: 'LUXE15',
    discountPercent: 15,
    maxDiscount: 100,
    minOrderAmount: 200,
    usageLimit: 500,
    usageCount: 128,
    startDate: '2024-03-01',
    expiryDate: '2024-06-30',
    isActive: true,
    description: '15% off orders over $200'
  }
];

// ============================================================================
// SELLER PAYOUTS
// ============================================================================

export interface Payout {
  id: string;
  sellerId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed';
  method: 'bank_transfer' | 'paypal';
  requestedAt: string;
  completedAt?: string;
}

export const payouts: Payout[] = [
  {
    id: 'pay-001',
    sellerId: 'u3',
    amount: 2450.00,
    status: 'completed',
    method: 'bank_transfer',
    requestedAt: '2024-02-28',
    completedAt: '2024-03-01'
  },
  {
    id: 'pay-002',
    sellerId: 'u3',
    amount: 1890.50,
    status: 'processing',
    method: 'bank_transfer',
    requestedAt: '2024-03-10'
  },
  {
    id: 'pay-003',
    sellerId: 'u4',
    amount: 3200.00,
    status: 'completed',
    method: 'paypal',
    requestedAt: '2024-02-15',
    completedAt: '2024-02-17'
  }
];

// ============================================================================
// CART (Initial State)
// ============================================================================

export interface CartItem {
  productId: string;
  quantity: number;
}

export const initialCart: CartItem[] = [
  { productId: 'p2', quantity: 1 },
  { productId: 'p7', quantity: 2 }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getUserById = (id: string): User | undefined => {
  return users.find(u => u.id === id);
};

export const getOrdersByCustomer = (customerId: string): Order[] => {
  return orders.filter(o => o.customerId === customerId);
};

export const getProductsBySeller = (sellerId: string): Product[] => {
  return products.filter(p => p.sellerId === sellerId);
};

export const getOrdersBySeller = (sellerId: string): Order[] => {
  const sellerProductIds = products.filter(p => p.sellerId === sellerId).map(p => p.id);
  return orders.filter(o => o.items.some(item => sellerProductIds.includes(item.productId)));
};

export const getReviewsByProduct = (productId: string): Review[] => {
  return reviews.filter(r => r.productId === productId);
};

export const getDeliveriesByAgent = (agentId: string): Delivery[] => {
  return deliveries.filter(d => d.deliveryAgentId === agentId);
};

export const getTicketsByAgent = (agentId: string): Ticket[] => {
  return tickets.filter(t => t.assignedTo === agentId);
};

export const getRelatedProducts = (productId: string, limit: number = 4): Product[] => {
  const product = getProductById(productId);
  if (!product) return [];
  
  return products
    .filter(p => p.category === product.category && p.id !== productId)
    .slice(0, limit);
};
