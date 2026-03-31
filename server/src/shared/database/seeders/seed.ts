import 'dotenv/config';
import bcrypt from 'bcrypt';
import { db } from '../connection.js';
import { roles, permissions, rolePermissions, users, userRoles } from '../../../features/auth/models/index.js';

async function seed() {
  console.log('🌱 Starting seed...');

  // Clear existing data (order matters due to foreign keys)
  console.log('🧹 Clearing existing data...');
  await db.delete(userRoles);
  await db.delete(rolePermissions);
  await db.delete(users);
  await db.delete(roles);
  await db.delete(permissions);

  // Define roles
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

  // Define permissions
  const permissionsData = [
    // Users
    { name: 'Create Users', slug: 'users.create' },
    { name: 'Read Users', slug: 'users.read' },
    { name: 'Update Users', slug: 'users.update' },
    { name: 'Delete Users', slug: 'users.delete' },
    // Products
    { name: 'Create Products', slug: 'products.create' },
    { name: 'Read Products', slug: 'products.read' },
    { name: 'Update Products', slug: 'products.update' },
    { name: 'Delete Products', slug: 'products.delete' },
    // Orders
    { name: 'Create Orders', slug: 'orders.create' },
    { name: 'Read Orders', slug: 'orders.read' },
    { name: 'Update Orders', slug: 'orders.update' },
    { name: 'Delete Orders', slug: 'orders.delete' },
    // Deliveries
    { name: 'Create Deliveries', slug: 'deliveries.create' },
    { name: 'Request Deliveries', slug: 'deliveries.request' },
    { name: 'Read Deliveries', slug: 'deliveries.read' },
    { name: 'Update Deliveries', slug: 'deliveries.update' },
    // Payments
    { name: 'Create Payments', slug: 'payments.create' },
    { name: 'Read Payments', slug: 'payments.read' },
    { name: 'Refund Payments', slug: 'payments.refund' },
    // Reviews
    { name: 'Create Reviews', slug: 'reviews.create' },
    { name: 'Read Reviews', slug: 'reviews.read' },
    { name: 'Update Reviews', slug: 'reviews.update' },
    { name: 'Delete Reviews', slug: 'reviews.delete' },
    // Categories
    { name: 'Create Categories', slug: 'categories.create' },
    { name: 'Read Categories', slug: 'categories.read' },
    { name: 'Update Categories', slug: 'categories.update' },
    { name: 'Delete Categories', slug: 'categories.delete' },
    // Coupons
    { name: 'Create Coupons', slug: 'coupons.create' },
    { name: 'Read Coupons', slug: 'coupons.read' },
    { name: 'Update Coupons', slug: 'coupons.update' },
    { name: 'Delete Coupons', slug: 'coupons.delete' },
    // Notifications
    { name: 'Read Notifications', slug: 'notifications.read' },
    { name: 'Update Notifications', slug: 'notifications.update' },
    { name: 'Delete Notifications', slug: 'notifications.delete' },
    // Analytics
    { name: 'Read Analytics', slug: 'analytics.read' },
    // Support Tickets
    { name: 'Create Tickets', slug: 'tickets.create' },
    { name: 'Read Tickets', slug: 'tickets.read' },
    { name: 'Update Tickets', slug: 'tickets.update' },
    { name: 'Delete Tickets', slug: 'tickets.delete' },
    // System
    { name: 'Manage Roles', slug: 'roles.manage' },
    { name: 'Manage Permissions', slug: 'permissions.manage' },
  ];

  console.log('📝 Inserting permissions...');
  const insertedPermissions = await db.insert(permissions).values(permissionsData).returning();
  console.log(`✅ Inserted ${insertedPermissions.length} permissions`);

  // Create permission slug to id map
  const permissionMap = new Map(insertedPermissions.map(p => [p.slug, p.id]));

  // Helper to get permission IDs
  const perm = (slug: string) => permissionMap.get(slug)!;

  // Define role-permission mappings based on RBAC matrix
  const rolePermMappings: Array<{ roleId: string; permissionId: string }> = [];

  // Admin - all permissions
  const adminRole = insertedRoles.find(r => r.slug === 'admin')!;
  for (const permission of insertedPermissions) {
    rolePermMappings.push({ roleId: adminRole.id, permissionId: permission.id });
  }

  // Seller
  const sellerRole = insertedRoles.find(r => r.slug === 'seller')!;
  rolePermMappings.push(
    // Users
    { roleId: sellerRole.id, permissionId: perm('users.read') },
    { roleId: sellerRole.id, permissionId: perm('users.update') },
    // Products
    { roleId: sellerRole.id, permissionId: perm('products.create') },
    { roleId: sellerRole.id, permissionId: perm('products.read') },
    { roleId: sellerRole.id, permissionId: perm('products.update') },
    { roleId: sellerRole.id, permissionId: perm('products.delete') },
    // Orders
    { roleId: sellerRole.id, permissionId: perm('orders.read') },
    // Deliveries
    { roleId: sellerRole.id, permissionId: perm('deliveries.request') },
    { roleId: sellerRole.id, permissionId: perm('deliveries.read') },
    // Payments
    { roleId: sellerRole.id, permissionId: perm('payments.read') },
    // Reviews
    { roleId: sellerRole.id, permissionId: perm('reviews.read') },
    // Categories
    { roleId: sellerRole.id, permissionId: perm('categories.read') },
    // Coupons
    { roleId: sellerRole.id, permissionId: perm('coupons.create') },
    { roleId: sellerRole.id, permissionId: perm('coupons.read') },
    { roleId: sellerRole.id, permissionId: perm('coupons.update') },
    { roleId: sellerRole.id, permissionId: perm('coupons.delete') },
    // Notifications
    { roleId: sellerRole.id, permissionId: perm('notifications.read') },
    { roleId: sellerRole.id, permissionId: perm('notifications.update') },
    { roleId: sellerRole.id, permissionId: perm('notifications.delete') },
    // Analytics
    { roleId: sellerRole.id, permissionId: perm('analytics.read') },
    // Tickets
    { roleId: sellerRole.id, permissionId: perm('tickets.create') },
    { roleId: sellerRole.id, permissionId: perm('tickets.read') },
  );

  // Customer
  const customerRole = insertedRoles.find(r => r.slug === 'customer')!;
  rolePermMappings.push(
    // Users
    { roleId: customerRole.id, permissionId: perm('users.read') },
    { roleId: customerRole.id, permissionId: perm('users.update') },
    // Products
    { roleId: customerRole.id, permissionId: perm('products.read') },
    // Orders
    { roleId: customerRole.id, permissionId: perm('orders.create') },
    { roleId: customerRole.id, permissionId: perm('orders.read') },
    // Deliveries
    { roleId: customerRole.id, permissionId: perm('deliveries.read') },
    // Payments
    { roleId: customerRole.id, permissionId: perm('payments.create') },
    { roleId: customerRole.id, permissionId: perm('payments.read') },
    // Reviews
    { roleId: customerRole.id, permissionId: perm('reviews.create') },
    { roleId: customerRole.id, permissionId: perm('reviews.read') },
    { roleId: customerRole.id, permissionId: perm('reviews.update') },
    { roleId: customerRole.id, permissionId: perm('reviews.delete') },
    // Categories
    { roleId: customerRole.id, permissionId: perm('categories.read') },
    // Coupons
    { roleId: customerRole.id, permissionId: perm('coupons.read') },
    // Notifications
    { roleId: customerRole.id, permissionId: perm('notifications.read') },
    { roleId: customerRole.id, permissionId: perm('notifications.update') },
    { roleId: customerRole.id, permissionId: perm('notifications.delete') },
    // Tickets
    { roleId: customerRole.id, permissionId: perm('tickets.create') },
    { roleId: customerRole.id, permissionId: perm('tickets.read') },
  );

  // Delivery
  const deliveryRole = insertedRoles.find(r => r.slug === 'delivery')!;
  rolePermMappings.push(
    // Users
    { roleId: deliveryRole.id, permissionId: perm('users.read') },
    // Products
    { roleId: deliveryRole.id, permissionId: perm('products.read') },
    // Orders
    { roleId: deliveryRole.id, permissionId: perm('orders.read') },
    { roleId: deliveryRole.id, permissionId: perm('orders.update') },
    // Deliveries
    { roleId: deliveryRole.id, permissionId: perm('deliveries.read') },
    { roleId: deliveryRole.id, permissionId: perm('deliveries.update') },
    // Reviews
    { roleId: deliveryRole.id, permissionId: perm('reviews.read') },
    // Categories
    { roleId: deliveryRole.id, permissionId: perm('categories.read') },
    // Notifications
    { roleId: deliveryRole.id, permissionId: perm('notifications.read') },
    { roleId: deliveryRole.id, permissionId: perm('notifications.update') },
    { roleId: deliveryRole.id, permissionId: perm('notifications.delete') },
  );

  // Support (CS Agent)
  const supportRole = insertedRoles.find(r => r.slug === 'support')!;
  rolePermMappings.push(
    // Users
    { roleId: supportRole.id, permissionId: perm('users.create') },
    { roleId: supportRole.id, permissionId: perm('users.read') },
    { roleId: supportRole.id, permissionId: perm('users.update') },
    // Products
    { roleId: supportRole.id, permissionId: perm('products.read') },
    // Orders
    { roleId: supportRole.id, permissionId: perm('orders.read') },
    { roleId: supportRole.id, permissionId: perm('orders.update') },
    // Deliveries
    { roleId: supportRole.id, permissionId: perm('deliveries.read') },
    { roleId: supportRole.id, permissionId: perm('deliveries.update') },
    // Payments
    { roleId: supportRole.id, permissionId: perm('payments.read') },
    { roleId: supportRole.id, permissionId: perm('payments.refund') },
    // Reviews
    { roleId: supportRole.id, permissionId: perm('reviews.read') },
    // Categories
    { roleId: supportRole.id, permissionId: perm('categories.read') },
    // Notifications
    { roleId: supportRole.id, permissionId: perm('notifications.read') },
    { roleId: supportRole.id, permissionId: perm('notifications.update') },
    { roleId: supportRole.id, permissionId: perm('notifications.delete') },
    // Analytics
    { roleId: supportRole.id, permissionId: perm('analytics.read') },
    // Tickets
    { roleId: supportRole.id, permissionId: perm('tickets.create') },
    { roleId: supportRole.id, permissionId: perm('tickets.read') },
    { roleId: supportRole.id, permissionId: perm('tickets.update') },
    { roleId: supportRole.id, permissionId: perm('tickets.delete') },
  );

  console.log('📝 Inserting role-permission mappings...');
  await db.insert(rolePermissions).values(rolePermMappings);
  console.log(`✅ Inserted ${rolePermMappings.length} role-permission mappings`);

  // Seed admin user
  console.log('👤 Seeding admin user...');
  const adminPassword = await bcrypt.hash('admin321#', 10);
  const [adminUser] = await db.insert(users).values({
    name: 'System Admin',
    email: 'admin@gmail.com',
    password: adminPassword,
    isActive: true
  }).returning();
  console.log(`✅ Created admin user: ${adminUser.email}`);

  // Assign admin role to admin user
  const [adminUserRole] = await db.insert(userRoles).values({
    userId: adminUser.id,
    roleId: adminRole.id
  }).returning();
  console.log(`✅ Assigned admin role to admin user`);

  console.log('🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Roles: ${insertedRoles.length}`);
  console.log(`   - Permissions: ${insertedPermissions.length}`);
  console.log(`   - Role-Permission Mappings: ${rolePermMappings.length}`);
  console.log(`   - Admin User: ${adminUser.email}`);
  console.log('\n👥 Roles:');
  for (const role of insertedRoles) {
    console.log(`   - ${role.name} (${role.slug})`);
  }
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
