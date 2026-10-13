// Las páginas de `content/docs/devs/vue-libvasak/` documentan los componentes de
// una biblioteca que vive en otro repositorio: el sitio no compila nada de ella
// y nada avisa cuando cambia. Un componente nuevo sin página, o una página que
// se queda sin su par de idioma, no rompe el build: simplemente no se encuentra,
// o se encuentra en un solo idioma.
//
// Igual que `plugin-docs.test.ts` ata los comandos de los plugins contra una
// lista fijada a mano desde la fuente, acá se fijan los componentes que la
// librería exporta —leídos de su `src/index.ts`, PascalCase a kebab-case—. La
// lista no se lee de las páginas a propósito: este test corre en CI sólo con
// este repo, y su trabajo es avisar cuando la documentación se degrada, no
// generar documentación.
import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';

/** Los componentes que `@vasakgroup/vue-libvasak` exporta, en kebab-case. */
const COMPONENTES = [
  'action-button', 'alert-message', 'app-bar', 'avatar', 'badge', 'bar-chart',
  'bar-search', 'calendar-heatmap', 'checkbox', 'chip', 'clock-display',
  'code-block', 'config-section', 'cover-art', 'device-card', 'device-orbit',
  'dialog', 'dialog-body', 'dialog-content', 'dialog-description',
  'dialog-footer', 'dialog-header', 'dialog-title', 'disclosure', 'drop-zone',
  'dropdown-menu', 'dropdown-menu-content', 'dropdown-menu-item',
  'dropdown-menu-label', 'dropdown-menu-separator', 'dropdown-menu-trigger',
  'empty-state', 'equalizer', 'event-list', 'form-group', 'hourly-forecast',
  'icon-tile', 'identity-block', 'kbd', 'list-card', 'list-group', 'list-row',
  'loading-state', 'marquee-text', 'month-calendar', 'now-playing-card',
  'number-field', 'option-group', 'page-dots', 'page-header', 'panel',
  'panel-pill', 'password-field', 'popover', 'popover-anchor', 'popover-content',
  'popover-trigger', 'power-actions', 'progress-bar', 'progress-ring',
  'property-list', 'quick-settings-tile', 'search-field', 'search-select',
  'section-heading', 'seek-bar', 'segmented-control', 'select-field',
  'setting-row', 'side-bar', 'side-button', 'side-group', 'skeleton',
  'slider', 'slider-control', 'spinning-cover', 'stat-tile', 'status-dot',
  'switch-row', 'switch-toggle', 'switch-track', 'tab-bar', 'tab-item',
  'text-area', 'text-context-menu', 'text-input', 'theme-icon', 'toast-area',
  'toggle-control', 'tooltip', 'tooltip-content', 'tooltip-trigger',
  'tray-icon-button', 'wallpaper-carousel', 'wallpaper-thumbnail',
  'window-controls', 'window-frame', 'workspace-switcher',
] as const;

/** Los dos idiomas del sitio, con los títulos de sección que usa cada uno. */
const IDIOMAS = [
  {
    sufijo: '',
    indice: 'content/docs/devs/vue-libvasak/_index.md',
    secciones: ['### Descripción', '### Props', '### Uso'],
  },
  {
    sufijo: '.en',
    indice: 'content/docs/devs/vue-libvasak/_index.en.md',
    secciones: ['### Description', '### Props', '### Usage'],
  },
] as const;

function rutaDe(slug: string, sufijo: string): string {
  return `content/docs/devs/vue-libvasak/${slug}${sufijo}.md`;
}

/** El front matter, o `''` si la página no lo trae. */
function frontMatter(texto: string): string {
  if (!texto.startsWith('---\n')) return '';
  const fin = texto.indexOf('\n---', 4);
  return fin === -1 ? '' : texto.slice(4, fin);
}

describe('las páginas de los componentes de vue-libvasak', () => {
  test('cada componente tiene su página en los dos idiomas', () => {
    // Una página sin su par queda publicada en un idioma y en el otro no: quien
    // sigue el enlace desde la versión equivocada encuentra un 404.
    const faltantes: string[] = [];
    for (const slug of COMPONENTES) {
      for (const idioma of IDIOMAS) {
        if (!existsSync(rutaDe(slug, idioma.sufijo))) faltantes.push(rutaDe(slug, idioma.sufijo));
      }
    }
    expect(faltantes).toEqual([]);
  });

  test('cada página declara title, description y weight', () => {
    // Sin `weight` el orden queda a merced del alfabeto, y sin `description` el
    // buscador inventa el resumen con el primer párrafo.
    const sinFrontMatter: string[] = [];
    for (const slug of COMPONENTES) {
      for (const idioma of IDIOMAS) {
        const ruta = rutaDe(slug, idioma.sufijo);
        if (!existsSync(ruta)) continue;
        const front = frontMatter(readFileSync(ruta, 'utf8'));
        for (const clave of ['title', 'description', 'weight']) {
          if (!new RegExp(`^${clave}:\\s*\\S`, 'm').test(front)) {
            sinFrontMatter.push(`${ruta} (falta \`${clave}\`)`);
          }
        }
      }
    }
    expect(sinFrontMatter).toEqual([]);
  });

  test('cada página trae descripción, props y uso, en el idioma que le toca', () => {
    // La trinidad de una página de componente: qué es, qué acepta y cómo se
    // usa. Sin `### Uso` la página describe y no muestra; sin `### Props` no se
    // sabe qué pasarle.
    const faltantes: string[] = [];
    for (const slug of COMPONENTES) {
      for (const idioma of IDIOMAS) {
        const ruta = rutaDe(slug, idioma.sufijo);
        if (!existsSync(ruta)) continue;
        const texto = readFileSync(ruta, 'utf8');
        for (const titulo of idioma.secciones) {
          if (!texto.split('\n').includes(titulo)) {
            faltantes.push(`${ruta} (falta \`${titulo}\`)`);
          }
        }
      }
    }
    expect(faltantes).toEqual([]);
  });

  test('la sección tiene su índice en los dos idiomas', () => {
    // Sin `_index` la sección no tiene tarjeta en la lista de desarrollo y las
    // páginas son inalcanzables desde el menú.
    for (const idioma of IDIOMAS) {
      expect(existsSync(idioma.indice)).toBe(true);
    }
  });
});
