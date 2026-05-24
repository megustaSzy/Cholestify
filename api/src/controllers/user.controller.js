import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";
import { AuthService } from "../services/auth.service.js";
import { UserService } from "../services/user.service.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";

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
        message: MESSAGE.USER.FOUND,
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
      const userId = req.user.id;

      const data = await UserService.getUsersById(userId);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.USER.FOUND,
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

      const updateData = { ...req.body };

      if (req.file) {
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
        updateData.avatar = cloudinaryResult.secure_url;
      }

      await UserService.update(id, updateData);

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

  async removeById(req, res, next) {
    try {
      const id = Number(req.params.id);

      await UserService.remove(id);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGE.USER.DELETED,
        metadata: {
          status: HttpStatus.OK,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async removeAvatarById(req, res, next) {
    try {
      const id = Number(req.params.id);

      await UserService.removeAvatar(id);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Avatar berhasil dihapus",
        metadata: {
          status: HttpStatus.OK,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
