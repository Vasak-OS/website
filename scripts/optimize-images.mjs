/**
 * Prepara las capturas para la galería.
 *
 * La galería usa un `<picture>` con un `.webp` y un `.jpg` de cada ancho, más un
 * `srcset` para que el navegador elija. Eso último es lo que evita que se vean
 * borrosas: la tarjeta mide 768 px como mucho, así que una sola imagen de 1920
 * la reduce el navegador y el reescalado se nota. Con 768 y 1536 cada pantalla
 * carga el tamaño que le toca de 1 a 1.
 *
 * El `.webp` y el `.jpg` de un mismo ancho se escriben siempre juntos: el
 * navegador elige la rama WebP sin comprobar que el archivo exista, así que
 * generar uno solo deja una rama del `<picture>` apuntando a la nada.
 *
 * Los originales son PNG de 2560 px, unos 2,7 MB cada uno.
 *
 *   node scripts/optimize-images.mjs            # convierte lo que falta
 *   node scripts/optimize-images.mjs --force    # rehace todo
 *
 * Necesita ImageMagick (`magick`) en el PATH. Es una tarea de una vez, así que
 * no va en el `build`: las imágenes se versionan ya optimizadas.
 */
import { readdirSync, statSync, existsSync, unlinkSync } from 'fs';
import { join, extname, basename } from 'path';
import { execFileSync } from 'child_process';

const SOURCE_DIR = join(import.meta.dirname, '..', 'themes', 'vasakos', 'static', 'img', 'screenshots');

/** Anchos a generar. La tarjeta llega a 768 px, así que 1536 cubre 2x. */
const WIDTHS = [768, 1536];
const WEBP_QUALITY = 78;
const JPEG_QUALITY = 82;

/** Extensiones que se consideran originales. */
const SOURCES = ['.png', '.PNG'];

const force = process.argv.includes('--force');
const check = process.argv.includes('--check');

function convert(input, output, args) {
  try {
    execFileSync('magick', [input, ...args, output], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

if (!existsSync(SOURCE_DIR)) {
  console.error(`No está el directorio ${SOURCE_DIR}`);
  process.exit(1);
}

const originals = readdirSync(SOURCE_DIR).filter((f) => SOURCES.includes(extname(f)));
if (originals.length === 0) {
  console.log('No hay originales nuevos: la galería ya está preparada.');
  process.exit(0);
}

let converted = 0;
let skipped = 0;

for (const name of originals) {
  const stem = basename(name, extname(name));
  const input = join(SOURCE_DIR, name);

  const salidas = WIDTHS.flatMap((w) => [
    { file: join(SOURCE_DIR, `${stem}-${w}.webp`), w, format: 'webp' },
    { file: join(SOURCE_DIR, `${stem}-${w}.jpg`), w, format: 'jpg' },
  ]);

  const ready = salidas.every((s) => existsSync(s.file));
  const upToDate = ready && salidas.every((s) => statSync(s.file).mtimeMs >= statSync(input).mtimeMs);

  if (upToDate && !force) {
    console.log(`· ${stem}: ya está`);
    skipped++;
    continue;
  }

  for (const { file, w, format } of salidas) {
    const args = format === 'webp'
      ? ['-resize', `${w}x`, '-quality', String(WEBP_QUALITY), '-define', 'webp:method=6']
      : ['-resize', `${w}x`, '-quality', String(JPEG_QUALITY), '-strip'];

    if (!convert(input, file, args)) {
      console.error(`✗ ${stem}: falló la conversión a ${w}px ${format} (¿está ImageMagick en el PATH?)`);
      process.exit(1);
    }
  }

  const resumen = salidas
    .map((s) => `${s.w}px ${s.format} ${Math.round(statSync(s.file).size / 1024)} KB`)
    .join(', ');
  console.log(`✓ ${stem}: ${resumen}`);
  converted++;

  if (!check) unlinkSync(input);
}

console.log(`\n${converted} convertidas, ${skipped} sin cambios.`);
