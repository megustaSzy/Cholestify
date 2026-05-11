import { MESSAGE } from "../constants/message.constant.js";
import { ROLE } from "../constants/role.constant.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { prisma } from "../lib/prisma.js";
import { badRequestId } from "../utils/bad-request-id.util.js";
import { notExist } from "../utils/not-exist.util.js";

export const ProfileService = {
  async getProfiles() {
    const data = await prisma.profile.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return data;
  },

  async getMyProfile(user) {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
            notelp: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundError(MESSAGE.PROFILE.NOT_FOUND);
    }

    return profile;
  },

  async getProfileById(id) {
    badRequestId(id, MESSAGE.COMMON.BAD_REQUEST);

    const data = await prisma.profile.findUnique({
      where: {
        id,
      },
    });

    if (!data) {
      throw new NotFoundError(MESSAGE.PROFILE.NOT_FOUND);
    }

    return data;
  },

  async editProfile(id, body, user) {
    badRequestId(id, MESSAGE.COMMON.BAD_REQUEST);

    await notExist(prisma.profile, { id }, MESSAGE.PROFILE.NOT_FOUND);

    const updateData = {};

    // hanya update jika field dikirim
    if (body.dob !== undefined) {
      updateData.dob = new Date(body.dob);
    }

    if (body.bloodType !== undefined) {
      updateData.bloodType = body.bloodType;
    }

    // admin boleh update isActive
    if (user.role === ROLE.ADMIN && body.isActive !== undefined) {
      updateData.isActive = body.isActive;
    }

    await prisma.profile.update({
      where: {
        id,
      },
      data: updateData,
    });
  },

  async updateMyProfile(user, body) {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!profile) {
      throw new NotFoundError(MESSAGE.PROFILE.NOT_FOUND);
    }

    const updateData = {};

    if (body.dob !== undefined) {
      updateData.dob = new Date(body.dob);
    }

    if (body.bloodType !== undefined) {
      updateData.bloodType = body.bloodType;
    }

    await prisma.profile.update({
      where: {
        userId: user.id,
      },
      data: updateData,
    });
  },

  async resetProfile(id) {
    badRequestId(id, MESSAGE.COMMON.BAD_REQUEST);

    await notExist(prisma.profile, { id }, MESSAGE.PROFILE.NOT_FOUND);

    await prisma.profile.update({
      where: {
        id,
      },
      data: {
        dob: null,
        bloodType: null,
      },
    });

    await prisma.biometric.deleteMany({
      where: {
        profileId: id,
      },
    });
  },
};
