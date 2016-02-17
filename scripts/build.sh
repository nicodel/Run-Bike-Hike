#! /bin/bash

echo "Syncing static files..."
mkdir -p ./www/img
rsync -a --delete ./client/img/ ./www/img/
mkdir -p ./www/fonts
rsync -a --delete ./client/fonts/ ./www/fonts/
mkdir -p ./www/locales
rsync -a --delete ./client/locales ./www/locales/
cp package.json ./www/

echo "Migrating HTML file..."
./scripts/migrate-html.sh

echo "Uglifying CSS files into build directory..."
./scripts/build-css.sh

echo "Uglifying JS files into build directory..."
./scripts/build-js.sh

echo "Done!"
