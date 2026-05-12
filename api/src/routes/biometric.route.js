import { Router } from "express";
import { BiometricController } from "../controllers/biometric.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

// USER
router.get("/me", authMiddleware, BiometricController.getMyBiometric);
router.post("/me", authMiddleware, BiometricController.createBiometric);
router.patch("/me", authMiddleware, BiometricController.updateBiometric);


// ADMIN
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  BiometricController.getBiometric,
);

router.post(
  "/:profileId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  BiometricController.createBiometric,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  BiometricController.updateBiometric,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  BiometricController.deleteBiometric,
);
export default router;
