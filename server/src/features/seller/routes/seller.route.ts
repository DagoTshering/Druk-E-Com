import express from "express";
import { validator } from "../../../shared/middlewares/validator.middleware.js";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../../shared/middlewares/role.middleware.js";
import {
  registerSellerSchema,
  applyAsSellerSchema,
  rejectSellerSchema,
} from "../schemas/seller.schema.js";
import asyncWrapper from "../../../shared/utils/asyncWrapper.js";
import { sellerController } from "../controllers/seller.controller.js";

const sellerRoute = express.Router();

// Public - register as seller (new user)
sellerRoute.post(
  "/register-seller",
  validator({ body: registerSellerSchema }),
  asyncWrapper(sellerController.registerSeller)
);

// Authenticated - apply as seller (existing user)
sellerRoute.post(
  "/apply",
  authenticate,
  validator({ body: applyAsSellerSchema }),
  asyncWrapper(sellerController.applyAsSeller)
);

// Authenticated seller - get own profile
sellerRoute.get(
  "/profile",
  authenticate,
  asyncWrapper(sellerController.getSellerProfile)
);

export default sellerRoute;
