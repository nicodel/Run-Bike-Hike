/* jshint browser: true, strict: true, devel: true */
/* exported GPX */

var GPX = function() {
  'use strict';

  var olat = null;
  var olon = null;
  var distance = 0;

  var load = function(inFile, successCallback, failureCallback) {
    olat = null;
    olon = null;
    distance = 0;
    // var n = 'rbh/import/' + inFile.name.match(/[^/]+$/i)[0];
    __parse(inFile,
        successCallback,
        failureCallback);

  };

  var __parse = function(x, successCallback, failureCallback) {
    var track = {
      id: new Date().toISOString(),
      name: null,
      duration: 0,
      distance: 0,
      map: '',
      date: '',
      data: []
    };
    var missing_time,
        tstart,
        tend,
        time;
    var metadata = x.getElementsByTagName('metadata');
    if (metadata.length > 0) {
      time = metadata[0].getElementsByTagName('time');
      if (time.length > 0) {
      track.date = time[0].textContent;
      } else {
        missing_time = true;
      }
    } else {
      missing_time = true;
    }

    var t;
    var trk = x.getElementsByTagName('trk');
    if (trk.length > 0) {
      t = trk[0];
    } else {
      failureCallback('no track found in loaded file');
    }

    var name = t.getElementsByTagName('name');
    if (name.length > 0) {
      track.name = name[0].textContent;
    } else {
      track.name = __named();
    }
    time = t.getElementsByTagName('name');
    if (time.length > 0) {
      track.date = time[0].textContent;
    } else {
      missing_time = true;
    }

    var trkseg = t.getElementsByTagName('trkseg');
    var trkpt;
    var tag;
    if (trkseg.length > 0) {
      for (var seg_nb = 0; seg_nb < trkseg.length; seg_nb++) {
        console.log('track.data', track.data);
        track.data[seg_nb] = [];
        trkpt = trkseg[seg_nb].getElementsByTagName('trkpt');
        if (trkpt.length > 0) {
          for (var pt_nb = 0; pt_nb < trkpt.length; pt_nb++) {
            var point = {};
            var p = trkpt[pt_nb];
            point.latitude = p.getAttribute('lat');
            point.longitude = p.getAttribute('lon');
            distance = __getDistance(point.latitude, point.longitude);
            tag = p.getElementsByTagName('time');
            if (tag.length > 0) {
              point.date = tag[0].textContent;
              if (missing_time) {
                track.date = point.date;
                missing_time = false;
              }
              if (seg_nb === 0 && pt_nb === 0) {
                tstart = new Date(point.date);
              }
              tend = new Date (point.date);
            } else {
              track.date = 0;
            }
            tag = p.getElementsByTagName('ele');
            if (tag.length > 0) {
              point.altitude = tag[0].textContent;
            }

            tag = p.getElementsByTagName('speed');
            if (tag.length > 0) {
              point.speed = tag[0].textContent;
            }

            tag = p.getElementsByTagName('time');
            if (tag.length > 0) {
              point.date = tag[0].textContent;
            }

            tag = p.getElementsByTagName('hdop');
            if (tag.length > 0) {
              point.accuracy = tag[0].textContent;
            }

            tag = p.getElementsByTagName('vdhop');
            if (tag.length > 0) {
              point.vertAccuracy = tag[0].textContent;
            }
            // console.log('point', point);
            track.data[seg_nb].push(point);
          }
        } else {
          failureCallback('Could not parse trkpt from file');
        }
      }
    } else {
      failureCallback('Could not parse track segment from file');
    }
    if (tend && tstart) {
      track.duration = tend - tstart;
    } else {
      track.duration = 0;
    }
    track.distance = distance;
    successCallback(track);
  };

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
  };

  var __getDistance = function(lat, lon) {
    // console.log('__getDistance');
    // console.log('olat', olat);
    if (olat !== null) {
      distance += __distanceFromPrev(olat, olon, lat, lon);
    }
    olat = lat;
    olon = lon;
    // console.log('calc distance: ', distance);
    return distance;
  };

  var __distanceFromPrev = function(lat1, lon1, lat2, lon2) {
    // console.log('__getDistanceFromPrev');
    var lat1Rad = lat1*( Math.PI / 180);
    // console.log('lat1Rad: ', lat1Rad);
    var lon1Rad = lon1*( Math.PI / 180);
    var lat2Rad = lat2*( Math.PI / 180);
    var lon2Rad = lon2*( Math.PI / 180);

    var dLat = lat2Rad - lat1Rad;
    // console.log('dLat: ', dLat);
    var dLon = lon2Rad - lon1Rad;

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var R = 6371 * 1000; // Earth radius (mean) in metres {6371, 6367}
    // console.log('R*c: ', R*c);
    return R * c;
  };


  var create = function(inTrack) {
    var name = inTrack.name.replace(/&/g,'&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // console.log('exporting ', name);
    var data = '';
    data += '<?xml version="1.0" encoding="UTF-8"?>\n';
    data += '<gpx version="1.1"\n';
    data += 'creator="Run, Bike, Hike - https://github.com/nicodel/Run-Bike-Hike"\n';
    data += 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
    data += 'xmlns="http://www.topografix.com/GPX/1/1"\n';
    data += 'xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n';
    data += '<metadata>\n';
    data += '<author><name>Nicolas Delebecque</name><link href="https://github.com/nicodel/"></link></author>';
    data += '<name>' + name + '</name>';
    data += '<time>' + new Date().toISOString() + '</time>';
    data += '</metadata>';
    data += '<trk>\n<name>' + name + '</name>\n<trkseg>\n';
    var track = inTrack.data;
    // Checking if the track was recorded before or after RBH support multi-segment within a track.
    if (!track.latitude) {
      // old track
      for (var s = 0; s < track.data.length; s++) {
        var seg = track.data[s];
        data += '<trkseg>\n';
        for (var j = 0; j < seg.length; j++) {
          data += '<trkpt lat="' + row.latitude + '" lon="' + row.longitude + '">\n';
          data += '\t<time>' + row.date + '</time>\n';
          data += ((row.altitude) && (row.altitude !== 'null'))?'\t<ele>' + row.altitude + '</ele>\n' : '';
          data += (row.speed>=0) ? '\t<speed>' +row.speed+ '</speed>\n' : '';
          data += (row.accuracy>0)?'\t<hdop>' + row.accuracy + '</hdop>\n' : '';
          data += (row.vertAccuracy>0)?'\t<vdop>' + row.vertAccuracy + '</vdop>\n' : '';
          data += '</trkpt>\n';
        }
        data += '</trkseg>\n';
      }
    } else {
      // new track
        data += '<trkseg>\n';
      for (var i = 0; i < track.data.length; i++) {
        var row = track.data[i];
        data += '<trkpt lat="' + row.latitude + '" lon="' + row.longitude + '">\n';
        data += '\t<time>' + row.date + '</time>\n';
        data += ((row.altitude) && (row.altitude !== 'null'))?'\t<ele>' + row.altitude + '</ele>\n' : '';
        data += (row.speed>=0) ? '\t<speed>' +row.speed+ '</speed>\n' : '';
        data += (row.accuracy>0)?'\t<hdop>' + row.accuracy + '</hdop>\n' : '';
        data += (row.vertAccuracy>0)?'\t<vdop>' + row.vertAccuracy + '</vdop>\n' : '';
        data += '</trkpt>\n';
      }
        data += '</trkseg>\n';
    }
    data += '</trk>\n';
    data += '</gpx>\n';
    // console.log('export done', data);
    return data;
  };

  return {
    load: load,
    create: create
    // verify: verify
  };



}();
