import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import router from "./src/routes/authenroutes.js";
import serviceRoutes from "./src/routes/serviceRoutes.js";
import serviceRequestRoutes from "./src/routes/serviceRequestRoutes.js";
import pushRoutes from "./src/routes/pushRoutes.js";
import { initializeSocket } from "./src/service/socketService.js";
import { startRequestExpiryScheduler } from "./src/service/requestExpiryService.js";

import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

const corsOrigin = (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  return callback(new Error("Not allowed by CORS"));
};

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

// Initialize Socket.IO
initializeSocket(io);

// Middleware
app.use(
  cors({
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

// ========== Routes ==========
app.use("/api/auth", router);
app.use("/api/services", serviceRoutes);
app.use("/api/servicerequests", serviceRequestRoutes);
app.use("/api/push", pushRoutes);

// Server
const PORT = process.env.PORT;

const startServer = async () => {
  await connectDB();
  // Start background scheduler that auto-cancels old pending service requests
  startRequestExpiryScheduler();
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.IO server initialized`);
  });
};
const swaggerDocument = YAML.load("./openapi.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

console.log("Server now:", new Date());
console.log(swaggerDocument);

startServer();
