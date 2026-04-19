import { Router } from "express";
import { UserService } from "../services/user.service.js";

const router = Router();

router.get("/", UserService.getUsers);

export default router;
