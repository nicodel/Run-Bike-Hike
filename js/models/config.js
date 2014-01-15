// define(function(){
var Config = function() {

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
  // var CONFIG = {
  //   new: true,
  //   screen:false,
  //   language: "en",
  //   distance: "0",
  //   speed: "0",
  //   position: "0"
  // };

  var METRIC_UNITS = 0;
  var IMPERIAL_UNITS = 1;

  var DEFAULT_EXPORT_FORMAT = "gpx";

  var DEFAULT_POS_FORMAT = 0;
  var GEOCACHING_POS_FORMAT = 1;
  var DEGREES_POS_FORMAT = 2;

  var DEFAULT_DISCARD_VALUE = 500 * 1000;

  var SCREEN_KEEP_ALIVE = true;

  // Default config values
  var USER_UNIT = 0;
  var USER_POSITION_FORMAT = 0;

  function get() {

  }

  function save() {}

  function userSpeed(velocityMPS){
    // console.log("SPEED METRIC:", velocityMPS);
    if (velocityMPS === null || velocityMPS<0 || isNaN(velocityMPS)) {
      return "?";
    }

    if (USER_UNIT === IMPERIAL_UNITS){
      /* FIXME: I'am not sure that it is right */
      return (velocityMPS * 2.237).toFixed(0)+" MPH";
    }
    if (USER_UNIT === METRIC_UNITS){
      return (velocityMPS * 3.6).toFixed(0)+" km/h";
    }
    return velocityMPS+ " m/s";
  }

  function userSpeedInteger(velocityMPS) {
    // console.log("SPEED METRIC:", velocityMPS);
    if (velocityMPS === null || velocityMPS<0 || isNaN(velocityMPS)) {
      return null;
    }

    if (USER_UNIT === IMPERIAL_UNITS){
      /* FIXME: I'am not sure that it is right */
      return (velocityMPS * 2.237).toFixed(0);
    }
    if (USER_UNIT === METRIC_UNITS){
      return (velocityMPS * 3.6).toFixed(0);
    }
    return velocityMPS;
  }

  function userDegree(degree){
     minutes = (degree - Math.floor(degree)) * 60;
     seconds = (minutes - Math.floor(minutes )) * 60;
     return Math.floor(degree) + "°" + (minutes<10?"0":"") + Math.floor(minutes) + "'" + (seconds<10?"0":"") + seconds.toFixed(2) + "\"";
  }

  function userLatitude(degree){
     if (USER_POSITION_FORMAT === DEGREES_POS_FORMAT)
       return degree;

     if (USER_POSITION_FORMAT === GEOCACHING_POS_FORMAT)
      return (degree>0? "N":"S") +" "+ this.userDegreeLikeGeocaching( Math.abs(degree) );

     return this.userDegree( Math.abs(degree) ) + (degree>0? "N":"S");
  }

  function userLongitude(degree){
     if (USER_POSITION_FORMAT === DEGREES_POS_FORMAT)
       return degree;

     if (USER_POSITION_FORMAT === GEOCACHING_POS_FORMAT)
      return (degree>0? "E":"W") +" "+ this.userDegreeLikeGeocaching( Math.abs(degree) );

     return this.userDegree( Math.abs(degree) ) + (degree>0? "E":"W");
  }

  function userSmallDistance(distanceM, canNegative){
     if ((distanceM === null) || ((distanceM < 0) && (!canNegative)))
       return "?";

     if (USER_UNIT === IMPERIAL_UNITS){
       /* FIXME: I'am not sure that it is right */
       return (distanceM * 3.2808).toFixed(0)+" ft";
     }
     if (USER_UNIT === METRIC_UNITS){
       return (distanceM * 1.0).toFixed(0)+" m";
     }
     return distanceM+" m";
  }

  function userDistance (distanceM, canNegative){
    console.log("USER_UNIT = ", USER_UNIT);
    console.log("IMPERIAL_UNITS = ", IMPERIAL_UNITS);
    if ((distanceM === null) || ((distanceM < 0) && (!canNegative)))
      return "?";

    if (USER_UNIT === METRIC_UNITS){
      tmp = (distanceM / 1000);
      return (tmp >= 10? tmp.toFixed(0): tmp.toFixed(1))+" km";
    }
    if (USER_UNIT === IMPERIAL_UNITS){
      /* FIXME: I'am not sure that it is right */
      tmp = (distanceM / 1609.344);
      return (tmp >= 10? tmp.toFixed(0): tmp.toFixed(1))+" miles";
    }
    return distanceM+" m";
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

  _generate_x_axis = function(minTime, maxTime){
    console.log("minTime", minTime);
    console.log("maxTime", maxTime);
    var result = [];
    length = maxTime - minTime;
    console.log("length", length);
    align = 5*60*1000; // 5 minutes
    maxLines = 6;
    if (length / align > maxLines) {align =    10*60*1000;console.log("10 minutes");}
    if (length / align > maxLines) {align =    15*60*1000;console.log("15 minutes");}
    if (length / align > maxLines) {align =    30*60*1000;console.log("30 minutes");}
    if (length / align > maxLines) {align = 1* 60*60*1000;console.log("60 minutes");}
    console.log("align", align);

    dateobj = new Date(minTime);
    //~ startOfDay = Date.parse( dateobj.getFullYear() + '-' + dateobj.getMonth() + '-' + dateobj.getDate() + ' 0:00' );
    startOfDay = Date.parse(dateobj.getFullYear() + ' - ' + dateobj.getMonth() + ' - ' + dateobj.getDate());
    console.log("startOfDay", startOfDay);
    alignedStart = minTime + ( align - ((minTime - startOfDay) % align));
    console.log("alignedStart",alignedStart);
    var i = 0;
    var now = new Date();
    for (time = alignedStart; time < maxTime ; time += align){
      result[ i++ ] = {
        time : time,
        label : config.format_time(new Date( time + ( now.getTimezoneOffset()*-60*1000 ) ), true)
      };
    }
    console.log("result", result);
    return result;
  };
  _generate_y_axis = function(min, max, unitMultiply, unit){
    var result = [];
    range = max - min;
    align = 1 / unitMultiply;
    maxLines = 9;
    alignArr = new Array(2,5,10,20,25,50,100,150,200,250,500,1000);
    for ( var i = 0 ; (i < alignArr.length) && (range / align > maxLines) ; i++){
      align =  alignArr[i] / unitMultiply;
    }
    alignedStart = (min % align === 0)? min : min + ( align - (min % align));
    i = 0;
    for (val = alignedStart; val < max ; val += align){
      result[ i++ ] = {
        value : val,
        label : (val * unitMultiply).toFixed(0) // + unit
      };
    }
    return result;
  };
  _generate_alt_axis = function(min, max){
    unit = "m";
    unitMultiply = 1;

    if (this.units === IMPERIAL_UNITS){
      unitMultiply = 3.2808;
      unit = "ft";
    }
    return config.generate_x_axis(min, max, unitMultiply, unit);
  };

  _format_time = function(dateobj, shortFormat){
    strRes = "NA";
    secs = dateobj.getSeconds(); if (secs > 9) strSecs = String(secs); else strSecs = "0" + String(secs);
    mins = dateobj.getMinutes(); if (mins > 9) strMins = String(mins); else strMins = "0" + String(mins);
    hrs  = dateobj.getHours(); if (hrs > 9) strHrs = String(hrs); else strHrs = "0" + String(hrs);
    return shortFormat? (strHrs + ":" + strMins) : (strHrs + ":" + strMins + ":" + strSecs);
  };

  return {
    get: get,
    save: save,
    SCREEN_KEEP_ALIVE: SCREEN_KEEP_ALIVE,
    USER_UNIT: USER_UNIT,
    USER_POSITION_FORMAT: USER_POSITION_FORMAT,
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
// });