import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";
import { ProfileService } from "../services/profile.service.js";

export const ProfileController = {
  async getProfiles(req, res, next) {
    try {
      const data = await ProfileService.getProfiles();

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

  async getMyProfile(req, res, next) {
    try {
      const data = await ProfileService.getMyProfile(req.user);

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

  async getProfileById(req, res, next) {
    try {
      const id = Number(req.params.id);
      const data = await ProfileService.getProfileById(id);

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

  async updateProfile(req, res, next) {
    try {
      const id = Number(req.params.id);

      await ProfileService.editProfile(id, req.body, req.user);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.COMMON.SUCCESS_UPDATE,
        metadata: {
          status: HttpStatus.OK,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async updateMyProfile(req, res, next) {
    try {
      await ProfileService.updateMyProfile(req.user, req.body);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.COMMON.SUCCESS_UPDATE,
        metadata: {
          status: HttpStatus.OK,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
