import { UnauthorizedError } from "../exceptions/UnauthorizedError.js";
import { verifyRefreshToken } from "../utils/jwt.js ";

export const verifyRefresh = (refreshToken) => {
  if (!refreshToken) {
    throw new UnauthorizedError(process.env.REFRESH_NOT_FOUND_MESSAGE);
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError(process.env.REFRESH_BAD_REQUEST);
  }
};
