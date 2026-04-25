import { MESSAGE } from "../constants/message.constant.js";
import { ForbiddenError } from "../exceptions/ForbiddenError.js";
import { UnauthorizedError } from "../exceptions/UnauthorizedError.js";

export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return next(new UnauthorizedError(MESSAGE.AUTH.UNAUTHORIZED));
    }

    if (!allowedRoles.includes(user.role)) {
      return next(new ForbiddenError(MESSAGE.AUTH.FORBIDDEN));
    }

    next();
  };
};
