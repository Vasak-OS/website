import { readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import { join, extname, dirname } from 'path';
import { execSync } from 'child_process';

const SUPPORTED = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff'];
const QUALITY = 80;
const STATIC_DIR = join(import.meta.dirname, '..', 'static');
const DRY_RUN = process.argv.includes('--dry-run');

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full).forEach(f => files.push(f));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

const images = walk(STATIC_DIR).filter(f => SUPPORTED.includes(extname(f).toLowerCase()));

console.log(`Found ${images.length} images to convert`);

for (const img of images) {
  const webp = img.replace(/\.(jpg|jpeg|png|bmp|tiff)$/i, '.webp');
  if (existsSync(webp) && statSync(webp).mtimeMs >= statSync(img).mtimeMs) continue;

  if (DRY_RUN) {
    console.log(`Would convert: ${img} -> ${webp}`);
    continue;
  }

  mkdirSync(dirname(webp), { recursive: true });
  try {
    execSync(`ffmpeg -y -i "${img}" -quality ${QUALITY} "${webp}"`, { stdio: 'ignore' });
    console.log(`✅ ${img} -> ${webp}`);
  } catch {
    execSync(`cwebp -q ${QUALITY} "${img}" -o "${webp}"`, { stdio: 'ignore' });
    console.log(`✅ ${img} -> ${webp}`);
  }
}

console.log('Done!');
