document.addEventListener("DOMContentLoaded", () => {
    
    // Mobile hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.main-nav ul');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
    }

    // Account dropdown toggle
    const accountLabel = document.querySelector('.account-label');
    const accountDropdown = document.querySelector('.account-dropdown');

    if (accountLabel && accountDropdown) {
        accountLabel.addEventListener('click', () => {
            accountDropdown.classList.toggle('open');
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

        locationBtn.onclick = () => {
            locationModal.style.display = "flex";
        };

        locationClose.onclick = () => {
            locationModal.style.display = "none";
        };

        window.addEventListener("click", (e) => {
            if (e.target === locationModal) {
                locationModal.style.display = "none";
            }
        });
    }

    /* CATERING PAGE DROPDOWNS */
    const cateringDropdowns = document.querySelectorAll('.dropdown-toggle');

    if (cateringDropdowns.length > 0) {
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
                    // Two-column layout uses grid
                    if (content.classList.contains('two-col')) {
                        content.style.display = 'grid';
                    } else {
                        content.style.display = 'block';
                    }
                    button.classList.add('active');
                }
            });
        });
    }

    /* AUTH MODAL - global login/create account modal */
    // Open modal from header
    document.querySelector('.auth-trigger')?.addEventListener('click', () => {
        document.getElementById('auth-modal').classList.remove('hidden');
    });

    // Open modal from checkout button
    document.querySelector('.checkout-auth-btn')?.addEventListener('click', () => {
        document.getElementById('auth-modal').classList.remove('hidden');
    });

    // Close modal
    document.querySelector('.auth-close').addEventListener('click', () => {
        document.getElementById('auth-modal').classList.add('hidden');
    });

    // Close when clicking outside
    document.getElementById('auth-modal').addEventListener('click', (e) => {
        if (e.target.id === 'auth-modal') {
            document.getElementById('auth-modal').classList.add('hidden');
        }
    });

});