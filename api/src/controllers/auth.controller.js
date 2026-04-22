// src/controllers/auth.controller.js
import { HttpStatus } from "../constants/httpStatus.js";
import { AuthService } from "../services/auth.service.js";

export const AuthController = {
  async register(req, res, next) {
    try {
      const data = await AuthService.register(req.body);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: process.env.USER_REGISTER_SUCCESS_MESSAGE,
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
        message: process.env.USER_LOGIN_SUCCESS_MESSAGE,
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
