import { Router } from "express";

import { LipidPanelController } from "../controllers/lipid-panel.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { heavyTaskLimiter } from "../middlewares/rate-limit.middleware.js";
import { ownerOrAdmin } from "../middlewares/owner-or-admin.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
  createLipidPanelSchema,
  updateLipidPanelSchema,
} from "../validations/lipid-panel.validation.js";

const router = Router();

// ADMIN
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  LipidPanelController.getLipidPanels,
);

// USER
/**
 * @swagger
 * tags:
 *   name: LipidPanel
 *   description: API untuk Histori Pemeriksaan Darah (Kolesterol)
 * 
 * components:
 *   schemas:
 *     LipidPanelResponse:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         userId: { type: integer, example: 2 }
 *         date: { type: string, format: date-time, example: "2024-05-16T10:00:00.000Z" }
 *         totalCholesterol: { type: number, example: 180 }
 *         ldl: { type: number, example: 100 }
 *         hdl: { type: number, example: 60 }
 *         triglycerides: { type: number, example: 120 }
 *         createdAt: { type: string, format: date-time, example: "2024-05-16T10:00:00.000Z" }
 *         updatedAt: { type: string, format: date-time, example: "2024-05-16T10:00:00.000Z" }
 *     PaginatedMetadata:
 *       type: object
 *       properties:
 *         status: { type: integer, example: 200 }
 *         page: { type: integer, example: 1 }
 *         limit: { type: integer, example: 10 }
 *         totalItems: { type: integer, example: 32 }
 *         totalPages: { type: integer, example: 4 }
 *         prev: { type: string, nullable: true, example: null }
 *         next: { type: string, nullable: true, example: "?page=2&limit=10" }
 */

/**
 * @swagger
 * /api/lipid-panels/me:
 *   get:
 *     summary: Dapatkan riwayat pengecekan lipid panel (Kolesterol)
 *     tags: [LipidPanel]
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
 *         description: Berhasil mengambil data lipid panel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Data Lipid Panel berhasil ditemukan" }
 *                 metadata: { $ref: '#/components/schemas/PaginatedMetadata' }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/LipidPanelResponse' }
 */
router.get("/me", authMiddleware, LipidPanelController.getMyLipids);

/**
 * @swagger
 * /api/lipid-panels/me/export/pdf:
 *   get:
 *     summary: Download riwayat lipid panel dalam bentuk PDF
 *     tags: [LipidPanel]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengunduh PDF (Mengembalikan file Blob/PDF)
 */
router.get("/me/export/pdf", authMiddleware, LipidPanelController.exportMyLipidsPDF);

/**
 * @swagger
 * /api/lipid-panels:
 *   post:
 *     summary: Input hasil test lab lipid panel baru
 *     tags: [LipidPanel]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [totalCholesterol, ldl, hdl, triglycerides]
 *             properties:
 *               date: { type: string, format: date-time, example: "2024-05-16T10:00:00.000Z" }
 *               totalCholesterol: { type: number, example: 180 }
 *               ldl: { type: number, example: 100 }
 *               hdl: { type: number, example: 60 }
 *               triglycerides: { type: number, example: 120 }
 *     responses:
 *       201:
 *         description: Berhasil menyimpan data lab
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Berhasil menambahkan data Lipid Panel" }
 *                 metadata: { type: object, properties: { status: { type: integer, example: 201 } } }
 *                 data: { $ref: '#/components/schemas/LipidPanelResponse' }
 */
router.post(
  "/",
  authMiddleware,
  heavyTaskLimiter,
  validate(createLipidPanelSchema),
  LipidPanelController.createLipidPanel
);

// ADMIN ONLY
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validate(updateLipidPanelSchema),
  LipidPanelController.updateLipidPanel,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  LipidPanelController.deleteLipidPanel,
);

export default router;
