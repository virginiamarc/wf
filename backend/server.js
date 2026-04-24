import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";
import pointsRoutes from "./routes/pointsRoutes.js";

dotenv.config();

// DB connection
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    credentials: true
  })
);

app.use(express.json());

/**
 * ROUTES
 */
app.use("/api/auth", authRoutes);
//app.use("/api/rewards", rewardRoutes);
//app.use("/api/points", pointsRoutes);

/**
 * HEALTH CHECK
 */
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running..." });
});

/**
 * START SERVER
 */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/**
 * GLOBAL ERROR HANDLER (optional safety net)
 */
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err.message);
  server.close(() => process.exit(1));
});