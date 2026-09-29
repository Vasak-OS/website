const mobileMenu = document.getElementById('mobile-menu');
const mobileDialog = mobileMenu ? mobileMenu.closest('dialog') : null;

function openMobileMenu() {
  if (mobileMenu) mobileMenu.classList.remove('hidden');
  if (mobileDialog) mobileDialog.showModal();
}

function closeMobileMenu() {
  if (mobileMenu) mobileMenu.classList.add('hidden');
  if (mobileDialog) mobileDialog.close();
}