#!/bin/bash

# abort on errors
set -e
# build
hugo # if using a theme, replace with `hugo -t <YOURTHEME>`

# navigate into the build output directory
cd public

git init -b main
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:Vasak-OS/website.git main:gh-pages
cd -