var TracksView = function() {

  /* EVENTS LISTENER  */
  /*
  * Back button
  */
  document.querySelector("#btn-tracks-back").addEventListener ("click", function () {
    document.querySelector("#tracksView").className = "right";
    document.querySelector("[data-position='current']").className = "current";
  });


}();