import { MESSAGE } from "../constants/message.js";
import { UnauthorizedError } from "../exceptions/UnauthorizedError.js";
import { verifyRefreshToken } from "../utils/jwt.util.js";

export const verifyRefresh = (refreshToken) => {
  if (!refreshToken) {
    throw new UnauthorizedError(MESSAGE.TOKEN.NOT_FOUND);
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError(MESSAGE.TOKEN.REFRESH_INVALID);
  }
};
