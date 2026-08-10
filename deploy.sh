#!/usr/bin/env bash
#
# deploy.sh — build the site and push it to the gh-pages branch.
#
# public/ is thrown away and rebuilt on every run: a stale file left over from a
# renamed page would otherwise stay published forever, since the deploy force
# pushes an orphan branch and never deletes anything by itself.
#
# Usage:
#   ./deploy.sh [-n|--dry-run]

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

DRY_RUN=0
[[ "${1:-}" == "-n" || "${1:-}" == "--dry-run" ]] && DRY_RUN=1

command -v hugo >/dev/null || { echo "hugo not found." >&2; exit 1; }

# The icon stylesheet is generated from the Font Awesome package, so it has to
# exist before Hugo builds the CSS bundle.
if [[ ! -f themes/vasakos/assets/css/icons.css ]]; then
  echo "==> Generating icons.css"
  command -v bun >/dev/null && bun install --frozen-lockfile
  node scripts/build-icons.mjs
fi

echo "==> Building"
rm -rf public
hugo --gc

echo "==> Built $(find public -name '*.html' | wc -l) pages, $(du -sh public | cut -f1)"

if [[ $DRY_RUN -eq 1 ]]; then
  echo "(dry run — nothing was pushed; serve it with: hugo server --renderToDisk)"
  exit 0
fi

cd public
git init -q -b main
git add -A
git commit -q -m "deploy: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push -f git@github.com:Vasak-OS/website.git main:gh-pages

echo "==> Published to https://os.vasak.net.ar/"
