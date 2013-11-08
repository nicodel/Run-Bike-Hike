// var InfosView = function() {
define(["controller", "models/config"], function(Controller, Config) {

  function updateInfos(inPosition, inDistance) {

    // checking accuracy and display appropriate GPS status
    if (inPosition.coords.accuracy > 30) {
      document.getElementById("gps-status").setAttribute("src", "img/gps_red.png");
    } else {
      document.getElementById("gps-status").setAttribute("src", "img/gps_green.png");
    }
    // updating distance using Settings choosen unit
    document.getElementById("upd-dist").innerHTML = user_distance(inDistance);
    // updating speed using Settings choosen unit
    document.getElementById("upd-speed").innerHTML = userVelocity(inPosition.coords.speed);
    // updating altitude using Settings choosen unit
    document.getElementById("home-alt").innerHTML = Config.userSmallDistance(inPosition.coords.altitude);
    // update compass direction
    __displayCompass(inPosition.coords);
  }

  function __displayCompass(event) {
    
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

  var cent=0;
  var sec=0;
  var min = 0;
  var compte;
  function startChrono() {
    cent++;
    if (cent > 9) {cent = 0;sec++;}
    if (sec > 59) {sec = 0;min++;}

    if (sec < 10) {document.getElementById('trk-sec').innerHTML = '0' + sec;}
    else {document.getElementById('trk-sec').innerHTML = sec;}

    if (min < 10)
      {document.getElementById('trk-min').innerHTML = '0' + min;}
    else
      {document.getElementById('trk-min').innerHTML = min;}
    compte = setTimeout('start_chrono()', 100);
  }

  function stopChrono() {
    clearTimeout(compte);
    cent = 0;
    sec = 0;
    min = 0;
    // document.getElementById('dur-min').innerHTML = min;
    // document.getElementById('dur-sec').innerHTML = sec;
  }

  function backHome() {
    document.querySelector("#stopTrackingConfirmation").className = "fade-out";
    document.querySelector("#homeView").className = "fade-in";
  }

  function __stopWatch() {
    Controller.stopWatch();
  }
  /* EVENTS LISTENER  */
  /*
  * Stop button
  */
  document.querySelector("#btn-stop").addEventListener ("click", function () {
      document.querySelector("#infosView").className = "fade-out";
      document.querySelector("#stopTrackingConfirmation").className = "fade-in";
  })
  /*
  * Cancel button
  */
  document.querySelector("#btn-cancel-stop").addEventListener ("click", function () {
      document.querySelector("#infosView").className = "fade-in";
      document.querySelector("#stopTrackingConfirmation").className = "fade-out";
  })
    /*
  * Confirm button
  */
  document.querySelector("#btn-confirm-stop").addEventListener ("click", function () {
      // document.querySelector("#homeView").className = "fade-in";
      // document.querySelector("#stopTrackingConfirmation").className = "fade-out";
      __stopWatch();
      
  });

  return {
    startChrono: startChrono,
    stopChrono:stopChrono,
    updateInfos: updateInfos,
    backHome: backHome
  }

});
// }();