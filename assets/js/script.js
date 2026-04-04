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

    /* MODAL OPEN (Menu + Specials)*/
    const modal = document.getElementById('cart-modal');
    const closeModalBtn = document.querySelector('.close-modal');

    // Buttons that should open the modal
    const orderButtons = document.querySelectorAll(
        '.favorite-item .btn-orange, .menu-item .btn-orange, .add-to-order'
    );

    orderButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (modal) modal.classList.add('show');
        });
    });

    /* MODAL CLOSE */
    if (modal) {
        // Click outside modal box
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

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
});