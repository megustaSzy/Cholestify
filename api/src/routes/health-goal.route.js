import { Router } from "express";
import { HealthGoalController } from "../controllers/health-goal.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { healthGoalSchema } from "../validations/health-goal.validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: HealthGoal
 *   description: API untuk Target Kesehatan Mingguan
 * 
 * components:
 *   schemas:
 *     HealthGoalResponse:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         userId: { type: integer, example: 2 }
 *         startDate: { type: string, format: date-time, example: "2024-05-13T00:00:00.000Z" }
 *         endDate: { type: string, format: date-time, example: "2024-05-19T23:59:59.999Z" }
 *         targetWeeklyCalories: { type: number, example: 15000 }
 *         targetExerciseMins: { type: number, example: 150 }
 *         isActive: { type: boolean, example: true }
 *     ProgressResponse:
 *       type: object
 *       properties:
 *         caloriesProgress: { type: number, example: 2500 }
 *         proteinProgress: { type: number, example: 120 }
 *         exerciseProgress: { type: number, example: 45 }
 *         daysPassed: { type: integer, example: 3 }
 */

/**
 * @swagger
 * /api/health-goals/me:
 *   get:
 *     summary: Dapatkan target kesehatan mingguan (aktif saat ini)
 *     tags: [HealthGoal]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data health goals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/HealthGoalResponse' }
 */

/**
 * @swagger
 * /api/health-goals/progress:
 *   get:
 *     summary: Dapatkan progres target mingguan berdasarkan daily tracking
 *     tags: [HealthGoal]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil progress mingguan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/ProgressResponse' }
 */

/**
 * @swagger
 * /api/health-goals:
 *   post:
 *     summary: Set target kesehatan mingguan baru
 *     tags: [HealthGoal]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [targetWeeklyCalories, targetExerciseMins]
 *             properties:
 *               targetWeeklyCalories: { type: number, example: 15000 }
 *               targetExerciseMins: { type: number, example: 150 }
 *     responses:
 *       201:
 *         description: Target kesehatan berhasil disimpan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/HealthGoalResponse' }
 */

router.get("/me", authMiddleware, HealthGoalController.getMyHealthGoals);
router.get("/progress", authMiddleware, HealthGoalController.getProgress);

router.post(
  "/",
  authMiddleware,
  validate(healthGoalSchema),
  HealthGoalController.create,
);

export default router;
