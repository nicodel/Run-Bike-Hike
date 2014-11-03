"use strict"
var InfosView = function() {
/*define(["controller",
        "models/config"
  ], function(Controller, Config) {*/

  var updateInfos = function(inPosition, inDistance) {
    console.log("showing: ", inDistance);
    // updating distance using Settings choosen unit
    if (inDistance < 1000) {
      document.getElementById("infos-dist").innerHTML = Controller.userSmallDistance(inDistance);
    } else { 
      document.getElementById("infos-dist").innerHTML = Controller.userDistance(inDistance);
    };
    // updating speed using Settings choosen unit
    document.getElementById("infos-speed").innerHTML = Controller.userSpeed(inPosition.coords.speed);
    // updating altitude using Settings choosen unit
    document.getElementById("infos-alt").innerHTML = Controller.userSmallDistance(inPosition.coords.altitude);
    // updating accuracy using settings units
    document.getElementById("infos-acc").innerHTML = "&#177;" + Controller.userSmallDistance(inPosition.coords.accuracy);
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
  /*
  var cent=0;
  var sec=0;
  var min = 0;
  var compte;

  var startChrono = function() {
    cent++;
    if (cent > 9) {cent = 0;sec++;}
    if (sec > 59) {sec = 0;min++;}

    if (sec < 10) {document.getElementById('trk-sec').innerHTML = '0' + sec;}
    else {document.getElementById('trk-sec').innerHTML = sec;}

    if (min < 10)
      {document.getElementById('trk-min').innerHTML = '0' + min;}
    else
      {document.getElementById('trk-min').innerHTML = min;}
    compte = window.setTimeout(startChrono, 100);
  }

  var stopChrono = function() {
    window.clearTimeout(compte);
    cent = 0;
    sec = 0;
    min = 0;
    // document.getElementById('dur-min').innerHTML = min;
    // document.getElementById('dur-sec').innerHTML = sec;
  }*/



  return {
    /*startChrono: startChrono,
    stopChrono:stopChrono,*/
    updateInfos: updateInfos
    // backHome: backHome
  }

}();
// });
