import express from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { DailyTrackingController } from "../controllers/daily-tracking.controller.js";
import { createDailyTrackingValidation } from "../validations/daily-tracking.validation.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", validate(createDailyTrackingValidation), DailyTrackingController.create);
router.get("/history", DailyTrackingController.getHistoryByUserId);

export default router;
