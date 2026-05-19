import { prisma } from "../lib/prisma.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";
import { HttpStatus } from "../constants/http-status.constant.js";
import { BadRequestError } from "../exceptions/BadRequestError.js";

export const TestController = {
  async testUploadCloudinary(req, res, next) {
    try {
      if (!req.file) {
        throw new BadRequestError("File gambar tidak ditemukan");
      }

      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);

      const testData = await prisma.testUpload.create({
        data: {
          imageUrl: cloudinaryResult.secure_url,
        },
      });

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Testing upload ke Cloudinary berhasil",
        metadata: {
          status: HttpStatus.CREATED,
        },
        data: testData,
      });
    } catch (error) {
      next(error);
    }
  },
};
