// El estado de VasakOS se afirma en el texto de un puñado de páginas, y no en
// un solo lugar: el estado del proyecto, las preguntas frecuentes, la guía de
// instalación y la de descargas. Son las páginas que alguien lee antes de
// decidir si instala, y cada una lo dice con sus palabras —«VasakOS is in
// **Beta**», «This is a Beta release.»—, así que nada las obliga a coincidir:
// el build no compila lo que dicen y el sitio publica el mismo sistema con dos
// estados distintos según el idioma.
//
// Pasó: el español decía Beta y tres páginas en inglés seguían en Alpha, con la
// release Beta 1 ya publicada. Estos tests atan las dos afirmaciones —el estado
// vigente y su par en el otro idioma— y avisan cuando una de las dos se queda
// atrás.
//
// Los changelogs y el blog no entran: cuentan lo que pasó, con las Alpha de
// entonces y la Beta de hoy. Ahí «Alpha» es una fecha, no una afirmación sobre
// el estado actual, y corregirlo sería falsear el archivo.
import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Las páginas que afirman en qué estado está VasakOS hoy, sin la extensión ni
 * el sufijo de idioma. Son las cuatro que alguien mira para decidir si lo
 * instala.
 */
const CURRENT_STATE_PAGES = [
  'content/state/index',
  'content/docs/user/faq',
  'content/docs/user/installation',
  'content/downloads/index',
] as const;

/** Los dos idiomas del sitio, con el sufijo del archivo de cada uno. */
const LANGUAGES = [
  { suffix: '', name: 'español' },
  { suffix: '.en', name: 'inglés' },
] as const;

/** Las secciones históricas: cuentan versiones pasadas y no se reescriben. */
const HISTORICAL_DIRS = ['content/changelogs', 'content/blog'] as const;

interface Page {
  path: string;
  slug: string;
  suffix: string;
  text: string;
}

/** La ruta de una página de estado, en el idioma que le toca. */
function pagePath(slug: string, suffix: string): string {
  return `${slug}${suffix}.md`;
}

/** El texto de una página de estado, o `null` si no existe. */
function readPage(slug: string, suffix: string): string | null {
  const path = pagePath(slug, suffix);
  return existsSync(path) ? readFileSync(path, 'utf8') : null;
}

/**
 * Todas las páginas del estado vigente, en los dos idiomas. Las que no existen
 * no se inventan: quien las eche de menos recibirá el aviso de la prueba que
 * las busca.
 */
function currentStatePages(): Page[] {
  const pages: Page[] = [];
  for (const slug of CURRENT_STATE_PAGES) {
    for (const language of LANGUAGES) {
      const text = readPage(slug, language.suffix);
      if (text === null) continue;
      pages.push({ path: pagePath(slug, language.suffix), slug, suffix: language.suffix, text });
    }
  }
  return pages;
}

/**
 * El texto de una página sin sus líneas de tabla. Las tablas de `state/index.*`
 * llevan una fila por cada estado posible —**Alpha** incluido—: son la leyenda
 * que explica qué significa cada uno, no una afirmación de que VasakOS esté
 * ahí. Es la única amnistía: el mismo «Alpha» fuera de la tabla sigue contando.
 */
function withoutTableRows(text: string): string {
  return text
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('|'))
    .join('\n');
}

/** Lo que una página afirma sobre el estado vigente, fuera de las tablas. */
function affirmations(text: string): { beta: boolean; alpha: boolean } {
  const body = withoutTableRows(text);
  return { beta: body.includes('Beta'), alpha: body.includes('Alpha') };
}

/**
 * Los términos de `tags:` del front matter, en minúscula. Acepta las dos formas
 * que usa el sitio: la lista en línea `tags: [a, b]` y la lista con guiones.
 */
function frontMatterTags(text: string): string[] {
  const inline = /^tags:\s*\[(.*)\]\s*$/m.exec(text);
  if (inline) {
    return inline[1]
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
  }
  const list = /^tags:\s*\n((?:[ \t]*-[ \t]*.+\n?)+)/m.exec(text);
  if (!list) return [];
  return [...list[1].matchAll(/^[ \t]*-[ \t]*(.+?)\s*$/gm)].map((m) => m[1].toLowerCase());
}

/** Los archivos de las secciones históricas: changelogs y blog. */
function historicalPages(): string[] {
  const paths: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) walk(path);
      else if (entry.endsWith('.md')) paths.push(path);
    }
  };
  for (const dir of HISTORICAL_DIRS) walk(dir);
  return paths;
}

describe('estado vigente de VasakOS', () => {
  test('las cuatro páginas del estado existen en los dos idiomas', () => {
    // Sin la gemela, la afirmación queda publicada en un idioma y en el otro no:
    // quien entra por el árbol equivocado no encuentra nada que decirle.
    const missing: string[] = [];
    for (const slug of CURRENT_STATE_PAGES) {
      for (const language of LANGUAGES) {
        const path = pagePath(slug, language.suffix);
        if (!existsSync(path)) missing.push(`${path} (no existe)`);
      }
    }
    expect(missing).toEqual([]);
  });

  test('cada página afirma Beta y no dice Alpha', () => {
    // Es lo que el cambio fija: el estado vigente es Beta, en las dos lenguas.
    const offenders: string[] = [];
    for (const page of currentStatePages()) {
      const { beta, alpha } = affirmations(page.text);
      if (!beta) offenders.push(`${page.path} (no afirma Beta)`);
      if (alpha) offenders.push(`${page.path} (sigue afirmando Alpha)`);
    }
    expect(offenders).toEqual([]);
  });

  test('los dos idiomas afirman lo mismo par por par', () => {
    // El modo de falla que ya pasó: el español se actualizó y el inglés no. Se
    // comparan las afirmaciones de cada par —no la redacción, cada página usa
    // la suya— y se nombra la asimetría al fallar.
    const mismatched: string[] = [];
    for (const slug of CURRENT_STATE_PAGES) {
      const es = readPage(slug, '');
      const en = readPage(slug, '.en');
      if (es === null || en === null) continue; // lo cubre la prueba de arriba
      const spanish = affirmations(es);
      const english = affirmations(en);
      for (const [what, key] of [
        ['Beta', 'beta'],
        ['Alpha', 'alpha'],
      ] as const) {
        if (spanish[key] !== english[key]) {
          mismatched.push(
            `${pagePath(slug, '')} y ${pagePath(slug, '.en')} discrepan sobre ${what}: ` +
              `español=${spanish[key]}, inglés=${english[key]}`,
          );
        }
      }
    }
    expect(mismatched).toEqual([]);
  });

  test('la leyenda de estados conserva Alpha y fuera de la tabla no se dice Alpha', () => {
    // `state/index.*` explica los cinco estados en una tabla, y ahí **Alpha**
    // tiene que seguir estando: es la definición del estado. La prueba ignora
    // las líneas de tabla —y sólo ésas—, así que se comprueba también que la
    // fila siga ahí: sin ella el filtro quedaría sin ejercitar y el test pasaría
    // por haber borrado la leyenda en vez de por decir Beta.
    const offenders: string[] = [];
    for (const language of LANGUAGES) {
      const path = pagePath('content/state/index', language.suffix);
      const text = readPage('content/state/index', language.suffix);
      if (text === null) {
        offenders.push(`${path} (no existe)`);
        continue;
      }
      if (!text.includes('**Alpha**')) {
        offenders.push(`${path} (perdió la fila de **Alpha** de la leyenda)`);
      }
      if (withoutTableRows(text).includes('Alpha')) {
        offenders.push(`${path} (dice Alpha fuera de la leyenda)`);
      }
    }
    expect(offenders).toEqual([]);
  });

  test('la etiqueta de estado del front matter acompaña a la prosa', () => {
    // `tags: [estado, roadmap, vasakos, beta, desarrollo]` arma `/tags/beta/`.
    // Si la prosa pasa a Beta y la etiqueta se queda en `alpha`, la página sigue
    // agrupada con lo viejo, y `tags.test.ts` no lo ve: `alpha` es un término
    // válido mientras existan los anuncios de las versiones Alpha.
    const offenders: string[] = [];
    for (const language of LANGUAGES) {
      const path = pagePath('content/state/index', language.suffix);
      const text = readPage('content/state/index', language.suffix);
      if (text === null) {
        offenders.push(`${path} (no existe)`);
        continue;
      }
      const tags = frontMatterTags(text);
      if (!tags.includes('beta')) offenders.push(`${path} (no lleva la etiqueta \`beta\`)`);
      if (tags.includes('alpha')) offenders.push(`${path} (todavía lleva la etiqueta \`alpha\`)`);
    }
    expect(offenders).toEqual([]);
  });

  test('los changelogs y el blog son históricos y quedan fuera del barrido', () => {
    // Cuentan lo que pasó: la Beta 1 del 2026-10-04 y las Alpha anteriores. Ahí
    // «Alpha» es una fecha, no una afirmación sobre el estado de hoy, y esta
    // prueba no puede exigir que desaparezca. Se comprueba que el barrido no los
    // mira y que hay algo que mirar —archivos históricos que sí dicen Alpha—
    // para que la exclusión no sea una excusa vacía.
    const scanned = new Set(currentStatePages().map((page) => page.path));
    const historical = historicalPages();
    const withAlpha = historical.filter((path) => readFileSync(path, 'utf8').includes('Alpha'));

    expect(historical.length).toBeGreaterThan(0);
    expect(withAlpha.length).toBeGreaterThan(0);
    expect(historical.filter((path) => scanned.has(path))).toEqual([]);
  });
});
