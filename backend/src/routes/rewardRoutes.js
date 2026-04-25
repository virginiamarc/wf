import express from "express";
import { getRewards, redeemReward } from "../controllers/rewardsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getRewards);
router.post("/redeem", verifyToken, redeemReward);

export default router;