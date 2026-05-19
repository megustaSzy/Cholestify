import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";
import { BadRequestError } from "../exceptions/BadRequestError.js";
import { prisma } from "../lib/prisma.js";
import { predictEyeScan } from "../services/ai.service.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";

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

      const aiResponse = await predictEyeScan(
        req.file.buffer,
        req.file.originalname,
      );

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
};
