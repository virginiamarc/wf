/**
 * Checkout UI - Vanilla JavaScript
 * Renders cart items with quantity controls, remove buttons, and totals
 * Integrates with existing cart-state.js and cart-storage.js
 */

// Configuration
const TAX_RATE = 0.08; // 8% tax

// Format price helper
function formatPrice(price) {
  return `$${parseFloat(price).toFixed(2)}`;
}

// Render a single cart item
function renderCartItem(item) {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'checkout-item';
  itemDiv.dataset.id = item.id;

  itemDiv.innerHTML = `
    ${item.image ? `<img src="${item.image}" alt="${item.name}">` : ''}

    <div class="checkout-item-info">
      <h4>${item.name}</h4>
      <p class="price">${formatPrice(item.price)}</p>

      <div class="quantity-controls">
        <button class="qty-btn qty-decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
        <span class="quantity">${item.quantity}</span>
        <button class="qty-btn qty-increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
      </div>

      <button class="remove-btn" data-id="${item.id}">Remove</button>
    </div>
  `;

  return itemDiv;
}

// Render all cart items
function renderCartItems(cartItems) {
  const container = document.getElementById('checkout-items');

  if (!container) {
    console.error('Checkout items container not found');
    return;
  }

  // Clear existing items
  container.innerHTML = '';

  if (cartItems.length === 0) {
    container.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p></div>';
    return;
  }

  // Render each item
  cartItems.forEach(item => {
    container.appendChild(renderCartItem(item));
  });

  // Attach event listeners
  attachItemEventListeners();
}

// Calculate and render totals
function renderTotals(cartItems) {
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (parseFloat(item.price) * parseInt(item.quantity));
  }, 0);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  // Update DOM
  const subtotalEl = document.getElementById('subtotal');
  const taxEl = document.getElementById('tax');
  const totalEl = document.getElementById('total');

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (taxEl) taxEl.textContent = formatPrice(tax);
  if (totalEl) totalEl.textContent = formatPrice(total);
}

// Handle quantity increase
function handleQuantityIncrease(itemId) {
  if (typeof window.cart !== 'undefined' && window.cart.updateQuantity) {
    const item = window.cart.items.find(i => i.id === itemId);
    if (item) {
      window.cart.updateQuantity(itemId, item.quantity + 1);
      refreshCheckout();
    }
  }
}

// Handle quantity decrease
function handleQuantityDecrease(itemId) {
  if (typeof window.cart !== 'undefined' && window.cart.updateQuantity) {
    const item = window.cart.items.find(i => i.id === itemId);
    if (item && item.quantity > 1) {
      window.cart.updateQuantity(itemId, item.quantity - 1);
      refreshCheckout();
    }
  }
}

// Handle remove item
function handleRemoveItem(itemId) {
  if (typeof window.cart !== 'undefined' && window.cart.removeItem) {
    if (confirm('Remove this item from your cart?')) {
      window.cart.removeItem(itemId);
      refreshCheckout();

      // Update cart count in header if it exists
      updateCartCount();
    }
  }
}

// Attach event listeners to cart item buttons
function attachItemEventListeners() {
  // Quantity increase buttons
  document.querySelectorAll('.qty-increase').forEach(btn => {
    btn.addEventListener('click', (e) => {
      handleQuantityIncrease(e.target.dataset.id);
    });
  });

  // Quantity decrease buttons
  document.querySelectorAll('.qty-decrease').forEach(btn => {
    btn.addEventListener('click', (e) => {
      handleQuantityDecrease(e.target.dataset.id);
    });
  });

  // Remove buttons
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      handleRemoveItem(e.target.dataset.id);
    });
  });
}

// Update cart count in header
function updateCartCount() {
  const cartCountEl = document.querySelector('.cart-count');
  if (cartCountEl && typeof window.cart !== 'undefined') {
    const totalItems = window.cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
  }
}

// Refresh the entire checkout display
function refreshCheckout() {
  if (typeof window.cart !== 'undefined' && window.cart.items) {
    renderCartItems(window.cart.items);
    renderTotals(window.cart.items);
    updateCartCount();
  }
}

// Handle checkout/payment button
function handleCheckout(e) {
  e.preventDefault();

  // Get form values
  const fullName = document.getElementById('fullName')?.value;
  const email = document.getElementById('email')?.value;
  const phone = document.getElementById('phone')?.value;

  // Validate form
  const form = document.getElementById('checkout-form');
  if (form && !form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Check if cart has items
  if (typeof window.cart === 'undefined' || window.cart.items.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  // Proceed to payment (customize this based on your payment integration)
  console.log('Proceeding to payment with:', {
    customer: { fullName, email, phone },
    items: window.cart.items,
    total: calculateTotal()
  });

  alert('Proceeding to payment...\n\nIn production, this would redirect to your payment processor.');

  // Example: redirect to payment page
  // window.location.href = 'payment.html';
}

// Calculate total
function calculateTotal() {
  if (typeof window.cart === 'undefined') return 0;

  const subtotal = window.cart.items.reduce((sum, item) => {
    return sum + (parseFloat(item.price) * parseInt(item.quantity));
  }, 0);

  return subtotal + (subtotal * TAX_RATE);
}

// Initialize checkout page
function initCheckout() {
  // Attach checkout button listener
  const checkoutBtn = document.getElementById('placeOrderBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckout);
  }

  // Initial render
  refreshCheckout();

  // Listen for cart updates (if you have custom events)
  document.addEventListener('cartUpdated', refreshCheckout);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCheckout);
} else {
  initCheckout();
}

// Export functions for external use
window.checkoutUI = {
  refresh: refreshCheckout,
  renderCartItems,
  renderTotals,
  updateCartCount
};