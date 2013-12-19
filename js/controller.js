var Controller = function() {

  var settings;
  var watchID, lock;
  var olat, olon;
  var tracking = false;
  var duration;
  var displayed_track;

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
    // InfosView.startChrono();
    Chrono.load(document.getElementById("infos-chrono"));
    Chrono.start();
    // Open new track
    current_track = Tracks.open();
    nb_point = 0;
  }
  function stopWatch(){
    //Stop the calculation of elapsed time
    // InfosView.stopChrono();
    Chrono.stop();
    // Clear the watch
    // navigator.geolocation.clearWatch(watchID);
    // reset counters
    Tracks.reset();
    Chrono.reset();
    // Close track
    var track = Tracks.close();
    // Save to DB
    DB.addTrack(__addTrackSuccess, __addTrackError, track);
  }
  function __locationChanged(inPosition){
    // console.log("Position found");
    if (tracking) {
      // console.log("tracking");
      __positionChanged(inPosition);
    } else {
      // console.log("not tracking");
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
      // console.log("__locationChanged not - inPosition: ", inPosition);
      return;
    }
    // console.log("__locationChanged - inPosition: ", inPosition);
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
    duration = Tracks.getDuration(inPosition.timestamp);

    // updating UI
    // nb_point =+ 1;
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
    Tracks.addNode(gps_point, distance, duration);
  }
  function __positionError(inError) {}

  function __initiateSuccess(inEvent) {
    // utils.status.show(inEvent);
    console.log("__initiateSuccess ", inEvent);
    DB.getConfig(__getConfigSuccess, __getConfigError);
  }

  function __initiateError(inEvent) {
    utils.status.show(inEvent); 
  }

  function __getConfigSuccess(inSettings) {
    console.log("__getConfigSuccess ", inSettings);
    settings = inSettings;
    __setConfigView(inSettings);
  }
  function __getConfigError(inEvent) { console.log("__getConfigError ", inEvent); }

  function updateSettings(inKey, inValue) {
    settings.inKey = inValue;
  }

  function __setConfigView(inSettings) {
    document.querySelector("#screen-keep").checked = inSettings.screen;
    document.querySelector("#language").value = inSettings.language;
    document.querySelector("#distance").value = inSettings.distance;
    document.querySelector("#speed").value = inSettings.speed;
    document.querySelector("#position").value = inSettings.position;
  }

  function __addTrackSuccess(inEvent) {
    utils.status.show("Track " + inEvent + " sucessfully saved.");
  }

  function __addTrackError(inEvent) {
    utils.status.show(inEvent); 
  }

  function displayTracks() {
    // reset the tracks list display
    // TracksView.reset();
    // get the whole tracks list
    DB.getTracks(__getTracksSuccess, __getTracksError);
  }

  function __getTracksSuccess(inTracks) {
    TracksView.display(inTracks);
  }

  function __getTracksError(inTracks) {}

  function displayTrack(inTrack) {
    // console.log("inTrack display: ", inTrack);
    displayed_track = inTrack;
    TrackView.display(inTrack);
  }

  function deleteTrack() {
    DB.deleteTrack(__deleteTrackSuccess, __deleteTrackError, displayed_track);
  }

  function __deleteTrackSuccess() {
    displayTracks();
  }

  function __deleteTrackError() {}

  return {
    init: init,
    startWatch: startWatch,
    stopWatch: stopWatch,
    displayTracks: displayTracks,
    displayTrack: displayTrack,
    deleteTrack: deleteTrack,
    updateSettings: updateSettings
  };
}();
// })