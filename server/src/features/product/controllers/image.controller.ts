import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import HTTP_STATUS from "../../../shared/constants/http.constant";

export class ImageController {
  public async uploadImages(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: "No images provided",
        });
      }

      const uploadPromises = files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "products",
              transformation: [
                { width: 1000, height: 1000, crop: "limit" },
                { quality: "auto" },
              ],
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else if (result) {
                resolve(result.secure_url);
              } else {
                reject(new Error("No result from Cloudinary"));
              }
            }
          );

          uploadStream.end(file.buffer);
        });
      });

      const imageUrls = await Promise.all(uploadPromises);

      return res.status(HTTP_STATUS.OK).json({
        message: "Images uploaded successfully",
        imageUrls,
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER).json({
        message: "Failed to upload images",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export const imageController = new ImageController();