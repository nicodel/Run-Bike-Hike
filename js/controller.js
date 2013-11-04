// var Controller = function() {
define([
       "views/home-view",
       "views/infos-view",
       "views/settings-view",
       "views/stop-tracking-view",
       "views/track-view",
       "views/tracks-view",
       "models/config",
       "models/geolocation",
       "models/tracks",
       "models/db"
       ],
       function(HomeView,
                InfosView,
                SettingsView,
                StopTrackingView,
                TrackView,
                TracksView,
                Config,
                Geolocation,
                Tracks,
                DB){

  function init() {
    Geolocation.init();
    DB.init();
  }
  function locationChanged(inPosition){
    console.log("Position found");
    // HomeView.hideSpinner();
    HomeView.updateInfos(inPosition);
  }
  function locationError(inError){
    console.log("error:",inError);
  	HomeView.displayError(inError);
  }

  function startWatch(){
    // TrackModel.create();
    Geolocation.startWatch();
    Tracks.open();
    nb_point = 0;
  }
  function stopWatch(){
    // Clear the watch
    Geolocation.stopWatch();
    // Close track
    var track = Tracks.close();
    // Save to DB
    DB.addTrack(track);
  }

  function positionChanged(inPosition){

    var event = inPosition.coords;
    // Display GPS data, log to Db
    var now = new Date();
    var speed = event.speed;
    lat = event.latitude.toFixed(6);
    lon = event.longitude.toFixed(6);
    var alt = event.altitude;
    var date = new Date(inPosition.timestamp).toISOString();
    var horizAccuracy = event.accuracy.toFixed(0);
    var vertAccuracy = event.altitudeAccuracy.toFixed(0);
    var direction = event.heading.toFixed(0);

    // fix bad values from gps
    if (alt < -200 || (alt === 0 && vertAccuracy === 0)) {
      alt = null;
    }
    // calculate distance
    if (olat !== null) {
      current_track.distance += __distance_from_prev(olat, olon, lat, lon);
      console.log("current_track.distance", current_track.distance);
      console.log("__distance_from_prev(olat, olon, lat, lon)", __distance_from_prev(olat, olon, lat, lon));
    }

    // calculating duration
    current_track.duration = inPosition.timestamp - start_date;
    console.log("current_track.duration", current_track.duration);

    // display compas
    // ui.display_compass(event);

    // updating UI
    nb_point =+ 1;
    //~ console.log("nb_point:", nb_point);
    // ui.update_trk_infos(inPosition, current_track.distance, nb_point);

    // appending gps point
    var gps_point = {
      latitude:lat,
      longitude:lon,
      altitude:alt,
      date:date,
      speed:speed,
      accuracy:horizAccuracy,
      vertAccuracy:vertAccuracy
    };
    Tracks.addNode(gps_point);
    
    olat = lat;
    olon = lon;
  }

  return {
    init: init,
    locationChanged: locationChanged,
    locationError: locationError,
    startWatch: startWatch,
    stopWatch: stopWatch,
    positionChanged: positionChanged
  };
});
// }();