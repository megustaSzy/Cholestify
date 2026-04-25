// src/services/auth.service.js
import { prisma } from "../lib/prisma.js";
import { checkConflictUser } from "../utils/check-conflict-user.util.js";
import { emailExist } from "../utils/email-exist.util.js";
import bcrypt from "bcryptjs";
import { notExist } from "../utils/not-exist.util.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.util.js";
import { UnauthorizedError } from "../exceptions/UnauthorizedError.js";
import { HttpStatus } from "../constants/http-status.constant.js";
import { validateRefresh } from "../utils/validate-refresh.util.js";
import { MESSAGE } from "../constants/message.constant.js";
import { ROLE } from "../constants/role.constant.js";

export const AuthService = {
  async register(body) {
    const { email, nama, password, notelp } = body;

    await checkConflictUser(prisma.user, email, MESSAGE.USER.EMAIL_EXIST);

    const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        notelp,
        role: ROLE.USER,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        notelp: true,
        role: true,
      },
    });

    return user;
  },

  async login(body) {
    const { email, password } = body;

    const user = await notExist(prisma.user, { email }, MESSAGE.USER.NOT_FOUND);

    await emailExist(password, user.password, MESSAGE.AUTH.LOGIN_FAILED);

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // simpan refresh token ke DB
    await prisma.token.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      id: user.id,
      nama: user.nama,
      email: user.email,
      notelp: user.notelp,
      role: user.role,
      accessToken,
      refreshToken,
    };
  },

  async refresh(refreshToken) {
    const decoded = verifyRefreshToken(refreshToken);

    await validateRefresh(refreshToken);

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });

    return {
      accessToken: newAccessToken,
    };
  },

  async logout(refreshToken) {
    if (!refreshToken) {
      throw new UnauthorizedError(MESSAGE.TOKEN.INVALID);
    }

    const deleted = await prisma.token.deleteMany({
      where: { refreshToken },
    });

    if (deleted.count === 0) {
      throw new UnauthorizedError(MESSAGE.TOKEN.INVALID);
    }

    return true;
  },
};
