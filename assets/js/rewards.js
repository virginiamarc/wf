async function loadRewards() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const user = await res.json();

    // show current points
    document.getElementById("currentPoints").textContent = user.points;

    // calculate next reward tier (example: every 100 points)
    const nextTier = Math.ceil((user.points || 0) / 100) * 100;
    const remaining = nextTier - user.points;

    document.getElementById("nextReward").textContent =
      remaining === 0 ? "Reward ready!" : `${remaining} pts until reward`;

  } catch (err) {
    console.error("Failed to load rewards:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadRewards);