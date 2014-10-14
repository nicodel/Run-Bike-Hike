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
