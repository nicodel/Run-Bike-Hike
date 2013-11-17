var TrackView = function() {

  var gWidth = parseInt(window.innerWidth * 0.9,10);
  var gHeight = parseInt(gWidth * 2 / 3,10);
  // console.log("width", gWidth);
  // console.log("height", gHeight);
  var xPadding = 30;
  var yPadding = 30;

  function display(inTrack) {
    var tr = document.getElementById("tr-name");
    tr.innerHTML = inTrack.name;
    console.log("show track: ", inTrack);

    document.getElementById("trk-date").innerHTML = Config.userDate(inTrack.date);
    document.getElementById("trk-dist").innerHTML = Config.userDistance(inTrack.distance);
    document.getElementById("trk-dur").innerHTML = inTrack.duration / 60000 +" min";
    
    var t = inTrack;
    t.min_alt = null;
    t.max_alt = null;
    t.max_speed = null;
    t.start = null;
    t.end = null;

    //~ get min, max altitude, max speed, start and end time
    for (i=0; i<inTrack.data.length; i++) {
      var row = inTrack.data[i];
      if (t.min_alt === null || row.altitude < t.min_alt) {t.min_alt = row.altitude;}
      if (t.max_alt === null || row.altitude > t.max_alt) {t.max_alt = row.altitude;}
      if (t.max_speed === null || row.velocity > t.max_speed) {t.max_speed = row.velocity;}
      var d = new Date(row.date).getTime();
      if (t.start === null || d < t.start) {t.start = d;}
      if (t.end === null || d > t.end) {t.end = d;}
    }
    //~ console.log("t.start", t.start);
    //~ console.log("t.end", t.end);
    __buildAltitudeGraph(t);
    __buildSpeedGraph(t);
  }

  function __buildAltitudeGraph(data) {
    data = data.data;
    // console.log("data.length", data.length);
    // console.log("data", data);
    var max_acc = 0;
    var max_y = 0;
    var min_y = 0;
    for(i=0;i<data.length;i++) {
      if(data[i].coords.altitude > max_y) {
        max_y = data[i].coords.altitude;
      }
      if(data[i].coords.altitude < min_y) {
        min_y = data[i].coords.altitude;
      }
      if(data[i].coords.altitudeAccuracy > max_acc) {
        max_acc = data[i].coords.altitudeAccuracy;
      }
      max_acc = max_acc / 2;
    }
    //~ console.log("max_y", max_y);
    //~ console.log("min_y",min_y);
    //~ console.log("max_acc",max_acc);
    
    var graph = document.getElementById("alt-canvas");
    var c = graph.getContext("2d");
    c.clearRect(0, 0, gWidth, gHeight);
    graph.setAttribute("width",gWidth);
    graph.setAttribute("height",gHeight);
    
    // Write Y Axis text
    c.textAlign = "right";
    c.textBaseline = "middle";
    //~ max_v_acc = 30; // we need to take the vertical accuracy as an input
    var range = (max_y+max_acc) - (min_y-max_acc);
    var yspace = parseInt(range / 4, 10);
    //~ console.log("range", (max_y+max_acc) - (min_y-max_acc));
    //~ console.log("yspace",yspace);
    var j = 0;
    var i = 0;
    for (t=0;t<4;t++) {
      c.fillText(parseInt(i,10), xPadding - 10, __getYPixel(j, range));
      c.beginPath();
      //~ c.lineWidth = 1;
      c.moveTo(xPadding, __getYPixel(j, range));
      c.lineTo(gWidth, __getYPixel(j, range));
      c.stroke();
      j += yspace;
      i += yspace;
    }
    
    var espace = parseInt(data.length / (gWidth - xPadding), 10);
    espace = espace * 5; // increase spacing between points so that the chart looks smoother.
    //~ console.log("espace", espace);
    // Draw error lines
    c.strokeStyle = "#FF9200";
    c.lineWidth = 3;
    c.beginPath();
    //~ var z = parseInt(getXPixel(data[0].coords.altitude) - parseInt(data[0].coords.altitudeAccuracy));
    var alt0 = data[0].coords.altitude;
    var acc0 = data[0].coords.altitudeAccuracy;
    var y1 = alt0 - acc0;
    var y2 = alt0 + acc0;
    if(y1<0) {y1=0;} // we don't want the lines to go under 0
    //~ console.log("alt: "+data[0].coords.altitude+" - acc: "+data[0].coords.altitudeAccuracy);
    //~ console.log("y1: "+y1+" - y2: "+y2);
    c.moveTo(__getXPixel(0,data), __getYPixel(y1, range));
    c.lineTo(__getXPixel(0,data), __getYPixel(y2, range));
    for(i=1;i<data.length;i+=espace) {
      var alti = data[i].coords.altitude;
      var acci = data[i].coords.altitudeAccuracy;
      y1 = alti - acci;
      y2 = alti + acci;
      if(y1<0) {y1=0;} // we don't want the lines to go under 0
      c.moveTo(__getXPixel(i,data), __getYPixel(y1, range));
      c.lineTo(__getXPixel(i,data), __getYPixel(y2, range));
      c.stroke();
    }
    
    // Draw line
    c.strokeStyle = "#0560A6";
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(__getXPixel(0,data), __getYPixel(data[0].coords.altitude, range));
    for(i=1;i<data.length;i+=espace) {
      c.lineTo(__getXPixel(i,data), __getYPixel(data[i].coords.altitude, range));
      //~ c.arc(getXPixel(i,data), getYPixel(data[i].coords.altitude, range),1,0,1);
      c.stroke();
      //~ console.log("i: " + i + " - x: " + getXPixel(i, data) + " / y: " + getYPixel(data[i].coords.altitude, range));
    }

    c.lineWidth = 1;
    c.strokeStyle = "#333";
    c.font = "italic 8pt sans-serif";
    c.textAlign = "center";
    
    // Draw X and Y Axis
    c.beginPath();
    c.moveTo(xPadding, 0);
    c.lineTo(xPadding, gHeight - yPadding);
    c.lineTo(gWidth, gHeight - yPadding);
    c.stroke();
    
    // Write X Axis text and lines
    var xspace = data.length / 5;
    //~ console.log("xspace",xspace);
    for (i=0;i<data.length;i+=xspace) {
      i = parseInt(i,10);
      //~ console.log("i",i);
      var date = new Date(data[i].timestamp).getHours() + ":" + new Date(data[i].timestamp).getMinutes();
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
      if(data[i].coords.speed > max_y) {
        max_y = data[i].coords.speed;
      }
      if(data[i].coords.speed < min_y) {
        min_y = data[i].coords.speed;
      }
      //~ if(data[i].coords.altitudeAccuracy > max_acc) {
        //~ var max_acc = data[i].coords.altitudeAccuracy;
      //~ }
      //~ max_acc = max_acc / 2;
    }
    //~ console.log("max_y", max_y);
    //~ console.log("min_y",min_y);
    //~ console.log("max_acc",max_acc);
    
    var graph = document.getElementById("speed-canvas");
    var c = graph.getContext("2d");
    c.clearRect(0, 0, gWidth, gHeight);
    graph.setAttribute("width",gWidth);
    graph.setAttribute("height",gHeight);
    
    // Write Y Axis text
    c.textAlign = "right";
    c.textBaseline = "middle";
    //~ max_v_acc = 30; // we need to take the vertical accuracy as an input
    var range = (max_y+max_acc) - (min_y-max_acc);
    var yspace = parseInt(range / 4, 10);
    //~ console.log("range", (max_y+max_acc) - (min_y-max_acc));
    //~ console.log("yspace",yspace);
    var j = 0;
    var i = 0;
    for (t=0;t<4;t++) {
      c.fillText(parseInt(i,10), xPadding - 10, __getYPixel(j, range));
      c.beginPath();
      //~ c.lineWidth = 1;
      c.moveTo(xPadding, __getYPixel(j, range));
      c.lineTo(gWidth, __getYPixel(j, range));
      c.stroke();
      j += yspace;
      i += yspace;
    }
    
    var espace = parseInt(data.length / (gWidth - xPadding), 10);
    espace = espace * 5; // increase spacing between points so that the chart looks smoother.
    // Draw line
    c.strokeStyle = "#0560A6";
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(__getXPixel(0,data), __getYPixel(data[0].coords.speed, range));
    for(i=1;i<data.length;i+=espace) {
      c.lineTo(__getXPixel(i,data), __getYPixel(data[i].coords.speed, range));
      //~ c.arc(getXPixel(i,data), getYPixel(data[i].coords.speed, range),1,0,1);
      c.stroke();
      //~ console.log("i: " + i + " - x: " + getXPixel(i, data) + " / y: " + getYPixel(data[i].coords.altitude, range));
    }

    c.lineWidth = 1;
    c.strokeStyle = "#333";
    c.font = "italic 8pt sans-serif";
    c.textAlign = "center";
    
    // Draw X and Y Axis
    c.beginPath();
    c.moveTo(xPadding, 0);
    c.lineTo(xPadding, gHeight - yPadding);
    c.lineTo(gWidth, gHeight - yPadding);
    c.stroke();
    
    // Write X Axis text and lines
    var xspace = data.length / 5;
    //~ console.log("xspace",xspace);
    for (i=0;i<data.length;i+=xspace) {
      i = parseInt(i,10);
      //~ console.log("i",i);
      var date = new Date(data[i].timestamp).getHours() + ":" + new Date(data[i].timestamp).getMinutes();
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