import express from "express";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../../shared/middlewares/role.middleware.js";
import { upload } from "../../../shared/utils/multer.js";
import asyncWrapper from "../../../shared/utils/asyncWrapper.js";
import { imageController } from "../controllers/image.controller.js";

const imageRoute = express.Router();

imageRoute.post(
  "/products/upload-images",
  authenticate,
  authorizeRoles("seller", "admin"),
  upload.array("images", 5),
  asyncWrapper(imageController.uploadImages)
);

imageRoute.delete(
  "/products/upload-images",
  authenticate,
  authorizeRoles("seller", "admin"),
  asyncWrapper(imageController.deleteImage)
);

export default imageRoute;