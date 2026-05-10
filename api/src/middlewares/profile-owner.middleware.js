import { prisma } from "../lib/prisma.js";
import { ROLE } from "../constants/role.constant.js";
import { MESSAGE } from "../constants/message.constant.js";

import { UnauthorizedError } from "../exceptions/UnauthorizedError.js";
import { ForbiddenError } from "../exceptions/ForbiddenError.js";
import { NotFoundError } from "../exceptions/NotFoundError.js";
import { BadRequestError } from "../exceptions/BadRequestError.js";

export const profileOwnerOrAdmin = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new UnauthorizedError(MESSAGE.AUTH.UNAUTHORIZED));
    }

    const profileId = Number(req.params.id);

    if (isNaN(profileId)) {
      return next(new BadRequestError(MESSAGE.COMMON.BAD_REQUEST));
    }

    const profile = await prisma.profile.findUnique({
      where: {
        id: profileId,
      },
    });

    if (!profile) {
      return next(new NotFoundError(MESSAGE.PROFILE.NOT_FOUND));
    }

    // admin bebas
    if (user.role === ROLE.ADMIN) {
      return next();
    }

    // cek owner
    if (profile.userId !== user.id) {
      return next(new ForbiddenError(MESSAGE.AUTH.FORBIDDEN_OWNER));
    }

    next();
  } catch (error) {
    next(error);
  }
};
