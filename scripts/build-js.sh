#! /bin/bash
#./node_modules/uglify-js/bin/uglifyjs ./client/js/**/**/* -o ./www/app.js

mkdir -p www/lib
rsync -a --delete ./client/js/lib/ .www/lib/
sed -i 's/src="js\/app.js/src="app.js/g' ./www/index.html
sed -i '/src="js\/utils/d' ./www/index.html
sed -i '/src="js\/factories/d' ./www/index.html
sed -i '/src="js\/models/d' ./www/index.html
sed -i '/src="js\/collections/d' ./www/index.html
sed -i '/src="js\/views/d' ./www/index.html
sed -i '/src="js\/app/d' ./www/index.html
sed -i '/src="js\/router/d' ./www/index.html
sed -i 's/js\/lib/lib/g' ./www/index.html
./node_modules/uglify-js/bin/uglifyjs \
  ./client/js/utils/gpx.js \
  ./client/js/utils/tracks.js \
  ./client/js/utils/chrono.js \
  ./client/js/utils/map.js \
  ./client/js/utils/helpers.js \
  ./client/js/factories/models/message.js \
  ./client/js/factories/models/athletics.js \
  ./client/js/factories/models/body.js \
  ./client/js/factories/models/cycling.js \
  ./client/js/factories/models/mountaineering.js \
  ./client/js/factories/models/sliding.js \
  ./client/js/factories/models/swimming.js \
  ./client/js/factories/models/watersport.js \
  ./client/js/factories/views/dashboard_message.js \
  ./client/js/factories/views/dashboard_summary_1.js \
  ./client/js/factories/views/dashboard_summary_2.js \
  ./client/js/factories/views/detailled_1.js \
  ./client/js/factories/views/detailled_2.js \
  ./client/js/factories/views/detailled_3.js \
  ./client/js/factories/views/new_1.js \
  ./client/js/factories/views/new_2.js \
  ./client/js/factories/views/new_3.js \
  ./client/js/factories/views/sessions_summary_1.js \
  ./client/js/factories/views/sessions_summary_2.js \
  ./client/js/factories/activities/message.js \
  ./client/js/factories/activities/climbing.js \
  ./client/js/factories/activities/mountain_biking.js \
  ./client/js/factories/activities/paddling.js \
  ./client/js/factories/activities/racing.js \
  ./client/js/factories/activities/regular_biking.js \
  ./client/js/factories/activities/running.js \
  ./client/js/factories/activities/skiing.js \
  ./client/js/factories/activities/swimming.js \
  ./client/js/factories/activities/time_trial_biking.js \
  ./client/js/factories/activities/trekking.js \
  ./client/js/factories/activities/walking.js \
  ./client/js/factories/activities/weight_act.js \
  ./client/js/factories/factory.js \
  ./client/js/models/doc.js \
  ./client/js/models/preferences.js \
  ./client/js/collections/docs.js \
  ./client/js/views/indicators.js \
  ./client/js/views/dashboard.js \
  ./client/js/views/new-session.js \
  ./client/js/views/tracking.js \
  ./client/js/views/preferences.js \
  ./client/js/views/reports.js \
  ./client/js/views/sessions.js \
  ./client/js/views/main.js \
  ./client/js/router.js \
  ./client/js/app.js \
  --beautify --indent-level=2 \
  -o ./www/app.js
