import express from "express";
import { addPoints, getPoints } from "../controllers/pointsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* GET LOGGED-IN USER POINTS */
router.get("/", verifyToken, getPoints);

/* ADD POINTS AFTER PURCHASE */
router.post("/add", verifyToken, addPoints);

export default router;