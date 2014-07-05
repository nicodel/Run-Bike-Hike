"use strict;"
// var Geolocation = function() {
navigator.geolocation = test.geolocation;

define(["controller"], function(Controller){
  var getID
  var watchID;

  function init() {
    if (navigator.geolocation) {
      // getID = navigator.geolocation.getCurrentPosition(
      getID = test.geolocation.watchPosition(
        function(inPosition){
          Controller.locationChanged(inPosition);
          },
        function (inError){
          Controller.locationError(inError);
        }
      );
    }
  }

  function startWatch() {
    navigator.geolocation.clearWatch(getID);
    watchID = navigator.geolocation.watchPosition(_successWatch, _errorWatch);
  }

  function stopWatch() {
    navigator.geolocation.clearWatch(watchID);
  };

  function _successWatch(inPosition) {
    if (!inPosition.coords || !inPosition.coords.latitude || !inPosition.coords.longitude) {
      return;
    }
    Controller.positionChanged(inPosition);
  }

  function _errorWatch(inError) {}

  return {
    init: init,
    startWatch: startWatch,
    stopWatch: stopWatch
  };
});
// }();