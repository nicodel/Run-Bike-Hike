var InfosView = function() {

  /* EVENTS LISTENER  */
  /*
  * Stop button
  */
  document.querySelector("#btn-stop").addEventListener ("click", function () {
      document.querySelector("#infosView").className = "fade-out";
      document.querySelector("#stopTrackingConfirmation").className = "fade-in";
  });


}();