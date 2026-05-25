import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";
import { HealthRecommendationService } from "../services/health-recommendation.service.js";

export const HealthRecommendationController = {
  async getOverview(req, res, next) {
    try {
      const userId = req.user.id;
      const data = await HealthRecommendationService.getOverview(userId);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.HEALTH_RECOMMENDATION.OVERVIEW_FOUND,
        metadata: {
          status: HttpStatus.OK,
        },
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMyRecommendations(req, res, next) {
    try {
      const userId = req.user.id;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      
      const result = await HealthRecommendationService.getMyRecommendations(userId, page, limit);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.HEALTH_RECOMMENDATION.FOUND,
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
