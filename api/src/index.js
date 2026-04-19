import express from "express";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";

dotenv.config();

const app = express();

app.use(express.json());

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

export default app;
