import { Request, Response, NextFunction } from "express";
import { CustomError, NotFoundException } from "../errors/error.core.js";
import HTTP_STATUS from "../constants/http.constant.js";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("check error", error);

  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER).json({
    message: "Something went wrong!",
  });
};
