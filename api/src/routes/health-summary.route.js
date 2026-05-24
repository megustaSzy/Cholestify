import { Router } from "express";

import { HealthSummaryController } from "../controllers/health-summary.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: HealthSummary
 *   description: API Ringkasan Dashboard (Biometric + Lipid Terakhir)
 * 
 * components:
 *   schemas:
 *     HealthSummaryResponse:
 *       type: object
 *       properties:
 *         biometric:
 *           type: object
 *           properties:
 *             heightCm: { type: number, example: 175 }
 *             weightKg: { type: number, example: 70 }
 *             bmi: { type: number, example: 22.86 }
 *         latestLipid:
 *           type: object
 *           properties:
 *             totalCholesterol: { type: number, example: 180 }
 *             ldl: { type: number, example: 100 }
 *             hdl: { type: number, example: 60 }
 *             triglycerides: { type: number, example: 120 }
 *         bmiCategory: { type: string, example: "NORMAL" }
 */

/**
 * @swagger
 * /api/health-summary:
 *   get:
 *     summary: Mendapatkan data dashboard gabungan biometrik dan lipid panel
 *     tags: [HealthSummary]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/HealthSummaryResponse' }
 */

router.get("/", authMiddleware, HealthSummaryController.getHealthSummary);

export default router;
