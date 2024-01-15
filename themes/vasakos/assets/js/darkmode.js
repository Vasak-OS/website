const darkmode = getDarkmode();
const toggleDarkmodeButton = document.getElementById('toggletheme');

if (darkmode === 'true') {
  document.body.classList.add('dark');
  toggleDarkmodeButton.innerHTML = '<em class="fas fa-sun"></em>';
}

function getDarkmode() {
  return localStorage.getItem('darkmode');
}

function setDarkmode(value) {
  localStorage.setItem('darkmode', value);
}

function toggleDarkmode() {
  if (document.body.classList.contains('dark')) {
    document.body.classList.remove('dark');
    setDarkmode('false');
    toggleDarkmodeButton.innerHTML = '<em class="fas fa-moon"></em>';
  } else {
    document.body.classList.add('dark');
    setDarkmode('true');
    toggleDarkmodeButton.innerHTML = '<em class="fas fa-sun"></em>';
  }
}

