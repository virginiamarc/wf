import express from "express";
import { getMyOrders, createOrder } from "../controllers/orderController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", verifyToken, getMyOrders);
router.post("/", verifyToken, createOrder);

export default router;