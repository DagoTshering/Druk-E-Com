import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import HTTP_STATUS from "../constants/http.constant.js";

export const zodErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    // Use err.issues instead of err.errors
    const errors = err.issues.map(issue => ({
      field: issue.path.join("."),
      message: issue.message
    }));

    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Validation failed", errors });
  }
  next(err); // pass other errors to global handler
};
