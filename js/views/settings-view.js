var SettingsView = function() {

  /* EVENTS LISTENER  */
  /*
  * Back button
  */
  document.querySelector("#btn-settings-back").addEventListener ("click", function () {
    document.querySelector("#homeView").className = "current";
    document.querySelector("[data-position='current']").className = "right";
  });


}();