import { CartStorage } from "./cart-storage.js";

export const CartState = {
  cart: CartStorage.load(),

  addItem(item) {
    const existing = this.cart.find(i => i.id === item.id);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.cart.push(item);
    }

    CartStorage.save(this.cart);
  },

  removeItem(id) {
    this.cart = this.cart.filter(i => i.id !== id);
    CartStorage.save(this.cart);
  },

  updateQuantity(id, qty) {
    const item = this.cart.find(i => i.id === id);
    if (item) {
      item.quantity = qty;
      CartStorage.save(this.cart);
    }
  },

  getTotals() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
};