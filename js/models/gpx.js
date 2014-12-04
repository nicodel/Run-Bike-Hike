var GPX = function() {

  var T = {
    id: new Date().toISOString(),
    name: null,
    duration: 0,
    distance: 0,
    map: "",
    data: []
  };
  var olat = null;
  var olon = null;
  var distance = 0;

  var load = function(inFile, successCallback, failureCallback) {
    console.log("load inFile:", inFile);
    var n = "rbh/import/" + inFile.name.match(/[-_\w]+[.][\w]+$/i)[0];
    var reader = new FileReader(); 
    reader.onloadend = function(e) {
      var p = new DOMParser();
      __parse(p.parseFromString(reader.result, "text/xml"), successCallback, failureCallback);
    }
    reader.onerror = function(e) {
      console.log("reader error:", e);
      failureCallback(_("error-reading-file", {file:inFile.name.match(/[-_\w]+[.][\w]+$/i)[0], error:e.target.result}));
    }
    reader.readAsText(inFile);

/*    var req = new XMLHttpRequest();
    req.onprogress = function(e) {
      var percentComplete = (e.position /e.totalSize)*100
    };
    req.open("GET", inUrl, true);
    req.onload = function(e) {
      var xml = e.target.responseXML;
      console.log("result", xml);
      // console.log("result text", e.target.responseText);
      __parse(xml, successCallback, failureCallback);
    }
    req.onerror = function(e) {
      failureCallback(e.target.status);
    }
    req.send(null);*/
  }

  var verify = function(inFile, successCallback, failureCallback) {
    // console.log("get name for", inFile.name.match(/[-_\w]+[.][\w]+$/i)[0]);
    var n = "rbh/import/" + inFile.name.match(/[-_\w]+[.][\w]+$/i)[0];
    // console.log("loading file", n);
    var reader = new FileReader(); 
    reader.onloadend = function(e) {
      // console.log("reader success", reader.result);
      var p = new DOMParser();
      var x = p.parseFromString(reader.result, "text/xml");

      var metadata = x.getElementsByTagName("metadata");
      var time = metadata[0].getElementsByTagName("time");
      var trk = x.getElementsByTagName("trk");
      if (trk.length > 0) {
        successCallback(inFile);
        t = trk[0];
      } else {
        failureCallback(_("no-track-in-file", {file:inFile.name.match(/[-_\w]+[.][\w]+$/i)[0]}));
      }
    }
    reader.onerror = function(e) {
      console.log("reader error:", e);
      failureCallback(_("error-reading-file", {file:inFile.name.match(/[-_\w]+[.][\w]+$/i)[0], error:e.target.result}));
    }
    reader.readAsText(inFile);
  }

  var __parse = function(x, successCallback, failureCallback) {
    var track = {
      id: new Date().toISOString(),
      name: null,
      duration: 0,
      distance: 0,
      map: "",
      date: "",
      data: []
    };
    var missing_date,
        tstart,
        tend;
    var metadata = x.getElementsByTagName("metadata");
    var time = metadata[0].getElementsByTagName("time");
    if (time.length > 0) {
      track.date = time[0].textContent;
    } else {
      missing_time = true;
    };

    var t;
    var trk = x.getElementsByTagName("trk");
    if (trk.length > 0) {
      t = trk[0];
    } else {
      failureCallback("no track found in loaded file");
    }

    var name = t.getElementsByTagName("name");
    if (name.length > 0) {
      track.name = name[0].textContent;
    } else {
      track.name = __named();
    }
    var trkseg = t.getElementsByTagName("trkseg");
    if (trkseg.length > 0) {
      var trkpt = trkseg[0].getElementsByTagName("trkpt");
      // console.log("trkseg", trkseg);
      // console.log("trkpt.lentgh", trkpt.length);
      if (trkpt.length > 0) {
        for (var j = 0; j < trkpt.length; j++) {
          var point = {}
          var p = trkpt[j];
          point.latitude = p.getAttribute("lat");
          point.longitude = p.getAttribute("lon");
          distance = __getDistance(point.latitude, point.longitude);
          var i = p.getElementsByTagName("time");
          if (i.length > 0) {
            point.date = i[0].textContent;
            if (missing_time) {
              track.date = point.date;
              missing_time = false;
            };
            if (j === 0) {
            tstart = new Date(point.date);
            };
            tend = new Date (point.date);
          } else {
            track.date = 0;
          }
          var i = p.getElementsByTagName("ele");
          if (i.length > 0) {
            point.altitude = i[0].textContent;
          }

          var i = p.getElementsByTagName("speed");
          if (i.length > 0) {
            point.speed = i[0].textContent;
          }

          var i = p.getElementsByTagName("time");
          if (i.length > 0) {
            point.date = i[0].textContent;
          }
          
          var i = p.getElementsByTagName("hdop");
          if (i.length > 0) {
            point.accuracy = i[0].textContent;
          }

          var i = p.getElementsByTagName("vdhop");
          if (i.length > 0) {
            point.vertAccuracy = i[0].textContent;
          }
          // console.log("point", point);
          track.data.push(point);
        };
      } else {
        failureCallback("Could not parse trkpt from file")
      }
    } else {
      failureCallback("Could not parse track segment from file");
    }
    if (tend && tstart) {
      track.duration = tend - tstart;
    } else {
      track.duration = 0;
    }
    track.distance = distance;
    successCallback(track);
  }

  var __named =  function() {
    // Build track name
    var d = new Date();
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

    return "TR-"+year+month+day+"-"+hour+min+sec;
  }

  var __getDistance = function(lat, lon) {
    // console.log("__getDistance");
    // console.log("olat", olat);
    if (olat != null) {
      distance += __distanceFromPrev(olat, olon, lat, lon);
    };
    olat = lat;
    olon = lon;
    // console.log("calc distance: ", distance);
    return distance;
  }

  var __distanceFromPrev = function(lat1, lon1, lat2, lon2) {
    // console.log("__getDistanceFromPrev");
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
    load: load,
    verify: verify
  }



}();
