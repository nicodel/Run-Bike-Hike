if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}


function debugObj(obj) {
var output = 'debug:<br />';
  for(var index in obj) {
    var value = obj[index];
    output = output + index + '=' + value+'<br />';
  }
  return output;
}

function isUndefined(value) {
  return (typeof value === "undefined") ?true: false;
}


function padZero(n, width, z) {
  z = z || '0';
  n = n + '';
  width = width || 2;
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function printTime(timestamp) {
  var d = new Date();
  d.setTime(timestamp);
  var h = padZero(d.getHours());
  var m = padZero(d.getMinutes());
  var s = padZero(d.getSeconds());
  
  return h + ':' + m + ':' + s;
}

function printDateTime(timestamp) {
  var d = new Date();
  d.setTime(timestamp);
  return d.toString();
}

function getDirectionCompass(brng) {
  var bearings = ["NE", "E", "SE", "S", "SW", "W", "NW", "N"];

  var index = brng - 22.5;
  if (index < 0) index += 360;
  index = parseInt(index / 45);

  return(bearings[index]);
}

function percentOf(part,total,decimals) {
  total = total || 100;
  part = part || 0;
  decimals = parseInt(decimals) || 0;
  if (decimals <0) decimals = Math.abs(decimals);
  return parseFloat((part/total)*100).toFixed(decimals);
}


/*function aconvert2unit(value1,unitIndex,specUnit,unitPrint) {
  unitPrint = unitPrint || false;
  consConvert = specUnit[unitIndex];
  var output = value1 * consConvert;
  output = output.toFixed(0);
  if (unitPrint) output += ' ' + specUnit[unitIndex+2];
  return output;
}*/

function coords2Human(coords) {
  return coords.dir + ' ' + padZero(coords.deg) + 'º ' + padZero(coords.min) + "' " + padZero(coords.sec) + '"';
}
function convertDD2DMSDir(lat,lon) {
  var newCoord = {
"lat": {
    "dir": "",
    "deg": "",
    "min": "",
    "sec": ""
  },
"lon": {
    "dir": "",
    "deg": "",
    "min": "",
    "sec": ""
  }
  }
    
  // if lat is +, North. if is -, South.
  newCoord.lat.dir = lat > 0 ? 'N' : 'S';
   // if lng is +, East. if is -, West.
  newCoord.lon.dir = lon > 0 ? 'E' : 'W';
  
  //get degree
  newCoord.lat.deg = 0|(lat<0?lat=-lat:lat);
  newCoord.lat.min = 0|lat%1*60;
  newCoord.lat.sec = (0|lat*60%1*6000)/100;

  newCoord.lon.deg = 0|(lon<0?lon=-lon:lon);
  newCoord.lon.min = 0|lon%1*60;
  newCoord.lon.sec = (0|lon*60%1*6000)/100;  
  
  return newCoord;
}

function gpsClass() {
  var instance = this;
  this.appName = 'gps-test';
  var watchID = null;
  this.gpsOn = false;
  this.gpsEnabled = false;
  
  //events for fire
  this.onGPSReady = function() {};
  this.onGPSStart = function() {};
  this.onGPSUpdate = function() {};
  this.onGPSStop = function() {};
  this.onGPSError = function() {};
  
    
  //detect if device have GPS
  if ("geolocation" in navigator) this.gpsEnabled = true;
  
  
  this.checkGPS = function() {
    if (instance.gpsEnabled) {
      navigator.geolocation.getCurrentPosition(_testPosition,_handleErrorGPS,{enableHighAccuracy: true});
    } else {
      var error = []; error.code = 0; 
      _handleErrorGPS(error);
    }
  }
  
  //reconstruct variables from navigation.position.coords
  _constructPosition = function(position) {
    var newPosition = new Array;
    newPosition.timestamp = position.timestamp;
    newPosition.latitude = position.coords.latitude;
    newPosition.longitude = position.coords.longitude;
    newPosition.speed = position.coords.speed; //meters second
    newPosition.heading = position.coords.heading; //degree 360
    newPosition.altitude = position.coords.altitude; //meters
    newPosition.accuracy = position.coords.accuracy; //meters
    newPosition.altitudeAccuracy = position.coords.altitudeAccuracy; //meters
    
    //depending accuracy resolution
    newPosition.resolutionCoords = (newPosition.altitudeAccuracy < 50) ? '3D' : '2D';
    if (newPosition.altitude != 0) newPosition.resolutionCoords = '3D';
    
    //depending accuracy simulate signal GPS
    newPosition.gpsStrength = 0;
    if (newPosition.accuracy >= 150) newPosition.gpsStrength = 0;
    if (newPosition.accuracy < 150) newPosition.gpsStrength = 1;
    if (newPosition.accuracy < 100) newPosition.gpsStrength = 2;
    if (newPosition.accuracy < 40) newPosition.gpsStrength = 3;
    if (newPosition.accuracy < 15) newPosition.gpsStrength = 4;
    return newPosition;
  }

  //get first GPS position for determini if GPS is enabled and firef GPSReady event
  _testPosition = function(position) {

    //reconstruct variables GPS signal
    var newPosition = _constructPosition(position);

    //set GPS variable gpsOn
    instance.gpsOn = true;
    
    //fire event gpsReady
    instance.onGPSReady(newPosition);
  } 
  
  
  this.init = function() {
    //check GPS is on
    instance.checkGPS();
  }
  
  //method for start capture signal GPS
  this.start = function(force) {
    force = force || false;
    var options = {enableHighAccuracy: true}
    
    if ((instance.gpsOn) || (force)) {
      //if (force) alert('GPS escucha infinita!');
      watchID = navigator.geolocation.watchPosition(_reciveNewPositionGPS, _handleErrorGPS,options);
    } else {
      instance.checkGPS();
    }
    
    instance.onGPSStart();
  }
  
  //method for stop capture signal GPS
  this.stop = function() {
    navigator.geolocation.clearWatch(watchID);
    this.gpsOn = false;
    instance.onGPSStop();
  }

  //When arrive new GPS signal fire update event after reconstruct variables GPS
  _reciveNewPositionGPS = function(position) {
    
    //reconstruct variables
    var newPosition = _constructPosition(position);
    instance.onGPSUpdate(newPosition);
  }

  //detect if error is ocurred and fire event Error
  _handleErrorGPS = function(error) {
    var _error = [];
    _error.code = 0;
    _error.message = 'no found GPS in device';
    
    if (instance.gpsOn) {
      instance.gpsOn = false;
      //timeout error
      if (error.code == 3) {
        _error.code = 3;
        _error.message = 'GPS timeout';
      }
    } else {
      if (error.code == 1) {
        _error.code = 1;
        _error.message = 'no user permision';
      }
      if (error.code == 3) {
        _error.code = 2;
        _error.message = 'no GPS enabled';
      }
    }
    instance.stop();
    instance.onGPSError(_error);
  }
}

var unitSystem = ['international metric' , 3.6,1,'km','m','km/h']; //['international metric' , 3.6,1,'km','m','km/h'];['american metric' , 3.6,3.2808399,'miles','feet','mp/h'];

function drawValues(position) {
  
  $('#signalGPS').html(position.gpsStrength);
  $('#lastSignal').html(printTime(position.timestamp));
  //$('#iconSignal').attr('src','img/signal'+position.gpsStrength +'.png');
  //hud coordenates
  $('#coordResGPS').html(position.resolutionCoords);
  
  var metricEl = (position.accuracy * unitSystem[2]);
  $('#accuracyGPS').html(String.format('±{0}' + unitSystem[4],metricEl.toFixed(0)));
  
  metricEl = (position.altitude * unitSystem[2]);
  $('#altitudeGPS').html(String.format('{0}' + unitSystem[4],metricEl.toFixed(0)));
  
  var coords = convertDD2DMSDir(position.latitude,position.longitude);
  $('#latitudeGPS').html(coords2Human(coords.lat));
  $('#longitudeGPS').html(coords2Human(coords.lon));
  
  //hud direction and speed
  $('#headingGPS').html(padZero(position.heading.toFixed(0),3) + 'º ' + getDirectionCompass(position.heading.toFixed(0)));

  var speed = parseFloat(position.speed * unitSystem[1]); //convert to dependening unitsystem
  $('#speedGPS').html(speed.toFixed(0) + '<em>' + unitSystem[5] + '</em>');
}

function testTimeClass() {
  var instance = this;
  var idInterval = null;
  
  var testTimes = {
     "startTime": null,
     "endTime": null
   };
   var values = {}
  
  function padZero(n, width, z) {
    z = z || '0';
    n = n + '';
    width = width || 2;
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  } 
  
  
  this.onUpdateTime = function() {}
  
  this.init = function() {
    testTimes.startTime = new Date();
    instance.start();
  }
  
  this.start = function() {
    idInterval = setInterval(function() {instance.onUpdateTime()},1000);
  }
  this.stop = function() {
    clearInterval(idInterval);
  }
  
  this.currentTime = function() {
    var d = new Date();
    return d;
  }
  this.tickTime = function() {
    testTimes.endTime = new Date();
  }
  
  this.getTranscurredTime = function(time2,time1,output) {
    time1 = testTimes[time1] || testTimes.startTime;
    time2 = testTimes[time2] || new Date();
    output = output || 'time';
    
    var totalSeconds = Math.floor((time2 - time1)/1000);
    var seconds = Math.floor((time2 - time1)/1000);
    var minutes = Math.floor(seconds/60);
    var hours = Math.floor(minutes/60);
    var days = Math.floor(hours/24);

    hours = hours-(days*24);
    minutes = minutes-(days*24*60)-(hours*60);
    seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60); 
    if (output == 'time') {
      return padZero(hours) + ':' + padZero(minutes) + ':' + padZero(seconds);
    } else if (output == 's') {
      return totalSeconds;
    }
  }
  
  this.setTime = function(alias,time) {
    time = time || new Date();
    testTimes[alias] = time;
  }
  
  this.getTime = function(alias) {
    return testTimes[alias];
  }
  
  this.setVal = function(alias,val) {
    val = val || 0;
    values[alias] = val;
  }
  this.getVal = function(alias) {
    return  (values[alias]) ? values[alias] : 0;
  }
  this.addVal = function(alias) {
    var val = values[alias] || 0;
    values[alias] = val+1;
  }
}

$(document).ready(function() {
  $('#viewPort').css({ scale: '1.2', opacity: 0});
  //initiate app
  
  var trans = new translateObj({
    'defaultLang':'en',
    'autoDetect': true,
    'onTranslateEnd' : function() {
      $('#viewPort').transition({ scale: '1.2', opacity: 0}).transition({ scale: '1', opacity: 1});
    }
  });
  
  $('.simpleToast').css({
    position:'absolute',
    left: ($(window).width() - $('.simpleToast').width())/2
    //top: ($(window).height() - $('.simpleToast').height())/2
  });
  
  trans.initTranslate();
  
  var testTime = new testTimeClass();
  testTime.init();
  testTime.onUpdateTime = function() {
    $('#totalTranscurredTime').html(testTime.getTranscurredTime());
    var swap = 0;
    if (testTime.getTime('lastSignal')) {
      $('#lastAgoTimeSignal').html(testTime.getTranscurredTime(null,'lastSignal'));
      swap = parseInt(testTime.getTranscurredTime(null,'lastSignal','s'));
      testTime.addVal('count1');
      if (swap > 5) testTime.setVal('count1',0);
      //if (swap < 30) testTime.addVal('count1'); else testTime.setVal('count1',0);
    }
    if (testTime.getVal('count1')>50) $('#checkValidData').attr('class','').addClass('icon floatLeft checkOn'); else $('#checkValidData').attr('class','').addClass('icon floatLeft checkOff');
    $('#totalValidSignalsGPS').html('Datos GPS validos: ' + testTime.getVal('count1'));
    
    $('#percentValidSignalsGPS').html( percentOf(testTime.getVal('count1'),50)+'%');
  }

var gpsTest = new gpsClass();

  gpsTest.init();
  $('#statusGPS').html('buscando GPS...');
  gpsTest.start(true);
  $('.simpleToast').html('GPS en modo infinito').fadeIn(400).delay(3000).fadeOut(400);
  
  
  gpsTest.onGPSReady = function(position) {
    $('#statusGPS').html('Encontrado');
    //$('#output').html(debugObj(position));
    
    drawValues(position);//update draw values
    
    //start GPS listening signals
    //gpsTest.start(true); //Ya inicializado forzosamente
    
    //Primera señal GPS recibida
    testTime.setTime('firstGPS');
    $('#firstSignalGPS').html(testTime.getTranscurredTime('firstGPS'));
    
  }
  
  gpsTest.onGPSStart = function() {
    if (gpsTest.gpsOn) $('#btnStartCapture').removeClass('iconGPSoff').addClass('iconGPSon'); else $('#btnStartCapture').removeClass('iconGPSon').addClass('iconGPSoff');
  }
  
  gpsTest.onGPSStop = function() {
    $('#statusGPS').html('Desconectado');
    $('#iconSignal').attr('src','img/signal0.png');
    $('.simpleToast').html('Stop signal').fadeIn(400).delay(3000).fadeOut(400);
    $('#checReciveGPS').attr('class','').addClass('icon floatLeft checkOff');   
  }
  
  gpsTest.onGPSUpdate = function(position) {
    //$('#output').html(debugObj(position));
    //alert('in watcch GPS');
    $('#statusGPS').html('Conectado');
    $('#checReciveGPS').attr('class','').addClass('icon floatLeft checkOn');
    
    (position.gpsStrength > 2) ? $('#checkSignalLevel').attr('class','').addClass('icon floatLeft checkOn') : $('#checkSignalLevel').attr('class','').addClass('icon floatLeft checkOff');
    
    //update graph signal
    
    var i = 1;
    $('#graphSignalStrength').children('div').each(function () {
      $(this).removeClass('bar-on');
      if (i <= position.gpsStrength) $(this).addClass('bar-on');
      i++;
    });
    
    
    
    
    
    drawValues(position);//update draw values

    //set tick timer
    testTime.setTime('lastSignal');
  }
  
  gpsTest.onGPSError = function(error) {
  /*
  @error.code
  @error.message
  
  codes errors:
    0 no gps install on device
    1 no user permision
    2 no gps enabled, goto configuration a switch GPS on, or wait a some time for accuracy GPS, default timeout 10"
    3 GPS Timeout, out of range satelites, default timeout 30"
  */
    alert('fired ERROR(' + error.code + '): ' + error.message);
  }
  
  $('#btnShowExtraInfo').click(function(e) {
    e.preventDefault();
    $(this).hide();
    $('#extraInfo').fadeIn('slow');
  });
  
  /*App Menu options*/
  $('#btnBack').click(function(e) {
    e.preventDefault();
    $('#viewPort').transition({ scale: '1.25', opacity: 0}).delay(30).queue(function(){
      location.href = 'main.html';
    });
  });
});

(function($) {
  $(document).ready(function() {
    $.slidebars();
  });
}) (jQuery);

