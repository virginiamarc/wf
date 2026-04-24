import express from "express";
import { addPoints, getPoints } from "../controllers/pointsController.js";

const router = express.Router();

router.get("/:userId", getPoints);
router.post("/add", addPoints);

export default router;
