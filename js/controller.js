/*define(["views/home-view",
        "views/infos-view",
        "views/settings-view",
        "views/track-view",
        "views/tracks-view",
        "models/config",
        "models/tracks",
        "models/db"
], function(HomeView, InfosView, SettingsView, TrackView, TracksView, Config, Tracks, DB) {*/
var Controller = function() {

  var watchID, lock;
  var olat, olon;
  var tracking = false;

  function init() {
    // startWatch();
    DB.initiate(__initiateSuccess, __initiateError);
    if (navigator.geolocation) {
      watchID = navigator.geolocation.watchPosition(
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
    /*navigator.geolocation.clearWatch(initID);
    watchID = navigator.geolocation.getCurrentPosition(
    // watchID = test.geolocation.watchPosition(
      function(inPosition){
        __positionChanged(inPosition);
        },
      function (inError){
        __positionError(inError);
      }
    );*/
    tracking = true;
    // Start the calculation of elapsed time
    InfosView.startChrono();
    // Open new track
    current_track = Tracks.open();
    nb_point = 0;
  }

  function stopWatch(){
    //Stop the calculation of elapsed time
    InfosView.stopChrono();
    // Clear the watch
    // navigator.geolocation.clearWatch(watchID);
    // Close track
    var track = Tracks.close();
    // Save to DB
    DB.addTrack(__addTrackSuccess, __addTrackError, track);
  }

  function __locationChanged(inPosition){
    // console.log("Position found");
    if (tracking) {
      __positionChanged(inPosition);
    } else {
      HomeView.updateInfos(inPosition);
    };
  }
  function __locationError(inError){
    // console.log("error:",inError);
    if (tracking) {
      __positionError(inError);
    } else{
      HomeView.displayError(inError);
    };
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
    var distance = Tracks.getDistance(lat, lon);
    // if (olat !== null) {
    //   current_track.distance += __distanceFromPrev(olat, olon, lat, lon);
    //   console.log("current_track.distance", current_track.distance);
    //   console.log("__distanceFromPrevrev(olat, olon, lat, lon)", __distanceFromPrevrev(olat, olon, lat, lon));
    // }

    // calculating duration
    Tracks.getDuration(inPosition.timestamp);

    // updating UI
    nb_point =+ 1;
    InfosView.updateInfos(inPosition, distance)
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
  }

  function __positionError(inError) {}

  function __initiateSuccess(inEvent) {
    utils.status.show(inEvent); 
  }

  function __initiateError(inEvent) {
    utils.status.show(inEvent); 
  }

  function __addTrackSuccess(inEvent) {
    utils.status.show("Track " + inEvent + " sucessfully saved.");
  }

  function __addTrackError(inEvent) {
    utils.status.show(inEvent); 
  }

  function displayTracks() {
    // get the whole tracks list
    DB.getTracks(__getTracksSuccess, __getTracksError);
  }

  function __getTracksSuccess(inTracks) {
    TracksView.display(inTracks);
  }

  function __getTracksError(inTracks) {
  }

  function displayTrack(inTrack) {
    TrackView.display(inTrack);
  }

  return {
    init: init,
    startWatch: startWatch,
    stopWatch: stopWatch,
    displayTracks: displayTracks,
    displayTrack: displayTrack
  };
}();
// })