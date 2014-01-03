//   Geolocation.init();
// require(["controller"], function(Controller){

var RunBikeHike = function() {
	Controller.init();
/*    if (Config.SCREEN_KEEP_ALIVE) {
      var lock = window.navigator.requestWakeLock('screen');
       Unlock the screen 
      window.addEventListener('unload', function () {
        lock.unlock();
      })
    };
*/
  /******************
   * EVENT LISTENER *
  *******************/

  /*----------------- Home View -----------------*/
  /* Home View Tracks button */
  document.querySelector("#btn-tracks").addEventListener ("click", function () {
    Controller.displayTracks();
    document.querySelector("#tracksView").classList.remove("move-right");
    document.querySelector("#tracksView").classList.add("move-center");
  })

  /* Home View Start tracking button */
  document.querySelector("#btn-start").addEventListener ("click", function () {
    Controller.startWatch();
    document.querySelector("#infosView").classList.remove("move-right");
    document.querySelector("#infosView").classList.add("move-center");
  })

  /*----------------- Infos View -----------------*/
  /* Infos View Stop button */
  document.querySelector("#btn-stop").addEventListener ("click", function () {
      document.getElementById("stop-form-confirm").classList.remove("hidden");
  })
  
  /*-------- Stop tracking confirmation ------------*/
  /* Stop tracking Confirm button */
  document.querySelector("#btn-confirm-stop").addEventListener ("click", function () {
      document.querySelector("#infosView").classList.remove("move-center");
    document.querySelector("#infosView").classList.add("move-right");
    document.getElementById("stop-form-confirm").classList.add("hidden");
      Controller.stopWatch();
  })
  /* Stop tracking Cancel button */
  document.querySelector("#btn-cancel-stop").addEventListener ("click", function () {
      document.getElementById("stop-form-confirm").classList.add("hidden")
  })

  /*----------------- Settings View -----------------*/
  /* Settings View Back button */
  // document.querySelector("#btn-settings-back").addEventListener ("click", function () {
  //   document.querySelector("#settingsView").className = "right";
  //   document.querySelector("#homeView").className = "current";
  // })
  /* Settings View Screen keep alive radio button */
  document.querySelector("#screen-keep").onchange = function () {
    Controller.updateSettings("screen", this.checked);
    if (this.checked) {
      var lock = window.navigator.requestWakeLock('screen');
      /* Unlock the screen */
      window.addEventListener('unload', function () {
        lock.unlock();
      })
    } else{
      window.navigator.requestWakeLock('screen').unlock();
    };
    console.log("window.navigator", window.navigator);
  }
  /* Settings View Language selection */
  document.querySelector("#language").onchange = function() {
    var dom = document.querySelector("#language");
    var id = this.selectedIndex;
    Controller.updateSettings("language", dom[id].value);
  };
  /* Settings View Distance unit selection */
  document.querySelector("#distance").onchange = function() {
    var dom = document.querySelector("#distance");
    var id = this.selectedIndex;
    Controller.updateSettings("distance", dom[id].value);
  };
  /* Settings View Speed unit selection */
  document.querySelector("#speed").onchange = function() {
    var dom = document.querySelector("#speed");
    var id = this.selectedIndex;
    Controller.updateSettings("speed", dom[id].value);
  };
  /* Settings View Position unit selection */
  document.querySelector("#position").onchange = function() {
    var dom = document.querySelector("#position");
    var id = this.selectedIndex;
    Controller.updateSettings("position", dom[id].value);
  };


  /*----------------- Tracks View -----------------*/
  /* Tracks View Back button */
  document.querySelector("#btn-tracks-back").addEventListener ("click", function () {
    document.querySelector("#tracksView").classList.remove("move-center");
    document.querySelector("#tracksView").classList.add("move-right");
  })

  /*----------------- Track Detail View -----------------*/
  /* Track View Back button */
  document.querySelector("#btn-track-back").addEventListener ("click", function () {
    document.querySelector("#trackView").classList.remove("move-center");
    document.querySelector("#trackView").classList.add("move-right");
  })
  /* Track View Delete button */
  document.querySelector("#btn-delete").addEventListener ("click", function() {
      // document.querySelector("#trackView").className = "fade-out";
      document.querySelector("#deleteTrackConfirmation").className = "fade-in";
      Controller.deleteTrack(document.getElementById("tr-name"));
  })
  /* Track View Share button */
  // document.querySelector("#btn-share").addEventListener ("click", function() {
  //     document.querySelector("#trackView").className = "fade-out";
  //     document.querySelector("#ShareMenu").className = "fade-in";
  // })
  /* Track View Edit button */
  // document.querySelector("#btn-edit").addEventListener ("click", function() {
  //     document.querySelector("#trackView").className = "fade-out";
  //     document.querySelector("#EditView").className = "fade-in";
  // })

  /*----------------- Track Delete Confirmation -----------------*/
  /* Delete Track Cancel button */
  // document.querySelector("#btn-cancel-delete").addEventListener ("click", function() {
  //     document.querySelector("#deleteTrackConfirmation").className = "fade-out";
  // })

  /* Delete Track Confirm button */
  // document.querySelector("#btn-confirm-delete").addEventListener ("click", function() {
  //     document.querySelector("#deleteTrackConfirmation").className = "fade-out";
  //     document.querySelector("#trackView").className = "right";
  //     document.querySelector("#tracksView").className = "current";
  // })

  /*----------------- Track Edit View -----------------*/
  /* Delete Track Cancel button */
  // document.querySelector("#btn-cancel-edit").addEventListener ("click", function() {
  //     document.querySelector("#trackView").className = "fade-in";
  //     document.querySelector("#EditView").className = "fade-out";
  // })

  /* Delete Track Confirm button */
  // document.querySelector("#btn-confirm-edit").addEventListener ("click", function() {
  //     document.querySelector("#trackView").className = "fade-in";
  //     document.querySelector("#EditView").className = "fade-out";
  // })

  /*----------------- Track Share Menu -----------------*/
  /* Share Track Cancel button */
  // document.querySelector("#btn-share-cancel").addEventListener ("click", function() {
  //     document.querySelector("#trackView").className = "fade-in";
  //     document.querySelector("#ShareMenu").className = "fade-out";
  // })

  /* Share Track Local button */
  // document.querySelector("#btn-confirm-delete").addEventListener ("click", function() {
  //     document.querySelector("#trackView").className = "fade-in";
  //     document.querySelector("#ShareMenu").className = "fade-out";
  // })

  /* Share Track Email HTML button */
  // document.querySelector("#btn-share-email-html").addEventListener ("click", function() {
  //     document.querySelector("#trackView").className = "fade-in";
  //     document.querySelector("#ShareMenu").className = "fade-out";
  // })

  /* Share Track Email GPX button */
  // document.querySelector("#btn-share-email-gpx").addEventListener ("click", function() {
  //     document.querySelector("#trackView").className = "fade-in";
  //     document.querySelector("#ShareMenu").className = "fade-out";
  // })

  /* TEST TRACK LINK */
  // document.querySelector("#test-track").addEventListener("click", function(e){
  //   document.querySelector("#trackView").className = "current";
  //   document.querySelector("#tracksView").className = "left";
  // })

  // document.querySelector("#btn-reset").addEventListener("click", function(e){
  //   console.log("DB reset");
  //   DB.reset_app();
  // })

}();
// });
