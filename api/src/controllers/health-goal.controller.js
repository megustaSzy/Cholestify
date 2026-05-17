import { HttpStatus } from "../constants/http-status.constant.js";
import { HealthGoalService } from "../services/health-goal.service.js";

export const HealthGoalController = {
  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const data = await HealthGoalService.create(userId, req.body);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Health goal dan saran kesehatan berhasil dibuat",
        metadata: {
          status: HttpStatus.CREATED,
        },
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getHistoryByUserId(req, res, next) {
    try {
      const userId = req.user.id;
      const data = await HealthGoalService.getHistoryByUserId(userId);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Riwayat health goal berhasil diambil",
        metadata: {
          status: HttpStatus.OK,
        },
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
