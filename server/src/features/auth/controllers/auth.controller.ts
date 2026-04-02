import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import HTTP_STATUS from "../../../shared/constants/http.constant";
class AuthController {
  public async signUp(req: Request, res: Response) {
    const result = await authService.signUp(req.body);
    //save the refresh token in cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true, // prevent the client(js) from accessing the refresh token.
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict", // prevent access cookies from another websites
      secure: process.env.NODE_ENV === "production", // HTTPs
    });
    return res.status(HTTP_STATUS.OK).json({
      message: "User signed up successfully",
      accessToken : result.accessToken,
      data : result.payload
    });
  }
  public async signIn(req: Request, res: Response) {
    const result = await authService.signIn(req.body);
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(HTTP_STATUS.OK).json({
      message: "User signed in successfully",
      accessToken: result.accessToken,
      data: result.payload,
    });
  }
}

export const authController: AuthController = new AuthController();
