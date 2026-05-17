import { Router } from "express";

import { HealthRecommendationController } from "../controllers/health-recommendation.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/overview",
  authMiddleware,
  HealthRecommendationController.getOverview,
);

router.get(
  "/me",
  authMiddleware,
  HealthRecommendationController.getRecommendations,
);

export default router;
