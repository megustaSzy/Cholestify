// src/routes/auth.route.js
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
  authForgotSchema,
  authLoginSchema,
  authRegisterSchema,
  authResetPasswordSchema,
  authResetTokenQuerySchema,
} from "../validations/auth.validation.js";
import { forgotPasswordLimiter } from "../middlewares/rate-limit.middleware.js";
import { validateQuery } from "../middlewares/validation-query.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API Autentikasi (Register, Login, dll)
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrasi user baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nama, email, password, notelp]
 *             properties:
 *               nama: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               notelp: { type: string }
 *               dob: { type: string, format: date }
 *               bloodType: { type: string }
 *     responses:
 *       201:
 *         description: Berhasil registrasi
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login akun
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, password]
 *             properties:
 *               identifier: { type: string, description: "Email atau Nomor Telepon" }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Berhasil login
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token berhasil diperbarui
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout akun
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Berhasil logout
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Dapatkan data profile (Auth route)
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data diri
 */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Kirim email reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Email reset terkirim
 */

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password dengan token
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password, confirmPassword]
 *             properties:
 *               password: { type: string }
 *               confirmPassword: { type: string }
 *     responses:
 *       200:
 *         description: Password berhasil diubah
 */

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Login menggunakan Google OAuth
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect ke halaman login Google
 */

router.post("/register", validate(authRegisterSchema), AuthController.register);
router.post("/login", validate(authLoginSchema), AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.get("/me", authMiddleware, AuthController.getMe);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validate(authForgotSchema),
  AuthController.forgotPassword,
);
router.post(
  "/reset-password",
  validateQuery(authResetTokenQuerySchema),
  validate(authResetPasswordSchema),
  AuthController.resetPassword,
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
  }),
  AuthController.googleCallback,
);

export default router;
