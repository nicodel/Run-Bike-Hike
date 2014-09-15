"use strict;"
var MapView = function() {

  var style = {
    fillColor: '#000',
    fillOpacity: 0.1,
    strokeWidth: 0
  };
  // var lock = "";
  OpenLayers.Renderer.symbol.church = [4, 0, 6, 0, 6, 4, 10, 4, 10, 6, 6, 6, 6, 14, 4, 14, 4, 6, 0, 6, 0, 4, 4, 4, 4, 0];
  OpenLayers.Renderer.symbol.rectangle = [0, 0, 4, 0, 4, 10, 0, 10, 0, 0];
  var map = new OpenLayers.Map('map');
  var layer = new OpenLayers.Layer.OSM("Simple OSM Map");
  var vector = new OpenLayers.Layer.Vector('vector');
  map.addLayers([layer, vector]);

  map.setCenter(
    new OpenLayers.LonLat(-71.147, 42.472).transform(
    new OpenLayers.Projection("EPSG:4326"),
    map.getProjectionObject()), 12);

  var pulsate = function (feature) {
    var point = feature.geometry.getCentroid(),
      bounds = feature.geometry.getBounds(),
      radius = Math.abs((bounds.right - bounds.left) / 2),
      count = 0,
      grow = 'up';

    var resize = function () {
      if (count > 16) {
        clearInterval(window.resizeInterval);
      }
      var interval = radius * 0.03;
      var ratio = interval / radius;
      switch (count) {
        case 4:
        case 12:
          grow = 'down';
          break;
        case 8:
          grow = 'up';
          break;
      }
      if (grow !== 'up') {
        ratio = -Math.abs(ratio);
      }
      feature.geometry.resize(1 + ratio, point);
      vector.drawFeature(feature);
      count++;
    };
    window.resizeInterval = window.setInterval(resize, 50, point, radius);
  };

  var geolocate = new OpenLayers.Control.Geolocate({
    bind: false,
    geolocationOptions: {
      maximumAge: 0
    }
  });
  map.addControl(geolocate);
  var firstGeolocation = true;
  geolocate.events.register("locationupdated", geolocate, function (e) {
    vector.removeAllFeatures();
    var circle = new OpenLayers.Feature.Vector(
      OpenLayers.Geometry.Polygon.createRegularPolygon(
      new OpenLayers.Geometry.Point(e.point.x, e.point.y),
      e.position.coords.accuracy / 2,
      40,
      0), {},
      style);
    vector.addFeatures([
          new OpenLayers.Feature.Vector(
        e.point, {}, {
        graphicName: 'rectangle',
        strokeColor: '#f00',
        strokeWidth: 2,
        fillOpacity: 0,
        pointRadius: 10
      }),
          circle
    ]);
    if (firstGeolocation) {
      map.zoomToExtent(vector.getDataExtent());
      pulsate(circle);
      firstGeolocation = false;
      this.bind = true;
    };

  });
  geolocate.events.register("locationfailed", this, function () {
    OpenLayers.Console.log('Location detection failed');
    alert('Location detection failed');
  });
  var onFollow = function() {
    // lock = window.navigator.requestWakeLock('screen');
    vector.removeAllFeatures();
    geolocate.deactivate();
    geolocate.watch = true;
    firstGeolocation = true;
    geolocate.activate();
  }





  var firstGeolocation = true;  

  var display = function () {

  }

  var updateMap = function(inPosition) {
    vector.removeAllFeatures();
    var point = new OpenLayers.Geometry.Point(inPosition.coords.latitude, inPosition.coords.longitude);
    console.log("point", point);
    var circle = new OpenLayers.Feature.Vector(
      OpenLayers.Geometry.Polygon.createRegularPolygon(
        // new OpenLayers.Geometry.Point(e.point.x, e.point.y),
        point,
        inPosition.coords.accuracy / 2,
        40,
        0
      ), {},
      style
    );
    vector.addFeatures([
      new OpenLayers.Feature.Vector(
        // e.point, {}, {
        point, {}, {
        graphicName: 'rectangle',
        strokeColor: '#f00',
        strokeWidth: 2,
        fillOpacity: 0,
        pointRadius: 10
      }),
          circle
    ]);
    if (firstGeolocation) {
      consolo.log("first Location");
      map.zoomToExtent(vector.getDataExtent());
      pulsate(circle);
      firstGeolocation = false;
      // this.bind = true;
    };
  }

  return {
    onFollow: onFollow,
    updateMap: updateMap,
    display: display
  }
}();