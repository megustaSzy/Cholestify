import { prisma } from "../lib/prisma.js";

export const ProfileService = {
  async findAll() {
    const data = await prisma.profile.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return data;
  },
};
