import Reward from "../models/Reward.js";
import User from "../models/User.js";

/* GET ALL REWARDS */
export const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find().sort({ cost: 1 });
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* REDEEM A REWARD */
export const redeemReward = async (req, res) => {
  try {
    const { rewardId } = req.body;

    const user = await User.findById(req.user.id);
    const reward = await Reward.findById(rewardId);

    if (!user || !reward) {
      return res.status(404).json({ message: "User or reward not found" });
    }

    if (user.points < reward.cost) {
      return res.status(400).json({ message: "Not enough points" });
    }

    user.points -= reward.cost;

    user.rewardHistory.push({
      title: reward.title,
      points: reward.cost
    });

    await user.save();

    res.json({
      message: "Reward redeemed",
      remainingPoints: user.points
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};