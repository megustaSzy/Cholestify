import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { FoodController } from "../controllers/food.controller.js";

const router = Router();

router.get("/", authMiddleware, FoodController.getFoodsByUserId);

export default router;
