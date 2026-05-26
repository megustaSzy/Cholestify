import { createServer } from "http";
import { Server } from "socket.io";
import app from "./index.js";

const PORT = process.env.PORT || 3001;

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`[WebSocket] Client Connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`[WebSocket] Client Disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server & WebSocket running in http://localhost:${PORT}`);
});

// test deployment
