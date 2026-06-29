import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import { createServer } from "http";
import { Server } from "socket.io";

import blockchainRoutes from "./routes/blockchainRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/blockchain", blockchainRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5174"],
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  socket.on('joinRoom', (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    // User disconnected
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

server.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

export { io };
