import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";

import { requestLogger } from "./middlewares/logger.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import { swaggerUi, swaggerSpec } from "./docs/swagger.js";

import UserRoute from "./routes/user.route.js";
import AuthRoute from "./routes/auth.route.js";
import ProfileRoute from "./routes/profile.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(requestLogger);

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Welcome API Cholestify",
    metadata: { status: 200 },
  });
});

app.use("/api/users", UserRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/profiles", ProfileRoute);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;
