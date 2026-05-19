import { Router } from "express";
import { DailyTrackingController } from "../controllers/daily-tracking.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createDailyTrackingValidation } from "../validations/daily-tracking.validation.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validate(createDailyTrackingValidation),
  DailyTrackingController.create,
);

router.get(
  "/history",
  authMiddleware,
  DailyTrackingController.getHistoryByUserId,
);

export default router;
