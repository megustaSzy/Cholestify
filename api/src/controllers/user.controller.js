// src/controllers/user.controller.js
import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";
import { AuthService } from "../services/auth.service.js";
import { UserService } from "../services/user.service.js";

export const UserController = {
  async createUser(req, res, next) {
    try {
      const data = await UserService.create(req.body);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: MESSAGE.USER.CREATED,
        metadata: {
          status: HttpStatus.CREATED,
        },
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getUsers(req, res, next) {
    try {
      const data = await UserService.getUsers();

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.USER.SUCCESS,
        metadata: {
          status: HttpStatus.OK,
        },
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getUsersById(req, res, next) {
    try {
      const id = Number(req.params.id);

      const data = await UserService.getUsersById(id);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.USER.SUCCESS,
        metadata: {
          status: HttpStatus.OK,
        },
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateById(req, res, next) {
    try {
      const id = Number(req.params.id);

      await UserService.update(id, req.body);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.COMMON.UPDATE,
        metadata: {
          status: HttpStatus.OK,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async removeById(req, res, next) {
    try {
      const id = Number(req.params.id);

      await UserService.remove(id);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.USER.DELETE,
        metadata: {
          status: HttpStatus.OK,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
