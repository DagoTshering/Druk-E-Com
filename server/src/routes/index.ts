import { Application, Request, Response } from "express";
import authRoute from "../features/auth/routes/auth.route";
import productRoute from "../features/product/routes/product.route";
import sellerRoute from "../features/seller/routes/seller.route";
import adminSellerRoute from "../features/admin/routes/admin-seller.route";


const  appRoutes  = (app:Application) => {
    app.use("/api/v1/auth", authRoute);
    app.use("/api/v1/products", productRoute);
    app.use("/api/v1/seller", sellerRoute);
    app.use("/api/v1/admin", adminSellerRoute);
}

export default appRoutes;