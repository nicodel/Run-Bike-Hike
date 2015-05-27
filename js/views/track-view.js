/* jshint browser: true, strict: true, devel: true, bitwise: false */
/* exported TrackView */
/* global _, Config */

var TrackView = function() {
  "use strict";

  // var SCREEN_WIDTH = parseInt(window.innerWidth * 0.9,10);
  var SCREEN_WIDTH = parseInt(window.innerWidth,10);
  var SCREEN_HEIGHT = parseInt(SCREEN_WIDTH * 2 / 3,10);
  // Only getting a big size map, that will be stored in db
  // var MAP_WIDTH = 648; // 720px * 0.9
  // var MAP_HEIGHT = 432; // 720px * 3 / 2
  // var MAP_WIDTH = SCREEN_WIDTH - 10;
  // var MAP_HEIGHT = MAP_WIDTH * 3 / 2;
  // console.log("width", SCREEN_WIDTH);
  // console.log("height", SCREEN_HEIGHT);
  var xPadding = 35;
  var yPadding = 30;

  var SPACE_BTW_POINTS = 5;
  var LINE_WIDTH = 2;
  var TEXT_STYLE = "8pt bold 'Fira Sans',sans-serif";
  var TEXT_COLOR = "#333";
  var ALT_LINE_COLOR = "#008000"; // Green
  var ALT_FILL_COLOR = "rgba(0,128,0,0.3)"; // Green
  var SP_LINE_COLOR = "#4169E1"; // RoyalBlue
  var SP_FILL_COLOR = "rgba(65,105,225, 0.3)"; // RoyalBlue

  function display(inTrack) {
    var i = 0;
    var localizedValue = {};
    console.log("inTrack in display", inTrack);
    //reset old ressources
    document.getElementById("trk-date").innerHTML = "";
    document.getElementById("trk-dist").innerHTML = "";
    document.getElementById("trk-dur").innerHTML = "";
    document.getElementById("map-img").src = "";

    var tr = document.getElementById("tr-name");
    tr.innerHTML = inTrack.name;

    if (inTrack.date === 0) {
      document.getElementById("trk-date").innerHTML = "--/--/--";
    } else {
      document.getElementById("trk-date").innerHTML = Config.userDate(inTrack.date);
    }
    localizedValue = Config.userDistance(inTrack.distance);
    document.getElementById("trk-dist").innerHTML = localizedValue.v + " " + localizedValue.u;
    if (isNaN(inTrack.duration) || inTrack.duration === 0) {
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
    t.nb_points = 0;

    //~ get min, max altitude, max speed, start and end time
    for (i=0; i<t.data.length; i++) {
      var seg = t.data[i];
      for (var j = 0; j < seg.length; j++) {
        t.nb_points++;
        var row = seg[j];
        // check if speed values are available within track
        if (row.speed) {
          var speed_int = parseFloat(row.speed);
          if (t.max_speed === 0 || speed_int > t.max_speed) {
            t.max_speed = speed_int;
          }
        } else {
          t.max_speed = null;
        }
        // check if altitude values are available within track
        if (row.altitude) {
          var alt_int = parseFloat(row.altitude);
          if (t.min_alt === 0 || alt_int < t.min_alt) {
            t.min_alt = alt_int;
          }
          if (t.max_alt === 0 || alt_int > t.max_alt) {
            t.max_alt = alt_int;
          }
        } else {
          t.max_alt = null;
          t.min_alt = null;
        }
        // check if date information are available within track
        if (row.date) {
          var dt = new Date(row.date).getTime();
          if (t.start === null || dt < t.start) {
            t.start = dt;
          }
          if (t.end === null || dt > t.end) {
            t.end = dt;
          }
        } else {
          t.start = null;
          t.end = null;
        }
      }
    }
    t.av_speed = inTrack.distance / inTrack.duration * 1000;
    localizedValue = Config.userSpeed(t.av_speed);
    document.getElementById("trk-av-speed").innerHTML = localizedValue.v + " " + localizedValue.u;
    localizedValue = Config.userSpeed(t.max_speed);
    document.getElementById("trk-max-speed").innerHTML = localizedValue.v + " " + localizedValue.u;
    localizedValue = Config.userSmallDistance(t.max_alt);
    document.getElementById("trk-max-alt").innerHTML = localizedValue.v + " " + localizedValue.u;
    localizedValue = Config.userSmallDistance(t.min_alt);
    document.getElementById("trk-min-alt").innerHTML = localizedValue.v + " " + localizedValue.u;

    if (t.map) {
      console.log("map exist");
      var img = document.getElementById("map-img");
      img.width = SCREEN_WIDTH;
      var URL = window.URL || window.webkitURL;
      img.src = URL.createObjectURL(t.map);
      img.onload = function() {
        window.URL.revokeObjectURL(this.src);
      };
      document.querySelector("#map-text").classList.add("hidden");
      document.querySelector("#track-spinner").classList.add("hidden");
      img.classList.remove("hidden");
    }/* else {
      console.log("map does not exist");
      __buildMap2(inTrack, saveMapCallback);
      // console.log("mapToSave.map", mapToSave.map);
    }*/
    // __buildMap2(inTrack, saveMapCallback);
    __buildGraphs(t);
  }

  function displayMap(blob) {
    /*
     * remove spinner and "waiting" text
     */
    document.querySelector("#map-text").classList.add("hidden");
    document.querySelector("#track-spinner").classList.add("hidden");
    /*
     * unhide imgage
     */
    var img = document.getElementById("map-img");
    img.classList.remove("hidden");
    /*
     * transform blob to displayable image
     */
    var URL = window.URL || window.webkitURL;
    var imgURL = URL.createObjectURL(blob);
    /*
     * display map in image
     */
    img.src = imgURL;
  }

  function updateName(inName) {
    console.log("updating");
    document.getElementById("tr-name").innerHTML = inName;
  }

  function __buildGraphs(inData) {
    var value;
    var time;
    var hour;
    var i;
    var nb_points;
    if (inData.start) {
      // Get the total duration of the track, including pauses
      var duration = inData.duration;
      // Calculate the number of seconds (= number of points)
      nb_points = duration / 1000;
    } else {
      nb_points = inData.nb_points;
    }
    // Calculate altitude range only if altitude available
    var alt_range = 0;
    var alt_yspace = 0;
    if (inData.max_alt) {
      alt_range = inData.max_alt + (inData.max_alt /3);
      // Calculate display space between altitude values
      alt_yspace = parseInt(alt_range / 4);
    }
    // Caluclate speed range
    var sp_range = 0;
    var sp_yspace = 0;
    if (inData.max_speed) {
      sp_range = Config.userSpeedInteger(inData.max_speed) -
        Config.userSpeedInteger(inData.min_speed);
      sp_range = sp_range * 2;
      // Calculate display space between speed values
      sp_yspace = parseInt(sp_range / 4, 10);
    }

    // Create the Canvas
    var c = __createRectCanvas("graphs-canvas", alt_range, alt_yspace, sp_range, sp_yspace);

    // Write the legends
    // 1: Altitude
    // 2: Speed
    // only display altitude information if altitude information are available
    if (inData.max_alt) {
      c.fillStyle = ALT_LINE_COLOR;
      value = Config.userSmallDistance(null);
      c.fillText(_("altitude") + " (" + value.u + ")", xPadding + 50, 8);
    }
    if (inData.max_speed) {
      c.fillStyle = SP_LINE_COLOR;
      value = Config.userSpeed(null);
      c.fillText(_("speed") + " (" + value.u + ")", xPadding + 50, 20);
    }
    c.stroke();

    // Calculate display space between time values
    var xspace;
    if (nb_points <= SPACE_BTW_POINTS) {
      xspace = nb_points;
    } else {
      xspace = parseInt(nb_points / SPACE_BTW_POINTS, 10);
    }
    // we calculate the ratio needed to display all data in available width
    var ratio = (SCREEN_WIDTH - xPadding -5) / nb_points;
    console.log('ratio', ratio);

    /* Draw the time values based on the first time recorded and the duration (nb_points)
    * TODO Manage tracks that does not contain time values, and replace them with distance
    */
    var date;
    if (inData.start) {
      // Get the first recorder time and convert it to a value in milliseconds since 1970...
      date = new Date(inData.data[0][0].date).valueOf();
    }
    for (i = 0; i < nb_points; i += xspace) {
      if (inData.start) {
        // increase hour by a xspace seconds
        time = new Date(date + (i * 1000));
        // Get time value to a prettier format
        hour = ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2);
      }
      // Define syles for display
      c.textAlign = "center";
      c.fillStyle = "gray";
      // calculate x coordinate. if last value, we move it to the left by 15
      var x_coord = xPadding + (i * ratio);
      var y_coord = SCREEN_HEIGHT - yPadding + 27;
      if (i + xspace > nb_points) {
        if (inData.start) {
          // Write time value to the canvas
          c.fillText(hour, parseInt(x_coord - 15), y_coord);
        }
        console.log('last one', SCREEN_WIDTH - 20);
        // draw vertical small lines
        c.beginPath();
        c.moveTo(SCREEN_WIDTH - 6, SCREEN_HEIGHT - yPadding + 15);
        c.lineTo(SCREEN_WIDTH - 6, SCREEN_HEIGHT - yPadding + 20);
        c.stroke();
      } else {
        if (inData.start) {
          c.fillText(hour, x_coord, y_coord);
        }
        // draw vertical small lines
        c.beginPath();
        c.moveTo(x_coord, SCREEN_HEIGHT - yPadding + 15);
        c.lineTo(x_coord, SCREEN_HEIGHT - yPadding + 20);
        c.stroke();
      }
    }
    if (inData.start) {
      __drawPoints(c, inData, alt_range, ratio, "altitude", ALT_LINE_COLOR, ALT_FILL_COLOR);
      __drawPoints(c, inData, sp_range, ratio, "speed", SP_LINE_COLOR, SP_FILL_COLOR);
    } else {
      __drawTimelessPoints(c, inData, alt_range, nb_points, "altitude", ALT_LINE_COLOR, ALT_FILL_COLOR);
      __drawTimelessPoints(c, inData, sp_range, nb_points, "speed", SP_LINE_COLOR, SP_FILL_COLOR);
    }
  }

  function __createRectCanvas(inElementId, inRangeAlt, inSpaceAlt, inRangeSp, inSpaceSp) {
    console.log('createRectCanvas inputs', inElementId, inRangeAlt, inSpaceAlt, inRangeSp, inSpaceSp);
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
    var t = 0;
    for (t=0 ; t<4 ; t++) {
      var alt = Config.userSmallDistance(parseInt(alt_x,10));
      c.fillText(alt.v, xPadding - 10, __getYPixel(alt_y, inRangeAlt) - 6);
      c.fillStyle = SP_LINE_COLOR;
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
    }
    c.beginPath();
    c.moveTo( xPadding,SCREEN_HEIGHT - yPadding + 15);
    c.lineTo(SCREEN_WIDTH - 5,SCREEN_HEIGHT - yPadding + 15);
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
/*  function __getDistance (lat1, lon1, lat2, lon2) {
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
    var horizRad = (latCircleR === 0 ? 0 : horizontal / latCircleR);
    var vertRad = vertical / radius;

    latRad -= vertRad;
    lonRad += horizRad;

    return {
      lat : (latRad / (Math.PI / 180)),
      lon : (lonRad / (Math.PI / 180))
    };
  }*/

  function __drawPoints(c, inData, range, ratio, value, LINE_COLOR, FILL_COLOR) {
    // set the line color
    c.strokeStyle = LINE_COLOR;
    // set the line width
    c.lineWidth = LINE_WIDTH;
    // record the first date of the track
    var initial_time = new Date(inData.data[0][0].date).valueOf();
    var y;
    var x;
    var segment;
    var segment_initial_x;
    var segment_initial_y;
    var previous = 0;
    var zero = SCREEN_HEIGHT - yPadding;
    for (var seg = 0; seg < inData.data.length; seg++) {
      segment = inData.data[seg];
      c.beginPath();
      // record the initial X coordinate (based on time) for this segment
      segment_initial_x = ((new Date(segment[0].date).valueOf() - initial_time) / 1000) * ratio;
      // record the initial Y coordinate for this segment
      segment_initial_y = __getYPixel(segment[0][value], range);
      // move to original point of the current segment
      c.moveTo(segment_initial_x + xPadding, segment_initial_y);
      for (var i = 0; i < segment.length; i++) {
        x = ((new Date(segment[i].date).valueOf() - initial_time) / 1000) * ratio;
        if (value === "speed") {
          y = __getYPixel(Config.userSpeedInteger(segment[i][value]), range);
        } else {
          y = __getYPixel(segment[i][value], range);
        }
        // only display the current point if it is distant of 1 pixel from the previous one
        if (x > previous + 2) {
          previous = x;
          x = x + xPadding;
          c.lineTo(x, y, range);
        } else if (seg === inData.data.length - 1 && i === segment.length - 1) {
          x = SCREEN_WIDTH - 6;
          c.lineTo(x, y, range);
        } else if (i === segment.length - 1){
          x = x + xPadding;
          c.lineTo(x, y, range);
        }
      }
      c.lineTo(x, zero);
      c.lineTo(segment_initial_x + xPadding, zero);
      c.lineTo(segment_initial_x + xPadding, segment_initial_y);
      c.fillStyle = FILL_COLOR;
      c.fill();
      c.stroke();
    }
  }

  function __drawTimelessPoints(c, inData, range, nb_points, value, LINE_COLOR, FILL_COLOR) {
    // set the line color
    c.strokeStyle = LINE_COLOR;
    // set the line width
    c.lineWidth = LINE_WIDTH;
    var y;
    var x;
    var segment;
    var segment_initial_x;
    var segment_initial_y;
    var zero = SCREEN_HEIGHT - yPadding;
    // calculate space bteween points
    var ratio;
    var screen_available = SCREEN_WIDTH - xPadding - 5;
    if (nb_points <= SPACE_BTW_POINTS) {
      ratio = 1;
    } else if (nb_points < screen_available) {
      ratio = parseInt(screen_available / nb_points, 10);
    } else {
      ratio = parseInt(nb_points / screen_available, 10) * SPACE_BTW_POINTS;
    }

    for(var seg = 0; seg < inData.data.length; seg++) {
      segment = inData.data[seg];
      c.beginPath();
      // record the initial X coordinate (based on time) for this segment
      segment_initial_x = 0;
      // record the initial Y coordinate for this segment
      segment_initial_y = __getYPixel(segment[0][value], range);
      // move to original point of the current segment
      c.moveTo(segment_initial_x + xPadding, segment_initial_y);

      for (var i = 1; i < segment.length; i+=ratio) {
        x = __getXPixel(i, segment);
        // x = __getXPixel(pt,data[j]);
        if (value === "speed") {
          y = __getYPixel(Config.userSpeedInteger(segment[i][value]), range);
        } else {
          y = __getYPixel(segment[i][value], range);
        }
        c.lineTo(x, __getYPixel(segment[i][value], range));
      }
      c.lineTo(x, zero);
      c.lineTo(segment_initial_x + xPadding, zero);
      c.lineTo(segment_initial_x + xPadding, segment_initial_y);
      c.fillStyle = FILL_COLOR;
      c.fill();
      c.stroke();
    }
  }

  return {
    display: display,
    updateName: updateName,
    displayMap: displayMap
  };

}();
