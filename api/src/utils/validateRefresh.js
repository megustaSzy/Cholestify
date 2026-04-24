import { UnauthorizedError } from "../exceptions/UnauthorizedError.js";
import { prisma } from "../lib/prisma.js";

export const validateRefresh = async (refreshToken) => {
  const token = await prisma.token.findUnique({
    where: { refreshToken },
  });

  if (!token) {
    throw new UnauthorizedError(process.env.TOKEN_BAD_REQUEST);
  }

  return token;
};
