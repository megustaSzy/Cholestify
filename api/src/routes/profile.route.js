import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/me", authMiddleware, ProfileController.getMyProfile);

router.patch("/me", authMiddleware, ProfileController.updateMyProfile);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  ProfileController.getProfiles,
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  ProfileController.getProfileById,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  ProfileController.updateProfile,
);

export default router;
