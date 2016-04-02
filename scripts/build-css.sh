#! /bin/bash

sed -i 's/href="css\/app.css/href="app.css/g' ./www/index.html
sed -i '/href="css/d' ./www/index.html
./node_modules/uglifycss/uglifycss ./client/css/*.css > ./www/app.css

