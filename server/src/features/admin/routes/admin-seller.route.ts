import express from "express";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../../shared/middlewares/role.middleware.js";
import { validator } from "../../../shared/middlewares/validator.middleware.js";
import { rejectSellerSchema } from "../../seller/schemas/seller.schema.js";
import asyncWrapper from "../../../shared/utils/asyncWrapper.js";
import { sellerController } from "../../seller/controllers/seller.controller.js";
import { adminController } from "../controllers/admin.controller.js";

const adminSellerRoute = express.Router();

adminSellerRoute.get(
  "/users",
  authenticate,
  authorizeRoles("admin"),
  asyncWrapper(adminController.getUsers)
);

adminSellerRoute.get(
  "/sellers/pending",
  authenticate,
  authorizeRoles("admin"),
  asyncWrapper(sellerController.getPendingSellers)
);

adminSellerRoute.patch(
  "/sellers/:userId/approve",
  authenticate,
  authorizeRoles("admin"),
  asyncWrapper(sellerController.approveSeller)
);

adminSellerRoute.patch(
  "/sellers/:userId/reject",
  authenticate,
  authorizeRoles("admin"),
  validator({ body: rejectSellerSchema }),
  asyncWrapper(sellerController.rejectSeller)
);

export default adminSellerRoute;
