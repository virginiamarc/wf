const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.main-nav ul');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
});
