#! /bin/bash

echo "Removing JS files lines from index.html..."
sed -i 's/src="js\/app.js/src="app.js/g' ./www/index.html
echo "Replacing with single JS file..."
sed -i '/src="js/d' ./www/index.html
echo 'Done !'

#echo "Removing CSS files lines from index.html..."
#sed -i 's/href="css\/app.css/href="app.css/g' ./www/index.html
#echo "Replacing with single CSS file..."
#sed -i '/href="css/d' ./www/index.html
#echo 'Done !'
