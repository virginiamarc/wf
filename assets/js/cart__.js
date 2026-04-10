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

    container.innerHTML = CartState.cart.map(item => `
      <div class="cart-dropdown-item" data-id="${item.id}">
        <div class="cart-dropdown-item-info">
          <span class="cart-dropdown-item-name">${item.name}</span>
          <span class="cart-dropdown-item-meta">
            Qty: ${item.quantity} • $${(item.price * item.quantity).toFixed(2)}
          </span>
          ${item.flavors && item.flavors.length > 0 ? `
            <div class="cart-item-flavors">
              <strong>Flavors:</strong> ${item.flavors.join(", ")}
            </div>
          ` : ""}
        </div>
        <button class="cart-remove-btn">✕</button>
      </div>
    `).join("");

    if (subtotalEl) {
      subtotalEl.textContent = `$${CartState.getSubtotal().toFixed(2)}`;
    }

    this.bindMiniCartEvents();
  },

  bindMiniCartEvents() {
    document.querySelectorAll(".cart-remove-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const itemEl = e.target.closest(".cart-dropdown-item");
        if (!itemEl) return;
        CartState.removeItem(itemEl.dataset.id);
      });
    });
  }
};

// -----------------------------
// Modal controller
// -----------------------------
let selectedFlavors = [];

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

    document.querySelectorAll(".cart-modal-close, #cart-modal-overlay")
      .forEach(el => el.addEventListener("click", () => this.close()));
  },

  open(itemData) {
    this.currentItemData = itemData;

    if (this.nameEl) this.nameEl.textContent = itemData.name;
    if (this.priceEl) this.priceEl.textContent = `$${itemData.price.toFixed(2)}`;
    if (this.imgEl && itemData.image) this.imgEl.src = itemData.image;
    if (this.qtyInputEl) this.qtyInputEl.value = 1;

    // ✅ SHOW / HIDE FLAVOR SECTION
    const flavorSection = this.modalEl.querySelector(".flavor-selector");

    if (flavorSection) {
        if (itemData.hasFlavors) {
            flavorSection.style.display = "block";
        } else {
            flavorSection.style.display = "none";
        }
    }

    // ✅ RESET FLAVOR STATE
    selectedFlavors = [];
    this.modalEl.querySelectorAll(".flavor-card").forEach(card => {
      card.classList.remove("selected");
    });

    this.modalEl?.classList.add("is-open");
    this.overlayEl?.classList.add("is-open");
  },

  close() {
    this.modalEl?.classList.remove("is-open");
    this.overlayEl?.classList.remove("is-open");
    this.currentItemData = null;
  },

  handleAddToCart() {
    if (!this.currentItemData) return;

    const qty = parseInt(this.qtyInputEl.value, 10) || 1;

    const item = {
      id: this.currentItemData.id,
      name: this.currentItemData.name,
      price: this.currentItemData.price,
      image: this.currentItemData.image || "",
      quantity: qty,
      flavors: this.currentItemData.hasFlavors ? [...selectedFlavors] : []
    };

    CartState.addItem(item);

    this.close();
  }
};

// -----------------------------
// Button bindings
// -----------------------------
function bindAddToOrderButtons() {
  document.querySelectorAll(".add-to-order-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const itemData = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price || "0"),
        image: btn.dataset.image || "",
        hasFlavors: btn.dataset.hasFlavors === "true"
      };

      CartModal.open(itemData);
    });
  });
}

// -----------------------------
// Flavor selection handler
// -----------------------------
this.modalEl.addEventListener("click", e => {
  const card = e.target.closest(".flavor-card");
  if (!card) return;

  const flavor = card.dataset.flavor;

  if (card.classList.contains("selected")) {
    card.classList.remove("selected");
    selectedFlavors = selectedFlavors.filter(f => f !== flavor);
  } else {
    card.classList.add("selected");
    selectedFlavors.push(flavor);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  CartUI.updateCounter();
  CartUI.renderMiniCart();
  CartModal.init();
  bindAddToOrderButtons();
});