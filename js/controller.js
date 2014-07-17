"use strict;"
var Controller = function() {

  var settings;
  var watchID, lock;
  var olat, olon;
  var tracking = false;
  var display_map = false;
  var duration;
  var displayed_track;

  function init() {
    DB.initiate(__initiateSuccess, __initiateError);
    if (navigator.geolocation) {
      watchID = navigator.geolocation.watchPosition(
        function(inPosition){
          __locationChanged(inPosition);
        },
        function (inError){
          __locationError(inError);
        },
        {
          enableHighAccuracy: true,
          timeout: Infinity,
          maximumAge: 0
        }
      );
    }
  }
  function __initiateSuccess(inEvent) {
    DB.getConfig(__getConfigSuccess, __getConfigError);
  }

  function __initiateError(inEvent) {
    utils.status.show(inEvent);
  }

  function __locationChanged(inPosition){
    // console.log("Position found");
    if (tracking) {
      // console.log("tracking");
      __addNewPoint(inPosition);
    } else {
      // console.log("not tracking");
      HomeView.updateInfos(inPosition);
    };
  }
  function __locationError(inError){
    // console.log("error:",inError);
    if (tracking) {
      __positionError(inError);
    } else {
      HomeView.displayError(inError);
    };
  }

  function toggleWatch() {
    if (tracking) {
      document.getElementById("views").showCard(2);
    } else {
      tracking = true;
      // Start the calculation of elapsed time
      // InfosView.startChrono();
      Chrono.load(document.getElementById("home-chrono"));
      Chrono.start();
      // Open new track
      current_track = Tracks.open();
      nb_point = 0;
      document.querySelector("#btn-start").innerHTML = "Stop";
      document.querySelector("#btn-start").className = "align-right danger big alternate";
    };
  }
  function stopWatch(){
    //Stop the calculation of elapsed time
    Chrono.stop();
    // reset counters
    Tracks.reset();
    Chrono.reset();
    // Close track
    var track = Tracks.close();
    tracking = false;
    console.log("track is", track);
    // if no gps point were retreive we don't save the track
    if (track.data.length === 0) {
      // we notify that we do nothing (cause that's good)
      console.log("Track empty. Not saving");
      utils.status.show("Track empty. Not saving");
    } else {
      // Save to DB
      DB.addTrack(__addTrackSuccess, __addTrackError, track);
    };
    document.querySelector("#btn-start").innerHTML = "Start";
    document.querySelector("#btn-start").className = "align-right recommend big alternate"
  }

  function __addNewPoint(inPosition){
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

    // calculating duration
    duration = Tracks.getDuration(inPosition.timestamp);

    // updating UI
    // if (display_map) {
    //   MapView.updateMap(inPosition)
    // } else {
    //   HomeView.updateInfos(inPosition, distance)
    // }

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

  function __getConfigSuccess(inSettings) {
    // console.log("__getConfigSuccess ", Object.keys(inSettings));
    settings = inSettings;
    __setConfigView(inSettings);
    // __setConfigValues(inSettings);
  }
  function __getConfigError(inEvent) { console.log("__getConfigError ", inEvent); }

  function savingSettings(inKey, inValue) {
    settings[inKey] = inValue;
    console.log("saving:", inKey + " " + inValue);
    console.log("now settings:", settings);
    DB.updateConfig(__savingSettingsSuccess, __savingSettingsError, inKey, inValue);
  }

  function __savingSettingsSuccess() {
    console.log("YES !");
  }

  function __savingSettingsError(inError) {
    console.log("NO !", inError);
  }

  function toogleScreen(inChecked) {
    console.log("inChecked", inChecked);
    if (inChecked) {
      lock = window.navigator.requestWakeLock('screen');
      /* Unlock the screen */
      window.addEventListener('unload', function () {
        lock.unlock();
      })
    } else {
      window.navigator.requestWakeLock('screen').unlock();
    };
  }
  function changeLanguage(inSetting) {
    settings.language = inSetting;
  }
  function changeDistance(inSetting) {
    settings.distance = inSetting;
  }
  function changeSpeed(inSetting) {
    settings.speed = inSetting;
  }
  function changePosition(inSetting) {
    settings.position = inSetting;
  }

  function __setConfigView(inSettings) {
    // console.log("updating the settings DOM elements");
    document.getElementById("screen").checked = inSettings.screen;
    document.getElementById("language").value = inSettings.language;
    document.getElementById("distance").value = inSettings.distance;
    document.getElementById("speed").value = inSettings.speed;
    document.getElementById("position").value = inSettings.position;
  }
  function __setConfigValues(inSettings) {
    for (var i = 0; i < inSettings.length; i++) {
      var param = inSettings[i];
      if (param.key === "screen") {
        Config.change("SCREEN_KEEP_ALIVE", param.value);
      } else if (param.key === "language") {
        // Config.change("")
      } else if (param.key === "distance") {
        Config.change("USER_DISTANCE", param.value);
      } else if (param.key === "speed") {
        Config.change("USER_SPEED", param.value);
      } else if (param.key === "position") {
        Config.change("USER_POSITION_FORMAT", param.value);
      }
    };
  }

  function __addTrackSuccess(inEvent) {
    utils.status.show("Track " + inEvent + " sucessfully saved.");
  }

  function __addTrackError(inEvent) {
    utils.status.show(inEvent);
  }

  function displayTracks() {
    // reset the tracks list display
    TracksView.reset();
    // get the whole tracks list
    DB.getTracks(__getTracksSuccess, __getTracksError);
  }

  function __getTracksSuccess(inTracks) {
    console.log("inTracks to display are", inTracks);
    TracksView.display(inTracks, __displayTrack);
  }

  function __getTracksError(inTracks) {}

  function __displayTrack(inTrack) {
    console.log("inTrack display: ", inTrack);
    displayed_track = inTrack;
    TrackView.display(inTrack, __saveMap);
  }

  function displayTrack(inTrack) {
    // console.log("inTrack display: ", inTrack);
    displayed_track = inTrack;
    TrackView.display(inTrack);
  }

  function deleteTrack() {
    DB.deleteTrack(__deleteTrackSuccess, __deleteTrackError, displayed_track);
    console.log("delete track: ", displayed_track);
  }

  function __deleteTrackSuccess() {
    TracksView.reset();
    displayTracks();
  }

  function __deleteTrackError() {}

  function __saveMap(inTrack) {
    console.log("saving inTrack in Controller", inTrack);
    DB.saveMap(__saveMapSuccess, __saveMapError, inTrack);
  }
  function __saveMapSuccess() {}
  function __saveMapError() {}

  function flippingTrack(inFlipped) {
    // console.log("inFlipped", inFlipped);
    display_map = inFlipped;
  }
  function getTrackName() {
    return displayed_track.name;
  }
  function renameTrack(inName) {
    displayed_track.name = inName
    console.log("track name is now ", displayed_track.name);
    DB.updateTrack(__updateTrackSuccess, __updateTrackError, displayed_track);
  }
  function __updateTrackSuccess() {
    TrackView.updateName(displayed_track.name);
    document.getElementById("views").showCard(4);
  }
  function __updateTrackError() {}

  function shareTrack() {
    ExportTrack.toGPX(displayed_track);
  }


  return {
    init: init,
    toggleWatch: toggleWatch,
    stopWatch: stopWatch,
    displayTracks: displayTracks,
    displayTrack: displayTrack,
    deleteTrack: deleteTrack,
    savingSettings: savingSettings,
    toogleScreen: toogleScreen,
    changeLanguage: changeLanguage,
    changeDistance: changeDistance,
    changeSpeed: changeSpeed,
    changePosition: changePosition,
    flippingTrack: flippingTrack,
    getTrackName: getTrackName,
    renameTrack: renameTrack,
    shareTrack: shareTrack
  };
}();
// })