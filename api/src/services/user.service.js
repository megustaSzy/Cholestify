import { HttpStatus } from "../constants/httpStatus.js";
import { prisma } from "../lib/prisma.js";
import { badRequestId } from "../utils/badRequestId.js";
import { notExist } from "../utils/notExist.js";
import bcrypt from "bcryptjs";

export const UserService = {
  async getUsers() {
    const data = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (data.length === 0) {
      const error = new Error(process.env.USER_NOT_FOUND_MESSAGE);
      error.status = HttpStatus.NOT_FOUND;
      error.response = {
        success: false,
        message: process.env.USER_NOT_FOUND_MESSAGE,
        metadata: {
          status: HttpStatus.NOT_FOUND,
        },
      };

      throw error;
    }

    return data;
  },

  async getUsersById(id) {
    badRequestId(id, process.env.BAD_REQUEST_MESSAGE);

    const data = await notExist(
      prisma.user,
      { id },
      process.env.USER_NOT_FOUND_MESSAGE,
    );

    return data;
  },

  async update(id, body) {
    badRequestId(id, process.env.BAD_REQUEST_MESSAGE);

    await notExist(prisma.user, { id }, process.env.USER_NOT_FOUND_MESSAGE);

    const updateData = {
      nama: body.nama,
      email: body.email,
      notelp: body.notelp,
    };

    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    await prisma.user.update({
      where: {
        id,
      },
      data: updateData,
    });
  },

  async remove(id) {
    badRequestId(id, process.env.BAD_REQUEST_MESSAGE);

    await notExist(prisma.user, { id }, process.env.USER_NOT_FOUND_MESSAGE);

    await prisma.user.delete({
      where: {
        id,
      },
    });
  },
};
