import { getProfile } from "./wf-api.js";
import { logout, requireAuthRedirect } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
    requireAuthRedirect();

    document.getElementById("signOutBtn")?.addEventListener("click", logout);
});

/* -----------------------------
   HELPERS
------------------------------ */
function getToken() {
  return localStorage.getItem("token");
}

/* -----------------------------
   LOAD USER
------------------------------ */
async function loadUser() {
  const info = document.getElementById("profileUser");
  const pointsEl = document.getElementById("profilePoints");

  if (!getToken()) {
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
   PASSWORD CHANGE
------------------------------ */
async function handlePasswordChange() {
  const current = document.getElementById("currentPassword")?.value;
  const next = document.getElementById("newPassword")?.value;
  const confirm = document.getElementById("confirmPassword")?.value;

  if (!current || !next || !confirm) {
    alert("Please fill in all password fields");
    return;
  }

  if (next !== confirm) {
    alert("New passwords do not match");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:5000/api/user/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        currentPassword: current,
        newPassword: next
      })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    alert("Password updated successfully");

  } catch (err) {
    alert(err.message);
  }
}
/* -----------------------------
   2FA
------------------------------ */
async function enable2FAHandler() {
  try {
    const res = await fetch("http://127.0.0.1:5000/api/user/enable-2fa", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const user = await res.json();

    if (!res.ok) throw new Error(user.error);

    alert("2FA enabled");

    // 👇 immediately update UI with fresh data
    const info = document.getElementById("profileUser");

    if (info) {
      info.innerHTML = `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>2FA:</strong> ${user.twoFactorEnabled ? "Enabled" : "Disabled"}</p>
      `;
    }

  } catch (err) {
    alert(err.message);
  }
}

/* -----------------------------
   FORGOT PASSWORD
------------------------------ */
function setupForgotPassword() {
  document.querySelector(".forgot-link")?.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = prompt("Enter your email:");
    if (!email) return;

    await fetch("http://127.0.0.1:5000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    alert("If account exists, reset email sent.");
  });
}

/* -----------------------------
   INIT
------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
    requireAuthRedirect();

    loadUser();
    setupForgotPassword();

    document.getElementById("logoutBtn")?.addEventListener("click", logout);
    document.getElementById("changePasswordBtn")?.addEventListener("click", handlePasswordChange);
    document.getElementById("twoFactorBtn")?.addEventListener("click", enable2FAHandler);
});