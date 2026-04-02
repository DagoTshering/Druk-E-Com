import express from "express";
import { validator } from "../../../shared/middlewares/validator.middleware.js";
import { UserSchema, SignInSchema } from "../schemas/user.schema.js";
import asyncWrapper from "../../../shared/utils/asyncWrapper.js";
import { authController } from "../controllers/auth.controller.js";

const authRoute = express.Router();

authRoute.post("/sign-up", validator({ body: UserSchema }), asyncWrapper(authController.signUp));
authRoute.post("/sign-in", validator({ body: SignInSchema }), asyncWrapper(authController.signIn));

export default authRoute;