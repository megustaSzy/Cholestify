import { prisma } from "../lib/prisma.js";
import { MESSAGE } from "../constants/message.constant.js";
import { badRequestId } from "../utils/bad-request-id.util.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import {
  getPaginationOptions,
  getPaginationMetadata,
} from "../utils/pagination.util.js";

export const FoodService = {
  async getFoodsByUserId(userId, pageQuery = 1, limitQuery = 10) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    const { page, limit, skip } = getPaginationOptions(pageQuery, limitQuery);

    const latestLipid = await prisma.lipidPanel.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    let currentLdlGroup = "NORMAL";

    if (latestLipid) {
      currentLdlGroup = latestLipid.ldl > 130 ? "HIGH" : "NORMAL";
    }

    const [totalItems, foods] = await Promise.all([
      prisma.food.count(),
      prisma.food.findMany({
        skip,
        take: limit,
        include: {
          classifications: {
            where: {
              ldlGroup: currentLdlGroup,
            },
            select: {
              status: true,
              isRecommended: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

    const paginationMeta = getPaginationMetadata(page, limit, totalItems);

    const formattedData = foods.map((food) => {
      const classification = food.classifications[0];

      return {
        id: food.id,
        name: food.name,
        calories: food.calories,
        proteins: food.proteins,
        fat: food.fat,
        status: classification ? classification.status : "NEUTRAL",
        isRecommended: classification ? classification.isRecommended : false,
      };
    });

    return {
      ldlGroup: currentLdlGroup,
      pagination: paginationMeta,
      data: formattedData,
    };
  },
};
