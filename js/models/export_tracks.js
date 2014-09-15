"use strict;"
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
}*/