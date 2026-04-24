import { ForbiddenError } from "../exceptions/ForbiddenError.js";
import { UnauthorizedError } from "../exceptions/UnauthorizedError.js";

export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return next(new UnauthorizedError(process.env.UNAUTHORIZED_MESSAGE));
    }

    if (!allowedRoles.includes(user.role)) {
      return next(new ForbiddenError(process.env.FORBIDDEN_MESSAGE));
    }

    next();
  };
};
