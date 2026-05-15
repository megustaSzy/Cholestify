import { Router } from "express";

import { LipidPanelController } from "../controllers/lipid-panel.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerOrAdmin } from "../middlewares/owner-or-admin.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Lipid Panel
 *   description: Endpoint data lipid panel pengguna
 */

// ADMIN
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  LipidPanelController.getLipidPanels,
);

/**
 * @swagger
 * /api/lipid-panels/{id}:
 *   get:
 *     summary: Ambil data lipid panel berdasarkan User ID
 *     tags: [Lipid Panel]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pengguna
 *     responses:
 *       200:
 *         description: Data lipid panel berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Parameter ID tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Data lipid panel tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// USER / ADMIN
router.get(
  "/:id",
  authMiddleware,
  ownerOrAdmin("id"),
  LipidPanelController.getLipidPanelByUserId,
);

/**
 * @swagger
 * /api/lipid-panels:
 *   post:
 *     summary: Tambah data lipid panel untuk pengguna yang sedang login
 *     tags: [Lipid Panel]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [totalCholesterol, triglycerides, ldl, hdl]
 *             properties:
 *               totalCholesterol:
 *                 type: number
 *                 format: float
 *                 example: 180
 *                 description: Total kolesterol (mg/dL), target < 200 mg/dL
 *               triglycerides:
 *                 type: number
 *                 format: float
 *                 example: 120
 *                 description: Trigliserida (mg/dL), target < 150 mg/dL
 *               ldl:
 *                 type: number
 *                 format: float
 *                 example: 90
 *                 description: LDL / bad cholesterol (mg/dL), target < 100 mg/dL
 *               hdl:
 *                 type: number
 *                 format: float
 *                 example: 55
 *                 description: "HDL / good cholesterol (mg/dL), target > 40 mg/dL (pria) atau > 50 mg/dL (wanita)"
 *     responses:
 *       201:
 *         description: Data lipid panel berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validasi gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Data lipid panel sudah ada untuk user ini
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", authMiddleware, LipidPanelController.createLipidPanel);

/**
 * @swagger
 * /api/lipid-panels/{id}:
 *   patch:
 *     summary: Update data lipid panel berdasarkan User ID
 *     tags: [Lipid Panel]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pengguna
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalCholesterol:
 *                 type: number
 *                 format: float
 *                 example: 195
 *                 description: Total kolesterol (mg/dL)
 *               triglycerides:
 *                 type: number
 *                 format: float
 *                 example: 130
 *                 description: Trigliserida (mg/dL)
 *               ldl:
 *                 type: number
 *                 format: float
 *                 example: 85
 *                 description: LDL / bad cholesterol (mg/dL)
 *               hdl:
 *                 type: number
 *                 format: float
 *                 example: 60
 *                 description: HDL / good cholesterol (mg/dL)
 *     responses:
 *       200:
 *         description: Data lipid panel berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Parameter ID tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Data lipid panel tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  "/:id",
  authMiddleware,
  ownerOrAdmin("id"),
  LipidPanelController.updateLipidPanel,
);

// ADMIN
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  LipidPanelController.deleteLipidPanel,
);

export default router;
