import { Router } from "express";
import { DailyTrackingController } from "../controllers/daily-tracking.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createDailyTrackingValidation } from "../validations/daily-tracking.validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: DailyTracking
 *   description: API untuk input asupan makanan dan olahraga harian
 * 
 * components:
 *   schemas:
 *     DailyTrackingResponse:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         date: { type: string, format: date-time, example: "2026-05-18T09:59:09.853Z" }
 *         calories: { type: number, example: 2000 }
 *         protein: { type: number, example: 60 }
 *         exerciseMins: { type: number, example: 45 }
 *         foodNotes: { type: string, example: "Ayam bakar dan sayur" }
 *         createdAt: { type: string, format: date-time, example: "2026-05-18T09:59:09.854Z" }
 */

/**
 * @swagger
 * /api/daily-trackings:
 *   post:
 *     summary: Input tracking harian (kalori, protein, dll)
 *     tags: [DailyTracking]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [calories, protein, exerciseMins]
 *             properties:
 *               calories: { type: number, example: 2000 }
 *               protein: { type: number, example: 60 }
 *               exerciseMins: { type: number, example: 45 }
 *               foodNotes: { type: string, example: "Ayam bakar dan sayur" }
 *     responses:
 *       201:
 *         description: Tracking harian berhasil disimpan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/DailyTrackingResponse' }
 */

/**
 * @swagger
 * /api/daily-trackings/history:
 *   get:
 *     summary: Lihat histori tracking harian diri sendiri
 *     tags: [DailyTracking]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil histori
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/DailyTrackingResponse' }
 */

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
