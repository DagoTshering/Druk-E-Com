import express from "express";
import { validator } from "../../../shared/middlewares/validator.middleware.js";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../../shared/middlewares/role.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema
} from "../schemas/product.schema.js";
import asyncWrapper from "../../../shared/utils/asyncWrapper.js";
import { productController } from "../controllers/product.controller.js";
import { authorizePermissions } from "../../../shared/middlewares/permission.middleware.js";

const productRoute = express.Router();

productRoute.get(
  "/categories",
  asyncWrapper(productController.getCategories)
);

productRoute.get(
  "/",
  validator({ query: getProductsQuerySchema }),
  asyncWrapper(productController.getProducts)
);

productRoute.get(
  "/:id",
  authenticate,
  authorizeRoles("seller", "admin"),
  asyncWrapper(productController.getProductById)
);

productRoute.post(
  "/",
  authenticate,
  authorizeRoles("seller", "admin"),
  validator({ body: createProductSchema }),
  asyncWrapper(productController.createProduct)
);

productRoute.put(
  "/:id",
  authenticate,
  authorizeRoles("seller", "admin"),
  validator({ body: updateProductSchema }),
  asyncWrapper(productController.updateProduct)
);

productRoute.delete(
  "/:id",
  authenticate,
  authorizeRoles("seller", "admin"),
  asyncWrapper(productController.deleteProduct)
);

export default productRoute;
