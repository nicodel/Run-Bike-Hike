/* jshint browser: true, strict: true, devel: true */
/* exported Controller */
/* global _, Chrono, Config, DB, GPX, Share, Tracks,
          HomeView, importView, utils, TracksView, TrackView,
          FxDeviceStorage */
var Controller = function() {
  "use strict";

  var settings;
  var watchID, lock;
  var tracking = false;
  var pause = false;
  var display_map = false;
  var duration, distance;
  var displayed_track, current_track;
  var nb_point;

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
  function __initiateSuccess() {
    DB.getConfig(__getConfigSuccess, __getConfigError);
  }

  function __initiateError(inEvent) {
    utils.status.show(inEvent);
  }

  function __locationChanged(inPosition){
    // console.log("Position found", inPosition);
    if (inPosition.coords.accuracy < 50) {
      if (tracking && !pause) {
        // console.log("tracking");
        __addNewPoint(inPosition);
      } else if (tracking && pause) {
        HomeView.updateInfos(inPosition, distance);
      } else {
        // console.log("not tracking");
        HomeView.updateInfos(inPosition, null);
      }
    } else {
        HomeView.displayAccuracy(inPosition);
    }
  }

  function __locationError(inError){
    console.log("error:",inError);
    if (tracking) {
      __positionError(inError);
    } else {
      HomeView.displayError(inError);
    }
  }

  function __changeFrequency(inFreq) {
    navigator.geolocation.clearWatch(watchID);
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
        maximumAge: inFreq
      }
    );
  }

  function toggleWatch() {
    if (tracking) {
      document.getElementById("views").showCard(2);
    } else {
      tracking = true;
      // Start the calculation of elapsed time
      Chrono.load(document.getElementById("home-chrono"));
      Chrono.start();
      // Open new track
      current_track = Tracks.open();
      nb_point = 0;
      document.getElementById("btn-start-stop").className = "danger big";
      document.getElementById("btn-start-stop").textContent = _("stop");
      document.getElementById("btn-pause").className="recommend small icon icon-pause";
    }
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
    }
    document.getElementById("btn-start-stop").className = "recommend big";
    document.getElementById("btn-start-stop").textContent = _("start");
    document.getElementById("btn-pause").className="hidden recommend small icon icon-pause";
  }
  function pauseRecording() {
    if (pause) {
      document.getElementById("btn-pause").className="recommend small icon icon-pause";
      document.getElementById('home-chrono').className = "home-value align-center text-huger text-thin new-line";
      document.getElementById('home-dist').className = "home-value align-center text-huge text-thin";
      Tracks.resumed();
      Chrono.resume();
      pause = false;
   } else {
      document.getElementById("btn-pause").className="recommend small icon icon-play";
      document.getElementById('home-chrono').className = "text-red home-value align-center text-huger text-thin new-line";
      document.getElementById('home-dist').className = "text-red home-value align-center text-huge text-thin";
      Chrono.pauseIt();
      Tracks.newSegment();
      pause = true;
   }
  }

  function __addNewPoint(inPosition){
    if (!inPosition.coords || !inPosition.coords.latitude || !inPosition.coords.longitude) {
      return;
    }

    var event = inPosition.coords;
    // Display GPS data, log to Db
    var speed = event.speed;
    var lat = event.latitude.toFixed(6);
    var lon = event.longitude.toFixed(6);
    var alt = event.altitude;
    var date = new Date(inPosition.timestamp).toISOString();
    var horizAccuracy = event.accuracy.toFixed(0);
    var vertAccuracy = event.altitudeAccuracy.toFixed(0);
    // var direction = event.heading.toFixed(0);

    // fix bad values from gps
    if (alt < -200 || (alt === 0 && vertAccuracy === 0)) {
      alt = null;
    }
    // calculate distance
    distance = Tracks.getDistance(lat, lon);

    // calculating duration
    duration = Tracks.getDuration(inPosition.timestamp);

    HomeView.updateInfos(inPosition, distance);

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
  function __positionError() {}

  function __getConfigSuccess(inSettings) {
    //console.log("__getConfigSuccess ", Object.keys(inSettings));
    settings = inSettings;
    // document.webL10n.setLanguage(inSettings.language);

    if (inSettings.screen) {
      var lock = window.navigator.requestWakeLock('screen');
      window.addEventListener('unload', function () {
        lock.unlock();
      });
    }
    console.log("frequency:", inSettings.frequency);
    if (!inSettings.frequency) {
      console.log("frequency not present in Settings, so we put it !");
      savingSettings("frequency", "0");
    }
    if (inSettings.frequency !== "0") {
      console.log("frequency value is not default!");
      __changeFrequency(parseInt(inSettings.frequency, 10));
    }
    var select = document.getElementById("storage");
    if (FxDeviceStorage.disponible) {
      var storages = FxDeviceStorage.getAvailableStorages();
      if (select.length === 0) {
        for (var i = 0; i < storages.length; i++) {
          var o = document.createElement("option");
          o.value = storages[i].id;
          o.innerHTML = storages[i].name;
          o.setAttribute("data-l10n-id", storages[i].name);
          select.appendChild(o);
        }
      }
      if (!inSettings.storage) {
        console.log("storage is not present in settings");
        savingSettings("storage", "0");
      } else {
        FxDeviceStorage.setUserStorage(inSettings.storage);
      }
    } else {
      var o2 = document.createElement("option");
      o2.innerHTML = 'no storage available';
      o2.setAttribute("data-l10n-id", "no-storage-available");
      select.appendChild(o2);
      select.setAttribute("disabled", true);
    }

    __updateConfigValues(inSettings);
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
      });
    } else {
      window.navigator.requestWakeLock('screen').unlock();
    }
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
  function changeFrequency(inSetting) {
    settings.frequency = inSetting;
  }
  function changeStorage(inSetting) {
    FxDeviceStorage.setUserStorage(inSetting);
    settings.storage = inSetting;
  }

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
    }
    // console.log("USER_DISTANCE", Config.USER_DISTANCE);
    Config.CONFIG = inSettings;
    console.log("Config.CONFIG", Config.CONFIG);

    var a = Config.userSmallDistance(null);
    document.getElementById("home-acc").innerHTML = "&#177; " + a.v;
    document.getElementById("acc-unit").innerHTML =  "(" + a.u + ")";
    a = Config.userSmallDistance(null);
    document.getElementById("home-alt").innerHTML = a.v;
    document.getElementById("alt-unit").innerHTML = "(" + a.u + ")";
    a = Config.userSmallDistance(null);
    document.getElementById("home-dist").innerHTML = a.v;
    document.getElementById("dist-unit").innerHTML = "(" + a.u + ")";
    a = Config.userSpeed(null);
    document.getElementById("home-speed").innerHTML = a.v;
    document.getElementById("speed-unit").innerHTML = "(" + a.u + ")";


    document.getElementById("screen").checked = inSettings.screen;
    document.getElementById("distance").value = inSettings.distance;
    document.getElementById("speed").value = inSettings.speed;
    document.getElementById("position").value = inSettings.position;
    document.getElementById("language").value = inSettings.language;
    document.getElementById("frequency").value = inSettings.frequency;
    document.getElementById("storage").value = inSettings.storage;
  }

  function __addTrackSuccess(inEvent) {
    utils.status.show(_("track-saved", {inEvent:inEvent})); //"Track " + inEvent + " sucessfully saved.");
  }

  function __addTrackError(inEvent) {
    utils.status.show(inEvent);
  }

  function displayTracks() {
    if( document.getElementById("tracks-list").dataset.state === "dirty") {
      document.getElementById("tracks-list").dataset.state = "";
      // get the whole tracks list
      DB.getTracks(__getTracksSuccess, __getTracksError);
    }
  }

  function __getTracksSuccess(inTracks) {
    console.log("inTracks to display are", inTracks);
    TracksView.display(inTracks, __displayTrack);
  }

  function __getTracksError() {}

  function __displayTrack(inTrack) {
    console.log("inTrack display: ", inTrack);
    displayed_track = inTrack;
    TrackView.display(inTrack, __saveMap);
  }

  function deleteTrack() {
    DB.deleteTrack(__deleteTrackSuccess, __deleteTrackError, displayed_track);
    console.log("delete track: ", displayed_track);
  }

  function __deleteTrackSuccess() {
    TracksView.reset();
    utils.status.show(_("track-delete-success", {name:displayed_track.name}));
    document.getElementById("views").showCard(3);
    displayTracks();
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
  function getTrackInfo() {
    return {
      name: displayed_track.name,
      icon: displayed_track.icon
    };
  }
  function editTrack(inName, inIcon) {
    displayed_track.name = inName;
    displayed_track.icon = inIcon;
    console.log("track name is now ", displayed_track.name);
    DB.updateTrack(__updateTrackSuccess, __updateTrackError, displayed_track);
  }
  function __updateTrackSuccess() {
    TrackView.updateName(displayed_track.name);
    document.getElementById("views").showCard(4);
    utils.status.show(_("track-edit-success", {name:displayed_track.name}));
  }
  function __updateTrackError() {
    utils.status.show(_("track-edit-failure"));
  }

  function shareTrack(inShare) {
    console.log('controller share');
    if (inShare === "on-social") {
      console.log("sharing on social apps");
      Share.toApps(displayed_track, __shareSuccess, __shareError);
    } else if (inShare === "on-device") {
      var gpx_track = GPX.create(displayed_track);
      var n = displayed_track.name.replace(/[:.-]/g,"") + ".gpx";
      console.log("sharing on local", n);
      FxDeviceStorage.saveFile(gpx_track, n,
          __shareSuccess,
          __shareError);
    } else {
      // ?? nothing selected ??
      console.log("nothing to be sharing on ??");
    }
  }
  function __shareSuccess(inMessage) {
    utils.status.show(inMessage);
    // document.getElementById("views").showCard(4);
  }
  function __shareError(inMessage) {
    utils.status.show(inMessage);
    // console.log(inMessage);
  }

  function searchFiles() {
    FxDeviceStorage.getFilesFromPath("rbh/import", "gpx",
        __getFilesFromPathSuccess,
        __getFilesFromPathError);
  }

  function __getFilesFromPathSuccess(inFiles) {
    importView.updateStorageName(FxDeviceStorage.getUserStorage().name);
    console.log("inFiles to display", inFiles);
    importView.updateSelectFilesList(inFiles);
  }

  function __getFilesFromPathError(inError) {
    if (inError === "NotFoundError") {
      inError = _("import-missing");
    }
    utils.status.show(inError);
  }

  function importFile(inPath) {
    console.log("import file", inPath);
    importView.resetList();
    importView.showSpinner();
    FxDeviceStorage.openFile(inPath,
        __openFileSuccess,
        __openFileError);
  }
  function __openFileSuccess(inFile) {
    GPX.load(inFile,
        __GPXloadSuccess,
        __GPXloadError);
  }
  function __openFileError(inPath, inError) {
    utils.status.show(_("unable-get-file", {file:inPath, error: inError}));
  }

  function __GPXloadSuccess(inTrack) {
    // console.log("success load track", inTrack);
    current_track = Tracks.importFromFile(inTrack);
    Tracks.reset();
    var track = Tracks.close();
    DB.addTrack(__addTrackonImportSuccess, __addTrackonImportError, track);
  }

  function __GPXloadError() {}

  function __addTrackonImportSuccess(inEvent) {
    utils.status.show(_("track-saved", {inEvent:inEvent})); //"Track " + inEvent + " sucessfully saved.");
    importView.hideSpinner();
    TracksView.reset();
    document.getElementById("views").showCard(4);
    __displayTrack(current_track);
  }

  function __addTrackonImportError(inEvent) {
    utils.status.show(inEvent);
  }

  function resetImportList() {
    importView.resetList();
  }

  return {
    init: init,
    toggleWatch: toggleWatch,
    stopWatch: stopWatch,
    pauseRecording: pauseRecording,
    displayTracks: displayTracks,
    // displayTrack: displayTrack,
    deleteTrack: deleteTrack,
    savingSettings: savingSettings,
    toggleScreen: toggleScreen,
    changeLanguage: changeLanguage,
    changeDistance: changeDistance,
    changeSpeed: changeSpeed,
    changePosition: changePosition,
    changeFrequency: changeFrequency,
    changeStorage: changeStorage,
    flippingTrack: flippingTrack,
    getTrackInfo: getTrackInfo,
    editTrack: editTrack,
    shareTrack: shareTrack,
    searchFiles: searchFiles,
    importFile: importFile,
    resetImportList: resetImportList
  };
}();
// })
