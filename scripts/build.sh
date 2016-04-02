#! /bin/bash

rm -rf www/*
echo "Syncing static files..."
mkdir -p ./www/img
rsync -a --delete ./client/img/ ./www/img/
mkdir -p ./www/fonts
rsync -a --delete ./client/fonts/ ./www/fonts/
mkdir -p ./www/locales
rsync -a --delete ./client/locales/ ./www/locales/
mkdir -p ./www/lib
rsync -a --delete ./client/js/lib/ ./www/lib/

cp package.json ./www/
cp ./client/index.html ./www/

echo "Migrating HTML file..."
# ./scripts/migrate-html.sh
#rsync -a --delete ./client/js/ ./www/js/

echo "Uglifying CSS files into build directory..."
./scripts/build-css.sh

echo "Uglifying JS files into build directory..."
./scripts/build-js.sh

echo "Done!"
