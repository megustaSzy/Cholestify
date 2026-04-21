import { Router } from "express";
import { UserService } from "../services/user.service.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API User
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Ambil semua user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data user
 */
router.get("/", UserService.getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Ambil user berdasarkan ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail user
 *       404:
 *         description: User tidak ditemukan
 */
router.get("/:id", UserService.getUsersById);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 example: Raditya Ahmad
 *               email:
 *                 type: string
 *                 example: radit@gmail.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *               notelp:
 *                 type: string
 *                 example: "08123456789"
 *     responses:
 *       200:
 *         description: Berhasil update user
 *       404:
 *         description: User tidak ditemukan
 */
router.patch("/:id", UserService.update);
router.delete("/:id", UserService.delete);

export default router;
