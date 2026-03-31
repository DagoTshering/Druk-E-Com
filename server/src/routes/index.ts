import { Application, Request, Response } from "express";
import authRoute from "../features/auth/routes/auth.route";


const  appRoutes  = (app:Application) => {
    app.use("/api/v1/auth", authRoute);
}

export default appRoutes;