import User from "../models/User.js";
import bcrypt from "bcryptjs";

/* GET PROFILE */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* CHANGE PASSWORD */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect password" });

    user.password = newPassword; // hashed by pre-save hook
    await user.save();

    res.json({ message: "Password updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ENABLE 2FA */
export const enable2FA = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.twoFactorEnabled = true;
    await user.save();

    const updatedUser = await User.findById(userId).select("-password");

    res.json(updatedUser); // 👈 THIS is the key fix

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};