import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import HTTP_STATUS from "../../../shared/constants/http.constant";

export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: (process.env.NODE_ENV === "development" ? "lax" : "none") as "lax" | "none",
  secure: process.env.NODE_ENV !== "development",
};

class AuthController {
  public async signUp(req: Request, res: Response) {
    const result = await authService.signUp(req.body);
    res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);
    return res.status(HTTP_STATUS.OK).json({
      message: "User signed up successfully",
      accessToken: result.accessToken,
      data: result.payload,
    });
  }

  public async signIn(req: Request, res: Response) {
    const result = await authService.signIn(req.body);
    res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);
    return res.status(HTTP_STATUS.OK).json({
      message: "User signed in successfully",
      accessToken: result.accessToken,
      data: result.payload,
    });
  }

  public async refreshToken(req: Request, res: Response) {
    const token = req.cookies.refreshToken;
    if (!token) {
      throw new Error("NO_REFRESH_TOKEN");
    }
    const result = await authService.refreshToken(token);
    res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);
    return res.status(HTTP_STATUS.OK).json({
      accessToken: result.accessToken,
      data: result.payload,
    });
  }
}

export const authController = new AuthController();
