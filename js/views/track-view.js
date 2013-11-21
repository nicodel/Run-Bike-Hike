var TrackView = function() {

  var gWidth = parseInt(window.innerWidth * 0.9,10);
  var gHeight = parseInt(gWidth * 2 / 3,10);
  // console.log("width", gWidth);
  // console.log("height", gHeight);
  var xPadding = 30;
  var yPadding = 30;

  var SPACE_BTW_POINTS = 5;
  var LINE_WIDTH = 1;
  var VALUE_COLOR = "#0560A6";
  var ACCURACY_COLOR = "#FF9200";

  function display(inTrack) {
    var tr = document.getElementById("tr-name");
    tr.innerHTML = inTrack.name;
    console.log("show track: ", inTrack);

    document.getElementById("trk-date").innerHTML = Config.userDate(inTrack.date);
    document.getElementById("trk-dist").innerHTML = Config.userDistance(inTrack.distance);
    var d = inTrack.duration / 60000;
    document.getElementById("trk-dur").innerHTML = d.toFixed() +" min";
    
    var t = inTrack;
    t.min_alt = null;
    t.max_alt = null;
    t.max_speed = null;
    t.start = null;
    t.end = null;

    //~ get min, max altitude, max speed, start and end time
    for (i=0; i<inTrack.data.length; i++) {
      var row = inTrack.data[i];
      // console.log("row.altitude ", row.altitude);
      // console.log("t.max_alt ", t.max_alt);
      if (t.min_alt === null || row.altitude < t.min_alt) {
        t.min_alt = row.altitude;
      }
      if (t.max_alt === null || row.altitude > t.max_alt) {
        t.max_alt = row.altitude;
      }
      if (t.max_speed === null || row.velocity > t.max_speed) {
        t.max_speed = row.velocity;
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
    // console.log("t.start", t.start);
    // console.log("t.end", t.end);
    __buildAltitudeGraph(t);
    __buildSpeedGraph(t);
    __buildMap(inTrack);
  }

  function __buildAltitudeGraph(inData) {
    data = inData.data;
    console.log("data.length", data.length);
    console.log("data", data);

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
    // console.log("max_y", max_y);
    // console.log("min_y",min_y);
    // console.log("max_acc",max_acc);
    
    // create a rectangular canvas with width and height depending on screen size
    // var graph = document.getElementById("alt-canvas");
    // var c = graph.getContext("2d");
    // c.clearRect(0, 0, gWidth, gHeight);
    // graph.setAttribute("width",gWidth);
    // graph.setAttribute("height",gHeight);
    
    // Write Y Axis text
    // c.textAlign = "right";
    // c.textBaseline = "middle";
    // calculate Y axis size
    var range = max_y - min_y;
    range = range + (range / 3);
    // calculate
    var yspace = parseInt(range / 4, 10);
    console.log("range", range);
    console.log("yspace",yspace);
    // var j = 0;
    // var i = 0;
    // for (t=0;t<4;t++) {
    //   c.fillText(parseInt(i,10), xPadding - 10, __getYPixel(j, range));
    //   c.beginPath();
    //   //~ c.lineWidth = 1;
    //   c.moveTo(xPadding, __getYPixel(j, range));
    //   c.lineTo(gWidth, __getYPixel(j, range));
    //   c.stroke();
    //   j += yspace;
    //   i += yspace;
    // }
    var c = __createRectCanvas("alt-canvas", range, yspace);
    
    var espace = parseInt(data.length / (gWidth - xPadding), 10);
    espace = espace * SPACE_BTW_POINTS; // increase spacing between points so that the chart looks smoother.
    console.log("espace", espace);
    // Draw vertAccuracy lines
    c.strokeStyle = ACCURACY_COLOR;
    c.lineWidth = LINE_WIDTH;
    c.beginPath();
    //~ var z = parseInt(getXPixel(data[0].altitude) - parseInt(data[0].vertAccuracy));
    var alt0 = parseInt(data[0].altitude, 10);
    var acc0 = parseInt(data[0].vertAccuracy, 10);
    var y1 = alt0 - acc0;
    var y2 = alt0 + acc0;
    if(y1<0) {y1=0;} // we don't want the lines to go under 0
    console.log("alt: "+ alt0 +" - acc: "+ acc0);
    console.log("y1: "+y1+" - y2: "+y2);
    c.moveTo(__getXPixel(0,data), __getYPixel(y1, range));
    c.lineTo(__getXPixel(0,data), __getYPixel(y2, range));
    for(i=1;i<data.length;i+=espace) {
      var alti = parseInt(data[i].altitude, 10);
      var acci = parseInt(data[i].vertAccuracy, 10);
      y1 = alti - acci;
      y2 = alti + acci;
      if(y1<0) {y1=0;} // we don't want the lines to go under 0
      c.moveTo(__getXPixel(i,data), __getYPixel(y1, range));
      c.lineTo(__getXPixel(i,data), __getYPixel(y2, range));
      c.stroke();
    }
    
    // Draw Altitude points
    c.strokeStyle = VALUE_COLOR;
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(__getXPixel(0,data), __getYPixel(data[0].altitude, range));
    for(i=1;i<data.length;i+=espace) {
      c.lineTo(__getXPixel(i,data), __getYPixel(data[i].altitude, range));
      //~ c.arc(getXPixel(i,data), getYPixel(data[i].altitude, range),1,0,1);
      c.stroke();
      //~ console.log("i: " + i + " - x: " + getXPixel(i, data) + " / y: " + getYPixel(data[i].altitude, range));
    }

    c.lineWidth = 1;
    c.strokeStyle = "#333";
    c.font = "italic 6pt sans-serif";
    c.textAlign = "center";
    
    // Draw X and Y Axis
    // c.beginPath();
    // c.moveTo(xPadding, 0);
    // c.lineTo(xPadding, gHeight - yPadding);
    // c.lineTo(gWidth, gHeight - yPadding);
    // c.stroke();
    
    // Write X Axis text and lines
    var xspace = data.length / 5;
    console.log("xspace",xspace);
    for (i=0;i<data.length;i+=xspace) {
      i = parseInt(i,10);
      //~ console.log("i",i);
      var date = new Date(data[i].date).getHours() + ":" + new Date(data[i].date).getMinutes();
      c.fillText(date, __getXPixel(i,data), gHeight - yPadding + 20);
      c.beginPath();
      c.strokeStyle  = "rgba(150,150,150, 0.5)";
      c.lineWidth = 1;
      c.moveTo(__getXPixel(i,data),0);
      c.lineTo(__getXPixel(i,data),gHeight - xPadding);
      c.stroke();
    }

    c.stroke();
    c.closePath();
  }

  function __buildSpeedGraph(data) {
    data = data.data;
    //~ console.log("data.length",data.length);
    //~ console.log("data",data);
    var max_acc = 0;
    var max_y = 0;
    var min_y = 0;
    for(i=0;i<data.length;i++) {
      if(parseInt(data[i].speed, 10) > max_y) {
        max_y = parseInt(data[i].speed, 10);
      }
      if(parseInt(data[i].speed, 10) < min_y) {
        min_y = parseInt(data[i].speed, 10);
      }
      //~ if(data[i].vertAccuracy > max_acc) {
        //~ var max_acc = data[i].vertAccuracy;
      //~ }
      //~ max_acc = max_acc / 2;
    }
    //~ console.log("max_y", max_y);
    //~ console.log("min_y",min_y);
    //~ console.log("max_acc",max_acc);
    
    // var graph = document.getElementById("speed-canvas");
    // var c = graph.getContext("2d");
    // c.clearRect(0, 0, gWidth, gHeight);
    // graph.setAttribute("width",gWidth);
    // graph.setAttribute("height",gHeight);
    
    // Write Y Axis text
    // c.textAlign = "right";
    // c.textBaseline = "middle";
    //~ max_v_acc = 30; // we need to take the vertical accuracy as an input
    var range = max_y - min_y;
    var yspace = parseInt(range / 4, 10);
    //~ console.log("range", (max_y+max_acc) - (min_y-max_acc));
    //~ console.log("yspace",yspace);
    // var j = 0;
    // var i = 0;
    // for (t=0;t<4;t++) {
    //   c.fillText(parseInt(i,10), xPadding - 10, __getYPixel(j, range));
    //   c.beginPath();
      //~ c.lineWidth = 1;
      // c.moveTo(xPadding, __getYPixel(j, range));
      // c.lineTo(gWidth, __getYPixel(j, range));
      // c.stroke();
      // j += yspace;
      // i += yspace;
    // }
    var c = __createRectCanvas("speed-canvas", range, yspace);
    
    var espace = parseInt(data.length / (gWidth - xPadding), 10);
    espace = espace * 5; // increase spacing between points so that the chart looks smoother.
    // Draw line
    c.strokeStyle = "#0560A6";
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(__getXPixel(0,data), __getYPixel(data[0].speed, range));
    for(i=1;i<data.length;i+=espace) {
      c.lineTo(__getXPixel(i,data), __getYPixel(data[i].speed, range));
      //~ c.arc(getXPixel(i,data), getYPixel(data[i].speed, range),1,0,1);
      c.stroke();
      //~ console.log("i: " + i + " - x: " + getXPixel(i, data) + " / y: " + getYPixel(data[i].altitude, range));
    }

    c.lineWidth = 1;
    c.strokeStyle = "#333";
    c.font = "italic 6pt sans-serif";
    c.textAlign = "center";
    
    // Draw X and Y Axis
    // c.beginPath();
    // c.moveTo(xPadding, 0);
    // c.lineTo(xPadding, gHeight - yPadding);
    // c.lineTo(gWidth, gHeight - yPadding);
    // c.stroke();
    
    // Write X Axis text and lines
    var xspace = data.length / 5;
    //~ console.log("xspace",xspace);
    for (i=0;i<data.length;i+=xspace) {
      i = parseInt(i,10);
      //~ console.log("i",i);
      var date = new Date(data[i].date).getHours() + ":" + new Date(data[i].date).getMinutes();
      c.fillText(date, __getXPixel(i,data), gHeight - yPadding + 20);
      c.beginPath();
      c.strokeStyle  = "rgba(150,150,150, 0.5)";
      c.lineWidth = 1;
      c.moveTo(__getXPixel(i,data),0);
      c.lineTo(__getXPixel(i,data),gHeight - xPadding);
      c.stroke();
    }
    c.stroke();
    c.closePath();
  }

  function __buildMap(inTrack) {
    var lat = inTrack.data[0].latitude;
    var lon = inTrack.data[0].longitude;
    var i = 0;
    var dw = "";
    for (i = 0; i< inTrack.data[0].length; i++) {
      lt = "&d0p"+ i + "lat=" + inTrack.data[0].latitude;
      ln = "&d0p"+ i + "lon=" + inTrack.data[0].longitude;
      dw = dw + ln + lt;
    }
    loc = "http://ojw.dev.openstreetmap.org/StaticMap/?lat="+ lat +"&lon="+ lon +"&mlat0="+ lat +"&mlon0="+ lon + dw + "&z=15&mode=Export&show=1";
    // {name: "mapImage", kind: "Image", style: "width: 100%;"},
    // this.$.mapImage.setSrc(loc);
    document.getElementById("map-img").src = loc;

  }

  function __createRectCanvas(inElementId, inRange, inSpace) {
    var graph = document.getElementById(inElementId);
    var c = graph.getContext("2d");
    c.clearRect(0, 0, gWidth, gHeight);
    graph.setAttribute("width",gWidth);
    graph.setAttribute("height",gHeight);

    c.textAlign = "right";
    c.textBaseline = "middle";
    var j = 0;
    var i = 0;
    for (t=0;t<4;t++) {
      c.fillText(parseInt(i,10), xPadding - 10, __getYPixel(j, inRange));
      c.beginPath();
      //~ c.lineWidth = 1;
      c.moveTo(xPadding, __getYPixel(j, inRange));
      c.lineTo(gWidth, __getYPixel(j, inRange));
      c.stroke();
      j += inSpace;
      i += inSpace;
    }
    c.beginPath();
    c.moveTo(xPadding, 0);
    c.lineTo(xPadding, gHeight - yPadding);
    c.lineTo(gWidth, gHeight - yPadding);
    c.stroke();

    return c;
  }

  function __getXPixel(val,data) {
    return ((gWidth - xPadding) / data.length) * val + xPadding;
  }
  function __getYPixel(val,range) {
    return gHeight - (((gHeight - yPadding) / range) * val) - yPadding;
  }

  return {
    display: display
  };

}();