var TrackView = function() {


  /* EVENTS LISTENER  */
  /*
  * Back button
  */
  document.querySelector("#btn-track-back").addEventListener ("click", function () {
    document.querySelector("#trackView").className = "right";
    document.querySelector("[data-position='current']").className = "current";
  });



  /*
  * TEST TRACK LINK
  */
  document.querySelector("#test-track").addEventListener("click", function(e){
    document.querySelector("#trackView").className = "current";
    document.querySelector("[data-position='current']").className = "left";
  });


}();