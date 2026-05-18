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
      select: {
        id: true,
        targetWeeklyCalories: true,
        targetExerciseMins: true,
        createdAt: true,
      },
    });

    if (!data || data.length === 0) {
      throw new NotFoundError(MESSAGE.HEALTH_GOAL.NOT_FOUND);
    }

    return data;
  },

  async getProgress(userId) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    const healthGoal = await prisma.healthGoal.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!healthGoal) {
      throw new NotFoundError(MESSAGE.HEALTH_GOAL.NOT_FOUND);
    }

    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const startOfWeek = new Date(now.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);

    const trackingsThisWeek = await prisma.dailyTracking.findMany({
      where: {
        userId,
        healthGoalId: healthGoal.id,
        date: { gte: startOfWeek }
      }
    });

    const totalCalories = trackingsThisWeek.reduce((sum, t) => sum + t.calories, 0);
    const totalExerciseMins = trackingsThisWeek.reduce((sum, t) => sum + t.exerciseMins, 0);

    return {
      goal: {
        targetWeeklyCalories: healthGoal.targetWeeklyCalories,
        targetExerciseMins: healthGoal.targetExerciseMins,
      },
      current: {
        totalCalories,
        totalExerciseMins,
      },
      percentage: {
        calories: Math.min(100, Math.round((totalCalories / healthGoal.targetWeeklyCalories) * 100)),
        exerciseMins: Math.min(100, Math.round((totalExerciseMins / healthGoal.targetExerciseMins) * 100)),
      }
    };
  },
};
