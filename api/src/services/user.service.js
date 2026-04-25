import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";
import { ROLE } from "../constants/role.constant.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { prisma } from "../lib/prisma.js";
import { badRequestId } from "../utils/bad-request-id.util.js";
import { checkConflictUser } from "../utils/check-conflict-user.util.js";
import { notExist } from "../utils/not-exist.util.js";
import bcrypt from "bcryptjs";

export const UserService = {
  async create(body) {
    const { nama, email, password, notelp } = body;

    await checkConflictUser(prisma.user, email, MESSAGE.USER.EMAIL_EXIST);

    const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        notelp,
        role: ROLE.USER,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        notelp: true,
        role: true,
      },
    });

    return user;
  },

  async getUsers() {
    const data = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        nama: true,
        email: true,
        notelp: true,
        role: true,
      },
    });

    if (data.length === 0) {
      const error = new Error(MESSAGE.USER.NOT_FOUND);
      error.status = HttpStatus.NOT_FOUND;
      error.response = {
        success: false,
        message: MESSAGE.USER.NOT_FOUND,
        metadata: {
          status: HttpStatus.NOT_FOUND,
        },
      };

      throw error;
    }

    return data;
  },

  async getUsersById(id) {
    badRequestId(id, MESSAGE.COMMON.BAD_REQUEST);

    const data = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        notelp: true,
        role: true,
      },
    });

    if (!data) {
      throw new NotFoundError(MESSAGE.USER.NOT_FOUND);
    }

    return data;
  },

  async update(id, body) {
    badRequestId(id, MESSAGE.COMMON.BAD_REQUEST);

    await notExist(prisma.user, { id }, MESSAGE.USER.NOT_FOUND);

    const updateData = {
      nama: body.nama,
      email: body.email,
      notelp: body.notelp,
    };

    if (body.password) {
      updateData.password = await bcrypt.hash(
        body.password,
        process.env.SALT_ROUNDS,
      );
    }

    await prisma.user.update({
      where: {
        id,
      },
      data: updateData,
    });
  },

  async remove(id) {
    badRequestId(id, MESSAGE.COMMON.BAD_REQUEST);

    await notExist(prisma.user, { id }, MESSAGE.USER.NOT_FOUND);

    await prisma.user.delete({
      where: {
        id,
      },
    });
  },
};
