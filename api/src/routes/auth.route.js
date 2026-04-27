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
import passport from "passport";

const router = Router();

router.post("/register", validate(authRegisterSchema), AuthController.register);
router.post("/login", validate(authLoginSchema), AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);

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
