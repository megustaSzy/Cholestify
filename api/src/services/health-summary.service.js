import { MESSAGE } from "../constants/message.constant.js";
import { prisma } from "../lib/prisma.js";
import { badRequestId } from "../utils/bad-request-id.util.js";

export const HealthSummaryService = {
  async getHealthSummary(userId) {
    badRequestId(userId, MESSAGE.COMMON.BAD_REQUEST);

    const [biometric, lipidPanel] = await Promise.all([
      prisma.biometric.findFirst({
        where: { userId },
        select: {
          height: true,
          weight: true,
          bmi: true,
          bmiCategory: true,
        },
      }),

      prisma.lipidPanel.findFirst({
        where: { userId },
        select: {
          totalCholesterol: true,
          triglycerides: true,
          ldl: true,
          hdl: true,
        },
      }),
    ]);

    return {
      biometrics: biometric ?? null,
      lipidPanel: lipidPanel ?? null,
    };
  },
};
