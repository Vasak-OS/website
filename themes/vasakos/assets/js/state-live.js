// Consulta el índice del repositorio de paquetes desde el navegador y pone al
// día las versiones que ya están en la página.
//
// El sitio es estático: sin esto, publicar un paquete obliga a redesplegar la
// web para que /state/ deje de mostrar el número anterior. Con esto, el HTML que
// se sirve es el del último build —así los buscadores y quien no tenga
// JavaScript ven la tabla completa— y el navegador la corrige contra lo que el
// repositorio publica en este momento.
//
// Es una mejora progresiva, no la fuente de la página: si la petición falla
// (repositorio caído, CORS mal configurado, alguien sin conexión), no pasa nada
// y queda a la vista lo que vino del build.
//
// Requiere que repo.vasak.net.ar sirva vasakos.json con
// `Access-Control-Allow-Origin: https://os.vasak.net.ar` — ver docs/user/repository.

(function () {
  var root = document.querySelector('[data-repo-index]');
  if (!root) return;

  var endpoint = root.getAttribute('data-repo-index');
  if (!endpoint) return;

  var cells = document.querySelectorAll('[data-pkg-version]');
  if (!cells.length) return;

  var states = {};
  document.querySelectorAll('[data-repo-state]').forEach(function (el) {
    states[el.getAttribute('data-repo-state')] = el;
  });

  function show(name) {
    Object.keys(states).forEach(function (key) {
      // Las dos clases declaran `display` y tienen la misma especificidad, así
      // que gana la que Tailwind emita última — y emite `.inline-flex` después
      // de `.hidden`. Agregar `hidden` sin sacar `inline-flex` no ocultaba
      // nada: el cartel de «el repositorio no respondió» seguía a la vista
      // junto al de «versiones leídas del repositorio», aunque los datos
      // hubieran llegado bien. Se alternan las dos.
      states[key].classList.toggle('hidden', key !== name);
      states[key].classList.toggle('inline-flex', key === name);
    });
  }

  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    try {
      return new Intl.DateTimeFormat('es-AR', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
      }).format(d) + ' UTC';
    } catch (e) {
      return iso;
    }
  }

  if (states.loading) show('loading');

  fetch(endpoint, { cache: 'no-cache' })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      var packages = (data && data.packages) || [];
      if (!packages.length) throw new Error('índice vacío');

      var byName = {};
      packages.forEach(function (pkg) { byName[pkg.name] = pkg; });

      var listed = {};
      cells.forEach(function (cell) {
        var name = cell.getAttribute('data-pkg-version');
        listed[name] = true;
        var pkg = byName[name];
        if (!pkg || !pkg.version) return;
        if (cell.textContent.trim() !== pkg.version) {
          cell.textContent = pkg.version;
          // Sólo para quien esté mirando la página en ese momento; sin esto el
          // cambio ocurre y nadie lo nota.
          cell.setAttribute('title', 'Actualizado desde el repositorio');
        }
      });

      // Paquetes publicados que no tienen fila propia (llavero, mirrorlist,
      // dependencias). Se cuentan, no se inventan filas: no hay texto editorial
      // para ellos.
      var extra = packages.filter(function (pkg) { return !listed[pkg.name]; }).length;
      var extraEl = document.querySelector('[data-repo-extra]');
      var extraWrap = document.querySelector('[data-repo-extra-wrap]');
      if (extraEl) extraEl.textContent = String(extra);
      if (extraWrap) extraWrap.classList.toggle('hidden', extra === 0);

      var generated = document.querySelector('[data-repo-generated]');
      if (generated) {
        var when = data.generated ? formatDate(data.generated) : '';
        generated.textContent = when ? ', publicado el ' + when : '';
      }
      show('live');
    })
    .catch(function (err) {
      if (states.stale) show('stale');
      console.warn('No se pudo consultar el repositorio de paquetes:', err.message);
    });
})();
