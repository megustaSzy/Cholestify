import { Router } from "express";

import { BiometricController } from "../controllers/biometric.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerOrAdmin } from "../middlewares/owner-or-admin.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Biometric
 *   description: API untuk input dan kelola data fisik (Tinggi, Berat, BMI)
 * 
 * components:
 *   schemas:
 *     BiometricResponse:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         userId: { type: integer, example: 2 }
 *         heightCm: { type: number, example: 175 }
 *         weightKg: { type: number, example: 70 }
 *         bmi: { type: number, example: 22.86 }
 *         createdAt: { type: string, format: date-time, example: "2024-05-16T10:00:00.000Z" }
 *         updatedAt: { type: string, format: date-time, example: "2024-05-16T10:00:00.000Z" }
 */

/**
 * @swagger
 * /api/biometrics/me:
 *   get:
 *     summary: Dapatkan data biometrik diri sendiri
 *     tags: [Biometric]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data biometrik
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/BiometricResponse' }
 */

/**
 * @swagger
 * /api/biometrics:
 *   post:
 *     summary: Input data biometrik baru (Otomatis hitung BMI)
 *     tags: [Biometric]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [heightCm, weightKg]
 *             properties:
 *               heightCm: { type: number, example: 175 }
 *               weightKg: { type: number, example: 70 }
 *     responses:
 *       201:
 *         description: Berhasil menambahkan data biometrik
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/BiometricResponse' }
 * 
 *   patch:
 *     summary: Update data biometrik (Tinggi/Berat)
 *     tags: [Biometric]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               heightCm: { type: number, example: 176 }
 *               weightKg: { type: number, example: 68 }
 *     responses:
 *       200:
 *         description: Berhasil update data biometrik
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/BiometricResponse' }
 */

// ADMIN
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  BiometricController.getBiometric,
);

// USER
router.get("/me", authMiddleware, BiometricController.getMyBiometrics);
router.post("/", authMiddleware, BiometricController.createBiometric);
router.patch("/", authMiddleware, BiometricController.updateBiometric);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  BiometricController.deleteBiometric,
);

export default router;
