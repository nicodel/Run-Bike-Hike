//   Geolocation.init();
// require(["controller"], function(Controller){

var RunBikeHike = function() {
	Controller.init();
    if (Config.SCREEN_KEEP_ALIVE) {
      var lock = window.navigator.requestWakeLock('screen');
      /* Unlock the screen */
      window.addEventListener('unload', function () {
        lock.unlock();
      })
    };

  /******************
   * EVENT LISTENER *
  *******************/

  /*----------------- Home View -----------------*/
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

  /*----------------- Infos View -----------------*/
  /* Infos View Stop button */
  document.querySelector("#btn-stop").addEventListener ("click", function () {
      document.querySelector("#infosView").className = "fade-out";
      document.querySelector("#stopTrackingConfirmation").className = "fade-in";
  })
  
  /*-------- Stop tracking confirmation ------------*/
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

  /*----------------- Settings View -----------------*/
  /* Settings View Back button */
  document.querySelector("#btn-settings-back").addEventListener ("click", function () {
    document.querySelector("#settingsView").className = "right";
    document.querySelector("#homeView").className = "current";
  })

  /*----------------- Tracks View -----------------*/
  /* Tracks View Back button */
  document.querySelector("#btn-tracks-back").addEventListener ("click", function () {
    document.querySelector("#tracksView").className = "right";
    document.querySelector("#homeView").className = "current";
  })

  /*----------------- Track Detail View -----------------*/
  /* Track View Back button */
  document.querySelector("#btn-track-back").addEventListener ("click", function () {
    document.querySelector("#trackView").className = "right";
    document.querySelector("#tracksView").className = "current";
  })
  /* Track View Delete button */
  document.querySelector("#btn-delete").addEventListener ("click", function() {
      document.querySelector("#trackView").className = "fade-out";
      document.querySelector("#deleteTrackConfirmation").className = "fade-in";
  })
  /* Track View Share button */
  document.querySelector("#btn-share").addEventListener ("click", function() {
      document.querySelector("#trackView").className = "fade-out";
      document.querySelector("#ShareMenu").className = "fade-in";
  })
  
  /* Track View Edit button */
  document.querySelector("#btn-edit").addEventListener ("click", function() {
      document.querySelector("#trackView").className = "fade-out";
      document.querySelector("#EditView").className = "fade-in";
  })

  /*----------------- Track Delete Confirmation -----------------*/
  /* Delete Track Cancel button */
  document.querySelector("#btn-cancel-delete").addEventListener ("click", function() {
      document.querySelector("#trackView").className = "fade-in";
      document.querySelector("#deleteTrackConfirmation").className = "fade-out";
  })

  /* Delete Track Confirm button */
  document.querySelector("#btn-confirm-delete").addEventListener ("click", function() {
      document.querySelector("#trackView").className = "fade-in";
      document.querySelector("#deleteTrackConfirmation").className = "fade-out";
  })

  /*----------------- Track Edit View -----------------*/
  /* Delete Track Cancel button */
  document.querySelector("#btn-cancel-edit").addEventListener ("click", function() {
      document.querySelector("#trackView").className = "fade-in";
      document.querySelector("#EditView").className = "fade-out";
  })

  /* Delete Track Confirm button */
  document.querySelector("#btn-confirm-edit").addEventListener ("click", function() {
      document.querySelector("#trackView").className = "fade-in";
      document.querySelector("#EditView").className = "fade-out";
  })

  /*----------------- Track Share Menu -----------------*/
  /* Share Track Cancel button */
  document.querySelector("#btn-share-cancel").addEventListener ("click", function() {
      document.querySelector("#trackView").className = "fade-in";
      document.querySelector("#ShareMenu").className = "fade-out";
  })

  /* Share Track Local button */
  document.querySelector("#btn-confirm-delete").addEventListener ("click", function() {
      document.querySelector("#trackView").className = "fade-in";
      document.querySelector("#ShareMenu").className = "fade-out";
  })

  /* Share Track Email HTML button */
  document.querySelector("#btn-share-email-html").addEventListener ("click", function() {
      document.querySelector("#trackView").className = "fade-in";
      document.querySelector("#ShareMenu").className = "fade-out";
  })

  /* Share Track Email GPX button */
  document.querySelector("#btn-share-email-gpx").addEventListener ("click", function() {
      document.querySelector("#trackView").className = "fade-in";
      document.querySelector("#ShareMenu").className = "fade-out";
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
