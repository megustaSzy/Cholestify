// src/middlewares/auth.middleware.js
import { MESSAGE } from "../constants/message.constant.js";
import { UnauthorizedError } from "../exceptions/UnauthorizedError.js";
import { verifyAccessToken } from "../utils/jwt.util.js";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new UnauthorizedError(MESSAGE.TOKEN.NOT_FOUND);
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
