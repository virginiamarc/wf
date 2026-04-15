/* ================================
   DOMContentLoaded — UI ONLY
================================ */
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

/* ================================
   USER STATE
================================ */
function saveUser(user) {
    localStorage.setItem("wfUser", JSON.stringify(user));
}

function getUser() {
    return JSON.parse(localStorage.getItem("wfUser"));
}

function clearUser() {
    localStorage.removeItem("wfUser");
}

/* ================================
   UPDATE HEADER
================================ */
function updateHeader() {
    const user = getUser();
    const text = document.getElementById("authHeaderText");
    const dropdown = document.getElementById("accountDropdown");
    const nameSlot = document.getElementById("dropdownName");

    if (user) {
        const firstName = user.name.split(" ")[0];
        text.textContent = `Hi, ${firstName}`;
        nameSlot.textContent = user.name;
    } else {
        text.textContent = "SIGN IN / JOIN";
        dropdown.classList.add("hidden");
    }
}

/* ================================
   AUTH MODAL LOGIC
================================ */
const authModal = document.getElementById("auth-modal");
const signinView = document.getElementById("auth-signin-view");
const createView = document.getElementById("auth-create-view");
const successView = document.getElementById("auth-success-view");


// Rewards JOIN NOW button → open modal on Create Account view
document.getElementById("openRewardsJoin")?.addEventListener("click", function (e) {
    e.preventDefault();

    // Open modal
    authModal.classList.remove("hidden");

    // Switch to Create Account view
    signinView.classList.add("hidden");
    createView.classList.remove("hidden");
});


// Unified header button behavior
document.getElementById("authHeaderBtn").addEventListener("click", () => {
    const user = getUser();

    if (user) {
        // Logged in → toggle dropdown
        document.getElementById("accountDropdown").classList.toggle("hidden");
    } else {
        // Logged out → open modal
        authModal.classList.remove("hidden");
    }
});


// Close modal
document.querySelector(".auth-close").addEventListener("click", () => {
    // Reset views
    createView.classList.add("hidden");
    successView.classList.add("hidden");
    signinView.classList.remove("hidden");

    // Close modal
    authModal.classList.add("hidden");
});

// Switch to Create Account
document.getElementById("openCreateAccount").addEventListener("click", () => {
    signinView.classList.add("hidden");
    createView.classList.remove("hidden");
});

// Switch to Sign In
document.getElementById("openSignIn").addEventListener("click", () => {
    createView.classList.add("hidden");
    signinView.classList.remove("hidden");
});


// Password toggle
document.querySelectorAll(".toggle-password").forEach(icon => {
    icon.addEventListener("click", () => {
        const input = icon.previousElementSibling;
        input.type = input.type === "password" ? "text" : "password";
    });
});


// SIGN IN
document.getElementById("signinForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("signinEmail").value;
    const password = document.getElementById("signinPassword").value;

    const user = getUser();

    if (!user || user.email !== email || user.password !== password) {
        alert("Invalid credentials");
        return;
    }

    signinView.classList.add("hidden");
    successView.classList.remove("hidden");
});


// CREATE ACCOUNT
document.getElementById("createAccountForm").addEventListener("submit", (e) => {
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

    const existing = getUser();
    if (existing && existing.email === email) {
        alert("An account with this email already exists.");
        return;
    }

    saveUser({ name, email, password: pass });

    createView.classList.add("hidden");
    successView.classList.remove("hidden");
});


// SUCCESS → CLOSE MODAL
document.getElementById("authSuccessBtn").addEventListener("click", () => {
    successView.classList.add("hidden");
    signinView.classList.remove("hidden");
    authModal.classList.add("hidden");
    updateHeader();
});

// Checkout page Login/Create Account button
document.getElementById("loginBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    // Always reset modal to Sign In view
    signinView.classList.remove("hidden");
    createView.classList.add("hidden");
    successView.classList.add("hidden");

    authModal.classList.remove("hidden");
});


/* ================================
   SIGN OUT
================================ */
document.getElementById("signOutBtn").addEventListener("click", () => {
    clearUser();
    updateHeader();
});



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
    const guestName = document.getElementById("guestName")?.value.trim();
    const guestPhone = document.getElementById("guestPhone")?.value.trim();
    const guestEmail = document.getElementById("guestEmail")?.value.trim();

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
document.querySelector(".payment-close").addEventListener("click", () => {
    paymentModal.classList.add("hidden");
    paymentView.classList.remove("hidden");
    reviewView.classList.add("hidden");
    successView2.classList.add("hidden");
});


// PAYMENT SUBMIT → REVIEW
document.getElementById("paymentForm").addEventListener("submit", (e) => {
    e.preventDefault();

    console.log("PAYMENT SUBMIT FIRED");
    renderReviewSummary();

    paymentView.classList.add("hidden");
    reviewView.classList.remove("hidden");
});

document.getElementById("downloadReceipt").addEventListener("click", () => {
    generateReceiptPDF();
});


// FINAL ORDER
document.getElementById("placeOrderFinal").addEventListener("click", () => {
    reviewView.classList.add("hidden");
    successView2.classList.remove("hidden");

    // CLEAR CART
    localStorage.removeItem("wfCart");

    // RESET CartState so checkout.js sees empty cart
    if (window.WheelFoodieCart) {
        WheelFoodieCart.state.cart = [];
    }

    // UPDATE BAG COUNT
    const cartCount = document.querySelector(".cart-count");
    if (cartCount) cartCount.textContent = "0";

    // REFRESH CHECKOUT PAGE IF USER IS ON IT
    if (window.location.pathname.includes("checkout.html")) {
        if (window.renderCheckout) {
            window.renderCheckout();
        }
    }
});

// RECEIPT DOWNLOAD
document.getElementById("downloadReceipt").addEventListener("click", () => {
    const blob = new Blob(["Receipt content..."], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "receipt.txt";
    a.click();
});


// RETURN TO MENU
document.getElementById("returnToMenu").addEventListener("click", () => {
    window.location.href = "menu.html";
});

// INIT HEADER
updateHeader();