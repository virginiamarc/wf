import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    cost: {
      type: Number,
      required: true,
      min: 0
    },

    category: {
      type: String,
      default: "general"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Reward", rewardSchema);
