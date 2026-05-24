import { MESSAGE } from "../constants/message.constant.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { prisma } from "../lib/prisma.js";
import { badRequestId } from "../utils/bad-request-id.util.js";
import {
  getPaginationOptions,
  getPaginationMetadata,
} from "../utils/pagination.util.js";

export const ScreeningService = {
  async getMyScreenings(userId, pageQuery = 1, limitQuery = 10) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    const { page, limit, skip } = getPaginationOptions(pageQuery, limitQuery);

    const [data, totalItems] = await Promise.all([
      prisma.screening.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
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
      }),
      prisma.screening.count({
        where: { userId },
      }),
    ]);

    if (!data || data.length === 0) {
      throw new NotFoundError(MESSAGE.SCREENING.NOT_FOUND);
    }

    const metadata = getPaginationMetadata(page, limit, totalItems);

    return {
      data,
      metadata,
    };
  },

  async getAllMyScreenings(userId) {
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
