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
});

