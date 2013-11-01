var TracksView = function() {

  /* EVENTS LISTENER  */
  /*
  * Back button
  */
  document.querySelector("#btn-tracks-back").addEventListener ("click", function () {
    document.querySelector("#tracksView").className = "right";
    document.querySelector("#homeView").className = "current";
  });
  

  /*
  * TEST TRACK LINK
  */
  document.querySelector("#test-track").addEventListener("click", function(e){
    document.querySelector("#trackView").className = "current";
    document.querySelector("#tracksView").className = "left";
  });


}();