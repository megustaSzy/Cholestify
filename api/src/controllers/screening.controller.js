import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";
import { BadRequestError } from "../exceptions/BadRequestError.js";
import { prisma } from "../lib/prisma.js";
import { predictEyeScan } from "../services/ai.service.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";
import { io } from "../server.js";
import { ScreeningService } from "../services/screening.service.js";
import { UserService } from "../services/user.service.js";
import { generateScreeningPDF } from "../utils/pdf.util.js";

const RESULT_MAP = {
  Normal: "NORMAL",
  "Indikasi Ringan": "INDIKASI_RINGAN",
  "Indikasi Kuat": "INDIKASI_KUAT",
};

export const ScreeningController = {
  async create(req, res, next) {
    try {
      if (!req.file) {
        throw new BadRequestError(MESSAGE.SCREENING.IMAGE_REQUIRED);
      }

      const { socketId } = req.body;

      if (socketId) {
        io.to(socketId).emit("scan_progress", {
          message: "Menyiapkan foto mata Anda...",
          progress: 10,
        });
      }

      const aiResponse = await predictEyeScan(
        req.file.buffer,
        req.file.originalname,
        socketId,
      );

      if (
        !aiResponse.success ||
        aiResponse.result.status === "Tidak Dapat Dianalisis"
      ) {
        if (socketId) {
          io.to(socketId).emit("scan_progress", {
            message: "Gambar Ditolak oleh AI.",
            progress: 100,
          });
        }
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message:
            aiResponse.result.keterangan ||
            "Gambar tidak valid atau kualitas foto kurang.",
          recommendation: aiResponse.result.rekomendasi,
        });
      }

      const result = aiResponse.result;

      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);

      const screening = await prisma.screening.create({
        data: {
          userId: req.user.id,

          imageUrl: cloudinaryResult.secure_url,

          result: RESULT_MAP[result.status],

          confidence: result.confidence,

          description: result.keterangan,

          recommendation: result.rekomendasi,

          probabilities: result.probabilitas,
        },
      });
      
      if (socketId) {
        io.to(socketId).emit("scan_progress", {
          message: "Selesai! Hasil siap ditampilkan.",
          progress: 100,
        });
      }

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: MESSAGE.SCREENING.CREATED,

        metadata: {
          status: HttpStatus.CREATED,
        },

        data: screening,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMyScreenings(req, res, next) {
    try {
      const userId = req.user.id;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await ScreeningService.getMyScreenings(userId, page, limit);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.SCREENING.FOUND,
        metadata: {
          status: HttpStatus.OK,
          ...result.metadata,
        },
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  },

  async exportMyScreeningsPDF(req, res, next) {
    try {
      const userId = req.user.id;

      const user = await UserService.getUsersById(userId);
      const data = await ScreeningService.getAllMyScreenings(userId);

      generateScreeningPDF(res, user, data);
    } catch (error) {
      next(error);
    }
  },
};
