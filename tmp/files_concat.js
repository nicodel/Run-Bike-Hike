"use strict;"
/*
 * From  robnyman / Firefox-OS-Boilerplate-App
 */
// Install app
if (navigator.mozApps) {
    var checkIfInstalled = navigator.mozApps.getSelf();
    checkIfInstalled.onsuccess = function () {
        if (checkIfInstalled.result) {
            // Already installed
            var installationInstructions = document.querySelector("#installation-instructions");
            if (installationInstructions) {
                installationInstructions.style.display = "none";
            }
        }
        else {
            var install = document.querySelector("#install"),
                manifestURL = location.href.substring(0, location.href.lastIndexOf("/")) + "/manifest.webapp";
            console.log("manifestURL", manifestURL);
            install.className = "show-install";
            install.onclick = function () {
                var installApp = navigator.mozApps.install(manifestURL);
                installApp.onsuccess = function(data) {
                    install.style.display = "none";
                };
                installApp.onerror = function() {
                    alert("Install failed\n\n:" + installApp.error.name);
                };
            };
        }
    };
}
else {
    console.log("Open Web Apps not supported");
}

// Reload content
var reload = document.querySelector("#reload");
if (reload) {
    reload.onclick = function () {
        location.reload(true);
    };
}
"use strict;"
// define(["models/config"], function(Config) {
var HomeView = function() {

  function __hideSpinner(){
    document.getElementById("message-area").removeChild(document.getElementById("spinner"));
  }

  function updateInfos(inPosition, inDistance){

    document.getElementById("message").className = "behind hidden";
    // hide spinner
    // if (document.getElementById("spinner")) {
      // __hideSpinner();
    // };

    // display latitude using Settings format
    document.getElementById("home-lat").innerHTML = Config.userLatitude(inPosition.coords.latitude);
    // display longitude using Settings format
    document.getElementById("home-lon").innerHTML = Config.userLongitude(inPosition.coords.longitude);
    // display altitude using Settings format
    var a = Config.userSmallDistance(inPosition.coords.altitude);
    document.getElementById("home-alt").innerHTML = a.v;
    document.getElementById("alt-unit").innerHTML = "(" + a.u + ")";

    // display accuracy using settings unit
    var a = Config.userSmallDistance(inPosition.coords.accuracy.toFixed(0));
    // console.log("accuracy:", a);
    document.getElementById("home-acc").innerHTML = "&#177; " + a.v;
    document.getElementById("acc-unit").innerHTML =  "(" + a.u + ")";
    // checking accuracy and display appropriate GPS status
    if (inPosition.coords.accuracy > 25) {
      document.getElementById("home-acc").className = "new-line home-alt align-center text-big text-thinner bad-signal";
      // document.getElementById("acc-unit").className = "bad-signal";
      // document.getElementById("gps-status").setAttribute("src", "img/gps_red.png");
    } else {
      document.getElementById("home-acc").className = "new-line home-alt align-center text-big text-thin";
      // document.getElementById("acc-unit").className = "";
      // document.getElementById("gps-status").setAttribute("src", "img/gps_green.png");
    }
    // updating distance using Settings choosen unit
    var a = Config.userDistance(inDistance);
    document.getElementById("home-dist").innerHTML = a.v;
    document.getElementById("dist-unit").innerHTML = "(" + a.u + ")";
    // updating speed using Settings choosen unit
    var a = Config.userSpeed(inPosition.coords.speed);
    document.getElementById("home-speed").innerHTML = a.v;
    document.getElementById("speed-unit").innerHTML = "(" + a.u + ")";
    // empty message area
    document.getElementById('msg').innerHTML = "";
    //display compass
    // __displayCompass(inPosition.coords);
    if (inPosition.coords.heading > 0 ) {
      document.getElementById('home-dir').innerHTML = inPosition.coords.heading.toFixed(0);
    } else {
      document.getElementById('home-dir').innerHTML = "--";
    }
  }

  // function updateSettings(inSettings) {
  //   document.querySelector("#screen-keep").checked = inSettings.screen;
  //   document.querySelector("#language").value = inSettings.language;
  //   document.querySelector("#distance").value = inSettings.distance;
  //   document.querySelector("#speed").value = inSettings.speed;
  //   document.querySelector("#position").value = inSettings.position;
  // }

  function displayError(inError){
    // console.log("error:", inError)
    document.getElementById("home-acc").innerHTML = "??";
    document.getElementById("home-lat").innerHTML = "??";
    document.getElementById("home-lon").innerHTML = "??";
    document.getElementById("home-alt").innerHTML = "??";
    document.getElementById("home-dist").innerHTML = "??";
    document.getElementById("home-speed").innerHTML = "??";
    document.getElementById('msg').innerHTML = _("error-positon", {Error}); // "Error: " + inError.message;
    // hide spinner
    if (document.getElementById("spinner")) {
      __hideSpinner();
    };
  }

  function __displayCompass(event) {
    // compass = document.getElementById("home-compass");
    //~ console.log("heading:", event.heading);
    if (event.heading > 0 ){
      /** in case, when GPS is disabled (only if GSM fix is available),
       * event.heading should be -1 and event.errorCode should be 4,
       * but it isn't... So we use this strange condition that don't
       * work if we go _directly_ to north...
       */
      // opacity = 1; // 0.8
      // compass.src = 'img/compass.png';
      var rot = 360 - event.heading.toFixed(0);
      compass.style.transform = "rotate(" + rot + "deg)";
      // compass.style.webkitTransform = "rotate(" + rot + "deg)";
      document.getElementById('home-dir').innerHTML = event.heading;
    } else {
      // compass.src = 'img/compass_inactive.png';
      // opacity = 1; // 0.3
      document.getElementById('home-dir').innerHTML = "??";
    }
    // compass.style.opacity = opacity;
  }

  return {
    // hideSpinner: hideSpinner,
    updateInfos: updateInfos,
    // updateSettings: updateSettings,
    displayError: displayError
  };

}();
// });
"use strict"
var InfosView = function() {
/*define(["controller",
        "models/config"
  ], function(Controller, Config) {*/

  var updateInfos = function(inPosition, inDistance) {
    console.log("showing: ", inDistance);
    // updating distance using Settings choosen unit
    if (inDistance < 1000) {
      document.getElementById("infos-dist").innerHTML = Controller.userSmallDistance(inDistance);
    } else { 
      document.getElementById("infos-dist").innerHTML = Controller.userDistance(inDistance);
    };
    // updating speed using Settings choosen unit
    document.getElementById("infos-speed").innerHTML = Controller.userSpeed(inPosition.coords.speed);
    // updating altitude using Settings choosen unit
    document.getElementById("infos-alt").innerHTML = Controller.userSmallDistance(inPosition.coords.altitude);
    // updating accuracy using settings units
    document.getElementById("infos-acc").innerHTML = "&#177;" + Controller.userSmallDistance(inPosition.coords.accuracy);
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
"use strict;"
var TracksView = function() {

  function display(inTracks, displayTrackCallback) {
    // __remove_childs("tracks-list");
    var list = document.getElementById("tracks-list");
    console.log("list.childNodes",list.childNodes);
/*    for (i = 0; i = list.childNodes.length - 1; i++) {
      if (list.childNodes[i]) {
        if (list.childNodes[i].className === "it-track") {
          console.log("cleaning element " + i + " " + list.childNodes[i]);
          list.removeChild(list.childNodes[i]);
        } else {
          console.log("element " + i + " " + list.childNodes[i]);
        }
      }
      console.log("remove element " + i + " " + list.childNodes[i].textContent);
      document.getElementById("tracks-list").removeChild(list.childNodes[i]);
    }*/
    console.log("inTracks", inTracks);
    if (inTracks.length === 0) {
      __showEmpty();
    } else {
      var tracks = [];
      tracks = inTracks;
      for (var i = tracks.length - 1; i >= 0; i--) {
        __buildList(tracks[i], displayTrackCallback);
        //console.log("buildList i ", i);
      }
    }
    document.getElementById("list-spinner").className = "behind hidden";

    /*
     * TESTING !!!
     */
/*    var div = '<p><span class="align-left bold clipped">' + inTrack.name + '</span>';
    div = div + '<span class="align-right">' + Config.userDate(inTrack.date) + '</span></p>';
    div = div + '<p class="new-line"><span class="align-left">' + Config.userDistance(inTrack.distance) + '</span>';
    var d = inTrack.duration / 60000;
    div = div + '<span class="align-right">' + d.toFixed() + 'min</span></p>';
    lia.innerHTML = div;
    li.appendChild(lia);
    document.getElementById("tracks-list").appendChild(li);
    lia.addEventListener("click", function(e){
      console.log("click: track " + inTrack + "will be displayed");
      document.querySelector("#trackView").classList.remove("move-right");
      document.querySelector("#trackView").classList.add("move-center");
      Controller.displayTrack(inTrack);
    });*/
    /*
     *
     */
  }

  function reset() {
    if (document.getElementById("tracks-list").hasChildNodes()) {
      __remove_childs("tracks-list");
      var li = document.createElement("li");
      li.className = "ontop";
      li.id = "list-spinner"
      var div = '<div class="align-center top40"><progress id="spinner"></progress></div>';
      li.innerHTML = div;
      document.getElementById("tracks-list").appendChild(li);
    };
  }

  function __showEmpty() {
    var el = document.createElement("p");
    el.className = "empty-tracks";
    el.innerHTML = _("empty-list"); // "Empty tracks list.";
    document.getElementById("tracks-list").appendChild(el);
  }

  function __buildList(inTrack, displayTrackCallback) {
    // console.log("__buildList - inTrack: ", inTrack);
    var li = document.createElement("li");
    li.className = "it-track";
    var lia = document.createElement("a");
    // lia.className = "it-track";

    var div = '<p><span class="align-left clipped">' + inTrack.name + '</span>';
    var a = Config.userDistance(inTrack.distance);
    div = div + '<span class="align-right text-thin">' + a.v + a.u + '</span></p>';
    div = div + '<p class="new-line"><span class="align-left text-thin">' + Config.userDate(inTrack.date) + '</span>';
    var d = inTrack.duration / 60000;
    div = div + '<span class="align-right text-thin">' + d.toFixed() + 'min</span></p>';
    lia.innerHTML = div;
    li.appendChild(lia);
    document.getElementById("tracks-list").appendChild(li);
    lia.addEventListener("click", function(e){
      // console.log("click: track " + inTrack + "will be displayed");
      document.getElementById("views").showCard(4);
      displayTrackCallback(inTrack);
    });
  }

  function __remove_childs(parent) {
    var d = document.getElementById(parent).childNodes;
    console.log("d",d);
    for (i = 0; i = d.length - 1; i++) {
      console.log("remove element " + i + " " + d[i]);
      document.getElementById(parent).removeChild(d[i]);
    }
  }

  return {
    display: display,
    reset: reset
  };

}();
"use strict;"
var TrackView = function() {

  // var SCREEN_WIDTH = parseInt(window.innerWidth * 0.9,10);
  var SCREEN_WIDTH = parseInt(window.innerWidth,10);
  var SCREEN_HEIGHT = parseInt(SCREEN_WIDTH * 2 / 3,10);
  // Only getting a big size map, that will be stored in db
  var MAP_WIDTH = 648; // 720px * 0.9
  var MAP_HEIGHT = 432 // 720px * 3 / 2
  // console.log("width", SCREEN_WIDTH);
  // console.log("height", SCREEN_HEIGHT);
  var xPadding = 35;
  var yPadding = 30;

  var SPACE_BTW_POINTS = 5;
  var LINE_WIDTH = 2;
  var TEXT_STYLE = "8pt bold 'Fira Sans',sans-serif";
  var TEXT_COLOR = "#333";
  // var VALUE_COLOR = "#008000";
  // var ACCURACY_COLOR = "#805A5A";
  // var ACCURACY_FILL_COLOR = "#C89696";
  var ALT_LINE_COLOR = "#008000"; // Green
  var ALT_FILL_COLOR = "rgba(0,128,0,0.3)"; // Green
  var SP_LINE_COLOR = "#4169E1"; // RoyalBlue
  var SP_FILL_COLOR = "rgba(65,105,225, 0.3)"; // RoyalBlue

  function display(inTrack, saveMapCallback) {
    console.log("inTrack in display", inTrack);
    //reset old ressources
    document.getElementById("trk-date").innerHTML = "";
    document.getElementById("trk-dist").innerHTML = "";
    document.getElementById("trk-dur").innerHTML = "";
    document.getElementById("map-img").src = "";

    var tr = document.getElementById("tr-name");
    tr.innerHTML = inTrack.name;

    document.getElementById("trk-date").innerHTML = Config.userDate(inTrack.date);
    var a = Config.userDistance(inTrack.distance);
    document.getElementById("trk-dist").innerHTML = a.v + a.u;
    var d = inTrack.duration / 60000;
    document.getElementById("trk-dur").innerHTML = d.toFixed() +" min";

    var t = inTrack;
    console.log("t", t);
    // console.log("t.map", t.map);
    t.min_alt = 0;
    t.max_alt = 0;
    t.max_speed = 0;
    t.min_speed = 0;
    t.av_speed = 0;
    t.start = null;
    t.end = null;

    //~ get min, max altitude, max speed, start and end time
    for (i=0; i<t.data.length; i++) {
      var row = t.data[i];
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
      // if (t.min_speed === 0 || speed_int < t.min_speed) {
      //   t.min_speed = speed_int;
      // }
      var dt = new Date(t.data[i].date).getTime();
      // console.log("dt ", dt);
      if (t.start === null || dt < t.start) {
        t.start = dt;
      }
      if (t.end === null || dt > t.end) {
        t.end = dt;
      }
      t.av_speed = t.av_speed + speed_int;
    }
    console.log("t.av_speed",t.av_speed);
    t.av_speed = t.av_speed / t.data.length;
    console.log("t.max_speed",t.max_speed);
    // t.max_alt_speed = 15;
    // console.log("t.max_speed",t.max_speed);
    var a = Config.userSpeed(t.max_speed);
    document.getElementById("trk-max-speed").innerHTML = a.v + a.u;
    var a = Config.userSpeed(t.av_speed);
    document.getElementById("trk-av-speed").innerHTML = a.v + a.u;
    var a = Config.userSmallDistance(t.max_alt);
    document.getElementById("trk-max-alt").innerHTML = a.v + a.u;
    var a = Config.userSmallDistance(t.min_alt);
    document.getElementById("trk-min-alt").innerHTML = a.v + a.u;

    if (t.map) {
      console.log("map exist");
      document.getElementById("map-img").width = SCREEN_WIDTH;
      document.getElementById("map-img").src = t.map;
      document.querySelector("#map-text").classList.add("hidden");
      document.querySelector("#track-spinner").classList.add("hidden");
      document.querySelector("#map-img").classList.remove("hidden");
    } else {
      console.log("map does not exist");
      var mapToSave = __buildMap2(inTrack, saveMapCallback);
      // console.log("mapToSave.map", mapToSave.map);
      // saveMapCallback(mapToSave);
    }
    // __buildSpeedGraph(t);
    // __buildAltitudeGraph(t);
    __buildGraphs(t);
  }

  function updateName(inName) {
    console.log("updating");
    document.getElementById("tr-name").innerHTML = inName;
  }

  function __buildGraphs(inData) {
    "use strict;"
    var data = inData.data;
    // calculate the axis values in order to draw the canvas graph
    // max_acc: represents the poorest accuracy on altitude
    // alt_max_y: represents the highest altitude value
    // alt_min_y: represents the smallest altitude value
    var max_acc = 0;
    var alt_max_y = 0;
    var alt_min_y = 0;
    for(i=0;i<data.length;i++) {
      if(parseInt(data[i].altitude, 10) > alt_max_y) {
        alt_max_y = parseInt(data[i].altitude, 10);
      }
      if(parseInt(data[i].altitude, 10) < alt_min_y) {
        alt_min_y = parseInt(data[i].altitude, 10);
      }
      if(parseInt(data[i].vertAccuracy, 10) > max_acc) {
        max_acc = parseInt(data[i].vertAccuracy, 10);
      }
      max_acc = max_acc / 2;
    }
    // sp_max_y: represents the highest speed value
    // sp_min_y: represents the smallest speed value
    var sp_max_y = Config.userSpeedInteger(inData.max_speed);
    var sp_min_y = Config.userSpeedInteger(inData.min_speed);

    // Write Y Axis text
    var alt_range = alt_max_y - alt_min_y;
    alt_range = alt_range + (alt_range / 3);
    var sp_range = sp_max_y - sp_min_y;
    sp_range = sp_range * 2;
    // calculate
    var alt_yspace = parseInt(alt_range / 4, 10);
    var sp_yspace = parseInt(sp_range / 4, 10);
    console.log("speed", sp_range + "-" + sp_yspace);
    console.log("alt", alt_range + "-" + alt_yspace);
    var c = __createRectCanvas("graphs-canvas", alt_range, alt_yspace, sp_range, sp_yspace);

    var espace = parseInt(data.length / (SCREEN_WIDTH - xPadding - 5), 10);
    if (espace === 0) {
      espace = 1;
    } else {
      espace = espace * SPACE_BTW_POINTS; // increase spacing between points so that the chart looks smoother.
    };

    // Write the legends
    // 1: Altitude
    // 2: Speed
    c.fillStyle = ALT_LINE_COLOR;
    var q = Config.userSmallDistance(null);
    c.fillText(_("altitude") + " (" + q.u + ")", xPadding + 50, 8);
    c.fillStyle = SP_LINE_COLOR;
    var q = Config.userSpeed(null);
    c.fillText(_("speed") + " (" + q.u + ")", xPadding + 50, 20);
    c.stroke();

    // Write X Axis text and lines
    if (data.length <= SPACE_BTW_POINTS) {
      var xspace = data.length;
    } else{
      var xspace = data.length / SPACE_BTW_POINTS;
    };
    // console.log("xspace",xspace);
    for (i=0;i<data.length;i+=xspace) {
      i = parseInt(i,10);
      var date = new Date(data[i].date).getHours() + ":" + new Date(data[i].date).getMinutes();
      c.textAlign = "center";
      c.fillStyle = "gray";
      c.fillText(date, __getXPixel(i,data), SCREEN_HEIGHT - yPadding + 27);
      // draw vertical lines
      c.beginPath();
      // c.strokeStyle  = "rgba(150,150,150, 0.5)";
      // c.lineWidth = 1;
      // c.moveTo(__getXPixel(i,data),0);
      // c.lineTo(__getXPixel(i,data),SCREEN_HEIGHT - xPadding);
      c.moveTo(__getXPixel(i,data),SCREEN_HEIGHT - yPadding + 15);
      c.lineTo(__getXPixel(i,data),SCREEN_HEIGHT - yPadding + 20);
      c.stroke();
    }


    // Draw Altitude points
    c.strokeStyle = ALT_LINE_COLOR;
    c.lineWidth = LINE_WIDTH;
    c.beginPath();
    c.moveTo(__getXPixel(0,data), __getYPixel(data[0].altitude, alt_range));
    for(i=1;i<data.length;i+=espace) {
      var x = __getXPixel(i,data);
      c.lineTo(x, __getYPixel(data[i].altitude, alt_range));
    }
    c.lineTo(x,SCREEN_HEIGHT - yPadding);
    c.lineTo(__getXPixel(0,data),SCREEN_HEIGHT - yPadding);
    c.lineTo(__getXPixel(0,data), __getYPixel(data[0].altitude, alt_range));
    c.fillStyle = ALT_FILL_COLOR;
    c.fill();
    c.stroke();

    // Draw Speed points
    c.strokeStyle = SP_LINE_COLOR;
    c.globalAlpha = 1;
    c.lineWidth = LINE_WIDTH;
    c.beginPath();
    var value = Config.userSpeedInteger(data[0].speed);
    c.moveTo(__getXPixel(0,data), __getYPixel(value, sp_range));
    for(i=1;i<data.length;i+=espace) {
      var value = Config.userSpeedInteger(data[i].speed);
      var x = __getXPixel(i,data);
      c.lineTo(x, __getYPixel(value, sp_range));
    }
    c.lineTo(x,SCREEN_HEIGHT - yPadding);
    c.lineTo(__getXPixel(0,data),SCREEN_HEIGHT - yPadding);
    c.lineTo(__getXPixel(0,data), __getYPixel(Config.userSpeedInteger(data[0].speed), sp_range));
    c.fillStyle = SP_FILL_COLOR;
    c.fill();
    c.stroke();

    c.closePath();
  }

  function __buildMap2(inTrack, saveMapCallback) {
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
    // add some borders
    p1 = __movePoint(p1, larger * -0.1, larger * -0.1);
    p2 = __movePoint(p2, larger * 0.1, larger * 0.1);
    // make map width always larger
    if (realWidth < realHeight) {
      p1 = __movePoint(p1, (realHeight - realWidth) / -2, 0);
      p2 = __movePoint(p2, (realHeight - realWidth) / +2, 0);
      realHeight = __getDistance(p1.lat, p1.lon, p2.lat, p1.lon);
      realWidth = __getDistance(p1.lat, p1.lon, p1.lat, p2.lon);
      larger = realWidth > realHeight ? realWidth : realHeight;
    };
    if (larger === 0) {
      return;
    };

    var MAX_POINTS = 100;
    var BLACK = "0x000000";
    var BLUE = "0x0AFF00";
    var RED = "0xFF0000";
    var GREEN = "0x0027FF";
    var PATH = "&polyline=color:" + BLUE + "|width:3|";
    var j = 0;
    if (inTrack.data.length > MAX_POINTS) {
      var y = parseInt(inTrack.data.length / MAX_POINTS, 10);
      // console.log("y: ", y);
      if (y * inTrack.data.length > MAX_POINTS) {
        y = y + 1;
      };
    } else {
      var y = 1;
    };
    for (var i = 0; i < inTrack.data.length; i = i + y) {
      if (i === inTrack.data.length - 1) {
        PATH = PATH + inTrack.data[i].latitude + "," + inTrack.data[i].longitude;
      } else {
        PATH = PATH + inTrack.data[i].latitude + "," + inTrack.data[i].longitude + ",";
      }
      j++
    };
    // console.log("PATH: ", PATH);
    var BESTFIT = "&bestfit=" + p1.lat + ","+ p1.lon + ","+ p2.lat + "," + p2.lon;
    var SIZE = "&size=" + MAP_WIDTH + "," + MAP_HEIGHT;
    var TYPE = "&type=map&imagetype=jpeg";
    var BASE_URL = "http://www.mapquestapi.com/staticmap/v4/getmap?key=Fmjtd%7Cluur21u720%2Cr5%3Do5-90tx9a&";


    var loc = BASE_URL + SIZE + TYPE + BESTFIT + PATH;

    document.getElementById("map-img").width = SCREEN_WIDTH;
    document.getElementById("map-img").onload = function () {
      document.querySelector("#map-text").classList.add("hidden");
      // document.getElementById("spinner-box").removeChild(document.getElementById("track-spinner"));
      document.querySelector("#track-spinner").classList.add("hidden");
      document.querySelector("#map-img").classList.remove("hidden");
      // document.querySelector("#map-img").classList.remove("absolute");
    };
    // document.getElementById("map-img").src = loc;
    // console.log("loc:", loc);

    // Following based on @robertnyman article on hacks.mozilla.org https://hacks.mozilla.org/2012/02/storing-images-and-files-in-indexeddb/
    var xhr = new XMLHttpRequest(), blob;
    xhr.open('GET', loc, true);
    xhr.responseType = "blob";
    xhr.addEventListener("load", function() {
      if (xhr.status === 200) {
        blob = xhr.response;
        var URL = window.URL || window.webkitURL;
        var imgURL = URL.createObjectURL(blob);
        document.getElementById("map-img").src = imgURL;
        inTrack.map = imgURL;
        // Controller.saveMap(inTrack);
        saveMapCallback(inTrack);
      }
    }, false);
    xhr.send();
  }

  function __createRectCanvas(inElementId, inRangeAlt, inSpaceAlt, inRangeSp, inSpaceSp) {
    var graph = document.getElementById(inElementId);
    var c = graph.getContext("2d");
    c.clearRect(0, 0, SCREEN_WIDTH - 5, SCREEN_HEIGHT);
    graph.setAttribute("width",SCREEN_WIDTH - 5);
    graph.setAttribute("height",SCREEN_HEIGHT);

    c.fillStyle = TEXT_COLOR;
    c.font = TEXT_STYLE;
    c.textAlign = "right";
    c.textBaseline = "middle";
    var alt_y = 0;
    var alt_x = 0;
    var speed_y = 0;
    var speed_x = 0;
    for (t=0;t<4;t++) {
      var alt = Config.userSmallDistance(parseInt(alt_x,10));
      // var speed = Config.userSpeed(parseInt(speed_x,10));
      // var speed = Config.userSpeed(speed_x);
      c.fillStyle = ALT_LINE_COLOR;
      c.fillText(alt.v, xPadding - 10, __getYPixel(alt_y, inRangeAlt) - 6);
      c.fillStyle = SP_LINE_COLOR;
      // console.log("1-speed.v", speed.v);
      // c.fillText(speed.v, xPadding - 10, __getYPixel(speed_y, inRangeSp) + 6);
      c.fillText(speed_x, xPadding - 10, __getYPixel(speed_y, inRangeSp) + 6);
      c.beginPath();
      c.moveTo(xPadding, __getYPixel(alt_y, inRangeAlt));
      c.lineTo(SCREEN_WIDTH - 5, __getYPixel(alt_y, inRangeAlt));
      c.lineWidth = 0.2;
      c.strokeStyle = "black";
      c.stroke();
      alt_y += inSpaceAlt;
      alt_x += inSpaceAlt;
      speed_y += inSpaceSp;
      speed_x += inSpaceSp;
      console.log("2-speed.v", speed.v);
    }
    c.beginPath();
    c.moveTo( xPadding,SCREEN_HEIGHT - yPadding + 15);
    c.lineTo(SCREEN_WIDTH - 5,SCREEN_HEIGHT - yPadding + 15);
    // c.moveTo(xPadding, 0);
    // c.lineTo(xPadding, SCREEN_HEIGHT - yPadding);
    // c.lineTo(SCREEN_WIDTH, SCREEN_HEIGHT - yPadding);
    c.lineWidth = 0.1;
    c.strokeStyle = "black";
    c.stroke();

    return c;
  }




  function __getXPixel(val,data) {
    return ((SCREEN_WIDTH - xPadding - 5) / data.length) * val + xPadding;
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
    display: display,
    updateName: updateName
  };

}();
'use strict';
// From Mozilla Building Blocks
var utils = this.utils || {};

utils.status = (function() {

  // This constant is essential to resolve what is the path of the CSS file
  // that defines the animations
  //var FILE_NAME = 'status';

  // How many milliseconds is displayed the status component by default
  var DISPLAYED_TIME = 2000;

  // References to the DOMElement(s) that renders the status UI component
  var section, content;  //original

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
"use strict;"
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

}();"use strict;"
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
    // new: true,
    // screen: false,
    // language: "en",
    // distance: "0",
    // speed: "0",
    // position: "0"
  // };

  var METRIC_UNITS = "0";
  var IMPERIAL_UNITS = "1";

  var DEFAULT_EXPORT_FORMAT = "gpx";

  var DEFAULT_POS_FORMAT = "0";
  var GEOCACHING_POS_FORMAT = "1";
  var DEGREES_POS_FORMAT = "2";

  var DEFAULT_DISCARD_VALUE = 500 * 1000;


  // Default config values
  // var SCREEN_KEEP_ALIVE = false;
  // var USER_DISTANCE = 0;
  // var USER_SPEED = 0;
  // var USER_POSITION_FORMAT = 0;

  function change(inKey, inValue) {
    inKey = inValue;
    // console.log(inKey+":"+inValue);
  }
  function userSpeed(velocityMPS){
    // console.log("SPEED METRIC:", velocityMPS);
    // console.log("Config.CONFIG['speed']", Config.CONFIG['speed']);
    var a = {};
    if (velocityMPS === null || velocityMPS<0 || isNaN(velocityMPS)) {
      // if (USER_SPEED === IMPERIAL_UNITS) {
      if (Config.CONFIG["speed"] === IMPERIAL_UNITS) {
        // console.log("null - IMPERIAL_UNITS");
        a.u = "mph"
      }
      if (Config.CONFIG["speed"] === METRIC_UNITS){
        // console.log("null - METRIC_UNITS");
        a.u = "km/h";
      }
      a.v = "--"
      return a;
    }

    if (Config.CONFIG["speed"] === IMPERIAL_UNITS){
      /* FIXME: I'am not sure that it is right */
      // return (velocityMPS * 2.237).toFixed(0)+" MPH";
      // console.log("value - IMPERIAL_UNITS");
       a.v = (velocityMPS * 2.237).toFixed(0);
       a.u = "MPH"
       return a;
    }
    if (Config.CONFIG["speed"] === METRIC_UNITS){
      // console.log("value - METRIC_UNITS");
      // return (velocityMPS * 3.6).toFixed(0)+" km/h";
       a.v = (velocityMPS * 3.6).toFixed(0);
       a.u = "km/h"
       return a;
    }
    // return velocityMPS+ " m/s";
    // console.log("speed nothing identified");
     a.v = velocityMPS;
     a.u = "m/s";
     return a;
  }
  function userSpeedInteger(velocityMPS) {
    // console.log("SPEED METRIC:", velocityMPS);
    if (velocityMPS === null || velocityMPS<0 || isNaN(velocityMPS)) {
      return null;
    }

    if (Config.CONFIG["speed"] === IMPERIAL_UNITS){
      /* FIXME: I'am not sure that it is right */
      return (velocityMPS * 2.237).toFixed(0);
    }
    if (Config.CONFIG["speed"] === METRIC_UNITS){
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
    console.log("degree", degree);
     if (Config.CONFIG["position"] === DEGREES_POS_FORMAT)
       return degree;

     if (Config.CONFIG["position"] === GEOCACHING_POS_FORMAT)
      return (degree>0? "N":"S") +" "+ __userDegreeLikeGeocaching( Math.abs(degree) );

     return this.userDegree( Math.abs(degree) ) + (degree>0? "N":"S");
  }
  function userLongitude(degree){
     if (Config.CONFIG["position"] === DEGREES_POS_FORMAT)
       return degree;

     if (Config.CONFIG["position"] === GEOCACHING_POS_FORMAT)
      return (degree>0? "E":"W") +" "+ __userDegreeLikeGeocaching( Math.abs(degree) );

     return this.userDegree( Math.abs(degree) ) + (degree>0? "E":"W");
  }
  function __userDegreeLikeGeocaching (degree){
    minutes = (degree - Math.floor(degree)) * 60;
    return Math.floor(degree) + "°" + (minutes<10?"0":"") + minutes.toFixed(3) + "'"
  }
  function userSmallDistance(distanceM, canNegative){
    // console.log('Config.CONFIG["distance"]', Config.CONFIG["distance"]);
    var a = {};
    if ((distanceM === null) || ((distanceM < 0) && (!canNegative))) {
    // if (USER_DISTANCE === IMPERIAL_UNITS){
      if (Config.CONFIG["distance"] === IMPERIAL_UNITS){
         a.u = "ft";
         // return a;
       }
      if (Config.CONFIG["distance"] === METRIC_UNITS){
        a.u = "m"
        // return a;
       }
       a.v = "--"
      return a;
    }

    if (Config.CONFIG["distance"] === IMPERIAL_UNITS){
     /* FIXME: I'am not sure that it is right */
     // return (distanceM * 3.2808).toFixed(0)+" ft";
     a.v = (distanceM * 3.2808).toFixed(0);
     a.u = "ft";
     return a;
    }
    if (Config.CONFIG["distance"] === METRIC_UNITS){
     // return (distanceM * 1.0).toFixed(0)+" m";
    a.v = (distanceM * 1.0).toFixed(0);
    a.u = "m"
    return a;
    }
    // return distanceM+" m";
    a.v = distanceM;
    a.u = "m";
    return a;
  }
  function userDistance (distanceM, canNegative){
    var a = {};
    if ((distanceM === null) || ((distanceM < 0) && (!canNegative))) {
      if (Config.CONFIG["distance"] === IMPERIAL_UNITS) {
        a.u = "miles";
      }
      if (Config.CONFIG["distance"] === METRIC_UNITS) {
        a.u = "km";
      }
      a.v = "--";
      return a;
    }

    if (Config.CONFIG["distance"] === METRIC_UNITS){
      tmp = (distanceM / 1000);
      // return (tmp >= 10? tmp.toFixed(0): tmp.toFixed(1))+" km";
      a.v = (tmp >= 10? tmp.toFixed(0): tmp.toFixed(1));
      a.u = "km";
      return a;
    }
    if (Config.CONFIG["distance"] === IMPERIAL_UNITS){
      /* FIXME: I'am not sure that it is right */
      tmp = (distanceM / 1609.344);
      // return (tmp >= 10? tmp.toFixed(0): tmp.toFixed(1))+" miles";
      a.v = (tmp >= 10? tmp.toFixed(0): tmp.toFixed(1));
      a.u = "miles";
      return a;
    }
    // return distanceM+" m";
     a.v = distanceM;
     a.u = "m";
     return a;
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
    // console.log("minTime", minTime);
    // console.log("maxTime", maxTime);
    var result = [];
    length = maxTime - minTime;
    // console.log("length", length);
    align = 5*60*1000; // 5 minutes
    maxLines = 6;
    if (length / align > maxLines) {align =    10*60*1000;console.log("10 minutes");}
    if (length / align > maxLines) {align =    15*60*1000;console.log("15 minutes");}
    if (length / align > maxLines) {align =    30*60*1000;console.log("30 minutes");}
    if (length / align > maxLines) {align = 1* 60*60*1000;console.log("60 minutes");}
    // console.log("align", align);

    dateobj = new Date(minTime);
    //~ startOfDay = Date.parse( dateobj.getFullYear() + '-' + dateobj.getMonth() + '-' + dateobj.getDate() + ' 0:00' );
    startOfDay = Date.parse(dateobj.getFullYear() + ' - ' + dateobj.getMonth() + ' - ' + dateobj.getDate());
    // console.log("startOfDay", startOfDay);
    alignedStart = minTime + ( align - ((minTime - startOfDay) % align));
    // console.log("alignedStart",alignedStart);
    var i = 0;
    var now = new Date();
    for (time = alignedStart; time < maxTime ; time += align){
      result[ i++ ] = {
        time : time,
        label : config.format_time(new Date( time + ( now.getTimezoneOffset()*-60*1000 ) ), true)
      };
    }
    // console.log("result", result);
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

}();var Share = function() {
  function toLocal(inFile, inName, successCallback, errorCallback) {
    console.log("saving to local :-(");
    var sdcard = navigator.getDeviceStorage("sdcard");
    // var blob = new Blob (["this is a new file."], {"type":"plain/text"});
    var blob = new Blob ([inFile], {"type":"plain/text"});

    var req = sdcard.addNamed(blob, "/sdcard/rbh/" + inName);

    req.onsuccess = function() {
      successCallback("success on saving file ", this.result);
    };

    req.onerror = function() {
      if (this.error.name === "NoModificationAllowedError") {
        console.warn('Unable to write the file: ', 'File already exists');
        errorCallback('Unable to write the file: ' + 'File already exists');
      } else if (this.error.name === "SecurityError") {
        console.warn('Unable to write the file: ', 'Permission Denied');
        errorCallback('Unable to write the file: ' + 'Permission Denied');
      } else {
        console.warn('Unable to write the file: ', this.error.name);
        errorCallback('Unable to write the file: ' + this.error.name);
      };
    };
  }

  function toEmail(inTrack, inFile) {
    var blob = new Blob([inFile], {type: "text/plain"});
    var name = inTrack.name + ".gpx";

    var activity = new MozActivity({
      name: "new",
      data: {
        type: "mail",
        filenames: [name],
        blobs: [blob]
      }
    });

    activity.onsuccess = function() {
      console.log("email send with success:", this.result);
    }
    activity.onerror = function() {
      console.log("email not send:", this.error);
    }
  }

  function toTwitter() {}



  return {
    toLocal: toLocal,
    toEmail: toEmail,
    toTwitter: toTwitter
  }
}();
"use strict;"
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
/*  var DEFAULT_CONFIG = {
    screen : false,
    language : "en",
    distance : 0,
    speed : 0,
    position : 0
  };*/

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
        var store = req.result.createObjectStore(DB_STORE_SETTINGS, {keyPath: "key"});
        store.createIndex("key", "key", {unique: true});
        store.createIndex("value", "value", {unique: false});
      };
    } else  {
      errorCallback("initiate() successCallback should be a function");
    }
  }
  function addTrack(successCallback, errorCallback, inTrack) {
    if (typeof successCallback === "function") {

      var tx = db.transaction(DB_STORE_TRACKS, "readwrite");
      tx.oncomplete = function(e) {
        // console.log("add_track transaction completed !");
      };
      tx.onerror = function(e) {
        // console.error("add_track transaction error: ", tx.error.name);
        errorCallback(e.error.name);
      };
      var store = tx.objectStore(DB_STORE_TRACKS);
      var req = store.add(inTrack);
      req.onsuccess = function(e) {
        // console.log("track_add store store.add successful");
        successCallback(inTrack.name);
        // ??? going back to home ???
        // ui.back_home();
      };
      req.onerror = function(e) {
        // console.error("track_add store store.add error: ", req.error.name);
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
        // console.log("get_tracks store.openCursor successful !", cursor);
        if (cursor) {
          // console.log("cursor.value", cursor.value);
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
      var tx = db.transaction(DB_STORE_SETTINGS);
      var store = tx.objectStore(DB_STORE_SETTINGS);
      var req = store.openCursor();
      req.onsuccess = function(e) {
        var cursor = e.target.result;
        if (cursor) {
          settings.push(cursor.value);
          cursor.continue();
        } else {
          if (settings.length === 0) {
            console.log("no config found, loading the default one !")
            settings = DEFAULT_CONFIG;
            __saveDefaultConfig();
          };
          var prettySettings = {};
          for (var i = 0; i < settings.length; i++) {
            prettySettings[settings[i].key] = settings[i].value;
          };
          console.log("loaded settings are:", prettySettings);
          successCallback(prettySettings);
        }
      };
      req.onerror = function(e) {console.error("getConfig store.openCursor error: ", e.error.name);};
    } else {
      errorCallback("getConfig() successCallback should be a function");
    }
  }
  function saveMap(successCallback, errorCallback, inTrack) {
    if (typeof successCallback === "function") {
      var tx = db.transaction(DB_STORE_TRACKS, "readwrite");
      var store = tx.objectStore(DB_STORE_TRACKS);
      var req = store.get(inTrack.id);
      req.onsuccess = function(e) {
        var req2 = store.put(inTrack);
        req2.onsuccess = function(e) {
          console.log("successfully updated");
        }
        req2.onerror = function(e) {
          console.log("failure on saving map");
          errorCallback(e.error.name);
        }
      }
    } else  {
      errorCallback("addTrack successCallback should be a function");
    }
  }
  function updateTrack(successCallback, errorCallback, inTrack) {
    if (typeof successCallback === "function") {
      var tx = db.transaction(DB_STORE_TRACKS, "readwrite");
      var store = tx.objectStore(DB_STORE_TRACKS);
      var req = store.get(inTrack.id);
      req.onsuccess = function(e) {
        var req2 = store.put(inTrack);
        req2.onsuccess = function(e) {
          console.log("successfully updated");
          successCallback();
        }
        req2.onerror = function(e) {
          console.log("failure on updating");
          errorCallback(e.error.name);
        }
      }
    } else  {
      errorCallback("addTrack successCallback should be a function");
    }
  }
  function __saveDefaultConfig() {
    console.log("saving default config");
    var tx = db.transaction(DB_STORE_SETTINGS, "readwrite");
    tx.oncomplete = function(e) {
      // console.log("successful creating default config !");
    };
    tx.onerror = function(e) {
      // console.error("default config transaction error: ", tx.error.name);
      errorCallback(x.error.name);
    };
    var store = tx.objectStore([DB_STORE_SETTINGS]);
/*    var req = store.add(DEFAULT_CONFIG);
    req.onsuccess = function(e) {
      console.log("added: ", e.target.result);
    };
    req.onerror = function(e) {
      console.error("error: ", req.error.name);
    };*/
    for (var i = 0; i < DEFAULT_CONFIG.length; i++) {
      var req = store.add(DEFAULT_CONFIG[i]);
      req.onsuccess = function(e) {
        // body...
        // console.log("added: ", e.target.result);
      };
      req.onerror = function(e) {
        // console.error("error: ", req.error.name);
      };
    };
  }

  function updateConfig(successCallback, errorCallback, inKey, inValue) {
    if (typeof successCallback === "function") {
      var tx = db.transaction(DB_STORE_SETTINGS, "readwrite");
      var store = tx.objectStore(DB_STORE_SETTINGS);
      var req = store.get(inKey);
      console.log("req", req);
      req.onsuccess = function(e) {
        req.result.value = inValue;
        console.log("req.result", req.result);
        var req2 = store.put(req.result);
        console.log("req2", req2);
        req2.onsuccess = function(e) {
          console.log("successfully updated");
          successCallback();
        }
        req2.onerror = function(e) {
          errorCallback(e.error.name);
        }
      }
      req.onerror = function(e) {
        errorCallback(e.error.name);
      }
    } else  {
      errorCallback("updateConfig successCallback should be a function");
    }
  }

  return {
    initiate: initiate,
    addTrack: addTrack,
    getTracks: getTracks,
    deleteTrack: deleteTrack,
    reset_app: reset_app,
    getConfig: getConfig,
    updateConfig: updateConfig,
    saveMap: saveMap,
    updateTrack: updateTrack
  };
}();
// });


/*

RunBikeHike
  tracks
    track_name
  
  settings = table
*/"use strict;"
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
    current_track.map = "";
    current_track.data = [];
    // Set the number of gps point
    nb_point = 0;
    console.log("current_track", current_track);
    return current_track;
  }

  function addNode(inNode, inDistance, inDuration) {
    // console.log("inNode", inNode);
    current_track.data.push(inNode);
    current_track.distance = inDistance;
    current_track.duration = inDuration;
    nb_point =+ 1;
  }

  function getDistance(lat, lon) {
    if (olat != null) {
      distance += __distanceFromPrev(olat, olon, lat, lon);
      // console.log("distance: ", distance);
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
// });"use strict;"
var ExportTrack = function() {

  var toGPX = function(inTrack) {
    var name = inTrack.name.replace(/&/g,"&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // console.log("exporting ", name);
    var data = "";
    data += "<?xml version='1.0' encoding='UTF-8'?>\n";
    data += "<gpx version='1.1'\n";
    data += "creator='Run, Bike, Hike - https://github.com/nicodel/Run-Bike-Hike'\n";
    data += "xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'\n";
    data += "xmlns='http://www.topografix.com/GPX/1/1'\n";
    data += "xsi:schemaLocation='http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd'>\n";
    data += "<metadata>\n";
    data += "<author><name>Nicolas Delebecque</name><link href='https://github.com/nicodel/'></link></author>";
    data += "<name>" + name + "</name>"
    data += "</metadata>";
    data += "<trk>\n<name>" + name + "</name>\n<trkseg>\n";
    for (var i = 0; i < inTrack.data.length; i++) {
      var row = inTrack.data[i];
      data += "<trkpt lat='" + row.latitude + "' lon='" + row.longitude + "'>\n";
      data += "\t<time>" + row.date + "</time>\n";
      data += ((row.altitude) && (row.altitude != "null"))?"\t<ele>" + row.altitude + "</ele>\n"                : "";
      data += (row.speed>=0) ? "\t<speed>" +row.speed+ "</speed>\n"         : "";
      data += (row.accuracy>0)?"\t<hdop>" + row.accuracy + "</hdop>\n"  : "";
      data += (row.vertAccuracy>0)?"\t<vdop>" + row.vertAccuracy + "</vdop>\n"    : "";
      data += "</trkpt>\n";
    }
    data += "</trkseg>\n</trk>\n";
    data += "</gpx>\n";
    // console.log("export done", data);
    return data;
  }

  var toSummary = function(inTrack) {
    var name = inTrack.name.replace(/&/g,"&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  return {
    toGPX: toGPX,
    toSummary: toSummary
  }
}();
/*
Mojotracker.prototype.createGPXContent = function(controller, result, waypoints, track, callback, type) {
    if (!result.rows){
        callback.errorHandler( $L("BAD base result"));
        Mojo.Log.error("BAD base result");
        return;
    }
  Mojo.Log.error("create export content...");

  name = track.name;
  safeDisplayName = track.display_name.replace(/&/g,"&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    try {
    var data = "";
    if (type == "kml"){
      data += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
      data += "<kml xmlns=\"http://www.opengis.net/kml/2.2\"\n";
      data += " xmlns:gx=\"http://www.google.com/kml/ext/2.2\"\n";
      data += " xmlns:kml=\"http://www.opengis.net/kml/2.2\" \n";
      data += " xmlns:atom=\"http://www.w3.org/2005/Atom\">\n";
      data += "<Document><name>"+safeDisplayName+"</name><open>1</open><Style id=\"path0Style\"><LineStyle><color>ffff4040</color><width>6</width></LineStyle></Style>\n";
      data += "  <StyleMap id=\"waypoint\"><IconStyle><scale>1.2</scale><Icon><href>http://maps.google.com/mapfiles/kml/pal4/icon61.png</href></Icon></IconStyle></StyleMap>\n";

      Mojo.Log.error("waypoints...");
      data += "<Folder><name>Waypoints</name><visibility>1</visibility><open>1</open>\n";
      for (var i = 0; i < waypoints.length; i++) {
        try{
          var row = waypoints.item(i);
          if ((!row.alt) || (row.alt == "null"))
            row.alt = 0;
          data += "<Placemark>\n<name>"+ row.title.replace(/&/g,"&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") +"</name>\n<visibility>1</visibility>\n"
          data += "<styleUrl>#waypoint</styleUrl>\n";
          data += "<description>"+ row.description.replace(/&/g,"&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") +"</description>\n";
          data += "<Point><coordinates>"+row.lon+","+row.lat+","+row.alt+"</coordinates></Point>\n</Placemark>\n";
        }catch(e){
          Mojo.Log.error("Error 1.2: "+e);
        }
      }
      data += "</Folder>\n";

      data += "<Folder><name>Tracks</name><Placemark><name>"+name+"</name><visibility>1</visibility><styleUrl>#path0Style</styleUrl><MultiGeometry><LineString><coordinates>\n";

      Mojo.Log.error("track...");
      setTimeout(this.appendContent.bind(this), 10,
             type,controller, name, data, result, 0,
             callback, 0);

    }else{
      // gpx
      data += "<?xml version='1.0' encoding='UTF-8'?>\n";
      data += "<gpx version='1.1'\n";
      data += "creator='MojoTracker - http://code.google.com/p/mojotracker/'\n";
      data += "xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'\n";
      data += "xmlns='http://www.topografix.com/GPX/1/1'\n";
      data += "xsi:schemaLocation='http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd'>\n";

      Mojo.Log.error("waypoints...");
      for (var i = 0; i < waypoints.length; i++) {
        try{
          var row = waypoints.item(i);

          data += "<wpt lat=\""+row.lat+"\" lon=\""+row.lon+"\">\n";
          if ((row.alt) && (row.alt != "null"))
            data += "\t<ele>"+row.alt+"</ele>\n";

          description = row.description.replace(/&/g,"&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          data += "\t<name>"+ row.title.replace(/&/g,"&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") +"</name>\n";
          data += "\t<cmt>"+description+"</cmt>\n";
          data += "\t<desc>"+description+"</desc>\n";
          data += "\t<time>" + row.time + "</time>\n";
          data += "</wpt>\n";

        }catch(e){
          Mojo.Log.error("Error 1.2: "+e);
        }
      }

      Mojo.Log.error("track...");
      data += "<trk>\n<name>" + safeDisplayName + "</name>\n<trkseg>\n";

      setTimeout(this.appendContent.bind(this), 10,
             type, controller, name, data, result, 0,
             callback, 0);
    }
    } catch (e) {
        Mojo.Log.error("error while build content "+e);
        callback.errorHandler("Error 2: "+e);
    }
}


Mojotracker.prototype.appendContent = function(type, controller, name, data, result, i, callback){
  var counter = 0;
  for (; i < result.rows.length && counter < 500; i++) {
    try {
      var row = result.rows.item(i);
      if (row.horizAccuracy <= Config.getInstance().getDiscardValue()){
        if (type == "kml"){
          data += "" + row.lon + "," + row.lat + ",";
          if ((!row.altitude) || (row.altitude == "null")){
            data += ""+lastAlt;
          }else{
            data += "" + row.altitude + " ";
            lastAlt = row.altitude;
          }
          data += "\n";
        }else{ // gpx
          data += "<trkpt lat='" + row.lat + "' lon='" + row.lon + "'>\n";
          data += "\t<time>" + row.time + "</time>\n";
          data += ((row.altitude) && (row.altitude != "null"))?"\t<ele>" + row.altitude + "</ele>\n"                : "";
          data += (row.velocity>=0) ? "\t<speed>" +row.velocity+ "</speed>\n"         : "";
          data += (row.horizAccuracy>0)?"\t<hdop>" + row.horizAccuracy + "</hdop>\n"  : "";
          data += (row.vertAccuracy>0)?"\t<vdop>" + row.vertAccuracy + "</vdop>\n"    : "";
          data += "</trkpt>\n";
        }
      }

      if (i % 10 == 0){
        callback.progress(i, result.rows.length, $L("building xml data (#{progress}/#{sum})...")
          .interpolate({progress: i, sum: result.rows.length }),
          name);
      }
    } catch (e) {
      Mojo.Log.error("Error 1: "+e);
    }
    counter ++;
  }

  Mojo.Log.error(type+" points... ("+i+"/"+result.rows.length+")");
  var suffix = ".gpx";
  if (i == result.rows.length){
    if (type == "kml"){
      data += "</coordinates></LineString></MultiGeometry></Placemark></Folder></Document></kml>\n";
      suffix = ".kml";
    }else{// gpx
      data += "</trkseg>\n</trk>\n";
      data += "</gpx>\n";
      suffix = ".gpx";
    }
    callback.progress(1,1, $L("xml data built..."), name);

    Mojo.Log.error("content is done... ("+data.length+")");
    setTimeout(this.writeGPXFile.bind(this), 100,
           controller, name, data,
           callback, 0, suffix);
  }else{
    setTimeout(this.appendContent.bind(this), 10,
           type, controller, name, data, result, i,
           callback, 0);
  }
}*/"use strict;"
// var Events = function() {

/******************
 * EVENT LISTENER *
*******************/

/*----------------- Home View -----------------*/
/* Home View Tracks button */
document.querySelector("#btn-tracks").addEventListener ("click", function () {
  Controller.displayTracks();
  document.getElementById("views").showCard(3);
});

/* Home View Start tracking button */
document.querySelector("#btn-start-stop").addEventListener ("click", function () {
  Controller.toggleWatch();
  // document.getElementById("views").showCard(1);
});

/* Home View settings button */
document.querySelector("#btn-settings").addEventListener ("click", function () {
  document.getElementById("views").showCard(0);
});

/*----------------- Infos View -----------------*/
/* Infos View Stop button */
// document.querySelector("#btn-stop").addEventListener ("click", function () {
//     document.getElementById("views").showCard(3);
// });

/* Infos Map button */
// document.querySelector("#btn-map").addEventListener ("click", function () {
//   console.log("flipping!");
//   document.getElementById("infos-flipbox").toggle();
//   Controller.flippingTrack(document.getElementById("infos-flipbox").flipped);
// });



/*-------- Stop tracking confirmation ------------*/
/* Stop tracking Confirm button */
document.querySelector("#btn-confirm-stop").addEventListener ("click", function () {
  document.getElementById("views").showCard(1);
    Controller.stopWatch();
});
/* Stop tracking Cancel button */
document.querySelector("#btn-cancel-stop").addEventListener ("click", function () {
  document.getElementById("views").showCard(1);
});
document.getElementById("stop-form-confirm").onsubmit = function() {return false;};

/*----------------- Settings View -----------------*/
/* Settings View Screen keep alive radio button */
document.querySelector("#screen").onchange = function () {
  Controller.savingSettings("screen", this.checked);
  Controller.toogleScreen(this.checked);
  console.log("this.checked", this.checked);
};
/* Settings View Language selection */
document.querySelector("#language").onchange = function() {
  var dom = document.querySelector("#language");
  var id = this.selectedIndex;
  Controller.savingSettings("language", dom[id].value);
  Controller.changeLanguage(dom[id].value);
  document.webL10n.setLanguage(dom[id].value);



};
/* Settings View Distance unit selection */
document.querySelector("#distance").onchange = function() {
  var dom = document.querySelector("#distance");
  var id = this.selectedIndex;
  Controller.savingSettings("distance", dom[id].value);
  Controller.changeDistance(dom[id].value);
};
/* Settings View Speed unit selection */
document.querySelector("#speed").onchange = function() {
  var dom = document.querySelector("#speed");
  var id = this.selectedIndex;
  Controller.savingSettings("speed", dom[id].value);
  Controller.changeSpeed(dom[id].value);
};
/* Settings View Position unit selection */
document.querySelector("#position").onchange = function() {
  var dom = document.querySelector("#position");
  var id = this.selectedIndex;
  Controller.savingSettings("position", dom[id].value);
  Controller.changePosition(dom[id].value);
};
/* Settings View Back button */
document.querySelector("#btn-settings-back").addEventListener ("click", function () {
  document.getElementById("views").showCard(1);
});


/*----------------- Tracks View -----------------*/
/* Tracks View Back button */
document.querySelector("#btn-tracks-back").addEventListener ("click", function () {
  document.getElementById("views").showCard(1);
});

/*----------------- Track Detail View -----------------*/
/* Track View Back button */
document.querySelector("#btn-track-back").addEventListener ("click", function () {
  Controller.displayTracks();
  document.getElementById("views").showCard(3);
});
/* Track View Delete button */
document.querySelector("#btn-delete").addEventListener ("click", function () {
  document.getElementById("views").showCard(5);
});
/* Track View Rename button */
document.querySelector("#btn-rename").addEventListener("click", function() {
  console.log("renaming");
  document.querySelector("#input-rename").value = Controller.getTrackName();
  document.getElementById("views").showCard(6);
});
/* Rename Cancel button */
document.querySelector("#btn-cancel-rename").addEventListener("click", function() {
  document.getElementById("views").showCard(4);
});
/* Rename Confirm button */
document.querySelector("#btn-confirm-rename").addEventListener("click", function() {
  document.getElementById("views").showCard(4);
  var new_name = document.querySelector("#input-rename");
  Controller.renameTrack(new_name.value);
});
/* Rename Clear button */
document.querySelector("#btn-clear-rename").addEventListener("click", function() {
  document.querySelector("#input-rename").value = "";
});
document.getElementById("rename-form").onsubmit = function() {return false;};

/* Don't take focus from the input field */
document.querySelector("#btn-clear-rename").addEventListener('mousedown', function(e) {
  e.preventDefault();
});

/* Track View Share button */
document.querySelector("#btn-share").addEventListener("click", function() {
  console.Log("exporting");
  document.getElementById("views").showCard(7);
  // setting it to default
  document.querySelector("#select-share").value = "local";
  /*document.querySelector("#toggle-share-summary").disabled = true;
  document.querySelector("#toggle-share-summary").checked = false;
  document.querySelector("#toggle-share-file").disabled = true;
  document.querySelector("#toggle-share-file").checked = true;*/
});

/*----------------- Track Share Form -----------------*/
/* Way to share a track selection */
/*document.querySelector("#select-share").onchange = function() {
  var dom = document.querySelector("#select-share");
  var id = this.selectedIndex;
  if (dom[id].value === "email") {
    console.log("sharing via email");
    document.querySelector("#toggle-share-summary").disabled = false;
    document.querySelector("#toggle-share-summary").checked = false;
    document.querySelector("#toggle-share-file").disabled = false;
    document.querySelector("#toggle-share-file").checked = false;
  } else if (dom[id].value === "twitter") {
    console.log("sharing via twitter");
    document.querySelector("#toggle-share-summary").disabled = true;
    document.querySelector("#toggle-share-summary").checked = true;
    document.querySelector("#toggle-share-file").disabled = true;
    document.querySelector("#toggle-share-file").checked = false;
  } else if (dom[id].value === "local") {
    console.log("sharing via local");
    document.querySelector("#toggle-share-summary").disabled = true;
    document.querySelector("#toggle-share-summary").checked = false;
    document.querySelector("#toggle-share-file").disabled = true;
    document.querySelector("#toggle-share-file").checked = true;
  };
};*/

/* Share Cancel button */
document.querySelector("#btn-cancel-share").addEventListener("click", function() {
  document.getElementById("views").showCard(4);
});
/* Share Confirm button */
document.querySelector("#btn-confirm-share").addEventListener("click", function() {
  var file, summary = false;
  if (document.querySelector("#toggle-share-file").value) {
    // export file
    file = true;
  } else if (document.querySelector("#toggle-share-summary").value) {
    // create summary
    summary = true;
  } else {
    // no selection made ???
  };
  var share = document.querySelector("#select-share").value;
  console.log("ready to share", share);
  document.getElementById("views").showCard(4);
  Controller.shareTrack(file, summary, share);
});
document.getElementById("share-form").onsubmit = function() {return false;};

/*----------------- Track Delete Confirmation -----------------*/
/* Delete Track Cancel button */
document.querySelector("#btn-cancel-delete").addEventListener("click", function () {
  document.getElementById("views").showCard(4);
});
/* Delete Track Confirm button */
document.querySelector("#btn-confirm-delete").addEventListener("click", function () {
  document.getElementById("views").showCard(3);
  Controller.deleteTrack();
});
document.getElementById("del-form-confirm").onsubmit = function() {return false;};




// }();





/* TEMPORARY TRACK SELECTION */
// document.querySelector("#TR-2014421-15195").addEventListener("click", function () {
//   document.getElementById("views").showCard(5);
//   Controller.displayTrack(testdata);
// });

document.querySelector("#dev-import").addEventListener("click", function () {
  Controller.importForDev();
});
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
    // if (inPosition.coords.accuracy < 50) {
      if (tracking) {
        // console.log("tracking");
        __addNewPoint(inPosition);
      } else {
        // console.log("not tracking");
        HomeView.updateInfos(inPosition, null);
      };
    // };
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
      // document.querySelector("#btn-start").className = "align-right danger big alternate";
      document.getElementById("btn-start-stop").innerHTML = _("stop");
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
    // document.querySelector("#btn-start").className = "align-right recommend big alternate";
    document.getElementById("btn-start-stop").innerHTML = _("start");
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

    if (Config.SCREEN_KEEP_ALIVE) {
      var lock = window.navigator.requestWakeLock('screen');
      window.addEventListener('unload', function () {
        lock.unlock();
      });
    };

  }
  function __getConfigError(inEvent) { console.log("__getConfigError ", inEvent); }

  function savingSettings(inKey, inValue) {
    settings[inKey] = inValue;
    //console.log("saving:", inKey + " " + inValue);
    //console.log("now settings:", settings);
    DB.updateConfig(__savingSettingsSuccess, __savingSettingsError, inKey, inValue);
  }

  function __savingSettingsSuccess() {
    console.log("YES !");
    DB.getConfig(__getConfigSuccess, __getConfigError);
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

  // function __setConfigView(inSettings) {
  //   // console.log("updating the settings DOM elements");
  //   document.getElementById("screen").checked = inSettings.screen;
  //   document.getElementById("language").value = inSettings.language;
  //   document.getElementById("distance").value = inSettings.distance;
  //   document.getElementById("speed").value = inSettings.speed;
  //   document.getElementById("position").value = inSettings.position;
  // }
  function __updateConfigValues(inSettings) {
    //console.log("setting settings :)", inSettings);
    for (var i = 0; i < Object.keys(inSettings).length; i++) {
      var param = Object.keys(inSettings)[i];
      // console.log("param", param);
      // console.log("inSettings[param]", inSettings[param]);
      if (param === "screen") {
        Config.change("SCREEN_KEEP_ALIVE", inSettings[param]);
      } else if (param === "language") {
        // Config.change("")
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
    document.getElementById("language").value = inSettings.language;
    document.getElementById("distance").value = inSettings.distance;
    document.getElementById("speed").value = inSettings.speed;
    document.getElementById("position").value = inSettings.position;

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
    utils.status.show(_("track-saved", {inEvent})); //"Track " + inEvent + " sucessfully saved.");
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
    if (inFile || inSummary) {
      if (inFile) {
        var gpx_track = ExportTrack.toGPX(displayed_track);
      };
      if (inSummary) {
        var sum_track = ExportTrack.toSummary(displayed_track);
      }
    } else {
      // ?? nothing selected ??
    };
    if (inShare === "email") {
      console.log("sharing on email");
      Share.toEmail(displayed_track, gpx_track);
    } else if (inShare === "twitter") {
      console.log("sharing on twitter");
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
"use strict;"
var RunBikeHike = function() {

  document.addEventListener('DOMComponentsLoaded', function(){
    var deck = document.getElementById("views");
    deck.showCard(1);

    var _ = document.webL10n.get;
    Controller.init()
  });
  
  /*if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
      return this.slice(0, str.length) == str;
    };
  };
  if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (str){
      return this.slice(-str.length) == str;
    };
  };*/
}();
