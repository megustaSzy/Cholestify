import { MESSAGE } from "../constants/message.constant.js";
import {
  HEALTH_GOAL_ADVICE,
  HEALTH_GOAL_THRESHOLDS,
} from "../constants/health-goal.constant.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { prisma } from "../lib/prisma.js";
import { badRequestId } from "../utils/bad-request-id.util.js";
import { notExist } from "../utils/not-exist.util.js";

const generateAdvice = (ratio, calories, exercise) => {
  let dietaryAdvice = "";
  let activityAdvice = "";

  // 1. Dietary Advice (berdasarkan Ratio dan Calories)
  if (ratio > HEALTH_GOAL_THRESHOLDS.LDL_HDL_RATIO_OPTIMAL) {
    dietaryAdvice = HEALTH_GOAL_ADVICE.DIETARY.HIGH_RATIO;
  } else if (calories > HEALTH_GOAL_THRESHOLDS.WEEKLY_CALORIES_HIGH) {
    dietaryAdvice = HEALTH_GOAL_ADVICE.DIETARY.HIGH_CALORIES;
  } else if (calories < HEALTH_GOAL_THRESHOLDS.WEEKLY_CALORIES_LOW) {
    dietaryAdvice = HEALTH_GOAL_ADVICE.DIETARY.LOW_CALORIES;
  } else {
    dietaryAdvice = HEALTH_GOAL_ADVICE.DIETARY.OPTIMAL_RATIO;
  }

  // 2. Activity Advice (berdasarkan Mins)
  if (exercise < HEALTH_GOAL_THRESHOLDS.EXERCISE_MINS_OPTIMAL) {
    activityAdvice = HEALTH_GOAL_ADVICE.ACTIVITY.LOW_EXERCISE;
  } else if (exercise >= HEALTH_GOAL_THRESHOLDS.EXERCISE_MINS_HIGH) {
    activityAdvice = HEALTH_GOAL_ADVICE.ACTIVITY.HIGH_EXERCISE;
  } else {
    activityAdvice = HEALTH_GOAL_ADVICE.ACTIVITY.OPTIMAL_EXERCISE;
  }

  return { dietaryAdvice, activityAdvice };
};

export const HealthGoalService = {
  async create(userId, body) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    await notExist(prisma.user, { id: userId }, MESSAGE.USER.NOT_FOUND);

    const { dietaryAdvice, activityAdvice } = generateAdvice(
      body.targetLdlHdlRatio,
      body.targetWeeklyCalories,
      body.targetExerciseMins,
    );

    const data = await prisma.healthGoal.create({
      data: {
        userId,
        targetLdlHdlRatio: body.targetLdlHdlRatio,
        targetWeeklyCalories: body.targetWeeklyCalories,
        targetExerciseMins: body.targetExerciseMins,
        dietaryAdvice,
        activityAdvice,
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
      throw new NotFoundError("Data health goal tidak ditemukan");
    }

    return data;
  },
};
