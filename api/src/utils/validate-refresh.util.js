import { MESSAGE } from "../constants/message.constant.js";
import { UnauthorizedError } from "../exceptions/UnauthorizedError.js";
import { prisma } from "../lib/prisma.js";

export const validateRefresh = async (refreshToken) => {
  const token = await prisma.token.findUnique({
    where: { refreshToken },
  });

  if (!token) {
    throw new UnauthorizedError(MESSAGE.TOKEN.REFRESH_INVALID);
  }

  if (token.expiresAt <= new Date()) {
    await prisma.token.delete({
      where: { id: token.id },
    });
    throw new UnauthorizedError("Refresh token sudah kedaluwarsa. Silakan login kembali.");
  }

  return token;
};
