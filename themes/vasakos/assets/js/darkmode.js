// The `dark` class is already on <html> by the time this runs — head.html sets
// it inline, before the first paint, so there is no flash. This only keeps
// <body> and the toggles' icons in sync, and persists the choice.

const themeToggles = document.querySelectorAll('.js-theme-toggle');

const isDark = () => document.documentElement.classList.contains('dark');

function paintToggles() {
  const label = isDark() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  themeToggles.forEach((button) => {
    button.innerHTML = `<i class="fa-solid ${isDark() ? 'fa-sun' : 'fa-moon'}" aria-hidden="true"></i>`;
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
    button.setAttribute('aria-pressed', String(isDark()));
  });
}

function toggleDarkmode() {
  document.documentElement.classList.toggle('dark');
  document.body.classList.toggle('dark', isDark());
  try {
    localStorage.setItem('darkmode', String(isDark()));
  } catch (e) {
    /* private mode: the choice just does not survive the tab */
  }
  paintToggles();
  // Mermaid renders its diagrams with baked-in colours, so a theme change has
  // to redraw them. Only present on pages that actually have a diagram.
  if (typeof window.vskRedrawMermaid === 'function') window.vskRedrawMermaid();
}

themeToggles.forEach((button) => button.addEventListener('click', toggleDarkmode));

document.body.classList.toggle('dark', isDark());
paintToggles();
