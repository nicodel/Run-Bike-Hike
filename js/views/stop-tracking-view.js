var StopTrackingView = function() {

  /* EVENTS LISTENER  */
  /*
  * Cancel button
  */
  document.querySelector("#btn-cancel-stop").addEventListener ("click", function () {
      document.querySelector("#infosView").className = "fade-in";
      document.querySelector("#stopTrackingConfirmation").className = "fade-out";
  });
  /*
  * Confirm button
  */
  document.querySelector("#btn-confirm-stop").addEventListener ("click", function () {
      // document.querySelector("#homeView").className = "fade-in";
      // document.querySelector("#stopTrackingConfirmation").className = "fade-out";
      
  });

}();