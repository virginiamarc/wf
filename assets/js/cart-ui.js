import { CartState } from "./cart-state.js";

export const CartUI = {
  updateCounter() {
    const counter = document.querySelector(".cart-count");
    counter.textContent = CartState.cart.length;
  }
};
