import { Router } from "express";

import { LipidPanelController } from "../controllers/lipid-panel.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerOrAdmin } from "../middlewares/owner-or-admin.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

// ADMIN
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  LipidPanelController.getLipidPanels,
);

router.post("/", authMiddleware, LipidPanelController.createLipidPanel);

router.patch(
  "/:id",
  authMiddleware,
  ownerOrAdmin("id"),
  LipidPanelController.updateLipidPanel,
);

// ADMIN
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  LipidPanelController.deleteLipidPanel,
);

export default router;
