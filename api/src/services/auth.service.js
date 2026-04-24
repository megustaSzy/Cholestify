// src/services/auth.service.js
import { prisma } from "../lib/prisma.js";
import { checkConflictUser } from "../utils/checkConflictUser.js";
import { emailExist } from "../utils/emailExist.js";
import { createError } from "../exceptions/createError.js";
import bcrypt from "bcryptjs";
import { notExist } from "../utils/notExist.js";

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

    return {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role,
    };
  },
};
