import { Router } from "express";

import { LipidPanelController } from "../controllers/lipid-panel.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerOrAdmin } from "../middlewares/owner-or-admin.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

// ADMIN
// ADMIN
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  LipidPanelController.getLipidPanels,
);

// USER
router.get("/me", authMiddleware, LipidPanelController.getLipidPanelByUserId);
router.post("/", authMiddleware, LipidPanelController.createLipidPanel);

// ADMIN ONLY
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  LipidPanelController.updateLipidPanel,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  LipidPanelController.deleteLipidPanel,
);

export default router;
