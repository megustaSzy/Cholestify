import { MESSAGE } from "../constants/message.constant.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { prisma } from "../lib/prisma.js";
import { generateHealthAdvice } from "../utils/generate-health-advice.util.js";
import {
  getPaginationOptions,
  getPaginationMetadata,
} from "../utils/pagination.util.js";

export const HealthRecommendationService = {
  async generateFromLipidPanel(userId, lipidPanelId, lipidData) {
    const { dietaryAdvice, activityAdvice } = await generateHealthAdvice(
      lipidData.totalCholesterol,
      lipidData.ldl,
      lipidData.hdl,
      lipidData.triglycerides,
    );

    const recommendation = await prisma.healthRecommendation.create({
      data: {
        userId,
        lipidPanelId,
        dietaryAdvice,
        activityAdvice,
        triggerSource: "LIPID_PANEL",
      },
    });

    return recommendation;
  },

  async getMyRecommendations(userId, pageQuery = 1, limitQuery = 10) {
    const { page, limit, skip } = getPaginationOptions(pageQuery, limitQuery);

    const [data, totalItems] = await Promise.all([
      prisma.healthRecommendation.findMany({
        where: { userId },
        orderBy: { generatedAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          dietaryAdvice: true,
          activityAdvice: true,
          generatedAt: true,
        },
      }),
      prisma.healthRecommendation.count({
        where: { userId },
      }),
    ]);

    if (!data || data.length === 0) {
      throw new NotFoundError(MESSAGE.HEALTH_RECOMMENDATION.NOT_FOUND);
    }

    const metadata = getPaginationMetadata(page, limit, totalItems);

    return {
      data,
      metadata,
    };
  },

  async getOverview(userId) {
    const data = await prisma.healthRecommendation.findFirst({
      where: { userId },
      orderBy: { generatedAt: "desc" },
      select: {
        dietaryAdvice: true,
        activityAdvice: true,
        lipidPanel: {
          select: {
            date: true,
            totalCholesterol: true,
            ldl: true,
            hdl: true,
          },
        },
      },
    });

    if (!data) {
      throw new NotFoundError("Data saran kesehatan tidak ditemukan");
    }

    return {
      lipidPanel: data.lipidPanel,
      recommendation: {
        dietaryAdvice: data.dietaryAdvice,
        activityAdvice: data.activityAdvice,
        generatedAt: data.generatedAt,
      },
    };
  },
};
