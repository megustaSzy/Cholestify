import { MESSAGE } from "../constants/message.constant.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { prisma } from "../lib/prisma.js";
import { badRequestId } from "../utils/bad-request-id.util.js";

export const ProfileService = {
  async getProfiles() {
    const data = await prisma.profile.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return data;
  },

  async getProfileById(id) {
    badRequestId(id, MESSAGE.COMMON.BAD_REQUEST);

    const data = await prisma.profile.findUnique({
      where: {
        id,
      },
    });

    if (!data) {
      throw NotFoundError(MESSAGE.PROFILE.NOT_FOUND);
    }

    return data;
  },

  async editProfile(id, body) {
    badRequestId(id, MESSAGE.COMMON.BAD_REQUEST);

    
  },
};
