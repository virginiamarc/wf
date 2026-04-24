import express from "express";
import { getRewards, redeemReward } from "../controllers/rewardsController.js";

const router = express.Router();

router.get("/", getRewards);
router.post("/redeem", redeemReward);

export default router;
