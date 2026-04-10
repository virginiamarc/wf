// cart.js – Wheel Foodie

// -----------------------------
// Storage layer
// -----------------------------
const CartStorage = {
  key: "wf_cart",

  save(cart) {
    localStorage.setItem(this.key, JSON.stringify(cart));
  },

  load() {
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error loading cart from storage", e);
      return [];
    }
  },

  clear() {
    localStorage.removeItem(this.key);
  }
};

// -----------------------------
// Cart state & logic
// -----------------------------
const CartState = {
  cart: CartStorage.load(),

  addItem(item) {
    const existing = this.cart.find(i => i.id === item.id);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.cart.push(item);
    }

    this.sync();
  },

  removeItem(id) {
    this.cart = this.cart.filter(i => i.id !== id);
    this.sync();
  },

  updateQuantity(id, qty) {
    const item = this.cart.find(i => i.id === id);
    if (!item) return;

    if (qty <= 0) {
      this.removeItem(id);
    } else {
      item.quantity = qty;
      this.sync();
    }
  },

  clear() {
    this.cart = [];
    this.sync();
  },

  getTotalItems() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  sync() {
    CartStorage.save(this.cart);
    CartUI.updateCounter();
    CartUI.renderMiniCart();
  }
};

// -----------------------------
// UI helpers
// -----------------------------
const CartUI = {
  updateCounter() {
    const counter = document.querySelector(".cart-count");
    if (!counter) return;
    counter.textContent = CartState.getTotalItems();
  },

  renderMiniCart() {
    const container = document.querySelector(".cart-dropdown-items");
    const subtotalEl = document.querySelector(".cart-dropdown-subtotal");

    if (!container) return;

    if (CartState.cart.length === 0) {
      container.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
      if (subtotalEl) subtotalEl.textContent = "$0.00";
      return;
    }

    container.innerHTML = CartState.cart
      .map(
        item => `
        <div class="cart-dropdown-item" data-id="${item.id}">
          <div class="cart-dropdown-item-info">
            <span class="cart-dropdown-item-name">${item.name}</span>
            <span class="cart-dropdown-item-meta">
              Qty: ${item.quantity} • $${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
          <button class="cart-remove-btn" type="button" aria-label="Remove ${item.name}">
            ✕
          </button>
        </div>
      `
      )
      .join("");

    if (subtotalEl) {
      subtotalEl.textContent = `$${CartState.getSubtotal().toFixed(2)}`;
    }

    this.bindMiniCartEvents();
  },

  bindMiniCartEvents() {
    const removeButtons = document.querySelectorAll(".cart-remove-btn");
    removeButtons.forEach(btn => {
      btn.addEventListener("click", e => {
        const itemEl = e.target.closest(".cart-dropdown-item");
        if (!itemEl) return;
        const id = itemEl.dataset.id;
        CartState.removeItem(id);
      });
    });
  }
};

// -----------------------------
// Modal controller
// -----------------------------
const CartModal = {
  modalEl: null,
  overlayEl: null,
  addBtnEl: null,
  qtyInputEl: null,
  nameEl: null,
  priceEl: null,
  imgEl: null,
  currentItemData: null,

  init() {
    this.modalEl = document.querySelector("#cart-modal");
    this.overlayEl = document.querySelector("#cart-modal-overlay");
    this.addBtnEl = document.querySelector("#cart-modal-add-btn");
    this.qtyInputEl = document.querySelector("#cart-modal-qty");
    this.nameEl = document.querySelector("#cart-modal-item-name");
    this.priceEl = document.querySelector("#cart-modal-item-price");
    this.imgEl = document.querySelector("#cart-modal-item-img");

    if (this.addBtnEl) {
      this.addBtnEl.addEventListener("click", () => this.handleAddToCart());
    }

    const closeButtons = document.querySelectorAll(
      ".cart-modal-close, #cart-modal-overlay"
    );
    closeButtons.forEach(el =>
      el.addEventListener("click", () => this.close())
    );
  },

  open(itemData) {
    this.currentItemData = itemData;

    if (this.nameEl) this.nameEl.textContent = itemData.name;
    if (this.priceEl) this.priceEl.textContent = `$${itemData.price.toFixed(2)}`;
    if (this.imgEl && itemData.image) this.imgEl.src = itemData.image;
    if (this.qtyInputEl) this.qtyInputEl.value = 1;

    if (this.modalEl) this.modalEl.classList.add("is-open");
    if (this.overlayEl) this.overlayEl.classList.add("is-open");
  },

 close() {
  if (this.modalEl) this.modalEl.classList.remove("is-open");
  if (this.overlayEl) this.overlayEl.classList.remove("is-open");
  this.currentItemData = null;

  // Reset modal content for next time
  const content = document.getElementById("cart-modal-content");
  const confirmation = document.getElementById("cart-modal-confirmation");

  if (content) content.style.display = "block";
  if (confirmation) confirmation.style.display = "none";
},

  handleAddToCart() {
    if (!this.currentItemData) return;

    const qty = this.qtyInputEl ? parseInt(this.qtyInputEl.value, 10) || 1 : 1;

    const item = {
        id: this.currentItemData.id,
        name: this.currentItemData.name,
        price: this.currentItemData.price,
        image: this.currentItemData.image || "",
        quantity: qty,
        flavors: selectedFlavors.length > 0 ? [...selectedFlavors] : ["No flavor selected"]
    };

    CartState.addItem(item);

    // Reset flavor selections for next time
    selectedFlavors = [];
    document.querySelectorAll(".flavor-card.selected").forEach(card => {
        card.classList.remove("selected");
    });

    this.showConfirmation();
},

  showConfirmation() {
    // Hide original content
    const content = document.getElementById("cart-modal-content");
    const confirmation = document.getElementById("cart-modal-confirmation");

    if (content) content.style.display = "none";
    if (confirmation) confirmation.style.display = "block";
  },
};

// -----------------------------
// Button bindings
// -----------------------------
function bindAddToOrderButtons() {
  const buttons = document.querySelectorAll(".add-to-order-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const itemData = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price || "0"),
        image: btn.dataset.image || "",
        hasFlavors: btn.dataset.hasFlavors === "true"
      };

      CartModal.open(itemData); // ONLY this here
    });
  });
}

// -----------------------------
// Checkout helper (for checkout.html)
// -----------------------------
function exportCartForCheckout() {
  // This is optional: you can call this before redirecting to checkout.html
  // If you already rely on localStorage only, you may not need this.
  localStorage.setItem("wf_cart_for_checkout", JSON.stringify(CartState.cart));
}

// -----------------------------
// Init
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  CartUI.updateCounter();
  CartUI.renderMiniCart();
  CartModal.init();
  bindAddToOrderButtons();
});

// Expose minimal API if needed elsewhere
window.WheelFoodieCart = {
  state: CartState,
  exportForCheckout: exportCartForCheckout
};

// -----------------------------
// Continue Shopping → Scroll to Full Menu
// -----------------------------
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".continue-shopping-btn");
  if (!btn) return;

  // Close the modal using your existing modal controller
  CartModal.close();

  // Scroll to the full menu section
  const section = document.getElementById("full-menu");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
});

let selectedFlavors = [];

document.addEventListener("click", function(e) {
    if (e.target.closest(".flavor-card")) {
        const card = e.target.closest(".flavor-card");
        const flavor = card.dataset.flavor;

        // Toggle selection
        if (card.classList.contains("selected")) {
            card.classList.remove("selected");
            selectedFlavors = selectedFlavors.filter(f => f !== flavor);
        } else {
            card.classList.add("selected");
            selectedFlavors.push(flavor);
        }
    }
});