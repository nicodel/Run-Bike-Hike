/* jshint browser: true, strict: true, devel: true */
/* exported HomeView */
/* global _, Config */

var HomeView = function() {
  "use strict";

  function __hideSpinner(){
    document.getElementById("message-area").removeChild(document.getElementById("spinner"));
  }

  function updateInfos(inPosition, inDistance){
    var localizedValue = {}; 
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
    localizedValue = Config.userSmallDistance(inPosition.coords.altitude);
    document.getElementById("home-alt").innerHTML = localizedValue.v;
    document.getElementById("alt-unit").innerHTML = "(" + localizedValue.u + ")";

    // display accuracy using settings unit
    localizedValue = Config.userSmallDistance(inPosition.coords.accuracy.toFixed(0));
    // console.log("accuracy:", a);
    document.getElementById("home-acc").innerHTML = "&#177; " + localizedValue.v;
    document.getElementById("acc-unit").innerHTML =  "(" + localizedValue.u + ")";
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
    localizedValue = Config.userDistance(inDistance);
    document.getElementById("home-dist").innerHTML = localizedValue.v;
    document.getElementById("dist-unit").innerHTML = "(" + localizedValue.u + ")";
    // updating speed using Settings choosen unit
    localizedValue = Config.userSpeed(inPosition.coords.speed);
    document.getElementById("home-speed").innerHTML = localizedValue.v;
    document.getElementById("speed-unit").innerHTML = "(" + localizedValue.u + ")";
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

  function displayError(inError){
    console.log("error:", inError);
    document.getElementById("home-acc").innerHTML = "??";
    document.getElementById("home-lat").innerHTML = "??";
    document.getElementById("home-lon").innerHTML = "??";
    document.getElementById("home-alt").innerHTML = "??";
    document.getElementById("home-dist").innerHTML = "??";
    document.getElementById("home-speed").innerHTML = "??";
    document.getElementById("errmsg").className = "text-big align-center";
    var message = "";
    if (inError.code === 1) {
      message = _("position-user");
    } else if (inError.code === 2) {
      message = _("position-unavailable");
    } else if (inError.code === 3) {
      message = _("position-timeout");
    } else {
      message = _("position-unknown");
    }

    // document.getElementById("errmsg").innerHTML = _("error-position", {Error:inError}); // "Error: " + inError.message;
    document.getElementById("errmsg").innerHTML = message;
    // hide spinner && message
    document.getElementById("msg").className = "hidden";
    if (document.getElementById("spinner")) {
      __hideSpinner();
    }
  }

  function displayAccuracy(inPosition) {
    var a = Config.userSmallDistance(inPosition.coords.accuracy.toFixed(0));

    document.getElementById("accmsg").innerHTML = _("accmsg", {Accuracy: a.v, Unit: a.u});
    document.getElementById("accmsg").className = "text-big align-center";
  }

/*  function __displayCompass(event) {
    // compass = document.getElementById("home-compass");
    //~ console.log("heading:", event.heading);
    if (event.heading > 0 ){
      // in case, when GPS is disabled (only if GSM fix is available),
      // event.heading should be -1 and event.errorCode should be 4,
      // but it isn't... So we use this strange condition that don't
      // work if we go _directly_ to north...
      //
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
  }*/

  return {
    // hideSpinner: hideSpinner,
    updateInfos: updateInfos,
    // updateSettings: updateSettings,
    displayError: displayError,
    displayAccuracy: displayAccuracy
  };

}();
// });
