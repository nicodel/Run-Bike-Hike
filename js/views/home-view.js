var HomeView = function() {

  /* EVENTS LISTENER  */
  /*
  * Tracks button
  */
  document.querySelector("#btn-tracks").addEventListener ("click", function () {
    document.querySelector("#tracksView").className = "current";
    document.querySelector("[data-position='current']").className = "left";
  });
  /*
  * Settings button
  */
  document.querySelector("#btn-settings").addEventListener ("click", function () {
    document.querySelector("#settingsview").className = "current";
    document.querySelector("[data-position='current']").className = "left";
  });
  /*
  * Start tracking button
  */
  document.querySelector("#btn-start").addEventListener ("click", function () {
    //  Controller.startWatch();
    document.querySelector("#homeView").className = "fade-out";
    document.querySelector("#infosView").className = "fade-in";
  });

}();



