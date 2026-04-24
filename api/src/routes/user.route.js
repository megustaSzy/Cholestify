import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/", authMiddleware, roleMiddleware("ADMIN"), UserController.getUsers);
router.get("/:id", UserController.getUsersById);
router.patch("/:id", UserController.updateById);
router.delete("/:id", UserController.removeById);

export default router;
