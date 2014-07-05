  "use strict;"

var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.MapQuest({layer: 'sat'})
    })
  ],
  view: new ol.View({
    center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
    zoom: 4
  })
});

var __GeoSuccess = function(inPosition) {
  // console.log("inPosition", inPosition);
  map.setCenter(
    // latitude:"7.735083", longitude:"-80.250771"
    new OpenLayers.LonLat(
      inPosition.coords.longitude,
      inPosition.coords.latitude
    ).transform(
        new OpenLayers.Projection("EPSG:4326"),
        map.getProjectionObject()
    ),
    12,
    true
  );
};

var __GeoFailure = function(inError, inPosition, InI) {
  console.log("Failed rereiving position", inError);
  console.log("inPosition", inPosition);
  console.log("InI", InI);
};

// test.geolocation.watchPosition(__GeoSuccess, __GeoFailure);

