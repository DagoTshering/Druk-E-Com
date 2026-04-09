import { axiosInstance } from ".";

export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string | null;
  category: string;
  categoryId: string;
  sellerId: string;
  images: string[];
  stock: number;
  rating: string;
  reviewCount: number;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: string;
}

export const productsApi = {
  getProducts(params?: GetProductsParams) {
    return axiosInstance.get<ProductsResponse>("/products", { params });
  },
  getCategories() {
    return axiosInstance.get<Category[]>("/products/categories");
  },
  uploadImages(images: File[]) {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });
    return axiosInstance.post<{ message: string; imageUrls: string[] }>("/cloudinary/upload-images?type=product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  createProduct(productData: {
    name: string;
    description: string;
    categoryId: string;
    brand?: string;
    tags: string[];
    images: string[];
    isFeatured: boolean;
    variants: Array<{
      attributes: Record<string, string>;
      sku: string;
      price: string;
      originalPrice?: string;
      stock: number;
      isDefault: boolean;
      isActive: boolean;
      images?: string[];
    }>;
  }) {
    return axiosInstance.post("/products", productData);
  },
  deleteImage(publicId: string) {
    return axiosInstance.delete("/cloudinary/upload-images?type=product", { data: { publicId } });
  },
};