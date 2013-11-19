//   Geolocation.init();
// require(["controller"], function(Controller){

var RunBikeHike = function() {
	Controller.init();
    // if (Config.SCREEN_KEEP_ALIVE) {
      var lock = window.navigator.requestWakeLock('screen');
      /* Unlock the screen */
      window.addEventListener('unload', function () {
        lock.unlock();
      })
    // };

  /******************
   * EVENT LISTENER *
  *******************/

  /* Home View Tracks button */
  document.querySelector("#btn-tracks").addEventListener ("click", function () {
    Controller.displayTracks();
    document.querySelector("#tracksView").className = "current";
    document.querySelector("#homeView").className = "left";
  })
  /* Home View Settings button */
  document.querySelector("#btn-settings").addEventListener ("click", function () {
    document.querySelector("#settingsView").className = "current skin-organic settings";
    document.querySelector("#homeView").className = "left";
  })
  /* Home View Start tracking button */
  document.querySelector("#btn-start").addEventListener ("click", function () {
    Controller.startWatch();
    document.querySelector("#infosView").className = "current";
    document.querySelector("#homeView").className = "left";
  })
  /* Infos View Stop button */
  document.querySelector("#btn-stop").addEventListener ("click", function () {
      document.querySelector("#infosView").className = "fade-out";
      document.querySelector("#stopTrackingConfirmation").className = "fade-in";
  })
  /* Stop tracking Confirm button */
  document.querySelector("#btn-confirm-stop").addEventListener ("click", function () {
      document.querySelector("#homeView").className = "fade-in";
      document.querySelector("#stopTrackingConfirmation").className = "fade-out";
      Controller.stopWatch();
  })
  /* Stop tracking Cancel button */
  document.querySelector("#btn-cancel-stop").addEventListener ("click", function () {
      document.querySelector("#infosView").className = "fade-in";
      document.querySelector("#stopTrackingConfirmation").className = "fade-out";
  })
  /* Settings View Back button */
  document.querySelector("#btn-settings-back").addEventListener ("click", function () {
    document.querySelector("#settingsView").className = "right";
    document.querySelector("#homeView").className = "current";
  })
  /* Track View Back button */
  document.querySelector("#btn-track-back").addEventListener ("click", function () {
    document.querySelector("#trackView").className = "right";
    document.querySelector("#tracksView").className = "current";
  })
  /* Tracks View Back button */
  document.querySelector("#btn-tracks-back").addEventListener ("click", function () {
    document.querySelector("#tracksView").className = "right";
    document.querySelector("#homeView").className = "current";
  })
  /* TEST TRACK LINK */
  // document.querySelector("#test-track").addEventListener("click", function(e){
  //   document.querySelector("#trackView").className = "current";
  //   document.querySelector("#tracksView").className = "left";
  // })

  document.querySelector("#btn-reset").addEventListener("click", function(e){
    console.log("DB reset");
    DB.reset_app();
  })

}();
// });