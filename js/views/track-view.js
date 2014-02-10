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

    document.getElementById("trk-date").innerHTML = Controller.userDate(inTrack.date);
    document.getElementById("trk-dist").innerHTML = Controller.userDistance(inTrack.distance);
    var d = inTrack.duration / 60000;
    document.getElementById("trk-dur").innerHTML = d.toFixed() +" min";
    
    var t = inTrack;
    t.min_alt = 0;
    t.max_alt = 0;
    t.max_speed = 0;
    t.min_speed = 0;
    t.av_speed = 0;
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
      t.av_speed = t.av_speed + speed_int;
    }
    console.log("t.av_speed",t.av_speed);
    t.av_speed = t.av_speed / inTrack.data.length;
    console.log("t.av_speed",t.av_speed);
    document.getElementById("trk-max-speed").innerHTML = Controller.userSpeed(t.max_speed);
    document.getElementById("trk-av-speed").innerHTML = Controller.userSpeed(t.av_speed);
    document.getElementById("trk-max-alt").innerHTML = Controller.userSmallDistance(t.max_alt);
    document.getElementById("trk-min-alt").innerHTML = Controller.userSmallDistance(t.min_alt);



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

    var max_y = Controller.userSpeedInteger(inData.max_speed);
    var min_y = Controller.userSpeedInteger(inData.min_speed);
    // console.log("max_y", max_y);
    // console.log("min_y",min_y);
    
    // Write Y Axis text
    var range = max_y - min_y;
    // range = range + (range * 0.2);
    range = range * 2;
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
    var value = Controller.userSpeedInteger(data[0].speed);
    c.moveTo(__getXPixel(0,data), __getYPixel(value, range));
    for(i=1;i<data.length;i+=espace) {
      var value = Controller.userSpeedInteger(data[i].speed);
      c.lineTo(__getXPixel(i,data), __getYPixel(value, range));
      c.stroke();
    }

    c.lineWidth = LINE_WIDTH;
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
      var SIZE = "&size=" + SCREEN_WIDTH + "," + SCREEN_WIDTH;
      var TYPE = "&type=map&imagetype=jpeg";
      var BASE_URL = "http://www.mapquestapi.com/staticmap/v4/getmap?key=Fmjtd%7Cluur21u720%2Cr5%3Do5-90tx9a&";


      var loc = BASE_URL + SIZE + TYPE + BESTFIT + PATH;

      document.getElementById("map-img").width = SCREEN_WIDTH;
      document.getElementById("map-img").onload = function () {
        document.querySelector("#map-text").classList.add("hidden");
        document.querySelector("#map-img").classList.remove("hidden");
        document.querySelector("#map-img").classList.remove("absolute");
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