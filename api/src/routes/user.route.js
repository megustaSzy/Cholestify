import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { ownerOrAdmin } from "../middlewares/owner-or-admin.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

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
