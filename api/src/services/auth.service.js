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
import { generateResetToken, hashToken } from "../utils/reset-token.util.js";
import { sendResetEmail } from "../utils/mailer.util.js";
import { BadRequestError } from "../exceptions/BadRequestError.js";
import { AUTH_CONSTANT } from "../constants/auth.constant.js";
import { generatePatientCode } from "../utils/generate-patient-code.util.js";
import { InternalServerError } from "../exceptions/InternalServerError.js";

export const AuthService = {
  async register(body) {
    const { email, nama, password, notelp, dob, bloodType } = body;

    await checkConflictUser(
      prisma.user,
      email,
      MESSAGE.USER.EMAIL_ALREADY_USED,
    );

    const hashedPassword = await bcrypt.hash(
      password,
      AUTH_CONSTANT.BCRYPT_SALT_ROUNDS,
    );

    let user;

    for (let i = 0; i < 5; i++) {
      try {
        user = await prisma.user.create({
          data: {
            nama,
            email,
            password: hashedPassword,
            notelp,
            dob: dob ? new Date(dob) : null,
            bloodType,
            role: ROLE.USER,
            patientId: generatePatientCode(),
          },

          select: {
            id: true,
            patientId: true,
            nama: true,
            email: true,
            notelp: true,
            dob: true,
            bloodType: true,
            role: true,
            createdAt: true,
          },
        });

        return user;
      } catch (error) {
        if (error.code === "P2002") {
          continue;
        }

        throw error;
      }
    }

    throw new InternalServerError("Gagal membuat patient ID");
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
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        notelp: user.notelp,
        role: user.role,
      },
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

    return { accessToken: newAccessToken };
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

  async forgotPassword(body) {
    const { email } = body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return true;

    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    const rawToken = generateResetToken();
    const hashedToken = hashToken(rawToken);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt: new Date(Date.now() + AUTH_CONSTANT.RESET_TOKEN_EXPIRE),
      },
    });

    await sendResetEmail(user.email, rawToken);

    return true;
  },

  async resetPassword(token, body) {
    const { password } = body;

    const hashedToken = hashToken(token);

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        token: hashedToken,
      },
    });

    if (!resetToken || resetToken.expiresAt <= new Date()) {
      throw new BadRequestError(MESSAGE.AUTH.RESET_TOKEN_INVALID);
    }

    const hashedPassword = await bcrypt.hash(
      password,
      AUTH_CONSTANT.BCRYPT_SALT_ROUNDS,
    );

    await prisma.user.update({
      where: {
        id: resetToken.userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: resetToken.userId,
      },
    });

    return true;
  },

  async googleLogin(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.token.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        id: user.id,
        patientId: user.patientId,

        nama: user.nama,
        email: user.email,

        notelp: user.notelp,

        dob: user.dob,
        bloodType: user.bloodType,

        role: user.role,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  },
};
