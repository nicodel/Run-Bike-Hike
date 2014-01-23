// define(["models/config"], function(Config) {
var HomeView = function() {

  function __hideSpinner(){
    document.getElementById("message-area").removeChild(document.getElementById("spinner"));
  }

  function updateInfos(inPosition){
    // hide spinner
    if (document.getElementById("spinner")) {
      __hideSpinner();
    };
    // display accuracy using settings unit
    document.getElementById("home-acc").innerHTML = "&#177;" + Controller.userSmallDistance(inPosition.coords.accuracy);
    // checking accuracy and display appropriate GPS status
    if (inPosition.coords.accuracy > 30) {
      document.getElementById("home-acc").className = "align-right bold bad-signal";
      // document.getElementById("gps-status").setAttribute("src", "img/gps_red.png");
    } else {
      document.getElementById("home-acc").className = "align-right bold";
      // document.getElementById("gps-status").setAttribute("src", "img/gps_green.png");
    }
    // display latitude using Settings format
    document.getElementById("home-lat").innerHTML = Controller.userLatitude(inPosition.coords.latitude);
    // display longitude using Settings format
    document.getElementById("home-lon").innerHTML = Controller.userLongitude(inPosition.coords.longitude);
    // display altitude using Settings format
    document.getElementById("home-alt").innerHTML = Controller.userSmallDistance(inPosition.coords.altitude)/* + "(&#177;" + Config.userSmallDistance(inPosition.coords.altitudeAccuracy) + ")"*/;
    // empty message area
    document.getElementById('msg').innerHTML = "";
    //display compass
    __displayCompass(inPosition.coords);
  }

  function updateSettings(inSettings) {
    document.querySelector("#screen-keep").checked = inSettings.screen;
    document.querySelector("#language").value = inSettings.language;
    document.querySelector("#distance").value = inSettings.distance;
    document.querySelector("#speed").value = inSettings.speed;
    document.querySelector("#position").value = inSettings.position;
  }

  function displayError(inError){
    console.log("error:", inError)
    document.getElementById('msg').innerHTML = "Error: " + inError.message;
    // hide spinner
    if (document.getElementById("spinner")) {
      __hideSpinner();
    };
  }

  function __displayCompass(event) {
    
    compass = document.getElementById("home-compass");
    //~ console.log("heading:", event.heading);
    if (event.heading > 0 ){
      /** in case, when GPS is disabled (only if GSM fix is available),
       * event.heading should be -1 and event.errorCode should be 4,
       * but it isn't... So we use this strange condition that don't
       * work if we go _directly_ to north...
       */
      opacity = 1; // 0.8
      compass.src = 'img/compass.png';
      var rot = 360 - event.heading.toFixed(0);
      compass.style.transform = "rotate(" + rot + "deg)";
      // compass.style.webkitTransform = "rotate(" + rot + "deg)";
    } else {
      compass.src = 'img/compass_inactive.png';
      opacity = 1; // 0.3
    }
    compass.style.opacity = opacity;
  }

  return {
    // hideSpinner: hideSpinner,
    updateInfos: updateInfos,
    updateSettings: updateSettings,
    displayError: displayError
  };

}();
// });
