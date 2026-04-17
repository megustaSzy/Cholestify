const express = require("express");
const dotenv = require("dotenv");
const app = express();

dotenv.config();
const PORT = process.env.PORT;

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Welcome API Cholestify",
    metadata: {
      status: 200,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
