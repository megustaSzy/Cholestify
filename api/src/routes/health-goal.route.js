import { Router } from "express";
import { HealthGoalController } from "../controllers/health-goal.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { healthGoalSchema } from "../validations/health-goal.validation.js";

const router = Router();

router.get("/me", authMiddleware, HealthGoalController.getMyHealthGoals);
router.get("/progress", authMiddleware, HealthGoalController.getProgress);

router.post(
  "/",
  authMiddleware,
  validate(healthGoalSchema),
  HealthGoalController.create,
);

export default router;
