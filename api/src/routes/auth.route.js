import { Router } from "express";
import { AuthService } from "../services/auth.service.js";

const router = Router();

router.post("/register", AuthService.registerUser);
router.post("/login", AuthService.loginUser);

export default router;
