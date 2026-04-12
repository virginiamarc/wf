import { CartState } from "./cart-state.js";
import { CartStorage } from "./cart-storage.js";
import { CartUI } from "./cart-ui.js";

document.addEventListener("DOMContentLoaded", () => {
    const itemsContainer = document.getElementById("checkout-items");
    const subtotalEl = document.getElementById("subtotal");
    const taxEl = document.getElementById("tax");
    const totalEl = document.getElementById("total");
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    const continueShoppingBtn = document.getElementById("continueShoppingBtn");

    // -----------------------------
    // ⭐ RENDER CHECKOUT ITEMS
    // -----------------------------
    function renderCheckout() {
        const cart = CartState.cart;

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
        const cart = CartState.cart;

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
    // RENDERS ORDER SUMMARY (NEW CODE ADDED DELETE IF NOT WORKING)
    //-------------------------------
    function renderReviewSummary() {
        const reviewBox = document.getElementById("reviewOrderSummary");
        const cart = JSON.parse(localStorage.getItem("wfCart")) || [];

        if (cart.length === 0) {
            reviewBox.innerHTML = "<p>Your cart is empty.</p>";
            return;
        }

        let html = "";

        cart.forEach(item => {
            html += `
                <div class="review-item">
                    <img src="${item.image}" alt="${item.name}" class="review-img">

                    <div class="review-details">
                        <div class="review-name">${item.name}</div>
                        <div class="review-qty">Qty: ${item.quantity}</div>
                    </div>

                    <div class="review-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
        });

        reviewBox.innerHTML = html;

        // Add totals section
        const subtotal = document.getElementById("subtotal").textContent;
        const tax = document.getElementById("tax").textContent;
        const total = document.getElementById("total").textContent;

        reviewBox.innerHTML += `
            <div class="review-totals">
                <div class="review-row">
                    <span>Subtotal:</span>
                    <span>${subtotal}</span>
                </div>
                <div class="review-row">
                    <span>Tax:</span>
                    <span>${tax}</span>
                </div>
                <div class="review-row review-total">
                    <span>Total:</span>
                    <span>${total}</span>
                </div>
            </div>
        `;
    }

    // -----------------------------
    // ⭐ ATTACH EVENTS TO ITEMS
    // -----------------------------
    function attachItemEvents() {
        // Increase quantity
        document.querySelectorAll(".qty-btn.plus").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                const item = CartState.cart.find(i => i.id === id);
                if (!item) return;

                CartState.updateQuantity(id, item.quantity + 1);
                CartStorage.save(CartState.cart);
                renderCheckout();
                CartUI.updateCounter();
            });
        });

        // Decrease quantity
        document.querySelectorAll(".qty-btn.minus").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                const item = CartState.cart.find(i => i.id === id);
                if (!item) return;

                if (item.quantity > 1) {
                    CartState.updateQuantity(id, item.quantity - 1);
                } else {
                    CartState.removeItem(id);
                }

                CartStorage.save(CartState.cart);
                renderCheckout();
                CartUI.updateCounter();
            });
        });

        // Remove item
        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                CartState.removeItem(id);
                CartStorage.save(CartState.cart);
                renderCheckout();
                CartUI.updateCounter();
            });
        });
    }

    // -----------------------------
    // ⭐ PLACE ORDER BUTTON
    // -----------------------------
    placeOrderBtn.addEventListener("click", (e) => {
        const cart = CartState.cart;

       if (cart.length === 0) {
            alert("Your cart is empty.");

            // ⭐ Prevent ANY further click behavior
            e.preventDefault();
            e.stopImmediatePropagation();  // ⭐ stops script.js listener from firing
            
            // ⭐ Disable the button for a moment to prevent double-click behavior
            placeOrderBtn.disabled = true;
            setTimeout(() => {
                placeOrderBtn.disabled = false;
            }, 300);

            // Fully cancel the click so no second click is required
            return false;
        }

        // script.js will handle opening the payment modal
    
    });

    // -----------------------------
    // ⭐ CONTINUE SHOPPING BUTTON
    // -----------------------------
    continueShoppingBtn.addEventListener("click", () => {
        window.location.href = "menu.html#full-menu";
    });

    // -----------------------------
    // ⭐ CONTINUE AS GUEST
    // -----------------------------
    document.getElementById("guestBtn").addEventListener("click", () => {
        const container = document.getElementById("identityFormContainer");

        container.innerHTML = `
            <div class="guest-form">
                <label>Full Name</label>
                <input type="text" id="guestName" required>

                <label>Phone Number</label>
                <input type="tel" id="guestPhone" required>

                <label>Email</label>
                <input type="email" id="guestEmail" required>
            </div>
        `;
    });

    // -----------------------------
    // ⭐ INITIAL LOAD
    // -----------------------------
    CartState.cart = CartStorage.load();
    renderCheckout();

    // Expose renderCheckout globally so script.js can call it
    window.renderCheckout = renderCheckout;

    // NEW CODE ADDED DELETE IF NON FUNCTIONING
    window.renderReviewSummary = renderReviewSummary;

    // -----------------------------
    // ⭐ GENERATE RECEIPT PDF
    // -----------------------------
    function generateReceiptPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const cart = CartState.cart;
        let y = 20;

        doc.setFontSize(18);
        doc.text("Wheel Foodie Receipt", 20, y);
        y += 10;

        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleString()}`, 20, y);
        y += 10;

        doc.text("Items:", 20, y);
        y += 10;

        cart.forEach(item => {
            doc.text(
                `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`,
                20,
                y
            );
            y += 8;
        });

        y += 5;
        doc.text(`Subtotal: ${document.getElementById("subtotal").textContent}`, 20, y);
        y += 8;
        doc.text(`Tax: ${document.getElementById("tax").textContent}`, 20, y);
        y += 8;
        doc.text(`Total: ${document.getElementById("total").textContent}`, 20, y);

        doc.save("receipt.pdf");
    }

    window.generateReceiptPDF = generateReceiptPDF;

});
