var SettingsView = function() {

  /* EVENTS LISTENER  */
  /*
  * Back button
  */
  document.querySelector("#btn-settings-back").addEventListener ("click", function () {
    document.querySelector("#settingsView").className = "right";
    document.querySelector("[data-position='current']").className = "current";
  });


}();