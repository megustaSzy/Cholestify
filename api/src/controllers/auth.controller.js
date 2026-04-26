import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";
import { AuthService } from "../services/auth.service.js";

export const AuthController = {
  async register(req, res, next) {
    try {
      const data = await AuthService.register(req.body);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: MESSAGE.AUTH.REGISTER_SUCCESS,
        metadata: {
          status: HttpStatus.CREATED,
        },
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const data = await AuthService.login(req.body);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.AUTH.LOGIN_SUCCESS,
        metadata: {
          status: HttpStatus.OK,
        },
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;

      const data = await AuthService.refresh(refreshToken);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.AUTH.LOGIN_SUCCESS,
        metadata: {
          status: HttpStatus.OK,
        },
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;

      await AuthService.logout(refreshToken);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.AUTH.LOGOUT_SUCCESS,
        metadata: {
          status: HttpStatus.OK,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req, res, next) {
    try {
      await AuthService.forgotPassword(req.body);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.AUTH.RESET_PASSWORD_EMAIL_SENT,
        metadata: {
          status: HttpStatus.OK,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { token } = req.validatedQuery;

      await AuthService.resetPassword(token, req.body);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.AUTH.PASSWORD_UPDATED,
        metadata: {
          status: HttpStatus.OK,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
