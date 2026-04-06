import 'dotenv/config';
import bcrypt from 'bcrypt';
import { db } from '../connection.js';
import { roles, permissions, rolePermissions, users, userRoles } from '../../../features/auth/models/index.js';
import { categories, products } from '../../../features/product/models/index.js';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Starting seed...');

  console.log('🧹 Clearing existing data...');
  await db.delete(userRoles);
  await db.delete(rolePermissions);
  await db.delete(products);
  await db.delete(categories);
  await db.delete(users);
  await db.delete(permissions);
  await db.delete(roles);

  const rolesData = [
    { name: 'Admin', slug: 'admin', description: 'Full system access' },
    { name: 'Seller', slug: 'seller', description: 'Product seller/vendor' },
    { name: 'Customer', slug: 'customer', description: 'End user/customer' },
    { name: 'Delivery', slug: 'delivery', description: 'Handles order fulfillment' },
    { name: 'Customer Support', slug: 'support', description: 'Customer support agent' },
  ];

  console.log('📝 Inserting roles...');
  const insertedRoles = await db.insert(roles).values(rolesData).returning();
  console.log(`✅ Inserted ${insertedRoles.length} roles`);

  const permissionsData = [
    { name: 'Create Users', slug: 'users.create' },
    { name: 'Read Users', slug: 'users.read' },
    { name: 'Update Users', slug: 'users.update' },
    { name: 'Delete Users', slug: 'users.delete' },
    { name: 'Create Products', slug: 'products.create' },
    { name: 'Read Products', slug: 'products.read' },
    { name: 'Update Products', slug: 'products.update' },
    { name: 'Delete Products', slug: 'products.delete' },
    { name: 'Create Orders', slug: 'orders.create' },
    { name: 'Read Orders', slug: 'orders.read' },
    { name: 'Update Orders', slug: 'orders.update' },
    { name: 'Delete Orders', slug: 'orders.delete' },
    { name: 'Create Deliveries', slug: 'deliveries.create' },
    { name: 'Request Deliveries', slug: 'deliveries.request' },
    { name: 'Read Deliveries', slug: 'deliveries.read' },
    { name: 'Update Deliveries', slug: 'deliveries.update' },
    { name: 'Create Payments', slug: 'payments.create' },
    { name: 'Read Payments', slug: 'payments.read' },
    { name: 'Refund Payments', slug: 'payments.refund' },
    { name: 'Create Reviews', slug: 'reviews.create' },
    { name: 'Read Reviews', slug: 'reviews.read' },
    { name: 'Update Reviews', slug: 'reviews.update' },
    { name: 'Delete Reviews', slug: 'reviews.delete' },
    { name: 'Create Categories', slug: 'categories.create' },
    { name: 'Read Categories', slug: 'categories.read' },
    { name: 'Update Categories', slug: 'categories.update' },
    { name: 'Delete Categories', slug: 'categories.delete' },
    { name: 'Create Coupons', slug: 'coupons.create' },
    { name: 'Read Coupons', slug: 'coupons.read' },
    { name: 'Update Coupons', slug: 'coupons.update' },
    { name: 'Delete Coupons', slug: 'coupons.delete' },
    { name: 'Read Notifications', slug: 'notifications.read' },
    { name: 'Update Notifications', slug: 'notifications.update' },
    { name: 'Delete Notifications', slug: 'notifications.delete' },
    { name: 'Read Analytics', slug: 'analytics.read' },
    { name: 'Create Tickets', slug: 'tickets.create' },
    { name: 'Read Tickets', slug: 'tickets.read' },
    { name: 'Update Tickets', slug: 'tickets.update' },
    { name: 'Delete Tickets', slug: 'tickets.delete' },
    { name: 'Manage Roles', slug: 'roles.manage' },
    { name: 'Manage Permissions', slug: 'permissions.manage' },
  ];

  console.log('📝 Inserting permissions...');
  const insertedPermissions = await db.insert(permissions).values(permissionsData).returning();
  console.log(`✅ Inserted ${insertedPermissions.length} permissions`);

  const permissionMap = new Map(insertedPermissions.map(p => [p.slug, p.id]));
  const perm = (slug: string) => permissionMap.get(slug)!;

  const rolePermMappings: Array<{ roleId: string; permissionId: string }> = [];

  const adminRole = insertedRoles.find(r => r.slug === 'admin')!;
  for (const permission of insertedPermissions) {
    rolePermMappings.push({ roleId: adminRole.id, permissionId: permission.id });
  }

  const sellerRole = insertedRoles.find(r => r.slug === 'seller')!;
  rolePermMappings.push(
    { roleId: sellerRole.id, permissionId: perm('users.read') },
    { roleId: sellerRole.id, permissionId: perm('users.update') },
    { roleId: sellerRole.id, permissionId: perm('products.create') },
    { roleId: sellerRole.id, permissionId: perm('products.read') },
    { roleId: sellerRole.id, permissionId: perm('products.update') },
    { roleId: sellerRole.id, permissionId: perm('products.delete') },
    { roleId: sellerRole.id, permissionId: perm('orders.read') },
    { roleId: sellerRole.id, permissionId: perm('deliveries.request') },
    { roleId: sellerRole.id, permissionId: perm('deliveries.read') },
    { roleId: sellerRole.id, permissionId: perm('payments.read') },
    { roleId: sellerRole.id, permissionId: perm('reviews.read') },
    { roleId: sellerRole.id, permissionId: perm('categories.read') },
    { roleId: sellerRole.id, permissionId: perm('coupons.create') },
    { roleId: sellerRole.id, permissionId: perm('coupons.read') },
    { roleId: sellerRole.id, permissionId: perm('coupons.update') },
    { roleId: sellerRole.id, permissionId: perm('coupons.delete') },
    { roleId: sellerRole.id, permissionId: perm('notifications.read') },
    { roleId: sellerRole.id, permissionId: perm('notifications.update') },
    { roleId: sellerRole.id, permissionId: perm('notifications.delete') },
    { roleId: sellerRole.id, permissionId: perm('analytics.read') },
    { roleId: sellerRole.id, permissionId: perm('tickets.create') },
    { roleId: sellerRole.id, permissionId: perm('tickets.read') },
  );

  const customerRole = insertedRoles.find(r => r.slug === 'customer')!;
  rolePermMappings.push(
    { roleId: customerRole.id, permissionId: perm('users.read') },
    { roleId: customerRole.id, permissionId: perm('users.update') },
    { roleId: customerRole.id, permissionId: perm('products.read') },
    { roleId: customerRole.id, permissionId: perm('orders.create') },
    { roleId: customerRole.id, permissionId: perm('orders.read') },
    { roleId: customerRole.id, permissionId: perm('deliveries.read') },
    { roleId: customerRole.id, permissionId: perm('payments.create') },
    { roleId: customerRole.id, permissionId: perm('payments.read') },
    { roleId: customerRole.id, permissionId: perm('reviews.create') },
    { roleId: customerRole.id, permissionId: perm('reviews.read') },
    { roleId: customerRole.id, permissionId: perm('reviews.update') },
    { roleId: customerRole.id, permissionId: perm('reviews.delete') },
    { roleId: customerRole.id, permissionId: perm('categories.read') },
    { roleId: customerRole.id, permissionId: perm('coupons.read') },
    { roleId: customerRole.id, permissionId: perm('notifications.read') },
    { roleId: customerRole.id, permissionId: perm('notifications.update') },
    { roleId: customerRole.id, permissionId: perm('notifications.delete') },
    { roleId: customerRole.id, permissionId: perm('tickets.create') },
    { roleId: customerRole.id, permissionId: perm('tickets.read') },
  );

  const deliveryRole = insertedRoles.find(r => r.slug === 'delivery')!;
  rolePermMappings.push(
    { roleId: deliveryRole.id, permissionId: perm('users.read') },
    { roleId: deliveryRole.id, permissionId: perm('products.read') },
    { roleId: deliveryRole.id, permissionId: perm('orders.read') },
    { roleId: deliveryRole.id, permissionId: perm('orders.update') },
    { roleId: deliveryRole.id, permissionId: perm('deliveries.read') },
    { roleId: deliveryRole.id, permissionId: perm('deliveries.update') },
    { roleId: deliveryRole.id, permissionId: perm('reviews.read') },
    { roleId: deliveryRole.id, permissionId: perm('categories.read') },
    { roleId: deliveryRole.id, permissionId: perm('notifications.read') },
    { roleId: deliveryRole.id, permissionId: perm('notifications.update') },
    { roleId: deliveryRole.id, permissionId: perm('notifications.delete') },
  );

  const supportRole = insertedRoles.find(r => r.slug === 'support')!;
  rolePermMappings.push(
    { roleId: supportRole.id, permissionId: perm('users.create') },
    { roleId: supportRole.id, permissionId: perm('users.read') },
    { roleId: supportRole.id, permissionId: perm('users.update') },
    { roleId: supportRole.id, permissionId: perm('products.read') },
    { roleId: supportRole.id, permissionId: perm('orders.read') },
    { roleId: supportRole.id, permissionId: perm('orders.update') },
    { roleId: supportRole.id, permissionId: perm('deliveries.read') },
    { roleId: supportRole.id, permissionId: perm('deliveries.update') },
    { roleId: supportRole.id, permissionId: perm('payments.read') },
    { roleId: supportRole.id, permissionId: perm('payments.refund') },
    { roleId: supportRole.id, permissionId: perm('reviews.read') },
    { roleId: supportRole.id, permissionId: perm('categories.read') },
    { roleId: supportRole.id, permissionId: perm('notifications.read') },
    { roleId: supportRole.id, permissionId: perm('notifications.update') },
    { roleId: supportRole.id, permissionId: perm('notifications.delete') },
    { roleId: supportRole.id, permissionId: perm('analytics.read') },
    { roleId: supportRole.id, permissionId: perm('tickets.create') },
    { roleId: supportRole.id, permissionId: perm('tickets.read') },
    { roleId: supportRole.id, permissionId: perm('tickets.update') },
    { roleId: supportRole.id, permissionId: perm('tickets.delete') },
  );

  console.log('📝 Inserting role-permission mappings...');
  await db.insert(rolePermissions).values(rolePermMappings);
  console.log(`✅ Inserted ${rolePermMappings.length} role-permission mappings`);

  console.log('👤 Seeding admin user...');
  const adminPassword = await bcrypt.hash('admin321#', 10);
  const [adminUser] = await db.insert(users).values({
    name: 'System Admin',
    email: 'admin@gmail.com',
    password: adminPassword,
    isActive: true
  }).returning();
  console.log(`✅ Created admin user: ${adminUser.email}`);

  await db.insert(userRoles).values({
    userId: adminUser.id,
    roleId: adminRole.id
  });
  console.log(`✅ Assigned admin role to admin user`);

  console.log('📁 Seeding categories...');
  const categoryData = [
    { name: 'Electronics', slug: 'electronics', description: 'Gadgets and devices', isActive: true },
    { name: 'Clothing', slug: 'clothing', description: 'Apparel and fashion', isActive: true },
    { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Home essentials', isActive: true },
    { name: 'Books', slug: 'books', description: 'Books and literature', isActive: true },
  ];
  const insertedCategories = await db.insert(categories).values(categoryData).returning();
  console.log(`✅ Inserted ${insertedCategories.length} categories`);

  console.log('👤 Creating demo seller user...');
  const sellerPassword = await bcrypt.hash('seller123#', 10);
  const [sellerUser] = await db.insert(users).values({
    name: 'Demo Seller',
    email: 'seller@demo.com',
    password: sellerPassword,
    isActive: true,
  }).returning();
  console.log(`✅ Created seller user: ${sellerUser.email}`);

  await db.insert(userRoles).values({
    userId: sellerUser.id,
    roleId: sellerRole.id,
  });
  console.log(`✅ Assigned seller role`);

  console.log('📦 Seeding products...');
  const electronicsCat = insertedCategories.find(c => c.slug === 'electronics')!;
  const clothingCat = insertedCategories.find(c => c.slug === 'clothing')!;
  const homeCat = insertedCategories.find(c => c.slug === 'home-kitchen')!;
  const booksCat = insertedCategories.find(c => c.slug === 'books')!;

  const productData = [
    {
      name: 'Wireless Noise-Canceling Headphones',
      description: 'Premium over-ear headphones with industry-leading noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for travel, work, or immersive listening.',
      price: '349.99',
      originalPrice: '399.99',
      categoryId: electronicsCat.id,
      sellerId: sellerUser.id,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop'],
      stock: 25,
      rating: '4.8',
      reviewCount: 128,
      tags: ['wireless', 'audio', 'premium'],
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Minimalist Smart Watch',
      description: 'Elegant smartwatch with health tracking, notifications, and 7-day battery life. Features a stunning AMOLED display and premium aluminum finish.',
      price: '299.99',
      originalPrice: null,
      categoryId: electronicsCat.id,
      sellerId: sellerUser.id,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop'],
      stock: 18,
      rating: '4.6',
      reviewCount: 89,
      tags: ['smartwatch', 'fitness', 'tech'],
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Portable Bluetooth Speaker',
      description: 'Waterproof speaker with 360-degree sound, 20-hour playtime, and deep bass. Perfect for outdoor adventures and pool parties.',
      price: '129.99',
      originalPrice: '159.99',
      categoryId: electronicsCat.id,
      sellerId: sellerUser.id,
      images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop'],
      stock: 42,
      rating: '4.5',
      reviewCount: 215,
      tags: ['bluetooth', 'portable', 'waterproof'],
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Premium Leather Crossbody Bag',
      description: 'Handcrafted genuine leather crossbody bag with multiple compartments. Features adjustable strap and gold hardware accents.',
      price: '189.99',
      originalPrice: null,
      categoryId: clothingCat.id,
      sellerId: sellerUser.id,
      images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop'],
      stock: 15,
      rating: '4.7',
      reviewCount: 76,
      tags: ['leather', 'fashion', 'bag'],
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Non-Stick Ceramic Cookware Set',
      description: '10-piece cookware set with ceramic non-stick coating. Includes frying pans, saucepans, and lids. Oven safe to 500°F.',
      price: '249.99',
      originalPrice: '299.99',
      categoryId: homeCat.id,
      sellerId: sellerUser.id,
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop'],
      stock: 30,
      rating: '4.4',
      reviewCount: 203,
      tags: ['cookware', 'kitchen', 'nonstick'],
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'The Art of Programming',
      description: 'A comprehensive guide to modern software development practices, design patterns, and clean code principles.',
      price: '49.99',
      originalPrice: null,
      categoryId: booksCat.id,
      sellerId: sellerUser.id,
      images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop'],
      stock: 100,
      rating: '4.9',
      reviewCount: 342,
      tags: ['programming', 'development', 'software'],
      isActive: true,
      isFeatured: false,
    },
  ];

  const insertedProducts = await db.insert(products).values(productData).returning();
  console.log(`✅ Inserted ${insertedProducts.length} products`);

  console.log('🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Roles: ${insertedRoles.length}`);
  console.log(`   - Permissions: ${insertedPermissions.length}`);
  console.log(`   - Role-Permission Mappings: ${rolePermMappings.length}`);
  console.log(`   - Admin User: ${adminUser.email}`);
  console.log(`   - Seller User: ${sellerUser.email}`);
  console.log(`   - Categories: ${insertedCategories.length}`);
  console.log(`   - Products: ${insertedProducts.length}`);
  console.log('\n👥 Roles:');
  for (const role of insertedRoles) {
    console.log(`   - ${role.name} (${role.slug})`);
  }
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
