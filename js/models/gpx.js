var GPX = function() {

  var T = {
    id: new Date().toISOString(),
    name: null,
    duration: 0,
    distance: 0,
    map: "",
    data: []
  };


  var load = function(inUrl, successCallback, failureCallback) {

    var req = new XMLHttpRequest();
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
    req.send(null);
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
    var metadata = x.getElementsByTagName("metadata");
    var time = metadata[0].getElementsByTagName("time");
    if (time.length > 0) {
      track.date = time[0].textContent;
    }

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
          var i = p.getElementsByTagName("time");
          if (i.length > 0) {
            point.date = i[0].textContent;
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

  return {
    load: load
  }



}();
