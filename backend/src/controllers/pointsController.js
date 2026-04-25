import User from "../models/User.js";

/**
 * Add points when user makes a purchase
 * Example rule: $1 = 1 point
 */
export const addPoints = async (req, res) => {
  try {
    const { amountSpent } = req.body;

    if (amountSpent === undefined) {
      return res.status(400).json({ error: "Missing data" });
    }

    if (amountSpent <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    const pointsEarned = Math.floor(amountSpent);

    const user = await User.findById(req.user.id);

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


/**
 * GET USER POINTS
 */
export const getPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("points");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ points: user.points });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};