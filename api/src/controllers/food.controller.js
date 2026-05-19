import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";
import { FoodService } from "../services/food.service.js";

export const FoodController = {
  async getFoodsByUserId(req, res, next) {
    try {
      const userId = req.user.id;
      const { page, limit, search, status } = req.query;
      const result = await FoodService.getFoodsByUserId(userId, page, limit, search, status);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.FOOD.FOUND,
        metadata: {
          status: HttpStatus.OK,
          ldlGroup: result.ldlGroup,
          ...result.pagination,
        },
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  },
};
