import { use } from "react";
import { prisma } from "../lib/prisma.js";
import { checkConflictUser } from "../utils/checkConflictUser.js";
import bcrypt from "bcryptjs";

export const AuthService = {
  async registerUser(req, res, next) {
    try {
      const { email, nama, password, notelp } = req.body;

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

      return res.status(201).json({
        success: true,
        message: "Registrasi Berhasil",
        data: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          notelp: user.notelp,
          role: user.role,
        },
        metadata: {
          status: 201,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: process.env.USER_NOT_FOUND_MESSAGE,
          metadata: {
            status: 404,
          },
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Email atau password salah",
          metadata: {
            status: 400,
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: "Login berhasil",
        metadata: {
          status: 200,
        },
        data: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
