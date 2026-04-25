import { MESSAGE } from "../constants/message.constant.js";
import { UnauthorizedError } from "../exceptions/UnauthorizedError.js";
import { verifyAccessToken } from "../utils/jwt.util.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError(MESSAGE.TOKEN.NOT_FOUND);
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError(MESSAGE.TOKEN.INVALID);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
