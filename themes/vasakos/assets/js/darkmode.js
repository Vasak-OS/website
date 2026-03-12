const darkmode = getDarkmode();
const toggleDarkmodeButton = document.getElementById('toggletheme');

if (darkmode === 'true') {
  document.documentElement.classList.add('dark');
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
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    setDarkmode('false');
    toggleDarkmodeButton.innerHTML = '<em class="fas fa-moon"></em>';
  } else {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    setDarkmode('true');
    toggleDarkmodeButton.innerHTML = '<em class="fas fa-sun"></em>';
  }
}

