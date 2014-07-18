"use strict;"
var RunBikeHike = function() {
	Controller.init();
  if (Config.SCREEN_KEEP_ALIVE) {
    var lock = window.navigator.requestWakeLock('screen');
     // Setting Event to unlock the screen
    window.addEventListener('unload', function () {
      lock.unlock();
    })
  };
  if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
      return this.slice(0, str.length) == str;
    };
  };
  if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (str){
      return this.slice(-str.length) == str;
    };
  };
}();