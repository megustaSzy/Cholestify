import { Router } from "express";

import upload from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import { ScreeningController } from "../controllers/screening.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Screening
 *   description: API untuk Eye Scan (Mata) via AI
 * 
 * components:
 *   schemas:
 *     ScreeningResponse:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         userId: { type: integer, example: 2 }
 *         imageUrl: { type: string, example: "https://res.cloudinary.com/..." }
 *         result: { type: string, example: "INDIKASI_KUAT" }
 *         confidence: { type: number, example: 88.79 }
 *         description: { type: string, example: "Endapan lipid terdeteksi" }
 *         recommendation: { type: string, example: "Konsultasi segera." }
 *         probabilities:
 *           type: object
 *           properties:
 *             normal: { type: number, example: 9.05 }
 *             beresiko: { type: number, example: 2.16 }
 *             kolesterol: { type: number, example: 88.79 }
 *         createdAt: { type: string, format: date-time, example: "2024-05-16T10:00:00.000Z" }
 */

/**
 * @swagger
 * /api/screenings:
 *   post:
 *     summary: Upload gambar mata untuk diproses oleh AI
 *     tags: [Screening]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Foto mata (Maks 10MB)
 *               socketId:
 *                 type: string
 *                 description: ID socket (opsional) untuk realtime loading
 *     responses:
 *       201:
 *         description: Berhasil memindai mata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Berhasil melakukan screening mata" }
 *                 data: { $ref: '#/components/schemas/ScreeningResponse' }
 */
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  ScreeningController.create,
);

/**
 * @swagger
 * /api/screenings/me:
 *   get:
 *     summary: Dapatkan riwayat scan mata
 *     tags: [Screening]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Berhasil mengambil data riwayat scan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Berhasil mengambil riwayat screening" }
 *                 metadata: { $ref: '#/components/schemas/PaginatedMetadata' }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/ScreeningResponse' }
 */
router.get("/me", authMiddleware, ScreeningController.getMyScreenings);

/**
 * @swagger
 * /api/screenings/me/export/pdf:
 *   get:
 *     summary: Download riwayat scan mata dalam bentuk PDF
 *     tags: [Screening]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengunduh PDF (Mengembalikan file Blob/PDF)
 */
router.get("/me/export/pdf", authMiddleware, ScreeningController.exportMyScreeningsPDF);

export default router;
