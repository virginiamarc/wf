export const CartStorage = {
  key: "wf_cart",

  save(cart) {
    localStorage.setItem(this.key, JSON.stringify(cart));
  },

  load() {
    return JSON.parse(localStorage.getItem(this.key)) || [];
  },

  clear() {
    localStorage.removeItem(this.key);
  }
};
