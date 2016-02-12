/* exported utils */
'use strict';

var utils = utils || {};

utils.GPX = function() {
  var olat      = null;
  var olon      = null;
  var distance  = 0;

  function importFile(inPath, callback) {
    olat      = null;
    olon      = null;
    distance  = 0;
    __parse(inPath, callback);
  }

  function exportToFile() {}

  function __parse(xml, callback) {
    // console.log('xml', xml);
    var track = {
      date      : '',
      name      : '',
      duration  : 0,
      distance  : 0,
      avg_speed : 0,
      calories  : 0,
      alt_max   : 0,
      alt_min   : 0,
      climb_pos : 0,
      climb_neg : 0,
      map       : false,
      data      : []
    };
    var missing_time,
        start_time,
        end_time;
    /*
     * Check if GPX file metadata contains time in order to défine track date.
     */
    var metadata = xml.getElementsByTagName('metadata');
    if (metadata.length > 0) {
      var time = metadata[0].getElementsByTagName('time');
      if (time.length > 0) {
        track.date = time[0].textContent;
      } else {
        missing_time = true;
      }
    } else {
      missing_time = true;
    }

    /*
     */
    var trk = xml.getElementsByTagName('trk');
    var t;
    if (trk.length > 0) {
      t = trk[0];
    } else {
      callback({error: true, res: 'no track found in loaded file'});
    }

    /*
     */
    var name = t.getElementsByTagName('name');
    if (name.length > 0) {
      track.name = name[0].textContent;
    } else {
      track.name = __nameIt();
    }

    var trkseg = t.getElementsByTagName('trkseg');
    var trkpt;
    var tag;
    var previous;
    if (trkseg.length > 0) {
      for (var seg_nb = 0; seg_nb < trkseg.length; seg_nb++) {
        track.data[seg_nb] = [];
        trkpt = trkseg[seg_nb].getElementsByTagName('trkpt');
        if (trkpt.length > 0) {
          for (var pt_nb = 0; pt_nb < trkpt.length; pt_nb++) {
            var point = {};
            var p = trkpt[pt_nb];
            point.latitude = parseFloat(p.getAttribute('lat'));
            point.longitude = parseFloat(p.getAttribute('lon'));
            point.distance = __getDistance(point.latitude, point.longitude);
            distance += point.distance;
            point.cumulDistance = distance;
            tag = p.getElementsByTagName('time');
            if (tag.length > 0) {
              point.date = tag[0].textContent;
              if (missing_time) {
                track.date = point.date;
                missing_time = false;
              }
              if (seg_nb === 0 && pt_nb === 0) {
                start_time = new Date(point.date);
              }
              end_time = new Date (point.date);
            } else {
              track.date = 0;
            }
            tag = p.getElementsByTagName('ele');
            if (tag.length > 0) {
              point.altitude = parseFloat(tag[0].textContent);
              var alt = point.altitude;
              if (track.alt_min === 0 || alt < track.alt_min) {
                track.alt_min = alt;
              }
              if (track.alt_max === 0 || alt > track.alt_max) {
                track.alt_max = alt;
              }
              // TODO manage the altitude in relation to vertical accuracy
              if (isNaN(previous)) {
                previous = alt;
              } else {
                if (alt > previous) {
                  track.climb_pos += (alt - previous);
                } else if (alt < previous) {
                  track.climb_neg += (previous - alt);
                }
                previous = alt;
              }
            } else {
              track.alt_max = null;
              track.alt_min = null;
            }

            tag = p.getElementsByTagName('speed');
            if (tag.length > 0) {
              point.speed = parseFloat(tag[0].textContent);
            }

            tag = p.getElementsByTagName('time');
            if (tag.length > 0) {
              point.date = new Date(tag[0].textContent);
            }

            tag = p.getElementsByTagName('hdop');
            if (tag.length > 0) {
              point.accuracy = parseFloat(tag[0].textContent);
            }

            tag = p.getElementsByTagName('vdop');
            if (tag.length > 0) {
              point.vertAccuracy = parseFloat(tag[0].textContent);
            }
            track.data[seg_nb].push(point);
          }
        } else {
          callback({error: true, res:'Could not parse trkpt from file'});
        }
      }
    } else {
      callback({error: true, res: 'Could not parse track segment from file'});
    }
    if (end_time && start_time) {
      track.duration = (end_time - start_time) / 1000;
    } else {
      track.duration = 0;
    }
    if (missing_time) {
      track.duration = null;
    }
    track.distance = distance;
    if (track.duration !== '') {
      track.avg_speed = track.distance / track.duration;
    }
    track.map = true;
    // console.log('track.data[0][5]', track.data[0][5]);
    callback({error: false, res: track});
  }

  function __nameIt() {
    // Build track name
    var d     = new Date();
    var year  = d.getFullYear();
    var month = d.getMonth() + 1;
    var day   = d.getDate();
    var hour  = d.getHours();
    var min   = d.getMinutes();
    var sec   = d.getSeconds();
    if (month < 10) {
      month = '0' + month.toString();
    }
    if (day < 10) {
      day = '0' + day.toString();
    }
    if (hour < 10) {
      hour = '0' + hour.toString();
    }
    if (min < 10) {
      min = '0' + min.toString();
    }
    if (sec < 10) {
      sec = '0' + sec.toString();
    }
    return 'TR-'+year+month+day+'-'+hour+min+sec;
  }

  function __getDistance(lat, lon) {
    var dist = 0;
    if (olat !== null) {
      dist = __distanceFromPrev(olat, olon, lat, lon);
    }
    olat = lat;
    olon = lon;
    return dist;
  }

  function __distanceFromPrev(lat1, lon1, lat2, lon2) {
    var lat1Rad = lat1*( Math.PI / 180);
    var lon1Rad = lon1*( Math.PI / 180);
    var lat2Rad = lat2*( Math.PI / 180);
    var lon2Rad = lon2*( Math.PI / 180);

    var dLat = lat2Rad - lat1Rad;
    var dLon = lon2Rad - lon1Rad;

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var R = 6371 * 1000; // Earth radius (mean) in metres {6371, 6367}
    return R * c;
  }

  return {
    importFile    : importFile,
    exportToFile  : exportToFile
  };
}();
