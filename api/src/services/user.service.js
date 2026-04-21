import { prisma } from "../lib/prisma.js";

export const UserService = {
  async createUser(req, res) {
    const newUser = req.body;

    const data = await prisma.user.create({
      data: {
        nama: newUser.nama,
        email: newUser.email,
        password: newUser.password,
        notelp: newUser.notelp,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Data User Berhasil Ditambahkan",
      data: data,
      metadata: {
        status: 201,
      },
    });
  },

  async getUsers(req, res) {
    const data = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data User Tidak Ditemukan",
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

  async getUsersById(req, res) {
    const id = Number(req.params.id);

    const data = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data User Tidak Ditemukan",
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

  async updateUser(req, res) {
    const id = Number(req.params.id);

    const updateUser = req.body;

    const data = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data User Tidak Ditemukan",
        metadata: {
          status: 404,
        },
      });
    }

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        nama: updateUser.nama,
        email: updateUser.email,
        password: updateUser.password,
        notelp: updateUser.notelp,
      },
    });

    return res.json({
      success: true,
      message: "Data User Berhasil Diubah",
      metadata: {
        status: 200,
      },
    });
  },
};
