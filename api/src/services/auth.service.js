// src/services/auth.service.js
import { prisma } from "../lib/prisma.js";
import { checkConflictUser } from "../utils/checkConflictUser.js";
import { emailExist } from "../utils/emailExist.js";
import bcrypt from "bcryptjs";
import { notExist } from "../utils/notExist.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { UnauthorizedError } from "../exceptions/UnauthorizedError.js";
import { HttpStatus } from "../constants/httpStatus.js";
import { validateRefresh } from "../utils/validateRefresh.js";

export const AuthService = {
  async register(body) {
    const { email, nama, password, notelp, role } = body;

    await checkConflictUser(
      prisma.user,
      email,
      process.env.USER_EMAIL_ALREADY_EXISTS_MESSAGE,
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        notelp,
        role: role || "USER",
      },
    });

    return {
      id: user.id,
      nama: user.nama,
      email: user.email,
      notelp: user.notelp,
      role: user.role,
    };
  },

  async login(body) {
    const { email, password } = body;

    const user = await notExist(
      prisma.user,
      { email },
      process.env.USER_NOT_FOUND_MESSAGE,
    );

    await emailExist(
      password,
      user.password,
      process.env.USER_LOGIN_FAILED_MESSAGE,
    );

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
      throw new UnauthorizedError(process.env.TOKEN_BAD_REQUEST);
    }

    const deleted = await prisma.token.deleteMany({
      where: { refreshToken },
    });

    if (deleted.count === 0) {
      throw new UnauthorizedError(process.env.TOKEN_BAD_REQUEST);
    }

    return true;
  },
};
