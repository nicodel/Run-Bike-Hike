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
    document.getElementById("trk-dist").innerHTML = a.v + " " + a.u;
    if (isNaN(inTrack.duration)) {
      document.getElementById("trk-dur").innerHTML = "-- min";
    } else {
      var d = inTrack.duration / 60000;
      document.getElementById("trk-dur").innerHTML = d.toFixed() + " min";
    }
 
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
      // t.av_speed = t.av_speed + speed_int;
    }
    t.av_speed = inTrack.distance / inTrack.duration;
    // console.log("t.av_speed",t.av_speed);
    // t.av_speed = t.av_speed / t.data.length;
    // console.log("t.max_speed",t.max_speed);
    // t.max_alt_speed = 15;
    // console.log("t.max_speed",t.max_speed);
    var a = Config.userSpeed(t.max_speed);
    document.getElementById("trk-max-speed").innerHTML = a.v + " " + a.u;
    var a = Config.userSpeed(t.av_speed);
    document.getElementById("trk-av-speed").innerHTML = a.v + " " + a.u;
    var a = Config.userSmallDistance(t.max_alt);
    document.getElementById("trk-max-alt").innerHTML = a.v + " " + a.u;
    var a = Config.userSmallDistance(t.min_alt);
    document.getElementById("trk-min-alt").innerHTML = a.v + " " + a.u;

    if (t.map) {
      console.log("map exist");
      var img = document.getElementById("map-img");
      img.width = SCREEN_WIDTH;
      img.src = window.URL.createObjectURL(t.map);
      img.onload = function(e) {
        window.URL.revokeObjectURL(this.src);
      }
      document.querySelector("#map-text").classList.add("hidden");
      document.querySelector("#track-spinner").classList.add("hidden");
      img.classList.remove("hidden");
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
      var d = new Date(data[i].date);
      var date = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
      c.textAlign = "center";
      c.fillStyle = "gray";
      if (i+xspace > data.length) {
        c.fillText(date, __getXPixel(i,data) - 15, SCREEN_HEIGHT - yPadding + 27);
      } else {
        c.fillText(date, __getXPixel(i,data), SCREEN_HEIGHT - yPadding + 27);
      }
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
        inTrack.map = blob;
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
