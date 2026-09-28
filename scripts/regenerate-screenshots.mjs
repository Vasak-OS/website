/**
 * Regenera las capturas a mayor calidad desde los 1536px actuales.
 * No borra los originales (son JPG, no PNG).
 */
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = join(__dirname, '..', 'themes', 'vasakos', 'static', 'img', 'screenshots');
const WIDTHS = [768, 1536, 2048];  // añadimos 2048 para 2x retina en tarjetas anchas
const WEBP_QUALITY = 92;  // subido de 78
const JPEG_QUALITY = 95;  // subido de 82

const SOURCES = ['.jpg', '.JPG', '.png', '.PNG'];

function convert(input, output, args) {
  try {
    execFileSync('magick', [input, ...args, output], {
      stdio: 'inherit',
      env: { ...process.env, PATH: '/usr/local/bin:/usr/bin:/bin' },
    });
    return true;
  } catch (e) {
    console.error(`✗ Falló: ${input} -> ${output}`);
    console.error(e.message);
    return false;
  }
}

if (!existsSync(SOURCE_DIR)) {
  console.error(`No está el directorio ${SOURCE_DIR}`);
  process.exit(1);
}

// Usamos los 1536px como fuente (son los mejores que tenemos)
const fuentes = readdirSync(SOURCE_DIR).filter(f => f.endsWith('-1536.jpg'));
if (fuentes.length === 0) {
  console.error('No hay fuentes -1536.jpg');
  process.exit(1);
}

console.log(`Regenerando ${fuentes.length} capturas a calidad WebP ${WEBP_QUALITY} / JPEG ${JPEG_QUALITY}...`);

for (const name of fuentes) {
  const stem = basename(name, '-1536.jpg');
  const input = join(SOURCE_DIR, name);

  const salidas = WIDTHS.flatMap((w) => [
    { file: join(SOURCE_DIR, `${stem}-${w}.webp`), w, format: 'webp' },
    { file: join(SOURCE_DIR, `${stem}-${w}.jpg`), w, format: 'jpg' },
  ]);

  console.log(`\n· ${stem}:`);
  for (const { file, w, format } of salidas) {
    const args = format === 'webp'
      ? ['-resize', `${w}x`, '-quality', String(WEBP_QUALITY), '-define', 'webp:method=6']
      : ['-resize', `${w}x`, '-quality', String(JPEG_QUALITY), '-strip'];

    if (convert(input, file, args)) {
      const kb = Math.round(statSync(file).size / 1024);
      console.log(`  ✓ ${w}px ${format}: ${kb} KB`);
    } else {
      process.exit(1);
    }
  }
}
console.log('\n✓ Listo. Los originales (-1536.jpg) se conservan.');
