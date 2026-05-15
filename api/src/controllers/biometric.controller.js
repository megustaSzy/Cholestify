import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";

import { BiometricService } from "../services/biometric.service.js";

export const BiometricController = {
  async getBiometric(req, res, next) {
    try {
      const data = await BiometricService.getBiometrics();

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.BIOMETRIC.FOUND,

        metadata: {
          status: HttpStatus.OK,
        },

        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getBiometricByUserId(req, res, next) {
    try {
      const id = Number(req.params.id);

      const data = await BiometricService.getBiometricByUserId(id);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.BIOMETRIC.FOUND,

        metadata: {
          status: HttpStatus.OK,
        },

        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async createBiometric(req, res, next) {
    try {
      const userId = req.user.id;

      const data = await BiometricService.create(userId, req.body);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: MESSAGE.BIOMETRIC.CREATED,

        metadata: {
          status: HttpStatus.CREATED,
        },

        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateBiometric(req, res, next) {
    try {
      const userId = Number(req.params.id);

      const data = await BiometricService.update(userId, req.body);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.COMMON.SUCCESS_UPDATE,

        metadata: {
          status: HttpStatus.OK,
        },

        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteBiometric(req, res, next) {
    try {
      const userId = Number(req.params.id);

      await BiometricService.remove(userId);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.BIOMETRIC.DELETED,

        metadata: {
          status: HttpStatus.OK,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
