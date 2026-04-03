import { eq, and, like, or, sql, inArray, desc } from "drizzle-orm";
import { db } from "../../../shared/database/connection";
import { NotFoundException, ForbiddenException, BadRequestException } from "../../../shared/errors/error.core";
import { products, categories } from "../models";
import type { CreateProductPayload, UpdateProductPayload, GetProductsPayload } from "../schemas/product.schema";

class ProductService {
  private async getCategoryName(categoryId: string): Promise<string> {
    const [cat] = await db
      .select({ name: categories.name })
      .from(categories)
      .where(eq(categories.id, categoryId));
    return cat?.name || "";
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
        description: products.description,
        price: products.price,
        originalPrice: products.originalPrice,
        categoryId: products.categoryId,
        sellerId: products.sellerId,
        images: products.images,
        stock: products.stock,
        rating: products.rating,
        reviewCount: products.reviewCount,
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
      .where(and(...conditions))
      .orderBy(desc(products.createdAt)) // without it you may see duplicate and missing items
      .limit(limit)
      .offset(offset);

    return {
      products: productList,
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
        description: products.description,
        price: products.price,
        originalPrice: products.originalPrice,
        categoryId: products.categoryId,
        sellerId: products.sellerId,
        images: products.images,
        stock: products.stock,
        rating: products.rating,
        reviewCount: products.reviewCount,
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

    return product;
  }

  public async createProduct(data: CreateProductPayload, sellerId: string) {
    const [product] = await db
      .insert(products)
      .values({
        name: data.name,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice,
        categoryId: data.categoryId,
        sellerId,
        images: data.images,
        stock: data.stock,
        tags: data.tags,
        isFeatured: data.isFeatured,
        isActive: true,
      })
      .returning();

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

    await db
      .update(products)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));

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
