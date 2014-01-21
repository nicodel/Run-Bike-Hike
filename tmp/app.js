
'use strict';

var utils = this.utils || {};

utils.status = (function() {

  // This constant is essential to resolve what is the path of the CSS file
  // that defines the animations
  //var FILE_NAME = 'status';

  // How many milliseconds is displayed the status component by default
  var DISPLAYED_TIME = 2000;

  // References to the DOMElement(s) that renders the status UI component
  var section, content;

  // The numerical ID of the timeout in order to hide UI component
  var timeoutID;

  /*
   * Clears the callback in charge of hiding the component after timeout
   */
  function clearHideTimeout() {
    if (timeoutID === null) {
      return;
    }

    window.clearTimeout(timeoutID);
    timeoutID = null;
  }

  /*
   * Shows the status component
   *
   * @param{Object} Message. It could be a string or a DOMFragment that
   *                represents the normal and strong strings
   *
   * @param{int} It defines the time that the status is displayed in ms. This
   *             parameter is optional
   *
   */
  function show(message, duration) {
    clearHideTimeout();
    content.innerHTML = '';

    if (typeof message === 'string') {
      content.textContent = message;
    } else {
      try {
        // Here we should have a DOMFragment
        content.appendChild(message);
      } catch(ex) {
        console.error('DOMException: ' + ex.message);
      }
    }

    section.classList.remove('hidden');
    section.classList.add('onviewport');
    timeoutID = window.setTimeout(hide, duration || DISPLAYED_TIME);
  }

  /*
   * This function is invoked when some animation is ended
   */
  function animationEnd(evt) {
    var eventName = 'status-showed';

    if (evt.animationName === 'hide') {
      clearHideTimeout();
      section.classList.add('hidden');
      eventName = 'status-hidden';
    }

    window.dispatchEvent(new CustomEvent(eventName));
  }

  /*
   * Hides the status component
   */
  function hide() {
    section.classList.remove('onviewport');
  }

  /*
   * Releases memory
   */
  function destroy() {
    section.removeEventListener('animationend', animationEnd);
    document.body.removeChild(section);
    clearHideTimeout();
    section = content = null;
  }

  /*function getPath() {
    var path = document.querySelector('[src*="' + FILE_NAME + '.js"]').src;
    return path.substring(0, path.lastIndexOf('/') + 1);
  }

  function addStylesheet() {
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = getPath() + 'status-behavior.css';
    document.head.appendChild(link);
  }*/

  function build() {
    section = document.createElement('section');

    //addStylesheet();

    section.setAttribute('role', 'status');
    section.classList.add('hidden');

    content = document.createElement('p');

    section.appendChild(content);
    document.body.appendChild(section);

    section.addEventListener('animationend', animationEnd);
  }

  /*
   * Initializes the library. Basically it creates the markup:
   *
   * <section role="status">
   *   <p>xxx</p>
   * </section>
   */
  function initialize() {
    if (section) {
      return;
    }

    build();
  }

  // Initializing the library
  if (document.readyState === 'complete') {
    initialize();
  } else {
    document.addEventListener('DOMContentLoaded', function loaded() {
      document.removeEventListener('DOMContentLoaded', loaded);
      initialize();
    });
  }

  return {
    /*
     * The library is auto-initialized but it is for unit testing purposes
     */
    init: initialize,

    /*
     * Shows the status component
     *
     * @param{Object} Message. It could be a string or a DOMFragment that
     *                represents the normal and strong strings
     *
     * @param{int} It defines the time that the status is displayed in ms
     *
     */
    show: show,

    /*
     * Hides the status component
     */
    hide: hide,

    /*
     * Releases memory
     */
    destroy: destroy,

    /*
     * Sets up the duration in milliseconds that a status is displayed
     *
     * @param{int} The time in milliseconds
     *
     */
    setDuration: function setDuration(time) {
      DISPLAYED_TIME = time || DISPLAYED_TIME;
    }
  };

})();

// define(["models/config"], function(Config) {
var HomeView = function() {

  function __hideSpinner(){
    document.getElementById("message-area").removeChild(document.getElementById("spinner"));
  }

  function updateInfos(inPosition){
    // hide spinner
    if (document.getElementById("spinner")) {
      __hideSpinner();
    };
    // display accuracy using settings unit
    document.getElementById("home-acc").innerHTML = "&#177;" + Config.userSmallDistance(inPosition.coords.accuracy);
    // checking accuracy and display appropriate GPS status
    if (inPosition.coords.accuracy > 30) {
      document.getElementById("home-acc").className = "align-right bold bad-signal";
      // document.getElementById("gps-status").setAttribute("src", "img/gps_red.png");
    } else {
      document.getElementById("home-acc").className = "align-right bold";
      // document.getElementById("gps-status").setAttribute("src", "img/gps_green.png");
    }
    // display latitude using Settings format
    document.getElementById("home-lat").innerHTML = Config.userLatitude(inPosition.coords.latitude);
    // display longitude using Settings format
    document.getElementById("home-lon").innerHTML = Config.userLongitude(inPosition.coords.longitude);
    // display altitude using Settings format
    document.getElementById("home-alt").innerHTML = Config.userSmallDistance(inPosition.coords.altitude)/* + "(&#177;" + Config.userSmallDistance(inPosition.coords.altitudeAccuracy) + ")"*/;
    // empty message area
    document.getElementById('msg').innerHTML = "";
    //display compass
    __displayCompass(inPosition.coords);
  }

  function updateSettings(inSettings) {
    document.querySelector("#screen-keep").checked = inSettings.screen;
    document.querySelector("#language").value = inSettings.language;
    document.querySelector("#distance").value = inSettings.distance;
    document.querySelector("#speed").value = inSettings.speed;
    document.querySelector("#position").value = inSettings.position;
  }

  function displayError(inError){
    console.log("error:", inError)
    document.getElementById('msg').innerHTML = "Error: " + inError.message;
    // hide spinner
    if (document.getElementById("spinner")) {
      __hideSpinner();
    };
  }

  function __displayCompass(event) {
    
    compass = document.getElementById("home-compass");
    //~ console.log("heading:", event.heading);
    if (event.heading > 0 ){
      /** in case, when GPS is disabled (only if GSM fix is available),
       * event.heading should be -1 and event.errorCode should be 4,
       * but it isn't... So we use this strange condition that don't
       * work if we go _directly_ to north...
       */
      opacity = 1; // 0.8
      compass.src = 'img/compass.png';
      var rot = 360 - event.heading.toFixed(0);
      compass.style.transform = "rotate(" + rot + "deg)";
      // compass.style.webkitTransform = "rotate(" + rot + "deg)";
    } else {
      compass.src = 'img/compass_inactive.png';
      opacity = 1; // 0.3
    }
    compass.style.opacity = opacity;
  }

  return {
    // hideSpinner: hideSpinner,
    updateInfos: updateInfos,
    updateSettings: updateSettings,
    displayError: displayError
  };

}();
// });

var InfosView = function() {
/*define(["controller",
        "models/config"
  ], function(Controller, Config) {*/

  var updateInfos = function(inPosition, inDistance) {

    console.log("showing: ", inDistance);

    // checking accuracy and display appropriate GPS status
    // if (inPosition.coords.accuracy > 30) {
    //   document.getElementById("gps-status").setAttribute("src", "img/gps_red.png");
    // } else {
    //   document.getElementById("gps-status").setAttribute("src", "img/gps_green.png");
    // }
    // updating distance using Settings choosen unit
    document.getElementById("infos-dist").innerHTML = Config.userDistance(inDistance);
    // updating speed using Settings choosen unit
    document.getElementById("infos-speed").innerHTML = Config.userSpeed(inPosition.coords.speed);
    // updating altitude using Settings choosen unit
    document.getElementById("infos-alt").innerHTML = Config.userSmallDistance(inPosition.coords.altitude);
    // updating accuracy using settings units
    document.getElementById("infos-acc").innerHTML = "&#177;" + Config.userSmallDistance(inPosition.coords.accuracy);
    // checking accuracy and display appropriate GPS status
    if (inPosition.coords.accuracy > 30) {
      document.getElementById("infos-acc").className = "align-right bold bad-signal";
    } else {
      document.getElementById("infos-acc").className = "align-right bold";
    }
    // update compass direction
    __displayCompass(inPosition.coords);

  }

  var __displayCompass = function(event) {
    
    compass = document.getElementById("infos-compass");
    //~ console.log("heading:", event.heading);
    if (event.heading > 0 ){
      /** in case, when GPS is disabled (only if GSM fix is available),
       * event.heading should be -1 and event.errorCode should be 4,
       * but it isn't... So we use this strange condition that don't
       * work if we go _directly_ to north...
       */
      opacity = 1; // 0.8
      compass.src = 'img/compass.png';
      var rot = 360 - event.heading.toFixed(0);
      compass.style.transform = "rotate(" + rot + "deg)";
      // compass.style.webkitTransform = "rotate(" + rot + "deg)";
    } else {
      compass.src = 'img/compass_inactive.png';
      opacity = 1; // 0.3
    }
    compass.style.opacity = opacity;
  }
  /*
  var cent=0;
  var sec=0;
  var min = 0;
  var compte;

  var startChrono = function() {
    cent++;
    if (cent > 9) {cent = 0;sec++;}
    if (sec > 59) {sec = 0;min++;}

    if (sec < 10) {document.getElementById('trk-sec').innerHTML = '0' + sec;}
    else {document.getElementById('trk-sec').innerHTML = sec;}

    if (min < 10)
      {document.getElementById('trk-min').innerHTML = '0' + min;}
    else
      {document.getElementById('trk-min').innerHTML = min;}
    compte = window.setTimeout(startChrono, 100);
  }

  var stopChrono = function() {
    window.clearTimeout(compte);
    cent = 0;
    sec = 0;
    min = 0;
    // document.getElementById('dur-min').innerHTML = min;
    // document.getElementById('dur-sec').innerHTML = sec;
  }*/



  return {
    /*startChrono: startChrono,
    stopChrono:stopChrono,*/
    updateInfos: updateInfos
    // backHome: backHome
  }

}();
// });
var SettingsView = function() {




}();
var TracksView = function() {

  function display(inTracks) {
    // __remove_childs("tracks-list");
    var list = document.getElementById("tracks-list");
    // console.log("list.childNodes",list.childNodes);
    for (i = 0; i = list.childNodes.length - 1; i++) {
      if (list.childNodes[i]) {
        if (list.childNodes[i].className === "it-track") {
          console.log("cleaning element " + i + " " + list.childNodes[i]);
          list.removeChild(list.childNodes[i]);
        } else {
          console.log("element " + i + " " + list.childNodes[i]);
        };
      };
      // console.log("remove element " + i + " " + list.childNodes[i].textContent);
      // document.getElementById("tracks-list").removeChild(d.childNodes[i]);
    }

    if (inTracks.length === 0) {
      __showEmpty();
    } else{
      var tracks = [];
      tracks = inTracks;
      for (var i = tracks.length - 1; i >= 0; i--) {
        __buildList(tracks[i]);
      }
    };
  }

  function reset() {
    __remove_childs("tracks-list");
  }

  function __showEmpty() {
    var el = document.createElement("p");
    el.className = "empty-tracks";
    el.innerHTML = "Empty tracks list."
    document.getElementById("tracks-list").appendChild(el);
  }

  function __buildList(inTrack) {
    // console.log("__buildList - inTrack: ", inTrack);
    var li = document.createElement("li");
    li.className = "it-track";
    var lia = document.createElement("a");
    // lia.className = "it-track";

    var div = '<p><span class="align-left bold clipped">' + inTrack.name + '</span>';
    div = div + '<span class="align-right">' + Config.userDate(inTrack.date) + '</span></p>';
    div = div + '<p class="new-line"><span class="align-left">' + Config.userDistance(inTrack.distance) + '</span>';
    var d = inTrack.duration / 60000;
    div = div + '<span class="align-right">' + d.toFixed() + 'min</span></p>';
    lia.innerHTML = div;
    li.appendChild(lia);
    document.getElementById("tracks-list").appendChild(li);
    lia.addEventListener("click", function(e){
      // console.log("click: track " + inTrack + "will be displayed");
      document.querySelector("#trackView").classList.remove("move-right");
      document.querySelector("#trackView").classList.add("move-center");
      Controller.displayTrack(inTrack);
    });
  }

  function __remove_childs(parent) {
    var d = document.getElementById(parent).childNodes;
    console.log("d",d);
    for (i = 0; i <= d.length; i++) {
      document.getElementById(parent).removeChild(d[i]);
      console.log("remove element " + i + " " + d[i]);
    }
  }

  return {
    display: display,
    reset: reset
  };

}();
var TrackView = function() {

  var SCREEN_WIDTH = parseInt(window.innerWidth * 0.9,10);
  var SCREEN_HEIGHT = parseInt(SCREEN_WIDTH * 2 / 3,10);
  // console.log("width", SCREEN_WIDTH);
  // console.log("height", SCREEN_HEIGHT);
  var xPadding = 30;
  var yPadding = 30;

  var SPACE_BTW_POINTS = 5;
  var LINE_WIDTH = 2;
  var TEXT_STYLE = "8pt 'MozTTLight', 'Helvetica Neue','Nimbus Sans L',Arial,sans-serif";
  var TEXT_COLOR = "#333";
  var VALUE_COLOR = "#008000";
  var ACCURACY_COLOR = "#805A5A";
  var ACCURACY_FILL_COLOR = "#C89696";

  function display(inTrack) {
    //reset old ressources
    document.getElementById("trk-date").innerHTML = "";
    document.getElementById("trk-dist").innerHTML = "";
    document.getElementById("trk-dur").innerHTML = "";
    document.getElementById("map-img").src = "";

    var tr = document.getElementById("tr-name");
    tr.innerHTML = inTrack.name;
    // console.log("show track: ", inTrack);

    document.getElementById("trk-date").innerHTML = Config.userDate(inTrack.date);
    document.getElementById("trk-dist").innerHTML = Config.userDistance(inTrack.distance);
    var d = inTrack.duration / 60000;
    document.getElementById("trk-dur").innerHTML = d.toFixed() +" min";
    
    var t = inTrack;
    t.min_alt = 0;
    t.max_alt = 0;
    t.max_speed = 0;
    t.min_speed = 0;
    t.start = null;
    t.end = null;

    //~ get min, max altitude, max speed, start and end time
    for (i=0; i<inTrack.data.length; i++) {
      var row = inTrack.data[i];
      var alt_int = parseInt(row.altitude, 10);
      var speed_int = parseInt(row.speed, 10);
      // console.log("speed_int ", speed_int);
      // console.log("t.max_speed ", t.max_speed);
      if (t.min_alt === 0 || alt_int < t.min_alt) {
        t.min_alt = alt_int;
      }
      if (t.max_alt === 0 || alt_int > t.max_alt) {
        t.max_alt = alt_int;
      }
      if (t.max_speed === 0 || speed_int > t.max_speed) {
        t.max_speed = speed_int;
      }
      if (t.min_speed === 0 || speed_int < t.min_speed) {
        t.min_speed = speed_int;
      }
      var dt = new Date(inTrack.data[i].date).getTime();
      // console.log("dt ", dt);
      if (t.start === null || dt < t.start) {
        t.start = dt;
      }
      if (t.end === null || dt > t.end) {
        t.end = dt;
      }
    }
    // console.log("t.max_speed",Config.userSpeed(t.max_speed));
    document.getElementById("trk-max-speed").innerHTML = Config.userSpeed(t.max_speed);
    document.getElementById("trk-max-alt").innerHTML = Config.userSmallDistance(t.max_alt);
    document.getElementById("trk-min-alt").innerHTML = Config.userSmallDistance(t.min_alt);



    // console.log("t.start", t.start);
    // console.log("t.end", t.end);
    __buildAltitudeGraph(t);
    __buildSpeedGraph(t);
    __buildMap2(inTrack);
  }

  function __buildAltitudeGraph(inData) {
    data = inData.data;
    // console.log("data.length", data.length);
    // console.log("data", data);

    // calculate the axis values in order to draw the canvas graph
    // max_y: represents the highest altitude value
    // min_y: represents the smallest altitude value
    // max_acc: represents the poorest accuracy on altitude
    var max_acc = 0;
    var max_y = 0;
    var min_y = 0;
    for(i=0;i<data.length;i++) {
      if(parseInt(data[i].altitude, 10) > max_y) {
        max_y = parseInt(data[i].altitude, 10);
      }
      if(parseInt(data[i].altitude, 10) < min_y) {
        min_y = parseInt(data[i].altitude, 10);
      }
      if(parseInt(data[i].vertAccuracy, 10) > max_acc) {
        max_acc = parseInt(data[i].vertAccuracy, 10);
      }
      // console.log("data[i].vertAccuracy", data[i].vertAccuracy);
      max_acc = max_acc / 2;
    }
    
    // Write Y Axis text
    var range = max_y - min_y;
    range = range + (range / 3);
    // calculate
    var yspace = parseInt(range / 4, 10);
    var c = __createRectCanvas("alt-canvas", range, yspace);
    
    var espace = parseInt(data.length / (SCREEN_WIDTH - xPadding), 10);
    if (espace === 0) {
      espace = 1;
    } else {
      espace = espace * SPACE_BTW_POINTS; // increase spacing between points so that the chart looks smoother.
    };
    // console.log("espace", espace);

    // Draw vertAccuracy lines
    c.strokeStyle = ACCURACY_COLOR;
    c.fillStyle = ACCURACY_FILL_COLOR;
    c.lineWidth = LINE_WIDTH;
    c.beginPath();
    //~ var z = parseInt(getXPixel(data[0].altitude) - parseInt(data[0].vertAccuracy));
    var alt0 = parseInt(data[0].altitude, 10);
    var acc0 = parseInt(data[0].vertAccuracy, 10);
    var y1 = alt0 - acc0;
    var y2 = alt0 + acc0;
    if(y1<0) {y1=0;} // we don't want the lines to go under 0

    for(i = 1 ; i<data.length ; i += espace) {
      var value = parseInt(data[i].altitude, 10) + parseInt(data[i].vertAccuracy, 10);
      if (i === 1) {
        c.moveTo(__getXPixel(i,data), __getYPixel(value, range));
      } else {
        c.lineTo(__getXPixel(i,data), __getYPixel(value, range));
      }
    };
    for(i = data.length - 1 ; i >= 1 ; i = i - espace) {
      var value = parseInt(data[i].altitude, 10) - parseInt(data[i].vertAccuracy, 10);
      if (value < 0) {value = 0;}
      if (i === 1) {
        var value = parseInt(data[i].altitude, 10) + parseInt(data[i].vertAccuracy, 10);
        c.lineTo(__getXPixel(i,data), __getYPixel(value, range));
      } else {
        c.lineTo(__getXPixel(i,data), __getYPixel(value, range));
      }
    }
    c.fill();
    c.stroke();
    
    // Draw Altitude points
    c.strokeStyle = VALUE_COLOR;
    c.lineWidth = LINE_WIDTH;
    c.beginPath();
    c.moveTo(__getXPixel(0,data), __getYPixel(data[0].altitude, range));
    for(i=1;i<data.length;i+=espace) {
      c.lineTo(__getXPixel(i,data), __getYPixel(data[i].altitude, range));
    }
    c.stroke();

    c.lineWidth = 1;
    c.fillStyle = TEXT_COLOR;
    c.font = TEXT_STYLE;
    c.textAlign = "center";
    
    // Write X Axis text and lines
    var xspace = data.length / 5;
    // console.log("xspace",xspace);
    for (i=0;i<data.length;i+=xspace) {
      i = parseInt(i,10);
      //~ console.log("i",i);
      var date = new Date(data[i].date).getHours() + ":" + new Date(data[i].date).getMinutes();
      c.fillText(date, __getXPixel(i,data), SCREEN_HEIGHT - yPadding + 20);
      // draw vertical lines
      c.beginPath();
      c.strokeStyle  = "rgba(150,150,150, 0.5)";
      c.lineWidth = 1;
      c.moveTo(__getXPixel(i,data),0);
      c.lineTo(__getXPixel(i,data),SCREEN_HEIGHT - xPadding);
      c.stroke();
    }

    c.stroke();
    c.closePath();
  }

  function __buildSpeedGraph(inData) {
    data = inData.data;

    var max_y = Config.userSpeedInteger(inData.max_speed);
    var min_y = Config.userSpeedInteger(inData.min_speed);
    // console.log("max_y", max_y);
    // console.log("min_y",min_y);
    
    // Write Y Axis text
    var range = max_y - min_y;
    range = range + (range * 0.2);
    var yspace = parseInt(range / 4, 10);
    // console.log("range ", range);
    var c = __createRectCanvas("speed-canvas", range, yspace);
    
    var espace = parseInt(data.length / (SCREEN_WIDTH - xPadding), 10);
    if (espace === 0) {
      espace = 1;
    } else {
      espace = espace * SPACE_BTW_POINTS; // increase spacing between points so that the chart looks smoother.
    };
    // Draw line
    // c.strokeStyle = "#0560A6";
    c.strokeStyle = VALUE_COLOR;
    c.lineWidth = LINE_WIDTH;
    c.beginPath();
    var value = Config.userSpeedInteger(data[0].speed);
    c.moveTo(__getXPixel(0,data), __getYPixel(value, range));
    for(i=1;i<data.length;i+=espace) {
      var value = Config.userSpeedInteger(data[i].speed);
      c.lineTo(__getXPixel(i,data), __getYPixel(value, range));
      c.stroke();
    }

    c.lineWidth = 1;
    c.fillStyle = TEXT_COLOR;
    c.font = TEXT_STYLE;
    c.textAlign = "center";
    
    // Write X Axis text and lines
    var xspace = data.length / 5;
    //~ console.log("xspace",xspace);
    for (i=0;i<data.length;i+=xspace) {
      i = parseInt(i,10);
      //~ console.log("i",i);
      var date = new Date(data[i].date).getHours() + ":" + new Date(data[i].date).getMinutes();
      c.fillText(date, __getXPixel(i,data), SCREEN_HEIGHT - yPadding + 20);
      c.beginPath();
      c.strokeStyle  = "rgba(150,150,150, 0.5)";
      c.lineWidth = 1;
      c.moveTo(__getXPixel(i,data),0);
      c.lineTo(__getXPixel(i,data),SCREEN_HEIGHT - xPadding);
      c.stroke();
    }
    c.stroke();
    c.closePath();
  }

  function __buildMap2(inTrack) {
    /*
     * http://pafciu17.dev.openstreetmap.org/
     */

    // get the min and max longitude/ latitude
    // and build the path
    var minLat, minLon, maxLat, maxLon;
    for (i = 0; i< inTrack.data.length; i++){
      var point = {
        lat: inTrack.data[i].latitude / 1,
        lon: inTrack.data[i].longitude / 1
        };
      if (minLat === undefined || minLat > point.lat) {
        minLat = point.lat;
      };
      if (maxLat === undefined || maxLat < point.lat) {
        maxLat = point.lat;
      };
      if (minLon === undefined || minLon > point.lon) {
        minLon = point.lon;
      };
      if (maxLon === undefined || maxLon < point.lon) {
        maxLon = point.lon;
      };
    };
    // console.log("minLat, minLon, maxLat, maxLon", minLat + ","+ minLon + ","+ maxLat + ","+ maxLon);
    // Calculate the Bouncing Box
    var p1 = {lon: minLon, lat: maxLat};
    var p2 = {lon: maxLon, lat: minLat};
    var realHeight = __getDistance(p1.lat, p1.lon, p2.lat, p1.lon);
    var realWidth = __getDistance(p1.lat, p1.lon, p1.lat, p2.lon);
    var larger = realWidth > realHeight ? realWidth : realHeight;
    // we limit the number of points on the map to 200
    if (larger < 200) {
      larger = 200;
    };
    // console.log("1- realHeight, realWidth, larger", realHeight + ","+ realWidth + ","+ larger);
    // add some borders
    p1 = __movePoint(p1, larger * -0.1, larger * -0.1);
    p2 = __movePoint(p2, larger * 0.1, larger * 0.1);
    // console.log("1- p1.lat, p1.lon, p2.lat, p2.lon", p1.lat + ","+ p1.lon + ","+ p2.lat + ","+ p2.lon);
    // make map width always larger
    if (realWidth < realHeight) {
      p1 = __movePoint(p1, (realHeight - realWidth) / -2, 0);
      p2 = __movePoint(p2, (realHeight - realWidth) / +2, 0);
      realHeight = __getDistance(p1.lat, p1.lon, p2.lat, p1.lon);
      realWidth = __getDistance(p1.lat, p1.lon, p1.lat, p2.lon);
      larger = realWidth > realHeight ? realWidth : realHeight;
      // console.log("2- realHeight, realWidth, larger", realHeight + ","+ realWidth + ","+ larger);
      // console.log("2- p1.lat, p1.lon, p2.lat, p2.lon", p1.lat + ","+ p1.lon + ","+ p2.lat + ","+ p2.lon);
    };
    if (larger === 0) {
      return;
    };

    var MAX_POINTS = 100;
    var paths = "&paths=";
    var j = 0;
    if (inTrack.data.length > MAX_POINTS) {
      var y = parseInt(inTrack.data.length / MAX_POINTS, 10);
      console.log("y: ", y);
      if (y * inTrack.data.length > MAX_POINTS) {
        y = y + 1;
      };
    } else {
      var y = 1;
    };
    // console.log("y ", y);
    for (var i = 0; i < inTrack.data.length; i = i + y) {
      if (i === inTrack.data.length - 1) {
        paths = paths + inTrack.data[i].longitude + "," + inTrack.data[i].latitude;
      } else {
        paths = paths + inTrack.data[i].longitude + "," + inTrack.data[i].latitude + ",";
      }
      j++
    };
    // console.log("j ", j);
    var magic = 0.00017820;
    var scale = Math.round(larger / (magic * SCREEN_WIDTH));
    scale = "&scale=" + scale;
    var base_url = "http://dev.openstreetmap.org/~pafciu17/?module=map"
    // var base_url = "http://tile.openstreetmap.org/cgi-bin/export?"
    var bbox = "&bbox=" + p1.lon + ","+ p1.lat + ","+ p2.lon + "," + p2.lat;
    var width = "&width=" + SCREEN_WIDTH;
    var thickness = ',thickness:3';
    var BLUE = "0:0:255"
    var GREEN = "0:255:0"
    var color = ",color:" + BLUE;
    var loc = base_url + bbox + width + paths + thickness + color;
    // var loc = base_url + bbox + scale + "&format=jpeg";
    // var center = __getCenter(inTrack);
    // var j = 0;
    // var MAX = parseInt(inTrack.data.length / 14, 10);
    // console.log("MAX", MAX);
    // var dw = "&paths=";
    // for (i = 0; i< inTrack.data.length; i = i + MAX) {
    //   if (i === 0) {
    //     lt = inTrack.data[i].latitude + ",";
    //   } else{
    //     lt = "," + inTrack.data[i].latitude + ",";
    //   };
    //   ln = inTrack.data[i].longitude;
    //   dw = dw + lt + ln;
    //   j++;
    // }
    // console.log("dw", dw);

    // var loc = "http://dev.openstreetmap.org/~pafciu17/?module=map&lon=" + center.lon + "&lat=" + center.lat + "&zoom=8&width=" + SCREEN_WIDTH + "&height=" + SCREEN_HEIGHT + dw;
    document.getElementById("map-img").width = SCREEN_WIDTH;
    document.getElementById("map-img").onload = function () {
      document.querySelector("#map-img").classList.remove("hidden");
      document.querySelector("#map-img").classList.remove("absolute");
      document.querySelector("#infos-spinner").classList.add("hidden");
      document.querySelector("#infos-spinner").classList.add("absolute");

    };
    document.getElementById("map-img").src = loc;
    // console.log("loc:", loc);
  }

  function __buildMap(inTrack) {
    // var lat = inTrack.data[0].latitude;
    // var lon = inTrack.data[0].longitude;

    var center = __getCenter(inTrack);
    var j = 0;
    var MAX = parseInt(inTrack.data.length / 14, 10);
    // console.log("MAX", MAX);
    var dw = "&d0_colour=00F";
    for (i = 0; i< inTrack.data.length; i = i + MAX) {
      lt = "&d0p"+ j + "lat=" + inTrack.data[i].latitude;
      ln = "&d0p"+ j + "lon=" + inTrack.data[i].longitude;
      dw = dw + ln + lt;
      j++;
    }
    // loc = "http://ojw.dev.openstreetmap.org/StaticMap/?lat="+ lat +"&lon="+ lon +"&mlat0="+ lat +"&mlon0="+ lon + dw + "&z=15&mode=Export&show=1";
    loc = "http://ojw.dev.openstreetmap.org/StaticMap/?lat="+ center.lat +"&lon="+ center.lon + dw + "&z=10&mode=Export&show=1";
    document.getElementById("map-img").onload = alert("removing infos spinner");
    document.getElementById("map-img").width = SCREEN_WIDTH;
    document.getElementById("map-img").src = loc;
    // console.log("loc:", loc);
  }

  function __createRectCanvas(inElementId, inRange, inSpace) {
    var graph = document.getElementById(inElementId);
    var c = graph.getContext("2d");
    c.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    graph.setAttribute("width",SCREEN_WIDTH);
    graph.setAttribute("height",SCREEN_HEIGHT);

    c.fillStyle = TEXT_COLOR;
    c.font = TEXT_STYLE;
    c.textAlign = "right";
    c.textBaseline = "middle";
    var j = 0;
    var i = 0;
    for (t=0;t<4;t++) {
      c.fillText(parseInt(i,10), xPadding - 10, __getYPixel(j, inRange));
      c.beginPath();
      c.moveTo(xPadding, __getYPixel(j, inRange));
      c.lineTo(SCREEN_WIDTH, __getYPixel(j, inRange));
      c.stroke();
      j += inSpace;
      i += inSpace;
    }
    c.beginPath();
    c.moveTo(xPadding, 0);
    c.lineTo(xPadding, SCREEN_HEIGHT - yPadding);
    c.lineTo(SCREEN_WIDTH, SCREEN_HEIGHT - yPadding);
    c.stroke();

    return c;
  }
  function __getXPixel(val,data) {
    return ((SCREEN_WIDTH - xPadding) / data.length) * val + xPadding;
  }
  function __getYPixel(val,range) {
    return SCREEN_HEIGHT - (((SCREEN_HEIGHT - yPadding) / range) * val) - yPadding;
  }
  function __getCenter(inTrack) {
    var x = 0;
    var y = 0;
    var z = 0;
    // Convert lat/lon (must be in radians) to Cartesian coordinates for each location
    for (var i = 0; i < inTrack.data.length; i++) {
      //convert to from decimal degrees to radians
      var lat = parseInt(inTrack.data[i].latitude) * Math.PI / 180;
      var lon = parseInt(inTrack.data[i].longitude) * Math.PI / 180;
      var X = Math.cos(lat) * Math.cos(lon);
      var Y = Math.cos(lat) * Math.sin(lon);
      var Z = Math.sin(lat);
      x = x + X;
      y = y + Y;
      z = z + Z;
    };
    // Compute average x, y and z coordinates
    x = x / inTrack.data.length;
    y = y / inTrack.data.length;
    z = z / inTrack.data.length;
    // Convert average x, y, z coordinate to latitude and longitude
    var clon = Math.atan2(y, x);
    var hyp = Math.sqrt(x * x + y * y);
    var clat = Math.atan2(z, hyp);
    // convert from radians to decimal degrees
    // console.log("clat, clon", clat + " " + clon);
    clat = clat * 180 / Math.PI;
    clon = clon * 180 / Math.PI;
    // console.log("clat, clon", clat + " " + clon);
    return {lat: clat, lon: clon};
  }
  function __getDistance (lat1, lon1, lat2, lon2) {
    var radius = 6371 * 1000; // Earth radius (mean) in metres {6371, 6367}
    
    var lat1Rad = lat1*( Math.PI / 180);
    var lon1Rad = lon1*( Math.PI / 180);
    var lat2Rad = lat2*( Math.PI / 180);
    var lon2Rad = lon2*( Math.PI / 180);
    
    var dLat = lat2Rad - lat1Rad;
    var dLon = lon2Rad - lon1Rad;

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return radius * c;
  }

  function __movePoint(p, horizontal, vertical) {
    var radius = 6371 * 1000; // Earth radius (mean) in metres {6371, 6367}
    
    var latRad = p.lat*( Math.PI / 180);
    var lonRad = p.lon*( Math.PI / 180);

    var latCircleR = Math.sin( Math.PI/2 - latRad) * radius;
    var horizRad = latCircleR == 0? 0: horizontal / latCircleR;
    var vertRad = vertical / radius;
    
    latRad -= vertRad;
    lonRad += horizRad;
    
    return {
      lat : (latRad / (Math.PI / 180)),
      lon : (lonRad / (Math.PI / 180))
    };
  }

  return {
    display: display
  };

}();
/* chrono.js
 * Role : simule un chronometre et affiche le temps ecoule
 * Projet : JsLib
 * Auteur : Etienne CHEVILLARD (echevillard@users.sourceforge.net)
 * Version : 1.4
 * Creation : 25/04/2001
 * Mise a jour : 12/12/2007
 * Updated to a module by Nicolas Delebecque on November 2013
 */

var Chrono = function() {
	// --- Variables globales ---

	// variables pour la gestion du chronometre
	var chrono_demarre=false;
	var chrono_ecoule=0;
	var chrono_depart=0;
	var chrono_dernier=0;

	// variables pour la mise a jour dynamique
	var chrono_champ;
	var chrono_timeout;

	// --- Fonctions ---

	// indique si le chronometre est demarre ou non
	function actifChrono() {
		return (chrono_demarre);
	} // fin actifChrono()

	// arrete le chronometre
	function arreterChrono() {
		if (chrono_demarre) {
			chrono_dernier=(new Date()).getTime();
			chrono_ecoule+=(chrono_dernier-chrono_depart);
			chrono_demarre=false;
		}
		RAZChrono();
		return true;
	} // fin arreterChrono()

	// active la mise a jour dynamique du temps mesure pour le champ specifie
	function chargerChronoDyna(champ) {
		if (champ)
			chrono_champ=eval(champ);
		// chrono_champ.value=tempsChrono();
		// console.log("chrono_champ: ", chrono_champ);
		chrono_champ.innerHTML = tempsChrono();
		// chrono_timeout=window.setTimeout("chargerChronoDyna()", 10);
		chrono_timeout=window.setTimeout(chargerChronoDyna, 10);
		return true;
	} // fin chargerChronoDyna(champ)

	// desactive la mise a jour dynamique du temps mesure precedemment activee
	function dechargerChronoDyna() {
		window.clearTimeout(chrono_timeout);
		return true;
	} // fin dechargerChronoDyna()

	// demarre le chronometre
	function demarrerChrono() {
		console.log("demarrerChrono;");
		if (!chrono_demarre) {
			chrono_depart=(new Date()).getTime();
			chrono_demarre=true;
			console.log("chrono_demarre: ", chrono_demarre);
		}
		return true;
	} // fin demarrerChrono()

	// remet a zero le chronometre si celui-ci est arrete
	function RAZChrono() {
		if (!chrono_demarre) {
			chrono_ecoule=0;
			chrono_depart=0;
			chrono_dernier=0;
		}
		return true;
	} // fin RAZChrono()

	// retourne le temps mesure par le chronometre au format HH:MM:SS:CC
	function tempsChrono() {
		var cnow;
		if (chrono_demarre) {
			chrono_dernier=(new Date()).getTime();
			cnow=new Date(chrono_ecoule+(chrono_dernier-chrono_depart));
		} else {
			cnow=new Date(chrono_ecoule);
		}
		var ch=parseInt(cnow.getHours()) - 1;
		var cm=cnow.getMinutes();
		var cs=cnow.getSeconds();
		// var cc=parseInt(cnow.getMilliseconds()/10);
		// if (cc<10) cc="0"+cc;
		if (cs<10) cs="0"+cs;
		if (cm<10) cm="0"+cm;
		// return (ch+":"+cm+":"+cs+":"+cc);
		return (ch+":"+cm+":"+cs);
	} // fin tempsChrono()

	return {
		start: demarrerChrono,
		stop: arreterChrono,
		reset: RAZChrono,
		load: chargerChronoDyna
	};

}();
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
// define(["controller"], function(Controller){
var DB = function() {
  window.indexedDB = window.shimIndexedDB  && window.shimIndexedDB.__useShim();

  var DB_NAME = "RunBikeHike";
  var DB_VERSION = 1; // Use a long long for this value (don't use a float)
  var DB_STORE_TRACKS = "tracks";
  var DB_STORE_SETTINGS = "settings";

  var DEFAULT_CONFIG = [
    {"key":"screen", "value":false},
    {"key":"language", "value":"en"},
    {"key":"distance", "value":"0"},
    {"key":"speed", "value":"0"},
    {"key":"position", "value":"0"}
  ];

  function initiate(successCallback, errorCallback) {
    if (typeof(successCallback) === "function") {
      // DB.reset_app(DB_NAME);
      var req = window.indexedDB.open(DB_NAME, DB_VERSION);
      req.onsuccess = function(e) {
        // console.log("DB created successfully: ", req.result);
        db = req.result;
        successCallback(req.result);
        db.onabort = function(e) {
          db.close();
          db = null;
        };
      };
      req.onerror = function(e) {
        console.error("error on initiate DB: ", e.target.error.name);
        errorCallback(e.target.error.name);
        g_error = true;
      };
      req.onupgradeneeded = function(event) {
        //
        // Create tracks store as:
        // 
        var store = req.result.createObjectStore(DB_STORE_TRACKS, {keyPath:"id", autoIncrement: true});
        store.createIndex("trackid", "trackid", {unique: true});

        //
        // Create settings store as:
        //
        // var store =  req.result.createObjectStore(DB_STORE_SETTINGS, {keyPath:"id", autoIncrement: false});
        var store = req.result.createObjectStore(DB_STORE_SETTINGS, {keyPath: "key"});
        store.createIndex("key", "key", {unique: true});
        store.createIndex("value", "value", {unique: false});
/*        store.createIndex("language", "language", {unique: true});
        store.createIndex("distance", "distance", {unique: true});
        store.createIndex("speed", "speed", {unique: true});
        store.createIndex("position", "position", {unique: true});*/
      };
    } else  {
      errorCallback("initiate successCallback should be a function");
    }
  }

  function addTrack(successCallback, errorCallback, inTrack) {
    if (typeof successCallback === "function") {

      var tx = db.transaction(DB_STORE_TRACKS, "readwrite");
      tx.oncomplete = function(e) {
        console.log("add_track transaction completed !");
      };
      tx.onerror = function(e) {
        console.error("add_track transaction error: ", tx.error.name);
        errorCallback(x.error.name);
      };
      var store = tx.objectStore(DB_STORE_TRACKS);
      var req = store.add(inTrack);
      req.onsuccess = function(e) {
        console.log("track_add store store.add successful");
        successCallback(inTrack.name);
        // ??? going back to home ???
        // ui.back_home();
      };
      req.onerror = function(e) {
        console.error("track_add store store.add error: ", req.error.name);
        errorCallback(req.error.name);
      };
    } else  {
      errorCallback("addTrack successCallback should be a function");
    }
  }

  function getTracks(successCallback, errorCallback) {
    if (typeof successCallback === "function") {
      var all_tracks = [];
      var tx = db.transaction("tracks");
      var store = tx.objectStore("tracks");
      var req = store.openCursor();
      req.onsuccess = function(e) {
        var cursor = e.target.result;
        //~ console.log("get_tracks store.openCursor successful !", cursor);
        if (cursor) {
          all_tracks.push(cursor.value);
          // ui.build_track(cursor.value);
          cursor.continue();
        } else{
          // console.log("got all tracks: ", all_tracks);
          successCallback(all_tracks);
        }
      };
      req.onerror = function(e) {console.error("get_tracks store.openCursor error: ", e.error.name);};
    } else {
      errorCallback("getTracks successCallback should be a function");
    }
  }

  function reset_app() {
    var req = window.indexedDB.deleteDatabase(DB_NAME);
    req.onerror = function(e) {
      console("reset error: ", e.error.name);
    };
    req.onsuccess = function(e) {
      console.log(DB_NAME + " deleted successful !");
    };
  }

  function deleteTrack(successCallback, errorCallback, inTrack) {
    if (typeof successCallback === "function") {
      var tx = db.transaction(DB_STORE_TRACKS, "readwrite");
      tx.oncomplete = function(e) {
        console.log("delete_track transaction completed !");
      };
      tx.onerror = function(e) {
        console.error("delete_track transaction error: ", tx.error.name);
        errorCallback(x.error.name);
      };
      var store = tx.objectStore(DB_STORE_TRACKS);
      var req = store.delete(inTrack.id);
      req.onsuccess = function(e) {
        console.log("track_delete store store.delete successful");
        successCallback(inTrack.name);
      };
      req.onerror = function(e) {
        console.error("track_delete store store.delete error: ", req.error.name);
        errorCallback(req.error.name);
      };
    } else  {
      errorCallback("deleteTrack successCallback should be a function");
    }
  }
  function getConfig(successCallback, errorCallback) {
    if (typeof successCallback === "function") {
      var settings = [];
      var tx = db.transaction("settings");
      var store = tx.objectStore("settings");
      var req = store.openCursor();
      req.onsuccess = function(e) {
        var cursor = e.target.result;
        if (cursor) {
          settings.push(cursor.value);
          cursor.continue();
        } else {
        console.log("got settings: ", settings);
          if (settings.length === 0) {
            console.log("no settings stored, loading default values.")
            settings = DEFAULT_CONFIG;
            __saveDefaultConfig();
          };
        successCallback(settings);
        }
      };
      req.onerror = function(e) {console.error("getConfig store.openCursor error: ", e.error.name);};
    } else {
      errorCallback("getConfig successCallback should be a function");
    }
  }
  function __saveDefaultConfig() {
    var tx = db.transaction(DB_STORE_SETTINGS, "readwrite");
    tx.oncomplete = function(e) {
      console.log("successful creating default config !");
    };
    tx.onerror = function(e) {
      console.error("default config transaction error: ", tx.error.name);
      errorCallback(x.error.name);
    };
    var store = tx.objectStore([DB_STORE_SETTINGS]);
    for (var i = 0; i < DEFAULT_CONFIG.length; i++) {
      var req = store.add(DEFAULT_CONFIG[i]);
      req.onsuccess = function(e) {
        // body...
        console.log("added: ", e.target.result);
      };
      req.onerror = function(e) {
        console.error("error: ", req.error.name);
      };
    };
  }
  
  function updateConfig(successCallback, errorCallback, inSettings) {
    if (typeof successCallback === "function") {
      var tx = db.transaction([DB_STORE_SETTINGS], "readwrite");
      tx.oncomplete = function(e) {
        console.log("successful updating config !");
        successCallback();
      };
      tx.onerror = function(e) {
        console.error("saving config transaction error: ", tx.error.name);
        errorCallback(tx.error.name);
      };
      var store = tx.objectStore(DB_STORE_SETTINGS);
      for (var i = 0; i < inSettings.length; i++) {
        var req = store.delete(inSettings[i].key);
        req.onsuccess = function(e) {};
        req.onerror = function(e) {};
      };
      for (var i = 0; i < inSettings.length; i++) {
        var req = store.add(inSettings[i]);
        req.onsuccess = function(e) {};
        req.onerror = function(e) {};
      };
    } else {
      errorCallback("getConfig successCallback should be a function");
    }
  }

  return {
    initiate: initiate,
    addTrack: addTrack,
    getTracks: getTracks,
    deleteTrack: deleteTrack,
    reset_app: reset_app,
    getConfig: getConfig,
    updateConfig: updateConfig
  };
}();
// });


/*

RunBikeHike
  tracks
    track_name
  
  settings = table
*/
// define(function(){
var Tracks = function() {

  var current_track = {};
  var start_date;
  var distance = 0;
  var olat = null;
  var olon = null;

  function open() {
    current_track = {};
    // Get start date
    var d = new Date();
    current_track.date = d.toISOString();
    start_date = d.getTime();
    // Define track ID (= start date)
    current_track.id = current_track.date;
    // Build track name
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
    if (hour < 10) {
      hour = "0" + day.toString();
    };
    if (min < 10) {
      min = "0" + day.toString();
    };
    if (sec < 10) {
      sec = "0" + day.toString();
    };

    current_track.name = "TR-"+year+month+day+"-"+hour+min+sec;
    // Initiate the rest
    current_track.duration = 0;
    current_track.distance = 0;
    current_track.data = [];
    // Set the number of gps point
    nb_point = 0;

    return current_track;
  }

  function addNode(inNode, inDistance, inDuration) {
    current_track.data.push(inNode);
    current_track.distance = inDistance;
    current_track.duration = inDuration;
    nb_point =+ 1;
  }

  function getDistance(lat, lon) {
    if (olat != null) {      
      distance += __distanceFromPrev(olat, olon, lat, lon);
      console.log("distance: ", distance);
    };
    olat = lat;
    olon = lon;
    return distance;
  }

  function getDuration(time) {
    return time - start_date;
  }

  function close() {
    return current_track;
  }

  function reset() {
    distance = 0;
    
  }

  function __distanceFromPrev(lat1, lon1, lat2, lon2) {
    var lat1Rad = lat1*( Math.PI / 180);
    // console.log("lat1Rad: ", lat1Rad);
    var lon1Rad = lon1*( Math.PI / 180);
    var lat2Rad = lat2*( Math.PI / 180);
    var lon2Rad = lon2*( Math.PI / 180);

    var dLat = lat2Rad - lat1Rad;
    // console.log("dLat: ", dLat);
    var dLon = lon2Rad - lon1Rad;

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var R = 6371 * 1000; // Earth radius (mean) in metres {6371, 6367}
    // console.log("R*c: ", R*c);
    return R * c;
  }

  return {
    open: open,
    addNode: addNode,
    getDuration: getDuration,
    getDistance: getDistance,
    reset: reset,
    close: close
  };
}();
// });
// var Events = function() {

/******************
 * EVENT LISTENER *
*******************/

/*----------------- Home View -----------------*/
/* Home View Tracks button */
document.querySelector("#btn-tracks").addEventListener ("click", function () {
  Controller.displayTracks();
  document.querySelector("#tracksView").classList.remove("move-right");
  document.querySelector("#tracksView").classList.add("move-center");
})

/* Home View Start tracking button */
document.querySelector("#btn-start").addEventListener ("click", function () {
  Controller.startWatch();
  document.querySelector("#infosView").classList.remove("move-right");
  document.querySelector("#infosView").classList.add("move-center");
})

/*----------------- Infos View -----------------*/
/* Infos View Stop button */
document.querySelector("#btn-stop").addEventListener ("click", function () {
    document.getElementById("stop-form-confirm").classList.remove("hidden");
})

/*-------- Stop tracking confirmation ------------*/
/* Stop tracking Confirm button */
document.querySelector("#btn-confirm-stop").addEventListener ("click", function () {
  document.querySelector("#infosView").classList.remove("move-center");
  document.querySelector("#infosView").classList.add("move-right");
  document.getElementById("stop-form-confirm").classList.add("hidden");
    Controller.stopWatch();
})
/* Stop tracking Cancel button */
document.querySelector("#btn-cancel-stop").addEventListener ("click", function () {
    document.getElementById("stop-form-confirm").classList.add("hidden");
})

/*----------------- Settings View -----------------*/
/* Settings View Screen keep alive radio button */
document.querySelector("#screen").onchange = function () {
  Controller.savingSettings("screen", this.checked);
/*  if (this.checked) {
    var lock = window.navigator.requestWakeLock('screen');
    window.addEventListener('unload', function () {
      lock.unlock();
    })
  } else{
    window.navigator.requestWakeLock('screen').unlock();
  };*/
  Controller.toogleChecked(this.checked);
  console.log("this.checked", this.checked);
  // Controller.savingSettings("screen", this.checked);
}
/* Settings View Language selection */
document.querySelector("#language").onchange = function() {
  var dom = document.querySelector("#language");
  var id = this.selectedIndex;
  Controller.savingSettings("language", dom[id].value);
  Controller.changeLanguage(dom[id].value);
};
/* Settings View Distance unit selection */
document.querySelector("#distance").onchange = function() {
  var dom = document.querySelector("#distance");
  var id = this.selectedIndex;
  Controller.savingSettings("distance", dom[id].value);
  Controller.changeUnit(dom[id].value);
};
/* Settings View Speed unit selection */
document.querySelector("#speed").onchange = function() {
  var dom = document.querySelector("#speed");
  var id = this.selectedIndex;
  Controller.savingSettings("speed", dom[id].value);
  Controller.changeUnit(dom[id].value);
};
/* Settings View Position unit selection */
document.querySelector("#position").onchange = function() {
  var dom = document.querySelector("#position");
  var id = this.selectedIndex;
  Controller.savingSettings("position", dom[id].value);
  Controller.changePosition(dom[id].value);
};


/*----------------- Tracks View -----------------*/
/* Tracks View Back button */
document.querySelector("#btn-tracks-back").addEventListener ("click", function () {
  document.querySelector("#tracksView").classList.remove("move-center");
  document.querySelector("#tracksView").classList.add("move-right");
})

/*----------------- Track Detail View -----------------*/
/* Track View Back button */
document.querySelector("#btn-track-back").addEventListener ("click", function () {
  document.querySelector("#trackView").classList.remove("move-center");
  document.querySelector("#trackView").classList.add("move-right");
})
/* Track View Delete button */
document.querySelector("#btn-delete").addEventListener ("click", function () {
  document.getElementById("del-form-confirm").classList.remove("hidden");
});

/*----------------- Track Delete Confirmation -----------------*/
/* Delete Track Cancel button */
document.querySelector("#btn-cancel-delete").addEventListener("click", function () {
  document.getElementById("del-form-confirm").classList.add("hidden");
})
/* Delete Track Confirm button */
document.querySelector("#btn-confirm-delete").addEventListener("click", function () {
  document.querySelector("#trackView").classList.remove("move-center");
  document.querySelector("#trackView").classList.add("move-right");
  document.getElementById("del-form-confirm").classList.add("hidden");
  Controller.deleteTrack();
})
// }();
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
    // reset counters
    Tracks.reset();
    Chrono.reset();
    // Close track
    var track = Tracks.close();
    // if no gps point were retreive we don't save the track
    if (track.data.length < 1) {
      // we notify that we do nothing (cause that's good)
      utils.status.show("Track empty. Not saving");
    } else{
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

  function savingSettings(inKey, inValue) {
    for (var i = 0; i < settings.length; i++) {
      if (settings[i].key === inKey) {
        settings[i].value = inValue;
      }
    };
    console.log("now settings:", settings);
    DB.updateConfig(__savingSettingsSuccess, __savingSettingsError, settings);
  }

  function __savingSettingsSuccess() {
    console.log("YES !");
  }

  function __savingSettingsError(inError) {
    console.log("NO !", inError);
  }

  function toogleScreen(inChecked) {
    if (this.checked) {
      var lock = window.navigator.requestWakeLock('screen');
      /* Unlock the screen */
      window.addEventListener('unload', function () {
        lock.unlock();
      })
    } else{
      window.navigator.requestWakeLock('screen').unlock();
    };
  }
  function changeLanguage(inLanguage) {
  }
  function changeUnit(inUnit) {
    Config.USER_UNIT = inUnit;
    // HomeView.updateInfos();
  }
  function changePosition(inFormat) {
    Config.USER_POSITION_FORMAT = inFormat;
  }

  function __setConfigView(inSettings) {
    console.log("updating the settings DOM elements");
    for (var i = 0; i < inSettings.length; i++) {
      var param = inSettings[i];
      if (param.key === "screen") {
        document.getElementById(param.key).checked = param.value;
      } else{
        document.getElementById(param.key).value = param.value;
      };
    };
/*    document.querySelector("#screen").checked = inSettings.screen.value;
    document.querySelector("#language").value = inSettings.language.value;
    document.querySelector("#distance").value = inSettings.distance.value;
    document.querySelector("#speed").value = inSettings.speed.value;
    document.querySelector("#position").value = inSettings.position.value*/;
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
    console.log("delete track: ", displayed_track);
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
    savingSettings: savingSettings,
    toogleScreen: toogleScreen,
    changeLanguage: changeLanguage,
    changeUnit: changeUnit,
    changePosition: changePosition
  };
}();
// })
var RunBikeHike = function() {
	Controller.init();
/*    if (Config.SCREEN_KEEP_ALIVE) {
      var lock = window.navigator.requestWakeLock('screen');
       Unlock the screen 
      window.addEventListener('unload', function () {
        lock.unlock();
      })
    };
*/
}();