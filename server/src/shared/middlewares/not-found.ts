import { Request, Response, NextFunction } from "express";
import { NotFoundException } from "../errors/error.core.js";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundException(
    `The URL ${req.originalUrl} not found with method ${req.method}`
  ));
};
