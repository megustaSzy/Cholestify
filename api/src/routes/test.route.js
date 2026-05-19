import { Router } from "express";
import upload from "../middlewares/upload.middleware.js";
import { TestController } from "../controllers/test.controller.js";

const router = Router();

router.post(
  "/upload",
  upload.single("image"),
  TestController.testUploadCloudinary,
);

export default router;
