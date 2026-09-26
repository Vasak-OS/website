/**
 * Prepara las capturas para la galería.
 *
 * La galería usa un `<picture>` con un `.webp` y un `.jpg` del mismo nombre: el
 * navegador que soporta WebP toma el primero y el resto toma el segundo. Ese
 * par tiene que existir siempre, así que este script escribe los dos juntos a
 * partir de un mismo original. Generar uno solo deja una rama del `<picture>`
 * apuntando a un archivo inexistente, y el navegador elige esa rama y no
 * muestra nada.
 *
 * Los originales son PNG de 2560 px, unos 2,7 MB cada uno. A 1920 px en WebP
 * quedan en unos 130 KB: la portada pasa de 12,8 MB a 0,6 MB.
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
const WIDTH = 1920;
const WEBP_QUALITY = 78;
const JPEG_QUALITY = 82;

const force = process.argv.includes('--force');
const check = process.argv.includes('--check');

/** Extensiones que se consideran originales, y de las que sale el `.jpg`. */
const SOURCES = ['.png', '.PNG'];

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
  const jpg = join(SOURCE_DIR, `${stem}.jpg`);
  const webp = join(SOURCE_DIR, `${stem}.webp`);

  const upToDate =
    existsSync(jpg) && existsSync(webp) &&
    statSync(jpg).mtimeMs >= statSync(join(SOURCE_DIR, name)).mtimeMs &&
    statSync(webp).mtimeMs >= statSync(join(SOURCE_DIR, name)).mtimeMs;

  if (upToDate && !force) {
    console.log(`· ${stem}: ya está`);
    skipped++;
    continue;
  }

  const input = join(SOURCE_DIR, name);
  const okWebp = convert(input, webp, ['-resize', `${WIDTH}x`, '-quality', String(WEBP_QUALITY), '-define', 'webp:method=6']);
  const okJpg = convert(input, jpg, ['-resize', `${WIDTH}x`, '-quality', String(JPEG_QUALITY), '-strip']);

  if (!okWebp || !okJpg) {
    console.error(`✗ ${stem}: falló la conversión (¿está ImageMagick en el PATH?)`);
    process.exit(1);
  }

  const kb = (f) => Math.round(statSync(f).size / 1024);
  console.log(`✓ ${stem}: webp ${kb(webp)} KB, jpg ${kb(jpg)} KB`);
  converted++;

  if (!check) unlinkSync(input);
}

console.log(`\n${converted} convertidas, ${skipped} sin cambios.`);
