import { Router } from "express";

import upload from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import { ScreeningController } from "../controllers/screening.controller.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  ScreeningController.create,
);

router.get("/me", authMiddleware, ScreeningController.getMyScreenings);
router.get("/me/export/pdf", authMiddleware, ScreeningController.exportMyScreeningsPDF);

export default router;
