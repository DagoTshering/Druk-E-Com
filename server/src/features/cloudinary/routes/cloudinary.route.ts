import express from "express";
import { authenticate } from "../../../shared/middlewares/auth.middleware.js";
import { authorizeRoles } from "../../../shared/middlewares/role.middleware.js";
import { upload } from "../../../shared/utils/multer.js";
import asyncWrapper from "../../../shared/utils/asyncWrapper.js";
import { cloudinaryController } from "../controllers/cloudinary.controller.js";
import { cloudinaryQuerySchema } from "../schemas/cloudinary.schema.js";
import { validator } from "../../../shared/middlewares/validator.middleware.js";

const cloudinaryRoute = express.Router();

cloudinaryRoute.post(
  "/upload-images",
  authenticate,
  upload.array("images", 5),
  validator({ query: cloudinaryQuerySchema }),
  asyncWrapper(cloudinaryController.uploadImages)
);

cloudinaryRoute.delete(
  "/upload-images",
  authenticate,
  validator({ query: cloudinaryQuerySchema }),
  asyncWrapper(cloudinaryController.deleteImage)
);

export default cloudinaryRoute;
