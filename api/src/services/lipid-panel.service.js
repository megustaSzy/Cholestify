import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";

import { ConflictError } from "../exceptions/ConflictError.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";

import { prisma } from "../lib/prisma.js";

import { badRequestId } from "../utils/bad-request-id.util.js";
import { notExist } from "../utils/not-exist.util.js";

import { HealthRecommendationService } from "./health-recommendation.service.js";

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
        triglycerides: true,

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
        createdAt: "desc",
      },
      select: {
        id: true,
        date: true,

        totalCholesterol: true,
        ldl: true,
        hdl: true,
        triglycerides: true,

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
        triglycerides: body.triglycerides,
      },
      select: {
        id: true,
        date: true,

        totalCholesterol: true,
        ldl: true,
        hdl: true,
        triglycerides: true,

        createdAt: true,
      },
    });

    await HealthRecommendationService.generateFromLipidPanel(
      userId,
      data.id,
      data
    );

    return data;
  },

  async update(id, body) {
    badRequestId(id, MESSAGE.COMMON.BAD_REQUEST);

    const existing = await prisma.lipidPanel.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError(MESSAGE.LIPID_PANEL.NOT_FOUND);
    }

    const updated = await prisma.lipidPanel.update({
      where: { id },
      data: {
        date: body.date ? new Date(body.date) : existing.date,
        totalCholesterol: body.totalCholesterol ?? existing.totalCholesterol,
        ldl: body.ldl ?? existing.ldl,
        hdl: body.hdl ?? existing.hdl,
        triglycerides: body.triglycerides ?? existing.triglycerides,
      },
    });

    await HealthRecommendationService.generateFromLipidPanel(
      existing.userId,
      updated.id,
      updated
    );

    return updated;
  },

  async remove(id) {
    badRequestId(id, MESSAGE.COMMON.BAD_REQUEST);

    await notExist(prisma.lipidPanel, { id }, MESSAGE.LIPID_PANEL.NOT_FOUND);

    await prisma.lipidPanel.delete({
      where: { id },
    });
  },
};
