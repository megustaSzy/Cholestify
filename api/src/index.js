import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { requestLogger } from "./middlewares/logger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { swaggerUi, swaggerSpec } from "./docs/swagger.js";

import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(requestLogger);

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Welcome API Cholestify",
    metadata: {
      status: 200,
    },
  });
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

// swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// wajib paling bawah
app.use(errorHandler);

export default app;
