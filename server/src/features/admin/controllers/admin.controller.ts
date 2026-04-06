import { Request, Response } from "express";
import { adminService } from "../services/admin.service";
import HTTP_STATUS from "../../../shared/constants/http.constant";

class AdminController {
  public async getUsers(req: Request, res: Response) {
    const users = await adminService.getUsers();
    return res.status(HTTP_STATUS.OK).json(users);
  }
}

export const adminController = new AdminController();