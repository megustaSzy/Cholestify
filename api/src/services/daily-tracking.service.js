import { MESSAGE } from "../constants/message.constant.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { BadRequestError } from "../exceptions/BadRequestError.js";
import { prisma } from "../lib/prisma.js";
import { badRequestId } from "../utils/bad-request-id.util.js";
import { notExist } from "../utils/not-exist.util.js";

export const DailyTrackingService = {
  async create(userId, body) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);
    await notExist(prisma.user, { id: userId }, MESSAGE.USER.NOT_FOUND);

    const healthGoal = await prisma.healthGoal.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!healthGoal) {
      throw new NotFoundError(MESSAGE.HEALTH_GOAL.NOT_FOUND);
    }

    if (body.calories > healthGoal.targetWeeklyCalories) {
      throw new BadRequestError(
        `Kalori harian (${body.calories} kcal) tidak boleh melebihi target goals (${healthGoal.targetWeeklyCalories} kcal)`,
      );
    }

    if (body.exerciseMins > healthGoal.targetExerciseMins) {
      throw new BadRequestError(
        `Durasi olahraga harian (${body.exerciseMins} menit) tidak boleh melebihi target goals (${healthGoal.targetExerciseMins} menit)`,
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingTracking = await prisma.dailyTracking.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (existingTracking) {
      throw new BadRequestError(MESSAGE.DAILY_TRACKING.ALREADY_EXISTS);
    }

    const data = await prisma.dailyTracking.create({
      data: {
        userId,
        healthGoalId: healthGoal.id,
        calories: body.calories,
        protein: body.protein,
        exerciseMins: body.exerciseMins,
        foodNotes: body.foodNotes,
        date: new Date(),
      },
      select: {
        id: true,
        date: true,
        calories: true,
        protein: true,
        exerciseMins: true,
        foodNotes: true,
        createdAt: true,
      },
    });

    return data;
  },

  async getHistoryByUserId(userId) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    const data = await prisma.dailyTracking.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      select: {
        id: true,
        date: true,
        calories: true,
        protein: true,
        exerciseMins: true,
        foodNotes: true,
        createdAt: true,
        healthGoal: {
          select: {
            targetWeeklyCalories: true,
            targetExerciseMins: true,
          },
        },
      },
    });

    if (!data || data.length === 0) {
      throw new NotFoundError(MESSAGE.DAILY_TRACKING.NOT_FOUND);
    }

    return data;
  },
};
