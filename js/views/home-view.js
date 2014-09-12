"use strict;"
// define(["models/config"], function(Config) {
var HomeView = function() {

  function __hideSpinner(){
    document.getElementById("message-area").removeChild(document.getElementById("spinner"));
  }

  function updateInfos(inPosition, inDistance){

    document.getElementById("message").className = "behind hidden";
    // hide spinner
    // if (document.getElementById("spinner")) {
      // __hideSpinner();
    // };

    // display latitude using Settings format
    document.getElementById("home-lat").innerHTML = Config.userLatitude(inPosition.coords.latitude);
    // display longitude using Settings format
    document.getElementById("home-lon").innerHTML = Config.userLongitude(inPosition.coords.longitude);
    // display altitude using Settings format
    var a = Config.userSmallDistance(inPosition.coords.altitude);
    document.getElementById("home-alt").innerHTML = a.v;
    document.getElementById("alt-unit").innerHTML = "(" + a.u + ")";

    // display accuracy using settings unit
    var a = Config.userSmallDistance(inPosition.coords.accuracy.toFixed(0));
    // console.log("accuracy:", a);
    document.getElementById("home-acc").innerHTML = "&#177; " + a.v;
    document.getElementById("acc-unit").innerHTML =  "(" + a.u + ")";
    // checking accuracy and display appropriate GPS status
    if (inPosition.coords.accuracy > 25) {
      document.getElementById("home-acc").className = "new-line home-alt align-center text-big text-thinner bad-signal";
      // document.getElementById("acc-unit").className = "bad-signal";
      // document.getElementById("gps-status").setAttribute("src", "img/gps_red.png");
    } else {
      document.getElementById("home-acc").className = "new-line home-alt align-center text-big text-thin";
      // document.getElementById("acc-unit").className = "";
      // document.getElementById("gps-status").setAttribute("src", "img/gps_green.png");
    }
    // updating distance using Settings choosen unit
    var a = Config.userDistance(inDistance);
    document.getElementById("home-dist").innerHTML = a.v;
    document.getElementById("dist-unit").innerHTML = "(" + a.u + ")";
    // updating speed using Settings choosen unit
    var a = Config.userSpeed(inPosition.coords.speed);
    document.getElementById("home-speed").innerHTML = a.v;
    document.getElementById("speed-unit").innerHTML = "(" + a.u + ")";
    // empty message area
    document.getElementById('msg').innerHTML = "";
    //display compass
    // __displayCompass(inPosition.coords);
    if (inPosition.coords.heading > 0 ) {
      document.getElementById('home-dir').innerHTML = inPosition.coords.heading.toFixed(0);
    } else {
      document.getElementById('home-dir').innerHTML = "--";
    }
  }

  // function updateSettings(inSettings) {
  //   document.querySelector("#screen-keep").checked = inSettings.screen;
  //   document.querySelector("#language").value = inSettings.language;
  //   document.querySelector("#distance").value = inSettings.distance;
  //   document.querySelector("#speed").value = inSettings.speed;
  //   document.querySelector("#position").value = inSettings.position;
  // }

  function displayError(inError){
    // console.log("error:", inError)
    document.getElementById("home-acc").innerHTML = "??";
    document.getElementById("home-lat").innerHTML = "??";
    document.getElementById("home-lon").innerHTML = "??";
    document.getElementById("home-alt").innerHTML = "??";
    document.getElementById("home-dist").innerHTML = "??";
    document.getElementById("home-speed").innerHTML = "??";
    document.getElementById('msg').innerHTML = /*_("error-positon", {Error}); // */"Error: " + inError.message;
    // hide spinner
    if (document.getElementById("spinner")) {
      __hideSpinner();
    };
  }

  function __displayCompass(event) {
    // compass = document.getElementById("home-compass");
    //~ console.log("heading:", event.heading);
    if (event.heading > 0 ){
      /** in case, when GPS is disabled (only if GSM fix is available),
       * event.heading should be -1 and event.errorCode should be 4,
       * but it isn't... So we use this strange condition that don't
       * work if we go _directly_ to north...
       */
      // opacity = 1; // 0.8
      // compass.src = 'img/compass.png';
      var rot = 360 - event.heading.toFixed(0);
      compass.style.transform = "rotate(" + rot + "deg)";
      // compass.style.webkitTransform = "rotate(" + rot + "deg)";
      document.getElementById('home-dir').innerHTML = event.heading;
    } else {
      // compass.src = 'img/compass_inactive.png';
      // opacity = 1; // 0.3
      document.getElementById('home-dir').innerHTML = "??";
    }
    // compass.style.opacity = opacity;
  }

  return {
    // hideSpinner: hideSpinner,
    updateInfos: updateInfos,
    // updateSettings: updateSettings,
    displayError: displayError
  };

}();
// });
