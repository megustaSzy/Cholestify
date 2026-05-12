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
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMyBiometric(req, res, next) {
    try {
      const data = await BiometricService.getMyBiometrics(req.user);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.BIOMETRIC.FOUND,
        metadata: {
          status: HttpStatus.OK,
        },
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },

  async createBiometric(req, res, next) {
    try {
      const profileId = req.params.profileId;

      const data = await BiometricService.createBiometric(
        req.body,
        req.user,
        profileId,
      );

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
      const biometricId = req.params.id;

      const data = await BiometricService.updateBiometric(
        req.body,
        req.user,
        biometricId,
      );

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
      const id = Number(req.params.id);

      await BiometricService.deleteBiometric(id);

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
