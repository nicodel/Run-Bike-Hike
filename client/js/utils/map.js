/* jshint bitwise: false */
/* globals L */
/* exported utils */
'use strict';

var utils = utils || {};

utils.Map = function() {
  var map;

  var map_options = {
    zoomControl: false
  };
  var polyline_options = {
    color   : 'blue',
    weight  : 4
  };
  var marker_options = {
    clickable : false,
    icon      : new L.Icon({
      iconUrl       : './img/marker-icon.png',
      iconSize      : [25, 41],
      iconAnchor    : [10, 41],
      shadowUrl     : './img/marker-shadow.png',
      shadowSize    : [41, 41],
      shadowAnchor  : [10, 41]
    })
  };

  var interval_marker = {
    clickable : false,
    icon      : new L.Icon({
      iconUrl       : './img/marker-icon.png',
      iconSize      : [18, 34],
      iconAnchor    : [5, 34],
      shadowUrl     : './img/marker-shadow.png',
      shadowSize    : [34, 34],
      shadowAnchor  : [5, 41]
    })
  };

  function initialize(element) {
    if(map !== undefined) {
      removeMap();
    }
    // console.log('element', document.getElementById(element));
    map = L.map(element, map_options);
    map.on('load', function() {
      // console.log('map loaded', this);
      // TODO hide spinner 'cause map is up
    });
  }

  function getMap(track) {
    // console.log('getting map for', track);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '<a href="http://www.osm.org">OpenStreetMap</a>',
    }).addTo(map);

    var layers = new L.FeatureGroup();
    var pt, point, seg, segment, len, coordinates, polyline, marker;
    for (seg = 0; seg < track.length; seg++){
      segment = track[seg];
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
        } else if (segment[pt].interval) {
          marker = new L.Marker(point, interval_marker);
          layers.addLayer(marker);
        }
        coordinates.push(point);
      }
      polyline = new L.polyline(coordinates, polyline_options);
      layers.addLayer(polyline);
    }
    map.fitBounds(layers.getBounds());

    layers.addTo(map);
  }

  function removeMap() {
    map.remove();
    // console.log('new map', map);
  }

  return {
    initialize  : initialize,
    getMap      : getMap,
    removeMap   : removeMap
  };
}();
