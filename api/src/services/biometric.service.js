import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";

import { ConflictError } from "../exceptions/ConflictError.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";

import { prisma } from "../lib/prisma.js";

import { badRequestId } from "../utils/bad-request-id.util.js";
import { calculateBmi } from "../utils/calculate-bmi.util.js";
import { notExist } from "../utils/not-exist.util.js";

export const BiometricService = {
  async getBiometrics() {
    const data = await prisma.biometric.findMany({
      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,

        height: true,
        weight: true,

        bmi: true,
        bmiCategory: true,

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
      const error = new Error(MESSAGE.BIOMETRIC.NOT_FOUND);

      error.status = HttpStatus.NOT_FOUND;

      error.response = {
        success: false,
        message: MESSAGE.BIOMETRIC.NOT_FOUND,

        metadata: {
          status: HttpStatus.NOT_FOUND,
        },
      };

      throw error;
    }

    return data;
  },

  async getBiometricByUserId(userId) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    const data = await prisma.biometric.findUnique({
      where: {
        userId,
      },

      select: {
        id: true,

        height: true,
        weight: true,

        bmi: true,
        bmiCategory: true,

        createdAt: true,
        updatedAt: true,
      },
    });

    if (!data) {
      throw new NotFoundError(MESSAGE.BIOMETRIC.NOT_FOUND);
    }

    return data;
  },

  async create(userId, body) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    await notExist(prisma.user, { id: userId }, MESSAGE.USER.NOT_FOUND);

    const existingBiometric = await prisma.biometric.findUnique({
      where: {
        userId,
      },
    });

    if (existingBiometric) {
      throw new ConflictError(MESSAGE.BIOMETRIC.ALREADY_EXISTS);
    }

    const { bmi, bmiCategory } = calculateBmi(body.height, body.weight);

    const data = await prisma.biometric.create({
      data: {
        userId,

        height: body.height,
        weight: body.weight,

        bmi,
        bmiCategory,
      },

      select: {
        id: true,

        height: true,
        weight: true,

        bmi: true,
        bmiCategory: true,

        createdAt: true,
      },
    });

    return data;
  },

  async update(userId, body) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    const updateData = {};

    if (body.height !== undefined) {
      updateData.height = body.height;
    }

    if (body.weight !== undefined) {
      updateData.weight = body.weight;
    }

    // Ambil data lama untuk kalkulasi BMI
    const existing = await prisma.biometric.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundError(MESSAGE.BIOMETRIC.NOT_FOUND);
    }

    const newHeight = updateData.height ?? existing.height;
    const newWeight = updateData.weight ?? existing.weight;

    const { bmi, bmiCategory } = calculateBmi(newHeight, newWeight);

    updateData.bmi = bmi;
    updateData.bmiCategory = bmiCategory;

    const data = await prisma.biometric.update({
      where: { userId },
      data: updateData,
      select: {
        id: true,
        height: true,
        weight: true,
        bmi: true,
        bmiCategory: true,
        updatedAt: true,
      },
    });

    return data;
  },

  async remove(userId) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    await notExist(prisma.biometric, { userId }, MESSAGE.BIOMETRIC.NOT_FOUND);

    await prisma.biometric.delete({
      where: {
        userId,
      },
    });
  },
};
