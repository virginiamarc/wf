import { CartState } from "./cart-state.js";
import { CartUI } from "./cart-ui.js";

export function initModal() {
  const buttons = document.querySelectorAll(".add-to-order-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const item = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        image: btn.dataset.image,
        quantity: 1
      };

      CartState.addItem(item);
      CartUI.updateCounter();
    });
  });
}
