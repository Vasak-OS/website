#!/bin/bash

# abort on errors
set -e

# WebP conversion de imágenes estáticas
echo "🔧 Converting images to WebP..."
bun run scripts/convert-webp.mjs

# Build CSS con Tailwind
echo "🎨 Building Tailwind CSS..."
bun run build

# Build site Hugo
echo "🏗️  Building Hugo site..."
hugo

# navigate into the build output directory
cd public

git init -b main
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:Vasak-OS/website.git main:gh-pages
cd -