import { MESSAGE } from "../constants/message.constant.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { prisma } from "../lib/prisma.js";
import { badRequestId } from "../utils/bad-request-id.util.js";
import { notExist } from "../utils/not-exist.util.js";


export const HealthGoalService = {
  async create(userId, body) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    await notExist(prisma.user, { id: userId }, MESSAGE.USER.NOT_FOUND);

    const data = await prisma.healthGoal.create({
      data: {
        userId,
        targetLdlHdlRatio: body.targetLdlHdlRatio,
        targetWeeklyCalories: body.targetWeeklyCalories,
        targetExerciseMins: body.targetExerciseMins,
      },
    });

    return data;
  },

  async getHistoryByUserId(userId) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    const data = await prisma.healthGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!data || data.length === 0) {
      throw new NotFoundError(MESSAGE.HEALTH_GOAL.NOT_FOUND);
    }

    return data;
  },
};
