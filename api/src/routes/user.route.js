import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router = Router();

router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUsersById);
router.patch("/:id", UserController.updateById);
router.delete("/:id", UserController.removeById);

export default router;
