import { CartState } from "./cart-state.js";

export const CartUI = {
  updateCounter() {
    const counter = document.querySelector(".cart-count");
    counter.textContent = CartState.cart.length;
  },

  renderMiniCart() {
    const container = document.querySelector(".mini-cart-items");
    if (!container) return;

    container.innerHTML = "";

    CartState.cart.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("mini-cart-item");

      div.innerHTML = `
        <div class="mini-cart-item-name">${item.name}</div>

        <div class="mini-cart-item-flavors">
            <strong>Flavors:</strong> ${item.flavors.join(", ")}
        </div>

        <div class="mini-cart-item-qty-price">
            Qty: ${item.quantity} • $${(item.price * item.quantity).toFixed(2)}
        </div>
      `;

      container.appendChild(div);
    });
  },

  renderCartItems() {
    const container = document.querySelector(".cart-items");
    if (!container) return;

    container.innerHTML = "";

    CartState.cart.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("cart-item");

      div.innerHTML = `
        <div class="cart-item-name">${item.name}</div>

        <div class="cart-item-flavors">
            <strong>Flavors:</strong> ${item.flavors.join(", ")}
        </div>

        <div class="cart-item-qty-price">
            Qty: ${item.quantity} • $${(item.price * item.quantity).toFixed(2)}
        </div>
      `;

      container.appendChild(div);
    });
  }
};

// -----------------------------
// Init
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  CartUI.updateCounter();
  CartUI.renderMiniCart();
  CartUI.renderCartItems();
});