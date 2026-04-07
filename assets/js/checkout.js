import { CartState } from "./cart-state.js";

function renderCheckout() {
  const container = document.querySelector("#checkout-items");
  const totalEl = document.querySelector("#checkout-total");

  container.innerHTML = CartState.cart
    .map(item => `
      <div class="checkout-item">
        <img src="${item.image}">
        <div>
          <h4>${item.name}</h4>
          <p>Qty: ${item.quantity}</p>
          <p>$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    `)
    .join("");

  totalEl.textContent = `$${CartState.getTotals().toFixed(2)}`;
}

renderCheckout();
