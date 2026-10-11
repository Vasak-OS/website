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

  test('el ejemplo por consola espera la respuesta que el escritorio ahora da', () => {
    // Desde vasak-desktop 1.64.1 (Vasak-OS/vasak-desktop#226) todos los
    // métodos de org.vasak.os.Desktop contestan: el ejemplo ya no necesita
    // pedir que no se espere respuesta, y el texto lo explica.
    const replies = [/todos los métodos[^.]*contestan/, /every method[^.]*replies/];
    catalogs.forEach((catalog, index) => {
      const desktopCalls = catalog
        .split('\n')
        .filter((line) => line.includes('busctl') && line.includes('org.vasak.os.Desktop'));
      expect(desktopCalls.length).toBeGreaterThan(0);
      for (const line of desktopCalls) expect(line).not.toContain('--expect-reply=no');
      expect(catalog).toMatch(replies[index]);
      expect(catalog).toContain('org.vasak.os.Desktop.Error');
      expect(catalog).toContain('UnknownMethod');
      // Quien sigue pidiendo no recibir respuesta no se rompe.
      expect(catalog).toContain('--expect-reply=no');
    });
  });
});
