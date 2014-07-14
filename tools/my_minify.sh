#!/bin/bash
# Web app building script

# Identify JS files from inside index.html
cat ../index.html |grep 'text/javascript'
# Concatenate all JS files

# Minify previously concatened JS file
# using uglifyjs
# sudo npm install -g uglifyjs
#uglifyjs ../js/controller.js -mc -o controller_mc.js


# Concatenate CSS files

# Minify previously concatened CSS file

# Replace old JS and CSS links inside index.html by new minified files

