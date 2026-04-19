import { prisma } from "../lib/prisma.js";

export const UserService = {
  async getUsers(req, res) {
    const data = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      message: "Data User Berhasil Ditemukan",
      metadata: {
        status: 200,
      },
      data: data,
    });
  },
};
