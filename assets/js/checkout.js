import { CartState } from "./cart-state.js";
import { CartStorage } from "./cart-storage.js";
import { CartUI } from "./cart-ui.js";

document.addEventListener("DOMContentLoaded", () => {
    const itemsContainer = document.getElementById("checkout-items");
    const subtotalEl = document.getElementById("subtotal");
    const taxEl = document.getElementById("tax");
    const totalEl = document.getElementById("total");
    const placeOrderBtn = document.getElementById("placeOrderBtn");

    // -----------------------------
    // ⭐ RENDER CHECKOUT ITEMS
    // -----------------------------
    function renderCheckout() {
        const cart = CartState.items;

        itemsContainer.innerHTML = "";

        if (cart.length === 0) {
            itemsContainer.innerHTML = `
                <p class="empty-cart">Your cart is empty.</p>
            `;
            subtotalEl.textContent = "$0.00";
            taxEl.textContent = "$0.00";
            totalEl.textContent = "$0.00";
            return;
        }

        cart.forEach(item => {
            const itemEl = document.createElement("div");
            itemEl.classList.add("checkout-item");

            itemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="checkout-item-img">

                <div class="checkout-item-info">
                    <h4>${item.name}</h4>
                    <p class="price">$${item.price.toFixed(2)}</p>

                    <div class="qty-controls">
                        <button class="qty-btn minus" data-id="${item.id}">−</button>
                        <span class="qty">${item.quantity}</span>
                        <button class="qty-btn plus" data-id="${item.id}">+</button>
                    </div>

                    <button class="remove-btn" data-id="${item.id}">
                        Remove
                    </button>
                </div>
            `;

            itemsContainer.appendChild(itemEl);
        });

        updateTotals();
        attachItemEvents();
    }

    // -----------------------------
    // ⭐ UPDATE TOTALS
    // -----------------------------
    function updateTotals() {
        const cart = CartState.items;

        const subtotal = cart.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);

        const tax = subtotal * 0.07; // 7% tax
        const total = subtotal + tax;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        taxEl.textContent = `$${tax.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
    }

    // -----------------------------
    // ⭐ ATTACH EVENTS TO ITEMS
    // -----------------------------
    function attachItemEvents() {
        // Increase quantity
        document.querySelectorAll(".qty-btn.plus").forEach(btn => {
            btn.addEventListener("click", () => {
                CartState.increase(btn.dataset.id);
                CartStorage.save(CartState.items);
                renderCheckout();
                CartUI.updateCounter();
            });
        });

        // Decrease quantity
        document.querySelectorAll(".qty-btn.minus").forEach(btn => {
            btn.addEventListener("click", () => {
                CartState.decrease(btn.dataset.id);
                CartStorage.save(CartState.items);
                renderCheckout();
                CartUI.updateCounter();
            });
        });

        // Remove item
        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                CartState.remove(btn.dataset.id);
                CartStorage.save(CartState.items);
                renderCheckout();
                CartUI.updateCounter();
            });
        });
    }

    // -----------------------------
    // ⭐ PLACE ORDER BUTTON
    // -----------------------------
    placeOrderBtn.addEventListener("click", () => {
        const cart = CartState.items;

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        alert("Proceeding to payment… (future feature)");
    });

    // -----------------------------
    // ⭐ INITIAL LOAD
    // -----------------------------
    CartState.items = CartStorage.load();
    renderCheckout();
});
