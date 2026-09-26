/*
  Language switcher.

  The markup works without any of this: the list is revealed by `:hover` and
  `:focus-within` in CSS, so it opens on its own when a keyboard or a pointer
  finds it. What the script adds is the click on the button, which is what a
  touch device has instead of a hover, and closing the list once a language has
  been chosen.

  It deliberately does not try to remember the choice in localStorage. A stored
  preference would send a visitor to `/en/` on their next visit to a page that
  only exists in Spanish, and the page they asked for would become a redirect.
*/
(function () {
  var switches = document.querySelectorAll('[data-lang-switcher]');
  if (!switches.length) return;

  Array.prototype.forEach.call(switches, function (root) {
    var toggle = root.querySelector('[data-lang-toggle]');
    var menu = root.querySelector('[data-lang-menu]');
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.classList.toggle('hidden', !open);
    }

    setOpen(false);

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('[data-lang-link]')) setOpen(false);
    });

    /* Escape closes it and puts focus back on the button, so the keyboard does
       not get stranded inside a menu that is no longer visible. */
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  });

  document.addEventListener('click', function () {
    Array.prototype.forEach.call(switches, function (root) {
      var toggle = root.querySelector('[data-lang-toggle]');
      var menu = root.querySelector('[data-lang-menu]');
      if (toggle && menu) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.add('hidden');
      }
    });
  });
})();
