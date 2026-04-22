// src/controllers/user.controller.js
import { HttpStatus } from "../constants/httpStatus.js";
import { UserService } from "../services/user.service.js";

export const UserController = {
  async getUsers(req, res, next) {
    try {
      const data = await UserService.getUsers();

      return res.status(HttpStatus.OK).json({
        success: true,
        message: process.env.USER_SUCCESS_MESSAGE,
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
        message: process.env.USER_SUCCESS_MESSAGE,
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
        message: process.env.USER_UPDATE_MESSAGE,
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
        message: process.env.USER_DELETE_MESSAGE,
        metadata: {
          status: HttpStatus.OK,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
