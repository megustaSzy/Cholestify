import { COOKIE_CONFIG } from "../config/cookie.config.js";
import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";
import { AuthService } from "../services/auth.service.js";
import { UserService } from "../services/user.service.js";

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
      const { user, accessToken, refreshToken } = await AuthService.login(
        req.body,
      );

      res.cookie("accessToken", accessToken, COOKIE_CONFIG.ACCESS_TOKEN);
      res.cookie("refreshToken", refreshToken, COOKIE_CONFIG.REFRESH_TOKEN);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.AUTH.LOGIN_SUCCESS,
        metadata: { status: HttpStatus.OK },
        data: user, // token tidak masuk response body
      });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req, res, next) {
    try {
      // baca dari cookie, bukan body
      const refreshToken = req.cookies?.refreshToken;

      const { accessToken } = await AuthService.refresh(refreshToken);

      // perbarui hanya accessToken cookie
      res.cookie("accessToken", accessToken, COOKIE_CONFIG.ACCESS_TOKEN);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.AUTH.LOGIN_SUCCESS,
        metadata: { status: HttpStatus.OK },
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      // baca dari cookie, bukan body
      const refreshToken = req.cookies?.refreshToken;

      await AuthService.logout(refreshToken);

      // hapus kedua cookie
      res.clearCookie("accessToken", COOKIE_CONFIG.ACCESS_TOKEN);
      res.clearCookie("refreshToken", COOKIE_CONFIG.REFRESH_TOKEN);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.AUTH.LOGOUT_SUCCESS,
        metadata: { status: HttpStatus.OK },
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

  async googleCallback(req, res, next) {
    try {
      const { user, accessToken, refreshToken } = await AuthService.googleLogin(
        req.user,
      );
      res.cookie("accessToken", accessToken, COOKIE_CONFIG.ACCESS_TOKEN);
      res.cookie("refreshToken", refreshToken, COOKIE_CONFIG.REFRESH_TOKEN);

      // redirect bersih tanpa token di URL
      return res.redirect(`${process.env.FRONTEND_URL}/user/dashboard`);
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await UserService.getUsersById(req.user.id);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Berhasil mendapatkan profil user",
        metadata: {
          status: HttpStatus.OK,
        },
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
};
