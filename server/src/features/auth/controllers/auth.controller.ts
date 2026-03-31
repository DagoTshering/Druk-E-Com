import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import HTTP_STATUS from "../../../shared/constants/http.constant";
class AuthController {
  // You can use generic typing on the Request object
  // By default Request<Params = {}, ResBody = any, ReqBody = any, ReqQuery = ParsedQs>
  // {} = an object with no known properties, but it allows any value except null/undefined.
  // In Express generics, {} is often used as a default placeholder when there’s nothing to type yet (like no route params)
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
      message: "User sign up succesfully",
      accessToken : result.accessToken,
      data : result.payload
    });
  }
}

export const authController: AuthController = new AuthController();
