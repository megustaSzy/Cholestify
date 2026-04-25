import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { ownerOrAdmin } from "../middlewares/owner-or-admin.middleware.js";

const router = Router();

router.post("/", authMiddleware, roleMiddleware("ADMIN"), UserController.createUser);
router.get("/", authMiddleware, roleMiddleware("ADMIN"), UserController.getUsers);
router.get("/:id", authMiddleware, ownerOrAdmin("id"), UserController.getUsersById);
router.patch("/:id", authMiddleware, ownerOrAdmin("id"), UserController.updateById);
router.delete("/:id", authMiddleware, UserController.removeById);

export default router;
