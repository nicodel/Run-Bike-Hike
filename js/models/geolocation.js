// var Geolocation = function() {
navigator.geolocation = test.geolocation;

define(["controller"], function(Controller){
  var watchID;

  function init() {
    if (navigator.geolocation) {
      // navigator.geolocation.getCurrentPosition(
      test.geolocation.getCurrentPosition(
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
    watchId = navigator.geolocation.watchPosition(_successWatch, _errorWatch);
  }

  function stopWatch() {};

  function _successWatch(inPosition) {
    if (!inPosition.coords || !inPosition.coords.latitude || !inPosition.coords.longitude) {
      return;
    };
  }

  function _errorWatch(inError) {}

  return {
    init: init,
    startWatch: startWatch,
    stopWatch: stopWatch
  };
});
// }();