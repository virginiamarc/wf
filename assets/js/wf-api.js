const API = "http://localhost:5000";

/**
 * LOGIN USER (REAL BACKEND)
 */
export async function login(email, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  return res.json();
}

/**
 * REGISTER USER
 */
export async function register(name, email, password) {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  });

  return res.json();
}

/**
 * GET USER PROFILE
 */
export async function getUser(userId) {
  const res = await fetch(`${API}/api/auth/me/${userId}`);
  return res.json();
}

/**
 * GET REWARDS
 */
export async function getRewards() {
  const res = await fetch(`${API}/api/rewards`);
  return res.json();
}

/**
 * REDEEM REWARD
 */
export async function redeemReward(userId, rewardId) {
  const res = await fetch(`${API}/api/rewards/redeem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId, rewardId })
  });

  return res.json();
}

/**
 * ADD POINTS (after purchase)
 */
export async function addPoints(userId, amountSpent) {
  const res = await fetch(`${API}/api/points/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId, amountSpent })
  });

  return res.json();
}