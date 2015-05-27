/* jshint strict: true, bitwise: false */
/* exported StaticMap */

var StaticMap = function() {
  'use strict';

  var getMap = function(track, callback) {
    var SCREEN_WIDTH = parseInt(window.innerWidth, 10);
    var MAP = {
      width: SCREEN_WIDTH - 10,
      height: parseInt((SCREEN_WIDTH - 10) * 3 / 2, 10)
    };
    var WORLD_DIM = {
      height: 256,
      width: 256
    };
    var ZOOM_MAX = 21;
    var flat_coordinates = [];
    var i, j, point, minLat, maxLat, minLon, maxLon, lat, lon;
    var nb_points = 0;
    var x = 0;
    var y = 0;
    var z = 0;
    for (j = 0; j < track.data.length; j++){
      for (i = 0; i < track.data[j].length; i++) {
        point = {
          lat: track.data[j][i].latitude / 1,
          lon: track.data[j][i].longitude / 1
        };
        /*
         * populate a flat list of coordinates (regardless segments of track)
         * in order to encode them into a polyline
         */
        flat_coordinates.push(point);
        /*
         * identify the bounds coordinates (North-East & South-West)
         */
        if (minLat === undefined || minLat > point.lat) {
          minLat = point.lat;
        }
        if (maxLat === undefined || maxLat < point.lat) {
          maxLat = point.lat;
        }
        if (minLon === undefined || minLon > point.lon) {
          minLon = point.lon;
        }
        if (maxLon === undefined || maxLon < point.lon) {
          maxLon = point.lon;
        }
        /*
         * every point calculation to get the centre point
         */
        lat = point.lat * Math.PI / 180;
        lon = point.lon * Math.PI / 180;
        x = x + Math.cos(lat) * Math.cos(lon);
        y = y + Math.sin(lat) * Math.sin(lon);
        z = z + Math.sin(lat);
        nb_points++;
      }
    }
    /*
     * final calculation for centre point
     */
    x = x / nb_points;
    y = y / nb_points;
    z = z / nb_points;
    var square_root = Math.sqrt(x * x + y * y);
    var center_point = {
      lat: Math.atan2(z, square_root) * 180 / Math.PI,
      lon: Math.atan2(y, z) * 180 / Math.PI
    };

    /*
     * calculate zoom level needed for the map to display path correctly
     */
    var ne = {lat: maxLat, lon: maxLon};
    var sw = {lat: minLat, lon: minLon};
    //var mapDim = {height: 320, width: 320};
    var latFraction = ((__latRad(ne.lat) - __latRad(sw.lat)) / Math.PI) / 1;
    var lngDiff = ne.lon - sw.lon;
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;
    var latZoom = __zoom(MAP.height, WORLD_DIM.height, latFraction);
    var lngZoom = __zoom(MAP.width, WORLD_DIM.width, lngFraction);
    var zoom = Math.min(latZoom, lngZoom, ZOOM_MAX);

    /*
     * build the final url
     */
    var base_url = 'http://api.tiles.mapbox.com/v4';
    var project_id = '/nicodel.f5f50fd7';
    var token = 'pk.eyJ1Ijoibmljb2RlbCIsImEiOiI3MzkyZDRjMTcyNTMwNDdmYzI3YjkwNjYyMzU2NTQxMCJ9.mfE8TMuIfqtdkeNzcXVXoQ';  // public
    // var token = 'sk.eyJ1Ijoibmljb2RlbCIsImEiOiIxZWEzZTQzZmM4MzU2MjZhODRjOGFhNDRlZWJmY2ZkNyJ9.ITxI3czQD8FB43-7iy-qLQ';     // secret
    var url = base_url + project_id;
    url += '/path-5+f44+f44(' + __encodePolyline(flat_coordinates) + ')';
    url += '/' + center_point.lon + ',' + center_point.lat + ',' + zoom;
    url += '/' + MAP.width + 'x' + MAP.height + '.png';
    url += '?access_token=' + token;
    console.log('url', url);

    // Following based on @robertnyman article on hacks.mozilla.org https://hacks.mozilla.org/2012/02/storing-images-and-files-in-indexeddb/
    var xhr = new XMLHttpRequest(), blob;
    xhr.open('GET', url, true);
    xhr.responseType = "blob";
    xhr.addEventListener("load", function() {
      // console.log("xhr", xhr);
      if (xhr.status === 200) {
        blob = xhr.response;
/*         var URL = window.URL || window.webkitURL;
        var imgURL = URL.createObjectURL(blob);
        document.getElementById("map-img").src = imgURL; */
        track.map = blob;
        callback(track);
      } else if (xhr.status === 404) {
        console.log('404', xhr.message);
      } else if (xhr.status === 401) {
        console.log('401', xhr.statusText);
      }
      /*
       * TODO manage the other kinds of response code
       */
    }, false);
    xhr.send();

  };

  var __latRad = function(lat) {
    var sin = Math.sin(lat * Math.PI / 180);
    var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
  };

  var __zoom = function(mapPx, worldPx,  fraction) {
    var LN2 =  Math.LN2;
    var LOG = Math.log(mapPx / worldPx / fraction);
    var INTER = LOG / LN2;
    var RESULT = Math.floor(INTER);
    // return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    return RESULT;
  };

  var __encode = function(coordinate, factor) {
    coordinate = Math.round(coordinate * factor);
    coordinate <<= 1;
    if (coordinate < 0) {
      coordinate = ~coordinate;
    }
    var output = '';
    while (coordinate >= 0x20) {
      output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
      coordinate >>= 5;
    }
    output += String.fromCharCode(coordinate + 63);
    return output;
  };

  var __encodePolyline = function(coordinates, precision) {
    if (!coordinates.length) {
      return '';
    }
    var factor = Math.pow(10, precision || 5),
      output = __encode(coordinates[0].lat, factor) + __encode(coordinates[0].lon, factor);
    var nb_points = coordinates.length;
    var max_points = 50;
    var gap = 1;
    if (coordinates.length > max_points) {
      gap = parseInt(nb_points / max_points, 10);
      if (gap * nb_points > max_points) {
        gap++;
      }
    }
    console.log('gap', gap);
    var previous = 0;
    for (var i = 1; i < coordinates.length; i = i + gap) {
      var a = coordinates[i];
      var b = coordinates[previous];
      output += __encode(a.lat - b.lat, factor);
      output += __encode(a.lon - b.lon, factor);
      previous = i;
    }
    console.log('output', output);
    return output;
  };


  return {
    getMap: getMap
  };

}();
