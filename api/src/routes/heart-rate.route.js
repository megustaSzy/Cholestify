import { Router } from "express";

import { HeartRateController } from "../controllers/heart-rate.controller.js";

import { validate } from "../middlewares/validation.middleware.js";

import { heartRateSchema } from "../validations/heart-rate.validation.js";

const router = Router();

router.post("/", validate(heartRateSchema), HeartRateController.calculate);

export default router;
