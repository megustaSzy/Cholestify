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

        totalCholesterol: true,
        triglycerides: true,
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
      const error = new Error(MESSAGE.LIPID_PANEL.NOT_FOUND);

      error.status = HttpStatus.NOT_FOUND;

      error.response = {
        success: false,
        message: MESSAGE.LIPID_PANEL.NOT_FOUND,

        metadata: {
          status: HttpStatus.NOT_FOUND,
        },
      };

      throw error;
    }

    return data;
  },

  async getLipidPanelByUserId(userId) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    const data = await prisma.lipidPanel.findUnique({
      where: {
        userId,
      },

      select: {
        id: true,

        totalCholesterol: true,
        triglycerides: true,
        ldl: true,
        hdl: true,

        createdAt: true,
        updatedAt: true,
      },
    });

    if (!data) {
      throw new NotFoundError(MESSAGE.LIPID_PANEL.NOT_FOUND);
    }

    return data;
  },

  async create(userId, body) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    await notExist(prisma.user, { id: userId }, MESSAGE.USER.NOT_FOUND);

    const existingLipidPanel = await prisma.lipidPanel.findUnique({
      where: {
        userId,
      },
    });

    if (existingLipidPanel) {
      throw new ConflictError(MESSAGE.LIPID_PANEL.ALREADY_EXISTS);
    }

    const data = await prisma.lipidPanel.create({
      data: {
        userId,

        totalCholesterol: body.totalCholesterol,
        triglycerides: body.triglycerides,
        ldl: body.ldl,
        hdl: body.hdl,
      },

      select: {
        id: true,

        totalCholesterol: true,
        triglycerides: true,
        ldl: true,
        hdl: true,

        createdAt: true,
      },
    });

    return data;
  },

  async update(userId, body) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    await notExist(
      prisma.lipidPanel,
      { userId },
      MESSAGE.LIPID_PANEL.NOT_FOUND,
    );

    const updateData = {};

    if (body.totalCholesterol !== undefined) {
      updateData.totalCholesterol = body.totalCholesterol;
    }

    if (body.triglycerides !== undefined) {
      updateData.triglycerides = body.triglycerides;
    }

    if (body.ldl !== undefined) {
      updateData.ldl = body.ldl;
    }

    if (body.hdl !== undefined) {
      updateData.hdl = body.hdl;
    }

    const data = await prisma.lipidPanel.update({
      where: {
        userId,
      },

      data: updateData,

      select: {
        id: true,

        totalCholesterol: true,
        triglycerides: true,
        ldl: true,
        hdl: true,

        updatedAt: true,
      },
    });

    return data;
  },

  async remove(userId) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    await notExist(
      prisma.lipidPanel,
      { userId },
      MESSAGE.LIPID_PANEL.NOT_FOUND,
    );

    await prisma.lipidPanel.delete({
      where: {
        userId,
      },
    });
  },
};
