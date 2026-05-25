import rateLimit from "express-rate-limit";
import { HttpStatus } from "../constants/http-status.constant.js";

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Terlalu banyak permintaan, silahkan coba lagi nanti",
    metadata: {
      status: HttpStatus.MANY_REQUEST,
    },
  },
});

export const heavyTaskLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Server sedang sibuk. Tolong tunggu 1 menit sebelum mencoba lagi.",
    metadata: {
      status: HttpStatus.MANY_REQUEST,
    },
  },
});
