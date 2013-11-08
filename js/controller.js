// var Controller = function() {
define(["views/home-view",
        "views/infos-view",
        "views/settings-view",
        "views/track-view",
        "views/tracks-view",
        "models/config",
        "models/tracks",
        "models/db"
], function(HomeView, InfosView, SettingsView, TrackView, TracksView, Config, Tracks, DB) {

  var initID, watchID;

  function init() {
    // startWatch();
    DB.initiate(__initiateSuccess, __initiateError);
    if (navigator.geolocation) {
      initID = navigator.geolocation.getCurrentPosition(
      // initID = test.geolocation.watchPosition(
        function(inPosition){
          __locationChanged(inPosition);
          },
        function (inError){
          __locationError(inError);
        }
      );
    }
  }

  function startWatch() {
    navigator.geolocation.clearWatch(initID);
    // getID = navigator.geolocation.getCurrentPosition(
    watchID = test.geolocation.watchPosition(
      function(inPosition){
        __positionChanged(inPosition);
        },
      function (inError){
        __positionError(inError);
      }
    );
    // Start the calculation of elapsed time
    InfosView.startChrono();
    // Open new track
    Tracks.open();
    nb_point = 0;
  }

  function stopWatch(){
    //Stop the calculation of elapsed time
    InfosView.stopChrono();
    // Clear the watch
    navigator.geolocation.clearWatch(watchID);
    // Close track
    var track = Tracks.close();
    // Save to DB
    // DB.addTrack(__addTrackSuccess, __addTrackError, track);

  }

  function __locationChanged(inPosition){
    console.log("Position found");
    HomeView.updateInfos(inPosition);
  }
  function __locationError(inError){
    console.log("error:",inError);
  	HomeView.displayError(inError);
  }

  function __positionChanged(inPosition){
    if (!inPosition.coords || !inPosition.coords.latitude || !inPosition.coords.longitude) {
      return;
    }
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
      current_track.distance += __distanceFromPrev(olat, olon, lat, lon);
      console.log("current_track.distance", current_track.distance);
      console.log("__distanceFromPrevrev(olat, olon, lat, lon)", __distanceFromPrevrev(olat, olon, lat, lon));
    }

    // calculating duration
    current_track.duration = inPosition.timestamp - start_date;
    console.log("current_track.duration", current_track.duration);

    // updating UI
    nb_point =+ 1;
    InfosView.updateInfos(inPosition, current_track.distance)
    //~ console.log("nb_point:", nb_point);

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

  function __distanceFromPrev(lat1, lon1, lat2, lon2) {
    var lat1Rad = lat1*( Math.PI / 180);
    var lon1Rad = lon1*( Math.PI / 180);
    var lat2Rad = lat2*( Math.PI / 180);
    var lon2Rad = lon2*( Math.PI / 180);

    var dLat = lat2Rad - lat1Rad;
    var dLon = lon2Rad - lon1Rad;

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var R = 6371 * 1000;
    return R * c;
  }

  function __positionError(inError) {}

  function __initiateSuccess(inEvent) {
    utils.status.show(inEvent); 
  }

  function __initiateError(inEvent) {
    utils.status.show(inEvent); 
  }

  function __addTrackSuccess(inEvent) {
    utils.status.show(inEvent); 
  }

  function __addTrackError(inEvent) {
    utils.status.show(inEvent); 
  }



  return {
    init: init,
    // locationChanged: locationChanged,
    // locationError: locationError,
    startWatch: startWatch,
    stopWatch: stopWatch,
    // positionChanged: positionChanged
  };
});
// }();