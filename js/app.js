var RunBikeHike = function() {
	Controller.init();
  if (Config.SCREEN_KEEP_ALIVE) {
    var lock = window.navigator.requestWakeLock('screen');
     // Setting Event to unlock the screen 
    window.addEventListener('unload', function () {
      lock.unlock();
    })
  };
}();