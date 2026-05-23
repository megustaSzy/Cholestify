import { Router } from "express";

import { BiometricController } from "../controllers/biometric.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerOrAdmin } from "../middlewares/owner-or-admin.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

// ADMIN
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  BiometricController.getBiometric,
);

// USER
router.get("/me", authMiddleware, BiometricController.getMyBiometrics);
router.post("/", authMiddleware, BiometricController.createBiometric);
router.patch("/", authMiddleware, BiometricController.updateBiometric);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  BiometricController.deleteBiometric,
);

export default router;
