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
    document.querySelector("#settingsView").className = "current";
    document.querySelector("[data-position='current']").className = "left";
  });
  /*
  * Start tracking button
  */
  document.querySelector("#btn-start").addEventListener ("click", function () {
    //  Controller.startWatch();
    // document.querySelector("#homeView").className = "fade-out";
    // document.querySelector("#infosView").className = "fade-in";
    document.querySelector("#infosView").className = "current";
    document.querySelector("[data-position='current']").className = "left";
  });

  /*
  * TEST TRACK LINK
  */
  document.querySelector("#test-track").addEventListener("click", function(e){
    document.querySelector("#trackView").className = "current";
    document.querySelector("[data-position='current']").className = "left";
  });


}();



