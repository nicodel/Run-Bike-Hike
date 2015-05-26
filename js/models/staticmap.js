/* jshint strict: true, bitwise: false */
/* exported StaticMap */

var StaticMap = function() {
  'use strict';

  var getMap = function(coordinates, dimensions) {
    var flat_coordinates = [];
    var i, j, point, minLat, maxLat, minLon, maxLon;
    var nb_points = 0;
    for (j = 0; j < coordinates.data.length; j++){
      for (i = 0; i < coordinates.data[j].length; i++) {
        point = {
          lat: coordinates.data[j][i].latitude / 1,
          lon: coordinates.data[j][i].longitude / 1
        };
        flat_coordinates.push(point);
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
        nb_points++;
      }
    }
    var center_point = __getCentralPoint(flat_coordinates);
    var zoom = __getZoomLevel(
        {
          ne: {
            lat: minLat,
            lon: minLon
          }, ws: {
            lat: maxLat,
            lon: maxLon
          }
        },
        {
          height: 320,
          width: 320
        }
    );
    var latlonzoom = '/' + center_point.lat + ',' + center_point.lon + ',' + zoom;

    var polyline ='path-5+f44+f44(' + __encodePolyline(flat_coordinates) + ')';

    var base_url = 'http://api.tiles.mapbox.com/v4';
    var project = '/nicodel.f5f50fd7';
    var token = 'pk.eyJ1Ijoibmljb2RlbCIsImEiOiI3MzkyZDRjMTcyNTMwNDdmYzI3YjkwNjYyMzU2NTQxMCJ9.mfE8TMuIfqtdkeNzcXVXoQ';


    var url = base_url + project + polyline + latlonzoom;
    url += '/' + dimensions.width + 'x' + dimensions.height + '.png';
    url += '?access_token=' + token;
    console.log('url', url);

  };

  var __getCentralPoint = function(coords) {
    var x = 0;
    var y = 0;
    var z = 0;
    var point, lat, lon;
    var total = coords.length;
    if (total === 1) {
      return coords;
    }
    for (var i = 0; i < total; i++) {
      point = coords[i];
      lat = point.lat * Math.PI / 180;
      lon = point.lon * Math.PI / 180;
      x = x + Math.cos(lat) * Math.cos(lon);
      y = y + Math.sin(lat) * Math.sin(lon);
      z = z + Math.sin(lat);
    }
    x = x / total;
    y = y / total;
    z = z / total;
    var square_root = Math.sqrt(x * x + y * y);
    var center = {
      lat: Math.atan2(z, square_root) * 180 / Math.PI,
      lon: Math.atan2(y, z) * 180 / Math.PI
    };
    return center;
  };

  var __getBounces = function(coordinates) {};

  var __getNorthEast = function() {};

  var __getSouthWest = function() {};

  var __getZoomLevel = function(bounds, mapDim) {
    var WORLD_DIM = {
      height: 256,
      width: 256
    };
    var ZOOM_MAX = 21;

    function latRad(lat) {
      var sin = Math.sin(lat * Math.PI / 180);
      var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
      return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
      return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    var ne = bounds.ne;
    var sw = bounds.sw;

    var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

    var lngDiff = ne.lon() - sw.lon();
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
    var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
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
    var r;
    if (coordinates.length > max_points) {
      r = parseInt(nb_points / max_points, 10);
      if (r * nb_points > max_points) {
        r++;
      } else {
        r = 1;
      }
    }
    console.log('range', r);
    for (var i = 1; i < 50 /*coordinates.length*/; i = i + r) {
      var a = coordinates[i], b = coordinates[i - 1];
      output += __encode(a.lat - b.lat, factor);
      output += __encode(a.lon - b.lon, factor);
      console.log('coordinates', coordinates);
    }
    console.log('output', output);
    return output;
  };


  return {
    getMap: getMap
  };

}();
