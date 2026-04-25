// src/controllers/auth.controller.js
import { HttpStatus } from "../constants/httpStatus.js";
import { MESSAGE } from "../constants/message.js";
import { AuthService } from "../services/auth.service.js";

export const AuthController = {
  async register(req, res, next) {
    try {
      const data = await AuthService.register(req.body);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: MESSAGE.AUTH.REGISTRASI_SUCCESS,
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
};
