import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";

import { HealthSummaryService } from "../services/health-summary.service.js";

export const HealthSummaryController = {
  async getHealthSummary(req, res, next) {
    try {
      const userId = req.user.id;

      const data = await HealthSummaryService.getHealthSummary(userId);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.SUMMARY.FOUND,

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
