import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";
import { DailyTrackingService } from "../services/daily-tracking.service.js";

export const DailyTrackingController = {
  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const data = await DailyTrackingService.create(userId, req.body);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: MESSAGE.DAILY_TRACKING.CREATED,
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
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      
      const result = await DailyTrackingService.getHistoryByUserId(userId, page, limit);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.DAILY_TRACKING.HISTORY_FOUND,
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
};
