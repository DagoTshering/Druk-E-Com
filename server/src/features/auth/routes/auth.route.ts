import express from "express";
import { validator } from "../../../shared/middlewares/validator.middleware.js";
import { UserSchema } from "../schemas/user.schema.js";
import asyncWrapper from "../../../shared/utils/asyncWrapper.js";
import { authController } from "../controllers/auth.controller.js";

const authRoute = express.Router();

authRoute.post("/sign-up", validator({body: UserSchema}), asyncWrapper(authController.signUp));

export default authRoute;