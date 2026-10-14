// Las páginas de `content/docs/user/` son la documentación que se publica tal
// cual: nadie compila lo que dicen y nada avisa cuando se degradan. Un comando
// que ya no existe, una ruta de configuración inventada o un lugar equivocado
// para mirar los errores no rompen el build: dejan la página en pie, ofreciendo
// algo que el usuario no va a encontrar cuando lo busque.
//
// Acá el texto se ata contra los hechos del sistema —el **Monitor del sistema**
// es donde están los errores, en la pantalla **Registros**, con la casilla
// **Sólo errores**; el archivo de log del escritorio es uno por día; la
// configuración vive en `~/.config/vasak/vasak.conf`— y contra lo que ya no es
// de VasakOS: los gestores de paquetes de otras distribuciones, `pkill`,
// `xrandr` como consejo, `RUST_LOG`. Mismo espíritu que `plugin-docs.test.ts`:
// la lista se fija a mano desde la fuente, no se lee de las páginas, porque el
// trabajo del test es avisar cuando la documentación se degrada.
import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

const USER_DOCS_DIR = 'content/docs/user';

/**
 * Los dos idiomas del sitio, con el vocabulario que cada uno usa para nombrar
 * lo mismo. Los rótulos (`Registros`, `Sólo errores`, `Application`) son los
 * que se ven en pantalla: si el monitor los renombra, la página miente.
 */
const LANGUAGES = [
  {
    suffix: '',
    monitor: 'Monitor del sistema',
    logsScreen: 'Registros',
    errorsOnly: 'Sólo errores',
    selector: 'Aplicación',
    wholeEcosystem: 'Todo el ecosistema',
    wholeSystem: 'Todo el sistema',
    monitorLink: '(/docs/user/monitoring/)',
    screens: ['Recursos', 'Aplicaciones', 'Servicios', 'Limpieza', 'Registros'],
    logFile: 'vasak-desktop-AAAA-MM-DD.log',
    retention: 'siete',
  },
  {
    suffix: '.en',
    monitor: 'System Monitor',
    logsScreen: 'Logs',
    errorsOnly: 'Errors only',
    selector: 'Application',
    wholeEcosystem: 'The whole ecosystem',
    wholeSystem: 'The whole system',
    monitorLink: '(/en/docs/user/monitoring/)',
    screens: ['Resources', 'Applications', 'Services', 'Cleanup', 'Logs'],
    logFile: 'vasak-desktop-YYYY-MM-DD.log',
    retention: 'seven',
  },
] as const;

/** Las páginas que mandan al monitor cuando el escritorio sí está en marcha. */
const PAGES_LINKING_TO_MONITOR = ['logs', 'errors', 'report-bugs', 'updating'] as const;

/** Cómo se llega a los errores cuando el escritorio no arranca. */
const RECOVERY_SHELL = ['Ctrl+Alt+F2', 'journalctl -b -p err', 'arch-chroot', 'coredumpctl'];

/**
 * Lo que la documentación ya no puede nombrar: variables de entorno que no
 * existen y archivos de configuración inventados. Quien los copia no obtiene
 * nada, y encima deja de buscar donde sí está.
 */
const FICTITIOUS = [
  'RUST_LOG',
  'VASAK_SUPPRESS_ERRORS',
  'system_config.json',
  '~/.config/vasak-desktop/config.toml',
  'shortcuts.json',
];

/**
 * Los gestores de paquetes de otras distribuciones, anclados al uso como
 * comando: sueltos chocarían con palabras como «adaptador».
 */
const FOREIGN_PACKAGE_MANAGERS = [
  /\bsudo\s+apt(-get)?\b/,
  /\bapt(-get)?\s+(install|remove|purge|update|upgrade|dist-upgrade|autoremove)\b/,
  /\bsudo\s+(dnf|yum|zypper)\b/,
  /\b(dnf|yum|zypper)\s+(install|remove|erase|update)\b/,
];

/**
 * Comandos que se fueron de las páginas de usuario: matan procesos sin que el
 * programa guarde, y los suyos eran de X11, de PulseAudio o de BlueZ viejo.
 */
const REMOVED_COMMANDS = [
  /\bpkill\b/,
  /\busermod\s+-a\b/,
  /\bgroupadd\b/,
  /\bhciconfig\b/,
  /\biwlist\b/,
  /\bsudo\s+dhclient\b/,
];

/** `xrandr` puede aparecer para descartarlo; como consejo, no. */
const XRANDR_AS_ADVICE = [/xrandr\s+--/, /xrandr\s+-[a-zA-Z]/, /xrandr\b[^\n]*\|/];

interface Page {
  path: string;
  slug: string;
  suffix: string;
  text: string;
}

function pagePath(slug: string, suffix: string): string {
  return `${USER_DOCS_DIR}/${slug}${suffix}.md`;
}

/** Todas las páginas de usuario, con el idioma y el slug que les toca. */
function pages(): Page[] {
  return readdirSync(USER_DOCS_DIR)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const suffix = name.endsWith('.en.md') ? '.en' : '';
      return {
        path: `${USER_DOCS_DIR}/${name}`,
        slug: name.slice(0, name.length - suffix.length - '.md'.length),
        suffix,
        text: readFileSync(`${USER_DOCS_DIR}/${name}`, 'utf8'),
      };
    });
}

/** El texto de una página, o `null` si no existe. */
function readPage(slug: string, suffix: string): string | null {
  return existsSync(pagePath(slug, suffix)) ? readFileSync(pagePath(slug, suffix), 'utf8') : null;
}

/** El front matter, o `''` si la página no lo trae. */
function frontMatter(text: string): string {
  if (!text.startsWith('---\n')) return '';
  const end = text.indexOf('\n---', 4);
  return end === -1 ? '' : text.slice(4, end);
}

/** Las páginas que contienen una aguja, para nombrarlas al fallar. */
function pagesContaining(needle: string): string[] {
  return pages()
    .filter((page) => page.text.includes(needle))
    .map((page) => page.path);
}

/** La primera línea de cada página que case con un patrón, con su ruta. */
function linesMatching(pattern: RegExp): string[] {
  const offenders: string[] = [];
  for (const page of pages()) {
    const line = page.text.split('\n').find((candidate) => pattern.test(candidate));
    if (line !== undefined) offenders.push(`${page.path} (${line.trim()})`);
  }
  return offenders;
}

describe('documentación de usuario', () => {
  test('cada página de usuario tiene su par en el otro idioma', () => {
    // Una página sin par queda publicada en un idioma y en el otro no: quien
    // sigue el enlace desde la versión equivocada encuentra un 404.
    const missing: string[] = [];
    for (const page of pages()) {
      const twin = pagePath(page.slug, page.suffix === '' ? '.en' : '');
      if (!existsSync(twin)) missing.push(`${page.path} (falta ${twin})`);
    }
    expect(missing).toEqual([]);
  });

  test('la página del monitor existe en los dos idiomas y enuncia sus pantallas', () => {
    // Es la página a la que apuntan las demás: sin ella el enlace del monitor
    // no lleva a nada, y sin las cinco pantallas nombradas nadie sabe que
    // Registros es una de ellas.
    const missing: string[] = [];
    for (const language of LANGUAGES) {
      const path = pagePath('monitoring', language.suffix);
      const text = readPage('monitoring', language.suffix);
      if (text === null) {
        missing.push(`${path} (no existe)`);
        continue;
      }
      if (!text.includes('vasak-monitor')) {
        missing.push(`${path} (no nombra el paquete \`vasak-monitor\`)`);
      }
      for (const screen of language.screens) {
        if (!text.includes(screen)) missing.push(`${path} (no nombra «${screen}»)`);
      }
    }
    expect(missing).toEqual([]);
  });

  test('los errores quedan enunciados en el monitor, en Registros y con Sólo errores', () => {
    // El hecho que el cambio fija: los errores se ven en el Monitor del
    // sistema, en la pantalla Registros, con la casilla Sólo errores y el
    // selector Aplicación. Si eso se cae de la página del monitor, el resto de
    // las páginas enlazan a una explicación que ya no explica.
    const missing: string[] = [];
    for (const language of LANGUAGES) {
      const path = pagePath('monitoring', language.suffix);
      const text = readPage('monitoring', language.suffix);
      if (text === null) {
        missing.push(`${path} (no existe)`);
        continue;
      }
      const pieces = [
        ['el monitor', language.monitor],
        ['la pantalla', language.logsScreen],
        ['la casilla', language.errorsOnly],
        ['el selector', language.selector],
        ['el alcance del ecosistema', language.wholeEcosystem],
        ['el alcance del sistema', language.wholeSystem],
      ] as const;
      for (const [what, needle] of pieces) {
        if (!text.includes(needle)) missing.push(`${path} (no nombra ${what}: «${needle}»)`);
      }
    }
    expect(missing).toEqual([]);
  });

  test('los logs se enuncian en el monitor, en Registros', () => {
    // La página de logs dice dónde quedan los mensajes: si deja de mandar a
    // Registros, la ruta corta para ver los errores desaparece justo de la
    // página donde se la busca.
    const missing: string[] = [];
    for (const language of LANGUAGES) {
      const path = pagePath('logs', language.suffix);
      const text = readPage('logs', language.suffix);
      if (text === null) {
        missing.push(`${path} (no existe)`);
        continue;
      }
      for (const needle of [language.monitor, language.logsScreen, language.errorsOnly]) {
        if (!text.includes(needle)) missing.push(`${path} (no nombra «${needle}»)`);
      }
    }
    expect(missing).toEqual([]);
  });

  test('las páginas que hablan del monitor enlazan a la suya', () => {
    // Sin el enlace, la página del monitor queda huérfana y quien llega desde
    // logs o desde errores no tiene por dónde seguir.
    const missing: string[] = [];
    for (const slug of PAGES_LINKING_TO_MONITOR) {
      for (const language of LANGUAGES) {
        const path = pagePath(slug, language.suffix);
        const text = readPage(slug, language.suffix);
        if (text === null) missing.push(`${path} (no existe)`);
        else if (!text.includes(language.monitorLink)) {
          missing.push(`${path} (no enlaza a ${language.monitorLink})`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  test('los docs de usuario no mandan a variables de entorno ni a archivos que no existen', () => {
    // `RUST_LOG` se documentaba como la forma de ver los errores, y los
    // archivos de configuración citados no existen en VasakOS: quien los copia
    // no obtiene nada y deja de mirar en el monitor.
    const offenders: string[] = [];
    for (const needle of FICTITIOUS) {
      for (const path of pagesContaining(needle)) offenders.push(`${path} (menciona \`${needle}\`)`);
    }
    expect(offenders).toEqual([]);
  });

  test('no se instala ni se desinstala con gestores ajenos, y pacman sigue siendo el de VasakOS', () => {
    // Las páginas de usuario enseñaban `apt` y `dnf`: en VasakOS no existen, y
    // quien los copia se queda con un «command not found».
    const offenders: string[] = [];
    for (const pattern of FOREIGN_PACKAGE_MANAGERS) offenders.push(...linesMatching(pattern));
    expect(offenders).toEqual([]);

    // Y no se arregla borrando la instrucción: instalar sigue siendo `pacman -S`.
    for (const language of LANGUAGES) {
      const installs = pages().filter(
        (page) => page.suffix === language.suffix && /pacman\s+-S/.test(page.text),
      );
      expect(installs.length).toBeGreaterThan(0);
    }
  });

  test('no se aconsejan comandos que ya no son de VasakOS', () => {
    // `pkill` mata sin dejar guardar; `usermod -a -G` era la receta para el
    // audio y el Bluetooth, que acá van por PipeWire y por la sesión.
    const offenders: string[] = [];
    for (const pattern of REMOVED_COMMANDS) offenders.push(...linesMatching(pattern));
    expect(offenders).toEqual([]);
  });

  test('xrandr se menciona para descartarlo, nunca como consejo', () => {
    // La sesión es Wayland: `xrandr --query` no devuelve nada. La mención que
    // aclara que no se usa vale; el consejo no.
    const offenders: string[] = [];
    for (const pattern of XRANDR_AS_ADVICE) offenders.push(...linesMatching(pattern));
    expect(offenders).toEqual([]);
  });

  test('la configuración y los atajos apuntan a los archivos que existen', () => {
    // La página de preguntas frecuentes decía `shortcuts.json`, que no existe:
    // los atajos viven en el compositor y la configuración en `vasak.conf`.
    const missing: string[] = [];
    for (const language of LANGUAGES) {
      const path = pagePath('faq', language.suffix);
      const text = readPage('faq', language.suffix);
      if (text === null) {
        missing.push(`${path} (no existe)`);
        continue;
      }
      for (const needle of ['~/.config/vasak/vasak.conf', '~/.config/wayfire.ini']) {
        if (!text.includes(needle)) missing.push(`${path} (no nombra \`${needle}\`)`);
      }
    }
    expect(missing).toEqual([]);
  });

  test('la página de errores es la del escritorio que no arranca', () => {
    // Con el escritorio caído no hay monitor: la única vía es la terminal, y la
    // página tiene que dar los comandos que llevan hasta ahí.
    const missing: string[] = [];
    for (const language of LANGUAGES) {
      const path = pagePath('errors', language.suffix);
      const text = readPage('errors', language.suffix);
      if (text === null) {
        missing.push(`${path} (no existe)`);
        continue;
      }
      for (const needle of RECOVERY_SHELL) {
        if (!text.includes(needle)) missing.push(`${path} (no nombra \`${needle}\`)`);
      }
    }
    expect(missing).toEqual([]);
  });

  test('los logs se documentan con el archivo diario del escritorio', () => {
    // El archivo real es uno por día y se conservan siete: sin el nombre y la
    // retención, «mirá los logs» no dice a dónde ir, y con la variable de
    // entorno en su lugar el usuario busca un archivo que nunca se escribe.
    const missing: string[] = [];
    for (const language of LANGUAGES) {
      const path = pagePath('logs', language.suffix);
      const text = readPage('logs', language.suffix);
      if (text === null) {
        missing.push(`${path} (no existe)`);
        continue;
      }
      const needles = [
        '~/.local/share/vasak-desktop/logs/',
        language.logFile,
        language.retention,
        'journalctl -b -p err',
      ];
      for (const needle of needles) {
        if (!text.includes(needle)) missing.push(`${path} (no nombra «${needle}»)`);
      }
    }
    expect(missing).toEqual([]);
  });

  test('los weight de las páginas de usuario no se repiten', () => {
    // Dos páginas con el mismo peso quedan ordenadas al azar dentro del menú,
    // que es justo lo que el `weight` viene a fijar.
    const repeated: string[] = [];
    for (const language of LANGUAGES) {
      const seen = new Map<string, string>();
      for (const page of pages()) {
        if (page.suffix !== language.suffix) continue;
        const weight = /^weight:\s*(\d+)\s*$/m.exec(frontMatter(page.text))?.[1];
        if (weight === undefined) continue;
        const previous = seen.get(weight);
        if (previous !== undefined) repeated.push(`weight ${weight}: ${previous} y ${page.path}`);
        else seen.set(weight, page.path);
      }
    }
    expect(repeated).toEqual([]);
  });
});
