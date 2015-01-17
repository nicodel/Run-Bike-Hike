/* jshint browser: true, strict: true, devel: true */
/* exported Config */
var Config = function() {
  "use strict";

  /*
   * Préférences
   *
   * screen: boolean
   *  true
   *  false
   * language: string
   *  english: en
   *  spanish: es
   *  french: fr
   * distance: string
   *  metric: 0
   *  imperial: 1
   * speed: string
   *  km/h: 0
   *  mph: 1
   * position: string
   *  default: 0
   *  geocaching: 1
   *  degrees: 2
   */
  var CONFIG = {
    screen: false,
    language: "en",
    distance: "0",
    speed: "0",
    position: "0",
    frequency: "auto"
    };
  var METRIC_UNITS = "0";
  var IMPERIAL_UNITS = "1";

  var GEOCACHING_POS_FORMAT = "1";
  var DEGREES_POS_FORMAT = "2";

  function change(inKey, inValue) {
    inKey = inValue;
  }
  function userSpeed(velocityMPS){
    // console.log("Config.CONFIG.screen", JSON.stringify(Config.CONFIG.screen));
    var a = {};
    if (velocityMPS === null || velocityMPS<0 || isNaN(velocityMPS) || velocityMPS === Infinity) {
      if (Config.CONFIG.speed === IMPERIAL_UNITS) {
        a.u = "mph";
      }
      if (Config.CONFIG.speed === METRIC_UNITS){
        a.u = "km/h";
      }
      a.v = "--";
      return a;
    }

    if (Config.CONFIG.speed === IMPERIAL_UNITS){
      /* FIXME: I'am not sure that it is right */
       a.v = (velocityMPS * 2.237).toFixed(1);
       a.u = "mph";
       return a;
    }
    if (Config.CONFIG.speed === METRIC_UNITS){
       a.v = (velocityMPS * 3.6).toFixed(1);
       a.u = "km/h";
       return a;
    }
     a.v = velocityMPS;
     a.u = "m/s";
     return a;
  }
  function userSpeedInteger(velocityMPS) {
    if (velocityMPS === null || velocityMPS<0 || isNaN(velocityMPS)) {
      return null;
    }

    if (Config.CONFIG.speed === IMPERIAL_UNITS){
      /* FIXME: I'am not sure that it is right */
      return (velocityMPS * 2.237).toFixed(1);
    }
    if (Config.CONFIG.speed === METRIC_UNITS){
      return (velocityMPS * 3.6).toFixed(1);
    }
    return velocityMPS;
  }
  function userDegree(degree){
     var minutes = (degree - Math.floor(degree)) * 60;
     var seconds = (minutes - Math.floor(minutes )) * 60;
     return Math.floor(degree) + "°" + (minutes<10?"0":"") + Math.floor(minutes) + "'" + (seconds<10?"0":"") + seconds.toFixed(2) + "\"";
  }
  function userLatitude(degree){
     if (Config.CONFIG.position === DEGREES_POS_FORMAT) {
       return degree;
     }
     if (Config.CONFIG.position === GEOCACHING_POS_FORMAT) {
      return (degree>0? "N":"S") +" "+ __userDegreeLikeGeocaching( Math.abs(degree) );
     }
     return userDegree( Math.abs(degree) ) + (degree>0? "N":"S");
  }
  function userLongitude(degree){
     if (Config.CONFIG.position === DEGREES_POS_FORMAT) {
       return degree;
     }
     if (Config.CONFIG.position === GEOCACHING_POS_FORMAT) {
      return (degree>0? "E":"W") +" "+ __userDegreeLikeGeocaching( Math.abs(degree) );
     }
     return userDegree( Math.abs(degree) ) + (degree>0? "E":"W");
  }
  function __userDegreeLikeGeocaching (degree){
    var minutes = (degree - Math.floor(degree)) * 60;
    return Math.floor(degree) + "°" + (minutes<10?"0":"") + minutes.toFixed(3) + "'";
  }
  function userSmallDistance(distanceM, canNegative){
    var a = {};
    if ((distanceM === null) || ((distanceM < 0) && (!canNegative)) || isNaN(distanceM) || distanceM === Infinity) {
      if (Config.CONFIG.distance === IMPERIAL_UNITS){
         a.u = "ft";
       }
      if (Config.CONFIG.distance === METRIC_UNITS){
        a.u = "m";
       }
       a.v = "--";
      return a;
    }

    if (Config.CONFIG.distance === IMPERIAL_UNITS){
     /* FIXME: I'am not sure that it is right */
     a.v = (distanceM * 3.2808).toFixed(0);
     a.u = "ft";
     return a;
    }
    if (Config.CONFIG.distance === METRIC_UNITS){
    a.v = (distanceM * 1.0).toFixed(0);
    a.u = "m";
    return a;
    }
    a.v = distanceM;
    a.u = "m";
    return a;
  }
  function userDistance (distanceM, canNegative){
    var tmp;
    var a = {};
    if ((distanceM === null) || ((distanceM < 0) && (!canNegative)) || isNaN(distanceM) || distanceM === Infinity) {
      if (Config.CONFIG.distance === IMPERIAL_UNITS) {
        a.u = "miles";
      }
      if (Config.CONFIG.distance === METRIC_UNITS) {
        a.u = "km";
      }
      a.v = "--";
      return a;
    }

    if (Config.CONFIG.distance === METRIC_UNITS){
      tmp = (distanceM / 1000);
      a.v = (tmp >= 10? tmp.toFixed(0): tmp.toFixed(1));
      a.u = "km";
      return a;
    }
    if (Config.CONFIG.distance === IMPERIAL_UNITS){
      /* FIXME: I'am not sure that it is right */
      tmp = (distanceM / 1609.344);
      a.v = (tmp >= 10? tmp.toFixed(0): tmp.toFixed(1));
      a.u = "miles";
      return a;
    }
     a.v = distanceM;
     a.u = "m";
     return a;
  }
  function userDate(inDate) {
    var d = new Date(inDate);

    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    if (month < 10) {
      month = "0" + month.toString();
    }
    if (day < 10) {
      day = "0" + day.toString();
    }
    var outDate = day+"/"+month+"/"+year;
    return  outDate;
  }

  return {
    CONFIG: CONFIG,
    change: change,
    userSpeed: userSpeed,
    userSpeedInteger: userSpeedInteger,
    userDegree: userDegree,
    userLatitude: userLatitude,
    userLongitude: userLongitude,
    userSmallDistance: userSmallDistance,
    userDistance: userDistance,
    userDate: userDate
  };

}();
