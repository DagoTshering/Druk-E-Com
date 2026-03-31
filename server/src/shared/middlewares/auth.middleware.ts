import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { JwtPayload } from "../types/auth.types.js";
import {
  UnAuthorizedException,
  InternalServerError,
  ForbiddenException,
} from "../errors/error.core";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new UnAuthorizedException("NO_TOKEN");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new InternalServerError("JWT_SECRET is not defined");
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      //if token expires
      //This if statement should come first as if token expires it will become invalid
      throw new UnAuthorizedException("TOKEN_EXPIRED");
    }
    if (error instanceof JsonWebTokenError) {
      throw new ForbiddenException("TOKEN_INVALID");
    }
    throw new UnAuthorizedException("Authentication failed");
  }
}
