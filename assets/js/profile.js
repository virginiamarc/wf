import { getProfile, changePassword, enable2FA } from "./wf-api.js";

/* -----------------------------
   AUTH HELPERS
------------------------------ */
function getToken() {
  return localStorage.getItem("token");
}

/* -----------------------------
   LOAD USER
------------------------------ */
async function loadUser() {
  const token = getToken();
  const info = document.getElementById("profileInfo");
  const pointsEl = document.getElementById("profilePoints");

  if (!token) {
    info.innerHTML = "<p>Please log in.</p>";
    return;
  }

  try {
    const user = await getProfile();

    info.innerHTML = `
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>2FA:</strong> ${user.twoFactorEnabled ? "Enabled" : "Disabled"}</p>
    `;

    pointsEl.textContent = user.points || 0;

  } catch (err) {
    console.error(err);
    info.innerHTML = "<p>Error loading profile.</p>";
  }
}

/* -----------------------------
   ORDERS
------------------------------ */
async function loadOrders() {
  const token = getToken();
  const container = document.getElementById("profileOrders");

  if (!token) return;

  const res = await fetch("http://localhost:5000/api/orders/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const orders = await res.json();

  if (!orders.length) {
    container.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  container.innerHTML = orders.map(order => `
    <div class="order-card">
      <h3>Order - ${new Date(order.date).toLocaleDateString()}</h3>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>

      <ul>
        ${order.items.map(item => `
          <li>${item.title} ×${item.quantity} — $${item.price}</li>
        `).join("")}
      </ul>
    </div>
  `).join("");
}

/* -----------------------------
   PASSWORD CHANGE
------------------------------ */
async function handlePasswordChange() {
  const current = document.getElementById("currentPassword").value;
  const next = document.getElementById("newPassword").value;

  try {
    const res = await changePassword(current, next);
    alert(res.message);
  } catch (err) {
    alert("Password change failed");
  }
}

/* -----------------------------
   2FA TOGGLE
------------------------------ */
async function enable2FAHandler() {
  try {
    const res = await enable2FA();
    alert(res.message);
    loadUser();
  } catch (err) {
    alert("Failed to enable 2FA");
  }
}

/* -----------------------------
   LOGOUT
------------------------------ */
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("wfUser");
  window.location.href = "index.html";
}

/* -----------------------------
   INIT
------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  loadUser();
  loadOrders();

  document.getElementById("logoutBtn")?.addEventListener("click", logout);
  document.getElementById("enable2faBtn")?.addEventListener("click", enable2FAHandler);
  document.getElementById("changePasswordBtn")?.addEventListener("click", handlePasswordChange);
});