import { Router } from "express";

import { HealthRecommendationController } from "../controllers/health-recommendation.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: HealthRecommendation
 *   description: API Rekomendasi Kesehatan berbasis AI/Sistem
 * 
 * components:
 *   schemas:
 *     OverviewResponse:
 *       type: object
 *       properties:
 *         score: { type: number, example: 85 }
 *         summary: { type: string, example: "Kondisi Anda cukup baik, tetap jaga pola makan." }
 *         riskLevel: { type: string, example: "LOW" }
 *     RecommendationResponse:
 *       type: object
 *       properties:
 *         lifestyle:
 *           type: array
 *           items: { type: string, example: "Olahraga 30 menit sehari" }
 *         nutrition:
 *           type: array
 *           items: { type: string, example: "Kurangi makanan berminyak" }
 */

/**
 * @swagger
 * /api/health-recommendations/overview:
 *   get:
 *     summary: Mendapatkan overview ringkasan rekomendasi (berdasarkan data lab & biometrik)
 *     tags: [HealthRecommendation]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil overview
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/OverviewResponse' }
 */

/**
 * @swagger
 * /api/health-recommendations/me:
 *   get:
 *     summary: Mendapatkan detail rekomendasi kesehatan (Lifestyle & Nutrition)
 *     tags: [HealthRecommendation]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil rekomendasi detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/RecommendationResponse' }
 */

router.get(
  "/overview",
  authMiddleware,
  HealthRecommendationController.getOverview,
);

router.get(
  "/me",
  authMiddleware,
  HealthRecommendationController.getMyRecommendations,
);

export default router;
