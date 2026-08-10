#!/usr/bin/env node
//
// build-icons.mjs — generate themes/vasakos/assets/css/icons.css
//
// The site used to pull icons from a Font Awesome kit: an external script that
// downloads a second payload at runtime, costing two extra origins, a
// render-blocking round trip and a flash of missing icons. The site uses about
// forty icons in total, so shipping a whole icon framework to render them is
// out of proportion.
//
// This turns each of those icons into a CSS mask carrying its SVG path inline.
// The markup stays exactly the same (`<i class="fab fa-github"></i>`), so
// templates and rendered Markdown do not have to change, but the icons become
// part of the stylesheet: no extra requests, no JavaScript, and they inherit
// `color` like text.
//
// Run it through `bun run icons` (or `bun run build`, which chains it) whenever
// the ICONS list below changes.
//
// Icons are Font Awesome Free, CC BY 4.0 — https://fontawesome.com/license/free

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FA = resolve(ROOT, 'node_modules/@fortawesome/fontawesome-free/svgs');
const OUT = resolve(ROOT, 'themes/vasakos/assets/css/icons.css');

// name -> family. Keep it in sync with what the templates actually use; an
// unused entry is dead weight in every page's stylesheet.
const ICONS = {
  // brands
  github: 'brands',
  gitlab: 'brands',
  telegram: 'brands',
  discord: 'brands',
  reddit: 'brands',
  twitter: 'brands',
  mastodon: 'brands',
  youtube: 'brands',
  twitch: 'brands',
  steam: 'brands',
  instagram: 'brands',
  facebook: 'brands',
  linkedin: 'brands',
  npm: 'brands',
  linux: 'brands',
  rust: 'brands',
  vuejs: 'brands',
  css3: 'brands',
  // solid
  'arrow-up': 'solid',
  blog: 'solid',
  book: 'solid',
  calendar: 'solid',
  'chevron-left': 'solid',
  'chevron-right': 'solid',
  'circle-check': 'solid',
  'circle-half-stroke': 'solid',
  clock: 'solid',
  code: 'solid',
  desktop: 'solid',
  download: 'solid',
  eye: 'solid',
  'file-lines': 'solid',
  folder: 'solid',
  'hand-holding-dollar': 'solid',
  heart: 'solid',
  house: 'solid',
  link: 'solid',
  'magnifying-glass': 'solid',
  moon: 'solid',
  pen: 'solid',
  'shield-halved': 'solid',
  sun: 'solid',
  'up-right-from-square': 'solid',
  user: 'solid',
  'user-tie': 'solid',
  users: 'solid',
  wrench: 'solid',
  xmark: 'solid',
};

// Font Awesome renamed a few icons between major versions and the templates
// still use the old names; alias them instead of duplicating the payload.
const ALIASES = {
  donate: 'hand-holding-dollar',
  'user-circle': 'user',
  home: 'house',
  search: 'magnifying-glass',
  times: 'xmark',
  'external-link-alt': 'up-right-from-square',
};

// A data: URI in CSS only needs these characters escaped; leaving the rest
// readable keeps the file diffable and compresses better than base64.
const encode = (svg) =>
  svg
    .replace(/\s*<!--.*?-->\s*/gs, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E');

if (!existsSync(FA)) {
  console.error('Font Awesome sources not found. Run `bun install` first.');
  process.exit(1);
}

const rules = [];
const selectors = [];

for (const [name, family] of Object.entries(ICONS)) {
  const file = resolve(FA, family, `${name}.svg`);
  if (!existsSync(file)) {
    console.error(`Missing icon: ${family}/${name}.svg`);
    process.exit(1);
  }
  // currentColor lets the mask follow the surrounding text colour once the
  // background is painted through it.
  const svg = readFileSync(file, 'utf8').replace('<svg ', '<svg fill="currentColor" ');
  const uri = `url("data:image/svg+xml,${encode(svg)}")`;
  selectors.push(`.fa-${name}`);
  rules.push(`.fa-${name} { -webkit-mask-image: ${uri}; mask-image: ${uri}; }`);
}

for (const [alias, target] of Object.entries(ALIASES)) {
  if (!ICONS[target]) {
    console.error(`Alias fa-${alias} points at unknown icon fa-${target}`);
    process.exit(1);
  }
  selectors.push(`.fa-${alias}`);
  const file = resolve(FA, ICONS[target], `${target}.svg`);
  const svg = readFileSync(file, 'utf8').replace('<svg ', '<svg fill="currentColor" ');
  const uri = `url("data:image/svg+xml,${encode(svg)}")`;
  rules.push(`.fa-${alias} { -webkit-mask-image: ${uri}; mask-image: ${uri}; }`);
}

const header = `/*
 * GENERATED FILE — edit scripts/build-icons.mjs and run \`bun run icons\`.
 *
 * Font Awesome Free icons rendered as CSS masks, so the markup the templates
 * already use keeps working without loading an icon framework at runtime.
 * Icons: CC BY 4.0 — https://fontawesome.com/license/free
 */
`;

// Only the generated icon selectors get the box; a blanket [class*="fa-"] would
// also catch the family markers (.fa-solid, .fa-brands) and paint stray squares.
const base = `${selectors.join(',\n')} {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.125em;
  background-color: currentColor;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: contain;
  mask-size: contain;
}
`;

writeFileSync(OUT, `${header}\n${base}\n${rules.join('\n')}\n`);
console.log(
  `icons.css: ${Object.keys(ICONS).length} icons + ${Object.keys(ALIASES).length} aliases, ` +
    `${(readFileSync(OUT).length / 1024).toFixed(1)} KB`,
);
