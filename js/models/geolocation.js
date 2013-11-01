var Geolocation = function() {
  var watchID;

  function init() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
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

  function _errorWatch(inPosition) {}


  return {
    init: init,
    startWatch: startWatch,
    stopWatch: stopWatch
  };
}();