import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller.js";

const router = Router();

router.get("/", ProfileController.getProfile);

export default router;
