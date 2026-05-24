import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { FoodController } from "../controllers/food.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Food
 *   description: API untuk Rekomendasi Makanan
 * 
 * components:
 *   schemas:
 *     FoodResponse:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         name: { type: string, example: "Ampas Tahu" }
 *         calories: { type: number, example: 414 }
 *         proteins: { type: number, example: 26.6 }
 *         fat: { type: number, example: 18.3 }
 *         status: { type: string, example: "LIMIT" }
 *         isRecommended: { type: boolean, example: false }
 */

/**
 * @swagger
 * /api/foods/public:
 *   get:
 *     summary: Dapatkan daftar makanan (Publik / Tanpa Login)
 *     tags: [Food]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Berhasil mengambil data makanan publik
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 metadata: { $ref: '#/components/schemas/PaginatedMetadata' }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/FoodResponse' }
 */

/**
 * @swagger
 * /api/foods:
 *   get:
 *     summary: Dapatkan rekomendasi makanan berdasarkan kondisi lipid terakhir
 *     tags: [Food]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [OPTIMAL, NEUTRAL, LIMIT] }
 *     responses:
 *       200:
 *         description: Berhasil mengambil data rekomendasi makanan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 metadata: { $ref: '#/components/schemas/PaginatedMetadata' }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/FoodResponse' }
 */

router.get("/public", FoodController.getPublicFoods);
router.get("/", authMiddleware, FoodController.getFoodsByUserId);

export default router;
