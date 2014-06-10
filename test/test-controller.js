var Controller = function() {

  var settings = { distance: "0", language: "en", position: "0", screen: false, speed: "0" };
  var watchID, lock;
  var olat, olon;
  var tracking = false;
  var duration;
  var displayed_track;

  function init() {
    // startWatch();
    DB.initiate(__initiateSuccess, __initiateError);
  }


  function __initiateSuccess(inEvent) {
    DB.getConfig(__getConfigSuccess, __getConfigError);
  }

  function __initiateError(inEvent) {
    utils.status.show(inEvent);
  }

  function __getConfigSuccess(inSettings) {
    // settings = inSettings;
    console.log("settings", settings);
  }
  function __getConfigError(inEvent) { console.log("__getConfigError ", inEvent); }

  function __getTracksSuccess(inTracks) {
    TracksView.display(inTracks);
  }

  function __getTracksError(inTracks) {}

  function displayTrack(inTrack) {
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

  function userSpeed(velocityMPS){
    console.log("settings.speed", settings.speed);
    if (velocityMPS === null || velocityMPS<0 || isNaN(velocityMPS)) {
      return "?";
    } else if (settings.speed === "1"){
      /* FIXME: I'am not sure that it is right */
      return (velocityMPS * 2.237).toFixed(0)+" MPH";
    }  else if (settings.speed === "0"){
      return (velocityMPS * 3.6).toFixed(0)+" km/h";
    } else {
      return velocityMPS+ " m/s";
    };
  }
  function userSpeedInteger(velocityMPS) {
    if (velocityMPS === null || velocityMPS<0 || isNaN(velocityMPS)) {
      return null;
    } else if (settings.speed === "1"){
      /* FIXME: I'am not sure that it is right */
      return (velocityMPS * 2.237).toFixed(0);
    } else if (settings.speed === "0"){
      return (velocityMPS * 3.6).toFixed(0);
    } else {
      return velocityMPS;
    }
  }
  function __userDegree(degree) {
     minutes = (degree - Math.floor(degree)) * 60;
     seconds = (minutes - Math.floor(minutes )) * 60;
     return Math.floor(degree) + "°" + (minutes<10?"0":"") + Math.floor(minutes) + "'" + (seconds<10?"0":"") + seconds.toFixed(2) + "\"";
  }
  function __userDegreeLikeGeocaching(degree) {
    minutes = (degree - Math.floor(degree)) * 60;
    return Math.floor(degree) + "°" + (minutes<10?"0":"") + minutes.toFixed(3) + "'";
  }
  function userLatitude(degree) {
    if (settings.position === "2") {
       return degree;
      } else if (settings.position === "1") {
      return (degree>0? "N":"S") +" "+ __userDegreeLikeGeocaching( Math.abs(degree) );
    } else {
      return __userDegree( Math.abs(degree) ) + (degree>0? "N":"S");
    }
  }
  function userLongitude(degree) {
    if (settings.position === "2") {
      return degree;
    } else if (settings.position === "1") {
    return (degree>0? "E":"W") +" "+ __userDegreeLikeGeocaching( Math.abs(degree) );
    } else {
      return __userDegree( Math.abs(degree) ) + (degree>0? "E":"W");
    }
  }
  function userSmallDistance(distanceM, canNegative){
    if ((distanceM === null) || ((distanceM < 0) && (!canNegative))) {
      return "?";
    } else if (settings.distance === "1") {
     /* FIXME: I'am not sure that it is right */
     return (distanceM * 3.2808).toFixed(0)+" ft";
    } else if (settings.distance === "0") {
     return (distanceM * 1.0).toFixed(0)+" m";
    } else {
      return distanceM+" m";
    }
  }
  function userDistance (distanceM, canNegative){
    // console.log("settings.distance:", settings.distance);
    if ((distanceM === null) || ((distanceM < 0) && (!canNegative))) {
      return "?";
    } else if (distanceM < 4000) {
      return userSmallDistance(distanceM);
    } else if (settings.distance === "0") {
      tmp = (distanceM / 1000);
      return (tmp >= 10? tmp.toFixed(0): tmp.toFixed(1))+" km";
    } else if (settings.distance === "1") {
      /* FIXME: I'am not sure that it is right */
      tmp = (distanceM / 1609.344);
      return (tmp >= 10? tmp.toFixed(0): tmp.toFixed(1))+" miles";
    } else {
      return distanceM+" m";
    };
  }
  function userDate(inDate) {
    var d = new Date(inDate);

    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hour = d.getHours();
    var min = d.getMinutes();
    var sec = d.getSeconds();
    if (month < 10) {
      month = "0" + month.toString();
    };
    if (day < 10) {
      day = "0" + day.toString();
    };
    var outDate = day+"/"+month+"/"+year;
    // var outDate = day+"/"+month+"/"+year+ " "+hour+":"+min+":"+sec;
    return  outDate;
  }
  function saveMap(inTrack) {
    console.log("saving inTrack in Controller", inTrack);
    DB.saveMap(__saveMapSuccess, __saveMapError, inTrack);
  }
  function __saveMapSuccess() {}
  function __saveMapError() {}

  return {
    init: init,
    displayTrack: displayTrack,
    deleteTrack: deleteTrack,
    userSpeed: userSpeed,
    userSpeedInteger: userSpeedInteger,
    userSmallDistance: userSmallDistance,
    userDistance: userDistance,
    userDate: userDate,
    saveMap: saveMap
  };
}();
// })