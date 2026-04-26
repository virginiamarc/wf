import { getProfile } from "./wf-api.js";

async function loadRewards() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const user = await getProfile();

    const points = user.points || 0;

    document.getElementById("currentPoints").textContent = points;

    const nextTier = Math.ceil(points / 100) * 100;
    const remaining = nextTier - points;

    document.getElementById("nextReward").textContent =
      remaining === 0 ? "Reward ready!" : `${remaining} pts until reward`;

  } catch (err) {
    console.error("Failed to load rewards:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadRewards);