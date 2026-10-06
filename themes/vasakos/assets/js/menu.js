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

/* Los `iframe` de terceros llegan sin nombre accesible. El de Telegram —el
   embed de `content/blog/2025/vote-icons.md`— lo crea
   `telegram-widget.js`, que no le pone `title` ni `aria-label` en ninguna de sus
   versiones, así que `axe` marcaba `frame-title` (WCAG 4.1.2) en los dos idiomas
   de esa entrada. El `title` se agrega desde acá porque el `iframe` no existe
   hasta que el script del tercero lo inserta: primero tiene que aparecer en el
   DOM, y para entonces cualquier nombre puesto en el HTML ya llegó tarde.

   Se rotula por `src`, no por posición, para no depender de cuántos embeds
   haya ni del orden en que se carguen. Y sólo se toca el `iframe` que no trae
   nombre: si el tercero lo nombró, su nombre es mejor que el nuestro. */
function rotularIframes(raiz) {
  for (const marco of raiz.querySelectorAll('iframe:not([title]):not([aria-label])')) {
    const origen = marco.getAttribute('src') || '';
    // Se busca `t.me`, no `telegram.org`: el `iframe` que inserta el widget
    // carga desde `t.me/.../?embed=1`, mientras que `telegram.org` es sólo el
    // origen del `<script>`. Buscar el dominio del script no encuentra nada.
    if (origen.includes('t.me/')) marco.title = 'Publicación de Telegram';
  }
}

rotularIframes(document);

// `telegram-widget.js` es `async`: se inserta después de que el documento
// terminó de cargar, y a veces después de que corrió este bundle. El observador
// cubre esa carrera sin tener que esperar un tiempo arbitrario.
new MutationObserver((cambios) => {
  for (const cambio of cambios) {
    for (const nodo of cambio.addedNodes) {
      if (nodo.nodeType !== 1) continue;
      if (nodo.matches?.('iframe')) rotularIframes(nodo.parentNode || document);
      else if (nodo.querySelector?.('iframe')) rotularIframes(nodo);
    }
  }
}).observe(document.documentElement, { childList: true, subtree: true });

// `onclick` del HTML las llama desde el scope global, que en un script clásico
// ya las tiene por ser de primer nivel. Se exponen además a mano para que el
// contrato quede escrito —y sobreviva si el bundle algún día se carga como
// módulo— y para que las pruebas del repositorio puedan llamarlas sin montar
// un navegador entero.
globalThis.openMobileMenu = openMobileMenu;
globalThis.closeMobileMenu = closeMobileMenu;
