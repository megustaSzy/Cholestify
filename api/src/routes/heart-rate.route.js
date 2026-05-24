import { Router } from "express";

import { HeartRateController } from "../controllers/heart-rate.controller.js";

import { validate } from "../middlewares/validation.middleware.js";

import { heartRateSchema } from "../validations/heart-rate.validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: HeartRate
 *   description: API untuk Menghitung Zona Detak Jantung
 * 
 * components:
 *   schemas:
 *     HeartRateResponse:
 *       type: object
 *       properties:
 *         age: { type: number, example: 25 }
 *         mhr: { type: number, example: 195 }
 *         targetZone:
 *           type: object
 *           properties:
 *             min: { type: number, example: 136.5 }
 *             max: { type: number, example: 165.75 }
 */

/**
 * @swagger
 * /api/heart-rates:
 *   post:
 *     summary: Hitung zona detak jantung (MHR, Target) berdasarkan usia
 *     tags: [HeartRate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [age]
 *             properties:
 *               age: { type: number, example: 25 }
 *     responses:
 *       200:
 *         description: Berhasil menghitung zona detak jantung
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/HeartRateResponse' }
 */

router.post("/", validate(heartRateSchema), HeartRateController.calculate);

export default router;
