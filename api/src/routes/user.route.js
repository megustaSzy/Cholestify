import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { ownerOrAdmin } from "../middlewares/owner-or-admin.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API untuk manajemen pengguna (Users)
 * 
 * components:
 *   schemas:
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         patientId:
 *           type: string
 *           example: "PT-12345678"
 *         nama:
 *           type: string
 *           example: "Budi Santoso"
 *         email:
 *           type: string
 *           format: email
 *           example: "budi@example.com"
 *         notelp:
 *           type: string
 *           example: "08123456789"
 *         dob:
 *           type: string
 *           format: date-time
 *           example: "1995-06-15T00:00:00.000Z"
 *         bloodType:
 *           type: string
 *           example: "O"
 *         avatar:
 *           type: string
 *           nullable: true
 *           example: "https://res.cloudinary.com/demo/image/upload/v12345/avatar.jpg"
 *         role:
 *           type: string
 *           example: "USER"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-05-16T10:00:00.000Z"
 */



/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Dapatkan profil diri sendiri
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil profil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Data user berhasil ditemukan" }
 *                 data: { $ref: '#/components/schemas/UserResponse' }
 */

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update profil pengguna (mendukung upload avatar)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama: { type: string }
 *               email: { type: string }
 *               notelp: { type: string }
 *               dob: { type: string, format: date }
 *               bloodType: { type: string }
 *               avatar: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Berhasil update data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/UserResponse' }
 */

/**
 * @swagger
 * /api/users/{id}/avatar:
 *   delete:
 *     summary: Hapus avatar pengguna
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil hapus avatar (set null)
 */

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  UserController.createUser,
);
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  UserController.getUsers,
);
router.get("/me", authMiddleware, UserController.getUsersById);
router.patch(
  "/:id",
  authMiddleware,
  ownerOrAdmin("id"),
  upload.single("avatar"),
  UserController.updateById,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  UserController.removeById,
);
router.delete(
  "/:id/avatar",
  authMiddleware,
  ownerOrAdmin("id"),
  UserController.removeAvatarById,
);

export default router;
