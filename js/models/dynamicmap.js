/* jshint strict: true, bitwise: false */
/* global L */
/* exported DynamicMap */

var DynamicMap = function() {
  'use strict';
  var map = L.map('map');

  var getMap = function(track) {

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>',
    }).addTo(map);
    var layers = new L.FeatureGroup();
    var pt, point, seg, segment, coordinates, polyline;
    var polylines = [];
    for (seg = 0; seg < track.data.length; seg++){
      segment = track.data[seg];
      coordinates = [];
      for (pt = 0; pt < segment.length; pt++) {
        point = new L.LatLng(
          segment[pt].latitude,
          segment[pt].longitude
        );
        coordinates.push(point);
      }
      polyline = new L.Polyline(coordinates, {color: 'blue'});
      polylines.push(polyline);
    }
    layers.addLayer(polyline);
    map.fitBounds(layers.getBounds());

    layers.addTo(map);
    map.on('load', function(e) {
      console.log('map load', e);
    });
  };

  var removeMap = function() {
    map.remove();
    console.log('new map', map);
    map = L.map('map');
  };

  return {
    getMap:     getMap,
    removeMap:  removeMap
  };

}();
