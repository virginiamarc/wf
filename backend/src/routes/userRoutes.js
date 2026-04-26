import express from "express";
import { getProfile, changePassword, enable2FA } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", verifyToken, getProfile);
router.post("/change-password", verifyToken, changePassword);
router.post("/enable-2fa", verifyToken, enable2FA);

export default router;
