import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { requestLogger } from "./middlewares/logger.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import { swaggerUi, swaggerSpec } from "./docs/swagger.js";

import UserRoute from "./routes/user.route.js";
import AuthRoute from "./routes/auth.route.js";

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

app.use("/api/users", UserRoute);
app.use("/api/auth", AuthRoute);

// swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// wajib paling bawah
app.use(errorHandler);

// console.log(process.env.SALT_ROUNDS)

export default app;
