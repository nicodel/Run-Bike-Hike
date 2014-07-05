"use strict;"
var InfosView = function() {

  var updateInfos = function(inPosition, inDistance) {
    // console.log("showing: ", inDistance);
    // updating distance using Settings choosen unit
    document.getElementById("infos-dist").innerHTML = Config.userDistance(inDistance);
    // updating speed using Settings choosen unit
    document.getElementById("infos-speed").innerHTML = Config.userSpeed(inPosition.coords.speed);
    // updating altitude using Settings choosen unit
    document.getElementById("infos-alt").innerHTML = Config.userSmallDistance(inPosition.coords.altitude);
    // updating accuracy using settings units
    document.getElementById("infos-acc").innerHTML = "&#177;" + Config.userSmallDistance(inPosition.coords.accuracy);
    // checking accuracy and display appropriate GPS status
    if (inPosition.coords.accuracy > 30) {
      document.getElementById("infos-acc").className = "align-right bold bad-signal";
    } else {
      document.getElementById("infos-acc").className = "align-right bold";
    }
    // update compass direction
    __displayCompass(inPosition.coords);
  }

  var __displayCompass = function(event) {

    compass = document.getElementById("infos-compass");
    // console.log("heading:", event.heading);
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
    updateInfos: updateInfos
  }

}();
// });