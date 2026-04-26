import Order from "../models/Order.js";

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;

    console.log("🔥 ORDER RECEIVED FROM FRONTEND:");
    console.log(JSON.stringify(items, null, 2));


    const order = await Order.create({
      userId: req.user.id,
      items,
      total
    });

    res.status(201).json(order);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};