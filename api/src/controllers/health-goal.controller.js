import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";
import { HealthGoalService } from "../services/health-goal.service.js";

export const HealthGoalController = {
  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const data = await HealthGoalService.create(userId, req.body);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: MESSAGE.HEALTH_GOAL.CREATED,
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
        message: MESSAGE.HEALTH_GOAL.HISTORY_FOUND,
        metadata: {
          status: HttpStatus.OK,
        },
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getProgress(req, res, next) {
    try {
      const userId = req.user.id;
      const data = await HealthGoalService.getProgress(userId);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.HEALTH_GOAL.PROGRESS_FOUND,
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
