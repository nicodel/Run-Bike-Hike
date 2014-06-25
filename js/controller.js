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
    // navigator.geolocation.clearWatch(initID);
    watchID = navigator.geolocation.getCurrentPosition(
    // watchID = test.geolocation.watchPosition(
      function(inPosition){
        __positionChanged(inPosition);
        },
      function (inError){
        __positionError(inError);
      }
    );
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
    // reset counters
    Tracks.reset();
    Chrono.reset();
    // Close track
    var track = Tracks.close();
    tracking = false;
    // if no gps point were retreive we don't save the track
    if (track.data.length === 0) {
      // we notify that we do nothing (cause that's good)
      console.log("Track empty. Not saving");
      utils.status.show("Track empty. Not saving");
    } else {
      // Save to DB
      DB.addTrack(__addTrackSuccess, __addTrackError, track);
    };
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
    } else {
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
    /*
    if (tracking_display === "infos") {
      InfosView.updateInfos(inPosition, distance)
    } else if (tracking_display === "map") {
      MapView.updateInfos(inPosition, distance)
    }
    */

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
    // console.log("__initiateSuccess ", inEvent);
    DB.getConfig(__getConfigSuccess, __getConfigError);
  }

  function __initiateError(inEvent) {
    utils.status.show(inEvent);
  }

  function __getConfigSuccess(inSettings) {
    // console.log("__getConfigSuccess ", Object.keys(inSettings));
    settings = inSettings;
    __setConfigView(inSettings);
    // __setConfigValues(inSettings);
  }
  function __getConfigError(inEvent) { console.log("__getConfigError ", inEvent); }

  function savingSettings(inKey, inValue) {
/*    for (var i = 0; i < settings.length; i++) {
      if (settings[i].key === inKey) {
        settings[i].value = inValue;
      }
    };*/
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
    // TracksView.reset();
    // get the whole tracks list
    DB.getTracks(__getTracksSuccess, __getTracksError);
  }

  function __getTracksSuccess(inTracks) {
    TracksView.display(inTracks, __displayTrack);
  }

  function __getTracksError(inTracks) {}

  function __displayTrack(inTrack) {
    // console.log("inTrack display: ", inTrack);
    displayed_track = inTrack;
    TrackView.display(inTrack);
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
    displayTracks();
  }

  function __deleteTrackError() {}

  // function userSpeed(velocityMPS){
  //   console.log("settings.speed", settings.speed);
  //   if (velocityMPS === null || velocityMPS<0 || isNaN(velocityMPS)) {
  //     return "?";
  //   } else if (settings.speed === "1"){
  //     /* FIXME: I'am not sure that it is right */
  //     return (velocityMPS * 2.237).toFixed(0)+" MPH";
  //   }  else if (settings.speed === "0"){
  //     return (velocityMPS * 3.6).toFixed(0)+" km/h";
  //   } else {
  //     return velocityMPS+ " m/s";
  //   };
  // }
  // function userSpeedInteger(velocityMPS) {
  //   if (velocityMPS === null || velocityMPS<0 || isNaN(velocityMPS)) {
  //     return null;
  //   } else if (settings.speed === "1"){
  //     /* FIXME: I'am not sure that it is right */
  //     return (velocityMPS * 2.237).toFixed(0);
  //   } else if (settings.speed === "0"){
  //     return (velocityMPS * 3.6).toFixed(0);
  //   } else {
  //     return velocityMPS;
  //   }
  // }
  // function __userDegree(degree) {
  //    minutes = (degree - Math.floor(degree)) * 60;
  //    seconds = (minutes - Math.floor(minutes )) * 60;
  //    return Math.floor(degree) + "°" + (minutes<10?"0":"") + Math.floor(minutes) + "'" + (seconds<10?"0":"") + seconds.toFixed(2) + "\"";
  // }
  // function __userDegreeLikeGeocaching(degree) {
  //   minutes = (degree - Math.floor(degree)) * 60;
  //   return Math.floor(degree) + "°" + (minutes<10?"0":"") + minutes.toFixed(3) + "'";
  // }
  // function userLatitude(degree) {
  //   if (settings.position === "2") {
  //      return degree;
  //     } else if (settings.position === "1") {
  //     return (degree>0? "N":"S") +" "+ __userDegreeLikeGeocaching( Math.abs(degree) );
  //   } else {
  //     return __userDegree( Math.abs(degree) ) + (degree>0? "N":"S");
  //   }
  // }
  // function userLongitude(degree) {
  //   if (settings.position === "2") {
  //     return degree;
  //   } else if (settings.position === "1") {
  //   return (degree>0? "E":"W") +" "+ __userDegreeLikeGeocaching( Math.abs(degree) );
  //   } else {
  //     return __userDegree( Math.abs(degree) ) + (degree>0? "E":"W");
  //   }
  // }
  // function userSmallDistance(distanceM, canNegative){
  //   if ((distanceM === null) || ((distanceM < 0) && (!canNegative))) {
  //     return "?";
  //   } else if (settings.distance === "1") {
  //    /* FIXME: I'am not sure that it is right */
  //    return (distanceM * 3.2808).toFixed(0)+" ft";
  //   } else if (settings.distance === "0") {
  //    return (distanceM * 1.0).toFixed(0)+" m";
  //   } else {
  //     return distanceM+" m";
  //   }
  // }
  // function userDistance (distanceM, canNegative){
  //   // console.log("settings.distance:", settings.distance);
  //   if ((distanceM === null) || ((distanceM < 0) && (!canNegative))) {
  //     return "?";
  //   } else if (distanceM < 4000) {
  //     return userSmallDistance(distanceM);
  //   } else if (settings.distance === "0") {
  //     tmp = (distanceM / 1000);
  //     return (tmp >= 10? tmp.toFixed(0): tmp.toFixed(1))+" km";
  //   } else if (settings.distance === "1") {
  //     /* FIXME: I'am not sure that it is right */
  //     tmp = (distanceM / 1609.344);
  //     return (tmp >= 10? tmp.toFixed(0): tmp.toFixed(1))+" miles";
  //   } else {
  //     return distanceM+" m";
  //   };
  // }
  // function userDate(inDate) {
  //   var d = new Date(inDate);

  //   var year = d.getFullYear();
  //   var month = d.getMonth() + 1;
  //   var day = d.getDate();
  //   var hour = d.getHours();
  //   var min = d.getMinutes();
  //   var sec = d.getSeconds();
  //   if (month < 10) {
  //     month = "0" + month.toString();
  //   };
  //   if (day < 10) {
  //     day = "0" + day.toString();
  //   };
  //   var outDate = day+"/"+month+"/"+year;
  //   // var outDate = day+"/"+month+"/"+year+ " "+hour+":"+min+":"+sec;
  //   return  outDate;
  // }
  function saveMap(inTrack) {
    console.log("saving inTrack in Controller", inTrack);
    DB.saveMap(__saveMapSuccess, __saveMapError, inTrack);
  }
  function __saveMapSuccess() {}
  function __saveMapError() {}

  return {
    init: init,
    startWatch: startWatch,
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
    // userSpeed: userSpeed,
    // userSpeedInteger: userSpeedInteger,
    // userDegree: userDegree,
    // userLatitude: userLatitude,
    // userLongitude: userLongitude,
    // userSmallDistance: userSmallDistance,
    // userDistance: userDistance,
    // userDate: userDate,
    saveMap: saveMap
  };
}();
// })