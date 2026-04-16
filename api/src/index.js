const express = require("express");
const dotenv = require("dotenv");
const app = express();

dotenv.config();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
