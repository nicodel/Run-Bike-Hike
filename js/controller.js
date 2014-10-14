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
    // console.log("Position found", inPosition);
    if (inPosition.coords.accuracy < 50) {
      if (tracking) {
        // console.log("tracking");
        __addNewPoint(inPosition);
      } else {
        // console.log("not tracking");
        HomeView.updateInfos(inPosition, null);
      } 
    } else {
        HomeView.displayAccuracy(inPosition);
    };
  }

  function __locationError(inError){
    console.log("error:",inError);
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
      // document.querySelector("#btn-start").innerHTML = "Stop";
      document.getElementById("btn-start-stop").className = "danger big";
      document.getElementById("btn-start-stop").textContent = _("stop");

      // document.getElementById("btn-start-stop").style.backgroundColor = "#e51e1e";
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
      // console.log("Track empty. Not saving");
      utils.status.show(_("track-empty-not-saving")); //"Track empty. Not saving");
    } else {
      // Save to DB
      DB.addTrack(__addTrackSuccess, __addTrackError, track);
    };
    // document.querySelector("#btn-start").innerHTML = "Start";
    document.getElementById("btn-start-stop").className = "recommend big";
    document.getElementById("btn-start-stop").textContent = _("start");
    // document.getElementById("btn-start-stop").style.backgroundColor = "#1E824C";
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
      HomeView.updateInfos(inPosition, distance)
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
    //console.log("__getConfigSuccess ", Object.keys(inSettings));
    settings = inSettings;
    // document.webL10n.setLanguage(inSettings.language);
    __updateConfigValues(inSettings);
    // __setConfigView(inSettings);
    // __setHomeView(inSettings);

    if (inSettings.screen) {
      var lock = window.navigator.requestWakeLock('screen');
      window.addEventListener('unload', function () {
        lock.unlock();
      });
    };

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
    DB.getConfig(__getConfigSuccess, __getConfigError);
  }

  function __savingSettingsError(inError) {
    console.log("NO !", inError);
  }

  function toggleScreen(inChecked) {
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

  // function __setConfigView(inSettings) {
  //   // console.log("updating the settings DOM elements");
  //   document.getElementById("screen").checked = inSettings.screen;
  //   document.getElementById("language").value = inSettings.language;
  //   document.getElementById("distance").value = inSettings.distance;
  //   document.getElementById("speed").value = inSettings.speed;
  //   document.getElementById("position").value = inSettings.position;
  // 
  function __updateConfigValues(inSettings) {
    //console.log("setting settings :)", inSettings);
    for (var i = 0; i < Object.keys(inSettings).length; i++) {
      var param = Object.keys(inSettings)[i];
      // console.log("param", param);
      // console.log("inSettings[param]", inSettings[param]);
      if (param === "screen") {
        Config.change("SCREEN_KEEP_ALIVE", inSettings[param]);
      } else if (param === "language") {
        if (inSettings[param] === "none") {
          inSettings[param] = document.webL10n.getLanguage();
        } else {
          document.webL10n.setLanguage(inSettings[param]);
        }
      } else if (param === "distance") {
        Config.change("USER_DISTANCE", inSettings[param]);
      } else if (param === "speed") {
        Config.change("USER_SPEED", inSettings[param]);
      } else if (param === "position") {
        Config.change("USER_POSITION_FORMAT", inSettings[param]);
      }
    };
    // console.log("USER_DISTANCE", Config.USER_DISTANCE);
    Config.CONFIG = inSettings;
    console.log("Config.CONFIG", Config.CONFIG);
    
    var a = Config.userSmallDistance(null);
    document.getElementById("home-acc").innerHTML = "&#177; " + a.v;
    document.getElementById("acc-unit").innerHTML =  "(" + a.u + ")";
    var a = Config.userSmallDistance(null);
    document.getElementById("home-alt").innerHTML = a.v;
    document.getElementById("alt-unit").innerHTML = "(" + a.u + ")";
    var a = Config.userSmallDistance(null);
    document.getElementById("home-dist").innerHTML = a.v;
    document.getElementById("dist-unit").innerHTML = "(" + a.u + ")";
    var a = Config.userSpeed(null);
    document.getElementById("home-speed").innerHTML = a.v;
    document.getElementById("speed-unit").innerHTML = "(" + a.u + ")";


    document.getElementById("screen").checked = inSettings.screen;
    document.getElementById("distance").value = inSettings.distance;
    document.getElementById("speed").value = inSettings.speed;
    document.getElementById("position").value = inSettings.position;
    document.getElementById("language").value = inSettings.language;
  }

  // function __setHomeView(inSettings) {
  //   var a = Config.userSmallDistance(null);
  //   document.getElementById("home-acc").innerHTML = "&#177; " + a.v;
  //   document.getElementById("acc-unit").innerHTML =  "(" + a.u + ")";
  //   var a = Config.userSmallDistance(null);
  //   document.getElementById("home-alt").innerHTML = a.v;
  //   document.getElementById("alt-unit").innerHTML = "(" + a.u + ")";
  //   var a = Config.userSmallDistance(null);
  //   document.getElementById("home-dist").innerHTML = a.v;
  //   document.getElementById("dist-unit").innerHTML = "(" + a.u + ")";
  //   var a = Config.userSpeed(null);
  //   document.getElementById("home-speed").innerHTML = a.v;
  //   document.getElementById("speed-unit").innerHTML = "(" + a.u + ")";
  // }

  function __addTrackSuccess(inEvent) {
    utils.status.show(_("track-saved", {inEvent:inEvent})); //"Track " + inEvent + " sucessfully saved.");
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

/*  function displayTrack(inTrack) {
    // console.log("inTrack display: ", inTrack);
    displayed_track = inTrack;
    TrackView.display(inTrack);
  }*/

  function deleteTrack() {
    DB.deleteTrack(__deleteTrackSuccess, __deleteTrackError, displayed_track);
    console.log("delete track: ", displayed_track);
  }

  function __deleteTrackSuccess() {
    TracksView.reset();
    displayTracks();
    utils.status.show(_("track-delete-success", {name:displayed_track.name}));

  }

  function __deleteTrackError() {
    utils.status.show(_("track-delete-failure", {name:displayed_track.name}));
  }

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
    utils.status.show(_("track-rename-success", {name:displayed_track.name}));
  }
  function __updateTrackError() {
    utils.status.show(_("track-rename-failure"));
  }

  function shareTrack(inFile, inSummary, inShare) {
    /*if (inFile || inSummary) {
      if (inFile) {
        var gpx_track = ExportTrack.toGPX(displayed_track);
      };
      if (inSummary) {
        var sum_track = ExportTrack.toSummary(displayed_track);
      }
    } else {
      // ?? nothing selected ??
    };*/
    var gpx_track = ExportTrack.toGPX(displayed_track);
    if (inShare === "email") {
      console.log("sharing on email");
      Share.toEmail(displayed_track, gpx_track);
    /*} else if (inShare === "twitter") {
      console.log("sharing on twitter");*/
    } else if (inShare === "local") {
      var n = displayed_track.name.replace(/[:.-]/g,"") + ".gpx";
      console.log("sharing on local", n);
      Share.toLocal(gpx_track, n, __shareSuccess, __shareError);
    } else {
      // ?? nothing selected ??
      console.log("nothind to be sharing on ??");
    };
  }
  function __shareSuccess(inMessage) {
    utils.status.show(inMessage);
  }
  function __shareError(inMessage) {
    utils.status.show(inMessage);
    // console.log(inMessage);
  }

  function importForDev() {
    DB.addTrack(__addTrackSuccess, __addTrackError, testdata);
  }

  return {
    importForDev: importForDev,
    init: init,
    toggleWatch: toggleWatch,
    stopWatch: stopWatch,
    displayTracks: displayTracks,
    // displayTrack: displayTrack,
    deleteTrack: deleteTrack,
    savingSettings: savingSettings,
    toggleScreen: toggleScreen,
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
