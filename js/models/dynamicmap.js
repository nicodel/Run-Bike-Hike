/* jshint strict: true, bitwise: false */
/* global L, TrackView */
/* exported DynamicMap */

var DynamicMap = function() {
  'use strict';

  var map_options = {
    zoomControl: false
  };
  var polyline_options = {
    color: 'blue',
    weight: 4
  };
  var marker_options = {
    clickable: false,
    icon: new L.Icon({
      iconUrl: 'img/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      shadowUrl: 'img/marker-shadow.png',
      shadowSize: [41, 41],
      shadowAnchor: [10, 41]
    })
  };

  var map = L.map('map', map_options);
  map.on('load', function() {
    TrackView.hideSpinner();
  });

  var getMap = function(track) {

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '<a href="http://www.osm.org">OpenStreetMap</a>',
    }).addTo(map);

    var layers = new L.FeatureGroup();
    var pt, point, seg, segment, len, coordinates, polyline, marker;
    for (seg = 0; seg < track.data.length; seg++){
      segment = track.data[seg];
      coordinates = [];
      len = segment.length;
      for (pt = 0; pt < len; pt++) {
        point = new L.LatLng(
          segment[pt].latitude,
          segment[pt].longitude
        );
        if (pt === 0 || pt === len -1) {
          marker = new L.marker(point, marker_options);
          layers.addLayer(marker);
        }
        coordinates.push(point);
      }
      polyline = new L.polyline(coordinates, polyline_options);
      layers.addLayer(polyline);
    }
    map.fitBounds(layers.getBounds());

    layers.addTo(map);
  };

  var removeMap = function() {
    map.remove();
    console.log('new map', map);
    map = L.map('map', map_options);
  };

  return {
    getMap:     getMap,
    removeMap:  removeMap
  };

}();
