// document.addEventListener('DOMComponentsLoaded', function(){
  "use strict;"
  var map = new OpenLayers.Map({
    div: "map",
    layers: [
      new OpenLayers.Layer.OSM("Simple OSM Map")
    ],
    vector: [
       new OpenLayers.Layer.Vector('vector')
    ]/*,
    center: [0, 0],
    zoom: 3*/
  });

  // map.addControl(new OpenLayers.Control.LayerSwitcher());

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

  // var deck = document.getElementById("views");
  // deck.showCard(0);
  test.geolocation.watchPosition(__GeoSuccess, __GeoFailure);

// });