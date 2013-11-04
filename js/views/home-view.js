// var HomeView = function() {
define(["controller", "models/config"], function(Controller, Config) {

  function _hideSpinner(){
    document.getElementById("message-area").removeChild(document.getElementById("spinner"));
  }

  function updateInfos(inPosition){
    if (document.getElementById("spinner")) {
      _hideSpinner();
    };
    document.getElementById("home-acc").innerHTML = Config.userSmallDistance(inPosition.coords.accuracy);
    if (inPosition.coords.accuracy > 30) {
      document.getElementById("home-acc").className = "align-right bold bad-signal";
      document.getElementById("gps-status").setAttribute("src", "img/gps_red.png");
    } else {
      document.getElementById("home-acc").className = "align-right bold";
      document.getElementById("gps-status").setAttribute("src", "img/gps_green.png");
    }
    document.getElementById("home-lat").innerHTML = Config.userLatitude(inPosition.coords.latitude);
    document.getElementById("home-lon").innerHTML = Config.userLongitude(inPosition.coords.longitude);
    document.getElementById("home-alt").innerHTML = Config.userSmallDistance(inPosition.coords.altitude);
    // document.getElementById("upd-speed").innerHTML = userVelocity(inPosition.coords.speed);
    // document.getElementById("upd-dist").innerHTML = user_distance(inDistance);
      // var year = new Date(inPosition.timestamp).getFullYear();
      // var month = new Date(inPosition.timestamp).getMonth();
      // var day = new Date(inPosition.timestamp).getDate();
    // document.getElementById("upd-date").innerHTML = day+"/"+month+"/"+year+" - "+ new Date(inPosition.timestamp).toLocaleTimeString();
    document.getElementById('msg').innerHTML = "";
  }

  function displayError(inError){
    console.log("error:", inError)
    document.getElementById('msg').innerHTML = inError;
  }



  /* EVENTS LISTENER  */
  /*
  * Tracks button
  */
  document.querySelector("#btn-tracks").addEventListener ("click", function () {
    document.querySelector("#tracksView").className = "current";
    document.querySelector("#homeView").className = "left";
  })
  /*
  * Settings button
  */
  document.querySelector("#btn-settings").addEventListener ("click", function () {
    document.querySelector("#settingsView").className = "current skin-organic settings";
    document.querySelector("#homeView").className = "left";
  })
  /*
  * Start tracking button
  */
  document.querySelector("#btn-start").addEventListener ("click", function () {
    //  Controller.startWatch();
    // document.querySelector("#homeView").className = "fade-out";
    // document.querySelector("#infosView").className = "fade-in";
    document.querySelector("#infosView").className = "current";
    document.querySelector("#homeView").className = "left";
  })

  return {
    // hideSpinner: hideSpinner,
    updateInfos: updateInfos,
    displayError: displayError
  };

});
// }();



