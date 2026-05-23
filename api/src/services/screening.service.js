import { MESSAGE } from "../constants/message.constant.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { prisma } from "../lib/prisma.js";
import { badRequestId } from "../utils/bad-request-id.util.js";

export const ScreeningService = {
  async getMyScreenings(userId) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    const data = await prisma.screening.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        imageUrl: true,
        result: true,
        confidence: true,
        description: true,
        recommendation: true,
        probabilities: true,

        createdAt: true,
      },
    });

    if (!data || data.length === 0) {
      throw new NotFoundError(MESSAGE.SCREENING.NOT_FOUND);
    }

    return data;
  },
};
