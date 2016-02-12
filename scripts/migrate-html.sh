#! /bin/bash

cp ./client/index.html ./www/
echo "Removing JS files lines from index.html..."
# cat ./www/index.html |grep 'src="js'
sed -i 's/src="js\/app.js/src="app.js/g' ./www/index.html
echo "Replacing with single JS file..."
sed -i '/href="css/d' ./www/index.html
# cat ./www/index.html |grep 'src="app.js'
echo 'Done !'

echo "Removing CSS files lines from index.html..."
# cat ./www/index.html |grep 'href="css'
sed -i 's/href="css\/app.css/href="app.css/g' ./www/index.html
echo "Replacing with single CSS file..."
sed -i '/src="js/d' ./www/index.html
# cat ./www/index.html |grep 'href="app.css'
echo 'Done !'
