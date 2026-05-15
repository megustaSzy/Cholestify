import { Router } from "express";

import { HealthSummaryController } from "../controllers/health-summary.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, HealthSummaryController.getHealthSummary);

export default router;
