import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import appRoutes from "./routes/index.js";
import cors from "cors";
import { notFound } from "./shared/middlewares/not-found";
import { errorHandler } from "./shared/middlewares/global-error-handler.js";
import { checkDbConnection } from "./shared/database/connection.js";
import { zodErrorHandler } from "./shared/middlewares/zod-error-handler";

class Server {
  private app: Application;

  constructor() {
    this.app = express();
  }

  public start(): void {
    this.setupMiddleware();
    this.setupRoutes();
    this.setupGlobalError();
    this.listenServer();
    this.connectDatabase();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: process.env.CLIENT_URL! || "*",
        credentials: true, // It enables cookies
      }),
    );
  }

  private async connectDatabase(): Promise<void> {
    if (process.env.NODE_ENV === "development") {
      checkDbConnection();
    }
  }

  private setupRoutes(): void {
    appRoutes(this.app);
  }

  private setupGlobalError(): void {
    this.app.all(/(.*)/, notFound);
    this.app.use(zodErrorHandler);
    this.app.use(errorHandler);
  }

  private listenServer() {
    const port = process.env.PORT || 5050;
    this.app.listen(port, () => {
      console.log(`Connected to server with port ${port}`);
    });
  }
}

export default Server;
