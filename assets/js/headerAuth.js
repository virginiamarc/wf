console.log("headerAuth.js running");

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  const authHeaderBtn = document.getElementById("authHeaderBtn");
  const authHeaderText = document.getElementById("authHeaderText");
  const accountDropdown = document.getElementById("accountDropdown");
  const dropdownName = document.getElementById("dropdownName");
  const signOutBtn = document.getElementById("signOutBtn");

  // If no token → show SIGN IN / JOIN and open auth modal on click
  if (!token) {
    if (authHeaderText) authHeaderText.textContent = "SIGN IN / JOIN";

    if (authHeaderBtn) {
      authHeaderBtn.addEventListener("click", () => {
        const modal = document.getElementById("authModal");
        if (modal) modal.classList.remove("hidden");
      });
    }

    return;
  }

  // If token exists → fetch user info
  fetch("http://127.0.0.1:5000/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      return res.json();
    })
    .then(user => {
      console.log("Fetched user:", user);

      if (authHeaderText) {
        authHeaderText.textContent = `Hi, ${user.name}`;
      }

      if (dropdownName) {
        dropdownName.textContent = user.name;
      }

      if (authHeaderBtn && accountDropdown) {
        authHeaderBtn.addEventListener("click", () => {
          accountDropdown.classList.toggle("hidden");
        });
      }
    })
    .catch(err => {
      console.error("Auth header error:", err);
      if (authHeaderText) {
        authHeaderText.textContent = "SIGN IN / JOIN";
      }
    });

  // Logout
  if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.reload();
    });
  }
});
