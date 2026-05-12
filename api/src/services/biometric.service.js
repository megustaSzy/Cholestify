import { HttpStatus } from "../constants/http-status.constant.js";
import { MESSAGE } from "../constants/message.constant.js";
import { ROLE } from "../constants/role.constant.js";
import { ConflictError } from "../exceptions/ConflictError.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { prisma } from "../lib/prisma.js";
import { notExist } from "../utils/not-exist.util.js";

export const BiometricService = {
  async getBiometrics() {
    const data = await prisma.biometric.findMany({
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        height: true,
        weight: true,
        profile: {
          select: {
            id: true,
            patientCode: true,
            isActive: true,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
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

  async getMyBiometrics(user) {
    const data = await prisma.biometric.findFirst({
      where: {
        profile: {
          userId: user.id,
        },
      },
      select: {
        id: true,
        height: true,
        weight: true,
      },
    });

    if (!data) {
      throw new NotFoundError(MESSAGE.BIOMETRIC.NOT_FOUND);
    }

    return data;
  },

  async createBiometric(body, user, profileId = null) {
    let targetProfileId;

    if (user.role === ROLE.ADMIN && profileId) {
      targetProfileId = Number(profileId);
    } else {
      // user hanya bisa create biometric miliknya sendiri
      const profile = await prisma.profile.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (!profile) {
        throw new NotFoundError(MESSAGE.PROFILE.NOT_FOUND);
      }

      targetProfileId = profile.id;
    }

    // cek biometric sudah ada atau belum
    const existingBiometric = await prisma.biometric.findUnique({
      where: {
        profileId: targetProfileId,
      },
    });

    if (existingBiometric) {
      throw new ConflictError(MESSAGE.BIOMETRIC.ALREADY_EXISTS);
    }

    const data = await prisma.biometric.create({
      data: {
        profileId: targetProfileId,
        height: body.height,
        weight: body.weight,
      },
      select: {
        id: true,
        height: true,
        weight: true,
      },
    });

    return data;
  },

  async updateBiometric(body, user, biometricId = null) {
    let biometric;

    if (user.role === ROLE.ADMIN && biometricId) {
      biometric = await prisma.biometric.findUnique({
        where: {
          id: Number(biometricId),
        },
      });
    } else {
      biometric = await prisma.biometric.findFirst({
        where: {
          profile: {
            userId: user.id,
          },
        },
      });
    }

    if (!biometric) {
      throw new NotFoundError(MESSAGE.BIOMETRIC.NOT_FOUND);
    }

    const updateData = {};

    if (body.height !== undefined) {
      updateData.height = body.height;
    }

    if (body.weight !== undefined) {
      updateData.weight = body.weight;
    }

    const data = await prisma.biometric.update({
      where: {
        id: biometric.id,
      },
      data: updateData,
      select: {
        id: true,
        height: true,
        weight: true,
        updatedAt: true,
      },
    });

    return data;
  },

  async deleteBiometric(id) {
    badRequestId(id, MESSAGE.COMMON.BAD_REQUEST);

    await notExist(prisma.biometric, { id }, MESSAGE.BIOMETRIC.NOT_FOUND);

    await prisma.biometric.delete({
      where: {
        id,
      },
    });
  },
};
