import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";

import { ConflictError } from "../exceptions/ConflictError.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";

import { prisma } from "../lib/prisma.js";

import { badRequestId } from "../utils/bad-request-id.util.js";
import { notExist } from "../utils/not-exist.util.js";

export const LipidPanelService = {
  async getLipidPanels() {
    const data = await prisma.lipidPanel.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        userId: true,
        date: true,

        totalCholesterol: true,
        ldl: true,
        hdl: true,

        createdAt: true,
        updatedAt: true,

        user: {
          select: {
            id: true,
            patientId: true,
            nama: true,
            email: true,
          },
        },
      },
    });

    if (data.length === 0) {
      throw Object.assign(new Error(MESSAGE.LIPID_PANEL.NOT_FOUND), {
        status: HttpStatus.NOT_FOUND,
      });
    }

    return data;
  },

  async getLipidPanelByUserId(userId) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    const data = await prisma.lipidPanel.findMany({
      where: { userId },
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        date: true,

        totalCholesterol: true,
        ldl: true,
        hdl: true,

        createdAt: true,
        updatedAt: true,
      },
    });

    if (!data || data.length === 0) {
      throw new NotFoundError(MESSAGE.LIPID_PANEL.NOT_FOUND);
    }

    return data;
  },

  async create(userId, body) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    await notExist(prisma.user, { id: userId }, MESSAGE.USER.NOT_FOUND);

    const data = await prisma.lipidPanel.create({
      data: {
        userId,

        date: body.date ? new Date(body.date) : new Date(),

        totalCholesterol: body.totalCholesterol,
        ldl: body.ldl,
        hdl: body.hdl,
      },
      select: {
        id: true,
        date: true,

        totalCholesterol: true,
        ldl: true,
        hdl: true,

        createdAt: true,
      },
    });

    return data;
  },

  async updateByUserId(userId, body) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    const latest = await prisma.lipidPanel.findFirst({
      where: { userId },
      orderBy: { date: "desc" },
    });

    if (!latest) {
      throw new NotFoundError(MESSAGE.LIPID_PANEL.NOT_FOUND);
    }

    return prisma.lipidPanel.update({
      where: { id: latest.id },
      data: {
        date: body.date ? new Date(body.date) : latest.date,
        totalCholesterol: body.totalCholesterol ?? latest.totalCholesterol,
        ldl: body.ldl ?? latest.ldl,
        hdl: body.hdl ?? latest.hdl,
      },
    });
  },

  async remove(id) {
    badRequestId(id, MESSAGE.COMMON.BAD_REQUEST);

    await notExist(prisma.lipidPanel, { id }, MESSAGE.LIPID_PANEL.NOT_FOUND);

    await prisma.lipidPanel.delete({
      where: { id },
    });
  },
};
