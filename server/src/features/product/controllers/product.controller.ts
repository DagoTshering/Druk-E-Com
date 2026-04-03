import { Request, Response } from "express";
import { productService } from "../services/product.service";
import HTTP_STATUS from "../../../shared/constants/http.constant";

class ProductController {
  public async getProducts(req: Request, res: Response) {
    const result = await productService.getProducts(req.query);
    return res.status(HTTP_STATUS.OK).json(result);
  }

  public async getProductById(req: Request, res: Response) {
    const product = await productService.getProductById(req.params.id as string);
    return res.status(HTTP_STATUS.OK).json(product);
  }

  public async createProduct(req: Request, res: Response) {
    const sellerId = req.user!.userId;
    const product = await productService.createProduct(req.body, sellerId);
    return res.status(HTTP_STATUS.CREATED).json({
      message: "Product created successfully",
      data: product,
    });
  }

  public async updateProduct(req: Request, res: Response) {
    const sellerId = req.user!.userId;
    const userRoles = req.user!.roles;
    const product = await productService.updateProduct(
      req.params.id as string,
      req.body,
      sellerId,
      userRoles
    );
    return res.status(HTTP_STATUS.OK).json({
      message: "Product updated successfully",
      data: product,
    });
  }

  public async deleteProduct(req: Request, res: Response) {
    const sellerId = req.user!.userId;
    const userRoles = req.user!.roles;
    const result = await productService.deleteProduct(
      req.params.id as string,
      sellerId,
      userRoles
    );
    return res.status(HTTP_STATUS.OK).json(result);
  }
}

export const productController = new ProductController();
