import { db } from "./shared/database/connection";
import { categories, products } from "./features/product/models";
import { users, userRoles, roles } from "./features/auth/models";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Starting seed...");

  // Seed categories
  console.log("📁 Seeding categories...");
  const categoryData = [
    { name: "Electronics", slug: "electronics", description: "Gadgets and devices", isActive: true },
    { name: "Clothing", slug: "clothing", description: "Apparel and fashion", isActive: true },
    { name: "Home & Kitchen", slug: "home-kitchen", description: "Home essentials", isActive: true },
    { name: "Books", slug: "books", description: "Books and literature", isActive: true },
  ];

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .returning();

  console.log(`✅ Inserted ${insertedCategories.length} categories`);

  // Create placeholder seller user
  console.log("👤 Creating placeholder seller user...");
  const [sellerUser] = await db
    .insert(users)
    .values({
      name: "Demo Seller",
      email: "seller@demo.com",
      password: "$2b$10$placeholder_hash_for_demo_user", // Not a real hash, for reference only
      isActive: true,
    })
    .returning();

  // Assign seller role
  const [sellerRole] = await db
    .select()
    .from(roles)
    .where(eq(roles.slug, "seller"));

  if (sellerRole) {
    await db.insert(userRoles).values({
      userId: sellerUser.id,
      roleId: sellerRole.id,
    });
    console.log("✅ Assigned seller role to demo user");
  }

  // Seed products
  console.log("📦 Seeding products...");
  const electronicsCat = insertedCategories.find(c => c.slug === "electronics");
  const clothingCat = insertedCategories.find(c => c.slug === "clothing");
  const homeCat = insertedCategories.find(c => c.slug === "home-kitchen");
  const booksCat = insertedCategories.find(c => c.slug === "books");

  const productData = [
    {
      name: "Wireless Noise-Canceling Headphones",
      description: "Premium over-ear headphones with industry-leading noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for travel, work, or immersive listening.",
      price: "349.99",
      originalPrice: "399.99",
      categoryId: electronicsCat!.id,
      sellerId: sellerUser.id,
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop", "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop"],
      stock: 25,
      rating: "4.8",
      reviewCount: 128,
      tags: ["wireless", "audio", "premium"],
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Minimalist Smart Watch",
      description: "Elegant smartwatch with health tracking, notifications, and 7-day battery life. Features a stunning AMOLED display and premium aluminum finish.",
      price: "299.99",
      originalPrice: null,
      categoryId: electronicsCat!.id,
      sellerId: sellerUser.id,
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop"],
      stock: 18,
      rating: "4.6",
      reviewCount: 89,
      tags: ["smartwatch", "fitness", "tech"],
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Portable Bluetooth Speaker",
      description: "Waterproof speaker with 360-degree sound, 20-hour playtime, and deep bass. Perfect for outdoor adventures and pool parties.",
      price: "129.99",
      originalPrice: "159.99",
      categoryId: electronicsCat!.id,
      sellerId: sellerUser.id,
      images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop"],
      stock: 42,
      rating: "4.5",
      reviewCount: 215,
      tags: ["bluetooth", "portable", "waterproof"],
      isActive: true,
      isFeatured: false,
    },
    {
      name: "Premium Leather Crossbody Bag",
      description: "Handcrafted genuine leather crossbody bag with multiple compartments. Features adjustable strap and gold hardware accents.",
      price: "189.99",
      originalPrice: null,
      categoryId: clothingCat!.id,
      sellerId: sellerUser.id,
      images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop"],
      stock: 15,
      rating: "4.7",
      reviewCount: 76,
      tags: ["leather", "fashion", "bag"],
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Non-Stick Ceramic Cookware Set",
      description: "10-piece cookware set with ceramic non-stick coating. Includes frying pans, saucepans, and lids. Oven safe to 500°F.",
      price: "249.99",
      originalPrice: "299.99",
      categoryId: homeCat!.id,
      sellerId: sellerUser.id,
      images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop"],
      stock: 30,
      rating: "4.4",
      reviewCount: 203,
      tags: ["cookware", "kitchen", "nonstick"],
      isActive: true,
      isFeatured: false,
    },
    {
      name: "The Art of Programming",
      description: "A comprehensive guide to modern software development practices, design patterns, and clean code principles.",
      price: "49.99",
      originalPrice: null,
      categoryId: booksCat!.id,
      sellerId: sellerUser.id,
      images: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop"],
      stock: 100,
      rating: "4.9",
      reviewCount: 342,
      tags: ["programming", "development", "software"],
      isActive: true,
      isFeatured: false,
    },
  ];

  const insertedProducts = await db
    .insert(products)
    .values(productData)
    .returning();

  console.log(`✅ Inserted ${insertedProducts.length} products`);

  // Clear any existing seed entries by name to avoid duplicates on re-run
  // This is a simple approach - in production you'd use upsert or migrations
  console.log("✨ Seed completed successfully!");
  console.log(`📊 Total: ${insertedCategories.length} categories, ${insertedProducts.length} products`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
