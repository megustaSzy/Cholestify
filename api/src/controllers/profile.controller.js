import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";
import { ProfileService } from "../services/profile.service.js";

export const ProfileController = {
  async getProfile(req, res, next) {
    try {
      const data = await ProfileService.findAll();

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.PROFILE.FOUND,
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
