#!/bin/bash

# Web app building script
# files are being cmodify in ../tmp/, before being packaged in builds

# Create new branch
../git checkout -b release-0.1.4 master

# Delete any previous files in ../tmp/
rm -R ../tmp/*

# Create the structure
mkdir ../tmp/css
mkdir ../tmp/js
mkdir ../tmp/lib
mkdir ../tmp/img
mkdir ../tmp/locales
mkdir ../tmp/font

# Identify JS files from inside index.html
cat ../index.html |grep 'src="js' | awk '{print $3}' | cut -c 6- |cut -f1 -d '"' > ../tmp/js_files.txt
sed -i "s/.*/\.\.\/&/" ../tmp/js_files.txt
# Concatenate all JS files
for i in $(cat ../tmp/js_files.txt) ; do cat $i >> ../tmp/files_concat.js; done
  
# Minify previously concatened JS file
# using uglifyjs
# sudo npm install -g uglifyjs
#uglifyjs ../js/controller.js -mc -o controller_mc.js
#node my_minify.js
uglifyjs ../tmp/files_concat.js -mc -o ../app.js

# Identify CSS files from index.html
cat ../index.html |grep 'href="css'  | awk '{print $3}'  | cut -c 7- |cut -f1 -d '"'

# Concatenate CSS files

# Minify previously concatened CSS file

# Replace old JS and CSS links inside index.html by new minified files

# Copy files as originals to ../tmp/
cp ../manifest.webapp ../tmp/.
cp ../index.html ../tmp/.
cp ../locales/* ../tmp/locales/.
cp ../font/* ../tmp/font/.
cp ../lib/* ../tmp/lib/.
