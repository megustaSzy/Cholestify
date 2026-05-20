import { prisma } from "../lib/prisma.js";
import { MESSAGE } from "../constants/message.constant.js";
import { badRequestId } from "../utils/bad-request-id.util.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { BadRequestError } from "../exceptions/BadRequestError.js";
import {
  getPaginationOptions,
  getPaginationMetadata,
} from "../utils/pagination.util.js";

export const FoodService = {
  async getPublicFoods(pageQuery = 1, limitQuery = 10, search) {
    const { page, limit, skip } = getPaginationOptions(pageQuery, limitQuery);

    const whereCondition = {};
    if (search) {
      whereCondition.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    const [totalItems, foods] = await Promise.all([
      prisma.food.count({ where: whereCondition }),
      prisma.food.findMany({
        where: whereCondition,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          calories: true,
          proteins: true,
          fat: true,
        },
        orderBy: { name: "asc" },
      }),
    ]);

    let extraQueries = "";
    if (search) extraQueries += `&search=${encodeURIComponent(search)}`;

    const paginationMeta = getPaginationMetadata(
      page,
      limit,
      totalItems,
      extraQueries,
    );

    return { paginationMeta, foods };
  },

  async getFoodsByUserId(
    userId,
    pageQuery = 1,
    limitQuery = 10,
    search,
    status,
  ) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    const { page, limit, skip } = getPaginationOptions(pageQuery, limitQuery);

    const latestLipid = await prisma.lipidPanel.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!latestLipid || !latestLipid.ldl) {
      throw new BadRequestError(
        "Silakan isi data Lipid Panel (Kolesterol) Anda terlebih dahulu untuk mendapatkan rekomendasi makanan.",
      );
    }

    const currentLdlGroup = latestLipid.ldl > 130 ? "HIGH" : "NORMAL";

    const whereCondition = {};

    if (search) {
      whereCondition.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (status) {
      whereCondition.classifications = {
        some: {
          ldlGroup: currentLdlGroup,
          status: status.toUpperCase(),
        },
      };
    }

    const [totalItems, foods] = await Promise.all([
      prisma.food.count({ where: whereCondition }),
      prisma.food.findMany({
        where: whereCondition,
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

    let extraQueries = "";
    if (search) extraQueries += `&search=${encodeURIComponent(search)}`;
    if (status) extraQueries += `&status=${encodeURIComponent(status)}`;

    const paginationMeta = getPaginationMetadata(
      page,
      limit,
      totalItems,
      extraQueries,
    );

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
