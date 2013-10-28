var TracksView = function() {

  /* EVENTS LISTENER  */
  /*
  * Back button
  */
  document.querySelector("#btn-tracks-back").addEventListener ("click", function () {
    document.querySelector("#homeView").className = "current";
    document.querySelector("[data-position='current']").className = "right";
  });


}();