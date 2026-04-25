import { login, register } from "./wf-api.js";

document.addEventListener("DOMContentLoaded", () => {

    // Mobile hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.main-nav ul');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
    }

    /* Accordion */
    const headers = document.querySelectorAll('.menu-category-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('active');

            const content = header.nextElementSibling;
            content.style.maxHeight = header.classList.contains('active')
                ? content.scrollHeight + "px"
                : "0";
        });
    });

    /* LOCATIONS PAGE MODAL */
    const locationModal = document.getElementById("locationModal");
    const locationBtn = document.getElementById("locationPopupBtn");
    const locationClose = document.querySelector(".close-modal");

    if (locationModal && locationBtn && locationClose) {
        locationBtn.onclick = () => locationModal.style.display = "flex";
        locationClose.onclick = () => locationModal.style.display = "none";

        window.addEventListener("click", (e) => {
            if (e.target === locationModal) {
                locationModal.style.display = "none";
            }
        });
    }

    /* CATERING PAGE DROPDOWNS */
    const cateringDropdowns = document.querySelectorAll('.dropdown-toggle');

    cateringDropdowns.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;

            const isOpen =
                content.style.display === 'block' ||
                content.style.display === 'grid';

            if (isOpen) {
                content.style.display = 'none';
                button.classList.remove('active');
            } else {
                if (content.classList.contains('two-col')) {
                    content.style.display = 'grid';
                } else {
                    content.style.display = 'block';
                }
                button.classList.add('active');
            }
        });
    });
    
    const guestBtn = document.getElementById("guestBtn");

    if (guestBtn) {
        guestBtn.addEventListener("click", showGuestForm);
    }

    checkUser(); // keep this
    initCheckoutState();

}); // END DOMContentLoaded

// ------------------------------
// FORM HANDLERS (GLOBAL)
// ------------------------------

// INDEX FORM
const indexForm = document.querySelector('.index-quote-card form');
if (indexForm) {
  indexForm.addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('indexQuoteSuccess').style.display = 'block';
    this.reset();
  });
}

// CATERING FORM
const cateringForm = document.querySelector('.catering-quote-card form');
if (cateringForm) {
  cateringForm.addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('caterQuoteSuccess').style.display = 'block';
    this.reset();
  });
}

// ABOUT SUBSCRIBE FORM
const subscribeForm = document.querySelector('.subscribe-form');
if (subscribeForm) {
  subscribeForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const msg = document.getElementById('aboutSubscribeSuccess');
    msg.style.display = 'block';

    this.reset();

    setTimeout(() => {
      msg.style.display = 'none';
    }, 6000);
  });
}

function initCheckoutState() {
    const cart = JSON.parse(localStorage.getItem("wfCart")) || [];

    // sync cart system
    if (window.WheelFoodieCart) {
        WheelFoodieCart.state.cart = cart;
    }

    // update cart UI
    const cartCount = document.querySelector(".cart-count");
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // restore guest info if exists
    restoreGuestInfo();

    // update identity UI
    const user = getUser();
    if (user) {
        showLoggedInUser(user);
    }
}


/* ================================
   USER STATE
================================ */
function saveUser(user) {
    localStorage.setItem("wfUser", JSON.stringify(user));
}

function getUser() {
    const user = localStorage.getItem("wfUser");
    return user ? JSON.parse(user) : null;
}

function getToken() {
    return localStorage.getItem("token");
}

function clearUser() {
    localStorage.removeItem("wfUser");
    localStorage.removeItem("token");
}

function resetCheckoutState() {
    const cartCount = document.querySelector(".cart-count");
    if (cartCount) cartCount.textContent = "0";

    if (window.WheelFoodieCart) {
        WheelFoodieCart.state.cart = [];
    }

    localStorage.removeItem("wfCart");
}

// RESET IDENTITY
function resetIdentityUI() {
    const summary = document.getElementById("customerSummary");
    const guest = document.getElementById("guestFormContainer");

    if (summary) {
        summary.classList.add("hidden");
        summary.innerHTML = "";
    }

    if (guest) {
        guest.classList.add("hidden");
        guest.innerHTML = "";
    }

    const authOptions = document.getElementById("authOptions");
    if (!getUser() && authOptions) {
        authOptions.style.display = "block";
    }
}

/* ================================
   UPDATE HEADER
================================ */
function updateHeader() {
    const user = getUser();
    const text = document.getElementById("authHeaderText");
    const dropdown = document.getElementById("accountDropdown");
    const nameSlot = document.getElementById("dropdownName");

    if (user?.name) {
        const firstName = user.name.split(" ")[0];

        if (text) text.textContent = `Hi, ${firstName}`;
        if (nameSlot) nameSlot.textContent = user.name;
        if (dropdown) dropdown.classList.add("hidden");

    } else {
        if (text) text.textContent = "SIGN IN / JOIN";
        if (dropdown) dropdown.classList.add("hidden");

        resetIdentityUI();
    }
}

/* ================================
   AUTH MODAL LOGIC
================================ */
const authModal = document.getElementById("auth-modal");
const signinView = document.getElementById("auth-signin-view");
const createView = document.getElementById("auth-create-view");
const successView = document.getElementById("auth-success-view");


if (authModal && signinView && createView && successView) {

    // Rewards JOIN NOW button → open modal on Create Account view
    document.getElementById("openRewardsJoin")?.addEventListener("click", function (e) {
        e.preventDefault();

        authModal.classList.remove("hidden");
        signinView.classList.add("hidden");
        createView.classList.remove("hidden");
    });

    // Unified header button behavior
    const authHeaderBtn = document.getElementById("authHeaderBtn");

    if (authHeaderBtn) {
        authHeaderBtn.addEventListener("click", () => {
            const user = getUser();

            if (user) {
                document.getElementById("accountDropdown")?.classList.toggle("hidden");
            } else {
                authModal.classList.remove("hidden");
            }
        });
    }

    // Close modal
    const authClose = document.querySelector(".auth-close");

    if (authClose) {
        authClose.addEventListener("click", () => {
            createView.classList.add("hidden");
            successView.classList.add("hidden");
            signinView.classList.remove("hidden");
            authModal.classList.add("hidden");
        });
    }

}

// Switch to Create Account
const el = document.getElementById("openCreateAccount");

if (el) {
  el.addEventListener("click", () => {
    signinView.classList.add("hidden");
    createView.classList.remove("hidden");
  });
}

// Switch to Sign In
const openSignInBtn = document.getElementById("openSignIn");

if (openSignInBtn) {
  openSignInBtn.addEventListener("click", () => {
    createView.classList.add("hidden");
    signinView.classList.remove("hidden");
  });
}


// Password toggle
document.querySelectorAll(".toggle-password").forEach(icon => {
    icon.addEventListener("click", () => {
        const input = icon.previousElementSibling;
        input.type = input.type === "password" ? "text" : "password";
    });
});


// SIGN IN
const signinForm = document.getElementById("signinForm");

if (signinForm) {
    signinForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("signinEmail").value;
        const password = document.getElementById("signinPassword").value;

        const data = await login(email, password);

        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("wfUser", JSON.stringify(data.user));

            signinView.classList.add("hidden");
            successView.classList.remove("hidden");
        } else {
            alert("Invalid credentials");
        }
    });
}


// CREATE ACCOUNT
const createAccountForm = document.getElementById("createAccountForm");

if (createAccountForm) {
    createAccountForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("createName").value;
        const email = document.getElementById("createEmail").value;
        const pass = document.getElementById("createPassword").value;
        const confirm = document.getElementById("confirmPassword").value;
        const agree = document.getElementById("agreeTerms").checked;

        if (pass !== confirm) {
            alert("Passwords do not match");
            return;
        }

        if (!agree) {
            alert("You must agree to the terms");
            return;
        }

        const data = await register(name, email, pass);

        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("wfUser", JSON.stringify(data.user));

            createView.classList.add("hidden");
            successView.classList.remove("hidden");
        } else {
            alert(data.message || "Signup failed");
        }
    });
}

//DETECT LOGGED-IN USER
async function checkUser() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      console.log("User not authenticated");
      return;
    }

    const user = await res.json();
    saveUser(user);
    showLoggedInUser(user);

  } catch (err) {
    console.error("checkUser failed:", err);
  }
}

// HIDE AUTH BUTTONS
function hideAuthOptions() {
  const el = document.getElementById("authOptions");
  if (el) el.style.display = "none";
}

// LOGGED-IN UI
function showLoggedInUser(user) {
  hideAuthOptions();

  const guest = document.getElementById("guestFormContainer");
  if (guest) guest.classList.add("hidden");

  const container = document.getElementById("customerSummary");
  if (!container) return;

  container.classList.remove("hidden");

  container.innerHTML = `
    <h3>Logged in as</h3>
    <p><strong>Name:</strong> ${user.name}</p>
    <p><strong>Email:</strong> ${user.email}</p>
  `;

  updateHeader();
}

//GUEST FLOW
function showGuestForm() {
  hideAuthOptions();

  const container = document.getElementById("guestFormContainer");
  container.classList.remove("hidden");

  const guest = JSON.parse(localStorage.getItem("guestInfo")) || {};

  container.innerHTML = `
    <h3>Guest Checkout</h3>

    <input id="guestName" placeholder="Full Name" value="${guest.name || ""}" />
    <input id="guestEmail" placeholder="Email" value="${guest.email || ""}" />
    <input id="guestPhone" placeholder="Phone" value="${guest.phone || ""}" />

    <button id="confirmGuestBtn" class="checkout-btn full">
      Confirm Info
    </button>
  `;

  // ⭐ Automatically place cursor in the first field
  document.getElementById("guestName")?.focus();
}

// CONFIRM GUEST INFO
document.addEventListener("click", (e) => {
  if (e.target.id === "confirmGuestBtn") {
    const name = document.getElementById("guestName").value;
    const email = document.getElementById("guestEmail").value;
    const phone = document.getElementById("guestPhone").value;

    if (!name || !email || !phone) {
      alert("Please fill out all fields");
      return;
    }

    localStorage.setItem(
      "guestInfo",
      JSON.stringify({ name, email, phone })
    );

    document.getElementById("guestFormContainer").innerHTML = `
      <h3>Confirm Your Info</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>

      <button id="editGuestBtn" class="continue-btn full">Edit</button>
    `;
  }
});

// EDIT BUTTON
document.addEventListener("click", (e) => {
  if (e.target.id === "editGuestBtn") {
    showGuestForm(); // reload form
  }
});

// RESTORE GUEST INFO
function restoreGuestInfo() {
    const guest = JSON.parse(localStorage.getItem("guestInfo"));
    if (!guest) return;

    const container = document.getElementById("guestFormContainer");
    if (!container) return;

    container.classList.remove("hidden");   // ← ⭐ REQUIRED
    
    // Hide identity buttons when guest info exists
    const authOptions = document.getElementById("authOptions");
    if (authOptions) authOptions.style.display = "none";


    container.innerHTML = `
        <h3>Confirm Your Info</h3>
        <p><strong>Name:</strong> ${guest.name}</p>
        <p><strong>Email:</strong> ${guest.email}</p>
        <p><strong>Phone:</strong> ${guest.phone}</p>

        <button id="editGuestBtn" class="continue-btn full">Edit</button>
    `;
}


// SUCCESS → CLOSE MODAL
const authSuccessBtn = document.getElementById("authSuccessBtn");

if (authSuccessBtn) {
  authSuccessBtn.addEventListener("click", () => {
    successView.classList.add("hidden");
    signinView.classList.remove("hidden");
    authModal.classList.add("hidden");
    updateHeader();
    initCheckoutState(); // rehydrate identity + cart + guest

  });
}

// Checkout page Login/Create Account button
document.getElementById("loginBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    // Always reset modal to Sign In view
    if (signinView) signinView.classList.add("hidden");
    if (createView) createView.classList.remove("hidden");
    if (successView) successView.classList.add("hidden");

    if (authModal) authModal.classList.remove("hidden");
});


/* ================================
   SIGN OUT
================================ */
const signOutBtn = document.getElementById("signOutBtn");

if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
        clearUser();
        updateHeader();
        resetIdentityUI();
        initCheckoutState();
    });
}

/* ================================
   PAYMENT MODAL
================================ */
const paymentModal = document.getElementById("payment-modal");
const paymentView = document.getElementById("payment-view");
const reviewView = document.getElementById("review-view");
const successView2 = document.getElementById("success-view");


// Open payment modal
document.getElementById("placeOrderBtn")?.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("wfCart")) || [];

    // 1. CART CHECK
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    // 2. USER LOGIN CHECK
    const user = getUser();

    // 3. GUEST INFO CHECK
    const guestInfo = JSON.parse(localStorage.getItem("guestInfo"));

    const guestName = guestInfo?.name;
    const guestEmail = guestInfo?.email;
    const guestPhone = guestInfo?.phone;

    const guestInfoComplete =
        guestName && guestPhone && guestEmail;

    // 4. BLOCK PAYMENT IF NO IDENTITY PROVIDED
    if (!user && !guestInfoComplete) {
        alert("Please sign in or enter your customer information before continuing.");
        return;
    }

    // 5. OPEN PAYMENT MODAL
    paymentModal.classList.remove("hidden");
});


// Close payment modal
const paymentClose = document.querySelector(".payment-close");

function closePaymentModal() {

    // ⭐ If user is on the Order Confirmed screen
    if (!successView2.classList.contains("hidden")) {
        paymentModal.classList.add("hidden");

        // 🔥 Clear the Your Order UI
        const items = document.getElementById("checkout-items");
        if (items) {
            items.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`; // ⭐ ADD THIS
        }

        const subtotal = document.getElementById("subtotal");
        const tax = document.getElementById("tax");
        const total = document.getElementById("total");

        if (subtotal) subtotal.textContent = "$0.00";
        if (tax) tax.textContent = "$0.00";
        if (total) total.textContent = "$0.00";

        return; // stop here so normal reset doesn't run
    }

    // ⭐ Normal close behavior (before order is placed)
    paymentModal.classList.add("hidden");

    paymentView.classList.remove("hidden");
    reviewView.classList.add("hidden");
    successView2.classList.add("hidden");

    resetCheckoutState();
    initCheckoutState();
}

paymentClose?.addEventListener("click", closePaymentModal);

paymentModal?.addEventListener("click", (e) => {
    if (e.target === paymentModal) {
        closePaymentModal();
    }
});


// PAYMENT SUBMIT → REVIEW
const paymentForm = document.getElementById("paymentForm");

if (paymentForm) {
  paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    console.log("PAYMENT SUBMIT FIRED");
    renderReviewSummary();

    paymentView.classList.add("hidden");
    reviewView.classList.remove("hidden");
  });
}


// FINAL ORDER
const placeOrderFinalBtn = document.getElementById("placeOrderFinal");

if (placeOrderFinalBtn) {
  placeOrderFinalBtn.addEventListener("click", () => {

    // calculate total BEFORE cart clears
    const cart = JSON.parse(localStorage.getItem("wfCart")) || [];

    const total = cart.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:5000/api/points/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amountSpent: total })
      })
      .then(res => res.json())
      .then(data => console.log("Points updated:", data))
      .catch(err => console.error("Points error:", err));
    }

    // SHOW SUCCESS VIEW
    reviewView.classList.add("hidden");
    successView2.classList.remove("hidden");

    // 🔥 Unified final reset
    resetCheckoutState();
    resetIdentityUI();
    initCheckoutState();
    localStorage.removeItem("guestInfo");
  });
}

// DOWNLOAD RECEIPT
const downloadBtn = document.getElementById("downloadReceipt");

if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    generateReceiptPDF();
  });
}

// RETURN TO MENU
const returnBtn = document.getElementById("returnToMenu");

if (returnBtn) {
  returnBtn.addEventListener("click", () => {
    window.location.href = "menu.html";
  });
}

// INIT HEADER
updateHeader();