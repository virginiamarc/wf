import User from "../models/User.js";

/**
 * Add points when user makes a purchase
 * Example rule: $1 = 1 point
 */
export const addPoints = async (req, res) => {
  try {
    const { userId, amountSpent } = req.body;

    if (!userId || amountSpent === undefined) {
      return res.status(400).json({ error: "Missing data" });
    }

    if (amountSpent <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    const pointsEarned = Math.floor(amountSpent);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.points = (user.points || 0) + pointsEarned;
    await user.save();

    res.status(200).json({
      message: "Points updated",
      pointsEarned,
      totalPoints: user.points
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};