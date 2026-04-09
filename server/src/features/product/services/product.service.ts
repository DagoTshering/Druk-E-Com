import { eq, and, like, or, sql, desc } from "drizzle-orm";
import { db } from "../../../shared/database/connection";
import { NotFoundException, ForbiddenException } from "../../../shared/errors/error.core";
import { products, categories, productVariants } from "../models";
import type { CreateProductPayload, UpdateProductPayload, GetProductsPayload } from "../schemas/product.schema";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

class ProductService {
  private async getCategoryName(categoryId: string): Promise<string> {
    const [cat] = await db
      .select({ name: categories.name })
      .from(categories)
      .where(eq(categories.id, categoryId));
    return cat?.name || "";
  }

  public async getCategories() {
    const categoryList = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      })
      .from(categories)
      .where(eq(categories.isActive, true));

    const categoryCounts = await db
      .select({
        categoryId: products.categoryId,
        count: sql<number>`count(*)`,
      })
      .from(products)
      .where(eq(products.isActive, true))
      .groupBy(products.categoryId);

    const countMap = new Map(categoryCounts.map(c => [c.categoryId, c.count]));

    return categoryList.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      productCount: countMap.get(cat.id) || 0,
    }));
  }

  public async getProducts(query: GetProductsPayload) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;

    const conditions = [eq(products.isActive, true)];

    if (query.category) {
      const [cat] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(like(categories.slug, `%${query.category}%`));
      if (cat) {
        conditions.push(eq(products.categoryId, cat.id));
      }
    }

    if (query.seller) {
      conditions.push(eq(products.sellerId, query.seller));
    }

    if (query.featured === "true") {
      conditions.push(eq(products.isFeatured, true));
    }

    if (query.search) {
      conditions.push(
        or(
          like(products.name, `%${query.search}%`),
          like(products.description, `%${query.search}%`)
        )!
      );
    }

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(...conditions));

    const productList = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        categoryId: products.categoryId,
        sellerId: products.sellerId,
        images: products.images,
        brand: products.brand,
        tags: products.tags,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: categories.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    const productIds = productList.map(p => p.id);

    const variantList = await db
      .select()
      .from(productVariants)
      .where(sql`${productVariants.productId} IN (${sql.join(productIds.map(id => sql`${id}`), sql`, `)})`);

    const variantMap = new Map<string, typeof variantList>();
    for (const variant of variantList) {
      const existing = variantMap.get(variant.productId) || [];
      existing.push(variant);
      variantMap.set(variant.productId, existing);
    }

    const productsWithVariants = productList.map(product => ({
      ...product,
      variants: variantMap.get(product.id) || [],
    }));

    return {
      products: productsWithVariants,
      total: countResult?.count || 0,
      page,
      limit,
      totalPages: Math.ceil((countResult?.count || 0) / limit),
    };
  }

  public async getProductById(id: string) {
    const [product] = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        categoryId: products.categoryId,
        sellerId: products.sellerId,
        images: products.images,
        brand: products.brand,
        tags: products.tags,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id));

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    const variants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, id));

    return { ...product, variants };
  }

  public async createProduct(data: CreateProductPayload, sellerId: string) {
    const slug = generateSlug(data.name);

    const [product] = await db
      .insert(products)
      .values({
        name: data.name,
        slug,
        description: data.description,
        categoryId: data.categoryId,
        sellerId,
        images: data.images,
        brand: data.brand,
        tags: data.tags,
        isFeatured: data.isFeatured,
        isActive: true,
      })
      .returning();

    const variantInserts = data.variants.map((variant, index) => ({
      productId: product.id,
      attributes: variant.attributes,
      sku: variant.sku,
      price: variant.price,
      originalPrice: variant.originalPrice,
      stock: variant.stock,
      weight: variant.weight,
      images: variant.images,
      isDefault: variant.isDefault || index === 0,
      isActive: variant.isActive,
      lowStockThreshold: variant.lowStockThreshold,
    }));

    await db.insert(productVariants).values(variantInserts);

    return this.getProductById(product.id);
  }

  public async updateProduct(id: string, data: UpdateProductPayload, sellerId: string, userRoles: string[]) {
    const existing = await db
      .select()
      .from(products)
      .where(eq(products.id, id));

    if (existing.length === 0) {
      throw new NotFoundException("Product not found");
    }

    const isAdmin = userRoles.includes("admin");
    if (existing[0].sellerId !== sellerId && !isAdmin) {
      throw new ForbiddenException("You can only update your own products");
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.slug = generateSlug(data.name);
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.brand !== undefined) updateData.brand = data.brand;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id));

    if (data.variants !== undefined) {
      await db.delete(productVariants).where(eq(productVariants.productId, id));

      const variantInserts = data.variants.map((variant, index) => ({
        productId: id,
        attributes: variant.attributes,
        sku: variant.sku,
        price: variant.price,
        originalPrice: variant.originalPrice,
        stock: variant.stock,
        weight: variant.weight,
        images: variant.images,
        isDefault: variant.isDefault || index === 0,
        isActive: variant.isActive,
        lowStockThreshold: variant.lowStockThreshold,
      }));

      await db.insert(productVariants).values(variantInserts);
    }

    return this.getProductById(id);
  }

  public async deleteProduct(id: string, sellerId: string, userRoles: string[]) {
    const existing = await db
      .select()
      .from(products)
      .where(eq(products.id, id));

    if (existing.length === 0) {
      throw new NotFoundException("Product not found");
    }

    const isAdmin = userRoles.includes("admin");
    if (existing[0].sellerId !== sellerId && !isAdmin) {
      throw new ForbiddenException("You can only delete your own products");
    }

    await db.delete(products).where(eq(products.id, id));

    return { message: "Product deleted successfully" };
  }
}

export const productService = new ProductService();
