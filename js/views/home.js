var HomeView = function(){

  function hideSpinner(){
    document.getElementById("message-area").removeChild(document.getElementById("spinner"));
  }

  function updateInfos(inPosition){
    document.getElementById("upd-acc").innerHTML = userSmallDistance(inPosition.coords.accuracy);
    if (inPosition.coords.accuracy > 30) {
      document.getElementById("upd-acc").className = "align-right strong bad-signal";
      document.getElementById("gps-status").setAttribute("src", "img/geolocation_red.png");
    } else {
      document.getElementById("upd-acc").className = "align-right strong";
      document.getElementById("gps-status").setAttribute("src", "img/geolocation_green.png");
    }
    document.getElementById("upd-lat").innerHTML = userLatitude(inPosition.coords.latitude);
    document.getElementById("upd-lon").innerHTML = userLongitude(inPosition.coords.longitude);
    document.getElementById("upd-alt").innerHTML = userSmallDistance(inPosition.coords.altitude);
    // document.getElementById("upd-speed").innerHTML = userVelocity(inPosition.coords.speed);
    // document.getElementById("upd-dist").innerHTML = user_distance(inDistance);
      var year = new Date(inPosition.timestamp).getFullYear();
      var month = new Date(inPosition.timestamp).getMonth();
      var day = new Date(inPosition.timestamp).getDate();
    document.getElementById("upd-date").innerHTML = day+"/"+month+"/"+year+" - "+ new Date(inPosition.timestamp).toLocaleTimeString();
  }

  function displayError(inError){
    document.querySelector("#home").className = "current";
    document.querySelector("[data-position='current']").className = "left";
    document.getElementById('msg').innerHTML = inError;
  }




  /* EVENTS LISTENER  */
  /*
  * Tracks button
  */
  document.querySelector("#btn-tracks").addEventListener ("click", function () {
    document.querySelector("#tracks").className = "current";
    document.querySelector("[data-position='current']").className = "left";
    DB.get_tracks();
    // for (var i = tracksLst.length - 1; i >= 0; i--) {
    //   ui.buildTracks(tracksLst[i]);
    // }
  });
  /*
  * Settings button
  */
  document.querySelector("#btn-settings").addEventListener ("click", function () {
    document.querySelector("#settings").className = "current";
    document.querySelector("[data-position='current']").className = "left";
  });
  /*
  * Start tracking button
  */
  document.querySelector("#btn-start").addEventListener ("click", function () {
    Controller.startWatch();
    document.querySelector("#home").className = "fade-out";
    document.querySelector("#tracking").className = "fade-in";
  });

  return {
    hideSpinner: hideSpinner,
    updateInfos: updateInfos
  };
}();