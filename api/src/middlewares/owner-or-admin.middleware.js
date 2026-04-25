import { ForbiddenError } from "../exceptions/ForbiddenError.js";
import { UnauthorizedError } from "../exceptions/UnauthorizedError.js";
import { ROLE } from "../constants/role.constant.js";
import { MESSAGE } from "../constants/message.constant.js";
import { BadRequestError } from "../exceptions/BadRequestError.js";

export const ownerOrAdmin = (paramKey = "id") => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return next(new UnauthorizedError(MESSAGE.AUTH.UNAUTHORIZED));
    }

    const resourceId = Number(req.params[paramKey]);

    if (isNaN(resourceId)) {
      return next(new BadRequestError(MESSAGE.COMMON.BAD_REQUEST));
    }

    if (user.role === ROLE.ADMIN) {
      return next();
    }

    // user hny edit punya dia sendiri
    if (user.id !== resourceId) {
      return next(new ForbiddenError(MESSAGE.AUTH.FORBIDDEN_OWNER));
    }

    next();
  };
};
