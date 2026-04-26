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
    // ⭐ INITIAL LOAD
    // -----------------------------
    CartState.cart = CartStorage.load();
    renderCheckout();

    // Expose renderCheckout globally so script.js can call it
    window.renderCheckout = renderCheckout;

    // NEW CODE ADDED DELETE IF NON FUNCTIONING
    window.renderReviewSummary = renderReviewSummary;

    // -----------------------------
    // ⭐ PAYMENT FIELD FORMATTING
    // -----------------------------

    // CARD NUMBER — digits only, max 16
    document.getElementById("cardNumber").addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 16);
    });

    // EXPIRATION DATE — auto MM/YY
    document.getElementById("cardExp").addEventListener("input", function () {
        let v = this.value.replace(/\D/g, "").slice(0, 4);

        if (v.length >= 3) {
            this.value = v.slice(0, 2) + "/" + v.slice(2);
        } else {
            this.value = v;
        }
    });

    // CVV — digits only, max 4
    document.getElementById("cardCVV").addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 4);
    });

    // -----------------------------
    // ⭐ PAYMENT FORM VALIDATION
    // -----------------------------
    document.getElementById("paymentForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const errors = [];

        const cardName = document.getElementById("cardName").value.trim();
        const cardNumber = document.getElementById("cardNumber").value.trim();
        const cardExp = document.getElementById("cardExp").value.trim();
        const cardCVV = document.getElementById("cardCVV").value.trim();

        // Cardholder name
        if (cardName.length < 2) {
            errors.push("Please enter the cardholder name.");
        }

        // Card number
        if (!/^\d{16}$/.test(cardNumber)) {
            errors.push("Card number must be exactly 16 digits.");
        }

        // Expiration format
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExp)) {
            errors.push("Expiration date must be in MM/YY format.");
        } else {
            // Only check expiration date if format is valid
            const [expMonth, expYear] = cardExp.split("/").map(Number);
            const fullYear = 2000 + expYear;

            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();

            if (fullYear < currentYear || (fullYear === currentYear && expMonth < currentMonth)) {
                errors.push("Expiration date cannot be in the past.");
            }
        }

        // CVV
        if (!/^\d{3,4}$/.test(cardCVV)) {
            errors.push("CVV must be 3 or 4 digits.");
        }

        // Show errors
        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }

        // SUCCESS — now you can safely place the order
        window.goToReview();
    });


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
