import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Welcome API Cholestify",
    metadata: {
      status: 200,
    },
  });
});

export default app;
