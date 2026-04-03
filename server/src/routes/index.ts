import { Application, Request, Response } from "express";
import authRoute from "../features/auth/routes/auth.route";
import productRoute from "../features/product/routes/product.route";


const  appRoutes  = (app:Application) => {
    app.use("/api/v1/auth", authRoute);
    app.use("/api/v1/products", productRoute);
}

export default appRoutes;