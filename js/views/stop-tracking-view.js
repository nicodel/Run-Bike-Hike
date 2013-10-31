var StopTrackingView = function() {

  /* EVENTS LISTENER  */
  /*
  * Cancel button
  */
  document.querySelector("#btn-cancel-stop").addEventListener ("click", function () {
      document.querySelector("#stopTrackingConfirmation").className = "fade-out";
      document.querySelector("#infosView").className = "fade-in";
  });
  /*
  * Confirm button
  */
  document.querySelector("#btn-confirm-stop").addEventListener ("click", function () {
      document.querySelector("#stopTrackingConfirmation").className = "fade-out";
      document.querySelector("#homeView").className = "fade-in";
  });

}();