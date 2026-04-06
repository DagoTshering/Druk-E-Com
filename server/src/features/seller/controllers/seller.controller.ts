import { Request, Response } from "express";
import { sellerService } from "../services/seller.service";
import HTTP_STATUS from "../../../shared/constants/http.constant";

class SellerController {
  public async registerSeller(req: Request, res: Response) {
    const result = await sellerService.registerSeller(req.body);
    return res.status(HTTP_STATUS.CREATED).json(result);
  }

  public async applyAsSeller(req: Request, res: Response) {
    const userId = req.user!.userId;
    const result = await sellerService.applyAsSeller(userId, req.body);
    return res.status(HTTP_STATUS.OK).json(result);
  }

  public async getSellerProfile(req: Request, res: Response) {
    const userId = req.user!.userId;
    const profile = await sellerService.getSellerProfile(userId);
    return res.status(HTTP_STATUS.OK).json(profile);
  }

  public async getPendingSellers(req: Request, res: Response) {
    const pending = await sellerService.getPendingSellers();
    return res.status(HTTP_STATUS.OK).json(pending);
  }

  public async approveSeller(req: Request, res: Response) {
    const userId = req.params.userId as string;
    const result = await sellerService.approveSeller(userId);
    return res.status(HTTP_STATUS.OK).json(result);
  }

  public async rejectSeller(req: Request, res: Response) {
    const userId = req.params.userId as string;
    const { reason } = req.body;
    const result = await sellerService.rejectSeller(userId, reason);
    return res.status(HTTP_STATUS.OK).json(result);
  }
}

export const sellerController = new SellerController();
