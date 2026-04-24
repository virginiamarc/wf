import Reward from "../models/Reward.js";
import User from "../models/User.js";

/**
 * GET ALL REWARDS
 */
export const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.status(200).json(rewards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * CREATE REWARD
 */
export const createReward = async (req, res) => {
  try {
    const { title, points } = req.body;

    if (!title || points === undefined) {
      return res.status(400).json({ error: "Title and points are required" });
    }

    const reward = await Reward.create({ title, points });

    res.status(201).json(reward);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * REDEEM REWARD
 */
export const redeemReward = async (req, res) => {
  try {
    const { userId, rewardId } = req.body;

    if (!userId || !rewardId) {
      return res.status(400).json({ error: "Missing userId or rewardId" });
    }

    const user = await User.findById(userId);
    const reward = await Reward.findById(rewardId);

    if (!user || !reward) {
      return res.status(404).json({ error: "User or reward not found" });
    }

    if (user.points < reward.points) {
      return res.status(400).json({ error: "Not enough points" });
    }

    user.points -= reward.points;
    await user.save();

    res.status(200).json({
      message: "Reward redeemed successfully",
      remainingPoints: user.points
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};