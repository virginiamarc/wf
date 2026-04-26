import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },   // ⭐ CRITICAL
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: String,
      flavors: [String]
    }
  ],

  total: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);