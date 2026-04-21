import { prisma } from "../lib/prisma.js";
import { badRequestId } from "../utils/badRequestId.js";
import { notExistUser } from "../utils/notExistUser.js";

export const UserService = {
  async getUsers(req, res) {
    const data = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: process.env.USER_NOT_FOUND_MESSAGE,
        metadata: {
          status: 404,
        },
      });
    }

    return res.json({
      success: true,
      message: process.env.USER_SUCCESS_MESSAGE,
      metadata: {
        status: 200,
      },
      data: data,
    });
  },

  async getUsersById(req, res, next) {
    try {
      const id = Number(req.params.id);

      badRequestId(id, process.env.BAD_REQUEST_MESSAGE);

      const data = await notExistUser(
        prisma.user,
        id,
        process.env.USER_NOT_FOUND_MESSAGE,
      );

      return res.json({
        success: true,
        message: process.env.USER_SUCCESS_MESSAGE,
        metadata: {
          status: 200,
        },
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const id = Number(req.params.id);

      badRequestId(id, process.env.BAD_REQUEST_MESSAGE);

      await notExistUser(prisma.user, id, process.env.USER_NOT_FOUND_MESSAGE);

      const updateData = {
        nama: req.body.nama,
        email: req.body.email,
        notelp: req.body.notelp,
      };

      // hanya hash jika password dikirim
      if (req.body.password) {
        updateData.password = await bcrypt.hash(req.body.password, 10);
      }

      await prisma.user.update({
        where: {
          id,
        },
        data: updateData,
      });

      return res.status(200).json({
        success: true,
        message: "Data User Berhasil Diubah",
        metadata: {
          status: 200,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res) {
    const id = Number(req.params.id);

    badRequestId(id, process.env.BAD_REQUEST_MESSAGE);

    const data = await notExistUser(
      prisma.user,
      id,
      process.env.USER_NOT_FOUND_MESSAGE,
    );

    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Data User Berhasil Dihapus",
      metadata: {
        status: 200,
      },
    });
  },
};
