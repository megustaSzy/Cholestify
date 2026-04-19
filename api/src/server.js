import app from "./index.js";

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
