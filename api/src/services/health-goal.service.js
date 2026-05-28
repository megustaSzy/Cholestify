import { MESSAGE } from "../constants/message.constant.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { prisma } from "../lib/prisma.js";
import { badRequestId } from "../utils/bad-request-id.util.js";
import { notExist } from "../utils/not-exist.util.js";

import { formatProgressResponse } from "../utils/format-progress.util.js";

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

  async getMyHealthGoals(userId) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    const goal = await prisma.healthGoal.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: 1,
      select: {
        id: true,
        targetWeeklyCalories: true,
        targetExerciseMins: true,
        createdAt: true,
        dailyTrackings: {
          select: {
            calories: true,
            exerciseMins: true,
          },
        },
      },
    });

    if (!goal) {
      throw new NotFoundError(MESSAGE.HEALTH_GOAL.NOT_FOUND);
    }

    const trackings = goal.dailyTrackings;
    return formatProgressResponse(goal, trackings);
  },

  async getProgressByUserId(userId) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    const healthGoal = await prisma.healthGoal.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        targetWeeklyCalories: true,
        targetExerciseMins: true,
        createdAt: true,
      },
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
        date: { gte: startOfWeek },
      },
      select: {
        calories: true,
        exerciseMins: true,
      },
    });

    return formatProgressResponse(healthGoal, trackingsThisWeek);
  },
};
