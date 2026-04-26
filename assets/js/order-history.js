import { getProfile } from "./wf-api.js";
import { logout, requireAuthRedirect } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
    requireAuthRedirect();

    document.getElementById("signOutBtn")?.addEventListener("click", logout);
});

async function loadOrders() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("https://wheelfoodie-backend.onrender.com/api/orders/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const orders = await res.json();

    console.log("ORDERS FROM API:", orders);

    const container = document.getElementById("orderHistory");
    if (!container) return;

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
            <li>
                ${item.name || item.title || "Unknown Item"} ×${item.quantity} — $${item.price}
                ${item.flavors?.length ? `<br><small>Flavors: ${item.flavors.join(", ")}</small>` : ""}
            </li>

          `).join("")}
        </ul>
      </div>
    `).join("");

  } catch (err) {
    console.error("Order load error:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadOrders);