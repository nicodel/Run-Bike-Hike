#!/bin/bash

# Web app building script
# files are being cmodify in ../tmp/, before being packaged in builds

# Create new branch
#echo Create a release branch
#git checkout -b release-0.1.4 master

# Delete any previous files in ../tmp/
echo delete any old temporary files
rm -R ../tmp/*

# Create the structure
echo Create package structure
mkdir ../tmp/lib
mkdir ../tmp/img
mkdir ../tmp/locales
mkdir ../tmp/font

# Identify JS files from inside index.html
cat ../index.html |grep 'src="js' | awk '{print $3}' | cut -c 6- |cut -f1 -d '"' > ../tmp/js_files.txt
sed -i "s/.*/\.\.\/&/" ../tmp/js_files.txt
# Concatenate all JS files
for i in $(cat ../tmp/js_files.txt) ; do cat $i >> ../tmp/files_concat.js; done
# strim left, strim right, delete empty lines
sed -i 's/^ *//; s/ *$//; /^$/d' ../tmp/files_concat.js
# replacing eof by
#sed -i ':a;N;$!ba;s/\n/\t/g' ../tmp/files_concat.js

# Minify previously concatened JS file
# using uglifyjs
# sudo npm install -g uglifyjs
#uglifyjs ../js/controller.js -mc -o controller_mc.js
#node my_minify.js
uglifyjs ../tmp/files_concat.js -mc -o ../tmp/app.js
#cp ../tmp/files_concat.js ../tmp/js/app.js

# Identify CSS files from index.html
cat ../index.html |grep 'href="css'  | awk '{print $3}'  | cut -c 7- |cut -f1 -d '"' > ../tmp/css_files.txt
sed -i "s/.*/\.\.\/&/" ../tmp/css_files.txt
# Concatenate CSS files
for i in $(cat ../tmp/css_files.txt) ; do cat $i >> ../tmp/files_concat.css; done

# Minify previously concatened CSS file
uglifycss ../tmp/files_concat.css > ../tmp/app.css
# Replace old JS and CSS links inside index.html by new minified files

# Copy files as originals to ../tmp/
cp ../manifest.webapp ../tmp/.
cp ../index.html ../tmp/.
cp ../locales/* ../tmp/locales/.
cp -a ../css/font/* ../tmp/font/.
cp -a ../lib/* ../tmp/lib/.
cp -a ../img/* ../tmp/img/.

# Modify index.html by replacing old css and js files by the minify once
sed -i 's/src="js\/app.js/src="app.js/g' ../tmp/index.html
sed -i 's/href="css\/app.css/href="app.css/g' ../tmp/index.html

#remove old lines
sed -i '/src="js/d' ../tmp/index.html
sed -i '/href="css/d' ../tmp/index.html
#remove comment lines
#sed -i 's/<!--/d' ../tmp/index.html

# Delete temporay files
rm ../tmp/js_files.txt
rm ../tmp/files_concat.js
rm ../tmp/css_files.txt
rm ../tmp/files_concat.css
# Create the zip package
cd ../tmp
zip -r ../builds/runbikehike_v0.1.4.zip *
