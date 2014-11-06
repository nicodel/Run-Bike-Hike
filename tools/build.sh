#!/bin/bash

VERSION=$1

echo -e "\n####################\nBuilding version v" $VERSION " - " `date`

# Web app building script
# files are being cmodify in ../tmp/, before being packaged in builds

# Tag the files
echo -e "\n## Tag the files"
git tag -am $VERSION $VERSION
# Create new branch
echo -e "\n## Create release branch"
if [ `git branch | grep release-$VERSION` ]
then
  git checkout release-$VERSION
else
  git checkout -b release-$VERSION
fi

# Delete any previous files in ../tmp/
if [ -d ../tmp ]
then
	echo -e "\n## Removing the old temporary folder\n../tmp"
	rm -R ../tmp
fi

# Create the structure
echo -e "\n## Create package structure"
echo -e "../tmp"
mkdir ../tmp
echo -e "../tmp/lib"
mkdir ../tmp/lib
echo -e "../tmp/img"
mkdir ../tmp/img
echo -e "../tmp/locales"
mkdir ../tmp/locales
echo -e "../tmp/font"
mkdir ../tmp/font

# Identify JS files from inside index.html
echo -e "\n######################\n## Identify JS files fron index.html"
cat ../index.html |grep 'src="js' | awk '{print $3}' | cut -c 6- |cut -f1 -d '"' > ../tmp/js_files.txt
sed -i "s/.*/\.\.\/&/" ../tmp/js_files.txt
for i in $(cat ../tmp/js_files.txt); do echo -e $i; done

# Concatenate all JS files
echo -e "\n## Concatenate all JS files into a single file"
for i in $(cat ../tmp/js_files.txt) ; do cat $i >> ../tmp/files_concat.js; done
echo -e "../tmp/files_concat.js"
# strim left, strim right, delete empty lines
#sed -i 's/^ *//; s/ *$//; /^$/d' ../tmp/files_concat.js
# replacing eof by
#sed -i ':a;N;$!ba;s/\n/\t/g' ../tmp/files_concat.js

# Minify previously concatened JS file
echo -e "\n## Uglifly JS"
uglifyjs ../tmp/files_concat.js -mc -o ../tmp/app.js
echo -e "Done -> ../tmp/app.js"

# Identify CSS files from index.html
echo -e "\n######################\n## Identify CSS files fron index.html"
cat ../index.html |grep 'href="css'  | awk '{print $3}'  | cut -c 7- |cut -f1 -d '"' > ../tmp/css_files.txt
sed -i "s/.*/\.\.\/&/" ../tmp/css_files.txt
for i in $(cat ../tmp/css_files.txt); do echo -e $i; done

# Concatenate CSS files
echo -e "\n## Concatenate all CSS files into a single file"
for i in $(cat ../tmp/css_files.txt) ; do cat $i >> ../tmp/files_concat.css; done
echo -e "../tmp/files_concat.css"

# Minify previously concatened CSS file
echo -e "\n## Uglify CSS"
uglifycss ../tmp/files_concat.css > ../tmp/app.css
echo -e "Done -> ../tmp/app.css"
# Replace old JS and CSS links inside index.html by new minified files

# Copy files as originals to ../tmp/
echo -e "\n######################\n## Copy unmodified files temporary directory\n..manifest.webapp\n../index.html\n../locales/*\n../css/font\n../lib/*\n../img/*"
cp ../manifest.webapp ../tmp/.
cp ../index.html ../tmp/.
cp ../locales/* ../tmp/locales/.
cp -a ../css/font/* ../tmp/font/.
cp -a ../lib/* ../tmp/lib/.
cp -a ../img/* ../tmp/img/.

# Modify index.html by replacing old css and js files by the minify once
echo -e "\n######################\n## Modify index.html to replace JS and CSS files by the Uglify ones"
echo -e "\n## Removing JS files lines from index.html"
cat ../tmp/index.html |grep 'src="js'
sed -i 's/src="js\/app.js/src="app.js/g' ../tmp/index.html
echo -e "\n## Replacing with single JS file"
cat ../tmp/index.html |grep 'src="app.js'

echo -e "\n## Removing CSS files lines from index.html"
cat ../tmp/index.html |grep 'href="css'
sed -i 's/href="css\/app.css/href="app.css/g' ../tmp/index.html
echo -e "\n## Replacing with single CSS file"
cat ../tmp/index.html |grep 'href="app.css'

#remove old lines
sed -i '/src="js/d' ../tmp/index.html
sed -i '/href="css/d' ../tmp/index.html
#remove comment lines
#sed -i 's/<!--/d' ../tmp/index.html

# Delete temporay files
echo -e "\n## Removing temporary files\n../tmp/js_files.txt\n../tmp/files_concat.js\n../tmp/css_files.txt\n../tmp/files_concat.css"
rm ../tmp/js_files.txt
rm ../tmp/files_concat.js
rm ../tmp/css_files.txt
rm ../tmp/files_concat.css

# Create the builds folder ../builds
if [ ! -d ../builds ]
then
	echo -e "\n## Create the builds folder ../builds"
	mkdir ../builds
fi

# Create the zip package
echo -e "\n## Creating zip package"
cd ../tmp
zip -r ../builds/runbikehike_v$VERSION.zip *
echo -e "\n## Packaged file created! ../builds/runbikehike_v"$VERSION".zip"
echo -e "\n\n######################\n## Build is done - " `date`
