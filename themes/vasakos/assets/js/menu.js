const mobileMenu = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-menu-overlay');

function openMobileMenu() {
  if (mobileOverlay) mobileOverlay.classList.remove('hidden');
  if (mobileMenu) mobileMenu.classList.remove('hidden');
}

function closeMobileMenu() {
  if (mobileOverlay) mobileOverlay.classList.add('hidden');
  if (mobileMenu) mobileMenu.classList.add('hidden');
}