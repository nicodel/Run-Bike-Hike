var TrackView = function() {


  /* EVENTS LISTENER  */
  /*
  * Back button
  */
  document.querySelector("#btn-track-back").addEventListener ("click", function () {
    document.querySelector("#trackView").className = "right";
    document.querySelector("#tracksView").className = "current";
  });


}();