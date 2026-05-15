import { prisma } from "../lib/prisma.js";

export const HealthSummaryService = {
  async getHealthSummary(userId) {
    if (!userId) throw new Error("userId is required");

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
