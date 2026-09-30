// La documentación de desarrollo nombra comandos de Tauri que existen en otro
// repositorio, y nada comprueba que sigan existiendo: cuando uno se va, la
// página lo sigue ofreciendo y quien lo copia recibe un «command not found» en
// tiempo de ejecución. Estas pruebas atan los que ya se fueron, para que no
// vuelvan a entrar en un catálogo ni en un ejemplo.
import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Comandos que salieron de `vasak-desktop`, con el PR que los sacó. */
const removedDesktopCommands = [
  // Vasak-OS/vasak-desktop#104: la búsqueda global se fue a vasak-prism.
  'global_search',
  'execute_search_result',
  'toggle_search',
];

function markdownFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.name.endsWith('.md') ? [path] : [];
  });
}

const pages = markdownFiles('content').map((path) => ({
  path,
  text: readFileSync(path, 'utf8'),
}));

const catalogs = ['', '.en'].map((suffix) =>
  readFileSync(`content/docs/devs/vasak-desktop/commands-vasak-desktop${suffix}.md`, 'utf8'),
);

describe('comandos que salieron del escritorio', () => {
  test('ninguna página los lista como comando disponible', () => {
    for (const command of removedDesktopCommands) {
      const listed = new RegExp(`^\\s*[-*]\\s+\`${command}\\(`, 'm');
      const offenders = pages.filter((page) => listed.test(page.text)).map((page) => page.path);
      expect(offenders).toEqual([]);
    }
  });

  test('ningún ejemplo los invoca', () => {
    for (const command of removedDesktopCommands) {
      const invoked = new RegExp(`invoke(<[^>]*>)?\\(\\s*['"\`]${command}['"\`]`);
      const offenders = pages.filter((page) => invoked.test(page.text)).map((page) => page.path);
      expect(offenders).toEqual([]);
    }
  });

  test('el catálogo, en los dos idiomas, documenta el reenvío al lanzador', () => {
    for (const catalog of catalogs) {
      expect(catalog).toContain('org.vasak.os.Desktop');
      expect(catalog).toContain('`OpenSearch`');
      expect(catalog).toContain('`ToggleSearch`');
      expect(catalog).toContain('ar.net.vasak.Prism');
      expect(catalog).toContain('/ar/net/vasak/Prism');
      expect(catalog).toContain('`Toggle`');
    }
  });

  test('el ejemplo por consola no espera una respuesta que el escritorio no da', () => {
    for (const catalog of catalogs) {
      const desktopCalls = catalog
        .split('\n')
        .filter((line) => line.includes('busctl') && line.includes('org.vasak.os.Desktop'));
      expect(desktopCalls.length).toBeGreaterThan(0);
      for (const line of desktopCalls) expect(line).toContain('--expect-reply=no');
    }
  });
});
