import { Router } from "express";
import { HealthGoalController } from "../controllers/health-goal.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { healthGoalSchema } from "../validations/health-goal.validation.js";

const router = Router();

// Endpoint ini pakai /me karena ambil user ID dari token
router.get("/me", authMiddleware, HealthGoalController.getHistoryByUserId);

router.post(
  "/",
  authMiddleware,
  validate(healthGoalSchema),
  HealthGoalController.create,
);

export default router;
